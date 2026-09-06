import { CalendarDots, Camera, SealCheck } from "@phosphor-icons/react";
import { PhotoSlot } from "../components/PhotoSlot";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import { awardImage } from "../config/site";

/** S5 硬亮点：bento 网格（2+1 / 1+1，四项恰好填满，无空格） */
export function Highlights() {
  return (
    <section id="highlights" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle title="我们的底气" note="不空谈兴趣，用可以核实的事实说话。" />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {/* 大格：获奖与背书（证书拼图 + 事实清单，均来自社团提供的证书与成就视频） */}
          <Reveal className="md:col-span-2">
            <div className="flex h-full flex-col border border-line bg-ink-soft p-6">
              <h3 className="font-serif text-xl">获奖与背书</h3>
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
                <li>两届中俄交流活动宣传工作「先进集体」（党委宣传统战部）</li>
                <li>作品多次被团省委、省共青团官方账号转发</li>
                <li>照片登上《黑河日报》专题版面，获署名供稿</li>
                <li>校园全景航拍被学校后勤管理处采纳</li>
              </ul>
              <PhotoSlot spec={awardImage} className="mt-4 flex-1" />
            </div>
          </Reveal>
          {/* 右列大格：作品上官方平台（琥珀底，网格内的色彩变化格） */}
          <Reveal delay={0.08} className="md:row-span-2">
            <div className="flex h-full flex-col border border-accent/30 bg-accent/10 p-6">
              <SealCheck size={26} weight="regular" className="text-accent" aria-hidden />
              <h3 className="mt-4 font-serif text-lg">作品上官方平台</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                优秀作品可推荐至学校官方平台发表，让照片和短片被全校看见。
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="h-full border border-line bg-ink-soft p-6">
              <Camera size={26} weight="regular" className="text-accent" aria-hidden />
              <h3 className="mt-4 font-serif text-lg">专业设备资源</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                相机、镜头、灯光、稳定器，成员可借用创作。
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="h-full border border-line bg-ink-soft p-6">
              <CalendarDots size={26} weight="regular" className="text-accent" aria-hidden />
              <h3 className="mt-4 font-serif text-lg">往期活动丰富</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                微电影大赛、校园摄影月赛、读书分享会、主题外拍，全年不断。
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
