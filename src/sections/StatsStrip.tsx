import { CountUp } from "../components/CountUp";
import { Reveal } from "../components/Reveal";
import { stats } from "../config/site";

/** S2 数字带：发丝线分格，数据待填（不要编造数字）；纯数字进入视口时滚动计数 */
export function StatsStrip() {
  return (
    <section aria-label="社团数据" className="border-y border-line">
      <Reveal>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-line md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-ink px-4 py-6 text-center md:py-8">
              <p className="font-serif text-2xl text-accent md:text-3xl">
                <CountUp value={s.value} />
              </p>
              <p className="mt-1 text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
