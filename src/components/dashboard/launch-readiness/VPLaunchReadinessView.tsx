import React, { useState, useEffect } from 'react';
import { 
  Filter, RefreshCw, Download, Zap, BarChart2, PieChart as PieIcon, Rocket, TrendingUp, Grid, Table
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  PieChart, Pie
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
  stage: 'Ideation' | 'Development' | 'Testing' | 'Regulatory' | 'Production' | 'Market Ready' | 'Launch Completed';
  quarter: string;
  readiness: number;
  risk: 'High' | 'Medium' | 'Low';
  revExposure: number;
  budget: number;
  spent: number;
  owner: string;
}

const VP_PRODUCTS: VPLaunchProduct[] = [
  { id: 'LP01', name: 'BrandA Premium Energy', category: 'Beverages', brand: 'BrandA', region: 'APAC', stage: 'Market Ready', quarter: 'Q2 2026', readiness: 95, risk: 'Low', revExposure: 1.2, budget: 0.8, spent: 0.75, owner: 'John D.' },
  { id: 'LP02', name: 'BrandB Chips Pro', category: 'Snacks', brand: 'BrandB', region: 'Americas', stage: 'Launch Completed', quarter: 'Q2 2026', readiness: 99, risk: 'Low', revExposure: 1.5, budget: 1.0, spent: 1.0, owner: 'Mike T.' },
  { id: 'LP03', name: 'BrandF Eco Water', category: 'Beverages', brand: 'BrandF', region: 'APAC', stage: 'Testing', quarter: 'Q2 2026', readiness: 88, risk: 'Low', revExposure: 0.9, budget: 0.6, spent: 0.55, owner: 'Dave P.' },
  { id: 'LP04', name: 'BrandD Yogurt Drink', category: 'Beverages', brand: 'BrandD', region: 'EMEA', stage: 'Testing', quarter: 'Q3 2026', readiness: 86, risk: 'Low', revExposure: 0.5, budget: 0.3, spent: 0.25, owner: 'Sarah K.' },
  { id: 'LP05', name: 'BrandB Tortilla Chips', category: 'Snacks', brand: 'BrandB', region: 'Americas', stage: 'Production', quarter: 'Q2 2026', readiness: 88, risk: 'Low', revExposure: 1.1, budget: 0.7, spent: 0.65, owner: 'Mike T.' },
  { id: 'LP06', name: 'BrandF Alkaline Water', category: 'Beverages', brand: 'BrandF', region: 'India', stage: 'Market Ready', quarter: 'Q2 2026', readiness: 97, risk: 'Low', revExposure: 0.4, budget: 0.3, spent: 0.28, owner: 'Dave P.' },
  { id: 'LP07', name: 'BrandA Soy Milk', category: 'Beverages', brand: 'BrandA', region: 'APAC', stage: 'Production', quarter: 'Q3 2026', readiness: 90, risk: 'Low', revExposure: 0.8, budget: 0.5, spent: 0.48, owner: 'John D.' },
  { id: 'LP08', name: 'BrandD Greek Yogurt', category: 'Snacks', brand: 'BrandD', region: 'India', stage: 'Launch Completed', quarter: 'Q2 2026', readiness: 99, risk: 'Low', revExposure: 1.3, budget: 0.8, spent: 0.8, owner: 'Sarah K.' },
  { id: 'LP09', name: 'BrandE Face Scrub', category: 'Personal Care', brand: 'BrandE', region: 'EMEA', stage: 'Testing', quarter: 'Q3 2026', readiness: 85, risk: 'Low', revExposure: 0.7, budget: 0.4, spent: 0.32, owner: 'Anna L.' },
  { id: 'LP10', name: 'BrandG Floor Wipes', category: 'Household', brand: 'BrandG', region: 'EMEA', stage: 'Testing', quarter: 'Q2 2026', readiness: 95, risk: 'Low', revExposure: 0.6, budget: 0.4, spent: 0.38, owner: 'Tom H.' },
  { id: 'LP11', name: 'BrandH Laundry Pods', category: 'Household', brand: 'BrandH', region: 'India', stage: 'Testing', quarter: 'Q3 2026', readiness: 88, risk: 'Low', revExposure: 1.2, budget: 0.8, spent: 0.6, owner: 'Vicky S.' },
  { id: 'LP12', name: 'BrandH Fabric Sheets', category: 'Household', brand: 'BrandH', region: 'Americas', stage: 'Production', quarter: 'Q3 2026', readiness: 89, risk: 'Low', revExposure: 0.5, budget: 0.3, spent: 0.26, owner: 'Vicky S.' },
  { id: 'LP13', name: 'BrandB Potato Crisps', category: 'Snacks', brand: 'BrandB', region: 'APAC', stage: 'Testing', quarter: 'Q2 2026', readiness: 90, risk: 'Low', revExposure: 1.1, budget: 0.7, spent: 0.62, owner: 'Mike T.' },
  { id: 'LP14', name: 'BrandE Hand Wash', category: 'Personal Care', brand: 'BrandE', region: 'APAC', stage: 'Production', quarter: 'Q4 2026', readiness: 85, risk: 'Low', revExposure: 0.9, budget: 0.5, spent: 0.45, owner: 'Anna L.' },
  { id: 'LP15', name: 'BrandA Energy Gel', category: 'Beverages', brand: 'BrandA', region: 'EMEA', stage: 'Production', quarter: 'Q4 2026', readiness: 86, risk: 'Low', revExposure: 0.8, budget: 0.5, spent: 0.44, owner: 'John D.' },
  { id: 'LP16', name: 'BrandE Hair Serum', category: 'Personal Care', brand: 'BrandE', region: 'India', stage: 'Market Ready', quarter: 'Q4 2026', readiness: 87, risk: 'Low', revExposure: 0.7, budget: 0.4, spent: 0.35, owner: 'Anna L.' },
  { id: 'LP17', name: 'BrandG Dish Spray', category: 'Household', brand: 'BrandG', region: 'APAC', stage: 'Development', quarter: 'Q4 2026', readiness: 85, risk: 'Low', revExposure: 0.9, budget: 0.6, spent: 0.4, owner: 'Tom H.' },
  { id: 'LP18', name: 'BrandH Iron Spray', category: 'Household', brand: 'BrandH', region: 'EMEA', stage: 'Ideation', quarter: 'Q4 2026', readiness: 82, risk: 'Low', revExposure: 0.4, budget: 0.3, spent: 0.1, owner: 'Vicky S.' },
  { id: 'LP19', name: 'BrandD Organic Yogurt', category: 'Snacks', brand: 'BrandD', region: 'EMEA', stage: 'Production', quarter: 'Q3 2026', readiness: 74, risk: 'Medium', revExposure: 0.8, budget: 0.5, spent: 0.4, owner: 'Sarah K.' },
  { id: 'LP20', name: 'BrandA Fruit Punch', category: 'Beverages', brand: 'BrandA', region: 'India', stage: 'Regulatory', quarter: 'Q3 2026', readiness: 65, risk: 'Medium', revExposure: 0.7, budget: 0.4, spent: 0.3, owner: 'John D.' },
  { id: 'LP21', name: 'BrandB Pretzel Sticks', category: 'Snacks', brand: 'BrandB', region: 'EMEA', stage: 'Development', quarter: 'Q4 2026', readiness: 71, risk: 'Medium', revExposure: 0.6, budget: 0.4, spent: 0.2, owner: 'Mike T.' },
  { id: 'LP22', name: 'BrandE Body Lotion', category: 'Personal Care', brand: 'BrandE', region: 'Americas', stage: 'Development', quarter: 'Q4 2026', readiness: 62, risk: 'Medium', revExposure: 1.0, budget: 0.6, spent: 0.3, owner: 'Anna L.' },
  { id: 'LP23', name: 'BrandG Glass Cleaner', category: 'Household', brand: 'BrandG', region: 'Americas', stage: 'Regulatory', quarter: 'Q3 2026', readiness: 60, risk: 'Medium', revExposure: 0.8, budget: 0.5, spent: 0.35, owner: 'Tom H.' },
  { id: 'LP24', name: 'BrandC Biscuits Eco', category: 'Snacks', brand: 'BrandC', region: 'EMEA', stage: 'Development', quarter: 'Q4 2026', readiness: 42, risk: 'High', revExposure: 2.1, budget: 1.2, spent: 0.6, owner: 'Lisa R.' },
  { id: 'LP25', name: 'BrandC Chocolate Oats', category: 'Snacks', brand: 'BrandC', region: 'Americas', stage: 'Regulatory', quarter: 'Q4 2026', readiness: 48, risk: 'High', revExposure: 2.1, budget: 1.5, spent: 0.8, owner: 'Lisa R.' }
];

