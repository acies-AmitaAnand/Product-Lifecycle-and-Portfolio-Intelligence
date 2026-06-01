/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Globe, TrendingUp, TrendingDown, Layers, BarChart3, Clock, ShieldAlert, Zap, Mail, Calendar, Info, Tag, Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { SKUS } from '../../../constants/data';
import { EmailComposerModal } from '../portfolio-health/EmailComposerModal';

interface TopDownDrilldownProps {
  isDarkMode: boolean;
  role: string;
}

const REGIONS_CONFIG: Record<string, { name: string; manager: string; email: string; role: string; plant: string }> = {
  APAC: { name: 'Asia-Pacific', manager: 'Vijay Kumar', email: 'vijay.kumar@aciesglobal.com', role: 'APAC Logistics Head', plant: 'Chennai Bottling Plant' },
  Americas: { name: 'North & South America', manager: 'Gautam Sen', email: 'gautam.sen@aciesglobal.com', role: 'National Distribution Manager', plant: 'Vapi Consumer Goods Hub' },
  EMEA: { name: 'Europe, Middle East & Africa', manager: 'Jean-Pierre Dubois', email: 'jp.dubois@aciesglobal.com', role: 'Commodities Hedging Director', plant: 'Baddi Manufacturing Hub' },
  LATAM: { name: 'Latin America', manager: 'Dieter Maes', email: 'dieter.maes@aciesglobal.com', role: 'Production Scheduler', plant: 'Vapi Consumer Goods Hub' },
};

const REGION_SKUS: Record<string, string[]> = {
  APAC: ['Mango Fizz 500ml', 'Oat Cookies', 'Herbal Shampoo', 'Hand Cream SPF'],
  Americas: ['Choco Wafers', 'Fabric Softener', 'Floor Cleaner', 'Green Tea RTD'],
  EMEA: ['Dish Soap 1L', 'Aloe Vera Drink', 'Masala Puffs', 'Foam Face Wash'],
  LATAM: ['Mango Fizz 500ml', 'Oat Cookies', 'Fabric Softener', 'Floor Cleaner'],
};

