import { useEffect, useRef, useState } from "react";
import { ArrowsOutSimple, Play, SealCheck } from "@phosphor-icons/react";
import type { EndorsementItem } from "../../config/site";

/**
 * 官方规格工作牌双面物理翻转卡 (CrewPassCard)
 * 
 * 物理特性 (XPBD Constraints)：
 * 1. 顶部挂绳双点悬吊（吊带 V 型约束）；
 * 2. 真实工牌悬垂摆动阻尼与惯性倾斜；
 * 3. 正反双面：正面为摄影跟组工作证 (CREW PASS)，反面为省里转发/校统战部/黑河日报权威背书；
 * 4. 交互：单指拖拽晃动、翻面查看、多级权威切换、点击视频播放或大图放大检视。
 */
interface Props {
  endorsements: EndorsementItem[];
  selectedIndex: number;
  onSelectEndorsement: (idx: number) => void;
  onOpenEndorsement: (idx: number) => void;
}

export function CrewPassCard({
  endorsements,
  selectedIndex,
  onSelectEndorsement,
  onOpenEndorsement,
}: Props) {
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

  const curItem = endorsements[selectedIndex] ?? endorsements[0];

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

          {/* 核心背书徽章提示 */}
          <div className="mt-3 flex items-center gap-1.5 rounded-none border border-line/70 bg-ink-soft/80 px-2 py-1 text-[10px] font-mono text-faint">
            <SealCheck size={14} className="text-accent shrink-0" />
            <span className="truncate">黑龙江团省委转发 · 黑河日报专版 · 校统战部表彰</span>
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
              翻看省里转发与证书 ({endorsements.length}件) →
            </button>
          </div>
        </div>

        {/* 反面：省里转发视频、校级证书与党媒专访多维权威背书 */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="absolute inset-0 flex flex-col justify-between rounded-none border border-line bg-ink p-3 text-paper shadow-[0_20px_40px_-15px_rgba(0,0,0,0.9)]"
        >
          <div className="flex items-center justify-between border-b border-line pb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-accent">CREDENTIALS</span>
              <span className="font-mono text-[9px] text-faint">/ 权威背书原件</span>
            </div>
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

          {/* 4 项背书微型切换标签 */}
          <div className="mt-1.5 grid grid-cols-2 gap-1">
            {endorsements.map((e, idx) => (
              <button
                key={e.id}
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onSelectEndorsement(idx);
                }}
                className={`flex items-center justify-between px-1.5 py-1 text-[9px] font-mono border transition-colors ${
                  selectedIndex === idx
                    ? "border-accent bg-accent/20 text-paper font-semibold"
                    : "border-line/70 bg-ink-soft/40 text-muted hover:text-paper"
                }`}
              >
                <span className="truncate">{e.badge}</span>
                <span className="text-[8px] text-accent/80">0{idx + 1}</span>
              </button>
            ))}
          </div>

          {/* 核心检视视窗：支持视频海报 + 播放徽标 或 证书大图 + 放大检视 */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenEndorsement(selectedIndex);
            }}
            className="group relative my-1.5 flex-1 cursor-pointer overflow-hidden border border-line bg-ink-soft flex items-center justify-center min-h-[110px]"
          >
            {curItem.type === "video" ? (
              <>
                <img
                  src={curItem.poster}
                  alt={curItem.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/30 transition-colors group-hover:bg-ink/10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <div className="flex size-9 items-center justify-center rounded-full bg-accent/90 text-ink shadow-lg transition-transform group-hover:scale-110">
                    <Play size={14} weight="fill" />
                  </div>
                  <span className="bg-ink/90 px-2 py-0.5 font-mono text-[9px] text-paper">
                    播放官方转发原片
                  </span>
                </div>
              </>
            ) : (
              <>
                <img
                  src={curItem.src}
                  alt={curItem.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-ink/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex items-center gap-1 bg-ink/90 px-2 py-1 font-mono text-[10px] text-paper">
                    <ArrowsOutSimple size={12} />
                    <span>全屏检视公章与原件</span>
                  </div>
                </div>
              </>
            )}
            {/* 左上角层级角标 */}
            <span className="absolute left-1.5 top-1.5 bg-ink/85 border border-line px-1.5 py-0.5 font-mono text-[8px] text-accent">
              {curItem.level}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-line/60 pt-1 font-mono text-[9px] text-faint">
            <span className="truncate max-w-[210px] text-paper/85">{curItem.title}</span>
            <span
              className="text-accent cursor-pointer shrink-0 hover:underline"
              onClick={() => onOpenEndorsement(selectedIndex)}
            >
              {curItem.type === "video" ? "观看视频 ▶" : "查看大图 →"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
