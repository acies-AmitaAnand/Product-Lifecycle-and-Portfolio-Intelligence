/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ResponsiveContainer, Bar, ComposedChart, Line, Cell, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area
} from 'recharts';
import { AlertTriangle, RefreshCw, Cpu, BarChart2, Sparkles, TrendingUp, TrendingDown, Info, BadgePercent, Sliders } from 'lucide-react';
import { srClassify, SR_CLASSES } from './SKURationalization';

interface PLSimulatorSectionProps {
  simTab: 'remove' | 'price' | 'launch';
  setSimTab: (tab: 'remove' | 'price' | 'launch') => void;
  selectedSkuName: string;
  setSelectedSkuName: (name: string) => void;
  skusByCategory: Record<string, any[]>;
  setSelectedSkuDetails: (sku: any) => void;
  priceChange: number;
  setPriceChange: (val: number) => void;
  volumeElasticity: number;
  setVolumeElasticity: (val: number) => void;
  projectedRevenue: number;
  setProjectedRevenue: (val: number) => void;
  expectedMargin: number;
  setExpectedMargin: (val: number) => void;
  cannibalizationRisk: number;
  setCannibalizationRisk: (val: number) => void;
  handleRunSim: () => void;
  isSimulating: boolean;
  btnText: string;
  selectedSku: any;
  removeRevImpact: number;
  removeMarginImpact: number;
  removeCustImpact: string;
  removeScImpact: string;
  volChange: number;
  newRev: number;
  revDelta: number;
  newMargin: number;
  cannRiskLabel: string;
  netLaunchRev: number;
  paretoData: any[];
  totalRev: number;
  selectedAiClass: string | null;
  isDarkMode: boolean;
  gridStroke: string;
  tickColor: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
}

