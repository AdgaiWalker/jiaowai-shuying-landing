import { Reveal } from "../components/Reveal";
import { contact, qrs } from "../config/site";

/**
 * S9 加入我们（转化收口）：三个通道，微信群码为主（9月13日前有效，过期需换图）。
 * 公众号 / 抖音真码待提供（此前收到的为主页截图，无法扫码）。
 */
export function Join() {
  return (
    <section id="join" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          {/* 眉标：本页第 2 处，克制使用 */}
          <p className="text-xs tracking-[0.25em] text-accent">长期开放 · 随时欢迎</p>
          <h2 className="mt-4 font-serif text-3xl font-semibold md:text-4xl">扫码加入焦外述影</h2>
        </Reveal>
        <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-5">
            <p className="max-w-[30em] leading-relaxed text-muted">
              进群认识大家，第一时间获取外拍、课堂与影展的消息。也可以先关注公众号和抖音，看一段时间再决定。
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
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {qrs.map((qr) => (
                <li key={qr.key} className="border border-line bg-ink-soft p-4">
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
                  <p className="mt-3 font-serif text-sm">{qr.label}</p>
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
