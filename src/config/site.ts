/**
 * ═══════════════════════════════════════════════════════════════
 * 素材配置中心 · 替换素材只需要改这个文件
 *
 * 使用方式：
 *  1. 把图片放进 public/ 对应目录（见 public/素材放置说明.md）；
 *  2. 把下方对应字段的 null 改成路径字符串，如 "/photos/hero.jpg"；
 *  3. 保存后页面上的「素材占位框」会自动变成真实图片。
 * ═══════════════════════════════════════════════════════════════
 */

/** 照片类素材的占位描述 */
export type PhotoSpec = {
  /** 素材路径，null = 显示占位框 */
  src: string | null;
  /** 占位框标题：这个位置叫什么 */
  title: string;
  /** 建议放什么内容 */
  hint: string;
  /** 规格建议（比例 / 最小尺寸 / 格式） */
  spec: string;
  /** 显示比例 */
  ratio: "9/16" | "2/3" | "3/4" | "4/5" | "1/1" | "4/3" | "3/2" | "16/9";
  /** 灯箱说明文字（可选，不填则显示 title + hint） */
  caption?: string;
};

/* ── 品牌文案（上线前请社长逐条确认） ─────────────────────────── */

export const site = {
  name: "焦外述影",
  school: "黑河学院",
  // slogan 已定稿（2026-09）
  slogan: "在焦点之外，讲述光影",
  eyebrow: "黑河学院 · 焦外述影",
  intro: [
    "你带着一部普通的手机来到黑河。在接下来的四年里，你的大学生活不会只是往返于宿舍、食堂与课堂之间。",
    "在焦述，你将在零下三十度的江边记录晨雾，在落叶铺满的街巷学会调整快门，在全校大型活动的现场挂上属于你的工作牌。这里没有层级与门槛，只有递到你手里的相机，和并肩创作的同伴。",
  ],
  tags: ["平面摄影", "视频短片", "后期制作", "新媒体运营", "策划布展"],
};

/* ── Hero 轮播图（3~5 张，第一张最重要：它是首屏 LCP 图） ──
 * 已接入真实素材（2026-09）：银河 / 冰河日落桥 / 金色街道 / 夜色建筑。
 * 换图时替换 public/photos/ 下的 hero-1~4.jpg 或改这里的路径。 */
export const heroSlides: string[] = [
  "/photos/hero-1.jpg",
  "/photos/hero-2.jpg",
  "/photos/hero-3.jpg",
  "/photos/hero-4.jpg",
];

/* ── 首屏背景音乐（可选）──
 * 放一首循环纯音乐到 public/audio/bgm.mp3（建议 ≤1MB），
 * 然后把 null 改成 "/audio/bgm.mp3"，首屏右下角喇叭按钮即自动生效（记住用户偏好）。 */
export const heroMusic: string | null = "/audio/bgm.mp3";

/* ── 数字带：落在你身上的事实 ── */

export const stats = [
  { value: "0元", label: "入社费用 · 无任何隐性支出" },
  { value: "综测", label: "实践记录 · 正规计入考核学分" },
  { value: "免押", label: "微单稳定器 · 开放全员借用" },
  { value: "同行", label: "零基础起步 · 前辈手把手带练" },
];

/* ── 「关于我们」配图 ───────────────────────────────────────── */

export const aboutImage: PhotoSpec = {
  src: "/photos/about-autumn-path.jpg",
  title: "关于我们配图",
  hint: "秋日小路上同行的人",
  spec: "",
  ratio: "3/2",
};

/* ── 「黑河四季」横滑条：你眼里的风景 ── */

export const seasons: { name: string; desc: string; photo: PhotoSpec }[] = [
  {
    name: "春 · 樱与新生",
    desc: "你在四月的拐角，记录新生的神情与樱花初绽。",
    photo: { src: "/photos/season-spring.jpg", title: "春", hint: "校园樱花", spec: "", ratio: "4/3" },
  },
  {
    name: "夏 · 江畔长昼",
    desc: "你在黑龙江边的漫长白昼里，拍下绿荫与奔流的江水。",
    photo: { src: "/photos/season-summer.jpg", title: "夏", hint: "绿荫小路", spec: "", ratio: "4/3" },
  },
  {
    name: "秋 · 一城黄叶",
    desc: "你在落叶铺满的十月街头，学会捕捉秋日的光斑。",
    photo: { src: "/photos/season-autumn.jpg", title: "秋", hint: "红叶蓝天", spec: "", ratio: "4/3" },
  },
  {
    name: "冬 · 雪夜暖光",
    desc: "你在零下三十度的寒冬夜晚，用镜头拥抱街灯的温度。",
    photo: { src: "/photos/season-winter.jpg", title: "冬", hint: "雪夜街灯", spec: "", ratio: "4/3" },
  },
];

/** 活动类型（暂无活动纪实照片，先以文字标签呈现，照片到位后升级为图文卡） */
export const activityTypes = ["主题外拍", "校园活动跟拍", "技能课堂", "校园影展", "短片创作"];

