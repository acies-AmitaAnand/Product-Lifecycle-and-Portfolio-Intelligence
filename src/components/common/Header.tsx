/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, User, Sun, Moon, ChevronRight, Home, LogOut } from 'lucide-react';
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

      <div className="flex items-center gap-4">
        {searchBar}
        
        {/* Premium Segmented Timeline Selector */}
        <div 
          className="flex bg-black/5 dark:bg-white/5 p-0.5 rounded-lg border border-black/10 dark:border-white/10 shrink-0 transition-opacity duration-200"
          title={isTimelineIgnored ? "Timeline filters are ignored on this view but apply to other tabs" : undefined}
        >
          {(['1m', '3m', '6m', '12m', '24m', '36m'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTimelineRange(t)}
              className={`px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-wider rounded-md transition-all border-none outline-none cursor-pointer ${
                timelineRange === t
                  ? 'bg-acies-yellow text-white dark:text-acies-gray shadow-md shadow-acies-yellow/10'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-650 dark:hover:text-zinc-350 bg-transparent'
              }`}
            >
              {t === '12m' ? '1Y' : t === '24m' ? '2Y' : t === '36m' ? '3Y' : t.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-acies-gray dark:text-white border-l border-black/10 dark:border-white/10 pl-3">
          <User size={12} className="opacity-40" />
          <span className="text-[10px] font-bold uppercase tracking-wider select-none">{currentRole}</span>
          <button
            type="button"
            onClick={onSwitchPersona}
            className="flex items-center gap-1.5 px-2 py-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer ml-1.5"
            title="Switch to another persona"
          >
            <LogOut size={10} className="rotate-180" />
            <span>Switch</span>
          </button>
        </div>
        
        <button 
          onClick={onClickHome} 
          className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-sm transition-colors text-acies-gray dark:text-white/80 cursor-pointer"
          title="Go to HOME"
        >
          <Home size={15} />
          <span className="text-[10px] font-bold uppercase tracking-widest">HOME</span>
        </button>

        <button onClick={toggleDarkMode} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-acies-gray dark:text-white/80 cursor-pointer">
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button 
          onClick={onStartTour}
          className="acies-button px-4 py-1.5 text-[10px] flex items-center gap-2 group cursor-pointer"
        >
          Guided Tour
          <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </header>
  );
};
