import GlareHover from "./GlareHover";
import { PhotoSlot } from "./PhotoSlot";
import type { PhotoSpec } from "../config/site";

type Season = { name: string; desc: string; photo: PhotoSpec };

/**
 * 四季照片带：自动从左向右匀速漂移，一张接一张晃过去；
 * 内容复制一份（.marquee-copy）实现无缝循环，悬停暂停方便读说明文字，
 * 「减弱动态」时退化为可横滑的静态照片条（见 global.css）。
 * 动画共用 .marquee-track（marqueeRight，从 -50% 到 0 即向右漂）。
 */
export function SeasonMarquee({ seasons }: { seasons: Season[] }) {
  const card = (s: Season) => (
    <figure key={s.name} className="w-[240px] shrink-0 md:w-[320px]">
      <GlareHover glareColor="#f4f4f1" glareOpacity={0.22} transitionDuration={800}>
        <PhotoSlot spec={s.photo} />
      </GlareHover>
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
      {seasons.map(card)}
    </div>
  );

  return (
    <div
      className="marquee group relative overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      aria-label="黑河四季作品"
    >
      <div
        className="marquee-track flex w-max group-hover:[animation-play-state:paused]"
        style={{ animationDuration: "44s" }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
