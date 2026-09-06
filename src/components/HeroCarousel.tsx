import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { heroMusic, heroSlides } from "../config/site";

const SLIDE_INTERVAL = 6000; // 每帧停留
const BLINK_IN = 150; // 快门落下（黑场合上）
const BLINK_HOLD = 140; // 黑场中的换帧
const MUSIC_KEY = "jiaowai-music";

/**
 * 首屏「一卷正在拍摄的胶片」：
 * 每帧停留 6 秒，切换时黑场一瞬（快门转场，无声；声音换成可选的背景音乐），
 * 右下角胶片帧格指示器可点击跳帧；喇叭按钮控制背景音乐（heroMusic 配置了音频才生效，
 * 偏好存 localStorage）。系统「减弱动态」时：不黑场、不缩放、不自动轮播。
 */
export function HeroCarousel() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [blink, setBlink] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const activeRef = useRef(0);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  const musicRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (heroMusic && localStorage.getItem(MUSIC_KEY) === "on") setMusicOn(true);
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const cut = useCallback(
    (next: number) => {
      if (busy.current || next === activeRef.current) return;
      activeRef.current = next;
      if (reduce) {
        setActive(next);
        return;
      }
      busy.current = true;
      setBlink(true);
      timers.current.push(window.setTimeout(() => setActive(next), BLINK_IN));
      timers.current.push(
        window.setTimeout(() => {
          setBlink(false);
          busy.current = false;
        }, BLINK_IN + BLINK_HOLD),
      );
    },
    [reduce],
  );

  useEffect(() => {
    if (heroSlides.length < 2 || reduce) return;
    const t = window.setInterval(() => cut((activeRef.current + 1) % heroSlides.length), SLIDE_INTERVAL);
    return () => window.clearInterval(t);
  }, [cut, reduce]);

  // 浏览器要求用户手势后才能出声：恢复了「开」的偏好时，等第一次触摸再起播
  useEffect(() => {
    if (!heroMusic || !musicOn) return;
    const el = musicRef.current;
    if (!el || !el.paused) return;
    const start = () => {
      el.volume = 0.35;
      void el.play().catch(() => {});
    };
    window.addEventListener("pointerdown", start, { once: true });
    return () => window.removeEventListener("pointerdown", start);
  }, [musicOn]);

  const toggleMusic = () => {
    if (!heroMusic) return;
    const el = musicRef.current;
    setMusicOn((v) => {
      const next = !v;
      localStorage.setItem(MUSIC_KEY, next ? "on" : "off");
      if (el) {
        if (next) {
          el.volume = 0.35;
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      }
      return next;
    });
  };

  if (heroSlides.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {heroSlides.map((src, i) => {
        // 手机端使用 9:16 专裁竖版（hero-Nm.jpg），桌面用横版，避免竖屏严重裁切
        const mobileSrc = src.replace(/\.jpg$/, "m.jpg");
        return (
          <picture key={`${src}-${i === active ? "on" : "off"}`}>
            <source media="(max-width: 767px)" srcSet={mobileSrc} />
            <img
              src={src}
              alt={i === 0 ? "社团作品：黑龙江上空的银河" : ""}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : undefined}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                i === active ? "opacity-100" : "opacity-0"
              } ${i === active && !reduce ? "hero-zoom" : ""}`}
            />
          </picture>
        );
      })}

      {/* 快门黑场 */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-ink transition-opacity ease-out ${
          blink ? "opacity-100 duration-[150ms]" : "opacity-0 duration-300"
        }`}
      />

      {/* 胶片帧格指示 + 背景音乐开关 */}
      <div className="absolute bottom-24 right-4 z-20 flex items-center gap-2 md:bottom-6 md:right-6">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => cut(i)}
            aria-label={`跳到第 ${i + 1} 帧`}
            aria-current={i === active}
            className={`h-3 w-5 border transition-colors ${
              i === active ? "border-paper bg-paper/80" : "border-paper/40 hover:bg-paper/20"
            }`}
          />
        ))}
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={heroMusic ? (musicOn ? "关闭背景音乐" : "开启背景音乐") : "背景音乐待接入"}
          aria-pressed={musicOn}
          aria-disabled={!heroMusic}
          title={heroMusic ? undefined : "背景音乐待接入：放入 public/audio/bgm.mp3 并在 site.ts 填入路径"}
          className={`ml-1 flex size-8 items-center justify-center border border-paper/40 text-paper/80 backdrop-blur ${
            heroMusic ? "" : "opacity-40"
          }`}
        >
          {musicOn ? (
            <SpeakerHigh size={15} weight="regular" aria-hidden />
          ) : (
            <SpeakerSlash size={15} weight="regular" aria-hidden />
          )}
        </button>
      </div>

      {heroMusic ? (
        <audio ref={musicRef} src={heroMusic} loop preload="none" hidden />
      ) : null}
    </div>
  );
}
