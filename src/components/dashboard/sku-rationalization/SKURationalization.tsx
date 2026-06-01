import React, { useState, useEffect } from 'react';
import { 
  Scissors, Link as LinkIcon, Check, AlertTriangle, AlertCircle, BarChart2, TrendingDown,
  Activity, Play, CheckCircle2, RefreshCw, Layers, Briefcase, Zap, HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, Cell, LabelList,
  BarChart, Bar, ComposedChart, Line
} from 'recharts';
import { SKUS } from '../../../constants/data';
import { Role } from '../../../types/dashboard';

// Types
interface CannibalizationPair {
  a: string;
  b: string;
  risk: number;
  cat: string;
  revAtRisk: number;
}

interface SKURationalizationProps {
  role: Role;
  isDarkMode: boolean;
}

// AI Classification Configuration
export const SR_CLASSES = {
  retain: {
    label: 'Retain',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.2)',
    icon: '✅',
    desc: 'High value, low complexity. Core portfolio.'
  },
  grow: {
    label: 'Grow',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.06)',
    border: 'rgba(59,130,246,0.2)',
    icon: '📈',
    desc: 'Strong margin & growth trajectory. Scale supply.'
  },
  bundle: {
    label: 'Bundle',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.06)',
    border: 'rgba(139,92,246,0.2)',
    icon: '📦',
    desc: 'Pair with hero SKUs to lift avg basket value.'
  },
  reposition: {
    label: 'Reposition',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.2)',
    icon: '🔄',
    desc: 'Moderate value but high cost. Needs pricing or channel change.'
  },
  sunset: {
    label: 'Sunset',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.06)',
    border: 'rgba(239,68,68,0.2)',
    icon: '🌅',
    desc: 'Low value + high complexity. Remove from portfolio.'
  }
};

// SKU Classification Logic
export function srClassify(s: any) {
  if (s.val >= 0.7 && s.cx <= 0.4) return 'retain';
  if (s.val >= 0.6 && s.growth >= 0.15) return 'grow';
  if (s.val < 0.5 && s.cx < 0.5 && s.margin >= 30) return 'bundle';
  if (s.val < 0.4 && s.cx >= 0.6) return 'sunset';
  return 'reposition';
}

