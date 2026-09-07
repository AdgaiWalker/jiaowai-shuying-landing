import { useReducedMotion } from "motion/react";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";

/** 你的改变清单：纯陈述句叙述落在你身上的事实 */
const items = [
  { topic: "关于学分", heading: "你的每一次跟组与外拍，都将沉淀为实在的综测积分", detail: "社团活动均按规定计入学校综测考核，你在社团的付出将直接转化为期末评奖评优的有效加分。" },
  { topic: "关于设备", heading: "你无需自备昂贵相机，社团微单与长焦镜头对你免费开放", detail: "机身、定焦人像头、长焦镜头、大疆稳定器由你随时借调，不必承担高昂的器材负担。" },
  { topic: "关于出片", heading: "你将告别千篇一律的废片，记录独属于你的高光肖像", detail: "你不再为相册发愁，学长学姐会把审美经验与调色预设直接交给你，在外拍中为你定格高质感画面。" },
  { topic: "关于技能", heading: "你将从零开始掌握后期修图、短片剪辑与航拍实操", detail: "从相机基础操控、光学原理，到专业后期调色与剪辑，前辈手把手带你跨过所有技术门槛。" },
  { topic: "关于舞台", heading: "你的作品将署上你的姓名，刊登在校报版面与官方展区", detail: "优秀成片将直接向《黑河日报》与团省委官方平台供稿发表，成为你个人档案中不可磨灭的证明。" },
  { topic: "关于同伴", heading: "你结识的是随时相约创作的朋友，而非形式主义的例会", detail: "拒绝繁琐的形式与层级。在焦述，你随时能约到一起顶着晨雾扫街、在零下三十度记录暖光的同行者。" },
];

/** 单条陈述标题 */
function Slogan({ topic, heading }: { topic: string; heading: string }) {
  return (
    <div>
      <span className="text-xs tracking-[0.2em] text-accent">{topic}</span>
      <p className="mt-1 font-serif text-lg font-medium leading-snug md:text-2xl text-paper">
        {heading}
      </p>
    </div>
  );
}

/**
 * S4 为什么加入：以新生为主角的改变实录。
 * 默认形态为卡片堆叠滚动，系统减弱动态时退化为静态排版。
 */
export function WhyJoin() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section id="why" className="bg-ink-soft py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h2 className="font-serif text-3xl font-semibold md:text-4xl">在焦述，你将经历的改变</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          你的每一次快门与跟组，都将转化为看得见的个人成长与实在记录。
        </p>
      </div>

      {reduce ? (
        <div className="mx-auto mt-10 max-w-4xl px-4 md:mt-14 md:px-6">
          {items.map((item, i) => (
            <div key={item.topic} className={`py-9 md:py-11 ${i > 0 ? "border-t border-line" : ""}`}>
              <Slogan topic={item.topic} heading={item.heading} />
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{item.detail}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-4xl px-4 md:px-6">
          <ScrollStack itemDistance={12} itemDistanceEnd={100} itemStackDistance={10} itemStackDistanceEnd={28}>
            {items.map((item) => (
              <ScrollStackItem
                key={item.topic}
                itemClassName="h-56 md:h-64 rounded-none border border-line bg-ink shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)]"
              >
                <div className="flex h-full flex-col justify-center p-5 md:p-8">
                  <Slogan topic={item.topic} heading={item.heading} />
                  <p className="mt-2.5 text-sm leading-relaxed text-muted md:text-base">{item.detail}</p>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      )}
    </section>
  );
}
