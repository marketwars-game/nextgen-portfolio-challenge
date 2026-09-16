// FILE: components/display/YearIntroDisplay.tsx — Display challenge brief: Story Brief + 5 news headlines + question (+ rejoin QR)
// VERSION: NXG-V1 — reads CHALLENGES directly (drops YEAR_INTRO_TEXT); layout per NXG-DESIGN-V1-Mockup screen 1; 160px number + STEP_GROUPS pills removed
// LAST MODIFIED: 16 Sep 2026
// HISTORY: B1..B20 (kids-camp lineage) | YG-V0 fork | YG-V1 re-theme | YG-V2 fit-to-screen | YG-V6 challenge wording + corner rejoin QR | NXG-V1 story + headlines + question
'use client';

import { QRCodeSVG } from 'qrcode.react';
import { CHALLENGES } from '@/lib/constants';
import AnimatedBackdrop from '@/components/display/AnimatedBackdrop';

export default function YearIntroDisplay({ round, roomId, joinUrl }: { round: number; roomId?: string; joinUrl?: string }) {
  const ch = CHALLENGES[round];

  return (
    <div className="w-full h-full bg-base text-white relative overflow-hidden">
      <AnimatedBackdrop accent="var(--mw-violet)" accent2="var(--mw-rose)" />

      {/* Rejoin QR — corner card (kept from YG-V6; short-link text decided in NXG-V4) */}
      {roomId && joinUrl && (
        <div className="absolute z-20 flex flex-col items-center gap-[8px]" style={{ top: 34, right: 34, width: 190, padding: '14px 14px', borderRadius: 16, background: 'rgba(var(--mw-surface-rgb),0.72)', backdropFilter: 'blur(8px)', border: '1px solid var(--mw-border)', boxShadow: '0 12px 40px rgba(0,0,0,0.45)' }}>
          <span style={{ fontSize: 12, letterSpacing: 2, fontWeight: 700, color: 'var(--mw-rose)' }}>REJOIN YOUR TEAM</span>
          <div className="bg-white" style={{ borderRadius: 10, padding: 9 }}><QRCodeSVG value={joinUrl} size={120} /></div>
          <span className="font-mono" style={{ fontSize: 24, fontWeight: 700, letterSpacing: 6, color: 'var(--mw-rose)' }}>{roomId}</span>
        </div>
      )}

      {!ch ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-4xl font-bold">Challenge {round}</p>
        </div>
      ) : (
        <div className="relative z-10 h-full flex flex-col" style={{ padding: '52px 80px 44px' }}>
          {/* Eyebrow */}
          <div className="flex items-baseline gap-[18px] mb-[12px]">
            <span style={{ fontSize: 22, letterSpacing: 6, fontWeight: 600, color: 'var(--mw-rose)' }}>CHALLENGE {ch.round}</span>
            <span style={{ fontSize: 22, color: '#9b98c0' }}>ปี {ch.year}</span>
          </div>

          {/* Title */}
          <div className="font-black leading-none mb-[22px]" style={{ fontSize: 64 }}>
            {ch.emoji} <span style={{ color: 'var(--mw-violet)' }}>{ch.title}</span>
          </div>

          {/* Story brief */}
          <p className="mb-[26px]" style={{ fontSize: 22, lineHeight: 1.55, color: 'rgba(255,255,255,0.85)', maxWidth: 1120 }}>
            {ch.storyBrief}
          </p>

          {/* News flash — headlines only (full text on Handout Appendix E) */}
          <div className="mb-[22px]" style={{ background: 'rgba(var(--mw-surface-rgb),0.7)', border: '1px solid var(--mw-border)', borderRadius: 16, padding: '16px 24px' }}>
            <div style={{ fontSize: 14, letterSpacing: 3, fontWeight: 700, color: 'var(--mw-rose)', marginBottom: 8 }}>📰 NEWS FLASH</div>
            <ol className="m-0 p-0 list-none">
              {ch.headlines.map((h, i) => (
                <li key={i} className="flex gap-[14px] whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: 21, lineHeight: 1.75 }}>
                  <span className="flex-shrink-0 font-bold" style={{ color: 'var(--mw-violet)', width: 24 }}>{i + 1}</span>
                  <span className="overflow-hidden text-ellipsis">{h}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Question — closes the screen */}
          <div className="mt-auto flex gap-[16px] items-start font-semibold" style={{ fontSize: 24, lineHeight: 1.45 }}>
            <span style={{ color: 'var(--mw-rose)', fontSize: 28, lineHeight: 1.2 }}>❓</span>
            <span>{ch.question}</span>
          </div>
        </div>
      )}
    </div>
  );
}
