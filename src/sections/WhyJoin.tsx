import { useReducedMotion } from "motion/react";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";

/** 「来焦述」清单：能得到什么，一条条摆明（第 1 条学分政策待社长确认） */
const items = [
  { need: "学分不够", detail: "社团活动计综测学分，具体规则进群就有人告诉你。" },
  { need: "抽象氛围", detail: "整活浓度超标，梗图和快门齐飞，认真也好玩。" },
  { need: "想出片", detail: "主题外拍、校园跟拍、四季影展，月月有片出。" },
  { need: "想学真东西", detail: "修图、剪辑、航拍，老带新从零教到会。" },
  { need: "没设备", detail: "相机、镜头、稳定器，社团的随便借。" },
  { need: "怕没舞台", detail: "校报署名、官方平台、省级转发，等你来上。" },
];

/** 单条口号：红色 = 你的需求，灰色「来焦述」= 固定应答（清单/卡片两种形态共用） */
function Slogan({ need }: { need: string }) {
  return (
    <p className="font-serif text-2xl font-medium md:text-3xl">
      <span className="text-accent">{need}</span>
      <span className="text-muted">，来焦述。</span>
    </p>
  );
}

/**
 * S4 为什么加入：「XX，来焦述」口号式清单。
 * 默认形态为卡片堆叠滚动（越压越深，被盖住的卡片轻微失焦——景深），
 * 「减弱动态」时回退为静态清单。说明行全部来自已核实的真实背书，无编造。
 */
export function WhyJoin() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section id="why" className="bg-ink-soft py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h2 className="font-serif text-3xl font-semibold md:text-4xl">来焦述，你能得到什么</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          学分、氛围、技术、设备、舞台，按需自取。
        </p>
      </div>

      {reduce ? (
        <div className="mx-auto mt-10 max-w-4xl px-4 md:mt-14 md:px-6">
          {items.map((item, i) => (
            <div key={item.need} className={`py-9 md:py-11 ${i > 0 ? "border-t border-line" : ""}`}>
              <Slogan need={item.need} />
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{item.detail}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-4xl px-4 md:px-6">
          <ScrollStack itemDistance={32} itemStackDistance={16}>
            {items.map((item) => (
              <ScrollStackItem
                key={item.need}
                itemClassName="h-56 md:h-64 rounded-none border border-line bg-ink shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)]"
              >
                <div className="flex h-full flex-col justify-center p-5 md:p-8">
                  <Slogan need={item.need} />
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
