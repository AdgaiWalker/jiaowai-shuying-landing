import { site } from "../config/site";

const links = [
  { href: "#about", label: "关于" },
  { href: "#highlights", label: "亮点" },
  { href: "#works", label: "作品" },
  { href: "#faq", label: "常问" },
];

/** 吸顶导航：桌面端单行；手机端第二行为横向滑动的锚点 chips（wayfinding，此前手机端完全没有导航） */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <a href="#top" className="flex items-center gap-2.5 min-w-0">
          <img src="/logo.jpg" alt="焦外述影社团标志" className="size-8 shrink-0 rounded-full object-cover" />
          <span className="font-serif text-lg tracking-wide truncate">{site.name}</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex" aria-label="页面导航">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-paper">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#join"
          className="shrink-0 bg-accent px-4 py-2 text-sm font-medium text-ink transition-transform active:scale-[0.97]"
        >
          扫码进群
        </a>
      </div>
      <nav aria-label="页面导航" className="border-t border-line/60 md:hidden">
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-1.5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap border border-line px-2.5 py-1 text-[11px] text-muted transition-colors active:border-paper/40 active:text-paper"
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
