# KKP Next Gen Portfolio Challenge — File Registry

**Location:** วางที่ root ของ repo (`/FILE_REGISTRY.md`) — version control โดย git
**Last Updated:** NXG-V2 (player invest: lib/risk.ts σ preview · InvestmentPanel Thai + rule chips) — 16 Sep 2026
**Repo:** https://github.com/marketwars-game/nextgen-portfolio-challenge
**Default branch:** `main`
**Latest tag:** `NXG-V1` (16 Sep) · tag `NXG-V2` after Vercel smoke test · carried tags `YG-V0`..`YG-V6.3`
**Event:** พฤ 17 ก.ย. 2569 · 90 นาที · 6 ทีม × 10 คน · freeze tag `NXG-V5-stable` วันพุธ 16 ก.ย.
**Content source:** KKP Next Gen Portfolio Challenge — Thai Facilitator Guide v1.14 (project knowledge, ไม่อยู่ใน repo)

**Forked from:** `youngen-portfolio-challenge @ YG-V6.3` (KKP YoungGen 2026) ← `market-wars @ B20-stable` (Dime! Kids Camp) — แชร์ engine/DB/routes/sound ทั้งชุด แตกต่างที่ content / asset config / rules / phase flow

**NXG batch plan (ทีละ batch → build ผ่าน → full-overwrite → push):**
- **V0** ✅ fork + config (ไฟล์ตามตารางด้านล่าง)
- **V1** ✅ จอใหม่ — YearIntroDisplay (Story + 5 headlines + question) · ShockDisplay 🆕 · EventDisplay 3×3 + Reveal Script/Key Lesson · LockedPortfolio 🆕 (มือถือ reveal/shock) · display/play/mc branches · งานเอกสารปิด V0 (README/RUNBOOK/archive YG docs/package.json) ย้ายไป V5
- **V2** ✅ Player — `lib/risk.ts` 🆕 (σ preview, corr 0.20) · InvestmentPanel (ชื่อไทย + vol + σ + ชิปกติกา + Lock ไทย) — ตาม NXG-DESIGN-V2-Mockup
- **V3** Timer — `hooks/usePhaseTimer.ts` 🆕 · `components/common/CountdownTimer.tsx` 🆕 · InvestDisplay + InvestmentPanel header (อ่าน `rooms.phase_started_at`)
- **V3.5** MC Transfer Tool — `app/api/players/transfer/route.ts` 🆕 · `components/mc/TransferMC.tsx` 🆕 · `components/display/TransferOverlay.tsx` 🆕 (mini-game money moves; affects Highest Ending Value only)
- **V4** Thai sweep หน้าผู้เล่น · **V5** dry-run fixes + `docs/NXG_TechSpec_v1.md` + tag stable

---

## ⚠️ ถ้า owner หรือชื่อ repo ต่างจากด้านบน
ทุก raw URL ในไฟล์นี้ขึ้นต้นด้วย `marketwars-game/nextgen-portfolio-challenge` — ถ้าย้าย repo ไป org ThinkSpark (แผนหลัง 17 ก.ย.) ให้ find-replace ทั้งไฟล์ด้วยคำสั่งเดียว:
```
sed -i 's|marketwars-game/nextgen-portfolio-challenge|<OWNER>/<REPO>|g' FILE_REGISTRY.md
```
(repo ต้องเป็น **public** ถ้าอยากให้ Claude fetch raw URL ได้เอง เหมือน market-wars)

---

## หลักการ Registry-in-Repo
Registry นี้อยู่ใน repo — version control โดย git อัตโนมัติ:
- ทุกครั้งที่ tag (เช่น `NXG-V1`) registry จะถูก snapshot ไปด้วย
- เพิ่ม/ลบไฟล์ → update registry → commit พร้อมกัน
- Claude fetch registry นี้จาก GitHub raw URL ได้ตรงๆ ไม่ต้องพึ่ง Project Knowledge

