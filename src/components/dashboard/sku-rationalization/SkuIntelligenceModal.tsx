/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';
import { SKUS } from '../../../constants/data';
import { srClassify, SR_CLASSES } from './SKURationalization';

interface SkuIntelligenceModalProps {
  sku: typeof SKUS[0] | null;
  onClose: () => void;
  setActiveTab?: (tabId: number) => void;
  onLoadInSimulator?: (skuName: string) => void;
}

export const SkuIntelligenceModal: React.FC<SkuIntelligenceModalProps> = ({
  sku,
  onClose,
  setActiveTab,
  onLoadInSimulator
}) => {
  if (!sku) return null;

  const currentClass = srClassify(sku);
  const cfg = SR_CLASSES[currentClass];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 space-y-6 animate-scaleIn">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-black/5 dark:border-white/5 pb-4">
          <div>
            <span className="text-[8px] font-black uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">SKU Operational Profile</span>
            <h3 className="text-lg font-display font-extrabold text-acies-gray dark:text-white mt-1 leading-none">{sku.name}</h3>
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{sku.cat} Category</span>
          </div>
          <div className="flex items-center gap-2">
            <span 
              className="text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest"
              style={{ 
                backgroundColor: cfg.bg, 
                color: cfg.color,
                borderColor: cfg.border
              }}
            >
              {cfg.icon} {cfg.label}
            </span>
            <button 
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-zinc-555 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all cursor-pointer border-none outline-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 block">Annual Sales</span>
            <span className="text-base font-black text-acies-gray dark:text-white mt-1 block">₹{sku.rev} Cr</span>
            <span className="text-[7.5px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">Category sales impact</span>
          </div>
          
          <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 block">Gross Profit Margin</span>
            <span className="text-base font-black text-emerald-500 mt-1 block">{sku.margin}%</span>
            <span className="text-[7.5px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">Benchmark: 40% target</span>
          </div>

          <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 block">YoY Growth</span>
            <span className={`text-base font-black mt-1 block ${sku.growth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {sku.growth >= 0 ? '+' : ''}{(sku.growth * 100).toFixed(0)}%
            </span>
            <span className="text-[7.5px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">Volume shift rate</span>
          </div>

          <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 block">Complexity Index</span>
            <span className="text-base font-black mt-1 block text-acies-yellow">{sku.cx.toFixed(2)}</span>
            <span className="text-[7.5px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">Supply chain friction</span>
          </div>

          <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 block">Promo Dependency</span>
            <span className="text-base font-black mt-1 block text-[#8b5cf6] dark:text-purple-300">{(sku.promo * 100).toFixed(0)}%</span>
            <span className="text-[7.5px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">Discount sales load</span>
          </div>

          <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 block">Fulfillment lead time</span>
            <span className="text-base font-black mt-1 block text-blue-500">{sku.lead} days</span>
            <span className="text-[7.5px] font-bold text-zinc-450 dark:text-zinc-550 uppercase">Vendor cycle duration</span>
          </div>
        </div>

        {/* AI Reasoning and diagnostic summary */}
        <div className="bg-[#8b5cf6]/5 border border-[#8b5cf6]/10 p-4 rounded-xl space-y-1.5">
          <span className="text-[8px] font-black uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300 flex items-center gap-1">
            <Cpu size={10} /> AI Recommendation Rationale
          </span>
          <p className="text-[10.5px] leading-relaxed text-zinc-600 dark:text-zinc-350 font-semibold">
            {sku.name} has been classified under the <strong>{cfg.label}</strong> segment because it has a commercial value score of <strong>{(sku.val * 100).toFixed(0)}/100</strong> and an operational complexity score of <strong>{(sku.cx * 100).toFixed(0)}/100</strong>.
            {currentClass === 'sunset' && ` Discontinuing this SKU will eliminate ${sku.stockouts} annual stockout events and reduce lead times across other ${sku.cat} variants, freeing up vital logistics capacity.`}
            {currentClass === 'grow' && ` With an impressive YoY growth rate of +${(sku.growth * 100).toFixed(0)}% and a healthy profit margin of ${sku.margin}%, we recommend increasing vendor capacity, supporting the distributor channels, and expanding marketing to capitalize on demand momentum.`}
            {currentClass === 'retain' && ` As a core product with very low complexity (${(sku.cx * 100).toFixed(0)}%) and high value, this item represents a stable anchor for the category. Maintain stock availability and safeguard margin equity.`}
            {currentClass === 'bundle' && ` With a healthy profit margin (${sku.margin}%) but lower raw sales value, this product is an ideal bundling candidate. Cross-promote it alongside high-volume hero SKUs to increase average order values.`}
            {currentClass === 'reposition' && ` This item exhibits a high operational lead time of ${sku.lead} days. Pricing adjustments or distribution channel changes are recommended to recover complexity costs.`}
          </p>
        </div>

        {/* Navigation links connect tabs */}
        <div className="space-y-2.5 pt-2">
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 block">Connected Workspace Audits (Cross-Tab Router)</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                if (setActiveTab) setActiveTab(2); // Launch readiness
              }}
              className="flex items-center gap-3 p-3 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-[#8b5cf6]/5 border border-black/5 dark:border-white/5 hover:border-purple-500/20 rounded-xl text-left cursor-pointer transition-all outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 text-xs">
                🚀
              </div>
              <div>
                <div className="text-[10px] font-black text-acies-gray dark:text-white uppercase tracking-wider">Launch Readiness</div>
                <p className="text-[7.5px] text-zinc-400 font-bold uppercase mt-0.5">Audit timelines & launch profiles</p>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                if (setActiveTab) setActiveTab(3); // Profitability tree
              }}
              className="flex items-center gap-3 p-3 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-[#8b5cf6]/5 border border-black/5 dark:border-white/5 hover:border-purple-500/20 rounded-xl text-left cursor-pointer transition-all outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 text-xs">
                🌳
              </div>
              <div>
                <div className="text-[10px] font-black text-acies-gray dark:text-white uppercase tracking-wider">Profitability Tree</div>
                <p className="text-[7.5px] text-zinc-400 font-bold uppercase mt-0.5">Drill into margins & costs</p>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                if (setActiveTab) setActiveTab(5); // Signals board
              }}
              className="flex items-center gap-3 p-3 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-[#8b5cf6]/5 border border-black/5 dark:border-white/5 hover:border-purple-500/20 rounded-xl text-left cursor-pointer transition-all outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 text-xs">
                🔔
              </div>
              <div>
                <div className="text-[10px] font-black text-acies-gray dark:text-white uppercase tracking-wider">Signals & Alerts</div>
                <p className="text-[7.5px] text-zinc-400 font-bold uppercase mt-0.5">Competitors, sentiment, alerts</p>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onLoadInSimulator) onLoadInSimulator(sku.name);
              }}
              className="flex items-center gap-3 p-3 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-[#8b5cf6]/5 border border-black/5 dark:border-white/5 hover:border-purple-500/20 rounded-xl text-left cursor-pointer transition-all outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-acies-yellow/10 flex items-center justify-center text-acies-yellow shrink-0 text-xs">
                🛠️
              </div>
              <div>
                <div className="text-[10px] font-black text-acies-gray dark:text-white uppercase tracking-wider">P&L Simulator Desk</div>
                <p className="text-[7.5px] text-zinc-400 font-bold uppercase mt-0.5">Model pricing & deactivations</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