export const PLSimulatorSection: React.FC<PLSimulatorSectionProps> = ({
  simTab,
  setSimTab,
  selectedSkuName,
  setSelectedSkuName,
  skusByCategory,
  setSelectedSkuDetails,
  priceChange,
  setPriceChange,
  volumeElasticity,
  setVolumeElasticity,
  projectedRevenue,
  setProjectedRevenue,
  expectedMargin,
  setExpectedMargin,
  cannibalizationRisk,
  setCannibalizationRisk,
  handleRunSim,
  isSimulating,
  btnText,
  selectedSku,
  removeRevImpact,
  removeMarginImpact,
  removeCustImpact,
  removeScImpact,
  volChange,
  newRev,
  revDelta,
  newMargin,
  cannRiskLabel,
  netLaunchRev,
  paretoData,
  totalRev,
  selectedAiClass,
  isDarkMode,
  gridStroke,
  tickColor,
  tooltipBg,
  tooltipBorder,
  tooltipText
}) => {
  const cannHaircut = cannibalizationRisk === 2 ? 0.18 : cannibalizationRisk === 1 ? 0.09 : 0.02;

  // Pre-calculate Price Elasticity Curve coordinates
  const priceCurveData = React.useMemo(() => {
    if (!selectedSku) return [];
    const points = [];
    // Compute 8 points from -30% to +40% price change in steps of 10%
    for (let p = -30; p <= 40; p += 10) {
      const volC = (p * volumeElasticity) / 100;
      const projR = selectedSku.rev * (1 + p / 100) * (1 + volC);
      points.push({
        priceChange: `${p > 0 ? '+' : ''}${p}%`,
        revenue: parseFloat(projR.toFixed(1)),
        isCurrent: p === priceChange
      });
    }
    return points;
  }, [selectedSku, volumeElasticity, priceChange]);

  // Launch contribution factors
  const incrementalPct = Math.round((netLaunchRev / (projectedRevenue || 1)) * 100);
  const cannibalizedPct = 100 - incrementalPct;

  return (
    <>
      {/* ③ DYNAMIC P&L SIMULATOR COMMAND DESK */}
      <div className="space-y-3" id="simulation-desk-section" style={{ scrollMarginTop: '100px' }}>
        <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 overflow-hidden shadow-sm rounded-xl">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 py-3.5 px-5 bg-black/[0.01]">
            <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white flex items-center gap-1.5">
              <Sliders size={12} className="text-acies-yellow" />
              Active Scenarios Console
            </h4>
          </div>

          <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Simulator Inputs Column */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[8.5px] font-black uppercase tracking-widest opacity-45">Choose Scenario Target</label>
                <div className="flex bg-black/5 dark:bg-white/5 p-0.5 rounded border border-black/5 dark:border-white/10 w-full">
                  {[
                    { id: 'remove', label: 'Sunset SKU' },
                    { id: 'price', label: 'Price Elasticity' },
                    { id: 'launch', label: 'Product Launch' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSimTab(tab.id as any)}
                      className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all border-none cursor-pointer outline-none ${
                        simTab === tab.id
                          ? 'bg-[#5850ec] text-white shadow-sm font-extrabold'
                          : 'bg-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {simTab !== 'launch' && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[8.5px] font-black uppercase tracking-widest opacity-45">Target SKU Variant</label>
                    <button 
                      onClick={() => {
                        setSelectedSkuDetails(selectedSku);
                      }}
                      className="text-[8px] text-[#8b5cf6] dark:text-purple-300 font-bold uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent outline-none"
                    >
                      Inspect ℹ®
                    </button>
                  </div>
                  <select
                    value={selectedSkuName}
                    onChange={(e) => setSelectedSkuName(e.target.value)}
                    className="w-full bg-black/5 dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded-lg p-2.5 text-xs font-bold text-acies-gray dark:text-white outline-none focus:border-acies-yellow"
                  >
                    {(Object.entries(skusByCategory) as [string, any[]][]).map(([cat, list]) => (
                      <optgroup key={`optg-${cat}`} label={cat.toUpperCase()} className="font-extrabold text-[8px] tracking-wider text-zinc-400 dark:text-zinc-500 bg-white dark:bg-[#1a1a24] py-1">
                        {list.map(s => (
                          <option key={s.name} value={s.name} className="dark:bg-[#1a1a24] text-xs font-semibold text-zinc-800 dark:text-white">
                            {s.name} (₹{s.rev}Cr • Margin {s.margin}%)
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              )}

              {/* Dynamic Inputs depending on tabs */}
              <div className="space-y-4 pt-2 border-t border-black/5 dark:border-white/5">
                {simTab === 'remove' && (
                  <div className="p-3 bg-red-500/[0.03] border border-red-500/10 rounded-lg text-[10.5px] leading-relaxed text-zinc-650 dark:text-zinc-300 font-semibold space-y-1">
                    <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1">
                      <AlertTriangle size={10} /> Discontinuation Parameter
                    </span>
                    <p>
                      Discontinuing this product removes it from the active portfolio. The simulation models brand loyalty retention, safety stock freeing thresholds, and complexity relief margin benefits.
                    </p>
                  </div>
                )}

                {simTab === 'price' && (
                  <>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Adjust SKU retail price shift</span>
                        <span className="text-acies-gray dark:text-white font-extrabold">{priceChange > 0 ? '+' : ''}{priceChange}%</span>
                      </div>
                      <input 
                        type="range"
                        min="-30"
                        max="40"
                        step="1"
                        value={priceChange}
                        onChange={(e) => setPriceChange(parseInt(e.target.value))}
                        className="w-full accent-purple-550 cursor-pointer h-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 appearance-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Assumed Volume Elasticity Quotient</span>
                        <span className="text-acies-gray dark:text-white font-extrabold">{volumeElasticity.toFixed(1)}x</span>
                      </div>
                      <input 
                        type="range"
                        min="-3.0"
                        max="-0.5"
                        step="0.1"
                        value={volumeElasticity}
                        onChange={(e) => setVolumeElasticity(parseFloat(e.target.value))}
                        className="w-full accent-purple-550 cursor-pointer h-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 appearance-none"
                      />
                    </div>
                  </>
                )}

                {simTab === 'launch' && (
                  <>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Expected Launch gross revenue (Yr 1)</span>
                        <span className="text-acies-gray dark:text-white font-extrabold">₹{projectedRevenue} Cr</span>
                      </div>
                      <input 
                        type="range"
                        min="10"
                        max="200"
                        step="5"
                        value={projectedRevenue}
                        onChange={(e) => setProjectedRevenue(parseInt(e.target.value))}
                        className="w-full accent-purple-550 cursor-pointer h-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 appearance-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Expected product gross margin target</span>
                        <span className="text-acies-gray dark:text-white font-extrabold">{expectedMargin}%</span>
                      </div>
                      <input 
                        type="range"
                        min="10"
                        max="60"
                        step="1"
                        value={expectedMargin}
                        onChange={(e) => setExpectedMargin(parseInt(e.target.value))}
                        className="w-full accent-purple-550 cursor-pointer h-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 appearance-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Expected Product cannibalization drag</span>
                        <span className="text-acies-gray dark:text-white font-extrabold">{cannRiskLabel}</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="2"
                        step="1"
                        value={cannibalizationRisk}
                        onChange={(e) => setCannibalizationRisk(parseInt(e.target.value))}
                        className="w-full accent-purple-550 cursor-pointer h-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 appearance-none"
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleRunSim}
                disabled={isSimulating}
                className="w-full py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-[10px] font-black uppercase tracking-widest rounded-lg cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2 border-none outline-none"
              >
                <RefreshCw size={11} className={isSimulating ? 'animate-spin' : ''} />
                {btnText}
              </button>
            </div>

            {/* Simulator Outputs Column */}
            <div className="flex flex-col justify-between gap-4">
              <div className="p-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl flex-1 space-y-4">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <div className="flex items-center gap-1.5">
                    <BarChart2 size={12} className="text-acies-yellow" />
                    <h5 className="text-[10px] font-black uppercase tracking-widest opacity-45">Simulated P&L Delta Metrics</h5>
                  </div>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20 text-[7px] font-extrabold uppercase tracking-widest animate-pulse">
                    <span className="w-1 h-1 rounded-full bg-purple-500" />
                    Live Projection
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {simTab === 'remove' && (
                    <>
                      <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-455">Revenue Shift</div>
                        <div className="text-sm font-black text-red-500">₹{removeRevImpact} Cr</div>
                        <div className="text-[7.5px] font-semibold text-red-500">{(removeRevImpact / (totalRev || 1) * 100).toFixed(1)}% portfolio</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-red-500" style={{ width: `${Math.min(100, Math.abs((selectedSku.rev / (totalRev || 1)) * 100))}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-455">Margin Impact</div>
                        <div className={`text-sm font-black ${removeMarginImpact >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {removeMarginImpact > 0 ? '+' : ''}{removeMarginImpact} pp
                        </div>
                        <div className="text-[7.5px] font-semibold text-zinc-500">Portfolio gross shift</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className={`h-full ${removeMarginImpact >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, Math.abs(removeMarginImpact) * 20)}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-455">Loyalty Risk</div>
                        <div className={`text-sm font-black ${selectedSku.val > 0.6 ? 'text-red-500' : 'text-emerald-500'}`}>
                          {selectedSku.val > 0.6 ? 'Elevated' : 'Negligible'}
                        </div>
                        <div className="text-[7.5px] font-semibold text-zinc-500 truncate" title={removeCustImpact}>{removeCustImpact}</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className={`h-full ${selectedSku.val > 0.6 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${selectedSku.val * 100}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-455">Operations Released</div>
                        <div className="text-sm font-black text-blue-500">
                          {selectedSku.cx > 0.6 ? 'High' : 'Moderate'}
                        </div>
                        <div className="text-[7.5px] font-semibold text-zinc-500 truncate" title={removeScImpact}>{removeScImpact}</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-blue-500" style={{ width: `${selectedSku.cx * 100}%` }} />
                        </div>
                      </div>
                    </>
                  )}

                  {simTab === 'price' && (
                    <>
                      <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-455">Revenue Delta</div>
                        <div className={`text-sm font-black ${revDelta >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {revDelta > 0 ? '+' : ''}₹{revDelta} Cr
                        </div>
                        <div className="text-[7.5px] font-semibold text-zinc-500">New base: ₹{newRev} Cr</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className={`h-full ${revDelta >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, Math.abs(revDelta / (selectedSku.rev || 1) * 100))}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-455">New Item Margin</div>
                        <div className={`text-sm font-black ${newMargin > selectedSku.margin ? 'text-emerald-500' : 'text-red-500'}`}>
                          {newMargin}%
                        </div>
                        <div className="text-[7.5px] font-semibold text-zinc-500">Shift: {(newMargin - selectedSku.margin).toFixed(1)}pp</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className={`h-full ${newMargin > selectedSku.margin ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${newMargin}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-455">Volume displacement</div>
                        <div className={`text-sm font-black ${volChange >= 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {(volChange * 100).toFixed(1)}%
                        </div>
                        <div className="text-[7.5px] font-semibold text-zinc-500">Elasticity active</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className={`h-full ${volChange >= 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, Math.abs(volChange * 100))}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-455">Volume Elasticity</div>
                        <div className={`text-sm font-black ${Math.abs(priceChange) > 15 ? 'text-red-500' : 'text-emerald-500'}`}>
                          {volumeElasticity.toFixed(1)}x
                        </div>
                        <div className="text-[7.5px] font-semibold text-zinc-500">Customer reaction factor</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-purple-500" style={{ width: `${(Math.abs(volumeElasticity) / 3) * 100}%` }} />
                        </div>
                      </div>

                      {/* Interactive Price Optimization Curve */}
                      <div className="col-span-2 bg-white dark:bg-[#1a1a24] p-3.5 rounded-lg border border-black/5 dark:border-white/10 space-y-2.5 mt-1 shadow-sm">
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase text-zinc-500">
                          <span className="flex items-center gap-1"><Sparkles size={11} className="text-acies-yellow animate-pulse" /> Price Optimization Curve</span>
                          <span className="text-[#8b5cf6] font-black">Sweet Spot: {volumeElasticity >= -1.0 ? '+15%' : '0% price shift'}</span>
                        </div>
                        <div className="h-28 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={priceCurveData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                              <defs>
                                <linearGradient id="priceCurveGlow" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                              <XAxis dataKey="priceChange" tick={{ fontSize: 7, fill: tickColor }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 7, fill: tickColor }} axisLine={false} tickLine={false} />
                              <Tooltip
                                contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, fontSize: '8.5px' }}
                                formatter={(value) => [`₹${value} Cr`, 'Revenue']}
                              />
                              <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#priceCurveGlow)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-[7.5px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider text-center">
                          Simulated revenue output across pricing corridors from -30% to +40%
                        </p>
                      </div>
                    </>
                  )}

                  {simTab === 'launch' && (
                    <>
                      <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-455">Projected Sales</div>
                        <div className="text-sm font-black text-blue-500">₹{netLaunchRev} Cr</div>
                        <div className="text-[7.5px] font-semibold text-zinc-550">{`Minus ${Math.round(cannHaircut * 100)}% displacement`}</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, netLaunchRev / 2)}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-455">Expected Margin</div>
                        <div className="text-sm font-black text-emerald-500">{expectedMargin}%</div>
                        <div className="text-[7.5px] font-semibold text-zinc-500">Item margin projection</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-emerald-500" style={{ width: `${expectedMargin}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-455">Displacement impact</div>
                        <div className={`text-sm font-black ${cannibalizationRisk === 2 ? 'text-red-500' : cannibalizationRisk === 1 ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {cannRiskLabel}
                        </div>
                        <div className="text-[7.5px] font-semibold text-zinc-550 truncate" title={`Displaces ~₹${(projectedRevenue * cannHaircut).toFixed(1)} Cr`}>
                          {`Displaces ~₹${(projectedRevenue * cannHaircut).toFixed(1)} Cr`}
                        </div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className={`h-full ${cannibalizationRisk === 2 ? 'bg-red-500' : cannibalizationRisk === 1 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${cannHaircut * 500}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-455">Complexity Delta</div>
                        <div className="text-sm font-black text-amber-500">Moderate</div>
                        <div className="text-[7.5px] font-semibold text-zinc-500">Adds complexity +0.04</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-amber-500" style={{ width: '40%' }} />
                        </div>
                      </div>

                      {/* Stacked Revenue Contribution Bar for Launches */}
                      <div className="col-span-2 bg-white dark:bg-[#1a1a24] p-3.5 rounded-lg border border-black/5 dark:border-white/10 space-y-2 mt-1 shadow-sm">
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase text-zinc-500">
                          <span className="flex items-center gap-1"><BadgePercent size={11} className="text-acies-yellow" /> Launch Revenue Breakdown</span>
                          <span className="text-emerald-500 font-extrabold">{incrementalPct}% Incremental</span>
                        </div>
                        <div className="h-3.5 w-full bg-black/10 dark:bg-white/10 rounded overflow-hidden flex text-[8.5px] font-black text-white shadow-inner">
                          {incrementalPct > 0 && (
                            <div style={{ width: `${incrementalPct}%` }} className="bg-emerald-500 h-full flex items-center justify-center transition-all duration-300">
                              {incrementalPct >= 10 ? `${incrementalPct}%` : ''}
                            </div>
                          )}
                          {cannibalizedPct > 0 && (
                            <div style={{ width: `${cannibalizedPct}%` }} className="bg-red-500 h-full flex items-center justify-center transition-all duration-300">
                              {cannibalizedPct >= 10 ? `${cannibalizedPct}%` : ''}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between text-[8px] font-bold text-zinc-450 dark:text-zinc-500 uppercase mt-1">
                          <span className="flex items-center gap-1">🟢 Net Incremental: ₹{netLaunchRev.toFixed(1)} Cr</span>
                          <span className="flex items-center gap-1">🔴 Cannibalized Sibling: ₹{(projectedRevenue * cannHaircut).toFixed(1)} Cr</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Simulated AI Explanation Feed Banner */}
              <div className="p-3.5 bg-acies-yellow/[0.03] dark:bg-white/[0.01] border border-black/10 dark:border-white/10 rounded-xl text-[10.5px] leading-relaxed text-zinc-550 dark:text-zinc-450 font-semibold relative flex gap-2 items-start">
                <Cpu size={14} className="text-acies-yellow shrink-0 mt-0.5 animate-pulse" />
                <div>
                  {simTab === 'remove' && (
                    <span>
                      <strong>AI Reasoner Feedback:</strong> Discontinuing <strong>{selectedSku.name}</strong> eliminates {selectedSku.stockouts} annual stockouts and {(selectedSku.cx * 100).toFixed(0)}% complexity score from the catalog. {removeMarginImpact > 0 ? `Global portfolio margin improves by +${removeMarginImpact}pp.` : 'Be sure to monitor customer retention on substitute variants.'}
                    </span>
                  )}
                  {simTab === 'price' && (
                    <span>
                      <strong>AI Reasoner Feedback:</strong> A pricing shift of <strong>{priceChange > 0 ? '+' : ''}{priceChange}%</strong> on <strong>{selectedSku.name}</strong> with a volume elasticity coefficient of {volumeElasticity}x is predicted to {revDelta > 0 ? 'increase' : 'decrease'} revenue by ₹{Math.abs(revDelta)} Cr and {newMargin > selectedSku.margin ? 'lift' : 'reduce'} margins to {newMargin}%.
                    </span>
                  )}
                  {simTab === 'launch' && (
                    <span>
                      <strong>AI Reasoner Feedback:</strong> A new launch projected at ₹{projectedRevenue} Cr and {expectedMargin}% margin with a <strong>{cannRiskLabel}</strong> cannibalization rate is predicted to deliver ₹{netLaunchRev} Cr net portfolio revenue after cannibalization adjustments.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ④ PARETO - REVENUE CONCENTRATION WITH GHOST SIMULATION OVERLAY */}
      <div className="space-y-3" id="pareto-chart-section" style={{ scrollMarginTop: '100px' }}>
        <div className="flex items-center gap-2 border-l-4 border-[#8b5cf6] pl-3 py-0.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">
            ④ Revenue Concentration — Pareto View with Ghost Simulation Overlay
          </h3>
        </div>

        <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 shadow-sm rounded-xl space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Top SKUs Driving Portfolio Revenue</h4>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                {simTab === 'remove' 
                  ? `Sunsetting ${selectedSkuName} (Red bar) shows the simulated cumulative trajectory (Dashed line)`
                  : 'Solid cumulative line shows standard 80/20 distribution rule (Top 10% driving 27.8%)'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-[8.5px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <div className="w-3 h-1 bg-[#f59e0b]" />
                <span>As-Is Cumulative</span>
              </div>
              {simTab === 'remove' && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-1 border-t-2 border-dashed border-red-500" />
                  <span className="text-red-500 font-extrabold">Simulated Cumulative</span>
                </div>
              )}
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={paretoData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: tickColor }} />
                <YAxis yAxisId="left" tick={{ fontSize: 8, fill: tickColor }} label={{ value: 'Revenue (₹ Cr)', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 9 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 8, fill: tickColor }} label={{ value: 'Cumulative %', angle: 90, position: 'insideRight', fill: tickColor, fontSize: 9 }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, fontSize: '9px' }}
                  formatter={(value: any, name: any, props: any) => {
                    if (name === 'Revenue') return [`₹${value} Cr (${props.payload.aiClass})`, 'Revenue'];
                    if (name === 'cumPct') return [`${value}%`, 'Cumulative Revenue'];
                    if (name === 'simCumPct') return [`${value}%`, 'Simulated Cumulative'];
                    return [value, name];
                  }}
                />
                <Bar yAxisId="left" dataKey="rev" barSize={12} radius={[2, 2, 0, 0]}>
                  {paretoData.map((entry, index) => {
                    const opacity = entry.isDimmed ? 0.15 : 1;
                    let fill = entry.fill;
                    if (simTab === 'remove' && entry.fullName === selectedSkuName) {
                      fill = '#ef4444'; // Red sunset highlight
                    }
                    return (
                      <Cell key={`cell-${index}`} fill={fill} fillOpacity={opacity} />
                    );
                  })}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="cumPct" name="cumPct" stroke="#f59e0b" strokeWidth={2} dot={false} />
                {simTab === 'remove' && (
                  <Line yAxisId="right" type="monotone" dataKey="simCumPct" name="simCumPct" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};
