import { useState } from "react";
import { CalendarDots, Camera, SealCheck } from "@phosphor-icons/react";
import { Lightbox } from "../components/Lightbox";
import { CrewPassCard } from "../components/xpbd/CrewPassCard";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import SpotlightCard from "../components/SpotlightCard";
import { awardImage } from "../config/site";

/**
 * S5 硬亮点：去卡片模板化，改用微质感双层倒角玻璃展台；
 * 证书图可点开全屏放大——真实证据清晰可触。
 */
export function Highlights() {
  const [certOpen, setCertOpen] = useState(false);

  return (
    <section id="highlights" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle
            eyebrow="CREDENTIALS · 履历背书"
            title="你的履历背书"
            note="你参与的每一场记录，都将沉淀为可以核实的个人经历与成果证明。"
          />
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* 左侧主展区：官方规格项目履历 + 实体工作证/聘书翻转卡 */}
          <Reveal className="lg:col-span-7">
            <SpotlightCard
              spotlightColor="rgba(244, 244, 241, 0.08)"
              className="flex h-full flex-col justify-between surface-glass double-bezel rounded-2xl p-6 md:p-8"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-serif text-xl font-semibold text-paper md:text-2xl">
                    官方规格的项目履历
                  </h3>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-mono text-muted">
                    VERIFIED
                  </span>
                </div>
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted/90">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-pretty">承担重大盛会官方宣传记录，持有正式工作凭证与聘书。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-pretty">成片常态化选送推荐至团省委及各级官方主流媒体。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-pretty">优秀作品直接登上《黑河日报》专题版面并享个人署名。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-pretty">航拍与影像成果直接由学校职能部门采纳永久归档。</span>
                  </li>
                </ul>
              </div>

              {/* 实体工卡：放置于暗室光桌上 */}
              <div className="mt-6 pt-4 border-t border-white/5">
                <CrewPassCard awardImage={awardImage} onOpenZoom={() => setCertOpen(true)} />
              </div>
            </SpotlightCard>
          </Reveal>

          {/* 右侧纵向三项：微光流转卡 */}
          <div className="grid gap-6 lg:col-span-5 sm:grid-cols-2 lg:grid-cols-1">
            {/* 作品直达官方平台（带摄影红流光微调） */}
            <Reveal delay={0.06}>
              <div className="flex flex-col justify-between rounded-2xl border border-accent/30 bg-accent/[0.07] p-6 backdrop-blur-md shadow-[inset_0_1px_0_rgba(239,68,68,0.2)]">
                <div>
                  <div className="flex size-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <SealCheck size={22} weight="bold" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-paper">作品直达官方平台</h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted/90">
                    在社团产出的优秀摄影与短片，由社团直接保荐至学校官方新媒体矩阵，全校师生共同见证。
                  </p>
                </div>
              </div>
            </Reveal>

            {/* 器材全员开放 */}
            <Reveal delay={0.1}>
              <SpotlightCard
                spotlightColor="rgba(56, 189, 248, 0.08)"
                className="surface-glass double-bezel rounded-2xl p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-white/5 text-paper">
                  <Camera size={22} weight="regular" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-paper">器材向你全员开放</h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted/90">
                  专业微单机身、定焦大光圈镜头、长焦打鸟头、航拍无人机与三轴稳定器，社内免押金借调。
                </p>
              </SpotlightCard>
            </Reveal>

            {/* 四季实践常年在线 */}
            <Reveal delay={0.14}>
              <SpotlightCard
                spotlightColor="rgba(245, 158, 11, 0.08)"
                className="surface-glass double-bezel rounded-2xl p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-white/5 text-paper">
                  <CalendarDots size={22} weight="regular" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-paper">四季实践常年在线</h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted/90">
                  微电影摄制组、月度主题影展、技艺研习沙龙与户外采风，在每一次真实任务中飞速进阶。
                </p>
              </SpotlightCard>
            </Reveal>
          </div>
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
