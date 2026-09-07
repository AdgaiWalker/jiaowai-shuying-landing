import { useState } from "react";
import InfiniteSpiral from "../components/InfiniteSpiral";
import { InlineVideo } from "../components/InlineVideo";
import { Lightbox } from "../components/Lightbox";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import { douyinUrl, works } from "../config/site";

/**
 * S7 作品区：
 * 1. 3D 空间垂直螺旋画廊：自动持续循环旋转、拖拽交互、景深失焦、点击进入全屏灯箱；
 * 2. 精选短片内联播放（社团成就混剪）+ 抖音入口。
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
              title="作品说话"
              note="在焦点之外，讲述光影。3D 空间自动回旋展廊，点击任意一张进入全屏细览。"
            />
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="inline-block size-2 rounded-full bg-accent animate-pulse" />
              <span>自动循环巡展 · 点击放大</span>
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

      <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6">
        <Reveal>
          <div className="border border-line bg-ink-soft p-4 md:p-5">
            <InlineVideo />
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="font-serif text-base text-paper">动态影像作品</p>
                <p className="mt-0.5 text-xs text-muted">
                  社团成就混剪：团省委三次转发、学校采纳证明、历届活动年表
                </p>
              </div>
              <p className="text-xs text-faint">
                更多短片在抖音：
                {douyinUrl ? (
                  <a href={douyinUrl} className="text-accent underline underline-offset-4">
                    在抖音打开
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
