import React, { useState, useEffect } from 'react';
import { 
  Rocket, Filter, CheckCircle2, AlertTriangle, XCircle, Info, Calendar, Target, Award 
} from 'lucide-react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip 
} from 'recharts';
import { Role } from '../../../types/dashboard';
import { 
  RefreshCw, Download, Play, Zap, Check, AlertCircle as AlertCircleIcon, TrendingUp, HelpCircle, ArrowRight 
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell
} from 'recharts';

interface LaunchReadinessDashboardProps {
  role: Role;
  onAuditClick?: (metric: string | null) => void;
  tourActive?: boolean;
  onTourClose?: () => void;
  isDarkMode: boolean;
  simulateDelay?: boolean;
  setSimulateDelay?: (v: boolean) => void;
}

export const LaunchReadinessDashboard: React.FC<LaunchReadinessDashboardProps> = ({ 
  role, isDarkMode, onAuditClick, tourActive, onTourClose, simulateDelay, setSimulateDelay 
}) => {
  if (role === 'VP Product Management') {
    return <VPLaunchReadinessView isDarkMode={isDarkMode} simulateDelay={simulateDelay} setSimulateDelay={setSimulateDelay} />;
  }
  const accentColor = isDarkMode ? '#a78bfa' : '#6d28d9';
  const [skuName, setSkuName] = useState('Mango Fizz 500ml');
  const [category, setCategory] = useState('Beverages');
  const [projectedRev, setProjectedRev] = useState(120);
  const [grossMargin, setGrossMargin] = useState(38);
  const [leadTime, setLeadTime] = useState(18);
  const [promoBudget, setPromoBudget] = useState(12);
  const [suppliers, setSuppliers] = useState(3);
  const [channels, setChannels] = useState(4);

  const [hasScored, setHasScored] = useState(false);
  const [scoreResults, setScoreResults] = useState<any>(null);

  // Accordion guide
  const [guideOpen, setGuideOpen] = useState(false);

  const handleScoreLaunch = () => {
    // Exact mathematical formula from vanilla prototype
    const marketFit = Math.min(100, Math.round(projectedRev / 2 + grossMargin));
    const supplyReadiness = Math.min(100, Math.round(100 - (leadTime - 10) * 2.5 + suppliers * 3));
    const marginHealth = Math.min(100, Math.round(grossMargin * 2 - promoBudget * 0.8));
    const channelCoverage = Math.min(100, Math.round((channels / 6) * 100));
    const riskProfile = Math.min(100, Math.round(100 - promoBudget * 1.5 - Math.max(0, leadTime - 15) * 2));

    const scores = {
      'Market Fit': marketFit,
      'Supply Readiness': supplyReadiness,
      'Margin Health': marginHealth,
      'Channel Coverage': channelCoverage,
      'Risk Profile': riskProfile,
    };

    const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 5;
    
    let verdictTitle = '';
    let verdictIcon = CheckCircle2;
    let verdictColor = 'text-green-500 bg-green-500/10 border-green-500/20';
    
    if (avg >= 75) {
      verdictTitle = '✅ Launch Ready — proceed to plan';
      verdictIcon = CheckCircle2;
      verdictColor = 'text-green-500 bg-green-500/10 border-green-500/20';
    } else if (avg >= 50) {
      verdictTitle = '⚠️ Conditional — address gaps first';
      verdictIcon = AlertTriangle;
      verdictColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    } else {
      verdictTitle = '🚫 Not Ready — significant risks remain';
      verdictIcon = XCircle;
      verdictColor = 'text-red-500 bg-red-500/10 border-red-500/20';
    }

    // Milestones dynamic checklist
    const milestones = [
      { title: 'Supplier Onboarding', status: suppliers >= 2 ? 'complete' : 'in-progress', progress: suppliers >= 2 ? 100 : 60, date: 'Week 2' },
      { title: 'Channel Agreements', status: channels >= 3 ? 'complete' : 'in-progress', progress: channels >= 3 ? 100 : 75, date: 'Week 4' },
      { title: 'Production Trials', status: grossMargin >= 35 ? 'complete' : 'blocked', progress: grossMargin >= 35 ? 100 : 40, date: 'Week 6' },
      { title: 'Distribution Setup', status: 'in-progress', progress: 85, date: 'Week 8' },
      { title: 'Marketing Campaign', status: 'in-progress', progress: 50, date: 'Week 10' },
      { title: 'Launch Go-Live', status: 'in-progress', progress: 0, date: 'Week 12' },
    ];

    setScoreResults({
      scores,
      average: avg,
      verdictTitle,
      verdictIcon,
      verdictColor,
      milestones
    });
    setHasScored(true);
  };

  const handleResetLaunch = () => {
    setSkuName('Mango Fizz 500ml');
    setCategory('Beverages');
    setProjectedRev(120);
    setGrossMargin(38);
    setLeadTime(18);
    setPromoBudget(12);
    setSuppliers(3);
    setChannels(4);
    setHasScored(false);
    setScoreResults(null);
  };

  // Recharts Radar data
  const radarChartData = scoreResults ? Object.entries(scoreResults.scores).map(([key, val]) => {
    // Benchmarks: Market Fit (68), Supply (72), Margin (65), Channel (75), Risk (70)
    const benchmarkMap: Record<string, number> = {
      'Market Fit': 68,
      'Supply Readiness': 72,
      'Margin Health': 65,
      'Channel Coverage': 75,
      'Risk Profile': 70
    };
    return {
      subject: key,
      'Your SKU': val,
      Benchmark: benchmarkMap[key] || 70
    };
  }) : [];

  return (
    <div className="space-y-6">
      
      {/* Strategic Header */}
      <div className="glass-card bg-acies-gray text-white py-5 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
          <Rocket size={100} />
        </div>
        <div>
          <p className="text-[9px] uppercase font-bold tracking-widest opacity-40 mb-2">Portfolio Launch Readiness · Tab 2 of 6</p>
          <h2 className="text-xl font-display font-medium text-white mb-2">Launch Readiness Tracker</h2>
          <p className="text-xs text-zinc-300 font-medium max-w-xl leading-relaxed">
            Score new SKU launches across 5 critical operational dimensions: market fit, supply readiness, margin health, channel coverage, and risk profile. Keep track of upcoming launch milestones.
          </p>
        </div>
      </div>

      {/* Guide Panel Accordion */}
      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4">
        <button 
          onClick={() => setGuideOpen(!guideOpen)}
          className="w-full text-left font-bold text-xs uppercase tracking-widest text-acies-yellow flex justify-between items-center cursor-pointer border-none bg-transparent"
        >
          <span>📖 Launch scoring guide</span>
          <span className="text-[10px]">{guideOpen ? '✕ Collapse' : '▲ Expand'}</span>
        </button>

        {guideOpen && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-black/5 dark:border-white/5 mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">1. Fill the SKU brief</h4>
              <p>Enter projected revenue, margin, lead time, promo budget, supplier count, and distribution channels. Each input feeds into the readiness score.</p>
            </div>
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">2. Read the radar chart</h4>
              <p>Five axes: Market Fit, Supply Readiness, Margin Health, Channel Coverage, Risk Profile. A balanced pentagon = launch-ready.</p>
            </div>
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">3. Interpret the verdict</h4>
              <p>Score &gt;=75 = ✅ Launch Ready. 50-74 = ⚠️ Conditional (address gaps). &lt; 50 = 🚫 Not Ready (significant risks).</p>
            </div>
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">4. Compare benchmarks</h4>
              <p>Grey overlay = category average benchmark. Your SKU should exceed benchmark on 3+ axes before launch sign-off.</p>
            </div>
          </div>
        )}
      </div>

      {/* New SKU Brief Form */}
      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4">📦 New SKU Brief</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">SKU Name</label>
            <input 
              type="text" 
              value={skuName}
              onChange={(e) => setSkuName(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            >
              <option>Beverages</option>
              <option>Snacks</option>
              <option>Personal Care</option>
              <option>Household</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Projected Revenue Y1 (₹ Cr)</label>
            <input 
              type="number" 
              value={projectedRev}
              onChange={(e) => setProjectedRev(parseInt(e.target.value) || 0)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Gross Margin %</label>
            <input 
              type="number" 
              value={grossMargin}
              onChange={(e) => setGrossMargin(parseInt(e.target.value) || 0)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Lead Time (days)</label>
            <input 
              type="number" 
              value={leadTime}
              onChange={(e) => setLeadTime(parseInt(e.target.value) || 0)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Promo Budget %</label>
            <input 
              type="number" 
              value={promoBudget}
              onChange={(e) => setPromoBudget(parseInt(e.target.value) || 0)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Suppliers (count)</label>
            <input 
              type="number" 
              value={suppliers}
              onChange={(e) => setSuppliers(parseInt(e.target.value) || 0)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Distribution Channels</label>
            <input 
              type="number" 
              value={channels}
              onChange={(e) => setChannels(parseInt(e.target.value) || 0)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
          <button 
            onClick={handleScoreLaunch}
            className="px-5 py-2 bg-acies-gray text-white text-[9px] font-bold uppercase tracking-widest hover:bg-acies-yellow hover:text-acies-gray transition-all cursor-pointer border-none"
          >
            Score Readiness
          </button>
          <button 
            onClick={handleResetLaunch}
            className="px-4 py-2 border border-black/10 dark:border-white/10 text-zinc-500 text-[9px] font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Results Section */}
      {hasScored && scoreResults && (
        <div className="space-y-6">
          
          {/* Scoring Verdict Grid */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
            <h4 className="text-xs font-bold uppercase tracking-widest pb-3 border-b border-black/5 dark:border-white/5 mb-4 flex items-center gap-2">
              Launch Readiness Score:
              <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-sm ${scoreResults.verdictColor}`}>
                {scoreResults.verdictTitle}
              </span>
              <span className="text-[9px] font-bold opacity-45 uppercase ml-auto">
                Overall: {Math.round(scoreResults.average)}/100
              </span>
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(scoreResults.scores).map(([k, v]) => {
                const val = v as number;
                const metricColor = val >= 70 ? 'text-green-500' : val >= 50 ? 'text-amber-500' : 'text-red-500';
                return (
                  <div key={k} className="p-3 bg-black/5 dark:bg-white/5 rounded-sm text-center">
                    <p className="text-[8px] font-bold uppercase tracking-widest opacity-45 mb-1">{k}</p>
                    <h5 className={`text-base font-display font-extrabold ${metricColor}`}>{val}/100</h5>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1">Readiness Radar Map</h3>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">Your SKU (blue) vs category benchmark average (grey)</p>
            
            <div className="h-80 max-w-lg mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                  <PolarGrid stroke={isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: 9, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 8 }} />
                  <Radar name="Your SKU" dataKey="Your SKU" stroke={isDarkMode ? "#a78bfa" : "#6d28d9"} fill={isDarkMode ? "#a78bfa" : "#6d28d9"} fillOpacity={0.2} />
                  <Radar name="Benchmark" dataKey="Benchmark" stroke={isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} fill={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeDasharray="3 3" />
                  <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', color: isDarkMode ? '#fff' : '#000' }} />
                  <Legend wrapperStyle={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Milestone Gates */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest pl-1">Launch Milestones Tracker</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {scoreResults.milestones.map((m: any, idx: number) => {
                const borderCol = m.status === 'complete' ? 'border-green-500/30' : m.status === 'blocked' ? 'border-red-500/30' : 'border-amber-500/30';
                const indicatorBg = m.status === 'complete' ? 'bg-green-500/20 text-green-500' : m.status === 'blocked' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500';
                const progressBg = m.status === 'complete' ? 'bg-green-500' : m.status === 'blocked' ? 'bg-red-500' : 'bg-amber-500';
                
                return (
                  <div key={idx} className={`glass-card bg-white dark:bg-white/5 border-l-2 ${borderCol} p-4 space-y-3.5`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${indicatorBg}`}>
                        {m.status === 'complete' ? '✓' : m.status === 'blocked' ? '!' : '○'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-acies-gray dark:text-white truncate">{m.title}</p>
                        <p className="text-[8px] text-zinc-500 dark:text-zinc-400 font-extrabold uppercase mt-0.5">{m.date}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${progressBg}`} style={{ width: `${m.progress}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-zinc-500 dark:text-zinc-400 font-bold">
                        <span>{m.status === 'complete' ? 'Completed' : m.status === 'blocked' ? 'Blocked' : 'In Progress'}</span>
                        <span>{m.progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

// ==========================================
// VP Launch Readiness View Component & Mock Data
// ==========================================

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
  revExposure: number; // in $ Millions
  budget: number; // in $ Millions
  spent: number; // in $ Millions
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
  // At Risk (5 Products)
  { id: 'LP19', name: 'BrandD Organic Yogurt', category: 'Snacks', brand: 'BrandD', region: 'EMEA', stage: 'Production', quarter: 'Q3 2026', readiness: 74, risk: 'Medium', revExposure: 0.8, budget: 0.5, spent: 0.4, owner: 'Sarah K.' },
  { id: 'LP20', name: 'BrandA Fruit Punch', category: 'Beverages', brand: 'BrandA', region: 'India', stage: 'Regulatory', quarter: 'Q3 2026', readiness: 65, risk: 'Medium', revExposure: 0.7, budget: 0.4, spent: 0.3, owner: 'John D.' },
  { id: 'LP21', name: 'BrandB Pretzel Sticks', category: 'Snacks', brand: 'BrandB', region: 'EMEA', stage: 'Development', quarter: 'Q4 2026', readiness: 71, risk: 'Medium', revExposure: 0.6, budget: 0.4, spent: 0.2, owner: 'Mike T.' },
  { id: 'LP22', name: 'BrandE Body Lotion', category: 'Personal Care', brand: 'BrandE', region: 'Americas', stage: 'Development', quarter: 'Q4 2026', readiness: 62, risk: 'Medium', revExposure: 1.0, budget: 0.6, spent: 0.3, owner: 'Anna L.' },
  { id: 'LP23', name: 'BrandG Glass Cleaner', category: 'Household', brand: 'BrandG', region: 'Americas', stage: 'Regulatory', quarter: 'Q3 2026', readiness: 60, risk: 'Medium', revExposure: 0.8, budget: 0.5, spent: 0.35, owner: 'Tom H.' },
  // Delayed (2 Products)
  { id: 'LP24', name: 'BrandC Biscuits Eco', category: 'Snacks', brand: 'BrandC', region: 'EMEA', stage: 'Development', quarter: 'Q4 2026', readiness: 42, risk: 'High', revExposure: 2.1, budget: 1.2, spent: 0.6, owner: 'Lisa R.' },
  { id: 'LP25', name: 'BrandC Chocolate Oats', category: 'Snacks', brand: 'BrandC', region: 'Americas', stage: 'Regulatory', quarter: 'Q4 2026', readiness: 48, risk: 'High', revExposure: 2.1, budget: 1.5, spent: 0.8, owner: 'Lisa R.' }
];

const VPLaunchReadinessView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [filterRegion, setFilterRegion] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [filterQuarter, setFilterQuarter] = useState('All');
  const [simulateDelay, setSimulateDelay] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [toasts, setToasts] = useState<{ id: string; title: string; body: string; color: string }[]>([]);

  // Update clock/last refreshed
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

  // Risks & Escalations state
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

  // Apply Simulation + Filters
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

  // Dynamic KPI calculations
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

  // Funnel Pipeline stages
  const pipelineCounts = {
    Ideation: filteredProducts.filter(p => p.stage === 'Ideation').length,
    Development: filteredProducts.filter(p => p.stage === 'Development').length,
    Testing: filteredProducts.filter(p => p.stage === 'Testing').length,
    Regulatory: filteredProducts.filter(p => p.stage === 'Regulatory').length,
    Production: filteredProducts.filter(p => p.stage === 'Production').length,
    'Market Ready': filteredProducts.filter(p => p.stage === 'Market Ready').length,
    'Launched': filteredProducts.filter(p => p.stage === 'Launch Completed').length,
  };

  // Cross functional Radar Chart data
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
        
        {/* Launch Pipeline Progress (Funnel/Kanban View) */}
        <div className="xl:col-span-7 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Launch Pipeline Overview</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
              {totalLaunches} active pipeline SKUs
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {Object.entries(pipelineCounts).map(([stage, count], idx) => {
              const isActive = count > 0;
              const barHeight = Math.max(10, Math.min(100, (count / (totalLaunches || 1)) * 140));
              return (
                <div key={stage} className="flex flex-col items-center justify-end h-44 pb-1 relative group cursor-pointer">
                  <div className="absolute bottom-full mb-2 bg-zinc-900 text-white text-[9px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                    {count} SKU{count !== 1 ? 's' : ''} in {stage}
                  </div>
                  
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-500 ${
                      isActive 
                        ? 'bg-gradient-to-t from-[#6d28d9] to-[#a78bfa] opacity-80 group-hover:opacity-100' 
                        : 'bg-black/5 dark:bg-white/5'
                    }`}
                    style={{ height: `${barHeight}px` }}
                  />

                  <span className={`text-[10px] font-mono font-bold mt-1.5 ${isActive ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-400'}`}>
                    {count}
                  </span>

                  <span className="text-[7.5px] font-extrabold uppercase tracking-tight text-center text-zinc-400 group-hover:text-zinc-650 dark:group-hover:text-zinc-300 mt-1 line-clamp-1 w-full" title={stage}>
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk & Escalation Center */}
        <div className="xl:col-span-5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Risk & Escalation Center</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
              {escalations.length} unresolved delays
            </span>
          </div>

          <div className="space-y-3.5 max-h-[195px] overflow-y-auto pr-1">
            {escalations.length > 0 ? (
              escalations.map(esc => (
                <div key={esc.id} className="p-3 border border-black/5 dark:border-white/10 rounded-sm bg-zinc-50/50 dark:bg-white/5 flex items-start gap-2.5 justify-between">
                  <div className="flex items-start gap-2 min-w-0">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" 
                      style={{ backgroundColor: esc.color, boxShadow: `0 0 6px ${esc.color}55` }} 
                    />
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold leading-tight text-zinc-800 dark:text-zinc-200 truncate" title={esc.title}>{esc.title}</h4>
                      <p className="text-[9px] text-zinc-450 dark:text-zinc-450 mt-0.5">{esc.sub} · <span className="font-semibold text-red-500">{esc.impact}</span></p>
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
                    className="px-2 py-1 shrink-0 border border-[#6d28d9]/35 text-[#6d28d9] dark:text-[#a78bfa] bg-[#6d28d9]/5 hover:bg-[#6d28d9] hover:text-white rounded-sm text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer font-sans"
                  >
                    Resolve ✓
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-[10px] text-zinc-550 font-bold py-6">✓ All pipeline launch risks resolved</p>
            )}
          </div>
        </div>

      </div>

      {/* Row 3: Readiness by Region / Market / Category | Timeline & Milestones */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Category vs Region Heatmap */}
        <div className="xl:col-span-5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Readiness by Region & Category</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">Average % Readiness</span>
          </div>

          <div className="overflow-x-auto pt-1">
            <table className="w-full text-left text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 opacity-50 uppercase tracking-wider text-[8px] font-extrabold">
                  <th className="pb-2">Category</th>
                  {regionsList.map(r => (
                    <th key={r} className="pb-2 text-center">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 font-semibold">
                {categoriesList.map(cat => (
                  <tr key={cat} className="h-9 hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                    <td className="text-zinc-800 dark:text-zinc-200 font-bold">{cat}</td>
                    {regionsList.map(reg => {
                      const score = getHeatmapVal(cat, reg);
                      let style = 'bg-black/5 text-zinc-400';
                      if (score !== null) {
                        if (score >= 80) {
                          style = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
                        } else if (score >= 70) {
                          style = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
                        } else {
                          style = 'bg-red-500/10 text-red-500 border border-red-500/20';
                        }
                      }

                      return (
                        <td key={reg} className="p-1 text-center">
                          <div className={`py-1.5 rounded-sm font-mono font-bold text-[10px] ${style}`}>
                            {score !== null ? `${score}%` : '—'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gantt Timeline Milestone Tracker */}
        <div className="xl:col-span-7 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Launch Timeline & Milestones</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-[#6d28d9] dark:text-[#a78bfa]">Gantt View</span>
          </div>

          <div className="space-y-4 max-h-[190px] overflow-y-auto pr-1">
            {[
              { id: 't1', name: 'BrandF Water (Eco-Pack)', cat: 'Beverages', reg: 'EMEA', date: 'Jul 30', status: 'Pre-Launch', progress: 88, steps: [{ n: 'Concept', c: true }, { n: 'Recipe', c: true }, { n: 'Sourcing', c: true }, { n: 'Pkg Approval', c: true }, { n: 'Go-Live', c: false }] },
              { id: 't2', name: 'BrandA Premium Energy', cat: 'Beverages', reg: 'APAC', date: 'Sep 15', status: 'Pre-Launch', progress: 92, steps: [{ n: 'Concept', c: true }, { n: 'Recipe', c: true }, { n: 'Sourcing', c: true }, { n: 'Pkg Approval', c: true }, { n: 'Go-Live', c: false }] },
              { id: 't3', name: 'BrandD Organic Yogurt', cat: 'Snacks', reg: 'EMEA', date: 'Oct 20', status: 'Development', progress: 74, steps: [{ n: 'Concept', c: true }, { n: 'Recipe', c: true }, { n: 'Sourcing', c: false, delay: true }, { n: 'Pkg Approval', c: false }, { n: 'Go-Live', c: false }] },
              { id: 't4', name: 'BrandC Biscuits Eco', cat: 'Snacks', reg: 'EMEA', date: 'Dec 15', status: 'Development', progress: 42, steps: [{ n: 'Concept', c: true }, { n: 'Recipe', c: false, delay: true }, { n: 'Sourcing', c: false }, { n: 'Pkg Approval', c: false }, { n: 'Go-Live', c: false }] }
            ].map(item => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 border border-black/5 dark:border-white/10 rounded-sm bg-zinc-50/50 dark:bg-white/5 gap-3">
                <div className="w-48 shrink-0">
                  <h4 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate">{item.name}</h4>
                  <p className="text-[9px] text-zinc-450 uppercase tracking-widest mt-0.5">{item.cat} · {item.reg} · LAUNCH: {item.date}</p>
                </div>

                <div className="flex-1 flex justify-between items-center relative min-w-0 px-2">
                  <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-black/5 dark:bg-white/10 -translate-y-1/2 z-0" />
                  
                  {item.steps.map((st, i) => {
                    let indicator = 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 border border-zinc-300 dark:border-zinc-700';
                    if (st.c) {
                      indicator = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500';
                    } else if (st.delay) {
                      indicator = 'bg-red-500/10 text-red-500 border border-red-500 animate-pulse';
                    }

                    return (
                      <div key={st.n} className="flex flex-col items-center relative z-10 group/step">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8.5px] font-bold ${indicator}`}>
                          {st.c ? '✓' : st.delay ? '!' : i + 1}
                        </div>
                        <span className="text-[7.5px] font-extrabold uppercase mt-1 text-zinc-400 group-hover/step:text-zinc-700 dark:group-hover/step:text-zinc-200">
                          {st.n}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 4: Financial Impact | AI Insights & Predictions */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Financial Impact Chart */}
        <div className="xl:col-span-7 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Launch Financial Impact View</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">Proj Rev scaled to ₹Cr · Budget/Spent in $M</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData} margin={{ left: -25, right: 5, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', color: isDarkMode ? '#fff' : '#000' }}
                  itemStyle={{ fontSize: 9 }}
                  labelStyle={{ fontSize: 9, fontWeight: 'bold' }}
                />
                <Bar dataKey="Proj Rev (₹ Cr)" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={12} />
                <Bar dataKey="Budget ($M)" fill="#8b5cf6" radius={[2, 2, 0, 0]} barSize={12} />
                <Bar dataKey="Spent ($M)" fill="#10b981" radius={[2, 2, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Smart Predictions + Interactive Scenario Simulator */}
        <div className="xl:col-span-5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6d28d9] dark:text-[#a78bfa] flex items-center gap-1.5 font-sans">
                <Zap size={11} className="fill-[#6d28d9] dark:fill-[#a78bfa] text-[#6d28d9] dark:text-[#a78bfa]" />
                AI Smart Predictions
              </span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">
                Active Engine
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-purple-500/5 border border-purple-500/15 rounded-sm text-xs leading-normal">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">⚠️ Predicted Delay Warning</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                  AI predicts <span className="font-bold text-[#6d28d9] dark:text-[#a78bfa]">BrandC Biscuits Eco</span> has a <span className="font-bold text-red-500">78% probability of delay</span> due to packaging sourcing bottlenecks in Germany.
                </p>
              </div>

              <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-sm text-xs leading-normal">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">💡 Optimization Recommendation</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                  Onboarding domestic supplier <span className="font-bold">Avery Plastics</span> recovers 12 days and mitigates <span className="font-bold text-emerald-500">$2.1M</span> revenue exposure.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-3 mt-4 xl:mt-0">
            <h4 className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-400">Scenario Simulation Deck</h4>
            <div className="flex justify-between items-center p-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">Simulate APAC Cargo Delay</p>
                <p className="text-[9px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-none">+15d customs processing delay at ports</p>
              </div>
              <button 
                onClick={() => {
                  const state = !simulateDelay;
                  setSimulateDelay(state);
                  if (state) {
                    addToast('Simulation Activated', 'APAC shipping delay applied. Readiness score degraded.', '#ef4444');
                  } else {
                    addToast('Simulation Deactivated', 'Standard metrics restored.', '#3b82f6');
                  }
                }}
                className={`px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  simulateDelay 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                {simulateDelay ? 'STOP SIM' : 'RUN SIM'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Row 5: Cross Functional Readiness Tracker */}
      <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Cross-Functional Department Readiness</span>
          <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">Actual vs Target % Readiness</span>
        </div>

        <div className="h-72 max-w-xl mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke={isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: 9, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 8 }} />
              <Radar name="Actual Readiness" dataKey="Actual" stroke={isDarkMode ? "#a78bfa" : "#6d28d9"} fill={isDarkMode ? "#a78bfa" : "#6d28d9"} fillOpacity={0.2} />
              <Radar name="Target Threshold" dataKey="Target" stroke={isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} fill="transparent" strokeDasharray="3 3" />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', color: isDarkMode ? '#fff' : '#000' }} />
              <Legend wrapperStyle={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Floating Corner Toasts Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map(t => (
          <div 
            key={t.id} 
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            className="pointer-events-auto bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 p-3.5 rounded shadow-lg flex items-start gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: t.color }} />
            <div>
              <h5 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-100 leading-none">{t.title}</h5>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">{t.body}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
