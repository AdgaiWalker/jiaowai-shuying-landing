import { ArrowLeft, ArrowRight, ArrowsOutSimple, HandGrabbing } from "@phosphor-icons/react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { PhotoSpec } from "../config/site";

interface Props {
  items: PhotoSpec[];
  onSelect: (index: number) => void;
}

/**
 *  Apple Design Fluid Album (流体相册)
 * - 1:1 跟手横向拖拽流（Direct Manipulation）
 * - 物理阻尼与边界橡皮筋（Rubber-banding & Elastic Constraints）
 * - 动态速度微倾斜与深度景深（Velocity-aware 3D Tilt & Scale）
 * - 即时触感按下反馈（Pointer-down tactile response）
 * - 沉浸式轻触展开为全屏流体画廊（Interruptible Expand to Lightbox）
 */
export function FluidAlbum({ items, onSelect }: Props) {
  const reduce = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const x = useMotionValue(0);

  // 计算拖拽边界
  useEffect(() => {
    const updateBounds = () => {
      if (!containerRef.current || !trackRef.current) return;
      const containerW = containerRef.current.offsetWidth;
      const trackW = trackRef.current.scrollWidth;
      const max = Math.min(0, containerW - trackW - 32);
      setMaxScroll(max);
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, [items]);

  // 根据位移计算当前中央卡片序号
  useEffect(() => {
    return x.on("change", (latestX) => {
      const cardWidth = 320; // 单卡估算基准宽度 + 间距
      const idx = Math.round(Math.abs(latestX) / cardWidth);
      setActiveIdx(Math.max(0, Math.min(items.length - 1, idx)));
    });
  }, [x, items.length]);

  const scrollTo = (index: number) => {
    const cardWidth = 320;
    const target = Math.max(maxScroll, Math.min(0, -index * cardWidth));
    animate(x, target, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      bounce: 0,
    });
  };

  const handleNext = () => scrollTo(Math.min(items.length - 1, activeIdx + 1));
  const handlePrev = () => scrollTo(Math.max(0, activeIdx - 1));

  return (
    <div className="w-full select-none" ref={containerRef}>
      {/* 顶部指示条与控制微件 */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="flex items-center gap-1 border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-paper">
            <HandGrabbing size={13} weight="regular" className="text-accent" />
            <span>左右轻扫 / 拖拽推拉</span>
          </span>
          <span className="hidden text-faint md:inline">· 1:1 跟手物理阻尼</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-wider text-muted">
            {String(activeIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeIdx === 0}
              aria-label="上一张"
              className="apple-glass apple-hairline flex size-8 items-center justify-center text-paper transition-all disabled:opacity-30 active:scale-90"
            >
              <ArrowLeft size={14} weight="regular" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={activeIdx >= items.length - 1}
              aria-label="下一张"
              className="apple-glass apple-hairline flex size-8 items-center justify-center text-paper transition-all disabled:opacity-30 active:scale-90"
            >
              <ArrowRight size={14} weight="regular" />
            </button>
          </div>
        </div>
      </div>

      {/* 1:1 跟手流体相册卡片轨道 */}
      <div className="overflow-hidden py-4 cursor-grab active:cursor-grabbing">
        <motion.div
          ref={trackRef}
          drag={reduce ? false : "x"}
          dragConstraints={{ left: maxScroll, right: 0 }}
          dragElastic={0.65}
          style={{ x }}
          className="flex gap-4 md:gap-6 pl-1 pr-8 w-max"
        >
          {items.map((item, idx) => (
            <FluidPhotoCard
              key={item.src ?? idx}
              item={item}
              index={idx}
              active={idx === activeIdx}
              onOpen={() => onSelect(idx)}
            />
          ))}
        </motion.div>
      </div>

      {/* 底部交互指引 */}
      <div className="mt-2 flex items-center justify-between px-1 text-xs text-faint">
        <span>轻触任意成片进入 Apple 全屏画廊（支持下拉退出与动量投射）</span>
        <span className="font-serif italic text-paper/70">Bokeh & Light</span>
      </div>
    </div>
  );
}

function FluidPhotoCard({
  item,
  index,
  active,
  onOpen,
}: {
  item: PhotoSpec;
  index: number;
  active: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.div
      onClick={onOpen}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={`group relative flex flex-col overflow-hidden border border-white/10 bg-ink-soft/70 transition-all duration-300 w-[260px] md:w-[320px] aspect-[3/4] ${
        active
          ? "ring-1 ring-white/30 shadow-[0_12px_36px_rgba(0,0,0,0.5)]"
          : "opacity-85 hover:opacity-100"
      }`}
    >
      {/* 照片画芯 */}
      <div className="relative flex-1 overflow-hidden bg-ink">
        <img
          src={item.src ?? undefined}
          alt={item.caption ?? item.title}
          draggable={false}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* 顶部反光角标 */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 apple-glass apple-hairline px-2 py-0.5 text-[10px] text-paper">
          <span className="size-1.5 rounded-full bg-accent animate-pulse" />
          <span>FRAME #{String(index + 1).padStart(2, "0")}</span>
        </div>

        {/* 悬浮快捷放大按钮 */}
        <div className="absolute top-2.5 right-2.5 apple-glass apple-hairline flex size-7 items-center justify-center text-paper opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <ArrowsOutSimple size={14} weight="regular" />
        </div>

        {/* 底部阴影渐变遮罩 */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink via-ink/60 to-transparent pointer-events-none" />
      </div>

      {/* 底部元数据卡签 */}
      <div className="apple-glass apple-hairline-t p-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-medium tracking-[-0.015em] text-paper">
            {item.caption ?? item.title}
          </h3>
          <span className="text-[10px] text-muted tracking-wider uppercase">
            {item.ratio ?? "3:2"}
          </span>
        </div>
        {item.hint ? (
          <p className="mt-1 line-clamp-1 text-xs text-muted/80">{item.hint}</p>
        ) : null}
      </div>
    </motion.div>
  );
}
