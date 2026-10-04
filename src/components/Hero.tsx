import { Button } from './ui';

export default function Hero({ onTry }: { onTry: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-10 pt-14 text-center sm:px-8 sm:pb-14 sm:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,#e8f0fe_0%,rgba(255,255,255,0)_100%)]" />
      <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue">
        <span className="flex gap-1" aria-hidden="true">
          <i className="h-1.5 w-1.5 rounded-full bg-blue" /><i className="h-1.5 w-1.5 rounded-full bg-red" />
          <i className="h-1.5 w-1.5 rounded-full bg-yellow" /><i className="h-1.5 w-1.5 rounded-full bg-green" />
        </span>
        Meet NIRA
      </p>
      <h1 className="mx-auto max-w-[850px] text-[40px] font-bold leading-[1.06] tracking-tight text-ink sm:text-6xl lg:text-[70px]">
        Search knows what you asked for.{' '}
        <span className="text-blue">NIRA learns what you mean.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-[640px] text-xl font-medium text-ink sm:text-2xl">
        Your personal shopping agent, built into Google Search.
      </p>
      <p className="mx-auto mt-4 max-w-[600px] text-base leading-relaxed text-muted sm:text-lg">
        Tell NIRA what you're looking for. It understands your needs, remembers your preferences, compares products across the web, and helps you choose what actually fits you.
      </p>
      <div className="mt-9 flex flex-col items-center gap-3">
        <Button size="lg" onClick={onTry}>Try NIRA</Button>
        <p className="text-sm text-muted">Free to try · You control what NIRA remembers</p>
      </div>
    </section>
  );
}
