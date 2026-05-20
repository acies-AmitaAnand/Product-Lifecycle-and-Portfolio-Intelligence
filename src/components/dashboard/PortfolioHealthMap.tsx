/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers } from 'lucide-react';
import { Role } from '../../types/dashboard';
import { ValueMatrix } from './ValueMatrix';
import { ComplexityIndex } from './ComplexityIndex';
import { ParetoConcentration } from './ParetoConcentration';
import { ActionPriorityQueue } from './ActionPriorityQueue';
import { ChannelPerformance } from './ChannelPerformance';
import { StockoutHeatmap } from './StockoutHeatmap';
import { RationalizationSimulator } from './RationalizationSimulator';

interface PortfolioHealthMapProps {
  role: Role;
}

export const PortfolioHealthMap: React.FC<PortfolioHealthMapProps> = ({ role: _role }) => {
  return (
    <div className="space-y-4">

      {/* ── Row 1: Strategic Storyline Hero ─────────────────────────────── */}
      <div className="glass-card bg-acies-gray text-white py-5 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
          <Layers size={100} />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex-1 pr-4">
            <p className="text-[9px] uppercase font-bold tracking-widest opacity-40 mb-2">Portfolio Health Map · Executive Summary</p>
            <p className="text-lg font-display leading-snug max-w-xl">
              62.88% of revenue comes from the top 30% of SKUs, while{' '}
              <span className="text-acies-yellow">66.7% of SKUs contribute &lt;1%</span> but consume
              100% of supplier admin overhead and drive severe operational complexity.
            </p>
          </div>
          <div className="flex flex-wrap lg:flex-nowrap gap-px shrink-0">
            {[
              { label: 'Safety Stock Reduction', value: '42.2%', sub: 'Full rationalize scenario ($246M→$142M)' },
              { label: 'Rationalize Candidates', value: '35 SKUs', sub: 'Low value / High complexity segment' },
              { label: 'Revenue Tail Risk', value: '27.08%', sub: 'Max revenue at risk if all removed' },
              { label: 'Cannibalization Risk', value: 'Beverages', sub: 'Negative promo correlation confirmed' },
            ].map((stat, i) => (
              <div key={i} className="border-l border-white/10 pl-5 pr-4 min-w-[120px]">
                <p className="text-[8px] opacity-40 uppercase font-bold mb-0.5">{stat.label}</p>
                <p className="text-base font-display text-acies-yellow leading-none mb-1">{stat.value}</p>
                <p className="text-[7px] opacity-30 leading-snug">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: Value Matrix + Complexity Index ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 flex flex-col">
          <ValueMatrix />
        </div>
        <ComplexityIndex />
      </div>

      {/* ── Row 3: Pareto + Channel + Stockout ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ParetoConcentration />
        <ChannelPerformance />
        <StockoutHeatmap />
      </div>

      {/* ── Row 4: Rationalization Simulator + Priority Queue ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <RationalizationSimulator />
        </div>
        <div className="lg:col-span-4">
          <ActionPriorityQueue />
        </div>
      </div>

    </div>
  );
};
