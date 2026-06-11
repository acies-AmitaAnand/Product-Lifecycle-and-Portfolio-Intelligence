import React from 'react';
import { Info } from 'lucide-react';
import { PillarDef } from '../types';

interface FlywheelHeroProps {
  pillars: PillarDef[];
  overallScore: number;
  scoreColor: string;
  scoreRingColor: string;
}

export const FlywheelHero: React.FC<FlywheelHeroProps> = ({ pillars, overallScore, scoreColor, scoreRingColor }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-emerald-600/10 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-emerald-900/20 p-6 text-zinc-800 dark:text-white">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              BAIN &amp; COMPANY FRAMEWORK
            </span>
          </div>
          <h2 className="text-xl font-black text-acies-gray dark:text-white leading-tight">
            Simplify to Grow — Strategic Flywheel
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg">
            Re-investing to grow vs. merely cutting SKUs. Up to 5% sales uplift through consumer-led portfolio simplification.
          </p>
          
          {/* Score Justification / Methodology explanation panel */}
          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-[9px] text-zinc-350 space-y-3 max-w-2xl animate-fadeIn">
            <div className="font-extrabold uppercase tracking-widest text-[#f59e0b] flex items-center gap-1.5">
              <Info size={12} className="stroke-[2.5]" /> Flywheel Score Justification & Live Computation
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/25 p-3 rounded-lg border border-white/5">
              <div>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Formula & Average Calculation:</span>
                <div className="text-zinc-300 mt-1 font-mono text-[9.5px]">
                  (Consumer + Retailer + Value Chain + E2E + Momentum) / 5
                  <div className="mt-0.5 text-zinc-400">
                    = ({pillars[0].score} + {pillars[1].score} + {pillars[2].score} + {pillars[3].score} + {pillars[4].score}) / 5 = <span className="text-emerald-450 dark:text-emerald-400 font-extrabold">{overallScore}</span>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <div className="text-[14px] font-black text-emerald-400">{overallScore}/100</div>
                <div className="text-[7px] text-zinc-450 uppercase font-black tracking-widest">Balanced Health Index</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-1 text-[8.5px]">
              {pillars.map((p, idx) => {
                const P_Icon = p.icon;
                return (
                  <div key={p.pillar} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-1.5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded bg-white/5 shrink-0">
                        <P_Icon size={10} style={{ color: p.color }} />
                      </div>
                      <span className="text-[7.5px] font-black uppercase tracking-wider truncate text-zinc-300" title={p.pillar}>
                        Pillar {idx + 1}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">{p.score}/100</div>
                      <div className="text-[7px] text-zinc-400 font-bold uppercase truncate" title={p.pillar}>{p.pillar}</div>
                    </div>
                    <div className="text-[7px] text-zinc-400 font-medium leading-tight pt-1.5 border-t border-white/5">
                      Metric: <span className="font-extrabold text-white">{p.kpiValue}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center">
            <div className={`text-4xl font-black ${scoreColor}`}>{overallScore}</div>
            <div className="text-[8px] uppercase tracking-widest text-zinc-450 font-bold mt-0.5">Flywheel Score</div>
            <div className="text-[7px] text-zinc-400 font-bold">/100 — {overallScore >= 70 ? 'Strong' : overallScore >= 50 ? 'Developing' : 'Needs Action'}</div>
          </div>
        </div>
      </div>
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border-4 opacity-10" style={{ borderColor: scoreRingColor }} />
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full border-2 opacity-10" style={{ borderColor: scoreRingColor }} />
    </div>
  );
};