**Raw URL ของ registry นี้:**
```
https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/FILE_REGISTRY.md
```

**Raw URL format ทั่วไป:**
```
https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/<path>
```

---

## 🔧 ไฟล์ที่แก้ใน NXG-V2 (1 แก้ + 1 ใหม่) — 16 Sep 2026
| ไฟล์ | แก้อะไร |
|------|---------|
| `lib/risk.ts` 🆕 | `portfolioVol(weights)` σ_p % ตาม Guide §3.2 `√[(1−ρ)Σ(wᵢσᵢ)² + ρ(Σwᵢσᵢ)²]` ρ=`VOL_CORRELATION` · `formatVol()` "5.9"/"—" · ตรวจ Guide B4 = 5.905 · §3.1 = 8.04 · preview เท่านั้น ไม่ใช้คิดผล/อันดับ |
| `components/player/InvestmentPanel.tsx` | rewrite ไทย: pill `CHALLENGE n · ปี` จาก `CHALLENGES` · summary = ฿ + สถานะ + bar + แถว σ สด + ชิป `n/4 รายการ` / `สูงสุด 40%` (idle/warn/ok) · แถว asset = ชื่อไทย + `nameEn · σ vol%` + MAX ที่ 40 + ฿ ใต้ชื่อ (ลบ RiskBadge + mini-bar) · `+` จางเมื่อรวม 100 · ปุ่ม Lock บอกข้อที่ยังไม่ผ่าน · submitted state ไทย + σ · validation/adjust/API เดิม · `isRebalance` คงเป็น optional-ignored (ถอดตอน V3 พร้อม page.tsx) |

---

## 🔧 ไฟล์ที่แก้ใน NXG-V1 (6 แก้ + 2 ใหม่) — 16 Sep 2026
| ไฟล์ | แก้อะไร |
|------|---------|
| `components/display/YearIntroDisplay.tsx` | อ่าน `CHALLENGES` ตรง · layout ใหม่: eyebrow CHALLENGE n/ปี · title · storyBrief · 📰 5 headlines (1 บรรทัด ellipsis) · ❓ question ปิดจอ · ตัดเลข 160px + STEP_GROUPS pills · คง rejoin QR (ไม่มีข้อความ bit.ly — รอ V4) |
| `components/display/ShockDisplay.tsx` 🆕 | `SHOCKS[round]` — ป้าย MID-YEAR SHOCK · title · 4 bullets stagger 0.6s · footer เหลือง · แสดงใน header shell เหมือน reveal |
| `components/display/EventDisplay.tsx` | อ่าน `CHALLENGES` ตรง · `event` = emoji + ปี·title + revealScript · `event_result` = news bar (title + keyLesson) + การ์ดแนวนอน 9 ใบ grid 3×3 (พอดี 720px — ทดสอบ mockup แล้ว) · ตัด `golden_deal` |
| `components/player/LockedPortfolio.tsx` 🆕 | มือถือ reveal/shock — banner (violet/แดง) + PortfolioBar + รายการ % และ ฿ จาก `players.portfolio` (realtime channel `player-me` ส่ง row เต็มอยู่แล้ว) |
| `app/display/[roomId]/page.tsx` | import + branch `shock` → ShockDisplay · EventDisplay prop ไม่มี golden_deal |
| `app/play/[roomId]/page.tsx` | `year_intro` อ่าน CHALLENGES (emoji ปี title + question) · branch `reveal`/`shock` → LockedPortfolio · เอาสอง phase ออกจาก generic block |
| `app/mc/[roomId]/page.tsx` | การ์ด `year_intro` (brief + 5 ข่าว + คำถาม) · การ์ด `shock` 🆕 (bullets + footer + mcTip) · `event` = revealScript · `event_result` = ตาราง 9 + keyLesson/commonTrap/reviewQuestion · ปุ่ม reveal→shock = "Next → ⚠️ Mid-Year Shock" |
| `lib/constants.ts` | ลบ derived views `YEAR_INTRO_TEXT` / `EVENTS` (ไม่มีผู้ใช้แล้ว) · content ไม่เปลี่ยน |

