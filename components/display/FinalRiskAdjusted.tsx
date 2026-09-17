// FILE: components/display/FinalRiskAdjusted.tsx — Final step ③ Risk-Adjusted Standings (Return / Risk)
// VERSION: NXG-V3 — new file, per NXG-DESIGN-V3-Mockup screen 1
// LAST MODIFIED: 17 Sep 2026
//   • Second leaderboard at final: rank by Score = (CAGR − cash CAGR) ÷ RMS σ (lib/riskScore.ts — same formula as Score Sheet).
//   • Columns: rank · team (+ "▲ จาก #n" chip vs the money ranking) · ending value · CAGR · σ avg · Score.
//   • "BELOW CASH" rows (return < cash) sit at the bottom in red; incomplete data shows "—".
//   • Score bar = score / top score (only for score > 0). Row layout / animation mirrors FinalRanking (h-full fit, mwRowIn wave).
//   • Podium / champion are NOT affected — Highest Ending Value stays the money ranking (step ① ②).
// HISTORY: NXG-V3 created
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { computeRiskScores, cashCagr, fmtPct2, fmtScore } from '@/lib/riskScore';
import { VOL_CORRELATION } from '@/lib/constants';

interface FinalRiskAdjustedProps {
  players: any[];
  animate: boolean;
}

const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
const medalGlow = ['rgba(255,215,0,0.35)', 'rgba(192,192,192,0.3)', 'rgba(205,127,50,0.3)'];
const medals = ['🥇', '🥈', '🥉'];
const GRID = '52px 1fr 150px 130px 130px 170px';

