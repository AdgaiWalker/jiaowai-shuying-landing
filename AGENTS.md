# AGENTS.md · 焦外述影落地页

## 项目定位
黑河学院「焦外述影」摄影与影像社团的常青招新落地页。React 19 + TypeScript + Vite 7 + Tailwind CSS v4，暗夜胶片视觉主题，含纯数学 XPBD 物理交互组件与 3D 螺旋画廊。

## 命令
```bash
pnpm dev          # 本地开发，默认 http://localhost:5174/
pnpm typecheck    # tsc --noEmit
pnpm build        # Vite 生产构建，产物在 dist/
pnpm preview      # 预览构建产物
```
无 lint 脚本，无测试框架。如新增检查请直接走 `pnpm typecheck` + 视觉回归。

## 路径与别名
- `@/` → `src/`（由 `vite.config.ts` / `tsconfig.json` 统一配置）。
- `src/lib/`、`src/hooks/` **不存在**；`components.json` 里的 `@/lib/utils`、`@/components/ui` 等是遗留 shadcn 配置，**不要按这些路径新增代码**。
- 页面区块放 `src/sections/`，通用组件放 `src/components/`，纯物理组件放 `src/components/xpbd/`。
- 内容数据放 `src/content/*.json`（管理后台写入目标；字段即三方契约，改动需同步后台表单与读取层）。
- 管理后台页面在 `public/admin/index.html`（零构建单文件原生 JS，图标用 Lucide CDN，不用 Emoji）；服务端函数在 `api/`（零 npm 依赖，`api/_lib.js` 定义 StorageAdapter 接口，业务只依赖接口）。

## 内容与素材边界
- 文案、图片、视频、二维码路径统一在 `src/content/*.json`；`src/config/site.ts` 是读取层（校验 + 逐字段兜底），**不要在 site.ts 里直接写死内容常量**；修改素材**不要直接改组件**。
- 日常内容变更走 `/admin` 后台（GitHub Contents API 提交 → 自动部署），不要手工提交内容 JSON，除非走 EB-4 兜底。
- 静态资源放 `public/`：`photos/`、`videos/`、`audio/`、`qr/`。
- 微信群二维码有有效期，过期后替换 `public/qr/wechat-group.jpg` 即可。
- SEO / 分享卡在 `index.html` 维护，`site.ts` 中的 `siteUrl` 用于相关引用。

## 视觉与样式约束
- 单主题暗色，无明暗切换。主色：中性炭黑底 + 暖白文字 + 摄影红点缀。
- 全部直角（无 `rounded-*` 的默认圆角），衬线标题 + 系统黑正文。
- 主题令牌在 `src/styles/global.css` 的 `@theme` 里维护，不要另起 `tailwind.config.js`。
- 交互反馈统一走 Apple 风格按压缩放（`140ms cubic-bezier(0.16,1,0.3,1)`）。
- 动效应优先尊重 `prefers-reduced-motion`；物理组件需避免劫持纵向滚动。

## 平台兼容
- 移动端与微信内置浏览器优先；避免重型依赖，当前无任何 npm 物理引擎。
- 首屏 LCP 图在 `heroSlides` 中，顺序不能随意打乱；BGM 仅 Web 切片，75s 淡入淡出。

## 已知事项
- 构建后直接部署静态资源到 Nginx / Cloudflare Pages / Vercel 均可。
- `dist/` 已在仓库中；不要提交构建产物变更，除非用户明确要求。
