/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, AlertTriangle, Info, ShieldAlert, TrendingDown, DollarSign, Activity, FileText, CheckCircle2 
} from 'lucide-react';

interface AlertData {
  id: string;
  sev: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
}

interface AlertDetailContext {
  impact: string;
  problem: string;
  metrics: { label: string; value: string }[];
  financial: string;
  recommendations: string[];
  directive: string;
}

const ALERT_DETAILS_CONTEXT: Record<string, AlertDetailContext> = {
  a1: {
    impact: 'Supply Chain Bottleneck',
    problem: 'Severe transit delays at regional ports combined with raw material shortages for key chemical surfactants have triggered seven stockout events this quarter at major enterprise accounts.',
    metrics: [
      { label: 'Current Lead Time', value: '35 Days' },
      { label: 'Target Benchmark', value: '14 Days' },
      { label: 'Safety Stock Level', value: '2 Days (Critically Low)' }
    ],
    financial: '₹1.4 Cr in estimated lost revenue due to unfulfilled purchase orders.',
    recommendations: [
      'Initiate an emergency air-freight contract for raw surfactant concentrates to rebuild safety buffers.',
      'Qualify and onboard a backup domestic supply partner to mitigate future shipping disruptions.',
      'Notify key accounts and pre-schedule split shipments to keep shelf allocation active.'
    ],
    directive: 'Approve SURFACT-2 emergency air-freight logistics override.'
  },
  a2: {
    impact: 'Margin Erosion',
    problem: 'Aggressive and prolonged trade discount schemes have trained consumers to purchase only during promotional windows. Organic, full-price sales now constitute only 28% of total volume.',
    metrics: [
      { label: 'Promotion Dependency', value: '72% of Total Sales' },
      { label: 'Actual Margin', value: '12.0% (Target: 35.0%)' },
      { label: 'Organic Purchase Rate', value: '28% (Declining)' }
    ],
    financial: '₹0.8 Cr in category profit leakage due to deep discounting reliance.',
    recommendations: [
      'Implement a two-quarter promotional phase-down schedule to stabilize pricing baselines.',
      'Transition key account promotions from single-unit price reductions to multi-pack bundle pricing.',
      'Re-invest saved trade spend into digital brand-equity marketing to restore organic appeal.'
    ],
    directive: 'Sign off on promotional discount phase-down program for Q4.'
  },
  a3: {
    impact: 'Negative Revenue Trend',
    problem: 'Despite intensive trade spend placements and promotional cycles, category revenue continues to contract. The regional Ready-To-Drink (RTD) market has reached saturation, rendering traditional discount hooks ineffective.',
    metrics: [
      { label: 'YoY Revenue Growth', value: '-4.0%' },
      { label: 'Promo Spend Delta', value: '+18.0% YoY' },
      { label: 'Category ROI', value: '-12.4% (Net Loss)' }
    ],
    financial: '₹0.5 Cr in net loss from ineffective promotional campaigns and trade allowances.',
    recommendations: [
      'Trigger a SKU rationalization review for slow-moving single-can variants (e.g. 250ml line).',
      'Pivot category marketing budget away from underperforming traditional channels to booming organic segments.',
      'Re-negotiate shelf-space minimums with distributors to support high-margin eco-friendly packaging formats.'
    ],
    directive: 'Authorize category rationalization review and marketing budget reallocation.'
  },
  a4: {
    impact: 'Product Cannibalization',
    problem: 'The newly introduced Mango Fizz line variants are cannibalizing the core beverage portfolio. Brand share is shifting internally without attracting incremental customers to the brand ecosystem.',
    metrics: [
      { label: 'Pair Correlation Coefficient', value: '-0.62 (Severe)' },
      { label: 'Mango Fizz Volume Delta', value: '+15.0%' },
      { label: 'Core Beverage Volume Delta', value: '-18.0%' }
    ],
    financial: 'Flat net category growth despite elevated product launching and packaging costs.',
    recommendations: [
      'Differentiate package sizing (e.g. position original as multi-serve and variants as single-serve).',
      'Re-segment supermarket shelf layouts to place Mango Fizz variants separate from core product bays.',
      'Introduce joint cross-purchase bundles to encourage cart expansion rather than substitution.'
    ],
    directive: 'Approve shelf re-layout and packaging segmentation directive.'
  },
  a5: {
    impact: 'Operational Complexity',
    problem: 'The Floor Cleaner category has expanded to 14 active scent and size variants, creating severe warehouse bottlenecks and high manufacturing changeover costs without driving incremental consumer sales.',
    metrics: [
      { label: 'Total active SKUs', value: '14 Variants' },
      { label: 'Revenue Concentration', value: '80% driven by top 2 SKUs' },
      { label: 'Carrying Costs Delta', value: '+22.0% (Excess stock)' }
    ],
    financial: '₹0.35 Cr in excess capital locked up in slow-moving raw packaging and inventory.',
    recommendations: [
      'Initiate an immediate SKU sunset program for the bottom 6 underperforming scent variants.',
      'Consolidate raw bottle packaging inventory into a single standardized 1L shape.',
      'Establish a strict return-on-complexity threshold for any future flavor or scent variant launches.'
    ],
    directive: 'Approve sunset plan for the bottom 6 floor cleaner scent variants.'
  },
  a6: {
    impact: 'Supply Scaling Opportunity',
    problem: 'Herbal Shampoo is experiencing a substantial surge in organic e-commerce search volumes and retail pull. Current inventory levels are insufficient to support the accelerating demand curve, risking stockouts.',
    metrics: [
      { label: 'YoY Revenue Growth', value: '+28.0%' },
      { label: 'E-commerce Search Index', value: '+140% MoM' },
      { label: 'Production Capacity Util', value: '95% (Near Limit)' }
    ],
    financial: '₹2.1 Cr in potential incremental revenue if supply chains can scale to demand capacity.',
    recommendations: [
      'Transition manufacturing floor schedules to prioritize shampoo lines over slow-moving face washes.',
      'Negotiate bulk raw botanical ingredient contracts to secure materials for the next 12 months.',
      'Expand distribution to regional supermarket accounts currently reporting zero stock coverage.'
    ],
    directive: 'Sign off on factory production floor scheduling and bulk ingredient contract approvals.'
  }
};

