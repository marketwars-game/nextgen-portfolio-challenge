// FILE: lib/risk.ts — Portfolio volatility preview (Classroom Proxy)
// VERSION: NXG-V2 — new file
// LAST MODIFIED: 16 Sep 2026
//   • portfolioVol(weights)  → σ_p in % (not rounded) — Guide v1.14 §3.2:
//       σ_p = √[ (1−ρ)·Σ(wᵢσᵢ)² + ρ·(Σwᵢσᵢ)² ]   with ρ = VOL_CORRELATION (0.20)
//     Identical to the full-matrix form √(Σwᵢ²σᵢ² + 2ρ·Σᵢ<ⱼ wᵢwⱼσᵢσⱼ); written in the Guide's form so it
//     matches the Score Sheet (Appendix B3) line for line.
//   • Weights are % (0–100) as stored in players.portfolio; unallocated remainder contributes 0 (no vol).
//   • Preview only — never used for returns or ranking (Best Risk-Adjusted is computed off-app on the Score Sheet).
//   • Check: Guide B4 portfolio cash10/gov40/IG20/DM20/EM5/SET5 → 5.905…% (Guide shows 5.91%) · §3.1 → 8.04%
// HISTORY: NXG-V2 created

import { COMPANIES, VOL_CORRELATION } from '@/lib/constants';

const VOL_BY_ID: Record<string, number> = Object.fromEntries(COMPANIES.map((c) => [c.id, c.vol]));

/** σ_p in % for the given weights (% per asset id). Returns 0 when nothing is allocated. */
export function portfolioVol(weights: Record<string, number>, corr: number = VOL_CORRELATION): number {
  let sumSq = 0; // Σ (wᵢσᵢ)²
  let sum = 0;   // Σ  wᵢσᵢ
  for (const id in weights) {
    const w = (Number(weights[id]) || 0) / 100;
    const vol = VOL_BY_ID[id];
    if (!w || vol === undefined) continue;
    const ws = w * vol;
    sumSq += ws * ws;
    sum += ws;
  }
  if (sum === 0) return 0;
  return Math.sqrt((1 - corr) * sumSq + corr * sum * sum);
}

/** Display helper — "5.9" for 5.905…, "—" when nothing is allocated. */
export function formatVol(sigma: number): string {
  return sigma > 0 ? sigma.toFixed(1) : '—';
}
