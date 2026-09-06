import { Reveal } from "../components/Reveal";
import { SeasonCarousel } from "../components/SeasonCarousel";
import { SectionTitle } from "../components/SectionTitle";
import { TypeMarquee } from "../components/TypeMarquee";
import { activityTypes, seasons } from "../config/site";

/**
 * S6 黑河四季：活动类型跑马灯（自动从左向右漂移）+ 四季作品自动轮播（5 秒换帧）。
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
          <div className="mb-8">
            <TypeMarquee items={activityTypes} />
          </div>
        </Reveal>
      </div>
      <Reveal>
        <SeasonCarousel seasons={seasons} />
      </Reveal>
    </section>
  );
}
