import { scrollToId } from '../lib';

export default function Footer() {
  const link = 'text-sm text-muted hover:text-ink';
  return (
    <footer className="border-t border-line bg-surface px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-lg font-bold text-ink">Google × NIRA</div>
          <p className="mt-1 text-sm text-muted">Search knows what you asked for. NIRA learns what you mean.</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><button className={link} onClick={() => scrollToId('journey')}>How it works</button></li>
          <li><button className={link} onClick={() => scrollToId('memory')}>Shopping Memory</button></li>
          <li><button className={link} onClick={() => scrollToId('trust')}>Trust</button></li>
          <li><a className={link} href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a></li>
          <li><a className={link} href="#terms" onClick={(e) => e.preventDefault()}>Terms</a></li>
        </ul>
      </div>
      <p className="mx-auto mt-8 max-w-[1100px] text-xs text-muted">
        NIRA is a fictional product concept. Products, prices and merchants shown are made up for demonstration.
      </p>
    </footer>
  );
}
