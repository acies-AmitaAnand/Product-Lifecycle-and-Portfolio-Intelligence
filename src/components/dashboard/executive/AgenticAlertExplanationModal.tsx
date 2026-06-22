/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, Database, Cpu, Terminal, ArrowRight, Activity, Layers, Sparkles, 
  CheckCircle2, AlertTriangle, ShieldAlert, Info, FileText, Settings, Server
} from 'lucide-react';

interface AgentDetails {
  name: string;
  role: string;
  description: string;
  status: 'idle' | 'scanning' | 'processing';
  icon: React.ReactNode;
}

interface AlertProvenance {
  id: string;
  title: string;
  agent: string;
  sources: { name: string; type: string; format: string }[];
  signals: { name: string; value: string; threshold: string; status: 'breached' | 'normal' }[];
  cogsFormula?: string;
  reasoningPath: string[];
}

const AGENTS_ROSTER: AgentDetails[] = [
  {
    name: 'Portfolio Agent',
    role: 'SKU Performance Monitor',
    description: 'Scans transactional ledgers daily to identify volume drops, stage transitions, and pricing floor anomalies.',
    status: 'scanning',
    icon: <Activity className="text-emerald-500" size={14} />
  },
  {
    name: 'Launch Agent',
    role: 'Readiness Gate Coordinator',
    description: 'Tracks cross-functional progress across 40+ criteria on SharePoint logs. Projects schedule variance and bottlenecks.',
    status: 'scanning',
    icon: <Layers className="text-blue-500" size={14} />
  },
  {
    name: 'Profitability Agent',
    role: 'Margin Leak Auditor',
    description: 'Traverses P&L cost trees to attribute cost-to-serve fluctuations, raw material price variance, and promo erosion.',
    status: 'processing',
    icon: <Terminal className="text-purple-500" size={14} />
  },
  {
    name: 'Sunset Agent',
    role: 'Complexity & Cannibalization Assessor',
    description: 'Runs displacement simulations and volume correlation models to estimate cannibalization rates and portfolio overhead.',
    status: 'idle',
    icon: <Server className="text-amber-500" size={14} />
  },
  {
    name: 'Market Signal Agent',
    role: 'Competitor & Sentiment Scraper',
    description: 'Processes competitor pricing feeds and customer sentiment matrices to flag external risks to product families.',
    status: 'scanning',
    icon: <Settings className="text-pink-500" size={14} />
  }
];