// 🛡️ VP Product Management View: SKU Rationalisation Simulator
const VPSKURationalizationView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const accentColor = isDarkMode ? '#a78bfa' : '#6d28d9';
  const gridStroke = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tickColor = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const tooltipBg = isDarkMode ? '#1f1f1f' : '#fff';
  const tooltipBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipText = isDarkMode ? '#fff' : '#000';

  const [refreshTime, setRefreshTime] = useState('');
  useEffect(() => {
    setRefreshTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  // Simulator states
  const [simTab, setSimTab] = useState<'remove' | 'price' | 'launch'>('remove');
  const [selectedSkuName, setSelectedSkuName] = useState(SKUS[0].name);
  const [priceChange, setPriceChange] = useState(0);
  const [volumeElasticity, setVolumeElasticity] = useState(-1.2);
  const [projectedRevenue, setProjectedRevenue] = useState(40);
  const [expectedMargin, setExpectedMargin] = useState(35);
  const [cannibalizationRisk, setCannibalizationRisk] = useState(0); // 0: Low, 1: Medium, 2: High

  const [btnText, setBtnText] = useState('⚡ Run Simulation');
  const [isSimulating, setIsSimulating] = useState(false);

  // Group SKUs by AI classification
  const groups: Record<string, typeof SKUS> = {
    retain: [], grow: [], bundle: [], reposition: [], sunset: []
  };
  SKUS.forEach(s => {
    const c = srClassify(s);
    if (groups[c]) groups[c].push(s);
  });

  // SKU selected details
  const selectedSku = SKUS.find(s => s.name === selectedSkuName) || SKUS[0];
  const totalRev = SKUS.reduce((s, k) => s + k.rev, 0);

  // Calculate ranked sunset/reposition SKUs
  const rankedPriorities = [...SKUS]
    .filter(s => {
      const cls = srClassify(s);
      return cls === 'sunset' || cls === 'reposition';
    })
    .sort((a, b) => {
      const scoreA = a.cx + a.stockouts * 0.05 - a.val;
      const scoreB = b.cx + b.stockouts * 0.05 - b.val;
      return scoreB - scoreA;
    })
    .slice(0, 7);

  // Handle run simulation triggers
  const handleRunSim = () => {
    setIsSimulating(true);
    setBtnText('⏳ Running…');
    setTimeout(() => {
      setIsSimulating(false);
      setBtnText('✅ Simulation Complete');
      setTimeout(() => {
        setBtnText('⚡ Run Simulation');
      }, 2000);
    }, 400);
  };

  // 1. Remove SKU simulation outputs
  const removeRevImpact = -selectedSku.rev;
  const removeMarginImpact = parseFloat((selectedSku.margin < 28 ? 0.4 : selectedSku.margin > 40 ? -0.2 : 0).toFixed(1));
  const removeCustImpact = selectedSku.val > 0.6 ? 'High — loyal customers affected' : 'Low — substitutable';
  const removeScImpact = `Lead time saves ${selectedSku.lead}d · −${selectedSku.stockouts} stockout risk events`;
  
  // 2. Change Price simulation outputs
  const volChange = (priceChange * volumeElasticity) / 100;
  const newRev = parseFloat((selectedSku.rev * (1 + priceChange / 100) * (1 + volChange)).toFixed(1));
  const revDelta = parseFloat((newRev - selectedSku.rev).toFixed(1));
  const newMargin = parseFloat((selectedSku.margin + priceChange * 0.7).toFixed(1));

  // 3. New Launch simulation outputs
  const cannRiskLabel = ['Low', 'Medium', 'High'][cannibalizationRisk];
  const cannHaircut = cannibalizationRisk === 2 ? 0.18 : cannibalizationRisk === 1 ? 0.09 : 0.02;
  const netLaunchRev = parseFloat((projectedRevenue * (1 - cannHaircut)).toFixed(1));

  // Composed Pareto dataset
  const paretoSorted = [...SKUS].sort((a, b) => b.rev - a.rev);
  let cumSum = 0;
  const paretoData = paretoSorted.map(s => {
    cumSum += s.rev;
    const cls = srClassify(s);
    let color = 'rgba(16,185,129,0.7)';
    if (cls === 'grow') color = 'rgba(59,130,246,0.7)';
    else if (cls === 'bundle') color = 'rgba(139,92,246,0.7)';
    else if (cls === 'reposition') color = 'rgba(245,158,11,0.7)';
    else if (cls === 'sunset') color = 'rgba(239,68,68,0.7)';

    return {
      name: s.name.split(' ')[0],
      fullName: s.name,
      rev: s.rev,
      cumPct: parseFloat(((cumSum / totalRev) * 100).toFixed(1)),
      fill: color,
      aiClass: SR_CLASSES[cls].label
    };
  });

  // Scatter chart data
  const matrixScatterData = SKUS.map(s => {
    const cls = srClassify(s);
    let fill = '#10b981';
    if (cls === 'grow') fill = '#3b82f6';
    else if (cls === 'bundle') fill = '#8b5cf6';
    else if (cls === 'reposition') fill = '#f59e0b';
    else if (cls === 'sunset') fill = '#ef4444';

    return {
      name: s.name,
      x: s.cx,
      y: s.val,
      rev: s.rev,
      margin: s.margin,
      aiClass: SR_CLASSES[cls].label,
      fill,
      z: s.rev
    };
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 🚀 VP Custom Shell Header */}
      <div className="glass-card bg-acies-gray text-white py-5 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
          <Scissors size={100} />
        </div>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h2 className="text-xl font-display font-medium text-white">SKU Rationalization Command Simulator</h2>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-widest rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                AI Active
              </span>
              <span className="text-[10px] opacity-40 font-bold tracking-widest">Refreshed {refreshTime}</span>
            </div>
          </div>
          <p className="text-xs text-zinc-300 font-medium max-w-xl leading-relaxed">
            Diagnose complexity bottlenecks, forecast substitution metrics, model pricing elasticity, and evaluate dynamic gross margin displacement at a global level.
          </p>
        </div>
      </div>

      {/* ① AI PRODUCT RECOMMENDATIONS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-l-4 border-[#8b5cf6] pl-3 py-0.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">① AI Product Recommendations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(SR_CLASSES).map(([key, cfg]) => {
            const list = groups[key] || [];
            return (
              <div 
                key={key} 
                className="glass-card bg-white dark:bg-[#1a1a24]/90 border p-4 transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between"
                style={{ borderColor: cfg.border }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg shrink-0">{cfg.icon}</span>
                    <div>
                      <h4 className="text-[11px] font-bold" style={{ color: cfg.color }}>{cfg.label}</h4>
                      <p className="text-[8px] text-zinc-450 dark:text-zinc-500 leading-tight font-medium" style={{ contentVisibility: 'auto' }}>{cfg.desc}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-black mb-3" style={{ color: cfg.color }}>
                    {list.length} <span className="text-xs font-bold opacity-50">SKUs</span>
                  </div>
                </div>
                
                <div className="border-t border-black/5 dark:border-white/5 pt-2 text-[9px] font-medium text-zinc-450 dark:text-zinc-400 tracking-wide leading-relaxed">
                  {list.slice(0, 3).map(s => s.name.split(' ').slice(0, 2).join(' ')).join(' · ')}
                  {list.length > 3 && <span className="opacity-50 font-semibold">{` +${list.length - 3} more`}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ② VALUE vs COMPLEXITY MATRIX + PRIORITY LIST */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-l-4 border-[#8b5cf6] pl-3 py-0.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">② Value vs Complexity Matrix — Portfolio Overview</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Scatter map */}
          <div className="lg:col-span-2 glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Value vs Complexity Scatter</h4>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Bottom-right = sunset candidates · Bubble size = revenue</p>
              </div>
              <div className="flex flex-wrap gap-2 text-[8px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Retain / Grow</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Bundle</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Reposition</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Sunset</span>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Complexity" 
                    domain={[0, 1]} 
                    tick={{ fill: tickColor, fontSize: 8 }} 
                    label={{ value: 'Complexity Score →', position: 'bottom', fill: tickColor, fontSize: 9, offset: -5 }} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Value" 
                    domain={[0, 1]} 
                    tick={{ fill: tickColor, fontSize: 8 }} 
                    label={{ value: 'Commercial Value →', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 9 }} 
                  />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                    itemStyle={{ fontSize: 10 }}
                    formatter={(value: any, name: any) => {
                      if (name === 'Complexity') return [value.toFixed(2), 'Complexity'];
                      if (name === 'Value') return [value.toFixed(2), 'Commercial Value'];
                      return [value, name];
                    }}
                  />
                  <Scatter name="SKUs" data={matrixScatterData}>
                    {matrixScatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList dataKey="name" position="right" style={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)', fontSize: 7, pointerEvents: 'none', fontWeight: 600 }} />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority List */}
          <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 p-5 shadow-sm">
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Sunset & Reposition Priority</h4>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Ranked by AI complexity vs value score</p>
            </div>

            <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04] max-h-64 overflow-y-auto pr-1">
              {rankedPriorities.map((sku, i) => {
                const cls = srClassify(sku);
                const cfg = SR_CLASSES[cls];
                return (
                  <div key={sku.name} className="flex items-center gap-3 py-2 text-[11px] font-semibold hover:bg-black/[0.005]">
                    <div className="w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-acies-gray dark:text-white truncate font-bold text-[10.5px]">{sku.name}</div>
                      <div className="text-[8px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        Cx {sku.cx.toFixed(2)} · Val {sku.val.toFixed(2)} · ₹{sku.rev}Cr · {sku.stockouts} stockouts
                      </div>
                    </div>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm shrink-0 uppercase tracking-widest" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ③ SIMULATION ENGINE */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-l-4 border-[#8b5cf6] pl-3 py-0.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">③ Simulation Engine — Test Scenarios</h3>
        </div>

        <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 py-3 px-5 bg-black/[0.01]">
            <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Simulator Desk</h4>
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Select a tab and adjust sliders to simulate instant P&L outcomes</span>
          </div>

          <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs Column */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[8.5px] font-black uppercase tracking-widest opacity-45">Select scenario type</label>
                <div className="flex gap-2">
                  {(['remove', 'price', 'launch'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSimTab(tab)}
                      className={`flex-1 px-3 py-2 border text-[10px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                        simTab === tab
                          ? 'border-[#8b5cf6] bg-[#8b5cf6]/10 text-[#8b5cf6] dark:text-purple-300 font-black shadow-sm'
                          : 'border-black/5 dark:border-white/10 hover:bg-black/5 hover:dark:bg-white/5 text-zinc-500'
                      }`}
                    >
                      {tab === 'remove' ? 'Sunset SKU' : tab === 'price' ? 'Adjust Price' : 'Hypothetical Launch'}
                    </button>
                  ))}
                </div>
              </div>

              {simTab !== 'launch' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8.5px] font-black uppercase tracking-widest opacity-45">Select target product</label>
                  <select
                    value={selectedSkuName}
                    onChange={(e) => setSelectedSkuName(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2.5 text-xs font-bold text-acies-gray dark:text-white outline-none"
                  >
                    {SKUS.map(s => (
                      <option key={s.name} value={s.name} className="dark:bg-[#1a1a24] text-xs font-semibold">{s.name} (₹{s.rev}Cr)</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Slider Renderers */}
              <div className="space-y-4 pt-2 border-t border-black/5 dark:border-white/5">
                {simTab === 'remove' && (
                  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                    The rationalization engine will simulate gross margins, direct operations cost release, inventory safety coefficients, and regional brand substitution ratios for removing <strong>{selectedSku.name}</strong>.
                  </div>
                )}

                {simTab === 'price' && (
                  <>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Price shift percentage</span>
                        <span className="text-acies-gray dark:text-white font-extrabold">{priceChange > 0 ? '+' : ''}{priceChange}%</span>
                      </div>
                      <input 
                        type="range"
                        min="-30"
                        max="40"
                        step="1"
                        value={priceChange}
                        onChange={(e) => setPriceChange(parseInt(e.target.value))}
                        className="w-full accent-[#8b5cf6] cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Volume elasticity quotient</span>
                        <span className="text-acies-gray dark:text-white font-extrabold">{volumeElasticity.toFixed(1)}x</span>
                      </div>
                      <input 
                        type="range"
                        min="-3.0"
                        max="-0.5"
                        step="0.1"
                        value={volumeElasticity}
                        onChange={(e) => setVolumeElasticity(parseFloat(e.target.value))}
                        className="w-full accent-[#8b5cf6] cursor-pointer"
                      />
                    </div>
                  </>
                )}

                {simTab === 'launch' && (
                  <>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Expected Year 1 gross revenue</span>
                        <span className="text-acies-gray dark:text-white font-extrabold">₹{projectedRevenue} Cr</span>
                      </div>
                      <input 
                        type="range"
                        min="10"
                        max="200"
                        step="5"
                        value={projectedRevenue}
                        onChange={(e) => setProjectedRevenue(parseInt(e.target.value))}
                        className="w-full accent-[#8b5cf6] cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Expected gross margin percentage</span>
                        <span className="text-acies-gray dark:text-white font-extrabold">{expectedMargin}%</span>
                      </div>
                      <input 
                        type="range"
                        min="10"
                        max="60"
                        step="1"
                        value={expectedMargin}
                        onChange={(e) => setExpectedMargin(parseInt(e.target.value))}
                        className="w-full accent-[#8b5cf6] cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Cannibalization displacement threat</span>
                        <span className="text-acies-gray dark:text-white font-extrabold">{cannRiskLabel}</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="2"
                        step="1"
                        value={cannibalizationRisk}
                        onChange={(e) => setCannibalizationRisk(parseInt(e.target.value))}
                        className="w-full accent-[#8b5cf6] cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleRunSim}
                disabled={isSimulating}
                className="w-full py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-[10px] font-black uppercase tracking-widest rounded-lg cursor-pointer transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] border-none"
              >
                {btnText}
              </button>
            </div>

            {/* Results Column */}
            <div className="flex flex-col justify-between gap-4">
              <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 flex-1 space-y-4">
                <div className="flex items-center gap-1.5 border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="text-xs">📊</span>
                  <h5 className="text-[10px] font-black uppercase tracking-widest opacity-45">Predicted Portfolio Impact</h5>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {simTab === 'remove' && (
                    <>
                      <div className="bg-white dark:bg-[#1a1a24]/90 p-3 rounded-lg border border-black/5 dark:border-white/10 space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Revenue Impact</div>
                        <div className="text-lg font-black text-red-500">₹{removeRevImpact} Cr</div>
                        <div className="text-[8px] font-semibold text-red-500">{(removeRevImpact/totalRev*100).toFixed(1)}% of portfolio</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-red-500" style={{ width: `${Math.min(100, Math.abs(selectedSku.rev/totalRev*100))}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24]/90 p-3 rounded-lg border border-black/5 dark:border-white/10 space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Margin Shift</div>
                        <div className={`text-lg font-black ${removeMarginImpact >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {removeMarginImpact > 0 ? '+' : ''}{removeMarginImpact} pp
                        </div>
                        <div className="text-[8px] font-semibold text-zinc-450 dark:text-zinc-500">Portfolio gross margin shift</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                          <div className={`h-full ${removeMarginImpact >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.abs(removeMarginImpact) * 20}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24]/90 p-3 rounded-lg border border-black/5 dark:border-white/10 space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Customer Impact</div>
                        <div className={`text-lg font-black ${selectedSku.val > 0.6 ? 'text-red-500' : 'text-emerald-500'}`}>
                          {selectedSku.val > 0.6 ? 'High' : 'Low'}
                        </div>
                        <div className="text-[8px] font-semibold text-zinc-450 dark:text-zinc-500 truncate" title={removeCustImpact}>{removeCustImpact}</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                          <div className={`h-full ${selectedSku.val > 0.6 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${selectedSku.val * 100}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24]/90 p-3 rounded-lg border border-black/5 dark:border-white/10 space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Operations Saved</div>
                        <div className="text-lg font-black text-blue-500">
                          {selectedSku.cx > 0.6 ? 'High' : 'Moderate'}
                        </div>
                        <div className="text-[8px] font-semibold text-zinc-450 dark:text-zinc-500 truncate" title={removeScImpact}>{removeScImpact}</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-blue-500" style={{ width: `${selectedSku.cx * 100}%` }} />
                        </div>
                      </div>
                    </>
                  )}

                  {simTab === 'price' && (
                    <>
                      <div className="bg-white dark:bg-[#1a1a24]/90 p-3 rounded-lg border border-black/5 dark:border-white/10 space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Revenue Change</div>
                        <div className={`text-lg font-black ${revDelta >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {revDelta > 0 ? '+' : ''}₹{revDelta} Cr
                        </div>
                        <div className="text-[8px] font-semibold text-zinc-450 dark:text-zinc-500">New total: ₹{newRev} Cr</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                          <div className={`h-full ${revDelta >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, Math.abs(revDelta / selectedSku.rev * 100))}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24]/90 p-3 rounded-lg border border-black/5 dark:border-white/10 space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">New SKU Margin</div>
                        <div className={`text-lg font-black ${newMargin > selectedSku.margin ? 'text-emerald-500' : 'text-red-500'}`}>
                          {newMargin}%
                        </div>
                        <div className="text-[8px] font-semibold text-zinc-450 dark:text-zinc-500">{priceChange > 0 ? '+' : ''}{(newMargin - selectedSku.margin).toFixed(1)}pp vs prior</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                          <div className={`h-full ${newMargin > selectedSku.margin ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${newMargin}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24]/90 p-3 rounded-lg border border-black/5 dark:border-white/10 space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Volume Impact</div>
                        <div className={`text-lg font-black ${volChange >= 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {(volChange * 100).toFixed(1)}%
                        </div>
                        <div className="text-[8px] font-semibold text-zinc-450 dark:text-zinc-500">Elasticity {volumeElasticity.toFixed(1)}x active</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                          <div className={`h-full ${volChange >= 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, Math.abs(volChange * 100))}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24]/90 p-3 rounded-lg border border-black/5 dark:border-white/10 space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Customer Risk</div>
                        <div className={`text-lg font-black ${Math.abs(priceChange) > 15 ? 'text-red-500' : Math.abs(priceChange) > 5 ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {Math.abs(priceChange) > 15 ? 'High' : Math.abs(priceChange) > 5 ? 'Medium' : 'Low'}
                        </div>
                        <div className="text-[8px] font-semibold text-zinc-450 dark:text-zinc-500">Sensitivity assessment</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                          <div className={`h-full ${Math.abs(priceChange) > 15 ? 'bg-red-500' : Math.abs(priceChange) > 5 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, Math.abs(priceChange) * 2.5)}%` }} />
                        </div>
                      </div>
                    </>
                  )}

                  {simTab === 'launch' && (
                    <>
                      <div className="bg-white dark:bg-[#1a1a24]/90 p-3 rounded-lg border border-black/5 dark:border-white/10 space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Projected Revenue</div>
                        <div className="text-lg font-black text-blue-500">₹{netLaunchRev} Cr</div>
                        <div className="text-[8px] font-semibold text-zinc-450 dark:text-zinc-500">{`After ${Math.round(cannHaircut * 100)}% haircut`}</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, netLaunchRev / 2)}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24]/90 p-3 rounded-lg border border-black/5 dark:border-white/10 space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Expected Margin</div>
                        <div className="text-lg font-black text-emerald-500">{expectedMargin}%</div>
                        <div className="text-[8px] font-semibold text-zinc-450 dark:text-zinc-500">Launch gross margin target</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-emerald-500" style={{ width: `${expectedMargin}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24]/90 p-3 rounded-lg border border-black/5 dark:border-white/10 space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Cannibalization Risk</div>
                        <div className={`text-lg font-black ${cannibalizationRisk === 2 ? 'text-red-500' : cannibalizationRisk === 1 ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {cannRiskLabel}
                        </div>
                        <div className="text-[8px] font-semibold text-zinc-450 dark:text-zinc-500 truncate" title={`~₹${(projectedRevenue * cannHaircut).toFixed(1)} Cr rev shift`}>{`~₹${(projectedRevenue * cannHaircut).toFixed(1)} Cr displaced`}</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                          <div className={`h-full ${cannibalizationRisk === 2 ? 'bg-red-500' : cannibalizationRisk === 1 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${cannHaircut * 500}%` }} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#1a1a24]/90 p-3 rounded-lg border border-black/5 dark:border-white/10 space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Supply Complexity</div>
                        <div className="text-lg font-black text-amber-500">Moderate</div>
                        <div className="text-[8px] font-semibold text-zinc-450 dark:text-zinc-500">Adds complexity index +0.04</div>
                        <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-amber-500" style={{ width: '40%' }} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Explanatory text banner */}
              <div className="p-3.5 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl text-[10.5px] leading-relaxed text-zinc-500 font-semibold">
                {simTab === 'remove' && (
                  <span>
                    Removing <strong>{selectedSku.name}</strong> eliminates {selectedSku.stockouts} annual stockouts and {(selectedSku.cx * 100).toFixed(0)}% complexity score from the catalog. {removeMarginImpact > 0 ? `Portfolio margin improves by +${removeMarginImpact}pp.` : 'Be sure to monitor customer retention on substitute variants.'}
                  </span>
                )}
                {simTab === 'price' && (
                  <span>
                    A <strong>{priceChange > 0 ? '+' : ''}{priceChange}%</strong> pricing change on <strong>{selectedSku.name}</strong> with a volume elasticity coefficient of {volumeElasticity}x is predicted to {revDelta > 0 ? 'increase' : 'decrease'} revenue by ₹{Math.abs(revDelta)} Cr and {newMargin > selectedSku.margin ? 'lift' : 'reduce'} margins to {newMargin}%.
                  </span>
                )}
                {simTab === 'launch' && (
                  <span>
                    A new product launch projected at ₹{projectedRevenue} Cr and {expectedMargin}% margin with a <strong>{cannRiskLabel}</strong> cannibalization rate is predicted to deliver ₹{netLaunchRev} Cr net portfolio revenue after cannibalization adjustments.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ④ COMPLEXITY ANALYSIS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-l-4 border-[#8b5cf6] pl-3 py-0.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">④ Complexity Analysis</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Operational Complexity Score</h4>
            <div className="space-y-2">
              {[
                { lbl: 'Fabric Softener', v: 81, c: '#ef4444' },
                { lbl: 'Floor Cleaner', v: 74, c: '#ef4444' },
                { lbl: 'Choco Wafers', v: 71, c: '#ef4444' },
                { lbl: 'Foam Face Wash', v: 63, c: '#f59e0b' },
                { lbl: 'Green Tea RTD', v: 58, c: '#f59e0b' },
                { lbl: 'Hand Cream SPF', v: 52, c: '#f59e0b' },
                { lbl: 'Herbal Shampoo', v: 34, c: '#10b981' }
              ].map(o => (
                <div key={o.lbl} className="flex items-center gap-2 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: o.c }} />
                  <span className="text-zinc-550 dark:text-zinc-400 flex-1">{o.lbl}</span>
                  <div className="w-24 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden shrink-0">
                    <div className="h-full" style={{ width: `${o.v}%`, backgroundColor: o.c }} />
                  </div>
                  <span className="font-bold w-8 text-right" style={{ color: o.c }}>{o.v}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Inventory Burden Index</h4>
            <div className="space-y-2">
              {[
                { lbl: 'Fabric Softener', v: 92, c: '#ef4444' },
                { lbl: 'Choco Wafers', v: 78, c: '#ef4444' },
                { lbl: 'Green Tea RTD', v: 71, c: '#f59e0b' },
                { lbl: 'Floor Cleaner', v: 68, c: '#f59e0b' },
                { lbl: 'Foam Face Wash', v: 61, c: '#f59e0b' },
                { lbl: 'Dish Soap 1L', v: 34, c: '#10b981' },
                { lbl: 'Mango Fizz', v: 22, c: '#10b981' }
              ].map(o => (
                <div key={o.lbl} className="flex items-center gap-2 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: o.c }} />
                  <span className="text-zinc-550 dark:text-zinc-400 flex-1">{o.lbl}</span>
                  <div className="w-24 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden shrink-0">
                    <div className="h-full" style={{ width: `${o.v}%`, backgroundColor: o.c }} />
                  </div>
                  <span className="font-bold w-8 text-right" style={{ color: o.c }}>{o.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ⑤ CANNIBALIZATION DETECTION */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-l-4 border-[#8b5cf6] pl-3 py-0.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">⑤ Cannibalization Detection</h3>
        </div>

        <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">SKU Pairs with Sales Cannibalization</h4>
            <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 tracking-wider">
              4 active pairs detected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-semibold tracking-wide border-collapse">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10">
                  <th className="py-2.5 text-[9.5px] font-black uppercase text-zinc-450 tracking-wider">SKU A</th>
                  <th className="py-2.5 text-[9.5px] font-black uppercase text-zinc-450 tracking-wider">SKU B</th>
                  <th className="py-2.5 text-[9.5px] font-black uppercase text-zinc-450 tracking-wider">Type</th>
                  <th className="py-2.5 text-[9.5px] font-black uppercase text-zinc-450 tracking-wider">Correlation</th>
                  <th className="py-2.5 text-[9.5px] font-black uppercase text-zinc-450 tracking-wider">Est. Revenue Loss</th>
                  <th className="py-2.5 text-[9.5px] font-black uppercase text-zinc-450 tracking-wider">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {[
                  { a: 'Mango Fizz 250ml', b: 'Mango Fizz 500ml', type: 'Size variant', corr: -0.62, loss: '₹18 Cr', sev: 'critical', c: '#ef4444' },
                  { a: 'Green Tea RTD', b: 'Aloe Vera Drink', type: 'Occasion overlap', corr: -0.51, loss: '₹12 Cr', sev: 'high', c: '#f59e0b' },
                  { a: 'Dish Soap 1L', b: 'Dish Soap 500ml', type: 'Pack-size', corr: -0.44, loss: '₹8 Cr', sev: 'medium', c: '#3b82f6' },
                  { a: 'Choco Wafers', b: 'Oat Cookies', type: 'Snack substitution', corr: -0.38, loss: '₹6 Cr', sev: 'medium', c: '#3b82f6' }
                ].map(p => (
                  <tr key={p.a + p.b} className="hover:bg-black/[0.005]">
                    <td className="py-2.5 text-acies-gray dark:text-white font-bold">{p.a}</td>
                    <td className="py-2.5 text-acies-gray dark:text-white font-bold">{p.b}</td>
                    <td className="py-2.5 text-zinc-450 dark:text-zinc-500">{p.type}</td>
                    <td className="py-2.5 text-red-500 font-bold font-mono">{p.corr.toFixed(2)}</td>
                    <td className="py-2.5 text-acies-gray dark:text-white font-bold">{p.loss}</td>
                    <td className="py-2.5">
                      <span className="text-[8.5px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-widest" style={{ backgroundColor: p.c + '18', color: p.c }}>
                        {p.sev}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ⑥ DEPARTMENTS + BUSINESS VALUE */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-l-4 border-[#8b5cf6] pl-3 py-0.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">⑥ Departments &amp; Business Value</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">🏢 Departments Using This View</h4>
            <div className="space-y-3">
              {[
                { icon: '📦', name: 'Product Management', role: 'Portfolio decisions · Launch planning · Rationalization targets' },
                { icon: '💰', name: 'Finance', role: 'P&L impact analysis · Revenue at risk · Budget optimization' },
                { icon: '⚙️', name: 'Operations', role: 'Supply complexity · Inventory burden · Sourcing lead times' }
              ].map(d => (
                <div key={d.name} className="flex gap-3 text-[11px] font-semibold items-center">
                  <div className="w-7 h-7 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center text-sm shrink-0">
                    {d.icon}
                  </div>
                  <div>
                    <div className="text-acies-gray dark:text-white font-bold text-[10.5px]">{d.name}</div>
                    <div className="text-[8.5px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider">{d.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">💡 Business Value Delivered</h4>
            <div className="space-y-2">
              {[
                'Reduced SKU overload — focus on highest commercial value items',
                'Higher profitability — systematically prunes margin-diluting tail SKUs',
                'Optimal channel mix — ensures appropriate portfolio density per retailer',
                'Smarter launch planning — flags downstream cannibalization before formulation',
                'Inventory simplification — reduces safety buffers and manufacturing burden'
              ].map(v => (
                <div key={v} className="flex items-center gap-2 text-[10.5px] font-semibold text-zinc-550 dark:text-zinc-300">
                  <span className="w-4 h-4 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-black flex items-center justify-center shrink-0">↗</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ⑦ PARETO — REVENUE CONCENTRATION */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-l-4 border-[#8b5cf6] pl-3 py-0.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">⑦ Revenue Concentration — Pareto View</h3>
        </div>

        <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 p-5 shadow-sm space-y-2">
          <div className="mb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Top SKUs Driving Portfolio Revenue</h4>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Cumulative percentage line demonstrates 80/20 distribution rule</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={paretoData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: tickColor }} />
                <YAxis yAxisId="left" tick={{ fontSize: 8, fill: tickColor }} label={{ value: 'Revenue (₹ Cr)', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 9 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 8, fill: tickColor }} label={{ value: 'Cumulative %', angle: 90, position: 'insideRight', fill: tickColor, fontSize: 9 }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                  itemStyle={{ fontSize: 10 }}
                  formatter={(value: any, name: any, props: any) => {
                    if (name === 'Revenue') return [`₹${value} Cr (${props.payload.aiClass})`, 'Revenue'];
                    return [`${value}%`, 'Cumulative Revenue'];
                  }}
                />
                <Bar yAxisId="left" dataKey="rev" barSize={14} radius={[2, 2, 0, 0]}>
                  {paretoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="cumPct" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// ⚙️ PM & Pricing Partner View: SKU Brief Calculator
const StandardSKURationalizationView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const accentColor = isDarkMode ? '#a78bfa' : '#6d28d9';
  const [skuA, setSkuA] = useState('Mango Fizz 500ml');
  const [skuB, setSkuB] = useState('Mango Fizz 250ml');
  const [correlation, setCorrelation] = useState(-0.62);
  const [category, setCategory] = useState('Beverages');

  const [hasScored, setHasScored] = useState(true);
  const [guideOpen, setGuideOpen] = useState(false);

  const pairsData: CannibalizationPair[] = [
    { a: 'Mango Fizz 500ml', b: 'Aloe Vera Drink', risk: 0.62, cat: 'Beverages', revAtRisk: 42 },
    { a: 'Oat Cookies', b: 'Choco Wafers', risk: 0.38, cat: 'Snacks', revAtRisk: 18 },
    { a: 'Herbal Shampoo', b: 'Hand Cream SPF', risk: 0.24, cat: 'Personal Care', revAtRisk: 12 },
    { a: 'Dish Soap 1L', b: 'Floor Cleaner', risk: 0.51, cat: 'Household', revAtRisk: 28 },
    { a: 'Green Tea RTD', b: 'Mango Fizz 500ml', risk: 0.44, cat: 'Beverages', revAtRisk: 22 },
  ];

  const pairRisk = Math.max(0, -correlation);
  let riskVerdict = 'Low Risk';
  let verdictColor = 'text-green-500 bg-green-500/10 border-green-500/20';

  if (pairRisk > 0.5) {
    riskVerdict = 'High Risk';
    verdictColor = 'text-red-500 bg-red-500/10 border-red-500/20';
  } else if (pairRisk > 0.25) {
    riskVerdict = 'Moderate';
    verdictColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  }

  const scatterData = pairsData.map((p, idx) => ({
    index: idx,
    risk: p.risk,
    name: `${p.a} ↔ ${p.b}`,
    revAtRisk: p.revAtRisk,
    cat: p.cat,
    fill: p.risk > 0.5 ? '#A32D2D' : p.risk > 0.3 ? '#854F0B' : '#0F6E56'
  }));

  const promoErosionData = [...SKUS]
    .sort((a, b) => b.promo - a.promo)
    .slice(0, 10)
    .map(s => ({
      name: s.name,
      promoPct: Math.round(s.promo * 100),
      fill: s.promo > 0.5 ? '#A32D2D' : s.promo > 0.3 ? '#854F0B' : '#0F6E56'
    }));

  return (
    <div className="space-y-6">
      <div className="glass-card bg-acies-gray text-white py-5 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
          <Scissors size={100} />
        </div>
        <div>
          <p className="text-[9px] uppercase font-bold tracking-widest opacity-40 mb-2">Long-Tail Rationalization · Tab 4 of 6</p>
          <h2 className="text-xl font-display font-medium text-white mb-2">SKU Rationalization</h2>
          <p className="text-xs text-zinc-300 font-medium max-w-xl leading-relaxed">
            Diagnose cannibalization risks, identify margin-eroding promotional dependency, and Sunset tail SKUs to optimize inventory health.
          </p>
        </div>
      </div>

      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4">
        <button 
          onClick={() => setGuideOpen(!guideOpen)}
          className="w-full text-left font-bold text-xs uppercase tracking-widest text-acies-yellow flex justify-between items-center cursor-pointer border-none bg-transparent"
        >
          <span>📖 Rationalization analysis guide</span>
          <span className="text-[10px]">{guideOpen ? '✕ Collapse' : '▲ Expand'}</span>
        </button>

        {guideOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-black/5 dark:border-white/5 mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">1. Cannibalization risk map</h4>
              <p>Each bubble = SKU pair. X-axis = negative correlation between one SKU's promo and another's sales. Higher correlation = more cannibalization.</p>
            </div>
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">2. Promotional erosion table</h4>
              <p>Shows SKUs where &gt;40% revenue comes during promo periods. High promo dependency without margin recovery = value destroyers.</p>
            </div>
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">3. Score SKU pairs</h4>
              <p>Enter two variant SKUs and their promo correlation to get an instant cannibalization risk score. Use this to examine your SKU architecture.</p>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <LinkIcon size={12} />
          Score a SKU Pair
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">SKU A</label>
            <input 
              type="text" 
              value={skuA}
              onChange={(e) => setSkuA(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">SKU B</label>
            <input 
              type="text" 
              value={skuB}
              onChange={(e) => setSkuB(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Promo-Sales Correlation</label>
            <input 
              type="number" 
              value={correlation}
              step="0.01"
              min="-1"
              max="0"
              onChange={(e) => setCorrelation(parseFloat(e.target.value) || 0)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            >
              <option>Beverages</option>
              <option>Snacks</option>
              <option>Personal Care</option>
              <option>Household</option>
            </select>
          </div>
        </div>

        <div className="flex mt-4 pt-4 border-t border-black/5 dark:border-white/5">
          <button 
            onClick={() => setHasScored(true)}
            className="px-5 py-2 bg-acies-gray text-white text-[9px] font-bold uppercase tracking-widest hover:bg-acies-yellow hover:text-acies-gray transition-all cursor-pointer border-none"
          >
            Score Pair
          </button>
        </div>
      </div>

      {hasScored && (
        <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
          <h4 className="text-xs font-bold uppercase tracking-widest pb-3 border-b border-black/5 dark:border-white/5 mb-4 flex items-center gap-2">
            Cannibalization Score Verdict:
            <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-sm ${verdictColor}`}>
              {riskVerdict}
            </span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-sm text-center">
              <p className="text-[8px] font-bold uppercase tracking-widest opacity-45 mb-1">SKU A</p>
              <h5 className="text-[11px] font-bold truncate text-acies-gray dark:text-white" title={skuA}>{skuA}</h5>
            </div>
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-sm text-center">
              <p className="text-[8px] font-bold uppercase tracking-widest opacity-45 mb-1">SKU B</p>
              <h5 className="text-[11px] font-bold truncate text-acies-gray dark:text-white" title={skuB}>{skuB}</h5>
            </div>
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-sm text-center">
              <p className="text-[8px] font-bold uppercase tracking-widest opacity-45 mb-1">Correlation</p>
              <h5 className="text-base font-display font-extrabold text-amber-500">{correlation.toFixed(2)}</h5>
            </div>
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-sm text-center">
              <p className="text-[8px] font-bold uppercase tracking-widest opacity-45 mb-1">Calculated Risk</p>
              <h5 className="text-base font-display font-extrabold text-acies-gray dark:text-white">{pairRisk.toFixed(2)}</h5>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest">Cannibalization Risk Map</h3>
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">Bubble size = revenue at risk (₹ Cr). Hover bubbles for details.</p>
        </div>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" dataKey="risk" name="Risk" domain={[0, 1]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} label={{ value: 'Cannibalization Risk Score →', position: 'bottom', fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
              <YAxis type="number" dataKey="index" name="Pair" domain={[0, scatterData.length - 1]} tick={false} axisLine={false} tickLine={false} />
              <ZAxis type="number" dataKey="revAtRisk" range={[60, 450]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                itemStyle={{ fontSize: 11 }}
                formatter={(value: any, name: any) => {
                  if (name === 'Pair') return [value, 'Name'];
                  if (name === 'Revenue at risk') return [`₹${value}Cr`, 'Revenue at Risk'];
                  return [value, name];
                }}
              />
              <Scatter data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList dataKey="name" position="right" style={{ fill: 'rgba(255,255,255,0.5)', fontSize: 8, pointerEvents: 'none' }} />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest">Promotional Erosion — Top 10 Dependent SKUs</h3>
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">% of revenue earned during promo periods. Higher = more dependency.</p>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={promoErosionData} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} label={{ value: 'Promo Dependency %', position: 'bottom', fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                itemStyle={{ fontSize: 11 }}
                formatter={(value) => `${value}%`}
              />
              <Bar dataKey="promoPct" barSize={12} radius={[0, 2, 2, 0]}>
                {promoErosionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Main Export Component
export const SKURationalization: React.FC<SKURationalizationProps> = ({ role, isDarkMode }) => {
  if (role === 'VP Product Management') {
    return <VPSKURationalizationView isDarkMode={isDarkMode} />;
  } else {
    return <StandardSKURationalizationView isDarkMode={isDarkMode} />;
  }
};
