/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar } from 'lucide-react';

interface DrilldownFiltersProps {
  timeHorizon: 'Q1' | 'Q2' | 'H1' | 'FY';
  setTimeHorizon: (q: 'Q1' | 'Q2' | 'H1' | 'FY') => void;
  selectedMetric: 'rev' | 'margin' | 'otif';
  setSelectedMetric: (m: 'rev' | 'margin' | 'otif') => void;
}

export const DrilldownFilters: React.FC<DrilldownFiltersProps> = ({
  timeHorizon,
  setTimeHorizon,
  selectedMetric,
  setSelectedMetric,
}) => {
  return (
    <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-3 rounded shadow-sm flex flex-col sm:flex-row items-center justify-start gap-6 w-full text-zinc-800 dark:text-white">
      {/* Horizon Selection */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-400">Analysis Horizon:</span>
        <div className="flex bg-black/5 dark:bg-white/5 p-0.5 rounded border border-black/5 dark:border-white/10 min-w-[160px]">
          {(['Q1', 'Q2', 'H1', 'FY'] as const).map(q => (
            <button
              key={q}
              onClick={() => setTimeHorizon(q)}
              className={`flex-1 py-1 text-[8.5px] font-bold uppercase tracking-wider rounded-sm transition-all border-none cursor-pointer text-center ${
                timeHorizon === q
                  ? 'bg-acies-yellow text-white dark:text-acies-gray font-extrabold shadow-sm shadow-black/10'
                  : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Focus KPI Selection */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-400">KPI Target:</span>
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value as any)}
          className="bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-zinc-800 dark:text-white rounded py-1 px-3 text-[9px] font-bold uppercase tracking-wide outline-none cursor-pointer focus:border-acies-yellow min-w-[160px]"
        >
          <option value="rev" className="text-zinc-800 dark:text-white bg-white dark:bg-zinc-800">Revenue (₹ Cr)</option>
          <option value="margin" className="text-zinc-800 dark:text-white bg-white dark:bg-zinc-800">Avg Margin (%)</option>
          <option value="otif" className="text-zinc-800 dark:text-white bg-white dark:bg-zinc-800">Fulfillment (OTIF %)</option>
        </select>
      </div>
    </div>
  );
};
