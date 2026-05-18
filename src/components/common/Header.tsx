/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, User, Sun, Moon, ChevronRight } from 'lucide-react';
import { Role } from '../../types/dashboard';
import { COMPANY_CONTEXT } from '../../constants/data';

interface HeaderProps {
  currentRole: Role;
  setRole: (role: Role) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, setRole, isDarkMode, toggleDarkMode }) => (
  <header className="h-14 border-b border-black/10 flex items-center justify-between px-6 bg-white dark:bg-acies-gray sticky top-0 z-40">
    <div className="flex items-center gap-3">
      <div className="bg-acies-yellow p-1 flex items-center justify-center">
        <Activity size={16} className="text-acies-gray" />
      </div>
      <div>
        <h1 className="text-lg font-display leading-none">Acies AgenticBus</h1>
        <p className="text-[8px] uppercase tracking-widest opacity-50 font-medium">Portfolio Intelligence</p>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="hidden md:flex flex-col items-end mr-2 border-r border-black/5 pr-4">
        <span className="text-[8px] font-bold uppercase opacity-40">{COMPANY_CONTEXT.entity}</span>
        <span className="text-[10px] font-medium">{COMPANY_CONTEXT.brands} | {COMPANY_CONTEXT.revenue}</span>
      </div>

      <div className="flex items-center gap-2">
        <User size={12} className="opacity-40" />
        <select 
          value={currentRole}
          onChange={(e) => setRole(e.target.value as Role)}
          className="bg-transparent border-none text-[10px] font-medium focus:ring-0 cursor-pointer outline-none"
        >
          <option>VP Product Management</option>
          <option>Product Manager</option>
          <option>Pricing and Margin Partner</option>
        </select>
      </div>
      
      <button onClick={toggleDarkMode} className="p-1.5 hover:bg-black/5 rounded-full transition-colors">
        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <button className="acies-button px-4 py-1.5 text-[10px] flex items-center gap-2 group">
        Guided Tour
        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  </header>
);
