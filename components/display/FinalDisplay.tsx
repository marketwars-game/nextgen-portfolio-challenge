// FILE: components/display/FinalDisplay.tsx — Display Final Phase ROUTER (3 steps)
// VERSION: NXG-V3 — 4-step router: final → final_podium → final_ranking → final_riskadj (Risk-Adjusted Standings)
// LAST MODIFIED: 17 Sep 2026
// HISTORY: B1..B20 (kids-camp lineage) | YG-V0 fork | YG-V1 re-theme | YG-V5 cut Awards step | YG-V6 EN | NXG-V3 + final_riskadj
'use client';

import type { SfxKey } from '@/lib/sound';
import FinalPodium from '@/components/display/FinalPodium';
import FinalRanking from '@/components/display/FinalRanking';
import FinalRiskAdjusted from '@/components/display/FinalRiskAdjusted';

export type FinalPhase = 'final' | 'final_podium' | 'final_ranking' | 'final_riskadj';

interface FinalDisplayProps {
  players: any[];
  phase: FinalPhase;
  animate: boolean;
  playSfx?: (k: SfxKey) => void;
}

// === Step ① suspense — "ใครคือแชมป์?" ค้างไว้ รอ MC กดเฉลย ===
function FinalSuspense() {
  return (
    <div className="relative h-full flex flex-col items-center justify-center px-8 overflow-hidden">
      <style>{`
        @keyframes mwPulse { 0%,100%{ transform:scale(1); opacity:.9 } 50%{ transform:scale(1.06); opacity:1 } }
        @keyframes mwBlink { 0%,100%{ opacity:.25 } 50%{ opacity:1 } }
      `}</style>
      <h1 className="text-7xl font-black" style={{ animation: 'mwPulse 0.8s ease-in-out infinite', background: 'linear-gradient(90deg,#fff,var(--mw-violet))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
        WHO&apos;S THE CHAMPION?
      </h1>
      <p className="text-3xl mt-5" style={{ color: 'rgba(255,255,255,0.78)' }}>The final results are in.</p>
      <p className="text-xl mt-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
        Waiting for the reveal
        <span style={{ animation: 'mwBlink 1.2s infinite' }}> ●</span>
        <span style={{ animation: 'mwBlink 1.2s infinite', animationDelay: '0.2s' }}>●</span>
        <span style={{ animation: 'mwBlink 1.2s infinite', animationDelay: '0.4s' }}>●</span>
      </p>
    </div>
  );
}

export default function FinalDisplay({ players, phase, animate, playSfx }: FinalDisplayProps) {
  // key={phase} → remount per step so entrance animation runs fresh; settled handled via `animate`
  if (phase === 'final_podium') return <FinalPodium key="podium" players={players} animate={animate} playSfx={playSfx} />;
  if (phase === 'final_ranking') return <FinalRanking key="ranking" players={players} animate={animate} />;
  if (phase === 'final_riskadj') return <FinalRiskAdjusted key="riskadj" players={players} animate={animate} />; // NXG-V3
  return <FinalSuspense />;
}
