import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Zap, Info, FileSearch } from 'lucide-react';
import { Role, KPI } from '../../types/dashboard';

interface KPICardProps {
  kpi: KPI;
  role: Role;
  onAuditClick?: () => void;
}

const KPI_TOOLTIPS: Record<string, { soWhat: string; action: string }> = {
  'Net Sales (Portfolio)': {
    soWhat: 'Revenue growth is +10.12% YoY ($225.1M to $247.9M) but heavily concentrated in the top 30% of SKUs.',
    action: 'Implement cross-selling to drive volume of middle-tier velocity items.'
  },
  'Avg Gross Margin': {
    soWhat: '12 high-volume items (like BrandA Soda) drag gross margin below the 40.0% corporate benchmark.',
    action: 'Review and adjust pricing terms or pack architecture on dilutive items.'
  },
  'Revenue Concentration': {
    soWhat: 'Top 10% of items generate 27.81% of sales. Severe vulnerability to supply chain failures.',
    action: 'Apply targeted safety stock buffers exclusively to these 10 highest-value items.'
  },
  'Portfolio PCI': {
    soWhat: 'High supplier fragmentation (1.20) and SKU count (1.02) inflate carrying costs by 20%.',
    action: 'Consolidate supplier relationships into specialized category clusters.'
  },
  'Long-Tail SKU Burden': {
    soWhat: '68 SKUs generate <1% sales but interact with all 60 suppliers, creating high administrative overhead.',
    action: 'Consolidate supplier networks by eliminating overlapping SKU suppliers.'
  },
  'Rationalize Candidates': {
    soWhat: '35 items generate low margins/revenue but drive peak stockouts and high promotion erosion.',
    action: 'Prune the bottom 10% immediately to reclaim 8.81% safety stock at <3.58% sales risk.'
  },
  'Peak Stockout Freq.': {
    soWhat: 'BrandC Biscuits and BrandF Soap had 440 stockouts, mostly in Hypermarkets (15.9k events).',
    action: 'Re-negotiate SLAs and establish priority freight lanes for Modern Trade/Hypermarkets.'
  },
  'Revenue Tail Risk': {
    soWhat: 'Pruning all 35 candidates simultaneously risks 27.08% of revenue under a zero customer transfer assumption.',
    action: 'Run a phased pilot substitution test in a single region before fully sun-setting items.'
  }
};

export const KPICard: React.FC<KPICardProps> = ({ kpi, role, onAuditClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const isHighlighted = kpi.highlight?.includes(role) ?? false;
  const auditDetails = KPI_TOOLTIPS[kpi.label];

  // Semantic coloring: isRisk inverts what "up" means
  const getTrendColor = () => {
    if (kpi.trend === 'neutral') return 'text-gray-400 dark:text-gray-500';
    if (kpi.trend === 'up') return kpi.isRisk ? 'text-red-500' : 'text-green-500';
    // trend === 'down'
    return kpi.isRisk ? 'text-green-500' : 'text-red-500';
  };

  const TrendIcon =
    kpi.trend === 'up' ? TrendingUp :
    kpi.trend === 'down' ? TrendingDown :
    Minus;

  return (
    <div
      onClick={onAuditClick}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      className={`glass-card flex flex-col justify-between transition-all cursor-pointer relative select-none pb-5 ${
        isHighlighted
          ? 'ring-1 ring-acies-yellow ring-offset-2 dark:ring-offset-acies-gray bg-white/90 dark:bg-white/10'
          : 'hover:border-acies-yellow/40 hover:bg-white/80 dark:hover:bg-white/8'
      }`}
    >
      {/* Highlighted pulse bar */}
      {isHighlighted && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-acies-yellow animate-pulse" />
      )}

      <div className="flex justify-between items-start mb-3">
        <span className="text-[8px] uppercase font-bold tracking-wider opacity-50 group-hover:opacity-100 transition-opacity leading-snug pr-1">
          {kpi.label}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {isHighlighted && <Zap size={8} className="text-acies-yellow fill-acies-yellow" />}
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info size={9} className="opacity-35 hover:opacity-100 transition-opacity cursor-help" />
            {showTooltip && (
              <div className="absolute right-0 top-5 w-60 bg-acies-gray text-white text-[9px] p-3 shadow-2xl border border-white/10 z-50 leading-relaxed pointer-events-none rounded-sm">
                <p className="opacity-70 mb-2">{kpi.info}</p>
                {auditDetails && (
                  <div className="space-y-1.5 border-t border-white/10 pt-2">
                    <div>
                      <span className="text-red-400 font-bold uppercase tracking-wider block text-[7px]">So What?</span>
                      <p className="opacity-95">{auditDetails.soWhat}</p>
                    </div>
                    <div>
                      <span className="text-green-400 font-bold uppercase tracking-wider block text-[7px]">Action Plan</span>
                      <p className="opacity-95 text-acies-yellow">{auditDetails.action}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="text-base font-display leading-tight mb-1">{kpi.value}</div>
        <div className={`text-[8px] flex items-center gap-1 font-bold ${getTrendColor()}`}>
          <TrendIcon size={9} />
          {kpi.trendValue}
        </div>
      </div>

      {/* Slide-up Inspect indicator */}
      <div 
        className={`absolute bottom-1 right-3 flex items-center gap-1 text-[7px] font-bold uppercase tracking-widest text-acies-yellow transition-opacity duration-200 ${
          isCardHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <FileSearch size={8} />
        Audit Trace
      </div>
    </div>
  );
};
