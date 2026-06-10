import React, { useState } from 'react';
import { Role } from '../../../types/dashboard';
import { AssortmentKPICards } from './AssortmentKPICards';
import { RegionalAssortmentGrid } from './RegionalAssortmentGrid';
import { ParetoConcentration } from './ParetoConcentration';
import { TransferenceSimulator } from './TransferenceSimulator';
import { CrossLocationTransfer } from './CrossLocationTransfer';

interface AssortmentOverviewProps {
  role: Role;
  isDarkMode: boolean;
  onAuditClick: (metricName: string) => void;
}

export const AssortmentOverview: React.FC<AssortmentOverviewProps> = ({ role, isDarkMode, onAuditClick }) => {
  // Local state to manage overrides passed from slider in RegionalAssortmentGrid to AssortmentKPICards
  const [kpiOverrides, setKpiOverrides] = useState<{
    density: string;
    burden: string;
    yieldVal: string;
    cannibalization: string;
  }>({
    density: '102 SKUs',
    burden: '66.7%',
    yieldVal: '₹3.02 Cr',
    cannibalization: '0.62'
  });

  const handleSliderChange = (simValues: {
    densityVal: string;
    burdenVal: string;
    yieldVal: string;
    cannibalizationVal: string;
  }) => {
    setKpiOverrides({
      density: simValues.densityVal,
      burden: simValues.burdenVal,
      yieldVal: simValues.yieldVal,
      cannibalization: simValues.cannibalizationVal
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Assortment Header KPI Strip */}
      <AssortmentKPICards 
        role={role} 
        onAuditClick={onAuditClick} 
        customValues={kpiOverrides} 
      />

      {/* Regional Footprints & Optimizer Grid */}
      <RegionalAssortmentGrid onSliderChange={handleSliderChange} />

      {/* Pareto Curve & Concentration Analysis */}
      <ParetoConcentration />

      {/* Demand Transference & Substitution Simulator */}
      <TransferenceSimulator />

      {/* Cross-Location Assortment Reallocation */}
      <CrossLocationTransfer />
    </div>
  );
};

export default AssortmentOverview;
