import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import { faqs } from "../config/site";

/** S8 入社细则陈述：全部直接平铺展示，微质感双层倒角玻璃卡片 */
export function Faq() {
  return (
    <section id="faq" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle
            eyebrow="TRANSPARENCY · 入社细则"
            title="规则透明，零门槛同行"
            note="社团所有机制均公开透明，不设任何隐性门槛，只认你对快门与表达的热忱。"
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <div className="flex h-full flex-col justify-between surface-glass double-bezel rounded-2xl p-6 transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-base font-semibold text-paper md:text-lg">{f.q}</h3>
                    <span className="font-mono text-xs font-semibold text-accent/80">
                      0{i + 1}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted/90 md:text-sm text-pretty">
                    {f.a}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
