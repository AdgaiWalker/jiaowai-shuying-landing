import type { PhotoSpec } from "../config/site";

/**
 * 素材占位框：src 为 null 的素材统一用它占位，
 * 框内中文标注「这里该放什么、规格是多少」，替换素材后自动消失。
 */

const ratioClass: Record<PhotoSpec["ratio"], string> = {
  "9/16": "aspect-[9/16]",
  "2/3": "aspect-[2/3]",
  "3/4": "aspect-[3/4]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
};

type Props = {
  spec: PhotoSpec;
  className?: string;
};

export function PhotoSlot({ spec, className = "" }: Props) {
  if (spec.src) {
    return (
      <img
        src={spec.src}
        alt={spec.hint}
        loading="lazy"
        className={`w-full object-cover ${ratioClass[spec.ratio]} ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`素材位：${spec.title}`}
      className={`flex w-full flex-col items-center justify-center gap-1.5 border border-dashed border-faint/70 bg-ink-soft/70 px-4 text-center ${ratioClass[spec.ratio]} ${className}`}
    >
      <span className="text-[10px] tracking-[0.3em] text-faint">素材位</span>
      <span className="font-serif text-sm text-paper">{spec.title}</span>
      {spec.hint ? <span className="text-xs leading-relaxed text-muted">建议放：{spec.hint}</span> : null}
      {spec.spec ? <span className="text-[11px] text-faint">规格：{spec.spec}</span> : null}
    </div>
  );
}