**V1 smoke test (บน Vercel):** Ch1 year_intro เห็นข่าว 5 ข้อไม่ล้น · Ch2 reveal → ปุ่ม ⚠️ → จอ Shock bullets ขึ้นทีละข้อ · มือถือ reveal/shock เห็นพอร์ตที่ Lock พร้อม banner · event_result การ์ด 9 ใบอยู่ใน 720px ทั้ง 5 รอบ · MC เห็นการ์ดใหม่ทุก phase

## 🔧 ไฟล์ที่แก้ใน NXG-V0 (fork จาก YG-V6.3 — 9 ไฟล์)
| ไฟล์ | แก้อะไร |
|------|---------|
| `lib/constants.ts` | เขียนใหม่: 9 asset (ไทย + `nameEn` + `vol`) · RETURN_TABLE 9×5 (Guide B1) · STARTING_MONEY 10,000,000 · TOTAL_ROUNDS 5 · MAX_PLAYERS 6 · DIVERSIFY_FROM_ROUND 1 / MAX 40 / MIN 4 / step 5 · AVAILABLE_ASSETS = ทั้ง 9 ทุกรอบ · `CHALLENGES` (brief/question/5 headlines/reveal/lesson) · `SHOCK_ROUNDS=[2]` + `SHOCKS` · `PHASE_TIMERS.invest=270` · `VOL_CORRELATION=0.20` · `PHASE_DISPLAY.shock` + ข้อความไทย · STEP_GROUPS รวม shock · YEAR_INTRO_TEXT/EVENTS derived จาก CHALLENGES · MC_TIPS ไทย |
| `lib/game-engine.ts` | `getPhaseOrder` แทรก `'shock'` หลัง `'reveal'` เมื่อ `SHOCK_ROUNDS.includes(round)` |
| `lib/sound.ts` | `PHASE_BGM.shock = bgm_suspense` · `PHASE_BGM.reveal = bgm_suspense` (ไฟล์เสียง 18 ไฟล์ติดมาจาก YG ครบ) |
| `app/layout.tsx` | metadata → KKP Next Gen Edition · ฿10M · 9 assets · 5 challenges · `lang="th"` |
| `app/page.tsx` | ป้าย "KKP Next Gen Edition" |
| `components/display/LobbyDisplay.tsx` | ป้าย "KKP Next Gen Edition" (ข้อความ join URL `bit.ly/portchallenge` ยังไม่แตะ — ตัดสินใจตอน V4) |
| `app/api/game/phase/route.ts` | stamp `rooms.phase_started_at` ทุกครั้งที่เปลี่ยน phase (start/next/end/set) — ฐานของ countdown V3 |
| `docs/schema.sql` | เพิ่ม `rooms.phase_started_at timestamptz default now()` · default money 10,000,000 · หัวไฟล์ NXG |
| `FILE_REGISTRY.md` | ไฟล์นี้ |

**ยังไม่แตะใน V0 (ตั้งใจ):** display page ยังไม่มี branch `shock` (จอว่าง 1 กด Next ผ่านได้) · YearIntro ยังโชว์ title + question (ไม่มี 5 ข่าว) · InvestmentPanel ยังไม่มี σ/ตัวนับ · ไม่มี countdown · InvestmentPanel/EventDisplay ใช้ `getAvailableAssets` ที่ตอนนี้คืน 9 → EventDisplay grid-cols-3 = 3×3 (ต้องเช็ค 720px ใน V1)

**V0 smoke test:** `npx tsc --noEmit` + `npm run build` ผ่าน · join 6 ทีม · 5 รอบครบ (Ch2 มี shock ว่าง) · ปุ่ม +/− หยุดที่ 40% และ Lock ปิดจนครบ ≥4 รายการ ตั้งแต่รอบ 1 · server reject พอร์ต 50% ตั้งแต่รอบ 1 · Ch1 พอร์ต cash10/gov40/IG20/DM20/EM5/SET5 → ฿10,725,000 (Guide B4)

