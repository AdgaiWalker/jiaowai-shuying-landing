import { site } from "../config/site";

/** 吸顶导航：桌面端单行、高度 64px，移动端只保留品牌与主转化按钮 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <img src="/logo.jpg" alt="焦外述影社团标志" className="size-8 rounded-full object-cover" />
          <span className="font-serif text-lg tracking-wide">{site.name}</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex" aria-label="页面导航">
          <a href="#about" className="transition-colors hover:text-paper">
            关于
          </a>
          <a href="#highlights" className="transition-colors hover:text-paper">
            亮点
          </a>
          <a href="#works" className="transition-colors hover:text-paper">
            作品
          </a>
          <a href="#faq" className="transition-colors hover:text-paper">
            常问
          </a>
        </nav>
        <a
          href="#join"
          className="bg-accent px-4 py-2 text-sm font-medium text-ink transition-transform active:scale-[0.98]"
        >
          扫码进群
        </a>
      </div>
    </header>
  );
}
