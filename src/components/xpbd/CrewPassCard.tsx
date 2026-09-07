import { useEffect, useRef, useState } from "react";
import type { PhotoSpec } from "../../config/site";

/**
 * 候选 4：官方规格工作牌双面物理翻转卡 (CrewPassCard)
 * 
 * 物理特性 (XPBD Constraints)：
 * 1. 顶部挂绳双点悬吊（吊带 V 型约束）；
 * 2. 真实工牌悬垂摆动阻尼与惯性倾斜；
 * 3. 正反双面：正面为摄影跟组工作证 (CREW PASS)，反面为团省委/校级获奖证书原件；
 * 4. 交互：单指拖拽晃动、翻面查看、点击证书放大检视。
 */
interface Props {
  awardImage: PhotoSpec;
  onOpenZoom: () => void;
}

export function CrewPassCard({ awardImage, onOpenZoom }: Props) {
  const [flipped, setFlipped] = useState(false);

  // 摆动物理量
  const angleRef = useRef(0);
  const omegaRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      if (!isDraggingRef.current) {
        // 重力摆动恢复力矩
        const g = 16.0;
        const torque = -g * Math.sin(angleRef.current);
        const damping = 0.96;

        omegaRef.current = (omegaRef.current + torque * dt) * damping;
        angleRef.current += omegaRef.current * dt;

        if (Math.abs(angleRef.current) < 0.002 && Math.abs(omegaRef.current) < 0.005) {
          angleRef.current = 0;
          omegaRef.current = 0;
        }
      }

      if (cardRef.current) {
        const deg = (angleRef.current * 180) / Math.PI;
        cardRef.current.style.transform = `rotate(${deg.toFixed(2)}deg) rotateY(${flipped ? 180 : 0}deg)`;
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
    angleRef.current = Math.max(-0.55, Math.min(0.55, dragStartAngle.current + dx * 0.005));
  };

  const onPointerUp = (clientX: number) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const dx = clientX - dragStartX.current;
    omegaRef.current = dx * 0.05;
  };

  return (
    <div
      className="relative mt-4 flex w-full flex-col items-center select-none pt-2"
      onMouseDown={(e) => onPointerDown(e.clientX)}
      onMouseMove={(e) => onPointerMove(e.clientX)}
      onMouseUp={(e) => onPointerUp(e.clientX)}
      onMouseLeave={(e) => onPointerUp(e.clientX)}
      onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
      onTouchEnd={(e) => onPointerUp(e.changedTouches[0].clientX)}
    >
      {/* 顶部织物挂带与金属卡扣 */}
      <div className="relative z-10 flex flex-col items-center">
        {/* V 型红色摄影编织带 */}
        <div className="flex gap-4">
          <div className="h-6 w-1.5 -rotate-12 bg-accent/80 shadow-sm" />
          <div className="h-6 w-1.5 rotate-12 bg-accent/80 shadow-sm" />
        </div>
        {/* 哑光黑金属扣环 */}
        <div className="-mt-1 flex size-5 items-center justify-center rounded-full border border-line bg-ink-soft shadow">
          <div className="size-2 rounded-full border border-paper/40" />
        </div>
      </div>

      {/* 物理摆动工作卡主体 (双面翻转) */}
      <div
        ref={cardRef}
        style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
        className="relative -mt-1 w-full max-w-sm cursor-grab will-change-transform active:cursor-grabbing transition-shadow"
      >
        {/* 正面：官方盛会摄制组工作证 */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="relative rounded-none border border-line bg-ink p-4 text-paper shadow-[0_20px_40px_-15px_rgba(0,0,0,0.9)]"
        >
          {/* 挂孔 */}
          <div className="mx-auto -mt-2 mb-3 h-2 w-8 rounded-full bg-ink-soft border border-line" />

          <div className="flex items-start justify-between border-b border-line pb-3">
            <div>
              <p className="font-mono text-[10px] tracking-widest text-accent">CREW PASS · 摄制工作证</p>
              <h4 className="mt-0.5 font-serif text-lg font-semibold tracking-wide">全校重大盛会记录资格</h4>
            </div>
            <span className="rounded-none border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[9px] text-accent">
              官方直发
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px] text-muted">
            <div>
              <span className="text-[10px] text-faint">认证归属</span>
              <p className="text-paper">黑河学院 · 焦外述影</p>
            </div>
            <div>
              <span className="text-[10px] text-faint">准入权限</span>
              <p className="text-paper">前排内场掌镜拍摄</p>
            </div>
          </div>

          {/* 底部条形码与翻面按钮 */}
          <div className="mt-4 flex items-center justify-between border-t border-line pt-2.5">
            <div className="space-y-0.5">
              {/* 模拟条形码 */}
              <div className="flex h-4 items-end gap-[2px]">
                {[4, 8, 2, 7, 5, 9, 3, 6, 8, 4, 7, 2, 6, 9].map((h, i) => (
                  <span key={i} style={{ height: `${h * 1.5}px` }} className="w-[1.5px] bg-paper/60" />
                ))}
              </div>
              <p className="font-mono text-[8px] text-faint">NO. JH-2024-OFFICIAL</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(true);
              }}
              className="border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[10px] text-accent transition-colors hover:bg-accent hover:text-ink"
            >
              翻看背面聘书证书 →
            </button>
          </div>
        </div>

        {/* 反面：团省委与校级表彰证书大图预览 */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="absolute inset-0 flex flex-col justify-between rounded-none border border-line bg-ink p-3 text-paper shadow-[0_20px_40px_-15px_rgba(0,0,0,0.9)]"
        >
          <div className="flex items-center justify-between border-b border-line pb-1.5">
            <span className="font-mono text-[10px] text-accent">HONOR & CERTIFICATION</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
              }}
              className="text-muted text-[10px] underline underline-offset-2 hover:text-paper"
            >
              ← 翻回工作证
            </button>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenZoom();
            }}
            className="group relative my-2 flex-1 cursor-zoom-in overflow-hidden border border-line"
          >
            {awardImage.src ? (
              <img
                src={awardImage.src}
                alt="荣誉证书"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center bg-ink/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="bg-ink/80 px-2 py-1 font-mono text-[10px] text-paper">点击查看全屏大图</span>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[9px] text-faint">
            <span>黑龙江团省委 · 先进集体红印证书</span>
            <span className="text-accent cursor-pointer" onClick={onOpenZoom}>点开可放大检视公章</span>
          </div>
        </div>
      </div>
    </div>
  );
}
