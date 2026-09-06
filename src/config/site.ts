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
  eyebrow: "黑河学院 · 摄影与视频创作社团",
  intro: [
    // 社团信息来自官方抖音/公众号主页（成立于 2024 年 9 月、四星级社团），上线前请社长确认
    "「焦外述影」成立于 2024 年 9 月，是黑河学院的综合视觉创作社团，现为学校四星级社团。「焦外」是摄影里焦点之外的那片光，「述影」是我们讲述故事的方式：用照片，也用视频。",
    "在这里，有人背着相机走遍黑河的四季，有人把三分钟的短片剪到深夜，也有人从零开始，慢慢把手里的设备变成眼睛的延伸。",
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

/* ── 数字带（数据来源：社团官方抖音主页，2026-09 截图，真实数据） ── */

export const stats = [
  { value: "2024", label: "社团成立" },
  { value: "四星", label: "学校星级社团" },
  { value: "92", label: "抖音作品" },
  { value: "1.2万", label: "抖音获赞" },
];

/* ── 「关于我们」配图 ───────────────────────────────────────── */

export const aboutImage: PhotoSpec = {
  src: "/photos/about-autumn-path.jpg",
  title: "关于我们配图",
  hint: "秋日小路上同行的人",
  spec: "",
  ratio: "3/2",
};

/* ── 「黑河四季」横滑条（4 张已接入；活动纪实照片仍待补，到位后可加回） ── */

export const seasons: { name: string; desc: string; photo: PhotoSpec }[] = [
  {
    name: "春 · 樱与新生",
    desc: "四月，校园的樱花先开口",
    photo: { src: "/photos/season-spring.jpg", title: "春", hint: "校园樱花", spec: "", ratio: "4/3" },
  },
  {
    name: "夏 · 江畔绿荫",
    desc: "黑龙江边的长昼",
    photo: { src: "/photos/season-summer.jpg", title: "夏", hint: "绿荫小路", spec: "", ratio: "4/3" },
  },
  {
    name: "秋 · 一城黄叶",
    desc: "黑河最上镜的季节",
    photo: { src: "/photos/season-autumn.jpg", title: "秋", hint: "红叶蓝天", spec: "", ratio: "4/3" },
  },
  {
    name: "冬 · 雪夜灯暖",
    desc: "零下三十度也有光",
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
  { key: "wx", src: "/qr/wechat-group.jpg", label: "微信群 · 纳新群", note: "主通道 · 9月13日前有效", file: "/qr/wechat-group.jpg" },
  { key: "mp", src: "/qr/wechat-mp.jpg", label: "官方公众号", note: "推文与作品首发", file: "/qr/wechat-mp.jpg" },
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

/* ── FAQ（答案为初稿占位，上线前由社长确认） ──────────────────── */

export const faqs = [
  { q: "零基础可以加入吗？", a: "可以。社团有从入门开始的分享课堂，前辈带练，多数成员入学时也是零基础。" },
  { q: "没有相机怎么办？", a: "社团有公共设备可供成员借用；用手机认真创作同样欢迎。" },
  { q: "加入社团收费吗？", a: "（待社长确认：是否收取社费、金额与用途，按学校社团实际规则填写。）" },
  { q: "活动多吗？会耽误学习吗？", a: "活动自愿参加，通常安排在周末，期末季休整。" },
  { q: "我的作品有机会被看到吗？", a: "优秀作品可推荐至学校官方平台发表，也有校园影展。" },
  { q: "怎么加入？", a: "扫下方二维码进招新群即可。招新长期开放，随时欢迎。" },
];
