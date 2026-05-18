/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, Cell, Tooltip
} from 'recharts';

export const ParetoConcentration: React.FC = () => {
  return (
    <div className="glass-card">
      <h3 className="text-xs font-bold uppercase mb-6">Revenue Concentration Risk (Pareto)</h3>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/2 h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: "Top 10%", revenue: 27.81 },
              { name: "Top 20%", revenue: 48.51 },
              { name: "Top 30%", revenue: 62.88 },
              { name: "Bottom 67%", revenue: 1.0 }
            ]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-acies-gray text-white p-2 text-[10px] shadow-xl border border-white/10">
                        <p className="font-bold">{data.name}</p>
                        <p>Revenue Share: <span className="text-acies-yellow">{data.revenue}%</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="revenue" radius={[0, 0, 0, 0]}>
                <Cell fill="#ffd966" />
                <Cell fill="#fde68a" />
                <Cell fill="#fef3c7" />
                <Cell fill="#f87171" opacity={0.6} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-4">
          <div className="p-3 bg-black/5 border-l-2 border-acies-yellow">
            <p className="text-xs font-medium leading-relaxed italic">
              "The top 30% of SKUs generate 62.88% of revenue. Dependency creates systemic risk."
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
             <div>
                <p className="text-[9px] opacity-40 uppercase font-bold">Fragility</p>
                <p className="text-lg font-display text-red-600">High</p>
             </div>
             <div>
                <p className="text-[9px] opacity-40 uppercase font-bold">Tail Risk</p>
                <p className="text-lg font-display">27.08%</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