interface SmartAlertDetailsModalProps {
  isOpen: boolean;
  alert: AlertData | null;
  onClose: () => void;
  onApprove: (alertId: string, directiveText: string) => void;
}

export const SmartAlertDetailsModal: React.FC<SmartAlertDetailsModalProps> = ({
  isOpen,
  alert,
  onClose,
  onApprove
}) => {
  if (!isOpen || !alert) return null;

  const data = ALERT_DETAILS_CONTEXT[alert.id];
  if (!data) return null;

  const sevColors = {
    critical: {
      bg: 'bg-red-500/10 border-red-500/20 text-red-500',
      icon: <ShieldAlert className="text-red-500 shrink-0" size={16} />,
      badge: 'bg-red-500 text-white'
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
      icon: <AlertTriangle className="text-amber-500 shrink-0" size={16} />,
      badge: 'bg-amber-500 text-black'
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
      icon: <Info className="text-blue-500 shrink-0" size={16} />,
      badge: 'bg-blue-500 text-white'
    }
  };

  const currentSev = sevColors[alert.sev];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 p-6 rounded shadow-2xl flex flex-col gap-4 text-xs max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-black/10 dark:border-white/10 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {currentSev.icon}
              <h2 className="text-sm font-display font-extrabold text-zinc-900 dark:text-zinc-50 leading-snug">
                Smart Alert Briefing
              </h2>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${currentSev.badge}`}>
                {alert.sev}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-semibold tracking-wide truncate max-w-[500px]">
              {alert.title}
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded text-zinc-400 hover:text-zinc-650 cursor-pointer border-none bg-transparent outline-none"
          >
            <X size={16} />
          </button>
        </div>

        {/* Impact Category */}
        <div className="flex items-center gap-2 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-2 rounded">
          <FileText size={14} className="text-zinc-500" />
          <span className="font-extrabold text-[9.5px] uppercase tracking-wider text-zinc-500">
            Impact Domain:
          </span>
          <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase">
            {data.impact}
          </span>
        </div>

        {/* Problem Description */}
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-[10px] uppercase tracking-widest text-zinc-400">Situation Analysis</h3>
          <p className="bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded p-3 leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">
            {data.problem}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.metrics.map(metric => (
            <div key={metric.label} className="border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-3 rounded flex flex-col justify-between">
              <span className="text-[8.5px] font-semibold uppercase tracking-wider text-zinc-400 leading-normal">{metric.label}</span>
              <span className="text-sm font-display font-extrabold text-zinc-800 dark:text-zinc-250 mt-1">{metric.value}</span>
            </div>
          ))}
        </div>

        {/* Financial Implications */}
        <div className="border border-red-500/10 bg-red-500/[0.02] dark:bg-red-500/[0.01] p-3.5 rounded space-y-1">
          <div className="flex items-center gap-1.5 text-red-500">
            <DollarSign size={14} />
            <span className="font-extrabold text-[9.5px] uppercase tracking-widest">Financial Implication</span>
          </div>
          <p className="font-extrabold text-zinc-800 dark:text-zinc-200 leading-normal">
            {data.financial}
          </p>
        </div>

        {/* Recommendations */}
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-[10px] uppercase tracking-widest text-zinc-400">Recommended Action Plan</h3>
          <ul className="space-y-2 pr-1">
            {data.recommendations.map((rec, index) => (
              <li key={index} className="flex gap-2 items-start text-zinc-650 dark:text-zinc-300 leading-relaxed font-medium">
                <span className="text-blue-500 shrink-0 font-bold font-mono">0{index + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center border-t border-black/10 dark:border-white/10 pt-3 mt-1">
          <button 
            type="button"
            onClick={() => {
              onApprove(alert.id, data.directive);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold uppercase tracking-widest rounded transition-colors cursor-pointer border-none"
          >
            <CheckCircle2 size={13} />
            {data.directive}
          </button>
          
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-black/10 dark:border-white/10 rounded font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer bg-transparent outline-none"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
