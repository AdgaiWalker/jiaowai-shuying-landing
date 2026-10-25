/**
 * 管理后台共享库（Vercel Serverless，零第三方依赖）
 *
 * 环境变量（在 Vercel 项目 Settings → Environment Variables 配置，见 docs/部署配置手册.md）：
 *   ADMIN_ACCOUNTS  管理组账号，JSON 对象：{"miaomiao":"密码1","zhouhongxu":"密码2"}
 *   ADMIN_SECRET    会话签名密钥（随机 ≥32 字符，泄露等同于后台失守，需轮换）
 *   GITHUB_TOKEN    Fine-grained PAT：仅本仓库、仅 Contents 读写权限
 *   GITHUB_REPO     形如 "AdgaiWalker/jiaowai-shuying-landing"（可选，有默认值）
 *   GITHUB_BRANCH   目标分支（可选，默认 main）
 *   STORAGE_ADAPTER 存储适配器（可选：github | local，默认 github；local 供 NAS 迁移演练）
 */
import crypto from "node:crypto";

export const REPO = process.env.GITHUB_REPO || "AdgaiWalker/jiaowai-shuying-landing";
export const BRANCH = process.env.GITHUB_BRANCH || "main";
const SECRET = process.env.ADMIN_SECRET || "";
const SESSION_DAYS = 7;

/* ═══════════════ 会话与安全 ═══════════════ */

export function parseAccounts() {
  try {
    const o = JSON.parse(process.env.ADMIN_ACCOUNTS || "{}");
    return o && typeof o === "object" && !Array.isArray(o) ? o : {};
  } catch {
    return {};
  }
}

function hmac(payload) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function signSession(user) {
  const payload = Buffer.from(JSON.stringify({ u: user, exp: Date.now() + SESSION_DAYS * 86400e3 })).toString("base64url");
  return `${payload}.${hmac(payload)}`;
}

export function verifySession(value) {
  if (!value || !SECRET || value.indexOf(".") < 0) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(hmac(payload));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.u || !data.exp || Date.now() > data.exp) return null;
    return data.u;
  } catch {
    return null;
  }
}

export function getSessionUser(req) {
  const cookie = req.headers.cookie || "";
  const m = cookie.match(/(?:^|;\s*)jwsy_admin=([^;]+)/);
  return m ? verifySession(decodeURIComponent(m[1])) : null;
}

/* ── 登录限速：同 IP 连续失败 5 次锁定 10 分钟（进程内存级，够用） ── */
const attempts = new Map();
const MAX_FAILS = 5;
const LOCK_MS = 10 * 60e3;

export function isLocked(ip) {
  const rec = attempts.get(ip);
  return !!rec && rec.until > Date.now();
}
export function recordFail(ip) {
  const rec = attempts.get(ip) || { n: 0, until: 0 };
  rec.n += 1;
  if (rec.n >= MAX_FAILS) {
    rec.until = Date.now() + LOCK_MS;
    rec.n = 0;
  }
  attempts.set(ip, rec);
}
export function clearFails(ip) {
  attempts.delete(ip);
}

export function safeEqual(a, b) {
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}

/* ═══════════════ 存储适配器（依赖倒置） ═══════════════
 * 业务层（api/content.js）只依赖本接口约定，不依赖任何具体存储实现。
 * 将来迁移"社团电脑 + 内网穿透写 NAS"时，仅需新增一个实现并切换
 * STORAGE_ADAPTER，content.js 零改动。
 *
 * @typedef {Object} StorageAdapter
 * @property {(path:string)=>Promise<Object|null>} getFileMeta      取文件元信息（含 sha，用于乐观锁），不存在返回 null
 * @property {(path:string, ref?:string)=>Promise<string|null>} getFileBase64  按版本取文件内容（base64），不存在返回 null
 * @property {(path:string, content:string, message:string, committer?:string, opts?:{base64?:boolean})=>Promise<Object>} putFile
 *                                    提交文件：UTF-8 字符串或 base64（opts.base64），409 冲突抛业务错误
 * @property {(path:string)=>Promise<Object|null>} readJsonFile    读取并解析 JSON，不存在返回 null
 * @property {(path:string, limit?:number)=>Promise<Array>} listCommits  某文件的提交历史（作者/说明/时间/sha）
 */

