import React from 'react';
import { X, Zap, Brain, TrendingUp, Sparkles, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface AIPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionType: 'stockout' | 'elasticity' | 'margin' | 'demand' | null;
}

export const AIPredictionModal: React.FC<AIPredictionModalProps> = ({ isOpen, onClose, predictionType }) => {
  if (!isOpen || !predictionType) return null;

  // Render properties depending on selected type
  const getModalContent = () => {
    switch (predictionType) {
      case 'stockout':
        return {
          title: 'Stockout Risk Assessment',
          category: 'Stockout Warning',
          categoryColor: 'text-red-500 bg-red-500/10 border-red-500/20',
          confidenceLabel: 'Confidence Score',
          confidenceValue: '92% Prob.',
          targetName: 'BrandA Premium Energy (Drink)',
          detailText: 'Stock exhaustion likely in 12 days due to surge in Q2 APAC demand.',
          whyDrivers: [
            { label: 'APAC Volume Surge', desc: 'Q2 regional demand trends show a sharp 18% YoY volume spike.' },
            { label: 'Critically Low Buffer', desc: 'Sourcing buffers at the Vapi Hub are down to under 5 days of safety stock.' },
            { label: 'Supplier Lead Time Lag', desc: 'Sourced active material lead time is 35 days (2.5x higher than normal benchmarks).' }
          ],
          howMethodology: {
            model: 'Hybrid LSTM (Long Short-Term Memory) Neural Network paired with an XGBoost regressor model.',
            inputs: 'Daily orders, cargo transit logs, supplier production sheets, and seasonal growth coefficients.',
            key: 'LSTM-XGB-V3.4'
          },
          recommendations: [
            { urgency: 'Immediate', bg: 'bg-emerald-500/10 text-emerald-500', title: 'Route Safety Stock', desc: 'Divert 15,000 units of domestic Western safety reserves to the APAC hub to immediately cover the 12-day stockout gap.' },
            { urgency: 'Medium-Term', bg: 'bg-blue-500/10 text-blue-500', title: 'Onboard Local Vendor', desc: 'Activate backup domestic suppliers with a shorter 10-day lead time to reduce reliance on the European supply bottleneck.' },
            { urgency: 'Strategic', bg: 'bg-purple-500/10 text-purple-500', title: 'Promo Moderation', desc: 'Temporarily scale down regional marketing campaigns to slow run-rate consumption while manufacturing catches up.' }
          ]
        };
      case 'elasticity':
        return {
          title: 'Cross-Elasticity Analysis',
          category: 'Price Elasticity',
          categoryColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
          confidenceLabel: 'Sales Impact',
          confidenceValue: '74% Impact',
          targetName: 'BrandD Yogurt Drink (Dairy)',
          detailText: 'Competitor wafers price cuts will trigger a 14% volume drop in EU.',
          whyDrivers: [
            { label: 'Competitor Price Cut', desc: 'Competitor B cut price of their Wafers line by 10% in EU supermarkets.' },
            { label: 'Cross-Promotion Elasticity', desc: 'Historical scan data shows a high cross-promotion correlation of -0.62.' },
            { label: 'Aisle Placement Overlap', desc: 'High substitution propensity observed due to shared supermarket shelf layouts.' }
          ],
          howMethodology: {
            model: 'Mixed-Effects Linear Regression pricing model coupled with a Random Forest categorization engine.',
            inputs: 'Supermarket daily scanner datasets, competitor catalog pricing indices, and regional discount calendars.',
            key: 'PRICE-ELAST-V1.8'
          },
          recommendations: [
            { urgency: 'Immediate', bg: 'bg-emerald-500/10 text-emerald-500', title: 'Trigger Bundle Promo', desc: 'Launch a pre-approved cross-category coupon bundling Yogurt with BrandC cookies to maintain shelf volume targets.' },
            { urgency: 'Medium-Term', bg: 'bg-blue-500/10 text-blue-500', title: 'Display Re-routing', desc: 'Relocate display units away from the snacks section and place them in the organic breakfast aisle to capture high-margin traffic.' },
            { urgency: 'Strategic', bg: 'bg-purple-500/10 text-purple-500', title: 'Retail Co-investment', desc: 'Partner with key grocery chains to launch a buy-one-get-one-half-off campaign funded by co-marketing budgets.' }
          ]
        };
      case 'margin':
        return {
          title: 'Margin Compression Diagnosis',
          category: 'Margin Leakage Warning',
          categoryColor: 'text-red-500 bg-red-500/10 border-red-500/20',
          confidenceLabel: 'Breach Probability',
          confidenceValue: '81% Prob.',
          targetName: 'BrandC Biscuits (Snacks)',
          detailText: 'Gross margins likely to breach the 30% hurdle threshold due to high promo dependence.',
          whyDrivers: [
            { label: 'Promo Sales Concentration', desc: 'Over 68% of BrandC Biscuits sales revenue is driven by promotional discount cycles.' },
            { label: 'Commodity Cost Inflation', desc: 'Base raw ingredient cost (organic wheat, cocoa solids) rose by 12% in Europe.' },
            { label: 'Distributor Terms Leakage', desc: 'Retailer co-investment rates are above the budgeted threshold, standing at 22% of gross sales.' }
          ],
          howMethodology: {
            model: 'Linear regression pricing elasticity model combined with a gradient boosting classifier for discount margin degradation.',
            inputs: 'Supermarket checkout logs, promotional calendars, historical margin levels, and wholesale cost sheets.',
            key: 'MARGIN-LEAK-V2.1'
          },
          recommendations: [
            { urgency: 'Immediate', bg: 'bg-emerald-500/10 text-emerald-500', title: 'Cap Co-investment', desc: 'Restructure the co-investment contract with the primary distributor to cap promotion funding at 15%.' },
            { urgency: 'Medium-Term', bg: 'bg-blue-500/10 text-blue-500', title: 'Protect Basket Margin', desc: 'Implement a new bundle pricing strategy pairing Biscuits with BrandE Organic Cheese to protect basket margin.' },
            { urgency: 'Strategic', bg: 'bg-purple-500/10 text-purple-500', title: 'Domestic Sourcing', desc: 'Transition ingredient sourcing to domestic organic growers to lower cost of goods sold (COGS) by 8%.' }
          ]
        };
      case 'demand':
      default:
        return {
          title: 'Sourcing Bottleneck Analysis',
          category: 'Demand Shift Warning',
          categoryColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
          confidenceLabel: 'Exhaustion Probability',
          confidenceValue: '88% Prob.',
          targetName: 'BrandF Eco-Pack Water (Beverages)',
          detailText: 'Sourcing capacity constraint will trigger a stockout in APAC by Q3 due to +18% demand.',
          whyDrivers: [
            { label: 'High Capacity Utilization', desc: 'Eco-friendly packaging lines are running at 94% capacity utilization with no backup lines.' },
            { label: 'Consumer Trend Shift', desc: 'Customer sentiment logs show a 14% increase in sustainability search metrics on key sites.' },
            { label: ' Finnish Sourcing Delays', desc: 'Shipping container lead times from primary paperboard suppliers in Finland increased to 45 days.' }
          ],
          howMethodology: {
            model: 'Random Forest classifier for supply chain bottleneck analysis combined with an LSTM network for forecasting.',
            inputs: 'Supply chain capacity indexes, factory runtime records, lead times, and web search trend indicators.',
            key: 'APAC-ECO-V1.2'
          },
          recommendations: [
            { urgency: 'Immediate', bg: 'bg-emerald-500/10 text-emerald-500', title: 'Onboard India Vendor', desc: 'Qualify and validate a backup regional eco-materials supplier in India within the next 15 days.' },
            { urgency: 'Medium-Term', bg: 'bg-blue-500/10 text-blue-500', title: 'Expand Line Capacity', desc: 'Install a secondary semi-automated packaging line at the Vapi Hub to raise peak throughput capacity.' },
            { urgency: 'Strategic', bg: 'bg-purple-500/10 text-purple-500', title: 'Raw Material Routing', desc: 'Re-route standard raw paper stock to the eco-pack lines to maintain manufacturing volumes.' }
          ]
        };
    }
  };

  const content = getModalContent();

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
                {content.title}
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
        <div className={`p-4 rounded border flex justify-between items-center ${content.categoryColor}`}>
          <div>
            <span className="text-[8px] font-bold uppercase tracking-widest opacity-75">Target Object</span>
            <h4 className="text-sm font-bold text-zinc-850 dark:text-white">
              {content.targetName}
            </h4>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
              {content.detailText}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[8px] font-bold uppercase tracking-widest block opacity-75">{content.confidenceLabel}</span>
            <span className="text-sm font-mono font-extrabold block">
              {content.confidenceValue}
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
            <ul className="space-y-2 text-zinc-650 dark:text-zinc-300 list-none pl-0">
              {content.whyDrivers.map((driver, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-[#6d28d9] dark:text-[#a78bfa] font-bold">•</span>
                  <span><strong>{driver.label}:</strong> {driver.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How (Methodology) */}
          <div className="space-y-2.5 p-3.5 rounded bg-zinc-50/50 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200">
              <Activity size={14} className="text-[#6d28d9] dark:text-[#a78bfa]" />
              <h5 className="font-bold uppercase tracking-wider text-[10px]">How was it calculated?</h5>
            </div>
            <div className="space-y-2 text-zinc-650 dark:text-zinc-350">
              <p>
                <strong>Algorithm Model:</strong> {content.howMethodology.model}
              </p>
              <p>
                <strong>Input Parameters:</strong> {content.howMethodology.inputs}
              </p>
              <div className="flex justify-between items-center text-[9px] font-mono border-t border-black/5 dark:border-white/10 pt-2 mt-2">
                <span className="opacity-60">MODEL KEY</span>
                <span className="font-bold text-[#6d28d9] dark:text-[#a78bfa]">{content.howMethodology.key}</span>
              </div>
            </div>
          </div>

        </div>

        {/* What should be done to make it better */}
        <div className="space-y-3 p-4 rounded bg-[#5850ec]/5 border border-[#5850ec]/15">
          <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-100">
            <Sparkles size={14} className="text-[#5850ec] dark:text-indigo-400" />
            <h5 className="font-bold uppercase tracking-wider text-[10.5px]">Recommendations: How to make it better?</h5>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-zinc-650 dark:text-zinc-300">
            {content.recommendations.map((rec, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-zinc-850 rounded border border-black/5 dark:border-white/5 space-y-1">
                <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm ${rec.bg}`}>
                  {rec.urgency}
                </span>
                <p className="font-bold text-zinc-800 dark:text-zinc-200 mt-1">{rec.title}</p>
                <p className="text-[10.5px] opacity-75 leading-relaxed">{rec.desc}</p>
              </div>
            ))}
          </div>
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
