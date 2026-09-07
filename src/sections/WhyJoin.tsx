import { useReducedMotion } from "motion/react";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";

/** 你的改变清单：纯陈述句叙述落在你身上的事实 */
const items = [
  { topic: "综测学分", heading: "每一次外拍与跟组，均沉淀为考核加分", detail: "活动依规计入学校综测考核，付出直接转化为评优加分。" },
  { topic: "专业器材", heading: "微单机身与长焦镜头，向你全免开放", detail: "全套专业设备随借随用，无需自购高昂相机器材。" },
  { topic: "高质成片", heading: "告别朋友圈废片，定格属于你的高光肖像", detail: "学长学姐分享独家调色与布光方案，手把手为你出片。" },
  { topic: "硬核技能", heading: "零基础实训，掌握后期修图剪辑与航拍", detail: "从基础按键到专业后期软件，老带新全流程带练通关。" },
  { topic: "署名舞台", heading: "优秀作品署名供稿校报与各级官方媒体", detail: "成片直推《黑河日报》与省团委平台，充实个人履历。" },
  { topic: "创作同伴", heading: "结识随时并肩的同行者，拒绝形式主义", detail: "零官僚层级与无意义会议，只有随叫随到的扫街搭子。" },
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
