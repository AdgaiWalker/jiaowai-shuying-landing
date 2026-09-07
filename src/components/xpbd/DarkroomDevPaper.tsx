import { useState, useRef, useEffect } from "react";
import { Sparkle, Drop, ArrowCounterClockwise, CheckCircle } from "@phosphor-icons/react";
import type { QrItem } from "../../config/site";

interface DarkroomDevPaperProps {
  primary: QrItem;
}

/**
 * 候选 2：暗房显影浸盘与潜影相纸 (DarkroomDevPaper)
 * 
 * 物理特性 (XPBD Constraints)：
 * 1. 显影夹 A 与相纸 B 的质点悬挂与浮力/流体阻尼：
 *    用户按住相纸或夹子在显影液中划动或向上提拉，相纸受流体阻尼(submerged damping)和回弹力影响；
 * 2. 交互 A 驱动化学显影反应 B：
 *    拖拽晃动（Agitation）或提拉相纸，显影液化学催化，相纸由未曝光的银盐潜影逐步显影出清晰的微信群二维码；
 * 3. 微信兼容性：显影后为真实标准 <img> 标签，支持微信长按扫码识别。
 */
export function DarkroomDevPaper({ primary }: DarkroomDevPaperProps) {
  // 显影进度 0 ~ 100
  const [devProgress, setDevProgress] = useState(35); // 初始部分显影，给用户即视感
  const [isFullyDeveloped, setIsFullyDeveloped] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // XPBD 物理悬浮与倾角
  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const angleRef = useRef(0);
  const angleVelRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const paperCardRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);

  // 物理动画循环
  useEffect(() => {
    let frameId: number;

    const animate = () => {
      if (!isDraggingRef.current) {
        // XPBD 浮力与弹性恢复力：回到中心 (0, 0)
        const kSpring = 0.08;
        const damping = 0.86;

        const fx = -posRef.current.x * kSpring;
        const fy = -posRef.current.y * kSpring;

        velRef.current.x = (velRef.current.x + fx) * damping;
        velRef.current.y = (velRef.current.y + fy) * damping;

        posRef.current.x += velRef.current.x;
        posRef.current.y += velRef.current.y;

        // 角度自然恢复
        const fAngle = -angleRef.current * 0.06;
        angleVelRef.current = (angleVelRef.current + fAngle) * 0.88;
        angleRef.current += angleVelRef.current;
      }

      if (paperCardRef.current) {
        const { x, y } = posRef.current;
        const rot = angleRef.current;
        paperCardRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`;
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // 增加显影液水花涟漪
  const addRipple = (clientX: number, clientY: number) => {
    if (!trayRef.current) return;
    const rect = trayRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev.slice(-4), { id, x, y }]);
  };

  // 触控/鼠标交互
  const handlePointerDown = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    startPointerRef.current = { x: clientX, y: clientY };
    startPosRef.current = { ...posRef.current };
    velRef.current = { x: 0, y: 0 };
    addRipple(clientX, clientY);
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - startPointerRef.current.x;
    const dy = clientY - startPointerRef.current.y;

    // 限幅物理拖动范围
    const clampedX = Math.max(-40, Math.min(40, startPosRef.current.x + dx));
    const clampedY = Math.max(-30, Math.min(30, startPosRef.current.y + dy));

    posRef.current = { x: clampedX, y: clampedY };
    angleRef.current = (clampedX / 40) * 8; // 倾角随横向晃动微变

    // 晃动加速化学显影 (Agitation)
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 10) {
      setDevProgress((prev) => {
        const next = Math.min(100, prev + 1.2);
        if (next >= 100) setIsFullyDeveloped(true);
        return next;
      });
      if (Math.random() < 0.2) {
        addRipple(clientX, clientY);
      }
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // 快速完全显影
  const handleQuickReveal = () => {
    setDevProgress(100);
    setIsFullyDeveloped(true);
  };

  // 重置回暗房潜影
  const handleReset = () => {
    setDevProgress(25);
    setIsFullyDeveloped(false);
  };

  return (
    <div
      ref={trayRef}
      className="relative overflow-hidden border border-accent/40 bg-gradient-to-b from-[#180909] to-[#0d0404] p-4 md:p-6 select-none shadow-[inset_0_0_40px_rgba(229,72,77,0.12)]"
    >
      {/* 暗房红光安全灯标线 */}
      <div className="flex items-center justify-between border-b border-accent/20 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-accent text-[11px] uppercase tracking-wider">
            暗房显影盘 · KODAK D-76 (20°C)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={isFullyDeveloped ? handleReset : handleQuickReveal}
            className="flex items-center gap-1 border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] text-accent transition-colors hover:bg-accent/20 active:scale-95"
          >
            {isFullyDeveloped ? (
              <>
                <ArrowCounterClockwise size={12} />
                <span>重新显影</span>
              </>
            ) : (
              <>
                <Sparkle size={12} />
                <span>一键完全显像</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 液面涟漪物理渲染层 */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40 animate-ping opacity-40"
          style={{ left: r.x, top: r.y }}
        />
      ))}

      {/* 交互主体：竹镊 (A) 夹持相纸 (B) */}
      <div className="mt-4 flex flex-col items-center justify-center">
        {/* 顶部竹制显影夹 (Print Tongs / Clip) */}
        <div className="relative z-10 -mb-2 flex flex-col items-center cursor-grab active:cursor-grabbing">
          <div className="h-6 w-3 rounded-t-sm border border-accent/40 bg-amber-900/80 shadow-md flex flex-col justify-center items-center">
            <div className="h-2 w-1 bg-amber-200/40 rounded-full" />
          </div>
          <span className="font-mono text-[9px] text-accent/80 tracking-widest uppercase">
            [竹木显影夹 · 晃动/提拉]
          </span>
        </div>

        {/* 浸润在显影液中的相纸 (B) */}
        <div
          ref={paperCardRef}
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={handlePointerUp}
          className="relative mt-2 w-full max-w-sm border border-stone-600/60 bg-[#fbf9f5] p-4 text-stone-900 shadow-2xl transition-shadow cursor-grab active:cursor-grabbing"
          style={{
            // 随着显影度上升，相纸边缘与质感变化
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.8), 0 0 15px rgba(229,72,77,0.15)",
          }}
        >
          {/* 相纸顶部挂孔与暗房批号印戳 */}
          <div className="flex items-center justify-between border-b border-stone-300 pb-2 text-[10px] font-mono text-stone-500">
            <span>EMULSION #2026-BOKEH</span>
            <span className="text-accent font-semibold">
              {isFullyDeveloped ? "定影固化 · 100%" : `显影中 · ${Math.round(devProgress)}%`}
            </span>
          </div>

          {/* 相纸感光乳剂显像区域 (潜影 -> 银盐沉淀变黑) */}
          <div className="relative my-3 flex flex-col items-center justify-center">
            <div className="relative overflow-hidden rounded bg-stone-100 p-2">
              {/* 真实的二维码图片：保持真实 <img> 标签供微信长按扫码识别 */}
              {primary.src ? (
                <div className="relative">
                  <img
                    src={primary.src}
                    alt={`${primary.label}二维码`}
                    loading="eager"
                    className="size-44 sm:size-52 object-contain transition-all duration-300"
                    style={{
                      // 化学显影滤镜：0% 时乳白潜影，100% 时高对比黑白银盐
                      filter: `grayscale(100%) contrast(${(devProgress / 100) * 110 + 20}%) brightness(${
                        140 - (devProgress / 100) * 40
                      }%)`,
                      opacity: Math.max(0.2, devProgress / 100),
                    }}
                  />

                  {/* 显影未完成时的潜影乳剂遮罩 */}
                  {!isFullyDeveloped && (
                    <div
                      className="pointer-events-none absolute inset-0 bg-[#e8e4db] mix-blend-color transition-opacity"
                      style={{ opacity: 1 - devProgress / 100 }}
                    />
                  )}
                </div>
              ) : (
                <div className="flex size-44 sm:size-52 flex-col items-center justify-center border border-dashed border-stone-400 text-stone-500">
                  <Drop size={24} className="text-accent" />
                  <span className="text-xs mt-2">素材位：微信招新群</span>
                </div>
              )}
            </div>

            {/* 显影进度条 */}
            <div className="mt-3 w-full max-w-[200px]">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full bg-accent transition-all duration-150"
                  style={{ width: `${devProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* 相纸说明文字 */}
          <div className="text-center">
            <p className="font-serif text-base font-semibold text-stone-900">{primary.label}</p>
            <p className="mt-0.5 text-xs text-stone-600">{primary.note}</p>

            {/* 提示状态 */}
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white shadow">
              {isFullyDeveloped ? (
                <>
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span>已完全显像 · 长按二维码识别进群</span>
                </>
              ) : (
                <>
                  <Drop size={14} className="text-accent animate-pulse" />
                  <span>按住晃动相纸加速显影 · 或点上方直出</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 底部暗房注脚 */}
      <div className="mt-4 flex items-center justify-between text-[11px] text-muted border-t border-accent/15 pt-2 font-mono">
        <span>显影液温度：20.5°C 恒温</span>
        <span>定影液：已配齐 · 免洗即扫</span>
      </div>
    </div>
  );
}
