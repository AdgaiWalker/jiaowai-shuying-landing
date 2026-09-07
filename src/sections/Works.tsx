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
 * 2. 候选 3：35mm 机械过片分镜胶片帘 (XPBD 链式传动与惯性卡位) + 精选长片播放。
 */
export function Works() {
  const [active, setActive] = useState<number | null>(null);
  const validWorks = works.filter((w) => !!w.src);

  return (
    <section id="works" className="py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <SectionTitle
              title="作品是最终的对照"
              note="这里的每一幅画面，都出自曾经和你一样的零基础新生。一年之后，展廊中央会放上你的成片。"
            />
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="inline-block size-2 rounded-full bg-accent animate-pulse" />
              <span>自动循环巡展 · 点击进入全屏细览</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* 3D 螺旋展廊容器：给予充足的立面高度与视口空间 */}
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

      {/* 候选 3：35mm 机械过片胶片舱 */}
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

      <Lightbox
        items={validWorks}
        index={active}
        onClose={() => setActive(null)}
        onNavigate={setActive}
      />
    </section>
  );
}
