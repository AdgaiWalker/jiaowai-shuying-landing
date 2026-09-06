import { useEffect, useRef, useState } from "react";
import { Lightbox } from "../components/Lightbox";
import { PhotoSlot } from "../components/PhotoSlot";
import type { PhotoSpec } from "../config/site";

type SpiralGalleryProps = {
  items: PhotoSpec[];
  /** 螺旋圈数，默认 3 圈 */
  turns?: number;
  /** 螺旋半径（px） */
  radius?: number;
  /** 垂直总落差（px） */
  pitch?: number;
};

/**
 * 垂直螺旋画廊：
 * - 图片沿垂直螺旋线分布（像螺旋楼梯/ DNA 双螺旋）
 * - 滚动驱动螺旋旋转，图片沿轨道循环流动
 * - 始终只有当前图片在中心高亮，其余在螺旋臂上虚化
 * - 固定镜头 sticky，滚完后自然离开
 */
export function SpiralGallery({
  items,
  turns = 3,
  radius = 280,
  pitch = 900,
}: SpiralGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const valid = items.filter((i): i is PhotoSpec & { src: string } => !!i.src);

  if (valid.length === 0) return null;

  // 滚动驱动：0~1 进度映射到螺旋旋转角度
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = rect.height;

      // 当 section 顶部到达视口底部时开始，section 底部到达视口顶部时结束
      const start = viewportHeight;
      const end = -sectionHeight + viewportHeight;
      const current = rect.top;

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
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 当前高亮图片索引（循环）
  const activeIndex = Math.floor(progress * valid.length) % valid.length;

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${valid.length * 100}vh` }}>
      {/* 固定镜头 */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink-soft to-ink" />

        {/* 螺旋容器 */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: 1200, perspectiveOrigin: "50% 50%" }}
        >
          <div
            className="relative"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(0deg)",
            }}
          >
            {valid.map((item, i) => {
              // 垂直螺旋：角度沿圈数分布，y 从 -pitch/2 到 +pitch/2
              const baseAngle = (i / valid.length) * turns * Math.PI * 2;
              const y = (i / valid.length) * pitch - pitch / 2;

              // 滚动驱动：整个螺旋旋转
              const scrollAngle = baseAngle + progress * turns * Math.PI * 2;
              const finalX = Math.cos(scrollAngle) * radius;
              const finalZ = Math.sin(scrollAngle) * radius;

              // 当前图片高亮
              const isActive = i === activeIndex;
              const scale = isActive ? 1.2 : 0.7;
              const opacity = isActive ? 1 : 0.3;
              const blur = isActive ? 0 : 4;

              return (
                <div
                  key={item.src + i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                  style={{
                    transform: `translate3d(${finalX}px, ${y}px, ${finalZ}px) scale(${scale})`,
                    transformStyle: "preserve-3d",
                    zIndex: isActive ? 100 : 1,
                    width: "260px",
                    opacity,
                    filter: `blur(${blur}px)`,
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
        <div className="absolute bottom-32 left-0 right-0 text-center">
          <h3 className="font-serif text-3xl text-paper">{valid[activeIndex]?.caption ?? valid[activeIndex]?.title}</h3>
          <p className="mt-3 text-base text-muted">{valid[activeIndex]?.hint}</p>
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
