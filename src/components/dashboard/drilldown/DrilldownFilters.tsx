/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar } from 'lucide-react';

interface DrilldownFiltersProps {
  timeHorizon: '1M' | '3M' | '6M' | 'YTD' | '12M' | '3Y';
  setTimeHorizon: (q: '1M' | '3M' | '6M' | 'YTD' | '12M' | '3Y') => void;
  selectedMetric: 'rev' | 'margin' | 'otif';
  setSelectedMetric: (m: 'rev' | 'margin' | 'otif') => void;
}

const getDateRangeLabel = (horizon: '1M' | '3M' | '6M' | 'YTD' | '12M' | '3Y') => {
  switch (horizon) {
    case '1M': return 'May 09, 2026 - Jun 08, 2026 (30 Days)';
    case '3M': return 'Mar 09, 2026 - Jun 08, 2026 (91 Days)';
    case '6M': return 'Dec 09, 2025 - Jun 08, 2026 (182 Days)';
    case 'YTD': return 'Jan 01, 2026 - Jun 08, 2026 (159 Days)';
    case '12M': return 'Jun 09, 2025 - Jun 08, 2026 (365 Days)';
    case '3Y': return 'Jun 09, 2023 - Jun 08, 2026 (1096 Days)';
    default: return '';
  }
};

export const DrilldownFilters: React.FC<DrilldownFiltersProps> = ({
  timeHorizon,
  setTimeHorizon,
  selectedMetric,
  setSelectedMetric,
}) => {
  return (
    <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-3 rounded shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 w-full text-zinc-800 dark:text-white">
      {/* Horizon Selection */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 w-full lg:w-auto">
        <div className="flex items-center gap-3">
          <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-400">Analysis Horizon:</span>
          <div className="flex bg-black/5 dark:bg-white/5 p-0.5 rounded border border-black/5 dark:border-white/10 min-w-[220px]">
            {(['1M', '3M', '6M', 'YTD', '12M', '3Y'] as const).map(q => (
              <button
                key={q}
                onClick={() => setTimeHorizon(q)}
                className={`flex-1 py-1 px-1.5 text-[8.5px] font-bold uppercase tracking-wider rounded-sm transition-all border-none cursor-pointer text-center ${
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
        <span className="text-[8px] font-mono font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider bg-black/5 dark:bg-white/5 px-2 py-1 rounded">
          {getDateRangeLabel(timeHorizon)}
        </span>
      </div>

      {/* Focus KPI Selection */}
      <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
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
