import React from 'react';
import logo from '@/assets/logo.png';
import { coverGradient } from '@/joy/lib/typeStyles';
import { SPONSOR_LOCKUP } from '@/joy/config';

// Generated cover for opportunities without an uploaded image: a type-tinted
// gradient with the opportunity name set large, over the Novola × Fisayo.org
// partnership strip — so every card looks branded and intentional, never
// broken. Uploading a real image in Pages CMS replaces this automatically.
const BrandCover = ({ opp }) => {
  const primaryType = (opp.types && opp.types[0]) || 'Opportunity';

  return (
    <div
      className="relative h-full w-full flex flex-col"
      style={{ background: coverGradient(primaryType) }}
      role="img"
      aria-label={`${opp.title} — ${primaryType}`}
    >
      {/* soft texture rings */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(circle at 82% 15%, rgba(255,255,255,0.55) 0, transparent 32%), radial-gradient(circle at 12% 85%, rgba(255,255,255,0.35) 0, transparent 42%)',
        }}
      />
      <div className="relative flex-1 flex flex-col justify-center px-6 py-4 min-h-0">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/80 mb-1.5">
          {primaryType}
        </span>
        <span
          className="font-bold text-white leading-snug line-clamp-3 text-lg"
          style={{ fontFamily: 'Outfit, sans-serif', textWrap: 'balance' }}
        >
          {opp.title}
        </span>
      </div>
      {/* partnership strip — the Novola × Fisayo.org lockup from the Notion cards */}
      <div className="relative mx-4 mb-3 rounded-full bg-white/95 backdrop-blur-sm px-4 py-1.5 flex items-center justify-center gap-2 shadow-sm">
        <span className="text-[0.7rem] font-semibold text-slate-700 whitespace-nowrap">
          {SPONSOR_LOCKUP[0]}
        </span>
        <span className="text-[0.7rem] text-slate-400">×</span>
        <img src={logo} alt={SPONSOR_LOCKUP[1]} className="h-4 w-auto" />
      </div>
    </div>
  );
};

export default BrandCover;
