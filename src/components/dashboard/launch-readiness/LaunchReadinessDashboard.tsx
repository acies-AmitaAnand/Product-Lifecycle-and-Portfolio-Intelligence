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
import { VPLaunchReadinessView } from './VPLaunchReadinessView';

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
          <p className="text-[9px] uppercase font-bold tracking-widest opacity-40 mb-2">Portfolio Launch Readiness</p>
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
