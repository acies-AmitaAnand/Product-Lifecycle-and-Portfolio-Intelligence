import React, { useState, useEffect } from 'react';
import { 
  Filter, RefreshCw, Download, Zap, BarChart2, PieChart as PieIcon, Shield, ShieldAlert, DollarSign, Activity, Play, Check, AlertTriangle, Rocket, TrendingUp, Grid, Table, X, Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  PieChart, Pie, AreaChart, Area
} from 'recharts';
import { ResolveEscalationModal, VPEscalation } from './ResolveEscalationModal';
import { EmailComposerModal } from '../portfolio-health/EmailComposerModal';
import { SuccessFeedbackModal } from '../portfolio-health/SuccessFeedbackModal';
import { AIPredictionModal } from '../signals-board/AIPredictionModal';

const RECIPIENT_TITLES: Record<string, string> = {
  'ananya.sen@aciesglobal.com': 'VP Finance',
  'vikram.solanki@aciesglobal.com': 'QC Manager & Logistics Lead',
  'priya.sharma@aciesglobal.com': 'Brand Director',
  'rajendra.patel@aciesglobal.com': 'Vapi Hub Director',
  'amit.verma@aciesglobal.com': 'NPD Lead',
  'karan.johar@aciesglobal.com': 'Retail Relations Director'
};

interface VPLaunchProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  region: string;
  stage: 'Ideation' | 'Development' | 'Testing' | 'Pre-market' | 'Launch';
  quarter: string;
  readiness: number;
  risk: 'High' | 'Medium' | 'Low';
  revExposure: number;
  budget: number;
  spent: number;
  owner: string;
}

const VP_PRODUCTS: VPLaunchProduct[] = [
  { id: 'LP01', name: 'BrandA Premium Energy', category: 'Beverages', brand: 'BrandA', region: 'APAC', stage: 'Pre-market', quarter: 'Q2 2026', readiness: 95, risk: 'Low', revExposure: 1.2, budget: 0.8, spent: 0.75, owner: 'John D.' },
  { id: 'LP02', name: 'BrandB Chips Pro', category: 'Snacks', brand: 'BrandB', region: 'Americas', stage: 'Launch', quarter: 'Q2 2026', readiness: 99, risk: 'Low', revExposure: 1.5, budget: 1.0, spent: 1.0, owner: 'Mike T.' },
  { id: 'LP03', name: 'BrandF Eco Water', category: 'Beverages', brand: 'BrandF', region: 'APAC', stage: 'Testing', quarter: 'Q2 2026', readiness: 88, risk: 'Low', revExposure: 0.9, budget: 0.6, spent: 0.55, owner: 'Dave P.' },
  { id: 'LP04', name: 'BrandD Yogurt Drink', category: 'Beverages', brand: 'BrandD', region: 'EMEA', stage: 'Testing', quarter: 'Q3 2026', readiness: 86, risk: 'Low', revExposure: 0.5, budget: 0.3, spent: 0.25, owner: 'Sarah K.' },
  { id: 'LP05', name: 'BrandB Tortilla Chips', category: 'Snacks', brand: 'BrandB', region: 'Americas', stage: 'Pre-market', quarter: 'Q2 2026', readiness: 88, risk: 'Low', revExposure: 1.1, budget: 0.7, spent: 0.65, owner: 'Mike T.' },
  { id: 'LP06', name: 'BrandF Alkaline Water', category: 'Beverages', brand: 'BrandF', region: 'India', stage: 'Pre-market', quarter: 'Q2 2026', readiness: 97, risk: 'Low', revExposure: 0.4, budget: 0.3, spent: 0.28, owner: 'Dave P.' },
  { id: 'LP07', name: 'BrandA Soy Milk', category: 'Beverages', brand: 'BrandA', region: 'APAC', stage: 'Pre-market', quarter: 'Q3 2026', readiness: 90, risk: 'Low', revExposure: 0.8, budget: 0.5, spent: 0.48, owner: 'John D.' },
  { id: 'LP08', name: 'BrandD Greek Yogurt', category: 'Snacks', brand: 'BrandD', region: 'India', stage: 'Launch', quarter: 'Q2 2026', readiness: 99, risk: 'Low', revExposure: 1.3, budget: 0.8, spent: 0.8, owner: 'Sarah K.' },
  { id: 'LP09', name: 'BrandE Face Scrub', category: 'Personal Care', brand: 'BrandE', region: 'EMEA', stage: 'Testing', quarter: 'Q3 2026', readiness: 85, risk: 'Low', revExposure: 0.7, budget: 0.4, spent: 0.32, owner: 'Anna L.' },
  { id: 'LP10', name: 'BrandG Floor Wipes', category: 'Household', brand: 'BrandG', region: 'EMEA', stage: 'Testing', quarter: 'Q2 2026', readiness: 95, risk: 'Low', revExposure: 0.6, budget: 0.4, spent: 0.38, owner: 'Tom H.' },
  { id: 'LP11', name: 'BrandH Laundry Pods', category: 'Household', brand: 'BrandH', region: 'India', stage: 'Testing', quarter: 'Q3 2026', readiness: 88, risk: 'Low', revExposure: 1.2, budget: 0.8, spent: 0.6, owner: 'Vicky S.' },
  { id: 'LP12', name: 'BrandH Fabric Sheets', category: 'Household', brand: 'BrandH', region: 'Americas', stage: 'Pre-market', quarter: 'Q3 2026', readiness: 89, risk: 'Low', revExposure: 0.5, budget: 0.3, spent: 0.26, owner: 'Vicky S.' },
  { id: 'LP13', name: 'BrandB Potato Crisps', category: 'Snacks', brand: 'BrandB', region: 'APAC', stage: 'Testing', quarter: 'Q2 2026', readiness: 90, risk: 'Low', revExposure: 1.1, budget: 0.7, spent: 0.62, owner: 'Mike T.' },
  { id: 'LP14', name: 'BrandE Hand Wash', category: 'Personal Care', brand: 'BrandE', region: 'APAC', stage: 'Pre-market', quarter: 'Q4 2026', readiness: 85, risk: 'Low', revExposure: 0.9, budget: 0.5, spent: 0.45, owner: 'Anna L.' },
  { id: 'LP15', name: 'BrandA Energy Gel', category: 'Beverages', brand: 'BrandA', region: 'EMEA', stage: 'Pre-market', quarter: 'Q4 2026', readiness: 86, risk: 'Low', revExposure: 0.8, budget: 0.5, spent: 0.44, owner: 'John D.' },
  { id: 'LP16', name: 'BrandE Hair Serum', category: 'Personal Care', brand: 'BrandE', region: 'India', stage: 'Pre-market', quarter: 'Q4 2026', readiness: 87, risk: 'Low', revExposure: 0.7, budget: 0.4, spent: 0.35, owner: 'Anna L.' },
  { id: 'LP17', name: 'BrandG Dish Spray', category: 'Household', brand: 'BrandG', region: 'APAC', stage: 'Development', quarter: 'Q4 2026', readiness: 85, risk: 'Low', revExposure: 0.9, budget: 0.6, spent: 0.4, owner: 'Tom H.' },
  { id: 'LP18', name: 'BrandH Iron Spray', category: 'Household', brand: 'BrandH', region: 'EMEA', stage: 'Ideation', quarter: 'Q4 2026', readiness: 82, risk: 'Low', revExposure: 0.4, budget: 0.3, spent: 0.1, owner: 'Vicky S.' },
  { id: 'LP19', name: 'BrandD Organic Yogurt', category: 'Snacks', brand: 'BrandD', region: 'EMEA', stage: 'Pre-market', quarter: 'Q3 2026', readiness: 74, risk: 'Medium', revExposure: 0.8, budget: 0.5, spent: 0.4, owner: 'Sarah K.' },
  { id: 'LP20', name: 'BrandA Fruit Punch', category: 'Beverages', brand: 'BrandA', region: 'India', stage: 'Pre-market', quarter: 'Q3 2026', readiness: 65, risk: 'Medium', revExposure: 0.7, budget: 0.4, spent: 0.3, owner: 'John D.' },
  { id: 'LP21', name: 'BrandB Pretzel Sticks', category: 'Snacks', brand: 'BrandB', region: 'EMEA', stage: 'Development', quarter: 'Q4 2026', readiness: 71, risk: 'Medium', revExposure: 0.6, budget: 0.4, spent: 0.2, owner: 'Mike T.' },
  { id: 'LP22', name: 'BrandE Body Lotion', category: 'Personal Care', brand: 'BrandE', region: 'Americas', stage: 'Development', quarter: 'Q4 2026', readiness: 62, risk: 'Medium', revExposure: 1.0, budget: 0.6, spent: 0.3, owner: 'Anna L.' },
  { id: 'LP23', name: 'BrandG Glass Cleaner', category: 'Household', brand: 'BrandG', region: 'Americas', stage: 'Pre-market', quarter: 'Q3 2026', readiness: 60, risk: 'Medium', revExposure: 0.8, budget: 0.5, spent: 0.35, owner: 'Tom H.' },
  { id: 'LP24', name: 'BrandC Biscuits Eco', category: 'Snacks', brand: 'BrandC', region: 'EMEA', stage: 'Development', quarter: 'Q4 2026', readiness: 42, risk: 'High', revExposure: 2.1, budget: 1.2, spent: 0.6, owner: 'Lisa R.' },
  { id: 'LP25', name: 'BrandC Chocolate Oats', category: 'Snacks', brand: 'BrandC', region: 'Americas', stage: 'Pre-market', quarter: 'Q4 2026', readiness: 48, risk: 'High', revExposure: 2.1, budget: 1.5, spent: 0.8, owner: 'Lisa R.' }
];

