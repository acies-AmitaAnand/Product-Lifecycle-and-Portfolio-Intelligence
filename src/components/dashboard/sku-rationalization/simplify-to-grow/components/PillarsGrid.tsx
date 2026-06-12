import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { PillarDef, EnrichedSKU } from '../types';
import { PillarDetail } from './PillarDetail';

interface PillarsGridProps {
  pillars: PillarDef[];
  expandedPillar: string | null;
  setExpandedPillar: (id: string | null) => void;
  skus: EnrichedSKU[];
  onNavigate: (tab: number, extraParams?: string) => void;
  onSkuClick: (sku: EnrichedSKU) => void;
}

export const PillarsGrid: React.FC<PillarsGridProps> = ({
  pillars,
  expandedPillar,
  setExpandedPillar,
  skus,
  onNavigate,
  onSkuClick,
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3 mb-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          ① Simplify to Grow Flywheel — 5 Pillar Health
        </h3>
        <span className="ml-auto text-[7.5px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
          Click any pillar to drill down
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          const isExpanded = expandedPillar === p.id;
          const status = p.score >= 70 ? 'strong' : p.score >= 50 ? 'developing' : 'action';
          const statusLabel = status === 'strong' ? 'Strong' : status === 'developing' ? 'Developing' : 'Needs Action';
          const statusColor = status === 'strong' ? 'text-emerald-500' : status === 'developing' ? 'text-amber-500' : 'text-red-500';
          
          return (
            <button key={p.pillar}
              onClick={() => setExpandedPillar(isExpanded ? null : p.id)}
              className={`glass-card bg-white dark:bg-[#1a1a24] border rounded-xl p-4 shadow-sm relative overflow-hidden text-left w-full transition-all duration-200 group ${isExpanded ? 'ring-2' : 'hover:shadow-md'}`}
              style={{
                borderColor: isExpanded ? `${p.color}40` : undefined,
                boxShadow: isExpanded ? `0 0 0 2px ${p.color}25` : undefined,
              }}>
              <div className="absolute top-0 left-0 h-0.5 rounded-t-xl transition-all duration-300 group-hover:h-1"
                style={{ width: `${p.score}%`, backgroundColor: p.color }} />
              <div className="flex items-start justify-between mb-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${p.bg} transition-transform duration-200 group-hover:scale-110`}>
                  <Icon size={14} style={{ color: p.color }} />
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${statusColor}`}>{statusLabel}</span>
                  {isExpanded ? (
                    <ChevronUp size={10} className="text-zinc-400" />
                  ) : (
                    <ChevronDown size={10} className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
              <div className="text-2xl font-black mb-0.5 ${p.text}">{p.score}</div>
              <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">{p.pillar}</div>
              <p className="text-[7.5px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{p.description}</p>
              <div className="mt-2 text-[7px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                Pillar {i + 1} of 5 · {isExpanded ? 'collapse' : 'click to expand'}
              </div>
            </button>
          );
        })}
        
        {/* Pillar Detail Panel */}
        {expandedPillar && (() => {
          const p = pillars.find(x => x.id === expandedPillar);
          if (!p) return null;
          return (
            <PillarDetail 
              key={expandedPillar} 
              pillar={p} 
              skus={skus} 
              onNavigate={onNavigate} 
              onClose={() => setExpandedPillar(null)} 
              onSkuClick={onSkuClick} 
            />
          );
        })()}
      </div>
    </div>
  );
};
