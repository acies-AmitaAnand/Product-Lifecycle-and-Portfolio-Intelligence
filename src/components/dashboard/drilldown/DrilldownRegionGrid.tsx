/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe } from 'lucide-react';

interface DrilldownRegionGridProps {
  selectedRegion: string;
  onRegionSelect: (region: string) => void;
  selectedMetric: 'rev' | 'margin' | 'otif';
  multiplier: number;
}

const REGIONS_CONFIG: Record<string, { name: string; manager: string; email: string; role: string; plant: string }> = {
  APAC: { name: 'Asia-Pacific', manager: 'Vijay Kumar', email: 'vijay.kumar@aciesglobal.com', role: 'APAC Logistics Head', plant: 'Chennai Bottling Plant' },
  Americas: { name: 'North & South America', manager: 'Gautam Sen', email: 'gautam.sen@aciesglobal.com', role: 'National Distribution Manager', plant: 'Vapi Consumer Goods Hub' },
  EMEA: { name: 'Europe, Middle East & Africa', manager: 'Jean-Pierre Dubois', email: 'jp.dubois@aciesglobal.com', role: 'Commodities Hedging Director', plant: 'Baddi Manufacturing Hub' },
  LATAM: { name: 'Latin America', manager: 'Dieter Maes', email: 'dieter.maes@aciesglobal.com', role: 'Production Scheduler', plant: 'Vapi Consumer Goods Hub' },
};

export const DrilldownRegionGrid: React.FC<DrilldownRegionGridProps> = ({
  selectedRegion,
  onRegionSelect,
  selectedMetric,
  multiplier,
}) => {
  const getRegionMetrics = (regionKey: string) => {
    const mult = multiplier;
    switch (regionKey) {
      case 'APAC':
        return {
          rev: { actual: 312 * mult, target: 290 * mult, unit: '₹ Cr' },
          margin: { actual: 38.5, target: 38.0, unit: '%' },
          otif: { actual: 96.5, target: 95.0, unit: '%' }
        };
      case 'Americas':
        return {
          rev: { actual: 228 * mult, target: 240 * mult, unit: '₹ Cr' },
          margin: { actual: 32.5, target: 35.0, unit: '%' },
          otif: { actual: 88.2, target: 92.0, unit: '%' }
        };
      case 'EMEA':
        return {
          rev: { actual: 311 * mult, target: 305 * mult, unit: '₹ Cr' },
          margin: { actual: 36.8, target: 36.0, unit: '%' },
          otif: { actual: 93.4, target: 93.0, unit: '%' }
        };
      case 'LATAM':
      default:
        return {
          rev: { actual: 145 * mult, target: 155 * mult, unit: '₹ Cr' },
          margin: { actual: 33.2, target: 34.0, unit: '%' },
          otif: { actual: 90.1, target: 91.0, unit: '%' }
        };
    }
  };

  return (
    <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded shadow-sm space-y-4 w-full">
      <div className="flex items-center gap-2 pb-2 border-b border-black/5 dark:border-white/5">
        <Globe size={14} className="text-acies-yellow" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Regional Performance Targets
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(REGIONS_CONFIG).map(([key, config]) => {
          const metrics = getRegionMetrics(key);
          const activeM = metrics[selectedMetric];
          const isSelected = selectedRegion === key;
          const variance = activeM.actual - activeM.target;
          const isFav = variance >= 0 || selectedMetric === 'otif' ? variance >= 0 : false;
          
          // Progress percentage
          const progress = selectedMetric === 'margin' || selectedMetric === 'otif'
            ? activeM.actual 
            : Math.min(100, Math.round((activeM.actual / activeM.target) * 100));

          return (
            <button
              key={key}
              onClick={() => onRegionSelect(key)}
              className={`text-left bg-zinc-50 dark:bg-white/5 border p-3.5 rounded shadow-sm transition-all hover:translate-y-[-1px] cursor-pointer flex flex-col justify-between h-28 relative overflow-hidden group outline-none ${
                isSelected 
                  ? 'border-acies-yellow dark:border-acies-yellow ring-1 ring-acies-yellow/30 bg-acies-yellow/[0.01]' 
                  : 'border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/15'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 w-full h-0.5 bg-acies-yellow" />
              )}
              
              <div className="w-full">
                <div className="flex justify-between items-start gap-1">
                  <span className="text-[10px] font-display font-extrabold text-zinc-850 dark:text-white leading-tight group-hover:text-acies-yellow transition-colors">
                    {config.name} ({key})
                  </span>
                  <span className={`text-[8px] font-mono font-bold leading-none ${isFav ? 'text-green-500' : 'text-red-500'}`}>
                    {variance >= 0 ? '+' : ''}{variance.toFixed(selectedMetric === 'rev' ? 1 : 1)}{activeM.unit}
                  </span>
                </div>
                
                <p className="text-[7.5px] uppercase font-bold tracking-wider text-zinc-400 leading-none mt-1">
                  {config.manager} · {config.role}
                </p>

                <div className="flex items-baseline gap-1 mt-2.5">
                  <span className="text-base font-display font-extrabold text-zinc-805 dark:text-white leading-none">
                    {activeM.actual.toFixed(selectedMetric === 'rev' ? 0 : 1)}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-500">{activeM.unit}</span>
                  <span className="text-[7px] text-zinc-400 uppercase tracking-wider ml-1">vs target {activeM.target.toFixed(selectedMetric === 'rev' ? 0 : 1)}</span>
                </div>
              </div>

              <div className="w-full space-y-1 mt-2">
                <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${isSelected ? 'bg-acies-yellow' : 'bg-zinc-400 dark:bg-zinc-500'}`} 
                    style={{ width: `${selectedMetric === 'rev' ? progress : (progress / activeM.target * 100)}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[7px] text-zinc-400 uppercase tracking-widest font-semibold leading-none">
                  <span>Target Fulfillment</span>
                  <span>{selectedMetric === 'rev' ? progress : Math.round(progress / activeM.target * 100)}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
