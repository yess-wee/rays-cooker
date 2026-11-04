import { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { Lambda } from './ui.jsx';

/** Masked logo reveal, logo exits, then a five-column curtain lifts and the page intro starts. */
export default function Loader() {
  const { setReady } = useStore();
  const [phase, setPhase] = useState('');
  useEffect(() => {
    const t = [
      setTimeout(() => setPhase('out'), 1900),
      setTimeout(() => setPhase('out done'), 2650),
      setTimeout(() => setReady(true), 3030),
      setTimeout(() => setPhase('gone'), 4350),
    ];
    return () => t.forEach(clearTimeout);
  }, [setReady]);
  if (phase === 'gone') return null;
  return (
    <div id="loader" className={phase}>
      <div className="curtain"><i /><i /><i /><i /><i /></div>
      <div className="lw">
        <div className="logo"><b><span>R</span><span><Lambda color="#ff2a45" width={2.2} /></span><span>Y</span><span>S</span></b></div>
        <span className="lt"><span>Best never lies.</span></span>
        <span className="rule" />
      </div>
    </div>
  );
}
