// FILE: components/display/ShockDisplay.tsx — Display Mid-Year Shock (phase 'shock', Challenge 2 only)
// VERSION: NXG-V1 — new: SHOCKS[round] title / 4 bullets (staggered 0.6s) / footer; per NXG-DESIGN-V1-Mockup screen 2
// LAST MODIFIED: 16 Sep 2026
// HISTORY: NXG-V1 created
'use client';

import { SHOCKS } from '@/lib/constants';

export default function ShockDisplay({ round }: { round: number }) {
  const shock = SHOCKS[round];
  if (!shock) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-3xl font-bold" style={{ color: '#F87171' }}>⚠️ Mid-Year Shock</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center text-center" style={{ padding: '44px 90px' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(700px 500px at 50% 0%, rgba(239,68,68,0.22), transparent 65%)' }} />
      <style>{`
        @keyframes shockIn { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes shockFade { from { opacity: 0; } to { opacity: 1; } }
        .shock-li { opacity: 0; animation: shockIn 0.5s ease-out forwards; }
        .shock-foot { opacity: 0; animation: shockFade 0.6s ease-out forwards; }
      `}</style>

      <div className="absolute" style={{ top: 22, right: 40, fontSize: 14, color: '#9b98c0', background: 'rgba(255,255,255,0.06)', padding: '6px 14px', borderRadius: 999, border: '1px solid var(--mw-border)' }}>
        🔒 พอร์ตทุกทีม Lock แล้ว
      </div>

      <div className="relative z-10 font-extrabold" style={{ fontSize: 26, letterSpacing: 8, color: '#F87171', marginBottom: 8 }}>⚠️ MID-YEAR SHOCK</div>
      <div className="relative z-10 font-black" style={{ fontSize: 52, marginBottom: 30 }}>{shock.title.split(' — ')[0]}</div>

      <ul className="relative z-10 list-none m-0 p-0 w-full text-left" style={{ maxWidth: 1060 }}>
        {shock.bullets.map((b, i) => (
          <li key={i} className="shock-li relative" style={{ animationDelay: `${0.4 + i * 0.6}s`, fontSize: 24, lineHeight: 1.45, padding: '14px 22px 14px 58px', borderLeft: '4px solid #F87171', background: 'rgba(239,68,68,0.08)', borderRadius: '0 12px 12px 0', marginBottom: 14 }}>
            <span className="absolute rounded-full" style={{ left: 22, top: 24, width: 14, height: 14, background: '#F87171', boxShadow: '0 0 18px #F87171' }} />
            {b}
          </li>
        ))}
      </ul>

      <div className="shock-foot relative z-10 mt-auto" style={{ animationDelay: `${0.4 + shock.bullets.length * 0.6}s`, fontSize: 22, color: '#FBBF24', border: '1px solid rgba(251,191,36,0.4)', background: 'rgba(251,191,36,0.08)', padding: '12px 30px', borderRadius: 999 }}>
        {shock.footer}
      </div>
    </div>
  );
}
