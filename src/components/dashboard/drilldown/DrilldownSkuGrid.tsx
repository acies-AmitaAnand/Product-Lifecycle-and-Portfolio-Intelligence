/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers } from 'lucide-react';
import { SKUS } from '../../../constants/data';

interface DrilldownSkuGridProps {
  activeRegionSkus: string[];
  selectedSkuName: string;
  onSkuSelect: (name: string) => void;
  selectedRegionName: string;
}

export const DrilldownSkuGrid: React.FC<DrilldownSkuGridProps> = ({
  activeRegionSkus,
  selectedSkuName,
  onSkuSelect,
  selectedRegionName,
}) => {
  return (
    <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded shadow-sm space-y-4 w-full">
      <div className="flex items-center gap-2 pb-2 border-b border-black/5 dark:border-white/5">
        <Layers size={14} className="text-acies-yellow" />
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Regional SKU Assortment Explorer
          </h3>
          <p className="text-[8px] text-zinc-400 uppercase tracking-widest mt-0.5">
            Active products launched in {selectedRegionName} (Click to inspect detailed diagnostics)
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {activeRegionSkus.map(name => {
          const item = SKUS.find(s => s.name === name) || SKUS[0];
          const isSelected = selectedSkuName === name;
          const isUp = item.growth >= 0;

          return (
            <button
              key={name}
              onClick={() => onSkuSelect(name)}
              className="px-3.5 py-2 text-[9.5px] font-bold uppercase rounded border transition-all flex items-center gap-3 cursor-pointer outline-none text-left bg-zinc-50 dark:bg-white/5 border-black/5 dark:border-white/10 text-zinc-755 dark:text-zinc-300 hover:border-acies-yellow dark:hover:border-acies-yellow hover:scale-[1.01]"
            >
              <div className="space-y-0.5">
                <span>{name}</span>
                <p className="text-[7px] font-semibold uppercase opacity-55 text-zinc-500">
                  {item.cat}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 border-l border-black/5 dark:border-white/10 pl-2">
                <span className={`text-[8px] font-mono ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                  {isUp ? '+' : ''}{Math.round(item.growth * 100)}%
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
