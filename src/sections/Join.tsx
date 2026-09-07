import { Reveal } from "../components/Reveal";
import { DarkroomDevPaper } from "../components/xpbd/DarkroomDevPaper";
import { contact, qrs } from "../config/site";
import { SectionTitle } from "../components/SectionTitle";

/**
 * S9 加入我们（转化收口）：
 * 暗房显影浸盘与潜影相纸 (XPBD 晃动流体阻尼与化学还原显影)；
 * 显影完成后提供清晰二维码图片供微信直接长按识别扫码进群；公众号/抖音收在磨砂玻璃副卡中。
 */
export function Join() {
  const primary = qrs.find((q) => q.key === "wx") ?? qrs[0];
  const secondary = qrs.filter((q) => q !== primary);

  return (
    <section id="join" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle
            eyebrow="ONBOARDING · 加入通道"
            title="你的光影生活，从此刻对焦"
            note="社团招新通道长期开启。进群后第一时间获取外拍通告、暗房体验与器材调配。"
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* 左侧：入社须知与直达联络 */}
          <Reveal className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-base leading-relaxed text-muted/90 md:text-lg text-pretty font-light">
                这里将是你未来四年自由创作的根据地。无论你手持专业微单还是手机，只要你想捕捉光影，这里就有你的同路人。
              </p>

              <div className="mt-8 surface-glass double-bezel rounded-2xl p-6">
                <p className="text-[11px] font-mono tracking-wider text-accent uppercase">
                  DIRECT CONTACT // 联络通道
                </p>
                <dl className="mt-4 space-y-3.5 text-sm">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <dt className="text-faint">负责人微信</dt>
                    <dd className="font-mono font-medium text-paper">{contact.wechat}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-faint">联系邮箱</dt>
                    <dd className="font-mono text-muted/90">{contact.email}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-8 text-xs text-faint">
              <span>* 扫码进群后请将群昵称修改为「年级-专业-姓名」，便于器材登记</span>
            </div>
          </Reveal>

          {/* 右侧：主通道（暗房显影浸盘）+ 次级通道 */}
          <Reveal delay={0.08} className="lg:col-span-7">
            {/* 暗房显影浸盘与潜影相纸 */}
            <DarkroomDevPaper primary={primary} />

            {/* 次级通道：公众号 / 抖音（磨砂双层倒角玻璃） */}
            <ul className="mt-6 grid grid-cols-2 gap-4">
              {secondary.map((qr) => (
                <li
                  key={qr.key}
                  className="surface-glass double-bezel rounded-2xl p-4 transition-transform hover:-translate-y-0.5"
                >
                  {qr.src ? (
                    <img
                      src={qr.src}
                      alt={`${qr.label}二维码`}
                      loading="lazy"
                      className="aspect-square w-full rounded-xl bg-white object-contain p-2 shadow-inner"
                    />
                  ) : (
                    <div
                      role="img"
                      aria-label={`素材位：${qr.label}二维码`}
                      className="flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-2 text-center"
                    >
                      <span className="text-[10px] tracking-[0.3em] text-accent">素材位</span>
                      <span className="text-xs text-paper">{qr.label}</span>
                      <span className="text-[10px] leading-relaxed text-faint">
                        {qr.file}
                      </span>
                    </div>
                  )}
                  <p className="mt-3 font-serif text-sm font-medium text-paper">{qr.label}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{qr.note}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
