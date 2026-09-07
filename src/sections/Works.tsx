import { useState } from "react";
import { FluidAlbum } from "../components/FluidAlbum";
import InfiniteSpiral from "../components/InfiniteSpiral";
import { FilmReelStrip } from "../components/xpbd/FilmReelStrip";
import { Lightbox } from "../components/Lightbox";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import { douyinUrl, works } from "../config/site";

type ViewMode = "fluid" | "spiral" | "reel";

/**
 * S7 作品区：
 * 1.  流体相册 (Fluid Album)：1:1 跟手拖拽、动量投射、物理阻尼与全屏沉浸画廊；
 * 2. 3D 空间垂直螺旋巡展 (Infinite Spiral)；
 * 3. 35mm 机械过片胶片舱 (Film Reel)；
 * 支持顶部分段控制器自由切换展廊形态。
 */
export function Works() {
  const [active, setActive] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("fluid");
  const validWorks = works.filter((w) => !!w.src);

  return (
    <section id="works" className="relative py-24 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionTitle
              eyebrow="PORTFOLIO · 影像展廊"
              title="作品是最终的对照"
              note="这里的每一幅画面，都出自曾经和你一样的零基础新生。一年之后，展廊中央会放上你的成片。"
            />

            {/* 胶囊分段控制器 (Segmented Control) */}
            <div className="flex items-center self-start md:self-auto rounded-full border border-white/10 bg-white/5 p-1 text-xs backdrop-blur-md mb-12 md:mb-16">
              <button
                type="button"
                onClick={() => setViewMode("fluid")}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  viewMode === "fluid"
                    ? "bg-paper text-ink font-medium shadow-sm"
                    : "text-muted hover:text-paper"
                }`}
              >
                 流体相册
              </button>
              <button
                type="button"
                onClick={() => setViewMode("spiral")}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  viewMode === "spiral"
                    ? "bg-paper text-ink font-medium shadow-sm"
                    : "text-muted hover:text-paper"
                }`}
              >
                3D 螺旋巡展
              </button>
              <button
                type="button"
                onClick={() => setViewMode("reel")}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  viewMode === "reel"
                    ? "bg-paper text-ink font-medium shadow-sm"
                    : "text-muted hover:text-paper"
                }`}
              >
                35mm 胶片舱
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* 视图 1： Apple Fluid Album（默认） */}
      {viewMode === "fluid" && (
        <div className="mx-auto mt-2 max-w-6xl px-4 md:px-6">
          <Reveal>
            <div className="surface-glass double-bezel rounded-2xl p-4 md:p-8">
              <FluidAlbum items={validWorks} onSelect={(index) => setActive(index)} />
            </div>
          </Reveal>
        </div>
      )}

      {/* 视图 2：3D 螺旋展廊 */}
      {viewMode === "spiral" && (
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
      )}

      {/* 视图 3：35mm 机械过片胶片舱 */}
      {viewMode === "reel" && (
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-4">
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
      )}

      <Lightbox
        items={validWorks}
        index={active}
        onClose={() => setActive(null)}
        onNavigate={setActive}
      />
    </section>
  );
}
