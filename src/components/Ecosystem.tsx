import { Network, Search, Sparkles, Store } from 'lucide-react';
import { SectionHead } from './ui';

const CARDS = [
  { icon: Search, title: 'Google Search', line: 'Where intent begins', bar: 'bg-blue', tint: 'text-blue bg-blue-soft' },
  { icon: Network, title: 'Shopping Graph', line: 'Where product information comes from', bar: 'bg-red', tint: 'text-red bg-red/10' },
  { icon: Sparkles, title: 'Gemini', line: 'Where NIRA understands and reasons', bar: 'bg-yellow', tint: 'text-[#b06000] bg-yellow/15' },
  { icon: Store, title: 'Connected Commerce', line: 'Where shopping moves toward action', bar: 'bg-green', tint: 'text-[#137333] bg-green-soft' },
];

export default function Ecosystem() {
  return (
    <section className="bg-surface px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1100px]">
        <SectionHead title="One agent. The whole web.">
          NIRA isn't another marketplace asking you to shop in one place. It helps you find the right product across Google's connected shopping ecosystem.
        </SectionHead>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ icon: Icon, title, line, bar, tint }) => (
            <div key={title} className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 pt-8 shadow-sm">
              <div className={`absolute inset-x-0 top-0 h-1.5 ${bar}`} aria-hidden="true" />
              <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${tint}`}><Icon size={24} /></span>
              <h3 className="text-xl font-bold text-ink">{title}</h3>
              <p className="mt-1.5 text-[15px] text-muted">{line}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted">Shopping happens through connected merchants and commerce partners.</p>
      </div>
    </section>
  );
}
