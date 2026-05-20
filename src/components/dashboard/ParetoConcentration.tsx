/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, Cell, Tooltip,
} from 'recharts';
import { TOP_SKUS_REVENUE } from '../../constants/data';

const PARETO_DATA = [
  { name: 'Top 10%', revenue: 27.81, skus: 10 },
  { name: 'Top 20%', revenue: 48.51, skus: 20 },
  { name: 'Top 30%', revenue: 62.88, skus: 30 },
  { name: 'Bottom 70%', revenue: 37.12, skus: 72, isLongTail: true },
];

const DEMAND_STABILITY = [
  { label: 'Stable', count: 80, color: '#4ade80', desc: 'CV < 0.20' },
  { label: 'Variable', count: 22, color: '#ffd966', desc: 'CV 0.20–0.50' },
  { label: 'Unstable', count: 0, color: '#f87171', desc: 'CV > 0.50' },
];

export const ParetoConcentration: React.FC = () => {
  return (
    <div className="glass-card flex flex-col gap-5">
      <div>
        <h3 className="text-xs font-bold uppercase mb-1">Revenue Concentration Risk (Pareto)</h3>
        <p className="text-[9px] opacity-40 uppercase tracking-wider">SKU tier contribution to total $473M</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5 items-stretch">
        {/* Bar chart */}
        <div className="w-full md:w-1/2 h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PARETO_DATA} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-acies-gray text-white p-2 text-[9px] shadow-xl border border-white/10">
                        <p className="font-bold mb-1">{d.name}</p>
                        <p>Revenue Share: <span className="text-acies-yellow font-mono">{d.revenue}%</span></p>
                        <p>SKU Count: <span className="font-mono">{d.skus}</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="revenue" radius={[2, 2, 0, 0]}>
                <Cell fill="#ffd966" />
                <Cell fill="#fde68a" />
                <Cell fill="#fef3c7" />
                <Cell fill="#f87171" opacity={0.5} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats + insight */}
        <div className="flex-1 flex flex-col justify-between gap-3">
          <div className="p-2.5 bg-black/5 dark:bg-white/5 border-l-2 border-acies-yellow">
            <p className="text-[10px] font-medium leading-relaxed italic">
              "Top 30% of SKUs drive 62.88% of revenue — while 66.7% of the portfolio contributes &lt;1% each yet consumes 100% of supplier admin overhead."
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[8px] opacity-40 uppercase font-bold">Concentration Risk</p>
              <p className="text-lg font-display text-red-600">High</p>
            </div>
            <div>
              <p className="text-[8px] opacity-40 uppercase font-bold">Revenue Tail Risk</p>
              <p className="text-lg font-display">27.08%</p>
            </div>
            <div>
              <p className="text-[8px] opacity-40 uppercase font-bold">Top 5 SKU Revenue</p>
              <p className="text-lg font-display text-acies-yellow">$71.5M</p>
            </div>
            <div>
              <p className="text-[8px] opacity-40 uppercase font-bold">Long-Tail SKUs</p>
              <p className="text-lg font-display">68 SKUs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 SKUs by Revenue */}
      <div>
        <p className="text-[9px] font-bold uppercase opacity-40 mb-2">Top 5 SKUs by Net Sales</p>
        <div className="space-y-1.5">
          {TOP_SKUS_REVENUE.map((sku, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[8px] font-bold opacity-30 w-4 shrink-0">{i + 1}</span>
              <div className="flex-1">
                <div
                  className="h-1.5 bg-acies-yellow rounded-full"
                  style={{ width: `${(sku.netSalesM / 17.03) * 100}%`, opacity: 1 - i * 0.15 }}
                />
              </div>
              <span className="text-[9px] font-bold w-24 text-right">{sku.name}</span>
              <span className="text-[9px] font-mono opacity-60 w-12 text-right">${sku.netSalesM}M</span>
            </div>
          ))}
        </div>
      </div>

      {/* Demand Stability */}
      <div className="border-t border-black/5 pt-4">
        <p className="text-[9px] font-bold uppercase opacity-40 mb-3">Demand Stability (CV Classification)</p>
        <div className="grid grid-cols-3 gap-2">
          {DEMAND_STABILITY.map((d) => (
            <div key={d.label} className="text-center p-2 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <div className="w-3 h-3 rounded-full mx-auto mb-1.5" style={{ backgroundColor: d.color }} />
              <p className="text-xl font-display" style={{ color: d.color }}>{d.count}</p>
              <p className="text-[8px] font-bold uppercase opacity-60">{d.label}</p>
              <p className="text-[7px] opacity-30 font-mono mt-0.5">{d.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-[8px] opacity-30 italic mt-2 leading-snug">
          No SKUs crossed the CV &gt; 0.5 threshold — Chocolate dominates "Variable" with CVs up to 0.242 (BrandD).
        </p>
      </div>
    </div>
  );
};
