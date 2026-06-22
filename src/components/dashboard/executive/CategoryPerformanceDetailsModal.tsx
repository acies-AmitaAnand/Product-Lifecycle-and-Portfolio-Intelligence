/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, Award, AlertTriangle, Zap, BarChart2, ArrowUpRight, ArrowDownRight, Sparkles 
} from 'lucide-react';

interface SkuPerformanceDetail {
  name: string;
  rev: string;
  growth: string;
  metricLabel: string;
  metricValue: string;
  rationale: string;
}

interface CategoryDetails {
  name: string;
  totalRev: string;
  marketShare: string;
  topPerformer: SkuPerformanceDetail;
  underperformer: SkuPerformanceDetail;
  boomingSku: SkuPerformanceDetail;
  vpBriefing: string;
}

const CATEGORY_DETAILS_DATA: Record<string, CategoryDetails> = {
  Beverages: {
    name: 'Beverages',
    totalRev: '$316.0 M',
    marketShare: '33.6%',
    topPerformer: {
      name: 'Mango Fizz 500ml',
      rev: '$48.2 M',
      growth: '+14.2% YoY',
      metricLabel: 'Gross Margin',
      metricValue: '54.5%',
      rationale: 'Core brand strength and strong regional logistics support. Consistently drives supermarket volume velocity.'
    },
    underperformer: {
      name: 'BrandA Premium Energy 250ml',
      rev: '$4.1 M',
      growth: '-8.3% YoY',
      metricLabel: 'Discount Reliance',
      metricValue: '48.0%',
      rationale: 'Poor shelf rotation and low consumer repeat rates. High cost of sales due to heavy local promotions.'
    },
    boomingSku: {
      name: 'Coconut Water Eco-Pack 1L',
      rev: '$18.5 M',
      growth: '+32.4% MoM',
      metricLabel: 'Sourcing Index',
      metricValue: 'Optimal',
      rationale: 'Surging demand in e-commerce and health-conscious consumer segments. High repeat purchase rate (+22% week-on-week).'
    },
    vpBriefing: 'Sustain marketing support for Coconut Water variants; prepare for production line volume switch to offset potential raw concentrate constraints.'
  },
  Snacks: {
    name: 'Snacks',
    totalRev: '$253.0 M',
    marketShare: '26.9%',
    topPerformer: {
      name: 'BrandB Chips Family Pack',
      rev: '$38.5 M',
      growth: '+9.1% YoY',
      metricLabel: 'Gross Margin',
      metricValue: '42.0%',
      rationale: 'High loyalty and strong distributor channels. Generates stable cash inflows with consistent retail shelf share.'
    },
    underperformer: {
      name: 'Choco Wafers Multi-Pack',
      rev: '$8.4 M',
      growth: '-12.0% YoY',
      metricLabel: 'Discount Reliance',
      metricValue: '72.0%',
      rationale: 'Heavy trade discount pressure in hypermarket accounts. Margin erosion makes this item a key candidate for bundle pricing.'
    },
    boomingSku: {
      name: 'Oat Cookies Healthy Baked',
      rev: '$14.2 M',
      growth: '+24.5% MoM',
      metricLabel: 'Sourcing Index',
      metricValue: '96% on-time',
      rationale: 'Benefiting from school lunchbox snack trends and urban health food placements. High grocery shelf rotation speed.'
    },
    vpBriefing: 'Cap trade promotions on Choco Wafers to halt margins leakage. Standardize premium packaging inventory for Oat Cookies ahead of Q3 peak.'
  },
  'Personal Care': {
    name: 'Personal Care',
    totalRev: '$225.0 M',
    marketShare: '24.0%',
    topPerformer: {
      name: 'Herbal Shampoo Anti-Dandruff',
      rev: '$29.1 M',
      growth: '+18.0% YoY',
      metricLabel: 'Gross Margin',
      metricValue: '58.2%',
      rationale: 'Market-leading SKU with high retail shelf penetration and premium pricing power across regional chain accounts.'
    },
    underperformer: {
      name: 'Foam Face Wash Sensitive 150ml',
      rev: '$6.8 M',
      growth: '-2.1% YoY',
      metricLabel: 'Discount Reliance',
      metricValue: '35.0%',
      rationale: 'High container packaging costs and localized logistics bottlenecks. Struggling to compete with regional boutique brands.'
    },
    boomingSku: {
      name: 'Hand Cream SPF Active',
      rev: '$11.2 M',
      growth: '+45.1% MoM',
      metricLabel: 'Sourcing Index',
      metricValue: 'Active',
      rationale: 'Strong seasonal momentum and influencer marketing pickup. Surging retail repeat rate (+35%) in major metro outlets.'
    },
    vpBriefing: 'Formulate RFP to qualify alternate face wash packaging suppliers. Invest gross margin surplus from Herbal Shampoo into Hand Cream SPF production scaling.'
  },
  Household: {
    name: 'Household',
    totalRev: '$145.0 M',
    marketShare: '15.5%',
    topPerformer: {
      name: 'Dish Soap Lemon 1L',
      rev: '$22.4 M',
      growth: '+6.2% YoY',
      metricLabel: 'Gross Margin',
      metricValue: '36.8%',
      rationale: 'High distributor penetration and stable, reliable retail sales velocity. Acts as a core volume stabilizer for the category.'
    },
    underperformer: {
      name: 'Fabric Softener Premium',
      rev: '$4.8 M',
      growth: '-14.3% YoY',
      metricLabel: 'Discount Reliance',
      metricValue: '55.0%',
      rationale: 'Chemical raw material shipping disruptions and high port transit delays causing shelf stockouts.'
    },
    boomingSku: {
      name: 'Laundry Pods Concentrated',
      rev: '$18.2 M',
      growth: '+38.0% MoM',
      metricLabel: 'Sourcing Index',
      metricValue: 'Optimal',
      rationale: 'Rapid customer transition from traditional powders to premium eco-friendly concentrated pods. Outstanding margins.'
    },
    vpBriefing: 'Accelerate traditional powder transition lines to direct production floor bandwidth toward high-value Laundry Pod operations.'
  }
};

