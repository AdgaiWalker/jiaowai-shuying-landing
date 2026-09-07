import { site } from "../config/site";

const links = [
  { href: "#about", label: "关于" },
  { href: "#why", label: "成长" },
  { href: "#highlights", label: "亮点" },
  { href: "#activities", label: "四季" },
  { href: "#works", label: "作品" },
  { href: "#faq", label: "常问" },
];

/** 吸顶导航：双层磨砂微质感；移动端横向药丸 chips 导航 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 apple-glass border-b border-white/10 transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <a href="#top" className="group flex items-center gap-3 min-w-0 transition-transform active:scale-[0.98]">
          <img
            src="/logo.jpg"
            alt="焦外述影社团标志"
            className="size-8 shrink-0 rounded-full object-cover ring-1 ring-white/20 transition-transform group-hover:scale-105"
          />
          <span className="font-serif text-lg tracking-wider text-paper truncate">{site.name}</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex" aria-label="页面导航">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-paper text-xs uppercase tracking-widest text-muted/90"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#join"
          className="shrink-0 rounded-full bg-accent px-5 py-2 text-xs md:text-sm font-medium text-white shadow-[0_0_20px_rgba(229,72,77,0.3)] transition-all hover:bg-accent/90 active:scale-[0.96]"
        >
          扫码进群
        </a>
      </div>
      <nav aria-label="页面导航" className="border-t border-white/5 md:hidden">
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-muted/90 transition-all active:scale-[0.96] active:border-white/30 active:text-paper"
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
