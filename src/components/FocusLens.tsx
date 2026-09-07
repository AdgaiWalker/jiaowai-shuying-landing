import { useEffect, useRef, useState } from "react";

/**
 * 微单大光圈·实时物理对焦镜 (FocusLens)
 * 
 * 摄影美学与交互因果：
 * 1. 物理弹簧跟焦：光标移动时，对焦环带真实重型光学玻璃的质量惯性（Lerp 阻尼跟移），绝非机械粘鼠；
 * 2. 动态取景器 HUD：实时动态测光（根据鼠标移动速度计算自适应快门 1/125s ~ 1/2000s、ISO 与 EV 补偿）；
 * 3. 合焦锁定反馈 (AF Lock)：掠过照片/作品区域时，对焦括号自动收缩聚拢、绿/红合焦点亮起并显示焦距刻度；
 * 4. 快门按压打击感 (Shutter Release)：点击鼠标时对焦框物理压紧，极短曝光闪烁，确认感拉满；
 * 5. 纯净不干扰：文字区自动收敛淡出，仅桌面精细指针生效，触屏端静默。
 */
export function FocusLens() {
  const [enabled, setEnabled] = useState(false);
  const [locked, setLocked] = useState(false);
  const [shutter, setShutter] = useState(false);
  const [exif, setExif] = useState({
    shutterSpeed: "1/500s",
    aperture: "f/1.4",
    iso: "100",
    focal: "35mm",
    status: "AF-C",
  });

  const mousePos = useRef({ x: -100, y: -100 });
  const lensPos = useRef({ x: -100, y: -100 });
  const lensRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef(performance.now());
  const lastMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // 仅在支持鼠标悬停的精细指针设备且未减弱动态时启用
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduceMotion) return;

    setEnabled(true);

    let frameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // 智能探测光标下方是否为照片、展廊或证书卡片
      const target = e.target as HTMLElement | null;
      const isPhoto = !!target?.closest("img, picture, [role='img'], #works, .scroll-stack-card, canvas");
      setLocked(isPhoto);

      // 计算鼠标瞬间速度，模拟相机的动态快门测光
      const now = performance.now();
      const dt = now - lastTimeRef.current || 16;
      const dist = Math.hypot(e.clientX - lastMouseRef.current.x, e.clientY - lastMouseRef.current.y);
      const speed = dist / dt; // px/ms

      lastTimeRef.current = now;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };

      if (speed > 1.8) {
        setExif({
          shutterSpeed: "1/2000s",
          aperture: "f/1.4",
          iso: "400",
          focal: isPhoto ? "85mm" : "35mm",
          status: "AF-TRACKING",
        });
      } else if (speed > 0.6) {
        setExif({
          shutterSpeed: "1/800s",
          aperture: "f/1.8",
          iso: "200",
          focal: isPhoto ? "50mm" : "35mm",
          status: "AF-C",
        });
      } else {
        setExif({
          shutterSpeed: "1/250s",
          aperture: isPhoto ? "f/1.2" : "f/2.8",
          iso: "100",
          focal: isPhoto ? "50mm" : "35mm",
          status: isPhoto ? "AF-LOCK [●]" : "AF-S",
        });
      }
    };

    const onMouseDown = () => {
      setShutter(true);
      setTimeout(() => setShutter(false), 90);
    };

    // 60fps 弹簧惯性跟移 (Lerp Damping)
    const animate = () => {
      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;

      // 光学重镜片阻尼：0.18
      lensPos.current.x += (targetX - lensPos.current.x) * 0.18;
      lensPos.current.y += (targetY - lensPos.current.y) * 0.18;

      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${lensPos.current.x}px, ${lensPos.current.y}px, 0)`;
      }

      frameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      cancelAnimationFrame(frameId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* 快门感光闪光 (单次点击触发 80ms 微瞬闪) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-50 bg-paper transition-opacity ease-out duration-75 ${
          shutter ? "opacity-15" : "opacity-0"
        }`}
      />

      {/* 物理对焦透镜与取景器 HUD */}
      <div
        ref={lensRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 will-change-transform"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        {/* 对焦透镜主体 */}
        <div
          className={`relative -left-1/2 -top-1/2 flex items-center justify-center rounded-full transition-all duration-200 ease-out ${
            locked
              ? "size-28 border border-accent/70 bg-accent/[0.03] shadow-[0_0_24px_rgba(229,72,77,0.25)]"
              : "size-14 border border-paper/30 bg-transparent opacity-40"
          } ${shutter ? "scale-90 border-paper" : "scale-100"}`}
        >
          {/* 对焦框四个角标 [  ] */}
          <div
            className={`absolute inset-2 flex flex-col justify-between transition-transform duration-200 ${
              locked ? "scale-100" : "scale-75 opacity-60"
            }`}
          >
            <div className="flex justify-between">
              <span className={`size-2 border-l-2 border-t-2 ${locked ? "border-accent" : "border-paper/60"}`} />
              <span className={`size-2 border-r-2 border-t-2 ${locked ? "border-accent" : "border-paper/60"}`} />
            </div>
            <div className="flex justify-between">
              <span className={`size-2 border-b-2 border-l-2 ${locked ? "border-accent" : "border-paper/60"}`} />
              <span className={`size-2 border-b-2 border-r-2 ${locked ? "border-accent" : "border-paper/60"}`} />
            </div>
          </div>

          {/* 中心精准测距准星 */}
          <div
            className={`size-1.5 rounded-full transition-colors duration-150 ${
              shutter ? "bg-paper scale-150" : locked ? "bg-accent shadow-[0_0_8px_#e5484d]" : "bg-paper/40"
            }`}
          />

          {/* 焦距毫米刻度圈 (合焦时显现) */}
          {locked && (
            <div className="absolute -inset-1.5 animate-spin-slow rounded-full border border-dashed border-paper/20" />
          )}
        </div>

        {/* 悬浮在取景器旁侧的精密 EXIF 测光仪表板 */}
        <div
          ref={hudRef}
          className={`absolute left-8 top-3 select-none whitespace-nowrap rounded-none border border-line bg-ink/90 px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-paper/90 backdrop-blur transition-all duration-200 ${
            locked ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-accent font-semibold">
              <span className="size-1.5 rounded-full bg-accent animate-ping" />
              {exif.status}
            </span>
            <span className="text-faint">|</span>
            <span className="text-paper">{exif.focal}</span>
            <span className="text-muted">{exif.aperture}</span>
            <span className="text-muted">{exif.shutterSpeed}</span>
            <span className="text-muted">ISO {exif.iso}</span>
          </div>
          <div className="mt-0.5 flex items-center justify-between text-[9px] text-faint">
            <span>焦外述影 · 镜头取景中</span>
            <span className="text-accent/80">单击击发快门</span>
          </div>
        </div>
      </div>
    </>
  );
}