interface VPLaunchReadinessViewProps {
  isDarkMode: boolean;
  simulateDelay?: boolean;
  setSimulateDelay?: (v: boolean) => void;
}

export const VPLaunchReadinessView: React.FC<VPLaunchReadinessViewProps> = ({ 
  isDarkMode, 
  simulateDelay: propSimulateDelay, 
  setSimulateDelay: propSetSimulateDelay 
}) => {
  const [filterRegion, setFilterRegion] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [filterQuarter, setFilterQuarter] = useState('All');
  const [pipelineView, setPipelineView] = useState<'bar' | 'pie'>('bar');
  const [predictionsView, setPredictionsView] = useState<'grid' | 'table'>('grid');
  const [localSimulateDelay, setLocalSimulateDelay] = useState(false);
  const simulateDelay = propSimulateDelay !== undefined ? propSimulateDelay : localSimulateDelay;
  const setSimulateDelay = propSetSimulateDelay !== undefined ? propSetSimulateDelay : setLocalSimulateDelay;
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [toasts, setToasts] = useState<{ id: string; title: string; body: string; color: string }[]>([]);
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);
  const [predictionModalType, setPredictionModalType] = useState<'stockout' | 'elasticity' | 'margin' | 'demand' | 'delay' | null>(null);

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

  const processedProducts = VP_PRODUCTS.map(p => {
    let readiness = p.readiness;
    let risk = p.risk;

    if (simulateDelay && p.region === 'APAC') {
      readiness = Math.max(0, p.readiness - 15);
      risk = readiness < 50 ? 'High' : readiness < 75 ? 'Medium' : p.risk;
    }

    return {
      ...p,
      readiness,
      risk
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
    Regulatory: filteredProducts.filter(p => p.stage === 'Regulatory').length,
    Production: filteredProducts.filter(p => p.stage === 'Production').length,
    'Market Ready': filteredProducts.filter(p => p.stage === 'Market Ready').length,
    'Launched': filteredProducts.filter(p => p.stage === 'Launch Completed').length,
  };

  const activePipelineSKUs = filteredProducts.length;
  const launchedCount = pipelineCounts.Launched;
  const nearLaunchCount = pipelineCounts['Market Ready'] + pipelineCounts.Launched;
  const inDevelopmentPlus = activePipelineSKUs - nearLaunchCount;

  const pipelineChartData = [
    { name: 'Ideation', count: pipelineCounts.Ideation, fill: '#b4aceb' },
    { name: 'Development', count: pipelineCounts.Development, fill: '#8e7bf5' },
    { name: 'Testing', count: pipelineCounts.Testing, fill: '#634bf6' },
    { name: 'Regulatory', count: pipelineCounts.Regulatory, fill: '#2563eb' },
    { name: 'Production', count: pipelineCounts.Production, fill: '#1d4ed8' },
    { name: 'Market Ready', count: pipelineCounts['Market Ready'], fill: '#1e3a8a' },
    { name: 'Launched', count: pipelineCounts.Launched, fill: '#3b82f6' }
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
    return {
      name: cat,
      'Proj Rev (₹ Cr)': parseFloat(revenue.toFixed(1)),
      'Budget ($M)': parseFloat(budget.toFixed(1)),
      'Spent ($M)': parseFloat(spent.toFixed(1))
    };
  });

  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallReadiness / 100) * circumference;

  const handleExport = () => {
    addToast('Report Export Initiated', 'Compiling PDF executive summary for launch pipeline.', '#3b82f6');
  };

  return (
    <div className="space-y-6">
      {/* Filters + Action Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-5 py-3.5 rounded-sm shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
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

        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold font-mono">
            <RefreshCw size={11} className="animate-spin text-zinc-400" />
            <span>UPDATED: {lastRefreshed}</span>
          </div>
          <span className="h-4 w-px bg-black/10 dark:bg-white/15"></span>
          <button 
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-[9px] font-bold uppercase tracking-wider rounded-sm text-zinc-600 dark:text-zinc-400 cursor-pointer"
          >
            <Download size={11} />
            Export
          </button>
        </div>
      </div>

      {/* Row 1: Executive Readiness Score (Top Section) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Circular Gauge Banner */}
        <div className="xl:col-span-4 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-5 rotate-12 pointer-events-none text-[#6d28d9] dark:text-[#a78bfa]">
            <Rocket size={100} />
          </div>
          
          <div className="space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#6d28d9] dark:text-[#a78bfa]">Hero Metric</span>
            <h3 className="text-sm font-display font-extrabold text-zinc-800 dark:text-zinc-200">Overall Launch Readiness</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug max-w-[200px]">
              Average score across {totalLaunches} active pipeline SKUs.
            </p>
            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 mt-1">
              <TrendingUp size={11} />
              <span>+2.4% vs last week</span>
            </div>
          </div>

          <div className="relative flex items-center justify-center shrink-0 w-28 h-28">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle 
                cx="56" 
                cy="56" 
                r={radius} 
                className="text-black/5 dark:text-white/5" 
                strokeWidth={strokeWidth} 
                stroke="currentColor" 
                fill="transparent" 
              />
              <circle 
                cx="56" 
                cy="56" 
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
              <span className="text-xl font-display font-black text-zinc-850 dark:text-zinc-150">{overallReadiness}%</span>
              <p className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold leading-none mt-0.5">Ready</p>
            </div>
          </div>
        </div>

        {/* Right KPI Cards Grid */}
        <div className="xl:col-span-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          
          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex flex-col justify-between h-28 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">On Track</p>
            <h4 className="text-2xl font-display font-extrabold text-emerald-500 leading-none">{onTrackCount}</h4>
            <p className="text-[9px] text-zinc-400 font-semibold uppercase">Status: Optimal</p>
          </div>

          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex flex-col justify-between h-28 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Delayed</p>
            <h4 className="text-2xl font-display font-extrabold text-red-500 leading-none">{delayedCount}</h4>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Needs Focus</p>
          </div>

          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex flex-col justify-between h-28 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">At Risk</p>
            <h4 className="text-2xl font-display font-extrabold text-amber-500 leading-none">{atRiskCount}</h4>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Watching</p>
          </div>

          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex flex-col justify-between h-28 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Next 60 Days</p>
            <h4 className="text-2xl font-display font-extrabold text-blue-500 leading-none">
              {filteredProducts.filter(p => p.stage !== 'Launch Completed' && p.stage !== 'Ideation').length}
            </h4>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Readying</p>
          </div>

          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex flex-col justify-between h-28 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Rev Exposure</p>
            <h4 className="text-2xl font-display font-extrabold text-orange-500 leading-none">
              ${revenueExposure.toFixed(1)}M
            </h4>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">At-Risk/Delayed</p>
          </div>

          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex flex-col justify-between h-28 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Market Coverage</p>
            <h4 className="text-2xl font-display font-extrabold text-[#6d28d9] dark:text-[#a78bfa] leading-none">
              {marketCoverage}%
            </h4>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Geo Readiness</p>
          </div>

        </div>

      </div>

      {/* Row 2: Launch Pipeline Overview | Risk & Escalation Center */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Launch Pipeline Overview */}
        <div className="xl:col-span-7 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
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
            <div className="bg-zinc-100/80 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 p-4 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
              <p className="text-[10px] font-bold text-zinc-400">Active pipeline SKUs</p>
              <h4 className="text-2xl font-display font-extrabold text-zinc-850 dark:text-white mt-1.5 leading-none">{activePipelineSKUs}</h4>
            </div>

            <div className="bg-zinc-100/80 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 p-4 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
              <p className="text-[10px] font-bold text-zinc-400">In development+</p>
              <h4 className="text-2xl font-display font-extrabold text-zinc-850 dark:text-white mt-1.5 leading-none">{inDevelopmentPlus}</h4>
            </div>

            <div className="bg-zinc-100/80 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 p-4 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
              <p className="text-[10px] font-bold text-zinc-400">Near launch</p>
              <h4 className="text-2xl font-display font-extrabold text-zinc-850 dark:text-white mt-1.5 leading-none">{nearLaunchCount}</h4>
            </div>

            <div className="bg-zinc-100/80 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 p-4 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
              <p className="text-[10px] font-bold text-zinc-400">Launched</p>
              <h4 className="text-2xl font-display font-extrabold text-zinc-850 dark:text-white mt-1.5 leading-none">{launchedCount}</h4>
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
                  <span className="font-semibold text-zinc-650 dark:text-zinc-300">Late stage (Regulatory - Launched)</span>
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

        {/* Risk & Escalation Center */}
        <div className="xl:col-span-5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Risk & Escalation Center</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                {escalations.length} unresolved delays
              </span>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {escalations.length > 0 ? (
                escalations.map(esc => (
                  <div key={esc.id} className="p-3 border border-black/5 dark:border-white/10 rounded-sm bg-zinc-50/50 dark:bg-white/5 flex items-start gap-2.5 justify-between">
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: esc.color }} />
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate" title={esc.title}>{esc.title}</h4>
                        <p className="text-[9px] text-zinc-500 mt-0.5 truncate">{esc.sub} · <span className="font-semibold text-red-500">{esc.impact}</span></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveResolveEscalation(esc.id)}
                      className="px-2 py-1 shrink-0 border border-[#6d28d9]/35 text-[#6d28d9] dark:text-[#a78bfa] bg-[#6d28d9]/5 hover:bg-[#6d28d9] hover:text-white rounded-sm text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer font-sans"
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

      {/* Financial & AI Predictions */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Financial Impact</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }} />
                <Bar dataKey="Proj Rev (₹ Cr)" fill="#3b82f6" />
                <Bar dataKey="Budget ($M)" fill="#8b5cf6" />
                <Bar dataKey="Spent ($M)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-[#6d28d9] dark:text-[#a78bfa]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6d28d9] dark:text-[#a78bfa]">AI Predictions</span>
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
                  <p className="text-[9px] text-zinc-550 dark:text-zinc-400 mt-1 line-clamp-2">BrandC Snacks packaging shortage at EMEA hub.</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5">
                  <span className="text-[8px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-sm">78% Risk</span>
                  <span className="text-[8px] font-bold text-zinc-700 dark:text-zinc-300">$2.1M Impact</span>
                </div>
              </div>

              {/* Card 2: Stockout Risk */}
              <div 
                onClick={() => { setPredictionModalType('stockout'); setIsPredictionModalOpen(true); }}
                className="p-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 dark:border-red-500/20 rounded-sm cursor-pointer hover:scale-[1.02] transition-all flex flex-col justify-between h-24"
              >
                <div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200 text-[10px] leading-tight">🚨 Stockout Risk (APAC)</p>
                  <p className="text-[9px] text-zinc-550 dark:text-zinc-400 mt-1 line-clamp-2">BrandA Energy buffer below safety limit at Vapi Hub.</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5">
                  <span className="text-[8px] font-semibold text-red-600 dark:text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-sm">92% Risk</span>
                  <span className="text-[8px] font-bold text-zinc-700 dark:text-zinc-300">$1.5M Impact</span>
                </div>
              </div>

              {/* Card 3: Margin Compression */}
              <div 
                onClick={() => { setPredictionModalType('margin'); setIsPredictionModalOpen(true); }}
                className="p-3 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/15 dark:border-amber-500/20 rounded-sm cursor-pointer hover:scale-[1.02] transition-all flex flex-col justify-between h-24"
              >
                <div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200 text-[10px] leading-tight">📉 Margin Compression</p>
                  <p className="text-[9px] text-zinc-550 dark:text-zinc-400 mt-1 line-clamp-2">BrandC Biscuits gross margin breach from discount dependence.</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5">
                  <span className="text-[8px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-sm">81% Risk</span>
                  <span className="text-[8px] font-bold text-zinc-700 dark:text-zinc-300">$0.9M Impact</span>
                </div>
              </div>

              {/* Card 4: Demand Surge */}
              <div 
                onClick={() => { setPredictionModalType('demand'); setIsPredictionModalOpen(true); }}
                className="p-3 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/15 dark:border-indigo-500/20 rounded-sm cursor-pointer hover:scale-[1.02] transition-all flex flex-col justify-between h-24"
              >
                <div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200 text-[10px] leading-tight">⚡ Capacity Bottleneck (APAC)</p>
                  <p className="text-[9px] text-zinc-550 dark:text-zinc-400 mt-1 line-clamp-2">BrandF Eco Water demand spike exceeding plant throughput.</p>
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
                      <span className="text-zinc-850 dark:text-zinc-150 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors font-bold">🚨 Stockout Risk (APAC)</span>
                      <p className="text-[8px] text-zinc-400 font-normal mt-0.5">BrandA Energy low Vapi Hub buffers</p>
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
                      <span className="text-zinc-850 dark:text-zinc-150 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-bold">📉 Margin Compression</span>
                      <p className="text-[8px] text-zinc-400 font-normal mt-0.5">BrandC Biscuits promo concentration</p>
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
                      <span className="text-zinc-850 dark:text-zinc-150 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-bold">⚡ Capacity Bottleneck (APAC)</span>
                      <p className="text-[8px] text-zinc-400 font-normal mt-0.5">BrandF Eco Water demand surge</p>
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
    </div>
  );
};
