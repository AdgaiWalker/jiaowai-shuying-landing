/**
 * 管理后台内容接口（均需登录 Cookie）
 *
 * 业务规则：本文件只依赖 _lib.getStorage() 返回的 StorageAdapter 接口
 * （依赖倒置），不感知 GitHub / 本地文件等具体存储实现。
 *
 * GET  /api/content?what=content  → { ok, user, content:{brand,hero,gallery,endorsements,qrs} }
 * GET  /api/content?what=history  → { ok, history:[{sha,author,message,date}] }（五内容文件提交合并去重，前 20 条）
 * POST /api/content  body:
 *   { action:"save",   file, content }          保存 JSON 文件（五文件白名单，内容相同则短路）
 *   { action:"upload", path, content(base64) }  上传媒体（路径/扩展名白名单，≤2MB）
 *   { action:"revert", sha }                    五内容文件回滚到指定提交（"恢复到该版本的内容"，非 git revert）
 */
import { getSessionUser, getStorage } from "./_lib.js";

const CONTENT_FILES = {
  brand: "src/content/brand.json",
  hero: "src/content/hero.json",
  gallery: "src/content/gallery.json",
  endorsements: "src/content/endorsements.json",
  qrs: "src/content/qrs.json",
};
const CONTENT_LABEL = { brand: "品牌文案", hero: "首屏轮播", gallery: "橱窗内容", endorsements: "背书证书", qrs: "二维码" };
const MEDIA_DIRS = ["public/photos/", "public/qr/", "public/videos/", "public/audio/"];
const MEDIA_EXT = ["jpg", "jpeg", "png", "webp", "mp4", "m4a"];
const MAX_UPLOAD = 2 * 1024 * 1024;
// upload 不做幂等短路：媒体内容每次重新编码，base64 几乎必不同，且 GitHub 以 blob sha 去重；
// 覆盖同路径本身就是"换图"的预期语义。save 才需要 unchanged 短路。

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "未登录或会话已过期" });
    return;
  }
  const storage = getStorage();

  try {
    if (req.method === "GET") {
      const what = new URL(req.url, "http://localhost").searchParams.get("what");

      if (what === "content") {
        /* 五文件并行读取：串行在跨境网络下要 5×RTT，并行压到 1×RTT */
        const entries = await Promise.all(
          Object.keys(CONTENT_FILES).map(async (key) => [key, (await storage.readJsonFile(CONTENT_FILES[key])) || {}])
        );
        const content = Object.fromEntries(entries);
        res.status(200).json({ ok: true, user, content });
        return;
      }

      if (what === "history") {
        const merged = new Map();
        /* 并行 + 逐文件降级：任一文件历史拉取失败时跳过，不影响整体返回 */
        const results = await Promise.allSettled(
          Object.keys(CONTENT_FILES).map((key) => storage.listCommits(CONTENT_FILES[key]))
        );
        for (const r of results) {
          if (r.status !== "fulfilled") continue;
          for (const c of r.value) {
            if (!merged.has(c.sha)) merged.set(c.sha, { ...c, sha: c.sha.slice(0, 8) });
          }
        }
        const history = [...merged.values()].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 20);
        res.status(200).json({ ok: true, history });
        return;
      }

      res.status(400).json({ error: "未知请求" });
      return;
    }

    if (req.method === "POST") {
      let body = {};
      try {
        body = typeof req.body === "object" && req.body ? req.body : JSON.parse(req.body || "{}");
      } catch {}
      const action = String(body.action || "");

      if (action === "save") {
        const path = CONTENT_FILES[String(body.file || "")];
        if (!path) {
          res.status(400).json({ error: "未知的内容文件" });
          return;
        }
        let json;
        try {
          json = JSON.stringify(JSON.parse(String(body.content || "")));
        } catch {
          res.status(400).json({ error: "内容不是合法的 JSON" });
          return;
        }
        const current = await storage.readJsonFile(path);
        if (current && JSON.stringify(current) === json) {
          res.status(200).json({ ok: true, unchanged: true });
          return;
        }
        const label = CONTENT_LABEL[String(body.file)];
        await storage.putFile(path, json, `后台:更新${label} (by ${user})`, user);
        res.status(200).json({ ok: true });
        return;
      }

      if (action === "upload") {
        const path = String(body.path || "");
        const ext = (path.split(".").pop() || "").toLowerCase();
        /* 拒绝路径穿越（../）与反斜杠变体，再叠加前缀/扩展名白名单 */
        const okPath = !path.includes("..") && !path.includes("\\") && MEDIA_DIRS.some((d) => path.startsWith(d)) && MEDIA_EXT.includes(ext);
        if (!okPath) {
          res.status(400).json({ error: "不允许的文件路径或格式" });
          return;
        }
        const size = Buffer.from(String(body.content || ""), "base64").length;
        if (size <= 0 || size > MAX_UPLOAD) {
          res.status(400).json({ error: "文件需大于 0 且不超过 2MB" });
          return;
        }
        await storage.putFile(path, String(body.content), `后台:上传 ${path} (by ${user})`, user, { base64: true });
        res.status(200).json({ ok: true });
        return;
      }

      if (action === "revert") {
        const sha = String(body.sha || "");
        if (!/^[0-9a-f]{7,40}$/.test(sha)) {
          res.status(400).json({ error: "参数错误" });
          return;
        }
        let changed = 0;
        for (const [key, path] of Object.entries(CONTENT_FILES)) {
          const old = await storage.getFileBase64(path, sha);
          if (old === null) continue;
          const label = CONTENT_LABEL[key];
          await storage.putFile(path, old, `后台:回滚${label}到 ${sha.slice(0, 7)} (by ${user})`, user, { base64: true });
          changed += 1;
        }
        res.status(200).json({ ok: true, changed });
        return;
      }

      res.status(400).json({ error: "未知操作" });
      return;
    }

    res.status(405).json({ error: "Method Not Allowed" });
  } catch (e) {
    res.status(e.status === 409 ? 409 : 500).json({ error: e.message || "服务器错误" });
  }
}
