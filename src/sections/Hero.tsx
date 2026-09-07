import { useReducedMotion } from "motion/react";
import BlurText from "../components/BlurText";
import { HeroCarousel } from "../components/HeroCarousel";
import { Reveal } from "../components/Reveal";
import { heroSlides, site } from "../config/site";

/**
 * S1 首屏：品牌印象 + 主转化。
 * 文案栈固定四件事：眉标、标题、一句话定位、两个按钮。
 * 有轮播图时全幅铺底加压暗渐层；无图时显示素材占位框，焦外光斑做氛围底。
 * 标题 = 逐字上浮（片头字卡），slogan = 逐字由虚转实（对焦），两者互为呼应；
 * 「减弱动态」时全部退化为静态文本。
 */
export function Hero() {
  const hasSlides = heroSlides.length > 0;
  const reduce = useReducedMotion() ?? false;

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
          <p className="micro-label text-xs tracking-[0.28em] text-muted">{site.eyebrow}</p>
        </Reveal>
        {reduce ? (
          <h1 className="display-title mt-4 font-serif text-6xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-8xl md:tracking-[-0.04em]">
            {site.name}
          </h1>
        ) : (
          <BlurText
            text={site.name}
            tag="h1"
            animateBy="letters"
            delay={140}
            stepDuration={0.9}
            animationFrom={{ opacity: 0, y: 56 }}
            animationTo={[{ opacity: 1, y: 0 }]}
            easing={[0.16, 1, 0.3, 1]}
            className="display-title mt-4 font-serif text-6xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-8xl md:tracking-[-0.04em]"
          />
        )}
        {reduce ? (
          <p className="mt-4 font-serif text-lg tracking-[-0.012em] text-paper/90 md:text-xl">{site.slogan}</p>
        ) : (
          <BlurText
            text={site.slogan}
            animateBy="letters"
            direction="bottom"
            delay={80}
            stepDuration={0.45}
            className="mt-4 font-serif text-lg tracking-[-0.012em] text-paper/90 md:text-xl"
          />
        )}
        <Reveal delay={0.12}>
          <p className="mt-3 max-w-xl text-sm leading-[1.7] text-muted md:text-base">
            你的大学四年，不会只是往返于宿舍、食堂与课堂。
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#join"
              className="bg-accent px-6 py-3 text-sm font-medium text-ink shadow-[0_2px_12px_rgba(229,72,77,0.3)] transition-transform active:scale-[0.96]"
            >
              扫码进群
            </a>
            <a
              href="#works"
              className="border border-white/20 bg-white/[0.03] px-6 py-3 text-sm text-paper/90 backdrop-blur-sm transition-all hover:border-white/50 active:scale-[0.96]"
            >
              看作品
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
