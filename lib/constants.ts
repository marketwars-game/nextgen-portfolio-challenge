// FILE: lib/constants.ts — Game Configuration (Single Source of Truth)
// VERSION: NXG-V0 — KKP Next Gen Portfolio Challenge (fork of YoungGen YG-V6.3)
//   • 8 asset classes (EN) → 9 asset classes (TH, per Facilitator Guide v1.14 §2.2) + per-asset `vol`
//   • RETURN_TABLE 8x7 → 9x5 (Guide Appendix B1)
//   • STARTING_MONEY 1,000,000 → 10,000,000 · TOTAL_ROUNDS 7 → 5 · MAX_PLAYERS 60 → 6 (teams)
//   • Diversification rules now apply EVERY round: MIN_ASSET_CLASSES 3 → 4, MAX_ALLOCATION_PER_ASSET 50 → 40, DIVERSIFY_FROM_ROUND 5 → 1
//   • Progressive unlock removed — all 9 assets selectable every challenge (AVAILABLE_ASSETS kept, now ALL_9 each round)
//   • NEW: CHALLENGES (story brief + question + 5 headlines + reveal script + key lesson), SHOCK_ROUNDS/SHOCKS (Mid-Year Shock), VOL_CORRELATION, PHASE_TIMERS.invest=270
//   • YEAR_INTRO_TEXT / EVENTS kept as derived views of CHALLENGES so V0 renders with untouched YG components (rewritten in NXG-V1)
// LAST MODIFIED: 10 Sep 2026
// HISTORY: market-wars B1..B20 | YoungGen YG-V0..V6.3 (see youngen-portfolio-challenge) | NXG-V0 fork: 9 assets · 5 challenges · ฿10M · rules every round · shock phase · Thai content

// ==============================================
// KKP Next Gen 2026 — Portfolio Challenge
// Single Source of Truth — all game data lives here
// Content source: KKP Next Gen Portfolio Challenge — Thai Facilitator Guide v1.14
// ==============================================

// Bilingual type kept for compatibility with <Bi> and dormant quiz/chance data.
export type LocalizedText = { th: string; en: string };

// --- Game Settings ---
export const MAX_PLAYERS = 6;               // teams (1 device = 1 team) — Next Gen: 6 teams × 10 people
export const TOTAL_ROUNDS = 5;              // 5 challenges (2027–2031)
export const STARTING_MONEY = 10000000;     // ฿10,000,000 virtual capital (Guide §2.1)
export const ALLOCATION_STEP = 5;           // 5% steps (team decision — Guide says decimals allowed; 5% step makes "≥5% per counted asset" automatic)

// NXG-V0: diversification rules apply EVERY challenge (Guide §2.1)
export const DIVERSIFY_FROM_ROUND = 1;      // rules active when round >= this
export const MAX_ALLOCATION_PER_ASSET = 40; // 0–40% per asset (applies to cash too)
export const MIN_ASSET_CLASSES = 4;         // at least 4 asset classes with weight ≥5% (with 5% step, any non-zero weight is ≥5%)

// Classroom volatility proxy (Guide §3.2) — used by lib/risk.ts (NXG-V2) for the on-device σ preview
export const VOL_CORRELATION = 0.20;

