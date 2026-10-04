import { Check, Search } from 'lucide-react';
import { cx } from '../lib';
import { SectionHead } from './ui';

const PEOPLE = [
  {
    name: 'Person A',
    initial: 'A',
    accent: 'blue' as const,
    prefs: ['MBA student', 'Travels frequently', 'Battery is important', 'Lightweight', "Doesn't game"],
    pick: 'AeroBook 14',
    reason: 'Lightweight with long battery life.',
  },
  {
    name: 'Person B',
    initial: 'B',
    accent: 'green' as const,
    prefs: ['MBA student', 'Uses heavy analytics tools', 'Performance is important', 'Wants GPU', 'Weight is less important'],
    pick: 'PowerBook 15',
    reason: 'Higher performance and stronger GPU.',
  },
];

export default function SameSearch() {
  return (
    <section className="px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1100px]">
        <SectionHead title="Same search. Different person. Different answer.">
          Your search is the same. Your recommendation shouldn't be.
        </SectionHead>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {PEOPLE.map((p) => (
            <article key={p.name} className="flex flex-col rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className={cx('flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white', p.accent === 'blue' ? 'bg-blue' : 'bg-green')}>{p.initial}</span>
                <h3 className="text-lg font-bold text-ink">{p.name}</h3>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-ink">
                <Search size={15} className="text-muted" /> Best laptop under ₹80,000
              </div>

              <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted">Preferences</div>
              <ul className="mt-3 space-y-2">
                {p.prefs.map((x) => (
                  <li key={x} className="flex items-center gap-2.5 text-[15px] text-ink">
                    <Check size={16} className={p.accent === 'blue' ? 'text-blue' : 'text-green'} /> {x}
                  </li>
                ))}
              </ul>

              <div className={cx('mt-7 rounded-2xl p-5', p.accent === 'blue' ? 'bg-blue-soft' : 'bg-green-soft')}>
                <div className={cx('text-xs font-semibold uppercase tracking-wider', p.accent === 'blue' ? 'text-blue' : 'text-[#137333]')}>NIRA recommendation</div>
                <div className="mt-1 text-2xl font-bold text-ink">{p.pick}</div>
                <p className="mt-1 text-[15px] text-muted">{p.reason}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 text-center text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          The query is identical. <span className="text-blue">The recommendation is personal.</span>
        </p>
      </div>
    </section>
  );
}
