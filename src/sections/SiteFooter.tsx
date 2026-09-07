import { site } from "../config/site";

/**
 * 页脚：优雅呈现社团信息与主创贡献署名
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line pb-28 pt-10 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-base text-paper">{site.name}</p>
            <p className="mt-1 text-xs text-muted">
              {site.school} · 焦外述影 摄影社团 · 在焦点之外，讲述光影
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-faint">
              <span>
                架构 & 全栈研发：
                <strong className="font-medium text-paper/90">哆啦</strong>
              </span>
              <span className="text-line">/</span>
              <span>
                视觉与成片样片：
                <span className="text-paper/75">喵喵酱</span>、<span className="text-paper/75">周泓旭</span>
              </span>
              <span className="text-line">/</span>
              <span>
                域名与平台赞助：
                <span className="text-paper/75">周泓旭</span>
              </span>
              <span className="text-line">/</span>
              <span>
                招新联络：
                <span className="text-paper/75">吴长轩</span>
              </span>
            </div>
          </div>

          <div className="text-xs text-faint md:text-right">
            <p>© {new Date().getFullYear()} {site.name} · All rights reserved.</p>
            <p className="mt-1 text-[11px] text-faint/80">
              Designed & Developed with passion by 哆啦 · Powered by React 19 & XPBD
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