// ==============================================
// 9 Asset Classes (exported as COMPANIES to reuse the existing engine/routes unchanged)
//   id     → stable key used in portfolio / RETURN_TABLE / round_returns (never rename after go-live)
//   name   → Thai (per Guide §2.2) · nameEn → short EN tag for compact UI
//   vol    → annual volatility % (classroom proxy, same for every team, every round)
//   cap    → optional single-asset max % (none set — global MAX_ALLOCATION_PER_ASSET applies)
// ==============================================
export const COMPANIES = [
  {
    id: 'cash',
    name: 'เงินสด / Money Market',
    nameEn: 'Cash',
    type: 'Cash',
    risk: 'Very Low',
    vol: 0.5,
    color: '#94A3B8',
    icon: '💵',
    description: 'Money Market บาท / อัตราดอกเบี้ยระยะสั้นไทย',
  },
  {
    id: 'gov_bond',
    name: 'พันธบัตรรัฐบาลโลก',
    nameEn: 'Gov Bond',
    type: 'Fixed Income',
    risk: 'Low',
    vol: 7.0,
    color: '#1D4ED8',
    icon: '🏦',
    description: 'ตะกร้าพันธบัตรรัฐบาลคุณภาพสูง; Effective Duration 8 ปี',
  },
  {
    id: 'ig_bond',
    name: 'หุ้นกู้โลก Investment Grade',
    nameEn: 'IG Bond',
    type: 'Fixed Income',
    risk: 'Low-Medium',
    vol: 6.0,
    color: '#0EA5E9',
    icon: '📄',
    description: 'ตะกร้าหุ้นกู้ IG; Effective Duration 4 ปี + Credit Spread',
  },
  {
    id: 'dm_eq',
    name: 'หุ้นประเทศพัฒนาแล้ว (DM)',
    nameEn: 'DM Equity',
    type: 'Equity',
    risk: 'Medium-High',
    vol: 16.0,
    color: '#22C55E',
    icon: '🌐',
    description: 'หุ้น DM; แยก REITs/Infrastructure ออกจาก sleeve นี้',
  },
  {
    id: 'em_eq',
    name: 'หุ้นตลาดเกิดใหม่ (EM)',
    nameEn: 'EM Equity',
    type: 'Equity',
    risk: 'High',
    vol: 20.0,
    color: '#A855F7',
    icon: '🌏',
    description: 'หุ้น EM ไม่รวมไทยและหุ้นที่อยู่ใน Real Assets',
  },
  {
    id: 'thai_eq',
    name: 'หุ้นไทย (SET)',
    nameEn: 'SET',
    type: 'Equity',
    risk: 'High',
    vol: 22.0,
    color: '#F97316',
    icon: '🇹🇭',
    description: 'หุ้นไทย; ใช้ SET เป็นตัวแทน แยกหุ้นที่อยู่ใน Real Assets',
  },
  {
    id: 'real_assets',
    name: 'Real Assets',
    nameEn: 'Real Assets',
    type: 'Real Assets',
    risk: 'Medium',
    vol: 14.0,
    color: '#14B8A6',
    icon: '🏢',
    description: 'Global Listed REITs + Infrastructure น้ำหนักต้นปี 50/50',
  },
  {
    id: 'gold',
    name: 'ทองคำ',
    nameEn: 'Gold',
    type: 'Commodity',
    risk: 'Medium',
    vol: 15.0,
    color: '#FACC15',
    icon: '🥇',
    description: 'กองทุนที่อิงราคาทองคำ ไม่มี Leverage ภายใน sleeve',
  },
  {
    id: 'commodities',
    name: 'สินค้าโภคภัณฑ์',
    nameEn: 'Commodities',
    type: 'Commodity',
    risk: 'High',
    vol: 18.0,
    color: '#991B1B',
    icon: '🛢️',
    description: 'ตะกร้า Energy/Industrial Metals/Agriculture 50/25/25 ไม่รวมทอง',
  },
];

// ==============================================
// Asset availability — Next Gen: ALL 9 selectable in every challenge (Guide §5–9 "Asset Classes ที่ลงทุนได้: ทั้ง 9 รายการ")
// AVAILABLE_ASSETS + getAvailableAssets() kept so InvestmentPanel/EventDisplay/LiveNameBoard/portfolio route work unchanged.
// ==============================================
const ALL_9 = COMPANIES.map((c) => c.id);

export const AVAILABLE_ASSETS: Record<number, string[]> = {
  1: [...ALL_9],
  2: [...ALL_9],
  3: [...ALL_9],
  4: [...ALL_9],
  5: [...ALL_9],
};

// Return the asset objects selectable in a given challenge (preserves COMPANIES order).
export function getAvailableAssets(round: number): typeof COMPANIES[number][] {
  const ids = AVAILABLE_ASSETS[round] || AVAILABLE_ASSETS[1];
  return COMPANIES.filter((a) => ids.includes(a.id));
}

// Per-asset cap lookup (undefined = no cap). Source of truth for InvestmentPanel clamp.
export function getAssetCap(id: string): number | undefined {
  const a = COMPANIES.find((c) => c.id === id) as unknown as { cap?: number } | undefined;
  return a?.cap;
}

// ==============================================
// RETURN_TABLE — scripted returns per asset per challenge (9 assets × 5 challenges)
// Values are % (may be fractional). Source: Facilitator Guide v1.14 Appendix B1 (verified against §5–9 result tables).
// Worked example (Guide B4, Ch1): 10/40/20/20/5/5 on cash/gov/IG/DM/EM/SET → +7.25% → ฿10,725,000
//                    Ch1    Ch2    Ch3    Ch4    Ch5
//                   2027   2028   2029   2030   2031
// ==============================================
export const RETURN_TABLE: Record<string, number[]> = {
  cash:        [  2.0,   2.6,   1.8,   1.5,   1.7 ],
  gov_bond:    [  5.0,  -5.0,   8.0,  -1.0,  -6.0 ],
  ig_bond:     [  5.5,  -2.0,   6.0,   3.0,  -1.0 ],
  dm_eq:       [ 14.0, -12.0,  -4.0,  14.0,   9.0 ],
  em_eq:       [ 12.0, -14.0,  -6.0,  25.0,   2.0 ],
  thai_eq:     [ 11.0, -10.0,  -3.0,  27.0,   3.0 ],
  real_assets: [  9.0,  -9.0,   5.0,  14.0,  -3.0 ],
  gold:        [  0.0,   8.0,   4.0,  -6.0,  16.0 ],
  commodities: [  2.0,  20.0, -14.0,  16.0,   2.0 ],
};