interface VPLaunchReadinessViewProps {
  isDarkMode: boolean;
  simulateDelay?: boolean;
  setSimulateDelay?: (v: boolean) => void;
  onAuditClick?: (metric: string) => void;
}

export const VPLaunchReadinessView: React.FC<VPLaunchReadinessViewProps> = ({ 
  isDarkMode, 
  simulateDelay: propSimulateDelay, 
  setSimulateDelay: propSetSimulateDelay,
  onAuditClick
}) => {
  const [filterRegion, setFilterRegion] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [filterQuarter, setFilterQuarter] = useState('All');
  const [pipelineView, setPipelineView] = useState<'bar' | 'pie'>('bar');
  const [predictionsView, setPredictionsView] = useState<'grid' | 'table'>('grid');
  const [financialView, setFinancialView] = useState<'bar' | 'area' | 'radar'>('bar');
  const [localSimulateDelay, setLocalSimulateDelay] = useState(false);
  const simulateDelay = propSimulateDelay !== undefined ? propSimulateDelay : localSimulateDelay;
  const setSimulateDelay = propSetSimulateDelay !== undefined ? propSetSimulateDelay : setLocalSimulateDelay;
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [toasts, setToasts] = useState<{ id: string; title: string; body: string; color: string }[]>([]);
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);
  const [predictionModalType, setPredictionModalType] = useState<'stockout' | 'elasticity' | 'margin' | 'demand' | 'delay' | null>(null);
  const [selectedStageSKUs, setSelectedStageSKUs] = useState<{ title: string; meaning?: string; skus: VPLaunchProduct[] } | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastRefreshed(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const addToast = (title: string, body: string, color: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, body, color }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const [escalations, setEscalations] = useState([
    { id: 'esc1', title: 'Packaging Material Shortage', sub: 'BrandC Biscuits Eco', severity: 'High', impact: '15d Launch Delay', status: 'Pending', color: '#ef4444' },
    { id: 'esc2', title: 'EU Regulatory Approval', sub: 'BrandC Chocolate Oats', severity: 'Medium', impact: 'EU Market Hold', status: 'Pending', color: '#f59e0b' },
    { id: 'esc3', title: 'Co-packer Capacity Constraint', sub: 'BrandD Organic Yogurt', severity: 'High', impact: '₹10Cr Revenue Risk', status: 'Pending', color: '#ef4444' },
    { id: 'esc4', title: 'Label Compliance Issue', sub: 'BrandG Glass Cleaner', severity: 'Low', impact: 'Minor packaging rerun', status: 'Pending', color: '#3b82f6' }
  ]);

  const [activeResolveEscalation, setActiveResolveEscalation] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerEmail, setComposerEmail] = useState({ to: '', name: '', subject: '', body: '', action: '' });
  const [successFeedback, setSuccessFeedback] = useState<{
    isOpen: boolean;
    recipientName: string;
    recipientTitle: string;
    recipientEmail: string;
    contextType: 'approval' | 'bottleneck' | 'signal';
    contextTitle: string;
    channel: 'email' | 'message';
  } | null>(null);

  const handleResolveEscalation = (id: string, title: string, actionMsg: string) => {
    setEscalations(prev => prev.filter(e => e.id !== id));
    addToast('Escalation Resolved', `${title}: ${actionMsg}`, '#10b981');
  };

  const [mitigatedStages, setMitigatedStages] = useState<string[]>([]);

  const processedProducts = VP_PRODUCTS.map(p => {
    let readiness = p.readiness;
    let risk = p.risk;
    let spent = p.spent;

    if (simulateDelay && p.region === 'APAC') {
      readiness = Math.max(0, p.readiness - 15);
      risk = readiness < 50 ? 'High' : readiness < 75 ? 'Medium' : p.risk;
    }

    if (mitigatedStages.includes(p.stage)) {
      readiness = Math.min(100, readiness + 15);
      if (risk === 'High') {
        risk = 'Medium';
      } else if (risk === 'Medium') {
        risk = 'Low';
      }
      spent = parseFloat((spent * 1.15).toFixed(2));
    }

    return {
      ...p,
      readiness,
      risk,
      spent
    };
  });

  const filteredProducts = processedProducts.filter(p => {
    const matchRegion = filterRegion === 'All' || p.region === filterRegion;
    const matchCategory = filterCategory === 'All' || p.category === filterCategory;
    const matchRisk = filterRisk === 'All' || p.risk === matchRiskFilterHelper(filterRisk);
    const matchQuarter = filterQuarter === 'All' || p.quarter === filterQuarter;
    return matchRegion && matchCategory && matchRisk && matchQuarter;
  });

  function matchRiskFilterHelper(filter: string) {
    if (filter === 'High Risk') return 'High';
    if (filter === 'Medium Risk') return 'Medium';
    if (filter === 'Low Risk') return 'Low';
    return filter;
  }

  const totalLaunches = filteredProducts.length;
  const onTrackCount = filteredProducts.filter(p => p.readiness >= 75).length;
  const atRiskCount = filteredProducts.filter(p => p.readiness >= 50 && p.readiness < 75).length;
  const delayedCount = filteredProducts.filter(p => p.readiness < 50).length;
  
  const overallReadiness = totalLaunches > 0 
    ? Math.round(filteredProducts.reduce((sum, p) => sum + p.readiness, 0) / totalLaunches)
    : 0;

  const revenueExposure = filteredProducts.reduce((sum, p) => {
    if (p.readiness < 75) {
      return sum + p.revExposure;
    }
    return sum;
  }, 0);

  const marketCoverage = totalLaunches > 0 
    ? Math.min(100, Math.round((filteredProducts.filter(p => p.readiness >= 75).length / totalLaunches) * 94 + 6))
    : 0;

  const pipelineCounts = {
    Ideation: filteredProducts.filter(p => p.stage === 'Ideation').length,
    Development: filteredProducts.filter(p => p.stage === 'Development').length,
    Testing: filteredProducts.filter(p => p.stage === 'Testing').length,
    'Pre-market': filteredProducts.filter(p => p.stage === 'Pre-market').length,
    Launch: filteredProducts.filter(p => p.stage === 'Launch').length,
  };

  const activePipelineSKUs = filteredProducts.length;
  const launchedCount = pipelineCounts.Launch;
  const nearLaunchCount = pipelineCounts['Pre-market'];
  const inDevelopmentPlus = pipelineCounts.Ideation + pipelineCounts.Development + pipelineCounts.Testing;

  const pipelineChartData = [
    { name: 'Ideation', count: pipelineCounts.Ideation, fill: '#b4aceb' },
    { name: 'Development', count: pipelineCounts.Development, fill: '#8e7bf5' },
    { name: 'Testing', count: pipelineCounts.Testing, fill: '#634bf6' },
    { name: 'Pre-market', count: pipelineCounts['Pre-market'], fill: '#2563eb' },
    { name: 'Launch', count: pipelineCounts.Launch, fill: '#10b981' }
  ];

  const baseRadarData = [
    { subject: 'Marketing', Actual: 85, Target: 90 },
    { subject: 'Supply Chain', Actual: 72, Target: 85 },
    { subject: 'Manufacturing', Actual: 80, Target: 88 },
    { subject: 'Finance', Actual: 92, Target: 90 },
    { subject: 'Sales Enablement', Actual: 78, Target: 85 },
    { subject: 'Regulatory', Actual: 68, Target: 85 },
    { subject: 'Procurement', Actual: 75, Target: 80 },
  ];

  const radarData = baseRadarData.map(r => {
    if (simulateDelay) {
      if (r.subject === 'Supply Chain') return { ...r, Actual: Math.max(0, r.Actual - 12) };
      if (r.subject === 'Manufacturing') return { ...r, Actual: Math.max(0, r.Actual - 8) };
    }
    return r;
  });

  const regionsList = ['APAC', 'EMEA', 'Americas', 'India'];
  const categoriesList = ['Beverages', 'Snacks', 'Personal Care', 'Household'];
  const getHeatmapVal = (cat: string, reg: string) => {
    const matchProds = filteredProducts.filter(p => p.category === cat && p.region === reg);
    if (matchProds.length === 0) return null;
    return Math.round(matchProds.reduce((sum, p) => sum + p.readiness, 0) / matchProds.length);
  };

  const financialData = categoriesList.map(cat => {
    const catProds = filteredProducts.filter(p => p.category === cat);
    const revenue = catProds.reduce((sum, p) => sum + p.revExposure, 0) * 10;
    const budget = catProds.reduce((sum, p) => sum + p.budget, 0);
    const spent = catProds.reduce((sum, p) => sum + p.spent, 0);
    
    // Calculate values that scale with filters but match the template perfectly when unfiltered
    let revAtRisk = revenue;
    let mitCost = spent;
    let projSavings = budget;
    
    if (cat === 'Beverages') {
      mitCost = spent * 2.62;
      projSavings = budget * 3.53;
    } else if (cat === 'Snacks') {
      mitCost = spent * 2.14;
      projSavings = budget * 2.70;
    } else if (cat === 'Personal Care') {
      mitCost = spent * 4.93;
      projSavings = budget * 4.21;
    } else if (cat === 'Household') {
      mitCost = spent * 4.31;
      projSavings = budget * 3.45;
    }
    
    return {
      name: cat,
      'Proj Rev (₹ Cr)': parseFloat(revenue.toFixed(1)),
      'Budget ($M)': parseFloat(budget.toFixed(1)),
      'Spent ($M)': parseFloat(spent.toFixed(1)),
      'Revenue at risk': parseFloat(revAtRisk.toFixed(1)),
      'Mitigation cost': parseFloat(mitCost.toFixed(1)),
      'Projected savings': parseFloat(projSavings.toFixed(1))
    };
  });

  const radius = 54;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallReadiness / 100) * circumference;

  const stagesList: ('Ideation' | 'Development' | 'Testing' | 'Pre-market' | 'Launch')[] = 
    ['Ideation', 'Development', 'Testing', 'Pre-market', 'Launch'];

  const simulatorChartData = stagesList.map(st => {
    const baseProds = VP_PRODUCTS.map(p => {
      let readiness = p.readiness;
      let risk = p.risk;
      let spent = p.spent;
      if (simulateDelay && p.region === 'APAC') {
        readiness = Math.max(0, p.readiness - 15);
        risk = readiness < 50 ? 'High' : readiness < 75 ? 'Medium' : p.risk;
      }
      return { ...p, readiness, risk, spent };
    }).filter(p => p.stage === st);

    const simProds = processedProducts.filter(p => p.stage === st);

    const baseCost = baseProds.reduce((sum, p) => sum + p.spent, 0);
    const simCost = simProds.reduce((sum, p) => sum + p.spent, 0);

    const baseRiskRev = baseProds.reduce((sum, p) => p.readiness < 75 ? sum + p.revExposure : sum, 0);
    const simRiskRev = simProds.reduce((sum, p) => p.readiness < 75 ? sum + p.revExposure : sum, 0);

    return {
      stage: st,
      'Base Cost (₹ Cr)': parseFloat(baseCost.toFixed(2)),
      'Sim Cost (₹ Cr)': parseFloat(simCost.toFixed(2)),
      'Base Risk Rev (₹ Cr)': parseFloat(baseRiskRev.toFixed(2)),
      'Sim Risk Rev (₹ Cr)': parseFloat(simRiskRev.toFixed(2)),
    };
  });

  const totalBaseSpent = VP_PRODUCTS.map(p => {
    let spent = p.spent;
    return spent;
  }).reduce((sum, s) => sum + s, 0);

  const totalSimSpent = processedProducts.reduce((sum, p) => sum + p.spent, 0);
  const spentVariance = parseFloat((totalSimSpent - totalBaseSpent).toFixed(2));

  const totalBaseExposure = VP_PRODUCTS.map(p => {
    let readiness = p.readiness;
    if (simulateDelay && p.region === 'APAC') {
      readiness = Math.max(0, p.readiness - 15);
    }
    return { ...p, readiness };
  }).reduce((sum, p) => p.readiness < 75 ? sum + p.revExposure : sum, 0);

  const totalSimExposure = processedProducts.reduce((sum, p) => p.readiness < 75 ? sum + p.revExposure : sum, 0);
  const exposureReduced = parseFloat((totalBaseExposure - totalSimExposure).toFixed(2));
  const roiMitigation = spentVariance > 0 ? parseFloat((exposureReduced / spentVariance).toFixed(1)) : 0;


  const handleExport = () => {
    const link = document.createElement('a');
    link.href = '/portfolio_health_guide.pdf';
    link.download = 'portfolio_health_guide.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Executive Summary Downloaded', 'Downloading Portfolio Health Map Executive Guide (PDF).', '#10b981');
  };

  return (
    <div className="space-y-6">
      {/* Filters + Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-2 rounded-sm shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-2 py-1.5 rounded-sm">
            <Filter size={11} className="text-[#6d28d9] dark:text-[#a78bfa] shrink-0" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Filters</span>
          </div>

          <select 
            value={filterRegion} 
            onChange={(e) => setFilterRegion(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-[9px] font-bold text-zinc-650 dark:text-zinc-350 outline-none cursor-pointer"
          >
            <option value="All">All Regions</option>
            <option value="APAC">APAC</option>
            <option value="EMEA">EMEA</option>
            <option value="Americas">Americas</option>
            <option value="India">India</option>
          </select>

          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-[9px] font-bold text-zinc-650 dark:text-zinc-350 outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Beverages">Beverages</option>
            <option value="Snacks">Snacks</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Household">Household</option>
          </select>

          <select 
            value={filterRisk} 
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-[9px] font-bold text-zinc-650 dark:text-zinc-350 outline-none cursor-pointer"
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>

          <select 
            value={filterQuarter} 
            onChange={(e) => setFilterQuarter(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-[9px] font-bold text-zinc-650 dark:text-zinc-350 outline-none cursor-pointer"
          >
            <option value="All">All Quarters</option>
            <option value="Q2 2026">Q2 2026</option>
            <option value="Q3 2026">Q3 2026</option>
            <option value="Q4 2026">Q4 2026</option>
          </select>

          {(filterRegion !== 'All' || filterCategory !== 'All' || filterRisk !== 'All' || filterQuarter !== 'All') && (
            <button 
              onClick={() => { setFilterRegion('All'); setFilterCategory('All'); setFilterRisk('All'); setFilterQuarter('All'); }}
              className="text-[9px] text-[#6d28d9] dark:text-[#a78bfa] font-bold uppercase tracking-wider hover:underline px-1 cursor-pointer bg-transparent border-none"
            >
              Reset
            </button>
          )}
        </div>

        <button 
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-[9px] font-bold uppercase tracking-wider rounded-sm text-zinc-600 dark:text-zinc-400 cursor-pointer"
        >
          <Download size={11} />
          Export
        </button>
      </div>

      {/* Row 1: Executive Readiness Score (Top Section) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Circular Gauge Banner */}
        <div className="xl:col-span-3 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-5 rotate-12 pointer-events-none text-[#6d28d9] dark:text-[#a78bfa]">
            <Rocket size={100} />
          </div>
          
          <div 
            onClick={() => onAuditClick?.('Overall Readiness %')}
            className="relative flex items-center justify-center shrink-0 w-32 h-32 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
            title="Click to audit Overall Launch Readiness"
          >
            <svg className="w-32 h-32 transform -rotate-90">
              <circle 
                cx="64" 
                cy="64" 
                r={radius} 
                className="text-black/5 dark:text-white/5" 
                strokeWidth={strokeWidth} 
                stroke="currentColor" 
                fill="transparent" 
              />
              <circle 
                cx="64" 
                cy="64" 
                r={radius} 
                className="text-[#6d28d9] dark:text-[#a78bfa]" 
                strokeWidth={strokeWidth} 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="transparent" 
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-display font-black text-zinc-850 dark:text-zinc-150">{overallReadiness}%</span>
              <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold leading-none mt-0.5">Ready</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#6d28d9] dark:text-[#a78bfa]">Hero Metric</span>
            <h3 className="text-sm font-display font-extrabold text-zinc-800 dark:text-zinc-200">Overall Launch Readiness</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug max-w-[200px]">
              Average score across {totalLaunches} active pipeline SKUs.
            </p>
            <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-emerald-500 mt-1">
              <TrendingUp size={11} />
              <span>+2.4% vs last week</span>
            </div>
          </div>
        </div>

        {/* Right KPI Cards Grid */}
        <div className="xl:col-span-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
          
          <div 
            onClick={() => setSelectedStageSKUs({
              title: 'On Track Launches',
              meaning: 'SKUs with a Launch Readiness Score of 75% or higher, indicating that all major activities (regulatory compliance, marketing plans, inventory routing) are progressing optimally with low risk of launch delay.',
              skus: filteredProducts.filter(p => p.readiness >= 75)
            })}
            className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-sm shadow-sm flex flex-col justify-between h-24 hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">On Track</p>
            <h4 className="text-xl font-display font-extrabold text-emerald-500 leading-none">{onTrackCount}</h4>
            <p className="text-[9px] text-zinc-400 font-semibold uppercase">Status: Optimal</p>
          </div>

          <div 
            onClick={() => setSelectedStageSKUs({
              title: 'Delayed Launches',
              meaning: 'SKUs with a Launch Readiness Score below 50%. These have encountered critical bottlenecks (such as severe supply chain delays or lack of regulatory approvals) and require immediate executive attention and mitigation.',
              skus: filteredProducts.filter(p => p.readiness < 50)
            })}
            className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-sm shadow-sm flex flex-col justify-between h-24 hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Delayed</p>
            <h4 className="text-xl font-display font-extrabold text-red-500 leading-none">{delayedCount}</h4>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Needs Focus</p>
          </div>

          <div 
            onClick={() => setSelectedStageSKUs({
              title: 'At Risk Launches',
              meaning: 'SKUs with a Launch Readiness Score between 50% and 74%. These are demonstrating early warning signs or minor deviations from target timelines, requiring active supervision and preventative measures.',
              skus: filteredProducts.filter(p => p.readiness >= 50 && p.readiness < 75)
            })}
            className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-sm shadow-sm flex flex-col justify-between h-24 hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">At Risk</p>
            <h4 className="text-xl font-display font-extrabold text-amber-500 leading-none">{atRiskCount}</h4>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Watching</p>
          </div>

          <div 
            onClick={() => setSelectedStageSKUs({
              title: 'Next 60 Days Pipeline',
              meaning: 'SKUs currently in the active pipeline (Development, Testing, or Pre-market phases) scheduled to transition to market launch within the upcoming 60-day window.',
              skus: filteredProducts.filter(p => p.stage !== 'Launch' && p.stage !== 'Ideation')
            })}
            className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-sm shadow-sm flex flex-col justify-between h-24 hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Next 60 Days</p>
            <h4 className="text-xl font-display font-extrabold text-blue-500 leading-none">
              {filteredProducts.filter(p => p.stage !== 'Launch' && p.stage !== 'Ideation').length}
            </h4>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Readying</p>
          </div>

          <div 
            onClick={() => setSelectedStageSKUs({
              title: 'Revenue Exposure',
              meaning: 'The total potential revenue at stake from launches that are currently Delayed or At Risk (Launch Readiness Score below 75%). This helps prioritize resource allocation based on financial impact.',
              skus: filteredProducts.filter(p => p.readiness < 75)
            })}
            className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-sm shadow-sm flex flex-col justify-between h-24 hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Rev Exposure</p>
            <h4 className="text-xl font-display font-extrabold text-orange-500 leading-none">
              ${revenueExposure.toFixed(1)}M
            </h4>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">At-Risk/Delayed</p>
          </div>

          <div 
            onClick={() => setSelectedStageSKUs({
              title: 'Market Coverage Scope',
              meaning: 'Geographic deployment and readiness metric representing the percentage of target regions or distribution nodes that have successfully completed all pre-market requirements.',
              skus: filteredProducts
            })}
            className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-sm shadow-sm flex flex-col justify-between h-24 hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Market Coverage</p>
            <h4 className="text-xl font-display font-extrabold text-[#6d28d9] dark:text-[#a78bfa] leading-none">
              {marketCoverage}%
            </h4>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Geo Readiness</p>
          </div>

        </div>

        {/* Risk & Escalation Center */}
        <div className="xl:col-span-4 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Risk & Escalation Center</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                {escalations.length} unresolved delays
              </span>
            </div>

            <div className="space-y-2 max-h-[148px] overflow-y-auto pr-1">
              {escalations.length > 0 ? (
                escalations.map(esc => (
                  <div key={esc.id} className="p-2 px-2.5 border border-black/5 dark:border-white/10 rounded-sm bg-zinc-50/50 dark:bg-white/5 flex items-start gap-2.5 justify-between">
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: esc.color }} />
                      <div className="min-w-0">
                        <h4 className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 truncate" title={esc.title}>{esc.title}</h4>
                        <p className="text-[8.5px] text-zinc-500 mt-0.5 truncate">{esc.sub} · <span className="font-semibold text-red-500">{esc.impact}</span></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveResolveEscalation(esc.id)}
                      className="px-1.5 py-0.5 shrink-0 border border-[#6d28d9]/35 text-[#6d28d9] dark:text-[#a78bfa] bg-[#6d28d9]/5 hover:bg-[#6d28d9] hover:text-white rounded-sm text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer font-sans"
                    >
                      Resolve
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-[10px] text-zinc-500 py-12">✓ All escalations cleared</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Launch Pipeline Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Launch Pipeline Overview */}
        <div className="xl:col-span-12 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Launch Pipeline Overview</span>
            <div className="flex items-center gap-3">
              <span className="text-[8px] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                {activePipelineSKUs} active pipeline SKUs
              </span>
              <div className="flex items-center border border-black/10 dark:border-white/10 rounded-md overflow-hidden bg-black/5 dark:bg-white/5 p-0.5 ml-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setPipelineView('bar')}
                  className={`p-1.5 px-2.5 transition-all cursor-pointer border-none flex items-center justify-center rounded-sm shrink-0 ${
                    pipelineView === 'bar'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-transparent'
                  }`}
                  title="Bar Chart"
                >
                  <BarChart2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setPipelineView('pie')}
                  className={`p-1.5 px-2.5 transition-all cursor-pointer border-none flex items-center justify-center rounded-sm shrink-0 ${
                    pipelineView === 'pie'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-transparent'
                  }`}
                  title="Pie Chart"
                >
                  <PieIcon size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div 
              onClick={() => setSelectedStageSKUs({
                title: 'Active pipeline SKUs',
                skus: filteredProducts
              })}
              className="bg-zinc-100/80 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 p-2.5 px-3 rounded-sm hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <p className="text-[9px] font-bold text-zinc-400">Active pipeline SKUs</p>
              <h4 className="text-xl font-display font-extrabold text-zinc-850 dark:text-white mt-1 leading-none">{activePipelineSKUs}</h4>
            </div>

            <div 
              onClick={() => setSelectedStageSKUs({
                title: 'In development+ SKUs',
                skus: filteredProducts.filter(p => p.stage === 'Ideation' || p.stage === 'Development' || p.stage === 'Testing')
              })}
              className="bg-zinc-100/80 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 p-2.5 px-3 rounded-sm hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <p className="text-[9px] font-bold text-zinc-400">In development+</p>
              <h4 className="text-xl font-display font-extrabold text-zinc-850 dark:text-white mt-1 leading-none">{inDevelopmentPlus}</h4>
            </div>

            <div 
              onClick={() => setSelectedStageSKUs({
                title: 'Near launch SKUs',
                skus: filteredProducts.filter(p => p.stage === 'Pre-market')
              })}
              className="bg-zinc-100/80 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 p-2.5 px-3 rounded-sm hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <p className="text-[9px] font-bold text-zinc-400">Near launch</p>
              <h4 className="text-xl font-display font-extrabold text-zinc-850 dark:text-white mt-1 leading-none">{nearLaunchCount}</h4>
            </div>

            <div 
              onClick={() => setSelectedStageSKUs({
                title: 'Launched SKUs',
                skus: filteredProducts.filter(p => p.stage === 'Launch')
              })}
              className="bg-zinc-100/80 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 p-2.5 px-3 rounded-sm hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <p className="text-[9px] font-bold text-zinc-400">Launched</p>
              <h4 className="text-xl font-display font-extrabold text-zinc-850 dark:text-white mt-1 leading-none">{launchedCount}</h4>
            </div>
          </div>

          {pipelineView === 'bar' ? (
            <>
              {/* Bar Chart */}
              <div className="h-56 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 8]} ticks={[0, 2, 4, 6, 8]} />
                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', color: isDarkMode ? '#fff' : '#000' }} />
                    <Bar dataKey="count" radius={[2, 2, 0, 0]} barSize={46}>
                      {pipelineChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-550 dark:text-zinc-400 mt-3 pl-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#634bf6]" />
                  <span className="font-semibold text-zinc-650 dark:text-zinc-300">Early stage (Ideation - Testing)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#2563eb]" />
                  <span className="font-semibold text-zinc-650 dark:text-zinc-300">Late stage (Pre-market - Launch)</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4 h-56 mt-4">
              {/* Donut Chart Container */}
              <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pipelineChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {pipelineChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', color: isDarkMode ? '#fff' : '#000' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-display font-extrabold text-zinc-850 dark:text-white leading-none">
                    {activePipelineSKUs}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
                    SKUs
                  </span>
                </div>
              </div>

              {/* Custom Legend */}
              <div className="flex-1 w-full max-w-xs space-y-1.5">
                {pipelineChartData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: entry.fill }} />
                      <span className="font-semibold text-zinc-650 dark:text-zinc-350">{entry.name}</span>
                    </div>
                    <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{entry.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Financial & AI Predictions */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Financial Impact</span>
            <div className="flex items-center border border-black/10 dark:border-white/10 rounded-md overflow-hidden bg-black/5 dark:bg-white/5 p-0.5 ml-1 shrink-0">
              <button
                type="button"
                onClick={() => setFinancialView('bar')}
                className={`p-1.5 px-2.5 transition-all cursor-pointer border-none flex items-center justify-center rounded-sm shrink-0 ${
                  financialView === 'bar'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-transparent'
                }`}
                title="Bar Chart"
              >
                <BarChart2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => setFinancialView('area')}
                className={`p-1.5 px-2.5 transition-all cursor-pointer border-none flex items-center justify-center rounded-sm shrink-0 ${
                  financialView === 'area'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-transparent'
                }`}
                title="Area Chart"
              >
                <Activity size={14} />
              </button>
              <button
                type="button"
                onClick={() => setFinancialView('radar')}
                className={`p-1.5 px-2.5 transition-all cursor-pointer border-none flex items-center justify-center rounded-sm shrink-0 ${
                  financialView === 'radar'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-transparent'
                }`}
                title="Radar Chart"
              >
                <Layers size={14} />
              </button>
            </div>
          </div>

          <div className="h-56">
            {financialView === 'bar' ? (
              <div className="flex flex-col h-full justify-start">
                {/* Custom HTML Legend */}
                <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-550 dark:text-zinc-400 mb-2 pl-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6]" />
                    <span className="font-semibold text-zinc-650 dark:text-zinc-300">Revenue at risk</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#8b5cf6]" />
                    <span className="font-semibold text-zinc-650 dark:text-zinc-300">Mitigation cost</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]" />
                    <span className="font-semibold text-zinc-650 dark:text-zinc-300">Projected savings</span>
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={financialData}
                      layout="vertical"
                      margin={{ top: 0, right: 10, left: 15, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                        horizontal={false}
                        vertical={true}
                      />
                      <XAxis
                        type="number"
                        domain={[0, 120]}
                        ticks={[0, 20, 40, 60, 80, 100, 120]}
                        tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                        width={80}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
                          border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                          color: isDarkMode ? '#fff' : '#000'
                        }}
                      />
                      <Bar dataKey="Revenue at risk" fill="#3b82f6" radius={[0, 2, 2, 0]} />
                      <Bar dataKey="Mitigation cost" fill="#8b5cf6" radius={[0, 2, 2, 0]} />
                      <Bar dataKey="Projected savings" fill="#10b981" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : financialView === 'area' ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevAtRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorMitCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorProjSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 120]} ticks={[0, 20, 40, 60, 80, 100, 120]} />
                  <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }} />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="square" 
                    iconSize={10} 
                    wrapperStyle={{ fontSize: 9, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em', paddingBottom: '10px' }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Revenue at risk" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevAtRisk)" 
                    dot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: isDarkMode ? '#1f1f1f' : '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Mitigation cost" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorMitCost)" 
                    dot={{ r: 4, stroke: '#8b5cf6', strokeWidth: 2, fill: isDarkMode ? '#1f1f1f' : '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Projected savings" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorProjSavings)" 
                    dot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: isDarkMode ? '#1f1f1f' : '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={financialData} cx="50%" cy="55%" outerRadius="68%">
                  <PolarGrid stroke={isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} />
                  <PolarAngleAxis dataKey="name" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: 9 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 120]} tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 8 }} />
                  <Radar name="Revenue at risk" dataKey="Revenue at risk" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} dot={{ r: 3.5, stroke: '#3b82f6', strokeWidth: 2, fill: isDarkMode ? '#1f1f1f' : '#fff' }} />
                  <Radar name="Mitigation cost" dataKey="Mitigation cost" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} dot={{ r: 3.5, stroke: '#8b5cf6', strokeWidth: 2, fill: isDarkMode ? '#1f1f1f' : '#fff' }} />
                  <Radar name="Projected savings" dataKey="Projected savings" stroke="#10b981" fill="#10b981" fillOpacity={0.15} dot={{ r: 3.5, stroke: '#10b981', strokeWidth: 2, fill: isDarkMode ? '#1f1f1f' : '#fff' }} />
                  <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }} />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="square" 
                    iconSize={10} 
                    wrapperStyle={{ fontSize: 9, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em', paddingBottom: '10px' }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="xl:col-span-5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-[#6d28d9] dark:text-[#a78bfa]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6d28d9] dark:text-[#a78bfa]">AI Risk Predictions</span>
            </div>
            <div className="flex items-center border border-black/10 dark:border-white/10 rounded-md overflow-hidden bg-black/5 dark:bg-white/5 p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setPredictionsView('grid')}
                className={`p-1.5 px-2 transition-all cursor-pointer border-none flex items-center justify-center rounded-sm shrink-0 ${
                  predictionsView === 'grid'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-transparent'
                }`}
                title="Grid View"
              >
                <Grid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setPredictionsView('table')}
                className={`p-1.5 px-2 transition-all cursor-pointer border-none flex items-center justify-center rounded-sm shrink-0 ${
                  predictionsView === 'table'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-transparent'
                }`}
                title="Table View"
              >
                <Table size={14} />
              </button>
            </div>
          </div>

          {predictionsView === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[9px]">
              {/* Card 1: Sourcing Delay */}
              <div 
                onClick={() => { setPredictionModalType('delay'); setIsPredictionModalOpen(true); }}
                className="p-3 bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/15 dark:border-purple-500/20 rounded-sm cursor-pointer hover:scale-[1.02] transition-all flex flex-col justify-between h-24"
              >
                <div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200 text-[10px] leading-tight">⚠️ Sourcing Delay (EMEA)</p>
                  <p className="text-[9px] text-zinc-550 dark:text-zinc-400 mt-1 line-clamp-2">BrandC Snacks packaging material shortage for launch.</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5">
                  <span className="text-[8px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-sm">78% Risk</span>
                  <span className="text-[8px] font-bold text-zinc-700 dark:text-zinc-300">$2.1M Impact</span>
                </div>
              </div>

              {/* Card 2: Launch Supply Shortage */}
              <div 
                onClick={() => { setPredictionModalType('stockout'); setIsPredictionModalOpen(true); }}
                className="p-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 dark:border-red-500/20 rounded-sm cursor-pointer hover:scale-[1.02] transition-all flex flex-col justify-between h-24"
              >
                <div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200 text-[10px] leading-tight">🚨 Launch Supply Shortage (APAC)</p>
                  <p className="text-[9px] text-zinc-550 dark:text-zinc-400 mt-1 line-clamp-2">BrandA Energy safety buffer below threshold for launch.</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5">
                  <span className="text-[8px] font-semibold text-red-600 dark:text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-sm">92% Risk</span>
                  <span className="text-[8px] font-bold text-zinc-700 dark:text-zinc-300">$1.5M Impact</span>
                </div>
              </div>

              {/* Card 3: Launch Cost Overrun */}
              <div 
                onClick={() => { setPredictionModalType('margin'); setIsPredictionModalOpen(true); }}
                className="p-3 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/15 dark:border-amber-500/20 rounded-sm cursor-pointer hover:scale-[1.02] transition-all flex flex-col justify-between h-24"
              >
                <div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200 text-[10px] leading-tight">📉 Launch Cost Overrun</p>
                  <p className="text-[9px] text-zinc-550 dark:text-zinc-400 mt-1 line-clamp-2">BrandC Biscuits setup and marketing over budget.</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5">
                  <span className="text-[8px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-sm">81% Risk</span>
                  <span className="text-[8px] font-bold text-zinc-700 dark:text-zinc-300">$0.9M Impact</span>
                </div>
              </div>

              {/* Card 4: Pilot Production Delay */}
              <div 
                onClick={() => { setPredictionModalType('demand'); setIsPredictionModalOpen(true); }}
                className="p-3 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/15 dark:border-indigo-500/20 rounded-sm cursor-pointer hover:scale-[1.02] transition-all flex flex-col justify-between h-24"
              >
                <div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200 text-[10px] leading-tight">⚡ Pilot Production Delay (APAC)</p>
                  <p className="text-[9px] text-zinc-550 dark:text-zinc-400 mt-1 line-clamp-2">BrandF Eco Water manufacturing certification bottleneck.</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5">
                  <span className="text-[8px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-sm">88% Risk</span>
                  <span className="text-[8px] font-bold text-zinc-700 dark:text-zinc-300">$1.2M Impact</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto overflow-x-auto h-[192px]">
              <table className="w-full text-left text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10 text-zinc-400 font-bold uppercase tracking-wider">
                    <th className="py-2 pb-1.5 font-semibold">Focus Area</th>
                    <th className="py-2 pb-1.5 font-semibold text-center">Risk</th>
                    <th className="py-2 pb-1.5 font-semibold text-right">Rev Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5 text-zinc-600 dark:text-zinc-400">
                  <tr 
                    onClick={() => { setPredictionModalType('delay'); setIsPredictionModalOpen(true); }}
                    className="hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <td className="py-1.5 pr-2 font-medium">
                      <span className="text-zinc-850 dark:text-zinc-150 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors font-bold">⚠️ Sourcing Delay (EMEA)</span>
                      <p className="text-[8px] text-zinc-400 font-normal mt-0.5">BrandC Snacks packaging bottleneck</p>
                    </td>
                    <td className="py-1.5 text-center">
                      <span className="text-purple-600 dark:text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded-sm">78% Risk</span>
                    </td>
                    <td className="py-1.5 text-right font-mono font-bold text-zinc-700 dark:text-zinc-300">$2.1M</td>
                  </tr>
                  <tr 
                    onClick={() => { setPredictionModalType('stockout'); setIsPredictionModalOpen(true); }}
                    className="hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <td className="py-1.5 pr-2 font-medium">
                      <span className="text-zinc-850 dark:text-zinc-150 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors font-bold">🚨 Launch Supply Shortage (APAC)</span>
                      <p className="text-[8px] text-zinc-400 font-normal mt-0.5">BrandA Energy launch inventory deficit</p>
                    </td>
                    <td className="py-1.5 text-center">
                      <span className="text-red-600 dark:text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded-sm">92% Risk</span>
                    </td>
                    <td className="py-1.5 text-right font-mono font-bold text-zinc-700 dark:text-zinc-300">$1.5M</td>
                  </tr>
                  <tr 
                    onClick={() => { setPredictionModalType('margin'); setIsPredictionModalOpen(true); }}
                    className="hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <td className="py-1.5 pr-2 font-medium">
                      <span className="text-zinc-850 dark:text-zinc-150 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-bold">📉 Launch Cost Overrun</span>
                      <p className="text-[8px] text-zinc-400 font-normal mt-0.5">BrandC Biscuits setup cost overrun</p>
                    </td>
                    <td className="py-1.5 text-center">
                      <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-sm">81% Risk</span>
                    </td>
                    <td className="py-1.5 text-right font-mono font-bold text-zinc-700 dark:text-zinc-300">$0.9M</td>
                  </tr>
                  <tr 
                    onClick={() => { setPredictionModalType('demand'); setIsPredictionModalOpen(true); }}
                    className="hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <td className="py-1.5 pr-2 font-medium">
                      <span className="text-zinc-850 dark:text-zinc-150 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-bold">⚡ Pilot Production Delay (APAC)</span>
                      <p className="text-[8px] text-zinc-400 font-normal mt-0.5">BrandF Eco Water certification backlog</p>
                    </td>
                    <td className="py-1.5 text-center">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded-sm">88% Risk</span>
                    </td>
                    <td className="py-1.5 text-right font-mono font-bold text-zinc-700 dark:text-zinc-300">$1.2M</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Risk & Cost Simulator Panel */}
      <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-sm shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-3 border-b border-black/5 dark:border-white/5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Launch Pipeline Stage Risk & Cost Simulator</h3>
            <p className="text-[10px] text-zinc-550 uppercase mt-1">Simulate activating risk mitigation protocols across launch stages to observe cost vs risk reduction trade-offs.</p>
          </div>
          <button
            onClick={() => setMitigatedStages([])}
            className="text-[9px] font-bold text-[#6d28d9] dark:text-[#a78bfa] uppercase border border-[#6d28d9]/35 dark:border-[#a78bfa]/35 bg-purple-500/5 hover:bg-[#6d28d9] hover:text-white px-2.5 py-1 rounded-sm cursor-pointer transition-all"
          >
            Reset Simulator
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Toggles Column */}
          <div className="xl:col-span-5 space-y-3">
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">Mitigation Controls by Stage</span>
            {stagesList.map(st => {
              const isActive = mitigatedStages.includes(st);
              const stageProds = processedProducts.filter(p => p.stage === st);
              const totalProds = stageProds.length;
              const highRiskProds = stageProds.filter(p => p.risk === 'High').length;
              const medRiskProds = stageProds.filter(p => p.risk === 'Medium').length;
              const lowRiskProds = stageProds.filter(p => p.risk === 'Low').length;

              const baselineProds = VP_PRODUCTS.map(p => {
                let readiness = p.readiness;
                let risk = p.risk;
                if (simulateDelay && p.region === 'APAC') {
                  readiness = Math.max(0, p.readiness - 15);
                  risk = readiness < 50 ? 'High' : readiness < 75 ? 'Medium' : p.risk;
                }
                return { ...p, readiness, risk };
              }).filter(p => p.stage === st);

              const baseRiskExposure = baselineProds.reduce((sum, p) => p.readiness < 75 ? sum + p.revExposure : sum, 0);
              const simRiskExposure = stageProds.reduce((sum, p) => p.readiness < 75 ? sum + p.revExposure : sum, 0);

              const baseSpent = baselineProds.reduce((sum, p) => sum + p.spent, 0);
              const simSpent = stageProds.reduce((sum, p) => sum + p.spent, 0);

              return (
                <div 
                  key={st} 
                  className={`p-3.5 border rounded-sm transition-all ${
                    isActive 
                      ? 'border-[#6d28d9]/30 bg-[#6d28d9]/5' 
                      : 'border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">{st}</h4>
                      <p className="text-[9px] text-zinc-500 mt-0.5">{totalProds} SKUs · Risk: {highRiskProds}H, {medRiskProds}M, {lowRiskProds}L</p>
                    </div>
                    <button
                      onClick={() => {
                        if (isActive) {
                          setMitigatedStages(prev => prev.filter(x => x !== st));
                          addToast('Mitigation Deactivated', `${st} stage mitigation protocols disabled.`, '#3b82f6');
                        } else {
                          setMitigatedStages(prev => [...prev, st]);
                          addToast('Mitigation Activated', `${st} stage mitigation protocols deployed.`, '#10b981');
                        }
                      }}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                        isActive ? 'bg-emerald-500' : 'bg-zinc-350 dark:bg-zinc-700'
                      }`}
                      style={{ border: 'none' }}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Dynamic cost/risk display */}
                  <div className="grid grid-cols-2 gap-4 mt-2.5 pt-2.5 border-t border-dashed border-black/5 dark:border-white/5 text-[9px]">
                    <div>
                      <span className="text-zinc-550 dark:text-zinc-400 block">Spent Cost Impact</span>
                      <span className="font-bold font-mono text-zinc-750 dark:text-zinc-200">
                        ₹{baseSpent.toFixed(2)} Cr 
                        {isActive && <span className="text-amber-500 font-bold ml-1">→ ₹{simSpent.toFixed(2)} Cr (+15%)</span>}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-550 dark:text-zinc-400 block">Revenue Risk Exposure</span>
                      <span className="font-bold font-mono text-zinc-750 dark:text-zinc-200">
                        ₹{baseRiskExposure.toFixed(2)} Cr
                        {isActive && (
                          <span className={`${simRiskExposure < baseRiskExposure ? 'text-emerald-500' : 'text-zinc-500'} font-bold ml-1`}>
                            → ₹{simRiskExposure.toFixed(2)} Cr
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart & Summary Column */}
          <div className="xl:col-span-7 flex flex-col justify-between space-y-4">
            {/* Chart Area */}
            <div className="bg-zinc-50/50 dark:bg-white/5 border border-black/5 dark:border-white/5 p-4 rounded-sm">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block mb-3">Cost vs. Revenue Exposure (Baseline vs. Simulated)</span>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={simulatorChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                    <XAxis dataKey="stage" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 8 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 8 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', color: isDarkMode ? '#fff' : '#000', fontSize: 9 }} />
                    <Legend wrapperStyle={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                    <Bar dataKey="Base Cost (₹ Cr)" fill="#a78bfa" radius={[1, 1, 0, 0]} barSize={10} />
                    <Bar dataKey="Sim Cost (₹ Cr)" fill="#6d28d9" radius={[1, 1, 0, 0]} barSize={10} />
                    <Bar dataKey="Base Risk Rev (₹ Cr)" fill="#fca5a5" radius={[1, 1, 0, 0]} barSize={10} />
                    <Bar dataKey="Sim Risk Rev (₹ Cr)" fill="#ef4444" radius={[1, 1, 0, 0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary Statistics Card */}
            <div className="p-4 bg-zinc-150/70 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 rounded-xl space-y-4">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">Simulation Summary & Impact ROI</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[8px] text-zinc-500 block uppercase">Total Cost Slippage</span>
                  <span className="text-sm font-display font-extrabold text-zinc-800 dark:text-white mt-1 block font-mono">
                    +₹{spentVariance.toFixed(2)} Cr
                  </span>
                </div>
                <div>
                  <span className="text-[8px] text-zinc-500 block uppercase">Risk Exposure Mitigated</span>
                  <span className="text-sm font-display font-extrabold text-emerald-500 mt-1 block font-mono">
                    ₹{exposureReduced.toFixed(2)} Cr
                  </span>
                </div>
                <div>
                  <span className="text-[8px] text-zinc-500 block uppercase">Mitigation ROI</span>
                  <span className="text-sm font-display font-extrabold text-purple-500 mt-1 block font-mono">
                    {roiMitigation.toFixed(1)}x
                  </span>
                </div>
                <div>
                  <span className="text-[8px] text-zinc-500 block uppercase">Overall Readiness</span>
                  <span className="text-sm font-display font-extrabold text-blue-500 mt-1 block font-mono">
                    {overallReadiness}%
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/5 text-[9px] text-zinc-500 leading-relaxed font-sans">
                {mitigatedStages.length > 0 ? (
                  <p className="flex items-start gap-1">
                    <Check size={11} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      Active protocols in <strong>{mitigatedStages.join(', ')}</strong> reduce revenue at risk by <strong>₹{exposureReduced.toFixed(2)} Cr</strong> at a spent cost slip of <strong>₹{spentVariance.toFixed(2)} Cr</strong>. This represents a net risk mitigation efficiency of <strong>{roiMitigation.toFixed(1)}x</strong>.
                    </span>
                  </p>
                ) : (
                  <p className="flex items-start gap-1">
                    <Activity size={11} className="text-amber-500 shrink-0 mt-0.5" />
                    <span>No mitigation protocols active. Toggle stage mitigation controls to simulate risk reduction policies.</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Functional Radar */}
      <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Cross-Functional Readiness</p>
        <div className="h-72 max-w-lg mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke={isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: 9 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 8 }} />
              <Radar name="Actual" dataKey="Actual" stroke={isDarkMode ? "#a78bfa" : "#6d28d9"} fill={isDarkMode ? "#a78bfa" : "#6d28d9"} fillOpacity={0.2} />
              <Radar name="Target" dataKey="Target" stroke={isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} fill="transparent" strokeDasharray="3 3" />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }} />
              <Legend wrapperStyle={{ fontSize: 9, textTransform: 'uppercase' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Floating Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map(t => (
          <div 
            key={t.id} 
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            className="pointer-events-auto bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 p-3.5 rounded shadow-lg flex items-start gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: t.color }} />
            <div>
              <h5 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-100">{t.title}</h5>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">{t.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Resolve Sync Meeting Modal */}
      <ResolveEscalationModal
        isOpen={!!activeResolveEscalation}
        escalation={escalations.find(x => x.id === activeResolveEscalation) || null}
        onClose={() => setActiveResolveEscalation(null)}
        onRequestAction={(email, name, subject, body) => {
          setComposerEmail({
            to: email,
            name,
            subject,
            body,
            action: activeResolveEscalation || ''
          });
          setComposerOpen(true);
        }}
      />

      {/* Email Composer Modal */}
      <EmailComposerModal 
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        initialEmail={composerEmail}
        onSend={(name, email, subject, body, channel) => {
          setComposerOpen(false);
          const resolvedTitle = RECIPIENT_TITLES[email.toLowerCase()] || 'Product Lead';
          const escalation = escalations.find(x => x.id === composerEmail.action);
          const title = escalation ? escalation.title : '';
          
          setSuccessFeedback({
            isOpen: true,
            recipientName: name,
            recipientTitle: resolvedTitle,
            recipientEmail: email,
            contextType: 'bottleneck',
            contextTitle: title,
            channel: channel === 'email' ? 'email' : 'message'
          });
          
          addToast(
            'Sync Meeting Invitation Sent', 
            `Meeting invite ${channel === 'email' ? 'email' : 'message'} sent successfully to ${name} (${email}).`, 
            '#10b981'
          );
          
          // Resolve escalation
          setEscalations(prev => prev.filter(e => e.id !== composerEmail.action));
          setActiveResolveEscalation(null);
        }}
      />

      {/* Success Feedback Modal */}
      {successFeedback && (
        <SuccessFeedbackModal
          isOpen={successFeedback.isOpen}
          onClose={() => setSuccessFeedback(null)}
          recipientName={successFeedback.recipientName}
          recipientTitle={successFeedback.recipientTitle}
          recipientEmail={successFeedback.recipientEmail}
          contextType={successFeedback.contextType}
          contextTitle={successFeedback.contextTitle}
          isDarkMode={isDarkMode}
          channel={successFeedback.channel}
        />
      )}

      {/* AI Prediction Explainer Modal */}
      <AIPredictionModal
        isOpen={isPredictionModalOpen}
        onClose={() => setIsPredictionModalOpen(false)}
        predictionType={predictionModalType}
      />

      {/* Stage SKUs List Modal */}
      {selectedStageSKUs && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col animate-scaleIn">
            {/* Header */}
            <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-display font-extrabold text-zinc-850 dark:text-zinc-100">
                  {selectedStageSKUs.title} ({selectedStageSKUs.skus.length})
                </h3>
                <p className="text-[9px] text-zinc-400 uppercase tracking-wider mt-0.5 font-bold">
                  Launch readiness and status breakdown
                </p>
              </div>
              <button 
                onClick={() => setSelectedStageSKUs(null)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3 max-h-[60vh] no-scrollbar">
              {selectedStageSKUs.meaning && (
                <div className="p-3 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/20 rounded-md text-[10px] text-zinc-650 dark:text-zinc-350 leading-relaxed font-sans flex items-start gap-2 mb-3">
                  <span className="text-[#3b82f6] text-xs font-bold mt-0.5">ℹ️</span>
                  <div>
                    <span className="font-extrabold text-zinc-700 dark:text-zinc-200 uppercase tracking-wider text-[9px] block mb-1">KPI Definition</span>
                    {selectedStageSKUs.meaning}
                  </div>
                </div>
              )}
              {selectedStageSKUs.skus.length > 0 ? (
                <div className="border border-black/5 dark:border-white/10 rounded-sm overflow-hidden bg-zinc-50/30 dark:bg-white/5">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-[9px] uppercase tracking-wider text-zinc-450 dark:text-zinc-350 font-extrabold">
                        <th className="p-3">SKU Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Region</th>
                        <th className="p-3">Stage</th>
                        <th className="p-3">Readiness</th>
                        <th className="p-3">Risk</th>
                        <th className="p-3">Rev Exposure</th>
                        <th className="p-3">Owner</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {selectedStageSKUs.skus.map(sku => (
                        <tr 
                          key={sku.id}
                          className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                        >
                          <td className="p-3 font-extrabold text-zinc-850 dark:text-zinc-200">
                            {sku.name}
                            <span className="block text-[8px] text-zinc-400 font-bold uppercase mt-0.5">{sku.brand}</span>
                          </td>
                          <td className="p-3 text-zinc-600 dark:text-zinc-400 font-bold">{sku.category}</td>
                          <td className="p-3 font-semibold text-zinc-600 dark:text-zinc-400">{sku.region}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wide ${
                              sku.stage === 'Launch' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                              sku.stage === 'Pre-market' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                              sku.stage === 'Testing' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' :
                              'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                            }`}>
                              {sku.stage}
                            </span>
                          </td>
                          <td className="p-3 font-bold">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                sku.readiness >= 75 ? 'bg-emerald-500' :
                                sku.readiness >= 50 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`} />
                              <span className={
                                sku.readiness >= 75 ? 'text-emerald-500' :
                                sku.readiness >= 50 ? 'text-amber-500' :
                                'text-red-500'
                              }>{sku.readiness}%</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`font-extrabold ${
                              sku.risk === 'High' ? 'text-red-500' :
                              sku.risk === 'Medium' ? 'text-amber-500' :
                              'text-emerald-500'
                            }`}>
                              {sku.risk}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-zinc-750 dark:text-zinc-350">
                            ${sku.revExposure.toFixed(1)}M
                          </td>
                          <td className="p-3 text-zinc-550 dark:text-zinc-450 font-bold">{sku.owner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs text-zinc-450">No SKUs in this status currently</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-black/5 dark:border-white/5 flex justify-end">
              <button 
                onClick={() => setSelectedStageSKUs(null)}
                className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 rounded-md text-[10px] font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
