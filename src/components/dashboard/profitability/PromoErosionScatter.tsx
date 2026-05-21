/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sliders } from 'lucide-react';
import {
  ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, ZAxis,
  Tooltip, Scatter, Cell, ReferenceLine
} from 'recharts';
import { PORTFOLIO_DATA } from '../../../constants/data';

interface PromoErosionScatterProps {
  onAuditClick?: (metric: string) => void;
}

export const PromoErosionScatter: React.FC<PromoErosionScatterProps> = ({ onAuditClick }) => {
  return (
    <div className="glass-card flex flex-col min-h-[500px]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg mb-0.5">Promo Erosion vs. Dependency</h3>
          <p className="text-[10px] opacity-50 font-medium uppercase tracking-wider">
            Identifying promo margin leakages in SKU portfolio
          </p>
        </div>
        {onAuditClick && (
          <button
            onClick={() => onAuditClick('Promo Erosion vs. Dependency')}
            className="text-[8px] font-bold uppercase text-acies-yellow hover:underline flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity bg-black/10 dark:bg-white/5 px-2 py-0.5 shrink-0"
            title="Audit Margin Formulas & Promo Impact"
          >
            <Sliders size={8} />
            Audit Erosion
          </button>
        )}
      </div>

      <div className="h-[380px] w-full relative mt-4">
        {/* Quadrant Highlights */}
        <div className="absolute top-[10%] right-[10%] text-[8px] font-bold uppercase tracking-widest opacity-25 pointer-events-none text-right">
          Danger Zone<br />High Dependency<br /><span className="text-red-400">Severe Erosion</span>
        </div>
        <div className="absolute bottom-[20%] left-[10%] text-[8px] font-bold uppercase tracking-widest opacity-15 pointer-events-none">
          Healthy Zone<br />Low Dependency<br /><span className="text-green-400">Stable Margin</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={true} strokeOpacity={0.04} />
            <ReferenceLine x={20} stroke="#ffd966" strokeOpacity={0.15} strokeDasharray="4 4" />
            <ReferenceLine y={10} stroke="#ffd966" strokeOpacity={0.15} strokeDasharray="4 4" />
            
            <XAxis
              type="number"
              dataKey="promoDep"
              name="Promo Dependency"
              domain={[10, 30]}
              label={{ value: 'Promo Dependency (%) →', position: 'bottom', fontSize: 9, offset: 15, fill: '#888' }}
              tick={{ fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            
            <YAxis
              type="number"
              dataKey="promoErosion"
              name="Margin Erosion Score"
              domain={[3, 17]}
              label={{ value: '← Promo Erosion Score', angle: -90, position: 'insideLeft', fontSize: 9, fill: '#888', dy: 60 }}
              tick={{ fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />

            <ZAxis type="number" dataKey="netSales" range={[60, 450]} />

            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: '#ffd966' }}
              wrapperStyle={{ zIndex: 1000 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  const isDanger = d.promoErosion > 10.0;
                  
                  // Retrieve So What and Action details
                  let details = { soWhat: '', action: '' };
                  if (d.segment === 'Keep') {
                    details = {
                      soWhat: `High performance with low erosion (${d.promoErosion}) and low dependency (${d.promoDep}%).`,
                      action: 'Maintain current trade promo depth and schedule cross-promotions.'
                    };
                  } else if (d.segment === 'Grow') {
                    details = {
                      soWhat: `Strong consumer demand but high promo dependency (${d.promoDep}%) drags margin.`,
                      action: 'Optimize discount depth caps and stabilize pricing corridors.'
                    };
                  } else if (d.segment === 'Consolidate') {
                    details = {
                      soWhat: `Low volume ($${d.netSales.toFixed(2)}M) with moderate promo erosion (${d.promoErosion}).`,
                      action: 'Consolidate promo spending or transition items to standard list pricing.'
                    };
                  } else { // Rationalize
                    details = {
                      soWhat: `Severe margin erosion (${d.promoErosion}) under high promo dependency (${d.promoDep}%).`,
                      action: 'Cap discounts at 15% immediately, or proceed with SKU rationalization.'
                    };
                  }

                  return (
                    <div className="bg-acies-gray text-white p-3.5 shadow-2xl border border-white/10 pointer-events-none min-w-[220px] max-w-[260px] text-[10px] space-y-2">
                      <div className="flex justify-between items-start gap-4 border-b border-white/10 pb-1.5">
                        <div>
                          <p className="text-[7px] uppercase opacity-40 font-bold">{d.category}</p>
                          <p className="text-xs font-display font-bold leading-tight mt-0.5">{d.name}</p>
                        </div>
                        {isDanger && (
                          <div className="px-1 py-0.5 text-[6px] font-bold uppercase rounded-sm bg-red-500 text-white shrink-0">
                            Danger
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[9px] font-mono bg-white/5 p-1.5 border border-white/5">
                        <div>
                          <p className="opacity-45 uppercase text-[7px]">Promo Erosion</p>
                          <p className="text-red-400 font-bold">{d.promoErosion}</p>
                        </div>
                        <div>
                          <p className="opacity-45 uppercase text-[7px]">Promo Dep.</p>
                          <p className="text-acies-yellow font-bold">{d.promoDep}%</p>
                        </div>
                        <div>
                          <p className="opacity-45 uppercase text-[7px]">Sales</p>
                          <p className="font-bold">${d.netSales.toFixed(2)}M</p>
                        </div>
                        <div>
                          <p className="opacity-45 uppercase text-[7px]">Margin</p>
                          <p className="font-bold">{d.margin.toFixed(1)}%</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1 border-t border-white/10">
                        <div>
                          <span className="text-[7px] font-bold uppercase tracking-wider text-red-400 block">So What?</span>
                          <p className="opacity-80 leading-relaxed font-body text-[9px]">{details.soWhat}</p>
                        </div>
                        <div>
                          <span className="text-[7px] font-bold uppercase tracking-wider text-green-400 block">Action Plan</span>
                          <p className="text-acies-yellow opacity-90 leading-relaxed font-body font-medium text-[9px]">{details.action}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Scatter name="SKUs" data={PORTFOLIO_DATA}>
              {PORTFOLIO_DATA.map((entry, index) => {
                const isDanger = entry.promoErosion && entry.promoErosion > 10.0;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isDanger ? '#ef4444' : '#10b981'}
                    fillOpacity={0.75}
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth={1}
                    className="cursor-crosshair"
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[8px] opacity-45 italic leading-snug mt-2 pt-2 border-t border-black/5 dark:border-white/5">
        Quadrant boundary thresholds defined by promo dependency baseline (20%) and margin erosion limit (10.0). High-erosion items are candidates for promo depth reduction.
      </p>
    </div>
  );
};
