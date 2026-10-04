import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../lib';

export function NiraMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <circle cx="16" cy="16" r="16" fill="#1a73e8" />
      <path d="M10.5 22V10l11 12V10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Text-only "Google" wordmark (no external logo). */
export function GoogleWord({ className = '' }: { className?: string }) {
  const letters: [string, string][] = [
    ['G', 'text-blue'], ['o', 'text-red'], ['o', 'text-yellow'],
    ['g', 'text-blue'], ['l', 'text-green'], ['e', 'text-red'],
  ];
  return (
    <span className={cx('font-semibold tracking-tight', className)} aria-label="Google">
      {letters.map(([c, k], i) => <span key={i} className={k}>{c}</span>)}
    </span>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
};

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: BtnProps) {
  const sizes = { sm: 'h-8 px-3 text-[13px]', md: 'h-10 px-5 text-sm', lg: 'h-12 px-8 text-base' };
  const variants = {
    primary: 'bg-blue text-white hover:bg-blue-dark shadow-sm',
    secondary: 'bg-white text-blue border border-line hover:bg-blue-soft',
    soft: 'bg-blue-soft text-blue hover:bg-[#d2e3fc]',
    ghost: 'text-muted hover:bg-surface',
  };
  return (
    <button
      {...rest}
      className={cx(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        sizes[size], variants[variant], className,
      )}
    >
      {children}
    </button>
  );
}

export function Chip({ children, tone = 'neutral', className }: { children: ReactNode; tone?: 'neutral' | 'blue' | 'green'; className?: string }) {
  const tones = {
    neutral: 'bg-surface text-muted border-line',
    blue: 'bg-blue-soft text-blue border-transparent',
    green: 'bg-green-soft text-[#137333] border-transparent',
  };
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[13px]', tones[tone], className)}>
      {children}
    </span>
  );
}

export function SectionHead({ eyebrow, title, children, className }: { eyebrow?: string; title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={cx('mx-auto max-w-3xl text-center', className)}>
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-blue">{eyebrow}</p>}
      <h2 className="text-[32px] font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl">{title}</h2>
      {children && <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{children}</p>}
    </div>
  );
}
