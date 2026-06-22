/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { LAUNCH_PRODUCTS } from '../../../constants/data';
import { LaunchProduct } from '../../../types/dashboard';

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'Low':
      return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300';
    case 'Medium':
      return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300';
    case 'High':
      return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300';
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300';
  }
};

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'Launch':
      return 'bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500';
    case 'Pre-Launch':
      return 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500';
    case 'Development':
      return 'bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500';
    default:
      return 'bg-gray-50 dark:bg-gray-900/10 border-l-4 border-gray-500';
  }
};

interface LaunchProductGridProps {
  onProductSelect?: (product: LaunchProduct) => void;
}

export const LaunchProductGrid: React.FC<LaunchProductGridProps> = ({ onProductSelect }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="glass-card flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg mb-0.5">Launch Pipeline</h3>
        <p className="text-[10px] opacity-50 font-medium uppercase tracking-wider">
          Product portfolio in various launch stages
        </p>
      </div>

      <div className="space-y-3 flex-1">
        {LAUNCH_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className={`rounded-lg overflow-hidden transition-all cursor-pointer ${getStageColor(product.currentStage)}`}
            onClick={() => {
              setExpandedId(expandedId === product.id ? null : product.id);
              onProductSelect?.(product);
            }}
          >
            {/* Header Row */}
            <div className="p-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-sm text-acies-gray dark:text-white">
                    {product.name}
                  </h4>
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-50 px-2 py-1 bg-black/5 dark:bg-white/5 rounded">
                    {product.category}
                  </span>
                </div>
                <p className="text-[9px] opacity-60 mb-3">
                  Target: {new Date(product.targetLaunchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {' '}
                  • Est. Revenue: <span className="font-semibold text-acies-gray dark:text-white">${product.estimatedFirstYearRevenue}M</span>
                </p>

                {/* Readiness bar */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full transition-all"
                      style={{
                        width: `${product.overallReadiness}%`,
                        backgroundColor:
                          product.overallReadiness >= 80
                            ? '#10b981'
                            : product.overallReadiness >= 60
                            ? '#f59e0b'
                            : '#ef4444',
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-bold min-w-[40px]">{product.overallReadiness}%</span>
                </div>

                {/* Risk indicator */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[8px] font-bold uppercase px-2 py-1 rounded border ${getRiskColor(product.riskLevel)}`}>
                    {product.riskLevel === 'High' && <AlertTriangle className="inline mr-1" size={10} />}
                    {product.riskLevel} Risk
                  </span>
                  <span className="text-[8px] opacity-50 uppercase font-bold">
                    {product.currentStage} • {product.gateProgress}% progress
                  </span>
                </div>
              </div>

              {/* Chevron */}
              <button
                className="ml-4 text-acies-gray dark:text-white opacity-60 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedId(expandedId === product.id ? null : product.id);
                }}
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform ${expandedId === product.id ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {/* Expanded Details */}
            {expandedId === product.id && (
              <div className="border-t border-black/10 dark:border-white/10 px-4 py-3 bg-black/2 dark:bg-white/2 text-[9px] space-y-3">
                {/* Target markets */}
                <div>
                  <p className="font-bold uppercase opacity-60 mb-1">Target Markets</p>
                  <div className="flex flex-wrap gap-1">
                    {product.targetMarkets.map((market) => (
                      <span
                        key={market}
                        className="px-2 py-1 bg-acies-gray/10 dark:bg-white/10 rounded text-[8px]"
                      >
                        {market}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Readiness dimensions preview */}
                <div>
                  <p className="font-bold uppercase opacity-60 mb-2">Readiness by Dimension</p>
                  <div className="grid grid-cols-2 gap-2">
                    {product.readiness.map((metric) => (
                      <div key={metric.dimension} className="bg-black/5 dark:bg-white/5 p-2 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-[8px]">{metric.dimension}</span>
                          <span className="text-[8px] font-bold">{metric.readinessScore}%</span>
                        </div>
                        <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${metric.readinessScore}%`,
                              backgroundColor:
                                metric.readinessScore >= 85
                                  ? '#10b981'
                                  : metric.readinessScore >= 70
                                  ? '#f59e0b'
                                  : '#ef4444',
                            }}
                          />
                        </div>
                        <span
                          className={`text-[7px] font-bold uppercase mt-1 inline-block px-1.5 py-0.5 rounded ${
                            metric.status === 'Complete'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : metric.status === 'On Track'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          }`}
                        >
                          {metric.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key findings */}
                {product.readiness.filter(r => r.status !== 'Complete').length > 0 && (
                  <div>
                    <p className="font-bold uppercase opacity-60 mb-1">Key Risks</p>
                    <ul className="space-y-1 opacity-70">
                      {product.readiness
                        .filter(r => r.status === 'At Risk' || r.status === 'Critical')
                        .slice(0, 3)
                        .map((metric, idx) => (
                          <li key={idx} className="text-[8px] flex gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>
                              <strong>{metric.dimension}:</strong> {metric.keyFindings?.[0] || metric.status}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
