/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, User, Sun, Moon, ChevronRight, Home } from 'lucide-react';
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
  return (
    <header className="h-14 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-6 bg-white dark:bg-acies-gray sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="bg-acies-yellow p-1 flex items-center justify-center">
          <Activity size={16} className="text-acies-gray" />
        </div>
        <div>
          <h1 className="text-xs font-display font-extrabold uppercase tracking-widest leading-none text-acies-gray dark:text-white">
            Product Lifecycle and Portfolio Intelligence
          </h1>
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

      </div>
    </header>
  );
};