## 🔧 ประวัติ YoungGen (คงไว้เพื่อ trace)

### YG-V4 (timers removed + reveal phase — 7 ไฟล์: 6 แก้ + 1 ใหม่)
| ไฟล์ | แก้อะไร |
|------|---------|
| `lib/constants.ts` | `PHASE_TIMERS = {}` (timer หมด) · `invest.hasTimer:false` · เพิ่ม `PHASE_DISPLAY.reveal` · reveal เข้า STEP_GROUPS |
| `lib/game-engine.ts` | แทรก `'reveal'` หลัง `'invest'` ใน getPhaseOrder |
| `components/display/LiveNameBoard.tsx` | invest variant masked (✓ only) · reveal variant (bars ครบ) · legend unlocked assets · EN |
| `components/display/InvestDisplay.tsx` | header (masked semantics) |
| `components/display/RevealDisplay.tsx` 🆕 | ใหม่ — LiveNameBoard variant reveal |
| `app/display/[roomId]/page.tsx` | import RevealDisplay + branch `reveal` |
| `app/mc/[roomId]/page.tsx` | next button "🔓 Reveal Allocations" ตอน invest + EN challenge label |

### YG-V3 (config/correctness — 4 ไฟล์)
| ไฟล์ | แก้อะไร |
|------|---------|
| `lib/constants.ts` | ALLOCATION_STEP 10→5 · ลบ `cap: 20` crypto + description |
| `app/api/players/portfolio/route.ts` | validation `% 10` → `% ALLOCATION_STEP` + dynamic error msg + version header |
| `components/player/InvestmentPanel.tsx` | เอาปุ่ม Edit + `handleEdit` ออก (submit final) · crypto cap auto-clear (generic) |
| `components/display/EventDisplay.tsx` | `COMPANIES.map` → `getAvailableAssets(round).map` · TH→EN |

### YG-V0 (fork จาก B20-stable — 5 ไฟล์)

| ไฟล์ | แก้อะไร | Raw URL |
|------|---------|---------|
| `lib/constants.ts` | 8 asset class (EN) · RETURN_TABLE 8×7 · STARTING_MONEY 1,000,000 · TOTAL_ROUNDS 7 · AVAILABLE_ASSETS + getAvailableAssets + getAssetCap · EN brief/event/step/phase · quiz/chance/golden = dormant | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/lib/constants.ts |
| `lib/game-engine.ts` | `getPhaseOrder` ตัด research/research_reveal/chance_card → pure allocation loop | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/lib/game-engine.ts |
| `components/player/InvestmentPanel.tsx` | asset ตาม round (unlock) · cap crypto ≤20% · บังคับ total = 100% ก่อน submit | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/player/InvestmentPanel.tsx |
| `app/play/[roomId]/page.tsx` | ส่ง `round` เข้า InvestmentPanel | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/play/[roomId]/page.tsx |
| `app/api/players/route.ts` | ทีมเริ่มเงิน → STARTING_MONEY (1,000,000) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/api/players/route.ts |

---

## App Routes (Next.js pages + API)

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| Root Layout | 🔧 NXG-V0 — metadata Next Gen · lang th | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/layout.tsx |
| Landing / Join | 🔧 NXG-V0 — ป้าย Next Gen · หน้าแรก join / create | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/page.tsx |
| Player Game | จอทีม (มือถือ) — 🔧 YG-V0 | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/play/[roomId]/page.tsx |
| MC Entry | หน้า MC เลือก/สร้างห้อง | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/mc/page.tsx |
| MC Control | 🔧 YG-V4 — reveal button + EN label · จอ MC คุมเกม | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/mc/[roomId]/page.tsx |
| Display (Projector) | 🔧 YG-V4 — render reveal phase · จอใหญ่ | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/display/[roomId]/page.tsx |

