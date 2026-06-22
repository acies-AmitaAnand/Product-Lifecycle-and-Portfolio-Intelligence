import React, { useRef } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { Info, ChevronUp, Scissors, ArrowRight } from 'lucide-react';
import { EnrichedSKU, ClassFilter } from '../types';
import { COMPLEXITY_CONFIG, CAT_COLORS } from '../utils';

interface IppvLeagueTableProps {
  radarData: any[];
  filteredSkus: EnrichedSKU[];
  skus: EnrichedSKU[];
  classFilter: ClassFilter;
  setClassFilter: (filter: ClassFilter) => void;
  ippvSort: 'ippv' | 'cx' | 'complexity' | 'cost';
  setIppvSort: (sort: 'ippv' | 'cx' | 'complexity' | 'cost') => void;
  selectedSku: EnrichedSKU | null;
  handleSkuClick: (sku: EnrichedSKU | null) => void;
  handleNavigate: (tab: number, extraParams?: string) => void;
  setSelectedCategory: (cat: string | null) => void;
  isDarkMode: boolean;
  goodCount: number;
  badCount: number;
  neutralCount: number;
}

export const IppvLeagueTable: React.FC<IppvLeagueTableProps> = ({
  radarData,
  filteredSkus,
  skus,
  classFilter,
  setClassFilter,
  ippvSort,
  setIppvSort,
  selectedSku,
  handleSkuClick,
  handleNavigate,
  setSelectedCategory,
  isDarkMode,
  goodCount,
  badCount,
  neutralCount,
}) => {
  const focusRef = useRef<HTMLDivElement>(null);

  const tick = isDarkMode ? '#a1a1aa' : '#52525b';
  const grid = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const ttBg = isDarkMode ? '#1a1a24' : '#fff';
  const ttBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <div>
      <div className="flex items-center gap-2 border-l-4 border-sky-500 pl-3 mb-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
          ② IPPV Portfolio Ranking
        </h3>
        <div className="ml-auto flex items-center gap-1 text-[7px] text-zinc-500 dark:text-zinc-400">
          <Info size={9} />
          <span className="font-bold uppercase tracking-wider">IPPV = ROS × Household Penetration × Unit Profit Pool</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-zinc-800 dark:text-white">
        {/* Radar Chart Card */}
        <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm flex flex-col">
          <div className="mb-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-acies-gray dark:text-white">Flywheel Radar</h4>
            <p className="text-[8px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mt-0.5">5-Pillar Balance · Click a pillar above to drill in</p>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke={grid} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: tick, fontSize: 6.5, fontWeight: 'bold' }} />
                <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: '#6366f1' }} />
                <Tooltip contentStyle={{ backgroundColor: ttBg, borderColor: ttBorder, fontSize: '9px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {/* Classification summary buttons */}
          <div className="border-t border-black/5 dark:border-white/5 pt-3 grid grid-cols-3 gap-2">
            {([
              { type: 'Good Variety' as ClassFilter, count: goodCount, color: '#10b981' },
              { type: 'Bad Complexity' as ClassFilter, count: badCount, color: '#ef4444' },
              { type: 'Neutral' as ClassFilter, count: neutralCount, color: '#6b7280' },
            ] as const).map(c => (
              <button key={c.type} onClick={() => setClassFilter(classFilter === c.type ? 'All' : c.type)}
                className={`text-center rounded-lg p-2 transition-all border cursor-pointer outline-none bg-transparent ${classFilter === c.type ? 'ring-1' : 'border-transparent hover:border-black/10 dark:hover:border-white/10'}`}
                style={{
                  borderColor: classFilter === c.type ? c.color : undefined,
                  boxShadow: classFilter === c.type ? `0 0 0 1px ${c.color}40` : undefined,
                  backgroundColor: classFilter === c.type ? `${c.color}10` : undefined
                }}>
                <div className="text-lg font-black" style={{ color: c.color }}>{c.count}</div>
                <div className="text-[6.5px] font-black uppercase tracking-wider" style={{ color: c.color }}>{c.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* IPPV League Table Card */}
        <div className="lg:col-span-2 glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-acies-gray dark:text-white">SKU IPPV League Table</h4>
              <p className="text-[8px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                {filteredSkus.length} of {skus.length} SKUs · Click any row to open drill-down
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {/* Quick classification filter chips */}
              {(['All', 'Good Variety', 'Bad Complexity', 'Neutral'] as ClassFilter[]).map(f => (
                <button key={f} onClick={() => setClassFilter(f)}
                  className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider border transition-all cursor-pointer outline-none ${
                    classFilter === f ? 'text-white' : 'border-black/10 dark:border-white/10 text-zinc-500 hover:border-current bg-transparent'
                  }`}
                  style={classFilter === f ? {
                    backgroundColor: f === 'Good Variety' ? '#10b981' : f === 'Bad Complexity' ? '#ef4444' : f === 'Neutral' ? '#6b7280' : '#6366f1',
                    borderColor: 'transparent'
                  } : {}}>
                  {f}
                </button>
              ))}

              <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Sort:</span>
                <select value={ippvSort} onChange={e => setIppvSort(e.target.value as any)}
                  className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md focus:outline-none cursor-pointer">
                  <option value="ippv">↓ IPPV Score</option>
                  <option value="cx">↓ Complexity</option>
                  <option value="cost">↓ Hidden Cost</option>
                  <option value="complexity">Classification</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-auto max-h-80" ref={focusRef}>
            <table className="w-full text-left border-collapse text-[9px]">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-wider text-[7px] sticky top-0 bg-white dark:bg-[#1a1a24] z-10">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">SKU</th>
                  <th className="py-2 px-2">Category</th>
                  <th className="py-2 px-2 text-right">IPPV</th>
                  <th className="py-2 px-2 text-right">Penetration</th>
                  <th className="py-2 px-2 text-right">Hidden Cost</th>
                  <th className="py-2 px-2 text-center">Classification</th>
                  <th className="py-2 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSkus.map((sku, i) => {
                  const cfg = COMPLEXITY_CONFIG[sku.complexityType];
                  const isSelected = selectedSku?.name === sku.name;
                  return (
                    <React.Fragment key={sku.name}>
                      <tr
                        onClick={() => handleSkuClick(sku)}
                        className={`cursor-pointer transition-all border-b border-black/[0.04] dark:border-white/[0.04] ${isSelected ? 'bg-black/[0.03] dark:bg-white/[0.03]' : 'hover:bg-black/[0.015] dark:hover:bg-white/[0.015]'}`}
                        style={isSelected ? { boxShadow: `inset 2px 0 0 ${cfg.color}` } : {}}>
                        <td className="py-2 px-2 font-mono text-zinc-500 dark:text-zinc-400 font-bold text-[8px]">{i + 1}</td>
                        <td className="py-2 px-2">
                          <div className="font-black text-[9px] text-acies-gray dark:text-zinc-100 flex items-center gap-1.5">
                            {sku.name}
                            {isSelected && <ChevronUp size={9} className="text-zinc-400" />}
                          </div>
                          <div className="h-1 w-20 bg-black/5 dark:bg-white/5 rounded-full mt-1 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${sku.ippv}%`, backgroundColor: cfg.color }} />
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          <button onClick={e => { e.stopPropagation(); setSelectedCategory(sku.cat); }}
                            className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest transition-all hover:opacity-70 cursor-pointer border-none"
                            style={{ backgroundColor: `${CAT_COLORS[sku.cat]}20`, color: CAT_COLORS[sku.cat] }}>
                            {sku.cat}
                          </button>
                        </td>
                        <td className="py-2 px-2 text-right font-black text-[10px]" style={{ color: cfg.color }}>{sku.ippv.toFixed(1)}</td>
                        <td className="py-2 px-2 text-right font-bold text-zinc-500 dark:text-zinc-400">{(sku.householdPenetration * 100).toFixed(0)}%</td>
                        <td className="py-2 px-2 text-right font-bold text-amber-500">₹{sku.totalHiddenCost}L</td>
                        <td className="py-2 px-2 text-center">
                          <span className="text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-widest"
                            style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button onClick={e => { e.stopPropagation(); handleNavigate(4, `view=simulator&simTab=remove&sku=${encodeURIComponent(sku.name)}`); }}
                            className="text-[7px] font-black text-indigo-500 hover:text-indigo-400 transition-colors flex items-center gap-0.5 mx-auto cursor-pointer border-none bg-transparent"
                            title="Open in SKU Rationalization">
                            <Scissors size={9} /> <ArrowRight size={8} />
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
                {filteredSkus.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-[9px]">
                      No SKUs match the current classification filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
