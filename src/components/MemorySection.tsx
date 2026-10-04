import { useEffect, useRef, useState } from 'react';
import { Pause, Pencil, Play, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import type { MemoryGroup } from '../data';
import { cx, useInView } from '../lib';
import { Button, Chip, NiraMark, SectionHead } from './ui';

interface Props {
  groups: MemoryGroup[];
  setGroups: (g: MemoryGroup[]) => void;
  memoryOn: boolean;
  setMemoryOn: (v: boolean) => void;
  editing: boolean;
  setEditing: (v: boolean) => void;
}

export default function MemorySection({ groups, setGroups, memoryOn, setMemoryOn, editing, setEditing }: Props) {
  const [backup, setBackup] = useState<MemoryGroup[] | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const remove = (gid: string, chip: string) =>
    setGroups(groups.map((g) => (g.id === gid ? { ...g, chips: g.chips.filter((c) => c !== chip) } : g)));

  const add = (gid: string) => {
    const v = (drafts[gid] ?? '').trim();
    if (!v) return;
    setGroups(groups.map((g) => (g.id === gid && !g.chips.includes(v) ? { ...g, chips: [...g.chips, v] } : g)));
    setDrafts({ ...drafts, [gid]: '' });
  };

  const clearAll = () => {
    setBackup(groups);
    setGroups(groups.map((g) => ({ ...g, chips: [] })));
  };

  const total = groups.reduce((n, g) => n + g.chips.length, 0);

  return (
    <section id="memory" className="scroll-mt-16 bg-surface px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1100px]">
        <SectionHead eyebrow="Shopping Memory" title="NIRA remembers how you shop.">
          With your permission, NIRA learns the preferences that make your next shopping decision easier.
        </SectionHead>

        {/* Dashboard */}
        <div className="mt-14 rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <NiraMark size={32} />
              <div>
                <div className="font-bold text-ink">Shopping Memory</div>
                <div role="status" aria-live="polite" className={cx('flex items-center gap-1.5 text-sm font-medium', memoryOn ? 'text-[#137333]' : 'text-muted')}>
                  <span className={cx('h-2 w-2 rounded-full', memoryOn ? 'bg-green' : 'bg-muted')} />
                  {memoryOn ? 'Shopping Memory on' : 'Shopping Memory paused'}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={editing ? 'primary' : 'secondary'} size="sm" onClick={() => setEditing(!editing)} disabled={!memoryOn}>
                <Pencil size={14} /> {editing ? 'Done' : 'Edit'}
              </Button>
              <Button variant="secondary" size="sm" onClick={clearAll} disabled={total === 0}>
                <Trash2 size={14} /> Delete
              </Button>
              <Button variant={memoryOn ? 'secondary' : 'primary'} size="sm" onClick={() => setMemoryOn(!memoryOn)}>
                {memoryOn ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Resume</>}
              </Button>
            </div>
          </div>

          {backup && (
            <div className="animate-fade-up mt-4 flex items-center justify-between rounded-xl bg-surface px-4 py-3 text-sm text-muted">
              Memory cleared.
              <button className="inline-flex items-center gap-1.5 font-medium text-blue" onClick={() => { setGroups(backup); setBackup(null); }}>
                <RotateCcw size={14} /> Undo
              </button>
            </div>
          )}

          <div className={cx('mt-6 grid gap-4 transition-opacity md:grid-cols-3', !memoryOn && 'pointer-events-none opacity-50')} aria-disabled={!memoryOn}>
            {groups.map((g) => (
              <div key={g.id} className="rounded-2xl border border-line p-5">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">{g.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.chips.length === 0 && <span className="text-sm text-muted">Nothing saved</span>}
                  {g.chips.map((c) => (
                    <Chip key={c} tone="blue" className="animate-pop">
                      {c}
                      {editing && (
                        <button onClick={() => remove(g.id, c)} aria-label={`Delete ${c}`} className="-mr-1 rounded-full p-0.5 hover:bg-white/70">
                          <X size={12} />
                        </button>
                      )}
                    </Chip>
                  ))}
                </div>
                {editing && (
                  <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); add(g.id); }}>
                    <input
                      value={drafts[g.id] ?? ''}
                      onChange={(e) => setDrafts({ ...drafts, [g.id]: e.target.value })}
                      placeholder="Add a preference"
                      aria-label={`Add a ${g.title} preference`}
                      maxLength={32}
                      className="min-w-0 flex-1 rounded-full border border-line px-3 py-1.5 text-sm outline-none focus:border-blue"
                    />
                    <button type="submit" aria-label="Add" className="rounded-full bg-blue p-2 text-white hover:bg-blue-dark"><Plus size={14} /></button>
                  </form>
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-lg font-semibold text-ink">You don't need to explain yourself every time.</p>
        </div>

        <LearningDemo />
      </div>
    </section>
  );
}

/** First purchase -> NIRA learns -> next purchase uses it. Plays when scrolled into view. */
function LearningDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, 0.4);
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);

  // (Re)start the sequence when scrolled into view or when Replay is pressed.
  useEffect(() => {
    setStep(0);
    if (!seen) return;
    const ts = [setTimeout(() => setStep(1), 500), setTimeout(() => setStep(2), 1700), setTimeout(() => setStep(3), 2700)];
    return () => ts.forEach(clearTimeout);
  }, [seen, run]);

  return (
    <div ref={ref} className="mt-10 rounded-3xl border border-line bg-white p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink">See it learn</h3>
        <Button variant="ghost" size="sm" onClick={() => setRun((r) => r + 1)}><RotateCcw size={14} /> Replay</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
        <div className="rounded-2xl bg-surface p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">First purchase</div>
          <p className="mt-2 text-[15px] text-ink">User buys <strong>Running shoes</strong></p>
          <div className={cx('mt-4 transition-all duration-500', step >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0')}>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue"><NiraMark size={18} /> NIRA learns</div>
            <div className="flex flex-wrap gap-2">
              {['Size 9', 'Lightweight', '₹3,000–₹5,000'].map((c) => <Chip key={c} tone="blue">{c}</Chip>)}
            </div>
          </div>
        </div>
        <div className="hidden items-center text-line md:flex" aria-hidden="true">
          <div className="h-px w-10 bg-line" />
        </div>
        <div className="rounded-2xl bg-surface p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">Next purchase</div>
          <div className={cx('mt-2 transition-opacity duration-500', step >= 2 ? 'opacity-100' : 'opacity-0')}>
            <p className="text-[15px] italic text-ink">“I need new running shoes.”</p>
          </div>
          <div className={cx('mt-4 flex gap-2 rounded-xl bg-white p-3 ring-1 ring-blue/20 transition-all duration-500', step >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0')}>
            <NiraMark size={22} />
            <p className="text-[15px] font-semibold text-ink">I remember your usual size and budget.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
