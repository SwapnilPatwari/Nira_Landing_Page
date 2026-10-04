import { useState } from 'react';
import { JOURNEY } from '../data';
import { cx } from '../lib';
import { SectionHead } from './ui';

export default function Journey() {
  const [active, setActive] = useState(0);
  const pct = (active / (JOURNEY.length - 1)) * 100;

  return (
    <section id="journey" className="scroll-mt-16 px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1100px]">
        <SectionHead eyebrow="How it works" title="From “What should I buy?” to “Get it done.”" />

        {/* Desktop: horizontal, interactive */}
        <div className="mt-16 hidden md:block">
          <div className="relative">
            <div className="absolute left-[8.33%] right-[8.33%] top-6 h-px bg-line" aria-hidden="true" />
            <div className="absolute left-[8.33%] top-6 h-0.5 bg-blue transition-all duration-500" style={{ width: `${pct * 0.8333}%` }} aria-hidden="true" />
            <ol className="relative grid grid-cols-6">
              {JOURNEY.map((s, i) => (
                <li key={s.n} className="flex justify-center">
                  <button
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-current={active === i ? 'step' : undefined}
                    className="group flex flex-col items-center gap-3"
                  >
                    <span className={cx('flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white text-sm font-bold transition-all', i <= active ? 'border-blue text-blue' : 'border-line text-muted', active === i && 'scale-110 bg-blue text-white')}>
                      {s.n}
                    </span>
                    <span className={cx('text-base font-semibold transition-colors', active === i ? 'text-ink' : 'text-muted')}>{s.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="mx-auto mt-10 max-w-lg rounded-2xl bg-blue-soft px-6 py-5 text-center" aria-live="polite">
            <p key={active} className="animate-fade-up text-lg font-medium text-ink">{JOURNEY[active].text}</p>
          </div>
        </div>

        {/* Mobile: vertical */}
        <ol className="relative mx-auto mt-12 max-w-md space-y-8 md:hidden">
          <div className="absolute bottom-4 left-6 top-4 w-px bg-line" aria-hidden="true" />
          {JOURNEY.map((s) => (
            <li key={s.n} className="relative flex gap-4">
              <span className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-blue bg-white text-sm font-bold text-blue">{s.n}</span>
              <div className="pt-1.5">
                <div className="text-lg font-semibold text-ink">{s.label}</div>
                <p className="text-[15px] text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
