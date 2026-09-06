import { site } from "../config/site";

/** 页脚：联系方式待填；底部预留移动端吸底按钮的高度（pb-28 仅移动端生效） */
export function SiteFooter() {
  return (
    <footer className="border-t border-line pb-28 pt-10 md:pb-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-serif text-base">{site.name}</p>
        <p className="mt-2 text-xs leading-relaxed text-faint">
          {site.school} · 指导单位与免责声明待填
        </p>
        <p className="mt-1 text-xs text-faint">© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
