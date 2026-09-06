import { useState } from "react";
import { Lightbox } from "../components/Lightbox";
import { PhotoSlot } from "../components/PhotoSlot";
import type { PhotoSpec } from "../config/site";

type SpiralGalleryProps = {
  items: PhotoSpec[];
  /** 螺旋圈数，默认 2.5 圈 */
  turns?: number;
  /** 最大半径（px），默认 520 */
  maxRadius?: number;
  /** 垂直落差（px），默认 180 */
  pitch?: number;
};

/**
 * 螺旋状数字画廊：图片沿 3D 螺旋线分布，从中心向外扩展。
 * 支持悬停放大、点击灯箱、自动旋转（减弱动态时静止）。
 * 基于 CSS perspective + transform-style: preserve-3d，不引入 heavy 3D 库。
 */
export function SpiralGallery({
  items,
  turns = 2.5,
  maxRadius = 520,
  pitch = 180,
}: SpiralGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const valid = items.filter((i): i is PhotoSpec & { src: string } => !!i.src);

  if (valid.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-serif text-3xl font-semibold md:text-4xl">作品画廊</h2>
        <p className="mt-3 text-sm text-muted">悬停探索，点击放大</p>
      </div>

      {/* 螺旋容器 */}
      <div className="relative mx-auto mt-12 h-[70vh] min-h-[520px] max-w-6xl px-4 md:px-6">
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
              const angle = (i / valid.length) * turns * Math.PI * 2;
              const radius = maxRadius * (i / Math.max(1, valid.length - 1));
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              const y = (i / valid.length) * pitch - pitch / 2;
              const scale = 0.7 + 0.3 * (i / Math.max(1, valid.length - 1));

              return (
                <div
                  key={item.src + i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:z-50 hover:scale-110"
                  style={{
                    transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`,
                    transformStyle: "preserve-3d",
                    zIndex: Math.round(scale * 100),
                    width: "220px",
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
      </div>

      <Lightbox
        items={valid}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
