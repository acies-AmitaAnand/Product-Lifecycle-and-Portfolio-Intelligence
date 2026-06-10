/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Activity, Check, RefreshCw, Sparkles, CreditCard, Briefcase, Truck, X,
  TrendingUp, AlertTriangle, ShieldCheck, Info, DollarSign, Globe, Layers, ArrowRight
} from 'lucide-react';
import { SKUS } from '../../../constants/data';

interface ActionRoutingPanelProps {
  hasScored: boolean;
  pairRisk: number;
  riskVerdict: string;
  verdictColor: string;
  skuA: string;
  skuB: string;
  category: string;
  selectedRoutingTeam: number;
  setSelectedRoutingTeam: (idx: number) => void;

  // Control Center persistent state & actions
  completedSteps: Record<string, boolean>;
  setStepCompleted: (pairKey: string, team: string, stepIdx: number, completed: boolean) => void;
  resetPairWorkflow: (pairKey: string) => void;
  shortlistedSkus: string[];
  shortlistSku: (name: string) => void;
  unshortlistSku: (name: string) => void;
  frozenSkus: string[];
  freezeSkuReplenishment: (name: string) => void;
  unfreezeSkuReplenishment: (name: string) => void;
  logAction: (team: string, stepLabel: string, details: string, rationale: string) => void;
  removeActionLog: (pairKey: string, stepLabel: string) => void;
  isDarkMode?: boolean;
}

