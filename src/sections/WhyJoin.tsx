import { useReducedMotion } from "motion/react";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";
import { SectionTitle } from "../components/SectionTitle";
import { Reveal } from "../components/Reveal";

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
      <span className="inline-block rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-[10px] font-medium tracking-[0.2em] text-accent">
        {topic}
      </span>
      <p className="mt-2 font-serif text-lg font-medium leading-snug text-paper md:text-2xl">
        {heading}
      </p>
    </div>
  );
}

/**
 * S4 为什么加入：以新生为主角的改变实录。
 * 摆脱实心黑底卡片，改用微质感双层倒角磨砂玻璃，让底层的焦外散景在堆叠时若隐若现。
 */
export function WhyJoin() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section id="why" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <Reveal>
          <SectionTitle
            eyebrow="EVOLUTION · 蜕变成长"
            title="在焦述，你将经历的改变"
            note="你的每一次快门与跟组，都将转化为看得见的个人成长与实在记录。"
          />
        </Reveal>
      </div>

      {reduce ? (
        <div className="mx-auto mt-6 max-w-4xl px-4 md:px-6">
          {items.map((item, i) => (
            <div
              key={item.topic}
              className={`py-8 md:py-10 ${i > 0 ? "border-t border-white/10" : ""}`}
            >
              <Slogan topic={item.topic} heading={item.heading} />
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{item.detail}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-6 max-w-4xl px-4 md:px-6">
          <ScrollStack itemDistance={12} itemDistanceEnd={100} itemStackDistance={10} itemStackDistanceEnd={28}>
            {items.map((item) => (
              <ScrollStackItem
                key={item.topic}
                itemClassName="h-56 md:h-64 rounded-2xl surface-glass double-bezel"
              >
                <div className="flex h-full flex-col justify-center p-6 md:p-8">
                  <Slogan topic={item.topic} heading={item.heading} />
                  <p className="mt-3 text-sm leading-relaxed text-muted/90 md:text-base text-pretty">
                    {item.detail}
                  </p>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      )}
    </section>
  );
}
