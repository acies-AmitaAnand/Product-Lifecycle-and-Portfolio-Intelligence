import React from 'react';
import { SKUS } from '../../../constants/data';
import { Award, Zap, TrendingUp, TrendingDown, Layers, DollarSign } from 'lucide-react';

interface LifecycleTimelineProps {
  isDarkMode: boolean;
}

export const LifecycleTimeline: React.FC<LifecycleTimelineProps> = ({ isDarkMode }) => {
  // Helper to calculate lifecycle stage dynamically
  const getLifecycleStage = (growth: number, margin: number, rev: number) => {
    if (growth < 0) return 'Decline';
    if (growth >= 0.15 && rev < 100) return 'Introduction';
    if (growth >= 0.10) return 'Growth';
    return 'Margin';
  };

  // Run dynamic analysis on all 100 SKUs
  const totalSKUsCount = SKUS.length;
  const totalRevenueVal = SKUS.reduce((sum, s) => sum + s.rev, 0);

  const stageDataMap = {
    Introduction: { skus: 0, rev: 0, color: 'purple', border: 'border-purple-500', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
    Growth: { skus: 0, rev: 0, color: 'teal', border: 'border-teal-500', text: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10' },
    Margin: { skus: 0, rev: 0, color: 'amber', border: 'border-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
    Decline: { skus: 0, rev: 0, color: 'red', border: 'border-red-500', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' }
  };

  SKUS.forEach(s => {
    const stage = getLifecycleStage(s.growth, s.margin, s.rev) as keyof typeof stageDataMap;
    if (stageDataMap[stage]) {
      stageDataMap[stage].skus += 1;
      stageDataMap[stage].rev += s.rev;
    }
  });

  const timelineStages = [
    { key: 'Introduction', label: 'Introduction', ...stageDataMap.Introduction },
    { key: 'Growth', label: 'Growth', ...stageDataMap.Growth },
    { key: 'Margin', label: 'Margin', ...stageDataMap.Margin },
    { key: 'Decline', label: 'Decline', ...stageDataMap.Decline }
  ];

  // Ratios and Efficiency
  const processedStages = timelineStages.map(stage => {
    const skuShare = (stage.skus / totalSKUsCount) * 100;
    const revShare = (stage.rev / totalRevenueVal) * 100;
    const isEfficient = revShare >= skuShare;
    const ratio = stage.skus > 0 ? stage.rev / stage.skus : 0;
    
    return {
      ...stage,
      skuShare,
      revShare,
      isEfficient,
      ratio
    };
  });

  // Find most and least efficient stage based on ratio
  let mostEfficient = processedStages[0];
  let leastEfficient = processedStages[0];

  processedStages.forEach(stage => {
    if (stage.ratio > mostEfficient.ratio) {
      mostEfficient = stage;
    }
    if (stage.ratio < leastEfficient.ratio) {
      leastEfficient = stage;
    }
  });

  return (
    <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-black/5 dark:border-white/5">
        <Layers size={16} className="text-[#6d28d9] dark:text-[#a78bfa]" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
          Product Lifecycle Journey Timeline
        </h3>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm bg-black/5 dark:bg-white/5 text-zinc-500 uppercase ml-auto">
          Active Portfolio Database View
        </span>
      </div>

      {/* Horizontal Journey Timeline */}
      <div className="relative w-full py-6 mb-6">
        {/* Thin connector line behind nodes */}
        <div className="absolute top-[48px] left-[12.5%] right-[12.5%] h-[2px] bg-zinc-200 dark:bg-zinc-800 z-0"></div>

        {/* Timeline nodes */}
        <div className="relative z-10 flex justify-between items-start w-full">
          {processedStages.map((stage) => {
            const borderCol = stage.border;
            const textCol = stage.text;
            const badgeBg = stage.bg;
            
            return (
              <div key={stage.key} className="flex flex-col items-center text-center w-1/4 group select-none">
                {/* Circular Badge showing SKU Share % */}
                <div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-display font-extrabold text-xs border-4 bg-white dark:bg-zinc-900 shadow-md transition-all duration-300 group-hover:scale-110 ${borderCol} ${textCol}`}
                  title={`${stage.label} stage SKU share: ${stage.skuShare.toFixed(1)}%`}
                >
                  <span className="text-zinc-800 dark:text-white font-mono">{stage.skuShare.toFixed(0)}%</span>
                </div>

                {/* Stage Name */}
                <span className={`text-[11px] font-extrabold tracking-wide mt-3 text-zinc-800 dark:text-zinc-200 group-hover:${textCol} transition-colors`}>
                  {stage.label}
                </span>

                {/* Absolute SKU Count */}
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">
                  {stage.skus} SKUs
                </span>

                {/* Absolute Revenue Value */}
                <span className="text-[11px] font-extrabold text-zinc-700 dark:text-zinc-300 font-mono mt-0.5">
                  ₹{stage.rev.toLocaleString('en-IN')} Cr
                </span>

                {/* Efficiency arrow comparing rev share vs sku share */}
                <div className="flex items-center gap-0.5 mt-1 text-[9px] font-bold">
                  {stage.isEfficient ? (
                    <span className="text-emerald-500 flex items-center gap-0.5" title="Revenue share is higher than SKU share (Efficient)">
                      <TrendingUp size={10} />
                      <span>▲ Efficient</span>
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-0.5" title="SKU share is higher than revenue share (Underperforming)">
                      <TrendingDown size={10} />
                      <span>▼ Underperforming</span>
                    </span>
                  )}
                </div>
                
                {/* Visual support: show actual share contribution */}
                <span className="text-[8px] text-zinc-400 dark:text-zinc-650 font-mono mt-0.5">
                  ({stage.revShare.toFixed(1)}% Rev vs {stage.skuShare.toFixed(1)}% SKU)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t border-black/5 dark:border-white/5">
        {/* Card 1: Total SKUs */}
        <div className="bg-black/5 dark:bg-white/5 rounded-sm p-3 border border-black/5 dark:border-white/5 flex flex-col justify-between">
          <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
            Total SKUs
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-display font-extrabold text-zinc-800 dark:text-white">
              {totalSKUsCount}
            </span>
            <span className="text-[9px] text-zinc-500 uppercase font-bold">Items</span>
          </div>
          <span className="text-[8px] text-zinc-400 dark:text-zinc-650 mt-1 block">
            100% of Active Portfolio
          </span>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-black/5 dark:bg-white/5 rounded-sm p-3 border border-black/5 dark:border-white/5 flex flex-col justify-between">
          <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
            Total Revenue
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-display font-extrabold text-zinc-800 dark:text-white font-mono">
              ₹{totalRevenueVal.toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] text-zinc-500 uppercase font-bold">Cr</span>
          </div>
          <span className="text-[8px] text-zinc-400 dark:text-zinc-650 mt-1 block">
            Annualized Commercial Value
          </span>
        </div>

        {/* Card 3: Most Efficient Stage */}
        <div className="bg-black/5 dark:bg-white/5 rounded-sm p-3 border border-black/5 dark:border-white/5 flex flex-col justify-between">
          <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
            Most Efficient Stage
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className={`text-sm font-display font-extrabold ${mostEfficient.text}`}>
              {mostEfficient.label}
            </span>
            <span className="text-[10px] font-mono text-emerald-500 font-bold">
              Ratio: {mostEfficient.ratio.toFixed(1)}
            </span>
          </div>
          <span className="text-[8px] text-zinc-400 dark:text-zinc-650 mt-1 block">
            Highest Revenue-to-SKU ratio
          </span>
        </div>

        {/* Card 4: Least Efficient Stage */}
        <div className="bg-black/5 dark:bg-white/5 rounded-sm p-3 border border-black/5 dark:border-white/5 flex flex-col justify-between">
          <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
            Least Efficient Stage
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className={`text-sm font-display font-extrabold ${leastEfficient.text}`}>
              {leastEfficient.label}
            </span>
            <span className="text-[10px] font-mono text-red-500 font-bold">
              Ratio: {leastEfficient.ratio.toFixed(1)}
            </span>
          </div>
          <span className="text-[8px] text-zinc-400 dark:text-zinc-650 mt-1 block">
            Lowest Revenue-to-SKU ratio
          </span>
        </div>
      </div>
    </div>
  );
};
