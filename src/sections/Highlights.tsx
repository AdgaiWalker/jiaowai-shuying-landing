import { useState } from "react";
import { CalendarDots, Camera, Play, SealCheck } from "@phosphor-icons/react";
import { Lightbox } from "../components/Lightbox";
import { CrewPassCard } from "../components/xpbd/CrewPassCard";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import SpotlightCard from "../components/SpotlightCard";
import { endorsements } from "../config/site";

/**
 * S5 硬亮点：微质感双层倒角玻璃展台；
 * 省里转发视频、校统战部证书、黑河日报专版均可点开全屏检视。
 */
export function Highlights() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeLightboxIdx, setActiveLightboxIdx] = useState<number | null>(null);

  const lightboxItems = endorsements.map((e) => {
    if (e.type === "video") {
      return {
        type: "video" as const,
        src: e.src,
        poster: e.poster,
        caption: `【${e.level}】${e.title}`,
        hint: `${e.source} · ${e.desc}`,
      };
    }
    return {
      src: e.src,
      title: `【${e.level}】${e.title}`,
      hint: `${e.source} · ${e.desc}`,
      spec: "",
      ratio: e.ratio,
      caption: `【${e.level}】${e.title}`,
    };
  });

  return (
    <section id="highlights" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle
            eyebrow="CREDENTIALS · 履历背书"
            title="你的履历背书"
            note="你参与的每一场记录，都将沉淀为可以核实的个人经历、省级官方转发与成果证明。"
          />
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* 左侧主展区：官方规格项目履历 + 实体工作证与原件翻转检视 */}
          <Reveal className="lg:col-span-7">
            <SpotlightCard
              spotlightColor="rgba(244, 244, 241, 0.08)"
              className="flex h-full flex-col justify-between surface-glass double-bezel rounded-2xl p-6 md:p-8"
            >
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-xl font-semibold text-paper md:text-2xl">
                    官方规格的项目履历
                  </h3>
                  <span className="font-mono text-xs text-accent">省 / 校 / 市 三级权威背书</span>
                </div>

                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted/90">
                  <li className="text-pretty">
                    <strong className="font-normal text-paper">省级新媒体展播：</strong>
                    成片多次获共青团黑龙江省委（团省委）视频号选用展播，全省青年共同瞩目。
                  </li>
                  <li className="text-pretty">
                    <strong className="font-normal text-paper">两届盛会先进集体：</strong>
                    承担中俄大学生交流大会、中俄远东田径运动会宣传记录，持有党委统战部荣誉证书。
                  </li>
                  <li className="text-pretty">
                    <strong className="font-normal text-paper">当地党媒专版供稿：</strong>
                    优秀作品与成员事迹登上《黑河日报》专题版面，获得个人署名供稿档案。
                  </li>
                  <li className="text-pretty">
                    <strong className="font-normal text-paper">官方准入凭证：</strong>
                    持有全校重大盛会前排内场摄制工作证，航拍成片直接由校职能部门采纳留档。
                  </li>
                </ul>

                {/* 快捷点击栏：直通省里转发与原件检视 */}
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
                  <span className="font-mono text-[11px] text-faint">直通凭证：</span>
                  {endorsements.map((e, idx) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => {
                        setSelectedIdx(idx);
                        setActiveLightboxIdx(idx);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent hover:text-accent active:scale-95"
                    >
                      <span className="text-accent text-[9px]">{e.type === "video" ? "▶" : "●"}</span>
                      <span>{e.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 实体工卡与凭证 */}
              <div className="mt-6 pt-4 border-t border-white/5">
                <CrewPassCard
                  endorsements={endorsements}
                  selectedIndex={selectedIdx}
                  onSelectEndorsement={setSelectedIdx}
                  onOpenEndorsement={(idx) => {
                    setSelectedIdx(idx);
                    setActiveLightboxIdx(idx);
                  }}
                />
              </div>
            </SpotlightCard>
          </Reveal>

          {/* 右侧纵向三项 */}
          <div className="grid gap-6 lg:col-span-5 sm:grid-cols-2 lg:grid-cols-1">
            {/* 作品直达官方平台 */}
            <Reveal delay={0.06}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-accent/30 bg-accent/[0.08] p-6 backdrop-blur-md shadow-[inset_0_1px_0_rgba(239,68,68,0.2)]">
                <div>
                  <div className="flex size-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <SealCheck size={22} weight="bold" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-paper">作品直达官方平台</h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted/90">
                    优秀摄影与短片作品由社团直接向团省委新媒体矩阵及《黑河日报》选送推荐，全校师生与全省青年共同见证。
                  </p>

                  <div className="mt-4 space-y-2 border-t border-accent/20 pt-3 text-xs text-muted">
                    <div className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-accent" />
                      <span>共青团黑龙江省委官方选用</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-accent" />
                      <span>黑河日报专版署名供稿</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-accent" />
                      <span>校党委宣传统战部全媒发布</span>
                    </div>
                  </div>
                </div>

                {/* 一键播放省里官方转发 */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIdx(0);
                    setActiveLightboxIdx(0);
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent/20 py-2.5 font-mono text-xs text-paper transition-all hover:bg-accent hover:text-white active:scale-95"
                >
                  <Play size={14} weight="fill" className="text-accent group-hover:text-white" />
                  <span>观看团省委转发原片 ▶</span>
                </button>
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
        items={lightboxItems}
        index={activeLightboxIdx}
        onClose={() => setActiveLightboxIdx(null)}
        onNavigate={(idx) => {
          setSelectedIdx(idx);
          setActiveLightboxIdx(idx);
        }}
      />
    </section>
  );
}
