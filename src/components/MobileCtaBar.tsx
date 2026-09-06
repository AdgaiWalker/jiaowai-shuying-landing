/** 移动端吸底转化条：主转化「进群」全程可达（桌面端隐藏） */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 backdrop-blur md:hidden">
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
