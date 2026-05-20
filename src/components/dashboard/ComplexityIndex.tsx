/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { PCI_DRIVERS, REGIONAL_DATA } from '../../constants/data';


export const ComplexityIndex: React.FC = () => {
  const maxPCIValue = 1.5;

  return (
    <div className="lg:col-span-4 space-y-4 flex flex-col">
      {/* PCI Drivers Panel */}
      <div className="glass-card flex-1">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-tight">Portfolio Complexity Index</h3>
            <p className="text-[9px] opacity-40 uppercase tracking-wider mt-0.5">PCI = 0.5509 | Target ≤ 0.4200</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-display text-acies-yellow leading-none">0.5509</p>
            <p className="text-[8px] opacity-40 uppercase">Enterprise PCI</p>
          </div>
        </div>

        <div className="space-y-4">
          {PCI_DRIVERS.map((driver, i) => {
            const pct = Math.min((driver.value / maxPCIValue) * 100, 100);
            const benchPct = Math.min((driver.benchmark / maxPCIValue) * 100, 100);
            const isOver = driver.value > driver.benchmark;
            return (
              <div key={i}>
                <div className="flex justify-between items-end mb-1">
                  <div>
                    <p className="text-[9px] font-bold opacity-50 uppercase tracking-tighter leading-snug">{driver.label}</p>
                    <p className={`text-sm font-display ${isOver ? 'text-acies-yellow' : 'text-green-500'}`}>
                      {driver.value.toFixed(4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[7px] opacity-30 uppercase">Bench</p>
                    <p className="text-[9px] font-mono opacity-60">{driver.benchmark.toFixed(4)}</p>
                  </div>
                </div>
                <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden relative">
                  {/* Benchmark marker */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-black/30 z-10"
                    style={{ left: `${benchPct}%` }}
                  />
                  <div
                    className={`h-full rounded-full ${isOver ? 'bg-acies-yellow' : 'bg-green-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Cannibalization callout */}
        <div className="mt-5 flex items-start gap-2 p-2.5 bg-red-500/10 border-l-2 border-red-500">
          <AlertTriangle size={12} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-tight">Cannibalization Risk: Beverages</p>
            <p className="text-[8px] text-red-600 dark:text-red-400 opacity-80 leading-snug mt-0.5">
              Heavy negative promo correlations flagged between internal SKUs — promotional "sales stealing" confirmed in category.
            </p>
          </div>
        </div>
      </div>

      {/* Regional Operational Friction */}
      <div className="glass-card bg-acies-yellow/5 py-4 px-5">
        <h3 className="text-xs font-bold uppercase tracking-tight mb-3">Regional Complexity Matrix</h3>
        <div className="space-y-1.5">
          {REGIONAL_DATA.map((reg, i) => {
            const complexityColor =
              reg.complexityLabel === 'High'   ? 'text-red-500 bg-red-500/10' :
              reg.complexityLabel === 'Medium' ? 'text-amber-600 bg-amber-500/10' :
              'text-acies-gray bg-acies-yellow';
            return (
              <div key={i} className="flex items-center justify-between text-[9px] py-1.5 border-b border-black/5 dark:border-white/5 last:border-0 gap-2">
                <span className="font-bold opacity-70 uppercase w-24 shrink-0">{reg.country}</span>
                <span className="font-mono opacity-60">${reg.netSalesM}M</span>
                <span className="font-mono">{reg.marginPct.toFixed(2)}%</span>
                <span className="font-mono opacity-50 text-[8px]">{reg.skuCount} SKUs</span>
                <span className={`font-bold px-1.5 py-0.5 uppercase text-[7px] shrink-0 ${complexityColor}`}>
                  {reg.complexityLabel}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-[8px] opacity-40 italic mt-3 leading-snug">
          Netherlands: smallest footprint (45 SKUs) + lowest margin (38.20%) = immediate assortment optimization opportunity.
        </p>
      </div>
    </div>
  );
};
