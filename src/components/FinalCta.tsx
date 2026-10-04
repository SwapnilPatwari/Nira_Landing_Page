import { Button } from './ui';

export default function FinalCta({ onTry }: { onTry: () => void }) {
  return (
    <section className="px-4 py-24 text-center sm:px-8 sm:py-36">
      <h2 className="mx-auto max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-6xl">Ready to shop differently?</h2>
      <p className="mx-auto mt-6 max-w-md text-lg text-muted">Tell NIRA what you need. Let it do the searching, comparing and remembering.</p>
      <div className="mt-9 flex flex-col items-center gap-3">
        <Button size="lg" onClick={onTry}>Try NIRA</Button>
        <p className="text-sm text-muted">Continue with Google · Free to try · You control your Shopping Memory</p>
      </div>
    </section>
  );
}
