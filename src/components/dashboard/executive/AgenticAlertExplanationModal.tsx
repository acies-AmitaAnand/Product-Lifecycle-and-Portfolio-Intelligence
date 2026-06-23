/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface AgenticAlertExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: { id: string; title: string; sev: string; detail: string }[];
  isDarkMode: boolean;
  onInvestigateAlert: (alertId: string) => void;
}

type IngestSourceTab = 'finance' | 'crm' | 'iot' | 'api';
type ComputeTab = 'process' | 'vis' | 'recs' | 'collab' | 'gov';
type DiagnosticTab = 'diagnostic' | 'root' | 'impact' | 'scenario' | 'alerts' | 'recs';

export const AgenticAlertExplanationModal: React.FC<AgenticAlertExplanationModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [activeSourceTab, setActiveSourceTab] = useState<IngestSourceTab>('finance');
  const [activeComputeTab, setActiveComputeTab] = useState<ComputeTab>('process');
  const [activeDiagnosticTab, setActiveDiagnosticTab] = useState<DiagnosticTab>('diagnostic');

  if (!isOpen) return null;

  // Source-specific high fidelity data for Ingestion (Step 1)
  const tabData = {
    finance: {
      title: 'Finance & Ops',
      subtitle: 'ERP, GL, P&L, Inventory, Costing and more',
      systems: [
        { name: 'SAP S/4HANA', badge: 'SAP', badgeBg: 'bg-blue-600' },
        { name: 'Oracle Finance', badge: 'ORCL', badgeBg: 'bg-red-600' },
        { name: 'NetSuite', badge: 'NS', badgeBg: 'bg-zinc-800' },
      ],
      dataIngested: [
        'Revenue',
        'COGS',
        'Gross Margin',
        'Operating Cost',
        'Inventory Cost',
        'Product P&L',
      ],
      quality: {
        pct: 98,
        sync: '5 min ago',
        completeness: '98%',
        accuracy: '97%',
        freshness: '99%',
        records: '2.4M',
      },
      insight: {
        bullets: [
          '27 SKUs are generating 80% of portfolio profit.',
          '15 SKUs have declining margins despite revenue growth.',
          'Potential margin recovery: $3.2M annually.',
        ],
      },
      outcomes: [
        'Profitability Analysis',
        'SKU Rationalization',
        'Margin Optimization',
        'Portfolio Health Scoring',
      ],
      flow: [
        { label: 'Finance & Ops', desc: 'Raw financial, cost and inventory data ingested' },
        { label: 'Revenue + Cost Data', desc: 'Unified and cleansed financial metrics prepared' },
        { label: 'AI Profitability Engine', desc: 'AI models analyze margins, trends and profit drivers' },
        { label: 'SKU Health Score', desc: 'Each SKU scored on profitability, growth and risk' },
        { label: 'Recommendations', desc: 'Discontinue SKU-142 (Red), Expand SKU-217 (Green), Optimize SKU-089 (Yellow)' },
      ],
    },
    crm: {
      title: 'CRM / ERP',
      subtitle: 'Customers, Orders, Pipeline, Returns and more',
      systems: [
        { name: 'Salesforce CRM', badge: 'SFDC', badgeBg: 'bg-sky-500' },
        { name: 'Microsoft Dynamics', badge: 'MSFT', badgeBg: 'bg-teal-600' },
        { name: 'HubSpot', badge: 'HUBS', badgeBg: 'bg-orange-500' },
      ],
      dataIngested: [
        'Customer Accounts',
        'Sales Orders',
        'Pipeline Stages',
        'Return Logs',
        'Service Cases',
        'Opportunity Data',
      ],
      quality: {
        pct: 96,
        sync: '12 min ago',
        completeness: '96%',
        accuracy: '95%',
        freshness: '98%',
        records: '4.8M',
      },
      insight: {
        bullets: [
          'High concentration of low-margin orders identified in region West.',
          'Customer churn probability reduced by 12% via proactive pricing adjustments.',
          'Potential pipeline expansion: $1.8M.',
        ],
      },
      outcomes: [
        'Customer LTV Maximization',
        'Pricing Elasticity Modeling',
        'Demand Forecasting',
        'Pipeline Optimization',
      ],
      flow: [
        { label: 'CRM & ERP Data', desc: 'Customer profiling and transaction histories ingested' },
        { label: 'Client Segments', desc: 'Cleansed profiles sorted by volume and value' },
        { label: 'AI LTV Predictor', desc: 'AI computes long-term margins and churn risks' },
        { label: 'Customer Scorecard', desc: 'Clients ranked by profitability and retention potential' },
        { label: 'Recommendations', desc: 'Target Account A-09 (Green), Upsell Bundle B-12 (Green), Flag Account C-44 (Yellow)' },
      ],
    },
    iot: {
      title: 'IoT Feeds',
      subtitle: 'Production, Machines, Quality, Sensors and more',
      systems: [
        { name: 'AWS IoT Hub', badge: 'AWS', badgeBg: 'bg-amber-500' },
        { name: 'Azure IoT Central', badge: 'MSFT', badgeBg: 'bg-blue-500' },
        { name: 'Siemens Industrial', badge: 'SIEM', badgeBg: 'bg-cyan-700' },
      ],
      dataIngested: [
        'Machine Vibration',
        'Temperature',
        'Power Draw',
        'Cycle Times',
        'Error Codes',
        'Yield Rates',
      ],
      quality: {
        pct: 99,
        sync: 'Real-time',
        completeness: '99.4%',
        accuracy: '98.9%',
        freshness: '99.9%',
        records: '142M',
      },
      insight: {
        bullets: [
          'CNC Machine #4 shows abnormal vibration pattern (potential bearing issue).',
          'Line B energy draw spiked 18% during peak load cycles.',
          'Potential preventive savings: $420k.',
        ],
      },
      outcomes: [
        'Predictive Maintenance',
        'Overall Equipment Effectiveness',
        'Energy Consumption Tuning',
        'Downtime Minimization',
      ],
      flow: [
        { label: 'Telemetry Data', desc: 'High-frequency machine and sensor data ingested' },
        { label: 'Anomalies Isolated', desc: 'Sensor values filtered for variance and thresholds' },
        { label: 'AI Predictive Engine', desc: 'ML models forecast maintenance requirements' },
        { label: 'Machine Health Index', desc: 'Individual assets scored by wear and reliability' },
        { label: 'Recommendations', desc: 'Schedule CNC-04 Service (Red), Optimize Line B Cycle (Yellow), Calibrate Press-09 (Green)' },
      ],
    },
    api: {
      title: 'External APIs',
      subtitle: 'Market, Competitor, Retail, Economic Data and more',
      systems: [
        { name: 'Bloomberg Terminal', badge: 'BBG', badgeBg: 'bg-black border border-zinc-700 text-amber-500' },
        { name: 'OpenWeather API', badge: 'OWM', badgeBg: 'bg-[#0f2c59]' },
        { name: 'Fed Rate Feed', badge: 'FED', badgeBg: 'bg-emerald-600' },
      ],
      dataIngested: [
        'Global Index Pricing',
        'Competitor Web-scraping',
        'Inflation Rates',
        'Consumer Confidence',
        'Weather Patterns',
        'Economic Indices',
      ],
      quality: {
        pct: 97,
        sync: '15 min ago',
        completeness: '97.2%',
        accuracy: '99.1%',
        freshness: '95.5%',
        records: '820k',
      },
      insight: {
        bullets: [
          'Macroeconomic inflation pressure expected to squeeze raw material margin by Q3.',
          'Competitor X raised list prices by 5% on 12 overlapping SKUs.',
          'Potential margin hedge: $900k.',
        ],
      },
      outcomes: [
        'Dynamic Competitor Pricing',
        'Macroeconomic Hedging',
        'Local Weather Assortment',
        'Sentiment-driven Sourcing',
      ],
      flow: [
        { label: 'Market Intelligence', desc: 'External price indices and competitor catalogs ingested' },
        { label: 'Competitor Mapping', desc: 'Overlapping products indexed to internal SKUs' },
        { label: 'AI Price Elasticity', desc: 'Neural nets predict demand response to market shifts' },
        { label: 'Market Risk Score', desc: 'Portfolio items evaluated for inflation susceptibility' },
        { label: 'Recommendations', desc: 'Hedge Steel Inputs (Red), Match Competitor X Price (Green), Adjust Fuel Surcharges (Yellow)' },
      ],
    },
  };

  // Source-specific high fidelity data for Processing & Analysis (Step 2)
  const computeData = {
    process: {
      title: 'Process & Analysis Overview',
      subtitle: 'AI-powered analytics pipeline that converts data into business value',
      metrics: [
        { label: 'Data Processed', val: '2.4M', pct: '↑ 18.4%', icon: 'db' },
        { label: 'Models Executed', val: '28', pct: '↑ 12.5%', icon: 'cube' },
        { label: 'Insights Generated', val: '156', pct: '↑ 22.3%', icon: 'bulb' },
        { label: 'Recommendations', val: '42', pct: '↑ 15.4%', icon: 'target' },
        { label: 'Action Taken', val: '31', pct: '↑ 19.2%', icon: 'check' },
      ],
      processSteps: [
        { step: '1. Data Preparation', desc: 'Clean, validate and standardize data', badge: '2.4M records', icon: 'db' },
        { step: '2. Data Modeling', desc: 'Transform data into business models', badge: '18 models', icon: 'model' },
        { step: '3. AI / ML Analysis', desc: 'Run AI/ML models and algorithms', badge: '28 models run', icon: 'brain' },
        { step: '4. Metrics & KPIs', desc: 'Calculate KPIs and business metrics', badge: '64 KPIs', icon: 'kpi' },
        { step: '5. Insights & Output', desc: 'Generate insights and recommendations', badge: '156 insights', icon: 'bulb' },
      ],
      insights: [
        { text: '27 SKUs are driving 80% of total profit. Concentrate investments on these top SKUs.', badge: 'High Impact', badgeColor: 'text-red-400 border-red-500/20 bg-red-500/5', icon: 'trend' },
        { text: '15 SKUs have declining margin for 2 consecutive quarters. Review pricing and cost structure.', badge: 'Medium Impact', badgeColor: 'text-amber-400 border-amber-500/20 bg-amber-500/5', icon: 'alert' },
        { text: 'Premium Juice segment demand up 15% among enterprise customers. Opportunity to expand 3 SKUs.', badge: 'High Impact', badgeColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', icon: 'check' },
      ],
      models: [
        { name: 'Demand Forecasting', type: 'Time Series', acc: '95.2%', run: '3 min ago', status: 'Healthy' },
        { name: 'Profitability Scoring', type: 'Classification', acc: '91.7%', run: '6 min ago', status: 'Healthy' },
        { name: 'Churn Prediction', type: 'Classification', acc: '89.5%', run: '12 min ago', status: 'Healthy' },
        { name: 'Price Optimization', type: 'Regression', acc: '92.1%', run: '15 min ago', status: 'Healthy' },
        { name: 'Inventory Optimization', type: 'Optimization', acc: '93.8%', run: '20 min ago', status: 'Healthy' },
      ],
      kpis: [
        { label: 'Gross Margin %', val: '27.6%', change: '↑ 2.4pp' },
        { label: 'Portfolio ROI', val: '18.9%', change: '↑ 1.8pp' },
        { label: 'Fill Rate', val: '96.2%', change: '↑ 3.1pp' },
        { label: 'Inventory Turns', val: '6.4x', change: '↑ 0.7x' },
      ],
      recs: [
        { title: 'Discontinue SKU-142', desc: 'Low profitability and declining demand', impact: 'High', val: '$1.2M', color: 'text-red-400 border-red-500/15 bg-red-500/[0.02]' },
        { title: 'Expand SKU-217', desc: 'High growth and strong margin', impact: 'High', val: '$2.8M', color: 'text-emerald-400 border-emerald-500/15 bg-emerald-500/[0.02]' },
        { title: 'Optimize Price for SKU-089', desc: 'Price increase opportunity of 5-7%', impact: 'Medium', val: '$0.6M', color: 'text-amber-400 border-amber-500/15 bg-amber-500/[0.02]' },
      ],
      flow: [
        { label: 'Raw Data', desc: '2.4M records ingested' },
        { label: 'Process & Analyze', desc: '28 models executed, 64 KPIs calculated' },
        { label: 'AI Insights', desc: '156 insights generated' },
        { label: 'Recommendations', desc: '42 actionable recommendations' },
        { label: 'Business Impact', desc: '$4.6M potential value identified' },
      ],
    },
    vis: {
      title: 'Visualization & Reporting Overview',
      subtitle: 'Data dashboarding and alerts delivery infrastructure',
      metrics: [
        { label: 'Reports Generated', val: '240', pct: '↑ 8.5%', icon: 'db' },
        { label: 'Alerts Triggered', val: '45', pct: '↓ 12.1%', icon: 'cube' },
        { label: 'Active Users', val: '180', pct: '↑ 15.0%', icon: 'bulb' },
        { label: 'Dashboard Views', val: '1.2k', pct: '↑ 20.3%', icon: 'target' },
        { label: 'Delivery Rate', val: '100%', pct: '→ 0.0%', icon: 'check' },
      ],
      processSteps: [
        { step: '1. Data Aggregation', desc: 'Collect and bundle data points', badge: '12 sources', icon: 'db' },
        { step: '2. Chart Generation', desc: 'Compute visual vectors and trends', badge: '45 charts active', icon: 'model' },
        { step: '3. Dashboard Render', desc: 'Draw layout containers and frames', badge: '1.2s avg latency', icon: 'brain' },
        { step: '4. Alert Triggers', desc: 'Evaluate threshold violations', badge: '45 rules online', icon: 'kpi' },
        { step: '5. Export Outputs', desc: 'Distribute scheduled PDFs/reports', badge: '240 reports sent', icon: 'bulb' },
      ],
      insights: [
        { text: 'Regional APAC dashboard latency spike detected. Resolved via automated query caching.', badge: 'Resolved', badgeColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', icon: 'check' },
        { text: 'Margin alert delivered successfully to 12 executives with zero packet drop.', badge: 'Delivered', badgeColor: 'text-purple-400 border-purple-500/20 bg-purple-500/5', icon: 'trend' },
      ],
      models: [
        { name: 'Dashboard Rendering', type: 'UI Pipeline', acc: '99.9%', run: 'Real-time', status: 'Healthy' },
        { name: 'Report Generator', type: 'PDF Engine', acc: '100.0%', run: '10 min ago', status: 'Healthy' },
        { name: 'Email Dispatcher', type: 'SMTP Gateway', acc: '99.8%', run: '1 min ago', status: 'Healthy' },
      ],
      kpis: [
        { label: 'Report Speed', val: '2.1s', change: '↓ 0.4s' },
        { label: 'Daily Sessions', val: '412', change: '↑ 18%' },
        { label: 'Alert Accrual', val: '14/day', change: '↓ 3.2' },
        { label: 'Uptime', val: '99.98%', change: '↑ 0.02%' },
      ],
      recs: [
        { title: 'Optimize Index Caching', desc: 'Speed up product detail loading times', impact: 'Medium', val: '1.1s', color: 'text-amber-400 border-amber-500/15 bg-amber-500/[0.02]' },
        { title: 'Enable SMS Alerts', desc: 'Deploy urgent text dispatches to field managers', impact: 'High', val: '98%', color: 'text-purple-400 border-purple-500/15 bg-purple-500/[0.02]' },
      ],
      flow: [
        { label: 'Aggregation', desc: 'Raw views combined' },
        { label: 'Engine Render', desc: 'Vectors computed' },
        { label: 'Alert Check', desc: 'Threshold limits evaluated' },
        { label: 'Distribution', desc: 'Reports formatted and dispatched' },
        { label: 'User Action', desc: 'Stakeholders investigate alert panels' },
      ],
    },
    recs: {
      title: 'AI Recommendations Hub',
      subtitle: 'Evaluation and scoring engine for portfolio optimization actions',
      metrics: [
        { label: 'Total Recs', val: '42', pct: '↑ 15.4%', icon: 'db' },
        { label: 'Approved Actions', val: '18', pct: '↑ 20.0%', icon: 'cube' },
        { label: 'Rejected / Snoozed', val: '4', pct: '↓ 50.0%', icon: 'bulb' },
        { label: 'Value Realized', val: '$1.4M', pct: '↑ 32.1%', icon: 'target' },
        { label: 'Success Rate', val: '85.4%', pct: '↑ 4.2%', icon: 'check' },
      ],
      processSteps: [
        { step: '1. Insight Intake', desc: 'Aggregate variance and anomaly logs', badge: '156 inputs', icon: 'db' },
        { step: '2. Scenario Run', desc: 'Simulate pricing and volume swings', badge: '120 runs/hr', icon: 'model' },
        { step: '3. Constraint Check', desc: 'Run feasibility and safety bounds', badge: '6 rules active', icon: 'brain' },
        { step: '4. ROI Scoring', desc: 'Rank actions by financial returns', badge: '8 metrics scored', icon: 'kpi' },
        { step: '5. Action Output', desc: 'Publish final approved suggestions', badge: '42 active recs', icon: 'bulb' },
      ],
      insights: [
        { text: 'Recommended price increase on overlap SKUs matching competitor price shifts will secure $1.2M.', badge: 'High Impact', badgeColor: 'text-red-400 border-red-500/20 bg-red-500/5', icon: 'trend' },
        { text: 'Inventory consolidation recommendation for warehouse B approved by operations.', badge: 'Approved', badgeColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', icon: 'check' },
      ],
      models: [
        { name: 'ROI Predictor', type: 'Regressor', acc: '94.2%', run: '5 min ago', status: 'Healthy' },
        { name: 'Constraint Checker', type: 'Boolean Logic', acc: '100.0%', run: '1 min ago', status: 'Healthy' },
        { name: 'Scenario Simulator', type: 'Monte Carlo', acc: '91.8%', run: '30 min ago', status: 'Healthy' },
      ],
      kpis: [
        { label: 'Precision', val: '96.2%', change: '↑ 1.4pp' },
        { label: 'Value Score', val: '8.4/10', change: '↑ 0.5pt' },
        { label: 'Approval Speed', val: '45m', change: '↓ 12m' },
        { label: 'Implementation Rate', val: '42%', change: '↑ 8.0%' },
      ],
      recs: [
        { title: 'Trigger SKU Consolidation', desc: 'Consolidate 12 duplicate listings in category C', impact: 'High', val: '$0.4M', color: 'text-emerald-400 border-emerald-500/15 bg-emerald-500/[0.02]' },
        { title: 'Initiate Supplier Hedge', desc: 'Order bulk raw materials to lock in Q4 cost', impact: 'Medium', val: '$0.8M', color: 'text-amber-400 border-amber-500/15 bg-amber-500/[0.02]' },
      ],
      flow: [
        { label: 'Insight Input', desc: 'Margin leak details fed in' },
        { label: 'Simulation', desc: 'Market variations generated' },
        { label: 'Safety Check', desc: 'Supply constraints cross-checked' },
        { label: 'ROI Analysis', desc: 'Benefit vs cost ratios compiled' },
        { label: 'Decision output', desc: 'Recommendations populated' },
      ],
    },
    collab: {
      title: 'Collaboration & Workflow Control',
      subtitle: 'Task assignments and action approvals auditing',
      metrics: [
        { label: 'Pending Approvals', val: '6', pct: '↓ 22.0%', icon: 'db' },
        { label: 'Approved Actions', val: '12', pct: '↑ 15.0%', icon: 'cube' },
        { label: 'Escalated Tasks', val: '2', pct: '↓ 50.0%', icon: 'bulb' },
        { label: 'Actions Assigned', val: '24', pct: '↑ 12.0%', icon: 'target' },
        { label: 'Team Members', val: '8', pct: '→ 0.0%', icon: 'check' },
      ],
      processSteps: [
        { step: '1. Alert Assign', desc: 'Direct alert anomalies to operators', badge: 'Real-time', icon: 'db' },
        { step: '2. Action Draft', desc: 'Outline mitigations and pricing shifts', badge: 'Auto-draft active', icon: 'model' },
        { step: '3. Request Approval', desc: 'Notify team lead of pending action', badge: 'Slack/Mail ping', icon: 'brain' },
        { step: '4. Review Loop', desc: 'Modify pricing parameters or skip', badge: '1.2h SLA target', icon: 'kpi' },
        { step: '5. Executed Action', desc: 'Commit variables directly to ERP', badge: 'Write-back active', icon: 'bulb' },
      ],
      insights: [
        { text: 'SLA target breach probability reduced by 25% due to automated load balancing.', badge: 'High Impact', badgeColor: 'text-red-400 border-red-500/20 bg-red-500/5', icon: 'trend' },
        { text: 'Operator SLA response speed increased by 3.2x over the last 14 days.', badge: 'Opr Speed', badgeColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', icon: 'check' },
      ],
      models: [
        { name: 'SLA Predictor', type: 'Gradient Boost', acc: '89.1%', run: '15 min ago', status: 'Healthy' },
        { name: 'Auto Router', type: 'Heuristic', acc: '98.5%', run: 'Real-time', status: 'Healthy' },
      ],
      kpis: [
        { label: 'Avg Latency', val: '1.8 hrs', change: '↓ 0.6h' },
        { label: 'Escalation Rate', val: '8.3%', change: '↓ 4.1%' },
        { label: 'FTE Utilization', val: '88.5%', change: '↑ 12%' },
        { label: 'ERP Commit rate', val: '100%', change: '→ 0%' },
      ],
      recs: [
        { title: 'Re-route Pending SKU-142 Approval', desc: 'Escalate to VP after 4 hours of inactivity', impact: 'High', val: 'Urgent', color: 'text-red-400 border-red-500/15 bg-red-500/[0.02]' },
        { title: 'Archive Snoozed Alert B-12', desc: 'Clear dashboard clutter for resolved issue', impact: 'Low', val: 'Snoozed', color: 'text-zinc-500 border-zinc-800 bg-zinc-900/40' },
      ],
      flow: [
        { label: 'Alert Routing', desc: 'Task assigned to portfolio analyst' },
        { label: 'Proposal', desc: ' analyst drafts mitigation parameters' },
        { label: 'Review Request', desc: 'Manager notified of transaction proposal' },
        { label: 'Approval Commit', desc: 'Approval granted in workspace' },
        { label: 'ERP Writeback', desc: 'Changes executed in SAP S/4HANA' },
      ],
    },
    gov: {
      title: 'Data Quality & Governance Panel',
      subtitle: 'Compliance checking and self-cleansing system parameters',
      metrics: [
        { label: 'Compliance Index', val: '100%', pct: '→ 0.0%', icon: 'db' },
        { label: 'Anomaly Flags', val: '14', pct: '↓ 35.0%', icon: 'cube' },
        { label: 'Rules Active', val: '120', pct: '↑ 8.0%', icon: 'bulb' },
        { label: 'Cleansed Rows', val: '2.4M', pct: '↑ 18.4%', icon: 'target' },
        { label: 'Security Score', val: '99.8%', pct: '↑ 0.1%', icon: 'check' },
      ],
      processSteps: [
        { step: '1. Ingest Validate', desc: 'Scan schema layouts and formats', badge: '100% compliant', icon: 'db' },
        { step: '2. Anomaly Check', desc: 'Isolate extreme standard deviations', badge: '14 alerts active', icon: 'model' },
        { step: '3. Rule Run', desc: 'Execute validation logic and assertions', badge: '120 active rules', icon: 'brain' },
        { step: '4. Cleanse Pipeline', desc: 'Impute missing values and normalize', badge: '20ms avg delay', icon: 'kpi' },
        { step: '5. Governance Audit', desc: 'Compile lineage logs for reporting', badge: 'Audit logged', icon: 'bulb' },
      ],
      insights: [
        { text: 'Schema validation completed. Zero drift anomalies detected across all sources.', badge: 'Compliant', badgeColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', icon: 'check' },
        { text: 'Auto-cleansing rule resolved 11 null records in cost column during ingestion.', badge: 'Cleansed', badgeColor: 'text-purple-400 border-purple-500/20 bg-purple-500/5', icon: 'trend' },
      ],
      models: [
        { name: 'Drift Detector', type: 'Isolation Forest', acc: '97.5%', run: '1 hr ago', status: 'Healthy' },
        { name: 'Cleansing Engine', type: 'Heuristics', acc: '100.0%', run: 'Real-time', status: 'Healthy' },
        { name: 'Lineage Compiler', type: 'Meta Analyzer', acc: '99.9%', run: '12 hrs ago', status: 'Healthy' },
      ],
      kpis: [
        { label: 'Validation Lag', val: '14ms', change: '↓ 3ms' },
        { label: 'Data Quality Index', val: '98.5%', change: '↑ 1.2%' },
        { label: 'Lineage Depth', val: '18 hops', change: '↑ 2 hops' },
        { label: 'Privacy Index', val: '100%', change: '→ 0%' },
      ],
      recs: [
        { title: 'Re-index Database Schema', desc: 'Adjust primary keys for NetSuite connector', impact: 'Medium', val: '120ms', color: 'text-amber-400 border-amber-500/15 bg-amber-500/[0.02]' },
        { title: 'Update Cost Assert Rule', desc: 'Increase floor bounds on inventory value logs', impact: 'High', val: 'Rule 42', color: 'text-purple-400 border-purple-500/15 bg-purple-500/[0.02]' },
      ],
      flow: [
        { label: 'Validation Scan', desc: 'Ingestion records checked for schema compliance' },
        { label: 'Isolate Outliers', desc: 'Unusual variances marked for correction' },
        { label: 'Cleansing logic', desc: 'Imputations apply for minor omissions' },
        { label: 'Lineage Write', desc: 'Provenance chain logged to database' },
        { label: 'Audit report', desc: 'Logs published to executive portal' },
      ],
    },
  };

  // Source-specific high fidelity data for Diagnostic Output (Step 3)
  const diagnosticData = {
    diagnostic: {
      title: 'Diagnostic Output Overview',
      subtitle: 'Comprehensive diagnostics to detect issues, risks and opportunities.',
      metrics: [
        { label: 'Total Diagnostics Run', val: '134', pct: '↑ 18.3%', icon: 'diag' },
        { label: 'Issues Detected', val: '17', pct: '↑ 21.4%', icon: 'alert' },
        { label: 'High Impact Issues', val: '5', pct: '↑ 25%', icon: 'target' },
        { label: 'Opportunities Identified', val: '12', pct: '↑ 33.3%', icon: 'opportunity' },
        { label: 'Resolution Rate', val: '82%', pct: '↑ 12.6%', icon: 'check' },
      ],
      severity: {
        total: 17,
        breakdown: [
          { label: 'Critical', val: 5, pct: 29, color: 'bg-red-500', text: 'text-red-500' },
          { label: 'High', val: 7, pct: 41, color: 'bg-orange-500', text: 'text-orange-500' },
          { label: 'Medium', val: 3, pct: 18, color: 'bg-yellow-400', text: 'text-yellow-450' },
          { label: 'Low', val: 2, pct: 12, color: 'bg-emerald-500', text: 'text-emerald-400' },
        ],
      },
      categories: [
        { label: 'Margin Erosion', val: 6, pct: 35, bg: 'bg-red-500' },
        { label: 'Demand Risk', val: 4, pct: 24, bg: 'bg-orange-500' },
        { label: 'Supply Chain', val: 3, pct: 18, bg: 'bg-yellow-450' },
        { label: 'Price & Mix', val: 2, pct: 12, bg: 'bg-emerald-500' },
        { label: 'Data Quality', val: 2, pct: 12, bg: 'bg-blue-500' },
      ],
      issues: [
        { name: 'Declining margin in 15 SKUs', desc: 'Margin erosion detected for SKUs in Energy Drink category', sev: 'Critical', sevColor: 'text-red-400 border-red-500/20 bg-red-500/5', impact: '$1.2M', time: '5 min ago', status: 'Open', statusColor: 'text-red-400' },
        { name: 'High inventory risk for 8 SKUs', desc: 'Inventory days > 90 days', sev: 'High', sevColor: 'text-orange-400 border-orange-500/20 bg-orange-500/5', impact: '$780K', time: '15 min ago', status: 'Open', statusColor: 'text-red-400' },
        { name: 'Demand drop in 3 regions', desc: 'Co2 demand decline > 20%', sev: 'High', sevColor: 'text-orange-400 border-orange-500/20 bg-orange-500/5', impact: '$560K', time: '30 min ago', status: 'Open', statusColor: 'text-red-400' },
        { name: 'Stockout risk in 2 SKUs', desc: 'Projected stockout in next 14 days', sev: 'Medium', sevColor: 'text-yellow-450 border-yellow-500/20 bg-yellow-500/5', impact: '$320K', time: '45 min ago', status: 'Investigating', statusColor: 'text-sky-400' },
        { name: 'Data quality issue in sales data', desc: 'Missing values in key fields', sev: 'Low', sevColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', impact: '-', time: '1 hour ago', status: 'Resolved', statusColor: 'text-emerald-400' },
      ],
      impacts: [
        { label: 'Financial Impact', val: '$2.8M', tag: 'High', tagColor: 'text-red-400 border-red-500/20 bg-red-500/5', desc: 'Potential impact on profitability', icon: 'gear' },
        { label: 'Revenue Impact', val: '$4.1M', tag: 'High', tagColor: 'text-red-400 border-red-500/20 bg-red-500/5', desc: 'At risk revenue over next 90 days', icon: 'list' },
        { label: 'Customer Impact', val: 'Medium', tag: 'Medium', tagColor: 'text-amber-400 border-amber-500/20 bg-amber-500/5', desc: 'At risk customer satisfaction', icon: 'user' },
      ],
      recs: [
        { title: 'Optimize Pricing for 15 SKUs', tag: 'High Impact', tagColor: 'text-red-400 border-red-500/20 bg-red-500/5', desc: 'Increase price by 3-5% to recover margin.', val: '$1.2M', conf: 92 },
        { title: 'Rationalize 8 Low Performing SKUs', tag: 'High Impact', tagColor: 'text-red-400 border-red-500/20 bg-red-500/5', desc: 'Discontinue or consolidate low margin SKUs.', val: '$780K', conf: 88 },
        { title: 'Reduce Inventory in 3 Categories', tag: 'Medium Impact', tagColor: 'text-amber-450 border-amber-500/20 bg-amber-500/5', desc: 'Run targeted promotions to reduce inventory days.', val: '$430K', conf: 75 },
        { title: 'Improve Forecasting Accuracy', tag: 'Medium Impact', tagColor: 'text-amber-455 border-amber-500/20 bg-amber-500/5', desc: 'Enhance demand forecasting for at-risk regions.', val: '$320K', conf: 70 },
      ],
    },
    root: {
      title: 'Root Cause Analysis Overview',
      subtitle: 'Drill down to root factors influencing portfolio performance leaks',
      metrics: [
        { label: 'Causes Identified', val: '24', pct: '↑ 12.0%', icon: 'diag' },
        { label: 'Core Factors', val: '3', pct: '→ 0.0%', icon: 'alert' },
        { label: 'Diagnostic Depth', val: '92%', pct: '↑ 5.1%', icon: 'target' },
        { label: 'Resolved Factors', val: '14', pct: '↑ 18.0%', icon: 'opportunity' },
        { label: 'Auto-Correlations', val: '180', pct: '↑ 24.2%', icon: 'check' },
      ],
      severity: {
        total: 24,
        breakdown: [
          { label: 'Critical', val: 8, pct: 33, color: 'bg-red-500', text: 'text-red-500' },
          { label: 'High', val: 10, pct: 42, color: 'bg-orange-500', text: 'text-orange-500' },
          { label: 'Medium', val: 4, pct: 17, color: 'bg-yellow-400', text: 'text-yellow-450' },
          { label: 'Low', val: 2, pct: 8, color: 'bg-emerald-500', text: 'text-emerald-400' },
        ],
      },
      categories: [
        { label: 'Material Cost inflation', val: 10, pct: 42, bg: 'bg-red-500' },
        { label: 'Supplier Delay', val: 6, pct: 25, bg: 'bg-orange-500' },
        { label: 'Promotional Overspend', val: 4, pct: 17, bg: 'bg-yellow-450' },
        { label: 'Labor shortage', val: 2, pct: 8, bg: 'bg-emerald-500' },
        { label: 'Logistics fees', val: 2, pct: 8, bg: 'bg-blue-500' },
      ],
      issues: [
        { name: 'Supplier Price Surge', desc: 'Raw packaging cost increased by 14% at source', sev: 'Critical', sevColor: 'text-red-400 border-red-500/20 bg-red-500/5', impact: '$820k', time: '10 min ago', status: 'Open', statusColor: 'text-red-400' },
        { name: 'Out-of-Stock on base bottles', desc: 'Supplier A delayed freight container delivery', sev: 'High', sevColor: 'text-orange-400 border-orange-500/20 bg-orange-500/5', impact: '$450k', time: '20 min ago', status: 'Open', statusColor: 'text-red-400' },
        { name: 'Trade spend variance', desc: 'Promotional discounts exceeded margin limits in West', sev: 'High', sevColor: 'text-orange-400 border-orange-500/20 bg-orange-500/5', impact: '$320k', time: '35 min ago', status: 'Open', statusColor: 'text-red-400' },
      ],
      impacts: [
        { label: 'Cost Index Delta', val: '+14%', tag: 'High', tagColor: 'text-red-400 border-red-500/20 bg-red-500/5', desc: 'Net impact on COGS baseline', icon: 'gear' },
        { label: 'Revenue Leakage', val: '$1.8M', tag: 'High', tagColor: 'text-red-400 border-red-500/20 bg-red-500/5', desc: 'At risk turnover from logistics lag', icon: 'list' },
        { label: 'Sourcing Risk', val: 'Medium', tag: 'Medium', tagColor: 'text-amber-400 border-amber-500/20 bg-amber-500/5', desc: 'Vendor delivery confidence decline', icon: 'user' },
      ],
      recs: [
        { title: 'Source alternate cap supplier', tag: 'High Impact', tagColor: 'text-red-400 border-red-500/20 bg-red-500/5', desc: 'Onboard pre-approved vendor B to hedge rates.', val: '$450K', conf: 90 },
        { title: 'Re-negotiate raw pricing contracts', tag: 'Medium Impact', tagColor: 'text-amber-450 border-amber-500/20 bg-amber-500/5', desc: 'Contract bulk raw materials to lock in Q4 cost.', val: '$800K', conf: 82 },
      ],
    },
    impact: {
      title: 'Impact Assessment Panel',
      subtitle: 'Quantify the financial, operational and customer impacts of anomalies',
      metrics: [
        { label: 'Financial Impact', val: '$2.8M', pct: '↑ 20.2%', icon: 'diag' },
        { label: 'Revenue Risk', val: '$4.1M', pct: '↑ 18.0%', icon: 'alert' },
        { label: 'Customer NPS impact', val: '-8 pts', pct: '↓ 50%', icon: 'target' },
        { label: 'EBITDA Pressure', val: '0.4%', pct: '↑ 12.0%', icon: 'opportunity' },
        { label: 'Supply Shock Index', val: 'Medium', pct: '→ 0%', icon: 'check' },
      ],
      severity: {
        total: 12,
        breakdown: [
          { label: 'Critical', val: 4, pct: 33, color: 'bg-red-500', text: 'text-red-500' },
          { label: 'High', val: 5, pct: 42, color: 'bg-orange-500', text: 'text-orange-500' },
          { label: 'Medium', val: 2, pct: 17, color: 'bg-yellow-400', text: 'text-yellow-450' },
          { label: 'Low', val: 1, pct: 8, color: 'bg-emerald-500', text: 'text-emerald-400' },
        ],
      },
      categories: [
        { label: 'Margin Erosion', val: 5, pct: 42, bg: 'bg-red-500' },
        { label: 'Demand Risk', val: 3, pct: 25, bg: 'bg-orange-500' },
        { label: 'Supply Chain', val: 2, pct: 17, bg: 'bg-yellow-450' },
        { label: 'Price & Mix', val: 1, pct: 8, bg: 'bg-emerald-500' },
        { label: 'Data Quality', val: 1, pct: 8, bg: 'bg-blue-500' },
      ],
      issues: [
        { name: 'Margin leak in Energy segment', desc: 'COGS inflation overpassing wholesale adjustments', sev: 'Critical', sevColor: 'text-red-400 border-red-500/20 bg-red-500/5', impact: '$1.2M', time: '5 min ago', status: 'Open', statusColor: 'text-red-400' },
        { name: 'Lead time penalty at Retailer A', desc: 'Late shipping charges accrued from warehouse dispatch', sev: 'High', sevColor: 'text-orange-400 border-orange-500/20 bg-orange-500/5', impact: '$220k', time: '30 min ago', status: 'Open', statusColor: 'text-red-400' },
      ],
      impacts: [
        { label: 'Financial Impact', val: '$2.8M', tag: 'High', tagColor: 'text-red-400 border-red-500/20 bg-red-500/5', desc: 'Net profit impact across portfolio', icon: 'gear' },
        { label: 'Revenue Impact', val: '$4.1M', tag: 'High', tagColor: 'text-red-400 border-red-500/20 bg-red-500/5', desc: 'Gross revenue at risk next 90 days', icon: 'list' },
        { label: 'Customer Impact', val: 'Medium', tag: 'Medium', tagColor: 'text-amber-400 border-amber-500/20 bg-amber-500/5', desc: 'Order fill rate SLA pressure', icon: 'user' },
      ],
      recs: [
        { title: 'Re-align pricing tier levels', tag: 'High Impact', tagColor: 'text-red-400 border-red-500/20 bg-red-500/5', desc: 'Deploy dynamic price adjustment schedules.', val: '$1.2M', conf: 92 },
        { title: 'Consolidate LTL shipments', tag: 'Medium Impact', tagColor: 'text-amber-450 border-amber-500/20 bg-amber-500/5', desc: 'Utilize dedicated freight lanes to bypass delays.', val: '$180K', conf: 76 },
      ],
    },
    scenario: {
      title: 'Scenario Simulation Workspace',
      subtitle: 'Simulate price variations, supply delays and demand shocks to predict outcomes',
      metrics: [
        { label: 'Simulations Run', val: '420', pct: '↑ 14.5%', icon: 'diag' },
        { label: 'Convergence Rate', val: '99.8%', pct: '↑ 0.1%', icon: 'alert' },
        { label: 'Confidence Interval', val: '95%', pct: '→ 0.0%', icon: 'target' },
        { label: 'Best Case ROI', val: '+$1.8M', pct: '↑ 10.0%', icon: 'opportunity' },
        { label: 'Worst Case Risk', val: '-$800k', pct: '↓ 15.0%', icon: 'check' },
      ],
      severity: {
        total: 8,
        breakdown: [
          { label: 'Critical', val: 2, pct: 25, color: 'bg-red-500', text: 'text-red-500' },
          { label: 'High', val: 3, pct: 37, color: 'bg-orange-500', text: 'text-orange-500' },
          { label: 'Medium', val: 2, pct: 25, color: 'bg-yellow-400', text: 'text-yellow-450' },
          { label: 'Low', val: 1, pct: 13, color: 'bg-emerald-500', text: 'text-emerald-400' },
        ],
      },
      categories: [
        { label: 'Price Elasticity Shifts', val: 3, pct: 37, bg: 'bg-red-500' },
        { label: 'Supplier Delays', val: 2, pct: 25, bg: 'bg-orange-500' },
        { label: 'Promotion Swings', val: 2, pct: 25, bg: 'bg-yellow-450' },
        { label: 'Logistics Hikes', val: 1, pct: 13, bg: 'bg-emerald-500' },
      ],
      issues: [
        { name: '10% Price Increase Run', desc: 'Predict response to price increases in beverage lines', sev: 'High', sevColor: 'text-orange-400 border-orange-500/20 bg-orange-500/5', impact: '+$840k', time: '1 hr ago', status: 'Completed', statusColor: 'text-emerald-400' },
        { name: 'Supplier lockout simulation', desc: 'Predict impact of 14-day glass supply block', sev: 'Critical', sevColor: 'text-red-400 border-red-500/20 bg-red-500/5', impact: '-$620k', time: '2 hrs ago', status: 'Completed', statusColor: 'text-emerald-400' },
      ],
      impacts: [
        { label: 'Projected Net ROI', val: '+$1.2M', tag: 'High', tagColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: 'Weighted average simulated outcome', icon: 'gear' },
        { label: 'Volume variance', val: '-3.2%', tag: 'Medium', tagColor: 'text-amber-400 border-amber-500/20 bg-amber-500/5', desc: 'Simulated customer demand decrease', icon: 'list' },
        { label: 'SLA Risk', val: 'Low', tag: 'Low', tagColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: 'Out-of-stock probability index', icon: 'user' },
      ],
      recs: [
        { title: 'Proceed with 4% price increase', tag: 'High Impact', tagColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: 'Increases revenue without significant volume impact.', val: '$1.2M', conf: 92 },
        { title: 'Increase safety stock of glass bottles', tag: 'Medium Impact', tagColor: 'text-amber-450 border-amber-500/20 bg-amber-500/5', desc: 'Add 14 days of inventory buffers at facility A.', val: '$450K', conf: 85 },
      ],
    },
    alerts: {
      title: 'Alerts & Anomalies Log',
      subtitle: 'Real-time threshold violation logs and pattern detections',
      metrics: [
        { label: 'Alerts Active', val: '17', pct: '↑ 21.4%', icon: 'diag' },
        { label: 'Auto Cleansed', val: '85', pct: '↑ 32.1%', icon: 'alert' },
        { label: 'Mean Time to Detect', val: '14s', pct: '↓ 20.0%', icon: 'target' },
        { label: 'False Positives', val: '0.2%', pct: '↓ 50.0%', icon: 'opportunity' },
        { label: 'Active Rules', val: '420', pct: '↑ 8.0%', icon: 'check' },
      ],
      severity: {
        total: 17,
        breakdown: [
          { label: 'Critical', val: 5, pct: 29, color: 'bg-red-500', text: 'text-red-500' },
          { label: 'High', val: 7, pct: 41, color: 'bg-orange-500', text: 'text-orange-500' },
          { label: 'Medium', val: 3, pct: 18, color: 'bg-yellow-400', text: 'text-yellow-450' },
          { label: 'Low', val: 2, pct: 12, color: 'bg-emerald-500', text: 'text-emerald-400' },
        ],
      },
      categories: [
        { label: 'Margin Variance', val: 6, pct: 35, bg: 'bg-red-500' },
        { label: 'Inventory Outliers', val: 4, pct: 24, bg: 'bg-orange-500' },
        { label: 'Demand Drops', val: 3, pct: 18, bg: 'bg-yellow-450' },
        { label: 'Price deviations', val: 2, pct: 12, bg: 'bg-emerald-500' },
        { label: 'Null Ingestion logs', val: 2, pct: 12, bg: 'bg-blue-500' },
      ],
      issues: [
        { name: 'Critical cost overrun in Line A', desc: 'Manufacturing unit price exceeded rule limit by 18%', sev: 'Critical', sevColor: 'text-red-400 border-red-500/20 bg-red-500/5', impact: '$320k', time: '12 min ago', status: 'Open', statusColor: 'text-red-400' },
        { name: 'Retailer A return spike', desc: 'Return logs for beverage cases exceeding weekly ceiling', sev: 'High', sevColor: 'text-orange-400 border-orange-500/20 bg-orange-500/5', impact: '$120k', time: '24 min ago', status: 'Open', statusColor: 'text-red-400' },
      ],
      impacts: [
        { label: 'Anomaly Count', val: '17 active', tag: 'High', tagColor: 'text-red-400 border-red-500/20 bg-red-500/5', desc: 'Outstanding active flags', icon: 'gear' },
        { label: 'Detection Speed', val: '14 seconds', tag: 'High', tagColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: 'Mean detection cycle', icon: 'list' },
        { label: 'FNR rate', val: '0.04%', tag: 'Low', tagColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: 'False negative rate index', icon: 'user' },
      ],
      recs: [
        { title: 'Investigate Line A pump values', tag: 'High Impact', tagColor: 'text-red-400 border-red-500/20 bg-red-500/5', desc: 'Verify physical unit variables for telemetry calibration.', val: 'Inspect', conf: 95 },
        { title: 'Update return alert threshold', tag: 'Low Impact', tagColor: 'text-zinc-500 border-zinc-800 bg-zinc-900/40', desc: 'Increase floor limits by 5% during seasonal peaks.', val: 'Rule 18', conf: 99 },
      ],
    },
    recs: {
      title: 'Diagnostic Recommendations Panel',
      subtitle: 'Suggested actions compiled directly from active issues and root cause analysis',
      metrics: [
        { label: 'Recs online', val: '28', pct: '↑ 12.0%', icon: 'diag' },
        { label: 'Approved Actions', val: '12', pct: '↑ 15.0%', icon: 'alert' },
        { label: 'Snoozed / Skipped', val: '4', pct: '↓ 50.0%', icon: 'target' },
        { label: 'Realized Gains', val: '$850k', pct: '↑ 42.1%', icon: 'opportunity' },
        { label: 'Confidence factor', val: '88%', pct: '↑ 2.1%', icon: 'check' },
      ],
      severity: {
        total: 28,
        breakdown: [
          { label: 'Critical', val: 8, pct: 28, color: 'bg-red-500', text: 'text-red-500' },
          { label: 'High', val: 12, pct: 43, color: 'bg-orange-500', text: 'text-orange-500' },
          { label: 'Medium', val: 5, pct: 18, color: 'bg-yellow-400', text: 'text-yellow-450' },
          { label: 'Low', val: 3, pct: 11, color: 'bg-emerald-500', text: 'text-emerald-400' },
        ],
      },
      categories: [
        { label: 'Price Optimizations', val: 12, pct: 43, bg: 'bg-red-500' },
        { label: 'SKU rationalizations', val: 8, pct: 28, bg: 'bg-orange-500' },
        { label: 'Inventory Promos', val: 5, pct: 18, bg: 'bg-yellow-450' },
        { label: 'Forecasting tuning', val: 3, pct: 11, bg: 'bg-emerald-500' },
      ],
      issues: [
        { name: 'Pricing adjustment for overlap SKU', desc: 'Align prices with competitor changes in segment B', sev: 'High', sevColor: 'text-orange-400 border-orange-500/20 bg-orange-500/5', impact: '$1.2M', time: '1 hr ago', status: 'Pending', statusColor: 'text-amber-500' },
        { name: 'Fringe SKU sunset action', desc: 'Discontinue 4 lowest performing SKUs in category D', sev: 'High', sevColor: 'text-orange-400 border-orange-500/20 bg-orange-500/5', impact: '$450K', time: '2 hrs ago', status: 'Pending', statusColor: 'text-amber-500' },
      ],
      impacts: [
        { label: 'Average Return Index', val: '+8.4%', tag: 'High', tagColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: 'Simulated portfolio ROI recovery rate', icon: 'gear' },
        { label: 'Realized Gains', val: '$850k', tag: 'High', tagColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: 'Gains confirmed from committed actions', icon: 'list' },
        { label: 'Implementation SLA', val: '3 hrs', tag: 'Medium', tagColor: 'text-amber-400 border-amber-500/20 bg-amber-500/5', desc: 'Average time from approval to ERP writeback', icon: 'user' },
      ],
      recs: [
        { title: 'Confirm overlap pricing change', tag: 'High Impact', tagColor: 'text-red-400 border-red-500/20 bg-red-500/5', desc: 'Submit approved pricing variables to ERP database.', val: '$1.2M', conf: 92 },
        { title: 'Archive duplicate products', tag: 'Medium Impact', tagColor: 'text-amber-450 border-amber-500/20 bg-amber-500/5', desc: 'Consolidate 3 listings to clean category B.', val: '$220K', conf: 84 },
      ],
    },
  };

  const currentTab = tabData[activeSourceTab];
  const currentCompute = computeData[activeComputeTab];
  const currentDiagnostic = diagnosticData[activeDiagnosticTab];

  return (
    <div className={`fixed inset-0 backdrop-blur-md z-[120] flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'bg-black/85' : 'bg-slate-900/40'}`}>
      <div className={`w-full max-w-5xl p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col gap-5 text-xs max-h-[95vh] overflow-y-auto font-sans animate-fade-in bg-[#121218] border border-purple-500/15 text-zinc-300 ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fadeIn 0.2s ease-out forwards;
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 12s linear infinite;
          }

          /* Light Mode Custom Styling Overrides */
          .light-mode.bg-\\[\\#121218\\], .light-mode .bg-\\[\\#121218\\] { background-color: #ffffff !important; }
          .light-mode.text-zinc-300, .light-mode .text-zinc-300 { color: #374151 !important; }
          .light-mode.border-purple-500\\/15, .light-mode .border-purple-500\\/15 { border-color: rgba(147, 51, 234, 0.25) !important; }

          .light-mode .bg-\\[\\#16151c\\] { background-color: #f9fafb !important; }
          .light-mode .bg-\\[\\#1a1921\\] { background-color: #f3f4f6 !important; }
          .light-mode .bg-\\[\\#1e1c26\\] { background-color: #f5f3ff !important; border-color: #c084fc !important; }
          .light-mode .bg-\\[\\#25183a\\]\\/65 { background-color: rgba(243, 232, 255, 0.65) !important; }
          .light-mode .bg-\\[\\#0f0e13\\] { background-color: #f9fafb !important; }
          .light-mode .bg-\\[\\#0a0a0f\\] { background-color: #f3f4f6 !important; }
          .light-mode .bg-\\[\\#0b0a0f\\] { background-color: #f9fafb !important; }
          .light-mode .bg-\\[\\#0d0d12\\] { background-color: #f9fafb !important; }
          .light-mode .bg-\\[\\#0d0d12\\]\\/30 { background-color: rgba(243, 244, 246, 0.3) !important; }
          .light-mode .bg-\\[\\#121217\\] { background-color: #ffffff !important; }
          .light-mode .bg-\\[\\#171720\\] { background-color: #ffffff !important; }
          .light-mode .bg-\\[\\#181822\\] { background-color: #ffffff !important; }
          .light-mode .bg-\\[\\#120d20\\] { background-color: #f5f3ff !important; }
          
          .light-mode .bg-zinc-800 { background-color: #f3f4f6 !important; }
          .light-mode .bg-zinc-900 { background-color: #e5e7eb !important; }
          .light-mode .bg-zinc-900\\/30 { background-color: rgba(229, 231, 235, 0.3) !important; }
          .light-mode .bg-zinc-900\\/40 { background-color: rgba(229, 231, 235, 0.4) !important; }
          .light-mode .bg-zinc-900\\/50 { background-color: rgba(229, 231, 235, 0.5) !important; }
          .light-mode .bg-zinc-950\\/20 { background-color: rgba(209, 213, 219, 0.2) !important; }
          .light-mode .bg-zinc-950\\/30 { background-color: rgba(209, 213, 219, 0.3) !important; }

          .light-mode .hover\\:bg-\\[\\#1a1921\\]:hover { background-color: #e5e7eb !important; }
          .light-mode .hover\\:bg-\\[\\#7c3aed\\]:hover { background-color: #6d28d9 !important; }
          .light-mode .hover\\:bg-zinc-800:hover { background-color: #e5e7eb !important; }
          .light-mode .hover\\:bg-zinc-900:hover { background-color: #e5e7eb !important; }
          .light-mode .hover\\:bg-zinc-900\\/30:hover { background-color: rgba(229, 231, 235, 0.3) !important; }

          .light-mode .text-white { color: #111827 !important; }
          .light-mode .text-zinc-200 { color: #1f2937 !important; }
          .light-mode .text-zinc-350 { color: #4b5563 !important; }
          .light-mode .text-zinc-400 { color: #4b5563 !important; }
          .light-mode .text-zinc-450 { color: #4b5563 !important; }
          .light-mode .text-zinc-455 { color: #4b5563 !important; }
          .light-mode .text-zinc-500 { color: #6b7280 !important; }
          .light-mode .text-zinc-550 { color: #6b7280 !important; }
          .light-mode .text-zinc-600 { color: #6b7280 !important; }
          .light-mode .text-zinc-650 { color: #6b7280 !important; }
          .light-mode .text-zinc-700 { color: #374151 !important; }
          .light-mode .text-zinc-800 { color: #9ca3af !important; }
          .light-mode .text-zinc-900 { color: #111827 !important; }

          .light-mode .text-purple-200 { color: #6d28d9 !important; }
          .light-mode .text-purple-300 { color: #5b21b6 !important; }
          .light-mode .text-purple-400 { color: #7c3aed !important; }
          .light-mode .text-purple-400\\/80 { color: rgba(124, 58, 237, 0.8) !important; }
          .light-mode .text-purple-500 { color: #6d28d9 !important; }
          .light-mode .text-purple-500\\/80 { color: rgba(109, 40, 217, 0.8) !important; }

          .light-mode .hover\\:text-white:hover { color: #111827 !important; }
          .light-mode .hover\\:text-zinc-200:hover { color: #1f2937 !important; }

          .light-mode .border-zinc-700 { border-color: #d1d5db !important; }
          .light-mode .border-zinc-750 { border-color: #e5e7eb !important; }
          .light-mode .border-zinc-800 { border-color: #e5e7eb !important; }
          .light-mode .border-zinc-800\\/40 { border-color: rgba(229, 231, 235, 0.4) !important; }
          .light-mode .border-zinc-800\\/80 { border-color: rgba(229, 231, 235, 0.8) !important; }
          .light-mode .border-zinc-900 { border-color: #e5e7eb !important; }
          .light-mode .border-zinc-900\\/40 { border-color: rgba(229, 231, 235, 0.4) !important; }
          .light-mode .border-zinc-900\\/50 { border-color: rgba(229, 231, 235, 0.5) !important; }
          .light-mode .border-zinc-900\\/60 { border-color: rgba(229, 231, 235, 0.6) !important; }
          .light-mode .border-zinc-900\\/80 { border-color: rgba(229, 231, 235, 0.8) !important; }
          .light-mode .border-purple-500\\/10 { border-color: rgba(168, 85, 247, 0.2) !important; }
          .light-mode .border-purple-500\\/15 { border-color: rgba(168, 85, 247, 0.25) !important; }
          .light-mode .border-purple-500\\/20 { border-color: rgba(168, 85, 247, 0.3) !important; }
          .light-mode .border-purple-500\\/25 { border-color: rgba(168, 85, 247, 0.35) !important; }
          .light-mode .border-purple-500\\/30 { border-color: rgba(168, 85, 247, 0.4) !important; }
          .light-mode .border-purple-500\\/35 { border-color: rgba(168, 85, 247, 0.45) !important; }
          .light-mode .border-purple-500\\/80 { border-color: rgba(168, 85, 247, 0.8) !important; }
          .light-mode .border-purple-500 { border-color: #8b5cf6 !important; }

          .light-mode .hover\\:border-purple-500\\/35:hover { border-color: rgba(168, 85, 247, 0.5) !important; }
          .light-mode .hover\\:border-zinc-700:hover { border-color: #9ca3af !important; }
          .light-mode .hover\\:border-zinc-750:hover { border-color: #d1d5db !important; }

          .light-mode .divide-zinc-900\\/40 > * + * { border-color: rgba(229, 231, 235, 0.5) !important; }
        `}</style>

        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3.5">
          <div className="space-y-0.5">
            <h2 className="text-[13px] font-bold tracking-wider uppercase text-white font-mono">
              Acies AgenticBus • Swarm Diagnostic Flowchart
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[7.5px] font-sans font-black bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded border border-purple-500/20 uppercase tracking-widest">
              Workflow View
            </span>
            <button 
              type="button"
              onClick={onClose}
              className="p-1 rounded cursor-pointer border-none bg-transparent outline-none transition-colors hover:bg-zinc-800 text-zinc-500 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* GENERAL FLOWCHART SECTION */}
        <div className="space-y-4">
          <h3 className="text-[8.5px] uppercase tracking-widest text-zinc-500 font-extrabold font-mono">General Flowchart</h3>
          
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-3 w-full">
            
            {/* Step 1 Card: Data Ingestion */}
            <div 
              onClick={() => setActiveStepIndex(0)}
              className={`flex-1 border p-4.5 rounded-xl flex flex-col gap-3.5 cursor-pointer transition-all duration-200 select-none ${
                activeStepIndex === 0 
                  ? 'border-purple-500 bg-[#1e1c26] shadow-[0_0_20px_rgba(168,85,247,0.18)]' 
                  : 'border-zinc-800/80 bg-[#16151c] hover:border-purple-500/35 hover:bg-[#1a1921]'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center gap-1.5 border border-purple-500/30 bg-[#25183a]/65 px-2.5 py-1 rounded text-[8.5px] font-black uppercase text-purple-300 w-fit select-none">
                <svg className="w-2.5 h-2.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22c5.523 0 10-2.239 10-5s-4.477-5-10-5-10 2.239-10 5 4.477 5 10 5Z" />
                  <path d="M22 12c0 2.761-4.477 5-10 5S2 14.761 2 12" />
                  <path d="M22 7c0 2.761-4.477 5-10 5S2 9.761 2 7" />
                </svg>
                <span>Ingest</span>
              </div>
              
              {/* Heading */}
              <h4 className="font-bold text-[14px] text-white tracking-wide">Data Ingestion</h4>
              
              {/* 2x2 Sub-items */}
              <div className="grid grid-cols-2 gap-2 mt-0.5">
                <div className="bg-[#0f0e13] border border-zinc-900/60 p-2.5 rounded-lg flex flex-col justify-between items-start min-h-[60px]">
                  <svg className="text-purple-400 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span className="text-[9.5px] font-bold text-zinc-300">Finance & Ops</span>
                </div>
                <div className="bg-[#0f0e13] border border-zinc-900/60 p-2.5 rounded-lg flex flex-col justify-between items-start min-h-[60px]">
                  <svg className="text-purple-400 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="8" x="2" y="3" rx="2" />
                    <rect width="20" height="8" x="2" y="13" rx="2" />
                    <line x1="6" y1="7" x2="6.01" y2="7" />
                    <line x1="6" y1="17" x2="6.01" y2="17" />
                  </svg>
                  <span className="text-[9.5px] font-bold text-zinc-300">CRM / ERP</span>
                </div>
                <div className="bg-[#0f0e13] border border-zinc-900/60 p-2.5 rounded-lg flex flex-col justify-between items-start min-h-[60px]">
                  <svg className="text-purple-400 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20" />
                    <path d="M17 5H7" />
                    <path d="M19 9H5" />
                    <path d="M15 13H9" />
                  </svg>
                  <span className="text-[9.5px] font-bold text-zinc-300">IoT feeds</span>
                </div>
                <div className="bg-[#0f0e13] border border-zinc-900/60 p-2.5 rounded-lg flex flex-col justify-between items-start min-h-[60px]">
                  <div className="h-4 flex items-center">
                    <span className="text-[7.5px] font-mono font-black text-purple-400 uppercase tracking-wider bg-purple-500/10 px-1 py-0.2 rounded border border-purple-500/20">API</span>
                  </div>
                  <span className="text-[9.5px] font-bold text-zinc-300">External APIs</span>
                </div>
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:flex flex-shrink-0 text-zinc-700 select-none items-center justify-center px-1">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Step 2 Card: Processing & Analysis */}
            <div 
              onClick={() => setActiveStepIndex(1)}
              className={`flex-1 border p-4.5 rounded-xl flex flex-col gap-3.5 cursor-pointer transition-all duration-200 select-none ${
                activeStepIndex === 1 
                  ? 'border-purple-500 bg-[#1e1c26] shadow-[0_0_20px_rgba(168,85,247,0.18)]' 
                  : 'border-zinc-800/80 bg-[#16151c] hover:border-purple-500/35 hover:bg-[#1a1921]'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center gap-1.5 border border-purple-500/30 bg-[#25183a]/65 px-2.5 py-1 rounded text-[8.5px] font-black uppercase text-purple-300 w-fit select-none">
                <svg className="w-2.5 h-2.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" rx="1" />
                  <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
                </svg>
                <span>Compute</span>
              </div>
              
              {/* Heading */}
              <h4 className="font-bold text-[14px] text-white tracking-wide">Processing & Analysis</h4>
              
              {/* 2x2 Sub-items */}
              <div className="grid grid-cols-2 gap-2 mt-0.5">
                <div className="bg-[#0f0e13] border border-zinc-900/60 p-2.5 rounded-lg flex flex-col justify-between items-start min-h-[60px]">
                  <span className="text-[11px] font-serif italic font-bold text-purple-400 leading-none">f<sub>x</sub></span>
                  <span className="text-[9.5px] font-bold text-zinc-300">KPI formulas</span>
                </div>
                <div className="bg-[#0f0e13] border border-zinc-900/60 p-2.5 rounded-lg flex flex-col justify-between items-start min-h-[60px]">
                  <svg className="text-purple-400 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14" />
                    <line x1="4" y1="10" x2="4" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12" y2="3" />
                    <line x1="20" y1="21" x2="20" y2="16" />
                    <line x1="20" y1="12" x2="20" y2="3" />
                    <line x1="2" y1="14" x2="6" y2="14" />
                    <line x1="10" y1="8" x2="14" y2="8" />
                    <line x1="18" y1="16" x2="22" y2="16" />
                  </svg>
                  <span className="text-[9.5px] font-bold text-zinc-300">Thresholds</span>
                </div>
                <div className="bg-[#0f0e13] border border-zinc-900/60 p-2.5 rounded-lg flex flex-col justify-between items-start min-h-[60px]">
                  <svg className="text-purple-400 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 17c3-1 6-8 9-8s6 7 9 8" />
                  </svg>
                  <span className="text-[9.5px] font-bold text-zinc-300">Anomalies</span>
                </div>
                <div className="bg-[#0f0e13] border border-zinc-900/60 p-2.5 rounded-lg flex flex-col justify-between items-start min-h-[60px]">
                  <svg className="text-purple-400 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="6" r="3" />
                    <circle cx="18" cy="18" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <path d="M9 12h3" />
                    <path d="M12 12l3-4.5" />
                    <path d="M12 12l3 4.5" />
                  </svg>
                  <span className="text-[9.5px] font-bold text-zinc-300">Correlation</span>
                </div>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:flex flex-shrink-0 text-zinc-700 select-none items-center justify-center px-1">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Step 3 Card: Diagnostic Output */}
            <div 
              onClick={() => setActiveStepIndex(2)}
              className={`flex-1 border p-4.5 rounded-xl flex flex-col gap-3.5 cursor-pointer transition-all duration-200 select-none ${
                activeStepIndex === 2 
                  ? 'border-purple-500 bg-[#1e1c26] shadow-[0_0_20px_rgba(168,85,247,0.18)]' 
                  : 'border-zinc-800/80 bg-[#16151c] hover:border-purple-500/35 hover:bg-[#1a1921]'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center gap-1.5 border border-purple-500/30 bg-[#25183a]/65 px-2.5 py-1 rounded text-[8.5px] font-black uppercase text-purple-300 w-fit select-none">
                <svg className="w-2.5 h-2.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span>Alerts</span>
              </div>
              
              {/* Heading */}
              <h4 className="font-bold text-[14px] text-white tracking-wide">Diagnostic Output</h4>
              
              {/* 2x2 Sub-items */}
              <div className="grid grid-cols-2 gap-2 mt-0.5">
                <div className="bg-[#0f0e13] border border-zinc-900/60 p-2.5 rounded-lg flex flex-col justify-between items-start min-h-[60px]">
                  <svg className="text-purple-400 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span className="text-[9.5px] font-bold text-zinc-300">Ranked alerts</span>
                </div>
                <div className="bg-[#0f0e13] border border-zinc-900/60 p-2.5 rounded-lg flex flex-col justify-between items-start min-h-[60px]">
                  <svg className="text-purple-400 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                  </svg>
                  <span className="text-[9.5px] font-bold text-zinc-300">Root cause</span>
                </div>
                <div className="bg-[#0f0e13] border border-zinc-900/60 p-2.5 rounded-lg flex flex-col justify-between items-start min-h-[60px]">
                  <svg className="text-purple-400 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                  </svg>
                  <span className="text-[9.5px] font-bold text-zinc-300">Actions</span>
                </div>
                <div className="bg-[#0f0e13] border border-zinc-900/60 p-2.5 rounded-lg flex flex-col justify-between items-start min-h-[60px]">
                  <svg className="text-purple-400 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span className="text-[9.5px] font-bold text-zinc-300">Notify teams</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* DEEP-DIVE SECTION */}
        <div className="space-y-3 pt-4 border-t border-zinc-800/80 mt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-[8.5px] uppercase tracking-widest text-zinc-500 font-extrabold font-mono">Deep-Dive</h3>
            {activeStepIndex !== null && (
              <span className="text-[7px] font-sans font-bold bg-purple-500/10 text-purple-400 px-2.5 py-0.5 rounded border border-purple-500/15 uppercase">
                Interactive Detail
              </span>
            )}
          </div>
          
          {activeStepIndex === null ? (
            <div className="flex flex-col items-center justify-center py-14 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-950/20 text-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center animate-pulse">
                <Sparkles size={14} />
              </div>
              <span className="font-bold text-[10px] text-zinc-300 uppercase tracking-wider font-mono">Select a flowchart block</span>
              <p className="text-[8.5px] text-zinc-500 max-w-sm font-medium leading-relaxed">
                Click on Data Ingestion (Step 1), Processing & Analysis (Step 2), or Diagnostic Output (Step 3) above to view its specific deep-dive metrics.
              </p>
            </div>
          ) : (
            <div className="animate-fade-in w-full">
              
              {/* Step 1 Deep Dive: High Fidelity Source Selector & Dashboard */}
              {activeStepIndex === 0 && (
                <div className="flex flex-col lg:flex-row gap-4 w-full mt-1 animate-fade-in">
                  
                  {/* Left Column (Source selector Menu) */}
                  <div className="w-full lg:w-[250px] flex-shrink-0 border border-purple-500/10 rounded-2xl p-4.5 bg-[#0a0a0f] flex flex-col justify-between gap-5">
                    <div className="flex flex-col gap-4">
                      {/* Badge & Title */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 border border-purple-500/30 bg-[#25183a]/65 px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase text-purple-300 w-fit select-none">
                          <svg className="w-2.5 h-2.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 22c5.523 0 10-2.239 10-5s-4.477-5-10-5-10 2.239-10 5 4.477 5 10 5Z" />
                            <path d="M22 12c0 2.761-4.477 5-10 5S2 14.761 2 12" />
                            <path d="M22 7c0 2.761-4.477 5-10 5S2 9.761 2 7" />
                          </svg>
                          <span>INGEST</span>
                        </div>
                        <h4 className="text-[17px] font-semibold text-white tracking-tight leading-tight">Data Ingestion</h4>
                        <p className="text-[10px] text-zinc-400 leading-normal">
                          Connect and ingest data from multiple sources to power AI-driven portfolio insights.
                        </p>
                      </div>

                      {/* Source buttons list */}
                      <div className="flex flex-col gap-2.5 mt-2">
                        {/* Finance & Ops */}
                        <button
                          type="button"
                          onClick={() => setActiveSourceTab('finance')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeSourceTab === 'finance'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeSourceTab === 'finance' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">Finance & Ops</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">ERP, GL, P&L, Inventory...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>

                        {/* CRM / ERP */}
                        <button
                          type="button"
                          onClick={() => setActiveSourceTab('crm')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeSourceTab === 'crm'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeSourceTab === 'crm' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect width="20" height="8" x="2" y="3" rx="2" />
                              <rect width="20" height="8" x="2" y="13" rx="2" />
                              <line x1="6" y1="7" x2="6.01" y2="7" />
                              <line x1="6" y1="17" x2="6.01" y2="17" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">CRM / ERP</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">Customers, Orders, Pipeline...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>

                        {/* IoT Feeds */}
                        <button
                          type="button"
                          onClick={() => setActiveSourceTab('iot')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeSourceTab === 'iot'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeSourceTab === 'iot' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2v20" />
                              <path d="M17 5H7" />
                              <path d="M19 9H5" />
                              <path d="M15 13H9" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">IoT Feeds</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">Production, Machines, Quality...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>

                        {/* External APIs */}
                        <button
                          type="button"
                          onClick={() => setActiveSourceTab('api')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeSourceTab === 'api'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <span className={`text-[7px] font-mono font-black uppercase tracking-wider px-1 py-0.2 rounded border ${
                              activeSourceTab === 'api' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' : 'text-zinc-500 border-zinc-800 bg-zinc-900/50'
                            }`}>API</span>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">External APIs</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">Market, Competitor, Retail...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Status bar */}
                    <div className="border-t border-zinc-900 pt-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[9px]">
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                            <path d="M12 12v9" />
                            <path d="m8 17 4 4 4-4" />
                          </svg>
                          <span>Overall Ingestion Status</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-emerald-400 font-bold text-[8.5px]">Operational</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[8px] text-zinc-500">
                        <span>Last Sync</span>
                        <span>{currentTab.quality.sync}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Dynamic content display panel) */}
                  <div className="flex-1 min-w-0 border border-zinc-800/80 rounded-2xl p-5.5 bg-[#0b0a0f] flex flex-col gap-4.5 justify-between">
                    
                    {/* Panel Header */}
                    <div className="flex justify-between items-start border-b border-zinc-900/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                          {activeSourceTab === 'finance' && (
                            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                          )}
                          {activeSourceTab === 'crm' && (
                            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect width="20" height="8" x="2" y="3" rx="2" />
                              <rect width="20" height="8" x="2" y="13" rx="2" />
                              <line x1="6" y1="7" x2="6.01" y2="7" />
                              <line x1="6" y1="17" x2="6.01" y2="17" />
                            </svg>
                          )}
                          {activeSourceTab === 'iot' && (
                            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2v20" />
                              <path d="M17 5H7" />
                              <path d="M19 9H5" />
                              <path d="M15 13H9" />
                            </svg>
                          )}
                          {activeSourceTab === 'api' && (
                            <span className="text-[9px] font-black font-mono">API</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <h5 className="text-[14px] font-bold text-white tracking-wide">{currentTab.title}</h5>
                          <span className="text-[9.5px] text-zinc-500">{currentTab.subtitle}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveStepIndex(null)}
                        className="p-1 rounded cursor-pointer border-none bg-transparent outline-none transition-colors hover:bg-zinc-900 text-zinc-650 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Top Row Cards: Connected Systems, Data Ingested, Data Quality */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      
                      {/* Card 1: Connected Systems */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4 rounded-xl flex flex-col gap-3.5">
                        <span className="text-[8.5px] font-black uppercase text-zinc-500 tracking-wider">Connected Systems</span>
                        <div className="flex flex-col gap-2">
                          {currentTab.systems.map((sys, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className={`${sys.badgeBg} text-[8px] font-black text-white px-1.5 py-0.5 rounded mr-2 uppercase tracking-wide`}>
                                  {sys.badge}
                                </span>
                                <span className="text-[10px] font-bold text-zinc-300">{sys.name}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[8.5px] text-emerald-400 font-bold">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                <span>Connected</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card 2: Data Being Ingested */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4 rounded-xl flex flex-col gap-3.5">
                        <span className="text-[8.5px] font-black uppercase text-zinc-500 tracking-wider">Data Being Ingested</span>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                          {currentTab.dataIngested.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <svg className="w-3 h-3 text-purple-400/80 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect width="18" height="18" x="3" y="3" rx="2" />
                                <path d="M3 9h18M3 15h18" />
                              </svg>
                              <span className="text-[9.5px] font-bold text-zinc-300 leading-none">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card 3: Data Quality */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4 rounded-xl flex flex-col gap-3">
                        <span className="text-[8.5px] font-black uppercase text-zinc-500 tracking-wider">Data Quality</span>
                        <div className="flex items-center justify-between gap-3">
                          {/* Circle progress ring SVG */}
                          <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <circle className="text-zinc-900" strokeWidth="2.5" stroke="currentColor" fill="none" r="16" cx="18" cy="18" />
                              <circle className="text-emerald-400" strokeWidth="2.5" strokeDasharray="100" strokeDashoffset={100 - currentTab.quality.pct} strokeLinecap="round" stroke="currentColor" fill="none" r="16" cx="18" cy="18" />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center text-center">
                              <span className="text-[9px] font-black text-white leading-none">{currentTab.quality.pct}%</span>
                              <span className="text-[5.5px] text-zinc-500 font-extrabold uppercase tracking-wide mt-0.5">Quality</span>
                            </div>
                          </div>

                          {/* Data Quality details */}
                          <div className="flex-1 flex flex-col gap-0.5 text-[8.5px] text-zinc-400">
                            <div className="flex justify-between border-b border-zinc-900 pb-0.5">
                              <span>Completeness</span>
                              <span className="font-bold text-white">{currentTab.quality.completeness}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-900 pb-0.5">
                              <span>Accuracy</span>
                              <span className="font-bold text-white">{currentTab.quality.accuracy}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-900 pb-0.5">
                              <span>Freshness</span>
                              <span className="font-bold text-white">{currentTab.quality.freshness}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Records</span>
                              <span className="font-bold text-white">{currentTab.quality.records}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Middle Row: AI Insight & Business Outcomes Enabled */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      
                      {/* Card 4: AI Insight */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4 rounded-xl flex flex-col gap-3">
                        <span className="text-[8.5px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1">
                          <Sparkles size={9} className="text-purple-400" />
                          <span>AI Insight</span>
                        </span>
                        
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            {currentTab.insight.bullets.map((bullet, idx) => {
                              const parts = bullet.split(/(\$[0-9\.]+[M|k]|\d+\s*SKUs|\d+\%)/g);
                              return (
                                <p key={idx} className="text-[9.5px] text-zinc-300 leading-normal">
                                  {parts.map((p, i) => {
                                    if (p.match(/(\$[0-9\.]+[M|k]|\d+\s*SKUs|\d+\%)/)) {
                                      return <strong key={i} className="text-purple-400 font-extrabold">{p}</strong>;
                                    }
                                    return p;
                                  })}
                                </p>
                              );
                            })}
                          </div>
                          {/* Brain SVG Illustration */}
                          <div className="flex-shrink-0 self-center">
                            <svg className="w-20 h-16 text-purple-500/80" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M50 25c-8-6-20-4-24 5-3 5-2 12 3 15-4 5-3 12 2 15 5 3 11 1 14-2v-5c0-1.5.5-3 1.5-4l3.5-3.5 3.5 3.5c1 1 1.5 2.5 1.5 4v5c3 3 9 5 14 2 5-3 6-10 2-15 5-3 6-10 3-15-4-9-16-11-24-5Z" strokeDasharray="1.5 1.5" />
                              <circle cx="38" cy="35" r="2.5" fill="#8b5cf6" stroke="none" />
                              <circle cx="45" cy="45" r="2.5" fill="#a855f7" stroke="none" />
                              <circle cx="55" cy="45" r="2.5" fill="#a855f7" stroke="none" />
                              <circle cx="62" cy="35" r="2.5" fill="#8b5cf6" stroke="none" />
                              <path d="M38 35l7 10M62 35l-7 10M45 45h10" strokeWidth="1" stroke="currentColor" opacity="0.6" />
                              <rect x="75" y="45" width="4" height="20" rx="1.2" fill="#8b5cf6" stroke="none" />
                              <rect x="82" y="35" width="4" height="30" rx="1.2" fill="#a855f7" stroke="none" />
                              <rect x="89" y="25" width="4" height="40" rx="1.2" fill="#c084fc" stroke="none" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Card 5: Business Outcomes Enabled */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4 rounded-xl flex flex-col gap-3">
                        <span className="text-[8.5px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
                          <svg className="w-2.5 h-2.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                          </svg>
                          <span>Business Outcomes Enabled</span>
                        </span>

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            {currentTab.outcomes.map((outcome, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 text-[8px] font-black">
                                  ✓
                                </div>
                                <span className="text-[9.5px] font-bold text-zinc-300">{outcome}</span>
                              </div>
                            ))}
                          </div>
                          {/* Rising Chart SVG Illustration */}
                          <div className="flex-shrink-0 self-center">
                            <svg className="w-20 h-16 text-purple-500/80" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="15" y="55" width="8" height="15" rx="1.5" fill="#6366f1" opacity="0.6" stroke="none" />
                              <rect x="30" y="45" width="8" height="25" rx="1.5" fill="#8b5cf6" opacity="0.8" stroke="none" />
                              <rect x="45" y="30" width="8" height="40" rx="1.5" fill="#a855f7" stroke="none" />
                              <rect x="60" y="15" width="8" height="55" rx="1.5" fill="#c084fc" stroke="none" />
                              <path d="M10 70L65 20" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
                              <path d="M52 20h13v13" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Section: Data-to-Decision Flow */}
                    <div className="bg-[#121217] border border-zinc-900/60 p-4.5 rounded-xl flex flex-col gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9.5px] font-bold text-white tracking-wide">Data-to-Decision Flow</span>
                        <span className="text-[8px] text-zinc-500 font-medium">From raw data to strategic portfolio actions</span>
                      </div>

                      {/* Horizontal Process flow cards */}
                      <div className="flex flex-col md:flex-row items-center gap-2.5 w-full mt-1">
                        {currentTab.flow.map((flowItem, idx) => {
                          const isLast = idx === currentTab.flow.length - 1;
                          return (
                            <React.Fragment key={idx}>
                              {/* Flow block card */}
                              <div className={`flex-1 border p-3 rounded-lg flex flex-col gap-1 w-full min-h-[70px] ${
                                isLast
                                  ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                                  : 'border-zinc-900 bg-[#0f0e13]'
                              }`}>
                                <div className="flex items-center gap-1.5">
                                  {idx === 0 && (
                                    <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect width="20" height="8" x="2" y="3" rx="2" />
                                      <rect width="20" height="8" x="2" y="13" rx="2" />
                                      <line x1="6" y1="7" x2="6.01" y2="7" />
                                      <line x1="6" y1="17" x2="6.01" y2="17" />
                                    </svg>
                                  )}
                                  {idx === 1 && (
                                    <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M12 22c5.523 0 10-2.239 10-5s-4.477-5-10-5-10 2.239-10 5 4.477 5 10 5Z" />
                                      <path d="M22 12c0 2.761-4.477 5-10 5S2 14.761 2 12" />
                                    </svg>
                                  )}
                                  {idx === 2 && (
                                    <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M12 22c5.523 0 10-2.239 10-5s-4.477-5-10-5-10 2.239-10 5 4.477 5 10 5Z" />
                                      <circle cx="12" cy="12" r="3" />
                                    </svg>
                                  )}
                                  {idx === 3 && (
                                    <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M3 12h3l3-9 4 18 3-12h5" />
                                    </svg>
                                  )}
                                  {idx === 4 && (
                                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[8px] font-black">
                                      ✓
                                    </div>
                                  )}
                                  <span className={`text-[9.5px] font-bold ${isLast ? 'text-emerald-400' : 'text-zinc-200'}`}>{flowItem.label}</span>
                                </div>
                                
                                {idx < 4 ? (
                                  <p className="text-[8px] text-zinc-500 font-medium leading-relaxed mt-0.5">{flowItem.desc}</p>
                                ) : (
                                  <div className="flex flex-col text-[8px] font-black tracking-wide gap-0.5 mt-1 leading-none">
                                    {flowItem.desc.split(',').map((rec, rIdx) => {
                                      const text = rec.trim();
                                      let color = 'text-zinc-400';
                                      if (text.includes('Discontinue')) color = 'text-red-400';
                                      else if (text.includes('Expand')) color = 'text-emerald-400';
                                      else if (text.includes('Optimize')) color = 'text-amber-400';
                                      return <span key={rIdx} className={color}>{text}</span>;
                                    })}
                                  </div>
                                )}
                              </div>

                              {!isLast && (
                                <div className="text-zinc-700 select-none hidden md:block">
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ingestion Footer actions */}
                    <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3 mt-0.5 text-[8.5px]">
                      <div className="flex items-center gap-1.5 text-zinc-500 font-semibold font-mono">
                        <svg className="w-3.5 h-3.5 text-zinc-650 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                        </svg>
                        <span>Auto Refresh: <span className="text-emerald-400 font-extrabold">ON</span></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="px-4 py-2 border border-zinc-800 hover:border-zinc-750 hover:bg-zinc-900/30 text-zinc-300 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <svg className="w-3 h-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M3 9h18M3 15h18" />
                          </svg>
                          <span>View Ingested Data</span>
                        </button>
                        <button
                          type="button"
                          className="px-4.5 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Explore Insights</span>
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Step 2 Deep Dive: High Fidelity Processing & Analysis Selector & Dashboard */}
              {activeStepIndex === 1 && (
                <div className="flex flex-col lg:flex-row gap-4 w-full mt-1 animate-fade-in text-zinc-350">
                  
                  {/* Left Column (Compute tab selector Menu) */}
                  <div className="w-full lg:w-[250px] flex-shrink-0 border border-purple-500/10 rounded-2xl p-4.5 bg-[#0a0a0f] flex flex-col justify-between gap-5">
                    <div className="flex flex-col gap-4">
                      {/* Badge & Title */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 border border-purple-500/30 bg-[#25183a]/65 px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase text-purple-300 w-fit select-none">
                          <svg className="w-2.5 h-2.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                            <rect x="9" y="9" width="6" height="6" rx="1" />
                            <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
                          </svg>
                          <span>COMPUTE</span>
                        </div>
                        <h4 className="text-[17px] font-semibold text-white tracking-tight leading-tight font-serif">Process & Analysis</h4>
                        <p className="text-[10px] text-zinc-400 leading-normal">
                          Transform ingested data into actionable insights using AI-powered analytics.
                        </p>
                      </div>

                      {/* Compute Menu Buttons */}
                      <div className="flex flex-col gap-2.5 mt-2">
                        {/* Process & Analysis */}
                        <button
                          type="button"
                          onClick={() => setActiveComputeTab('process')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeComputeTab === 'process'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeComputeTab === 'process' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="5" r="3" />
                              <circle cx="5" cy="19" r="3" />
                              <circle cx="19" cy="19" r="3" />
                              <path d="M12 8v8M7 17l3-1.5M17 17l-3-1.5" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">Process & Analysis</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">Data modeling, AI/ML, KPIs...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>

                        {/* Visualization & Reporting */}
                        <button
                          type="button"
                          onClick={() => setActiveComputeTab('vis')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeComputeTab === 'vis'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeComputeTab === 'vis' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M9 17V9M15 17v-4" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">Visualization & Reporting</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">Dashboards, reports, alerts...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>

                        {/* Recommendations */}
                        <button
                          type="button"
                          onClick={() => setActiveComputeTab('recs')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeComputeTab === 'recs'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeComputeTab === 'recs' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 22c5.523 0 10-2.239 10-5s-4.477-5-10-5-10 2.239-10 5 4.477 5 10 5Z" />
                              <path d="m9 12 2 2 4-4" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">Recommendations</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">AI-driven actions, next steps...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>

                        {/* Collaboration & Workflow */}
                        <button
                          type="button"
                          onClick={() => setActiveComputeTab('collab')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeComputeTab === 'collab'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeComputeTab === 'collab' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 6.18a5 5 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M18 16a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v5" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">Collaboration & Workflow</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">Tasks, approvals, workflow...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>

                        {/* Data Quality & Governance */}
                        <button
                          type="button"
                          onClick={() => setActiveComputeTab('gov')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeComputeTab === 'gov'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeComputeTab === 'gov' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">Data Quality & Gov</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">Validation, compliance, rules...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Status bar */}
                    <div className="border-t border-zinc-900 pt-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[9px]">
                        <div className="flex items-center gap-1.5 text-zinc-450">
                          <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                          <span>Overall Pipeline Status</span>
                        </div>
                        <div className="flex items-center gap-1 text-[8.5px] text-emerald-400 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Healthy</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-[8px] text-zinc-500">
                        <span>Records Processed</span>
                        <span className="text-white font-bold">2.4M</span>
                      </div>
                      <div className="flex justify-between text-[8px] text-zinc-500">
                        <span>Success Rate</span>
                        <span className="text-emerald-400 font-bold">99.3%</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Dynamic content display panel) */}
                  <div className="flex-1 min-w-0 border border-zinc-800/80 rounded-2xl p-5.5 bg-[#0b0a0f] flex flex-col gap-4.5 justify-between">
                    
                    {/* Panel Header */}
                    <div className="flex justify-between items-start border-b border-zinc-900/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="5" r="3" />
                            <circle cx="5" cy="19" r="3" />
                            <circle cx="19" cy="19" r="3" />
                            <path d="M12 8v8M7 17l3-1.5M17 17l-3-1.5" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <h5 className="text-[14px] font-bold text-white tracking-wide">{currentCompute.title}</h5>
                          <span className="text-[9.5px] text-zinc-500">{currentCompute.subtitle}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 border border-zinc-800 bg-[#121217] px-2 py-1 rounded text-[8.5px] font-bold text-zinc-400 select-none">
                          <span>Time Range: Last 7 Days</span>
                          <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveStepIndex(null)}
                          className="p-1 rounded cursor-pointer border-none bg-transparent outline-none transition-colors hover:bg-zinc-900 text-zinc-650 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Top Row: Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {currentCompute.metrics.map((m, idx) => (
                        <div key={idx} className="bg-[#121217] border border-zinc-900/60 p-3 rounded-xl flex items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8.5px] text-zinc-500 font-bold truncate max-w-[80px]">{m.label}</span>
                            <span className="text-[15px] font-bold text-white tracking-tight">{m.val}</span>
                            <span className="text-[8px] text-emerald-400 font-bold">{m.pct} <span className="text-zinc-600 font-normal">vs last 7d</span></span>
                          </div>
                          <div className="p-1.5 bg-[#171720] border border-zinc-800/40 rounded-lg text-purple-400">
                            {m.icon === 'db' && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect width="20" height="8" x="2" y="3" rx="2" />
                                <rect width="20" height="8" x="2" y="13" rx="2" />
                              </svg>
                            )}
                            {m.icon === 'cube' && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                              </svg>
                            )}
                            {m.icon === 'bulb' && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                              </svg>
                            )}
                            {m.icon === 'target' && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="6" />
                              </svg>
                            )}
                            {m.icon === 'check' && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m9 12 2 2 4-4" />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Middle Row: Our Analytics Process & Key Insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      
                      {/* Left: Our Analytics Process (Takes 2/3) */}
                      <div className="lg:col-span-2 bg-[#121217] border border-zinc-900/60 p-4.5 rounded-xl flex flex-col gap-3">
                        <div className="flex flex-col">
                          <span className="text-[9.5px] font-bold text-white">Our Analytics Process</span>
                          <span className="text-[8px] text-zinc-500 font-medium mt-0.5">From raw data to decision-ready insights</span>
                        </div>

                        {/* Horizontal Process Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-2.5">
                          {currentCompute.processSteps.map((step, idx) => {
                            const isLast = idx === currentCompute.processSteps.length - 1;
                            return (
                              <div key={idx} className="relative flex flex-col items-center text-center p-2 bg-[#0d0d12] border border-zinc-900 rounded-xl min-h-[110px] justify-between w-full">
                                {/* Icon container */}
                                <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mt-1">
                                  {step.icon === 'db' && (
                                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect width="20" height="8" x="2" y="3" rx="2" />
                                      <rect width="20" height="8" x="2" y="13" rx="2" />
                                    </svg>
                                  )}
                                  {step.icon === 'model' && (
                                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="5" r="3" />
                                      <circle cx="5" cy="19" r="3" />
                                      <circle cx="19" cy="19" r="3" />
                                      <path d="M12 8v8M7 17l3-1.5M17 17l-3-1.5" />
                                    </svg>
                                  )}
                                  {step.icon === 'brain' && (
                                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44" />
                                      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44" />
                                    </svg>
                                  )}
                                  {step.icon === 'kpi' && (
                                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect x="3" y="3" width="18" height="18" rx="2" />
                                      <path d="M9 17V9M15 17v-4" />
                                    </svg>
                                  )}
                                  {step.icon === 'bulb' && (
                                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5" />
                                      <path d="M9 18h6" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex flex-col gap-0.5 px-1.5">
                                  <span className="text-[9.5px] font-bold text-white leading-tight">{step.step}</span>
                                  <span className="text-[7.5px] text-zinc-550 leading-tight font-medium mt-0.5">{step.desc}</span>
                                </div>
                                <span className="bg-purple-950/40 border border-purple-500/20 text-purple-300 text-[7px] font-black uppercase px-2 py-0.5 rounded-full mb-1">
                                  {step.badge}
                                </span>
                                {!isLast && (
                                  <div className="absolute top-1/2 -right-3 -translate-y-1/2 text-zinc-800 select-none hidden md:block z-10">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M5 12h14" strokeLinecap="round" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Key Insights Generated (Takes 1/3) */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4.5 rounded-xl flex flex-col justify-between gap-3">
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                          <span className="text-[9.5px] font-bold text-white">Key Insights Generated</span>
                          <span className="text-[7.5px] font-mono font-black text-purple-400 bg-purple-500/10 px-1 py-0.2 rounded border border-purple-500/15">AI</span>
                        </div>

                        <div className="flex flex-col gap-3">
                          {currentCompute.insights.map((insight, idx) => (
                            <div key={idx} className="flex gap-2.5 items-start">
                              <div className="mt-0.5 p-1 bg-[#181822] border border-zinc-800/40 rounded text-purple-400">
                                {insight.icon === 'trend' && (
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m22 7-8.5 8.5-5-5L2 17M22 7h-6M22 7v6" />
                                  </svg>
                                )}
                                {insight.icon === 'alert' && (
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                  </svg>
                                )}
                                {insight.icon === 'check' && (
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect width="18" height="18" x="3" y="3" rx="2" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex flex-col gap-0.5 flex-1">
                                <p className="text-[9px] text-zinc-300 leading-normal">{insight.text}</p>
                                <span className={`text-[6.5px] font-extrabold uppercase border px-1.5 py-0.2 w-fit rounded ${insight.badgeColor}`}>
                                  {insight.badge}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <span className="text-[8.5px] text-purple-400 font-bold hover:underline cursor-pointer border-t border-zinc-900 pt-2 block w-fit">
                          View All Insights &rarr;
                        </span>
                      </div>

                    </div>

                    {/* Third Row: Model Performance, KPI Trends, Top Recommendations */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      
                      {/* 1. Model Performance Table */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4 rounded-xl flex flex-col justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-[9.5px] font-bold text-white">Model Performance</span>
                          <span className="text-[8px] text-zinc-500 font-medium">Performance of AI/ML models</span>
                        </div>

                        <div className="border border-zinc-900 rounded-lg overflow-hidden bg-zinc-950/20">
                          <table className="w-full text-[8.5px] text-left border-collapse">
                            <thead>
                              <tr className="border-b border-zinc-900 text-zinc-500 font-extrabold bg-[#0d0d12]/30 uppercase text-[7.5px] tracking-wide">
                                <th className="p-2">Model</th>
                                <th className="p-2">Accuracy</th>
                                <th className="p-2">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900/40 text-zinc-300">
                              {currentCompute.models.map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.01]">
                                  <td className="p-2 font-bold max-w-[85px] truncate">{row.name}</td>
                                  <td className="p-2 font-mono text-white font-bold">{row.acc}</td>
                                  <td className="p-2 text-emerald-400 font-bold">{row.status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <span className="text-[8.5px] text-purple-400 font-bold hover:underline cursor-pointer pt-0.5 block w-fit">
                          View All Models &rarr;
                        </span>
                      </div>

                      {/* 2. KPI Trends Line Chart */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4 rounded-xl flex flex-col justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-[9.5px] font-bold text-white">KPI Trends</span>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-0.5 bg-purple-500 inline-block" />
                              <span className="text-[8px] text-zinc-400 font-bold">Current Period</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-0.5 border-t border-dashed border-purple-400 inline-block" />
                              <span className="text-[8px] text-zinc-400 font-bold">Previous Period</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Line Chart SVG */}
                        <div className="relative w-full h-[105px] border-b border-l border-zinc-900 mt-2 bg-zinc-950/20 rounded-md p-1.5 flex flex-col justify-between">
                          <svg className="w-full h-full text-purple-500" viewBox="0 0 300 100" fill="none" stroke="currentColor">
                            <line x1="0" y1="25" x2="300" y2="25" stroke="#1f1e29" strokeWidth="0.8" />
                            <line x1="0" y1="50" x2="300" y2="50" stroke="#1f1e29" strokeWidth="0.8" />
                            <line x1="0" y1="75" x2="300" y2="75" stroke="#1f1e29" strokeWidth="0.8" />
                            {/* Previous Period (Dashed) */}
                            <path d="M 0 85 Q 50 35 100 75 T 200 55 T 300 30" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
                            {/* Current Period (Solid) */}
                            <path d="M 0 75 Q 50 15 100 65 T 200 35 T 300 10" stroke="#a855f7" strokeWidth="2" fill="none" />
                            {/* Dot markers */}
                            <circle cx="300" cy="10" r="3" fill="#a855f7" stroke="none" />
                            <circle cx="200" cy="35" r="3" fill="#a855f7" stroke="none" />
                          </svg>
                          <div className="flex justify-between text-[7px] text-zinc-650 font-bold tracking-wide mt-1">
                            <span>May 8</span>
                            <span>May 9</span>
                            <span>May 10</span>
                            <span>May 11</span>
                            <span>May 12</span>
                            <span>May 13</span>
                            <span>May 14</span>
                          </div>
                        </div>

                        {/* Metrics Row at bottom of KPI Trends */}
                        <div className="grid grid-cols-4 gap-1 pt-1.5 text-center">
                          {currentCompute.kpis.map((kpi, idx) => (
                            <div key={idx} className="flex flex-col border-r border-zinc-900 last:border-none">
                              <span className="text-[7.5px] text-zinc-550 font-bold truncate">{kpi.label}</span>
                              <span className="text-[10px] font-bold text-white mt-0.5">{kpi.val}</span>
                              <span className="text-[7px] text-emerald-400 font-extrabold mt-0.5">{kpi.change}</span>
                            </div>
                          ))}
                        </div>

                        <span className="text-[8.5px] text-purple-400 font-bold hover:underline cursor-pointer block w-fit">
                          View All KPIs &rarr;
                        </span>
                      </div>

                      {/* 3. Top Recommendations */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4 rounded-xl flex flex-col justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-[9.5px] font-bold text-white">Top Recommendations</span>
                          <span className="text-[8px] text-zinc-500 font-medium">Approved optimization variables</span>
                        </div>

                        <div className="flex flex-col gap-2">
                          {currentCompute.recs.map((rec, idx) => (
                            <div key={idx} className={`p-2.5 rounded-xl border flex justify-between items-center ${rec.color}`}>
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-[9.5px] text-white leading-none">{rec.title}</span>
                                <span className="text-[7.5px] text-zinc-500 mt-0.5 truncate max-w-[130px] font-medium">{rec.desc}</span>
                              </div>
                              <div className="text-right flex flex-col gap-0.5">
                                <span className="text-[9px] font-mono font-black text-white leading-none">{rec.val}</span>
                                <span className="text-[6.5px] font-extrabold uppercase tracking-wide opacity-80">{rec.impact}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <span className="text-[8.5px] text-purple-400 font-bold hover:underline cursor-pointer block w-fit">
                          View All Recommendations &rarr;
                        </span>
                      </div>

                    </div>

                    {/* Bottom Row: Data to Decision Impact */}
                    <div className="bg-[#121217] border border-zinc-900/60 p-4.5 rounded-xl flex flex-col gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9.5px] font-bold text-white">Data to Decision Impact</span>
                        <span className="text-[8px] text-zinc-500 font-medium">How our analysis drives business decisions</span>
                      </div>

                      {/* Decision Flow Blocks & Gradient Box */}
                      <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                        
                        {/* 5 Process flow blocks */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 flex-1 w-full">
                          {currentCompute.flow.map((flowItem, idx) => {
                            const isLast = idx === currentCompute.flow.length - 1;
                            return (
                              <div key={idx} className="relative bg-[#0f0e13] border border-zinc-900 p-3 rounded-lg flex flex-col gap-1 w-full min-h-[55px] justify-between">
                                <div className="flex items-center gap-1.5">
                                  {idx === 0 && (
                                    <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect width="20" height="8" x="2" y="3" rx="2" />
                                      <rect width="20" height="8" x="2" y="13" rx="2" />
                                    </svg>
                                  )}
                                  {idx === 1 && (
                                    <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="5" r="3" />
                                      <circle cx="5" cy="19" r="3" />
                                      <circle cx="19" cy="19" r="3" />
                                      <path d="M12 8v8M7 17l3-1.5M17 17l-3-1.5" />
                                    </svg>
                                  )}
                                  {idx === 2 && (
                                    <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5" />
                                      <path d="M9 18h6" />
                                    </svg>
                                  )}
                                  {idx === 3 && (
                                    <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="12" r="10" />
                                      <circle cx="12" cy="12" r="6" />
                                    </svg>
                                  )}
                                  {idx === 4 && (
                                    <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="12" r="10" />
                                      <path d="m9 12 2 2 4-4" />
                                    </svg>
                                  )}
                                  <span className="text-[9.5px] font-bold text-zinc-200">{flowItem.label}</span>
                                </div>
                                <span className="text-[8px] text-zinc-500 font-medium leading-relaxed mt-0.5">{flowItem.desc}</span>
                                {!isLast && (
                                  <div className="absolute top-1/2 -right-2 -translate-y-1/2 text-zinc-800 select-none hidden md:block z-10">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M5 12h14" strokeLinecap="round" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Right purple gradient callout box */}
                        <div className="w-full md:w-[170px] bg-gradient-to-r from-[#6b21a8] to-[#4c1d95] rounded-xl p-3.5 flex flex-col justify-between min-h-[55px] shadow-[0_4px_14px_rgba(107,33,168,0.25)] border border-purple-500/25">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-black uppercase tracking-wider text-purple-200">Value Add</span>
                            <Sparkles size={11} className="text-purple-300" />
                          </div>
                          <span className="text-[10px] font-extrabold text-white tracking-wide mt-1.5 leading-tight">Turning Data into Business Value</span>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Step 3 Deep Dive: High Fidelity Diagnostic Output Selector & Dashboard */}
              {activeStepIndex === 2 && (
                <div className="flex flex-col lg:flex-row gap-4 w-full mt-1 animate-fade-in text-zinc-350">
                  
                  {/* Left Column (Diagnostics Selector Menu) */}
                  <div className="w-full lg:w-[250px] flex-shrink-0 border border-purple-500/10 rounded-2xl p-4.5 bg-[#0a0a0f] flex flex-col justify-between gap-5">
                    <div className="flex flex-col gap-4">
                      {/* Badge & Title */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 border border-purple-500/30 bg-[#25183a]/65 px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase text-purple-300 w-fit select-none">
                          <svg className="w-2.5 h-2.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                          <span>ALERTS</span>
                        </div>
                        <h4 className="text-[17px] font-semibold text-white tracking-tight leading-tight font-serif">Diagnostic Output</h4>
                        <p className="text-[10px] text-zinc-400 leading-normal">
                          AI-driven diagnostics that identify issues, root causes and opportunities to improve portfolio performance.
                        </p>
                      </div>

                      {/* Diagnostics Menu Buttons */}
                      <div className="flex flex-col gap-2.5 mt-2">
                        {/* Diagnostic Output */}
                        <button
                          type="button"
                          onClick={() => setActiveDiagnosticTab('diagnostic')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeDiagnosticTab === 'diagnostic'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeDiagnosticTab === 'diagnostic' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <circle cx="12" cy="12" r="6" />
                              <circle cx="12" cy="12" r="2" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">Diagnostic Output</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">Issues, root causes, opportunities...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>

                        {/* Root Cause Analysis */}
                        <button
                          type="button"
                          onClick={() => setActiveDiagnosticTab('root')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeDiagnosticTab === 'root'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeDiagnosticTab === 'root' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="3" />
                              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
                              <path d="M18 8h4v4h-4z" />
                              <path d="M14 12h4" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">Root Cause Analysis</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">Drill down to core factors...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>

                        {/* Impact Assessment */}
                        <button
                          type="button"
                          onClick={() => setActiveDiagnosticTab('impact')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeDiagnosticTab === 'impact'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeDiagnosticTab === 'impact' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M9 17V9M15 17v-4" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">Impact Assessment</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">Quantify financial & NPS impact...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>

                        {/* Scenario Simulation */}
                        <button
                          type="button"
                          onClick={() => setActiveDiagnosticTab('scenario')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeDiagnosticTab === 'scenario'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeDiagnosticTab === 'scenario' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                              <path d="M3.27 6.96L12 12.01l8.73-5.05" />
                              <path d="M12 22.08V12" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">Scenario Simulation</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">Simulate price / volume shocks...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>

                        {/* Alerts & Anomalies */}
                        <button
                          type="button"
                          onClick={() => setActiveDiagnosticTab('alerts')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeDiagnosticTab === 'alerts'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeDiagnosticTab === 'alerts' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">Alerts & Anomalies</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">Real-time limits, active anomalies...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>

                        {/* Recommendations */}
                        <button
                          type="button"
                          onClick={() => setActiveDiagnosticTab('recs')}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                            activeDiagnosticTab === 'recs'
                              ? 'border-purple-500/80 bg-purple-500/5 text-white shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'border-zinc-800 bg-[#121217] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <svg className={`w-4 h-4 ${activeDiagnosticTab === 'recs' ? 'text-purple-400' : 'text-zinc-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 22c5.523 0 10-2.239 10-5s-4.477-5-10-5-10 2.239-10 5 4.477 5 10 5Z" />
                              <path d="m9 12 2 2 4-4" />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[10.5px] font-bold">Recommendations</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-[130px]">AI-suggested recovery options...</span>
                            </div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[9px] select-none">&gt;</span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Status bar */}
                    <div className="border-t border-zinc-900 pt-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[9px]">
                        <div className="flex items-center gap-1.5 text-zinc-455">
                          <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                          <span>Diagnostics Health</span>
                        </div>
                        <div className="flex items-center gap-1 text-[8.5px] text-emerald-400 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Healthy</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-[8px] text-zinc-500">
                        <span>Checks Performed</span>
                        <span className="text-white font-bold">134</span>
                      </div>
                      <div className="flex justify-between text-[8px] text-zinc-500">
                        <span>Issues Detected</span>
                        <span className="text-red-400 font-bold">17</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Dynamic content display panel) */}
                  <div className="flex-1 min-w-0 border border-zinc-800/80 rounded-2xl p-5.5 bg-[#0b0a0f] flex flex-col gap-4.5 justify-between">
                    
                    {/* Panel Header */}
                    <div className="flex justify-between items-start border-b border-zinc-900/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                          <svg className="w-4.5 h-4.5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12h3l3-9 4 18 3-12h5" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <h5 className="text-[14px] font-bold text-white tracking-wide">{currentDiagnostic.title}</h5>
                          <span className="text-[9.5px] text-zinc-500">{currentDiagnostic.subtitle}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 border border-zinc-800 bg-[#121217] px-2 py-1 rounded text-[8.5px] font-bold text-zinc-400 select-none">
                          <span>Time Range: Last 7 Days</span>
                          <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveStepIndex(null)}
                          className="p-1 rounded cursor-pointer border-none bg-transparent outline-none transition-colors hover:bg-zinc-900 text-zinc-650 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Top Row: Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {currentDiagnostic.metrics.map((m, idx) => (
                        <div key={idx} className="bg-[#121217] border border-zinc-900/60 p-3 rounded-xl flex items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8.5px] text-zinc-550 font-bold truncate max-w-[80px] leading-tight">{m.label}</span>
                            <span className="text-[15px] font-bold text-white tracking-tight">{m.val}</span>
                            <span className={`text-[8.5px] font-extrabold ${m.label === 'Issues Detected' ? 'text-red-400' : 'text-emerald-400'}`}>{m.pct}</span>
                          </div>
                          <div className="p-1.5 bg-[#171720] border border-zinc-800/40 rounded-lg text-purple-400">
                            {m.icon === 'diag' && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 12h3l3-9 4 18 3-12h5" />
                              </svg>
                            )}
                            {m.icon === 'alert' && (
                              <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                              </svg>
                            )}
                            {m.icon === 'target' && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="2" />
                              </svg>
                            )}
                            {m.icon === 'opportunity' && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 20V10M18 20V4M6 20v-4" />
                              </svg>
                            )}
                            {m.icon === 'check' && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Middle Row: Severity Distribution, Issues Over Time, Top Categories */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      
                      {/* Left: Issue Severity Distribution (Donut) */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4.5 rounded-xl flex flex-col justify-between gap-3 min-h-[160px]">
                        <span className="text-[9.5px] font-bold text-white">Issue Severity Distribution</span>
                        
                        <div className="flex items-center justify-between gap-4 mt-1">
                          {/* Donut chart SVG */}
                          <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              {/* Background track */}
                              <circle className="text-zinc-900" strokeWidth="4.5" stroke="currentColor" fill="none" r="15" cx="18" cy="18" />
                              {/* Low (green): 2 issues -> 12% */}
                              <circle className="text-emerald-500" strokeWidth="4.5" strokeDasharray="12 100" strokeDashoffset="0" stroke="currentColor" fill="none" r="15" cx="18" cy="18" />
                              {/* Medium (yellow): 3 issues -> 18% */}
                              <circle className="text-amber-400" strokeWidth="4.5" strokeDasharray="18 100" strokeDashoffset="-12" stroke="currentColor" fill="none" r="15" cx="18" cy="18" />
                              {/* High (orange): 7 issues -> 41% */}
                              <circle className="text-orange-500" strokeWidth="4.5" strokeDasharray="41 100" strokeDashoffset="-30" stroke="currentColor" fill="none" r="15" cx="18" cy="18" />
                              {/* Critical (red): 5 issues -> 29% */}
                              <circle className="text-red-500" strokeWidth="4.5" strokeDasharray="29 100" strokeDashoffset="-71" stroke="currentColor" fill="none" r="15" cx="18" cy="18" />
                            </svg>
                            <div className="absolute text-center flex flex-col items-center justify-center">
                              <span className="text-[11px] font-black text-white">{currentDiagnostic.severity.total}</span>
                              <span className="text-[5.5px] text-zinc-550 font-extrabold uppercase tracking-wide leading-none">Total Issues</span>
                            </div>
                          </div>

                          {/* Legend details */}
                          <div className="flex-1 flex flex-col gap-1 text-[9px] text-zinc-400 font-bold">
                            {currentDiagnostic.severity.breakdown.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center pb-0.5 border-b border-zinc-900 last:border-none">
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                                  <span>{item.label}</span>
                                </div>
                                <span className="text-white">{item.val} ({item.pct}%)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Issues Over Time (Line Chart) */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4.5 rounded-xl flex flex-col justify-between gap-3 min-h-[160px]">
                        <div className="flex justify-between items-center">
                          <span className="text-[9.5px] font-bold text-white">Issues Over Time</span>
                          {/* Tiny color dots Legend */}
                          <div className="flex items-center gap-1.5 text-[7px] text-zinc-500 font-black uppercase">
                            <span className="text-red-500">•</span> Crit
                            <span className="text-orange-500">•</span> High
                            <span className="text-amber-400">•</span> Med
                            <span className="text-emerald-500">•</span> Low
                          </div>
                        </div>

                        {/* 4 Line chart SVG */}
                        <div className="relative w-full h-[95px] border-b border-l border-zinc-900 bg-zinc-950/20 rounded-md p-1 flex flex-col justify-between mt-1">
                          <svg className="w-full h-full text-zinc-700" viewBox="0 0 300 100" fill="none" stroke="currentColor">
                            <line x1="0" y1="25" x2="300" y2="25" stroke="#1f1e29" strokeWidth="0.8" />
                            <line x1="0" y1="50" x2="300" y2="50" stroke="#1f1e29" strokeWidth="0.8" />
                            <line x1="0" y1="75" x2="300" y2="75" stroke="#1f1e29" strokeWidth="0.8" />
                            {/* Critical line (Red) */}
                            <path d="M 0 50 Q 50 30 100 45 T 200 35 T 300 15" stroke="#ef4444" strokeWidth="1.5" fill="none" />
                            {/* High line (Orange) */}
                            <path d="M 0 65 Q 50 45 100 55 T 200 50 T 300 35" stroke="#f97316" strokeWidth="1.5" fill="none" />
                            {/* Medium line (Yellow) */}
                            <path d="M 0 80 Q 50 65 100 75 T 200 60 T 300 50" stroke="#eab308" strokeWidth="1.2" fill="none" />
                            {/* Low line (Green) */}
                            <path d="M 0 90 Q 50 80 100 85 T 200 80 T 300 70" stroke="#10b981" strokeWidth="1.2" fill="none" />
                          </svg>
                          <div className="flex justify-between text-[7px] text-zinc-650 font-bold tracking-wide mt-1">
                            <span>May 8</span>
                            <span>May 9</span>
                            <span>May 10</span>
                            <span>May 11</span>
                            <span>May 12</span>
                            <span>May 13</span>
                            <span>May 14</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Top Issue Categories (Horizontal bars) */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4.5 rounded-xl flex flex-col justify-between gap-3 min-h-[160px]">
                        <span className="text-[9.5px] font-bold text-white">Top Issue Categories</span>
                        
                        <div className="flex flex-col gap-2.5 mt-1">
                          {currentDiagnostic.categories.map((cat, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                              <div className="flex justify-between text-[8.5px] text-zinc-400 font-bold leading-none">
                                <span>{cat.label}</span>
                                <span className="text-white">{cat.val} ({cat.pct}%)</span>
                              </div>
                              <div className="w-full h-1.5 bg-[#0f0e13] rounded-full overflow-hidden border border-zinc-900/40">
                                <div className={`h-full ${cat.bg} rounded-full`} style={{ width: `${cat.pct}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Third Row: Top Issues Table, Root Cause Snapshot, Impact Assessment */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      
                      {/* 1. Top Issues Table */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4 rounded-xl flex flex-col justify-between gap-3 min-h-[220px]">
                        <div className="flex flex-col pb-0.5">
                          <span className="text-[9.5px] font-bold text-white">Top Issues Detected</span>
                          <span className="text-[8px] text-zinc-550 mt-0.5">Prioritized active system anomalies</span>
                        </div>

                        <div className="border border-zinc-900 rounded-lg overflow-hidden bg-zinc-950/20">
                          <table className="w-full text-[8px] text-left border-collapse">
                            <thead>
                              <tr className="border-b border-zinc-900 text-zinc-500 font-extrabold bg-[#0d0d12]/30 uppercase text-[7.5px] tracking-wide">
                                <th className="p-2">Issue</th>
                                <th className="p-2">Severity</th>
                                <th className="p-2">Impact</th>
                                <th className="p-2">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900/40 text-zinc-350">
                              {currentDiagnostic.issues.slice(0, 3).map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.01]">
                                  <td className="p-2 flex flex-col gap-0.5 max-w-[100px]">
                                    <span className="font-bold text-white truncate leading-tight">{row.name}</span>
                                    <span className="text-[7px] text-zinc-500 font-medium truncate leading-normal">{row.desc}</span>
                                  </td>
                                  <td className="p-2">
                                    <span className={`text-[6.5px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${row.sevColor}`}>
                                      {row.sev}
                                    </span>
                                  </td>
                                  <td className="p-2 font-mono font-bold text-white">{row.impact}</td>
                                  <td className="p-2 font-bold text-[7.5px]"><span className={row.statusColor}>{row.status}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <span className="text-[8.5px] text-purple-400 font-bold hover:underline cursor-pointer pt-0.5 block w-fit">
                          View All Issues &rarr;
                        </span>
                      </div>

                      {/* 2. Root Cause Snapshot Diagram */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4 rounded-xl flex flex-col justify-between gap-3 min-h-[220px]">
                        <div className="flex flex-col">
                          <span className="text-[9.5px] font-bold text-white">Root Cause Snapshot</span>
                          <span className="text-[8px] text-zinc-550 mt-0.5">Causal mapping diagram</span>
                        </div>

                        {/* Causal Snapshot CSS layout */}
                        <div className="relative w-full h-[125px] border border-zinc-900/50 rounded-xl bg-zinc-950/30 flex items-center justify-center p-1 overflow-hidden mt-1 select-none">
                          {/* Inner circle node */}
                          <div className="w-18 h-18 rounded-full border border-purple-500 bg-[#120d20] flex items-center justify-center text-center text-[7px] text-white font-extrabold p-2.5 z-10 shadow-[0_0_12px_rgba(168,85,247,0.25)] leading-tight">
                            Margin Erosion in 15 SKUs
                          </div>

                          {/* Outer absolute nodes */}
                          {/* Top-Left */}
                          <div className="absolute left-1.5 top-1.5 bg-[#0f0e13] border border-zinc-900 p-1.5 rounded-lg text-left flex flex-col gap-0.5 leading-none shadow-md">
                            <span className="text-red-400 font-black text-[7.5px] flex items-center gap-0.5">
                              <span>&uarr;</span> Raw Material
                            </span>
                            <span className="text-[7px] text-zinc-500 font-medium">Costs (+12%)</span>
                          </div>

                          {/* Top-Right */}
                          <div className="absolute right-1.5 top-1.5 bg-[#0f0e13] border border-zinc-900 p-1.5 rounded-lg text-right flex flex-col gap-0.5 leading-none shadow-md">
                            <span className="text-orange-400 font-black text-[7.5px] flex items-center gap-0.5 justify-end">
                              <span>&darr;</span> Price Real.
                            </span>
                            <span className="text-[7px] text-zinc-500 font-medium">(-4%)</span>
                          </div>

                          {/* Mid-Left */}
                          <div className="absolute left-1.5 bottom-12 bg-[#0f0e13] border border-zinc-900 p-1.5 rounded-lg text-left flex flex-col gap-0.5 leading-none shadow-md">
                            <span className="text-orange-400 font-black text-[7.5px] flex items-center gap-0.5">
                              <span>&uarr;</span> Promo Spend
                            </span>
                            <span className="text-[7px] text-zinc-500 font-medium">(+8%)</span>
                          </div>

                          {/* Mid-Right */}
                          <div className="absolute right-1.5 bottom-12 bg-[#0f0e13] border border-zinc-900 p-1.5 rounded-lg text-right flex flex-col gap-0.5 leading-none shadow-md">
                            <span className="text-orange-400 font-black text-[7.5px] flex items-center gap-0.5 justify-end">
                              <span>&uarr;</span> Product Mix
                            </span>
                            <span className="text-[7px] text-zinc-500 font-medium">(-5%)</span>
                          </div>

                          {/* Bottom Center */}
                          <div className="absolute bottom-1 bg-[#0f0e13] border border-zinc-900 p-1.5 rounded-lg text-center flex flex-col gap-0.5 leading-none shadow-md z-0">
                            <span className="text-emerald-400 font-black text-[7.5px] flex items-center gap-0.5 justify-center">
                              <span>&uarr;</span> Logistics
                            </span>
                            <span className="text-[7px] text-zinc-500 font-medium">Costs (+7%)</span>
                          </div>
                        </div>

                        <span className="text-[8.5px] text-purple-400 font-bold hover:underline cursor-pointer block w-fit">
                          View Full Root Cause Analysis &rarr;
                        </span>
                      </div>

                      {/* 3. Impact Assessment Values */}
                      <div className="bg-[#121217] border border-zinc-900/60 p-4 rounded-xl flex flex-col justify-between gap-3 min-h-[220px]">
                        <div className="flex flex-col">
                          <span className="text-[9.5px] font-bold text-white">Impact Assessment</span>
                          <span className="text-[8px] text-zinc-550 mt-0.5">Anomalies value quantification</span>
                        </div>

                        <div className="flex flex-col gap-2">
                          {currentDiagnostic.impacts.map((imp, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl border border-zinc-900 bg-[#0f0e13] flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="p-1 bg-[#16151c] border border-zinc-800/40 rounded text-purple-400 flex-shrink-0">
                                  {imp.icon === 'gear' && (
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="12" r="3" />
                                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                    </svg>
                                  )}
                                  {imp.icon === 'list' && (
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect width="18" height="18" x="3" y="3" rx="2" />
                                      <path d="M3 9h18M3 15h18" />
                                    </svg>
                                  )}
                                  {imp.icon === 'user' && (
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                      <circle cx="9" cy="7" r="4" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-bold text-[9.5px] text-white leading-none">{imp.label}</span>
                                  <span className="text-[7px] text-zinc-500 font-medium leading-normal mt-0.5 truncate max-w-[125px]">{imp.desc}</span>
                                </div>
                              </div>
                              <div className="text-right flex flex-col gap-0.5">
                                <span className="text-[10px] font-mono font-black text-white leading-none">{imp.val}</span>
                                <span className={`text-[6.5px] font-extrabold uppercase tracking-wide px-1 rounded border ${imp.tagColor}`}>{imp.tag}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <span className="text-[8.5px] text-purple-400 font-bold hover:underline cursor-pointer block w-fit">
                          View Full Impact Analysis &rarr;
                        </span>
                      </div>

                    </div>

                    {/* Fourth Row: Recommended Actions (AI Suggested) */}
                    <div className="bg-[#121217] border border-zinc-900/60 p-4.5 rounded-xl flex flex-col gap-3">
                      <span className="text-[9.5px] font-bold text-white tracking-wide">Recommended Actions (AI Suggested)</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                        {currentDiagnostic.recs.map((rec, idx) => (
                          <div key={idx} className="bg-[#0f0e13] border border-zinc-900 p-3 rounded-lg flex flex-col justify-between min-h-[105px]">
                            <div className="flex flex-col gap-1.5">
                              {/* Header & badge */}
                              <div className="flex justify-between items-start">
                                <span className={`text-[6.5px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded border ${rec.tagColor}`}>
                                  {rec.tag}
                                </span>
                              </div>
                              <span className="font-bold text-[9.5px] text-white leading-tight">{rec.title}</span>
                              <p className="text-[7.5px] text-zinc-550 leading-relaxed font-medium mt-0.5">{rec.desc}</p>
                            </div>
                            
                            {/* Potential impact and Confidence bar */}
                            <div className="border-t border-zinc-900/80 pt-2 flex flex-col gap-1.5 mt-1 text-[8px] text-zinc-400">
                              <div className="flex justify-between font-bold">
                                <span>Potential Impact</span>
                                <span className="text-emerald-400 font-mono">{rec.val}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between font-medium text-[7px] text-zinc-500">
                                  <span>Confidence</span>
                                  <span>{rec.conf}%</span>
                                </div>
                                <div className="w-full h-1 bg-[#16151c] rounded-full overflow-hidden border border-zinc-900/40">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rec.conf}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Callout action card (Explore Detailed Diagnostics) */}
                        <div className="bg-gradient-to-br from-[#1e1533] to-[#120e20] border border-purple-500/10 p-3 rounded-lg flex flex-col items-center justify-center text-center gap-3.5 min-h-[105px]">
                          <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 animate-pulse">
                            <Sparkles size={14} />
                          </div>
                          <span className="text-[8.5px] text-purple-400 font-bold uppercase tracking-wider hover:underline cursor-pointer">
                            View All Recommendations &rarr;
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3 mt-0.5 text-[8.5px]">
                      <div className="flex items-center gap-1.5 text-zinc-550 font-semibold font-mono">
                        <svg className="w-3.5 h-3.5 text-zinc-650 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                        </svg>
                        <span>Auto Refresh: <span className="text-emerald-400 font-extrabold">ON</span></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="px-4 py-2 border border-zinc-800 hover:border-zinc-750 hover:bg-zinc-900/30 text-zinc-300 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <svg className="w-3 h-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                          </svg>
                          <span>Download Report</span>
                        </button>
                        <button
                          type="button"
                          className="px-4.5 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Explore Detailed Diagnostics</span>
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-zinc-800/80 pt-3 mt-1 text-[8px] text-zinc-500 tracking-wider font-mono">
          <span>PROVENANCE PIPELINE DIAGNOSTIC VIEW</span>
          <span className="italic">Click on any step card above to see the corresponding deep-dive panel.</span>
        </div>

      </div>
    </div>
  );
};