// --- Room Code ---
export const ROOM_CODE_CONFIG = {
  characters: 'ABCDEFGHJKMNPQRSTUVWXYZ',
  length: 4,
};

// --- Phase Flow (documentation; source of truth = game-engine getPhaseOrder) ---
// NXG-V0: year_intro → invest → reveal → [shock: SHOCK_ROUNDS only] → market_open → event → event_result → results → leaderboard
export const GAME_PHASES = [
  'lobby',
  'year_intro',
  'invest',
  'reveal',
  'shock',
  'market_open',
  'event',
  'event_result',
  'results',
  'leaderboard',
  'final',
] as const;

export const GOLDEN_DEAL_ROUNDS: number[] = [];

// Mid-Year Shock — rounds that get an extra 'shock' phase after reveal (Guide §6, Challenge 2 only)
export const SHOCK_ROUNDS: number[] = [2];

// --- Phase Timers (seconds) — only phases where teams act ---
// NXG-V0: invest = 4:30 (Guide §4 "Team Decision 4:30"). Countdown UI ships in NXG-V3; until then this value is read by nothing.
// Timer is visual only — MC still presses Reveal manually (no auto-lock).
export const PHASE_TIMERS: Record<string, number> = {
  invest: 270,
};

// --- Phase Display Info ---
export const PHASE_DISPLAY: Record<string, {
  name: string;
  icon: string;
  displayMessage: string;
  playerMessage: string;
  mcTip: string;
  hasTimer: boolean;
}> = {
  lobby: {
    name: 'Lobby',
    icon: '🏠',
    displayMessage: 'Waiting for teams...',
    playerMessage: 'รอผู้ดำเนินเกมเริ่ม...',
    mcTip: 'รอจนครบ 6 ทีม แล้วกด Start',
    hasTimer: false,
  },
  year_intro: {
    name: 'Challenge Brief',
    icon: '📅',
    displayMessage: 'A new challenge begins!',
    playerMessage: 'อ่าน Story Brief และข่าวบนจอใหญ่ (ตัวเต็มอยู่ใน Handout)',
    mcTip: 'อ่าน Story Brief → เปิด 5 ข่าว → ถามคำถามก่อนเปิดข่าว → Next ไปจัดพอร์ต',
    hasTimer: false,
  },
  invest: {
    name: 'Team Decision',
    icon: '💰',
    displayMessage: 'Teams are allocating...',
    playerMessage: 'จัดพอร์ตให้ครบ 100% — รายการละ 0–40% และอย่างน้อย 4 รายการ',
    mcTip: '4:30 นาที · ทุกทีมจัดพอร์ตใหม่จากศูนย์ · ครบทุกทีมแล้วกด Reveal',
    hasTimer: true,
  },
  reveal: {
    name: 'Reveal',
    icon: '🔓',
    displayMessage: 'Revealing every team\'s allocation...',
    playerMessage: 'พอร์ตทุกทีมอยู่บนจอใหญ่ — ดูพร้อมกัน',
    mcTip: 'ทุกพอร์ตขึ้นจอพร้อมกัน ชี้ทีมที่ต่างจากคนอื่นมากสุด แล้ว Next',
    hasTimer: false,
  },
  shock: {
    name: 'Mid-Year Shock',
    icon: '⚠️',
    displayMessage: 'Mid-year shock — portfolios are locked',
    playerMessage: '📺 ดูจอใหญ่ — เหตุการณ์กลางปี (พอร์ต Lock แล้ว)',
    mcTip: 'อ่าน Shock 40–45 วินาที · ย้ำว่าทุกทีมคงน้ำหนักที่ Lock ไว้ · แล้ว Next เปิดตลาด',
    hasTimer: false,
  },
  market_open: {
    name: 'Market Open',
    icon: '📈',
    displayMessage: 'The market is opening...',
    playerMessage: '📺 ดูจอใหญ่!',
    mcTip: 'สร้างจังหวะ — "มาดูกันว่าปีนี้เป็นอย่างไร..." แล้ว Next',
    hasTimer: false,
  },
  event: {
    name: 'The Year',
    icon: '📰',
    displayMessage: 'What happened this year',
    playerMessage: '📺 ดูจอใหญ่!',
    mcTip: 'อ่าน Reveal Script · ถามว่า asset ไหนชนะ/แพ้ · แล้ว Next',
    hasTimer: false,
  },
  event_result: {
    name: 'Year Returns',
    icon: '📊',
    displayMessage: 'Returns revealed!',
    playerMessage: '📺 ดูจอใหญ่!',
    mcTip: 'อธิบายว่าทำไมแต่ละ asset เคลื่อนแบบนี้ · Key Lesson · แล้ว Next',
    hasTimer: false,
  },
  results: {
    name: 'Round Results',
    icon: '💰',
    displayMessage: 'Portfolios updated!',
    playerMessage: 'ดูผลพอร์ตของทีม',
    mcTip: 'ทีมเห็นมูลค่าใหม่ ถามว่าใครกำไร ใครขาดทุน · แล้ว Next',
    hasTimer: false,
  },
  leaderboard: {
    name: 'Leaderboard',
    icon: '🏆',
    displayMessage: 'Standings updated!',
    playerMessage: 'ดูอันดับ!',
    mcTip: 'เปิดอันดับแบบมีจังหวะ — ใครขึ้น ใครตก · แล้ว Next ไป Challenge ถัดไป',
    hasTimer: false,
  },
  final: {
    name: 'Final Summary',
    icon: '🎉',
    displayMessage: 'The challenge is complete!',
    playerMessage: 'ผลสุดท้าย!',
    mcTip: 'ประกาศ Top 3 มูลค่าพอร์ต (รางวัลเสริม) · รางวัลหลัก Best Risk-Adjusted อ่านจาก Score Sheet · debrief 5 บทเรียน',
    hasTimer: false,
  },
};

