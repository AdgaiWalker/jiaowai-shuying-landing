/**
 * ═══════════════════════════════════════════════════════════════
 * 内容读取层 · 数据在 src/content/*.json（管理后台写入的目标文件）
 *
 * 结构（schema 即"自建后台 ↔ 前台"的契约，字段变更需两侧同步）：
 *   brand.json         品牌文案 / stats / 联系方式 / FAQ / siteUrl
 *   hero.json          首屏轮播（第 1 张为首屏 LCP 图，建议 ≤500KB）+ BGM
 *   gallery.json       四季 / 作品位 / 关于配图 / 精选短片
 *   endorsements.json  官方背书 / 获奖证书
 *   qrs.json           进群二维码四通道（微信 / QQ / 公众号 / 抖音）
 *
 * 本层对每个字段做校验：内容文件缺失或字段类型异常时回退内置默认值，
 * 保证前台永不因内容层故障白屏（PRD EB-1）。组件不感知数据来源。
 * 日常改内容请走 /admin 后台，不要直接改代码。
 * ═══════════════════════════════════════════════════════════════
 */

import brandJson from "@/content/brand.json";
import heroJson from "@/content/hero.json";
import galleryJson from "@/content/gallery.json";
import endorsementsJson from "@/content/endorsements.json";
import qrsJson from "@/content/qrs.json";

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

export type EndorsementItem =
  | {
      id: string;
      level: "省里推荐" | "校级表彰" | "市级党媒";
      badge: string;
      title: string;
      source: string;
      desc: string;
      type: "video";
      src: string;
      poster: string;
    }
  | {
      id: string;
      level: "省里推荐" | "校级表彰" | "市级党媒";
      badge: string;
      title: string;
      source: string;
      desc: string;
      type: "photo";
      src: string;
      ratio: "16/9" | "2/3" | "3/4" | "4/5" | "1/1" | "4/3" | "3/2";
    };

export type QrItem = {
  key: string;
  src: string | null;
  label: string;
  note: string;
  file: string;
};

/* ── 校验工具（EB-1：字段异常回退默认值） ─────────────────────── */

type Obj = Record<string, unknown>;
const asObj = (v: unknown): Obj => (v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
const asArr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (v: unknown, fb: string): string => (typeof v === "string" && v.trim() !== "" ? v : fb);
const strOrNull = (v: unknown, fb: string | null): string | null =>
  v === null || v === undefined ? fb : typeof v === "string" && v.trim() !== "" ? v : fb;
const strArr = (v: unknown, fb: string[]): string[] =>
  Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === "string" && x.trim() !== "") ? (v as string[]) : fb;

const PHOTO_RATIOS = ["9/16", "2/3", "3/4", "4/5", "1/1", "4/3", "3/2", "16/9"] as const;
const CARD_RATIOS = PHOTO_RATIOS.filter((r) => r !== "9/16");
const LEVELS = ["省里推荐", "校级表彰", "市级党媒"] as const;

const ratio = (v: unknown, fb: PhotoSpec["ratio"]): PhotoSpec["ratio"] =>
  typeof v === "string" && (PHOTO_RATIOS as readonly string[]).includes(v) ? (v as PhotoSpec["ratio"]) : fb;

const photoSpec = (v: unknown, fb: PhotoSpec): PhotoSpec => {
  const o = asObj(v);
  return {
    src: strOrNull(o.src, fb.src),
    title: str(o.title, fb.title),
    hint: str(o.hint, fb.hint),
    spec: typeof o.spec === "string" ? o.spec : fb.spec,
    ratio: ratio(o.ratio, fb.ratio),
    ...(typeof o.caption === "string" && o.caption.trim() !== ""
      ? { caption: o.caption }
      : fb.caption !== undefined
        ? { caption: fb.caption }
        : {}),
  };
};

/* ── 品牌文案（brand.json） ───────────────────────────────────── */

const brand = asObj(brandJson);
const siteRaw = asObj(brand.site);

