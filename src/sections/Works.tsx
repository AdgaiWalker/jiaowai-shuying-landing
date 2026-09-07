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
 * 3. 35mm 机械过片胶片舱 (Film Reel)。
 */
export function Works() {
  const [active, setActive] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("fluid");
  const validWorks = works.filter((w) => !!w.src);

  return (
    <section id="works" className="py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionTitle
              title="作品是最终的对照"
              note="这里的每一幅画面，都出自曾经和你一样的零基础新生。一年之后，展廊中央会放上你的成片。"
            />

            {/* Apple 风格胶囊分段控制器 (Segmented Control) */}
            <div className="flex items-center self-start md:self-auto apple-glass apple-hairline p-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("fluid")}
                className={`px-3 py-1.5 transition-all ${
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
                className={`px-3 py-1.5 transition-all ${
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
                className={`px-3 py-1.5 transition-all ${
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
        <div className="mx-auto mt-6 max-w-6xl px-4 md:px-6">
          <Reveal>
            <FluidAlbum items={validWorks} onSelect={(index) => setActive(index)} />
          </Reveal>
        </div>
      )}

      {/* 视图 2：3D 螺旋展廊 */}
      {viewMode === "spiral" && (
        <div className="relative mx-auto mt-6 h-[540px] md:h-[620px] w-full max-w-6xl px-2 md:px-6">
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
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-8">
          <Reveal>
            <FilmReelStrip />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-muted">
              <span>社团影视组 · 从分镜构思、实地掌镜到后期调色完整历程</span>
              <p className="text-xs text-faint">
                更多短片：
                {douyinUrl ? (
                  <a href={douyinUrl} className="text-accent underline underline-offset-4">
                    在抖音打开
                  </a>
                ) : (
                  "抖音号二维码见下方「加入我们」"
                )}
              </p>
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
