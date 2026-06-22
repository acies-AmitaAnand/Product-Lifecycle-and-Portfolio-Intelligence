/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, Database, Cpu, Terminal, ArrowRight, Activity, Layers, Sparkles, 
  Settings, Server, CheckCircle2, AlertTriangle, Info
} from 'lucide-react';

interface FlowchartStep {
  title: string;
  shortDesc: string;
  icon: React.ReactNode;
  issuesPath: string[];
  techTitle: string;
  techContent: {
    label: string;
    value: string;
    isCode?: boolean;
  }[];
  formula?: string;
  reasoningPath?: string[];
}

interface AgentWorkflow {
  name: string;
  role: string;
  description: string;
  status: string;
  icon: React.ReactNode;
  steps: [FlowchartStep, FlowchartStep, FlowchartStep];
}

const AGENTS_WORKFLOWS: AgentWorkflow[] = [
  {
    name: 'Market Signal Agent',
    role: 'Competitor & Sentiment Scraper',
    description: 'Scrapes external competitor retail portals, IoT cold chain sensors, and customer sentiment tables to detect pricing pressures and supply-demand mismatches.',
    status: 'Scraping feeds...',
    icon: <Settings className="text-pink-500 animate-spin-slow" size={16} />,
    steps: [
      {
        title: 'Data Ingestion',
        shortDesc: 'Scrapes competitor prices, IoT sensory logs, and sentiment reviews.',
        icon: <Database className="text-pink-500" size={14} />,
        issuesPath: ['Market & Competitor Intelligence', 'Data', 'Outdated Data'],
        techTitle: 'Ingested Datasets & Protocols',
        techContent: [
          { label: 'Data Feeds', value: 'Competitor pricing web scrapers, IoT warehouse temperature sensors, customer reviews API' },
          { label: 'Feed Formats', value: 'JSON, XML, MQTT Sensor Feeds' },
          { label: 'Target Metric', value: 'Freshness of Data (reducing data latency from days to real-time)' }
        ]
      },
      {
        title: 'Processing & Analysis',
        shortDesc: 'Runs price variance algorithms and cold-chain threshold checks.',
        icon: <Cpu className="text-pink-500" size={14} />,
        issuesPath: ['Market & Competitor Intelligence', 'Disconnected Market', 'Demand-Supply Mismatch Rate'],
        techTitle: 'Analytical Formulations & Thresholds',
        techContent: [
          { label: 'Control Threshold', value: 'Competitor price drop > 5.0% OR sensor temperature unit 4 > 4.0°C' },
          { label: 'Key Metrics Checked', value: 'Demand-Supply Mismatch Rate, Pricing Elasticity' }
        ],
        formula: 'Price Variance = (Competitor Unit Price - Target Price) / Target Price'
      },
      {
        title: 'Diagnostic Output',
        shortDesc: 'Dispatches real-time anomalies and competitor price-matching triggers.',
        icon: <Sparkles className="text-pink-500" size={14} />,
        issuesPath: ['Market & Competitor Intelligence', 'Weak New Entrant Monitoring', 'Customer Shift Rate'],
        techTitle: 'Actionable Swarm Mitigation',
        techContent: [
          { label: 'AI Mitigation Options', value: 'Automate matching competitor promotional rates, dispatch maintenance crew to seal refrigeration unit' },
          { label: 'Resolution Outcome', value: 'Mitigates customer shift risks by keeping pricing elastic and stock fresh' }
        ],
        reasoningPath: [
          'Detected a price floor variance on competitor site for active SKU category.',
          'Cross-referenced IoT telemetry log to ensure cold-chain integrity remains green.',
          'Formulated pricing match option and updated the compliance alert registry.'
        ]
      }
    ]
  },
  {
    name: 'Portfolio Agent',
    role: 'SKU Performance Monitor',
    description: 'Aggregates sales performance data, volume trends, and safety stock levels daily to identify SKU-level gaps and coverage issues.',
    status: 'Aggregating SKU volumes...',
    icon: <Activity className="text-emerald-500 animate-pulse" size={16} />,
    steps: [
      {
        title: 'Data Ingestion',
        shortDesc: 'Aggregates ERP transactional logs, SharePoint gate lists, and distributor stock.',
        icon: <Database className="text-emerald-500" size={14} />,
        issuesPath: ['Visibility', 'Data', 'Scattered & Incomplete Data'],
        techTitle: 'Ingested Datasets & Protocols',
        techContent: [
          { label: 'Data Feeds', value: 'ERP ledger transaction tables, SharePoint PM checklists, distributor warehouse logs' },
          { label: 'Feed Formats', value: 'SQL database, CSV uploads, SharePoint REST API' },
          { label: 'Target Metric', value: 'Data Integration Ratio, Completeness Percentage' }
        ]
      },
      {
        title: 'Processing & Analysis',
        shortDesc: 'Computes volume trend indices, stock status, and category health scores.',
        icon: <Cpu className="text-emerald-500" size={14} />,
        issuesPath: ['Visibility', 'No SKU Level Insights', 'SKU Coverage Percentage'],
        techTitle: 'Analytical Formulations & Thresholds',
        techContent: [
          { label: 'Control Threshold', value: 'SKU volume decline > 10% month-over-month OR stock levels < safety stock threshold' },
          { label: 'Key Metrics Checked', value: 'SKU Coverage Percentage, Volume Trend Index' }
        ],
        formula: 'SKU Coverage = (Actively Tracked SKUs / Total Portfolio SKUs) * 100'
      },
      {
        title: 'Diagnostic Output',
        shortDesc: 'Dispatches SKU performance gaps and dashboard reports.',
        icon: <Sparkles className="text-emerald-500" size={14} />,
        issuesPath: ['Visibility', 'No Centralized Dashboard', 'Feedback from VP'],
        techTitle: 'Actionable Swarm Mitigation',
        techContent: [
          { label: 'AI Mitigation Options', value: 'Generate category gap reports, trigger automatic replenishment requests for low-stock SKUs' },
          { label: 'Resolution Outcome', value: 'Replaces manual reporting loops with real-time dashboards for category managers' }
        ],
        reasoningPath: [
          'Scanned historical and active transaction tables across distributor databases.',
          'Detected scattered data records and unified them into a single portfolio ledger.',
          'Identified three SKUs breaching safety stock limits; compiled alert overview.'
        ]
      }
    ]
  },
  {
    name: 'Profitability Agent',
    role: 'Margin Leak Auditor',
    description: 'Traverses dynamic P&L cost trees, raw material invoice ledgers, and trade promo calendars to pinpoint margin leakage points.',
    status: 'Auditing promo costs...',
    icon: <Terminal className="text-purple-500" size={16} />,
    steps: [
      {
        title: 'Data Ingestion',
        shortDesc: 'Pulls category P&L ledgers, COGS composition lists, and promo calendars.',
        icon: <Database className="text-purple-500" size={14} />,
        issuesPath: ['Product Management', 'Data', 'Scattered Financial Data'],
        techTitle: 'Ingested Datasets & Protocols',
        techContent: [
          { label: 'Data Feeds', value: 'ERP cost accounting ledgers, COGS composition database, marketing calendar logs' },
          { label: 'Feed Formats', value: 'PostgreSQL Tables, Parquet file storage' },
          { label: 'Target Metric', value: 'Margin Transparency Index' }
        ]
      },
      {
        title: 'Processing & Analysis',
        shortDesc: 'Decomposes cost-to-serve and runs promo lift-vs-discount overlap tests.',
        icon: <Cpu className="text-purple-500" size={14} />,
        issuesPath: ['Product Management', 'No Profitability Clarity', 'Contribution Margin'],
        techTitle: 'Analytical Formulations & Thresholds',
        techContent: [
          { label: 'Control Threshold', value: 'Gross margin drops < 35.0% OR coupon overlap rates breach 1.5x of baseline prices' },
          { label: 'Key Metrics Checked', value: 'Contribution Margin, Cost Variance Percentage' }
        ],
        formula: 'Contribution Margin = (Revenue - COGS - Trade Promos) / Revenue'
      },
      {
        title: 'Diagnostic Output',
        shortDesc: 'Triggers margin erosion alerts with pass-through pricing options.',
        icon: <Sparkles className="text-purple-500" size={14} />,
        issuesPath: ['Market & Competitor Intelligence', 'Pricing Issues', 'Elasticity Analysis'],
        techTitle: 'Actionable Swarm Mitigation',
        techContent: [
          { label: 'AI Mitigation Options', value: 'Suspend overlapping campaign flyer discounts, trigger supplier contract rate renegotiations' },
          { label: 'Resolution Outcome', value: 'Stops trade promotional leakage and restores contribution margins to baseline targets' }
        ],
        reasoningPath: [
          'Traversed raw ingredient invoice ledgers and identified a +15% price spike in surfactants.',
          'Detected overlapping regional flyer discounts on Dishwasher Pods causing gross margins to crash to 12.0%.',
          'Calculated volume elasticity lift and recommended immediate campaign suspension.'
        ]
      }
    ]
  },
  {
    name: 'Sunset Agent',
    role: 'Complexity & Cannibalization Assessor',
    description: 'Runs volume correlation models and product displacement simulations to identify SKU rationalization opportunities.',
    status: 'Simulating cannibalization...',
    icon: <Server className="text-amber-500" size={16} />,
    steps: [
      {
        title: 'Data Ingestion',
        shortDesc: 'Extracts weekly sales volumes, packaging costs, and shelf spacing details.',
        icon: <Database className="text-amber-500" size={14} />,
        issuesPath: ['Product Management', 'Data', 'Longitudinal Sales Records'],
        techTitle: 'Ingested Datasets & Protocols',
        techContent: [
          { label: 'Data Feeds', value: 'Category SKU weekly volumes, shelf space registries, distributor warehousing costs' },
          { label: 'Feed Formats', value: 'CSV tables, S3 Parquet' },
          { label: 'Target Metric', value: 'Assortment Data Coverage' }
        ]
      },
      {
        title: 'Processing & Analysis',
        shortDesc: 'Computes Pearson volume correlation matrix and assortment complexity overhead.',
        icon: <Cpu className="text-amber-500" size={14} />,
        issuesPath: ['Product Management', 'Cannibalization', 'Cannibalization Score'],
        techTitle: 'Analytical Formulations & Thresholds',
        techContent: [
          { label: 'Control Threshold', value: 'Volume displacement correlation coefficient r < -0.40 between two internal product variants' },
          { label: 'Key Metrics Checked', value: 'Cannibalization Score, Assortment Complexity Index' }
        ],
        formula: 'Pearson Correlation = Covariance(X, Y) / (StdDev(X) * StdDev(Y))'
      },
      {
        title: 'Diagnostic Output',
        shortDesc: 'Recommends low-performing SKUs for sunsetting and maps volume redirect ratios.',
        icon: <Sparkles className="text-amber-500" size={14} />,
        issuesPath: ['Product Management', 'No SKU Rationalization', 'SKU Score'],
        techTitle: 'Actionable Swarm Mitigation',
        techContent: [
          { label: 'AI Mitigation Options', value: 'Sunset low-margin variants, redirect shelf-spacing allocation to high-demand core items' },
          { label: 'Resolution Outcome', value: 'Reduces category complexity, decreases overhead drag, and lifts overall SKU Scores' }
        ],
        reasoningPath: [
          'Computed volume correlations between Mango Fizz 750ml and core beverage variants.',
          'Found a strong negative correlation (r = -0.62) indicating core sales are displaced by the variant.',
          'Projected a 78% volume redirection to core variants if the overlapping SKU is sunset.'
        ]
      }
    ]
  },
  {
    name: 'Launch Agent',
    role: 'Readiness Gate Coordinator',
    description: 'Tracks cross-functional progress across launch readiness gates to minimize approval delays and decision lag.',
    status: 'Auditing launch readiness...',
    icon: <Layers className="text-blue-500" size={16} />,
    steps: [
      {
        title: 'Data Ingestion',
        shortDesc: 'Tracks SharePoint milestone spreadsheets and distributor slotting schedules.',
        icon: <Database className="text-blue-500" size={14} />,
        issuesPath: ['GTM', 'Data', 'Siloed Project Files'],
        techTitle: 'Ingested Datasets & Protocols',
        techContent: [
          { label: 'Data Feeds', value: 'SharePoint project trackers, regulatory compliance databases, slotting schedules' },
          { label: 'Feed Formats', value: 'Excel spreadsheets, text logs, REST APIs' },
          { label: 'Target Metric', value: 'Milestone Tracking Completeness' }
        ]
      },
      {
        title: 'Processing & Analysis',
        shortDesc: 'Analyzes critical path milestones and projects launch gate variances.',
        icon: <Cpu className="text-blue-500" size={14} />,
        issuesPath: ['GTM', 'Reactive Launch Decisions', 'Decision Lag'],
        techTitle: 'Analytical Formulations & Thresholds',
        techContent: [
          { label: 'Control Threshold', value: 'Regulatory approval pending < 30 days to launch OR supermarket slot unconfirmed' },
          { label: 'Key Metrics Checked', value: 'Launch Readiness Score, Decision Lag cycle' }
        ],
        formula: 'Readiness Score = (Completed Pre-launch Gates / 5 Mandatory Gates) * 100'
      },
      {
        title: 'Diagnostic Output',
        shortDesc: 'Formulates launch gate intervention plans and escalates space contracts.',
        icon: <Sparkles className="text-blue-500" size={14} />,
        issuesPath: ['GTM', 'Slow Approvals', 'Approval Cycle Time'],
        techTitle: 'Actionable Swarm Mitigation',
        techContent: [
          { label: 'AI Mitigation Options', value: 'Escalate regulatory labeling paperwork review, trigger emergency executive negotiations with retailers' },
          { label: 'Resolution Outcome', value: 'Minimizes launch delay, reducing average approval cycles from 48 to 10 days' }
        ],
        reasoningPath: [
          'Audited milestone checklists for BrandA Energy launch; sourcing and pricing gates are green.',
          'Detected pending labeling regulatory status and unconfirmed supermarket slotting.',
          'Calculated critical path delay of 21 days; dispatched warning trigger to GTM lead.'
        ]
      }
    ]
  }
];

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
  isDarkMode
}) => {
  const [activeAgentIndex, setActiveAgentIndex] = useState<number>(0);
  const [hoveredStepIndex, setHoveredStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const currentAgent = AGENTS_WORKFLOWS[activeAgentIndex];
  const activeStepData = currentAgent.steps[hoveredStepIndex];

  // Theme styling helpers
  const bgMain = isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700';
  const borderHeader = isDarkMode ? 'border-zinc-800' : 'border-zinc-150';
  const textTitle = isDarkMode ? 'text-white' : 'text-zinc-900';
  const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-500';
  const bgBanner = isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200';
  const textBannerHeader = isDarkMode ? 'text-yellow-500' : 'text-yellow-700';
  const borderCol = isDarkMode ? 'border-zinc-900' : 'border-zinc-200';
  const bgCloseIcon = isDarkMode ? 'hover:bg-zinc-800 text-zinc-500 hover:text-white' : 'hover:bg-zinc-100 text-zinc-450 hover:text-zinc-650';

  const sidebarSelected = isDarkMode ? 'border-purple-500/50 bg-zinc-900 text-white' : 'border-purple-200 bg-purple-50/50 text-purple-750';
  const sidebarUnselected = isDarkMode ? 'border-zinc-900 hover:border-zinc-800 text-zinc-400' : 'border-zinc-100 hover:border-zinc-200 text-zinc-500';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className={`w-full max-w-5xl p-6 rounded-lg shadow-2xl flex flex-col gap-4 text-xs max-h-[95vh] overflow-y-auto font-sans animate-fade-in ${bgMain}`}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fadeIn 0.2s ease-out forwards;
          }
          .animate-spin-slow {
            animation: spin 8s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Header */}
        <div className={`flex justify-between items-start border-b pb-3 ${borderHeader}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cpu className="text-purple-500 dark:text-purple-400 shrink-0" size={16} />
              <h2 className={`text-sm font-display font-extrabold leading-snug tracking-wide uppercase ${textTitle}`}>
                Product Lifecycle & Portfolio Intelligence • Swarm Diagnostic Flowchart
              </h2>
              <span className="text-[8px] font-mono font-bold bg-purple-500/10 text-purple-650 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 uppercase">
                Workflow View
              </span>
            </div>
            <p className={`text-[10px] font-semibold tracking-wide ${textMuted}`}>
              Explore the general operational flowcharts of cooperating AI agents. Hover over the flowchart steps to inspect deep-dive diagnostics.
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

        {/* Top Info Banner - SPS methodology */}
        <div className={`border p-3 rounded flex items-start gap-3 ${bgBanner}`}>
          <Info className="text-blue-500 shrink-0 mt-0.5" size={14} />
          <div className="space-y-1">
            <h4 className={`font-extrabold text-[9.5px] uppercase tracking-wider ${textBannerHeader}`}>General Swarm Workflow Mechanics</h4>
            <p className={`text-[10px] leading-relaxed ${textMuted}`}>
              Under the <strong>Structured Problem Solving (SPS)</strong> workflow, each agent continuously automates the core operational stages: Ingesting decoupled data formats, executing calculations against control thresholds, and routing reasoning traces to formulate action plans.
            </p>
          </div>
        </div>        {/* Swarm Roster Horizontal Selector */}
        <div className="flex flex-wrap gap-2.5 items-center pb-2 border-b border-black/5 dark:border-white/5">
          <span className={`text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 mr-2 ${textMuted}`}>
            <Settings size={11} className="text-zinc-500 animate-spin-slow" />
            Agent Swarm Roster:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {AGENTS_WORKFLOWS.map((agent, idx) => {
              const isSelected = activeAgentIndex === idx;
              return (
                <button
                  key={agent.name}
                  type="button"
                  onClick={() => {
                    setActiveAgentIndex(idx);
                    setHoveredStepIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-sm border text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected 
                      ? 'bg-[#6d28d9]/10 border-[#6d28d9] text-[#6d28d9] dark:text-[#a78bfa] dark:border-[#a78bfa]/50' 
                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-500 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  {agent.icon}
                  {agent.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4 flex flex-col justify-between min-h-[460px]">
          
          <div className="space-y-4.5">
            
            {/* Agent Role Info */}
            <div className={`p-3 border rounded-lg ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50 border-zinc-150'}`}>
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Selected Swarm Node • {currentAgent.role}
              </span>
              <h3 className={`text-[12px] font-extrabold mt-0.5 ${textTitle}`}>
                {currentAgent.name} Operational Protocol
              </h3>
              <p className={`text-[9.5px] leading-relaxed mt-1.5 font-medium ${textMuted}`}>
                {currentAgent.description}
              </p>
            </div>

            {/* FLOWCHART SECTION */}
            <div className="space-y-2">
              <h4 className="text-[9.5px] uppercase tracking-wider text-zinc-500 font-extrabold">General Workflow Flowchart</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-1.5">
                {currentAgent.steps.map((step, idx) => {
                  const isHovered = hoveredStepIndex === idx;
                  
                  const stepBg = isHovered 
                    ? 'border-purple-500 bg-purple-500/5 dark:bg-purple-950/20 shadow-md shadow-purple-500/10' 
                    : isDarkMode ? 'border-zinc-900 bg-zinc-950 hover:border-zinc-850 hover:bg-zinc-900/10' : 'border-zinc-150 bg-white hover:border-zinc-200 hover:bg-zinc-50';

                  const dotBg = isHovered ? 'bg-purple-500 text-white' : 'bg-zinc-500/10 text-zinc-500';

                  return (
                    <React.Fragment key={idx}>
                      {/* Step Card */}
                      <div
                        onMouseEnter={() => setHoveredStepIndex(idx)}
                        className={`md:col-span-1 border rounded p-3 text-center transition-all duration-200 cursor-help flex flex-col items-center gap-1.5 ${stepBg}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${dotBg} transition-colors`}>
                          {step.icon}
                        </div>
                        <div>
                          <p className={`font-bold text-[9.5px] ${isHovered ? 'text-purple-650 dark:text-purple-300' : textTitle}`}>
                            Step {idx + 1}
                          </p>
                          <p className="text-[8.5px] font-bold text-zinc-500 mt-0.5 uppercase tracking-wide">
                            {step.title}
                          </p>
                        </div>
                        <p className="text-[7.5px] text-zinc-450 leading-snug line-clamp-2 mt-0.5">
                          {step.shortDesc}
                        </p>
                      </div>

                      {/* Arrow connector between cards (only if not the last step) */}
                      {idx < 2 && (
                        <div className="md:col-span-1 flex items-center justify-center text-zinc-400 select-none py-1 md:py-0">
                          <ArrowRight size={14} className="rotate-90 md:rotate-0" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC HOVER DETAILS CARD */}
            <div className={`p-4 border rounded-lg space-y-3.5 transition-all ${
              isDarkMode ? 'bg-zinc-900/20 border-zinc-850' : 'bg-zinc-50/20 border-zinc-200'
            }`}>
              
              {/* Detail Section Header */}
              <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-yellow-500 animate-pulse" size={12} />
                  <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${textTitle}`}>
                    Deep Dive: Step {hoveredStepIndex + 1} ({activeStepData.title})
                  </h4>
                </div>
                <span className="text-[7.5px] font-mono bg-purple-500/10 text-purple-650 dark:text-purple-400 border border-purple-500/25 px-1.5 py-0.2 rounded font-bold uppercase">
                  Interactive Insight
                </span>
              </div>

              {/* Solved Issue Tree Node Path */}
              <div className="space-y-1">
                <span className="text-[8px] font-mono uppercase text-zinc-500 font-extrabold block">Solved Issue Tree Nodes</span>
                <div className="flex flex-wrap items-center gap-1 text-[8.5px] font-bold">
                  <span className="text-zinc-500">Poor Portfolio Decision Making</span>
                  <ArrowRight size={8} className="text-zinc-450 shrink-0" />
                  {activeStepData.issuesPath.map((node, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <ArrowRight size={8} className="text-zinc-450 shrink-0" />}
                      <span className={`px-1.5 py-0.2 rounded ${
                        i === activeStepData.issuesPath.length - 1 
                          ? 'bg-red-500/10 text-red-500 border border-red-500/15'
                          : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/10'
                      }`}>
                        {node}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Ingestion & Processing Details */}
              <div className="space-y-2">
                <span className="text-[8px] font-mono uppercase text-zinc-500 font-extrabold block">
                  {activeStepData.techTitle}
                </span>
                
                <div className={`p-2 border rounded divide-y divide-black/5 dark:divide-white/5 ${
                  isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-150'
                }`}>
                  {activeStepData.techContent.map((row, i) => (
                    <div key={i} className="py-1.5 flex flex-col sm:flex-row sm:items-start gap-1 justify-between text-[9px]">
                      <span className="font-bold text-zinc-500 sm:w-1/3 shrink-0">{row.label}</span>
                      <span className={`sm:w-2/3 ${
                        row.isCode ? 'font-mono text-purple-600 dark:text-purple-400 bg-purple-500/5 px-1 py-0.5 rounded border border-purple-500/10' : textTitle
                      }`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Formula representation */}
              {activeStepData.formula && (
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase text-zinc-500 font-extrabold block">Mathematical Equation Model</span>
                  <div className={`p-2.5 border border-purple-500/15 rounded font-mono text-[9.5px] font-bold text-purple-650 dark:text-purple-300 ${
                    isDarkMode ? 'bg-purple-950/10' : 'bg-purple-50/20'
                  }`}>
                    {activeStepData.formula}
                  </div>
                </div>
              )}

              {/* Optional AI Reasoning Trace path */}
              {activeStepData.reasoningPath && (
                <div className="space-y-1.5">
                  <span className="text-[8px] font-mono uppercase text-zinc-500 font-extrabold block">Swarm Reasoning Trace (Gemini 2.5 Flash)</span>
                  <div className={`p-3 border rounded-lg space-y-1 leading-relaxed text-[9px] ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-150'
                  }`}>
                    <ul className="space-y-1">
                      {activeStepData.reasoningPath.map((path, i) => (
                        <li key={i} className="flex gap-2 items-start text-zinc-500 dark:text-zinc-400 font-medium">
                          <span className="text-yellow-500 select-none">→</span>
                          <span>{path}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Instruction Footer */}
          <div className={`flex justify-between items-center border-t pt-3 mt-1.5 ${isDarkMode ? 'border-zinc-900' : 'border-zinc-200'}`}>
            <span className="text-[8px] font-mono text-zinc-550 dark:text-zinc-500">
              PROVENANCE PIPELINE DIAGNOSTIC VIEW
            </span>
            <span className="text-[9px] text-zinc-450 dark:text-zinc-500 italic">
              Press 'X' at the top-right corner to exit this diagnostic swarm view.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
