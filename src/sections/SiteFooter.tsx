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
              {site.school} · 焦外述影 摄影社团 · 在焦点之外，讲述光影
            </p>
          </div>

          <div className="text-xs text-faint md:text-right">
            <p>© {new Date().getFullYear()} {site.name} · All rights reserved.</p>
            <p className="mt-1 text-[11px] text-faint/80">
              黑河学院 焦外述影社团 官方门户
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
