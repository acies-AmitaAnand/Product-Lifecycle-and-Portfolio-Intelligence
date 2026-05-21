import React, { useState, useMemo, useEffect } from 'react';
import { Sliders, Globe, Info, ArrowLeft, ChevronRight } from 'lucide-react';
import { REGIONAL_DATA } from '../../../constants/data';

interface MarginSimulatorProps {
  onAuditClick?: (metric: string) => void;
}

interface CountryStrategy {
  originalMargin: number;
  netSalesM: number;
  skuCount: number;
  finding: string;
  recommendation: string;
  soWhat: string;
  actionPlan: string;
}

const REGIONAL_STRATEGIES: Record<string, CountryStrategy> = {
  Italy: {
    originalMargin: 38.53,
    netSalesM: 137.2,
    skuCount: 102,
    finding: "Italy drives our highest sales volume ($137.2M) but faces complexity drag from 102 SKUs.",
    recommendation: "Product line pruning of low-velocity tail.",
    soWhat: "Reduces inventory carrying overhead while preserving high-revenue SKU margins.",
    actionPlan: "Phase out the lowest-performing 15 SKUs in Italian supermarket segments."
  },
  Spain: {
    originalMargin: 38.60,
    netSalesM: 106.7,
    skuCount: 100,
    finding: "Spain shows high regional sales ($106.7M) and a strong gross margin of 38.60%.",
    recommendation: "Standardize assortment across supermarkets.",
    soWhat: "Maintains high margin while optimizing logistics and supplier routes.",
    actionPlan: "Standardize shelf assortments to focus on the top 30% margin-generating SKUs."
  },
  Germany: {
    originalMargin: 38.48,
    netSalesM: 88.5,
    skuCount: 98,
    finding: "Germany is a high volume driver ($88.5M sales) but carries a lower margin of 38.48%.",
    recommendation: "Revise price-pack architecture (PPA).",
    soWhat: "Germany volume is large; shifting margin adds significant absolute profit.",
    actionPlan: "Introduce multi-packs and restructure volume tiers for key German distributors."
  },
  France: {
    originalMargin: 38.55,
    netSalesM: 42.6,
    skuCount: 80,
    finding: "France has stable sales ($42.6M) and medium complexity at 38.55% gross margin.",
    recommendation: "Introduce premium specialty lines.",
    soWhat: "Upsells stable customer base to premium brand lines, lifting gross margins.",
    actionPlan: "Launch premium organic variants of BrandF in French hypermarkets."
  },
  Austria: {
    originalMargin: 38.64,
    netSalesM: 43.0,
    skuCount: 80,
    finding: "Austria is our benchmark regional leader at 38.64% gross margin.",
    recommendation: "Replicate discount caps and SKU lifecycle practices.",
    soWhat: "Establishes Austria as the target operational standard for all regions.",
    actionPlan: "Export Austrian promotional guidelines to Italy and Germany immediately."
  },
  Poland: {
    originalMargin: 38.36,
    netSalesM: 42.4,
    skuCount: 80,
    finding: "Poland has a low margin of 38.36% due to high promotional discount depths.",
    recommendation: "Enforce 15% cap on promotional discount depths.",
    soWhat: "Poland margins are lifted from 38.36% to mitigate trade promo leakage.",
    actionPlan: "Standardize promotional calendars and apply discount ceilings in Polish channels."
  },
  Netherlands: {
    originalMargin: 38.20,
    netSalesM: 12.5,
    skuCount: 45,
    finding: "Netherlands yields the lowest regional margin of 38.20% with only 45 SKUs.",
    recommendation: "Pricing alignment & assortment harmonization.",
    soWhat: "Netherlands margins are lifted from 38.20% toward the 38.64% Austria benchmark via pricing alignment.",
    actionPlan: "Execute assortment harmonization: introduce 15 high-margin SKU lines in Dutch stores."
  }
};

const getMarginColor = (margin: number) => {
  if (margin < 38.40) return 'red';
  if (margin < 38.60) return 'amber';
  return 'green';
};

