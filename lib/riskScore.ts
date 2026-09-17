// FILE: lib/riskScore.ts — Risk-adjusted Return score (Classroom Proxy) for the final Risk-Adjusted Standings
// VERSION: NXG-V3 — new file
// LAST MODIFIED: 17 Sep 2026
//   Guide v1.14 §3 / Score Sheet Appendix B — 4 steps, same formula as the spreadsheet:
//     1. R_team  = (money / STARTING_MONEY)^(1/TOTAL_ROUNDS) − 1            (CAGR, 5 rounds)
//     2. σ_round = portfolioVol(portfolio_used of that round)               (lib/risk.ts, ρ = 0.20)
//     3. σ_avg   = √( Σ σ_round² / TOTAL_ROUNDS )                           (RMS, not plain mean)
//     4. Score   = (R_team − R_cash) / σ_avg                                (R_cash = CAGR of holding cash all rounds)
//   • R_team < R_cash → "Below Cash": ranked after every team ≥ cash, ordered CAGR desc → σ asc → best worst-round.
//   • Data source: players.money + players.round_returns[r].portfolio_used (written by /api/game/calculate every round).
//     Nothing new is stored — everything is derived client-side at final. A team missing any round (or σ = 0) is
//     `complete: false`, shown last with "—" instead of a score (Lock is mandatory every round, so this is defensive only).
//   • Ties on exact score → lower σ first → id (deterministic).
// HISTORY: NXG-V3 created

import { RETURN_TABLE, STARTING_MONEY, TOTAL_ROUNDS } from '@/lib/constants';
import { portfolioVol } from '@/lib/risk';
import { compareForRank } from '@/lib/ranking';

export interface RiskScore {
  id: string;
  name: string;
  money: number;
  cagr: number;        // fraction, e.g. 0.0289
  sigma: number;       // % (RMS of 5 round σ), e.g. 5.02
  score: number | null; // null when !complete
  belowCash: boolean;
  complete: boolean;   // all TOTAL_ROUNDS rounds present with σ > 0
  worstRound: number;  // fraction — worst single-round return (tie-break inside Below Cash)
  moneyRank: number;   // 1-based rank by money (compareForRank) — for the "▲ จาก #n" chip
}

const num = (v: any): number => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };

/** CAGR of holding 100% cash for all rounds — the benchmark R_cash (≈ 1.92% on Guide v1.14 returns). */
export function cashCagr(): number {
  const rows = RETURN_TABLE.cash || [];
  let g = 1;
  for (let r = 0; r < TOTAL_ROUNDS; r++) g *= 1 + (rows[r] || 0) / 100;
  return Math.pow(g, 1 / TOTAL_ROUNDS) - 1;
}

function scoreOne(p: any, moneyRank: number, rCash: number): RiskScore {
  const money = num(p.money);
  const cagr = money > 0 ? Math.pow(money / STARTING_MONEY, 1 / TOTAL_ROUNDS) - 1 : -1;
  const rr = p.round_returns || {};
  let sumSq = 0;
  let complete = true;
  let worstRound = Infinity;
  for (let r = 1; r <= TOTAL_ROUNDS; r++) {
    const rec = rr[String(r)];
    if (!rec || !rec.portfolio_used) { complete = false; continue; }
    const s = portfolioVol(rec.portfolio_used);
    if (!(s > 0)) complete = false;
    sumSq += s * s;
    const before = num(rec.money_before);
    const after = num(rec.money_after);
    if (before > 0) worstRound = Math.min(worstRound, (after - before) / before);
  }
  const sigma = Math.sqrt(sumSq / TOTAL_ROUNDS);
  const belowCash = cagr < rCash;
  const score = complete && sigma > 0 ? (cagr - rCash) / (sigma / 100) : null;
  return { id: String(p.id), name: p.name, money, cagr, sigma, score, belowCash, complete, worstRound: Number.isFinite(worstRound) ? worstRound : 0, moneyRank };
}

/** Comparator — teams ≥ cash by score desc, then Below Cash (CAGR desc → σ asc → worst round), incomplete last. */
export function compareRiskAdjusted(a: RiskScore, b: RiskScore): number {
  if (a.complete !== b.complete) return a.complete ? -1 : 1;
  if (a.belowCash !== b.belowCash) return a.belowCash ? 1 : -1;
  if (!a.belowCash && a.score !== null && b.score !== null) {
    if (b.score !== a.score) return b.score - a.score;
  } else {
    if (b.cagr !== a.cagr) return b.cagr - a.cagr;
  }
  if (a.sigma !== b.sigma) return a.sigma - b.sigma;                 // lower risk first
  if (b.worstRound !== a.worstRound) return b.worstRound - a.worstRound; // less-bad worst round first
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/** Scores for every player, sorted by compareRiskAdjusted. `moneyRank` follows the main (money) ranking. */
export function computeRiskScores(players: any[]): RiskScore[] {
  const rCash = cashCagr();
  const byMoney = [...players].sort(compareForRank);
  const rankOf = new Map<string, number>(byMoney.map((p, i) => [String(p.id), i + 1]));
  return players
    .map((p) => scoreOne(p, rankOf.get(String(p.id)) || 0, rCash))
    .sort(compareRiskAdjusted);
}

export const fmtPct2 = (frac: number) => (frac * 100).toFixed(2) + '%';
export const fmtScore = (s: number | null) => (s === null ? '—' : s.toFixed(2));
