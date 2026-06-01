import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Check, X, AlertTriangle, RefreshCw, Zap, Clock, Home 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell 
} from 'recharts';
import { Role } from '../../../types/dashboard';
import { 
  VP_ALERTS, VP_APPROVALS, VP_FORECAST, VP_KPI_BASE, SKUS 
} from '../../../constants/data';

interface ExecutiveOverviewProps {
  role: Role;
  setActiveTab: (tab: number) => void;
  isDarkMode: boolean;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ role: _role, setActiveTab, isDarkMode }) => {
  const [alerts, setAlerts] = useState(() => VP_ALERTS.map(a => ({ ...a })));
  const [approvals, setApprovals] = useState(() => VP_APPROVALS.map(a => ({ ...a })));
  const [kpis, setKpis] = useState(() => VP_KPI_BASE.map(k => ({ ...k, sparkPoints: k.spark.map((v, i) => ({ index: i, value: v })) })));
  const [lastRefreshed, setLastRefreshed] = useState<string>('Refreshed just now');

  // Dynamic accent color based on theme
  const accentColor = isDarkMode ? '#a78bfa' : '#6d28d9';
  const tooltipBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const tooltipBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipText = isDarkMode ? '#fff' : '#000';
  const gridStroke = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleRefresh = () => {
    // Jitter KPIs slightly to simulate real-time updates
    setKpis(prevKpis => prevKpis.map((kpi, idx) => {
      let newValue = kpi.value;
      if (idx === 0) {
        newValue = +(kpi.value + (Math.random() * 0.6 - 0.2)).toFixed(1);
      } else if (idx === 1) {
        newValue = +(kpi.value + (Math.random() * 0.04 - 0.01)).toFixed(1);
      }
      
      const newSpark = [...kpi.spark.slice(1), newValue];
      return {
        ...kpi,
        value: newValue,
        spark: newSpark,
        sparkPoints: newSpark.map((v, i) => ({ index: i, value: v }))
      };
    }));

    setLastRefreshed('Refreshed just now at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleAckAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleAckAllAlerts = () => {
    setAlerts([]);
  };

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
  };

  const handleReject = (id: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
  };

  // Recharts actual vs target data
  const revMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revActual = [58, 61, 65, 70, 74, 77, 80, 84, 88, 91];
  const revTarget = [60, 63, 66, 70, 74, 76, 80, 83, 86, 90, 93, 96];

  const revenueTrendData = revMonths.map((m, idx) => ({
    month: m,
    Actual: idx < revActual.length ? revActual[idx] : null,
    Target: revTarget[idx]
  }));

  // Category performance
  const categoryPerfData = [
    { name: 'Beverages', value: 316, color: '#534AB7' },
    { name: 'Snacks', value: 253, color: '#0F6E56' },
    { name: 'Personal Care', value: 225, color: '#185FA5' },
    { name: 'Household', value: 145, color: '#854F0B' }
  ];

  // Top SKUs by revenue
  const topSkus = [...SKUS].sort((a, b) => b.rev - a.rev).slice(0, 5);
  const maxSkuRev = topSkus[0]?.rev || 1;

  return (
    <div className="space-y-6">
      
      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => {
          const isUp = k.trend >= 0;
          const isRisk = i === 3; // Alerts card
          const trendIcon = isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />;
          const trendColor = isRisk 
            ? (isUp ? 'text-red-500 bg-red-500/10' : 'text-green-500 bg-green-500/10')
            : (isUp ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10');
          
          return (
            <div 
              key={k.label} 
              className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5 relative overflow-hidden transition-all hover:border-acies-yellow/50 cursor-pointer"
              onClick={() => {
                if (i === 1) setActiveTab(1); // Portfolio Map
                if (i === 3) setActiveTab(5); // Signals Board
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: k.color }} />
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2">{k.label}</p>
              <h3 className="text-2xl font-display font-bold text-acies-gray dark:text-white leading-none mb-2">
                {k.fmt(k.value)}
              </h3>
              <div className="flex items-center justify-between mt-4">
                <span className={`text-[8.5px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-sm flex items-center gap-1 ${trendColor}`}>
                  {trendIcon}
                  {Math.abs(k.trend)}{i === 0 ? ' Cr' : i === 1 ? 'pp' : ''} MoM
                </span>
                
                {/* Micro Sparkline Chart */}
                <div className="w-20 h-7">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={k.sparkPoints}>
                      <defs>
                        <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={k.color} stopOpacity={0.2}/>
                          <stop offset="100%" stopColor={k.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={k.color} 
                        strokeWidth={1.5} 
                        fill={`url(#grad-${i})`} 
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inline Refresh Options */}
      <div className="flex justify-end items-center gap-3 py-1">
        <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 text-zinc-500 dark:text-zinc-400">
          {lastRefreshed}
        </span>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-acies-gray dark:text-white text-[9px] font-bold uppercase tracking-widest hover:bg-acies-yellow hover:text-acies-gray transition-all cursor-pointer rounded-sm"
        >
          <RefreshCw size={10} className="animate-spin-slow" />
          Refresh Data
        </button>
      </div>

      {/* Smart Alerts Dashboard */}
      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
        <div className="flex justify-between items-center pb-4 border-b border-black/5 dark:border-white/5 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            Smart Alerts
            <span className="text-[10px] font-extrabold bg-red-500 text-white rounded-full px-2 py-0.5">
              {alerts.length}
            </span>
          </h3>
          {alerts.length > 0 && (
            <button 
              onClick={handleAckAllAlerts}
              className="text-[9px] font-bold uppercase tracking-widest border border-black/10 dark:border-white/10 px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              Acknowledge All
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-3">
            <Check size={28} className="text-green-500" />
            No active alerts — all clear
          </div>
        ) : (
          <div className="max-h-56 overflow-y-auto divide-y divide-black/5 dark:divide-white/5 pr-2">
            {alerts.map(a => {
              const borderCol = a.sev === 'critical' ? 'border-red-500/30' : a.sev === 'warning' ? 'border-amber-500/30' : 'border-blue-500/30';
              const indicatorCol = a.sev === 'critical' ? 'bg-red-500' : a.sev === 'warning' ? 'bg-amber-500' : 'bg-blue-500';
              return (
                <div key={a.id} className={`py-3.5 flex justify-between items-center gap-4 transition-all hover:bg-black/[0.01] dark:hover:bg-white/[0.02] border-l-2 ${borderCol} pl-3`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${indicatorCol}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-acies-gray dark:text-white truncate">{a.title}</p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{a.detail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => setActiveTab(a.sev === 'critical' ? 4 : 5)} // jumps to relevant Tab
                      className="text-[9px] font-bold uppercase tracking-widest text-acies-yellow hover:underline cursor-pointer border-none bg-transparent"
                    >
                      Investigate
                    </button>
                    <button 
                      onClick={() => handleAckAlert(a.id)}
                      className="text-[9px] font-bold uppercase tracking-widest border border-black/10 dark:border-white/10 px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Revenue Trend actual vs target */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest">Revenue Trend</h3>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">Monthly Actual vs Target (₹ Cr) — This Year</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis dataKey="month" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }} 
                  itemStyle={{ color: tooltipText, fontSize: 11 }}
                  labelStyle={{ fontSize: 11, fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="Actual" stroke={accentColor} strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Target" stroke={isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} strokeDasharray="4 4" dot={false} strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest">Category Performance</h3>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">Revenue ₹ Cr by Category — Current Month</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerfData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                <XAxis type="number" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                  itemStyle={{ fontSize: 11 }}
                />
                <Bar dataKey="value" barSize={14} radius={[0, 4, 4, 0]}>
                  {categoryPerfData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Row grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Top SKU Performance List */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest pb-3 border-b border-black/5 dark:border-white/5 mb-3 flex items-center gap-1.5">
            Top SKU Performance
            <span className="text-[8px] font-extrabold opacity-40 uppercase">By Revenue</span>
          </h3>
          <div className="space-y-3.5">
            {topSkus.map(s => {
              const widthPct = Math.round((s.rev / maxSkuRev) * 100);
              return (
                <div key={s.name} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-acies-gray dark:text-white truncate max-w-[150px]">{s.name}</span>
                    <span className="font-extrabold text-acies-yellow">₹{s.rev}Cr</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-acies-yellow transition-all" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest pb-3 border-b border-black/5 dark:border-white/5 mb-3 flex justify-between items-center">
            Pending Approvals
            <span className="text-[9px] font-extrabold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-sm">
              {approvals.length} Urgent
            </span>
          </h3>
          
          {approvals.length === 0 ? (
            <div className="py-8 text-center text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest">
              All caught up!
            </div>
          ) : (
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {approvals.map(a => {
                const badgeColor = a.type === 'Launch' ? 'bg-blue-500/20 text-blue-400' : a.type === 'Promo' ? 'bg-purple-500/20 text-purple-400' : 'bg-red-500/20 text-red-400';
                return (
                  <div key={a.id} className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-sm flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-sm ${badgeColor}`}>
                        {a.type}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-bold">{a.age} ago</span>
                    </div>
                    <p className="text-[11px] font-medium text-acies-gray dark:text-white leading-tight truncate">{a.title}</p>
                    <div className="flex gap-2 justify-end mt-1">
                      <button 
                        onClick={() => handleReject(a.id)}
                        className="p-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-sm transition-all cursor-pointer border-none"
                      >
                        <X size={11} />
                      </button>
                      <button 
                        onClick={() => handleApprove(a.id)}
                        className="p-1 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-sm transition-all cursor-pointer border-none"
                      >
                        <Check size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Forecast vs Actual by Region */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest pb-3 border-b border-black/5 dark:border-white/5 mb-3 flex items-center gap-1.5">
            Regional Forecast
            <span className="text-[8px] font-extrabold opacity-40 uppercase">Actual vs Target</span>
          </h3>
          <div className="space-y-4">
            {VP_FORECAST.map(f => {
              const widthPct = Math.min(100, Math.round((f.actual / f.target) * 100));
              const deltaColor = f.up ? 'text-green-500' : 'text-red-500';
              return (
                <div key={f.region} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-acies-gray dark:text-white">{f.region}</span>
                    <span className={`font-extrabold ${deltaColor}`}>{f.delta}</span>
                  </div>
                  <div className="w-full h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-acies-yellow transition-all" style={{ width: `${widthPct}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                    <span>Actual: ₹{f.actual}Cr</span>
                    <span>Target: ₹{f.target}Cr</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
