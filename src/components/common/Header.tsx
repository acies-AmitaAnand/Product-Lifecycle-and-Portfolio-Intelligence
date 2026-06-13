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
          <h1 className="text-lg font-display leading-none text-acies-gray dark:text-white">Acies AgenticBus</h1>
          <p className="text-[8px] uppercase tracking-widest opacity-50 font-medium text-acies-gray dark:text-white">Product Lifecycle and Portfolio Intelligence</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Unified premium toolbar widget matching template */}
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/40 border border-black/10 dark:border-white/10 rounded-xl p-1.5 shadow-sm">
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
