/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Zap, Info } from 'lucide-react';
import { Role, KPI } from '../../types/dashboard';

interface KPICardProps {
  kpi: KPI;
  role: Role;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi, role }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isHighlighted = kpi.highlight?.includes(role) ?? false;

  // Semantic coloring: isRisk inverts what "up" means
  const getTrendColor = () => {
    if (kpi.trend === 'neutral') return 'text-gray-400';
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
      className={`glass-card flex flex-col justify-between transition-all group cursor-default relative ${
        isHighlighted
          ? 'ring-1 ring-acies-yellow ring-offset-2 dark:ring-offset-acies-gray'
          : 'hover:border-acies-yellow/40'
      }`}
    >
      {/* Highlighted pulse bar */}
      {isHighlighted && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-acies-yellow" />
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
            <Info size={9} className="opacity-20 group-hover:opacity-60 transition-opacity cursor-help" />
            {showTooltip && (
              <div className="absolute right-0 top-5 w-52 bg-acies-gray text-white text-[9px] p-2.5 shadow-xl border border-white/10 z-50 leading-relaxed pointer-events-none">
                {kpi.info}
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
    </div>
  );
};
