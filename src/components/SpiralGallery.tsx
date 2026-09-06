import { useEffect, useRef, useState } from "react";
import { Lightbox } from "../components/Lightbox";
import { PhotoSlot } from "../components/PhotoSlot";
import type { PhotoSpec } from "../config/site";

type SpiralGalleryProps = {
  items: PhotoSpec[];
  /** 滚动驱动的圈数，默认 3 圈（对应 3 屏高度） */
  turns?: number;
  /** 螺旋最大半径（px） */
  maxRadius?: number;
  /** 垂直落差（px） */
  pitch?: number;
};

/**
 * 滚动驱动螺旋画廊：
 * - 进入视口后固定镜头（sticky），随滚动螺旋流动展示图片
 * - 滚动继续向下时自然离开，不影响后续内容
 * - 基于 CSS perspective + transform-style: preserve-3d
 * - 支持点击灯箱放大
 */
export function SpiralGallery({
  items,
  turns = 3,
  maxRadius = 480,
  pitch = 160,
}: SpiralGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const valid = items.filter((i): i is PhotoSpec & { src: string } => !!i.src);

  if (valid.length === 0) return null;

  // 监听滚动，计算 0~1 进度
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // 当 section 顶部到达视口底部时开始，section 底部到达视口顶部时结束
      const start = viewportHeight;
      const end = -sectionHeight + viewportHeight;
      const current = sectionTop;

      if (current <= start && current >= end) {
        const p = (start - current) / (start - end);
        setProgress(Math.max(0, Math.min(1, p)));
      } else if (current > start) {
        setProgress(0);
      } else {
        setProgress(1);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // 初始调用
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 根据进度计算当前展示的图片
  const currentIndex = Math.floor(progress * valid.length) % valid.length;
  const currentItem = valid[currentIndex];

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${valid.length * 100}vh` }}>
      {/* 固定镜头区域 */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink-soft to-ink" />

        {/* 螺旋图片 */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: 1200, perspectiveOrigin: "50% 50%" }}
        >
          <div
            className="relative"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(8deg)",
            }}
          >
            {valid.map((item, i) => {
              // 计算该图片在螺旋中的基础角度
              const baseAngle = (i / valid.length) * turns * Math.PI * 2;
              // 加上滚动进度带来的旋转
              const angle = baseAngle + progress * turns * Math.PI * 2;
              const radius = maxRadius * (i / Math.max(1, valid.length - 1));
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              const y = (i / valid.length) * pitch - pitch / 2;
              const scale = 0.6 + 0.4 * (i / Math.max(1, valid.length - 1));

              // 当前图片高亮
              const isActive = i === currentIndex;
              const opacity = isActive ? 1 : 0.4;
              const activeScale = isActive ? scale * 1.1 : scale;

              return (
                <div
                  key={item.src + i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                  style={{
                    transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${activeScale})`,
                    transformStyle: "preserve-3d",
                    zIndex: Math.round(activeScale * 100),
                    width: "240px",
                    opacity,
                    filter: isActive ? "none" : "blur(1px)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`查看大图：${item.caption ?? item.title}`}
                    className="block w-full cursor-zoom-in"
                  >
                    <PhotoSlot spec={item} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 当前图片信息 */}
        <div className="absolute bottom-24 left-0 right-0 text-center">
          <h3 className="font-serif text-2xl text-paper">{currentItem?.caption ?? currentItem?.title}</h3>
          <p className="mt-2 text-sm text-muted">{currentItem?.hint}</p>
        </div>

        {/* 滚动提示 */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2 text-xs text-faint">
            <span>向下滚动探索</span>
            <svg
              className="h-4 w-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* 灯箱 */}
      <Lightbox
        items={valid}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