// ==============================================
// Step Groups — progress indicator (NXG-V0: shock joins the Allocate group)
// ==============================================
export const STEP_GROUPS = [
  { id: 'allocate', icon: '💰', label: 'Allocate', phases: ['year_intro', 'invest', 'reveal', 'shock'] },
  { id: 'market', icon: '📰', label: 'Market', phases: ['market_open', 'event', 'event_result'] },
  { id: 'results', icon: '📊', label: 'Results', phases: ['results'] },
  { id: 'leaderboard', icon: '🏆', label: 'Ranking', phases: ['leaderboard'] },
];

// ==============================================
// CHALLENGES — full per-round content (Guide §5–9)
//   storyBrief / question / headlines → year_intro screen (NXG-V1 YearIntroDisplay)
//   revealScript / keyLesson / commonTrap / reviewQuestion → event / event_result screens (NXG-V1 EventDisplay + MC page)
//   Headlines are TITLES ONLY — full news text lives on the paper Handout (Appendix E). Facilitator notes never ship to a screen.
// ==============================================
export type Challenge = {
  round: number;
  year: number;
  title: string;
  emoji: string;
  storyBrief: string;
  question: string;
  headlines: string[];
  revealScript: string;
  keyLesson: string;
  commonTrap: string;
  reviewQuestion: string;
};

