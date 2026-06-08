/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scissors, Link as LinkIcon, Check, AlertTriangle, AlertCircle, BarChart2, TrendingDown,
  Activity, Play, CheckCircle2, RefreshCw, Layers, Briefcase, Zap, HelpCircle, Cpu, TrendingUp, Sparkles,
  MapPin
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
import { KPICard } from '../KPICard';
import { KpiActionModal } from './KpiActionModal';
import { SegmentFilters } from './SegmentFilters';
import { ValueComplexitySection } from './ValueComplexitySection';
import { PLSimulatorSection } from './PLSimulatorSection';

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

// Helper to get location/region for a SKU deterministically
export const getSkuLocation = (name: string): 'APAC' | 'EMEA' | 'Americas' => {
  const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  if (charSum % 3 === 0) return 'APAC';
  if (charSum % 3 === 1) return 'EMEA';
  return 'Americas';
};

export const SKURationalization: React.FC<SKURationalizationProps> = ({ role, isDarkMode, setActiveTab }) => {
  // Region location selection state
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');

  // Filter SKUs by region
  const locationFilteredSkus = useMemo(() => {
    if (selectedLocation === 'ALL') return SKUS;
    return SKUS.filter(s => getSkuLocation(s.name) === selectedLocation);
  }, [selectedLocation]);

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
  const [activeKpiAction, setActiveKpiAction] = useState<string | null>(null);

  // Get active KPI cards for SKU Rationalization tab
  const kpis = useMemo(() => {
    const activeSkusCount = locationFilteredSkus.length;
    const sunsetCount = locationFilteredSkus.filter(s => {
      const val = s.val;
      const cx = s.cx;
      const growth = s.growth;
      const margin = s.margin;
      if (val >= 0.7 && cx <= 0.4) return false;
      if (val >= 0.6 && growth >= 0.15) return false;
      if (val < 0.5 && cx < 0.5 && margin >= 30) return false;
      if (val < 0.4 && cx >= 0.6) return true;
      return false;
    }).length;

    const revAtRisk = locationFilteredSkus.filter(s => {
      const val = s.val;
      const cx = s.cx;
      const growth = s.growth;
      const margin = s.margin;
      if (val >= 0.7 && cx <= 0.4) return false;
      if (val >= 0.6 && growth >= 0.15) return false;
      if (val < 0.5 && cx < 0.5 && margin >= 30) return false;
      if (val < 0.4 && cx >= 0.6) return true;
      return false;
    }).reduce((sum, s) => sum + s.rev, 0);

    const avgComplexity = locationFilteredSkus.reduce((sum, s) => sum + s.cx, 0) / (activeSkusCount || 1);

    const cards = [
      {
        label: 'Portfolio SKUs',
        value: String(activeSkusCount),
        trend: 'up' as const,
        trendValue: '▲ 3 rationalized this Q',
        info: 'Total active SKUs across the global portfolio. Cleaned up low-value items.',
        highlight: ['VP Product Management']
      },
      {
        label: 'Sunset Candidates',
        value: String(sunsetCount),
        trend: 'down' as const,
        trendValue: 'Immediate action required',
        info: 'Low value and high complexity tail SKUs recommended for removal by AI.',
        highlight: ['VP Product Management'],
        isRisk: true
      },
      {
        label: 'Revenue at Risk',
        value: `₹${revAtRisk} Cr`,
        trend: 'down' as const,
        trendValue: 'If tail SKUs removed',
        info: 'Estimated maximum revenue exposure if all sunset candidates are removed concurrently.',
        highlight: ['VP Product Management'],
        isRisk: true
      },
      {
        label: 'Avg Complexity',
        value: avgComplexity.toFixed(2),
        trend: 'down' as const,
        trendValue: 'Target <0.40',
        info: 'Average operational and manufacturing complexity index across the active catalog.',
        highlight: ['VP Product Management'],
        isRisk: true
      }
    ];

    if (role === 'VP Product Management') {
      return cards.filter(c => c.label !== 'Portfolio SKUs');
    }
    return cards;
  }, [locationFilteredSkus, role]);

  useEffect(() => {
    setRefreshTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  // Handle auto-scroll to directory if location hash is present or global scroll flag is set
  useEffect(() => {
    const hasHash = window.location.hash.includes('product-directory-section');
    const hasFlag = (window as any).__scrollToDirectory;

    if (hasHash || hasFlag) {
      // Clear triggers
      if (hasHash) {
        try {
          const params = new URLSearchParams(window.location.hash.substring(1));
          let updated = false;
          const newParams = new URLSearchParams();
          params.forEach((value, key) => {
            if (!key.includes('product-directory')) {
              newParams.set(key, value);
            } else {
              updated = true;
            }
          });
          if (updated) {
            window.history.replaceState(null, '', '#' + newParams.toString());
          } else {
            window.location.hash = '';
          }
        } catch (e) {
          window.location.hash = '';
        }
      }
      (window as any).__scrollToDirectory = false;
      
      const scrollWithRetry = (attempts = 0) => {
        const element = document.getElementById('product-directory-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Unconditionally retry scroll to handle chart layout shifts/resizes as they load
        if (attempts < 10) {
          setTimeout(() => scrollWithRetry(attempts + 1), 150);
        }
      };
      
      // Delay to allow Framer Motion layout transition to finish
      setTimeout(() => {
        scrollWithRetry(0);
      }, 350);
    }
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
    locationFilteredSkus.forEach(s => {
      const categoryLabel = s.cat === 'Home Care' ? 'Household' : s.cat;
      if (map[categoryLabel]) {
        map[categoryLabel].push(s);
      } else {
        map[categoryLabel] = [s];
      }
    });
    return map;
  }, [locationFilteredSkus]);

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
    locationFilteredSkus.forEach(s => {
      const c = srClassify(s);
      if (res[c]) res[c].push(s);
    });
    return res;
  }, [locationFilteredSkus]);

  // Selected SKU details
  const selectedSku = useMemo(() => {
    return locationFilteredSkus.find(s => s.name === selectedSkuName) || locationFilteredSkus[0] || SKUS[0];
  }, [selectedSkuName, locationFilteredSkus]);

  const totalRev = useMemo(() => {
    return locationFilteredSkus.reduce((s, k) => s + k.rev, 0);
  }, [locationFilteredSkus]);

  // Ranked sunset/reposition SKU priorities
  const rankedPriorities = useMemo(() => {
    return [...locationFilteredSkus]
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
  }, [locationFilteredSkus]);

  // Safeguard currently selected SKU if it gets filtered out by region
  useEffect(() => {
    if (locationFilteredSkus.length > 0 && !locationFilteredSkus.some(s => s.name === selectedSkuName)) {
      setSelectedSkuName(locationFilteredSkus[0].name);
    }
  }, [locationFilteredSkus, selectedSkuName]);

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
    const sorted = [...locationFilteredSkus].sort((a, b) => b.rev - a.rev);
    const sunsetSkuNameActive = simTab === 'remove' ? selectedSkuName : null;
    const sunsetSku = locationFilteredSkus.find(s => s.name === sunsetSkuNameActive);
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
        cumPct: parseFloat(((cumSumNormal / (totalRev || 1)) * 100).toFixed(1)),
        simCumPct: isSunset ? null : parseFloat(((cumSumSim / (newTotalRev || 1)) * 100).toFixed(1)),
        fill: isSunset ? 'rgba(239,68,68,0.15)' : color,
        aiClass: SR_CLASSES[cls].label,
        highlightClass: cls,
        isDimmed: selectedAiClass ? cls !== selectedAiClass : false
      };
    });
  }, [simTab, selectedSkuName, totalRev, selectedAiClass, locationFilteredSkus]);

  // Scatter chart data
  const matrixScatterData = useMemo(() => {
    return locationFilteredSkus.map(s => {
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
  }, [selectedAiClass, locationFilteredSkus]);

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
    const s = locationFilteredSkus.find(item => item.name === skuA);
    return s ? s.cat : 'Beverages';
  }, [skuA, locationFilteredSkus]);

  const skuBOptions = useMemo(() => {
    return locationFilteredSkus.filter(s => s.cat === skuACategory && s.name !== skuA);
  }, [skuACategory, skuA, locationFilteredSkus]);

  useEffect(() => {
    if (locationFilteredSkus.length > 0 && !locationFilteredSkus.some(s => s.name === skuA)) {
      setSkuA(locationFilteredSkus[0].name);
    }
  }, [locationFilteredSkus, skuA]);

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
    return [...locationFilteredSkus]
      .sort((a, b) => b.promo - a.promo)
      .slice(0, 10)
      .map(s => ({
        name: s.name,
        promoPct: Math.round(s.promo * 100),
        fill: s.promo > 0.5 ? '#ef4444' : s.promo > 0.35 ? '#f59e0b' : '#10b981'
      }));
  }, [locationFilteredSkus]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-zinc-800 dark:text-white">
      
      {/* Consolidated Toolbar Header */}
      {role === 'VP Product Management' ? (
        <div className={`p-4 rounded-xl flex flex-col gap-4 w-full border transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-[#202022] border-[#2c2c30] text-white shadow-lg' 
            : 'bg-white border-black/10 text-zinc-800 shadow-sm'
        }`}>
          {/* Top Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className={`text-base font-display font-extrabold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>SKU Rationalization</h2>
              <p className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 transition-colors duration-200 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Category assortment workspace · Tab 4 of 6</p>
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* Region Select */}
              <div className={`flex items-center gap-1.5 bg-transparent border rounded-lg px-2.5 py-1 transition-colors duration-200 ${
                isDarkMode ? 'border-zinc-700 text-zinc-300' : 'border-zinc-300 text-zinc-700'
              }`}>
                <MapPin size={11} className={isDarkMode ? 'text-zinc-450' : 'text-zinc-500'} />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className={`bg-transparent border-none text-[10px] font-bold outline-none cursor-pointer focus:ring-0 py-0 pr-8 transition-colors duration-200 ${
                    isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
                  }`}
                  style={{ background: 'transparent' }}
                >
                  <option value="ALL" className={isDarkMode ? 'bg-[#202022] text-white' : 'bg-white text-zinc-800'}>All regions</option>
                  <option value="APAC" className={isDarkMode ? 'bg-[#202022] text-white' : 'bg-white text-zinc-800'}>APAC</option>
                  <option value="EMEA" className={isDarkMode ? 'bg-[#202022] text-white' : 'bg-white text-zinc-800'}>EMEA</option>
                  <option value="Americas" className={isDarkMode ? 'bg-[#202022] text-white' : 'bg-white text-zinc-800'}>Americas</option>
                </select>
              </div>

              {/* Active Sync Badge */}
              <div className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-lg shrink-0 border transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-[#e6fcf5] text-[#0ca678] border-[#c3fae8]'
              }`}>
                <Check size={11} className="stroke-[3]" />
                <span>Active sync</span>
              </div>
            </div>
          </div>

          {/* Separator line */}
          <div className={`h-px w-full transition-colors duration-200 ${isDarkMode ? 'bg-[#2c2c30]' : 'bg-black/10'}`} />

          {/* Bottom Row: Tab Navigation */}
          <div className="flex gap-4 items-center">
            <button
              onClick={() => {
                setActiveView('simulator');
                setSelectedAiClass(null);
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg border-none cursor-pointer transition-all ${
                activeView === 'simulator'
                  ? 'bg-[#5850ec] text-white shadow-sm'
                  : `bg-transparent transition-colors duration-200 ${isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800'}`
              }`}
            >
              Portfolio simulator
            </button>
            <button
              onClick={() => {
                setActiveView('analyst');
                setSelectedAiClass(null);
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg border-none cursor-pointer transition-all ${
                activeView === 'analyst'
                  ? 'bg-[#5850ec] text-white shadow-sm'
                  : `bg-transparent transition-colors duration-200 ${isDarkMode ? 'text-zinc-450 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800'}`
              }`}
            >
              Cannibalization & promo
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-3 rounded shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
          
          {/* Left Side: Title & Info Tooltip */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto">
            <div className="w-1.5 h-6 bg-acies-yellow rounded-full shrink-0 animate-pulse" />
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-[12px] font-display font-extrabold uppercase tracking-wider text-acies-gray dark:text-white leading-none">
                  {activeView === 'simulator' 
                    ? 'SKU Rationalization Command Desk' 
                    : 'Cannibalization & Margin Audit'}
                </h2>
                {/* Info Icon Tooltip */}
                <div className="relative group/help">
                  <HelpCircle size={12} className="text-zinc-400 hover:text-acies-yellow transition-colors cursor-help shrink-0" />
                  <div className="absolute left-0 top-5 w-64 bg-zinc-900 border border-white/10 text-white text-[9px] p-2.5 rounded shadow-2xl z-50 pointer-events-none opacity-0 group-hover/help:opacity-100 transition-opacity duration-200 leading-relaxed">
                    <p className="font-bold mb-1 text-acies-yellow">
                      {activeView === 'simulator' ? 'Simulation Workspace Guide:' : 'Audit Analyst Guide:'}
                    </p>
                    <p className="opacity-85">
                      {activeView === 'simulator'
                        ? 'Audit product assortments using AI segmentation, run multi-variable gross margin simulations, and analyze Pareto distributions to optimize tail-end catalog complexity.'
                        : 'Model cross-product cannibalization coefficients, evaluate price-pack margin elasticity corridors, and identify high promotion dependency risks.'}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Category Assortment Workspace · Tab 4 of 6</p>
            </div>
          </div>

          {/* Center: View Switcher */}
          <div className="flex bg-black/5 dark:bg-white/5 p-0.5 rounded border border-black/5 dark:border-white/10 min-w-[340px]">
            {[
              { id: 'simulator', label: 'Portfolio Simulator Command' },
              { id: 'analyst', label: 'Cannibalization & Promo Analyst' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveView(tab.id as any);
                  setSelectedAiClass(null);
                }}
                className={`flex-1 py-1.5 text-[8.5px] font-bold uppercase tracking-wider rounded-sm transition-all border-none cursor-pointer text-center outline-none ${
                  activeView === tab.id
                    ? 'bg-acies-yellow text-white dark:text-acies-gray font-extrabold shadow-sm shadow-black/10'
                    : 'bg-transparent text-zinc-555 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Side: Ledger Sync State & Location Selector */}
          <div className="flex items-center gap-4 self-end lg:self-auto flex-wrap justify-end">
            {/* Location Selector */}
            <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded border border-black/5 dark:border-white/10 shrink-0">
              <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">Region:</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent border-none text-[8.5px] font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 outline-none cursor-pointer focus:ring-0 py-0"
                style={{ background: 'transparent' }}
              >
                <option value="ALL" className="bg-white dark:bg-zinc-800 text-black dark:text-white">All Regions</option>
                <option value="APAC" className="bg-white dark:bg-zinc-800 text-black dark:text-white">APAC</option>
                <option value="EMEA" className="bg-white dark:bg-zinc-800 text-black dark:text-white">EMEA</option>
                <option value="Americas" className="bg-white dark:bg-zinc-800 text-black dark:text-white">Americas</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-black uppercase tracking-wider rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active Ledger Sync
              </span>
              <span className="text-[9px] font-mono opacity-40 font-bold">Refreshed {refreshTime}</span>
            </div>
          </div>

        </div>
      )}

      {/* KPI Cards Strip */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${role === 'VP Product Management' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-3`}>
        {kpis.map((kpi) => (
          <KPICard 
            key={kpi.label}
            kpi={kpi} 
            role={role} 
            onAuditClick={() => setActiveKpiAction(kpi.label)}
          />
        ))}
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* WORKSPACE VIEW 1: STRATEGIC SIMULATOR VIEW                             */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeView === 'simulator' && (
        <div className="space-y-6">
          
          <SegmentFilters
            groups={groups}
            selectedAiClass={selectedAiClass}
            setSelectedAiClass={setSelectedAiClass}
          />

          <ValueComplexitySection
            matrixScatterData={matrixScatterData}
            rankedPriorities={rankedPriorities}
            selectedAiClass={selectedAiClass}
            setSelectedSkuName={setSelectedSkuName}
            setSimTab={setSimTab}
            setSelectedSkuDetails={setSelectedSkuDetails}
            isDarkMode={isDarkMode}
            gridStroke={gridStroke}
            tickColor={tickColor}
            tooltipBg={tooltipBg}
            tooltipBorder={tooltipBorder}
            tooltipText={tooltipText}
          />

          <PLSimulatorSection
            simTab={simTab}
            setSimTab={setSimTab}
            selectedSkuName={selectedSkuName}
            setSelectedSkuName={setSelectedSkuName}
            skusByCategory={skusByCategory}
            setSelectedSkuDetails={setSelectedSkuDetails}
            priceChange={priceChange}
            setPriceChange={setPriceChange}
            volumeElasticity={volumeElasticity}
            setVolumeElasticity={setVolumeElasticity}
            projectedRevenue={projectedRevenue}
            setProjectedRevenue={setProjectedRevenue}
            expectedMargin={expectedMargin}
            setExpectedMargin={setExpectedMargin}
            cannibalizationRisk={cannibalizationRisk}
            setCannibalizationRisk={setCannibalizationRisk}
            handleRunSim={handleRunSim}
            isSimulating={isSimulating}
            btnText={btnText}
            selectedSku={selectedSku}
            removeRevImpact={removeRevImpact}
            removeMarginImpact={removeMarginImpact}
            removeCustImpact={removeCustImpact}
            removeScImpact={removeScImpact}
            volChange={volChange}
            newRev={newRev}
            revDelta={revDelta}
            newMargin={newMargin}
            cannRiskLabel={cannRiskLabel}
            netLaunchRev={netLaunchRev}
            paretoData={paretoData}
            totalRev={totalRev}
            selectedAiClass={selectedAiClass}
            isDarkMode={isDarkMode}
            gridStroke={gridStroke}
            tickColor={tickColor}
            tooltipBg={tooltipBg}
            tooltipBorder={tooltipBorder}
            tooltipText={tooltipText}
          />

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
            <div id="cannibalization-section" style={{ scrollMarginTop: '100px' }} className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm">
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
            <div id="promo-erosion-section" style={{ scrollMarginTop: '100px' }} className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm">
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
      <div id="product-directory-section" style={{ scrollMarginTop: '100px' }}>
        <ProductDirectory onSelectSku={(sku) => setSelectedSkuDetails(sku)} selectedLocation={selectedLocation} />
      </div>

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

      {/* KPI ACTION OPTIONS MODAL */}
      <KpiActionModal
        activeKpi={activeKpiAction}
        onClose={() => setActiveKpiAction(null)}
        setSelectedAiClass={setSelectedAiClass}
        setActiveView={setActiveView}
        setSimTab={setSimTab}
        setSelectedSkuName={setSelectedSkuName}
        setSelectedSkuDetails={(sku) => setSelectedSkuDetails(sku)}
      />

    </div>
  );
};