/* ── 作品瀑布流（9 件已接入，横竖比混排）
 * 作品说明不含个人署名（公开页面挂同学姓名有隐私风险）；如需署名，在 caption 末尾加「· 姓名 摄」即可。 */
export const works: PhotoSpec[] = [
  { src: "/photos/work-autumn-bokeh.jpg", title: "作品位", hint: "秋叶成诗", spec: "", ratio: "3/2", caption: "秋叶成诗" },
  { src: "/photos/work-startrails.jpg", title: "作品位", hint: "星轨", spec: "", ratio: "2/3", caption: "星轨" },
  { src: "/photos/work-goat.jpg", title: "作品位", hint: "山间白山羊", spec: "", ratio: "3/2", caption: "牧" },
  { src: "/photos/work-lightpainting.jpg", title: "作品位", hint: "光绘", spec: "", ratio: "3/2", caption: "光绘" },
  { src: "/photos/work-temple.jpg", title: "作品位", hint: "天坛", spec: "", ratio: "9/16", caption: "天坛" },
  { src: "/photos/work-night-fisher.jpg", title: "作品位", hint: "江畔夜钓", spec: "", ratio: "3/2", caption: "江畔夜钓" },
  { src: "/photos/work-flag-lights.jpg", title: "作品位", hint: "旗与灯", spec: "", ratio: "3/2", caption: "旗与灯" },
  { src: "/photos/work-city-panorama.jpg", title: "作品位", hint: "黑河城全景", spec: "", ratio: "16/9", caption: "黑河全景" },
  { src: "/photos/work-golden-bokeh.jpg", title: "作品位", hint: "一街光斑", spec: "", ratio: "3/2", caption: "一街光斑" },
];

/* ── 硬亮点大图（两张「先进集体」荣誉证书拼图，2026.6 党委宣传统战部颁发）── */

export const awardImage: PhotoSpec = {
  src: "/photos/award.jpg",
  title: "获奖证书",
  hint: "两届中俄交流活动宣传工作「先进集体」荣誉证书",
  spec: "",
  ratio: "16/9",
};

/* ── 精选短片（已接入：社团成就混剪「累计成就装」，960×540 / 19 秒 / 1.9MB，静音循环）── */

export const featuredVideo = {
  video: "/videos/showreel.mp4",
  poster: "/videos/showreel-poster.jpg",
  hint: "社团成就混剪：团省委三次转发、学校采纳证明、历届活动年表",
  spec: "960×540 · H.264 · 1.9MB · 静音循环",
};

/* ── 二维码（三通道全部接入，2026-09-06）──
 * ⚠️ 微信群码【9月13日过期】：过期前在微信「群二维码 → 重新生成」拿新图，
 *    替换 public/qr/wechat-group.jpg 即可（如为海报图需重新裁切码体为方形）。
 * 抖音号：hhxyjwsyst。QQ 群不存在，如后续建立可加回（群码长期有效，推荐）。 */

export type QrItem = {
  key: string;
  src: string | null;
  label: string;
  note: string;
  file: string; // 应放置的文件路径
};

export const qrs: QrItem[] = [
  { key: "wx", src: "/qr/wechat-group.jpg", label: "微信群 · 纳新群", note: "主通道 · 随时进入交流", file: "/qr/wechat-group.jpg" },
  { key: "mp", src: "/qr/wechat-mp.jpg", label: "官方公众号", note: "推文与作品首发平台", file: "/qr/wechat-mp.jpg" },
  { key: "dy", src: "/qr/douyin.jpg", label: "官方抖音", note: "抖音号 hhxyjwsyst", file: "/qr/douyin.jpg" },
];

/** 抖音作品或主页链接（微信内会被拦截，页面只做「抖音扫码」引导，不直接跳转） */
export const douyinUrl: string | null = null;

/* ── 联系方式（页脚） ── */
export const contact = {
  wechat: "ZWCX3690",
  email: "zwcx3690@163.com",
};

/** 正式部署域名（用于 SEO canonical 与分享卡，见 index.html） */
export const siteUrl = "https://hhxyjwsyst.online";

/* ── FAQ（陈述句体系） ──────────────────── */

export const faqs = [
  { q: "零基础起步", a: "绝大多数成员入学前从未接触过专业相机，前辈手把手带练上手。" },
  { q: "器材免费借", a: "微单、镜头、稳定器全员免押借用，手机创作同样被认真对待。" },
  { q: "零会费入社", a: "不收取任何会费或入社杂费，日常技能分享与基础活动完全免费。" },
  { q: "仅周末活动", a: "活动自愿参与，期末考试月全面停休，绝不挤占平时课业精力。" },
  { q: "校媒与署名", a: "优秀成片直推学校官方平台与《黑河日报》，并参与校园影展。" },
  { q: "扫码即进群", a: "招新通道常年开启，无需面试与繁琐流程，进群即完成入队。" },
];
