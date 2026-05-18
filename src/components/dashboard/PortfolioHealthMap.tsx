/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, Zap } from 'lucide-react';
import { Role } from '../../types/dashboard';
import { ValueMatrix } from './ValueMatrix';
import { ComplexityIndex } from './ComplexityIndex';
import { ParetoConcentration } from './ParetoConcentration';
import { ActionPriorityQueue } from './ActionPriorityQueue';

interface PortfolioHealthMapProps {
  role: Role;
}

export const PortfolioHealthMap: React.FC<PortfolioHealthMapProps> = ({ role }) => {
  return (
    <div className="space-y-4">
      {/* Strategic Storyline Hero - More compact */}
      <div className="glass-card bg-acies-gray text-white py-4 px-6 relative overflow-hidden flex items-center justify-between">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
            <Layers size={80} />
        </div>
        <div className="flex-1 pr-10">
          <p className="text-lg font-display leading-tight">
            62.88% of revenue comes from the top 30% of SKUs, while 66.7% of SKUs contribute &lt;1% but create <span className="text-acies-yellow">severe operational complexity</span>.
          </p>
        </div>
        <div className="flex gap-8 shrink-0">
          <div className="border-l border-white/10 pl-8">
            <p className="text-[9px] opacity-40 uppercase font-bold mb-0.5">Rationalization ROI</p>
            <p className="text-lg font-display text-acies-yellow">42.2% Reduction</p>
          </div>
          <div className="border-l border-white/10 pl-8">
            <p className="text-[9px] opacity-40 uppercase font-bold mb-0.5">Candidates</p>
            <p className="text-lg font-display">35 SKUs</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Value vs. Complexity Matrix */}
        <div className="lg:col-span-8 flex flex-col">
          <ValueMatrix />
        </div>

        {/* Complexity Drivers & Composite Metrics */}
        <ComplexityIndex />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pareto Concentration */}
        <ParetoConcentration />

        {/* Action Priority Queue */}
        <ActionPriorityQueue />
      </div>
    </div>
  );
};
