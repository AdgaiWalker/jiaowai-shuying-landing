import { SpeakerHigh, SpeakerSlash, ArrowsOutSimple } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { Lightbox } from "./Lightbox";
import { featuredVideo } from "../config/site";

/**
 * 精选短片内联播放：微信内置浏览器要求静音 + playsinline 才能自动起播，
 * 默认静音循环，点击按钮开声。右下角「放大」按钮可全屏查看（Lightbox）。
 */
export function InlineVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
    <>
      <div className="relative border border-line bg-ink-soft">
        <video
          ref={(el) => {
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
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="全屏查看视频"
            className="flex size-10 items-center justify-center border border-paper/30 bg-ink/70 text-paper backdrop-blur transition-transform duration-100 active:scale-90"
          >
            <ArrowsOutSimple size={18} weight="regular" aria-hidden />
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "开启声音" : "静音"}
            className="flex size-10 items-center justify-center border border-paper/30 bg-ink/70 text-paper backdrop-blur transition-transform duration-100 active:scale-90"
          >
            {muted ? (
              <SpeakerSlash size={18} weight="regular" aria-hidden />
            ) : (
              <SpeakerHigh size={18} weight="regular" aria-hidden />
            )}
          </button>
        </div>
      </div>
      <Lightbox
        items={[{ src: featuredVideo.video, type: "video", caption: "动态影像作品", hint: featuredVideo.hint }]}
        index={lightboxOpen ? 0 : null}
        onClose={() => setLightboxOpen(false)}
        onNavigate={() => {}}
      />
    </>
  );
}
