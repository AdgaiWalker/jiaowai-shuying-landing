import { HeroCarousel } from "../components/HeroCarousel";
import { Reveal } from "../components/Reveal";
import { heroSlides, site } from "../config/site";

/**
 * S1 首屏：品牌印象 + 主转化。
 * 文案栈固定四件事：眉标、标题、一句话定位、两个按钮。
 * 有轮播图时全幅铺底加压暗渐层；无图时显示素材占位框，焦外光斑做氛围底。
 */
export function Hero() {
  const hasSlides = heroSlides.length > 0;

  return (
    <section id="top" className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      <HeroCarousel />
      {!hasSlides ? <div aria-hidden className="bokeh absolute inset-0" /> : null}

      {hasSlides ? (
        <>
          <div aria-hidden className="absolute inset-0 z-[1] bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
          <div aria-hidden className="hero-vignette absolute inset-0 z-[2]" />
        </>
      ) : (
        <div
          role="img"
          aria-label="素材位：首屏轮播图"
          className="absolute inset-0 z-[1] mx-4 mb-4 flex flex-col items-center justify-center gap-1.5 border-x border-b border-dashed border-faint/50 bg-ink-soft/40 text-center md:mb-6"
        >
          <span className="text-[10px] tracking-[0.3em] text-faint">素材位</span>
          <span className="font-serif text-sm text-paper">首屏轮播图（3~5 张）</span>
          <span className="text-xs text-muted">建议放：外拍、活动、作品混排，画面干净能压字</span>
          <span className="text-[11px] text-faint">横构图 · 宽 ≥1600px · 每张 ≤200KB · 放 public/photos/hero-N.jpg</span>
          <span className="text-[11px] text-faint">路径填入 src/config/site.ts 的 heroSlides 数组</span>
        </div>
      )}

      <div className="relative z-10 mx-auto mt-auto w-full max-w-6xl px-4 pb-24 pt-16 md:px-6 md:pb-28">
        <Reveal>
          <p className="text-xs tracking-[0.25em] text-muted">{site.eyebrow}</p>
          <h1 className="mt-4 font-serif text-6xl font-semibold leading-[1.05] md:text-8xl">
            {site.name}
          </h1>
          <p className="mt-4 font-serif text-lg text-paper/90 md:text-xl">{site.slogan}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#join"
              className="bg-accent px-6 py-3 text-sm font-medium text-ink transition-transform active:scale-[0.98]"
            >
              扫码进群
            </a>
            <a
              href="#works"
              className="border border-paper/30 px-6 py-3 text-sm text-paper/90 transition-colors hover:border-paper/60"
            >
              看作品
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
