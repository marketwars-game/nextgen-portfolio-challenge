// FILE: components/player/InvestmentPanel.tsx — Team allocation UI (phase 'invest')
// VERSION: NXG-V2 — Thai UI per NXG-DESIGN-V2-Mockup: Challenge header from CHALLENGES · live σ preview (lib/risk.ts) ·
//   rule chips (≥MIN_ASSET_CLASSES / ≤MAX_ALLOCATION_PER_ASSET) · asset rows show Thai name + nameEn + σ (RiskBadge + mini-bar removed) ·
//   MAX tag at cap · "+" dims when total = 100 · Lock button lists unmet rules in Thai · submitted state Thai + σ row
// LAST MODIFIED: 16 Sep 2026
//   • Validation unchanged: client uses ALLOCATION_STEP / MAX_ALLOCATION_PER_ASSET / MIN_ASSET_CLASSES / DIVERSIFY_FROM_ROUND — same consts as
//     app/api/players/portfolio/route.ts (server still rejects). Cash counts as an asset class.
//   • `isRebalance` prop kept optional + ignored so app/play/[roomId]/page.tsx (NXG-V1) compiles untouched — remove both in V3 when page is edited.
//   • Once submitted, allocation is locked — no re-edit (state resets next round on remount)
// HISTORY: market-wars B1..B20 (kids-camp lineage) | YG-V0 fork | YG-V1 re-theme | YG-V3 Edit removed | YG-V6.3 diversification rules | NXG-V2 Thai + σ

'use client';

import { useState } from 'react';
import {
  getAvailableAssets,
  getAssetCap,
  CHALLENGES,
  ALLOCATION_STEP,
  DIVERSIFY_FROM_ROUND,
  MAX_ALLOCATION_PER_ASSET,
  MIN_ASSET_CLASSES,
} from '@/lib/constants';
import { portfolioVol, formatVol } from '@/lib/risk';

// ========== Types ==========

interface InvestmentPanelProps {
  playerId: string;
  roomId: string;
  round: number;
  money: number;
  currentPortfolio: Record<string, number>;
  isRebalance?: boolean; // ignored (NXG-V2) — kept for page.tsx compatibility until V3
  onSubmitted?: () => void;
}

type Asset = ReturnType<typeof getAvailableAssets>[number];
type ChipState = 'idle' | 'warn' | 'ok';

// ========== Sub-components ==========

function PortfolioBar({ allocations, assets }: { allocations: Record<string, number>; assets: readonly Asset[] }) {
  const total = Object.values(allocations).reduce((a, b) => a + b, 0);
  const remaining = 100 - total;
  return (
    <div className="w-full h-3 rounded-full overflow-hidden flex" style={{ background: '#ffffff10' }}>
      {assets.map((c) =>
        allocations[c.id] > 0 ? (
          <div key={c.id} className="h-full transition-all duration-300" style={{ width: `${allocations[c.id]}%`, backgroundColor: c.color }} />
        ) : null
      )}
      {remaining > 0 && <div className="h-full transition-all duration-300" style={{ width: `${remaining}%`, backgroundColor: '#ffffff15' }} />}
    </div>
  );
}

function SigmaRow({ sigma, dim = false }: { sigma: number; dim?: boolean }) {
  return (
    <div className="flex items-center justify-between pt-2 mt-1" style={{ borderTop: '1px dashed #ffffff1a' }}>
      <div style={{ fontSize: 11, color: '#ffffffa6' }}>
        Volatility พอร์ต
        <span className="block" style={{ fontSize: 10, color: '#ffffff66' }}>ต่อปี · corr 0.20 · ยังไม่รวมผลตอบแทน</span>
      </div>
      <div className="font-bold" style={{ fontSize: 20, color: sigma > 0 && !dim ? 'var(--mw-violet)' : '#ffffff66' }}>
        {formatVol(sigma)}
        {sigma > 0 && <span style={{ fontSize: 11, color: '#ffffff66', fontWeight: 500, marginLeft: 3 }}>%</span>}
      </div>
    </div>
  );
}

