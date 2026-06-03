import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Info, RefreshCw, BarChart2, DollarSign, RefreshCcw, FileText, CheckCircle2 } from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid, BarChart, Bar, Cell 
} from 'recharts';

export type SimulatorTab = 'pricing' | 'returns' | 'forecasting' | 'contract';

interface ForecastAccuracySimulatorProps {
  isDarkMode: boolean;
  onClose: () => void;
  initialTab?: SimulatorTab;
}

export const ForecastAccuracySimulator: React.FC<ForecastAccuracySimulatorProps> = ({
  isDarkMode,
  onClose,
  initialTab = 'forecasting'
}) => {
  const [activeTab, setActiveTab] = useState<SimulatorTab>(initialTab);

  // Sync state if initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Dynamic Theme Colors
  const gridStroke = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tickColor = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const tooltipBg = isDarkMode ? '#1e1e28' : '#ffffff';
  const tooltipBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipText = isDarkMode ? '#ffffff' : '#1f2937';

  // ==========================================
  // 1. DYNAMIC PRICING ENGINE STATE & DRIVERS
  // ==========================================
  const [priceOptimization, setPriceOptimization] = useState<number>(5); // target price optimization %
  const [elasticity, setElasticity] = useState<number>(-1.5); // elasticity multiplier
  const [skuCoverage, setSkuCoverage] = useState<number>(2400); // SKU coverage

  // Calculations for Dynamic Pricing
  const pricingGpUplift = Math.max(0, priceOptimization * 0.36);
  const pricingVolumeImpact = Math.round(priceOptimization * elasticity * 10) / 10;
  const pricingNetRecovery = (skuCoverage / 2400) * (priceOptimization * 0.12) * (1 - Math.abs(pricingVolumeImpact) * 0.05);

  const pricingChartData = [
    { name: 'Beverages', baseline: 42, optimized: 42 + priceOptimization * 0.4 },
    { name: 'Snacks', baseline: 36, optimized: 36 + priceOptimization * 0.38 },
    { name: 'Personal Care', baseline: 48, optimized: 48 + priceOptimization * 0.42 },
    { name: 'Household', baseline: 32, optimized: 32 + priceOptimization * 0.35 },
  ];

  // ==========================================
  // 2. RETURNS PROPENSITY AI STATE & DRIVERS
  // ==========================================
  const [riskThreshold, setRiskThreshold] = useState<number>(8.0);
  const [inspectionRate, setInspectionRate] = useState<number>(12);
  const [avgRefundCost, setAvgRefundCost] = useState<number>(45);

  // Calculations for Returns
  const returnsReduction = Math.max(0, 9.8 - riskThreshold);
  const returnsAuditVolume = Math.round(inspectionRate * 37.5);
  const returnsRefundPrevented = (returnsReduction / 1.8) * (avgRefundCost / 45) * 0.40;

  const returnsChartData = [
    { name: 'W1', baseline: 9.8, prevented: Math.max(5.0, 9.8 - returnsReduction * 0.2) },
    { name: 'W2', baseline: 10.2, prevented: Math.max(5.0, 10.2 - returnsReduction * 0.4) },
    { name: 'W3', baseline: 9.5, prevented: Math.max(5.0, 9.5 - returnsReduction * 0.7) },
    { name: 'W4', baseline: 9.9, prevented: Math.max(5.0, 9.9 - returnsReduction) },
  ];

  // ==========================================
  // 3. AI DEMAND FORECASTING STATE & DRIVERS
  // ==========================================
  const [currentAccuracy, setCurrentAccuracy] = useState<number>(71);
  const [aiTargetAccuracy, setAiTargetAccuracy] = useState<number>(88);
  const [inventoryAtRisk, setInventoryAtRisk] = useState<number>(1.4); // in $ Millions
  const [avgMargin, setAvgMargin] = useState<number>(34); // in %

  // Calculations for Demand Forecasting
  const accuracyGain = Math.max(0, aiTargetAccuracy - currentAccuracy);
  const overstockReduction = Math.max(0, Math.min(90, Math.round(accuracyGain * 1.765)));
  const marginRecovery = inventoryAtRisk * (overstockReduction / 100) * (avgMargin / 100) * 2.85;

  const forecastingBaseData = [
    { month: 'Jul', current: 280, optimal: 310 },
    { month: 'Aug', current: 310, optimal: 295 },
    { month: 'Sep', current: 390, optimal: 345 },
    { month: 'Oct', current: 320, optimal: 280 },
    { month: 'Nov', current: 460, optimal: 420 },
    { month: 'Dec', current: 370, optimal: 375 },
    { month: 'Jan', current: 290, optimal: 300 },
    { month: 'Feb', current: 410, optimal: 460 },
    { month: 'Mar', current: 300, optimal: 340 },
    { month: 'Apr', current: 340, optimal: 370 },
    { month: 'May', current: 410, optimal: 415 },
    { month: 'Jun', current: 420, optimal: 390 },
  ];

  const forecastingChartData = forecastingBaseData.map((d) => {
    const accuracyDelta = (aiTargetAccuracy - 50) / 50; 
    const aiVal = Math.round(d.current - (d.current - d.optimal) * accuracyDelta);
    const minVal = Math.min(d.current, aiVal);
    const maxVal = Math.max(d.current, aiVal);

    return {
      month: d.month,
      current: d.current,
      ai: aiVal,
      savingsMin: minVal,
      savingsMax: maxVal
    };
  });

  // ==========================================
  // 4. CONTRACT INTELLIGENCE STATE & DRIVERS
  // ==========================================
  const [contractsAudited, setContractsAudited] = useState<number>(340);
  const [anomalyFrequency, setAnomalyFrequency] = useState<number>(4.2);
  const [resolutionSuccess, setResolutionSuccess] = useState<number>(75);

  // Calculations for Contract Intelligence
  const contractAnomalies = Math.round(contractsAudited * (anomalyFrequency / 100));
  const contractDiscrepancyResolved = (contractsAudited / 340) * (anomalyFrequency / 4.2) * 2.4 * (resolutionSuccess / 100);
  const contractNetValue = contractDiscrepancyResolved * 0.083; // converted to $M directly

  const contractChartData = [
    { name: 'Logistics', detected: contractAnomalies * 0.4, recovered: contractAnomalies * 0.4 * (resolutionSuccess / 100) },
    { name: 'Packaging', detected: contractAnomalies * 0.3, recovered: contractAnomalies * 0.3 * (resolutionSuccess / 100) },
    { name: 'Raw Material', detected: contractAnomalies * 0.2, recovered: contractAnomalies * 0.2 * (resolutionSuccess / 100) },
    { name: 'Overhead Services', detected: contractAnomalies * 0.1, recovered: contractAnomalies * 0.1 * (resolutionSuccess / 100) },
  ];

  // Helper to reset the active simulator settings
  const handleReset = () => {
    if (activeTab === 'pricing') {
      setPriceOptimization(5);
      setElasticity(-1.5);
      setSkuCoverage(2400);
    } else if (activeTab === 'returns') {
      setRiskThreshold(8.0);
      setInspectionRate(12);
      setAvgRefundCost(45);
    } else if (activeTab === 'forecasting') {
      setCurrentAccuracy(71);
      setAiTargetAccuracy(88);
      setInventoryAtRisk(1.4);
      setAvgMargin(34);
    } else if (activeTab === 'contract') {
      setContractsAudited(340);
      setAnomalyFrequency(4.2);
      setResolutionSuccess(75);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-body pb-12 text-zinc-800 dark:text-zinc-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-50 dark:bg-[#1e1e28] border border-black/10 dark:border-white/10 rounded-xl p-4 gap-4 shadow">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-zinc-800 dark:text-white transition-all cursor-pointer border border-black/10 dark:border-white/10"
            title="Back to Dashboard"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-[8px] uppercase font-bold tracking-widest text-[#8b5cf6] dark:text-[#a78bfa]">AI OPPORTUNITIES DEEP DIVE</span>
            <h2 className="text-sm font-display font-black text-zinc-900 dark:text-white uppercase tracking-wider">
              {activeTab === 'pricing' && 'Dynamic Pricing Engine Simulator'}
              {activeTab === 'returns' && 'Returns Propensity AI Simulator'}
              {activeTab === 'forecasting' && 'Forecast Accuracy vs Overstock Savings Simulator'}
              {activeTab === 'contract' && 'Contract Sourcing Intelligence Simulator'}
            </h2>
          </div>
        </div>
        
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-800 dark:text-white text-[9.5px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow"
        >
          <RefreshCcw size={12} /> Reset Parameters
        </button>
      </div>

      {/* Simulator Tab Bar Selector */}
      <div className="flex border border-black/10 dark:border-white/10 rounded-xl overflow-hidden bg-zinc-50 dark:bg-[#161620] p-1 gap-1">
        {[
          { id: 'pricing', label: 'Dynamic Pricing', icon: <DollarSign size={14} /> },
          { id: 'returns', label: 'Returns Propensity', icon: <RefreshCw size={14} /> },
          { id: 'forecasting', label: 'Demand Forecasting', icon: <BarChart2 size={14} /> },
          { id: 'contract', label: 'Contract Audit', icon: <FileText size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SimulatorTab)}
            className={`flex items-center justify-center gap-2 flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer border-none ${activeTab === tab.id ? 'bg-[#8b5cf6] dark:bg-[#a78bfa] text-white dark:text-black shadow-md' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sliders and Metric Cards */}
        <div className="lg:col-span-5 bg-white dark:bg-[#161620] border border-black/10 dark:border-white/5 rounded-xl p-6 flex flex-col justify-between space-y-6 shadow-md dark:shadow-xl">
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-white mb-1">Adjust your parameters to model the impact</h3>
              <p className="text-[10px] text-zinc-550 dark:text-zinc-500 font-medium">Drag the sliders to see simulated margin recovery in real-time</p>
            </div>

            {/* Sliders Container */}
            <div className="space-y-5">
              
              {/* TAB 1: DYNAMIC PRICING SLIDERS */}
              {activeTab === 'pricing' && (
                <>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">Target price optimization</span>
                      <span className="font-mono text-zinc-900 dark:text-white text-xs">+{priceOptimization}%</span>
                    </div>
                    <input 
                      type="range" min="-10" max="20" step="1"
                      value={priceOptimization} 
                      onChange={(e) => setPriceOptimization(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#8b5cf6] dark:accent-[#a78bfa]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">Expected Volume Elasticity</span>
                      <span className="font-mono text-zinc-900 dark:text-white text-xs">{elasticity}x</span>
                    </div>
                    <input 
                      type="range" min="-3.0" max="-0.5" step="0.1"
                      value={elasticity} 
                      onChange={(e) => setElasticity(parseFloat(e.target.value))}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500 dark:accent-sky-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">Applicable SKU Coverage</span>
                      <span className="font-mono text-zinc-900 dark:text-white text-xs">{skuCoverage} SKUs</span>
                    </div>
                    <input 
                      type="range" min="500" max="5000" step="100"
                      value={skuCoverage} 
                      onChange={(e) => setSkuCoverage(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* TAB 2: RETURNS PROPENSITY SLIDERS */}
              {activeTab === 'returns' && (
                <>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">Returns Risk Trigger Threshold</span>
                      <span className="font-mono text-zinc-900 dark:text-white text-xs">{riskThreshold.toFixed(1)}%</span>
                    </div>
                    <input 
                      type="range" min="5.0" max="15.0" step="0.5"
                      value={riskThreshold} 
                      onChange={(e) => setRiskThreshold(parseFloat(e.target.value))}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">Manual inspection rate</span>
                      <span className="font-mono text-zinc-900 dark:text-white text-xs">{inspectionRate}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="50" step="2"
                      value={inspectionRate} 
                      onChange={(e) => setInspectionRate(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#8b5cf6] dark:accent-[#a78bfa]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">Avg Refund Cost ($)</span>
                      <span className="font-mono text-zinc-900 dark:text-white text-xs">${avgRefundCost}</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" step="5"
                      value={avgRefundCost} 
                      onChange={(e) => setAvgRefundCost(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500 dark:accent-sky-400"
                    />
                  </div>
                </>
              )}

              {/* TAB 3: DEMAND FORECASTING SLIDERS */}
              {activeTab === 'forecasting' && (
                <>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">Current forecast accuracy</span>
                      <span className="font-mono text-zinc-900 dark:text-white text-xs">{currentAccuracy}%</span>
                    </div>
                    <input 
                      type="range" min="50" max="95" step="1"
                      value={currentAccuracy} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCurrentAccuracy(val);
                        if (val > aiTargetAccuracy) {
                          setAiTargetAccuracy(val);
                        }
                      }}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#8b5cf6] dark:accent-[#a78bfa]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">AI target accuracy</span>
                      <span className="font-mono text-zinc-900 dark:text-white text-xs">{aiTargetAccuracy}%</span>
                    </div>
                    <input 
                      type="range" min="55" max="100" step="1"
                      value={aiTargetAccuracy} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setAiTargetAccuracy(Math.max(val, currentAccuracy));
                      }}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">Inventory at risk ($M)</span>
                      <span className="font-mono text-zinc-900 dark:text-white text-xs">${inventoryAtRisk.toFixed(1)}M</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="5.0" step="0.1"
                      value={inventoryAtRisk} 
                      onChange={(e) => setInventoryAtRisk(parseFloat(e.target.value))}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500 dark:accent-sky-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">Avg margin on at-risk SKUs</span>
                      <span className="font-mono text-zinc-900 dark:text-white text-xs">{avgMargin}%</span>
                    </div>
                    <input 
                      type="range" min="15" max="60" step="1"
                      value={avgMargin} 
                      onChange={(e) => setAvgMargin(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </>
              )}

              {/* TAB 4: CONTRACT AUDIT SLIDERS */}
              {activeTab === 'contract' && (
                <>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">NLP Sourcing Audit Depth</span>
                      <span className="font-mono text-zinc-900 dark:text-white text-xs">{contractsAudited} contracts</span>
                    </div>
                    <input 
                      type="range" min="50" max="1000" step="50"
                      value={contractsAudited} 
                      onChange={(e) => setContractsAudited(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#8b5cf6] dark:accent-[#a78bfa]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">Detected Anomaly Frequency</span>
                      <span className="font-mono text-zinc-900 dark:text-white text-xs">{anomalyFrequency.toFixed(1)}%</span>
                    </div>
                    <input 
                      type="range" min="1.0" max="10.0" step="0.2"
                      value={anomalyFrequency} 
                      onChange={(e) => setAnomalyFrequency(parseFloat(e.target.value))}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500 dark:accent-sky-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">Recovery Resolution Success</span>
                      <span className="font-mono text-zinc-900 dark:text-white text-xs">{resolutionSuccess}%</span>
                    </div>
                    <input 
                      type="range" min="50" max="100" step="5"
                      value={resolutionSuccess} 
                      onChange={(e) => setResolutionSuccess(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-655 dark:accent-emerald-500"
                    />
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-black/10 dark:border-white/5">
            
            {/* CARD 1 */}
            <div className="p-3 bg-zinc-50 dark:bg-white/[0.02] border border-black/10 dark:border-white/5 rounded-lg flex flex-col justify-between h-20 shadow">
              <span className="text-[7.5px] font-bold uppercase tracking-widest text-zinc-550 dark:text-zinc-500">
                {activeTab === 'pricing' && 'GP% UPLIFT'}
                {activeTab === 'returns' && 'RETURN REDUCTION'}
                {activeTab === 'forecasting' && 'ACCURACY GAIN'}
                {activeTab === 'contract' && 'ANOMALIES FOUND'}
              </span>
              <p className="text-base font-display font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                {activeTab === 'pricing' && `+${pricingGpUplift.toFixed(2)}pp`}
                {activeTab === 'returns' && `-${returnsReduction.toFixed(1)}pp`}
                {activeTab === 'forecasting' && `+${accuracyGain}pp`}
                {activeTab === 'contract' && `${contractAnomalies} items`}
              </p>
            </div>

            {/* CARD 2 */}
            <div className="p-3 bg-zinc-50 dark:bg-white/[0.02] border border-black/10 dark:border-white/5 rounded-lg flex flex-col justify-between h-20 shadow">
              <span className="text-[7.5px] font-bold uppercase tracking-widest text-zinc-555 dark:text-zinc-500">
                {activeTab === 'pricing' && 'DEMAND IMPACT'}
                {activeTab === 'returns' && 'AUDIT VOLUME'}
                {activeTab === 'forecasting' && 'OVERSTOCK REDUCTION'}
                {activeTab === 'contract' && 'DISCREPANCY RESOLVED'}
              </span>
              <p className={`text-base font-display font-black font-mono mt-1 ${activeTab === 'pricing' ? 'text-rose-500 dark:text-rose-400' : 'text-teal-650 dark:text-teal-400'}`}>
                {activeTab === 'pricing' && `${pricingVolumeImpact}%`}
                {activeTab === 'returns' && `${returnsAuditVolume}/mo`}
                {activeTab === 'forecasting' && `${overstockReduction}%`}
                {activeTab === 'contract' && `₹${contractDiscrepancyResolved.toFixed(1)}Cr`}
              </p>
            </div>

            {/* CARD 3 */}
            <div className="p-3 bg-zinc-50 dark:bg-white/[0.02] border border-black/10 dark:border-white/5 rounded-lg flex flex-col justify-between h-20 shadow">
              <span className="text-[7.5px] font-bold uppercase tracking-widest text-zinc-555 dark:text-zinc-500">
                {activeTab === 'pricing' && 'NET RECOVERY'}
                {activeTab === 'returns' && 'LOSS PREVENTED'}
                {activeTab === 'forecasting' && 'MARGIN RECOVERY'}
                {activeTab === 'contract' && 'NET VALUE'}
              </span>
              <p className="text-base font-display font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                {activeTab === 'pricing' && `$${pricingNetRecovery.toFixed(2)}M`}
                {activeTab === 'returns' && `$${returnsRefundPrevented.toFixed(2)}M`}
                {activeTab === 'forecasting' && `$${marginRecovery.toFixed(2)}M`}
                {activeTab === 'contract' && `$${contractNetValue.toFixed(2)}M`}
              </p>
            </div>

          </div>

        </div>

        {/* Right Column: High-fidelity Recharts Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-[#161620] border border-black/10 dark:border-white/5 rounded-xl p-6 flex flex-col shadow-md dark:shadow-xl">
          
          {/* Chart Header & Legend */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <BarChart2 size={12} className="text-[#8b5cf6] dark:text-[#a78bfa]" /> 
                {activeTab === 'pricing' && 'Gross Margin % Comparison'}
                {activeTab === 'returns' && 'Weekly Return Rates (%)'}
                {activeTab === 'forecasting' && 'Annual Inventory Profile (Units)'}
                {activeTab === 'contract' && 'NLP Billing Audit Anomalies ($K)'}
              </span>
            </div>
            
            {/* Custom Legend to match Mockup */}
            <div className="flex items-center gap-4 text-[10px] font-bold">
              {activeTab === 'forecasting' ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-0.5 bg-blue-500" />
                    <span className="text-zinc-550 dark:text-zinc-400">Current model</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-0.5 bg-emerald-500" />
                    <span className="text-zinc-550 dark:text-zinc-400">AI model</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-2.5 bg-emerald-550/10 dark:bg-emerald-500/10 border border-dashed border-emerald-500/20 rounded-sm" />
                    <span className="text-zinc-555 dark:text-zinc-450">Savings zone</span>
                  </div>
                </>
              ) : activeTab === 'pricing' ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-zinc-300 dark:bg-zinc-650 rounded-sm" />
                    <span className="text-zinc-550 dark:text-zinc-400">Baseline GP%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-[#8b5cf6] dark:bg-[#a78bfa] rounded-sm" />
                    <span className="text-zinc-550 dark:text-zinc-400">Optimized GP%</span>
                  </div>
                </>
              ) : activeTab === 'returns' ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-0.5 bg-rose-500" />
                    <span className="text-zinc-550 dark:text-zinc-400">Baseline Return%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-0.5 bg-emerald-500" />
                    <span className="text-zinc-550 dark:text-zinc-400">Prevented Return%</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-2.5 bg-red-500/20 border border-red-500/30 rounded-sm" />
                    <span className="text-zinc-550 dark:text-zinc-400">Detected Anomalies</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-sm" />
                    <span className="text-zinc-550 dark:text-zinc-400">Recovered Value</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Chart Wrapper */}
          <div className="h-72 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'forecasting' ? (
                <ComposedChart data={forecastingChartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={isDarkMode ? 0.15 : 0.25} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 8 }} axisLine={false} tickLine={false} />
                  <YAxis 
                    tick={{ fill: tickColor, fontSize: 8 }} 
                    axisLine={false} 
                    tickLine={false} 
                    domain={[260, 460]}
                    ticks={[260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460]}
                    tickFormatter={(val) => `${val} u`}
                  />
                  
                  <Tooltip 
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                    itemStyle={{ fontSize: 9.5 }}
                  />

                  {/* Savings Zone Range Area */}
                  <Area 
                    type="monotone" 
                    dataKey="savingsMax" 
                    baseValue={"savingsMin" as any}
                    stroke="none" 
                    fill="url(#savingsGrad)" 
                    name="Savings zone"
                  />

                  {/* Current Model Line */}
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    name="Current model" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={false}
                  />

                  {/* AI Model Line */}
                  <Line 
                    type="monotone" 
                    dataKey="ai" 
                    name="AI model" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    strokeDasharray="3 3"
                    dot={false}
                  />
                </ComposedChart>
              ) : activeTab === 'pricing' ? (
                <BarChart data={pricingChartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 8 }} axisLine={false} tickLine={false} />
                  <YAxis 
                    tick={{ fill: tickColor, fontSize: 8 }} 
                    axisLine={false} 
                    tickLine={false}
                    domain={[0, 60]}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }} />
                  <Bar dataKey="baseline" name="Baseline GP%" fill={isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'} radius={[2, 2, 0, 0]} barSize={20} />
                  <Bar dataKey="optimized" name="Optimized GP%" fill={isDarkMode ? '#a78bfa' : '#8b5cf6'} radius={[2, 2, 0, 0]} barSize={20} />
                </BarChart>
              ) : activeTab === 'returns' ? (
                <ComposedChart data={returnsChartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 8 }} axisLine={false} tickLine={false} />
                  <YAxis 
                    tick={{ fill: tickColor, fontSize: 8 }} 
                    axisLine={false} 
                    tickLine={false}
                    domain={[0, 12]}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }} />
                  <Line type="monotone" dataKey="baseline" name="Baseline Return%" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="prevented" name="Prevented Return%" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              ) : (
                <BarChart data={contractChartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 8 }} axisLine={false} tickLine={false} />
                  <YAxis 
                    tick={{ fill: tickColor, fontSize: 8 }} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }} />
                  <Bar dataKey="detected" name="Detected Anomalies" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth={1} radius={[2, 2, 0, 0]} barSize={20} />
                  <Bar dataKey="recovered" name="Recovered Value" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth={1} radius={[2, 2, 0, 0]} barSize={20} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-lg flex items-start gap-2.5">
            <Info size={14} className="text-[#8b5cf6] dark:text-[#a78bfa] shrink-0 mt-0.5" />
            <p className="text-[9.5px] text-zinc-550 dark:text-zinc-500 font-medium leading-relaxed">
              {activeTab === 'pricing' && 'Dynamic Pricing Engine optimizes localized SKU margin targets based on buyer price elasticity models. Real-time target settings lift margins without impacting overall unit volume retention thresholds.'}
              {activeTab === 'returns' && 'Returns Propensity AI monitors order risk signals pre-fulfillment. Flagging high-probability return items saves freight forwarding logistics costs, processing overhead, and warehouse markdown losses.'}
              {activeTab === 'forecasting' && 'The shaded area represents the overstock inventory units saved annually. Smoother scheduling and advanced demand sensing reduce peak safety stock targets and raw materials buffering by aligning supply with actual forecast velocity.'}
              {activeTab === 'contract' && 'Contract Intelligence reviews invoicing line items against historical agreements using NLP search. Detecting billing anomalies and overcharges automatically creates recovery claims reports for vendors.'}
            </p>
          </div>

        </div>
        
      </div>
      
    </div>
  );
};
