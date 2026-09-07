import { useEffect, useRef } from "react";

/**
 * 移动端吸底转化条：首屏时 Hero 自己的 CTA 就在眼前，吸底条是纯重复——
 * 滚过首屏 72% 才淡入；之后跟随手势，下滚收起、上滚出现。
 * 用 ref 直接操作 classList，绕过 React 在后台 webview 的重渲染冻结问题。
 * 「减弱动态」时去掉位移动画，只做显隐。
 */
export function MobileCtaBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (y <= window.innerHeight * 0.5) {
        bar.classList.add("translate-y-full", "opacity-0", "pointer-events-none");
        bar.classList.remove("translate-y-0", "opacity-100");
        return;
      }
      if (dy < -4) {
        bar.classList.remove("translate-y-full", "opacity-0", "pointer-events-none");
        bar.classList.add("translate-y-0", "opacity-100");
      } else if (dy > 4) {
        bar.classList.add("translate-y-full", "opacity-0", "pointer-events-none");
        bar.classList.remove("translate-y-0", "opacity-100");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 backdrop-blur transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none md:hidden translate-y-full opacity-0 pointer-events-none"
    >
      <div className="px-4 pt-3" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
        <a
          href="#join"
          className="block bg-accent py-3 text-center text-sm font-medium text-ink transition-transform duration-100 active:scale-[0.98]"
        >
          扫码进群
        </a>
      </div>
    </div>
  );
}
