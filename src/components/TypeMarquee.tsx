/** 活动类型跑马灯：自动从左向右漂移，内容复制一份（.marquee-copy）实现无缝循环；悬停暂停，「减弱动态」时静止为单行标签（见 global.css） */
export function TypeMarquee({ items }: { items: string[] }) {
  const row = (isCopy: boolean) => (
    <ul
      aria-hidden={isCopy || undefined}
      className={`flex w-max shrink-0 items-center gap-3 pr-3 ${isCopy ? "marquee-copy" : ""}`}
    >
      {items.map((t) => (
        <li
          key={t}
          className="whitespace-nowrap border border-line bg-ink-soft/60 px-3.5 py-1.5 text-xs text-muted"
        >
          {t}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="marquee group relative overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      aria-label="活动类型"
    >
      <div className="marquee-track flex w-max group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