interface CategoryPerformanceDetailsModalProps {
  isOpen: boolean;
  categoryName: string | null;
  onClose: () => void;
}

export const CategoryPerformanceDetailsModal: React.FC<CategoryPerformanceDetailsModalProps> = ({
  isOpen,
  categoryName,
  onClose
}) => {
  if (!isOpen || !categoryName) return null;

  const data = CATEGORY_DETAILS_DATA[categoryName];
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 p-6 rounded shadow-2xl flex flex-col gap-4 text-xs max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-black/10 dark:border-white/10 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart2 size={16} className="text-blue-500" />
              <h2 className="text-sm font-display font-extrabold text-zinc-900 dark:text-zinc-50">
                Category Insight Briefing: {data.name}
              </h2>
              <span className="text-[9px] font-mono font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded">
                Share: {data.marketShare}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
              Category Total Revenue: <span className="text-zinc-700 dark:text-zinc-200 font-extrabold">{data.totalRev}</span>
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

        {/* 3-Column Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Top Performer - Giving Good */}
          <div className="bg-emerald-500/5 dark:bg-emerald-500/2 border border-emerald-500/15 rounded p-3.5 flex flex-col justify-between h-full space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Award size={14} className="shrink-0" />
                <span className="font-extrabold text-[9.5px] uppercase tracking-wider">Top Performer (Good)</span>
              </div>
              <div>
                <h3 className="font-bold text-[11px] text-zinc-800 dark:text-zinc-150 leading-snug">{data.topPerformer.name}</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">{data.topPerformer.rev}</span>
                  <span className="text-[8.5px] font-extrabold text-emerald-500 flex items-center gap-0.5">
                    <ArrowUpRight size={10} />
                    {data.topPerformer.growth}
                  </span>
                </div>
              </div>
              <p className="text-zinc-550 dark:text-zinc-400 leading-relaxed font-medium">
                {data.topPerformer.rationale}
              </p>
            </div>
            <div className="border-t border-emerald-500/10 pt-2.5 flex justify-between items-center text-[9px] font-semibold text-zinc-500 dark:text-zinc-450 uppercase">
              <span>{data.topPerformer.metricLabel}:</span>
              <span className="font-bold text-zinc-700 dark:text-zinc-250">{data.topPerformer.metricValue}</span>
            </div>
          </div>

          {/* Underperformer - Not Giving Good */}
          <div className="bg-rose-500/5 dark:bg-rose-500/2 border border-rose-500/15 rounded p-3.5 flex flex-col justify-between h-full space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <AlertTriangle size={14} className="shrink-0" />
                <span className="font-extrabold text-[9.5px] uppercase tracking-wider">Underperformer (Poor)</span>
              </div>
              <div>
                <h3 className="font-bold text-[11px] text-zinc-800 dark:text-zinc-150 leading-snug">{data.underperformer.name}</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="font-extrabold text-sm text-rose-600 dark:text-rose-400">{data.underperformer.rev}</span>
                  <span className="text-[8.5px] font-extrabold text-rose-500 flex items-center gap-0.5">
                    <ArrowDownRight size={10} />
                    {data.underperformer.growth}
                  </span>
                </div>
              </div>
              <p className="text-zinc-550 dark:text-zinc-400 leading-relaxed font-medium">
                {data.underperformer.rationale}
              </p>
            </div>
            <div className="border-t border-rose-500/10 pt-2.5 flex justify-between items-center text-[9px] font-semibold text-zinc-500 dark:text-zinc-450 uppercase">
              <span>{data.underperformer.metricLabel}:</span>
              <span className="font-bold text-zinc-700 dark:text-zinc-250">{data.underperformer.metricValue}</span>
            </div>
          </div>

          {/* Booming Sku - Booming in Market */}
          <div className="bg-purple-500/5 dark:bg-purple-500/2 border border-purple-500/15 rounded p-3.5 flex flex-col justify-between h-full space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                <Zap size={14} className="shrink-0" />
                <span className="font-extrabold text-[9.5px] uppercase tracking-wider">Booming (Market)</span>
              </div>
              <div>
                <h3 className="font-bold text-[11px] text-zinc-800 dark:text-zinc-150 leading-snug">{data.boomingSku.name}</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="font-extrabold text-sm text-purple-600 dark:text-purple-400">{data.boomingSku.rev}</span>
                  <span className="text-[8.5px] font-extrabold text-purple-500 flex items-center gap-0.5">
                    <ArrowUpRight size={10} />
                    {data.boomingSku.growth}
                  </span>
                </div>
              </div>
              <p className="text-zinc-550 dark:text-zinc-400 leading-relaxed font-medium">
                {data.boomingSku.rationale}
              </p>
            </div>
            <div className="border-t border-purple-500/10 pt-2.5 flex justify-between items-center text-[9px] font-semibold text-zinc-500 dark:text-zinc-450 uppercase">
              <span>{data.boomingSku.metricLabel}:</span>
              <span className="font-bold text-zinc-700 dark:text-zinc-250">{data.boomingSku.metricValue}</span>
            </div>
          </div>

        </div>

        {/* VP Category Sourcing Brief */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-blue-500" />
            <p className="font-bold text-[9.5px] uppercase tracking-widest text-blue-500">VP Strategic Briefing & Direction</p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/15 rounded p-3 leading-relaxed text-zinc-750 dark:text-zinc-200">
            {data.vpBriefing}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-black/10 dark:border-white/10 pt-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer bg-transparent outline-none"
          >
            Close Briefing
          </button>
        </div>

      </div>
    </div>
  );
};
