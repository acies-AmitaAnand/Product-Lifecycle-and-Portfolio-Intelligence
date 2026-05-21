/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { STOCKOUT_TOP10, SEGMENT_COLORS } from '../../../constants/data';

export const StockoutHeatmap: React.FC = () => {
  const maxStockout = Math.max(...STOCKOUT_TOP10.map(s => s.stockoutCount));
  const maxRatio = Math.max(...STOCKOUT_TOP10.map(s => s.safetyStockRatio));

  return (
    <div className="glass-card flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-bold uppercase">Stockout Frequency + Safety Stock Risk</h3>
        <p className="text-[9px] opacity-40 uppercase tracking-wider mt-0.5">
          Top 10 SKUs by stockout events — supply chain fragility signals
        </p>
      </div>

      <div className="space-y-1.5">
        {STOCKOUT_TOP10.map((sku, i) => {
          const stockoutPct = (sku.stockoutCount / maxStockout) * 100;
          const ratioPct = (sku.safetyStockRatio / maxRatio) * 100;
          const isCritical = sku.stockoutCount >= 430;
          const segColor = SEGMENT_COLORS[sku.segment];

          return (
            <div
              key={i}
              className={`p-2 border transition-colors ${
            isCritical ? 'border-red-500/30 bg-red-500/5' : 'border-black/5 dark:border-white/5'
          }`}
              title={`${sku.name}: ${sku.stockoutCount} stockout events | Safety Stock Ratio: ${sku.safetyStockRatio} | Net Sales: $${sku.netSalesM}M`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[8px] font-bold opacity-30 w-3 shrink-0">{i + 1}</span>
                  <div>
                    <p className="text-[10px] font-bold leading-none truncate">{sku.name}</p>
                    <p className="text-[7px] opacity-40 uppercase">{sku.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span
                    className="text-[7px] font-bold px-1 py-0.5 uppercase"
                    style={{ backgroundColor: segColor + '25', color: segColor }}
                  >
                    {sku.segment}
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${isCritical ? 'text-red-600 dark:text-red-400' : ''}`}>
                    {sku.stockoutCount}
                  </span>
                </div>
              </div>

              {/* Dual bars: stockout count + safety stock ratio */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-[6px] opacity-30 w-12 shrink-0">Stockout</span>
                  <div className="flex-1 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isCritical ? 'bg-red-400' : 'bg-acies-yellow'}`}
                      style={{ width: `${stockoutPct}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[6px] opacity-30 w-12 shrink-0">SS Ratio</span>
                  <div className="flex-1 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400 rounded-full opacity-70"
                      style={{ width: `${ratioPct}%` }}
                    />
                  </div>
                  <span className="text-[7px] font-mono opacity-40">${sku.netSalesM}M</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-black/5 dark:border-white/5 pt-3 grid grid-cols-2 gap-3">
        <div className="p-2 bg-red-500/10 border border-red-500/20">
          <p className="text-[8px] font-bold uppercase text-red-500 mb-0.5">Dual-Critical SKUs</p>
          <p className="text-lg font-display text-red-500">2</p>
          <p className="text-[7px] text-red-700 dark:text-red-400 opacity-80">BrandC Biscuits + BrandF Soap both hit 440-event ceiling</p>
        </div>
        <div className="p-2 bg-blue-500/10 border border-blue-500/20">
          <p className="text-[8px] font-bold uppercase text-blue-500 mb-0.5">Highest SS Risk</p>
          <p className="text-sm font-display text-blue-400">BrandE Cheese</p>
          <p className="text-[7px] text-blue-700 dark:text-blue-400 opacity-80">SS/Rev ratio: 0.000248 | $0.85M sales</p>
        </div>
      </div>
    </div>
  );
};
