import { PhotoSlot } from "../components/PhotoSlot";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import { activityTypes, seasons } from "../config/site";

/**
 * S6 黑河四季：横滑照片条（scroll-snap）展示四季系列作品；
 * 活动类型暂以文字标签呈现（活动纪实照片待补，到位后升级为图文卡）。
 */
export function Activities() {
  return (
    <section id="activities" className="bg-ink-soft py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle
            title="我们把黑河拍成了四季"
            note="外拍、跟拍、课堂、影展、短片，这些活动的足迹，先从镜头里的四季看起。"
          />
        </Reveal>
        <Reveal>
          <ul className="mb-8 flex flex-wrap gap-2" aria-label="活动类型">
            {activityTypes.map((t) => (
              <li key={t} className="border border-line px-3 py-1 text-xs text-muted">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <Reveal>
        <div className="no-scrollbar snap-x snap-mandatory overflow-x-auto">
          <ul className="mx-auto flex w-max gap-4 px-4 md:gap-6 md:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
            {seasons.map((s) => (
              <li key={s.name} className="w-[260px] shrink-0 snap-start md:w-[320px]">
                <PhotoSlot spec={s.photo} />
                <h3 className="mt-3 font-serif text-base">{s.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{s.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
