import { Reveal } from "../components/Reveal";
import { DarkroomDevPaper } from "../components/xpbd/DarkroomDevPaper";
import { contact, qrs } from "../config/site";

/**
 * S9 加入我们（转化收口）。
 * 候选 2：暗房显影浸盘与潜影相纸 (XPBD 晃动流体阻尼与化学还原显影)；
 * 显影完成后提供清晰二维码图片供微信直接长按识别扫码进群；公众号/抖音收在两列小格。
 */
export function Join() {
  const primary = qrs.find((q) => q.key === "wx") ?? qrs[0];
  const secondary = qrs.filter((q) => q !== primary);

  return (
    <section id="join" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          {/* 眉标：本页第 2 处，克制使用 */}
          <p className="text-xs tracking-[0.25em] text-accent">通道长期开启 · 随时进入</p>
          <h2 className="mt-4 font-serif text-3xl font-semibold md:text-4xl">你的光影生活从这里开始</h2>
        </Reveal>
        <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-5">
            <p className="max-w-[30em] text-pretty leading-relaxed text-muted">
              进群后，你将第一时间获取外拍通知、技能研习安排与设备借调流程。这里是你未来四年的影像根据地。
            </p>
            <dl className="mt-8 space-y-3 text-sm">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-faint">负责人微信</dt>
                <dd>{contact.wechat}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-faint">联系邮箱</dt>
                <dd>{contact.email}</dd>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-7">
            {/* 主通道：暗房显影浸盘与潜影相纸 (XPBD 晃动/提拉显影) */}
            <DarkroomDevPaper primary={primary} />
            {/* 次级通道：公众号 / 抖音 */}
            <ul className="mt-4 grid grid-cols-2 gap-4">
              {secondary.map((qr) => (
                <li key={qr.key} className="border border-line bg-ink-soft p-3 md:p-4">
                  {qr.src ? (
                    <img
                      src={qr.src}
                      alt={`${qr.label}二维码`}
                      loading="lazy"
                      className="aspect-square w-full bg-white object-contain p-1"
                    />
                  ) : (
                    <div
                      role="img"
                      aria-label={`素材位：${qr.label}二维码`}
                      className="flex aspect-square w-full flex-col items-center justify-center gap-1 border border-dashed border-faint/70 px-2 text-center"
                    >
                      <span className="text-[10px] tracking-[0.3em] text-faint">素材位</span>
                      <span className="text-xs text-paper">{qr.label}</span>
                      <span className="text-[11px] leading-relaxed text-faint">
                        {qr.file}
                        <br />
                        ≥600×600 PNG 白底
                      </span>
                    </div>
                  )}
                  <p className="mt-2.5 font-serif text-sm">{qr.label}</p>
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