export const CHALLENGES: Record<number, Challenge> = {
  1: {
    round: 1,
    year: 2027,
    title: 'Soft Landing?',
    emoji: '🛬',
    storyBrief:
      'ต้นปี 2027 เงินเฟ้อในกลุ่มประเทศพัฒนาแล้วมีแนวโน้มลดลง ขณะที่การจ้างงานและผลประกอบการยังขยายตัว ตลาดจึงเพิ่มความคาดหวังต่อภาวะ Soft Landing อย่างไรก็ตาม ราคาหุ้นปรับตัวขึ้นมาบางส่วนแล้ว และอัตราดอกเบี้ยที่อยู่ในระดับสูงยังเป็นความเสี่ยงต่อเศรษฐกิจ',
    question: 'หากเศรษฐกิจยังเติบโต แต่ราคาหุ้นสะท้อนความหวังไปแล้ว ทีมยอมรับความเสี่ยงด้าน Valuation ได้เท่าใด?',
    headlines: [
      'เงินเฟ้อพื้นฐานลดลงสู่ 2.5% ตลาดแรงงานยังมีเสถียรภาพ',
      'พิพิธภัณฑ์เปิดชมรอบค่ำ ยอดจองเต็มต่อเนื่อง ร้านค้าในย่านขยายเวลาให้บริการ',
      'กำไรบริษัทในตลาดพัฒนาแล้ว (DM) เติบโต 9% ขณะที่ Valuation ยังอยู่ในระดับสูง',
      'ตลาดพันธบัตรคาด Yield ลดลงต่อ ขณะที่หุ้นกู้ IG มี Carry สูงกว่า',
      'Atlas Macro คาดเศรษฐกิจหดตัวสองไตรมาสติดต่อกัน เสนอเพิ่มสัดส่วนเงินสด',
    ],
    revealScript:
      'เมื่อสิ้นปี เศรษฐกิจไม่เข้าสู่ภาวะถดถอยและกำไรขยายตัวดีกว่าคาด DM ให้ผลตอบแทน +14% ส่วน Government Bond +5% และ IG +5.5% ได้รับทั้ง Carry และผลจาก Yield ที่ลดลงเพิ่มเติมหลังลงทุน การประเมินผลตอบแทนจึงต้องพิจารณาราคาเริ่มต้นและสิ่งที่ตลาดคาดไว้ร่วมกับข้อมูลเศรษฐกิจ',
    keyLesson: 'เงินเฟ้อที่ลดลงพร้อมการจ้างงานและกำไรที่ยังขยายตัว อาจสนับสนุนทั้งหุ้นและพันธบัตร',
    commonTrap: 'Valuation สูงไม่ได้หมายความว่าราคาต้องลดลง แต่เพิ่มความเสี่ยงหากกำไรต่ำกว่าคาด',
    reviewQuestion: 'หากกำไรเริ่มต่ำกว่าคาด ทีมจะทบทวนน้ำหนักสินทรัพย์ใด และด้วยเหตุผลใด?',
  },
  2: {
    round: 2,
    year: 2028,
    title: 'Global Supply Crisis',
    emoji: '🚢',
    storyBrief:
      'ต้นปี 2028 เรือบรรทุกน้ำมันสองลำถูกโดรนโจมตีใกล้ช่องแคบฮาร์มุซ บริษัทเดินเรือหลายแห่งจึงเปลี่ยนเส้นทาง ส่งผลให้ค่าระวางและเบี้ยประกันภัยเพิ่มขึ้น ขณะเดียวกัน ภัยแล้งในประเทศผู้ส่งออกสินค้าเกษตรทำให้ผลผลิตเสียหาย นักลงทุนบางส่วนเชื่อว่าจะควบคุมสถานการณ์ได้เร็ว ขณะที่อีกส่วนกังวลว่าเงินเฟ้อจะกลับมาเร่งตัว',
    question: 'หากต้นทุนเพิ่มขึ้นแต่ยอดขายชะลอ หุ้นและพันธบัตรที่ถืออยู่จะช่วยลดความเสี่ยงให้กันได้เพียงใด?',
    headlines: [
      'ประเทศผู้ส่งออกธัญพืชปรับลดคาดการณ์ผลผลิต 7% การขนส่งใช้เวลานานขึ้น',
      'ฟิล์มยืดอายุผลไม้คว้ารางวัลนวัตกรรม ผู้ค้าปลีกเตรียมทดลองลดการใช้ห้องเย็น',
      'Meridian Research คาดอุปทานสินค้าโภคภัณฑ์ฟื้นในครึ่งปีหลัง และราคาปรับลดลง',
      'ผู้ผลิตเตรียมปรับราคา 5–8% ขณะที่คำสั่งซื้อใหม่ชะลอลงและสต็อกโลหะยังต่ำ',
      'ตลาดคาด Fed ลดดอกเบี้ยเพียงครั้งเดียว จับตาต้นทุนดันเงินเฟ้อ',
    ],
    revealScript:
      'วิกฤตยืดเยื้อกว่าคาด หุ้น DM −12%, EM −14%, SET −10% และพันธบัตรรัฐบาล −5% ขาดทุนพร้อมกัน ขณะที่สินค้าโภคภัณฑ์ +20% จากอุปทานขาดแคลน และทอง +8% จากแรงซื้อป้องกันความเสี่ยง พอร์ตจึงอาจขาดทุนแม้กระจายหลายตลาด ควรตรวจว่าความเสี่ยงร่วมกระจุกอยู่ที่ปัจจัยใด',
    keyLesson: 'การกระจายความเสี่ยงควรพิจารณาปัจจัยร่วม หุ้นและพันธบัตรอาจขาดทุนพร้อมกันเมื่อเงินเฟ้อเพิ่มขึ้น',
    commonTrap: 'ทองคำและสินค้าโภคภัณฑ์ไม่ได้ช่วยลดผลกระทบจากวิกฤตทุกประเภท',
    reviewQuestion: 'เมื่อเกิดสถานการณ์ที่ต่างจากคาดการณ์ น้ำหนักเดิมส่งผลต่อขนาดการขาดทุนอย่างไร?',
  },
  3: {
    round: 3,
    year: 2029,
    title: 'Growth and Interest Rates',
    emoji: '📉',
    storyBrief:
      'ต้นปี 2029 เส้นทางขนส่งกลับมาเปิดดำเนินการและราคาพลังงานเริ่มทรงตัว ส่งผลให้แรงกดดันด้านต้นทุนลดลง ขณะเดียวกัน ภาคอุตสาหกรรมเริ่มลดชั่วโมงการทำงานและชะลอการลงทุน ตลาดคาดหวังการผ่อนคลายนโยบายการเงิน ทีมต้องพิจารณาว่าการลดดอกเบี้ยจะช่วยสนับสนุนกำไรได้มากเพียงใด เมื่อเทียบกับผลกระทบจากอุปสงค์ที่ชะลอลง',
    question: 'การลดดอกเบี้ยครั้งนี้สะท้อนเงินเฟ้อที่ดีขึ้น หรือความต้องการซื้อที่อ่อนลง และต่างกันอย่างไรต่อหุ้นกับพันธบัตร?',
    headlines: [
      'Horizon Economics คาดภาคอุตสาหกรรมในตลาดพัฒนาแล้วหดตัว อ้างคำสั่งซื้อและชั่วโมงทำงานลดลง',
      'เงินเฟ้อทั่วไปของสหรัฐฯ ลดลงเหลือ 2.6% ขณะที่เงินเฟ้อภาคบริการอยู่ที่ 3.3%',
      'ภาคบริการสหรัฐฯ ยังขยายตัว แต่การจ้างงานใหม่ลดลงเหลือ 90,000 ตำแหน่งต่อเดือน',
      'ยอดจองพื้นที่ทำงานพุ่ง 40% ผู้ให้บริการเพิ่มสาขา พร้อมเปิดแพ็กเกจ "ประชุมได้ แม่ไม่เรียก"',
      'Fed ส่งสัญญาณผ่อนคลายเพิ่มเติม ขณะที่ Credit Spread หุ้นกู้ทั่วโลกมีแนวโน้มสูงขึ้น',
    ],
    revealScript:
      'เมื่อสิ้นปี การผลิตและกำไรอ่อนตัวกว่าคาด Fed และธนาคารกลางในตลาดหลักหลายแห่งผ่อนคลายเพิ่มเติมและ Yield พันธบัตรลดลง Government Bond ให้ผลตอบแทน +8% ส่วน IG +6% เนื่องจาก Credit Spread กว้างขึ้น Commodities ให้ผลตอบแทน −14% เมื่ออุปทานฟื้นตัวแต่อุปสงค์ลดลง การลดดอกเบี้ยจึงไม่จำเป็นต้องทำให้หุ้นปรับตัวขึ้น',
    keyLesson: 'ควรพิจารณาสาเหตุของการลดดอกเบี้ย และแยกผลของ Duration, Credit Spread และกำไร',
    commonTrap: 'การลดดอกเบี้ยไม่รับประกันผลตอบแทนหุ้น และหุ้นกู้ IG มีความเสี่ยงต่างจากพันธบัตรรัฐบาล',
    reviewQuestion: 'เหตุใดพันธบัตรรัฐบาลและหุ้นกู้ IG จึงให้ผลตอบแทนต่างกัน แม้ Yield ลดลง?',
  },
  4: {
    round: 4,
    year: 2030,
    title: 'AI Infrastructure Race',
    emoji: '🤖',
    storyBrief:
      'ต้นปี 2030 บริษัทหลายแห่งนำ AI มาใช้ในโรงงาน ระบบขนส่ง และงานบริการ การแข่งขันขยายศูนย์ข้อมูลทำให้ระบบไฟฟ้า อุปกรณ์ระบายความร้อน และกำลังผลิตชิ้นส่วนได้รับความสนใจ แต่บางโครงการยังรอไฟฟ้าและเงินทุน ขณะที่บางแห่งเริ่มส่งมอบแล้ว ทีมต้องเลือกว่าจะให้น้ำหนักกับผู้พัฒนาเทคโนโลยี ผู้ผลิตอุปกรณ์ หรือธุรกิจโครงสร้างพื้นฐาน',
    question: 'ธุรกิจใดเริ่มรับรู้รายได้จากการลงทุนแล้ว และข่าวใดยังสะท้อนเพียงแผนหรือความคาดหวัง?',
    headlines: [
      'เวทีโครงสร้างพื้นฐานดิจิทัลประกาศ MOU 1.2 ล้านล้านดอลลาร์ หุ้นผู้จัดงานเพิ่มขึ้น 19%',
      'คำสั่งซื้อระบบอัตโนมัติและอุปกรณ์ศูนย์ข้อมูลเพิ่ม PMI ภาคการผลิตโลกอยู่ที่ 53.4',
      'ศูนย์ข้อมูลที่มีสัญญาไฟฟ้าเริ่มเปิดใช้ โครงการสายส่งและระบบน้ำทยอยเบิกจ่าย',
      'การลงทุนเร่งตัวพร้อมต้นทุนเงินกู้ระยะยาวที่สูงขึ้น แม้ Fed ยังรอดูการจ้างงาน',
      'กำไรบริษัทไทยฟื้นหลายกลุ่ม ยอดเช่านิคมและรายได้ท่องเที่ยวขยายตัว',
    ],
    revealScript:
      'โครงการที่พร้อมส่งมอบและการฟื้นหลายอุตสาหกรรมหนุน SET +27% และ EM +25% ส่วน Real Assets +14% ได้รายได้เพิ่ม แม้ต้นทุนเงินทุนสูงขึ้น พันธบัตรรัฐบาล −1% และทอง −6% ตาม Yield ที่เพิ่ม การลงทุน AI จึงสร้างโอกาสนอกหุ้นเทคโนโลยีด้วย แต่ไม่ได้ทำให้ทุกโครงการคุ้มค่าเท่ากัน',
    keyLesson: 'เทคโนโลยีสร้างรายได้ให้หลายธุรกิจ แต่ต้องตรวจสัญญา การส่งมอบ ราคาเริ่มต้น และต้นทุนเงินทุน',
    commonTrap: 'วงเงิน MOU และราคาหุ้นบริษัทเดียวไม่ยืนยันผลตอบแทนทั้ง Asset Class',
    reviewQuestion: 'ทีมเลือกผู้พัฒนา ผู้ผลิตอุปกรณ์ หรือผู้มีรายได้ตามสัญญา ผ่านสินทรัพย์ใด เพราะเหตุใด?',
  },
  5: {
    round: 5,
    year: 2031,
    title: 'The Next AI Breakthrough',
    emoji: '🧠',
    storyBrief:
      'ต้นปี 2031 โมเดล AI รุ่นใหม่ลดต้นทุนใช้งานและเริ่มถูกนำไปใช้ในงานบริการ ธุรกิจที่เคยเข้าถึงเทคโนโลยีได้ยากเริ่มทดลองใช้ ขณะที่ผู้ลงทุนตั้งคำถามกับแผนศูนย์ข้อมูลขนาดใหญ่ รัฐบาลยังมีภาระโครงการที่อนุมัติและหนี้ที่ต้องต่ออายุ ทีมต้องประเมินว่าประโยชน์จากเทคโนโลยีจะตกอยู่กับใคร และจะชดเชยต้นทุนเงินทุนที่ตลาดเรียกร้องได้หรือไม่',
    question: 'AI ที่มีต้นทุนต่ำลงเป็นผลดีต่อใคร และเพียงพอหรือไม่ที่จะชดเชยความเสี่ยงของโครงการและการระดมทุน?',
    headlines: [
      'หลายประเทศในตลาดหลักคงแผนลงทุนดิจิทัลและพลังงาน เพิ่มวงเงินออกพันธบัตร 35%',
      'AI ราคาถูกลงหนุนกำไรธุรกิจบริการ ผู้ให้เช่าระบบประมวลผลเผชิญการแข่งขัน',
      'เหรียญทองโบราณทำสถิติประมูล นักสะสมหลายประเทศร่วมเสนอราคา',
      'พันธบัตรออมทรัพย์ในประเทศหนึ่งของยุโรปจองเต็ม ขณะที่เงินเฟ้อพื้นฐานอยู่ที่ 3.2%',
      'ธนาคารกลางหลายประเทศเพิ่มซื้อทอง ขณะที่ลูกค้าทบทวนแผนเช่าศูนย์ข้อมูลบางโครงการ',
    ],
    revealScript:
      'ผู้ใช้ AI และธุรกิจอื่นยังมีกำไรเติบโต หนุน DM +9% แต่ Yield ระยะยาวเพิ่มจากการระดมทุนภาครัฐ ทำให้พันธบัตรรัฐบาล −6% และ Real Assets −3% ทอง +16% จากแรงซื้อกระจายความเสี่ยง นวัตกรรมที่ดีขึ้นจึงอยู่ร่วมกับผลขาดทุนของสินทรัพย์บางประเภทได้',
    keyLesson: 'แยกผู้ได้ประโยชน์จากเทคโนโลยีออกจากผู้แบกรับต้นทุนลงทุน และแยกดอกเบี้ยนโยบายจาก Yield ระยะยาว',
    commonTrap: 'AI ต้นทุนต่ำไม่ได้ทำให้หุ้นเทคโนโลยีทุกบริษัทขึ้น หรือทำให้ภาระหนี้และต้นทุนเงินทุนลดทันที',
    reviewQuestion: 'เหตุใด DM ยังบวก ขณะที่พันธบัตรและ Real Assets ติดลบ?',
  },
};

