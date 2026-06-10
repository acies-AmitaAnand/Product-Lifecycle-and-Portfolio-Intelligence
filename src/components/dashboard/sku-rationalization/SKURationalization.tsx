/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Role } from '../../../types/dashboard';
import { Download, Search, CheckCircle2, Activity, X } from 'lucide-react';
import { SkuIntelligenceModal } from './SkuIntelligenceModal';
import { ProductDirectory } from './ProductDirectory';
import { KPICard } from '../KPICard';
import { KpiActionModal } from './KpiActionModal';
import { SegmentFilters } from './SegmentFilters';
import { ValueComplexitySection } from './ValueComplexitySection';
import { PLSimulatorSection } from './PLSimulatorSection';
import { SkuToolbar } from './SkuToolbar';
import { CannibalizationAnalystView } from './CannibalizationAnalystView';
import { useSkuRationalizationState } from './useSkuRationalizationState';
import { ActionRoutingPanel } from './ActionRoutingPanel';

// Re-export constants and pure functions to prevent breaking sibling imports
export { srClassify, SR_CLASSES, getSkuLocation } from './skuConstants';

interface SKURationalizationProps {
  role: Role;
  isDarkMode: boolean;
  setActiveTab?: (tabId: number) => void;
}

export const SKURationalization: React.FC<SKURationalizationProps> = ({ role, isDarkMode, setActiveTab }) => {
  const state = useSkuRationalizationState(role, isDarkMode);

  // Audit Ledger filtering states
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerTeamFilter, setLedgerTeamFilter] = useState('ALL');

  const filteredLogs = useMemo(() => {
    return (state.auditLog || []).filter(log => {
      const matchSearch = 
        log.skuA.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        log.skuB.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        log.actionLabel.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        log.rationale.toLowerCase().includes(ledgerSearch.toLowerCase());
      const matchTeam = ledgerTeamFilter === 'ALL' || log.team.toLowerCase().replace(' ', '') === ledgerTeamFilter.toLowerCase().replace(' ', '');
      return matchSearch && matchTeam;
    });
  }, [state.auditLog, ledgerSearch, ledgerTeamFilter]);

  const exportLogsCSV = () => {
    const headers = ['Audit ID', 'Timestamp', 'SKU A', 'SKU B', 'Team', 'Action', 'Parameters', 'Rationale', 'Risk Score'];
    const rows = (state.auditLog || []).map(entry => [
      entry.id,
      entry.timestamp,
      entry.skuA,
      entry.skuB,
      entry.team,
      entry.actionLabel,
      entry.details,
      entry.rationale,
      entry.riskScore
    ]);
    const csvContent = [headers, ...rows].map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Rationalization_Audit_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-zinc-800 dark:text-white">
      
      {/* Consolidated Toolbar Header */}
      <SkuToolbar
        role={role}
        isDarkMode={isDarkMode}
        activeView={state.activeView}
        setActiveView={state.setActiveView}
        selectedLocation={state.selectedLocation}
        setSelectedLocation={state.setSelectedLocation}
        refreshTime={state.refreshTime}
        setSelectedAiClass={state.setSelectedAiClass}
      />

      {/* KPI Cards Strip */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${role === 'VP Product Management' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-3`}>
        {state.kpis.map((kpi) => (
          <KPICard 
            key={kpi.label}
            kpi={kpi} 
            role={role} 
            onAuditClick={() => state.setActiveKpiAction(kpi.label)}
          />
        ))}
      </div>

      {/* WORKSPACE VIEW 1: STRATEGIC SIMULATOR VIEW */}
      {state.activeView === 'simulator' && (
        <div className="space-y-6">
          
          <SegmentFilters
            groups={state.groups}
            selectedAiClass={state.selectedAiClass}
            setSelectedAiClass={state.setSelectedAiClass}
          />

          <ValueComplexitySection
            groupedBarData={state.groupedBarData}
            rankedPriorities={state.rankedPriorities}
            selectedAiClass={state.selectedAiClass}
            setSelectedSkuName={state.setSelectedSkuName}
            setSimTab={state.setSimTab}
            setSelectedSkuDetails={state.setSelectedSkuDetails}
            isDarkMode={isDarkMode}
            gridStroke={state.gridStroke}
            tickColor={state.tickColor}
            tooltipBg={state.tooltipBg}
            tooltipBorder={state.tooltipBorder}
            tooltipText={state.tooltipText}
          />

          <PLSimulatorSection
            simTab={state.simTab}
            setSimTab={state.setSimTab}
            selectedSkuName={state.selectedSkuName}
            setSelectedSkuName={state.setSelectedSkuName}
            skusByCategory={state.skusByCategory}
            setSelectedSkuDetails={state.setSelectedSkuDetails}
            priceChange={state.priceChange}
            setPriceChange={state.setPriceChange}
            volumeElasticity={state.volumeElasticity}
            setVolumeElasticity={state.setVolumeElasticity}
            projectedRevenue={state.projectedRevenue}
            setProjectedRevenue={state.setProjectedRevenue}
            expectedMargin={state.expectedMargin}
            setExpectedMargin={state.setExpectedMargin}
            cannibalizationRisk={state.cannibalizationRisk}
            setCannibalizationRisk={state.setCannibalizationRisk}
            handleRunSim={state.handleRunSim}
            isSimulating={state.isSimulating}
            btnText={state.btnText}
            selectedSku={state.selectedSku}
            removeRevImpact={state.removeRevImpact}
            removeMarginImpact={state.removeMarginImpact}
            removeCustImpact={state.removeCustImpact}
            removeScImpact={state.removeScImpact}
            volChange={state.volChange}
            newRev={state.newRev}
            revDelta={state.revDelta}
            newMargin={state.newMargin}
            cannRiskLabel={state.cannRiskLabel}
            netLaunchRev={state.netLaunchRev}
            paretoData={state.paretoData}
            totalRev={state.totalRev}
            selectedAiClass={state.selectedAiClass}
            isDarkMode={isDarkMode}
            gridStroke={state.gridStroke}
            tickColor={state.tickColor}
            tooltipBg={state.tooltipBg}
            tooltipBorder={state.tooltipBorder}
            tooltipText={state.tooltipText}
          />

          {/* PORTFOLIO INTELLIGENCE DIRECTORY */}
          <div id="product-directory-section" style={{ scrollMarginTop: '100px' }}>
            <ProductDirectory 
              onSelectSku={(sku) => state.setSelectedSkuDetails(sku)} 
              selectedLocation={state.selectedLocation} 
              shortlistedSkus={state.shortlistedSkus}
              frozenSkus={state.frozenSkus}
            />
          </div>

        </div>
      )}

      {/* WORKSPACE VIEW 2: CANNIBALIZATION & PROMO ANALYST */}
      {state.activeView === 'analyst' && (
        <CannibalizationAnalystView
          skuA={state.skuA}
          setSkuA={state.setSkuA}
          skuB={state.skuB}
          setSkuB={state.setSkuB}
          correlation={state.correlation}
          setCorrelation={state.setCorrelation}
          category={state.category}
          hasScored={state.hasScored}
          setHasScored={state.setHasScored}
          selectedRoutingTeam={state.selectedRoutingTeam}
          setSelectedRoutingTeam={state.setSelectedRoutingTeam}
          setSelectedSkuDetails={state.setSelectedSkuDetails}
          skuACategory={state.skuACategory}
          skuBOptions={state.skuBOptions}
          skusByCategory={state.skusByCategory}
          pairRisk={state.pairRisk}
          riskVerdict={state.riskVerdict}
          verdictColor={state.verdictColor}
          scatterPairsData={state.scatterPairsData}
          promoErosionData={state.promoErosionData}
          highRiskPairs={state.highRiskPairs}
          moderateRiskPairs={state.moderateRiskPairs}
          promoRiskSkus={state.promoRiskSkus}
          handleAnalystScatterClick={state.handleAnalystScatterClick}
          isDarkMode={isDarkMode}
          gridStroke={state.gridStroke}
          tickColor={state.tickColor}
          tooltipBg={state.tooltipBg}
          tooltipBorder={state.tooltipBorder}
          tooltipText={state.tooltipText}
          // Control Center states & actions
          completedSteps={state.completedSteps}
          setStepCompleted={state.setStepCompleted}
          resetPairWorkflow={state.resetPairWorkflow}
          shortlistedSkus={state.shortlistedSkus}
          shortlistSku={state.shortlistSku}
          unshortlistSku={state.unshortlistSku}
          frozenSkus={state.frozenSkus}
          freezeSkuReplenishment={state.freezeSkuReplenishment}
          unfreezeSkuReplenishment={state.unfreezeSkuReplenishment}
          isControlCenterOpen={state.isControlCenterOpen}
          setIsControlCenterOpen={state.setIsControlCenterOpen}
          auditLog={state.auditLog}
          logAction={state.logAction}
          removeActionLog={state.removeActionLog}
        />
      )}



      {/* ⑥ CROSS-FUNCTIONAL ACTIONS & AUDIT LOG LEDGER */}
      <div className="space-y-3 pt-6 border-t border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between gap-4 py-0.5 w-full">
          <div className="flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              ⑥ Cross-Functional Actions & Audit Log Ledger
            </h3>
          </div>
          {state.auditLog && state.auditLog.length > 0 && (
            <button
              onClick={exportLogsCSV}
              className="flex items-center gap-1.5 px-3 py-1 text-[9px] font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer transition shadow-sm border-none"
            >
              <Download size={10} />
              <span>Export CSV</span>
            </button>
          )}
        </div>

        <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 shadow-sm rounded-xl space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Search audit trail by variant name, action or rationale..." 
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                className="w-full bg-black/5 dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded-lg py-2 px-3 pl-8 text-xs font-semibold text-acies-gray dark:text-white outline-none focus:border-emerald-600"
              />
              <span className="absolute left-2.5 top-2.5 text-zinc-450 dark:text-zinc-500 text-xs">
                <Search size={12} />
              </span>
            </div>
            <select 
              value={ledgerTeamFilter}
              onChange={(e) => setLedgerTeamFilter(e.target.value)}
              className="bg-black/5 dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded-lg py-2 px-3 text-xs font-bold text-acies-gray dark:text-white outline-none focus:border-emerald-600"
            >
              <option value="ALL">All Teams</option>
              <option value="pricing">Pricing & Finance</option>
              <option value="product">Product Management</option>
              <option value="supplychain">Supply Chain Ops</option>
            </select>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 text-zinc-400 font-bold uppercase tracking-wider text-[8px]">
                  <th className="py-2.5 px-3">Audit ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Variant Pair</th>
                  <th className="py-2.5 px-3">Team</th>
                  <th className="py-2.5 px-3">Action Executed</th>
                  <th className="py-2.5 px-3">Parameters & Audit Rationale</th>
                  <th className="py-2.5 px-3 text-right">Sign-Off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                    <td className="py-3 px-3 font-mono font-bold text-zinc-450">{log.id}</td>
                    <td className="py-3 px-3 text-zinc-400 font-bold whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-3">
                      <div className="font-black text-acies-gray dark:text-zinc-200">
                        {log.skuA} <span className="text-zinc-400 font-normal">↔</span> {log.skuB}
                      </div>
                      <div className="text-[8px] text-zinc-400 font-bold uppercase">Risk: {(log.riskScore * 100).toFixed(0)}%</div>
                    </td>
                    <td className="py-3 px-3 uppercase tracking-wider text-[8px] font-black">
                      <span className={`px-2 py-0.5 rounded ${
                        log.team === 'pricing' ? 'bg-red-500/10 text-red-500' :
                        log.team === 'product' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {log.team === 'pricing' ? 'Pricing' : log.team === 'product' ? 'Product' : 'Supply'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-extrabold uppercase text-acies-gray dark:text-zinc-200">{log.actionLabel}</td>
                    <td className="py-3 px-3 text-zinc-500 dark:text-zinc-450 leading-relaxed max-w-sm">
                      <div className="font-black text-[9px] text-zinc-400 uppercase">Params: {log.details}</div>
                      <div className="mt-0.5">{log.rationale}</div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-500 text-[8px] font-black uppercase">
                        <CheckCircle2 size={10} />
                        <span>Success</span>
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">
                      No actions executed on the ledger yet. Open the Control Room to execute steps.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SKU DETAIL MODAL WINDOW */}
      <SkuIntelligenceModal
        sku={state.selectedSkuDetails}
        onClose={() => state.setSelectedSkuDetails(null)}
        setActiveTab={setActiveTab}
        onLoadInSimulator={(skuName) => {
          state.setSelectedSkuName(skuName);
          state.setSimTab('remove');
          state.setActiveView('simulator');
        }}
        auditLog={state.auditLog}
      />

      {/* KPI ACTION OPTIONS MODAL */}
      <KpiActionModal
        activeKpi={state.activeKpiAction}
        onClose={() => state.setActiveKpiAction(null)}
        setSelectedAiClass={state.setSelectedAiClass}
        setActiveView={state.setActiveView}
        setSimTab={state.setSimTab}
        setSelectedSkuName={state.setSelectedSkuName}
        setSelectedSkuDetails={(sku) => state.setSelectedSkuDetails(sku)}
      />

      {/* Full-Screen Action Control Room Modal Overlay */}
      {state.isControlCenterOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm z-[999] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fadeIn font-sans">
          <div className="bg-white dark:bg-acies-offwhite border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative text-zinc-850 dark:text-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-acies-gray dark:text-white flex items-center gap-2">
                  <Activity className="text-purple-600 dark:text-purple-400 stroke-[2.5]" size={16} />
                  <span>Action Control Desk</span>
                </h3>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-555 font-bold uppercase mt-1">
                  Manage and authorize operations for sibling variant: {state.skuA} vs {state.skuB}
                </p>
              </div>
              <button
                onClick={() => state.setIsControlCenterOpen(false)}
                className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 border-none rounded-lg cursor-pointer text-zinc-450 hover:text-zinc-800 dark:hover:text-white transition bg-transparent"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable routing panel */}
            <div className="flex-1 overflow-y-auto p-6 bg-black/[0.01] dark:bg-acies-gray/50">
              <ActionRoutingPanel
                hasScored={state.hasScored}
                pairRisk={state.pairRisk}
                riskVerdict={state.riskVerdict}
                verdictColor={state.verdictColor}
                skuA={state.skuA}
                skuB={state.skuB}
                category={state.category}
                selectedRoutingTeam={state.selectedRoutingTeam}
                setSelectedRoutingTeam={state.setSelectedRoutingTeam}
                completedSteps={state.completedSteps}
                setStepCompleted={state.setStepCompleted}
                resetPairWorkflow={state.resetPairWorkflow}
                shortlistedSkus={state.shortlistedSkus}
                shortlistSku={state.shortlistSku}
                unshortlistSku={state.unshortlistSku}
                frozenSkus={state.frozenSkus}
                freezeSkuReplenishment={state.freezeSkuReplenishment}
                unfreezeSkuReplenishment={state.unfreezeSkuReplenishment}
                logAction={state.logAction}
                removeActionLog={state.removeActionLog}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