export const MarginSimulator: React.FC<MarginSimulatorProps> = ({ onAuditClick }) => {
  // Load simulated margins from localStorage or fallback defaults
  const [simulatedMargins, setSimulatedMargins] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('acies_simulated_margins');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          const result: Record<string, number> = {};
          REGIONAL_DATA.forEach(r => {
            const val = parsed[r.country];
            const parsedVal = typeof val === 'number' ? val : parseFloat(val);
            if (!isNaN(parsedVal) && parsedVal >= r.marginPct && parsedVal <= 40.0) {
              result[r.country] = parsedVal;
            } else {
              result[r.country] = r.marginPct;
            }
          });
          return result;
        }
      }
    } catch (e) {
      console.warn("Could not load simulated margins:", e);
    }
    const defaults: Record<string, number> = {};
    REGIONAL_DATA.forEach(r => {
      defaults[r.country] = r.marginPct;
    });
    return defaults;
  });

  // Mode state: 'overview' | 'simulator'
  const [mode, setMode] = useState<'overview' | 'simulator'>(() => {
    try {
      const hash = window.location.hash || '#';
      const params = new URLSearchParams(hash.substring(1));
      const hashCountry = params.get('simCountry');
      if (hashCountry && REGIONAL_STRATEGIES[hashCountry]) {
        return 'simulator';
      }
    } catch (e) {
      console.warn("Could not load initial simulator mode from hash:", e);
    }
    return 'overview';
  });

  // Selected country state
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    try {
      const hash = window.location.hash || '#';
      const params = new URLSearchParams(hash.substring(1));
      const hashCountry = params.get('simCountry');
      if (hashCountry && REGIONAL_STRATEGIES[hashCountry]) {
        return hashCountry;
      }
      
      const savedCountry = localStorage.getItem('acies_sim_country');
      if (savedCountry && REGIONAL_STRATEGIES[savedCountry]) {
        return savedCountry;
      }
    } catch (e) {
      console.warn("Could not load initial simulator country:", e);
    }
    return 'Netherlands'; // Fallback default
  });

  const [hoveredMetric, setHoveredMetric] = useState<'savings' | 'impact' | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Sync simulatedMargins to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('acies_simulated_margins', JSON.stringify(simulatedMargins));
    } catch (e) {
      console.warn("Could not save simulated margins:", e);
    }
  }, [simulatedMargins]);

  // Sync selected country and mode to URL hash & localStorage
  useEffect(() => {
    try {
      const hash = window.location.hash || '#';
      const params = new URLSearchParams(hash.substring(1));
      
      if (mode === 'simulator') {
        params.set('simCountry', selectedCountry);
        params.set('simMargin', simulatedMargins[selectedCountry].toFixed(2));
        localStorage.setItem('acies_sim_country', selectedCountry);
      } else {
        params.delete('simCountry');
        params.delete('simMargin');
      }
      
      const newHash = params.toString() ? '#' + params.toString() : '#';
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    } catch (e) {
      console.warn("Could not sync URL state:", e);
    }
  }, [mode, selectedCountry, simulatedMargins]);

  // Calculate original enterprise gross profit
  const originalEnterpriseData = useMemo(() => {
    let totalSales = 0;
    let totalGP = 0;
    REGIONAL_DATA.forEach(r => {
      totalSales += r.netSalesM;
      totalGP += (r.netSalesM * r.marginPct) / 100;
    });
    return { totalSales, totalGP };
  }, []);

  const simulationResults = useMemo(() => {
    // Sum the incremental GP across all countries to get the true combined portfolio impact
    let totalGPDiffM = 0;
    REGIONAL_DATA.forEach(r => {
      const origMargin = r.marginPct;
      const simMargin = simulatedMargins[r.country] ?? origMargin;
      const diffMargin = simMargin - origMargin;
      totalGPDiffM += (r.netSalesM * diffMargin) / 100;
    });

    const activeMargin = simulatedMargins[selectedCountry] ?? REGIONAL_STRATEGIES[selectedCountry].originalMargin;
    const origMargin = REGIONAL_STRATEGIES[selectedCountry].originalMargin;
    const salesM = REGIONAL_STRATEGIES[selectedCountry].netSalesM;
    const selectedGpDiffM = (salesM * (activeMargin - origMargin)) / 100;
    const selectedGpDiffDollars = selectedGpDiffM * 1_000_000;

    const simulatedTotalGP = originalEnterpriseData.totalGP + totalGPDiffM;
    const simulatedEnterpriseMargin = (simulatedTotalGP / originalEnterpriseData.totalSales) * 100;

    return {
      selectedGpDiffDollars,
      totalGpDiffM: totalGPDiffM,
      simulatedEnterpriseMargin,
    };
  }, [simulatedMargins, selectedCountry, originalEnterpriseData]);

  const activeStrategy = REGIONAL_STRATEGIES[selectedCountry];

  return (
    <div className="glass-card bg-acies-yellow/5 flex flex-col justify-between h-full relative">
      {mode === 'overview' ? (
        // OVERVIEW MODE: Regional Opportunities findings & recommendations list
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-tight">Regional Opportunities</h3>
                <p className="text-[8px] opacity-40 uppercase tracking-wider mt-0.5">Select a region to simulate impact</p>
              </div>
              <div className="flex items-center gap-1.5">
                {REGIONAL_DATA.some(r => (simulatedMargins[r.country] ?? r.marginPct) > r.marginPct) && (
                  <button
                    onClick={() => {
                      const defaults: Record<string, number> = {};
                      REGIONAL_DATA.forEach(r => { defaults[r.country] = r.marginPct; });
                      setSimulatedMargins(defaults);
                    }}
                    className="text-[7px] font-bold uppercase text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-1.5 py-0.5 rounded-sm"
                  >
                    Reset
                  </button>
                )}
                <Globe size={14} className="text-acies-yellow shrink-0" />
              </div>
            </div>

            <p className="text-[9px] opacity-65 leading-relaxed mb-3">
              Review findings and recommendations below. Click any region to act and simulate the financial return of margin lift actions.
            </p>

            <div className="space-y-0.5 max-h-[165px] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {REGIONAL_DATA.map(r => {
                const strategy = REGIONAL_STRATEGIES[r.country];
                const color = getMarginColor(r.marginPct);
                const textClass = color === 'red' ? 'text-red-500 dark:text-red-400' : color === 'amber' ? 'text-amber-500 dark:text-amber-400' : 'text-green-500 dark:text-green-400';
                const bgClass = color === 'red' ? 'bg-red-500' : color === 'amber' ? 'bg-amber-500' : 'bg-green-500';
                return (
                  <div
                    key={r.country}
                    onClick={() => {
                      setSelectedCountry(r.country);
                      setMode('simulator');
                    }}
                    className="flex items-center justify-between py-1 px-1.5 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors border-b border-black/5 dark:border-white/5 text-[9px] group"
                  >
                    <div className="flex items-center gap-1.5 min-w-[85px] shrink-0">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${bgClass}`} />
                      <div className="truncate">
                        <span className="font-bold text-acies-gray dark:text-white">{r.country}</span>
                        <span className="text-[7px] opacity-40 ml-1">({r.skuCount} SKUs)</span>
                      </div>
                    </div>
                    <div className="flex-1 px-2 text-[8px] opacity-60 truncate text-left group-hover:text-acies-yellow transition-colors">
                      {strategy.recommendation}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`font-mono font-bold ${textClass}`}>
                        {r.marginPct.toFixed(2)}%
                      </span>
                      <ChevronRight size={10} className="opacity-40 text-acies-yellow group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="pt-2 border-t border-black/5 dark:border-white/5 mt-2 flex justify-between items-center text-[7px] opacity-40 uppercase tracking-widest font-mono">
            <span>Portfolio Target: 40.00%</span>
            <span>Avg Baseline: 38.53%</span>
          </div>
        </div>
      ) : (
        // SIMULATION MODE: Interactive target margin adjustment for the selected country
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode('overview')}
                  className="text-[8px] font-bold uppercase text-acies-yellow hover:underline flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity bg-black/10 dark:bg-white/5 px-1.5 py-0.5 rounded-sm"
                >
                  <ArrowLeft size={8} />
                  Opportunities
                </button>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-black/15 dark:bg-white/5 text-acies-gray dark:text-white text-[10px] font-bold px-1.5 py-0.5 border border-black/10 dark:border-white/10 rounded-sm focus:outline-none focus:border-acies-yellow/50"
                >
                  {REGIONAL_DATA.map(r => (
                    <option key={r.country} value={r.country} className="bg-acies-gray text-white">
                      {r.country} ({r.marginPct.toFixed(2)}%)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                {onAuditClick && (
                  <button
                    onClick={() => onAuditClick('Regional Margin Simulator')}
                    className="text-[8px] font-bold uppercase text-acies-yellow hover:underline flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity bg-black/10 dark:bg-white/5 px-1.5 py-0.5"
                    title="Audit Margins & Decisions"
                  >
                    <Sliders size={8} />
                    Audit
                  </button>
                )}
                <Globe size={14} className="text-acies-yellow shrink-0" />
              </div>
            </div>

            <p className="text-[8px] opacity-40 uppercase tracking-wider mt-1 mb-1">
              {activeStrategy.recommendation}
            </p>

            <p className="text-[9px] opacity-65 leading-normal mb-3 text-acies-gray dark:text-white/85">
              {selectedCountry === 'Austria' ? (
                <span>Austria is the benchmark leader at <span className="font-bold text-green-500">38.64%</span> margin. Simulate premium SKU lines to target up to <span className="font-bold text-acies-yellow">40.00%</span>.</span>
              ) : (
                <span>{activeStrategy.finding} Adjust Pricing terms or harmonize assortment to target benchmark of <span className="font-bold text-green-500">38.64%</span>.</span>
              )}
            </p>

            {/* Slider */}
            <div className="space-y-1.5 py-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="opacity-50 font-bold">{selectedCountry} Target Margin</span>
                <span className="font-mono font-bold text-acies-yellow text-xs">
                  {simulatedMargins[selectedCountry].toFixed(2)}%
                </span>
              </div>
              <input
                type="range"
                min={activeStrategy.originalMargin.toFixed(2)}
                max="40.00"
                step="0.05"
                value={simulatedMargins[selectedCountry]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSimulatedMargins(prev => ({
                    ...prev,
                    [selectedCountry]: val
                  }));
                }}
                className="w-full accent-acies-yellow cursor-pointer h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none animate-pulse-slow"
              />
              <div className="flex justify-between text-[7px] opacity-40 uppercase font-mono">
                <span>{activeStrategy.originalMargin.toFixed(2)}% (Original)</span>
                {selectedCountry !== 'Austria' && (
                  <span className="text-green-500 font-bold">38.64% (Austria Bench)</span>
                )}
                <span>40.00% (Target)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-black/5 dark:border-white/5 pt-2 mt-2">
            <div
              className="cursor-help"
              onMouseEnter={(e) => { setHoveredMetric('savings'); setMousePos({ x: e.clientX, y: e.clientY }); }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="flex items-center gap-1 mb-0.5">
                <p className="text-[8px] opacity-40 uppercase font-bold">Regional Savings</p>
                <Info size={9} className="text-acies-yellow opacity-60" />
              </div>
              <p className="text-base font-display text-acies-yellow leading-none">
                +${(simulationResults.selectedGpDiffDollars / 1000).toFixed(1)}k
              </p>
              <p className="text-[7px] opacity-35 leading-tight mt-0.5">GP Added ({selectedCountry})</p>
            </div>
            
            <div
              className="cursor-help"
              onMouseEnter={(e) => { setHoveredMetric('impact'); setMousePos({ x: e.clientX, y: e.clientY }); }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="flex items-center gap-1 mb-0.5">
                <p className="text-[8px] opacity-40 uppercase font-bold">Enterprise Impact</p>
                <Info size={9} className="text-acies-yellow opacity-60" />
              </div>
              <p className="text-base font-display text-acies-gray dark:text-white font-mono leading-none">
                {simulationResults.simulatedEnterpriseMargin.toFixed(4)}%
              </p>
              <p className="text-[7px] opacity-35 leading-tight mt-0.5">Simulated Port. Margin</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Info Tooltip */}
      {hoveredMetric && (
        <div
          style={{
            position: 'fixed',
            left: mousePos.x + 15,
            top: mousePos.y + 15,
            zIndex: 9999,
          }}
          className="bg-acies-gray border border-white/10 text-white p-3.5 shadow-2xl pointer-events-none max-w-[260px] text-[10px] space-y-2 rounded-sm"
        >
          <div className="border-b border-white/10 pb-1.5">
            <p className="text-[7px] uppercase font-bold tracking-widest text-acies-yellow">Simulator Audit Info</p>
            <h4 className="text-xs font-display font-bold leading-tight mt-0.5">
              {hoveredMetric === 'savings' ? 'Regional Savings' : 'Enterprise Impact'}
            </h4>
          </div>
          <div className="space-y-1.5">
            <div>
              <span className="text-[7px] font-bold uppercase tracking-wider text-red-400 block">So What?</span>
              <p className="opacity-80 leading-relaxed font-body">
                {hoveredMetric === 'savings' 
                  ? activeStrategy.soWhat
                  : `Simulates the overall portfolio gross margin change. All simulated regional adjustments combined add +$${(simulationResults.totalGpDiffM * 1000).toFixed(1)}k to enterprise GP.`
                }
              </p>
            </div>
            <div>
              <span className="text-[7px] font-bold uppercase tracking-wider text-green-400 block">Action Plan</span>
              <p className="text-acies-yellow opacity-90 leading-relaxed font-body font-medium">
                {hoveredMetric === 'savings'
                  ? activeStrategy.actionPlan
                  : 'Replicate regional pricing corridors and assortment guidelines across all low-performing countries.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
