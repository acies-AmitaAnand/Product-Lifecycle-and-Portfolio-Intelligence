/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { LAUNCH_PRODUCTS } from '../../../constants/data';

export const LaunchGateTracker: React.FC = () => {
  const [expandedProductId, setExpandedProductId] = useState<string | null>(LAUNCH_PRODUCTS[0].id);

  const expandedProduct = LAUNCH_PRODUCTS.find((p) => p.id === expandedProductId);

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg mb-0.5">Stage Gate Tracker</h3>
        <p className="text-[10px] opacity-50 font-medium uppercase tracking-wider">
          Gate completion status and milestones
        </p>
      </div>

      {/* Product selector */}
      <div className="mb-4 pb-3 border-b border-black/5 dark:border-white/5">
        <label className="text-[8px] font-bold uppercase opacity-60 block mb-2">Select Product</label>
        <select
          value={expandedProductId || ''}
          onChange={(e) => setExpandedProductId(e.target.value)}
          className="w-full text-[10px] px-3 py-2 rounded border border-black/10 dark:border-white/10 bg-white dark:bg-acies-gray text-acies-gray dark:text-white focus:outline-none focus:ring-2 focus:ring-acies-yellow"
        >
          {LAUNCH_PRODUCTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Gates visualization */}
      {expandedProduct && (
        <div className="flex-1 flex flex-col">
          {/* Completed gates */}
          <div className="mb-4">
            <h4 className="text-[9px] font-bold uppercase opacity-60 mb-3 flex items-center gap-2">
              <CheckCircle size={12} className="text-green-500" />
              Completed Gates
            </h4>
            <div className="space-y-2">
              {expandedProduct.completedGates.length > 0 ? (
                expandedProduct.completedGates.map((gate, idx) => (
                  <div key={idx} className="bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500 p-3 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-[10px] font-bold text-acies-gray dark:text-white">
                          {gate.stageName}
                        </p>
                        <p className="text-[8px] opacity-60">
                          {new Date(gate.gateDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className="text-[7px] font-bold uppercase opacity-60 bg-green-200 dark:bg-green-700/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                        Complete
                      </span>
                    </div>
                    {gate.keyMilestones.length > 0 && (
                      <div className="text-[8px] opacity-70 mt-2 space-y-0.5">
                        {gate.keyMilestones.map((milestone, midx) => (
                          <div key={midx} className="flex gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                            <span>{milestone}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-[7px] opacity-50 mt-2">Owner: {gate.gateOwner}</p>
                  </div>
                ))
              ) : (
                <p className="text-[8px] opacity-50 italic">No completed gates yet</p>
              )}
            </div>
          </div>

          {/* Upcoming gates */}
          <div>
            <h4 className="text-[9px] font-bold uppercase opacity-60 mb-3 flex items-center gap-2">
              <Clock size={12} className="text-amber-500" />
              Upcoming Gates
            </h4>
            <div className="space-y-2">
              {expandedProduct.upcomingGates.length > 0 ? (
                expandedProduct.upcomingGates.map((gate, idx) => (
                  <div key={idx} className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-3 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-[10px] font-bold text-acies-gray dark:text-white">
                          {gate.stageName}
                        </p>
                        <p className="text-[8px] opacity-60">
                          {new Date(gate.gateDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className="text-[7px] font-bold uppercase opacity-60 bg-amber-200 dark:bg-amber-700/30 text-amber-700 dark:text-amber-300 px-2 py-1 rounded">
                        Planned
                      </span>
                    </div>
                    {gate.keyMilestones.length > 0 && (
                      <div className="text-[8px] opacity-70 mt-2 space-y-0.5">
                        {gate.keyMilestones.map((milestone, midx) => (
                          <div key={midx} className="flex gap-2">
                            <span className="text-amber-600 dark:text-amber-400 mt-0.5">◆</span>
                            <span>{milestone}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-[7px] opacity-50 mt-2">Owner: {gate.gateOwner}</p>
                  </div>
                ))
              ) : (
                <p className="text-[8px] opacity-50 italic">No upcoming gates</p>
              )}
            </div>
          </div>

          {/* Overall progress */}
          <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] font-bold uppercase opacity-60">Overall Gate Progress</span>
              <span className="text-[10px] font-bold">{expandedProduct.gateProgress}%</span>
            </div>
            <div className="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-blue-500 rounded-full transition-all"
                style={{ width: `${expandedProduct.gateProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