### API Routes

| Endpoint | ทำอะไร | Raw URL |
|----------|--------|---------|
| Rooms | สร้าง/ปิดห้อง | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/api/rooms/route.ts |
| Auth PIN | ตรวจ PIN ของ MC | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/api/auth/pin/route.ts |
| Players | Join + reconnect (🔧 YG-V0: เงินเริ่ม 1,000,000) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/api/players/route.ts |
| Player Portfolio | 🔧 YG-V3 — step validation `% ALLOCATION_STEP` (fix 5% reject) · Save allocation | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/api/players/portfolio/route.ts |
| Player Quiz | (dormant ใน YG-V0) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/api/players/quiz/route.ts |
| Game Phase | 🔧 NXG-V0 — stamp phase_started_at · Start/Next/End/Set + auto-calc returns (loop COMPANIES → generic) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/api/game/phase/route.ts |
| Game Calculate | Standalone calculate (fallback) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/api/game/calculate/route.ts |
| Health Check | Health endpoint | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/app/api/health/route.ts |

---

## lib/ — Game Logic & Config

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| risk | 🆕 NXG-V2 — `portfolioVol` / `formatVol` (σ preview, Guide §3.2) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/lib/risk.ts |
| constants | 🔧 NXG-V0 — rewritten: 9 assets · 5 challenges · CHALLENGES/SHOCKS · rules every round | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/lib/constants.ts |
| game-engine | 🔧 NXG-V0 — shock phase on SHOCK_ROUNDS · (YG-V4 reveal · YG-V0 pure allocation loop) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/lib/game-engine.ts |
| supabase | Supabase client | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/lib/supabase.ts |
| awards | Awards (Smart Diversifier ไม่ใช้ใน V.0 แต่ยัง compile) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/lib/awards.ts |
| ranking | comparator กลาง (จัดอันดับ) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/lib/ranking.ts |
| sound | 🔧 NXG-V0 — PHASE_BGM shock/reveal · registry เสียง 18 ไฟล์ | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/lib/sound.ts |
| debug | debug instrumentation (`?debug=1`) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/lib/debug.ts |

---

## Player Components (มือถือ)

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| InvestmentPanel | 🔧 NXG-V2 — Thai UI · σ preview · rule chips · Lock copy · (YG-V3 Edit removed · YG-V6.3 rules · YG-V0 allocation + 100% gate) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/player/InvestmentPanel.tsx |
| ResultsPanel | ผลรอบ (มือถือ) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/player/ResultsPanel.tsx |
| LeaderboardView | อันดับ + ตัวเอง | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/player/LeaderboardView.tsx |
| FinalView | สรุปจบเกม (มือถือ) — 🔧 YG-V5 spoiler guard + ตัด award badge | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/player/FinalView.tsx |
| ResearchQuiz | 💤 dormant (phase ถูกตัด แต่ยัง import) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/player/ResearchQuiz.tsx |
| ChanceCard | 💤 dormant | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/player/ChanceCard.tsx |
| MarketFight | 💤 dormant (ไม่ import) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/player/MarketFight.tsx |

---

