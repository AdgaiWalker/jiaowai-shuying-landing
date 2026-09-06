import { Plus } from "@phosphor-icons/react";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import { faqs } from "../config/site";

/** S8 新生常问：原生 details 手风琴，答案为初稿占位，上线前由社长确认 */
export function Faq() {
  return (
    <section id="faq" className="bg-ink-soft py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <SectionTitle title="新生常问" />
          </Reveal>
          <Reveal delay={0.06}>
            <div>
              {faqs.map((f) => (
                <details key={f.q} className="border-b border-line/70 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-base text-paper md:text-lg [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Plus size={18} weight="regular" className="faq-icon shrink-0 text-accent" aria-hidden />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
