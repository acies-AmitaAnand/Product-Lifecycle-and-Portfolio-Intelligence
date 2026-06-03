import React, { useState } from 'react';
import { 
  Layers, Calculator, Save, CheckCircle2, Info, TrendingUp, HelpCircle, ArrowRight, Award, AlertTriangle, Sparkles, RefreshCw, Package, FileText, ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Legend, ComposedChart
} from 'recharts';
import { Role } from '../../../types/dashboard';
import { SKUS } from '../../../constants/data';
import { ForecastAccuracySimulator } from './ForecastAccuracySimulator';

interface ProfitabilityTreeProps {
  role: Role;
  onAuditClick?: (metric: string | null) => void;
  isDarkMode: boolean;
}

interface Scenario {
  name: string;
  units: number;
  price: number;
  cost: number;
  logistics: number;
  promo: number;
  overhead: number;
  rev: number;
  gm: number;
  ebit: number;
  gmPct: string;
  ebitPct: string;
}

const VPProfitabilityTreeView: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const accentColor = isDarkMode ? '#a78bfa' : '#6d28d9';
  const gridStroke = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tickColor = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const tooltipBg = isDarkMode ? '#1f1f1f' : '#fff';
  const tooltipBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipText = isDarkMode ? '#fff' : '#000';


  const [showForecastSimulator, setShowForecastSimulator] = useState<boolean>(false);
  const [simRawMaterial, setSimRawMaterial] = useState<number>(0);
  const [simPriceChange, setSimPriceChange] = useState<number>(0);
  const [simPromoCut, setSimPromoCut] = useState<number>(0);
  const [selectedCell, setSelectedCell] = useState<{ category: string; month: string; val: number } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({
    'pt-revenue': false,
    'pt-cost': false,
    'pt-margin': false,
    'pt-c2s': false,
    'pt-leakage': false,
    'pt-dept': false,
  });

  const handleToggleNode = (id: string) => {
    setOpenNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSetAllNodes = (isOpen: boolean) => {
    setOpenNodes({
      'pt-revenue': isOpen,
      'pt-cost': isOpen,
      'pt-margin': isOpen,
      'pt-c2s': isOpen,
      'pt-leakage': isOpen,
      'pt-dept': isOpen,
    });
  };

  const [promoCampaigns, setPromoCampaigns] = useState([
    { id: 1, name: 'Choco Wafers Summer Deal', sku: 'Choco Wafers', category: 'Snacks', type: 'Price Off', lift: '+22%', spend: 18.4, revenue: 22.4, roi: -0.42, status: 'Promo Erosion' },
    { id: 2, name: 'Floor Cleaner Bundle', sku: 'Floor Cleaner', category: 'Household', type: 'Bundle', lift: '+14%', spend: 11.2, revenue: 13.0, roi: -0.18, status: 'Promo Erosion' },
    { id: 3, name: 'Green Tea BOGO', sku: 'Green Tea RTD', category: 'Beverages', type: 'BOGO', lift: '+31%', spend: 24.3, revenue: 28.0, roi: -0.62, status: 'Promo Erosion' },
    { id: 4, name: 'Mango Fizz Feature Display', sku: 'Mango Fizz', category: 'Beverages', type: 'Display', lift: '+18%', spend: 8.2, revenue: 18.4, roi: 1.24, status: 'High Perform' },
    { id: 5, name: 'Oat Cookies Endcap', sku: 'Oat Cookies', category: 'Snacks', type: 'Display', lift: '+25%', spend: 9.8, revenue: 25.0, roi: 1.55, status: 'High Perform' },
    { id: 6, name: 'Herbal Shampoo Digital', sku: 'Herbal Shampoo', category: 'Personal Care', type: 'Digital', lift: '+18%', spend: 11.4, revenue: 36.2, roi: 2.18, status: 'High Perform' },
  ]);

  const handlePrunePromo = (id: number, name: string) => {
    setPromoCampaigns(prev => prev.map(c => c.id === id ? { ...c, spend: 0, revenue: 0, roi: 0, status: 'Pruned' } : c));
  };

  const handleBoostPromo = (id: number, name: string) => {
    setPromoCampaigns(prev => prev.map(c => c.id === id ? { ...c, spend: Math.round(c.spend * 1.3 * 10) / 10, revenue: Math.round(c.revenue * 1.35 * 10) / 10, roi: Math.round(((c.revenue * 1.35) / (c.spend * 1.3) - 1) * 100) / 100 } : c));
  };

  const activeErosionPromos = promoCampaigns.filter(c => c.roi < 0 && c.status !== 'Pruned').length;

  const atRiskSKUs = [
    { name: 'Fabric Softener', cat: 'Household', margin: 15, promo: 0.76, rev: 28, isCrit: true },
    { name: 'Floor Cleaner', cat: 'Household', margin: 19, promo: 0.60, rev: 30, isCrit: true },
    { name: 'Choco Wafers', cat: 'Snacks', margin: 22, promo: 0.72, rev: 44, isCrit: true },
    { name: 'Foam Face Wash', cat: 'Personal Care', margin: 26, promo: 0.57, rev: 55, isCrit: false },
    { name: 'Green Tea RTD', cat: 'Beverages', margin: 29, promo: 0.62, rev: 76, isCrit: false },
  ];

  const marginTrendData = [
    { name: 'Jan', gross: 34.1, operating: 17.8, net: 10.4 },
    { name: 'Feb', gross: 34.4, operating: 17.9, net: 10.5 },
    { name: 'Mar', gross: 34.7, operating: 18.0, net: 10.6 },
    { name: 'Apr', gross: 35.0, operating: 18.1, net: 10.7 },
    { name: 'May', gross: 35.3, operating: 18.2, net: 10.8 },
    { name: 'Jun', gross: 35.6, operating: 18.3, net: 10.9 },
    { name: 'Jul', gross: 35.9, operating: 18.5, net: 11.0 },
    { name: 'Aug', gross: 36.1, operating: 18.6, net: 11.1 },
    { name: 'Sep', gross: 36.1, operating: 18.5, net: 11.1 },
    { name: 'Oct', gross: 36.2, operating: 18.4, net: 11.1 },
  ];

  const costBreakdownData = [
    { name: 'Manufacturing', value: 312, color: '#ef4444' },
    { name: 'Transportation', value: 68, color: '#f59e0b' },
    { name: 'Packaging', value: 44, color: '#8b5cf6' },
    { name: 'Marketing', value: 91, color: '#3b82f6' },
    { name: 'Warehouse', value: 38, color: '#10b981' },
  ];

  const PT_NODES = [
    {
      id: 'pt-revenue',
      icon: '📊',
      label: 'Revenue Breakdown',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.06)',
      dotColor: '#10b981',
      items: [
        { label: 'Product-wise revenue', val: '₹851 Cr', badge: '▲ 8.4%', bc: 'rgba(16,185,129,0.15)', bcolor: '#10b981' },
        { label: 'SKU-wise revenue', val: '127 SKUs', badge: '', bc: '', bcolor: '' },
        { label: 'Category contribution', val: '4 categories', badge: '', bc: '', bcolor: '' },
      ]
    },
    {
      id: 'pt-cost',
      icon: '📋',
      label: 'Cost Breakdown',
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.06)',
      dotColor: '#ef4444',
      items: [
        { label: 'Manufacturing costs', val: '₹312 Cr', badge: '', bc: '', bcolor: '' },
        { label: 'Transportation costs', val: '₹68 Cr', badge: '▲ 4%', bc: 'rgba(239,68,68,0.12)', bcolor: '#ef4444' },
        { label: 'Packaging costs', val: '₹44 Cr', badge: '', bc: '', bcolor: '' },
        { label: 'Marketing expenses', val: '₹91 Cr', badge: '', bc: '', bcolor: '' },
      ]
    },
    {
      id: 'pt-margin',
      icon: '％',
      label: 'Margin Analysis',
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.06)',
      dotColor: '#8b5cf6',
      items: [
        { label: 'Gross Margin (GM)', val: '36.2%', badge: '▲ 1.1pp', bc: 'rgba(139,92,246,0.12)', bcolor: '#8b5cf6' },
        { label: 'Operating Margin (OM)', val: '18.4%', badge: '', bc: '', bcolor: '' },
        { label: 'Net Margin (NM)', val: '11.1%', badge: '', bc: '', bcolor: '' },
      ]
    },
    {
      id: 'pt-c2s',
      icon: '📦',
      label: 'Cost-to-Serve Analysis',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.06)',
      dotColor: '#f59e0b',
      items: [
        { label: 'Cost to maintain each SKU', val: '₹4.2 Cr avg', badge: '', bc: '', bcolor: '' },
        { label: 'Active complex designs', val: '14 items', badge: '', bc: '', bcolor: '' },
      ]
    },
    {
      id: 'pt-leakage',
      icon: '⚠️',
      label: 'Leakage & Complexity Drivers',
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.06)',
      dotColor: '#ef4444',
      items: [
        { label: 'Excess inventory', val: '₹28 Cr', badge: 'Critical', bc: 'rgba(239,68,68,0.15)', bcolor: '#ef4444' },
        { label: 'Packaging complexity', val: '₹14 Cr', badge: 'High', bc: 'rgba(245,158,11,0.12)', bcolor: '#f59e0b' },
      ]
    },
    {
      id: 'pt-dept',
      icon: '🏢',
      label: 'Department Usage',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.06)',
      dotColor: '#3b82f6',
      items: [
        { label: 'Finance ownership', val: 'P&L Owner', badge: '', bc: '', bcolor: '' },
        { label: 'Pricing Team controls', val: 'Levers Active', badge: '', bc: '', bcolor: '' },
      ]
    },
  ];



  const marginVelocityAlerts = [
    { name: 'Snacks', detail: 'from 22% margin', delta: '-1.2pp/mo', status: 'critical', sColor: '#ef4444' },
    { name: 'Green Tea RTD', detail: 'Beverages · Now 29% margin', delta: '-1.1pp/mo', status: 'high', sColor: '#f59e0b' },
    { name: 'Foam Face Wash', detail: 'Personal Care · Now 26% margin', delta: '-1.0pp/mo', status: 'high', sColor: '#f59e0b' },
    { name: 'Fabric Softener', detail: 'Household · Now 15% margin', delta: '-1.0pp/mo', status: 'critical', sColor: '#ef4444' },
  ];

  const breakevenSKUs = [
    { name: 'Fabric Softener', detail: 'Household · Rev ₹28Cr', margin: 15, color: '#ef4444' },
    { name: 'Floor Cleaner', detail: 'Household · Rev ₹30Cr', margin: 19, color: '#f59e0b' },
  ];

  const monthsList = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const marginHealthmapData = [
    { category: 'Mango Fizz', months: [38, 38, 38, 38, 38, 42, 42, 42, 38, 38, 42, 44] },
    { category: 'Bitter Vanilla', months: [32, 32, 32, 32, 32, 32, 32, 36, 36, 36, 36, 37] },
    { category: 'Green Tea', months: [30, 30, 27, 27, 27, 30, 30, 31, 31, 32, 30, 29] },
    { category: 'Choc Cookies', months: [44, 44, 44, 44, 44, 40, 40, 40, 42, 42, 42, 41] },
    { category: 'Matcha Wafers', months: [40, 40, 38, 38, 38, 35, 35, 35, 38, 38, 41, 40] },
    { category: 'Choco Wafers', months: [28, 28, 22, 22, 22, 24, 24, 25, 28, 28, 25, 22] },
    { category: 'Hand Cream', months: [34, 34, 34, 33, 33, 33, 34, 34, 32, 32, 34, 34] },
    { category: 'Herbal Shampoo', months: [40, 40, 40, 40, 38, 38, 40, 40, 47, 47, 48, 45] }
  ];

  const forecastVsActualData = [
    { month: 'Jan', actual: 34.0, forecast: 34.8 },
    { month: 'Feb', actual: 34.4, forecast: 35.1 },
    { month: 'Mar', actual: 34.7, forecast: 35.4 },
    { month: 'Apr', actual: 35.0, forecast: 35.8 },
    { month: 'May', actual: 35.3, forecast: 36.1 },
    { month: 'Jun', actual: 35.6, forecast: 36.4 },
    { month: 'Jul', actual: 35.9, forecast: 36.7 },
    { month: 'Aug', actual: 36.1, forecast: 37.0 }
  ];

  const revenueVsProfitData = [
    { month: 'Jul', revenue: 58, profit: 22, margin: 38.0 },
    { month: 'Aug', revenue: 60, profit: 23, margin: 38.3 },
    { month: 'Sep', revenue: 63, profit: 24, margin: 38.8 },
    { month: 'Oct', revenue: 66, profit: 25, margin: 39.0 },
    { month: 'Nov', revenue: 68, profit: 26, margin: 38.2 },
    { month: 'Dec', revenue: 71, profit: 27, margin: 38.7 },
    { month: 'Jan', revenue: 73, profit: 28, margin: 38.8 },
    { month: 'Feb', revenue: 75, profit: 28.5, margin: 38.0 },
    { month: 'Mar', revenue: 78, profit: 29, margin: 38.2 },
    { month: 'Apr', revenue: 80, profit: 29.5, margin: 37.5 },
    { month: 'May', revenue: 82, profit: 31, margin: 37.8 },
    { month: 'Jun', revenue: 84, profit: 32, margin: 37.5 }
  ];

  const scenarioRev = 851.2 * (1 + simPriceChange / 100);
  const scenarioGp = 851.2 * (0.362 + (simPriceChange * 0.8) / 100 - (simRawMaterial * 0.6) / 100 + (simPromoCut * 0.4) / 100);
  const scenarioGmPct = scenarioRev > 0 ? ((scenarioGp / scenarioRev) * 100).toFixed(1) : '0';
  const scenarioGpImpact = scenarioGp - 851.2 * 0.362;
  const scenarioSkusBelow20 = simRawMaterial > 8 ? 4 : 2;



  if (showForecastSimulator) {
    return (
      <ForecastAccuracySimulator 
        isDarkMode={isDarkMode} 
        onClose={() => setShowForecastSimulator(false)} 
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-body pb-12">
      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-l-4 border-[#8b5cf6] dark:border-purple-400 rounded-r shadow-sm flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-[#8b5cf6]/15 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">🤖 AI Profitability Diagnosis</p>
          <p className="text-[11px] font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
            Portfolio gross margin increased <span className="text-emerald-500 font-extrabold">+1.1pp to 36.2%</span>. Total P&L leakage cost of <span className="text-[#8b5cf6] font-extrabold">₹64 Cr</span> represents 7.5% of total revenue. Promo erosion is high, with <span className="text-red-500 font-extrabold">{activeErosionPromos} active campaigns</span> destroying margin.
          </p>
        </div>
      </div>

      {/* Top Profit Contributors Card */}
      <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-3.5 border-b bg-teal-500/[0.03]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-650 dark:text-teal-400 flex items-center justify-center text-sm flex-shrink-0">
              <Award size={16} className="stroke-[2.5]" />
            </div>
            <span className="text-[12px] font-bold font-display text-teal-650 dark:text-teal-400">
              Top profit contributors
            </span>
          </div>
          <span className="text-[9.5px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
            Categories & Brands · YTD
          </span>
        </div>
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-black/[0.08] dark:divide-white/[0.08]">
          
          {/* BY CATEGORY */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">BY CATEGORY</h4>
            <div className="flex flex-row items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div className="w-[140px] h-[140px] flex-shrink-0 relative mx-auto sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Electronics', value: 9.4, percent: 30, color: '#1d4ed8' },
                        { name: 'Apparel', value: 7.2, percent: 23, color: '#2563eb' },
                        { name: 'Home & Living', value: 5.8, percent: 18, color: '#3b82f6' },
                        { name: 'Beauty', value: 4.9, percent: 16, color: '#60a5fa' },
                        { name: 'Sports', value: 4.3, percent: 14, color: '#93c5fd' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={56}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        '#1d4ed8',
                        '#2563eb',
                        '#3b82f6',
                        '#60a5fa',
                        '#93c5fd'
                      ].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                      itemStyle={{ fontSize: 9.5 }}
                      formatter={(value) => [`$${value}M`, 'Profit']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2 w-full">
                {[
                  { name: 'Electronics', value: 9.4, percent: 30, color: '#1d4ed8' },
                  { name: 'Apparel', value: 7.2, percent: 23, color: '#2563eb' },
                  { name: 'Home & Living', value: 5.8, percent: 18, color: '#3b82f6' },
                  { name: 'Beauty', value: 4.9, percent: 16, color: '#60a5fa' },
                  { name: 'Sports', value: 4.3, percent: 14, color: '#93c5fd' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm animate-pulse-slow" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-zinc-850 dark:text-zinc-150">${item.value}M</span>
                      <span className="text-zinc-450 dark:text-zinc-500 font-mono w-8 text-right">{item.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BY BRAND */}
          <div className="space-y-4 pt-6 lg:pt-0 lg:pl-8">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">BY BRAND</h4>
            <div className="flex flex-row items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div className="w-[140px] h-[140px] flex-shrink-0 relative mx-auto sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'BrandX', value: 6.1, percent: 19, color: '#047857' },
                        { name: 'NovaLine', value: 5.4, percent: 17, color: '#059669' },
                        { name: 'Apex', value: 4.8, percent: 15, color: '#10b981' },
                        { name: 'Zestora', value: 3.9, percent: 12, color: '#34d399' },
                        { name: 'Other', value: 11.4, percent: 36, color: '#a7f3d0' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={56}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        '#047857',
                        '#059669',
                        '#10b981',
                        '#34d399',
                        '#a7f3d0'
                      ].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                      itemStyle={{ fontSize: 9.5 }}
                      formatter={(value) => [`$${value}M`, 'Profit']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2 w-full">
                {[
                  { name: 'BrandX', value: 6.1, percent: 19, color: '#047857' },
                  { name: 'NovaLine', value: 5.4, percent: 17, color: '#059669' },
                  { name: 'Apex', value: 4.8, percent: 15, color: '#10b981' },
                  { name: 'Zestora', value: 3.9, percent: 12, color: '#34d399' },
                  { name: 'Other', value: 11.4, percent: 36, color: '#a7f3d0' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm animate-pulse-slow" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-zinc-850 dark:text-zinc-150">${item.value}M</span>
                      <span className="text-zinc-450 dark:text-zinc-500 font-mono w-8 text-right">{item.percent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Profit Leakage Card */}
      <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-3.5 border-b bg-red-500/[0.03]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-500/15 text-red-650 dark:text-red-400 flex items-center justify-center text-sm flex-shrink-0">
              <AlertTriangle size={16} className="stroke-[2.5]" />
            </div>
            <span className="text-[12px] font-bold font-display text-red-650 dark:text-red-400">
              Profit leakage — loss-making areas
            </span>
          </div>
          <span className="text-xs font-bold text-red-500 dark:text-red-450 font-mono">
            Total: −$3.1M
          </span>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Returns & refunds */}
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col justify-between min-h-[95px] relative overflow-hidden hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Returns & refunds</span>
              <span className="text-xs font-extrabold text-red-500 dark:text-red-400 font-mono">−$1.1M</span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-2 leading-relaxed">
              Return rate 9.8% vs 8.0% benchmark. Concentrated in Electronics (44% of returns).
            </p>
            <div className="w-full bg-black/5 dark:bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: '95%' }} />
            </div>
          </div>

          {/* Markdown losses */}
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col justify-between min-h-[95px] relative overflow-hidden hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Markdown losses</span>
              <span className="text-xs font-extrabold text-red-500 dark:text-red-400 font-mono">−$0.8M</span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-2 leading-relaxed">
              End-of-season markdowns 34% above plan — driven by Apparel overstock.
            </p>
            <div className="w-full bg-black/5 dark:bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: '72%' }} />
            </div>
          </div>

          {/* Expired inventory */}
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col justify-between min-h-[95px] relative overflow-hidden hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Expired inventory</span>
              <span className="text-xs font-extrabold text-red-500 dark:text-red-400 font-mono">−$0.6M</span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-2 leading-relaxed">
              SKU-level forecast accuracy at 71%; 12 slow-moving lines driving 80% of write-offs.
            </p>
            <div className="w-full bg-black/5 dark:bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: '54%' }} />
            </div>
          </div>

          {/* Channel margin erosion */}
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col justify-between min-h-[95px] relative overflow-hidden hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Channel margin erosion</span>
              <span className="text-xs font-extrabold text-red-500 dark:text-red-400 font-mono">−$0.4M</span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-2 leading-relaxed">
              Marketplace fees rose 1.2pp YoY; direct channel under-indexed.
            </p>
            <div className="w-full bg-black/5 dark:bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: '36%' }} />
            </div>
          </div>

          {/* Supplier overcharges */}
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col justify-between min-h-[95px] relative overflow-hidden hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Supplier overcharges</span>
              <span className="text-xs font-extrabold text-red-500 dark:text-red-400 font-mono">−$0.2M</span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-2 leading-relaxed">
              Billing anomalies in 3 supplier accounts identified via contract audit.
            </p>
            <div className="w-full bg-black/5 dark:bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: '18%' }} />
            </div>
          </div>

        </div>
      </div>

      {/* AI Opportunity Recommendations Card */}
      <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-3.5 border-b bg-emerald-500/[0.03]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-650 dark:text-emerald-400 flex items-center justify-center text-sm flex-shrink-0">
              <Sparkles size={16} className="stroke-[2.5]" />
            </div>
            <span className="text-[12px] font-bold font-display text-emerald-650 dark:text-emerald-400">
              AI opportunity recommendations
            </span>
          </div>
          <span className="text-[9.5px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
            4 actions · ~$1.6M potential
          </span>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Dynamic pricing engine */}
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col justify-between min-h-[145px] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
            <div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <TrendingUp size={16} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-205">Dynamic pricing engine</h4>
                  <p className="text-[10px] font-extrabold text-emerald-550 dark:text-emerald-400 mt-0.5">+$0.6M potential</p>
                </div>
              </div>
              <p className="text-[10px] text-zinc-550 dark:text-zinc-400 font-medium mt-3 leading-relaxed">
                Elasticity model on 2,400 SKUs optimises prices in real-time. Pilot on Electronics estimated 6.4% margin uplift.
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-[9px] font-bold text-emerald-655 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded-full">
                High impact
              </span>
              <button 
                onClick={() => setShowForecastSimulator(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-black/10 dark:border-white/10 rounded-lg text-[9.5px] font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-zinc-600 dark:text-zinc-300 cursor-pointer"
              >
                Deep dive <ArrowUpRight size={12} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Returns propensity AI */}
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col justify-between min-h-[145px] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
            <div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <RefreshCw size={16} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-205">Returns propensity AI</h4>
                  <p className="text-[10px] font-extrabold text-emerald-550 dark:text-emerald-400 mt-0.5">+$0.4M potential</p>
                </div>
              </div>
              <p className="text-[10px] text-zinc-550 dark:text-zinc-400 font-medium mt-3 leading-relaxed">
                Pre-shipment risk scoring cuts return rate from 9.8% → 8.0%. Integrates with OMS with 2-week setup.
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-[9px] font-bold text-emerald-655 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded-full">
                High impact
              </span>
              <button 
                onClick={() => setShowForecastSimulator(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-black/10 dark:border-white/10 rounded-lg text-[9.5px] font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-zinc-600 dark:text-zinc-300 cursor-pointer"
              >
                Deep dive <ArrowUpRight size={12} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* AI demand forecasting */}
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col justify-between min-h-[145px] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
            <div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Package size={16} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-205">AI demand forecasting</h4>
                  <p className="text-[10px] font-extrabold text-emerald-550 dark:text-emerald-400 mt-0.5">+$0.4M potential</p>
                </div>
              </div>
              <p className="text-[10px] text-zinc-550 dark:text-zinc-400 font-medium mt-3 leading-relaxed">
                LSTM time-series model lifts forecast accuracy to 88%, cutting overstock write-offs by 30% across 12 problem SKUs.
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-[9px] font-bold text-amber-655 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20 px-2.5 py-1 rounded-full">
                Medium
              </span>
              <button 
                onClick={() => setShowForecastSimulator(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-black/10 dark:border-white/10 rounded-lg text-[9.5px] font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-zinc-600 dark:text-zinc-300 cursor-pointer"
              >
                Deep dive <ArrowUpRight size={12} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Contract intelligence */}
          <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col justify-between min-h-[145px] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
            <div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 dark:text-red-400 flex items-center justify-center shrink-0">
                  <FileText size={16} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-205">Contract intelligence</h4>
                  <p className="text-[10px] font-extrabold text-emerald-550 dark:text-emerald-400 mt-0.5">+$0.2M potential</p>
                </div>
              </div>
              <p className="text-[10px] text-zinc-550 dark:text-zinc-400 font-medium mt-3 leading-relaxed">
                NLP audit of 340 supplier contracts surfaces billing anomalies and triggers renegotiation workflow automatically.
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-[9px] font-bold text-amber-655 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20 px-2.5 py-1 rounded-full">
                Medium
              </span>
              <button 
                onClick={() => setShowForecastSimulator(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-black/10 dark:border-white/10 rounded-lg text-[9.5px] font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-zinc-600 dark:text-zinc-300 cursor-pointer"
              >
                Deep dive <ArrowUpRight size={12} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* P&L Tree Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 rounded-xl p-4 gap-4 shadow-sm">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] dark:text-purple-300">P&L Tree Decomposition</h3>
          <p className="text-[9.5px] text-zinc-450 dark:text-zinc-500 font-medium mt-0.5">Explore granular financial metrics across key operational areas</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={() => handleSetAllNodes(true)}
            className="flex-1 sm:flex-initial px-3.5 py-1.5 border border-[#8b5cf6]/20 hover:border-[#8b5cf6]/40 bg-[#8b5cf6]/5 hover:bg-[#8b5cf6]/10 text-[#8b5cf6] dark:text-purple-300 text-[9.5px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            ⊞ Expand All
          </button>
          <button
            onClick={() => handleSetAllNodes(false)}
            className="flex-1 sm:flex-initial px-3.5 py-1.5 border border-zinc-500/20 hover:border-zinc-500/40 bg-zinc-500/5 hover:bg-zinc-500/10 text-zinc-500 dark:text-zinc-300 text-[9.5px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            ⊟ Collapse All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PT_NODES.map((n) => {
          const isOpen = openNodes[n.id];
          return (
            <div key={n.id} className={`glass-card bg-white dark:bg-[#1a1a24]/90 border transition-all rounded-xl overflow-hidden shadow-sm ${isOpen ? 'border-[#8b5cf6]/20 dark:border-white/10' : 'border-black/5 dark:border-white/5'}`}>
              <div 
                onClick={() => handleToggleNode(n.id)} 
                className={`flex items-center justify-between py-1.5 px-2.5 cursor-pointer hover:bg-black/[0.01] dark:hover:bg-white/[0.02] ${isOpen ? 'border-b border-black/5 dark:border-white/5' : ''}`}
                style={{ backgroundColor: isOpen ? 'rgba(139,92,246,0.03)' : 'transparent' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs" style={{ backgroundColor: n.bg, color: n.color }}>{n.icon}</div>
                  <span className="text-[11px] font-bold font-display" style={{ color: n.color }}>{n.label}</span>
                </div>
                <div className="text-[9px] font-bold uppercase text-zinc-400">
                  {isOpen ? '✕' : '▼'}
                </div>
              </div>
              <div className="transition-all duration-350 ease-in-out overflow-hidden" style={{ maxHeight: isOpen ? '500px' : '0px' }}>
                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                  {n.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2 py-2 px-3 text-[11px] font-semibold hover:bg-black/[0.005]">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: n.dotColor }} />
                      <span className="text-zinc-550 dark:text-zinc-400">{it.label}</span>
                      {it.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded ml-2" style={{ backgroundColor: it.bc, color: it.bcolor }}>
                          {it.badge}
                        </span>
                      )}
                      <span className="ml-auto font-mono text-[10px] text-zinc-800 dark:text-zinc-200">{it.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-3.5 border-b bg-[#f59e0b]/[0.03]">
          <div className="flex items-start flex-col gap-0.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/15 text-[#f59e0b] flex items-center justify-center text-sm flex-shrink-0">
                🎯
              </div>
              <span className="text-[12px] font-bold font-display text-[#f59e0b]">
                Promo ROI Tracker
              </span>
            </div>
            <p className="text-[9.5px] text-zinc-400 font-medium ml-9 mt-0.5">Volume lift vs margin cost — promos above break-even line are ROI-positive</p>
          </div>
          {activeErosionPromos > 0 && (
            <span className="text-[8.5px] font-black bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full shrink-0">
              {activeErosionPromos} promos destroying value
            </span>
          )}
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">📊 Campaign Spend vs Incremental Revenue vs ROI%</h4>
            <div className="h-64 border border-black/5 dark:border-white/5 p-4 rounded-lg bg-black/[0.005] dark:bg-white/[0.005]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={promoCampaigns} margin={{ top: 15, right: -5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 7.5 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fill: tickColor, fontSize: 8 }} axisLine={false} tickLine={false} label={{ value: 'Spend / Rev (₹ Cr)', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 8 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: tickColor, fontSize: 8 }} axisLine={false} tickLine={false} label={{ value: 'ROI Multiplier', angle: 90, position: 'insideRight', fill: tickColor, fontSize: 8 }} />
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }} itemStyle={{ fontSize: 9.5 }} />
                  <Legend wrapperStyle={{ fontSize: 8.5 }} />
                  <Bar yAxisId="left" dataKey="spend" name="Spend (₹ Cr)" fill="#f59e0b" radius={[2, 2, 0, 0]} barSize={25} />
                  <Bar yAxisId="left" dataKey="revenue" name="Incremental Revenue (₹ Cr)" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={25} />
                  <Line yAxisId="right" type="monotone" dataKey="roi" name="ROI Multiplier" stroke="#10b981" strokeWidth={2} dot={{ r: 3, strokeWidth: 1 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border border-black/10 dark:border-white/10 rounded-lg overflow-hidden bg-white dark:bg-zinc-900/50 shadow-sm">
            <div className="p-3 bg-black/[0.01] dark:bg-white/[0.01] border-b border-black/5 dark:border-white/5 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-zinc-400">
              <span>🎯 Marketing Campaigns Ledger</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <thead>
                  <tr className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    <th className="py-2.5 px-4">PROMO / SKU</th>
                    <th className="py-2.5 px-4">TYPE</th>
                    <th className="py-2.5 px-4 text-center">VOLUME LIFT</th>
                    <th className="py-2.5 px-4 text-right">MARGIN COST</th>
                    <th className="py-2.5 px-4 text-center">ROI</th>
                    <th className="py-2.5 px-4 text-center">ACTION CONTROLS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                  {promoCampaigns.map((c) => {
                    const isPruned = c.spend === 0;
                    return (
                      <tr key={c.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
                        <td className="py-3 px-4">
                          <p className="font-bold text-zinc-805 dark:text-zinc-200">{c.name}</p>
                          <p className="text-[9px] text-zinc-400 uppercase tracking-widest">{c.sku}</p>
                        </td>
                        <td className="py-3 px-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{c.type}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-blue-500">{isPruned ? '0%' : c.lift}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-red-400">₹{isPruned ? '0.0' : c.spend}Cr</td>
                        <td className="py-3 px-4 flex justify-center items-center gap-3">
                          <div className="w-24 bg-black/5 dark:bg-white/10 h-2 rounded relative flex items-center overflow-hidden shrink-0">
                            {c.roi < 0 ? (
                              <div className="absolute right-1/2 top-0 bottom-0 bg-red-400" style={{ width: `${Math.min(50, Math.abs(c.roi) * 60)}%` }} />
                            ) : (
                              <div className="absolute left-1/2 top-0 bottom-0 bg-emerald-400" style={{ width: `${Math.min(50, c.roi * 20)}%` }} />
                            )}
                            <div className="absolute left-1/2 w-px h-full bg-zinc-350 dark:bg-zinc-600" />
                          </div>
                          <span className={`w-12 font-mono font-bold text-[10.5px] ${isPruned ? 'text-zinc-400' : c.roi < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                            {isPruned ? '0.00x' : `${c.roi >= 0 ? '+' : ''}${c.roi.toFixed(2)}x`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              disabled={isPruned}
                              onClick={() => handlePrunePromo(c.id, c.name)}
                              className={`px-2 py-1 text-[8.5px] font-bold uppercase rounded border transition-all cursor-pointer ${isPruned ? 'border-zinc-200 text-zinc-450 opacity-40 cursor-not-allowed' : 'border-red-500/30 text-red-500 hover:bg-red-500/10'}`}
                            >
                              Prune / Sunset
                            </button>
                            <button
                              disabled={isPruned}
                              onClick={() => handleBoostPromo(c.id, c.name)}
                              className={`px-2 py-1 text-[8.5px] font-bold uppercase rounded border transition-all cursor-pointer ${isPruned ? 'border-zinc-200 text-zinc-450 opacity-40 cursor-not-allowed' : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'}`}
                            >
                              Boost (+30%)
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Margin Velocity Alerts</h4>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">SKUs declining faster than 2pp/month — auto-surfaced</p>
            </div>
            <span className="text-[8px] font-black bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full shrink-0">
              3 critical
            </span>
          </div>
          <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04] text-xs font-semibold">
            {marginVelocityAlerts.map((a, idx) => (
              <div key={idx} className="flex justify-between items-center py-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.sColor }} />
                  <div>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">{a.name}</p>
                    <p className="text-[9.5px] text-zinc-400 font-medium">{a.detail}</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                  {a.delta}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm space-y-4">
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Break-even SKU Radar</h4>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">SKUs near or below break-even — ranked by revenue at risk</p>
          </div>
          <div className="space-y-5 pt-2 text-xs font-semibold">
            {breakevenSKUs.map((s, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center font-bold text-zinc-805 dark:text-zinc-200">
                  <div>
                    <p>{s.name}</p>
                    <p className="text-[9px] text-zinc-450 uppercase font-medium">{s.detail}</p>
                  </div>
                  <span className="font-mono text-red-500 font-extrabold">{s.margin}% margin</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/15 h-2 rounded relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 bottom-0 rounded" 
                    style={{ 
                      width: `${s.margin * 2.5}%`,
                      backgroundColor: s.margin < 18 ? '#dc2626' : '#ea580c' 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-3.5 border-b bg-[#8b5cf6]/[0.03]">
          <div className="flex items-start flex-col gap-0.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#8b5cf6]/15 text-[#8b5cf6] flex items-center justify-center text-sm flex-shrink-0">
                🎛️
              </div>
              <span className="text-[12px] font-bold font-display text-[#8b5cf6]">
                Scenario Simulator — Instant Portfolio Impact
              </span>
            </div>
            <p className="text-[9.5px] text-zinc-400 font-medium ml-9 mt-0.5">Adjust a lever and see the portfolio-wide margin impact instantly — no manual calculation</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5 text-xs font-semibold">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                <span>Raw Material Cost Change</span>
                <span className="font-mono text-blue-500">{simRawMaterial >= 0 ? '+' : ''}{simRawMaterial}%</span>
              </div>
              <input 
                type="range" min="-10" max="20" step="1"
                value={simRawMaterial} onChange={(e) => setSimRawMaterial(parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
            <div className="space-y-1.5 text-xs font-semibold">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                <span>Price Change (All SKUs)</span>
                <span className="font-mono text-emerald-500">{simPriceChange >= 0 ? '+' : ''}{simPriceChange}%</span>
              </div>
              <input 
                type="range" min="-5" max="15" step="1"
                value={simPriceChange} onChange={(e) => setSimPriceChange(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div className="space-y-1.5 text-xs font-semibold">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                <span>Promo Spend Cut</span>
                <span className="font-mono text-[#8b5cf6]">{simPromoCut}%</span>
              </div>
              <input 
                type="range" min="0" max="50" step="5"
                value={simPromoCut} onChange={(e) => setSimPromoCut(parseInt(e.target.value))}
                className="w-full accent-[#8b5cf6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-black/5 dark:border-white/5">
            <div className="p-4 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-lg space-y-1">
              <p className="text-[8px] font-extrabold uppercase tracking-widest text-zinc-400">NEW REVENUE</p>
              <h5 className="text-base font-display font-black text-blue-500">₹{scenarioRev.toFixed(1)}Cr</h5>
              <p className="text-[9px] font-mono text-emerald-500 font-extrabold">₹{(scenarioRev - 851.2).toFixed(1)}Cr MTD</p>
            </div>
            <div className="p-4 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-lg space-y-1">
              <p className="text-[8px] font-extrabold uppercase tracking-widest text-zinc-400">NEW GROSS MARGIN</p>
              <h5 className="text-base font-display font-black text-emerald-500">{scenarioGmPct}%</h5>
              <p className="text-[9px] font-mono text-emerald-500 font-extrabold">Simulated</p>
            </div>
            <div className="p-4 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-lg space-y-1">
              <p className="text-[8px] font-extrabold uppercase tracking-widest text-zinc-400">GP IMPACT</p>
              <h5 className={`text-base font-display font-black ${scenarioGpImpact >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                ₹{scenarioGpImpact >= 0 ? '+' : ''}{scenarioGpImpact.toFixed(1)}Cr
              </h5>
              <p className="text-[9px] font-mono text-emerald-500 font-extrabold">Reclaimed</p>
            </div>
            <div className="p-4 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-lg space-y-1">
              <p className="text-[8px] font-extrabold uppercase tracking-widest text-zinc-400">SKUS BELOW 20% MARGIN</p>
              <h5 className={`text-base font-display font-black ${scenarioSkusBelow20 > 2 ? 'text-red-505' : 'text-zinc-700 dark:text-zinc-200'}`}>{scenarioSkusBelow20}</h5>
              <p className="text-[9px] font-mono text-red-500 font-extrabold">Critical</p>
            </div>
          </div>
        </div>
      </div>


      <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-3.5 border-b bg-emerald-500/[0.03]">
          <div className="flex items-start flex-col gap-0.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-sm flex-shrink-0">
                🗺️
              </div>
              <span className="text-[12px] font-bold font-display text-emerald-500">
                Rolling 12-Month Margin Heatmap
              </span>
            </div>
            <p className="text-[9.5px] text-zinc-400 font-medium ml-9 mt-0.5">Month vs SKU — color intensity represents margin % Spot seasonal dips and structural declines instantly</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="overflow-x-auto border border-black/10 dark:border-white/10 rounded-lg">
            <table className="w-full text-left border-collapse text-xs font-semibold">
              <thead>
                <tr className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="py-3 px-4 w-40">SKU</th>
                  {monthsList.map(m => (
                    <th key={m} className="py-3 px-1 text-center font-mono text-[9px]">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {marginHealthmapData.map((row) => (
                  <tr key={row.category} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
                    <td className="py-3 px-4 font-bold text-zinc-800 dark:text-zinc-200">{row.category}</td>
                    {row.months.map((val, idx) => {
                      const month = monthsList[idx];
                      let cellBg = 'bg-red-500/10 text-red-500 border border-red-500/20';
                      if (val >= 40) {
                        cellBg = 'bg-[#0f4d3a] text-[#34d399] border border-[#0f4d3a]/30';
                      } else if (val >= 35) {
                        cellBg = 'bg-[#1e5c4a] text-[#6ee7b7] border border-[#1e5c4a]/30';
                      } else if (val >= 30) {
                        cellBg = 'bg-[#115e59] text-[#2dd4bf] border border-[#115e59]/30';
                      } else if (val >= 25) {
                        cellBg = 'bg-[#7c2d12] text-[#fed7aa] border border-[#7c2d12]/30';
                      } else {
                        cellBg = 'bg-[#7f1d1d] text-[#fecaca] border border-[#7f1d1d]/30';
                      }
                      
                      const isSelected = selectedCell?.category === row.category && selectedCell?.month === month;

                      return (
                        <td key={idx} className="py-2 px-1 text-center">
                          <div 
                            onClick={() => setSelectedCell({ category: row.category, month, val })}
                            className={`mx-auto w-12 py-2 rounded font-mono text-[9.5px] font-bold cursor-pointer transition-all hover:scale-105 ${cellBg} ${isSelected ? 'ring-2 ring-[#8b5cf6] scale-105 shadow-md' : ''}`}
                          >
                            {val}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-black/5 dark:bg-white/5 px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 text-[8.5px] font-bold uppercase tracking-wider">
            <span className="text-zinc-400">Margin color:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-[#0f4d3a] border border-[#0f4d3a]" />
              <span>≥40%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-[#1e5c4a] border border-[#1e5c4a]" />
              <span>35-39%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-[#115e59] border border-[#115e59]" />
              <span>30-34%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-[#7c2d12] border border-[#7c2d12]" />
              <span>25-29%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-[#7f1d1d] border border-[#7f1d1d]" />
              <span>&lt;25%</span>
            </div>
          </div>

          {selectedCell ? (
            <div className="p-4 bg-[#8b5cf6]/[0.04] border border-[#8b5cf6]/20 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
              <div className="space-y-0.5">
                <span className="text-[7.5px] font-black uppercase bg-[#8b5cf6]/20 text-[#8b5cf6] px-2 py-0.5 rounded-sm">CELL DIAGNOSTIC</span>
                <h5 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                  SKU Category: <span className="text-[#8b5cf6] font-extrabold">{selectedCell.category}</span> · Month: <span className="font-mono">{selectedCell.month}</span>
                </h5>
                <p className="text-[9.5px] text-zinc-555 dark:text-zinc-400 font-medium">
                  Detailed audit shows gross margin of <span className="font-bold font-mono text-[#8b5cf6]">{selectedCell.val}%</span>. 
                  {selectedCell.val >= 40 ? ' Highly profitable segment, exceeding all target margin thresholds.' : selectedCell.val >= 35 ? ' Margin is strong and stable in line with expectations.' : selectedCell.val >= 30 ? ' Stable margin, monitored for commodity inflation pressure.' : ' Attention required! Promo leakage or COGS surge compressing bottom line.'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCell(null)}
                className="px-3.5 py-1.5 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-[9px] font-bold uppercase rounded cursor-pointer text-zinc-500 dark:text-zinc-400 shrink-0"
              >
                Close Audit
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-black/[0.01] dark:bg-white/[0.01] border border-dashed border-black/10 dark:border-white/10 rounded-lg text-center text-[10px] text-zinc-400 font-medium">
              💡 Tip: Click any monthly category percentage cell above to audit granular margin health.
            </div>
          )}
        </div>
      </div>

      {/* Revenue vs Profit Trend Card */}
      <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-150 uppercase tracking-wider">
              REVENUE VS PROFIT TREND — LAST 12 MONTHS
            </h3>
            
            {/* Custom Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-[10px] font-bold text-zinc-550 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#2563eb]" />
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#0d9488]" />
                <span>Gross profit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-0.5 border-t border-dashed border-[#ea580c] relative flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#ea580c] absolute" />
                </div>
                <span className="ml-1.5">Margin %</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueVsProfitData} margin={{ left: -15, right: 15, top: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
                
                {/* Left YAxis for Revenue & Profit */}
                <YAxis 
                  yAxisId="left" 
                  tick={{ fill: tickColor, fontSize: 9 }} 
                  tickFormatter={(val) => `$${val}M`} 
                  axisLine={false} 
                  tickLine={false} 
                />
                
                {/* Right YAxis for Margin % */}
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tick={{ fill: tickColor, fontSize: 9 }} 
                  tickFormatter={(val) => `${val}%`} 
                  domain={[30, 45]} 
                  ticks={[30, 32, 34, 36, 38, 40, 42, 45]} 
                  axisLine={false} 
                  tickLine={false} 
                />
                
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                  itemStyle={{ fontSize: 9.5 }}
                  formatter={(value: any, name: any) => {
                    if (name === 'Margin %') return [`${value}%`, name];
                    return [`$${value}M`, name];
                  }}
                />
                
                {/* Side-by-side grouped bars: Gross profit on left, Revenue on right */}
                <Bar 
                  yAxisId="left" 
                  dataKey="profit" 
                  name="Gross profit" 
                  fill="#0d9488" 
                  radius={[2, 2, 0, 0]} 
                  barSize={12} 
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="revenue" 
                  name="Revenue" 
                  fill="#2563eb" 
                  radius={[2, 2, 0, 0]} 
                  barSize={12} 
                />
                
                {/* Secondary Axis Line for Margin % */}
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="margin" 
                  name="Margin %" 
                  stroke="#ea580c" 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                  dot={{ r: 3.5, fill: '#ea580c', stroke: '#ea580c', strokeWidth: 1 }} 
                  activeDot={{ r: 5 }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card bg-white dark:bg-[#1a1a24]/90 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-black/5 dark:border-white/5">
          <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-150">Forecast vs Actual Margin</h3>
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">Are we tracking to the margin plan?</p>
        </div>
        <div className="p-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastVsActualData} margin={{ left: -25, right: 10, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis 
                  domain={[33.5, 37.5]} 
                  tick={{ fill: tickColor, fontSize: 9 }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `${val.toFixed(1)}%`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                  itemStyle={{ fontSize: 9.5 }}
                  formatter={(val: any) => [`${val.toFixed(1)}%`, 'GM %']}
                />
                <Legend wrapperStyle={{ fontSize: 8.5 }} verticalAlign="bottom" align="center" />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Actual GM%" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={{ r: 3.5, fill: '#10b981', stroke: '#10b981', strokeWidth: 1 }} 
                  activeDot={{ r: 5 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  name="Forecast GM%" 
                  stroke="#b0b0bc" 
                  strokeWidth={1.5} 
                  strokeDasharray="4 4" 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#16161c] text-white border border-white/10 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in">
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : toast.type === 'warning' ? 'bg-red-400' : 'bg-blue-400'}`} />
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}

    </div>
  );
};

export const ProfitabilityTree: React.FC<ProfitabilityTreeProps> = ({ role, isDarkMode }) => {
  if (role === 'VP Product Management') {
    return <VPProfitabilityTreeView isDarkMode={isDarkMode} />;
  }
  const accentColor = isDarkMode ? '#a78bfa' : '#6d28d9';
  const gridStroke = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tickColor = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const tooltipBg = isDarkMode ? '#1f1f1f' : '#fff';
  const tooltipBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipText = isDarkMode ? '#fff' : '#000';
  
  const [units, setUnits] = useState(850);
  const [price, setPrice] = useState(180);
  const [cost, setCost] = useState(95);
  const [logistics, setLogistics] = useState(18);
  const [promo, setPromo] = useState(4.5);
  const [overhead, setOverhead] = useState(8);

  const [hasCalculated, setHasCalculated] = useState(true);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  // Accordion guide
  const [guideOpen, setGuideOpen] = useState(false);

  // Financial calculations
  const rev = units * price / 100;
  const cogs = units * cost / 100;
  const gm = rev - cogs;
  const logCost = units * logistics / 100;
  const gmAfterLog = gm - logCost;
  const ebit = gmAfterLog - promo - overhead;
  const gmPct = rev > 0 ? (gm / rev * 100).toFixed(1) : '0';
  const ebitPct = rev > 0 ? (ebit / rev * 100).toFixed(1) : '0';

  // Waterfall dataset transformation for Recharts
  const rawWaterfall = [
    { name: 'Revenue', val: rev, type: 'total' },
    { name: 'COGS', val: -cogs, type: 'change' },
    { name: 'Gross Margin', val: gm, type: 'total' },
    { name: 'Logistics', val: -logCost, type: 'change' },
    { name: 'After Log', val: gmAfterLog, type: 'total' },
    { name: 'Promo', val: -promo, type: 'change' },
    { name: 'Overhead', val: -overhead, type: 'change' },
    { name: 'EBIT', val: ebit, type: 'total' }
  ];

  const waterfallChartData = rawWaterfall.map((d) => {
    let color = accentColor;
    if (d.type === 'total') {
      color = accentColor;
    } else {
      color = d.val >= 0 ? '#0F6E56' : '#A32D2D';
    }

    return {
      name: d.name,
      bottom: 0,
      value: Math.abs(d.val),
      displayVal: Math.abs(Math.round(d.val)),
      color: color
    };
  });

  const handleSaveScenario = () => {
    const sName = prompt('Scenario name:', `Scenario ${scenarios.length + 1}`);
    if (!sName) return;

    const newScenario: Scenario = {
      name: sName,
      units,
      price,
      cost,
      logistics,
      promo,
      overhead,
      rev: Math.round(rev),
      gm: Math.round(gm),
      ebit: Math.round(ebit),
      gmPct,
      ebitPct
    };

    setScenarios(prev => [...prev, newScenario]);
  };

  return (
    <div className="space-y-6">
      
      {/* Strategic Header */}
      <div className="glass-card bg-acies-gray text-white py-5 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
          <Layers size={100} />
        </div>
        <div>
          <p className="text-[9px] uppercase font-bold tracking-widest opacity-40 mb-2">Scenario Analysis Module · Tab 3 of 6</p>
          <h2 className="text-xl font-display font-medium text-white mb-2">Profitability Tree</h2>
          <p className="text-xs text-zinc-300 font-medium max-w-xl leading-relaxed">
            Decompose SKU profitability into core financial drivers. Adjust units, pricing, purchase costs, and overhead below, and instantly model P&L waterfall scenarios.
          </p>
        </div>
      </div>

      {/* Guide Accordion */}
      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4">
        <button 
          onClick={() => setGuideOpen(!guideOpen)}
          className="w-full text-left font-bold text-xs uppercase tracking-widest text-acies-yellow flex justify-between items-center cursor-pointer border-none bg-transparent"
        >
          <span>📖 Profitability modeling guide</span>
          <span className="text-[10px]">{guideOpen ? '✕ Collapse' : '▲ Expand'}</span>
        </button>

        {guideOpen && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-black/5 dark:border-white/5 mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">1. Enter P&L inputs</h4>
              <p>Fill units, price, purchase cost, logistics, promo spend, overhead. The waterfall calculates Gross → Net → EBITDA/EBIT live.</p>
            </div>
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">2. Read the waterfall</h4>
              <p>Green bars add value, red bars subtract. Each step shows the cumulative impact of cost-to-serve leakages on profitability.</p>
            </div>
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">3. Run what-if scenarios</h4>
              <p>Adjust any input slider and watch the waterfall update instantly. Model price increases, cost reductions, or promo cuts.</p>
            </div>
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">4. Compare scenarios</h4>
              <p>Save multiple scenarios and compare side-by-side to find optimal pricing and cost-reduction levers.</p>
            </div>
          </div>
        )}
      </div>

      {/* Inputs Form */}
      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4">💰 P&L Inputs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Units Sold (000s)</label>
            <input 
              type="number" 
              value={units}
              onChange={(e) => setUnits(parseInt(e.target.value) || 0)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Selling Price (₹)</label>
            <input 
              type="number" 
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Purchase Cost (₹)</label>
            <input 
              type="number" 
              value={cost}
              onChange={(e) => setCost(parseInt(e.target.value) || 0)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Logistics Cost (₹)</label>
            <input 
              type="number" 
              value={logistics}
              onChange={(e) => setLogistics(parseInt(e.target.value) || 0)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Promo Spend (₹ Cr)</label>
            <input 
              type="number" 
              value={promo}
              step="0.5"
              onChange={(e) => setPromo(parseFloat(e.target.value) || 0)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Overhead (₹ Cr)</label>
            <input 
              type="number" 
              value={overhead}
              step="0.5"
              onChange={(e) => setOverhead(parseFloat(e.target.value) || 0)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
          <button 
            onClick={() => setHasCalculated(true)}
            className="px-5 py-2 bg-acies-gray text-white text-[9px] font-bold uppercase tracking-widest hover:bg-acies-yellow hover:text-acies-gray transition-all cursor-pointer border-none"
          >
            Calculate
          </button>
          <button 
            onClick={handleSaveScenario}
            className="px-4 py-2 border border-black/10 dark:border-white/10 text-acies-yellow text-[9px] font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            Save Scenario
          </button>
        </div>
      </div>

      {/* Calculations & Charts Summary */}
      {hasCalculated && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Summary Metrics Grid */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
            <h4 className="text-xs font-bold uppercase tracking-widest pb-3 border-b border-black/5 dark:border-white/5 mb-4">
              P&L Summary Diagnosis
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-black/5 dark:bg-white/5 rounded-sm text-center">
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-45 mb-1">Revenue</p>
                <h5 className="text-base font-display font-extrabold text-blue-500">₹{Math.round(rev)}Cr</h5>
              </div>
              <div className="p-3 bg-black/5 dark:bg-white/5 rounded-sm text-center">
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-45 mb-1">Gross Margin</p>
                <h5 className="text-base font-display font-extrabold text-green-500">₹{Math.round(gm)}Cr ({gmPct}%)</h5>
              </div>
              <div className="p-3 bg-black/5 dark:bg-white/5 rounded-sm text-center">
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-45 mb-1">EBIT / EBITDA</p>
                <h5 className={`text-base font-display font-extrabold ${ebit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ₹{Math.round(ebit)}Cr ({ebitPct}%)
                </h5>
              </div>
              <div className="p-3 bg-black/5 dark:bg-white/5 rounded-sm text-center">
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-45 mb-1">Units (000s)</p>
                <h5 className="text-base font-display font-extrabold text-acies-gray dark:text-white">{units}</h5>
              </div>
            </div>
          </div>

          {/* Waterfall Chart */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1">Profitability Waterfall</h3>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">Revenue → EBITDA. Hover each step for driver details.</p>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallChartData} margin={{ top: 20, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: tickColor, fontSize: 9 }} label={{ value: '₹ Crore', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                    itemStyle={{ fontSize: 11 }}
                    formatter={(value: any, name: any, props: any) => {
                      return [`₹${props.payload.displayVal}Cr`, 'Value'];
                    }}
                  />
                  {/* Bottom transparent spacer bar for waterfall stack */}
                  <Bar dataKey="bottom" stackId="wfall" fill="transparent" />
                  
                  {/* Top visible waterfall bar */}
                  <Bar dataKey="value" stackId="wfall" radius={2}>
                    {waterfallChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Saved Scenarios List */}
          {scenarios.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest pl-1">Saved Comparative Scenarios</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {scenarios.map((s, idx) => (
                  <div key={idx} className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 space-y-3 relative">
                    <span className="absolute top-4 right-4 text-[7px] font-extrabold uppercase bg-acies-yellow/20 text-acies-yellow px-2 py-0.5 rounded-sm">
                      Saved
                    </span>
                    <h4 className="text-xs font-bold text-acies-gray dark:text-white pb-2 border-b border-black/5 dark:border-white/5 truncate max-w-[150px]">
                      {s.name}
                    </h4>
                    
                    <div className="space-y-1.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="text-blue-500 font-extrabold">₹{s.rev}Cr</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gross Margin:</span>
                        <span className="text-green-500 font-extrabold">₹{s.gm}Cr ({s.gmPct}%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EBITDA:</span>
                        <span className={`font-extrabold ${s.ebit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ₹{s.ebit}Cr ({s.ebitPct}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