## Display Components (Projector)

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| DisplayHeader | header (phase progress + challenge) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/DisplayHeader.tsx |
| LobbyDisplay | 🔧 NXG-V0 — ป้าย Next Gen · lobby (QR + teams) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/LobbyDisplay.tsx |
| YearIntroDisplay | challenge brief splash — ⏳ V1: Story + 5 headlines + question | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/YearIntroDisplay.tsx |
| MarketOpenDisplay | market-open splash | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/MarketOpenDisplay.tsx |
| InvestDisplay | 🔧 YG-V4 — masked submit wall (LiveNameBoard invest, no bars) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/InvestDisplay.tsx |
| RevealDisplay 🆕 | 🔧 YG-V4 — reveal phase: all teams' allocations together (LiveNameBoard reveal) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/RevealDisplay.tsx |
| EventDisplay | ⏳ V1: 3×3 grid + Reveal Script/Key Lesson · (YG-V3 getAvailableAssets filter) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/EventDisplay.tsx |
| ResultsDisplay | heatmap ผลรอบ | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/ResultsDisplay.tsx |
| LeaderboardDisplay | podium + ranking (racing) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/LeaderboardDisplay.tsx |
| FinalDisplay | สรุปจบเกม (router **3-step**: final→podium→ranking) — 🔧 YG-V5 | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/FinalDisplay.tsx |
| FinalPodium | เฉลย 3→2→1 + confetti — 🔧 YG-V5 ตัด award pill | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/FinalPodium.tsx |
| FinalAwards | 💤 **dormant** ตั้งแต่ YG-V5 (ไม่ import — Awards step ถูกตัด) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/FinalAwards.tsx |
| FinalRanking | อันดับทีมจริงล้วน — 🔧 YG-V5 ตัด benchmark + Smart Diversifier (คง 🎯/🧺) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/FinalRanking.tsx |
| LiveNameBoard | 🔧 YG-V4 — invest masked + reveal variant (all allocations) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/LiveNameBoard.tsx |
| LiveNameFeed | research sidebar feed | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/LiveNameFeed.tsx |
| AnimatedBackdrop | backdrop (particle + grid + glow) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/AnimatedBackdrop.tsx |
| ConfettiCanvas | confetti | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/ConfettiCanvas.tsx |
| SoundGate | ปลดล็อก autoplay | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/SoundGate.tsx |
| FitStage | 🆕 YG-V2 canvas 1280×720 + scale (fit-to-screen wrapper ทุก phase) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/FitStage.tsx |
| ResearchDisplay | 💤 dormant | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/ResearchDisplay.tsx |
| QuizSpeedWall | 💤 dormant | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/QuizSpeedWall.tsx |
| ChanceCardDisplay | 💤 dormant | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/ChanceCardDisplay.tsx |
| FightDisplay | 💤 dormant (ไม่ import) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/display/FightDisplay.tsx |

---

## MC Components

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| ResultsMC | สรุปผลรอบ | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/mc/ResultsMC.tsx |
| LeaderboardMC | ดูอันดับทุกทีม | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/mc/LeaderboardMC.tsx |
| FinalMC | จอ MC ปิดเกม — 🔧 YG-V5 script 2-step + ตัด awards box | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/mc/FinalMC.tsx |
| ResearchMC | 💤 dormant | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/mc/ResearchMC.tsx |

---

## Common / Hooks

| ไฟล์ | หน้าที่ | Raw URL |
|------|--------|---------|
| Bi | bilingual renderer (ไม่ใช้ใน V.0 EN-only แต่ยัง import) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/common/Bi.tsx |
| DebugPanel | debug overlay (`?debug=1`) | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/components/debug/DebugPanel.tsx |
| useDisplaySound | HTMLAudio manager | https://raw.githubusercontent.com/marketwars-game/nextgen-portfolio-challenge/main/hooks/useDisplaySound.ts |

---

## เอกสาร (docs/)

| ไฟล์ | หน้าที่ |
|------|--------|
| `docs/YoungGen_TechSpec_v6.md` | Tech Spec ของ YoungGen (อ้างอิง engine — content ล้าสมัยสำหรับ NXG) |
| `docs/NXG_TechSpec_v1.md` | ⏳ V5 — Tech Spec ของ Next Gen |
| `docs/README_YG_V0.md` | คู่มือรัน demo + deploy |
| `docs/schema.sql` | 🔧 NXG-V0 — Supabase schema + phase_started_at (รันใน project ใหม่ก่อน deploy) |

> 💤 dormant = ไฟล์จาก market-wars ที่ phase ถูกตัดใน V.0 — ยังอยู่เพื่อให้ import ไม่พัง ไม่ render จริง ลบได้ตอน cleanup V.1 (ต้องตาม import ออกด้วย)
