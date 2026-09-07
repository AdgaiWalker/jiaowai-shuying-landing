/** 区块标题：标题与说明纵向堆叠（左大右小的分栏式标题已禁用） */
export function SectionTitle({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-10 md:mb-14">
      <h2 className="font-serif text-3xl font-semibold tracking-[-0.022em] leading-[1.15] text-paper md:text-4xl md:tracking-[-0.026em]">{title}</h2>
      {note ? <p className="mt-3 max-w-[36em] text-sm leading-[1.7] text-muted">{note}</p> : null}
    </div>
  );
}