export const site = {
  name: str(siteRaw.name, "焦外述影社团"),
  school: str(siteRaw.school, "黑河学院"),
  slogan: str(siteRaw.slogan, "在焦点之外，讲述光影"),
  eyebrow: str(siteRaw.eyebrow, "黑河学院 · 焦外述影社团"),
  intro: strArr(siteRaw.intro, [
    "你带着一部普通的手机来到黑河。在接下来的四年里，你的大学生活不会只是往返于宿舍、食堂与课堂之间。",
    "在焦述，你将在零下三十度的江边记录晨雾，在落叶铺满的街巷学会调整快门，在全校大型活动的现场挂上属于你的工作牌。这里没有层级与门槛，只有递到你手里的相机，和并肩创作的同伴。",
  ]),
  tags: strArr(siteRaw.tags, ["平面摄影", "视频短片", "后期制作", "新媒体运营", "策划布展"]),
};

/* ── 数字带 ── */

export const stats = asArr(brand.stats).length
  ? asArr(brand.stats).map((it) => {
      const o = asObj(it);
      return { value: str(o.value, "—"), label: str(o.label, "—") };
    })
  : [
      { value: "0元", label: "入社费用 · 无任何隐性支出" },
      { value: "综测", label: "实践记录 · 正规计入考核学分" },
      { value: "免押", label: "微单稳定器 · 开放全员借用" },
      { value: "同行", label: "零基础起步 · 前辈手把手带练" },
    ];

/* ── 联系方式（页脚） ── */

const contactRaw = asObj(brand.contact);
export const contact = {
  wechat: str(contactRaw.wechat, "ZWCX3690"),
  email: str(contactRaw.email, "zwcx3690@163.com"),
};

/** 正式部署域名（用于 SEO canonical 与分享卡，见 index.html；改错会导致分享卡失效，后台不开放编辑） */
export const siteUrl = str(brand.siteUrl, "https://hhxyjwsyst.online");

/* ── FAQ ── */

export const faqs = asArr(brand.faqs).length
  ? asArr(brand.faqs).map((it) => {
      const o = asObj(it);
      return { q: str(o.q, "—"), a: str(o.a, "—") };
    })
  : [
      { q: "零基础起步", a: "绝大多数成员入学前从未接触过专业相机，前辈手把手带练上手。" },
      { q: "器材免费借", a: "微单、镜头、稳定器全员免押借用，手机创作同样被认真对待。" },
      { q: "零会费入社", a: "不收取任何会费或入社杂费，日常技能分享与基础活动完全免费。" },
      { q: "仅周末活动", a: "活动自愿参与，期末考试月全面停休，绝不挤占平时课业精力。" },
      { q: "校媒与署名", a: "优秀成片直推学校官方平台与《黑河日报》，并参与校园影展。" },
      { q: "扫码即进群", a: "招新通道常年开启，无需面试与繁琐流程，进群即完成入队。" },
    ];

/* ── 首屏（hero.json） ── */

const hero = asObj(heroJson);
export const heroSlides: string[] = strArr(hero.heroSlides, [
  "/photos/hero-1.jpg",
  "/photos/hero-2.jpg",
  "/photos/hero-3.jpg",
  "/photos/hero-4.jpg",
]);
export const heroMusic: string | null = strOrNull(hero.heroMusic, null);

/* ── 展示位（gallery.json） ── */

const gal = asObj(galleryJson);

export const aboutImage: PhotoSpec = photoSpec(gal.aboutImage, {
  src: "/photos/about-autumn-path.jpg",
  title: "关于我们配图",
  hint: "秋日小路上同行的人",
  spec: "",
  ratio: "3/2",
});

export const seasons: { name: string; desc: string; photo: PhotoSpec }[] = asArr(gal.seasons).length
  ? asArr(gal.seasons).map((it) => {
      const o = asObj(it);
      return {
        name: str(o.name, "四季"),
        desc: str(o.desc, "用镜头记录黑河的四季。"),
        photo: photoSpec(o.photo, { src: null, title: "四季", hint: "四季外拍", spec: "", ratio: "4/3" }),
      };
    })
  : [];

/** 活动类型（暂无活动纪实照片，先以文字标签呈现，照片到位后升级为图文卡） */
export const activityTypes: string[] = strArr(gal.activityTypes, [
  "主题外拍",
  "校园活动跟拍",
  "技能课堂",
  "校园影展",
  "短片创作",
]);

