/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const ComplexityIndex: React.FC = () => {
  return (
    <div className="lg:col-span-4 space-y-4 flex flex-col">
      <div className="glass-card flex-1">
        <h3 className="text-xs font-bold uppercase tracking-tight mb-6">Complexity Performance Index</h3>
        <div className="space-y-5">
          {[
            { label: "Portfolio Complexity Index (PCI)", value: "0.5509", target: "0.4200" },
            { label: "Supplier Fragmentation Index", value: "1.2000", target: "1.0000" },
            { label: "SKU Proliferation Score", value: "1.0200", target: "0.8500" },
            { label: "Lead Time Instability (CV)", value: "0.2014", target: "0.1500" },
            { label: "Average Promo Dependency", value: "0.1100", target: "0.0800" }
          ].map((metric, i) => (
            <div key={i}>
              <div className="flex justify-between items-end mb-1">
                <div>
                  <p className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">{metric.label}</p>
                  <p className="text-sm font-display">{metric.value}</p>
                </div>
                <div className="text-right">
                   <p className="text-[8px] opacity-40 uppercase">Bench</p>
                   <p className="text-[9px] font-mono">{metric.target}</p>
                </div>
              </div>
              <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-acies-yellow" style={{ width: `${(parseFloat(metric.value)/1.5)*100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card bg-acies-yellow/10 py-4 px-6">
        <h3 className="text-xs font-bold uppercase tracking-tight mb-3">Operational Friction Matrix</h3>
        <div className="space-y-2">
          {[
            { country: "Italy", margin: "38.53%", complexity: "High" },
            { country: "Spain", margin: "38.60%", complexity: "High" },
            { country: "Netherlands", margin: "38.20%", complexity: "Opt" }
          ].map((reg, i) => (
            <div key={i} className="flex justify-between items-center text-[9px] py-1 border-b border-black/5 last:border-0">
              <span className="font-bold opacity-60 uppercase">{reg.country}</span>
              <span className="font-mono">{reg.margin}</span>
              <span className={`font-bold px-1 py-0.5 uppercase ${reg.complexity === 'High' ? 'text-red-600 bg-red-50' : 'text-acies-gray bg-acies-yellow'}`}>
                {reg.complexity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
