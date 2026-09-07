import { Reveal } from "../components/Reveal";
import { SeasonMarquee } from "../components/SeasonMarquee";
import { SectionTitle } from "../components/SectionTitle";
import { TypeMarquee } from "../components/TypeMarquee";
import { activityTypes, seasons } from "../config/site";

/**
 * S6 黑河四季：活动类型跑马灯 + 四季照片带。
 * 拆除非必要的实心底色，让极北光斑在四季照片背后流转。
 */
export function Activities() {
  return (
    <section id="activities" className="relative py-24 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle
            eyebrow="SEASONS · 四季光影"
            title="你眼里的黑河四季"
            note="四月樱花、江畔长昼、秋日金黄与雪夜暖灯，都将成为你大学四年里掌镜定格的画卷。"
          />
        </Reveal>
        <Reveal>
          <div className="mb-10">
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