/* ── GitHub Contents API 实现（当前唯一实现） ── */

async function gh(path, opts = {}, retried = false) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("未配置 GITHUB_TOKEN 环境变量");
  const res = await fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    // 409 = 乐观锁冲突：远端 sha 已被别人的提交推进
    if (res.status === 409) {
      const err = new Error("刚有人保存过，请刷新页面后重试");
      err.status = 409;
      throw err;
    }
    // 5xx / 限流：延迟 1 秒重试一次（幂等的 GET 与带 sha 的 PUT 均安全）
    const retryable = res.status >= 500 || res.status === 403;
    if (retryable && !retried) {
      await new Promise((r) => setTimeout(r, 1000));
      return gh(path, opts, true);
    }
    const text = await res.text().catch(() => "");
    const err = new Error(`GitHub API ${res.status}: ${text.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

const enc = (p) => encodeURIComponent(p).replace(/%2F/g, "/");

function createGithubStorage() {
  return {
    async getFileMeta(path, ref = BRANCH) {
      try {
        return await gh(`/repos/${REPO}/contents/${enc(path)}?ref=${ref}`);
      } catch (e) {
        if (e.status === 404) return null;
        throw e;
      }
    },
    async getFileBase64(path, ref = BRANCH) {
      const meta = await this.getFileMeta(path, ref);
      return meta ? meta.content.replace(/\n/g, "") : null;
    },
    async putFile(path, content, message, committerName, opts = {}) {
      const meta = await this.getFileMeta(path);
      const body = {
        message,
        branch: BRANCH,
        content: opts.base64 ? content : Buffer.from(content, "utf8").toString("base64"),
        ...(meta ? { sha: meta.sha } : {}),
        ...(committerName ? { committer: { name: committerName, email: "admin@hhxyjwsyst.online" } } : {}),
      };
      return gh(`/repos/${REPO}/contents/${enc(path)}`, { method: "PUT", body: JSON.stringify(body) });
    },
    async readJsonFile(path) {
      const meta = await this.getFileMeta(path);
      if (!meta) return null;
      return JSON.parse(Buffer.from(meta.content.replace(/\n/g, ""), "base64").toString("utf8"));
    },
    async listCommits(path, limit = 15) {
      const commits = await gh(`/repos/${REPO}/commits?sha=${BRANCH}&path=${encodeURIComponent(path)}&per_page=${limit}`);
      return commits.map((c) => ({
        sha: c.sha,
        author: (c.committer && c.committer.login) || (c.commit && c.commit.committer && c.commit.committer.name) || "—",
        message: String((c.commit && c.commit.message) || "").split("\n")[0],
        date: c.commit && c.commit.committer && c.commit.committer.date,
      }));
    },
  };
}

/* ── 本地实现（迁移演练 / 本地调试用：直接读写仓库工作区文件） ── */
import fs from "node:fs/promises";
import path from "node:path";

function createLocalStorage() {
  const ROOT = process.cwd();
  const full = (p) => path.join(ROOT, p);
  return {
    async getFileMeta(p) {
      try {
        const st = await fs.stat(full(p));
        return { sha: String(Math.round(st.mtimeMs)), size: st.size };
      } catch {
        return null;
      }
    },
    async getFileBase64(p) {
      try {
        return (await fs.readFile(full(p))).toString("base64");
      } catch {
        return null;
      }
    },
    async putFile(p, content, _message, _committer, opts = {}) {
      await fs.mkdir(path.dirname(full(p)), { recursive: true });
      await fs.writeFile(full(p), opts.base64 ? Buffer.from(content, "base64") : content, "utf8");
      return { ok: true };
    },
    async readJsonFile(p) {
      try {
        return JSON.parse(await fs.readFile(full(p), "utf8"));
      } catch {
        return null;
      }
    },
    async listCommits() {
      return [];
    },
  };
}

const ADAPTERS = { github: createGithubStorage, local: createLocalStorage };

/** 获取存储适配器（唯一注入点：content.js 依赖本函数返回的接口，而非具体实现） */
export function getStorage() {
  const name = process.env.STORAGE_ADAPTER || "github";
  const factory = ADAPTERS[name] || createGithubStorage;
  return factory();
}
