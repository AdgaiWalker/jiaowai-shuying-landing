import { DarkroomHangingPhoto } from "../components/xpbd/DarkroomHangingPhoto";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import { aboutImage, site } from "../config/site";

/**
 * S3 关于我们：无界杂志排版 + 暗房物理悬挂相纸。
 * 摆脱传统卡片方盒限制，文字直接融入焦外光场，相纸如挂在半空钢丝线上。
 */
export function About() {
  return (
    <section id="about" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle
            eyebrow="MANIFESTO · 关于我们"
            title="你与这片光影"
            note="在这个信息过载的时代，我们用快门与暗室，为值得被记住的瞬间留下物理凭证。"
          />
        </Reveal>

        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* 左侧：杂志级大呼吸感正文排版 */}
          <Reveal className="lg:col-span-7">
            <div className="space-y-5">
              {site.intro.map((p, i) => (
                <p
                  key={i}
                  className="max-w-[36em] text-base leading-relaxed text-muted/90 md:text-lg text-pretty font-light"
                >
                  {p}
                </p>
              ))}

              <div className="pt-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-faint mb-3">
                  FOCUS FIELDS / 探索领域
                </p>
                <ul className="flex flex-wrap gap-2.5">
                  {site.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs text-paper/80 backdrop-blur-md transition-colors hover:border-accent/40 hover:text-paper"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* 右侧：实体暗房悬挂照片（带顶端挂线隐喻与物理微摆） */}
          <Reveal delay={0.12} className="relative lg:col-span-5 flex justify-center">
            {/* 顶端悬挂细索指示 */}
            <div
              aria-hidden="true"
              className="absolute -top-12 left-1/2 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/20 to-white/40 hidden md:block"
            />
            <div className="w-full max-w-sm">
              <DarkroomHangingPhoto spec={aboutImage} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
