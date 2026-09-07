import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import { faqs } from "../config/site";

/** S8 入社细则陈述：全部直接平铺展示，无需点击展开 */
export function Faq() {
  return (
    <section id="faq" className="bg-ink-soft py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle title="入社细则" note="规则完全公开透明，不设任何隐性门槛。" />
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.03}>
              <div className="flex h-full flex-col justify-between border border-line bg-ink p-4 md:p-5">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-base font-semibold text-paper md:text-lg">{f.q}</h3>
                    <span className="font-mono text-xs text-accent">0{i + 1}</span>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-muted md:text-sm">{f.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
