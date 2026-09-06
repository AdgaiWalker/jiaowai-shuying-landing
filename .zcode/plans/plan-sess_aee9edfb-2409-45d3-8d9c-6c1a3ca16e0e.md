# 「焦外述影」落地页 React Bits 效果升级——精选五件套

**目标**：围绕「焦」的光学隐喻，用 5 个 React Bits 效果强化暗夜胶片气质，全部可降级、不伤性能。不引入 shader 背景（已确认）。

## 0. 安全基线
项目无 git：`git init` + 全量基线提交，之后每完成一个 section 提交一次，随时可回退。

## 1. 引入组件（shadcn CLI，TS-TW 变体）
```
pnpm dlx shadcn@latest add "@react-bits/BlurText-TS-TW" "@react-bits/GlareHover-TS-TW" "@react-bits/SpotlightCard-TS-TW" "@react-bits/ScrollStack-TS-TW" --yes
```
SplitText 已在 `src/components/SplitText.tsx`，无需再拉。拉入后逐个审计：Tailwind v4 类名兼容性、圆角归零、颜色对齐项目令牌（`ink/ink-soft/paper/accent`），不引入新依赖。

## 2. Hero（src/sections/Hero.tsx）
- **大标题「焦外述影」**：激活现有 SplitText，`tag="h1"`、`splitType="chars"`、textAlign 左对齐，4 字逐字上浮入场（电影片头字卡）。套 `useReducedMotion` 降级为静态 h1。
- **Slogan「在焦点之外，讲述光影」**：换成 BlurText，中文按 `animateBy="chars"` 逐字从失焦到合焦（字面意义的“对焦”）；加 `aria-label` 保证可访问性，reduced-motion 时渲染纯文本。

## 3. Highlights bento（src/sections/Highlights.tsx）
3 张 `bg-ink-soft` 卡片换成 SpotlightCard：光标聚光用暖白低透明（`rgba(244,244,241,0.16)` 一类），不做红光——摄影红按 PRD 只留给 CTA。右侧琥珀底 accent 格保持原样（它是网格里刻意的色彩变化格）。保持直角、`border-line` 边框不变。

## 4. 照片反光（src/sections/Activities.tsx + Works.tsx）
四季横滑条 4 张照片、作品瀑布流 9 格外包 GlareHover：暖白 glare、`borderRadius=0`、扫过时长 ~800ms，像光掠过相纸。**不破坏 Works 现有点击开 Lightbox 的交互**（GlareHover 只做 hover 视觉层）。移动端无 hover 自然无感，无害。

## 5. WhyJoin 堆叠叙事（src/sections/WhyJoin.tsx）
六条「XX，来焦述。」改为 ScrollStack 卡片堆叠滚动——这正是 PRD §7 写过未落地的计划。设计：ink-soft 直角卡、保留红字需求词 + 灰色应答的节奏、详情行不丢；标题和副标留在堆叠区外。`prefers-reduced-motion` 时回退为现有清单布局（原 markup 保留为 fallback 分支）。实现时先读组件源码，适配窗口滚动与移动端高度。

## 6. 验证
- `pnpm build` + tsc 通过；
- 起 dev server，桌面（1440）+ 移动（390）宽度截图核对五个 section；
- 模拟 reduced-motion 确认降级分支正常；
- 按交付流程对改动页面跑视觉验收（judge）；
- 收尾：确认 SplitText/gsap 从死代码转为真实使用，bundle 体积增量记录在总结里。

**不做**：shader 背景（已确认不加）、CountUp 替换（项目已有）、DecayCard/PixelTransition 等抢戏效果。