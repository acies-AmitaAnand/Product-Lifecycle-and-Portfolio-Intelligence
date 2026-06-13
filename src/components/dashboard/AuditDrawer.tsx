/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Database, BookOpen, HelpCircle, Activity, CheckCircle, TrendingUp, AlertTriangle, Zap, ChevronDown, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { AUDIT_DATA } from '../../constants/auditData';
import { SKUS } from '../../constants/data';
import { parseTrendData, getConfidenceScore, getMetricStatus, getMetricTrend } from '../../utils/auditHelpers';

interface AuditDrawerProps {
  activeMetric: string | null;
  close: () => void;
  isDarkMode: boolean;
}

// Sub-components
const TrendChart: React.FC<{ headers: string[]; rows: string[][]; isDarkMode: boolean }> = ({ headers, rows, isDarkMode }) => {
  const chartData = parseTrendData(headers, rows);
  if (!chartData) return null;
  
  const hasTarget = headers.some(h => h.toLowerCase().includes('target'));
  const isYoY = headers.some(h => h.toLowerCase().includes('2022')) && headers.some(h => h.toLowerCase().includes('2023'));
  
  const actualLabel = isYoY ? '2023 Sales' : hasTarget ? 'Actual' : headers[1] || 'Value';
  
  const textCol = isDarkMode ? '#a1a1aa' : '#71717a'; 
  const gridStroke = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tooltipBg = isDarkMode ? '#09090b' : '#ffffff';
  const tooltipBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipText = isDarkMode ? '#ffffff' : '#18181b';
  
  return (
    <div className="h-[200px] w-full mt-4 mb-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
          <XAxis dataKey="name" tick={{ fill: textCol, fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: textCol, fontSize: 8 }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText, borderRadius: '6px' }}
            itemStyle={{ fontSize: 10 }}
            labelStyle={{ fontSize: 10, fontWeight: 'bold' }}
          />
          {isYoY ? (
            <>
              <Bar dataKey="prev" name="2022" fill="#534AB7" barSize={12} radius={[3, 3, 0, 0]} />
              <Bar dataKey="value" name="2023" fill="#0F6E56" barSize={12} radius={[3, 3, 0, 0]} />
            </>
          ) : hasTarget ? (
            <>
              <Bar dataKey="value" name="Actual" fill="#185FA5" barSize={12} radius={[3, 3, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="#eab308" barSize={12} radius={[3, 3, 0, 0]} />
            </>
          ) : (
            <Bar dataKey="value" name={actualLabel} fill="#a78bfa" barSize={16} radius={[3, 3, 0, 0]}>
              {chartData.map((entry, index) => {
                const colors = ['#a78bfa', '#818cf8', '#6366f1', '#4f46e5', '#3b82f6'];
                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
              })}
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const AccordionSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, icon, children }) => {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-900 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full py-4 px-1 flex items-center justify-between text-left text-zinc-700 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white transition-colors cursor-pointer border-none bg-transparent outline-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="text-purple-500 dark:text-purple-400">{icon}</div>
          <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-zinc-400 hover:text-zinc-650 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="pb-5 pt-1 px-1 text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AuditDrawer: React.FC<AuditDrawerProps> = ({ activeMetric, close, isDarkMode }) => {
  // Map Home tab metrics to their respective Audit Drawer data keys
  const getMappedMetric = (metric: string | null): string | null => {
    if (!metric) return null;
    switch (metric) {
      case 'Total Revenue': return 'Revenue MTD';
      case 'Active SKUs': return 'Portfolio SKUs';
      case 'Critical Alerts': return 'Total Active Signals';
      case 'Gross Margin': return 'Gross margin %';
      case 'Portfolio SKU Count':
      case 'Portfolio SKU Counts':
      case 'portfolio sku counts':
      case 'Portfolio SKUs Count':
        return 'Portfolio SKU Count';
      case 'Orders — Today':
      case 'Orders - Today':
      case 'orders-today':
        return 'Orders — Today';
      case 'Revenue Growth':
        return 'Growth Rate';
      case 'Portfolio Complexity':
        return 'Portfolio Complexity Index (PCI)';
      case 'Promo Dependency':
        return 'Promo Erosion vs. Dependency';
      case 'Total Stockouts':
        return 'Peak Stockout Freq.';
      case 'Assortment Density': return 'Assortment Density';
      case 'Long-Tail Burden Ratio': return 'Long-Tail Burden Ratio';
      case 'Assortment Gross Yield': return 'Assortment Gross Yield';
      case 'Cannibalization Risk Index': return 'Cannibalization Risk Index';
      default: return metric;
    }
  };

  console.log("AuditDrawer activeMetric received:", activeMetric);
  const mappedMetric = getMappedMetric(activeMetric);
  const content = mappedMetric ? AUDIT_DATA[mappedMetric] : null;
  console.log("AuditDrawer mappedMetric:", mappedMetric, "content found:", !!content);

  // Accordion open states
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    impact: true,
    trends: true,
    calculations: false,
    lineage: false,
    recommendations: true,
    decisions: false
  });

  // Active SKUs by Category state
  const [showSkusByCategory, setShowSkusByCategory] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const toggleSection = (section: string) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  // Reset accordion states on metric change
  useEffect(() => {
    if (activeMetric) {
      setExpanded({
        impact: true,
        trends: true,
        calculations: false,
        lineage: false,
        recommendations: true,
        decisions: false
      });
      setShowSkusByCategory(false);
      setSelectedCategory('All');
    }
  }, [activeMetric]);

  return (
    <AnimatePresence>
      {activeMetric && content && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Drawer container */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-200 dark:border-zinc-900/60 z-[110] overflow-y-auto flex flex-col shadow-2xl text-zinc-800 dark:text-zinc-100"
          >
            {/* Sticky KPI Header */}
            <div className="border-b border-zinc-200 dark:border-zinc-900 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md sticky top-0 z-30 px-8 py-5 flex flex-col gap-3.5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles size={11} className="text-purple-500 dark:text-purple-400 animate-pulse" />
                    <span className="text-[8.5px] uppercase font-bold tracking-widest text-purple-600 dark:text-purple-400">AI-Powered Insights</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-1" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-zinc-900 dark:text-white leading-tight">{content.title}</h3>
                </div>
                
                <button 
                  onClick={close} 
                  className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-zinc-800 dark:text-white/50 dark:hover:text-white cursor-pointer border-none bg-transparent outline-none"
                  aria-label="Close Audit Drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* KPI Header Details (Value, Trend, Status) */}
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">{content.value}</span>
                
                {/* Trend Pill */}
                {(() => {
                  const trend = getMetricTrend(content.title);
                  const isAlert = content.title.toLowerCase().includes('alert') || content.title.toLowerCase().includes('signal');
                  const colorClass = isAlert 
                    ? 'text-red-650 bg-red-500/10 border-red-500/20 dark:text-red-400' 
                    : trend.isUp 
                      ? 'text-green-650 bg-green-500/10 border-green-500/20 dark:text-green-400' 
                      : 'text-amber-650 bg-amber-500/10 border-amber-500/20 dark:text-amber-400';
                  return (
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded flex items-center gap-1 border ${colorClass}`}>
                      {trend.isUp ? <TrendingUp size={10} /> : <TrendingUp size={10} className="rotate-180" />}
                      {trend.value}
                    </span>
                  );
                })()}

                {/* Status Badge */}
                {(() => {
                  const status = getMetricStatus(content.title);
                  return (
                    <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      status.isRisk 
                        ? 'text-red-650 bg-red-500/10 border-red-500/20 dark:text-red-400' 
                        : 'text-indigo-650 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400'
                    }`}>
                      {status.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-8 space-y-6">
              
              {/* Metric Definition Card */}
              <div className="bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-500/20 rounded-xl p-4.5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 blur-2xl pointer-events-none rounded-full" />
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={11} className="text-purple-500 dark:text-purple-400" />
                    <span className="text-[8.5px] uppercase font-bold text-zinc-500 dark:text-zinc-300 tracking-wider">Metric Definition</span>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 text-[8.5px] font-bold text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded">
                    FORMULA VERIFIED
                  </div>
                </div>
                <p className="text-xs text-zinc-650 dark:text-zinc-300 leading-relaxed font-medium">
                  {content.formulaDescription}
                </p>
              </div>

              {/* Category-based SKU Browser (for Active SKUs only) */}
              {(mappedMetric === 'Portfolio SKUs' || mappedMetric === 'Portfolio SKU Count') && (
                <div className="border border-purple-500/20 bg-purple-500/5 dark:bg-purple-950/10 rounded-xl p-4.5 space-y-3">
                  <button
                    onClick={() => setShowSkusByCategory(!showSkusByCategory)}
                    className="w-full flex items-center justify-between py-1.5 px-3 text-xs font-bold text-purple-700 hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100 transition-all border border-purple-500/30 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 cursor-pointer outline-none active:scale-98"
                  >
                    <span>{showSkusByCategory ? 'Hide Active SKUs by Category' : 'Browse Active SKUs by Category →'}</span>
                    <ChevronDown size={14} className={`transform transition-transform duration-200 ${showSkusByCategory ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showSkusByCategory && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        {/* Tabs for Categories */}
                        <div className="flex flex-wrap gap-1.5 border-b border-purple-500/10 pb-2">
                          {['All', 'Beverages', 'Snacks', 'Personal Care', 'Dairy', 'Household'].map(cat => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all border cursor-pointer ${
                                selectedCategory === cat
                                  ? 'bg-purple-600 text-white border-purple-600'
                                  : 'bg-transparent text-zinc-650 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 border-zinc-200 dark:border-zinc-800'
                              }`}
                            >
                              {cat} ({cat === 'All' ? SKUS.length : SKUS.filter(s => s.cat === cat).length})
                            </button>
                          ))}
                        </div>
                        
                        {/* SKU Lists */}
                        <div className="max-h-[260px] overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-purple-500">
                          {['Beverages', 'Snacks', 'Personal Care', 'Dairy', 'Household']
                            .filter(cat => selectedCategory === 'All' || selectedCategory === cat)
                            .map(cat => {
                              const catSkus = SKUS.filter(s => s.cat === cat);
                              if (catSkus.length === 0) return null;
                              return (
                                <div key={cat} className="space-y-2">
                                  <h4 className="text-[9.5px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5 border-b border-purple-500/5 pb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    {cat} ({catSkus.length})
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {catSkus.map(sku => (
                                      <div 
                                        key={sku.name} 
                                        className="p-2.5 border border-zinc-150 dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/50 rounded-lg flex flex-col gap-1 hover:border-purple-500/40 transition-colors shadow-sm"
                                      >
                                        <span className="font-bold text-[10px] text-zinc-800 dark:text-zinc-200 leading-tight">{sku.name}</span>
                                        <div className="flex items-center gap-2 text-[8.5px] text-zinc-500 dark:text-zinc-400 font-mono">
                                          <span>Margin: <span className="font-bold text-zinc-700 dark:text-zinc-300">{sku.margin}%</span></span>
                                          <span>·</span>
                                          <span>Sales: <span className="font-bold text-zinc-700 dark:text-zinc-300">₹{sku.rev} Cr</span></span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Accordions Group */}
              <div className="space-y-1">
                
                {/* 1. Business Impact Accordion */}
                <AccordionSection 
                  title="Business Impact" 
                  isOpen={expanded.impact} 
                  onToggle={() => toggleSection('impact')}
                  icon={<AlertTriangle size={14} />}
                >
                  <div className="bg-red-500/5 border-l-4 border-red-500 p-4 rounded-r-md">
                    <p className="text-[11.5px] text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">{content.soWhat}</p>
                  </div>
                </AccordionSection>

                {/* 2. Trend Analysis Accordion */}
                <AccordionSection 
                  title="Trend Analysis" 
                  isOpen={expanded.trends} 
                  onToggle={() => toggleSection('trends')}
                  icon={<TrendingUp size={14} />}
                >
                  <div className="space-y-4">
                    {/* Recharts chart */}
                    <TrendChart headers={content.trendHeaders} rows={content.trendRows} isDarkMode={isDarkMode} />

                    {/* Table */}
                    <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-900 rounded bg-zinc-50/40 dark:bg-zinc-950/40">
                      <table className="w-full text-left text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-zinc-100/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-900 font-bold uppercase tracking-wider text-zinc-650 dark:text-zinc-300">
                            {content.trendHeaders.map((header, idx) => (
                              <th key={idx} className="p-2.5">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900 font-mono text-zinc-600 dark:text-zinc-400">
                          {content.trendRows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.02] transition-colors">
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className={`p-2.5 ${cellIdx === 0 ? 'font-body font-bold text-zinc-800 dark:text-zinc-200' : ''}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </AccordionSection>

                {/* 3. Formula & Calculations Accordion */}
                <AccordionSection 
                  title="Formula & Calculations" 
                  isOpen={expanded.calculations} 
                  onToggle={() => toggleSection('calculations')}
                  icon={<BookOpen size={14} />}
                >
                  <div className="space-y-3">
                    <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-inner rounded-md">
                      <code className="font-mono text-xs text-zinc-800 dark:text-zinc-100 font-bold select-all text-center leading-relaxed">{content.formula}</code>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic leading-relaxed">{content.formulaDescription}</p>
                  </div>
                </AccordionSection>

                {/* 4. Data Lineage Accordion */}
                <AccordionSection 
                  title="Data Lineage" 
                  isOpen={expanded.lineage} 
                  onToggle={() => toggleSection('lineage')}
                  icon={<Database size={14} />}
                >
                  <div className="space-y-2.5">
                    <p className="text-[10px] text-zinc-550 dark:text-zinc-400 font-medium">
                      Raw dataset variables audited from primary commercial schemas:
                    </p>
                    <div className="border border-zinc-200 dark:border-zinc-900 rounded divide-y divide-zinc-200 dark:divide-zinc-900 bg-zinc-100/10 dark:bg-zinc-900/10 overflow-hidden">
                      {content.columns.map((col, idx) => (
                        <div key={idx} className="p-3.5 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">{col.name}</span>
                            <span className="text-[8px] bg-zinc-200 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{col.type}</span>
                          </div>
                          <p className="text-[10px] opacity-70 leading-normal text-zinc-650 dark:text-zinc-400">{col.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionSection>

                {/* 5. Recommendations Accordion */}
                <AccordionSection 
                  title="Recommendations" 
                  isOpen={expanded.recommendations} 
                  onToggle={() => toggleSection('recommendations')}
                  icon={<CheckCircle size={14} />}
                >
                  <div className="bg-emerald-500/5 border-l-4 border-emerald-500 p-4 rounded-r-md">
                    <p className="text-[11.5px] text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">{content.action}</p>
                  </div>
                </AccordionSection>

                {/* 6. Executive Decisions Accordion */}
                <AccordionSection 
                  title="Executive Decisions" 
                  isOpen={expanded.decisions} 
                  onToggle={() => toggleSection('decisions')}
                  icon={<HelpCircle size={14} />}
                >
                  <ul className="space-y-2.5 pl-4 list-disc text-[11px] text-zinc-650 dark:text-zinc-400 leading-relaxed">
                    {content.assumptions.map((item, idx) => (
                      <li key={idx} className="marker:text-purple-500 dark:marker:text-purple-400">
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionSection>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-8 py-4 border-t border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 text-center text-[8.5px] opacity-40 uppercase font-bold tracking-widest text-zinc-550 dark:text-zinc-400 mt-auto">
              Acies Virtual Labs • Verifiable Data Trace
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