const ALERTS_PROVENANCE: Record<string, AlertProvenance> = {
  a1: {
    id: 'a1',
    title: 'Mango Fizz 750ml launch delay — packaging shortage',
    agent: 'Launch Agent',
    sources: [
      { name: 'SharePoint PM Logs (LP001)', type: 'Project Management Logs', format: 'Excel / Text' },
      { name: 'ERP Supplier Inventory Ledger', type: 'Material Logs', format: 'Parquet / SAP' }
    ],
    signals: [
      { name: 'Target Launch Date', value: 'Sep 15, 2026', threshold: 'Within 30 Days', status: 'breached' },
      { name: 'Bottle Inventory level', value: '1,200 units', threshold: '> 40,000 units', status: 'breached' },
      { name: 'APAC Supplier Lead Time', value: '45 days', threshold: '< 14 days', status: 'breached' }
    ],
    reasoningPath: [
      'Launch Agent identified a Gate 3 bottleneck in the SharePoint milestone logs: bottle supply marked delayed.',
      'Queried the ERP Supplier Inventory database and confirmed physical bottle stocks are at 3% of the target launch batch.',
      'Verified the supplier lead time delta (+31 days) from logistics tables.',
      'Calculated new critical path: projects 21 days delay on initial shipment.',
      'Summarized the issue and dispatched critical delay alert to the Executive Overview tab.'
    ]
  },
  a2: {
    id: 'a2',
    title: 'Choco Wafers promo dependency at 72% — margin risk',
    agent: 'Profitability Agent',
    sources: [
      { name: 'FMCG Multi-Country Sales Dataset', type: 'Transactional Logs', format: 'Parquet / S3' },
      { name: 'Promo Calendar Database', type: 'Marketing Logs', format: 'PostgreSQL' }
    ],
    signals: [
      { name: 'Promo Volume Dependency', value: '72%', threshold: '< 30% of sales', status: 'breached' },
      { name: 'Gross Margin', value: '12.0%', threshold: '> 35.0% target', status: 'breached' },
      { name: 'Volume Lift Ratio', value: '1.25x', threshold: '> 1.60x for lift coverage', status: 'breached' }
    ],
    cogsFormula: 'Margin = (Revenue - COGS - Trade Promos) / Revenue',
    reasoningPath: [
      'Profitability Agent scanned the multi-country transaction logs, filtering Choco Wafers SKU variants.',
      'Aggregated volume by promotional status indicator: found that promo sales comprise 72% of total sales.',
      'Computed effective gross margin including overlapping trade promotional discounts: calculated average margin at 12.0% vs. target of 35.0%.',
      'Determined volume lift was only 1.25x (insufficient to offset the 42% price reduction).',
      'Flagged structural promo dependency and categorized as Margin Risk.'
    ]
  },
  a3: {
    id: 'a3',
    title: 'Laundry Pods Premium — 15% cost variance on active ingredients',
    agent: 'Profitability Agent',
    sources: [
      { name: 'ERP Cost Ledger (Household Care)', type: 'Financial Accounts', format: 'PostgreSQL' },
      { name: 'COGS Composition Database', type: 'Ingredient COGS', format: 'Parquet' }
    ],
    signals: [
      { name: 'Active Ingredient Variance', value: '+15.2% (Surfactants)', threshold: '< +3.0%', status: 'breached' },
      { name: 'Gross Margin', value: '31.0%', threshold: '> 46.0% target', status: 'breached' }
    ],
    cogsFormula: 'COGS = Raw Material + Packaging + Logistics + Processing',
    reasoningPath: [
      'Profitability Agent scanned monthly raw material invoices in ERP Cost Ledger.',
      'Detected a +15.2% price spike in surfactant raw materials.',
      'Mapped surfactants back to active SKU recipes in COGS Composition database.',
      'Identified Laundry Pods Premium as the product with the highest exposure to surfactant cost.',
      'Simulated margin impact: gross margin dropped from 46.5% to 31.0% (crossing the 40.0% critical threshold).',
      'Triggered cost variance alert with pass-through pricing recommendations.'
    ]
  },
  a4: {
    id: 'a4',
    title: 'Beverages cannibalization risk elevated across variants',
    agent: 'Sunset Agent',
    sources: [
      { name: 'FMCG Multi-Country Sales Dataset', type: 'Transactional Logs', format: 'Parquet / S3' }
    ],
    signals: [
      { name: 'Volume Correlation Coeff.', value: '-0.62', threshold: '> -0.20 (No cannibalization)', status: 'breached' },
      { name: 'Mango Fizz Volume Delta', value: '+15.0%', threshold: 'N/A', status: 'normal' },
      { name: 'Core Beverages Volume Delta', value: '-18.0%', threshold: 'N/A', status: 'breached' }
    ],
    cogsFormula: 'Pearson Correlation = Cov(X, Y) / (StdDev(X) * StdDev(Y))',
    reasoningPath: [
      'Sunset Agent initiated a periodic cannibalization audit across regional beverage sales data.',
      'Computed daily sales volume correlation between Mango Fizz variants (launched in Q1) and core Beverage products.',
      'Identified a strong negative correlation (r = -0.62) between Mango Fizz 750ml sales and core beverages sales.',
      'Observed that core product sales declined by 18% while Mango Fizz gained only 15% (negative net volume variance).',
      'Concluded that variant launch is displacing core sales rather than driving incremental growth.',
      'Generated Cannibalization Alert with shelf spacing and sizing optimization actions.'
    ]
  },
  a5: {
    id: 'a5',
    title: 'BrandA Premium Energy launch readiness at 88% — final gate pending',
    agent: 'Launch Agent',
    sources: [
      { name: 'SharePoint PM Logs (LP002)', type: 'Project Management Logs', format: 'Excel / Text' }
    ],
    signals: [
      { name: 'Overall Readiness Score', value: '88%', threshold: '>= 95% for Gate 3', status: 'breached' },
      { name: 'Labeling Compliance Status', value: 'Pending', threshold: 'Approved', status: 'breached' },
      { name: 'Supermarket Space Agreement', value: 'Unconfirmed', threshold: 'Confirmed', status: 'breached' }
    ],
    reasoningPath: [
      'Launch Agent audited the active Launch Readiness checklist for BrandA Premium Energy.',
      'Verified 4 of 5 gates: Sourcing, Pricing, and Logistics are green.',
      'Identified regulatory labeling approval as "Pending" and supermarket space agreement as "Unconfirmed" (both required for Gate 3).',
      'Calculated overall readiness score at 88%, which falls below the mandatory 95% launch authorization threshold.',
      'Created warning alert to prompt executive intervention on supermarket negotiations.'
    ]
  },
  a6: {
    id: 'a6',
    title: 'Dishwasher Pods 30ct promo overlap — margin erosion',
    agent: 'Profitability Agent',
    sources: [
      { name: 'Promo Calendar Database', type: 'Marketing Logs', format: 'PostgreSQL' },
      { name: 'FMCG Multi-Country Sales Dataset', type: 'Transactional Logs', format: 'Parquet / S3' }
    ],
    signals: [
      { name: 'Active Promo Campaigns', value: '2 Overlapping', threshold: '<= 1 campaign', status: 'breached' },
      { name: 'Effective Promo Discount', value: '42.0%', threshold: '< 25.0% maximum', status: 'breached' },
      { name: 'Volume Lift Delta', value: '+8.0%', threshold: '> +35.0% required', status: 'breached' }
    ],
    reasoningPath: [
      'Profitability Agent scanned promotional calendars for Household Care segment.',
      'Detected overlapping promotional campaigns (Regional Banner Promotion and National Brand Campaign) targeting the same Dishwasher Pods 30ct SKU.',
      'Calculated the combined effective discount rate (double-discounting) at 42.0% of retail price.',
      'Queried sales logs to check volume elasticity: observed only a 8% volume lift, indicating significant profit erosion (diluting category margins by ₹0.75 Cr).',
      'Dispatched margin erosion warning requesting campaign suspension.'
    ]
  }
};

