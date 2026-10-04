import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cx, scrollToId } from '../lib';
import { Button } from './ui';

const LINKS = [
  { label: 'NIRA', target: 'top' },
  { label: 'How it works', target: 'journey' },
  { label: 'Shopping Memory', target: 'memory' },
  { label: 'Trust', target: 'trust' },
];

export default function Nav({ onTry }: { onTry: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (target: string) => {
    setOpen(false);
    if (target === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    else scrollToId(target);
  };

  return (
    <header className={cx('sticky top-0 z-40 bg-white/90 backdrop-blur transition-shadow', scrolled && 'shadow-[0_1px_0_0_var(--color-line)]')}>
      <nav className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-4 sm:px-8" aria-label="Main">
        <button onClick={() => go('top')} className="flex items-center gap-2 text-[22px] leading-none" aria-label="Google NIRA, back to top">
          <span className="font-medium text-muted">Google</span>
          <span className="rounded-lg bg-blue-soft px-2 py-1 text-[17px] font-extrabold tracking-wide text-blue">NIRA</span>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.label}>
              <button onClick={() => go(l.target)} className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink">
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button onClick={onTry} size="sm" className="sm:h-10 sm:px-5 sm:text-sm">Try NIRA</Button>
          <button className="rounded-full p-2 text-ink hover:bg-surface md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="animate-fade-up border-t border-line bg-white px-4 pb-4 md:hidden">
          {LINKS.map((l) => (
            <button key={l.label} onClick={() => go(l.target)} className="block w-full border-b border-surface py-3.5 text-left text-base font-medium text-ink">
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
