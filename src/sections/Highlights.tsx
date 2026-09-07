import { useState } from "react";
import { CalendarDots, Camera, SealCheck } from "@phosphor-icons/react";
import { Lightbox } from "../components/Lightbox";
import { PhotoSlot } from "../components/PhotoSlot";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import SpotlightCard from "../components/SpotlightCard";
import { awardImage } from "../config/site";

/** S5 硬亮点：bento 网格（2+1 / 1+1，四项恰好填满，无空格）；证书图可点开全屏放大——证据要能被看清 */
export function Highlights() {
  const [certOpen, setCertOpen] = useState(false);

  return (
    <section id="highlights" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle title="你的履历背书" note="你参与的每一场记录，都将沉淀为可以核实的个人经历与成果证明。" />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {/* 大格：获奖与背书（证书拼图 + 事实清单，均来自社团提供的证书与成就视频） */}
          <Reveal className="md:col-span-2">
            <SpotlightCard
              spotlightColor="rgba(244, 244, 241, 0.10)"
              className="flex h-full flex-col border border-line bg-ink-soft p-5 md:p-6"
            >
              <h3 className="font-serif text-xl">官方规格的项目履历</h3>
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
                <li className="text-pretty">你将承担重大盛会宣传记录工作，持有官方工作凭证与聘书。</li>
                <li className="text-pretty">你的成片将参与向团省委及各级官方媒体的选送推荐。</li>
                <li className="text-pretty">你的照片将有机会登上《黑河日报》专题版面并获得个人署名供稿。</li>
                <li className="text-pretty">你的航拍与创作成果将直接被学校职能部门采纳留档。</li>
              </ul>
              <button
                type="button"
                onClick={() => setCertOpen(true)}
                aria-label="查看证书大图"
                className="relative mt-4 flex-1 cursor-zoom-in"
              >
                <PhotoSlot spec={awardImage} />
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-2 right-2 bg-ink/80 px-2 py-1 text-[10px] text-paper/90"
                >
                  点开可放大
                </span>
              </button>
            </SpotlightCard>
          </Reveal>
          {/* 右列大格：作品上官方平台（琥珀底，网格内的色彩变化格） */}
          <Reveal delay={0.08} className="md:row-span-2">
            <div className="flex h-full flex-col border border-accent/30 bg-accent/10 p-5 md:p-6">
              <SealCheck size={26} weight="regular" className="text-accent" aria-hidden />
              <h3 className="mt-4 font-serif text-lg">作品直达官方平台</h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
                你在社团完成的优秀摄影与短片作品，将由社团推荐至学校官方新媒体矩阵，被全校师生共同关注。
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <SpotlightCard
              spotlightColor="rgba(244, 244, 241, 0.10)"
              className="h-full border border-line bg-ink-soft p-5 md:p-6"
            >
              <Camera size={26} weight="regular" className="text-accent" aria-hidden />
              <h3 className="mt-4 font-serif text-lg">器材向你全员开放</h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
                微单机身、定焦人像头、长焦镜头、航拍无人机与稳定器，均向你提供无偿借用支持。
              </p>
            </SpotlightCard>
          </Reveal>
          <Reveal delay={0.16}>
            <SpotlightCard
              spotlightColor="rgba(244, 244, 241, 0.10)"
              className="h-full border border-line bg-ink-soft p-5 md:p-6"
            >
              <CalendarDots size={26} weight="regular" className="text-accent" aria-hidden />
              <h3 className="mt-4 font-serif text-lg">四季实践常年在线</h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
                你将加入微电影拍摄组、月度摄影主题巡展、技能研习社与户外实战采风，实践从未停滞。
              </p>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>

      <Lightbox
        items={[awardImage]}
        index={certOpen ? 0 : null}
        onClose={() => setCertOpen(false)}
        onNavigate={() => {}}
      />
    </section>
  );
}