// ==============================================
// Mid-Year Shock — shown full-screen after all teams Lock (Guide §6). Read aloud 40–45 s. Weights stay locked.
// ==============================================
export const SHOCKS: Record<number, { title: string; bullets: string[]; footer: string }> = {
  2: {
    title: 'กลางปี 2028 — Mid-Year Shock',
    bullets: [
      'ช่องแคบหลักปิดจากเหตุความมั่นคงนานหกสัปดาห์ เรือพลังงานและสินค้าต้องอ้อมเส้นทาง',
      'สามประเทศจำกัดส่งออกธัญพืช ขณะที่สต็อกสำรองลดลงเร็วกว่าคาด โรงงานบางแห่งลดกำลังผลิต',
      'Fed และธนาคารกลางในตลาดหลักหลายแห่งยกเลิกแผนลดดอกเบี้ยและกลับมาขึ้นดอกเบี้ย เพื่อสกัดเงินเฟ้อที่ขยายวง',
      'แรงขายลามจากหุ้นสู่พันธบัตรและหุ้นกู้ หลายบริษัทต้องระดมเงินเพิ่มเพื่อรองรับต้นทุน',
    ],
    footer: 'ทุกทีมคงน้ำหนักที่ Lock ไว้ — ผลตอบแทนทั้งปีที่จะเปิดต่อไปได้รวมเหตุการณ์นี้แล้ว',
  },
};

