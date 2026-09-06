import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { featuredVideo } from "../config/site";

/**
 * 精选短片内联播放：微信内置浏览器要求静音 + playsinline 才能自动起播，
 * 默认静音循环，点击按钮开声。无视频素材时显示规格标注的占位框。
 */
export function InlineVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  if (!featuredVideo.video) {
    return (
      <div
        role="img"
        aria-label="素材位：精选短片"
        className="flex aspect-video w-full flex-col items-center justify-center gap-1.5 border border-dashed border-faint/70 bg-ink-soft/70 px-4 text-center"
      >
        <span className="text-[10px] tracking-[0.3em] text-faint">素材位</span>
        <span className="font-serif text-sm text-paper">精选短片</span>
        <span className="text-xs text-muted">建议放：{featuredVideo.hint}</span>
        <span className="text-[11px] text-faint">规格：{featuredVideo.spec}</span>
        <span className="text-[11px] text-faint">放 public/videos/showreel.mp4，封面 showreel-poster.jpg</span>
      </div>
    );
  }

  return (
    <div className="relative border border-line bg-ink-soft">
      <video
        ref={(el) => {
          // React 对 muted 属性的历史问题：插入 DOM 前显式置静音，保证微信内自动起播
          if (el) el.muted = true;
          videoRef.current = el;
        }}
        src={featuredVideo.video}
        poster={featuredVideo.poster ?? undefined}
        muted={muted}
        loop
        autoPlay
        playsInline
        preload="metadata"
        className="aspect-video w-full object-cover"
      />
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "开启声音" : "静音"}
        className="absolute bottom-3 right-3 flex size-10 items-center justify-center border border-paper/30 bg-ink/70 text-paper backdrop-blur"
      >
        {muted ? (
          <SpeakerSlash size={18} weight="regular" aria-hidden />
        ) : (
          <SpeakerHigh size={18} weight="regular" aria-hidden />
        )}
      </button>
    </div>
  );
}
