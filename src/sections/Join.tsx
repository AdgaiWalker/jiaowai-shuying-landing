import { Reveal } from "../components/Reveal";
import { contact, qrs } from "../config/site";

/**
 * S9 加入我们（转化收口）。手机上没法用相机扫自己屏幕里的码，
 * 微信内唯一路径是长按识别——所以微信群码做成全宽主卡放大码体，
 * 配「长按识别」提示；公众号 / 抖音为次级通道收在两列小格。
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
            {/* 主通道：微信群码，全宽主卡 + 长按识别提示 */}
            <div className="border border-accent/30 bg-accent/5 p-4 md:p-5">
              <div className="flex items-center gap-4">
                {primary.src ? (
                  <img
                    src={primary.src}
                    alt={`${primary.label}二维码`}
                    loading="lazy"
                    className="size-36 shrink-0 bg-white object-contain p-1 sm:size-44 md:size-48"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={`素材位：${primary.label}二维码`}
                    className="flex size-36 shrink-0 flex-col items-center justify-center gap-1 border border-dashed border-faint/70 px-2 text-center sm:size-44 md:size-48"
                  >
                    <span className="text-[10px] tracking-[0.3em] text-faint">素材位</span>
                    <span className="text-xs text-paper">{primary.label}</span>
                  </div>
                )}
                <div>
                  <p className="font-serif text-lg">{primary.label}</p>
                  <p className="mt-1 text-xs text-muted">{primary.note}</p>
                  <p className="mt-3 text-xs font-medium text-accent">长按二维码，识别后进群</p>
                </div>
              </div>
            </div>
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
