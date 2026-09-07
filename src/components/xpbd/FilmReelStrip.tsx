import { useState, useRef, useEffect } from "react";
import { ArrowsOutSimple, FilmSlate, Play } from "@phosphor-icons/react";
import { Lightbox } from "../Lightbox";
import { featuredVideo } from "../../config/site";

/**
 * 候选 3：35mm 机械过片分镜胶片帘 (FilmReelStrip)
 * 
 * 物理特性 (XPBD Constraints)：
 * 1. 胶片链条横向位移约束 (Chain Link Constraint)：每个分镜帧格由不可伸长链环连接；
 * 2. 机械过片拨盘 A 驱动分镜传送带 B：按住过片拨杆拉动，胶片带带齿孔位移，带有机械卡点惯性回弹；
 * 3. 点击任意分镜帧即可唤醒动态成片灯箱 / 播放器。
 */

interface ReelItem {
  id: number;
  title: string;
  tag: string;
  desc: string;
  img: string;
}

const frames: ReelItem[] = [
  {
    id: 1,
    title: "分镜 I · 界江破冰晨光",
    tag: "外拍实勘",
    desc: "零下30度黑龙江畔，使用长焦定格破冰瞬间的光线反差。",
    img: "/photos/work-night-fisher.jpg",
  },
  {
    id: 2,
    title: "分镜 II · 校园全景光影长卷",
    tag: "航拍摄影",
    desc: "高空俯瞰校园与界江林荫大道，捕捉壮阔的几何明暗。",
    img: "/photos/work-city-panorama.jpg",
  },
  {
    id: 3,
    title: "分镜 III · 胶片研习手工冲印",
    tag: "暗房研习",
    desc: "安全红光灯下相纸浸润显影液，手把手带练成片显像。",
    img: "/photos/about-autumn-path.jpg",
  },
  {
    id: 4,
    title: "分镜 IV · 校级盛会纪录长片",
    tag: "微电影跟组",
    desc: "持有前排工作凭证，双机位协同完成大型活动全流程跟拍。",
    img: "/photos/hero-1.jpg",
  },
];