// ==============================================
// Derived views — keep YG-V6.3 components compiling untouched in NXG-V0
//   YEAR_INTRO_TEXT → YearIntroDisplay / play page / MC page   (rewritten to use CHALLENGES in NXG-V1)
//   EVENTS          → EventDisplay / MC page                    (rewritten to use CHALLENGES in NXG-V1)
// ==============================================
export const YEAR_INTRO_TEXT: Record<number, { title: string; subtitle: string }> = Object.fromEntries(
  Object.values(CHALLENGES).map((c) => [
    c.round,
    { title: `Challenge ${c.round} · ${c.year} · ${c.title}`, subtitle: c.question },
  ]),
) as Record<number, { title: string; subtitle: string }>;

export const EVENTS = Object.values(CHALLENGES).map((c) => ({
  round: c.round,
  title: `${c.year} · ${c.title}`,
  emoji: c.emoji,
  description: c.revealScript,
  image: null as string | null,
}));

// --- MC Tips per challenge (Thai; facilitator-only) ---
export const MC_TIPS: Record<number, string> = {
  1: 'รอบแรก — อธิบาย flow: Brief → ข่าว 5 ชิ้น → จัดพอร์ต 100% (0–40% · ≥4 รายการ) → Reveal → ผลตอบแทน → ทบต้น · Learning Focus: เงินเฟ้อลด + จ้างงาน/กำไรโต หนุนทั้งหุ้นและพันธบัตร',
  2: 'รอบ Lock + Shock — หลัง Reveal กด Next ขึ้นจอ Shock อ่าน 40–45 วิ ย้ำ "คงน้ำหนักที่ Lock" · Learning Focus: หุ้นและพันธบัตรขาดทุนพร้อมกันเมื่อเงินเฟ้อขึ้น',
  3: 'ถาม "ดอกเบี้ยลดเพราะอะไร" — เงินเฟ้อดีขึ้น vs Growth Scare · แยก Duration / Credit Spread / กำไร · Commodities −14%',
  4: 'แยก "ส่งมอบแล้ว" กับ "แค่ MOU" · SET +27% EM +25% Real Assets +14% แต่พันธบัตร −1% ทอง −6% เพราะ Yield ขึ้น',
  5: 'รอบสุดท้าย — ใครได้ประโยชน์จาก AI vs ใครแบกต้นทุน · แยกดอกเบี้ยนโยบายจาก Yield ระยะยาว · หลัง results ไป final → podium (มูลค่าพอร์ต = รางวัลเสริม) · Score Sheet = รางวัลหลัก',
};

