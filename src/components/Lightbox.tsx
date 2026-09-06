import { ArrowLeft, ArrowRight, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { PhotoSpec } from "../config/site";

/**
 * 作品灯箱：点击作品全屏查看，左右滑动 / 方向键 / 按钮切换，Esc 关闭。
 * 只在有真实图片（src 非空）的作品上触发。
 */
type Props = {
  items: PhotoSpec[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function Lightbox({ items, index, onClose, onNavigate }: Props) {
  const open = index !== null;
  const item = open ? items[index] : null;
  const touchStartX = useRef<number | null>(null);

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
    onNavigate((index + dir + items.length) % items.length);
  };

  return (
    <AnimatePresence>
      {item && item.src && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.caption ?? item.title}
          className="fixed inset-0 z-50 flex touch-pan-y flex-col bg-ink/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
            touchStartX.current = null;
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            autoFocus
            className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center border border-paper/30 bg-ink/70 text-paper backdrop-blur"
          >
            <X size={20} weight="regular" aria-hidden />
          </button>
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="上一张"
                className="absolute left-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center border border-paper/30 bg-ink/70 text-paper backdrop-blur md:flex"
              >
                <ArrowLeft size={20} weight="regular" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="下一张"
                className="absolute right-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center border border-paper/30 bg-ink/70 text-paper backdrop-blur md:flex"
              >
                <ArrowRight size={20} weight="regular" aria-hidden />
              </button>
            </>
          )}

          <div className="flex flex-1 items-center justify-center overflow-hidden p-4 md:p-10" onClick={onClose}>
            <motion.img
              key={index}
              src={item.src}
              alt={item.caption ?? item.hint}
              className="max-h-full max-w-full object-contain"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="border-t border-line px-4 py-3 text-center">
            <p className="font-serif text-sm text-paper">{item.caption ?? item.title}</p>
            <p className="mt-0.5 text-[11px] text-faint">{item.hint}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
