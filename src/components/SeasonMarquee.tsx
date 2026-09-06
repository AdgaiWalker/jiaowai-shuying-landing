import { useState } from "react";
import GlareHover from "./GlareHover";
import { Lightbox } from "./Lightbox";
import { PhotoSlot } from "./PhotoSlot";
import type { PhotoSpec } from "../config/site";

type Season = { name: string; desc: string; photo: PhotoSpec };

/**
 * 四季照片带：自动从左向右匀速漂移，一张接一张晃过去；
 * 内容复制一份（.marquee-copy）实现无缝循环，悬停暂停，
 * 点击照片可全屏放大（Lightbox），「减弱动态」时退化为可横滑的静态照片条。
 */
export function SeasonMarquee({ seasons }: { seasons: Season[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const card = (s: Season, i: number) => (
    <figure key={s.name} className="w-[240px] shrink-0 md:w-[320px]">
      <button
        type="button"
        onClick={() => setOpenIndex(i)}
        aria-label={`查看大图：${s.name}`}
        className="block w-full cursor-zoom-in"
      >
        <GlareHover glareColor="#f4f4f1" glareOpacity={0.22} transitionDuration={800}>
          <PhotoSlot spec={s.photo} />
        </GlareHover>
      </button>
      <figcaption className="mt-3">
        <h3 className="font-serif text-base">{s.name}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted">{s.desc}</p>
      </figcaption>
    </figure>
  );

  const row = (isCopy: boolean) => (
    <div
      aria-hidden={isCopy || undefined}
      className={`flex w-max shrink-0 items-end gap-4 pr-4 md:gap-6 md:pr-6 ${isCopy ? "marquee-copy" : ""}`}
    >
      {seasons.map((s, i) => card(s, isCopy ? i + seasons.length : i))}
    </div>
  );

  return (
    <>
      <div
        className="marquee group relative overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        aria-label="黑河四季作品"
      >
        <div
          className="season-track flex w-max group-hover:[animation-play-state:paused]"
          style={{ animationDuration: "44s" }}
        >
          {row(false)}
          {row(true)}
        </div>
      </div>
      <Lightbox
        items={seasons.map((s) => s.photo)}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  );
}
