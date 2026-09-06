import { useEffect, useRef, useState } from "react";

/**
 * 移动端吸底转化条：首屏时 Hero 自己的 CTA 就在眼前，吸底条是纯重复——
 * 滚过首屏 72% 才淡入；之后跟随手势，下滚收起、上滚出现（拇指上滑时拇指下方）。
 * 「减弱动态」时去掉位移动画，只做显隐。
 */
export function MobileCtaBar() {
  const [shown, setShown] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      lastY.current = y;
      if (y <= window.innerHeight * 0.72) {
        setShown(false);
        return;
      }
      if (dy < -4) setShown(true);
      else if (dy > 4) setShown(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 backdrop-blur transition-all duration-300 motion-reduce:transition-none md:hidden ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="px-4 pt-3" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
        <a
          href="#join"
          className="block bg-accent py-3 text-center text-sm font-medium text-ink transition-transform active:scale-[0.98]"
        >
          扫码进群
        </a>
      </div>
    </div>
  );
}
