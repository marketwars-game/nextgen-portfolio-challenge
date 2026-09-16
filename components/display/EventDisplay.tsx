// FILE: components/display/EventDisplay.tsx — Display Event (reveal script) + Event Result (9-asset returns grid 3×3)
// VERSION: NXG-V1 — reads CHALLENGES directly (drops EVENTS); event = emoji/title/revealScript; event_result = news bar (title + keyLesson) + 9 horizontal cards 3×3 fitting 720px; golden_deal branch removed
// LAST MODIFIED: 16 Sep 2026
// HISTORY: market-wars B1..B20 | YG-V0 fork | YG-V1 re-theme | YG-V3 unlock filter + EN | NXG-V1 CHALLENGES + 3×3 horizontal cards
'use client';

import { CHALLENGES, RETURN_TABLE, getAvailableAssets } from '@/lib/constants';
import AnimatedBackdrop from '@/components/display/AnimatedBackdrop';

interface EventDisplayProps {
  round: number;
  phase: 'event' | 'event_result';
  players: any[];
}

export default function EventDisplay({ round, phase }: EventDisplayProps) {
  const ch = CHALLENGES[round];
  if (!ch) return null;

  // === Event — reveal script, full-screen dramatic ===
  if (phase === 'event') {
    return (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        <AnimatedBackdrop accent="#FF6B6B" accent2="#FF6B6B" />
        <style>{`
          @keyframes evFade { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes evPop { 0% { opacity: 0; transform: scale(0.7); } 100% { opacity: 1; transform: scale(1); } }
          .ev-anim { opacity: 0; animation: evFade 0.6s ease-out forwards; }
          .ev-pop { opacity: 0; animation: evPop 0.55s ease-out forwards; }
        `}</style>
        <div className="text-center z-10 px-12 w-full" style={{ maxWidth: 1000 }}>
          <div className="ev-pop mb-5" style={{ fontSize: '8rem', lineHeight: 1, animationDelay: '0.25s' }}>{ch.emoji}</div>
          <h3 className="ev-anim font-black mb-5" style={{ fontSize: 46, color: '#FF6B6B', animationDelay: '0.6s' }}>
            {ch.year} · {ch.title}
          </h3>
          <p className="ev-anim" style={{ fontSize: 24, lineHeight: 1.55, color: 'rgba(255,255,255,0.88)', animationDelay: '0.9s' }}>{ch.revealScript}</p>
          <div className="ev-anim mt-8 inline-block px-6 py-2 rounded-full text-base font-semibold" style={{ background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.35)', color: '#FF6B6B', animationDelay: '1.2s' }}>
            ดูผลตอบแทนแต่ละสินทรัพย์ →
          </div>
        </div>
      </div>
    );
  }

  // === Event Result — news bar + 9 horizontal cards, 3×3 ===
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-5 flex-shrink-0" style={{ padding: '16px 40px', background: 'var(--mw-surface)', borderBottom: '2px solid rgba(255,107,107,0.3)' }}>
        <span style={{ fontSize: 40 }}>{ch.emoji}</span>
        <div>
          <div className="font-extrabold" style={{ fontSize: 26, color: '#FF6B6B', marginBottom: 2 }}>{ch.title} — ผลตอบแทนปี {ch.year}</div>
          <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)' }}>{ch.keyLesson}</div>
        </div>
      </div>

      <style>{`@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } } .return-card { opacity: 0; animation: fadeSlideUp 0.4s ease-out forwards; }`}</style>
      <div className="flex-1 grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 12, padding: '16px 80px 18px' }}>
        {getAvailableAssets(round).map((c, i) => {
          const returnPct = RETURN_TABLE[c.id]?.[round - 1] || 0;
          const isPositive = returnPct >= 0;
          return (
            <div key={c.id} className="return-card flex items-center gap-4" style={{ animationDelay: `${i * 0.2}s`, background: 'var(--mw-base)', border: '1px solid rgba(255,255,255,0.06)', borderTop: `3px solid ${c.color}`, borderRadius: 12, padding: '0 22px' }}>
              <span style={{ fontSize: 34 }}>{c.icon}</span>
              <div className="font-semibold" style={{ fontSize: 16, lineHeight: 1.2 }}>
                {c.name}
                <span className="block font-normal" style={{ fontSize: 12, color: '#8481b3' }}>{c.nameEn}</span>
              </div>
              <span className="ml-auto font-extrabold font-mono" style={{ fontSize: 40, color: isPositive ? '#22c55e' : '#ef4444' }}>
                {isPositive ? '+' : '−'}{Math.abs(returnPct).toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
