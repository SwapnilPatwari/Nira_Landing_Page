import { ArrowDown, ArrowRight } from 'lucide-react';
import { cx } from '../lib';
import { SectionHead } from './ui';

const TRADITIONAL = ['Search', 'Open multiple websites', 'Compare manually', 'Read reviews', 'Ask friends', 'Make a decision'];
const WITH_NIRA = ['Tell NIRA what you need', 'NIRA understands your preferences', 'Compare relevant products', 'Get a personalized shortlist', 'Buy with confidence'];

function Steps({ steps, tone }: { steps: string[]; tone: 'grey' | 'blue' }) {
  return (
    <ol className="space-y-1.5">
      {steps.map((s, i) => (
        <li key={s}>
          <div className={cx('rounded-xl px-4 py-3 text-[15px] font-medium', tone === 'blue' ? 'bg-blue-soft text-blue' : 'bg-white text-muted ring-1 ring-line')}>{s}</div>
          {i < steps.length - 1 && <ArrowDown size={16} className={cx('mx-auto my-1', tone === 'blue' ? 'text-blue/60' : 'text-line')} aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

const MODES = [
  { name: 'Search', steps: ['Query', 'Results'], tone: 'grey' as const },
  { name: 'AI Mode', steps: ['Query', 'Conversation', 'Answer'], tone: 'grey' as const },
  { name: 'NIRA', steps: ['Need', 'Understand', 'Search', 'Compare', 'Act', 'Learn', 'Remember'], tone: 'blue' as const },
];

export default function Problem() {
  return (
    <section className="bg-surface px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1100px]">
        <SectionHead title="Finding a product is easy. Finding the right one isn't.">
          You can search hundreds of products, read dozens of reviews and still end up asking someone, “Which one should I buy?”
        </SectionHead>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-line bg-surface p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Traditional shopping</h3>
            <Steps steps={TRADITIONAL} tone="grey" />
          </div>
          <div className="rounded-3xl border border-blue/25 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue">With NIRA</h3>
            <Steps steps={WITH_NIRA} tone="blue" />
          </div>
        </div>

        {/* Search vs AI Mode vs NIRA */}
        <div className="mx-auto mt-20 max-w-4xl">
          <p className="mb-6 text-center text-xl font-semibold text-ink sm:text-2xl">
            AI Mode answers a shopping question.{' '}
            <span className="text-blue">NIRA builds a shopping relationship.</span>
          </p>
          <div className="space-y-3">
            {MODES.map((m) => (
              <div key={m.name} className={cx('flex flex-col gap-3 rounded-2xl border bg-white p-4 sm:flex-row sm:items-center', m.tone === 'blue' ? 'border-blue/30 shadow-sm' : 'border-line')}>
                <div className={cx('w-24 shrink-0 text-sm font-bold', m.tone === 'blue' ? 'text-blue' : 'text-muted')}>{m.name}</div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {m.steps.map((s, i) => (
                    <span key={s} className="flex items-center gap-1.5">
                      <span className={cx('rounded-full px-3 py-1 text-[13px] font-medium', m.tone === 'blue' ? 'bg-blue text-white' : 'bg-surface text-muted')}>{s}</span>
                      {i < m.steps.length - 1 && <ArrowRight size={14} className="text-line" aria-hidden="true" />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
