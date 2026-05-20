/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, Rocket, Layers, Scissors, MessageSquare, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
import { Role } from './types/dashboard';

// Constants
import { COMPANY_CONTEXT, KPIS, TABS } from './constants/data';

// Components
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { KPICard } from './components/dashboard/KPICard';
import { PortfolioHealthMap } from './components/dashboard/PortfolioHealthMap';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [role, setRole] = useState<Role>('VP Product Management');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const tabs = TABS.map(tab => {
     let icon = Activity;
     if (tab.id === 1) icon = Rocket;
     if (tab.id === 2) icon = Layers;
     if (tab.id === 3) icon = Scissors;
     if (tab.id === 4) icon = MessageSquare;
     return { ...tab, icon };
  });

  return (
    <div className="min-h-screen font-body bg-acies-offwhite dark:bg-acies-gray transition-colors pb-20">
      <Header 
        currentRole={role} 
        setRole={setRole} 
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <div className="max-w-[1600px] mx-auto px-6 py-6 font-body">
        <div className="flex flex-col gap-6">
          
          <main className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-1 bg-white dark:bg-white/5 p-1 border border-black/5 self-start">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all border-b-2 ${
                      activeTab === tab.id 
                        ? 'border-acies-yellow text-acies-gray bg-acies-offwhite dark:text-white' 
                        : 'border-transparent opacity-40 hover:opacity-100'
                    }`}
                  >
                    <tab.icon size={12} />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                   <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Active Intelligence</p>
                   <p className="text-[11px] font-medium">5 Agents Operating</p>
                 </div>
                 <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-acies-gray text-white text-[9px] font-bold uppercase tracking-widest hover:bg-acies-yellow hover:text-acies-gray transition-all"
                >
                  <Zap size={12} className="text-acies-yellow fill-acies-yellow" />
                  How This Evolves
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
              {KPIS.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <KPICard kpi={kpi} role={role} />
                </motion.div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 0 && <PortfolioHealthMap role={role} />}
                {activeTab !== 0 && (
                  <div className="flex flex-col items-center justify-center min-h-[550px] glass-card">
                    <div className="w-16 h-16 rounded-full bg-acies-yellow/10 flex items-center justify-center mb-6">
                      <Zap size={32} className="text-acies-yellow" />
                    </div>
                    <h3 className="font-display text-2xl mb-1">{tabs[activeTab].name}</h3>
                    <p className="text-xs uppercase tracking-[0.2em] opacity-40 mb-8 underline underline-offset-8 decoration-acies-yellow decoration-2">Development Phase: Core Logic Integration</p>
                    <div className="max-w-md text-center opacity-60 text-sm leading-relaxed">
                      This module is being architected to integrate real-time competitor signals, SKU-level elasticity models, and automated rationalization simulations.
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} close={() => setIsSidebarOpen(false)} />

      <footer className="mt-10 border-t border-black/5 py-6 px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8">
            <button className="text-[9px] font-bold uppercase tracking-[0.1em] opacity-40 hover:opacity-100 hover:text-acies-yellow transition-all flex items-center gap-2 group">
              Diagnostic Workshop
            </button>
            <button className="text-[9px] font-bold uppercase tracking-[0.1em] opacity-40 hover:opacity-100 hover:text-acies-yellow transition-all flex items-center gap-2 group">
              Use Cases
            </button>
            <button className="text-[9px] font-bold uppercase tracking-[0.1em] opacity-40 hover:opacity-100 hover:text-acies-yellow transition-all flex items-center gap-2 group">
              Lab Explorer
            </button>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-[9px] opacity-30 font-medium uppercase tracking-widest mb-0.5">Acies Virtual Labs • April 2026</p>
            <p className="text-[8px] opacity-20 uppercase font-bold">Confidential Commercial Asset</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