export const TopDownDrilldown: React.FC<TopDownDrilldownProps> = ({ isDarkMode, role: _role }) => {
  // Step 1: Selection states
  const [timeHorizon, setTimeHorizon] = useState<'Q1' | 'Q2' | 'H1' | 'FY'>('Q2');
  const [selectedMetric, setSelectedMetric] = useState<'rev' | 'margin' | 'otif'>('rev');
  
  // Step 2: Region selection state
  const [selectedRegion, setSelectedRegion] = useState<string>('APAC');

  // Step 3: SKU selection state
  const activeRegionSkus = REGION_SKUS[selectedRegion] || [];
  const [selectedSkuName, setSelectedSkuName] = useState<string>(activeRegionSkus[0]);

  // Adjust selected SKU if region changes
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    const skusForRegion = REGION_SKUS[region] || [];
    setSelectedSkuName(skusForRegion[0]);
  };

  // Step 4: Email Modal states
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailData, setEmailData] = useState({ to: '', name: '', subject: '', body: '' });

  // Theme accents
  const accentColor = isDarkMode ? '#a78bfa' : '#6d28d9';
  const gridStroke = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tickColor = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const tooltipBg = isDarkMode ? '#1f1f1f' : '#fff';
  const tooltipBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipText = isDarkMode ? '#fff' : '#000';

  // Dynamic multipliers based on time horizon
  const getHorizonMultiplier = () => {
    switch (timeHorizon) {
      case 'Q1': return 0.92;
      case 'H1': return 2.0;
      case 'FY': return 4.1;
      case 'Q2':
      default: return 1.0;
    }
  };

  const multiplier = getHorizonMultiplier();

  // Dynamic regional metrics configuration
  const getRegionMetrics = (regionKey: string) => {
    const mult = multiplier;
    switch (regionKey) {
      case 'APAC':
        return {
          rev: { actual: 312 * mult, target: 290 * mult, unit: '₹ Cr', label: 'Revenue' },
          margin: { actual: 38.5, target: 38.0, unit: '%', label: 'Avg Margin' },
          otif: { actual: 96.5, target: 95.0, unit: '%', label: 'OTIF Fulfillment' }
        };
      case 'Americas':
        return {
          rev: { actual: 228 * mult, target: 240 * mult, unit: '₹ Cr', label: 'Revenue' },
          margin: { actual: 32.5, target: 35.0, unit: '%', label: 'Avg Margin' },
          otif: { actual: 88.2, target: 92.0, unit: '%', label: 'OTIF Fulfillment' }
        };
      case 'EMEA':
        return {
          rev: { actual: 311 * mult, target: 305 * mult, unit: '₹ Cr', label: 'Revenue' },
          margin: { actual: 36.8, target: 36.0, unit: '%', label: 'Avg Margin' },
          otif: { actual: 93.4, target: 93.0, unit: '%', label: 'OTIF Fulfillment' }
        };
      case 'LATAM':
      default:
        return {
          rev: { actual: 145 * mult, target: 155 * mult, unit: '₹ Cr', label: 'Revenue' },
          margin: { actual: 33.2, target: 34.0, unit: '%', label: 'Avg Margin' },
          otif: { actual: 90.1, target: 91.0, unit: '%', label: 'OTIF Fulfillment' }
        };
    }
  };

  // Find SKU details
  const rawSku = SKUS.find(s => s.name === selectedSkuName) || SKUS[0];
  
  // Calculate scaled SKU metrics based on horizon
  const skuRev = rawSku.rev * multiplier;
  const skuMargin = rawSku.margin;
  const skuGrowth = rawSku.growth;
  const skuPromo = rawSku.promo;
  const skuLead = rawSku.lead;
  const skuStockouts = Math.max(1, Math.round(rawSku.stockouts * (timeHorizon === 'FY' ? 4 : timeHorizon === 'H1' ? 2 : 1)));

  // Calculate Profitability Bridge (Waterfall data)
  const wRevenue = skuRev;
  const wTradePromo = +(skuRev * skuPromo * 0.18).toFixed(1);
  const wCOGS = +(skuRev * (1 - skuMargin / 100) * 0.65).toFixed(1);
  const wLogistics = +(skuRev * 0.08 + (skuLead * 0.08)).toFixed(1);
  const wNetProfit = +(wRevenue - wTradePromo - wCOGS - wLogistics).toFixed(1);

  const waterfallData = [
    { name: 'Revenue', bottom: 0, value: wRevenue, displayVal: wRevenue, color: isDarkMode ? '#a78bfa' : '#6d28d9' },
    { name: 'Trade Promo', bottom: +(wRevenue - wTradePromo).toFixed(1), value: wTradePromo, displayVal: -wTradePromo, color: '#f87171' },
    { name: 'COGS', bottom: +(wRevenue - wTradePromo - wCOGS).toFixed(1), value: wCOGS, displayVal: -wCOGS, color: '#fb923c' },
    { name: 'Logistics', bottom: +wNetProfit.toFixed(1), value: wLogistics, displayVal: -wLogistics, color: '#60a5fa' },
    { name: 'Net Profit', bottom: 0, value: wNetProfit, displayVal: wNetProfit, color: '#34d399' }
  ];

  // Dynamic insights & recommendations
  const getSkuInsights = () => {
    const regionObj = REGIONS_CONFIG[selectedRegion];
    const recs: { title: string; desc: string; email: string; body: string }[] = [];

    if (rawSku.cx >= 0.6 && rawSku.margin < 30) {
      recs.push({
        title: 'Review Tail Rationalization & Variant Consolidation',
        desc: `Operational complexity index stands at ${rawSku.cx.toFixed(2)} with only ${rawSku.margin}% gross margin.`,
        email: regionObj.email,
        body: `Hi ${regionObj.manager.split(' ')[0]},

Regarding our SKU "${rawSku.name}" in the ${selectedRegion} market. It is operating with a complexity index of ${rawSku.cx.toFixed(2)} and compressed margin of ${rawSku.margin}%, placing it in our rationalization scope. 

Could we schedule a category audit to examine variant consolidation options at the ${regionObj.plant}?

Thanks,
Executive Director`
      });
    } else if (rawSku.promo > 0.45) {
      recs.push({
        title: 'Rollback Trade Promotion Caps to Recover Margin',
        desc: `${Math.round(rawSku.promo * 100)}% of sales are promo-driven. Shift spend to brand equity campaigns.`,
        email: 'rajesh.verma@aciesglobal.com',
        body: `Hi Rajesh,

Looking at the promo reliance for "${rawSku.name}" in ${selectedRegion}. With ${Math.round(rawSku.promo * 100)}% of sales driven by discounts, our trade promo spend is ₹${wTradePromo} Cr. This is diluting our margins.

We need to implement a selective promotional cap (maximum 30% discount ceiling) next quarter. Let's align on next steps.

Regards,
Executive Director`
      });
    }

    if (skuStockouts > 3 || rawSku.lead > 20) {
      recs.push({
        title: 'Qualify Secondary Logistics Supplier',
        desc: `Lead times have stretched to ${skuLead} days at ${regionObj.plant}, leading to ${skuStockouts} stockout events.`,
        email: 'vijay.kumar@aciesglobal.com',
        body: `Hi Vijay,

We are seeing severe supply bottlenecks for "${rawSku.name}" in the ${selectedRegion} region. Supplier lead times are at ${skuLead} days, leading to ${skuStockouts} stockout events this period.

We need to qualify secondary logistics routes out of ${regionObj.plant} to stabilize shipping. Let's arrange a call next Tuesday.

Best regards,
Executive Director`
      });
    } else {
      recs.push({
        title: 'Optimize Safety Stock Buffers',
        desc: `Logistics lines are healthy (${skuLead}d lead time). Buffer release releases ₹${(skuRev * 0.03).toFixed(1)} Cr capital.`,
        email: 'nisha.patel@aciesglobal.com',
        body: `Hi Nisha,

Given the logistics stability of "${rawSku.name}" in ${selectedRegion} (lead time: ${skuLead} days), we have an opportunity to optimize safety stock.

Based on our model, releasing safety stock buffers can free up ₹${(skuRev * 0.03).toFixed(1)} Cr in locked inventory capital at the ${regionObj.plant} warehouse. Please set up a simulation.

Thanks,
Executive Director`
      });
    }

    return recs;
  };

  const currentInsights = getSkuInsights();
  const regionalConfig = REGIONS_CONFIG[selectedRegion];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner Header */}
      <div className="glass-card bg-acies-gray text-white py-5 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
          <Globe size={100} />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex-grow">
            <p className="text-[9px] uppercase font-bold tracking-widest opacity-40 mb-2">Top-Down Exploration · Tab 6 of 6</p>
            <h2 className="text-xl font-display font-medium text-white mb-1">Top-Down Portfolio Drilldown</h2>
            <p className="text-xs text-zinc-300 font-medium max-w-xl leading-relaxed">
              Drill down from high-level time horizons to regional KPI targets, local SKU assortments, and bottom-up SKU profitability waterfalls.
            </p>
          </div>
          
          {/* Horizon Selection (Step 1) */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <span className="text-[8.5px] uppercase font-bold tracking-wider text-zinc-400">Step 1: Select Time Horizon</span>
            <div className="flex bg-white/5 p-1 rounded-sm border border-white/10">
              {(['Q1', 'Q2', 'H1', 'FY'] as const).map(q => (
                <button
                  key={q}
                  onClick={() => setTimeHorizon(q)}
                  className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-sm transition-all border-none cursor-pointer ${
                    timeHorizon === q
                      ? 'bg-acies-yellow text-acies-gray font-extrabold shadow-sm shadow-black/10'
                      : 'bg-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  {q === 'FY' ? 'FY 2026' : `${q} 2026`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Regional Performance Target Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center pb-1 border-b border-black/5 dark:border-white/5">
          <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-zinc-400">Step 2: Region Performance Tracking</span>
          
          {/* Metric Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[8.5px] uppercase font-bold text-zinc-400">Primary Focus Metric:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-zinc-650 dark:text-zinc-300 rounded-sm py-1 px-2 text-[9px] font-bold uppercase outline-none focus:border-acies-yellow"
            >
              <option value="rev">Revenue (₹ Cr)</option>
              <option value="margin">Avg Gross Margin (%)</option>
              <option value="otif">Fulfillment (OTIF %)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(REGIONS_CONFIG).map(([key, config]) => {
            const metrics = getRegionMetrics(key);
            const activeM = metrics[selectedMetric];
            const isSelected = selectedRegion === key;
            const variance = activeM.actual - activeM.target;
            const isFav = variance >= 0 || selectedMetric === 'otif' ? variance >= 0 : false;
            
            // Progress percentage
            const progress = selectedMetric === 'margin' || selectedMetric === 'otif'
              ? activeM.actual 
              : Math.min(100, Math.round((activeM.actual / activeM.target) * 100));

            return (
              <button
                key={key}
                onClick={() => handleRegionChange(key)}
                className={`text-left glass-card bg-white dark:bg-white/5 border p-4.5 rounded-sm shadow-sm transition-all hover:scale-[1.01] cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden group outline-none ${
                  isSelected 
                    ? 'border-acies-yellow dark:border-acies-yellow bg-acies-yellow/[0.02] shadow-md shadow-acies-yellow/5' 
                    : 'border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/15'
                }`}
              >
                {/* Visual Active Strip */}
                {isSelected && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-acies-yellow" />
                )}
                
                <div className="w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-zinc-400 leading-none">{config.role}</p>
                      <h4 className="text-[13px] font-display font-extrabold text-zinc-800 dark:text-white mt-1 group-hover:text-acies-yellow transition-colors">
                        {config.name}
                      </h4>
                    </div>
                    <span className={`text-[8.5px] font-mono font-bold leading-none ${isFav ? 'text-green-500' : 'text-red-500'}`}>
                      {variance >= 0 ? '+' : ''}{variance.toFixed(selectedMetric === 'rev' ? 1 : 1)}{activeM.unit}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-xl font-display font-extrabold text-zinc-850 dark:text-white leading-none">
                      {activeM.actual.toFixed(selectedMetric === 'rev' ? 0 : 1)}
                    </span>
                    <span className="text-[9.5px] font-semibold text-zinc-500">{activeM.unit}</span>
                    <span className="text-[8px] uppercase tracking-wider opacity-45 ml-2">vs target {activeM.target.toFixed(selectedMetric === 'rev' ? 0 : 1)}</span>
                  </div>
                </div>

                <div className="w-full space-y-1 mt-2">
                  <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${isSelected ? 'bg-acies-yellow' : 'bg-zinc-400 dark:bg-zinc-500'}`} 
                      style={{ width: `${selectedMetric === 'rev' ? progress : (progress / activeM.target * 100)}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-zinc-400 uppercase tracking-widest font-semibold leading-none">
                    <span>Target Achievement</span>
                    <span>{selectedMetric === 'rev' ? progress : Math.round(progress / activeM.target * 100)}%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Local SKU Selection Panel */}
      <div className="space-y-2">
        <p className="text-[9.5px] font-extrabold uppercase tracking-widest text-zinc-400 pb-1 border-b border-black/5 dark:border-white/5">
          Step 3: SKU Assortment in {regionalConfig.name}
        </p>
        <div className="flex flex-wrap gap-2">
          {activeRegionSkus.map(name => {
            const item = SKUS.find(s => s.name === name) || SKUS[0];
            const isSelected = selectedSkuName === name;
            const isUp = item.growth >= 0;

            return (
              <button
                key={name}
                onClick={() => setSelectedSkuName(name)}
                className={`px-3 py-2 text-[10px] font-semibold uppercase rounded-sm border transition-all flex items-center gap-2 cursor-pointer outline-none ${
                  isSelected
                    ? 'bg-acies-yellow border-acies-yellow text-acies-gray font-bold shadow-md shadow-acies-yellow/10'
                    : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-650 dark:text-zinc-350 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <span>{name}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-green-500' : 'bg-red-500'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 4: Bottom Split Dashboard - Details & AI Sourcing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Financials & Waterfall Profit Bridge (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
            
            {/* Sku Profile Header */}
            <div className="flex justify-between items-start border-b border-black/5 dark:border-white/5 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Tag size={13} className="text-acies-yellow" />
                  <h3 className="text-sm font-display font-extrabold text-zinc-800 dark:text-white leading-none">
                    {rawSku.name} Breakdown
                  </h3>
                </div>
                <p className="text-[9.5px] text-zinc-400 uppercase tracking-widest font-semibold leading-none">
                  Assortment Category: <span className="font-bold text-zinc-600 dark:text-zinc-300">{rawSku.cat}</span> · Plant: <span className="font-bold text-zinc-600 dark:text-zinc-300">{regionalConfig.plant}</span>
                </p>
              </div>

              <span className="text-[9.5px] text-zinc-550 dark:text-zinc-350 font-bold font-mono">
                {timeHorizon} Sales Loop
              </span>
            </div>

            {/* Metric Blocks */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-zinc-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded">
                <p className="font-bold text-[8.5px] uppercase tracking-widest text-zinc-450 mb-1">QTD Sales</p>
                <p className="text-lg font-display font-extrabold text-acies-yellow">₹{skuRev.toFixed(1)} Cr</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded">
                <p className="font-bold text-[8.5px] uppercase tracking-widest text-zinc-450 mb-1">Gross Margin</p>
                <p className="text-lg font-display font-extrabold text-zinc-800 dark:text-white">{skuMargin}%</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded">
                <p className="font-bold text-[8.5px] uppercase tracking-widest text-zinc-450 mb-1">YoY Growth</p>
                <div className="flex items-center gap-1">
                  <span className={`text-lg font-display font-extrabold ${skuGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {skuGrowth >= 0 ? '+' : ''}{Math.round(skuGrowth * 100)}%
                  </span>
                  {skuGrowth >= 0 ? (
                    <TrendingUp size={14} className="text-green-500" />
                  ) : (
                    <TrendingDown size={14} className="text-red-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Waterfall profitability bridge */}
            <div className="space-y-2 pt-2">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Profitability Waterfall Bridge</h4>
                <p className="text-[8px] opacity-40 uppercase tracking-widest mt-0.5">Translating Top-line Revenue into Net Operating Profit</p>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfallData} margin={{ top: 20, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                    <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 8.5 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: tickColor, fontSize: 8.5 }} label={{ value: '₹ Crore', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                      itemStyle={{ fontSize: 11 }}
                      formatter={(value: any, name: any, props: any) => {
                        return [`₹${props.payload.displayVal} Cr`, 'Value'];
                      }}
                    />
                    <Bar dataKey="bottom" stackId="topdown-wfall" fill="transparent" />
                    <Bar dataKey="value" stackId="topdown-wfall" radius={1.5}>
                      {waterfallData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: AI Diagnostics & Action plans (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Sourcing Logistics Stream */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-3.5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-black/5 dark:border-white/5 pb-2">
              Supply Line Operations
            </h4>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-black/5 dark:border-white/5">
                <span className="text-zinc-500 flex items-center gap-1">
                  <Clock size={11} className="text-zinc-400" />
                  Lead Time
                </span>
                <span className="font-bold text-zinc-800 dark:text-zinc-100">{skuLead} Days</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-black/5 dark:border-white/5">
                <span className="text-zinc-500 flex items-center gap-1">
                  <ShieldAlert size={11} className="text-zinc-400" />
                  Stockouts
                </span>
                <span className={`font-bold ${skuStockouts > 3 ? 'text-red-500 animate-pulse' : 'text-zinc-800 dark:text-zinc-100'}`}>
                  {skuStockouts} Events
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-black/5 dark:border-white/5 col-span-2">
                <span className="text-zinc-500 flex items-center gap-1">
                  <Activity size={11} className="text-zinc-400" />
                  Complexity Score
                </span>
                <span className="font-bold text-zinc-800 dark:text-zinc-100">{rawSku.cx.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-black/5 dark:border-white/5 col-span-2">
                <span className="text-zinc-500 flex items-center gap-1">
                  <Info size={11} className="text-zinc-400" />
                  Promo Dependency
                </span>
                <span className="font-bold text-zinc-800 dark:text-zinc-100">{Math.round(skuPromo * 100)}% of sales</span>
              </div>
            </div>
          </div>

          {/* AI Tactical Recommendations */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-black/5 dark:border-white/5 pb-2">
              AI-Assisted Tactical Actions
            </h4>

            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {currentInsights.map((rec, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-zinc-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-sm hover:border-[#6d28d9] dark:hover:border-[#a78bfa] transition-all flex flex-col gap-1.5 shadow-sm"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] font-bold text-indigo-500 shrink-0 mt-0.5">0{index + 1}</span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-zinc-850 dark:text-zinc-100 leading-snug">{rec.title}</p>
                      <p className="text-[10px] text-zinc-550 dark:text-zinc-400 leading-relaxed font-normal">{rec.desc}</p>
                    </div>
                  </div>

                  <div className="pl-5 pt-1.5 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between gap-2">
                    <div className="text-[8px] opacity-60">
                      Target: <span className="font-bold">{regionalConfig.manager}</span> ({regionalConfig.role})
                    </div>
                    <button
                      onClick={() => {
                        setEmailData({ to: rec.email, name: regionalConfig.manager, subject: rec.title, body: rec.body });
                        setIsEmailOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-wider text-white bg-[#6d28d9] dark:bg-[#a78bfa] hover:opacity-90 rounded-sm transition-all cursor-pointer border-none"
                    >
                      <Mail size={10} />
                      Request Sourcing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Email Composer Modal */}
      <EmailComposerModal 
        isOpen={isEmailOpen}
        onClose={() => setIsEmailOpen(false)}
        initialEmail={emailData}
        onSend={(recipientName, recipientEmail, subject, body) => {
          // Simulate email sent message
          alert(`Sourcing action request successfully sent to ${recipientName} (${recipientEmail})!`);
          setIsEmailOpen(false);
        }}
      />

    </div>
  );
};
