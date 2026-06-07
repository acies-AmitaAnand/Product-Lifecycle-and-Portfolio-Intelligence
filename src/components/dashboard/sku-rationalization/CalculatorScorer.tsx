/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { SKUS } from '../../../constants/data';

interface CalculatorScorerProps {
  skuA: string;
  setSkuA: (val: string) => void;
  skuB: string;
  setSkuB: (val: string) => void;
  correlation: number;
  setCorrelation: (val: number) => void;
  category: string;
  hasScored: boolean;
  setHasScored: (val: boolean) => void;
  skusByCategory: Record<string, typeof SKUS>;
  skuACategory: string;
  skuBOptions: typeof SKUS;
  pairRisk: number;
  riskVerdict: string;
  verdictColor: string;
  onInspectSku: (skuName: string) => void;
}

export const CalculatorScorer: React.FC<CalculatorScorerProps> = ({
  skuA,
  setSkuA,
  skuB,
  setSkuB,
  correlation,
  setCorrelation,
  category,
  hasScored,
  setHasScored,
  skusByCategory,
  skuACategory,
  skuBOptions,
  pairRisk,
  riskVerdict,
  verdictColor,
  onInspectSku
}) => {
  return (
    <div className="space-y-6">
      {/* INTERACTIVE PAIR SCORER CALCULATOR */}
      <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5 text-acies-gray dark:text-white">
          <LinkIcon size={12} className="text-acies-yellow" />
          Score a Variant SKU Pair
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">SKU A (Base Variant)</label>
              <button 
                onClick={() => onInspectSku(skuA)}
                className="text-[8px] text-[#8b5cf6] dark:text-purple-300 font-bold uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent outline-none"
              >
                Inspect ℹ️
              </button>
            </div>
            <select 
              value={skuA}
              onChange={(e) => setSkuA(e.target.value)}
              className="bg-black/5 dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded px-2.5 py-2 text-xs font-semibold text-acies-gray dark:text-white outline-none focus:border-acies-yellow"
            >
              {(Object.entries(skusByCategory) as [string, any[]][]).map(([cat, list]) => (
                <optgroup key={`optg-a-${cat}`} label={cat.toUpperCase()} className="font-extrabold text-[8px] tracking-wider text-zinc-400 dark:text-zinc-500 bg-white dark:bg-[#1a1a24] py-1">
                  {list.map(s => (
                    <option key={`a-${s.name}`} value={s.name} className="dark:bg-[#1a1a24] text-xs font-semibold text-zinc-800 dark:text-white">{s.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">SKU B (Compare Variant)</label>
              <button 
                onClick={() => onInspectSku(skuB)}
                className="text-[8px] text-[#8b5cf6] dark:text-purple-300 font-bold uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent outline-none"
              >
                Inspect ℹ️
              </button>
            </div>
            <select 
              value={skuB}
              onChange={(e) => setSkuB(e.target.value)}
              className="bg-black/5 dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded px-2.5 py-2 text-xs font-semibold text-acies-gray dark:text-white outline-none focus:border-acies-yellow"
            >
              <optgroup label={`${skuACategory.toUpperCase()} VARIANTS`} className="font-extrabold text-[8px] tracking-wider text-zinc-400 dark:text-zinc-500 bg-white dark:bg-[#1a1a24] py-1">
                {skuBOptions.map(s => (
                  <option key={`b-${s.name}`} value={s.name} className="dark:bg-[#1a1a24] text-xs font-semibold text-zinc-800 dark:text-white">{s.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Promo-Sales Cross Correlation</label>
            <input 
              type="number" 
              value={correlation}
              step="0.01"
              min="-1"
              max="0"
              onChange={(e) => setCorrelation(parseFloat(e.target.value) || 0)}
              className="bg-black/5 dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded px-2.5 py-2 text-xs font-semibold text-acies-gray dark:text-white outline-none focus:border-acies-yellow"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Category</label>
            <input 
              type="text" 
              value={category}
              disabled
              className="bg-black/5 dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded px-2.5 py-2.5 text-xs font-bold text-zinc-400 dark:text-zinc-500 outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-5 pt-4 border-t border-black/5 dark:border-white/5">
          <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">
            Tip: Adjust correlation values to see calculated risk shift
          </span>
          <button 
            onClick={() => setHasScored(true)}
            className="px-5 py-2 bg-acies-gray text-white dark:bg-white dark:text-acies-gray text-[9px] font-bold uppercase tracking-widest hover:bg-acies-yellow hover:text-acies-gray hover:dark:text-white transition-all cursor-pointer border-none rounded"
          >
            Calculate displacement
          </button>
        </div>
      </div>

      {/* Verdict Output Card */}
      {hasScored && (
        <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-widest pb-3 border-b border-black/5 dark:border-white/5 mb-4 flex items-center gap-2 text-acies-gray dark:text-white">
            Displacement Assessment Verdict:
            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-0.5 rounded ${verdictColor}`}>
              {riskVerdict}
            </span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-black/5 dark:bg-[#121214] rounded text-center">
              <p className="text-[8px] font-bold uppercase tracking-widest opacity-45 mb-1">Variant A</p>
              <h5 className="text-[11px] font-bold truncate text-acies-gray dark:text-white" title={skuA}>{skuA}</h5>
            </div>
            <div className="p-3 bg-black/5 dark:bg-[#121214] rounded text-center">
              <p className="text-[8px] font-bold uppercase tracking-widest opacity-45 mb-1">Variant B</p>
              <h5 className="text-[11px] font-bold truncate text-acies-gray dark:text-white" title={skuB}>{skuB}</h5>
            </div>
            <div className="p-3 bg-black/5 dark:bg-[#121214] rounded text-center">
              <p className="text-[8px] font-bold uppercase tracking-widest opacity-45 mb-1">Cross Correlation</p>
              <h5 className="text-base font-display font-extrabold text-[#8b5cf6] dark:text-purple-300">{correlation.toFixed(2)}</h5>
            </div>
            <div className="p-3 bg-black/5 dark:bg-[#121214] rounded text-center">
              <p className="text-[8px] font-bold uppercase tracking-widest opacity-45 mb-1">Substitution Threat</p>
              <h5 className="text-base font-display font-extrabold text-acies-gray dark:text-white">{(pairRisk * 100).toFixed(0)}%</h5>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
