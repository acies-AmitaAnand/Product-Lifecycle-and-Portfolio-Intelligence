/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, ZAxis,
  Tooltip, Scatter, Cell, ReferenceLine,
} from 'recharts';
import { PORTFOLIO_DATA, SEGMENT_COLORS } from '../../constants/data';

const SEGMENT_COUNTS = { Keep: 35, Grow: 16, Consolidate: 16, Rationalize: 35 };

export const ValueMatrix: React.FC = () => {
  return (
    <div className="glass-card min-h-[480px] flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg mb-0.5">Value vs. Complexity Matrix</h3>
          <p className="text-[10px] opacity-50 font-medium uppercase tracking-wider">
            Commercial Value Score vs Operational Complexity Score
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-end">
          {Object.entries(SEGMENT_COLORS).map(([segment, color]) => (
            <div key={segment} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[9px] font-bold opacity-60 uppercase">
                {segment} <span className="opacity-40">({SEGMENT_COUNTS[segment as keyof typeof SEGMENT_COUNTS]})</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative">
        {/* Quadrant Labels */}
        <div className="absolute top-2 left-[10%] text-[8px] font-bold uppercase tracking-widest opacity-20 pointer-events-none">
          Low Value<br />Low Complexity<br /><span className="text-blue-400">Consolidate</span>
        </div>
        <div className="absolute top-2 right-[8%] text-[8px] font-bold uppercase tracking-widest opacity-20 pointer-events-none text-right">
          High Value<br />High Complexity<br /><span className="text-yellow-400">Grow</span>
        </div>
        <div className="absolute bottom-10 left-[10%] text-[8px] font-bold uppercase tracking-widest opacity-20 pointer-events-none">
          Low Value<br />High Complexity<br /><span className="text-red-400">Rationalize</span>
        </div>
        <div className="absolute bottom-10 right-[8%] text-[8px] font-bold uppercase tracking-widest opacity-20 pointer-events-none text-right">
          High Value<br />Low Complexity<br /><span className="text-green-400">Keep</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={true} strokeOpacity={0.04} />
            <ReferenceLine x={50} stroke="#ffd966" strokeOpacity={0.15} strokeDasharray="4 4" />
            <ReferenceLine y={50} stroke="#ffd966" strokeOpacity={0.15} strokeDasharray="4 4" />
            <XAxis
              type="number"
              dataKey="value"
              name="Commercial Value Score"
              domain={[0, 100]}
              label={{ value: 'Commercial Value Score →', position: 'bottom', fontSize: 9, offset: 15, fill: '#888' }}
              tick={{ fontSize: 9, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="complexity"
              name="Operational Complexity"
              domain={[0, 100]}
              label={{ value: '← Operational Complexity', angle: -90, position: 'insideLeft', fontSize: 9, fill: '#888', dy: 80 }}
              tick={{ fontSize: 9, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <ZAxis type="number" dataKey="netSales" range={[60, 600]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: '#ffd966' }}
              wrapperStyle={{ zIndex: 1000 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-acies-gray text-white p-3 shadow-2xl border border-acies-yellow/30 pointer-events-none min-w-[200px]">
                      <div className="flex justify-between items-start gap-6 mb-2 border-b border-white/10 pb-1.5">
                        <div>
                          <p className="text-[9px] uppercase font-bold text-acies-yellow mb-0.5">{d.category}</p>
                          <p className="text-xs font-display">{d.name}</p>
                        </div>
                        <div
                          className="px-1.5 py-0.5 text-[7px] font-bold uppercase rounded-sm shrink-0"
                          style={{ backgroundColor: SEGMENT_COLORS[d.segment], color: d.segment === 'Grow' ? '#000' : '#fff' }}
                        >
                          {d.segment}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[9px]">
                        <div>
                          <p className="opacity-40 uppercase tracking-tighter">Value Score</p>
                          <p className="font-mono text-acies-yellow font-bold">{d.value}/100</p>
                        </div>
                        <div>
                          <p className="opacity-40 uppercase tracking-tighter">Complexity</p>
                          <p className="font-mono text-acies-yellow font-bold">{d.complexity}/100</p>
                        </div>
                        <div>
                          <p className="opacity-40 uppercase tracking-tighter">Net Sales</p>
                          <p className="font-mono font-bold">${d.netSales.toFixed(2)}M</p>
                        </div>
                        <div>
                          <p className="opacity-40 uppercase tracking-tighter">Gross Margin</p>
                          <p className="font-mono font-bold">{d.margin}%</p>
                        </div>
                        <div>
                          <p className="opacity-40 uppercase tracking-tighter">YoY Growth</p>
                          <p className={`font-mono font-bold ${d.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {d.growth >= 0 ? '+' : ''}{d.growth}%
                          </p>
                        </div>
                        <div>
                          <p className="opacity-40 uppercase tracking-tighter">Stockouts</p>
                          <p className="font-mono font-bold">{d.stockouts}</p>
                        </div>
                        <div>
                          <p className="opacity-40 uppercase tracking-tighter">Promo Dep.</p>
                          <p className="font-mono font-bold">{d.promoDep}%</p>
                        </div>
                        <div>
                          <p className="opacity-40 uppercase tracking-tighter">Lead Time</p>
                          <p className="font-mono font-bold">{d.leadTime}d</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="SKUs" data={PORTFOLIO_DATA} className="cursor-crosshair">
              {PORTFOLIO_DATA.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SEGMENT_COLORS[entry.segment]}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth={1}
                  fillOpacity={0.85}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Segment summary bar */}
      <div className="grid grid-cols-4 gap-px mt-2 border-t border-black/5 pt-3">
        {Object.entries(SEGMENT_COUNTS).map(([seg, count]) => (
          <div key={seg} className="text-center">
            <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: SEGMENT_COLORS[seg] }} />
            <p className="text-[8px] font-bold uppercase opacity-50">{seg}</p>
            <p className="text-sm font-display">{count}</p>
            <p className="text-[7px] opacity-30">SKUs</p>
          </div>
        ))}
      </div>
    </div>
  );
};
