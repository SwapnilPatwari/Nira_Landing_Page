import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, BookmarkCheck, Brain, Check, ChevronUp, Link2, Mic, Search, ShoppingCart, SlidersHorizontal, Star, X,
} from 'lucide-react';
import {
  PRODUCTS, QUERY, formatINR, rankProducts, type PriorityKey, type Product,
} from '../data';
import { cx, useInView } from '../lib';
import { Modal } from './Modal';
import { Button, Chip, GoogleWord, NiraMark } from './ui';

interface Props {
  memoryOn: boolean;
  electronicsChips: string[];
  focusKey: number;
  onLearn: (chips: string[]) => void;
  toast: (msg: string) => void;
}

const PRIORITIES: { key: PriorityKey; label: string }[] = [
  { key: 'battery', label: 'Battery' },
  { key: 'performance', label: 'Performance' },
  { key: 'portability', label: 'Portability' },
];

type Phase = 0 | 1 | 2; // 0 = just opened, 1 = reading memory, 2 = answer shown

export default function SearchDemo({ memoryOn, electronicsChips, focusKey, onLearn, toast }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inView = useInView(rootRef, 0.2);

  const [query, setQuery] = useState(QUERY);
  const [cardVisible, setCardVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>(0);
  const [personalOpen, setPersonalOpen] = useState(false);
  const [priority, setPriority] = useState<PriorityKey | null>(null);
  const [gaming, setGaming] = useState<'no' | 'sometimes' | 'yes' | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const [modal, setModal] = useState<{ kind: 'compare' } | { kind: 'view'; id: string } | null>(null);
  const [cart, setCart] = useState<Product | null>(null);
  const [hint, setHint] = useState(false);

  // NIRA card appears a beat after the search is on screen.
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setCardVisible(true), 600);
    return () => clearTimeout(t);
  }, [inView]);

  // "Try NIRA" focuses the search box.
  useEffect(() => {
    if (focusKey === 0) return;
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 600);
    return () => clearTimeout(t);
  }, [focusKey]);

  // Staged reveal inside the workspace: reading memory -> answer.
  useEffect(() => {
    if (!open) return;
    setPhase(0);
    const a = setTimeout(() => setPhase(1), 450);
    const b = setTimeout(() => setPhase(2), 1500);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [open]);

  const ranked = useMemo(
    () => rankProducts(memoryOn, electronicsChips, priority, gaming),
    [memoryOn, electronicsChips, priority, gaming],
  );
  const byId = (id: string) => PRODUCTS.find((p) => p.id === id)!;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/laptop|notebook/i.test(query)) {
      setHint(true);
      setQuery(QUERY);
      return;
    }
    setHint(false);
    setCardVisible(false);
    setOpen(false);
    setTimeout(() => setCardVisible(true), 350);
  };

  const toggleCompare = (id: string) =>
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? c : [...c, id]));

  const addToCart = (p: Product) => {
    setCart(p);
    setModal(null);
    if (memoryOn) onLearn(p.learned);
    else toast('Shopping Memory is paused — nothing was saved');
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#shortlist=${ranked.map((p) => p.id).join(',')}`;
    try { await navigator.clipboard.writeText(url); } catch { /* clipboard may be blocked; still confirm in the demo */ }
    toast('Shortlist link copied');
  };

  const whyText = !memoryOn
    ? "Shopping Memory is paused, so I only used this search and what's popular right now."
    : "I prioritized your budget, portability and battery preferences. I also excluded models that don't meet your preferred weight range.";

  return (
    <div ref={rootRef} id="demo" className="scroll-mt-20">
      <div className="mx-auto max-w-[1100px] overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_12px_40px_-12px_rgba(60,64,67,0.25)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-red/70" />
            <span className="h-3 w-3 rounded-full bg-yellow/80" />
            <span className="h-3 w-3 rounded-full bg-green/70" />
          </div>
          <div className="mx-auto flex h-8 min-w-0 flex-1 items-center overflow-hidden rounded-full bg-white px-4 text-xs text-muted ring-1 ring-line sm:max-w-md">
            <span className="block min-w-0 truncate">google.com/search?q={encodeURIComponent(query).slice(0, 38)}…</span>
          </div>
          <span className="hidden w-12 sm:block" />
        </div>

        {/* Search header */}
        <div className="px-4 pb-0 pt-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <GoogleWord className="text-3xl" />
            <form onSubmit={submit} className="flex h-12 flex-1 items-center gap-3 rounded-full border border-line bg-white px-5 shadow-sm focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue/30">
              <Search size={18} className="text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none"
              />
              <Mic size={18} className="hidden text-blue sm:block" />
              <button type="submit" aria-label="Search" className="rounded-full p-1 text-blue hover:bg-blue-soft"><ArrowRight size={18} /></button>
            </form>
          </div>
          {hint && (
            <p className="mt-3 text-sm text-muted">
              This demo is tuned for laptops, so I've put the suggested search back.
            </p>
          )}
          <div className="mt-4 flex gap-6 overflow-x-auto text-sm text-muted no-scrollbar" role="tablist" aria-label="Search filters">
            {['All', 'Shopping', 'Images', 'News', 'Videos'].map((t) => (
              <span key={t} className={cx('whitespace-nowrap border-b-[3px] pb-2.5', t === 'All' ? 'border-blue font-medium text-blue' : 'border-transparent')}>{t}</span>
            ))}
          </div>
        </div>
        <div className="border-t border-line" />

        {/* Results area */}
        <div className="bg-white px-4 py-6 sm:px-8 sm:py-8">
          {/* ---- NIRA card ---- */}
          <div
            className={cx(
              'overflow-hidden rounded-3xl border bg-white transition-all duration-500',
              cardVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none h-0 translate-y-3 border-transparent opacity-0',
              open ? 'border-blue/30 shadow-[0_8px_30px_-10px_rgba(26,115,232,0.35)]' : 'border-line shadow-sm',
            )}
          >
            <div className="bg-gradient-to-b from-blue-soft/70 to-white p-5 sm:p-6">
              {/* header */}
              <div className="flex items-center gap-3">
                <NiraMark size={34} />
                <div className="leading-tight">
                  <div className="text-[17px] font-bold text-ink">NIRA</div>
                  <div className={cx('whitespace-nowrap text-xs text-muted', open && 'hidden sm:block')}>{open ? 'Your shopping agent' : 'Shopping agent'}</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {open && (
                    <span className={cx('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium', memoryOn ? 'bg-green-soft text-[#137333]' : 'bg-surface text-muted')}>
                      <span className={cx('h-1.5 w-1.5 rounded-full', memoryOn ? 'bg-green' : 'bg-muted')} />
                      {memoryOn ? 'Shopping Memory · On' : 'Shopping Memory · Paused'}
                    </span>
                  )}
                  {open && (
                    <button onClick={() => setOpen(false)} aria-label="Collapse NIRA" className="rounded-full p-1.5 text-muted hover:bg-white">
                      <ChevronUp size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* compact body */}
              <div className={cx('grid transition-[grid-template-rows,opacity] duration-500', open ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100')}>
                <div className="min-h-0 overflow-hidden">
                  <p className="mt-4 text-xl font-semibold leading-snug text-ink sm:text-2xl">
                    I can help you find the right one, not just the most popular one.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Button onClick={() => setOpen(true)} tabIndex={open ? -1 : 0}>Ask NIRA</Button>
                    <span className="flex items-center gap-1.5 text-[13px] text-muted">
                      <Brain size={14} /> Personalized using your Shopping Memory
                    </span>
                  </div>
                </div>
              </div>

              {/* expanded workspace */}
              <div className={cx('grid transition-[grid-template-rows,opacity] duration-500', open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                <div className="min-h-0 overflow-hidden" aria-hidden={!open}>
                  <div className="space-y-5 pt-5">
                    {/* user request */}
                    <div className="flex justify-end">
                      <p className="max-w-[85%] rounded-2xl rounded-br-md bg-blue px-4 py-2.5 text-[15px] text-white">
                        I'm looking for a laptop for my MBA under ₹80,000.
                      </p>
                    </div>

                    {/* memory being used */}
                    {phase >= 1 && memoryOn && (
                      <div className="animate-fade-up flex flex-wrap items-center gap-2 text-[13px] text-muted">
                        <Brain size={14} className="text-blue" /> From your Shopping Memory:
                        {electronicsChips.slice(0, 4).map((c) => <Chip key={c} tone="blue">{c}</Chip>)}
                      </div>
                    )}
                    {phase === 1 && (
                      <div className="flex items-center gap-2 text-sm text-muted" role="status">
                        <span className="flex gap-1">
                          {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue" style={{ animationDelay: `${i * 120}ms` }} />)}
                        </span>
                        {memoryOn ? 'Checking what matters to you…' : 'Searching…'}
                      </div>
                    )}

                    {phase >= 2 && (
                      <div className="animate-fade-up space-y-5">
                        <div className="flex gap-3">
                          <NiraMark size={26} />
                          <p className="text-[15px] leading-relaxed text-ink">
                            {memoryOn
                              ? "Based on what you've told me, portability and battery life matter most to you. I've narrowed it down to three strong matches."
                              : "Shopping Memory is paused, so I'm using only this search. Here are three popular matches under ₹80,000."}
                            {priority && <span className="font-medium"> Got it — {priority} comes first now.</span>}
                          </p>
                        </div>

                        {/* personalise */}
                        <div>
                          <button
                            onClick={() => setPersonalOpen((v) => !v)}
                            aria-expanded={personalOpen}
                            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-blue hover:bg-blue-soft"
                          >
                            <SlidersHorizontal size={15} /> Make this more personal
                          </button>
                          {personalOpen && (
                            <div className="animate-fade-up mt-3 space-y-4 rounded-2xl border border-line bg-white p-4">
                              <Question title="What's more important?">
                                {PRIORITIES.map((p) => (
                                  <Option key={p.key} active={priority === p.key} onClick={() => setPriority(p.key)}>{p.label}</Option>
                                ))}
                              </Question>
                              <Question title="Will you game on it?">
                                {(['no', 'sometimes', 'yes'] as const).map((g) => (
                                  <Option key={g} active={gaming === g} onClick={() => setGaming(g)}>{g[0].toUpperCase() + g.slice(1)}</Option>
                                ))}
                              </Question>
                            </div>
                          )}
                        </div>

                        {/* product cards */}
                        <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2 no-scrollbar md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
                          {ranked.map((p, i) => (
                            <ProductCard
                              key={p.id + '-' + i}
                              product={p}
                              rank={i}
                              inCompare={compare.includes(p.id)}
                              onCompare={() => toggleCompare(p.id)}
                              onView={() => setModal({ kind: 'view', id: p.id })}
                            />
                          ))}
                        </div>

                        {cart && (
                          <div className="animate-fade-up flex flex-col gap-3 rounded-2xl bg-green-soft p-4 sm:flex-row sm:items-center">
                            <Check className="shrink-0 text-green" />
                            <div className="flex-1 text-sm text-[#137333]">
                              <strong>{cart.name}</strong> is in your cart.{' '}
                              {memoryOn ? <>NIRA learned: {cart.learned.join(' · ')}.</> : 'Memory is paused, so nothing was learned.'}
                            </div>
                            <Button size="sm" onClick={() => toast('Demo only — NIRA would hand off to a connected merchant here')}>
                              Buy with a connected merchant
                            </Button>
                          </div>
                        )}

                        <div className="rounded-2xl bg-surface p-4">
                          <div className="text-sm font-semibold text-ink">Why these?</div>
                          <p className="mt-1 text-sm leading-relaxed text-muted">{whyText}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Button variant="secondary" size="sm" onClick={share}><Link2 size={15} /> Share shortlist</Button>
                          <span className="flex items-center gap-1.5 text-xs text-muted"><BookmarkCheck size={14} /> Anyone with the link sees the same shortlist</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- ordinary results: NIRA sits above them ---- */}
          <div className="mt-8 space-y-6 opacity-80" aria-label="Regular search results">
            {[
              ['laptopguide.example', 'Best laptops for MBA students in India (2026)', 'We compared thirty laptops on weight, battery life and price so you can skip the spec sheets…'],
              ['reviewhub.example', 'Top 10 laptops under ₹80,000', 'From ultraportables to performance machines, here are the models reviewers keep recommending…'],
              ['campusnotes.example', 'What laptop do you actually need for business school?', 'Most programmes need a reliable machine for spreadsheets, video calls and long days on campus…'],
            ].map(([site, title, snippet]) => (
              <div key={title} className="max-w-2xl">
                <div className="text-xs text-muted">{site}</div>
                <div className="text-lg text-[#1a0dab]">{title}</div>
                <p className="mt-0.5 text-sm text-muted">{snippet}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compare tray */}
      {compare.length > 0 && (
        <div className="animate-pop fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl items-center gap-3 rounded-full border border-line bg-white py-2 pl-5 pr-2 shadow-xl" role="region" aria-label="Comparison tray">
          <span className="text-sm font-medium text-ink">
            {compare.length} product{compare.length > 1 ? 's' : ''} selected
          </span>
          <span className="hidden truncate text-xs text-muted sm:block">{compare.map((id) => byId(id).name).join(' · ')}</span>
          <button onClick={() => setCompare([])} className="ml-auto rounded-full p-1.5 text-muted hover:bg-surface" aria-label="Clear comparison"><X size={16} /></button>
          <Button size="sm" disabled={compare.length < 2} onClick={() => setModal({ kind: 'compare' })}>Compare now</Button>
        </div>
      )}

      {modal?.kind === 'compare' && (
        <Modal title="Compare" onClose={() => setModal(null)}>
          <CompareTable products={compare.map(byId)} topId={ranked[0].id} onAdd={addToCart} />
        </Modal>
      )}
      {modal?.kind === 'view' && (
        <Modal title={byId(modal.id).name} onClose={() => setModal(null)}>
          <CompareTable products={[byId(modal.id)]} topId={ranked[0].id} onAdd={addToCart} />
        </Modal>
      )}
    </div>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-ink">{title}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Option({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
        active ? 'border-blue bg-blue text-white' : 'border-line bg-white text-ink hover:bg-blue-soft',
      )}
    >
      {children}
    </button>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-yellow" aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} fill="currentColor" strokeWidth={0} />)}
      <span className="ml-1 text-[13px] font-medium text-muted">{rating}</span>
    </span>
  );
}

function ProductCard({ product: p, rank, inCompare, onCompare, onView }: {
  product: Product; rank: number; inCompare: boolean; onCompare: () => void; onView: () => void;
}) {
  return (
    <article className={cx('animate-fade-up flex min-w-[250px] snap-start flex-col rounded-2xl border bg-white p-4 md:min-w-0', rank === 0 ? 'border-blue/40 ring-1 ring-blue/20' : 'border-line')}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-24 w-full items-center justify-center rounded-xl bg-surface">
          <div className="h-12 w-20 rounded-md border-2 border-line bg-white" aria-hidden="true">
            <div className="mx-auto mt-1 h-7 w-[72px] rounded-sm bg-blue-soft" />
          </div>
        </div>
      </div>
      {rank === 0 && <Chip tone="blue" className="mb-2 self-start font-medium">Top pick for you</Chip>}
      <h4 className="text-lg font-bold text-ink">{p.name}</h4>
      <div className="mt-0.5 flex items-center justify-between">
        <span className="text-xl font-semibold text-ink">{formatINR(p.price)}</span>
        <Stars rating={p.rating} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.tags.map((t) => <Chip key={t} className="py-0.5 text-xs">{t}</Chip>)}
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.reason}</p>
      <div className="mt-4 flex gap-2">
        <Button variant={inCompare ? 'soft' : 'secondary'} size="sm" className="flex-1" onClick={onCompare} aria-pressed={inCompare}>
          {inCompare ? <><Check size={14} /> Added</> : 'Compare'}
        </Button>
        <Button variant="soft" size="sm" className="flex-1" onClick={onView}>View</Button>
      </div>
    </article>
  );
}

function CompareTable({ products, topId, onAdd }: { products: Product[]; topId: string; onAdd: (p: Product) => void }) {
  const labels = products[0].specs.map(([l]) => l);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th className="w-28 p-2" />
            {products.map((p) => (
              <th key={p.id} className="p-2 align-top">
                <div className="text-base font-bold text-ink">{p.name}</div>
                {p.id === topId && <Chip tone="blue" className="mt-1 text-xs">Top pick for you</Chip>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_td]:border-t [&_td]:border-line [&_td]:p-2 [&_th]:border-t [&_th]:border-line">
          <tr><th scope="row" className="p-2 font-medium text-muted">Price</th>{products.map((p) => <td key={p.id} className="font-semibold">{formatINR(p.price)}</td>)}</tr>
          <tr><th scope="row" className="p-2 font-medium text-muted">Rating</th>{products.map((p) => <td key={p.id}>★ {p.rating}</td>)}</tr>
          {labels.map((l, i) => (
            <tr key={l}><th scope="row" className="p-2 font-medium text-muted">{l}</th>{products.map((p) => <td key={p.id}>{p.specs[i][1]}</td>)}</tr>
          ))}
          <tr><th scope="row" className="p-2 font-medium text-muted">Why NIRA picked it</th>{products.map((p) => <td key={p.id} className="text-muted">{p.reason}</td>)}</tr>
          <tr><th />{products.map((p) => (
            <td key={p.id}><Button size="sm" onClick={() => onAdd(p)}><ShoppingCart size={15} /> Add to cart</Button></td>
          ))}</tr>
        </tbody>
      </table>
    </div>
  );
}