export default function FinalRiskAdjusted({ players, animate }: FinalRiskAdjustedProps) {
  const [doAnim] = useState(animate);
  const areaRef = useRef<HTMLDivElement>(null);
  const [areaH, setAreaH] = useState(520);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setAreaH(el.clientHeight || 520);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rows = useMemo(() => computeRiskScores(players), [players]);
  const rCash = useMemo(() => cashCagr(), []);
  const topScore = Math.max(0, ...rows.map((r) => (r.score !== null ? r.score : 0)));

  const N = Math.max(1, rows.length);
  const gap = Math.max(8, Math.min(14, (areaH / N) * 0.14));
  const rowH = Math.max(40, (areaH - gap * (N - 1)) / N);
  const nameF = Math.round(Math.min(28, Math.max(18, rowH * 0.34)));
  const numF = Math.round(nameF * 0.82);
  const scoreF = Math.round(Math.min(36, Math.max(22, rowH * 0.46)));
  const waveTotal = 1100;

  return (
    <div className="relative h-full flex flex-col px-12 pt-10 pb-6 overflow-hidden">
      <style>{`@keyframes mwRowIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>

      {/* header */}
      <div className="flex items-baseline gap-5 mb-2 flex-wrap flex-shrink-0">
        <h1 className="text-4xl font-black whitespace-nowrap" style={{ color: '#FCD34D' }}>⚖️ RISK-ADJUSTED STANDINGS</h1>
        <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)' }}>Return / Risk — ใครสร้างผลตอบแทนเหนือเงินสดได้คุ้มความเสี่ยงที่รับ</span>
        <div className="flex gap-4 ml-auto whitespace-nowrap" style={{ fontSize: 16, fontWeight: 700 }}>
          <span style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--mw-border)', color: '#bdb8e0' }}>💵 เงินสด CAGR {fmtPct2(rCash)}</span>
          <span style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--mw-border)', color: 'var(--mw-violet)' }}>ρ = {VOL_CORRELATION.toFixed(2)}</span>
        </div>
      </div>

      {/* column labels */}
      <div className="flex-shrink-0" style={{ display: 'grid', gridTemplateColumns: GRID, gap: 16, padding: '0 24px', fontSize: 13, letterSpacing: 1, color: '#8d89b8', fontWeight: 700, margin: '4px 0 6px' }}>
        <span /><span>ทีม</span>
        <span style={{ textAlign: 'right' }}>มูลค่าปลายเกม</span>
        <span style={{ textAlign: 'right' }}>CAGR</span>
        <span style={{ textAlign: 'right' }}>σ เฉลี่ย</span>
        <span style={{ textAlign: 'right' }}>Score</span>
      </div>

      {/* rows */}
      <div ref={areaRef} className="flex-1 min-h-0 flex flex-col" style={{ gap }}>
        {rows.map((r, i) => {
          const top3 = i < 3 && r.complete && !r.belowCash;
          const col = top3 ? rankColors[i] : r.belowCash ? 'rgba(255,255,255,0.85)' : '#fff';
          const fillPct = r.belowCash ? 100 : r.score !== null && topScore > 0 ? Math.max(0, (r.score / topScore) * 100) : 0;
          const fillBg = top3
            ? `linear-gradient(90deg, ${rankColors[i]}33, rgba(var(--mw-rose-rgb),0.18))`
            : r.belowCash
              ? 'linear-gradient(90deg, rgba(239,68,68,0.20), rgba(239,68,68,0.05))'
              : 'linear-gradient(90deg, rgba(34,197,94,0.18), rgba(var(--mw-violet-rgb),0.12))';
          const border = top3 ? rankColors[i] : r.belowCash ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.14)';
          const shift = r.moneyRank - (i + 1); // + = moved up vs money ranking
          const shiftLabel = !r.complete ? '' : shift > 0 ? `▲ จาก #${r.moneyRank}` : shift < 0 ? `▼ จาก #${r.moneyRank}` : `= #${r.moneyRank}`;
          const shiftColor = shift > 0 ? '#22c55e' : shift < 0 ? '#ef4444' : '#bdb8e0';
          const shiftBg = shift > 0 ? 'rgba(34,197,94,0.14)' : shift < 0 ? 'rgba(239,68,68,0.14)' : 'rgba(255,255,255,0.08)';
          const scoreText = !r.complete ? '—' : r.belowCash ? 'BELOW CASH' : fmtScore(r.score);
          const scoreColor = top3 ? rankColors[i] : r.belowCash ? '#ef4444' : '#22c55e';
          return (
            <div key={r.id} style={{
              height: rowH, flexShrink: 0, position: 'relative', borderRadius: 14, overflow: 'hidden',
              background: 'rgba(255,255,255,0.035)', border: `1px solid ${border}`,
              boxShadow: top3 ? `0 0 16px ${medalGlow[i]}` : 'none',
              animation: doAnim ? 'mwRowIn 0.45s ease-out both' : 'none',
              animationDelay: doAnim ? `${(i * (waveTotal / N)).toFixed(0)}ms` : '0ms',
            }}>
              <div style={{ position: 'absolute', inset: 0, width: `${fillPct}%`, borderRadius: 14, background: fillBg }} />
              <div style={{ position: 'relative', height: '100%', display: 'grid', gridTemplateColumns: GRID, gap: 16, alignItems: 'center', padding: '0 24px' }}>
                <span style={{ textAlign: 'center', fontWeight: 700, fontSize: top3 ? Math.round(rowH * 0.46) : Math.round(rowH * 0.36), color: top3 ? rankColors[i] : 'rgba(255,255,255,0.5)' }}>
                  {top3 ? medals[i] : `#${i + 1}`}
                </span>
                <span style={{ fontSize: nameF, fontWeight: 700, color: col, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
                  {shiftLabel && <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: shiftBg, color: shiftColor }}>{shiftLabel}</span>}
                </span>
                <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: numF, color: 'rgba(255,255,255,0.88)' }}>฿{r.money.toLocaleString()}</span>
                <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: numF, color: 'rgba(255,255,255,0.88)' }}>{fmtPct2(r.cagr)}</span>
                <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: numF, color: 'rgba(255,255,255,0.88)' }}>{r.complete ? r.sigma.toFixed(2) + '%' : '—'}</span>
                <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 900, fontSize: r.belowCash ? Math.round(scoreF * 0.62) : scoreF, color: scoreColor, letterSpacing: r.belowCash ? 0.5 : 0 }}>{scoreText}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* footer */}
      <div className="flex gap-7 flex-shrink-0" style={{ marginTop: 10, fontSize: 14, color: '#8d89b8' }}>
        <span>Score = (CAGR − CAGR เงินสด) ÷ σ เฉลี่ย (RMS 5 รอบ)</span>
        <span>สูตรเดียวกับ Score Sheet · Classroom Proxy ไม่ใช่ Sharpe</span>
        <span>bar = Score เทียบทีมสูงสุด</span>
      </div>
    </div>
  );
}
