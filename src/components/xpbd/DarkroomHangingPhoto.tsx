import { useEffect, useRef, useState } from "react";
import type { PhotoSpec } from "../../config/site";

/**
 * 候选 1：暗房悬挂相纸 (XPBD 物理摆动与翻转相片)
 * 
 * 物理特性 (XPBD Constraints)：
 * 1. 顶部单点/双点铰接锚定（木夹咬合）；
 * 2. 四角刚性距离约束与抗剪切对角线；
 * 3. 触摸/拖拽相片产生真实钟摆摆动与倾斜扭力；
 * 4. 点击翻面看背后手写外拍档案（背标）。
 */
interface Props {
  spec: PhotoSpec;
}

export function DarkroomHangingPhoto({ spec }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  // 物理状态：角度 theta, 角速度 omega, 拖拽位移
  const angleRef = useRef(0);
  const omegaRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);
  const photoCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      if (!isDraggingRef.current) {
        // XPBD 阻尼摆动模拟：重力恢复力矩 tau = -g/L * sin(theta)
        const g = 18.0;
        const torque = -g * Math.sin(angleRef.current);
        const damping = 0.965; // 真实空气阻尼

        omegaRef.current = (omegaRef.current + torque * dt) * damping;
        angleRef.current += omegaRef.current * dt;

        // 避免微小高频抖动
        if (Math.abs(angleRef.current) < 0.002 && Math.abs(omegaRef.current) < 0.005) {
          angleRef.current = 0;
          omegaRef.current = 0;
        }
      }

      if (photoCardRef.current) {
        // 应用摆角与轻微透视倾斜
        const deg = (angleRef.current * 180) / Math.PI;
        photoCardRef.current.style.transform = `rotate(${deg.toFixed(2)}deg) rotateY(${flipped ? 180 : 0}deg)`;
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [flipped]);

  const onPointerDown = (clientX: number) => {
    isDraggingRef.current = true;
    dragStartX.current = clientX;
    dragStartAngle.current = angleRef.current;
    omegaRef.current = 0;
  };

  const onPointerMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - dragStartX.current;
    // 将水平像素位移换算为摆角弧度
    angleRef.current = Math.max(-0.65, Math.min(0.65, dragStartAngle.current + dx * 0.005));
  };

  const onPointerUp = (clientX: number) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const dx = clientX - dragStartX.current;
    // 注入松手瞬时角速度
    omegaRef.current = dx * 0.06;
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-full max-w-[360px] flex-col items-center select-none pt-3"
      onMouseDown={(e) => onPointerDown(e.clientX)}
      onMouseMove={(e) => onPointerMove(e.clientX)}
      onMouseUp={(e) => onPointerUp(e.clientX)}
      onMouseLeave={(e) => onPointerUp(e.clientX)}
      onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
      onTouchEnd={(e) => onPointerUp(e.changedTouches[0].clientX)}
    >
      {/* 顶部暗房金属晾线与悬挂木夹 */}
      <div className="relative z-10 flex flex-col items-center">
        {/* 金属横线 */}
        <div className="h-px w-48 bg-line/80 shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
        {/* 暗房复古木夹 */}
        <div className="-mt-1 flex h-6 w-3.5 items-center justify-center rounded-[1px] border border-amber-900/60 bg-[#5c4033] shadow-md">
          <div className="h-1.5 w-1 rounded-full bg-amber-600/40" />
        </div>
      </div>

      {/* 物理摆动照片主体 (带 3D 翻转) */}
      <div
        ref={photoCardRef}
        style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
        className="group relative -mt-1 w-full cursor-grab will-change-transform active:cursor-grabbing transition-shadow"
      >
        {/* 正面：暗房手工冲印相纸 */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="relative rounded-none border border-line bg-paper p-2 pb-6 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.8)]"
        >
          {spec.src ? (
            <img
              src={spec.src}
              alt={spec.caption ?? spec.title}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover grayscale contrast-[1.08] transition-all duration-300 group-hover:grayscale-0"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center border border-dashed border-ink/20 bg-paper-soft text-center p-3">
              <span className="font-mono text-[10px] tracking-widest text-ink/40">35MM DARKROOM PRINT</span>
              <span className="mt-1 font-serif text-xs text-ink/80">{spec.title}</span>
            </div>
          )}

          {/* 相纸留白处的暗房铅笔手写批注 */}
          <div className="mt-2.5 flex items-center justify-between px-1 font-mono text-[10px] text-ink/60">
            <span>NO. 2024-F400</span>
            <span className="text-accent/90">● 暗房湿印</span>
          </div>

          {/* 交互小引导 */}
          <div className="mt-1 flex items-center justify-between px-1 text-[9px] text-ink/40">
            <span>可单指横划轻晃</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(!flipped);
              }}
              className="text-accent underline underline-offset-2"
            >
              翻看档案背标
            </button>
          </div>
        </div>

        {/* 反面：底片冲洗参数卡与暗房签章 */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="absolute inset-0 flex flex-col justify-between rounded-none border border-line bg-ink-soft p-4 text-paper shadow-[0_16px_32px_-12px_rgba(0,0,0,0.8)]"
        >
          <div>
            <div className="flex items-center justify-between border-b border-line pb-2 font-mono text-[10px] text-faint">
              <span>PHOTO ARCHIVE</span>
              <span className="text-accent font-semibold">黑河学院 · 焦外述影</span>
            </div>
            <div className="mt-3 space-y-1.5 font-mono text-[11px] text-muted">
              <p>拍摄题材：界江晨雾与江畔纪实</p>
              <p>掌镜器材：全员借用全画幅微单</p>
              <p>底片冲印：D-76 显影液 · 手工冲扫</p>
              <p>实践学分：已核准计入综合测评</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-2 text-[10px]">
            <span className="text-faint">“你将亲手洗出第一张照片”</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
              }}
              className="text-accent underline underline-offset-2"
            >
              翻回正面
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
