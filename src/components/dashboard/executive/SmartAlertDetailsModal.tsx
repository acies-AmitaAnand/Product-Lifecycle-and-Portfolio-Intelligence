/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, AlertTriangle, Info, ShieldAlert, TrendingDown, DollarSign, Activity, FileText, Calendar 
} from 'lucide-react';

export interface AlertData {
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
    impact: 'Launch Delay Risk',
    problem: 'The upcoming launch of Mango Fizz 750ml is experiencing critical packaging material bottle shortages from key regional suppliers, pushing the schedule back by 21 days.',
    metrics: [
      { label: 'Target Launch Date', value: 'Sep 15, 2026' },
      { label: 'Readiness Score', value: '78%' },
      { label: 'Schedule Variance', value: '-21 Days' }
    ],
    financial: '₹2.5 Cr in projected first-quarter revenue deferred due to launch delay.',
    recommendations: [
      'Initiate emergency qualification of backup bottle packaging supplier.',
      'Pre-allocate initial production run to highest-margin regional distributors.',
      'Adjust Q3 promotional marketing calendar to align with new launch window.'
    ],
    directive: 'Approve secondary packaging supplier onboarding and launch date revision.'
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
    impact: 'Margin Contraction',
    problem: 'Laundry Pods Premium is experiencing high ingredient cost variance due to surfactant price spikes, eroding the gross margin below the target threshold.',
    metrics: [
      { label: 'Gross Margin', value: '31.0% (Target: 46.0%)' },
      { label: 'Cost Variance', value: '+15.2% on Surfactants' },
      { label: 'Revenue Impact', value: '₹0.65 Cr' }
    ],
    financial: '₹0.65 Cr gross profit leakage if pricing strategy is not optimized.',
    recommendations: [
      'Renegotiate contract prices with primary surfactant supplier.',
      'Implement a selective price adjustment (cost pass-through) on premium SKUs.',
      'Optimize the formulation mix to reduce reliance on high-cost raw materials.'
    ],
    directive: 'Authorize SKU-level price adjustment and formulation optimization review.'
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
    impact: 'Launch Readiness Check',
    problem: 'BrandA Premium Energy is approaching its final launch gate with 88% readiness. However, channel placement and labeling compliance verification are pending final approval.',
    metrics: [
      { label: 'Overall Readiness', value: '88% (Target: 95%)' },
      { label: 'Estimated 1st Year Rev', value: '₹24.5 Cr' },
      { label: 'Gate Status', value: 'Pre-Launch (Gate 3)' }
    ],
    financial: '₹24.5 Cr in estimated first-year revenue dependent on timely gate sign-off.',
    recommendations: [
      'Accelerate final label compliance review with regulatory team.',
      'Finalize supermarket shelf space allocations with key retail partners.',
      'Authorize pre-launch inventory build of 5,000 cases.'
    ],
    directive: 'Approve Pre-Launch Gate 3 sign-off and inventory release.'
  },
  a6: {
    impact: 'Margin Erosion',
    problem: 'Dishwasher Pods 30ct margin is contracting due to overlapping promotional campaigns across major supermarket chains, leading to double-discounting.',
    metrics: [
      { label: 'Gross Margin', value: '34.0% (Target: 48.0%)' },
      { label: 'Promo Discount Rate', value: '42.0%' },
      { label: 'Volume Lift Delta', value: '+8.0% (Insufficient)' }
    ],
    financial: '₹0.75 Cr in promotion-related margin dilution during the current cycle.',
    recommendations: [
      'Suspend overlapping Q3 promotional campaigns for the 30ct format.',
      'Transition trade promotions to volume-based rebates instead of front-end discounts.',
      'Enforce minimum advertised price (MAP) guidelines across retail channels.'
    ],
    directive: 'Authorize temporary promotion suspension and trade term renegotiation.'
  }
};

interface SmartAlertDetailsModalProps {
  isOpen: boolean;
  alert: AlertData | null;
  onClose: () => void;
  onScheduleMeeting: (alert: AlertData) => void;
}

export const SmartAlertDetailsModal: React.FC<SmartAlertDetailsModalProps> = ({
  isOpen,
  alert,
  onClose,
  onScheduleMeeting
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
              onScheduleMeeting(alert);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 border rounded-lg text-[10.5px] font-bold tracking-wide transition-all duration-150 cursor-pointer border-blue-200 text-blue-600 bg-blue-50/50 hover:bg-blue-600 hover:text-white dark:border-blue-500/35 dark:text-blue-400 dark:bg-blue-500/5 dark:hover:bg-blue-500 dark:hover:text-white"
          >
            <Calendar size={13} />
            Schedule a Meeting
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