export const getAlertProvenance = (alert: { id: string; title: string; sev: string; detail: string }): AlertProvenance => {
  if (ALERTS_PROVENANCE[alert.id]) {
    return ALERTS_PROVENANCE[alert.id];
  }

  const title = alert.title || '';
  
  // Default fallback values
  let agent = 'Portfolio Agent';
  let sources = [{ name: 'FMCG Multi-Country Sales Dataset', type: 'Transactional Logs', format: 'Parquet / S3' }];
  let signals: { name: string; value: string; threshold: string; status: 'breached' | 'normal' }[] = [
    { name: 'System Flag', value: 'Triggered', threshold: 'Active', status: 'breached' }
  ];
  let cogsFormula = undefined;
  let reasoningPath = [
    'Scanned corporate ledgers and transaction history.',
    'Identified anomaly and triggered LLM context builder.',
    'Formulated diagnostic trace and dispatched critical alert.'
  ];

  if (title.includes('Fabric Softener')) {
    agent = 'Portfolio Agent';
    sources = [
      { name: 'ERP Inventory Ledger', type: 'Inventory Data', format: 'PostgreSQL' },
      { name: 'Warehouse Sourcing Logs', type: 'Operational Logs', format: 'Excel' }
    ];
    signals = [
      { name: 'Fabric Softener Stock', value: '140 units', threshold: '> 1,500 units', status: 'breached' },
      { name: 'Safety Stock Status', value: '9% of target', threshold: '>= 100%', status: 'breached' }
    ];
    reasoningPath = [
      'Portfolio Agent scanned household care inventory tables.',
      'Detected that Fabric Softener stock is 90% below safety thresholds.',
      'Verified outstanding orders and identified a supplier delivery delay.',
      'Generated stock alert to trigger emergency replenishment workflows.'
    ];
  } else if (title.includes('Lead time breach')) {
    agent = 'Launch Agent';
    sources = [
      { name: 'SharePoint PM Logs', type: 'Project Tracking', format: 'Excel' },
      { name: 'Supplier Shipping Database', type: 'Logistics Logs', format: 'Parquet' }
    ];
    signals = [
      { name: 'Supplier Lead Time', value: '35 days', threshold: '< 14 days', status: 'breached' },
      { name: 'Transit Port Status', value: 'Delayed', threshold: 'Clear', status: 'breached' }
    ];
    reasoningPath = [
      'Launch Agent scanned regional supplier logistics database.',
      'Detected that transit times for critical packaging elements breached SLA thresholds.',
      'Identified seaport container congestion as the primary bottleneck.',
      'Calculated downstream gate risks and dispatched notification to procurement.'
    ];
  } else if (title.includes('Cold chain')) {
    agent = 'Market Signal Agent';
    sources = [
      { name: 'IoT Telemetry Feed', type: 'Sensor Logs', format: 'JSON / MQTT' },
      { name: 'Warehouse DC Registry', type: 'Facilities Logs', format: 'PostgreSQL' }
    ];
    signals = [
      { name: 'DC Room Temperature', value: '8.2°C', threshold: '< 4.0°C', status: 'breached' },
      { name: 'Incident Duration', value: '4 hours', threshold: '< 30 mins', status: 'breached' }
    ];
    reasoningPath = [
      'Market Signal Agent flagged real-time IoT temperature spikes in Mumbai DC refrigeration unit 4.',
      'Cross-checked room allocation logs to identify exposed perishables.',
      'Coordinated warning trigger with facility operations crew.',
      'Sensor returned 3.8°C (Resolved) after seal correction; incident logged as resolved.'
    ];
  } else if (title.includes('Freight cost')) {
    agent = 'Profitability Agent';
    sources = [
      { name: 'Logistics Expense Database', type: 'Expense Logs', format: 'Parquet / S3' },
      { name: 'Freight Contract Ledger', type: 'Contracts', format: 'PostgreSQL' }
    ];
    signals = [
      { name: 'Mumbai-Bangalore Freight Lane', value: '+4.2% cost delta', threshold: '< +2.0%', status: 'breached' }
    ];
    reasoningPath = [
      'Profitability Agent analyzed freight invoice summaries.',
      'Detected a +4.2% rate hike on the Mumbai-Bangalore lane due to fuel cost surcharges.',
      'Simulated bottom-line impact on regional product categories.',
      'Flagged margin erosion warning and recommended carrier renegotiations.'
    ];
  } else if (title.includes('Green Tea')) {
    agent = 'Profitability Agent';
    sources = [
      { name: 'Promo Calendar Ledger', type: 'Marketing Data', format: 'PostgreSQL' },
      { name: 'FMCG Multi-Country Sales Dataset', type: 'Transactional Logs', format: 'Parquet / S3' }
    ];
    signals = [
      { name: 'Promo Campaign Overlap', value: '10 days', threshold: '0 days', status: 'breached' },
      { name: 'Gross Margin', value: '22.5%', threshold: '> 40.0%', status: 'breached' }
    ];
    cogsFormula = 'Effective Margin = (Gross Revenue - Promo Costs) / Gross Revenue';
    reasoningPath = [
      'Profitability Agent scanned category promotional schedules.',
      'Identified a regional flyer discount overlapping with a national brand campaign on Green Tea RTD.',
      'Calculated combined price drop (double-discounting) at 38%.',
      'Verified gross margin collapsed to 22.5%, prompting temporary campaign pause recommendation.'
    ];
  } else if (title.includes('Price floor')) {
    agent = 'Portfolio Agent';
    sources = [
      { name: 'ERP Pricing Ledger', type: 'Pricing Reference', format: 'PostgreSQL' },
      { name: 'FMCG Multi-Country Sales Dataset', type: 'Transactional Logs', format: 'Parquet / S3' }
    ];
    signals = [
      { name: 'Unit Retail Price', value: '₹45.00', threshold: '> ₹50.00 floor', status: 'breached' },
      { name: 'Applied Discount', value: '25%', threshold: '< 15%', status: 'breached' }
    ];
    reasoningPath = [
      'Portfolio Agent monitored daily POS transaction batches.',
      'Flagged a retail price floor breach of ₹45.00 on Choco Wafers in APAC.',
      'Identified that local store managers applied double discounts to clear near-expiry stocks.',
      'Auto-flagged price compliance anomaly and logged warning in compliance registry.'
    ];
  } else if (title.includes('Promotional budget')) {
    agent = 'Profitability Agent';
    sources = [
      { name: 'Trade Spend Ledger', type: 'Budget Tracking', format: 'PostgreSQL' },
      { name: 'Marketing Campaigns DB', type: 'Marketing Data', format: 'Excel' }
    ];
    signals = [
      { name: 'Budget Consumed', value: '83%', threshold: '< 70%', status: 'breached' },
      { name: 'Remaining Days', value: '14 days', threshold: 'N/A', status: 'normal' }
    ];
    reasoningPath = [
      'Profitability Agent audited Q3 marketing expenditures.',
      'Found that promotional budget is 83% consumed with 14 campaign days remaining.',
      'Calculated accelerated budget burn rate due to elevated retail coupon redemptions.',
      'Flagged exhaustion risk to prevent promo-billing disputes with major accounts.'
    ];
  } else if (title.includes('Cost variance')) {
    agent = 'Profitability Agent';
    sources = [
      { name: 'COGS Composition Database', type: 'Recipes & Costs', format: 'Parquet' },
      { name: 'ERP Cost Ledger', type: 'Procurement Costs', format: 'PostgreSQL' }
    ];
    signals = [
      { name: 'Packaging Film Cost', value: '+7.4% price spike', threshold: '< +2.0%', status: 'breached' }
    ];
    reasoningPath = [
      'Profitability Agent scanned monthly raw material invoices.',
      'Detected a +7.4% cost increase in plastic film packaging materials.',
      'Mapped cost variance across finished product recipes.',
      'Determined average category SKU gross margin dropped by 1.4% and triggered margin alert.'
    ];
  }

  return {
    id: alert.id,
    title: alert.title,
    agent,
    sources,
    signals,
    cogsFormula,
    reasoningPath
  };
};

