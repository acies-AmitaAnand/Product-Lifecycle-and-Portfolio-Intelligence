/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LAUNCH_PRODUCTS } from '../../../constants/data';

const getScoreColor = (score: number) => {
  if (score >= 85) return 'bg-green-500 hover:bg-green-600';
  if (score >= 70) return 'bg-amber-500 hover:bg-amber-600';
  return 'bg-red-500 hover:bg-red-600';
};

export const LaunchReadinessHeatmap: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<{ product: string; dimension: string } | null>(null);

  const dimensions = ['Market', 'Supply Chain', 'Channel', 'Pricing', 'Operations'];

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg mb-0.5">Readiness Heatmap</h3>
        <p className="text-[10px] opacity-50 font-medium uppercase tracking-wider">
          Readiness scores across critical dimensions
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 pb-3 border-b border-black/5 dark:border-white/5 text-[8px] font-bold uppercase opacity-60">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500" /> On Track (85+)
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-amber-500" /> At Risk (70-84)
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500" /> Critical (&lt;70)
        </div>
      </div>

      {/* Heatmap table */}
      <div className="flex-1 overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header row */}
          <div className="flex mb-2">
            <div className="min-w-[180px] text-[9px] font-bold uppercase opacity-60 py-2 pr-2 flex items-center">
              Product
            </div>
            {dimensions.map((dim) => (
              <div
                key={dim}
                className="min-w-[70px] text-[8px] font-bold uppercase opacity-60 py-2 px-1 text-center"
              >
                {dim}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {LAUNCH_PRODUCTS.map((product) => (
            <div key={product.id} className="flex mb-2 border-b border-black/5 dark:border-white/5 pb-2">
              <div className="min-w-[180px] text-[8px] font-semibold pr-2 flex items-center truncate text-acies-gray dark:text-white">
                <div className="flex-1 truncate">{product.name}</div>
              </div>

              {dimensions.map((dim) => {
                const metric = product.readiness.find((r) => r.dimension === dim);
                const score = metric?.readinessScore || 0;
                const status = metric?.status || 'Unknown';

                return (
                  <div
                    key={`${product.id}-${dim}`}
                    className="min-w-[70px] px-1 py-2 relative group"
                    onMouseEnter={() => setHoveredCell({ product: product.name, dimension: dim })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div
                      className={`w-full h-12 rounded flex items-center justify-center cursor-pointer transition-all ${getScoreColor(score)}`}
                    >
                      <span className="text-white font-bold text-[10px]">{score}</span>
                    </div>

                    {/* Tooltip */}
                    {hoveredCell?.product === product.name && hoveredCell?.dimension === dim && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-acies-gray text-white text-[7px] px-2 py-1.5 rounded whitespace-nowrap z-10 min-w-max shadow-lg">
                        <div className="font-bold mb-0.5">{dim}</div>
                        <div>Score: {score}%</div>
                        <div>Status: {status}</div>
                        {metric?.keyFindings && metric.keyFindings.length > 0 && (
                          <div className="border-t border-white/20 mt-1 pt-1 text-[6px] opacity-80">
                            {metric.keyFindings[0]}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Summary row */}
          <div className="flex mt-3 pt-3 border-t-2 border-acies-gray dark:border-white/20 font-bold">
            <div className="min-w-[180px] text-[9px] uppercase opacity-60 pr-2 flex items-center">
              Portfolio Avg
            </div>
            {dimensions.map((dim) => {
              const avg = Math.round(
                LAUNCH_PRODUCTS.reduce((sum, p) => {
                  const metric = p.readiness.find((r) => r.dimension === dim);
                  return sum + (metric?.readinessScore || 0);
                }, 0) / LAUNCH_PRODUCTS.length
              );

              return (
                <div key={`avg-${dim}`} className="min-w-[70px] px-1 py-2">
                  <div
                    className={`w-full h-12 rounded flex items-center justify-center ${getScoreColor(avg)}`}
                  >
                    <span className="text-white font-bold text-[10px]">{avg}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
