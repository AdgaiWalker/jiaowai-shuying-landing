import { CountUp } from "../components/CountUp";
import { Reveal } from "../components/Reveal";
import { stats } from "../config/site";

/** S2 数字带：通透微光玻璃条，让背景光斑在数字间隙穿透 */
export function StatsStrip() {
  return (
    <section aria-label="社团数据" className="relative border-y border-white/10 bg-ink/35 backdrop-blur-md">
      <Reveal>
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-y divide-white/5 md:grid-cols-4 md:divide-x md:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-8 text-center group transition-colors hover:bg-white/[0.02]">
              <p className="font-serif text-3xl font-semibold tracking-tight text-paper md:text-4xl">
                <CountUp value={s.value} />
              </p>
              <p className="mt-1.5 text-xs tracking-wider text-muted uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
