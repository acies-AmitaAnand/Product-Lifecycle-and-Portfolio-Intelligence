/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe } from 'lucide-react';

interface DrilldownRegionGridProps {
  selectedRegion: string | null;
  onRegionSelect: (region: string) => void;
  selectedMetric: 'rev' | 'margin' | 'otif';
  multiplier: number;
  timeHorizon: '1M' | '3M' | '6M' | 'YTD' | '12M' | '3Y';
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
  timeHorizon,
}) => {
  const getRegionMetrics = (regionKey: string) => {
    const mult = multiplier;

    // Realistic targets and actuals mapping by time horizon
    const horizonData: Record<string, Record<string, { margin: { actual: number; target: number }; otif: { actual: number; target: number } }>> = {
      '1M': {
        APAC: { margin: { actual: 37.8, target: 38.0 }, otif: { actual: 95.2, target: 95.0 } },
        Americas: { margin: { actual: 31.4, target: 34.5 }, otif: { actual: 86.5, target: 91.0 } },
        EMEA: { margin: { actual: 36.1, target: 35.8 }, otif: { actual: 92.1, target: 93.0 } },
        LATAM: { margin: { actual: 32.8, target: 33.5 }, otif: { actual: 89.2, target: 90.0 } },
      },
      '3M': {
        APAC: { margin: { actual: 38.5, target: 38.0 }, otif: { actual: 96.5, target: 95.0 } },
        Americas: { margin: { actual: 32.5, target: 35.0 }, otif: { actual: 88.2, target: 92.0 } },
        EMEA: { margin: { actual: 36.8, target: 36.0 }, otif: { actual: 93.4, target: 93.0 } },
        LATAM: { margin: { actual: 33.2, target: 34.0 }, otif: { actual: 90.1, target: 91.0 } },
      },
      '6M': {
        APAC: { margin: { actual: 38.15, target: 38.0 }, otif: { actual: 95.85, target: 95.0 } },
        Americas: { margin: { actual: 31.95, target: 34.75 }, otif: { actual: 87.35, target: 91.5 } },
        EMEA: { margin: { actual: 36.45, target: 35.9 }, otif: { actual: 92.75, target: 93.0 } },
        LATAM: { margin: { actual: 33.0, target: 33.75 }, otif: { actual: 89.65, target: 90.5 } },
      },
      'YTD': {
        APAC: { margin: { actual: 38.0, target: 38.0 }, otif: { actual: 95.5, target: 95.0 } },
        Americas: { margin: { actual: 32.2, target: 34.8 }, otif: { actual: 87.8, target: 91.8 } },
        EMEA: { margin: { actual: 36.3, target: 35.9 }, otif: { actual: 92.5, target: 93.0 } },
        LATAM: { margin: { actual: 32.9, target: 33.8 }, otif: { actual: 89.8, target: 90.8 } },
      },
      '12M': {
        APAC: { margin: { actual: 38.7, target: 38.2 }, otif: { actual: 96.1, target: 95.5 } },
        Americas: { margin: { actual: 33.1, target: 35.2 }, otif: { actual: 89.0, target: 92.5 } },
        EMEA: { margin: { actual: 37.0, target: 36.5 }, otif: { actual: 93.8, target: 93.5 } },
        LATAM: { margin: { actual: 33.6, target: 34.2 }, otif: { actual: 90.5, target: 91.0 } },
      },
      '3Y': {
        APAC: { margin: { actual: 37.5, target: 37.0 }, otif: { actual: 94.8, target: 94.5 } },
        Americas: { margin: { actual: 31.0, target: 33.5 }, otif: { actual: 85.5, target: 90.0 } },
        EMEA: { margin: { actual: 35.5, target: 35.0 }, otif: { actual: 91.5, target: 92.0 } },
        LATAM: { margin: { actual: 32.0, target: 33.0 }, otif: { actual: 88.0, target: 89.5 } },
      }
    };

    const currentHorizonData = horizonData[timeHorizon] || horizonData['3M'];
    const regionSpecific = currentHorizonData[regionKey] || currentHorizonData.APAC;

    switch (regionKey) {
      case 'APAC':
        return {
          rev: { actual: 312 * mult, target: 290 * mult, unit: '₹ Cr' },
          margin: { ...regionSpecific.margin, unit: '%' },
          otif: { ...regionSpecific.otif, unit: '%' }
        };
      case 'Americas':
        return {
          rev: { actual: 228 * mult, target: 240 * mult, unit: '₹ Cr' },
          margin: { ...regionSpecific.margin, unit: '%' },
          otif: { ...regionSpecific.otif, unit: '%' }
        };
      case 'EMEA':
        return {
          rev: { actual: 311 * mult, target: 305 * mult, unit: '₹ Cr' },
          margin: { ...regionSpecific.margin, unit: '%' },
          otif: { ...regionSpecific.otif, unit: '%' }
        };
      case 'LATAM':
      default:
        return {
          rev: { actual: 145 * mult, target: 155 * mult, unit: '₹ Cr' },
          margin: { ...regionSpecific.margin, unit: '%' },
          otif: { ...regionSpecific.otif, unit: '%' }
        };
    }
  };

  const getRegionTrends = (regionKey: string) => {
    const trends: Record<string, Record<string, { revTrend: number; marginTrend: number; otifTrend: number }>> = {
      '1M': {
        APAC: { revTrend: 4.2, marginTrend: 0.5, otifTrend: -0.2 },
        Americas: { revTrend: -1.8, marginTrend: -0.8, otifTrend: 1.1 },
        EMEA: { revTrend: 2.5, marginTrend: 0.2, otifTrend: 0.5 },
        LATAM: { revTrend: 0.9, marginTrend: 0.1, otifTrend: -0.4 },
      },
      '3M': {
        APAC: { revTrend: 3.5, marginTrend: 0.8, otifTrend: 0.3 },
        Americas: { revTrend: -2.2, marginTrend: -1.2, otifTrend: 0.8 },
        EMEA: { revTrend: 1.9, marginTrend: 0.4, otifTrend: 0.2 },
        LATAM: { revTrend: 1.1, marginTrend: -0.3, otifTrend: 0.5 },
      },
      '6M': {
        APAC: { revTrend: 5.1, marginTrend: 1.2, otifTrend: 0.6 },
        Americas: { revTrend: 0.5, marginTrend: -0.5, otifTrend: 1.5 },
        EMEA: { revTrend: 3.2, marginTrend: 0.7, otifTrend: 0.9 },
        LATAM: { revTrend: 2.0, marginTrend: 0.2, otifTrend: 0.8 },
      },
      'YTD': {
        APAC: { revTrend: 4.8, marginTrend: 0.9, otifTrend: 0.4 },
        Americas: { revTrend: -0.2, marginTrend: -0.8, otifTrend: 1.2 },
        EMEA: { revTrend: 2.8, marginTrend: 0.5, otifTrend: 0.7 },
        LATAM: { revTrend: 1.5, marginTrend: 0.0, otifTrend: 0.3 },
      },
      '12M': {
        APAC: { revTrend: 6.2, marginTrend: 1.5, otifTrend: 0.8 },
        Americas: { revTrend: 1.2, marginTrend: 0.2, otifTrend: 2.1 },
        EMEA: { revTrend: 4.5, marginTrend: 1.1, otifTrend: 1.2 },
        LATAM: { revTrend: 3.1, marginTrend: 0.5, otifTrend: 1.0 },
      },
      '3Y': {
        APAC: { revTrend: 14.5, marginTrend: 2.1, otifTrend: 1.5 },
        Americas: { revTrend: 4.2, marginTrend: 0.8, otifTrend: 3.5 },
        EMEA: { revTrend: 11.2, marginTrend: 1.8, otifTrend: 2.2 },
        LATAM: { revTrend: 8.4, marginTrend: 1.1, otifTrend: 1.8 },
      }
    };
    const horizonTrends = trends[timeHorizon] || trends['3M'];
    return horizonTrends[regionKey] || horizonTrends.APAC;
  };

  return (
    <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded shadow-sm space-y-4 w-full">
      <div className="flex items-center gap-2 pb-2 border-b border-black/5 dark:border-white/5">
        <Globe size={14} className="text-acies-yellow" />
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Regional Performance Targets
          </h3>
          <p className="text-[8px] text-zinc-400 uppercase tracking-widest mt-0.5">
            Active metric performance and period-over-period trend analysis
          </p>
        </div>
      </div>

      {/* SVG Supply Chain Network Canvas */}
      <div className="w-full bg-zinc-50/50 dark:bg-zinc-950/20 border border-black/5 dark:border-white/5 rounded-xl p-4 flex items-center justify-center overflow-hidden">
        <svg width="100%" height="180" viewBox="0 0 800 180" className="w-full max-w-[800px] overflow-visible">
          <defs>
            <linearGradient id="hq-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="node-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <dropShadow dx="0" dy="0" stdDeviation="4" floodColor="#8b5cf6" floodOpacity="0.5" />
            </filter>
            <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
              <dropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.6" />
            </filter>
          </defs>
          <style>{`
            @keyframes dash {
              to {
                stroke-dashoffset: -20;
              }
            }
            .active-flow {
              stroke-dasharray: 6, 4;
              animation: dash 1.5s linear infinite;
            }
            .node-hover {
              transition: all 0.3s ease;
            }
            .node-hover:hover {
              transform: scale(1.08);
              cursor: pointer;
            }
          `}</style>

          {/* Connection Lines (Paths) */}
          {[
            { key: 'APAC', x: 620, y: 50, qx: 510, qy: 50 },
            { key: 'EMEA', x: 180, y: 50, qx: 290, qy: 50 },
            { key: 'Americas', x: 180, y: 130, qx: 290, qy: 130 },
            { key: 'LATAM', x: 620, y: 130, qx: 510, qy: 130 },
          ].map(node => {
            const isSelected = selectedRegion === node.key;
            return (
              <g key={`path-${node.key}`}>
                {/* Background base path */}
                <path
                  d={`M 400 90 Q ${node.qx} ${node.qy} ${node.x} ${node.y}`}
                  fill="none"
                  stroke={isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Selected glow path */}
                {isSelected && (
                  <path
                    d={`M 400 90 Q ${node.qx} ${node.qy} ${node.x} ${node.y}`}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3.5"
                    filter="url(#glow)"
                    opacity="0.8"
                    strokeLinecap="round"
                  />
                )}
                {/* Animated active flow dash path */}
                {isSelected && (
                  <path
                    d={`M 400 90 Q ${node.qx} ${node.qy} ${node.x} ${node.y}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    className="active-flow"
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}

          {/* Center Hub: Acies Global HQ */}
          <g transform="translate(400, 90)" className="node-hover">
            <circle r="36" fill="#8b5cf6" opacity="0.08" className="animate-pulse" />
            <circle r="26" fill="url(#hq-grad)" opacity="0.2" />
            <circle r="16" fill="url(#hq-grad)" filter="url(#glow)" />
            <circle r="6" fill="#fff" />
            <text y="42" textAnchor="middle" className="text-[8px] font-black uppercase tracking-widest fill-zinc-400 dark:fill-zinc-500 font-body">Global HQ</text>
          </g>

          {/* Regional Hub Nodes */}
          {[
            { key: 'EMEA', name: 'EMEA Node', x: 180, y: 50 },
            { key: 'APAC', name: 'APAC Node', x: 620, y: 50 },
            { key: 'Americas', name: 'Americas Node', x: 180, y: 130 },
            { key: 'LATAM', name: 'LATAM Node', x: 620, y: 130 },
          ].map(node => {
            const isSelected = selectedRegion === node.key;
            return (
              <g 
                key={`node-${node.key}`} 
                transform={`translate(${node.x}, ${node.y})`}
                className="node-hover"
                onClick={() => onRegionSelect(node.key)}
              >
                {/* Selector ring */}
                {isSelected ? (
                  <circle r="22" fill="none" stroke="#f59e0b" strokeWidth="2" filter="url(#gold-glow)" />
                ) : (
                  <circle r="22" fill="none" stroke="transparent" />
                )}
                
                <circle r="14" fill={isSelected ? '#f59e0b' : 'url(#node-grad)'} opacity={isSelected ? '1' : '0.8'} />
                <circle r="6" fill="#fff" opacity="0.9" />
                
                {/* Node Text labels */}
                <text y="-20" textAnchor="middle" className={`text-[9.5px] font-black uppercase tracking-wider font-body ${
                  isSelected ? 'fill-acies-yellow font-extrabold animate-pulse' : 'fill-zinc-700 dark:fill-zinc-300'
                }`}>
                  {node.key}
                </text>
                <text y="24" textAnchor="middle" className="text-[7px] font-bold fill-zinc-400 uppercase tracking-widest">
                  {REGIONS_CONFIG[node.key]?.plant.split(' ')[0]} Hub
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(REGIONS_CONFIG).map(([key, config]) => {
          const metrics = getRegionMetrics(key);
          const trends = getRegionTrends(key);
          const activeM = metrics[selectedMetric];
          const isSelected = selectedRegion === key;
          
          const activeTrend = selectedMetric === 'rev' 
            ? trends.revTrend 
            : selectedMetric === 'margin' 
              ? trends.marginTrend 
              : trends.otifTrend;

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
                  <span className={`text-[8px] font-mono font-bold leading-none ${activeTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {activeTrend >= 0 ? '▲' : '▼'}{Math.abs(activeTrend).toFixed(1)}% vs prior
                  </span>
                </div>
                
                <p className="text-[7.5px] uppercase font-bold tracking-wider text-zinc-400 leading-none mt-1">
                  {config.manager} · {config.role}
                </p>

                <div className="flex items-baseline gap-1 mt-2.5">
                  <span className="text-base font-display font-extrabold text-zinc-855 dark:text-white leading-none">
                    {activeM.actual.toFixed(selectedMetric === 'rev' ? 0 : 1)}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-500">{activeM.unit}</span>
                  <span className="text-[7px] text-zinc-400 uppercase tracking-wider ml-1">vs target {activeM.target.toFixed(selectedMetric === 'rev' ? 0 : 1)}</span>
                </div>
              </div>

              <div className="w-full space-y-1 mt-2">
                <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${isSelected ? 'bg-acies-yellow' : 'bg-zinc-400 dark:bg-zinc-550'}`} 
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
