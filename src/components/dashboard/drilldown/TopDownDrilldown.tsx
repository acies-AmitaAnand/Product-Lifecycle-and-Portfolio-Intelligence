/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DrilldownFilters }      from './DrilldownFilters';
import { DrilldownNetworkGraph } from './DrilldownNetworkGraph';
import { DrilldownRegionGrid }   from './DrilldownRegionGrid';
import { DrilldownSkuGrid }      from './DrilldownSkuGrid';
import { DrilldownSkuModal }     from './DrilldownSkuModal';

interface TopDownDrilldownProps {
  isDarkMode: boolean;
  role: string;
}

const REGIONS_CONFIG: Record<string, { name: string; manager: string; email: string; role: string; plant: string }> = {
  APAC:     { name: 'Asia-Pacific',                manager: 'Vijay Kumar',         email: 'vijay.kumar@aciesglobal.com', role: 'APAC Logistics Head',           plant: 'Chennai Bottling Plant'  },
  Americas: { name: 'North & South America',       manager: 'Gautam Sen',          email: 'gautam.sen@aciesglobal.com',  role: 'National Distribution Manager', plant: 'Vapi Consumer Goods Hub' },
  EMEA:     { name: 'Europe, Middle East & Africa', manager: 'Jean-Pierre Dubois', email: 'jp.dubois@aciesglobal.com',   role: 'Commodities Hedging Director',  plant: 'Baddi Manufacturing Hub' },
  LATAM:    { name: 'Latin America',               manager: 'Dieter Maes',         email: 'dieter.maes@aciesglobal.com', role: 'Production Scheduler',          plant: 'Vapi Consumer Goods Hub' },
};

const REGION_SKUS: Record<string, string[]> = {
  APAC:     ['Mango Fizz 500ml', 'Oat Cookies',     'Herbal Shampoo',  'Hand Cream SPF'],
  Americas: ['Choco Wafers',     'Fabric Softener',  'Floor Cleaner',   'Green Tea RTD'],
  EMEA:     ['Dish Soap 1L',     'Aloe Vera Drink',  'Masala Puffs',    'Foam Face Wash'],
  LATAM:    ['Mango Fizz 500ml', 'Oat Cookies',      'Fabric Softener', 'Floor Cleaner'],
};

export const TopDownDrilldown: React.FC<TopDownDrilldownProps> = ({ isDarkMode }) => {
  const [timeHorizon,    setTimeHorizon]    = useState<'1M' | '3M' | '6M' | 'YTD' | '12M' | '3Y'>('3M');
  const [selectedMetric, setSelectedMetric] = useState<'rev' | 'margin' | 'otif'>('rev');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedSkuName, setSelectedSkuName]   = useState<string>('');
  const [isSkuModalOpen,  setIsSkuModalOpen]     = useState<boolean>(false);

  const activeRegionSkus = selectedRegion ? (REGION_SKUS[selectedRegion] || []) : [];

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedSkuName(REGION_SKUS[region]?.[0] || '');
  };

  const handleSkuSelect = (skuName: string) => {
    setSelectedSkuName(skuName);
    setIsSkuModalOpen(true);
  };

  const getHorizonMultiplier = () => {
    switch (timeHorizon) {
      case '1M':  return 0.33;
      case '6M':  return 2.0;
      case 'YTD': return 1.67;
      case '12M': return 4.0;
      case '3Y':  return 12.0;
      case '3M':
      default:    return 1.0;
    }
  };

  const multiplier     = getHorizonMultiplier();
  const regionalConfig = REGIONS_CONFIG[selectedRegion as string] || REGIONS_CONFIG.APAC;

  return (
    <div className="animate-fadeIn w-full flex flex-col gap-3">

      {/* ── Breadcrumb (single compact row) ── */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm w-full shrink-0">
        <span className="text-[#8b5cf6] dark:text-[#a78bfa]">🏢 Global HQ</span>
        <span className="opacity-25 text-[11px] font-light">&rarr;</span>
        {selectedRegion ? (
          <button
            onClick={() => { setSelectedRegion(null); setSelectedSkuName(''); }}
            className="text-[#8b5cf6] dark:text-[#a78bfa] hover:underline bg-transparent border-none cursor-pointer p-0 font-extrabold uppercase text-[10px]"
            title="Reset Region"
          >
            🌎 {selectedRegion} Hub
          </button>
        ) : (
          <span className="opacity-40 italic text-zinc-400 normal-case font-normal">Select a region node →</span>
        )}
        <span className="opacity-25 text-[11px] font-light">&rarr;</span>
        {selectedSkuName ? (
          <span className="text-[#f59e0b] font-black">📦 {selectedSkuName}</span>
        ) : (
          <span className="opacity-40 italic text-zinc-400 normal-case font-normal">Select a SKU variant</span>
        )}
      </div>

      {/* ── Main two-column layout ── */}
      <div className="flex flex-col xl:flex-row gap-3 w-full">

        {/* LEFT: Filters + Network graph */}
        <div className="flex flex-col gap-3 xl:w-[380px] shrink-0">
          <DrilldownFilters
            timeHorizon={timeHorizon}
            setTimeHorizon={setTimeHorizon}
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
          />
          <DrilldownNetworkGraph
            selectedRegion={selectedRegion}
            onRegionSelect={handleRegionChange}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* RIGHT: Region cards + SKU grid */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <DrilldownRegionGrid
            selectedRegion={selectedRegion}
            onRegionSelect={handleRegionChange}
            selectedMetric={selectedMetric}
            multiplier={multiplier}
            timeHorizon={timeHorizon}
            isDarkMode={isDarkMode}
          />

          {selectedRegion && (
            <DrilldownSkuGrid
              activeRegionSkus={activeRegionSkus}
              selectedSkuName={selectedSkuName}
              onSkuSelect={handleSkuSelect}
              selectedRegionName={regionalConfig.name}
            />
          )}
        </div>

      </div>

      {/* ── SKU Diagnostics Modal ── */}
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
