# 焦外述影 · 黑河学院摄影与影像社团官方招新落地页

<div align="center">

![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Physics](https://img.shields.io/badge/Physics-XPBD-e5484d?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)

<br />

**「在焦点之外，讲述光影」**

*专为黑河学院「焦外述影」摄影与视频综合创作社团打造的常青门户落地页。*  
*电影质感视觉 · 暗房工艺纯物理动力学交互（XPBD）· 3D 空间垂直螺旋画廊 · 移动端与微信优先*

[在线预览](https://hhxyjwsyst.online) · [BGM 试听室](http://localhost:5174/audio-preview.html) · [素材配置说明](#-素材与文案替换指南)

</div>

---

## 🌟 核心特色与交互亮点

落地页告别了千篇一律的通用模板，将**暗房暗室冲印工艺、机械相机过片、极北边境光影纪实**深度融入前端工程与物理仿真中：

### 1. 🧲 4 处原生暗房物理动力学交互 (XPBD Engine)
摒弃脱离页面的桌面浮动小挂件，在 4 个核心业务板块中就地实现了基于 **XPBD（扩展位置动力学 / Verlet 积分）** 的触感交互：

- **S3「关于我们」· 暗房晾相悬挂相纸 (`DarkroomHangingPhoto.tsx`)**
  - **物理固定**：悬挂于暗房金属铁丝与木制照片夹下方；
  - **因果链**：手势单指横划/轻拉，相纸产生带空气阻尼的单摆物理晃动；点击右上角或卡体触发 **3D 真实翻面**，露出泛黄暗房手工冲印参数与胶卷批号档案。
- **S5「硬亮点」· 重大活动 CREW PASS 记者证 (`CrewPassCard.tsx`)**
  - **物理固定**：双织带 V 形张力悬挂于金属鸡眼扣；
  - **因果链**：拖拽或横扫工牌，双挂绳产生真实的弹性张力与扭力摆动；点击「翻看背面聘书证书」触发 **3D 翻转**，展示全校先进集体荣誉证书，并可一键呼出全屏高清灯箱。
- **S7「作品区」· 35mm 机械过片分镜胶片帘 (`FilmReelStrip.tsx`)**
  - **物理固定**：嵌入 35mm 分镜暗盒与双侧标准齿孔传送导轨；
  - **因果链**：点击「过片/倒片」按钮或直接横向拨动胶片，带动手写齿孔传送带平滑位移，并带有**机械卡位回弹吸附**；点击分镜直接呼出微电影短片播放与全屏剧照。
- **S9「加入我们」· 暗房显影浸盘与潜影相纸 (`DarkroomDevPaper.tsx`)**
  - **物理固定**：浸润在 KODAK D-76 恒温显影液盘内，竹镊夹持；
  - **因果链**：在盘中滑动摇晃（Agitation）或提拉相纸，产生流体黏滞阻尼与液面水纹涟漪；**化学还原反应触发银盐潜影由浅入深显影**，浮现出高保真微信纳新群二维码。显影完成后保留原生 `<img>` 语义，完全支持微信内置长按扫码识别。

### 2. 🌀 3D 空间垂直螺旋画廊 (Infinite Spiral Gallery)
- **空间景深**：利用 3D CSS perspective 与极坐标变换，将社团优秀成片排布在垂直螺旋上升的光影展廊中；
- **自然交互**：支持自动巡展旋转、手势拖拽浏览、边缘景深失焦模糊、点击任意作品直接呼出支持手势滑动与键盘操作的全屏 Lightbox 灯箱。

### 3. 📱 移动端与微信原生生态深度优化
- **短链路转化**：首屏主 CTA、底部集中扫码区、全局吸底栏三位一体，随时直达进群；
- **手势分离保护**：所有物理组件精确判定滑动方向与阈值，不劫持移动端正常的纵向页面滚动；
- **防误触与轻量化**：移除重型物理引擎库，纯数学运算与 GPU 硬件加速合成，弱网秒开，60fps 丝滑运行。

### 4. 🎵 沉浸式背景音乐与专属试听室
- 内置 **《Snowfall》（雪落）**、**《Filaments》（光丝）**、**《Gymnopédie No. 1》** 等经过精心调优的免版税电影感纯音乐；
- 提供 75 秒平滑淡入淡出、循环无缝、体积仅 ~900KB 的 Web 专用高保真切片；
- 配备专属在线试听室 `public/audio-preview.html`，支持横向对比试听与版本切换。

---

## 📂 项目结构

```text
├── public/                     # 静态媒体与素材中心
│   ├── audio/                  # 免版权背景音乐（包含完整版与 75s Web 精剪切片）
│   ├── photos/                 # 轮播图、四季摄影展、作品大图、证书实拍
│   ├── qr/                     # 微信群码、公众号码、官方抖音码
│   ├── videos/                 # 影视组精选混剪短片 (showreel.mp4)
│   └── audio-preview.html      # BGM 专属在线试听室
├── src/
│   ├── components/             # 通用组件库
│   │   ├── xpbd/               # 🌟 XPBD 纯物理动力学交互组件库
│   │   │   ├── DarkroomHangingPhoto.tsx # S3 暗房木夹悬挂相纸
│   │   │   ├── CrewPassCard.tsx         # S5 织带悬挂 CREW PASS 记者证
│   │   │   ├── FilmReelStrip.tsx        # S7 35mm 机械过片分镜胶片帘
│   │   │   └── DarkroomDevPaper.tsx     # S9 显影浸盘与潜影相纸长按识别
│   │   ├── HeroCarousel.tsx    # 首屏电影感轮播图与音乐控制
│   │   ├── InfiniteSpiral.tsx  # 3D 垂直螺旋影像展廊
│   │   ├── Lightbox.tsx        # 全屏沉浸式照片/视频灯箱
│   │   ├── MobileCtaBar.tsx    # 移动端吸底转化栏
│   │   └── SpotlightCard.tsx   # 光影探照灯质感卡片
│   ├── config/
│   │   └── site.ts             # ⚙️ 全站配置中心（文案、素材路径、BGM 开关）
│   ├── sections/               # 落地页业务分块
│   │   ├── Hero.tsx            # S1 首屏（大片视觉 + 品牌 Slogan + 音乐）
│   │   ├── StatsStrip.tsx      # S2 事实数据带
│   │   ├── About.tsx           # S3 关于我们（暗房物理挂照）
│   │   ├── WhyJoin.tsx         # S4 为什么加入（痛点卖点堆叠）
│   │   ├── Highlights.tsx      # S5 官方履历背书（工作证物理翻转）
│   │   ├── Activities.tsx      # S6 四季外拍与活动跑马灯
│   │   ├── Works.tsx           # S7 螺旋展廊与胶片过片分镜舱
│   │   ├── Faq.tsx             # S8 入社细则平铺网格
│   │   ├── Join.tsx            # S9 加入我们（显影浸盘与二维码收口）
│   │   └── SiteFooter.tsx      # S10 页脚与版权信息
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

---

## 🛠️ 技术栈

- **框架**：[React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**：[Vite 7](https://vitejs.dev/)
- **样式方案**：[Tailwind CSS v4](https://tailwindcss.com/)
- **动效库**：[Motion](https://motion.dev/) (Framer Motion v12)
- **字体**：[@fontsource-variable/noto-serif-sc](https://fontsource.org/)（典雅衬线字质感）
- **图标**：[@phosphor-icons/react](https://phosphoricons.com/)
- **物理引擎**：纯 TypeScript 原生数学解算（Verlet Integration + Distance/Shear/Angular Constraints）

---

## 🚀 本地开发与部署

### 1. 安装依赖

推荐使用 `pnpm`：

```bash
pnpm install
```

### 2. 启动本地开发服务器

```bash
pnpm dev
```

本地服务将运行在 `http://localhost:5174/`。

### 3. 类型检查与生产构建

```bash
# 执行 TypeScript 类型校验
pnpm typecheck

# 编译打包生产资源
pnpm build
```

打包产物位于 `dist/` 目录，可直接部署至任一静态 Web 托管平台（如 Cloudflare Pages、Vercel、GitHub Pages、Nginx 服务器）。

---

## ⚙️ 素材与文案替换指南

所有文案与素材路径均收拢在 [`src/config/site.ts`](src/config/site.ts) 中，日常维护与更换素材**无需修改任何组件代码**：

### 1. 更换照片与视频
- 将新照片放入 `public/photos/`，并在 `src/config/site.ts` 中更新对应文件名；
- 将影视短片放入 `public/videos/showreel.mp4`，封面放入 `showreel-poster.jpg`。

### 2. 更新招新二维码
- 微信群二维码通常具有 7 天有效期，过期前在微信重新生成群码，将方形图片覆盖到 `public/qr/wechat-group.jpg` 即可，页面与显影盘将自动更新。

### 3. 更换背景音乐
在 `src/config/site.ts` 中修改 `heroMusic` 导出值：
```typescript
// 切换为《Snowfall》（雪落）
export const heroMusic: string | null = "/audio/snowfall.m4a";

// 切换为《Filaments》（光丝）
// export const heroMusic: string | null = "/audio/filaments.m4a";

// 禁用背景音乐
// export const heroMusic: string | null = null;
```

---

## 📄 版权与授权

- 本项目由黑河学院「焦外述影」摄影与影像社团持有。
- 音乐素材遵循 **Creative Commons (CC-BY 4.0)** 或 **Public Domain** 授权：
  - 《Snowfall》 & 《Filaments》 by [Scott Buckley](https://www.scottbuckley.com.au/)
  - 《Gymnopédie No. 1》 by Erik Satie / Kevin MacLeod
  - 《That Zen Moment》 by Kevin MacLeod ([incompetech.com](https://incompetech.com/))
- 代码开源协议：[MIT License](LICENSE)
