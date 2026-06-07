/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, User, Sun, Moon, ChevronRight, Home } from 'lucide-react';
import { Role } from '../../types/dashboard';

interface HeaderProps {
  currentRole: Role;
  setRole: (role: Role) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onStartTour?: () => void;
  onClickHome?: () => void;
  searchBar?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, setRole, isDarkMode, toggleDarkMode, onStartTour, onClickHome, searchBar }) => (
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
      <div className="flex items-center gap-2 text-acies-gray dark:text-white">
        <User size={12} className="opacity-40" />
        <select 
          value={currentRole}
          onChange={(e) => setRole(e.target.value as Role)}
          className="bg-transparent border-none text-[10px] font-medium focus:ring-0 cursor-pointer outline-none text-acies-gray dark:text-white"
        >
          <option className="bg-white text-acies-gray dark:bg-acies-gray dark:text-white">VP Product Management</option>
          <option className="bg-white text-acies-gray dark:bg-acies-gray dark:text-white">Product Manager</option>
          <option className="bg-white text-acies-gray dark:bg-acies-gray dark:text-white">Pricing and Margin Partner</option>
        </select>
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
