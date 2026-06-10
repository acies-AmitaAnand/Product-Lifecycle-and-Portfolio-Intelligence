import React, { useState } from 'react';
import { Role } from '../../../types/dashboard';
import { AssortmentKPICards } from './AssortmentKPICards';
import { RegionalAssortmentGrid } from './RegionalAssortmentGrid';
import { ParetoConcentration } from './ParetoConcentration';
import { TransferenceSimulator } from './TransferenceSimulator';
import { CrossLocationTransfer } from './CrossLocationTransfer';
import { LaunchEvaluator } from './LaunchEvaluator';
import { ExecutiveCart } from './ExecutiveCart';
import { StagedAction } from './types';

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

  const [stagedActions, setStagedActions] = useState<StagedAction[]>([]);

  const handleStageAction = (action: StagedAction) => {
    setStagedActions(prev => [...prev, action]);
  };

  const handleRemoveAction = (id: string) => {
    setStagedActions(prev => prev.filter(a => a.id !== id));
  };

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
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* Assortment Header KPI Strip */}
      <AssortmentKPICards 
        role={role} 
        onAuditClick={onAuditClick} 
        customValues={kpiOverrides} 
      />

      {/* Regional Footprints & Optimizer Grid */}
      <RegionalAssortmentGrid 
        onSliderChange={handleSliderChange} 
        onStageAction={handleStageAction} 
      />

      {/* Pareto Curve & Concentration Analysis */}
      <ParetoConcentration />

      {/* Demand Transference & Substitution Simulator */}
      <TransferenceSimulator onStageAction={handleStageAction} />

      {/* SKU Launch Accretion & Cannibalization Evaluator */}
      <LaunchEvaluator onStageAction={handleStageAction} />

      {/* Cross-Location Assortment Reallocation */}
      <CrossLocationTransfer onStageAction={handleStageAction} />

      {/* Executive Decision Cart */}
      <ExecutiveCart 
        stagedActions={stagedActions} 
        onRemoveAction={handleRemoveAction} 
        onClearCart={() => setStagedActions([])} 
      />
    </div>
  );
};

export default AssortmentOverview;
