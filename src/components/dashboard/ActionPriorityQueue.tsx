/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const ActionPriorityQueue: React.FC = () => {
  return (
    <div className="glass-card">
      <h3 className="text-xs font-bold uppercase mb-6">Rationalization Priority Queue</h3>
      <div className="grid grid-cols-1 gap-2">
        {[
            { name: "BrandB Yogurt", reason: "27.78% Cat Drag", impact: "+$120k WC", action: "Sunset" },
            { name: "BrandA Chocolate", reason: "Min Margin (35.83%)", impact: "+4.2% SS", action: "Rat." },
            { name: "BrandE Cheese", reason: "Max Complexity (10/10)", impact: "-15% Ops", action: "Cons." },
            { name: "BrandC Toothpaste", reason: "Promo Erosion", impact: "+$85k Margin", action: "Eng." }
        ].map((task, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between p-2.5 border border-black/5 hover:border-acies-yellow/50 transition-colors group"
              title={`${task.name}: ${task.reason}. Financial Impact: ${task.impact}. Recommended Action: ${task.action}.`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-sm bg-acies-gray text-acies-yellow flex items-center justify-center font-bold text-[9px]">
                        {task.action.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold leading-none mb-0.5">{task.name}</h4>
                        <p className="text-[8px] opacity-40 uppercase tracking-tighter">{task.reason}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-mono font-bold text-green-600 mb-0.5">{task.impact}</p>
                    <button className="text-[7px] font-bold uppercase bg-acies-yellow px-1 py-0.5 group-hover:scale-105 transition-transform">{task.action}</button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
