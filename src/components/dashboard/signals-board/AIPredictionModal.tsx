import React from 'react';
import { X, Zap, Brain, TrendingUp, Sparkles, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface AIPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionType: 'stockout' | 'elasticity' | null;
}

export const AIPredictionModal: React.FC<AIPredictionModalProps> = ({ isOpen, onClose, predictionType }) => {
  if (!isOpen || !predictionType) return null;

  const isStockout = predictionType === 'stockout';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 p-6 rounded shadow-2xl flex flex-col gap-5 text-xs max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-black/15 dark:border-white/15 pb-3">
          <div className="flex items-center gap-2 text-[#6d28d9] dark:text-[#a78bfa]">
            <Brain size={18} className="fill-[#6d28d9]/10" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">AI Intelligence Explainer</span>
              <h3 className="text-[15px] font-display font-bold text-zinc-800 dark:text-zinc-100 leading-tight">
                {isStockout ? 'Stockout Risk Assessment' : 'Cross-Elasticity Analysis'}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer border-none bg-transparent"
          >
            <X size={16} />
          </button>
        </div>

        {/* Hero Alert Details */}
        <div className={`p-4 rounded border flex justify-between items-center ${
          isStockout 
            ? 'bg-red-500/5 border-red-500/20 text-red-500' 
            : 'bg-amber-500/5 border-amber-500/20 text-amber-500'
        }`}>
          <div>
            <span className="text-[8px] font-bold uppercase tracking-widest opacity-75">Target Object</span>
            <h4 className="text-sm font-bold text-zinc-850 dark:text-white">
              {isStockout ? 'BrandA Premium Energy (Drink)' : 'BrandD Yogurt Drink (Dairy)'}
            </h4>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
              {isStockout 
                ? 'Stock exhaustion likely in 12 days due to surge in Q2 APAC demand.' 
                : 'Competitor wafers price cuts will trigger a 14% volume drop in EU.'}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[8px] font-bold uppercase tracking-widest block opacity-75">Confidence / Impact</span>
            <span className="text-sm font-mono font-extrabold block">
              {isStockout ? '92% Prob.' : '74% Impact'}
            </span>
          </div>
        </div>

        {/* Explanation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Why (Underlying Drivers) */}
          <div className="space-y-2.5 p-3.5 rounded bg-zinc-50/50 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200">
              <AlertTriangle size={14} className="text-orange-500" />
              <h5 className="font-bold uppercase tracking-wider text-[10px]">Why was this predicted?</h5>
            </div>
            {isStockout ? (
              <ul className="space-y-2 text-zinc-650 dark:text-zinc-300 list-none pl-0">
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>APAC Volume Surge:</strong> Q2 regional demand trends show a sharp **18% YoY** volume spike.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Critically Low Buffer:</strong> Sourcing buffers at the Vapi Hub are down to under **5 days** of safety stock.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Supplier Lag:</strong> Sourced material lead time is **35 days** (2.5x higher than normal benchmarks).</span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-zinc-650 dark:text-zinc-300 list-none pl-0">
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong>Competitor Price Drop:</strong> Competitor B cut price of their Wafers line by **10%** in EU supermarkets.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong>Cross-Category Elasticity:</strong> Historical scan data shows a high cross-promotion correlation of **-0.62**.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong>Aisle Placement Overlap:</strong> High substitution propensity observed due to shared supermarket shelf layouts.</span>
                </li>
              </ul>
            )}
          </div>

          {/* How (Methodology) */}
          <div className="space-y-2.5 p-3.5 rounded bg-zinc-50/50 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200">
              <Activity size={14} className="text-[#6d28d9] dark:text-[#a78bfa]" />
              <h5 className="font-bold uppercase tracking-wider text-[10px]">How was it calculated?</h5>
            </div>
            {isStockout ? (
              <div className="space-y-2 text-zinc-650 dark:text-zinc-350">
                <p>
                  <strong>Algorithm Model:</strong> A hybrid LSTM (Long Short-Term Memory) Recurrent Neural Network paired with an XGBoost regressor model for time-series forecasting.
                </p>
                <p>
                  <strong>Input Parameters:</strong> Analyzes raw regional daily orders, active cargo transit logs, supplier production indicators, and seasonal growth coefficients.
                </p>
                <div className="flex justify-between items-center text-[9px] font-mono border-t border-black/5 dark:border-white/10 pt-2 mt-2">
                  <span className="opacity-60">MODEL KEY</span>
                  <span className="font-bold text-[#6d28d9] dark:text-[#a78bfa]">LSTM-XGB-V3.4</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-zinc-650 dark:text-zinc-350">
                <p>
                  <strong>Algorithm Model:</strong> Mixed-Effects Linear Regression pricing model coupled with a Random Forest categorization engine.
                </p>
                <p>
                  <strong>Input Parameters:</strong> Scans regional retail cashier datasets, competitor catalog pricing indices, coupon usage histories, and local product volume elasticities.
                </p>
                <div className="flex justify-between items-center text-[9px] font-mono border-t border-black/5 dark:border-white/10 pt-2 mt-2">
                  <span className="opacity-60">MODEL KEY</span>
                  <span className="font-bold text-[#6d28d9] dark:text-[#a78bfa]">PRICE-ELAST-V1.8</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* What should be done to make it better */}
        <div className="space-y-3 p-4 rounded bg-[#5850ec]/5 border border-[#5850ec]/15">
          <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-100">
            <Sparkles size={14} className="text-[#5850ec] dark:text-indigo-400" />
            <h5 className="font-bold uppercase tracking-wider text-[10.5px]">Recommendations: How to make it better?</h5>
          </div>
          {isStockout ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-zinc-650 dark:text-zinc-300">
              <div className="p-3 bg-white dark:bg-zinc-850 rounded border border-black/5 dark:border-white/5 space-y-1">
                <span className="text-[8px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-sm">Immediate</span>
                <p className="font-bold text-zinc-800 dark:text-zinc-200 mt-1">Route Safety Stock</p>
                <p className="text-[10.5px] opacity-75 leading-relaxed">Divert 15,000 units of domestic Western safety reserves to the APAC hub to immediately cover the 12-day stockout gap.</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-850 rounded border border-black/5 dark:border-white/5 space-y-1">
                <span className="text-[8px] font-extrabold uppercase bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded-sm">Medium-Term</span>
                <p className="font-bold text-zinc-800 dark:text-zinc-200 mt-1">Onboard Local Vendor</p>
                <p className="text-[10.5px] opacity-75 leading-relaxed">Activate backup domestic suppliers with a shorter 10-day lead time to reduce reliance on the European supply bottleneck.</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-850 rounded border border-black/5 dark:border-white/5 space-y-1">
                <span className="text-[8px] font-extrabold uppercase bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded-sm">Strategic</span>
                <p className="font-bold text-zinc-800 dark:text-zinc-200 mt-1">Promo Moderation</p>
                <p className="text-[10.5px] opacity-75 leading-relaxed">Temporarily scale down regional marketing campaigns to slow run-rate consumption while manufacturing catches up.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-zinc-650 dark:text-zinc-300">
              <div className="p-3 bg-white dark:bg-zinc-850 rounded border border-black/5 dark:border-white/5 space-y-1">
                <span className="text-[8px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-sm">Immediate</span>
                <p className="font-bold text-zinc-800 dark:text-zinc-200 mt-1">Trigger Bundle Promo</p>
                <p className="text-[10.5px] opacity-75 leading-relaxed">Launch a pre-approved cross-category coupon bundling Yogurt with BrandC cookies to maintain shelf volume targets.</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-850 rounded border border-black/5 dark:border-white/5 space-y-1">
                <span className="text-[8px] font-extrabold uppercase bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded-sm">Medium-Term</span>
                <p className="font-bold text-zinc-800 dark:text-zinc-200 mt-1">Display Re-routing</p>
                <p className="text-[10.5px] opacity-75 leading-relaxed">Relocate display units away from the snacks section and place them in the organic breakfast aisle to capture high-margin traffic.</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-850 rounded border border-black/5 dark:border-white/5 space-y-1">
                <span className="text-[8px] font-extrabold uppercase bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded-sm">Strategic</span>
                <p className="font-bold text-zinc-800 dark:text-zinc-200 mt-1">Retail Co-investment</p>
                <p className="text-[10.5px] opacity-75 leading-relaxed">Partner with key grocery chains to launch a buy-one-get-one-half-off campaign funded by co-marketing budgets.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-black/15 dark:border-white/15 pt-3.5">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono font-bold">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span>AI EXPLAINABILITY ONLINE</span>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-acies-gray hover:bg-acies-yellow hover:text-acies-gray text-white text-[9px] font-extrabold uppercase tracking-widest rounded-sm transition-all cursor-pointer border-none"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
