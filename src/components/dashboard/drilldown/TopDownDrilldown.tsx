/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DrilldownFilters } from './DrilldownFilters';
import { DrilldownRegionGrid } from './DrilldownRegionGrid';
import { DrilldownSkuGrid } from './DrilldownSkuGrid';
import { DrilldownSkuModal } from './DrilldownSkuModal';

interface TopDownDrilldownProps {
  isDarkMode: boolean;
  role: string;
}

const REGIONS_CONFIG: Record<string, { name: string; manager: string; email: string; role: string; plant: string }> = {
  APAC: { name: 'Asia-Pacific', manager: 'Vijay Kumar', email: 'vijay.kumar@aciesglobal.com', role: 'APAC Logistics Head', plant: 'Chennai Bottling Plant' },
  Americas: { name: 'North & South America', manager: 'Gautam Sen', email: 'gautam.sen@aciesglobal.com', role: 'National Distribution Manager', plant: 'Vapi Consumer Goods Hub' },
  EMEA: { name: 'Europe, Middle East & Africa', manager: 'Jean-Pierre Dubois', email: 'jp.dubois@aciesglobal.com', role: 'Commodities Hedging Director', plant: 'Baddi Manufacturing Hub' },
  LATAM: { name: 'Latin America', manager: 'Dieter Maes', email: 'dieter.maes@aciesglobal.com', role: 'Production Scheduler', plant: 'Vapi Consumer Goods Hub' },
};

const REGION_SKUS: Record<string, string[]> = {
  APAC: ['Mango Fizz 500ml', 'Oat Cookies', 'Herbal Shampoo', 'Hand Cream SPF'],
  Americas: ['Choco Wafers', 'Fabric Softener', 'Floor Cleaner', 'Green Tea RTD'],
  EMEA: ['Dish Soap 1L', 'Aloe Vera Drink', 'Masala Puffs', 'Foam Face Wash'],
  LATAM: ['Mango Fizz 500ml', 'Oat Cookies', 'Fabric Softener', 'Floor Cleaner'],
};

export const TopDownDrilldown: React.FC<TopDownDrilldownProps> = ({ isDarkMode }) => {
  // Horizon and metric states
  const [timeHorizon, setTimeHorizon] = useState<'1M' | '3M' | '6M' | 'YTD' | '12M' | '3Y'>('3M');
  const [selectedMetric, setSelectedMetric] = useState<'rev' | 'margin' | 'otif'>('rev');
  
  // Region state
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // SKU state & Modal state
  const activeRegionSkus = selectedRegion ? (REGION_SKUS[selectedRegion] || []) : [];
  const [selectedSkuName, setSelectedSkuName] = useState<string>('');
  const [isSkuModalOpen, setIsSkuModalOpen] = useState<boolean>(false);

  // Synchronize SKU selection if region changes
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    const skusForRegion = REGION_SKUS[region] || [];
    setSelectedSkuName(skusForRegion[0] || '');
  };

  const handleSkuSelect = (skuName: string) => {
    setSelectedSkuName(skuName);
    setIsSkuModalOpen(true);
  };

  // Dynamic multipliers based on time horizon
  const getHorizonMultiplier = () => {
    switch (timeHorizon) {
      case '1M': return 0.33;
      case '6M': return 2.0;
      case 'YTD': return 1.67;
      case '12M': return 4.0;
      case '3Y': return 12.0;
      case '3M':
      default: return 1.0;
    }
  };

  const multiplier = getHorizonMultiplier();
  const regionalConfig = REGIONS_CONFIG[selectedRegion] || REGIONS_CONFIG.APAC;

  return (
    <div className="space-y-6 animate-fadeIn w-full">

      {/* Hierarchical Stepper Breadcrumb Header */}
      <div className="flex items-center gap-2.5 px-4.5 py-2.5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-505 dark:text-zinc-400 w-full shadow-sm shrink-0">
        <span className="text-[#8b5cf6] dark:text-[#a78bfa] flex items-center gap-1">
          🏢 Global HQ
        </span>
        <span className="opacity-30 text-[12px] font-light">&rarr;</span>
        {selectedRegion ? (
          <button 
            onClick={() => {
              setSelectedRegion(null);
              setSelectedSkuName('');
            }}
            className="text-[#8b5cf6] dark:text-[#a78bfa] hover:underline hover:text-indigo-500 dark:hover:text-indigo-300 bg-transparent border-none cursor-pointer p-0 font-extrabold flex items-center gap-1 uppercase text-[10px]"
            title="Reset Region Selection"
          >
            🌎 Hub: {selectedRegion} ({REGIONS_CONFIG[selectedRegion]?.plant.split(' ')[0]})
          </button>
        ) : (
          <span className="opacity-55 italic text-zinc-400">(Select Region Node below)</span>
        )}
        <span className="opacity-30 text-[12px] font-light">&rarr;</span>
        {selectedSkuName ? (
          <span className="text-[#f59e0b] font-black">
            📦 SKU: {selectedSkuName}
          </span>
        ) : (
          <span className="opacity-55 italic text-zinc-400">(Select SKU variant)</span>
        )}
      </div>

      {/* Selector Options Horizontally Stacked (Full Width) */}
      <div className="space-y-6">
        
        {/* Horizontal Filters Row */}
        <DrilldownFilters 
          timeHorizon={timeHorizon}
          setTimeHorizon={setTimeHorizon}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
        />

        {/* Horizontal Regional Progress Grid */}
        <DrilldownRegionGrid 
          selectedRegion={selectedRegion}
          onRegionSelect={handleRegionChange}
          selectedMetric={selectedMetric}
          multiplier={multiplier}
          timeHorizon={timeHorizon}
        />

        {/* Horizontal Selectable SKU chips */}
        {selectedRegion && (
          <DrilldownSkuGrid 
            activeRegionSkus={activeRegionSkus}
            selectedSkuName={selectedSkuName}
            onSkuSelect={handleSkuSelect}
            selectedRegionName={regionalConfig.name}
          />
        )}

      </div>

      {/* Center Detailed Diagnostics Popup Modal Window */}
      <DrilldownSkuModal 
        isOpen={isSkuModalOpen}
        onClose={() => setIsSkuModalOpen(false)}
        skuName={selectedSkuName}
        selectedRegion={selectedRegion || ''}
        timeHorizon={timeHorizon}
        multiplier={multiplier}
        isDarkMode={isDarkMode}
      />

    </div>
  );
};
