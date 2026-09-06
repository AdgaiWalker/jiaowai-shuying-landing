import { Reveal } from "../components/Reveal";
import { SeasonCarousel } from "../components/SeasonCarousel";
import { SectionTitle } from "../components/SectionTitle";
import { activityTypes, seasons } from "../config/site";

/**
 * S6 黑河四季：自动轮播展示四季系列作品（5 秒换帧，可拖拽/跳帧），
 * 活动类型以文字标签呈现（活动纪实照片待补，到位后可并入轮播素材）。
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
        <SeasonCarousel seasons={seasons} />
      </Reveal>
    </section>
  );
}
