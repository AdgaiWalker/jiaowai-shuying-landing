import { PhotoSlot } from "../components/PhotoSlot";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import { aboutImage, site } from "../config/site";

/** S3 关于我们：桌面端 7/5 非对称分栏（文字 + 配图），移动端单列 */
export function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle title="我们是谁" />
        </Reveal>
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-7">
            <div>
              {site.intro.map((p, i) => (
                <p key={i} className="mt-4 max-w-[36em] leading-relaxed text-muted first:mt-0">
                  {p}
                </p>
              ))}
              <ul className="mt-6 flex flex-wrap gap-2">
                {site.tags.map((t) => (
                  <li key={t} className="border border-line px-3 py-1 text-xs text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-5">
            <PhotoSlot spec={aboutImage} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
