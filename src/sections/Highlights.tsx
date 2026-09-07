import { useState } from "react";
import { CalendarDots, Camera, Play, SealCheck } from "@phosphor-icons/react";
import { Lightbox } from "../components/Lightbox";
import { CrewPassCard } from "../components/xpbd/CrewPassCard";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import SpotlightCard from "../components/SpotlightCard";
import { endorsements } from "../config/site";

/** S5 硬亮点：bento 网格（2+1 / 1+1）；省里转发视频、校统战部证书、黑河日报专版均可点开全屏检视 */
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
    <section id="highlights" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle
            title="你的履历背书"
            note="你参与的每一场记录，都将沉淀为可以核实的个人经历、省级官方转发与成果证明。"
          />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {/* 大格：权威背书（工作证物理卡 + 省里/校级/市级多维凭证） */}
          <Reveal className="md:col-span-2">
            <SpotlightCard
              spotlightColor="rgba(244, 244, 241, 0.10)"
              className="flex h-full flex-col border border-line bg-ink-soft p-5 md:p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl">官方规格的项目履历</h3>
                <span className="font-mono text-xs text-accent">省 / 校 / 市 三级权威背书</span>
              </div>

              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
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
              <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line/60 pt-3">
                <span className="font-mono text-[11px] text-faint">直通凭证：</span>
                {endorsements.map((e, idx) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => {
                      setSelectedIdx(idx);
                      setActiveLightboxIdx(idx);
                    }}
                    className="inline-flex items-center gap-1 border border-line bg-ink px-2 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent hover:text-accent active:scale-95"
                  >
                    <span className="text-accent text-[9px]">{e.type === "video" ? "▶" : "●"}</span>
                    <span>{e.badge}</span>
                  </button>
                ))}
              </div>

              <CrewPassCard
                endorsements={endorsements}
                selectedIndex={selectedIdx}
                onSelectEndorsement={setSelectedIdx}
                onOpenEndorsement={(idx) => {
                  setSelectedIdx(idx);
                  setActiveLightboxIdx(idx);
                }}
              />
            </SpotlightCard>
          </Reveal>

          {/* 右列大格：作品上官方平台（琥珀底，网格内的色彩变化格） */}
          <Reveal delay={0.08} className="md:row-span-2">
            <div className="flex h-full flex-col justify-between border border-accent/30 bg-accent/10 p-5 md:p-6">
              <div>
                <SealCheck size={26} weight="regular" className="text-accent" aria-hidden />
                <h3 className="mt-4 font-serif text-lg">作品直达官方平台</h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
                  你在社团完成的优秀摄影与短片作品，将由社团直接向团省委新媒体矩阵及《黑河日报》选送推荐，被全校师生与全省青年共同关注。
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
                className="mt-6 flex w-full items-center justify-center gap-2 border border-accent/40 bg-accent/20 py-2.5 font-mono text-xs text-paper transition-all hover:bg-accent hover:text-ink active:scale-95"
              >
                <Play size={14} weight="fill" className="text-accent group-hover:text-ink" />
                <span>观看团省委转发原片 ▶</span>
              </button>
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
