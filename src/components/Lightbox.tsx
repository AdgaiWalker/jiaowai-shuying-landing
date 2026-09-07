import { ArrowLeft, ArrowRight, X } from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect } from "react";
import type { PhotoSpec } from "../config/site";

type LightboxItem =
  | { type: "video"; src: string; poster?: string; caption?: string; hint?: string }
  | PhotoSpec;

type Props = {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/**
 *  Apple Design Fluid Lightbox
 * - 1:1 跟手拖拽（Direct Manipulation）与下拉飞出退出（Drag to Dismiss）
 * - 速度继承（Velocity Handoff）与动量投射（Momentum Projection: (v/1000) * d / (1-d)）
 * - 橡皮筋阻尼回弹（Rubber-banding: dragElastic + Apple 标称临界阻尼弹簧）
 * - Apple 材质与高光（apple-glass + apple-hairline）
 * - 减弱动态无障碍优雅退化（prefers-reduced-motion）
 */
export function Lightbox({ items, index, onClose, onNavigate }: Props) {
  const open = index !== null;
  const item = open ? items[index] : null;
  const reduce = useReducedMotion() ?? false;

  // 1:1 动态位移与 Apple 材质透明度/微缩映射
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // 随垂直拉动深度，背景遮罩由深渐浅，给用户底层透出、随时可放手撤销的安全感
  const bgOpacity = useTransform(dragY, [-360, 0, 360], [0.25, 0.96, 0.25]);
  const mediaScale = useTransform(dragY, [-360, 0, 360], [0.82, 1, 0.82]);
  const hintOpacity = useTransform(dragY, [-60, 0, 60], [0, 1, 0]);

  // 重置位移
  useEffect(() => {
    dragX.set(0);
    dragY.set(0);
  }, [index, dragX, dragY]);

  // 键盘导航
  useEffect(() => {
    if (index === null) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const step = (dir: number) => onNavigate((index + dir + items.length) % items.length);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, items.length, onClose, onNavigate]);

  const step = (dir: number) => {
    if (index === null) return;
    dragX.set(0);
    dragY.set(0);
    onNavigate((index + dir + items.length) % items.length);
  };

  const isVideo = (i: LightboxItem): boolean => {
    return "type" in i && i.type === "video";
  };

  const label = (i: LightboxItem): string => {
    if ("type" in i && i.type === "video") return i.caption ?? i.hint ?? "";
    const photo = i as PhotoSpec;
    return photo.caption ?? photo.title;
  };

  const hint = (i: LightboxItem): string => {
    return i.hint ?? "";
  };

  /**
   * Apple WWDC 2018 动量投射算法：
   * project(v, d) = (v / 1000) * d / (1 - d), d ≈ 0.998
   */
  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    const { offset, velocity } = info;
    const project = (v: number, d = 0.998) => (v / 1000) * (d / (1 - d));

    const absX = Math.abs(offset.x);
    const absY = Math.abs(offset.y);

    // 垂直手势判定：用户主要意图为下拉退出
    if (absY > absX) {
      const projectedY = offset.y + project(velocity.y);
      // 下拉位移超过 110px，或轻甩投影超过 160px，或指尖瞬时释放速度超过 520px/s
      if (Math.abs(projectedY) > 160 || absY > 110 || Math.abs(velocity.y) > 520) {
        onClose();
        return;
      }
    } else if (items.length > 1) {
      // 水平手势判定：轻扫切图
      const projectedX = offset.x + project(velocity.x);
      if (projectedX < -80 || velocity.x < -400) {
        step(1);
        return;
      } else if (projectedX > 80 || velocity.x > 400) {
        step(-1);
        return;
      }
    }
  };

  return (
    <AnimatePresence>
      {item && item.src && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={label(item)}
          className="fixed inset-0 z-50 flex select-none flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* 动态暗场背景：随跟手下拉平滑透出后方界面 */}
          <motion.div
            className="absolute inset-0 bg-ink"
            style={{ opacity: reduce ? 0.96 : bgOpacity }}
            onClick={onClose}
          />

          {/* 顶部控制栏：Apple Glass 磨砂悬浮与发丝高光 */}
          <div className="relative z-20 flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tracking-wider text-muted">
                {String((index ?? 0) + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <span className="hidden text-xs text-faint md:inline">
                {isVideo(item) ? "视频预览" : "摄影作品"}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="关闭"
              autoFocus
              className="apple-glass apple-hairline flex size-10 items-center justify-center text-paper shadow-lg transition-transform duration-100 active:scale-90"
            >
              <X size={18} weight="regular" aria-hidden />
            </button>
          </div>

          {/* 左右翻页按钮（桌面端：Apple 临界阻尼悬浮微件） */}
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="上一张"
                className="apple-glass apple-hairline absolute left-6 top-1/2 z-20 hidden size-12 -translate-y-1/2 items-center justify-center text-paper shadow-xl transition-all duration-140 hover:bg-white/10 active:scale-90 md:flex"
              >
                <ArrowLeft size={20} weight="regular" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="下一张"
                className="apple-glass apple-hairline absolute right-6 top-1/2 z-20 hidden size-12 -translate-y-1/2 items-center justify-center text-paper shadow-xl transition-all duration-140 hover:bg-white/10 active:scale-90 md:flex"
              >
                <ArrowRight size={20} weight="regular" aria-hidden />
              </button>
            </>
          )}

          {/* 核心展示区：支持 1:1 跟手拖拽、动量飞出、橡皮筋阻尼回弹 */}
          <div
            className="relative z-10 flex flex-1 items-center justify-center overflow-hidden p-4 md:p-10 cursor-grab active:cursor-grabbing"
            onClick={onClose}
          >
            <motion.div
              key={index}
              drag={!reduce && !isVideo(item)}
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
              dragElastic={0.65}
              onDragEnd={handleDragEnd}
              style={
                reduce || isVideo(item)
                  ? undefined
                  : {
                      x: dragX,
                      y: dragY,
                      scale: mediaScale,
                    }
              }
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 30,
              }}
              className="relative flex max-h-full max-w-full items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideo(item) ? (
                <video
                  src={item.src}
                  poster={"poster" in item ? item.poster : undefined}
                  className="max-h-[75dvh] max-w-full shadow-2xl"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={item.src}
                  alt={label(item)}
                  draggable={false}
                  className="max-h-[75dvh] max-w-full select-none object-contain shadow-2xl"
                />
              )}
            </motion.div>
          </div>

          {/* 底部信息栏：Apple Optical Typography 与 Vibrancy 文本 */}
          <motion.div
            className="apple-glass apple-hairline-t relative z-20 px-6 py-4 text-center transition-opacity"
            style={{ opacity: reduce ? 1 : hintOpacity }}
          >
            <p className="section-display font-serif text-base font-medium text-paper md:text-lg">
              {label(item)}
            </p>
            {hint(item) ? (
              <p className="mt-1 text-xs text-muted/90">{hint(item)}</p>
            ) : null}
            <p className="micro-label mt-2 text-[10px] text-faint md:hidden">
              轻扫切图 · 下拉退出
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
