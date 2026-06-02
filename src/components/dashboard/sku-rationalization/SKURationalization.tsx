/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scissors, Link as LinkIcon, Check, AlertTriangle, AlertCircle, BarChart2, TrendingDown,
  Activity, Play, CheckCircle2, RefreshCw, Layers, Briefcase, Zap, HelpCircle, Cpu, TrendingUp, Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, Cell, LabelList,
  BarChart, Bar, ComposedChart, Line
} from 'recharts';
import { SKUS } from '../../../constants/data';
import { Role } from '../../../types/dashboard';
import { SkuIntelligenceModal } from './SkuIntelligenceModal';
import { ProductDirectory } from './ProductDirectory';
import { CalculatorScorer } from './CalculatorScorer';

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
  setActiveTab?: (tabId: number) => void;
}

// AI Classification Configuration
export const SR_CLASSES: Record<string, { label: string; color: string; bg: string; border: string; icon: string; desc: string }> = {
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

export const SKURationalization: React.FC<SKURationalizationProps> = ({ role, isDarkMode, setActiveTab }) => {
  // Chart Visual Constants
  const gridStroke = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tickColor = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const tooltipBg = isDarkMode ? '#1f1f1f' : '#fff';
  const tooltipBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipText = isDarkMode ? '#fff' : '#000';

  // Toggle View State: 'simulator' (Strategic) or 'analyst' (Cannibalization & Promo)
  const [activeView, setActiveView] = useState<'simulator' | 'analyst'>(
    role === 'VP Product Management' ? 'simulator' : 'analyst'
  );

  const [refreshTime, setRefreshTime] = useState('');
  useEffect(() => {
    setRefreshTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  // Filter Highlight state from category cards
  const [selectedAiClass, setSelectedAiClass] = useState<string | null>(null);

  // Group SKUs by category helper for select dropdowns
  const skusByCategory = useMemo(() => {
    const map: Record<string, typeof SKUS> = {
      Beverages: [],
      Snacks: [],
      'Personal Care': [],
      Dairy: [],
      Household: []
    };
    SKUS.forEach(s => {
      const categoryLabel = s.cat === 'Home Care' ? 'Household' : s.cat;
      if (map[categoryLabel]) {
        map[categoryLabel].push(s);
      } else {
        map[categoryLabel] = [s];
      }
    });
    return map;
  }, []);

  // Simulator State variables
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
  const groups = useMemo(() => {
    const res: Record<string, typeof SKUS> = {
      retain: [], grow: [], bundle: [], reposition: [], sunset: []
    };
    SKUS.forEach(s => {
      const c = srClassify(s);
      if (res[c]) res[c].push(s);
    });
    return res;
  }, []);

  // Selected SKU details
  const selectedSku = useMemo(() => {
    return SKUS.find(s => s.name === selectedSkuName) || SKUS[0];
  }, [selectedSkuName]);

  const totalRev = useMemo(() => {
    return SKUS.reduce((s, k) => s + k.rev, 0);
  }, []);

  // Ranked sunset/reposition SKU priorities
  const rankedPriorities = useMemo(() => {
    return [...SKUS]
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
  }, []);

  // Handle run simulation triggers
  const handleRunSim = () => {
    setIsSimulating(true);
    setBtnText('⏳ Calculating...');
    setTimeout(() => {
      setIsSimulating(false);
      setBtnText('✅ Simulation Complete');
      setTimeout(() => {
        setBtnText('⚡ Run Simulation');
      }, 2000);
    }, 800);
  };

  // 1. Discontinue SKU simulation calculations
  const removeRevImpact = -selectedSku.rev;
  const removeMarginImpact = parseFloat((selectedSku.margin < 28 ? 0.4 : selectedSku.margin > 40 ? -0.2 : 0).toFixed(1));
  const removeCustImpact = selectedSku.val > 0.6 ? 'High — brand loyalists affected' : 'Low — high substitution rate';
  const removeScImpact = `Frees ${selectedSku.lead}d lead buffer · −${selectedSku.stockouts} stockout events`;
  
  // 2. Adjust Price simulation calculations
  const volChange = (priceChange * volumeElasticity) / 100;
  const newRev = parseFloat((selectedSku.rev * (1 + priceChange / 100) * (1 + volChange)).toFixed(1));
  const revDelta = parseFloat((newRev - selectedSku.rev).toFixed(1));
  const newMargin = parseFloat((selectedSku.margin + priceChange * 0.7).toFixed(1));

  // 3. Hypothetical Launch simulation calculations
  const cannRiskLabel = ['Low', 'Medium', 'High'][cannibalizationRisk];
  const cannHaircut = cannibalizationRisk === 2 ? 0.18 : cannibalizationRisk === 1 ? 0.09 : 0.02;
  const netLaunchRev = parseFloat((projectedRevenue * (1 - cannHaircut)).toFixed(1));

  // Composed Pareto dataset with Simulated Ghost values
  const paretoData = useMemo(() => {
    const sorted = [...SKUS].sort((a, b) => b.rev - a.rev);
    const sunsetSkuNameActive = simTab === 'remove' ? selectedSkuName : null;
    const sunsetSku = SKUS.find(s => s.name === sunsetSkuNameActive);
    const hasSunset = !!sunsetSku;
    const newTotalRev = hasSunset ? totalRev - sunsetSku.rev : totalRev;

    let cumSumNormal = 0;
    let cumSumSim = 0;

    return sorted.map(s => {
      cumSumNormal += s.rev;
      const isSunset = s.name === sunsetSkuNameActive;
      if (!isSunset) {
        cumSumSim += s.rev;
      }
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
        cumPct: parseFloat(((cumSumNormal / totalRev) * 100).toFixed(1)),
        simCumPct: isSunset ? null : parseFloat(((cumSumSim / newTotalRev) * 100).toFixed(1)),
        fill: isSunset ? 'rgba(239,68,68,0.15)' : color,
        aiClass: SR_CLASSES[cls].label,
        highlightClass: cls,
        isDimmed: selectedAiClass ? cls !== selectedAiClass : false
      };
    });
  }, [simTab, selectedSkuName, totalRev, selectedAiClass]);

  // Scatter chart data
  const matrixScatterData = useMemo(() => {
    return SKUS.map(s => {
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
        z: s.rev,
        highlightClass: cls,
        isDimmed: selectedAiClass ? cls !== selectedAiClass : false
      };
    });
  }, [selectedAiClass]);

  // ----------------------------------------------------
  // Cannibalization Analyst States (Standard view panel)
  // ----------------------------------------------------
  const [skuA, setSkuA] = useState('Mango Fizz 500ml');
  const [skuB, setSkuB] = useState('Aloe Vera Drink');
  const [correlation, setCorrelation] = useState(-0.62);
  const [category, setCategory] = useState('Beverages');
  const [hasScored, setHasScored] = useState(true);
  const [guideOpen, setGuideOpen] = useState(false);

  // SKU Detail Modal State
  const [selectedSkuDetails, setSelectedSkuDetails] = useState<typeof SKUS[0] | null>(null);

  // Dynamic filter for SKU B based on SKU A category
  const skuACategory = useMemo(() => {
    const s = SKUS.find(item => item.name === skuA);
    return s ? s.cat : 'Beverages';
  }, [skuA]);

  const skuBOptions = useMemo(() => {
    return SKUS.filter(s => s.cat === skuACategory && s.name !== skuA);
  }, [skuACategory, skuA]);

  useEffect(() => {
    const isStillValid = skuBOptions.some(opt => opt.name === skuB);
    if (!isStillValid && skuBOptions.length > 0) {
      setSkuB(skuBOptions[0].name);
    }
  }, [skuBOptions, skuB]);

  const pairsData: CannibalizationPair[] = [
    { a: 'Mango Fizz 500ml', b: 'Aloe Vera Drink', risk: 0.62, cat: 'Beverages', revAtRisk: 42 },
    { a: 'Oat Cookies', b: 'Choco Wafers', risk: 0.38, cat: 'Snacks', revAtRisk: 18 },
    { a: 'Herbal Shampoo', b: 'Hand Cream SPF', risk: 0.24, cat: 'Personal Care', revAtRisk: 12 },
    { a: 'Dish Soap 1L', b: 'Floor Cleaner', risk: 0.51, cat: 'Household', revAtRisk: 28 },
    { a: 'Green Tea RTD', b: 'Mango Fizz 500ml', risk: 0.44, cat: 'Beverages', revAtRisk: 22 },
  ];

  // Automatically update correlation when SKU A or SKU B changes
  useEffect(() => {
    if (!skuA || !skuB) return;
    const predefined = pairsData.find(
      p => (p.a === skuA && p.b === skuB) || (p.a === skuB && p.b === skuA)
    );
    if (predefined) {
      setCorrelation(-predefined.risk);
    } else {
      // Deterministically generate a realistic correlation coefficient (-0.15 to -0.60) based on name hashes
      const combined = [skuA, skuB].sort().join('|');
      let hash = 0;
      for (let i = 0; i < combined.length; i++) {
        hash = combined.charCodeAt(i) + ((hash << 5) - hash);
      }
      const normalized = Math.abs(hash % 100) / 100;
      const baseCorrelation = -0.15 - (normalized * 0.45);
      setCorrelation(parseFloat(baseCorrelation.toFixed(2)));
    }
  }, [skuA, skuB]);

  // Synchronize category state automatically to match SKU A's category
  useEffect(() => {
    const catLabel = skuACategory === 'Home Care' ? 'Household' : skuACategory;
    setCategory(catLabel);
  }, [skuACategory]);

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

  // Prepopulate form fields when clicking scatter maps in analyst view
  const handleAnalystScatterClick = (node: any) => {
    if (node && node.name) {
      const parts = node.name.split(' ↔ ');
      if (parts.length === 2) {
        setSkuA(parts[0]);
        setSkuB(parts[1]);
        setCorrelation(-node.risk);
        setCategory(node.cat);
        setHasScored(true);
      }
    }
  };

  const scatterPairsData = pairsData.map((p, idx) => ({
    index: idx,
    risk: p.risk,
    name: `${p.a} ↔ ${p.b}`,
    revAtRisk: p.revAtRisk,
    cat: p.cat,
    fill: p.risk > 0.5 ? '#A32D2D' : p.risk > 0.3 ? '#854F0B' : '#0F6E56'
  }));

  const promoErosionData = useMemo(() => {
    return [...SKUS]
      .sort((a, b) => b.promo - a.promo)
      .slice(0, 10)
      .map(s => ({
        name: s.name,
        promoPct: Math.round(s.promo * 100),
        fill: s.promo > 0.5 ? '#ef4444' : s.promo > 0.35 ? '#f59e0b' : '#10b981'
      }));
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-zinc-800 dark:text-white">
      
      {/* Dynamic View Swapper Tab Menu */}
      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-3 rounded shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-450">Workspaces:</span>
          <div className="flex bg-black/5 dark:bg-white/5 p-0.5 rounded border border-black/5 dark:border-white/10 min-w-[340px]">
            {[
              { id: 'simulator', label: 'Portfolio Simulator Command' },
              { id: 'analyst', label: 'Cannibalization & Promo Analyst' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveView(tab.id as any);
                  setSelectedAiClass(null); // Reset class selection
                }}
                className={`flex-1 py-1 text-[8.5px] font-bold uppercase tracking-wider rounded-sm transition-all border-none cursor-pointer text-center outline-none ${
                  activeView === tab.id
                    ? 'bg-acies-yellow text-white dark:text-acies-gray font-extrabold shadow-sm shadow-black/10'
                    : 'bg-transparent text-zinc-555 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-acies-yellow animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
            Acies AI Product Rationalization Engine v1.1
          </span>
        </div>
      </div>

      {/* Main Header Descriptor block */}
      <div className="glass-card bg-acies-gray text-white py-5 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
          <Scissors size={100} />
        </div>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h2 className="text-xl font-display font-medium text-white">
              {activeView === 'simulator' 
                ? 'Portfolio Rationalization Command Simulator' 
                : 'Cannibalization & Promotional Margin Analyst'}
            </h2>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active Ledger Sync
              </span>
              <span className="text-[10px] opacity-40 font-bold tracking-widest">Refreshed {refreshTime}</span>
            </div>
          </div>
          <p className="text-xs text-zinc-300 font-medium max-w-2xl leading-relaxed">
            {activeView === 'simulator'
              ? 'Classify overall SKU value segments, run operational margin scenarios, simulate unit pricing structures, and overlay Pareto revenue distributions.'
              : 'Audit high negative cross-correlations across product lines, calculate pricing margins, and analyze products with extreme promotional dependency.'}
          </p>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* WORKSPACE VIEW 1: STRATEGIC SIMULATOR VIEW                             */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeView === 'simulator' && (
        <div className="space-y-6">
          
          {/* ① AI SEGMENTATION RECOMMENDATION CARDS (Filters charts on click) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 py-0.5 w-full">
              <div className="flex items-center gap-2 border-l-4 border-[#8b5cf6] pl-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">
                  ① Portfolio Segment Filters
                </h3>
                <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest ml-2 hidden sm:inline">Click cards to filter charts below</span>
              </div>
              {selectedAiClass && (
                <button
                  onClick={() => setSelectedAiClass(null)}
                  className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-[#8b5cf6] dark:text-purple-300 text-[8px] font-bold uppercase tracking-widest rounded border border-purple-500/20 transition-all cursor-pointer outline-none"
                >
                  ✕ Clear Filter ({SR_CLASSES[selectedAiClass]?.label})
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(SR_CLASSES).map(([key, cfg]) => {
                const list = groups[key] || [];
                const isSelected = selectedAiClass === key;
                return (
                  <button 
                    key={key} 
                    onClick={() => setSelectedAiClass(isSelected ? null : key)}
                    className={`text-left bg-white dark:bg-[#1a1a24] border p-4 rounded transition-all hover:translate-y-[-1px] shadow-sm flex flex-col justify-between min-h-[115px] cursor-pointer outline-none relative overflow-hidden group ${
                      isSelected 
                        ? 'ring-2 ring-acies-yellow ring-offset-2 dark:ring-offset-[#121214] scale-[1.01] border-transparent' 
                        : 'border-black/5 dark:border-white/10 hover:border-black/15 dark:hover:border-white/15'
                    }`}
                    style={{ borderColor: isSelected ? undefined : cfg.border }}
                  >
                    {isSelected && (
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-acies-yellow" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base shrink-0">{cfg.icon}</span>
                        <div>
                          <h4 className="text-[11px] font-bold" style={{ color: cfg.color }}>{cfg.label}</h4>
                          <p className="text-[7.5px] text-zinc-400 leading-tight font-medium" style={{ contentVisibility: 'auto' }}>{cfg.desc}</p>
                        </div>
                      </div>
                      <div className="text-2xl font-black mb-3" style={{ color: cfg.color }}>
                        {list.length} <span className="text-xs font-bold opacity-50">SKUs</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-black/5 dark:border-white/5 pt-2 text-[8px] font-medium text-zinc-450 dark:text-zinc-500 tracking-wide leading-relaxed truncate w-full">
                      {list.slice(0, 2).map(s => s.name.split(' ').slice(0, 2).join(' ')).join(' · ')}
                      {list.length > 2 && <span className="opacity-55 font-semibold">{` +${list.length - 2} items`}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ② VALUE vs COMPLEXITY MATRIX + PRIORITY RANKINGS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-l-4 border-[#8b5cf6] pl-3 py-0.5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">
                ② Commercial Value vs Complexity Matrix
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Scatter Map */}
              <div className="lg:col-span-2 glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 shadow-sm rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Commercial Value & Complexity Quadrants</h4>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Bottom-Right represents sunset priorities · Bubble radius equals revenue scale</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[8px] font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Retain/Grow</span>
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
                        contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, fontSize: '9px' }}
                        formatter={(value: any, name: any) => {
                          if (name === 'Complexity') return [value.toFixed(2), 'Complexity'];
                          if (name === 'Value') return [value.toFixed(2), 'Commercial Value'];
                          return [value, name];
                        }}
                      />
                      <Scatter name="SKUs" data={matrixScatterData}>
                        {matrixScatterData.map((entry, index) => {
                          const opacity = entry.isDimmed ? 0.15 : 1;
                          return (
                            <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={opacity} strokeOpacity={opacity} />
                          );
                        })}
                        <LabelList 
                          dataKey="name" 
                          position="right" 
                          style={{ 
                            fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)', 
                            fontSize: 7.5, 
                            pointerEvents: 'none', 
                            fontWeight: 600 
                          }} 
                        />
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Priority Pruning list */}
              <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 shadow-sm rounded-xl flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Discontinuation & Reposition priorities</h4>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Automated queue ranked by AI complexity margin drag</p>
                  </div>

                  <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04] max-h-56 overflow-y-auto pr-1">
                    {rankedPriorities.map((sku, i) => {
                      const cls = srClassify(sku);
                      const cfg = SR_CLASSES[cls];
                      const isHighlighted = selectedAiClass ? cls === selectedAiClass : true;
                      return (
                        <div 
                          key={sku.name} 
                          className={`flex items-center gap-3 py-2 text-[10.5px] transition-opacity cursor-pointer ${
                            isHighlighted ? 'opacity-100' : 'opacity-20'
                          }`}
                          onClick={() => {
                            setSelectedSkuName(sku.name);
                            setSimTab('remove');
                          }}
                        >
                          <div className="w-5 h-5 rounded text-[8px] font-black flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-acies-gray dark:text-white truncate font-bold text-[10px]">{sku.name}</div>
                            <div className="text-[7.5px] text-zinc-400 font-bold uppercase tracking-wider">
                              Complexity {sku.cx.toFixed(2)} · Value {sku.val.toFixed(2)} · ₹{sku.rev}Cr
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[7.5px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-widest" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                              {cfg.label}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSkuDetails(sku);
                              }}
                              className="w-5 h-5 rounded hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center text-zinc-450 hover:text-[#8b5cf6] transition-all cursor-pointer border-none bg-transparent outline-none shrink-0"
                              title="Open SKU Intelligence Card"
                            >
                              <Sparkles size={10} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-black/5 dark:border-white/5 text-center">
                  <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">
                    Click any item to load in simulator below
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ③ DYNAMIC P&L SIMULATOR COMMAND DESK */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-l-4 border-[#8b5cf6] pl-3 py-0.5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">
                ③ Real-time P&L Simulation Desk
              </h3>
            </div>

            <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 overflow-hidden shadow-sm rounded-xl">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 py-3.5 px-5 bg-black/[0.01]">
                <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Active Scenarios Console</h4>
                <span className="text-[8.5px] text-zinc-555 font-bold uppercase tracking-widest">Adjust sliders to model dynamic ledger updates</span>
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
                              ? 'bg-acies-yellow text-white dark:text-acies-gray shadow-sm'
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
                            const s = SKUS.find(item => item.name === selectedSkuName);
                            if (s) setSelectedSkuDetails(s);
                          }}
                          className="text-[8px] text-[#8b5cf6] dark:text-purple-300 font-bold uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent outline-none"
                        >
                          Inspect ℹ️
                        </button>
                      </div>
                      <select
                        value={selectedSkuName}
                        onChange={(e) => setSelectedSkuName(e.target.value)}
                        className="w-full bg-black/5 dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded-lg p-2.5 text-xs font-bold text-acies-gray dark:text-white outline-none focus:border-acies-yellow"
                      >
                        {Object.entries(skusByCategory).map(([cat, list]) => (
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
                          Discontinuing this product removes it from the catalog. The simulation models regional brand loyalty retention, safety stock releasing thresholds, and complexity relief margin benefits.
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
                            className="w-full accent-purple-550 cursor-pointer"
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
                            className="w-full accent-purple-550 cursor-pointer"
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
                            className="w-full accent-purple-550 cursor-pointer"
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
                            className="w-full accent-purple-550 cursor-pointer"
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
                            className="w-full accent-purple-550 cursor-pointer"
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
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450">Revenue Shift</div>
                            <div className="text-sm font-black text-red-500">₹{removeRevImpact} Cr</div>
                            <div className="text-[7.5px] font-semibold text-red-500">{(removeRevImpact/totalRev*100).toFixed(1)}% portfolio</div>
                            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                              <div className="h-full bg-red-500" style={{ width: `${Math.min(100, Math.abs(selectedSku.rev/totalRev*100))}%` }} />
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450">Margin Impact</div>
                            <div className={`text-sm font-black ${removeMarginImpact >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              {removeMarginImpact > 0 ? '+' : ''}{removeMarginImpact} pp
                            </div>
                            <div className="text-[7.5px] font-semibold text-zinc-500">Portfolio gross shift</div>
                            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                              <div className={`h-full ${removeMarginImpact >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.abs(removeMarginImpact) * 20}%` }} />
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450">Loyalty Risk</div>
                            <div className={`text-sm font-black ${selectedSku.val > 0.6 ? 'text-red-500' : 'text-emerald-500'}`}>
                              {selectedSku.val > 0.6 ? 'Elevated' : 'Negligible'}
                            </div>
                            <div className="text-[7.5px] font-semibold text-zinc-500 truncate" title={removeCustImpact}>{removeCustImpact}</div>
                            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                              <div className={`h-full ${selectedSku.val > 0.6 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${selectedSku.val * 100}%` }} />
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450">Operations Released</div>
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
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450">Revenue Delta</div>
                            <div className={`text-sm font-black ${revDelta >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              {revDelta > 0 ? '+' : ''}₹{revDelta} Cr
                            </div>
                            <div className="text-[7.5px] font-semibold text-zinc-500">New base: ₹{newRev} Cr</div>
                            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                              <div className={`h-full ${revDelta >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, Math.abs(revDelta / selectedSku.rev * 100))}%` }} />
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450">New Item Margin</div>
                            <div className={`text-sm font-black ${newMargin > selectedSku.margin ? 'text-emerald-500' : 'text-red-500'}`}>
                              {newMargin}%
                            </div>
                            <div className="text-[7.5px] font-semibold text-zinc-500">Shift: {(newMargin - selectedSku.margin).toFixed(1)}pp</div>
                            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                              <div className={`h-full ${newMargin > selectedSku.margin ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${newMargin}%` }} />
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450">Volume displacement</div>
                            <div className={`text-sm font-black ${volChange >= 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                              {(volChange * 100).toFixed(1)}%
                            </div>
                            <div className="text-[7.5px] font-semibold text-zinc-500">Elasticity active</div>
                            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                              <div className={`h-full ${volChange >= 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, Math.abs(volChange * 100))}%` }} />
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450">Volume Elasticity</div>
                            <div className={`text-sm font-black ${Math.abs(priceChange) > 15 ? 'text-red-500' : 'text-emerald-500'}`}>
                              {volumeElasticity.toFixed(1)}x
                            </div>
                            <div className="text-[7.5px] font-semibold text-zinc-500">Customer reaction factor</div>
                            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                              <div className="h-full bg-purple-500" style={{ width: `${(Math.abs(volumeElasticity)/3)*100}%` }} />
                            </div>
                          </div>
                        </>
                      )}

                      {simTab === 'launch' && (
                        <>
                          <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450">Projected Portfolio Sales</div>
                            <div className="text-sm font-black text-blue-500">₹{netLaunchRev} Cr</div>
                            <div className="text-[7.5px] font-semibold text-zinc-500">{`Minus ${Math.round(cannHaircut * 100)}% displacement`}</div>
                            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                              <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, netLaunchRev / 2)}%` }} />
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450">Expected Margin</div>
                            <div className="text-sm font-black text-emerald-500">{expectedMargin}%</div>
                            <div className="text-[7.5px] font-semibold text-zinc-500">Item margin projection</div>
                            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                              <div className="h-full bg-emerald-500" style={{ width: `${expectedMargin}%` }} />
                            </div>
                          </div>

                          <div className="bg-white dark:bg-[#1a1a24] p-3 rounded border border-black/5 dark:border-white/10 space-y-1 shadow-sm">
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450">Displacement impact</div>
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
                            <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450">Complexity Delta</div>
                            <div className="text-sm font-black text-amber-500">Moderate</div>
                            <div className="text-[7.5px] font-semibold text-zinc-500">Adds complexity +0.04</div>
                            <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mt-1">
                              <div className="h-full bg-amber-500" style={{ width: '40%' }} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Responsive Simulated AI Explanation Feed Banner */}
                  <div className="p-3.5 bg-acies-yellow/[0.03] dark:bg-white/[0.01] border border-black/10 dark:border-white/10 rounded-xl text-[10.5px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-semibold relative">
                    <div className="absolute top-0 right-0 p-1.5 opacity-25">
                      <Cpu size={14} className="text-acies-yellow" />
                    </div>
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

          {/* ④ PARETO - REVENUE CONCENTRATION WITH GHOST SIMULATION OVERLAY */}
          <div className="space-y-3">
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

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* WORKSPACE VIEW 2: CANNIBALIZATION & PROMO ANALYST                       */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeView === 'analyst' && (
        <div className="space-y-6">
          
          {/* ① DIAGNOSTIC GUIDE PANEL */}
          <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/5 dark:border-white/10 p-4 rounded-xl shadow-sm">
            <button 
              onClick={() => setGuideOpen(!guideOpen)}
              className="w-full text-left font-bold text-xs uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300 flex justify-between items-center cursor-pointer border-none bg-transparent outline-none"
            >
              <span className="flex items-center gap-2">
                <HelpCircle size={14} />
                Rationalization Diagnostic Guide
              </span>
              <span className="text-[10px]">{guideOpen ? '✕ Collapse Info' : '▲ Expand Info'}</span>
            </button>

            {guideOpen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-black/5 dark:border-white/5 mt-3 text-[11px] leading-relaxed text-zinc-555 dark:text-zinc-400 font-semibold">
                <div className="space-y-1">
                  <h4 className="font-bold text-acies-gray dark:text-white uppercase text-[9px] tracking-wider text-[#8b5cf6]">1. Cannibalization Scatter Map</h4>
                  <p>Represents variant overlaps. Bubble size denotes revenue at risk. Click bubbles to auto-load pairs inside the scorer card.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-acies-gray dark:text-white uppercase text-[9px] tracking-wider text-[#8b5cf6]">2. Promotional Erosion Analysis</h4>
                  <p>Lists SKUs with high promo dependencies. Products with &gt;40% discount dependency erode margin equity and represent rationalization priorities.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-acies-gray dark:text-white uppercase text-[9px] tracking-wider text-[#8b5cf6]">3. Score SKU Pairs Calculator</h4>
                  <p>Evaluates correlation coefficients. Large negative numbers reflect substitution shifts where promo items cannibalize organic baselines.</p>
                </div>
              </div>
            )}
          </div>

          {/* ② INTERACTIVE PAIR SCORER CALCULATOR */}
          <CalculatorScorer
            skuA={skuA}
            setSkuA={setSkuA}
            skuB={skuB}
            setSkuB={setSkuB}
            correlation={correlation}
            setCorrelation={setCorrelation}
            category={category}
            hasScored={hasScored}
            setHasScored={setHasScored}
            skusByCategory={skusByCategory}
            skuACategory={skuACategory}
            skuBOptions={skuBOptions}
            pairRisk={pairRisk}
            riskVerdict={riskVerdict}
            verdictColor={verdictColor}
            onInspectSku={(name) => {
              const s = SKUS.find(item => item.name === name);
              if (s) setSelectedSkuDetails(s);
            }}
          />

          {/* ③ CANNIBALIZATION MAP & PROMO EROSION GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Cannibalization Scatter Map (Interacts with Pair Scorer on click) */}
            <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm">
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Substitution Risk Scatter Map</h3>
                <p className="text-[9px] text-zinc-555 font-bold uppercase tracking-widest mt-0.5">
                  Bubble size = revenue at risk (₹ Cr) • Click bubbles to load pair inputs above
                </p>
              </div>
              
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis 
                      type="number" 
                      dataKey="risk" 
                      name="Risk" 
                      domain={[0, 1]} 
                      tick={{ fill: tickColor, fontSize: 9 }} 
                      label={{ value: 'Cannibalization Risk Score →', position: 'bottom', fill: tickColor, fontSize: 10 }} 
                    />
                    <YAxis 
                      type="number" 
                      dataKey="index" 
                      name="Pair" 
                      domain={[0, scatterPairsData.length - 1]} 
                      tick={false} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <ZAxis type="number" dataKey="revAtRisk" range={[60, 450]} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, fontSize: '9px' }}
                      formatter={(value: any, name: any) => {
                        if (name === 'Pair') return [value, 'Pair variants'];
                        if (name === 'Revenue at risk') return [`₹${value} Cr`, 'Revenues at Risk'];
                        return [value, name];
                      }}
                    />
                    <Scatter 
                      data={scatterPairsData} 
                      onClick={(node) => handleAnalystScatterClick(node.payload)}
                      style={{ cursor: 'pointer' }}
                    >
                      {scatterPairsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <LabelList 
                        dataKey="name" 
                        position="right" 
                        style={{ fill: tickColor, fontSize: 8, pointerEvents: 'none', fontWeight: 600 }} 
                      />
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Promo Erosion Horizontal Bar Chart */}
            <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm">
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Promotional Erosion — Top 10 Dependent SKUs</h3>
                <p className="text-[9px] text-zinc-555 font-bold uppercase tracking-widest mt-0.5">
                  Percentage of total sales volume purchased under promotional discount
                </p>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={promoErosionData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                    <XAxis 
                      type="number" 
                      domain={[0, 100]} 
                      tick={{ fill: tickColor, fontSize: 9 }} 
                      label={{ value: 'Promo Volume Dependency %', position: 'bottom', fill: tickColor, fontSize: 10 }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fill: tickColor, fontSize: 8 }} 
                      axisLine={false} 
                      tickLine={false} 
                      width={85} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, fontSize: '9px' }}
                      formatter={(value) => `${value}%`}
                    />
                    <Bar dataKey="promoPct" barSize={10} radius={[0, 2, 2, 0]}>
                      {promoErosionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* ④ DEPARTMENTS & VALUE FOOTNOTE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">🏢 Collaboration matrix</h4>
              <div className="space-y-3">
                {[
                  { icon: '📦', name: 'Product Management', role: 'Sunsetting alignment · Sourcing coordination · Portfolio size targets' },
                  { icon: '💰', name: 'Pricing & Finance', role: 'Elasticity validation · Promo leakage margins · Capital efficiency' },
                  { icon: '⚙️', name: 'Supply Chain Operations', role: 'Warehouse release · Production line scheduling · Safety stock reductions' }
                ].map(d => (
                  <div key={d.name} className="flex gap-3 text-[11px] font-semibold items-center">
                    <div className="w-7 h-7 bg-[#8b5cf6]/10 text-[#8b5cf6] dark:text-purple-300 rounded-lg flex items-center justify-center text-sm shrink-0">
                      {d.icon}
                    </div>
                    <div>
                      <div className="text-acies-gray dark:text-white font-bold text-[10px]">{d.name}</div>
                      <div className="text-[8px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider">{d.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">💡 Financial Performance Benefits</h4>
              <div className="space-y-2.5">
                {[
                  'Eliminates long-tail overhead costs to drive portfolio margin expansion (+0.4pp expected)',
                  'Secures trade capital efficiency by releasing safety buffers across 35 redundant variants',
                  'Optimizes retail channel space density to prevent brand-on-brand cannibalization events',
                  'Minimizes manufacturing overhead and supplier administration bottlenecks'
                ].map((v, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10.5px] font-semibold text-zinc-550 dark:text-zinc-350">
                    <span className="w-4 h-4 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-black flex items-center justify-center shrink-0">✓</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ⑤ PORTFOLIO INTELLIGENCE DIRECTORY */}
      <ProductDirectory onSelectSku={(sku) => setSelectedSkuDetails(sku)} />

      {/* SKU DETAIL MODAL WINDOW */}
      <SkuIntelligenceModal
        sku={selectedSkuDetails}
        onClose={() => setSelectedSkuDetails(null)}
        setActiveTab={setActiveTab}
        onLoadInSimulator={(skuName) => {
          setSelectedSkuName(skuName);
          setSimTab('remove');
          setActiveView('simulator');
        }}
      />

    </div>
  );
};
