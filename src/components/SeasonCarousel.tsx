import { useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import GlareHover from "./GlareHover";
import { PhotoSlot } from "./PhotoSlot";
import type { PhotoSpec } from "../config/site";

type Season = { name: string; desc: string; photo: PhotoSpec };

const AUTOPLAY_MS = 5000;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * 四季自动轮播：5 秒换帧、循环播放；
 * 悬停 / 拖拽时暂停，左右箭头与季节名指示器可跳帧，移动端支持拖拽。
 * 「减弱动态」时不自动播放，仅手动切换。
 */
export function SeasonCarousel({ seasons }: { seasons: Season[] }) {
  const reduce = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = seasons.length;

  const go = (next: number) => setIndex(((next % count) + count) % count);

  useEffect(() => {
    if (reduce || paused || count < 2) return;
    const t = window.setInterval(() => go(index + 1), AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [index, paused, reduce, count]);

  const dragStartX = useRef<number | null>(null);

  return (
    <div
      role="region"
      aria-roledescription="轮播"
      aria-label="黑河四季作品"
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        dragStartX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={() => {
        window.setTimeout(() => setPaused(false), 800);
      }}
    >
      {/* 滑轨：负索引位移换帧，拖拽带回弹 */}
      <div className="overflow-hidden">
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          animate={{ x: `-${index * 100}%` }}
          transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
          drag={reduce ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={() => setPaused(true)}
          onDragEnd={(_, info) => {
            setPaused(false);
            if (info.offset.x < -60) go(index + 1);
            else if (info.offset.x > 60) go(index - 1);
          }}
        >
          {seasons.map((s) => (
            <div key={s.name} className="w-full shrink-0 px-4 md:px-6">
              <div className="mx-auto w-full max-w-[560px] md:max-w-[640px]">
                <GlareHover glareColor="#f4f4f1" glareOpacity={0.22} transitionDuration={800}>
                  <PhotoSlot spec={s.photo} />
                </GlareHover>
                <div className="mt-3 flex min-h-[3.5rem] flex-col items-center text-center">
                  <h3 className="font-serif text-base">{s.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 桌面箭头 */}
      {count > 1 ? (
        <>
          <button
            type="button"
            aria-label="上一张"
            onClick={() => go(index - 1)}
            className="absolute left-0 top-[35%] hidden h-10 w-10 items-center justify-center border border-line bg-ink/80 text-paper transition-colors hover:border-paper/40 md:flex"
          >
            <CaretLeft size={18} weight="regular" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="下一张"
            onClick={() => go(index + 1)}
            className="absolute right-0 top-[35%] hidden h-10 w-10 items-center justify-center border border-line bg-ink/80 text-paper transition-colors hover:border-paper/40 md:flex"
          >
            <CaretRight size={18} weight="regular" aria-hidden />
          </button>
        </>
      ) : null}

      {/* 季节名指示器：春 / 夏 / 秋 / 冬 */}
      <div className="mt-2 flex items-center justify-center gap-5" role="tablist" aria-label="选择季节">
        {seasons.map((s, i) => (
          <button
            key={s.name}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => go(i)}
            className={`py-1 font-serif text-sm transition-colors ${
              i === index ? "text-paper" : "text-faint hover:text-muted"
            }`}
          >
            {s.name.split(" ")[0]}
            <span
              aria-hidden
              className={`mt-1 block h-px transition-colors ${i === index ? "bg-accent" : "bg-transparent"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
