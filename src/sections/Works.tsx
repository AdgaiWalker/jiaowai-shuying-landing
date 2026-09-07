import { useState } from "react";
import InfiniteSpiral from "../components/InfiniteSpiral";
import { FilmReelStrip } from "../components/xpbd/FilmReelStrip";
import { Lightbox } from "../components/Lightbox";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import { douyinUrl, works } from "../config/site";

/**
 * S7 作品区：
 * 1. 3D 空间垂直螺旋画廊：自动持续循环旋转、拖拽交互、景深失焦、点击进入全屏灯箱；
 * 2. 35mm 机械过片分镜胶片帘 (XPBD 链式传动与惯性卡位) + 精选长片播放。
 */
export function Works() {
  const [active, setActive] = useState<number | null>(null);
  const validWorks = works.filter((w) => !!w.src);

  return (
    <section id="works" className="relative py-24 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionTitle
              eyebrow="PORTFOLIO · 影像展廊"
              title="作品是最终的对照"
              note="这里的每一幅画面，都出自曾经和你一样的零基础新生。一年之后，展廊中央会放上你的成片。"
            />
            <div className="mb-12 md:mb-16 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-muted backdrop-blur-md">
              <span className="inline-block size-2 rounded-full bg-accent animate-pulse" />
              <span>3D 空间巡展 · 拖拽探索 · 点击细览</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* 3D 螺旋展廊容器：给予充足的立面高度与视口空间 */}
      <div className="relative mx-auto mt-2 h-[560px] md:h-[640px] w-full max-w-6xl px-2 md:px-6">
        <InfiniteSpiral
          items={validWorks.map((w) => ({
            src: w.src!,
            alt: w.caption ?? w.hint,
            label: w.caption ?? w.title,
          }))}
          animationMode="all"
          direction="up"
          speed={0.6}
          cardsPerTurn={6}
          radius={260}
          verticalSpacing={140}
          centerScale={1.25}
          edgeFade={0.35}
          edgeBlur={4}
          cardWidth={210}
          cardHeight={270}
          pauseOnHover={false}
          onItemClick={(index) => setActive(index)}
        />
      </div>

      {/* 35mm 机械过片胶片舱：实体胶片过片台 */}
      <div className="mx-auto max-w-6xl px-4 md:px-6 mt-12">
        <Reveal>
          <div className="surface-glass double-bezel rounded-2xl p-4 md:p-6">
            <FilmReelStrip />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-accent" />
                社团影视组 · 从分镜构思、实地掌镜到后期调色完整历程
              </span>
              <p className="text-xs text-muted/80">
                更多短片动态：
                {douyinUrl ? (
                  <a
                    href={douyinUrl}
                    className="ml-1 text-accent underline underline-offset-4 hover:text-accent-deep transition-colors"
                  >
                    在抖音打开 ↗
                  </a>
                ) : (
                  "抖音号二维码见下方「加入我们」"
                )}
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <Lightbox
        items={validWorks}
        index={active}
        onClose={() => setActive(null)}
        onNavigate={setActive}
      />
    </section>
  );
}
