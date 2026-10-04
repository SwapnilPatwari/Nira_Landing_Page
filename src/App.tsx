import { useCallback, useEffect, useRef, useState } from 'react';
import { INITIAL_MEMORY, type MemoryGroup } from './data';
import { scrollToId } from './lib';
import Ecosystem from './components/Ecosystem';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Journey from './components/Journey';
import MemorySection from './components/MemorySection';
import Nav from './components/Nav';
import Problem from './components/Problem';
import SameSearch from './components/SameSearch';
import SearchDemo from './components/SearchDemo';
import Trust, { type MemoryAction } from './components/Trust';

export default function App() {
  const [groups, setGroups] = useState<MemoryGroup[]>(INITIAL_MEMORY);
  const [memoryOn, setMemoryOn] = useState(true);
  const [editing, setEditing] = useState(false);
  const [focusKey, setFocusKey] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastMsg(null), 2600);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const tryNira = () => {
    scrollToId('demo');
    setFocusKey((k) => k + 1);
  };

  const setMemory = (on: boolean) => {
    setMemoryOn(on);
    if (!on) setEditing(false);
    toast(on ? 'Shopping Memory on' : 'Shopping Memory paused');
  };

  const learn = useCallback((chips: string[]) => {
    setGroups((gs) => gs.map((g) => (g.id === 'electronics' ? { ...g, chips: [...g.chips, ...chips.filter((c) => !g.chips.includes(c))] } : g)));
    toast(`NIRA learned: ${chips.join(' · ')}`);
  }, [toast]);

  const onMemoryAction = (a: MemoryAction) => {
    if (a === 'pause') return setMemory(!memoryOn);
    scrollToId('memory');
    if (a === 'edit' && memoryOn) setEditing(true);
  };

  const electronics = groups.find((g) => g.id === 'electronics')?.chips ?? [];

  return (
    <>
      <Nav onTry={tryNira} />
      <main>
        <Hero onTry={tryNira} />
        <section className="px-3 pb-20 sm:px-8 sm:pb-28">
          <SearchDemo memoryOn={memoryOn} electronicsChips={electronics} focusKey={focusKey} onLearn={learn} toast={toast} />
        </section>
        <Problem />
        <SameSearch />
        <MemorySection groups={groups} setGroups={setGroups} memoryOn={memoryOn} setMemoryOn={setMemory} editing={editing} setEditing={setEditing} />
        <Journey />
        <Ecosystem />
        <Trust memoryOn={memoryOn} onAction={onMemoryAction} />
        <FinalCta onTry={tryNira} />
      </main>
      <Footer />

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4">
        {toastMsg && (
          <div className="animate-pop rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-xl">{toastMsg}</div>
        )}
      </div>
    </>
  );
}