/* ── 作品瀑布流 ──
 * 作品说明默认不署名（公开页面挂同学姓名有隐私风险）；如需署名，在 caption 末尾加「· 姓名 摄」。 */

export const works: PhotoSpec[] = asArr(gal.works).length
  ? asArr(gal.works).map((it) => photoSpec(it, { src: null, title: "作品位", hint: "社团作品", spec: "", ratio: "3/2" }))
  : [];

/* ── 精选短片 ── */

const fvRaw = asObj(gal.featuredVideo);
export const featuredVideo = {
  video: str(fvRaw.video, "/videos/showreel.mp4"),
  poster: str(fvRaw.poster, "/videos/showreel-poster.jpg"),
  hint: str(fvRaw.hint, "社团成就混剪"),
  spec: typeof fvRaw.spec === "string" ? fvRaw.spec : "",
};

/* ── 背书与证书（endorsements.json） ── */

const endo = asObj(endorsementsJson);

type PhotoEndoRatio = Extract<EndorsementItem, { type: "photo" }>["ratio"];
const cardRatio = (v: unknown, fb: PhotoEndoRatio): PhotoEndoRatio =>
  typeof v === "string" && (CARD_RATIOS as readonly string[]).includes(v) ? (v as PhotoEndoRatio) : fb;

export const endorsements: EndorsementItem[] = asArr(endo.endorsements)
  .map((it): EndorsementItem | null => {
    const o = asObj(it);
    const level = (typeof o.level === "string" && (LEVELS as readonly string[]).includes(o.level)
      ? o.level
      : "校级表彰") as EndorsementItem["level"];
    const base = {
      id: str(o.id, `item-${Math.random().toString(36).slice(2, 8)}`),
      level,
      badge: str(o.badge, "官方背书"),
      title: str(o.title, "官方背书"),
      source: str(o.source, "官方平台"),
      desc: str(o.desc, ""),
    };
    if (o.type === "video" && typeof o.src === "string" && o.src) {
      return { ...base, type: "video", src: o.src, poster: str(o.poster, "") };
    }
    if (o.type === "photo" && typeof o.src === "string" && o.src) {
      return { ...base, type: "photo", src: o.src, ratio: cardRatio(o.ratio, "3/2") };
    }
    return null;
  })
  .filter((x): x is EndorsementItem => x !== null);

export const awardImage: PhotoSpec = photoSpec(endo.awardImage, {
  src: "/photos/award.jpg",
  title: "获奖证书",
  hint: "两届中俄交流活动宣传工作「先进集体」荣誉证书",
  spec: "",
  ratio: "16/9",
});

/* ── 二维码（qrs.json）──
 * 微信群码约 7 天过期：后台「二维码」页上传新图即可（主通道换图入口）。
 * QQ 群码长期有效，src 为 null 时前台显示素材占位框。 */

export const qrs: QrItem[] = asArr(qrsJson.qrs).length
  ? asArr(qrsJson.qrs)
      .map((it): QrItem | null => {
        const o = asObj(it);
        const key = str(o.key, "");
        if (!key) return null;
        return {
          key,
          src: strOrNull(o.src, null),
          label: str(o.label, key),
          note: typeof o.note === "string" ? o.note : "",
          file: str(o.file, `/qr/${key}.jpg`),
        };
      })
      .filter((x): x is QrItem => x !== null)
  : [{ key: "wx", src: "/qr/wechat-group.jpg", label: "微信群 · 纳新群", note: "主通道 · 随时进入交流", file: "/qr/wechat-group.jpg" }];

/** 微信群码过期日（ISO 日期字符串，后台维护；null/非法格式 = 不展示倒计时）。前台暂不消费，供后台与未来扩展使用 */
export const wxQrExpires: string | null =
  typeof qrsJson.wxExpires === "string" && /^\d{4}-\d{2}-\d{2}$/.test(qrsJson.wxExpires) ? qrsJson.wxExpires : null;

/** 抖音作品或主页链接（微信内会被拦截，页面只做「抖音扫码」引导，不直接跳转） */
export const douyinUrl: string | null = strOrNull(asObj(qrsJson).douyinUrl, null);
