import { Eye, Pause, Pencil, Trash2 } from 'lucide-react';
import { Button, Chip, NiraMark, SectionHead } from './ui';

export type MemoryAction = 'view' | 'edit' | 'delete' | 'pause';

export default function Trust({ memoryOn, onAction }: { memoryOn: boolean; onAction: (a: MemoryAction) => void }) {
  const controls: { a: MemoryAction; label: string; icon: typeof Eye }[] = [
    { a: 'view', label: 'View', icon: Eye },
    { a: 'edit', label: 'Edit', icon: Pencil },
    { a: 'delete', label: 'Delete', icon: Trash2 },
    { a: 'pause', label: memoryOn ? 'Pause' : 'Resume', icon: Pause },
  ];
  return (
    <section id="trust" className="scroll-mt-16 px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1100px]">
        <SectionHead eyebrow="Trust" title="Your recommendation isn't for sale.">
          NIRA recommends products based on your needs and relevant product information. Sponsored offers are clearly labelled and kept separate from NIRA's recommendation.
        </SectionHead>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border-2 border-blue bg-white p-7 shadow-[0_8px_30px_-12px_rgba(26,115,232,0.4)]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-ink"><NiraMark size={22} /> NIRA Recommendation</span>
              <Chip tone="blue" className="font-semibold">Best match</Chip>
            </div>
            <div className="mt-6 text-3xl font-bold text-ink">AeroBook 14</div>
            <p className="mt-2 text-base leading-relaxed text-muted">Best fit for your budget, portability and battery requirements.</p>
          </article>

          <article className="rounded-3xl border border-dashed border-line bg-surface p-7">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted">Sponsored offer</span>
              <span className="rounded-md border border-muted/40 px-2 py-0.5 text-xs font-bold tracking-wide text-muted">Sponsored</span>
            </div>
            <div className="mt-6 text-3xl font-bold text-muted">Brand X Laptop</div>
            <p className="mt-2 text-base text-muted">₹3,000 cashback</p>
            <p className="mt-6 text-xs text-muted">Paid placement. It never changes NIRA's ranking.</p>
          </article>
        </div>

        <div className="mt-10 rounded-3xl bg-surface p-6 text-center sm:p-8">
          <h3 className="text-xl font-bold text-ink">You control your Shopping Memory</h3>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {controls.map(({ a, label, icon: Icon }) => (
              <Button key={a} variant="secondary" onClick={() => onAction(a)}><Icon size={16} /> {label}</Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