export const ActionRoutingPanel: React.FC<ActionRoutingPanelProps> = ({
  hasScored,
  pairRisk,
  riskVerdict,
  verdictColor,
  skuA,
  skuB,
  category,
  selectedRoutingTeam,
  setSelectedRoutingTeam,

  completedSteps,
  setStepCompleted,
  resetPairWorkflow,
  shortlistedSkus,
  shortlistSku,
  unshortlistSku,
  frozenSkus,
  freezeSkuReplenishment,
  unfreezeSkuReplenishment,
  logAction,
  removeActionLog,
  isDarkMode = false,
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [executingStep, setExecutingStep] = useState<string | null>(null);

  // Pricing sandbox shift slider state
  const [pricingPriceShift, setPricingPriceShift] = useState(0);

  // Safety stock slider state
  const [supplySafetyStockShift, setSupplySafetyStockShift] = useState(15);

  // Calendar deconfliction state
  const [calendarDeconflicted, setCalendarDeconflicted] = useState(false);

  // Exit date state
  const [exitDateDays, setExitDateDays] = useState(60);

  // Find SKU details for calculations
  const pairKey = `${skuA}|${skuB}`;
  const sA = SKUS.find(s => s.name === skuA) || SKUS[0];
  const sB = SKUS.find(s => s.name === skuB) || SKUS[1];
  const revA = sA ? sA.rev : 10;
  const marginA = sA ? sA.margin : 35;
  const marginB = sB ? sB.margin : 40;

  // 1. Transference & Leakage
  const transferenceRate = Math.round(pairRisk * 100);
  const transferenceVolume = parseFloat((revA * (transferenceRate / 100)).toFixed(2));
  const leakageVolume = parseFloat((revA - transferenceVolume).toFixed(2));

  // 2. Margin differential uplift + complexity savings (5% of SKU A rev)
  const marginDiffUplift = transferenceVolume * ((marginB - marginA) / 100);
  const complexitySavings = revA * 0.05;
  const annualSavingsLakhs = Math.round((marginDiffUplift + complexitySavings) * 100);

  // 3. Dynamic Exit Costs (decrease as exitDateDays increases)
  const inventoryWriteoff = (revA * 10) * Math.max(0.02, 0.8 - (exitDateDays / 150));
  const packagingObsolescence = (revA * 2) * Math.max(0.05, 1.1 - (exitDateDays / 100));
  const markdownCost = (revA * 3) * Math.max(0.1, 1.2 - (exitDateDays / 120));
  
  const totalExitCost = Math.round(inventoryWriteoff + packagingObsolescence + markdownCost);

  // 4. Payback Period
  const monthlySavings = annualSavingsLakhs / 12;
  const paybackMonths = parseFloat((totalExitCost / (monthlySavings || 1)).toFixed(1));

  // 5. Retailer Notice Checklist Status
  const productTeamKey = 'product';
  const supplyTeamKey = 'supplychain';
  const isCapacityAudited = !!(completedSteps && completedSteps[`${pairKey}|${productTeamKey}|1`]);
  const isSunsetDrafted = !!(completedSteps && completedSteps[`${pairKey}|${productTeamKey}|2`]);
  const isReplenishmentFrozen = !!(completedSteps && completedSteps[`${pairKey}|${supplyTeamKey}|0`]);
  const isSafetyStockRaised = !!(completedSteps && completedSteps[`${pairKey}|${supplyTeamKey}|1`]);
  
  const walmartStatus = isSunsetDrafted ? 'Delisted' : 'Notice Pending';
  const targetStatus = isReplenishmentFrozen ? 'Delisted' : 'Notice Pending';
  const tescoStatus = isSunsetDrafted && isReplenishmentFrozen ? 'Delisted' : 'In Run-down';
  const costcoStatus = isCapacityAudited ? 'In Negotiation' : 'Notice Pending';

  if (!hasScored) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3 bg-white dark:bg-acies-offwhite rounded-xl border border-black/10 dark:border-white/10">
        <Activity size={24} className="text-zinc-400 animate-pulse" />
        <div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Score a pair first</p>
          <p className="text-[10px] text-zinc-300 dark:text-zinc-650 font-bold uppercase mt-0.5">Please evaluate products on the scatter map or scorer</p>
        </div>
      </div>
    );
  }

  const isHigh = pairRisk > 0.5;
  const isMod  = pairRisk > 0.25 && pairRisk <= 0.5;

  const urgency       = isHigh ? 'URGENT'  : isMod ? 'MONITOR' : 'ROUTINE';
  const urgencyColor  = isHigh ? '#ef4444' : isMod ? '#f59e0b' : '#10b981';
  const urgencyBg     = isHigh ? 'rgba(239,68,68,0.08)'  : isMod ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)';
  const urgencyBorder = isHigh ? 'rgba(239,68,68,0.2)'   : isMod ? 'rgba(245,158,11,0.2)'  : 'rgba(16,185,129,0.2)';
  const timeline      = isHigh ? 'Act within 2–4 weeks'  : isMod ? 'Review in 30–60 days'  : 'Next quarterly cycle';

  type TeamRouting = {
    name: string; shortName: string; isLead: boolean;
    dotColor: string; dotBg: string; dotBorder: string;
    contact: string; owner: string;
    steps: Array<{ label: string; detail: string }>;
  };

  const routing: TeamRouting[] = isHigh ? [
    {
      name: 'Pricing & Finance', shortName: 'Pricing', isLead: true,
      dotColor: '#ef4444', dotBg: 'rgba(239,68,68,0.08)', dotBorder: 'rgba(239,68,68,0.18)',
      contact: 'VP Revenue Management', owner: 'Pricing Mgr + FP&A Analyst',
      steps: [
        { label: 'Pull price ladder',     detail: `Extract current pricing structures for ${skuA} vs ${skuB} to evaluate profitability differentials.` },
        { label: 'Run cross-elasticity',  detail: `Model potential demand shift from ${skuA} to sibling ${skuB} if price gap is adjusted.` },
        { label: 'Separate promo slots',  detail: `Examine overlapping promotional calendar timelines to mitigate self-cannibalization.` },
        { label: 'Escalate to committee', detail: `Compile Rationalization Escalation Ticket & route to Portfolio Board.` },
      ]
    },
    {
      name: 'Product Management', shortName: 'Product', isLead: false,
      dotColor: '#f59e0b', dotBg: 'rgba(245,158,11,0.06)', dotBorder: 'rgba(245,158,11,0.15)',
      contact: 'Category Portfolio Manager', owner: 'SKU Rationalization WG',
      steps: [
        { label: 'Add to shortlist',    detail: `Flag ${skuA} for Category observation on the active Rationalization Shortlist.` },
        { label: 'Feasibility check',   detail: `Audit if sibling SKU ${skuB} has the manufacturing capacity to absorb ${skuA} volume.` },
        { label: 'Sunset plan draft',   detail: `Prepare SKU exit schedule, inventory liquidation, and retailer delisting timeline.` },
      ]
    },
    {
      name: 'Supply Chain Ops', shortName: 'Supply Chain', isLead: false,
      dotColor: '#3b82f6', dotBg: 'rgba(59,130,246,0.06)', dotBorder: 'rgba(59,130,246,0.15)',
      contact: 'Supply Chain Director', owner: 'DC Inventory Planner',
      steps: [
        { label: 'Freeze replenishment', detail: `Put an active replenishment freeze flag on SKU ${skuA} inside the WMS ledger.` },
        { label: 'Raise safety stock',   detail: `Adjust sibling SKU ${skuB} buffer parameters inside the MRP system to absorb incoming demand.` },
        { label: 'Warehouse release',    detail: `De-allocate warehouse bays currently assigned to SKU ${skuA} to unlock capital.` },
      ]
    }
  ] : isMod ? [
    {
      name: 'Product Management', shortName: 'Product', isLead: true,
      dotColor: '#f59e0b', dotBg: 'rgba(245,158,11,0.08)', dotBorder: 'rgba(245,158,11,0.18)',
      contact: 'Category Manager', owner: 'Junior PM + Commercial Analyst',
      steps: [
        { label: 'Set up alert',         detail: `Configure weekly sales-overlap triggers for ${skuA} vs ${skuB} in BI dashboards.` },
        { label: 'Promo calendar audit', detail: `Review next 12 weeks of promo calendar slots to verify zero promotional overlaps.` },
        { label: '30-day report',        detail: `Prepare monthly Pair Observation brief tracking overlap trends.` },
        { label: 'Q4 planning flag',     detail: `Add both variants to the Q4 Watch List workbook.` },
      ]
    },
    {
      name: 'Pricing & Finance', shortName: 'Pricing', isLead: false,
      dotColor: '#8b5cf6', dotBg: 'rgba(139,92,246,0.06)', dotBorder: 'rgba(139,92,246,0.14)',
      contact: 'Commercial Finance BP', owner: 'Pricing Analyst',
      steps: [
        { label: 'Elasticity validation', detail: `Re-run baseline price elasticity audits for ${skuA}.` },
        { label: 'P&L flag',              detail: `Add pair monitoring flag under Brand P&L reviews.` },
      ]
    }
  ] : [
    {
      name: 'Supply Chain Ops', shortName: 'Supply', isLead: true,
      dotColor: '#10b981', dotBg: 'rgba(16,185,129,0.08)', dotBorder: 'rgba(16,185,129,0.18)',
      contact: 'Category Inventory Manager', owner: 'Inventory Planning Team',
      steps: [
        { label: 'Log in tracker',  detail: `Record ${skuA} / ${skuB} risk score ${(pairRisk * 100).toFixed(0)}% in annual tracker.` },
        { label: 'Standard review', detail: `No fast-track escalation. Check on next quarterly health review.` },
      ]
    },
    {
      name: 'Product Management', shortName: 'Product', isLead: false,
      dotColor: '#10b981', dotBg: 'rgba(16,185,129,0.05)', dotBorder: 'rgba(16,185,129,0.12)',
      contact: 'Category Portfolio Manager', owner: 'Portfolio Analyst',
      steps: [
        { label: 'Confirm within bounds', detail: `Verify overlap remains below 30% substitution risk.` },
        { label: 'No escalation',         detail: `Approve no committee review required.` },
      ]
    }
  ];

  const teamIdx = Math.max(0, Math.min(selectedRoutingTeam, routing.length - 1));
  const activeTeam = routing[teamIdx] || routing[0];
  if (!activeTeam) return null;
  const activeTeamKey = activeTeam.shortName.toLowerCase().replace(' ', '');

  // Calculate overall progress stats
  let totalStepsCount = 0;
  let totalCompletedCount = 0;
  routing.forEach(team => {
    const tKey = team.shortName.toLowerCase().replace(' ', '');
    team.steps.forEach((_, idx) => {
      totalStepsCount++;
      if (completedSteps && completedSteps[`${pairKey}|${tKey}|${idx}`]) {
        totalCompletedCount++;
      }
    });
  });

  const blendedPct = Math.round((totalCompletedCount / (totalStepsCount || 1)) * 100);

  // Return Lucide icon for active team
  const getTeamIcon = (shortName: string) => {
    if (shortName.includes('Pricing')) return <CreditCard size={14} className="stroke-[2.5]" />;
    if (shortName.includes('Product')) return <Briefcase size={14} className="stroke-[2.5]" />;
    return <Truck size={14} className="stroke-[2.5]" />;
  };

  // Compile detailed parameters and rationale for ledger records
  const getStepLogData = (si: number) => {
    if (isHigh) {
      if (activeTeamKey === 'pricing') {
        if (si === 0) return { details: 'SKU A: ₹90, SKU B: ₹80, Price Gap: 12.5%', rationale: 'Pulled pricing structures to verify distributor and retail pricing ladders between sibling SKUs.' };
        if (si === 1) return { details: `Price Gap Shift: ${pricingPriceShift >= 0 ? '+' : ''}${pricingPriceShift}%, Vol. Shift: +${(15 + pricingPriceShift * 0.8).toFixed(1)}%`, rationale: 'Simulated pricing gap tweaks to model cross-elasticity and कैटेगरी demand shifts.' };
        if (si === 2) return { details: 'Promo calendar de-conflicted', rationale: 'Shifted promotional calendar offsets to avoid overlapping discount periods and blended margins erosion.' };
        return { details: 'Brief Sheet Submitted', rationale: `Escalated rationalization case (Score: ${(pairRisk * 100).toFixed(0)}%, At Risk: ₹${Math.round(pairRisk * 42)} Cr) to rationalization committee.` };
      }
      if (activeTeamKey === 'product') {
        if (si === 0) return { details: 'Added to rationalization watchlist', rationale: `Shortlisted SKU ${skuA} for sunset portfolio analysis due to high substitution rates with SKU ${skuB}.` };
        if (si === 1) return { details: 'Sibling capacity audit complete: 89%', rationale: `Verified sibling SKU ${skuB} manufacturing capacity has sufficient head-room to absorb absorbed volumes.` };
        return { details: `Exit timeline: ${exitDateDays} Days, Discount: 25%`, rationale: 'Approved structured exit timeline detailing de-listing dates and clearance discounts.' };
      }
      // supplychain
      if (si === 0) return { details: 'Replenishment frozen in WMS ledger', rationale: 'Halted replenishment releases in inventory systems to run down channel stock.' };
      if (si === 1) return { details: `Safety stock buffer adjusted: +${supplySafetyStockShift}%`, rationale: `Raised sibling SKU ${skuB} safety buffer parameters in MRP systems to insulate against supply gaps.` };
      return { details: `Freed warehouse bays: 4. Capital: ₹${Math.round(pairRisk * 40)}L`, rationale: 'De-allocated storage bay assignments in distribution center, releasing working capital.' };
    } else if (isMod) {
      if (activeTeamKey === 'product') {
        if (si === 0) return { details: 'BI weekly alert enabled', rationale: 'Configured weekly sales-overlap triggers in category intelligence boards.' };
        if (si === 1) return { details: '12-week promo audit completed', rationale: 'Reviewed promotional plans to ensure calendar separations.' };
        if (si === 2) return { details: 'Pair observation report logged', rationale: 'Prepared monthly pair observation brief tracking volume trends.' };
        return { details: 'Watchlist flag added to workbook', rationale: 'Tagged variant pair in category watch sheet for Q4 planning review.' };
      } else {
        if (si === 0) return { details: 'Cross-elasticity verified', rationale: 'Re-validated price elasticity values against historical parameters.' };
        return { details: 'P&L flag activated', rationale: 'Flagged variants under monthly brand gross margin reviews.' };
      }
    } else {
      // low risk
      if (activeTeamKey === 'supply') {
        if (si === 0) return { details: 'Logged in Rationalization Tracker', rationale: 'Recorded low risk score in annual portfolio database.' };
        return { details: 'Quarterly review sign-off complete', rationale: 'Approved sign-off on the quarterly inventory health dashboard.' };
      } else {
        if (si === 0) return { details: 'Overlap validated within limits', rationale: 'Confirmed cross-brand substitution is within category tolerances.' };
        return { details: 'No committee action required', rationale: 'Concluded variant pair does not require board review.' };
      }
    }
  };

  // Trigger simulated execution
  const executeStep = (si: number, label: string, customAction?: () => void) => {
    const stepKey = `${pairKey}|${activeTeamKey}|${si}`;
    setExecutingStep(stepKey);
    setTimeout(() => {
      if (customAction) {
        customAction();
      }
      const logData = getStepLogData(si);
      if (logData) {
        logAction(activeTeamKey, label, logData.details, logData.rationale);
      }
      setStepCompleted(pairKey, activeTeamKey, si, true);
      setExecutingStep(null);
      // Auto-expand next step
      if (si < activeTeam.steps.length - 1) {
        setExpandedStep(si + 1);
      }
    }, 850);
  };

  const undoStep = (si: number, label: string, customUndo?: () => void) => {
    if (customUndo) {
      customUndo();
    }
    removeActionLog(pairKey, label);
    setStepCompleted(pairKey, activeTeamKey, si, false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Overall Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
        <div>
          <span className="text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">Active Pair Audit Workflow</span>
          <h2 className="text-lg font-display font-extrabold text-zinc-900 dark:text-white mt-1">
            {skuA} <span className="text-zinc-400 font-normal">↔</span> {skuB}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-black uppercase text-acies-gray dark:text-zinc-200">
              Blended Status: {blendedPct}% Completed
            </span>
            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase mt-0.5">
              {totalCompletedCount} of {totalStepsCount} tasks signed-off
            </span>
          </div>
          {totalCompletedCount > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Reset workflow progress? This will revert shortlist/frozen flags and clear audit logs.")) {
                  resetPairWorkflow(pairKey);
                  unshortlistSku(skuA);
                  unfreezeSkuReplenishment(skuA);
                }
              }}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg transition text-zinc-450 hover:text-zinc-800 dark:hover:text-white cursor-pointer bg-transparent"
              title="Reset Pair Audit"
            >
              <RefreshCw size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar meter */}
      <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-purple-600 dark:bg-purple-400 h-full transition-all duration-300"
          style={{ width: `${blendedPct}%` }}
        />
      </div>

      {/* Two-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Team selection & Workflow Steps */}
        <div className="lg:col-span-7 space-y-6">

          {/* Team selection Grid */}
          <div className="grid gap-px rounded-xl overflow-hidden bg-black/10 dark:bg-white/10" style={{ gridTemplateColumns: `repeat(${routing.length}, 1fr)` }}>
        {routing.map((team, ti) => {
          const isActive = ti === teamIdx;
          const tKey = team.shortName.toLowerCase().replace(' ', '');
          const teamSteps = team.steps;
          const completedCount = teamSteps.filter((_, idx) => completedSteps && completedSteps[`${pairKey}|${tKey}|${idx}`]).length;
          const isDone = completedCount === teamSteps.length;

          return (
            <div
              key={team.name}
              onClick={() => {
                setSelectedRoutingTeam(ti);
                setExpandedStep(0);
              }}
              className={`flex flex-col gap-1.5 p-3 cursor-pointer transition-all duration-150 ${
                isActive ? '' : 'bg-white dark:bg-[#121214]'
              }`}
              style={{
                background: isActive ? team.dotBg : undefined,
                borderBottom: isActive ? `3px solid ${team.dotColor}` : '3px solid transparent',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-zinc-450 dark:text-zinc-400">{getTeamIcon(team.shortName)}</span>
                <span className="text-[6.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color: team.dotColor, background: team.dotBg, border: `1px solid ${team.dotBorder}` }}>
                  {team.isLead ? 'LEAD' : 'SUPP'}
                </span>
              </div>
              <p className="text-[9px] font-black uppercase tracking-wider text-acies-gray dark:text-zinc-200">
                {team.shortName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 text-[8.5px] font-bold text-zinc-450">
                <span>{completedCount}/{teamSteps.length} Signed-off</span>
                {isDone && <Check size={10} className="text-emerald-500 stroke-[3.5]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Steps List */}
      <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
        <div className="flex justify-between items-center px-4 py-3 bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/10 dark:border-white/10">
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-450 dark:text-zinc-400 flex items-center gap-1.5">
            {getTeamIcon(activeTeam.shortName)}
            <span>{activeTeam.name} — Action List</span>
          </span>
          <span className="text-[8px] font-bold text-zinc-400 uppercase">
            Contact: {activeTeam.contact} · Owner: {activeTeam.owner}
          </span>
        </div>

        <div className="bg-white dark:bg-acies-offwhite divide-y divide-black/5 dark:divide-white/5">
          {activeTeam.steps.map((step, si) => {
            const stepKey = `${pairKey}|${activeTeamKey}|${si}`;
            const isCompleted = !!(completedSteps && completedSteps[stepKey]);
            const isExpanded = expandedStep === si;
            const isExecuting = executingStep === stepKey;

            return (
              <div key={si} className={`transition-colors duration-150 ${isExpanded ? 'bg-black/[0.01] dark:bg-white/[0.01]' : ''}`}>
                <div 
                  onClick={() => setExpandedStep(isExpanded ? null : si)}
                  className="flex items-start justify-between gap-4 px-4 py-3.5 cursor-pointer hover:bg-black/[0.01] dark:hover:bg-white/[0.01] select-none"
                >
                  <div className="flex gap-3 min-w-0">
                    <div 
                      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-all ${
                        isCompleted 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-550'
                      }`}
                    >
                      {isCompleted ? <Check size={11} className="stroke-[3]" /> : si + 1}
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-wider ${isCompleted ? 'line-through text-zinc-400 dark:text-zinc-650' : 'text-acies-gray dark:text-zinc-200'}`}>
                        {step.label}
                      </p>
                      <p className="text-[8.5px] font-medium text-zinc-450 dark:text-zinc-500 leading-relaxed mt-0.5">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                  <span className="text-zinc-400 text-[8px] font-bold mt-0.5 whitespace-nowrap">
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </span>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 pl-12 bg-black/[0.02] dark:bg-white/[0.02] border-t border-dashed border-black/5 dark:border-white/5 space-y-3">
                    
                    {/* Render Interactive Actions */}
                    {activeTeamKey === 'pricing' && isHigh && (
                      <>
                        {si === 0 && (
                          <div className="border border-black/10 dark:border-white/10 rounded-lg p-3 bg-white dark:bg-acies-gray space-y-2">
                            <span className="text-[8px] font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500">Pricing Ladder Details</span>
                            <div className="grid grid-cols-3 gap-2 text-[8px] font-bold text-center border-b pb-1.5 border-black/5 dark:border-white/5 text-zinc-450">
                              <div>Metric</div>
                              <div className="text-purple-650 dark:text-purple-400">{skuA ? skuA.split(' ')[0] : ''}</div>
                              <div className="text-emerald-500">{skuB ? skuB.split(' ')[0] : ''}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-[9px] font-semibold text-center divide-y divide-black/[0.02] dark:divide-white/[0.02] text-zinc-500 dark:text-zinc-400">
                              <div className="text-left font-bold text-[8px] uppercase">Base Retail Price</div>
                              <div>₹90</div>
                              <div>₹80</div>
                              <div className="text-left font-bold text-[8px] uppercase pt-1.5">Distributor price</div>
                              <div className="pt-1.5">₹65</div>
                              <div className="pt-1.5">₹55</div>
                              <div className="text-left font-bold text-[8px] uppercase pt-1.5">Gross Margin</div>
                              <div className="pt-1.5 text-red-500 font-extrabold">41.0%</div>
                              <div className="pt-1.5 text-emerald-500 font-extrabold">34.0%</div>
                            </div>
                          </div>
                        )}

                        {si === 1 && (
                          <div className="border border-black/10 dark:border-white/10 rounded-lg p-3 bg-white dark:bg-acies-gray space-y-3">
                            <div className="flex justify-between items-center text-[8px] font-black uppercase text-zinc-450 dark:text-zinc-500">
                              <span>Cross-Price Elasticity Sandbox</span>
                              <span className="text-purple-500">Price Gap Shift: {pricingPriceShift > 0 ? `+${pricingPriceShift}%` : `${pricingPriceShift}%`}</span>
                            </div>
                            <div className="space-y-1.5">
                              <input 
                                type="range" 
                                min="-10" 
                                max="15" 
                                value={pricingPriceShift} 
                                onChange={(e) => setPricingPriceShift(Number(e.target.value))}
                                className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                              />
                            </div>
                            <div className="bg-black/5 dark:bg-white/5 p-2 rounded text-[8px] font-bold space-y-1 text-zinc-450">
                              <div className="flex justify-between">
                                <span>Projected shift to sibling {skuB ? skuB.split(' ')[0] : ''}:</span>
                                <span className="text-emerald-500">+{(15 + pricingPriceShift * 0.8).toFixed(1)}% volume</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Category Loss (Uncompensated Leak):</span>
                                <span className="text-red-500">-{(3 - pricingPriceShift * 0.1).toFixed(1)}% volume</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {si === 2 && (
                          <div className="border border-black/10 dark:border-white/10 rounded-lg p-3 bg-white dark:bg-acies-gray space-y-2">
                            <span className="text-[8px] font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 block">Weekly Promotion Overlap Review</span>
                            <div className="grid grid-cols-6 gap-1.5 text-[8px] text-center font-bold">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(w => (
                                <div key={w} className={`p-1 rounded border ${
                                  !calendarDeconflicted && (w === 4 || w === 8) 
                                    ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                                    : 'bg-black/5 dark:bg-white/5 border-transparent text-zinc-450'
                                }`}>
                                  Wk {w}
                                  {!calendarDeconflicted && (w === 4 || w === 8) ? ' ⚠️' : ''}
                                </div>
                              ))}
                            </div>
                            <div className="text-[8px] text-zinc-400 dark:text-zinc-500 font-semibold leading-normal">
                              {calendarDeconflicted 
                                ? '✅ Promotion schedules separated. Overlaps de-conflicted.'
                                : '⚠️ Promotional discount overlays on week 4 and 8 will diluting blended margins.'}
                            </div>
                            {!calendarDeconflicted && (
                              <button 
                                onClick={() => setCalendarDeconflicted(true)}
                                className="w-full py-1.5 text-[9px] font-black bg-purple-600 hover:bg-purple-700 text-white rounded border-none cursor-pointer transition uppercase tracking-wider"
                              >
                                De-conflict Promo Calendars
                              </button>
                            )}
                          </div>
                        )}

                        {si === 3 && (
                          <div className="border border-black/10 dark:border-white/10 rounded-lg p-3 bg-white dark:bg-acies-gray space-y-2">
                            <span className="text-[8px] font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 block">Rationalization Brief Parameters</span>
                            <div className="text-[8.5px] font-bold space-y-1 bg-black/5 dark:bg-white/5 p-2 rounded text-zinc-450">
                              <div className="flex justify-between"><span>Risk score:</span><span>{(pairRisk*100).toFixed(0)}%</span></div>
                              <div className="flex justify-between"><span>Revenue at risk:</span><span>₹{Math.round(pairRisk * 42)} Cr</span></div>
                              <div className="flex justify-between"><span>Sibling variant:</span><span>{skuB}</span></div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {activeTeamKey === 'product' && isHigh && (
                      <>
                        {si === 0 && (
                          <div className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500">
                            {(shortlistedSkus || []).includes(skuA) 
                              ? `✅ ${skuA} is registered in active rationalization watchlist.` 
                              : `Add ${skuA} to watchlist to track in portfolio directory.`}
                          </div>
                        )}

                        {si === 1 && (
                          <div className="border border-black/10 dark:border-white/10 rounded-lg p-3 bg-white dark:bg-acies-gray space-y-2">
                            <span className="text-[8px] font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 block">Manufacturing capacity audit</span>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-[8px] font-bold text-zinc-450">
                                  <span>{skuB} current utilization:</span>
                                  <span>82%</span>
                                </div>
                                <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded">
                                  <div className="bg-blue-500 h-full rounded" style={{ width: '82%' }} />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-[8px] font-bold text-zinc-450">
                                  <span>Projected utilization with absorbed volume:</span>
                                  <span className="text-emerald-500 font-extrabold">89%</span>
                                </div>
                                <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded">
                                  <div className="bg-emerald-500 h-full rounded" style={{ width: '89%' }} />
                                </div>
                              </div>
                            </div>
                            <div className="text-[8px] text-emerald-500 font-black uppercase">
                              ✅ FEASIBLE (Under 96% ceiling)
                            </div>
                          </div>
                        )}

                        {si === 2 && (
                          <div className="border border-black/10 dark:border-white/10 rounded-lg p-3 bg-white dark:bg-acies-gray space-y-3">
                            <span className="text-[8px] font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 block">Exit Strategy Configuration</span>
                            <div className="space-y-2">
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-[8.5px] font-bold text-zinc-400">
                                  <span>Exit Timeline:</span>
                                  <span>{exitDateDays} Days</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="30" 
                                  max="120" 
                                  step="15"
                                  value={exitDateDays} 
                                  onChange={(e) => setExitDateDays(Number(e.target.value))}
                                  className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                              </div>
                              <div className="text-[8px] bg-black/5 dark:bg-white/5 p-2 rounded font-bold text-zinc-400 leading-normal">
                                De-listing checklist generated. Liquidation discount set to 25%.
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {activeTeamKey === 'supplychain' && isHigh && (
                      <>
                        {si === 0 && (
                          <div className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500">
                            {(frozenSkus || []).includes(skuA) 
                              ? `✅ ${skuA} replenishment frozen in WMS database.` 
                              : `Halt supply replenishments of ${skuA} to start sunset.`}
                          </div>
                        )}

                        {si === 1 && (
                          <div className="border border-black/10 dark:border-white/10 rounded-lg p-3 bg-white dark:bg-acies-gray space-y-2">
                            <span className="text-[8px] font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 block">MRP safety buffer</span>
                            <div className="space-y-2">
                              <div className="flex justify-between text-[8.5px] font-bold text-zinc-405">
                                <span>Adjust Sibling Safety Stock:</span>
                                <span className="text-purple-500 font-black">+{supplySafetyStockShift}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="5" 
                                max="30" 
                                step="5"
                                value={supplySafetyStockShift} 
                                onChange={(e) => setSupplySafetyStockShift(Number(e.target.value))}
                                className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                              />
                            </div>
                          </div>
                        )}

                        {si === 2 && (
                          <div className="border border-black/10 dark:border-white/10 rounded-lg p-3 bg-white dark:bg-acies-gray space-y-2">
                            <span className="text-[8px] font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 block">Form SC-114 Bay Release</span>
                            <div className="text-[8.5px] font-bold text-zinc-450 space-y-1 bg-black/5 dark:bg-white/5 p-2 rounded">
                              <div className="flex justify-between"><span>Assigned Bays:</span><span>4 Bays (DC-2, DC-4)</span></div>
                              <div className="flex justify-between"><span>Freed Working Capital:</span><span className="text-emerald-500 font-extrabold">₹{Math.round(pairRisk * 40)}L</span></div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Execution Buttons */}
                    <div className="flex gap-2">
                      {isCompleted ? (
                        <button
                          type="button"
                          onClick={() => {
                            const isShortlistStep = activeTeamKey === 'product' && si === 0 && isHigh;
                            const isFreezeStep = activeTeamKey === 'supplychain' && si === 0 && isHigh;
                            
                            const undoAction = () => {
                              if (isShortlistStep) unshortlistSku(skuA);
                              if (isFreezeStep) unfreezeSkuReplenishment(skuA);
                            };

                            undoStep(si, step.label, undoAction);
                          }}
                          className="px-3 py-1 text-[9px] font-black border border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-lg cursor-pointer transition border-none"
                        >
                          Undo execution
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isExecuting}
                          onClick={() => {
                            const isShortlistStep = activeTeamKey === 'product' && si === 0 && isHigh;
                            const isFreezeStep = activeTeamKey === 'supplychain' && si === 0 && isHigh;

                            const customAction = () => {
                              if (isShortlistStep) shortlistSku(skuA);
                              if (isFreezeStep) freezeSkuReplenishment(skuA);
                            };

                            executeStep(si, step.label, customAction);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition shadow-sm border-none uppercase tracking-wider disabled:opacity-50"
                        >
                          {isExecuting ? (
                            <>
                              <RefreshCw size={10} className="animate-spin" />
                              <span>Executing...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={10} />
                              <span>
                                {activeTeamKey === 'pricing' && si === 1 ? 'Run Simulation' :
                                 activeTeamKey === 'pricing' && si === 2 ? 'Isolate Promo' :
                                 activeTeamKey === 'product' && si === 0 ? 'Shortlist SKU' :
                                 activeTeamKey === 'product' && si === 1 ? 'Audit Capacity' :
                                 activeTeamKey === 'supplychain' && si === 0 ? 'Freeze SKU' :
                                 activeTeamKey === 'supplychain' && si === 2 ? 'Submit Release Form' :
                                 'Execute action'}
                              </span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      </div>

        {/* Right Column: Category & Financial Business Case Advisor */}
        <div className="lg:col-span-5 space-y-5">
          {/* Advisor Header */}
          <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-1">
            <h4 className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider flex items-center gap-1.5 font-sans">
              <Globe size={11} className="stroke-[2.5]" />
              <span>Category Business Case Advisor</span>
            </h4>
            <p className="text-[8.5px] font-medium text-zinc-450 dark:text-zinc-500 leading-normal font-sans">
              Continuous simulations evaluating substitutions, obsolescence costs, and retailer notice runways.
            </p>
          </div>

          {/* Payback Card */}
          <div className="p-4 bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 rounded-xl space-y-3.5 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-450">Payback Feasibility</span>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                paybackMonths < 9 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                  : paybackMonths <= 18 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {paybackMonths < 12 ? 'RECOMMENDED' : 'EVALUATE'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block">Exit Cost Burden</span>
                <span className="text-base font-black text-zinc-800 dark:text-zinc-100 block">
                  ₹{totalExitCost.toFixed(0)}L
                </span>
                <span className="text-[7.5px] text-zinc-450 dark:text-zinc-500 block font-bold uppercase">
                  Write-offs + markdowns
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block">Annual Savings</span>
                <span className="text-base font-black text-emerald-500 block">
                  ₹{annualSavingsLakhs.toFixed(0)}L
                </span>
                <span className="text-[7.5px] text-zinc-450 dark:text-zinc-500 block font-bold uppercase">
                  Margin uplift + SC savings
                </span>
              </div>
            </div>

            {/* Payback speed progress */}
            <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-1.5">
              <div className="flex justify-between text-[8px] font-black uppercase text-zinc-450">
                <span>Exit Payback Speed</span>
                <span className="text-purple-500 font-extrabold">{paybackMonths} Months</span>
              </div>
              <div className="w-full bg-black/5 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    paybackMonths < 9 ? 'bg-emerald-500' : paybackMonths <= 18 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (paybackMonths / 24) * 100)}%` }}
                />
              </div>
              <p className="text-[8.5px] text-zinc-450 leading-relaxed font-semibold italic mt-1 font-sans">
                * Payback calculations automatically factor run-down optimization over {exitDateDays} days.
              </p>
            </div>
          </div>

          {/* Volume Transference Map */}
          <div className="p-4 bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 rounded-xl space-y-3 shadow-sm">
            <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-450 block">Variant Substitution Rate</span>
            
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold">
                  <span className="text-acies-gray dark:text-zinc-300">Transferred to Sibling ({skuB ? skuB.split(' ')[0] : ''})</span>
                  <span className="text-purple-600 dark:text-purple-400 font-black">{transferenceRate}%</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded overflow-hidden flex">
                  <div className="bg-purple-500 h-full" style={{ width: `${transferenceRate}%` }} />
                  <div className="bg-red-500/20 h-full" style={{ width: `${100 - transferenceRate}%` }} />
                </div>
                <div className="flex justify-between text-[7.5px] font-bold text-zinc-450">
                  <span>₹{transferenceVolume} Cr preserved</span>
                  <span>₹{leakageVolume} Cr category leak ({100 - transferenceRate}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Retailer Delisting Notice Checklist */}
          <div className="p-4 bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 rounded-xl space-y-3 shadow-sm">
            <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-450 block">Global Retailer Alignment</span>
            
            <div className="divide-y divide-black/5 dark:divide-white/5 text-[9px] font-bold">
              <div className="flex justify-between py-2 items-center">
                <span className="text-zinc-600 dark:text-zinc-300">Walmart US SKU Listing</span>
                <span className={`px-2 py-0.5 rounded text-[7.5px] font-black uppercase ${
                  walmartStatus === 'Delisted' ? 'bg-emerald-500/10 text-emerald-500 font-black' : 'bg-amber-500/10 text-amber-500 font-black'
                }`}>{walmartStatus}</span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="text-zinc-600 dark:text-zinc-300">Target Corp De-listing</span>
                <span className={`px-2 py-0.5 rounded text-[7.5px] font-black uppercase ${
                  targetStatus === 'Delisted' ? 'bg-emerald-500/10 text-emerald-500 font-black' : 'bg-amber-500/10 text-amber-500 font-black'
                }`}>{targetStatus}</span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="text-zinc-600 dark:text-zinc-300">Tesco PLC Notice</span>
                <span className={`px-2 py-0.5 rounded text-[7.5px] font-black uppercase ${
                  tescoStatus === 'Delisted' ? 'bg-emerald-500/10 text-emerald-500 font-black' : 'bg-blue-500/10 text-blue-500 font-black'
                }`}>{tescoStatus}</span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="text-zinc-600 dark:text-zinc-300">Costco Wholesale Review</span>
                <span className={`px-2 py-0.5 rounded text-[7.5px] font-black uppercase ${
                  costcoStatus === 'In Negotiation' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-450 font-black'
                }`}>{costcoStatus}</span>
              </div>
            </div>
          </div>

          {/* Supply Chain Runway */}
          <div className="p-4 bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 rounded-xl space-y-3 shadow-sm">
            <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-450 block">Supply Run-down Runway</span>
            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg text-[9px] font-bold space-y-1.5 text-zinc-450 font-mono">
              <div className="flex justify-between">
                <span>Phase-out Period:</span>
                <span className="text-zinc-850 dark:text-zinc-200">{exitDateDays} Days</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining Packaging Runway:</span>
                <span className="text-purple-650 dark:text-purple-400">{Math.round(exitDateDays * 0.08)} weeks of supply</span>
              </div>
              <div className="flex justify-between">
                <span>Supply Transition Risk:</span>
                <span className={isSafetyStockRaised ? 'text-emerald-500' : 'text-amber-500'}>
                  {isSafetyStockRaised ? 'Minimal (Sibling safety raised)' : 'Medium (Raise sibling buffer)'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-2 text-[7.5px] font-bold uppercase tracking-widest text-zinc-400">
        <span>Logged under active ledger sync</span>
        <span>Secure cryptographic sign-off</span>
      </div>
    </div>
  );
};
