/**
 * POST /api/login — 管理后台登录
 * body: { user, pass } → 成功：设置 HttpOnly 签名 Cookie（7 天），返回 { ok, user }
 */
import { parseAccounts, signSession, isLocked, recordFail, clearFails, safeEqual } from "./_lib.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  const ip = String(req.headers["x-forwarded-for"] || "local").split(",")[0].trim();
  if (isLocked(ip)) {
    res.status(429).json({ error: "尝试次数过多，请 10 分钟后再试" });
    return;
  }

  let body = {};
  try {
    body = typeof req.body === "object" && req.body ? req.body : JSON.parse(req.body || "{}");
  } catch {}

  const user = String(body.user || "").trim();
  const pass = String(body.pass || "");
  const expected = parseAccounts()[user];

  if (!expected || typeof expected !== "string" || !safeEqual(pass, expected)) {
    recordFail(ip);
    res.status(401).json({ error: "账号或密码不对" });
    return;
  }

  clearFails(ip);
  const maxAge = 7 * 86400;
  res.setHeader(
    "Set-Cookie",
    `jwsy_admin=${encodeURIComponent(signSession(user))}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=${maxAge}`
  );
  res.status(200).json({ ok: true, user });
}
