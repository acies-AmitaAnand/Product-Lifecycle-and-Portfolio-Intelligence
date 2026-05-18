/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Info, Zap } from 'lucide-react';
import { Role, KPI } from '../../types/dashboard';

interface KPICardProps {
  kpi: KPI;
  role: Role;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi, role }) => {
  // Highlight different KPIs based on role
  const isHighlighted = (role === 'VP Product Management' && ['SKU Decision Time', 'Portfolio Health', 'Avg Portfolio Margin'].includes(kpi.label)) ||
                        (role === 'Product Manager' && ['Launch Readiness', 'Active SKU Count'].includes(kpi.label)) ||
                        (role === 'Pricing and Margin Partner' && ['Product Margin', 'Revenue Tail Risk'].includes(kpi.label));

  return (
    <div 
      className={`glass-card flex flex-col justify-between transition-all group ${isHighlighted ? 'ring-1 ring-acies-yellow ring-offset-2' : 'hover:border-acies-yellow/50'}`}
      title={kpi.info}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[9px] uppercase font-bold tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">{kpi.label}</span>
        <div className="flex items-center gap-1">
          {isHighlighted && <Zap size={8} className="text-acies-yellow fill-acies-yellow" />}
          <Info size={10} className="opacity-30 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div>
        <div className="text-xl font-display mb-0.5">{kpi.value}</div>
        <div className={`text-[9px] flex items-center gap-1 font-bold ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {kpi.trendValue}
          <span className="opacity-50 font-normal ml-0.5">vs L3M</span>
        </div>
      </div>
    </div>
  );
};
