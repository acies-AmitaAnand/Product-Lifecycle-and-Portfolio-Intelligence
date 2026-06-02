/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, Cell, LabelList 
} from 'recharts';
import { Sparkles } from 'lucide-react';
import { srClassify, SR_CLASSES } from './SKURationalization';

interface ValueComplexitySectionProps {
  matrixScatterData: any[];
  rankedPriorities: any[];
  selectedAiClass: string | null;
  setSelectedSkuName: (name: string) => void;
  setSimTab: (tab: 'remove' | 'price' | 'launch') => void;
  setSelectedSkuDetails: (sku: any) => void;
  isDarkMode: boolean;
  gridStroke: string;
  tickColor: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
}

export const ValueComplexitySection: React.FC<ValueComplexitySectionProps> = ({
  matrixScatterData,
  rankedPriorities,
  selectedAiClass,
  setSelectedSkuName,
  setSimTab,
  setSelectedSkuDetails,
  isDarkMode,
  gridStroke,
  tickColor,
  tooltipBg,
  tooltipBorder,
  tooltipText
}) => {
  return (
    <div className="space-y-3" id="quadrant-matrix-section" style={{ scrollMarginTop: '100px' }}>
      <div className="flex items-center gap-2 border-l-4 border-[#8b5cf6] pl-3 py-0.5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">
          ② Commercial Value vs Complexity Matrix
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scatter Map */}
        <div id="complexity-matrix-section" style={{ scrollMarginTop: '100px' }} className="lg:col-span-2 glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 shadow-sm rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Commercial Value & Complexity Quadrants</h4>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Bottom-Right represents sunset priorities · Bubble radius equals revenue scale</p>
            </div>
            <div className="flex flex-wrap gap-2 text-[8px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Retain/Grow</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Bundle</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Reposition</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Sunset</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Complexity" 
                  domain={[0, 1]} 
                  tick={{ fill: tickColor, fontSize: 8 }} 
                  label={{ value: 'Complexity Score →', position: 'bottom', fill: tickColor, fontSize: 9, offset: -5 }} 
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Value" 
                  domain={[0, 1]} 
                  tick={{ fill: tickColor, fontSize: 8 }} 
                  label={{ value: 'Commercial Value →', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 9 }} 
                />
                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, fontSize: '9px' }}
                  formatter={(value: any, name: any) => {
                    if (name === 'Complexity') return [value.toFixed(2), 'Complexity'];
                    if (name === 'Value') return [value.toFixed(2), 'Commercial Value'];
                    return [value, name];
                  }}
                />
                <Scatter name="SKUs" data={matrixScatterData}>
                  {matrixScatterData.map((entry, index) => {
                    const opacity = entry.isDimmed ? 0.15 : 1;
                    return (
                      <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={opacity} strokeOpacity={opacity} />
                    );
                  })}
                  <LabelList 
                    dataKey="name" 
                    position="right" 
                    style={{ 
                      fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)', 
                      fontSize: 7.5, 
                      pointerEvents: 'none', 
                      fontWeight: 600 
                    }} 
                  />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Pruning list */}
        <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 shadow-sm rounded-xl flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-acies-gray dark:text-white">Discontinuation & Reposition priorities</h4>
              <p className="text-[9px] text-zinc-555 font-bold uppercase tracking-wider mt-0.5">Automated queue ranked by AI complexity margin drag</p>
            </div>

            <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04] max-h-56 overflow-y-auto pr-1">
              {rankedPriorities.map((sku, i) => {
                const cls = srClassify(sku);
                const cfg = SR_CLASSES[cls];
                const isHighlighted = selectedAiClass ? cls === selectedAiClass : true;
                return (
                  <div 
                    key={sku.name} 
                    className={`flex items-center gap-3 py-2 text-[10.5px] transition-opacity cursor-pointer ${
                      isHighlighted ? 'opacity-100' : 'opacity-20'
                    }`}
                    onClick={() => {
                      setSelectedSkuName(sku.name);
                      setSimTab('remove');
                    }}
                  >
                    <div className="w-5 h-5 rounded text-[8px] font-black flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-acies-gray dark:text-white truncate font-bold text-[10px]">{sku.name}</div>
                      <div className="text-[7.5px] text-zinc-450 font-bold uppercase tracking-wider">
                        Complexity {sku.cx.toFixed(2)} · Value {sku.val.toFixed(2)} · ₹{sku.rev}Cr
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[7.5px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-widest" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSkuDetails(sku);
                        }}
                        className="w-5 h-5 rounded hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center text-zinc-450 hover:text-[#8b5cf6] transition-all cursor-pointer border-none bg-transparent outline-none shrink-0"
                        title="Open SKU Intelligence Card"
                      >
                        <Sparkles size={10} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-black/5 dark:border-white/5 text-center">
            <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">
              Click any item to load in simulator below
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