interface AgenticAlertExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: { id: string; title: string; sev: string; detail: string }[];
  isDarkMode: boolean;
  onInvestigateAlert: (alertId: string) => void;
}

export const AgenticAlertExplanationModal: React.FC<AgenticAlertExplanationModalProps> = ({
  isOpen,
  onClose,
  alerts,
  isDarkMode,
  onInvestigateAlert
}) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string>('a1');

  if (!isOpen) return null;

  // Resolve current provenance dynamically, ensuring we always match a valid alert
  // If the selectedAlertId is no longer in the alerts list, fallback to the first active alert
  const activeSelectedId = alerts.some(a => a.id === selectedAlertId) 
    ? selectedAlertId 
    : (alerts[0]?.id || 'a1');

  const currentAlert = alerts.find(a => a.id === activeSelectedId) || {
    id: 'a1',
    title: 'Mango Fizz 750ml launch delay — packaging shortage',
    sev: 'critical',
    detail: 'Launch · Delay risk: 21 days behind schedule'
  };
  
  const currentProvenance = getAlertProvenance(currentAlert);

  // Dynamic style mappings for Light / Dark Mode support
  const bgMain = isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700';
  const borderHeader = isDarkMode ? 'border-zinc-800' : 'border-zinc-150';
  const textTitle = isDarkMode ? 'text-white' : 'text-zinc-900';
  const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-500';
  const bgBanner = isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200';
  const textBannerHeader = isDarkMode ? 'text-yellow-500' : 'text-yellow-700';
  const bgSidebarBtnSelected = isDarkMode ? 'border-[#a78bfa]/50 bg-zinc-900 text-white' : 'border-[#6d28d9]/50 bg-purple-50 text-[#6d28d9]';
  const bgSidebarBtnUnselected = isDarkMode ? 'border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30 text-zinc-400' : 'border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 text-zinc-500';
  const borderCol = isDarkMode ? 'border-zinc-900' : 'border-zinc-200';
  const bgAlertStatus = isDarkMode ? 'bg-red-500/10 text-red-400 border border-red-500/10' : 'bg-red-500/10 text-red-600 border border-red-500/20';
  const bgAgentItem = isDarkMode ? 'bg-zinc-900/30 border-zinc-900' : 'bg-zinc-50 border-zinc-100';
  
  const bgDetailBanner = isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200';
  const bgSourceItem = isDarkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-zinc-50/50 border-zinc-200';
  const textSourceFormat = isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-600';
  const borderTable = isDarkMode ? 'border-zinc-850' : 'border-zinc-200';
  const bgTableHeader = isDarkMode ? 'bg-zinc-900 text-zinc-400' : 'bg-zinc-100 text-zinc-600';
  const bgTableBody = isDarkMode ? 'bg-zinc-950' : 'bg-white';
  const textTableRow = isDarkMode ? 'text-zinc-300' : 'text-zinc-700';
  const textTableRowVal = isDarkMode ? 'text-white' : 'text-zinc-900';
  
  const bgFormulaBox = isDarkMode ? 'bg-zinc-950 border-purple-950/40 text-purple-300' : 'bg-purple-50/40 border-purple-200/60 text-purple-700';
  
  const bgReasoningBox = isDarkMode ? 'bg-zinc-900/30 border-zinc-850' : 'bg-zinc-50 border-zinc-200';
  const textReasoningHeader = isDarkMode ? 'text-zinc-550' : 'text-zinc-500';
  const textReasoningList = isDarkMode ? 'text-zinc-300' : 'text-zinc-700';
  
  const textBottomLine = isDarkMode ? 'text-zinc-550' : 'text-zinc-400';
  const bgCloseBtn = isDarkMode ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900' : 'border-zinc-250 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50';
  const bgCloseIcon = isDarkMode ? 'hover:bg-zinc-800 text-zinc-500 hover:text-white' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-650';

  const stepNumClass = (idx: number) => {
    if (idx === 1) { // Blue
      return isDarkMode 
        ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400' 
        : 'bg-blue-50 border border-blue-200 text-blue-600';
    } else if (idx === 2) { // Purple
      return isDarkMode 
        ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400' 
        : 'bg-purple-50 border border-purple-200 text-purple-600';
    } else { // Yellow
      return isDarkMode 
        ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400' 
        : 'bg-yellow-50 border border-yellow-200 text-yellow-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl p-6 rounded-lg shadow-2xl flex flex-col gap-5 text-xs max-h-[92vh] overflow-y-auto font-sans animate-fade-in ${bgMain}`}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fadeIn 0.2s ease-out forwards;
          }
        `}</style>

        {/* Header */}
        <div className={`flex justify-between items-start border-b pb-4 ${borderHeader}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cpu className="text-[#a78bfa] dark:text-[#6d28d9] shrink-0 animate-pulse" size={16} />
              <h2 className={`text-sm font-display font-extrabold leading-snug tracking-wide uppercase ${textTitle}`}>
                Acies AgenticBus • Decision-Support Pipeline Trace
              </h2>
              <span className="text-[8px] font-mono font-bold bg-[#a78bfa]/20 text-[#c084fc] px-2 py-0.5 rounded border border-[#a78bfa]/35 uppercase animate-pulse">
                Active Swarm
              </span>
            </div>
            <p className={`text-[10px] font-semibold tracking-wide ${textMuted}`}>
              Technical diagnostics showing how cooperative AI agents process raw corporate databases into prioritized actions.
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className={`p-1 rounded cursor-pointer border-none bg-transparent outline-none transition-colors ${bgCloseIcon}`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Top Info Banner - Structured Problem Solving (SPS) Concept */}
        <div className={`border p-3 rounded flex items-start gap-3 ${bgBanner}`}>
          <Sparkles className="text-yellow-500 shrink-0 mt-0.5" size={14} />
          <div className="space-y-1">
            <h4 className={`font-extrabold text-[9.5px] uppercase tracking-wider ${textBannerHeader}`}>SPS Methodology & Agentic Integration</h4>
            <p className={`text-[10px] leading-relaxed ${textMuted}`}>
              Following the <strong>Structured Problem Solving (SPS)</strong> workflow, these agents automate the <em>"As-Is"</em> manual data aggregation bottleneck. They continuously scan decoupled storage tiers (DuckDB / S3 / Parquet) and SharePoint checklists, calculate complex mathematical formulas, and trigger LLM-reasoned interventions (the <em>"To-Be"</em> state) for category managers.
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[420px]">
          
          {/* Left Column: Active Alert Selector (4 cols) */}
          <div className={`lg:col-span-4 border-r pr-2 space-y-3 ${borderCol}`}>
            <h3 className={`font-extrabold text-[9.5px] uppercase tracking-widest mb-2 flex items-center gap-1.5 ${textMuted}`}>
              <Layers size={12} className="text-zinc-500" />
              Active System Signals ({alerts.length})
            </h3>
            
            <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className={`py-8 text-center font-bold uppercase tracking-widest text-[9px] border border-dashed rounded ${borderCol}`}>
                  No active alerts
                </div>
              ) : (
                alerts.map(activeAlert => {
                  const prov = getAlertProvenance(activeAlert);
                  const isSelected = activeSelectedId === activeAlert.id;
                  
                  return (
                    <button
                      key={activeAlert.id}
                      type="button"
                      onClick={() => setSelectedAlertId(activeAlert.id)}
                      className={`w-full text-left p-2.5 rounded transition-all flex flex-col gap-1 border cursor-pointer select-none bg-transparent ${
                        isSelected ? bgSidebarBtnSelected : bgSidebarBtnUnselected
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-[10px] truncate max-w-[170px]" title={activeAlert.title}>
                          {activeAlert.title.split('—')[0]}
                        </span>
                        <span className={`text-[6.5px] font-mono font-bold uppercase px-1 rounded-sm ${bgAlertStatus}`}>
                          Active
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[8.5px] font-medium text-zinc-500">
                        <span>{prov.agent}</span>
                        <span className="font-mono text-zinc-400 dark:text-zinc-650">{activeAlert.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Agent Swarm Roster Status */}
            <div className={`border-t pt-3 mt-2 ${borderCol}`}>
              <h4 className={`font-extrabold text-[9px] uppercase tracking-wider mb-2 ${textMuted}`}>Agent Swarm Status</h4>
              <div className="space-y-1.5">
                {AGENTS_ROSTER.slice(0, 3).map(agent => (
                  <div key={agent.name} className={`flex justify-between items-center p-1.5 rounded border ${bgAgentItem}`}>
                    <div className="flex items-center gap-2">
                      {agent.icon}
                      <span className="font-bold text-[9.5px]">{agent.name}</span>
                    </div>
                    <span className={`text-[7.5px] font-mono uppercase px-1.5 py-0.2 rounded-full ${
                      agent.status === 'processing' ? 'bg-purple-500/10 text-purple-500 animate-pulse' : 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Execution Trace Details (8 cols) */}
          <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
            
            {/* Trace Visualization Section */}
            <div className="space-y-4">
              
              {/* Alert Title Banner */}
              <div className={`p-3 border rounded ${bgDetailBanner}`}>
                <span className="text-[7.5px] font-mono uppercase tracking-widest text-[#6d28d9] dark:text-[#a78bfa] block font-bold">
                  Diagnostic Target Alert
                </span>
                <h3 className={`text-[11px] font-bold mt-0.5 ${textTitle}`}>
                  {currentProvenance.title}
                </h3>
              </div>

              {/* Step-by-Step Provenance Flow */}
              <div className="space-y-3">
                
                {/* 1. DATA SOURCES */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono text-[9px] ${stepNumClass(1)}`}>
                      1
                    </div>
                    <div className={`w-[1px] h-8 my-1 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                  </div>
                  <div className="space-y-1 mt-0.5 w-full">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400 flex items-center gap-1">
                      <Database size={10} />
                      Step 1: Read Corporate Data Sources
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {currentProvenance.sources.map((src, idx) => (
                        <div key={idx} className={`p-2 border rounded flex flex-col justify-between ${bgSourceItem}`}>
                          <span className={`font-bold text-[9.5px] truncate ${textTitle}`} title={src.name}>{src.name}</span>
                          <div className="flex justify-between items-center mt-1 text-[8px] text-zinc-500">
                            <span>{src.type}</span>
                            <span className={`font-mono px-1 rounded ${textSourceFormat}`}>{src.format}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. MATHEMATICAL CALCULATION / SIGNAL ANALYSIS */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono text-[9px] ${stepNumClass(2)}`}>
                      2
                    </div>
                    <div className={`w-[1px] h-8 my-1 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                  </div>
                  <div className="space-y-1.5 mt-0.5 w-full">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <Cpu size={10} />
                      Step 2: Run Analytical Formulations & Threshold Check
                    </span>
                    
                    {currentProvenance.cogsFormula && (
                      <div className={`border p-2 rounded font-mono text-[9px] ${bgFormulaBox}`}>
                        <span className="text-[7.5px] text-zinc-500 font-sans font-bold uppercase block tracking-widest mb-0.5">Calculated Equation</span>
                        {currentProvenance.cogsFormula}
                      </div>
                    )}

                    <div className={`border rounded overflow-hidden ${borderTable}`}>
                      <table className="w-full text-[9px]">
                        <thead>
                          <tr className={`text-left ${bgTableHeader}`}>
                            <th className="p-1.5 font-bold uppercase tracking-wider">Metric / Target Signal</th>
                            <th className="p-1.5 font-bold uppercase tracking-wider">Observed Value</th>
                            <th className="p-1.5 font-bold uppercase tracking-wider">Control Threshold</th>
                            <th className="p-1.5 font-bold uppercase tracking-wider text-right">Result</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-zinc-900' : 'divide-zinc-150'} ${bgTableBody}`}>
                          {currentProvenance.signals.map((sig, idx) => (
                            <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.01]">
                              <td className={`p-1.5 font-bold ${textTableRow}`}>{sig.name}</td>
                              <td className={`p-1.5 font-mono font-bold ${textTableRowVal}`}>{sig.value}</td>
                              <td className="p-1.5 font-mono text-zinc-500">{sig.threshold}</td>
                              <td className="p-1.5 text-right">
                                <span className={`px-1.5 py-0.2 rounded text-[7.5px] font-bold uppercase ${
                                  sig.status === 'breached' 
                                    ? 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/10' 
                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10'
                                }`}>
                                  {sig.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 3. LLM INTERPRETATION PATH */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono text-[9px] ${stepNumClass(3)}`}>
                      3
                    </div>
                  </div>
                  <div className="space-y-1 mt-0.5 w-full">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                      <Sparkles size={10} />
                      Step 3: Route to LLM Reasoning Tier & Formulate Action Plan
                    </span>
                    <div className={`border p-3 rounded space-y-1.5 leading-relaxed text-[9.5px] ${bgReasoningBox}`}>
                      <span className={`text-[7.5px] font-mono uppercase tracking-widest block font-bold ${textReasoningHeader}`}>
                        {currentProvenance.agent} Reasoning Trace (Gemini 2.5 Flash)
                      </span>
                      <ul className="space-y-1 pr-1 font-medium">
                        {currentProvenance.reasoningPath.map((path, idx) => (
                          <li key={idx} className={`flex gap-2 items-start ${textReasoningList}`}>
                            <span className="text-yellow-500 select-none">→</span>
                            <span>{path}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Actions */}
            <div className={`flex justify-between items-center border-t pt-4 mt-2 ${isDarkMode ? 'border-zinc-900' : 'border-zinc-200'}`}>
              <span className={`text-[8.5px] font-mono ${textBottomLine}`}>
                PROVENANCE TRACE • ID: {currentProvenance.id.slice(0, 8).toUpperCase()}
              </span>
              
              <div className="flex gap-2">
                {alerts.some(a => a.id === currentProvenance.id) && (
                  <button
                    key="investigate-btn"
                    type="button"
                    onClick={() => {
                      onInvestigateAlert(currentProvenance.id);
                    }}
                    className="px-3.5 py-1.5 bg-[#6d28d9] hover:bg-[#5b21b6] text-white rounded font-bold uppercase tracking-wider transition-colors cursor-pointer border-none"
                  >
                    Investigate Alert
                  </button>
                )}
                <button
                  key="close-btn"
                  type="button"
                  onClick={onClose}
                  className={`px-3.5 py-1.5 border rounded font-bold uppercase tracking-wider transition-colors cursor-pointer bg-transparent outline-none ${bgCloseBtn}`}
                >
                  Close Trace
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