// ==============================================
// DORMANT DATA (kept only so dormant components still compile)
// These phases are not in the NXG flow and never render.
// ==============================================

export const QUIZ_BONUS = { CORRECT_2: 0, CORRECT_1: 0, CORRECT_0: 0 };

export const CHANCE_CARDS: { id: number; text: LocalizedText; emoji: string; amount: number }[] = [
  { id: 1, text: { th: '-', en: '-' }, emoji: '🎁', amount: 0 },
];

export function getChanceCard(_roomId: string, _round: number, _playerId: string): typeof CHANCE_CARDS[number] {
  return CHANCE_CARDS[0];
}

export const GOLDEN_DEALS: { round: number; name: string; description: string; actual_return: number; is_trap: boolean }[] = [];

export const QUIZ_POOL: { id: number; question: LocalizedText; choices: LocalizedText[]; correct: number }[] = [
  { id: 1, question: { th: '-', en: '-' }, choices: [{ th: '-', en: '-' }], correct: 0 },
];

export const QUIZ_PER_ROUND: Record<number, number[]> = { 1: [1] };

export function getQuizForRound(_roomId: string, _round: number): typeof QUIZ_POOL[number][] {
  return [];
}

// Readable text color for a % label sitting on top of an asset-color segment
// (dark text on light colors like gold/teal, white text on dark colors like blue/purple)
export function assetTextColor(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.95)';
}
