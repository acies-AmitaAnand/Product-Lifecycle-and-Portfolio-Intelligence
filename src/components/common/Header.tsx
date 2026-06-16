/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, User, Sun, Moon, ChevronRight, Home, Info } from 'lucide-react';
import { Role } from '../../types/dashboard';
import { TimelineRange } from '../../utils/timeframe';

interface HeaderProps {
  currentRole: Role;
  setRole: (role: Role) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  timelineRange: TimelineRange;
  setTimelineRange: (range: TimelineRange) => void;
  onStartTour?: () => void;
  onClickHome?: () => void;
  searchBar?: React.ReactNode;
  activeTab?: number;
  onSwitchPersona?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentRole, 
  setRole, 
  isDarkMode, 
  toggleDarkMode, 
  timelineRange,
  setTimelineRange,
  onStartTour, 
  onClickHome, 
  searchBar,
  activeTab,
  onSwitchPersona
}) => {
  const isTimelineIgnored = activeTab !== undefined && [2, 5, 7].includes(activeTab);

  return (
    <header className="h-14 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-6 bg-white dark:bg-acies-gray sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="bg-acies-yellow p-1 flex items-center justify-center">
          <Activity size={16} className="text-acies-gray" />
        </div>
        <div>
          <h1 className="text-lg font-display leading-none text-acies-gray dark:text-white">Acies AgenticBus</h1>
          <p className="text-[8px] uppercase tracking-widest opacity-50 font-medium text-acies-gray dark:text-white">Product Lifecycle and Portfolio Intelligence</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Unified premium toolbar widget matching template */}
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/40 border border-black/10 dark:border-white/10 rounded-xl p-1.5 shadow-sm">
          {/* Active Persona indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800/80 border border-black/10 dark:border-white/10 rounded-lg text-zinc-700 dark:text-zinc-200 font-extrabold text-[9.5px] uppercase tracking-wider shadow-sm shrink-0">
            <span className={`h-1.5 w-1.5 rounded-full animate-pulse shrink-0 ${
              currentRole === 'VP Product Management' ? 'bg-amber-500' :
              currentRole === 'Product Manager' ? 'bg-green-500' : 'bg-blue-500'
            }`} />
            <span className="text-zinc-400 dark:text-zinc-500 font-medium normal-case mr-0.5">Profile:</span>
            <span>{currentRole}</span>
          </div>

          <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 shrink-0" />

          {/* Premium Segmented Timeline Selector */}
          <div className="flex items-center gap-2">
            {isTimelineIgnored && (
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-wider animate-pulse select-none">
                Inactive on tab
              </span>
            )}
            <div 
              className={`flex bg-black/5 dark:bg-white/5 p-0.5 rounded-lg border border-black/10 dark:border-white/10 shrink-0 transition-all duration-200 ${
                isTimelineIgnored ? 'opacity-40 hover:opacity-90' : ''
              }`}
            >
              {(['1m', '3m', '6m', '12m', '24m', '36m'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimelineRange(t)}
                  className={`px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-wider rounded-md transition-all border-none outline-none cursor-pointer ${
                    timelineRange === t
                      ? 'bg-acies-yellow text-white dark:text-acies-gray shadow-md shadow-acies-yellow/10'
                      : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-655 dark:hover:text-zinc-350 bg-transparent'
                  }`}
                >
                  {t === '12m' ? '1Y' : t === '24m' ? '2Y' : t === '36m' ? '3Y' : t.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="relative group flex items-center justify-center text-zinc-450 dark:text-zinc-400 hover:text-acies-yellow dark:hover:text-acies-yellow transition-colors cursor-help">
              <Info size={14} />
              <div className="absolute right-0 top-7 w-64 p-3 bg-white dark:bg-zinc-900 text-[10px] text-zinc-650 dark:text-zinc-300 rounded-lg shadow-xl border border-black/10 dark:border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 font-normal leading-relaxed">
                <div className="font-extrabold text-[11px] text-acies-gray dark:text-white border-b border-black/5 dark:border-white/5 pb-1 mb-2 uppercase tracking-wide">
                  Timeline Filters
                </div>
                <div className="mb-2">
                  <span className="text-emerald-600 dark:text-emerald-450 font-bold">✓ Applied to:</span> Home Overview, Portfolio Health, Profitability Tree, SKU Rationalization, Top-Down Drilldown, and SKU Assortment tabs.
                </div>
                <div>
                  <span className="text-amber-600 dark:text-amber-450 font-bold">⚠ Ignored on:</span> Launch Readiness, Signals Board, and Agent Orchestrator tabs (forward-looking or systemic views).
                </div>
              </div>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 shrink-0" />

          {searchBar}
          
          <button 
            onClick={onClickHome} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-transparent border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-acies-gray dark:text-white font-extrabold text-[10px] uppercase tracking-wider transition-colors cursor-pointer outline-none"
            title="Go to HOME"
          >
            <Home size={13} className="shrink-0" />
            <span>HOME</span>
          </button>

          <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 shrink-0" />

          <button 
            onClick={onSwitchPersona} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-transparent border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-acies-gray dark:text-white font-extrabold text-[10px] transition-colors cursor-pointer outline-none"
            title="Switch Profile"
          >
            <User size={13} className="shrink-0 opacity-70" />
            <span>Switch profile ↗</span>
          </button>

          <button 
            onClick={toggleDarkMode} 
            className="p-2 bg-white dark:bg-transparent border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-acies-gray dark:text-white/85 transition-colors cursor-pointer outline-none flex items-center justify-center"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>

        {/* Guided Tour button */}
        {onStartTour && (
          <button 
            onClick={onStartTour}
            className="acies-button px-4 py-2 text-[10px] flex items-center gap-2 group cursor-pointer"
          >
            Guided Tour
            <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </header>
  );
};
