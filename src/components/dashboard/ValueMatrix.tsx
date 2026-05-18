/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, ZAxis, Tooltip, Scatter, Cell
} from 'recharts';
import { PORTFOLIO_DATA, SEGMENT_COLORS } from '../../constants/data';

export const ValueMatrix: React.FC = () => {
  return (
    <div className="glass-card min-h-[450px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg mb-0.5">Value vs. Complexity Matrix</h3>
          <p className="text-[10px] opacity-50 font-medium uppercase tracking-wider">L.E.K-Style Optimization Mapping</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-end max-w-sm">
          {Object.entries(SEGMENT_COLORS).map(([segment, color]) => (
            <div key={segment} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[9px] font-bold opacity-60 uppercase">{segment}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
            <XAxis 
               type="number" 
               dataKey="value" 
               name="Commercial Value" 
               domain={[0, 100]}
               label={{ value: "Commercial Value Score", position: "bottom", fontSize: 10, offset: 15 }}
               tick={{ fontSize: 9, fontWeight: 500 }}
            />
            <YAxis 
               type="number" 
               dataKey="complexity" 
               name="Operational Complexity" 
               domain={[0, 100]}
               label={{ value: "Complexity", angle: -90, position: "left", fontSize: 10 }}
               tick={{ fontSize: 9, fontWeight: 500 }}
            />
            <ZAxis type="number" dataKey="size" range={[80, 800]} />
            <Tooltip 
              cursor={{ strokeDasharray: "3 3", stroke: "#ffd966" }}
              wrapperStyle={{ zIndex: 1000 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-acies-gray text-white p-3 shadow-2xl border border-acies-yellow/20 pointer-events-none">
                      <div className="flex justify-between items-start gap-6 mb-2 border-b border-white/10 pb-1.5">
                        <div>
                          <p className="text-[9px] uppercase font-bold text-acies-yellow mb-0.5">{data.category}</p>
                          <p className="text-xs font-display">{data.name}</p>
                        </div>
                        <div 
                            className="px-1.5 py-0.5 text-[7px] font-bold uppercase rounded-sm"
                            style={{ backgroundColor: SEGMENT_COLORS[data.segment], color: data.segment === 'Grow' ? '#000' : '#fff' }}
                        >
                            {data.segment}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9px]">
                        <div>
                          <p className="opacity-60 mb-0.5 uppercase tracking-tighter">Value</p>
                          <p className="font-mono text-acies-yellow font-bold">{data.value}</p>
                        </div>
                        <div>
                          <p className="opacity-60 mb-0.5 uppercase tracking-tighter">Complexity</p>
                          <p className="font-mono text-acies-yellow font-bold">{data.complexity}</p>
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
                <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.segment]} stroke="rgba(0,0,0,0.1)" strokeWidth={1} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
