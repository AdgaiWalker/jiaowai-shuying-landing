import { useState } from "react";
import { InlineVideo } from "../components/InlineVideo";
import { Lightbox } from "../components/Lightbox";
import { PhotoSlot } from "../components/PhotoSlot";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/SectionTitle";
import { douyinUrl, works } from "../config/site";

/**
 * S7 作品区：CSS 多列瀑布流 + 灯箱（有图可点开全屏，左右滑切换），
 * 结尾为精选短片内联播放 + 抖音扫码引导（微信内禁跳抖音）。
 */
export function Works() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="works" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <SectionTitle
            title="作品说话"
            note="九件代表作，横竖比混排；点击任意一张可全屏查看，更多作品在公众号与抖音。"
          />
        </Reveal>
        <div className="columns-2 gap-4 md:columns-3 md:gap-6">
          {works.map((w, i) => (
            <Reveal key={i} className="mb-4 break-inside-avoid md:mb-6">
              {w.src ? (
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`查看大图：${w.caption ?? w.hint}`}
                  className="block w-full cursor-zoom-in"
                >
                  <PhotoSlot spec={w} />
                </button>
              ) : (
                <PhotoSlot spec={w} />
              )}
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 border border-line bg-ink-soft p-4 md:p-5">
            <InlineVideo />
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-serif text-base">动态影像作品</p>
              <p className="text-xs text-faint">
                更多短片在抖音：
                {douyinUrl ? (
                  <a href={douyinUrl} className="text-accent underline underline-offset-4">
                    在抖音打开
                  </a>
                ) : (
                  "抖音号二维码见下方「加入我们」"
                )}
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <Lightbox items={works} index={active} onClose={() => setActive(null)} onNavigate={setActive} />
    </section>
  );
}
