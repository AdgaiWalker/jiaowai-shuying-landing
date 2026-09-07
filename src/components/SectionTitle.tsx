/** 区块标题：支持可选眉标、大号衬线标题与说明排版 */
export function SectionTitle({
  title,
  note,
  eyebrow,
}: {
  title: string;
  note?: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-12 md:mb-16">
      {eyebrow ? (
        <span className="mb-3 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-accent backdrop-blur-sm">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-serif text-3xl font-semibold tracking-[-0.022em] leading-[1.15] text-paper md:text-4xl lg:text-5xl md:tracking-[-0.026em]">
        {title}
      </h2>
      {note ? (
        <p className="mt-3.5 max-w-[38em] text-sm leading-[1.7] text-muted md:text-base text-pretty">
          {note}
        </p>
      ) : null}
    </div>
  );
}
