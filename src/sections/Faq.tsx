import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import { faqs } from "../config/site";

/** S8 入社细则陈述：全部直接平铺展示，无需点击展开 */
export function Faq() {
  return (
    <section id="faq" className="bg-ink-soft py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle title="入社细则陈述" note="规章与流程保持完全透明，消除你在加入前的一切疑虑。" />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <div className="flex h-full flex-col border border-line bg-ink p-5 md:p-6">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-accent">0{i + 1}</span>
                  <h3 className="font-serif text-base font-medium text-paper md:text-lg">{f.q}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
