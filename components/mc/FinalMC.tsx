// FILE: components/mc/FinalMC.tsx — MC Final Phase
// VERSION: NXG-V3 — script 3-step (+ ③ Risk-Adjusted) · RISK-ADJUSTED list (lib/riskScore) under the money leaderboard so MC can read Score/σ/Below Cash aloud
// LAST MODIFIED: 17 Sep 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 re-theme | YG-V5 script + drop awards box | NXG-V3 risk-adjusted

import { STARTING_MONEY } from '@/lib/constants';
import { computeRiskScores, cashCagr, fmtPct2, fmtScore } from '@/lib/riskScore';

interface FinalMCProps {
  players: any[];
}

export default function FinalMC({ players }: FinalMCProps) {
  const sorted = [...players].sort(
    (a, b) => (parseFloat(b.money) || 0) - (parseFloat(a.money) || 0)
  );

  // Stats
  const totalPlayers = players.length;
  const avgReturn =
    totalPlayers > 0
      ? players.reduce((sum, p) => {
          const m = parseFloat(p.money) || STARTING_MONEY;
          return sum + ((m - STARTING_MONEY) / STARTING_MONEY) * 100;
        }, 0) / totalPlayers
      : 0;

  const profitCount = players.filter(
    (p) => (parseFloat(p.money) || 0) > STARTING_MONEY
  ).length;
  const lossCount = players.filter(
    (p) => (parseFloat(p.money) || 0) < STARTING_MONEY
  ).length;

  // NXG-V3: risk-adjusted standings (same formula as Score Sheet)
  const riskRows = computeRiskScores(players);
  const rCash = cashCagr();

  // Biggest winner
  const biggestWinner = sorted[0];
  const bigWinPct = biggestWinner
    ? (((parseFloat(biggestWinner.money) || 0) - STARTING_MONEY) / STARTING_MONEY) * 100
    : 0;

  return (
    <div className="space-y-3">
      {/* MC Tip — Script for closing the game */}
      <div className="border-l-4 border-[#FCD34D] bg-[#1a1f2e] rounded-r-lg p-3">
        <p className="text-[#FCD34D] text-sm font-bold mb-2">🎤 Script ปิดเกม (คุมจังหวะด้วยปุ่ม Step ด้านบน)</p>
        <div className="text-gray-400 text-xs space-y-2">
          <p>① <b>Podium</b> — ปั่นบรรยากาศ &quot;ใครคือแชมป์?&quot; แล้วกด <b>เฉลยแชมป์</b> → ประกาศ Top 3 (จอไล่ #3→#2→#1)</p>
          <p>② <b>Ranking</b> — เปิดอันดับทุกทีมตามมูลค่าพอร์ต (Highest Ending Value) 📸</p>
          <p>③ <b>Risk-Adj</b> — เปิดอันดับ Return/Risk: ชี้ทีมที่ขยับขึ้น (▲) เพราะรับความเสี่ยงต่ำแต่ยังชนะเงินสด · ทีม <b style={{ color: '#ef4444' }}>BELOW CASH</b> = ผลตอบแทนแพ้ถือเงินสด · Score นี้สูตรเดียวกับ Score Sheet</p>
          <p>④ สรุปบทเรียนการลงทุน (ดูด้านล่าง) — เน้น <b style={{ color: '#34d399' }}>&quot;กระจายความเสี่ยง 🧺 = ไม่ทุ่มไข่ตะกร้าเดียว&quot;</b></p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[var(--mw-surface)] rounded-lg p-3 text-center">
          <div className="text-xl font-bold" style={{ color: 'var(--mw-rose)' }}>
            {totalPlayers}
          </div>
          <div className="text-xs text-gray-500">Total players</div>
        </div>
        <div className="bg-[var(--mw-surface)] rounded-lg p-3 text-center">
          <div
            className="text-xl font-bold"
            style={{ color: avgReturn >= 0 ? '#22c55e' : '#ef4444' }}
          >
            {avgReturn >= 0 ? '+' : ''}{avgReturn.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Avg return</div>
        </div>
        <div className="bg-[var(--mw-surface)] rounded-lg p-3 text-center">
          <div className="text-xl font-bold" style={{ color: '#FCD34D' }}>
            {biggestWinner?.name || '-'}
          </div>
          <div className="text-xs text-gray-500">
            Biggest winner ({bigWinPct >= 0 ? '+' : ''}{bigWinPct.toFixed(1)}%)
          </div>
        </div>
        <div className="bg-[var(--mw-surface)] rounded-lg p-3 text-center">
          <span className="text-xl font-bold" style={{ color: '#22c55e' }}>
            {profitCount}
          </span>
          <span className="text-lg text-gray-600 mx-1">/</span>
          <span className="text-xl font-bold" style={{ color: '#ef4444' }}>
            {lossCount}
          </span>
          <div className="text-xs text-gray-500">Profit / Loss</div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-[var(--mw-surface)] rounded-lg p-3">
        <div className="text-xs tracking-widest text-gray-500 mb-2">FULL LEADERBOARD</div>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {sorted.map((p, i) => {
            const m = parseFloat(p.money) || 0;
            const pct = ((m - STARTING_MONEY) / STARTING_MONEY) * 100;
            const medals = ['🥇', '🥈', '🥉'];
            return (
              <div
                key={p.id}
                className="flex justify-between items-center px-2 py-1 border-b border-gray-800/50 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm w-6 text-center">
                    {i < 3 ? medals[i] : `${i + 1}`}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      color: i < 3
                        ? ['#FCD34D', '#D1D5DB', '#FBBF24'][i]
                        : '#9CA3AF',
                      fontWeight: i < 3 ? 700 : 400,
                    }}
                  >
                    {p.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-300">฿{m.toLocaleString()}</span>
                  <span
                    className="text-xs ml-2"
                    style={{ color: pct >= 0 ? '#22c55e' : '#ef4444' }}
                  >
                    {pct >= 0 ? '+' : ''}{pct.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NXG-V3: Risk-adjusted standings — what step ③ shows on the projector */}
      <div className="bg-[var(--mw-surface)] rounded-lg p-3">
        <div className="flex justify-between items-baseline mb-2">
          <div className="text-xs tracking-widest text-gray-500">⚖️ RISK-ADJUSTED (Score Sheet formula)</div>
          <div className="text-[11px] text-gray-500">เงินสด CAGR {fmtPct2(rCash)}</div>
        </div>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {riskRows.map((r, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const top = i < 3 && r.complete && !r.belowCash;
            return (
              <div key={r.id} className="flex justify-between items-center px-2 py-1 border-b border-gray-800/50 last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm w-6 text-center">{top ? medals[i] : `${i + 1}`}</span>
                  <span className="text-sm truncate" style={{ color: top ? ['#FCD34D', '#D1D5DB', '#FBBF24'][i] : r.belowCash ? '#f87171' : '#9CA3AF', fontWeight: top ? 700 : 400 }}>{r.name}</span>
                  {r.complete && r.moneyRank !== i + 1 && (
                    <span className="text-[10px]" style={{ color: r.moneyRank > i + 1 ? '#22c55e' : '#ef4444' }}>{r.moneyRank > i + 1 ? '▲' : '▼'} จาก #{r.moneyRank}</span>
                  )}
                </div>
                <div className="text-right whitespace-nowrap">
                  <span className="text-[11px] text-gray-500 mr-2">CAGR {fmtPct2(r.cagr)} · σ {r.complete ? r.sigma.toFixed(2) + '%' : '—'}</span>
                  <span className="text-sm font-bold" style={{ color: !r.complete ? '#6b7280' : r.belowCash ? '#ef4444' : '#22c55e' }}>{!r.complete ? '—' : r.belowCash ? 'BELOW CASH' : fmtScore(r.score)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 บทเรียน */}
      <div className="bg-[var(--mw-surface)] rounded-lg p-3">
        <div className="text-xs tracking-widest text-gray-500 mb-2">📚 5 บทเรียนการลงทุน</div>
        <div className="text-xs text-gray-400 space-y-1.5">
          <p>1. <strong style={{ color: '#22c55e' }}>กระจายความเสี่ยง = รอดดี</strong> — คนที่ลง 3-4 บริษัทไม่เคยขาดทุนหนัก</p>
          <p>2. <strong style={{ color: 'var(--mw-rose)' }}>High Risk = High Return & Loss</strong> — หุ้นเทคขึ้นเยอะ แต่ลงก็เยอะ</p>
          <p>3. <strong style={{ color: '#F59E0B' }}>ฝากอย่างเดียว ปลอดภัยแต่โตไม่ทัน</strong> — PiggyBank+ ไม่เคยลบ แต่ต่ำสุด</p>
          <p>4. <strong style={{ color: '#ef4444' }}>ดีเกินจริง มักไม่จริง</strong> — ระวังดีลที่การันตีกำไร!</p>
          <p>5. <strong style={{ color: '#A855F7' }}>ไม่มีใครเดาถูกทุกรอบ</strong> — ศึกษาข้อมูล กระจายเสี่ยง อดทน</p>
        </div>
      </div>
    </div>
  );
}