function RuleChip({ state, children }: { state: ChipState; children: React.ReactNode }) {
  const s =
    state === 'ok'
      ? { color: '#B7A9FF', bg: 'rgba(var(--mw-violet-rgb),0.12)', border: 'rgba(var(--mw-violet-rgb),0.35)' }
      : state === 'warn'
        ? { color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.35)' }
        : { color: '#ffffff66', bg: '#ffffff0d', border: '#ffffff14' };
  return (
    <div
      className="flex-1 flex items-center gap-1.5 rounded-lg"
      style={{ fontSize: 11, padding: '5px 8px', color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      <span className="rounded-full flex-shrink-0" style={{ width: 7, height: 7, background: 'currentColor' }} />
      {children}
    </div>
  );
}

// ========== Main Component ==========

export default function InvestmentPanel({
  playerId,
  roomId,
  round,
  money,
  currentPortfolio,
  onSubmitted,
}: InvestmentPanelProps) {
  const assets = getAvailableAssets(round);
  const challenge = CHALLENGES[round];

  const [allocations, setAllocations] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    assets.forEach((c) => {
      initial[c.id] = currentPortfolio[c.id] || 0;
    });
    return initial;
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ---- derived ----
  const total = Object.values(allocations).reduce((a, b) => a + b, 0);
  const remaining = 100 - total;
  const isComplete = total === 100;

  const diversifyRules = round >= DIVERSIFY_FROM_ROUND;
  const perAssetCap = diversifyRules ? MAX_ALLOCATION_PER_ASSET : 100;
  const assetsUsed = Object.values(allocations).filter((v) => v > 0).length; // cash counts
  const minClasses = diversifyRules ? MIN_ASSET_CLASSES : 1;
  const meetsMin = assetsUsed >= minClasses;
  const canSubmit = isComplete && meetsMin;

  const sigma = portfolioVol(allocations);

  const countState: ChipState = assetsUsed === 0 ? 'idle' : meetsMin ? 'ok' : 'warn';
  const capState: ChipState = total === 0 ? 'idle' : 'ok'; // clamp guarantees ≤ cap

  // ---- unmet-rule copy for the Lock button ----
  const unmet: string[] = [];
  if (!isComplete) unmet.push(`จัดอีก ${remaining}%`);
  if (!meetsMin) unmet.push(`ต้องอย่างน้อย ${minClasses} รายการ`);
  const lockLabel = submitting
    ? '⏳ กำลัง Lock...'
    : total === 0
      ? 'จัดน้ำหนักให้ครบ 100%'
      : unmet.length
        ? unmet.join(' · ')
        : '🔒 LOCK พอร์ต — แก้ไม่ได้แล้ว';

  // Adjust allocation for an asset — respects per-asset cap and the 100% ceiling (unchanged from YG-V6.3)
  const adjust = (id: string, delta: number) => {
    if (submitted) return;
    const current = allocations[id] || 0;
    const cap = getAssetCap(id) ?? perAssetCap;
    let newVal = Math.max(0, Math.min(cap, current + delta));
    const newTotal = total - current + newVal;
    if (newTotal > 100) {
      newVal = Math.max(0, Math.min(cap, current + (100 - total)));
    }
    setAllocations({ ...allocations, [id]: newVal });
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/players/portfolio', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: playerId, room_id: roomId, portfolio: allocations }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'ส่งไม่สำเร็จ — ลองใหม่');
        return;
      }
      setSubmitted(true);
      onSubmitted?.();
    } catch {
      setError('เครือข่ายขัดข้อง — ลองใหม่');
    } finally {
      setSubmitting(false);
    }
  };

  const bahtOf = (pct: number) => `฿${Math.round((pct / 100) * money).toLocaleString()}`;

  // ========== Submitted state ==========
  if (submitted) {
    return (
      <div className="flex flex-col h-full">
        <div className="text-center mb-4 pt-2">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3"
            style={{ background: 'rgba(var(--mw-violet-rgb),0.14)', border: '1px solid rgba(var(--mw-violet-rgb),0.4)' }}
          >
            <span className="text-lg">✓</span>
            <span className="text-sm font-bold" style={{ color: 'var(--mw-violet)' }}>LOCK แล้ว</span>
          </div>
          <p className="text-sm" style={{ color: '#ffffff60' }}>รอ MC เปิดพอร์ต — ดูจอใหญ่</p>
        </div>

        <div className="rounded-2xl p-3 mb-4" style={{ background: '#ffffff05', border: '1px solid #ffffff10' }}>
          <div className="flex justify-between mb-2" style={{ fontSize: 11, color: '#8481b3' }}>
            <span>พอร์ตที่ Lock แล้ว</span>
            <span className="font-mono">฿{Math.round(money).toLocaleString()}</span>
          </div>
          <PortfolioBar allocations={allocations} assets={assets} />
          <div className="mt-3 space-y-1.5">
            {assets.map((c) =>
              allocations[c.id] > 0 ? (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{c.icon}</span>
                    <span className="text-xs text-white">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono" style={{ color: c.color }}>{allocations[c.id]}%</span>
                    <span className="text-xs font-mono" style={{ color: '#ffffff40' }}>{bahtOf(allocations[c.id])}</span>
                  </div>
                </div>
              ) : null
            )}
          </div>
          <SigmaRow sigma={sigma} />
        </div>

        <div
          className="w-full py-3 rounded-lg font-mono text-xs tracking-wider text-center"
          style={{ background: '#ffffff08', color: '#ffffff45', border: '1px solid #ffffff10' }}
        >
          🔒 LOCKED — แก้ไม่ได้แล้ว
        </div>
      </div>
    );
  }

  // ========== Editing state ==========
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-2.5 pt-2">
        <span
          className="text-xs tracking-wider px-3 py-1 rounded-full"
          style={{ background: 'rgba(var(--mw-rose-rgb),0.14)', border: '1px solid rgba(var(--mw-rose-rgb),0.35)', color: 'var(--mw-rose)' }}
        >
          CHALLENGE {round}{challenge ? ` · ${challenge.year}` : ''}
        </span>
        <h2 className="font-bold text-white mt-1.5" style={{ fontSize: 17 }}>จัดพอร์ตของทีม</h2>
        <p className="text-xs mt-0.5" style={{ color: '#ffffff50' }}>
          รวม 100% · ไม่เกิน {perAssetCap}% ต่อรายการ · อย่างน้อย {minClasses} รายการ
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl mb-2" style={{ padding: '10px 12px', background: 'rgba(var(--mw-rose-rgb),0.06)', border: '1px solid rgba(var(--mw-rose-rgb),0.2)' }}>
        <div className="flex items-baseline justify-between" style={{ fontSize: 12 }}>
          <span className="font-mono" style={{ color: '#ffffff66' }}>฿{money.toLocaleString()}</span>
          <span className="font-bold" style={{ color: isComplete ? 'var(--mw-violet)' : '#F59E0B' }}>
            {isComplete ? '✓ ครบ 100%' : `เหลืออีก ${remaining}%`}
          </span>
        </div>
        <div className="my-2">
          <PortfolioBar allocations={allocations} assets={assets} />
        </div>
        <SigmaRow sigma={sigma} />
        <div className="flex gap-1.5 mt-2">
          <RuleChip state={countState}>
            {assetsUsed} / {minClasses} รายการ{countState === 'ok' ? ' ✓' : ''}
          </RuleChip>
          <RuleChip state={capState}>สูงสุด {perAssetCap}%{capState === 'ok' ? ' ✓' : ''}</RuleChip>
        </div>
      </div>

      {/* Asset rows */}
      <div className="space-y-1.5 flex-1 overflow-y-auto pb-2" style={{ maxHeight: 'calc(100vh - 330px)' }}>
        {assets.map((c) => {
          const cap = getAssetCap(c.id) ?? perAssetCap;
          const val = allocations[c.id] || 0;
          const on = val > 0;
          const atCap = val >= cap;
          const plusOff = atCap || remaining <= 0;
          return (
            <div
              key={c.id}
              className="rounded-xl flex items-center gap-2 transition-all duration-300"
              style={{
                padding: '8px 10px',
                background: on ? `${c.color}0f` : '#ffffff0a',
                border: `1px solid ${on ? `${c.color}4d` : '#ffffff14'}`,
              }}
            >
              <div className="flex-shrink-0 text-center" style={{ fontSize: 20, width: 26 }}>{c.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold truncate" style={{ fontSize: 13 }}>
                  {c.name}
                  {atCap && diversifyRules && (
                    <span style={{ fontSize: 9.5, color: '#F59E0B', marginLeft: 4, letterSpacing: '0.04em' }}>MAX</span>
                  )}
                </div>
                <div style={{ fontSize: 10.5, color: '#ffffff66' }}>
                  {c.nameEn} · σ <span style={{ color: '#ffffffa6' }}>{c.vol.toFixed(1)}%</span>
                </div>
                {on && <div className="font-mono" style={{ fontSize: 10.5, color: c.color, marginTop: 1 }}>{bahtOf(val)}</div>}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => adjust(c.id, -ALLOCATION_STEP)}
                  className="rounded-lg flex items-center justify-center font-bold transition-all active:scale-90"
                  style={{ width: 34, height: 34, fontSize: 18, background: '#ffffff14', color: on ? '#ffffff' : '#ffffff2e' }}
                >
                  −
                </button>
                <div
                  className="rounded-lg flex items-center justify-center font-bold font-mono"
                  style={{
                    width: 52,
                    height: 34,
                    fontSize: 13,
                    background: on ? `${c.color}29` : '#ffffff0d',
                    color: on ? c.color : '#ffffff4d',
                    border: `1px solid ${on ? `${c.color}66` : '#ffffff14'}`,
                  }}
                >
                  {val}%
                </div>
                <button
                  onClick={() => adjust(c.id, ALLOCATION_STEP)}
                  className="rounded-lg flex items-center justify-center font-bold transition-all active:scale-90"
                  style={{ width: 34, height: 34, fontSize: 18, background: '#ffffff14', color: plusOff ? '#ffffff2e' : '#ffffff' }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="rounded-lg p-2 mb-2 text-center text-xs" style={{ background: '#EF444420', color: '#EF4444', border: '1px solid #EF444440' }}>
          {error}
        </div>
      )}

      {/* Lock button — enabled only at exactly 100% AND ≥ MIN_ASSET_CLASSES */}
      <button
        onClick={handleSubmit}
        disabled={submitting || !canSubmit}
        className="w-full rounded-xl font-bold tracking-wide mt-2 transition-all duration-300"
        style={{
          height: 50,
          fontSize: 14,
          background: canSubmit ? 'linear-gradient(135deg, var(--mw-violet), var(--mw-rose))' : '#ffffff12',
          color: canSubmit ? 'var(--mw-base)' : '#ffffff52',
          boxShadow: canSubmit ? '0 0 28px rgba(var(--mw-violet-rgb),0.3)' : 'none',
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {lockLabel}
      </button>
    </div>
  );
}
