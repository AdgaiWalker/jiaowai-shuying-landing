import { Reveal } from "../components/Reveal";
import { SeasonMarquee } from "../components/SeasonMarquee";
import { SectionTitle } from "../components/SectionTitle";
import { TypeMarquee } from "../components/TypeMarquee";
import { activityTypes, seasons } from "../config/site";

/**
 * S6 黑河四季：活动类型跑马灯 + 四季照片带（自动从左向右漂移，一张接一张晃过去）。
 */
export function Activities() {
  return (
    <section id="activities" className="bg-ink-soft py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle
            title="你眼里的黑河四季"
            note="四月樱花、江畔长昼、秋日金黄与雪夜暖灯，都将成为你大学四年里掌镜定格的画卷。"
          />
        </Reveal>
        <Reveal>
          <div className="mb-8">
            <TypeMarquee items={activityTypes} />
          </div>
        </Reveal>
      </div>
      <Reveal>
        <SeasonMarquee seasons={seasons} />
      </Reveal>
    </section>
  );
}
