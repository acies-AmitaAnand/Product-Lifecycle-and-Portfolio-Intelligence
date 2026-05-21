/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { CHANNEL_DATA } from '../../../constants/data';

const CHANNEL_COLORS = ['#ffd966', '#4ade80', '#f87171', '#60a5fa'];

export const ChannelPerformance: React.FC = () => {
  const maxStockout = Math.max(...CHANNEL_DATA.map(c => c.stockoutCount));

  return (
    <div className="glass-card flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-bold uppercase">Channel Performance</h3>
        <p className="text-[9px] opacity-40 uppercase tracking-wider mt-0.5">Margin efficiency · Volatility (CV) · Stockout events</p>
      </div>

      {/* Margin bar chart */}
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={CHANNEL_DATA}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            barCategoryGap="30%"
          >
            <XAxis dataKey="channel" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
            <YAxis domain={[37.8, 38.8]} tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-acies-gray text-white p-2 text-[9px] shadow-xl border border-white/10 min-w-[160px]">
                      <p className="font-bold text-acies-yellow mb-1">{d.channel}</p>
                      <p>Margin: <span className="font-mono">{d.marginPct}%</span></p>
                      <p>Volatility CV: <span className="font-mono">{d.volatilityCV}</span></p>
                      <p>Stockouts: <span className="font-mono text-red-400">{d.stockoutCount.toLocaleString()}</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="marginPct" radius={[2, 2, 0, 0]}>
              {CHANNEL_DATA.map((_, i) => (
                <Cell key={i} fill={CHANNEL_COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Channel detail rows */}
      <div className="space-y-2">
        {CHANNEL_DATA.map((ch, i) => {
          const stockoutPct = (ch.stockoutCount / maxStockout) * 100;
          const isHighRisk = ch.stockoutCount === maxStockout;
          const isLowestMargin = ch.marginPct === Math.min(...CHANNEL_DATA.map(c => c.marginPct));
          return (
            <div key={i} className="border border-black/5 dark:border-white/5 p-2">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CHANNEL_COLORS[i] }} />
                  <span className="text-[10px] font-bold">{ch.channel}</span>
                  {isHighRisk && (
                    <span className="text-[7px] font-bold bg-red-500/15 text-red-500 px-1 py-0.5 uppercase">Highest Risk</span>
                  )}
                  {isLowestMargin && !isHighRisk && (
                    <span className="text-[7px] font-bold bg-amber-500/15 text-amber-600 px-1 py-0.5 uppercase">Lowest Margin</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[9px]">
                  <span className="font-mono font-bold">{ch.marginPct}%</span>
                  <span className="opacity-40 font-mono">CV {ch.volatilityCV}</span>
                </div>
              </div>
              {/* Stockout bar */}
              <div className="h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${stockoutPct}%`,
                    backgroundColor: isHighRisk ? '#f87171' : CHANNEL_COLORS[i],
                  }}
                />
              </div>
              <p className="text-[7px] opacity-40 mt-0.5 font-mono text-right">{ch.stockoutCount.toLocaleString()} stockout events</p>
            </div>
          );
        })}
      </div>

      <div className="p-2 bg-black/5 dark:bg-white/5 border-l-2 border-acies-yellow">
        <p className="text-[9px] italic opacity-70 leading-snug">
          Hypermarket carries <span className="font-bold text-acies-gray dark:text-white">2× the stockout risk</span> of E-commerce (15,907 vs 7,907). Convenience has lowest margin (38.20%) and highest demand volatility (CV 0.069).
        </p>
      </div>
    </div>
  );
};
