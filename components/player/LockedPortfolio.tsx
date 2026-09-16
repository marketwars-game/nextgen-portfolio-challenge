// FILE: components/player/LockedPortfolio.tsx — Player view of the locked allocation (phases 'reveal' and 'shock')
// VERSION: NXG-V1 — new: banner (variant reveal/shock) + PortfolioBar + rows with % and ฿ from players.portfolio; per NXG-DESIGN-V1-Mockup screen 4
// LAST MODIFIED: 16 Sep 2026
// HISTORY: NXG-V1 created (portfolio block mirrors InvestmentPanel submitted state)
'use client';

import { COMPANIES, SHOCKS } from '@/lib/constants';

interface LockedPortfolioProps {
  variant: 'reveal' | 'shock';
  round: number;
  portfolio: Record<string, number>;
  money: number;
}

export default function LockedPortfolio({ variant, round, portfolio, money }: LockedPortfolioProps) {
  const alloc = portfolio || {};
  const total = Object.values(alloc).reduce((a, b) => a + (Number(b) || 0), 0);
  const shockTitle = SHOCKS[round]?.title?.split(' — ')[0] || `กลางปี`;

  const banner = variant === 'reveal'
    ? { icon: '🔓', head: 'เปิดพอร์ตทุกทีม', sub: 'ดูจอใหญ่ — เทียบพอร์ตของทีมคุณกับทีมอื่น', bg: 'rgba(var(--mw-violet-rgb),0.14)', border: 'rgba(var(--mw-violet-rgb),0.4)', color: 'var(--mw-violet)' }
    : { icon: '⚠️', head: `MID-YEAR SHOCK · ${shockTitle}`, sub: 'ดูจอใหญ่ — พอร์ตคงน้ำหนักเดิม ผลทั้งปีจะรวมเหตุการณ์นี้', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.45)', color: '#F87171' };

  return (
    <div>
      <div className="flex items-center gap-3 rounded-2xl mb-3" style={{ padding: '12px 14px', background: banner.bg, border: `1px solid ${banner.border}` }}>
        <span style={{ fontSize: 26 }}>{banner.icon}</span>
        <div>
          <div className="font-extrabold" style={{ fontSize: 15, color: banner.color }}>{banner.head}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{banner.sub}</div>
        </div>
      </div>

      <div className="rounded-2xl p-3" style={{ background: '#ffffff05', border: '1px solid #ffffff10' }}>
        <div className="flex justify-between mb-2" style={{ fontSize: 11, color: '#8481b3' }}>
          <span>พอร์ตที่ Lock แล้ว</span>
          <span className="font-mono">฿{Math.round(money).toLocaleString()}</span>
        </div>

        {total > 0 ? (
          <>
            <div className="w-full h-3 rounded-full overflow-hidden flex mb-3" style={{ background: '#ffffff10' }}>
              {COMPANIES.map((c) => alloc[c.id] > 0 ? <div key={c.id} className="h-full" style={{ width: `${alloc[c.id]}%`, backgroundColor: c.color }} /> : null)}
            </div>
            <div className="space-y-1.5">
              {COMPANIES.map((c) => alloc[c.id] > 0 ? (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{c.icon}</span>
                    <span className="text-xs text-white">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono" style={{ color: c.color }}>{alloc[c.id]}%</span>
                    <span className="text-xs font-mono" style={{ color: '#ffffff40' }}>฿{Math.round((alloc[c.id] / 100) * money).toLocaleString()}</span>
                  </div>
                </div>
              ) : null)}
            </div>
          </>
        ) : (
          <p className="text-xs text-center py-3" style={{ color: '#ffffff45' }}>ทีมนี้ยังไม่ได้ Lock พอร์ตในรอบนี้</p>
        )}
      </div>

      <div className="w-full py-3 rounded-lg font-mono text-xs tracking-wider text-center mt-3" style={{ background: '#ffffff08', color: '#ffffff45', border: '1px solid #ffffff10' }}>
        🔒 LOCKED — แก้ไม่ได้แล้ว
      </div>
    </div>
  );
}