export function FilmReelStrip() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // XPBD 物理滑动位置与速度
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const reelTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number;

    const animate = () => {
      if (!isDraggingRef.current) {
        // XPBD 弹簧吸附至当前 activeIdx 目标点
        const targetOffset = -activeIdx * 280;
        const diff = targetOffset - offsetRef.current;
        const springForce = diff * 0.12; // 弹性系数
        const damping = 0.85; // 阻尼

        velocityRef.current = (velocityRef.current + springForce) * damping;
        offsetRef.current += velocityRef.current;

        if (Math.abs(diff) < 0.2 && Math.abs(velocityRef.current) < 0.2) {
          offsetRef.current = targetOffset;
          velocityRef.current = 0;
        }
      }

      if (reelTrackRef.current) {
        reelTrackRef.current.style.transform = `translate3d(${offsetRef.current.toFixed(1)}px, 0, 0)`;
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [activeIdx]);

  const onPointerDown = (clientX: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    startOffsetRef.current = offsetRef.current;
    velocityRef.current = 0;
  };

  const onPointerMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - startXRef.current;
    offsetRef.current = startOffsetRef.current + dx;
  };

  const onPointerUp = (clientX: number) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const dx = clientX - startXRef.current;

    // 换算当前最近卡位
    if (dx < -40 && activeIdx < frames.length - 1) {
      setActiveIdx(activeIdx + 1);
    } else if (dx > 40 && activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
    }
  };

  const advanceReel = (dir: number) => {
    const next = Math.max(0, Math.min(frames.length - 1, activeIdx + dir));
    setActiveIdx(next);
  };

  const curFrame = frames[activeIdx];

  return (
    <div className="border border-line bg-ink-soft p-4 md:p-6 select-none">
      {/* 顶部机械过片舱顶头：带齿孔标尺与拨片指示器 */}
      <div className="flex items-center justify-between border-b border-line pb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FilmSlate size={18} className="text-accent shrink-0" />
          <span className="font-serif text-sm text-paper truncate">35mm 分镜胶片舱</span>
          <span className="font-mono text-xs text-faint shrink-0">
            [{activeIdx + 1}/{frames.length}]
          </span>
        </div>

        {/* 交互传动拨杆 (A)：点击或拖动直接驱动过片 */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden font-mono text-[10px] text-faint sm:inline">机械过片：</span>
          <div className="flex gap-1 border border-line bg-ink p-0.5 shrink-0">
            <button
              type="button"
              disabled={activeIdx === 0}
              onClick={() => advanceReel(-1)}
              className="px-2 py-1 font-mono text-xs whitespace-nowrap text-paper/80 transition-colors disabled:opacity-30 hover:bg-line/40 active:scale-95"
            >
              ◀ 倒片
            </button>
            <button
              type="button"
              disabled={activeIdx === frames.length - 1}
              onClick={() => advanceReel(1)}
              className="bg-accent px-2.5 py-1 font-mono text-xs whitespace-nowrap text-ink font-semibold transition-transform active:scale-95 disabled:opacity-40"
            >
              过片 ▶
            </button>
          </div>
        </div>
      </div>

      {/* 中部：35mm 胶片带传送轨 (XPBD 链式拖拽视窗) */}
      <div
        className="relative mt-4 h-48 w-full overflow-hidden border border-line bg-ink cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => onPointerDown(e.clientX)}
        onMouseMove={(e) => onPointerMove(e.clientX)}
        onMouseUp={(e) => onPointerUp(e.clientX)}
        onMouseLeave={(e) => onPointerUp(e.clientX)}
        onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
        onTouchEnd={(e) => onPointerUp(e.changedTouches[0].clientX)}
      >
        {/* 上下两侧 35mm 真实齿孔排布带 */}
        <div className="pointer-events-none absolute inset-x-0 top-1 z-10 flex justify-between px-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="h-2 w-1.5 rounded-[1px] bg-paper/20" />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-1 z-10 flex justify-between px-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="h-2 w-1.5 rounded-[1px] bg-paper/20" />
          ))}
        </div>

        {/* 传送带粒子网格 (B) */}
        <div
          ref={reelTrackRef}
          className="absolute left-1/2 top-4 flex gap-4 will-change-transform"
          style={{ marginLeft: "-130px" }}
        >
          {frames.map((f, i) => (
            <div
              key={f.id}
              onClick={() => {
                if (activeIdx === i) setLightboxOpen(true);
                else setActiveIdx(i);
              }}
              className={`relative h-40 w-64 shrink-0 overflow-hidden border transition-all duration-200 ${
                activeIdx === i
                  ? "border-accent shadow-[0_0_24px_rgba(229,72,77,0.3)] opacity-100 scale-100"
                  : "border-line opacity-45 scale-95"
              }`}
            >
              <img src={f.img} alt={f.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-baseline justify-between text-paper">
                <span className="font-serif text-xs truncate">{f.title}</span>
                <span className="font-mono text-[9px] text-accent">0{i + 1}</span>
              </div>

              {/* 当前激活帧播放标记 */}
              {activeIdx === i && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-accent/90 text-ink shadow-lg transition-transform hover:scale-110">
                    <Play size={16} weight="fill" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 底部：当前分镜阐述与全屏查看 */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-3">
        <div>
          <p className="font-serif text-sm text-paper">{curFrame.title}</p>
          <p className="mt-0.5 text-xs text-muted leading-relaxed">{curFrame.desc}</p>
        </div>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="flex items-center gap-1.5 border border-line bg-ink px-3 py-1.5 text-xs text-paper transition-colors hover:border-accent hover:text-accent"
        >
          <ArrowsOutSimple size={14} />
          <span>全屏看成片 / 剧照</span>
        </button>
      </div>

      <Lightbox
        items={[
          featuredVideo.video
            ? { type: "video", src: featuredVideo.video, caption: curFrame.title, hint: curFrame.desc }
            : { src: curFrame.img, title: curFrame.title, caption: curFrame.desc, hint: curFrame.desc, spec: "35mm", ratio: "3/2" },
        ]}
        index={lightboxOpen ? 0 : null}
        onClose={() => setLightboxOpen(false)}
        onNavigate={() => {}}
      />
    </div>
  );
}
