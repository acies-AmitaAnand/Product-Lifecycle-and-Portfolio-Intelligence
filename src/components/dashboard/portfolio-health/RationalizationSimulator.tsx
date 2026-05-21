/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RATIONALIZATION_SCENARIOS } from '../../../constants/data';

const METRIC_CONFIG = [
  { key: 'revenueImpact',    label: 'Revenue Impact',      suffix: '%', isNegative: true,  color: '#f87171', description: 'Top-line revenue loss from SKU removals' },
  { key: 'marginImpact',     label: 'Margin Impact',       suffix: '%', isNegative: true,  color: '#fbbf24', description: 'Gross margin change from SKU removals' },
  { key: 'safetyStockFreed', label: 'Safety Stock Freed',  suffix: '%', isNegative: false, color: '#4ade80', description: 'Working capital released ($246M pool)' },
  { key: 'skusRemoved',      label: 'SKUs Removed',        suffix: '',  isNegative: false, color: '#60a5fa', description: 'Number of SKUs eliminated from portfolio' },
  { key: 'supplierReduction', label: 'Supplier Reduction', suffix: '%', isNegative: false, color: '#a78bfa', description: 'Reduction in active supplier relationships' },
];

export const RationalizationSimulator: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState(() => {
    try {
      const hash = window.location.hash || '#';
      const params = new URLSearchParams(hash.substring(1));
      const hashVal = params.get('scenario');
      if (hashVal !== null) {
        const parsed = parseInt(hashVal, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < RATIONALIZATION_SCENARIOS.length) {
          return parsed;
        }
      }
      
      const saved = localStorage.getItem('acies_active_scenario');
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < RATIONALIZATION_SCENARIOS.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not load scenario state:", e);
    }
    return 0;
  });

  useEffect(() => {
    try {
      localStorage.setItem('acies_active_scenario', activeScenario.toString());
      
      const hash = window.location.hash || '#';
      const params = new URLSearchParams(hash.substring(1));
      params.set('scenario', activeScenario.toString());
      window.history.replaceState(null, '', '#' + params.toString());
    } catch (e) {
      console.warn("Could not save scenario state:", e);
    }
  }, [activeScenario]);

  const scenario = RATIONALIZATION_SCENARIOS[activeScenario];

  return (
    <div className="glass-card flex flex-col gap-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg">Rationalization Impact Simulator</h3>
          <p className="text-[9px] opacity-40 uppercase tracking-wider mt-0.5">
            Model the financial and operational effect of tiered SKU deletion
          </p>
        </div>
        <div className="text-right">
          <p className="text-[8px] opacity-40 uppercase">Active Scenario</p>
          <p className="text-sm font-display text-acies-yellow">{scenario.label}</p>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1">
        {RATIONALIZATION_SCENARIOS.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveScenario(i)}
            className={`flex-1 py-1.5 px-2 text-[9px] font-bold uppercase tracking-wider transition-all ${
              activeScenario === i
                ? 'bg-acies-gray dark:bg-white/10 text-acies-yellow'
                : 'text-acies-gray dark:text-white/60 opacity-50 hover:opacity-100 hover:text-acies-gray dark:hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Impact Metrics */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScenario}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-5 gap-3"
        >
          {METRIC_CONFIG.map((m) => {
            const raw = scenario[m.key as keyof typeof scenario] as number;
            const display = m.isNegative && raw !== 0 ? `${raw.toFixed(2)}%` : m.suffix === '%' ? `+${raw.toFixed(2)}%` : String(raw);
            const isZero = raw === 0;
            const isNegativeImpact = m.isNegative && raw < 0;

            return (
              <div
                key={m.key}
                className="border border-black/5 dark:border-white/5 p-3 flex flex-col gap-1 hover:border-acies-yellow/40 transition-colors"
                title={m.description}
              >
                <p className="text-[8px] font-bold uppercase opacity-40 leading-tight">{m.label}</p>
                <p
                  className="text-2xl font-display leading-none"
                  style={{ color: isZero ? '#888' : m.color }}
                >
                  {display}
                </p>
                {isZero && m.key === 'supplierReduction' && (
                  <p className="text-[7px] text-red-500 font-bold uppercase leading-tight">
                    ⚠ No reduction possible
                  </p>
                )}
                {isNegativeImpact && (
                  <p className="text-[7px] opacity-40 leading-tight">{m.description}</p>
                )}
                {!isNegativeImpact && !isZero && (
                  <p className="text-[7px] opacity-40 leading-tight">{m.description}</p>
                )}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Visual progress bars */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[8px] font-bold uppercase opacity-40 mb-2">Revenue at Risk</p>
          <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
              key={`rev-${activeScenario}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.abs(scenario.revenueImpact)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-red-400 rounded-full"
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[7px] opacity-30">0%</span>
            <span className="text-[7px] font-bold text-red-500">{Math.abs(scenario.revenueImpact)}%</span>
            <span className="text-[7px] opacity-30">30%</span>
          </div>
        </div>
        <div>
          <p className="text-[8px] font-bold uppercase opacity-40 mb-2">Safety Stock Freed</p>
          <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
              key={`ss-${activeScenario}`}
              initial={{ width: 0 }}
              animate={{ width: `${scenario.safetyStockFreed}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-green-400 rounded-full"
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[7px] opacity-30">0%</span>
            <span className="text-[7px] font-bold text-green-500">+{scenario.safetyStockFreed}%</span>
            <span className="text-[7px] opacity-30">50%</span>
          </div>
        </div>
      </div>

      {/* Critical structural insight */}
      <div className="bg-acies-offwhite dark:bg-white/5 border border-black/5 dark:border-white/5 text-acies-gray dark:text-white p-3 flex items-start gap-3">
        <div className="w-px h-full bg-acies-yellow self-stretch shrink-0" />
        <div>
          <p className="text-[9px] font-bold text-acies-yellow uppercase mb-1">Structural Constraint: Zero Supplier Reduction</p>
          <p className="text-[9px] opacity-70 leading-relaxed">
            All 60 suppliers are fully interconnected across the entire portfolio. Removing any combination of SKUs — even the full 35-item Rationalize segment — fails to eliminate a single supplier relationship. The supplier network must be <span className="text-acies-yellow">actively restructured</span> from 60 universal to specialized category clusters to unlock overhead savings.
          </p>
        </div>
      </div>
    </div>
  );
};
