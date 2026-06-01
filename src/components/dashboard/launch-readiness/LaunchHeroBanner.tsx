/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Rocket, AlertCircle } from 'lucide-react';
import { LAUNCH_PRODUCTS } from '../../../constants/data';

export const LaunchHeroBanner: React.FC = () => {
  const totalProducts = LAUNCH_PRODUCTS.length;
  const avgReadiness = Math.round(
    LAUNCH_PRODUCTS.reduce((sum, p) => sum + p.overallReadiness, 0) / totalProducts
  );
  const nextLaunch = LAUNCH_PRODUCTS.sort(
    (a, b) => new Date(a.targetLaunchDate).getTime() - new Date(b.targetLaunchDate).getTime()
  )[0];
  const highRiskCount = LAUNCH_PRODUCTS.filter(p => p.riskLevel === 'High').length;
  const atRiskCount = LAUNCH_PRODUCTS.filter(p => p.riskLevel === 'Medium').length;

  return (
    <div className="glass-card bg-acies-gray text-white py-5 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
        <Rocket size={100} />
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex-1 pr-4">
          <p className="text-[9px] uppercase font-bold tracking-widest opacity-40 mb-2">
            Launch Readiness · Strategic Pipeline
          </p>
          <p className="text-lg font-display leading-snug max-w-xl">
            {totalProducts} products in pipeline with{' '}
            <span className="text-acies-yellow">avg {avgReadiness}% readiness</span>. Next launch:{' '}
            <span className="text-acies-yellow font-semibold">{nextLaunch.name}</span> on{' '}
            {new Date(nextLaunch.targetLaunchDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}.
          </p>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-px shrink-0">
          {[
            { label: 'Pipeline Products', value: totalProducts.toString(), sub: '2 New · 3 Relaunches' },
            { label: 'Avg Readiness', value: `${avgReadiness}%`, sub: 'Across all dimensions' },
            { label: 'At Risk Products', value: highRiskCount > 0 ? `${highRiskCount} Critical` : 'None', sub: atRiskCount > 0 ? `+ ${atRiskCount} Medium` : 'Status: Green', color: highRiskCount > 0 ? 'text-red-400' : 'text-green-400' },
            { label: 'Est. New Revenue', value: '$152.1M', sub: 'First year impact' },
          ].map((stat, i) => (
            <div key={i} className="border-l border-white/10 pl-5 pr-4 min-w-[120px]">
              <p className="text-[8px] opacity-40 uppercase font-bold mb-0.5">{stat.label}</p>
              <p className={`text-base font-display ${stat.color || 'text-acies-yellow'} leading-none mb-1`}>
                {stat.value}
              </p>
              <p className="text-[7px] opacity-30 leading-snug">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
