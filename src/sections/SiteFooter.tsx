import { site } from "../config/site";

/**
 * 页脚：纯粹社团信息与版权声明
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line pb-28 pt-10 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-base text-paper">{site.name}</p>
            <p className="mt-1 text-xs text-muted">
              {site.school} · {site.name} · 在焦点之外，讲述光影
            </p>
          </div>

          <div className="text-xs text-faint md:text-right">
            <p>© {new Date().getFullYear()} {site.name}版权所有</p>
            <p className="mt-0.5 text-[10px] text-faint/60">
              BGM: "Snowfall" by Scott Buckley (CC-BY 4.0)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
