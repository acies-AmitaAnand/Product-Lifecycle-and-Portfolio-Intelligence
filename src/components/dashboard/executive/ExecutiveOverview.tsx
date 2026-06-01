import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Check, X, AlertTriangle, RefreshCw, Zap, Clock, Home, List, PieChart, BarChart2 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell, PieChart as RePieChart, Pie, Legend 
} from 'recharts';
import { Role } from '../../../types/dashboard';
import { 
  VP_ALERTS, VP_APPROVALS, VP_FORECAST, VP_KPI_BASE, SKUS 
} from '../../../constants/data';
import { SkuDetailsModal } from './SkuDetailsModal';
import { RegionalForecastModal } from './RegionalForecastModal';
import { EmailComposerModal } from '../portfolio-health/EmailComposerModal';


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

  // Category filter and modal states for Top SKU Performance card
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedSku, setSelectedSku] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [isEmailOpen, setIsEmailOpen] = useState<boolean>(false);
  const [emailData, setEmailData] = useState({ to: '', name: '', subject: '', body: '' });
  const [skuViewMode, setSkuViewMode] = useState<'list' | 'chart'>('list');
  const [hoveredSku, setHoveredSku] = useState<any>(null);
  const [regionViewMode, setRegionViewMode] = useState<'list' | 'chart'>('chart');


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

  // Top SKUs by revenue filtered by category
  const filteredSkus = activeCategory === 'All'
    ? SKUS
    : SKUS.filter(s => s.cat === activeCategory);
  const topSkus = [...filteredSkus].sort((a, b) => b.rev - a.rev).slice(0, 5);
  const maxSkuRev = topSkus[0]?.rev || 1;


  return (
    <div className="space-y-4">
      
      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => {
          const isUp = k.trend >= 0;
          const isRisk = i === 3; // Alerts card
          const trendIcon = isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />;
          const trendColor = isRisk 
            ? (isUp ? 'text-red-500 bg-red-500/10' : 'text-green-500 bg-green-500/10')
            : (isUp ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10');
          
          return (
            <div 
              key={k.label} 
              className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-3.5 relative overflow-hidden transition-all hover:border-acies-yellow/50 cursor-pointer"
              onClick={() => {
                if (i === 1) setActiveTab(1); // Portfolio Map
                if (i === 3) setActiveTab(5); // Signals Board
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: k.color }} />
              <p className="text-[8.5px] font-bold uppercase tracking-widest opacity-40 mb-1.5">{k.label}</p>
              <h3 className="text-xl font-display font-bold text-acies-gray dark:text-white leading-none mb-1.5">
                {k.fmt(k.value)}
              </h3>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-sm flex items-center gap-1 ${trendColor}`}>
                  {trendIcon}
                  {Math.abs(k.trend)}{i === 0 ? ' Cr' : i === 1 ? 'pp' : ''} MoM
                </span>
                
                {/* Micro Sparkline Chart */}
                <div className="w-16 h-6">
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
                        strokeWidth={1.2} 
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
      <div className="flex justify-end items-center gap-3 py-0.5">
        <span className="text-[8.5px] font-bold uppercase tracking-widest opacity-40 text-zinc-500 dark:text-zinc-400">
          {lastRefreshed}
        </span>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-1 px-2.5 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-acies-gray dark:text-white text-[8.5px] font-bold uppercase tracking-widest hover:bg-acies-yellow hover:text-acies-gray transition-all cursor-pointer rounded-sm"
        >
          <RefreshCw size={9} className="animate-spin-slow" />
          Refresh Data
        </button>
      </div>

      {/* Smart Alerts Dashboard */}
      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-3.5">
        <div className="flex justify-between items-center pb-2.5 border-b border-black/5 dark:border-white/5 mb-2.5">
          <h3 className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            Smart Alerts
            <span className="text-[9px] font-extrabold bg-red-500 text-white rounded-full px-1.5 py-0.5">
              {alerts.length}
            </span>
          </h3>
          {alerts.length > 0 && (
            <button 
              onClick={handleAckAllAlerts}
              className="text-[8px] font-bold uppercase tracking-widest border border-black/10 dark:border-white/10 px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              Acknowledge All
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="py-6 text-center text-zinc-400 dark:text-zinc-500 text-[11px] font-bold uppercase tracking-widest flex flex-col items-center gap-2">
            <Check size={22} className="text-green-500" />
            No active alerts — all clear
          </div>
        ) : (
          <div className="max-h-36 overflow-y-auto divide-y divide-black/5 dark:divide-white/5 pr-1.5">
            {alerts.map(a => {
              const borderCol = a.sev === 'critical' ? 'border-red-500/30' : a.sev === 'warning' ? 'border-amber-500/30' : 'border-blue-500/30';
              const indicatorCol = a.sev === 'critical' ? 'bg-red-500' : a.sev === 'warning' ? 'bg-amber-500' : 'bg-blue-500';
              return (
                <div key={a.id} className={`py-2 flex justify-between items-center gap-3 transition-all hover:bg-black/[0.01] dark:hover:bg-white/[0.02] border-l-2 ${borderCol} pl-2`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1 h-1 rounded-full shrink-0 ${indicatorCol}`} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-acies-gray dark:text-white truncate">{a.title}</p>
                      <p className="text-[9px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{a.detail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button 
                      onClick={() => setActiveTab(a.sev === 'critical' ? 4 : 5)} // jumps to relevant Tab
                      className="text-[8px] font-bold uppercase tracking-widest text-acies-yellow hover:underline cursor-pointer border-none bg-transparent"
                    >
                      Investigate
                    </button>
                    <button 
                      onClick={() => handleAckAlert(a.id)}
                      className="text-[8px] font-bold uppercase tracking-widest border border-black/10 dark:border-white/10 px-1.5 py-0.5 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
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
        <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-3.5 h-[320px] flex flex-col">
          <div className="mb-2.5">
            <h3 className="text-[11px] font-bold uppercase tracking-widest">Revenue Trend</h3>
            <p className="text-[8.5px] text-zinc-500 uppercase tracking-widest mt-0.5">Monthly Actual vs Target (₹ Cr) — This Year</p>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis dataKey="month" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 8 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 8 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }} 
                  itemStyle={{ color: tooltipText, fontSize: 10 }}
                  labelStyle={{ fontSize: 10, fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="Actual" stroke={accentColor} strokeWidth={2} activeDot={{ r: 5 }} dot={{ r: 2.5 }} />
                <Line type="monotone" dataKey="Target" stroke={isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} strokeDasharray="4 4" dot={false} strokeWidth={1.2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-3.5 h-[320px] flex flex-col">
          <div className="mb-2.5">
            <h3 className="text-[11px] font-bold uppercase tracking-widest">Category Performance</h3>
            <p className="text-[8.5px] text-zinc-550 dark:text-zinc-450 uppercase tracking-widest mt-0.5">Revenue ₹ Cr by Category — Current Month</p>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerfData} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                <XAxis type="number" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 8 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 8 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                  itemStyle={{ fontSize: 10 }}
                />
                <Bar dataKey="value" barSize={11} radius={[0, 3, 3, 0]}>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Top SKU Performance List */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-3.5 h-[360px] flex flex-col">
          <h3 className="text-[11px] font-bold uppercase tracking-widest pb-2 border-b border-black/5 dark:border-white/5 mb-2 flex items-center justify-between gap-1.5">
            <span>Top SKU Performance</span>
            <div className="flex items-center gap-2">
              <span className="text-[7.5px] font-extrabold opacity-40 uppercase">By Revenue</span>
              <div className="flex items-center border border-black/10 dark:border-white/10 rounded-sm overflow-hidden bg-black/5 dark:bg-white/5 p-0.5 ml-1 normal-case">
                <button
                  onClick={() => setSkuViewMode('list')}
                  className={`p-1 transition-all cursor-pointer border-none flex items-center justify-center rounded-sm ${
                    skuViewMode === 'list' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-transparent'
                  }`}
                  title="List View"
                >
                  <List size={15} />
                </button>
                <button
                  onClick={() => setSkuViewMode('chart')}
                  className={`p-1 transition-all cursor-pointer border-none flex items-center justify-center rounded-sm ${
                    skuViewMode === 'chart' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-transparent'
                  }`}
                  title="Pie Chart View"
                >
                  <PieChart size={15} />
                </button>
              </div>
            </div>
          </h3>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 mb-2.5 border-b border-black/5 dark:border-white/5 pb-2">
            {['All', 'Beverages', 'Snacks', 'Personal Care', 'Household'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all border border-black/5 dark:border-white/10 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-acies-yellow text-acies-gray font-extrabold border-acies-yellow'
                    : 'bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {skuViewMode === 'list' ? (
            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 min-h-0">
              {topSkus.map(s => {
                const widthPct = Math.round((s.rev / maxSkuRev) * 100);
                return (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSku(s)}
                    className="w-full text-left space-y-1 block hover:bg-black/5 dark:hover:bg-white/5 py-1.5 px-2.5 rounded transition-all group cursor-pointer border-none bg-transparent outline-none"
                  >
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="font-bold text-zinc-700 dark:text-zinc-350 group-hover:text-acies-yellow dark:group-hover:text-acies-yellow truncate max-w-[220px] transition-colors">
                        {s.name}
                      </span>
                      <span className="font-extrabold text-acies-yellow group-hover:underline">₹{s.rev}Cr</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-acies-yellow transition-all group-hover:bg-yellow-400" style={{ width: `${widthPct}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex items-center justify-center relative pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                    itemStyle={{ fontSize: 10 }}
                    formatter={(value: any, name: any) => [`₹${value}Cr`, name]}
                  />
                  <Pie
                    data={topSkus}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={100}
                    paddingAngle={1}
                    dataKey="rev"
                    nameKey="name"
                    onClick={(data) => setSelectedSku(data)}
                    onMouseEnter={(_, idx) => setHoveredSku(topSkus[idx])}
                    onMouseLeave={() => setHoveredSku(null)}
                    cursor="pointer"
                  >
                    {topSkus.map((entry, index) => {
                      const getSkuColor = (cat: string, idx: number) => {
                        if (cat === 'Beverages') return '#534AB7';
                        if (cat === 'Snacks') return '#0F6E56';
                        if (cat === 'Personal Care') return '#185FA5';
                        if (cat === 'Household') return '#854F0B';
                        const fallbackColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];
                        return fallbackColors[idx % fallbackColors.length];
                      };
                      return <Cell key={`cell-${index}`} fill={getSkuColor(entry.cat, index)} />;
                    })}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
              
              {/* Dynamic SKU details label at the bottom of the card */}
              <div className="absolute bottom-1 w-full text-center pointer-events-none px-4">
                {hoveredSku ? (
                  <span className="text-[9.5px] font-bold text-zinc-700 dark:text-zinc-350 bg-black/5 dark:bg-white/5 py-0.5 px-2 rounded-sm border border-black/5 dark:border-white/5 inline-block">
                    Hovered: <span className="font-extrabold text-[#6d28d9] dark:text-[#a78bfa]">{hoveredSku.name}</span> (₹{hoveredSku.rev}Cr)
                  </span>
                ) : (
                  <span className="text-[8.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    Hover slices to view details
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Forecast vs Actual by Region */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-3.5 h-[360px] flex flex-col">
          <h3 className="text-[11px] font-bold uppercase tracking-widest pb-2 border-b border-black/5 dark:border-white/5 mb-2 flex items-center justify-between gap-1.5">
            <span>Regional Forecast</span>
            <div className="flex items-center gap-2">
              <span className="text-[7.5px] font-extrabold opacity-40 uppercase">Actual vs Target</span>
              <div className="flex items-center border border-black/10 dark:border-white/10 rounded-sm overflow-hidden bg-black/5 dark:bg-white/5 p-0.5 ml-1 normal-case">
                <button
                  onClick={() => setRegionViewMode('list')}
                  className={`p-1 transition-all cursor-pointer border-none flex items-center justify-center rounded-sm ${
                    regionViewMode === 'list' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-transparent'
                  }`}
                  title="List View"
                >
                  <List size={15} />
                </button>
                <button
                  onClick={() => setRegionViewMode('chart')}
                  className={`p-1 transition-all cursor-pointer border-none flex items-center justify-center rounded-sm ${
                    regionViewMode === 'chart' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-transparent'
                  }`}
                  title="Grouped Bar Chart"
                >
                  <BarChart2 size={15} />
                </button>
              </div>
            </div>
          </h3>
          
          {regionViewMode === 'list' ? (
            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 min-h-0">
              {VP_FORECAST.map(f => {
                const widthPct = Math.min(100, Math.round((f.actual / f.target) * 100));
                const deltaColor = f.up ? 'text-green-500' : 'text-red-500';
                return (
                  <button
                    key={f.region}
                    onClick={() => setSelectedRegion(f)}
                    className="w-full text-left space-y-1.5 block hover:bg-black/5 dark:hover:bg-white/5 py-1.5 px-2.5 rounded transition-all group cursor-pointer border-none bg-transparent outline-none"
                  >
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="font-bold text-zinc-700 dark:text-zinc-350 group-hover:text-acies-yellow dark:group-hover:text-acies-yellow transition-colors">{f.region}</span>
                      <span className={`font-extrabold ${deltaColor} group-hover:underline`}>{f.delta}</span>
                    </div>
                    <div className="w-full h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-acies-yellow transition-all group-hover:bg-yellow-400" style={{ width: `${widthPct}%` }} />
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-550 dark:text-zinc-450 font-semibold uppercase tracking-wider">
                      <span>Actual: ₹{f.actual}Cr</span>
                      <span>Target: ₹{f.target}Cr</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col justify-between pt-1 pb-0.5">
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={VP_FORECAST} barGap={4} margin={{ top: 35, right: 15, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                    <XAxis 
                      dataKey="region" 
                      tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: 9, fontWeight: 'bold' }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      domain={[0, 350]}
                      ticks={[0, 50, 100, 150, 200, 250, 300, 350]}
                      tickFormatter={(val) => `₹${val}`}
                      tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: 8, fontWeight: 'bold' }} 
                      axisLine={false} 
                      tickLine={false}
                      width={35}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                      itemStyle={{ fontSize: 10 }}
                      formatter={(value: any) => [`₹${value}Cr`]}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="left"
                      iconType="square"
                      height={25}
                      iconSize={10}
                      wrapperStyle={{ fontSize: 10, fontWeight: 'bold', top: 0, paddingLeft: 10 }}
                    />
                    <Bar 
                      dataKey="actual" 
                      name="Actual" 
                      fill={isDarkMode ? '#818cf8' : '#4f46e5'} 
                      barSize={30} 
                      radius={[4, 4, 0, 0]} 
                      onClick={(data) => setSelectedRegion(data)}
                      cursor="pointer"
                    />
                    <Bar 
                      dataKey="target" 
                      name="Target" 
                      fill={isDarkMode ? '#facc15' : '#ca8a04'} 
                      barSize={30} 
                      radius={[4, 4, 0, 0]} 
                      onClick={(data) => setSelectedRegion(data)}
                      cursor="pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[8.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center mt-1.5">
                Click bars to open regional mitigation controls
              </div>
            </div>
          )}
        </div>
        </div>

      {/* Sku Details Modal */}
      <SkuDetailsModal 
        isOpen={!!selectedSku} 
        sku={selectedSku} 
        onClose={() => setSelectedSku(null)}
        onRequestAction={(email, name, subject, body) => {
          setEmailData({ to: email, name, subject, body });
          setIsEmailOpen(true);
        }}
      />

      {/* Regional Forecast Modal */}
      <RegionalForecastModal 
        isOpen={!!selectedRegion}
        region={selectedRegion}
        onClose={() => setSelectedRegion(null)}
        onRequestAction={(email, name, subject, body) => {
          setEmailData({ to: email, name, subject, body });
          setIsEmailOpen(true);
        }}
      />

      {/* Email Composer Modal */}
      <EmailComposerModal 
        isOpen={isEmailOpen}
        onClose={() => setIsEmailOpen(false)}
        initialEmail={emailData}
        onSend={(recipientName, recipientEmail, subject, body) => {
          // Simulate email sent message
          alert(`Mitigation request email successfully sent to ${recipientName} (${recipientEmail})!`);
          setIsEmailOpen(false);
        }}
      />

    </div>
  );
};
