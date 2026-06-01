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
  const [timeHorizon, setTimeHorizon] = useState<'Q1' | 'Q2' | 'H1' | 'FY'>('Q2');
  const [selectedMetric, setSelectedMetric] = useState<'rev' | 'margin' | 'otif'>('rev');
  
  // Region state
  const [selectedRegion, setSelectedRegion] = useState<string>('APAC');

  // SKU state & Modal state
  const activeRegionSkus = REGION_SKUS[selectedRegion] || [];
  const [selectedSkuName, setSelectedSkuName] = useState<string>(activeRegionSkus[0]);
  const [isSkuModalOpen, setIsSkuModalOpen] = useState<boolean>(false);

  // Synchronize SKU selection if region changes
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    const skusForRegion = REGION_SKUS[region] || [];
    setSelectedSkuName(skusForRegion[0]);
  };

  const handleSkuSelect = (skuName: string) => {
    setSelectedSkuName(skuName);
    setIsSkuModalOpen(true);
  };

  // Dynamic multipliers based on time horizon
  const getHorizonMultiplier = () => {
    switch (timeHorizon) {
      case 'Q1': return 0.92;
      case 'H1': return 2.0;
      case 'FY': return 4.1;
      case 'Q2':
      default: return 1.0;
    }
  };

  const multiplier = getHorizonMultiplier();
  const regionalConfig = REGIONS_CONFIG[selectedRegion] || REGIONS_CONFIG.APAC;

  return (
    <div className="space-y-6 animate-fadeIn w-full">

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
        <DrilldownSkuGrid 
          activeRegionSkus={activeRegionSkus}
          selectedSkuName={selectedSkuName}
          onSkuSelect={handleSkuSelect}
          selectedRegionName={regionalConfig.name}
        />

      </div>

      {/* Center Detailed Diagnostics Popup Modal Window */}
      <DrilldownSkuModal 
        isOpen={isSkuModalOpen}
        onClose={() => setIsSkuModalOpen(false)}
        skuName={selectedSkuName}
        selectedRegion={selectedRegion}
        timeHorizon={timeHorizon}
        multiplier={multiplier}
        isDarkMode={isDarkMode}
      />

    </div>
  );
};
