import React, { useState, useEffect } from 'react';
import { 
  Filter, RefreshCw, Download, Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';

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
  const [localSimulateDelay, setLocalSimulateDelay] = useState(false);
  const simulateDelay = propSimulateDelay !== undefined ? propSimulateDelay : localSimulateDelay;
  const setSimulateDelay = propSetSimulateDelay !== undefined ? propSetSimulateDelay : setLocalSimulateDelay;
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [toasts, setToasts] = useState<{ id: string; title: string; body: string; color: string }[]>([]);

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




      {/* Risk Escalations */}
      <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Active Escalations ({escalations.length})</span>
        </div>
        <div className="space-y-2">
          {escalations.length > 0 ? (
            escalations.map(esc => (
              <div key={esc.id} className="p-3 border border-black/5 dark:border-white/10 rounded-sm bg-zinc-50/50 dark:bg-white/5 flex items-start gap-2 justify-between">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: esc.color }} />
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">{esc.title}</h4>
                    <p className="text-[9px] text-zinc-500 mt-0.5">{esc.sub} · <span className="font-semibold text-red-500">{esc.impact}</span></p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    let action = '';
                    if (esc.id === 'esc1') action = 'Approved alternative domestic vendor.';
                    else if (esc.id === 'esc2') action = 'Dispatched response to regulatory audit.';
                    else if (esc.id === 'esc3') action = 'Co-packing capacity split approved.';
                    else action = 'Standard label revisions auto-approved.';
                    handleResolveEscalation(esc.id, esc.title, action);
                  }}
                  className="px-2 py-1 shrink-0 border border-[#6d28d9]/35 text-[#6d28d9] dark:text-[#a78bfa] bg-[#6d28d9]/5 hover:bg-[#6d28d9] hover:text-white rounded-sm text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Resolve
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-[10px] text-zinc-500 py-4">✓ All escalations cleared</p>
          )}
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
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-[#6d28d9] dark:text-[#a78bfa]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6d28d9] dark:text-[#a78bfa]">AI Predictions</span>
          </div>
          <div className="space-y-2 text-[9px]">
            <div className="p-2 bg-purple-500/5 border border-purple-500/15 rounded-sm">
              <p className="font-semibold mb-0.5">⚠️ BrandC Products: 78% delay probability</p>
              <p className="text-zinc-500">Packaging sourcing constraint in EMEA</p>
            </div>
            <div className="p-2 bg-emerald-500/5 border border-emerald-500/15 rounded-sm">
              <p className="font-semibold mb-0.5">💡 Recommendation: Domestic sourcing</p>
              <p className="text-zinc-500">Recovers 12 days, saves $2.1M revenue risk</p>
            </div>
          </div>

          <div className="pt-3 border-t border-black/5 dark:border-white/5">
            <button 
              onClick={() => {
                const state = !simulateDelay;
                setSimulateDelay(state);
                if (state) {
                  addToast('Simulation Activated', 'APAC shipping delay applied.', '#ef4444');
                } else {
                  addToast('Simulation Deactivated', 'Standard metrics restored.', '#3b82f6');
                }
              }}
              className={`w-full px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                simulateDelay 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              {simulateDelay ? 'Stop Cargo Delay Sim' : 'Run Cargo Delay Simulation'}
            </button>
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
    </div>
  );
};
