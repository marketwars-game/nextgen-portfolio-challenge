// FILE: lib/game-engine.ts — State Machine + Room Code Generator
// VERSION: NXG-V0 — insert 'shock' phase after 'reveal' on SHOCK_ROUNDS (Mid-Year Shock, Challenge 2)
//   Flow (Ch1,3,4): year_intro → invest → reveal → market_open → event → event_result → results → leaderboard
//   Flow (Ch2):     year_intro → invest → reveal → shock → market_open → event → event_result → results → leaderboard
//   Flow (Ch5):     ... → results → final  (skips leaderboard, MC drives podium/ranking)
// LAST MODIFIED: 10 Sep 2026
// HISTORY: market-wars B1..B19 | YG-V0 fork strips research/chance | YG-V4 reveal phase | NXG-V0 shock phase (SHOCK_ROUNDS from constants)

import { ROOM_CODE_CONFIG, GOLDEN_DEAL_ROUNDS, SHOCK_ROUNDS, TOTAL_ROUNDS, STEP_GROUPS } from './constants';

// ==============================================
// Room Code Generator
// ==============================================
export function generateRoomCode(): string {
  const { characters, length } = ROOM_CODE_CONFIG;
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// ==============================================
// Phase State Machine
// ==============================================

// Phase order per round — pure allocation loop (no quiz/chance/luck layer).
// NXG-V0: 'shock' is inserted after 'reveal' only on rounds listed in SHOCK_ROUNDS (weights already locked).
export function getPhaseOrder(round: number): string[] {
  const phases = [
    'year_intro',
    'invest',
    'reveal',
  ];

  // Mid-Year Shock — after every team has locked, before the market opens
  if (SHOCK_ROUNDS.includes(round)) {
    phases.push('shock');
  }

  phases.push('market_open', 'event', 'event_result');

  // Golden Deal ถ้าเป็นรอบที่กำหนด (ปัจจุบันปิดอยู่ = [])
  if (GOLDEN_DEAL_ROUNDS.includes(round)) {
    phases.push('golden_deal');
  }

  // รอบสุดท้ายตัด leaderboard ออก — results → final → (MC คุม podium/ranking) กันสปอยล์
  if (round >= TOTAL_ROUNDS) {
    phases.push('results', 'final');
  } else {
    phases.push('results', 'leaderboard');
  }

  return phases;
}

// คำนวณ phase ถัดไป
// return null ถ้าไม่มี phase ถัดไป (เกมจบแล้ว)
export function getNextPhase(
  currentPhase: string,
  currentRound: number,
): { phase: string; round: number; status: string } | null {

  // จาก lobby → year_intro (เริ่มเกม)
  if (currentPhase === 'lobby') {
    return { phase: 'year_intro', round: 1, status: 'playing' };
  }

  // ถ้าอยู่ที่ final หรือ final step ใดๆ (final_podium/awards/ranking) → ไม่มี next
  // MC คุม step ด้วย action 'set' เอง (ไม่ผ่าน next)
  if (currentPhase.startsWith('final')) {
    return null;
  }

  const order = getPhaseOrder(currentRound);
  const currentIndex = order.indexOf(currentPhase);

  // ถ้าหา phase ปัจจุบันไม่เจอใน order (ไม่ควรเกิด)
  if (currentIndex === -1) {
    return null;
  }

  // ยังไม่ถึง phase สุดท้ายของรอบ → เลื่อนไป phase ถัดไป
  if (currentIndex < order.length - 1) {
    const nextPhase = order[currentIndex + 1];
    return {
      phase: nextPhase,
      round: currentRound,
      status: nextPhase === 'final' ? 'finished' : 'playing',
    };
  }

  // ถ้าอยู่ที่ leaderboard (phase สุดท้ายของรอบ 1–4) → ขึ้นรอบใหม่ที่ year_intro
  if (currentPhase === 'leaderboard') {
    return {
      phase: 'year_intro',
      round: currentRound + 1,
      status: 'playing',
    };
  }

  // ไม่ควรมาถึงจุดนี้
  return null;
}

// ดึงรายการ phase ทั้งหมดของเกม (ใช้สำหรับ progress bar)
export function getAllGameSteps(): { round: number; phase: string }[] {
  const steps: { round: number; phase: string }[] = [];
  for (let r = 1; r <= TOTAL_ROUNDS; r++) {
    const phases = getPhaseOrder(r);
    phases.forEach((p) => steps.push({ round: r, phase: p }));
  }
  return steps;
}

// ==============================================
// Step Group Helpers — สำหรับ step indicator
// ==============================================

// บอกว่า phase ปัจจุบันอยู่ step group ไหน (return group id หรือ null ถ้าไม่อยู่ในกลุ่มไหน)
export function getCurrentStepGroup(phase: string): string | null {
  for (const group of STEP_GROUPS) {
    if (group.phases.includes(phase)) {
      return group.id;
    }
  }
  return null;
}

// คำนวณ progress ของ step indicator
// return array of { id, icon, label, status: 'done' | 'current' | 'upcoming' }
export function getStepGroupProgress(phase: string): { id: string; icon: string; label: string; status: 'done' | 'current' | 'upcoming' }[] {
  const currentGroupId = getCurrentStepGroup(phase);
  let foundCurrent = false;

  return STEP_GROUPS.map((group) => {
    if (group.id === currentGroupId) {
      foundCurrent = true;
      return { ...group, status: 'current' as const };
    }
    if (!foundCurrent) {
      return { ...group, status: 'done' as const };
    }
    return { ...group, status: 'upcoming' as const };
  });
}
