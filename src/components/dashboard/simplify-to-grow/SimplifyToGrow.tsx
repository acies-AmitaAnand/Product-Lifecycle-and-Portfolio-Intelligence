/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Simplify to Grow — Bain & Company "Beyond the Tail" Framework Implementation
 * Source: https://www.bain.com/how-we-help/beyond-the-tail-how-a-strategic-approach-to-simplification-fuels-growth/
 *
 * Interactive version — click pillars to drill down, click SKUs for focus panel,
 * filter by classification, and navigate to connected tabs.
 */

import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell,
} from 'recharts';
import {
  TrendingUp, TrendingDown, ChevronRight, ChevronDown, ChevronUp,
  Info, CheckCircle, Target, Layers, Users, Link2, Zap,
  X, ArrowRight, BarChart3, Scissors, Award, Activity, ExternalLink,
  AlertTriangle, Package,
} from 'lucide-react';
import { SKUS } from '../../../constants/data';
import { Role } from '../../../types/dashboard';
import { StrategicActionPlan } from './StrategicActionPlan';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Props { role: Role; isDarkMode: boolean; setActiveTab: (tab: number) => void; }

type ComplexityType = 'Bad Complexity' | 'Good Variety' | 'Neutral';
type ClassFilter = 'All' | ComplexityType;

interface EnrichedSKU {
  name: string; cat: string; rev: number; val: number; cx: number;
  margin: number; growth: number; householdPenetration: number; promo: number; lead: number;
  ros: number; unitProfitPool: number; ippvRaw: number; ippv: number;
  complexityType: ComplexityType;
  productionDowntimeCost: number; transportOverheadCost: number; wasteWriteOffCost: number;
  totalHiddenCost: number; shelfProductivity: number;
}

// ─── Computation ─────────────────────────────────────────────────────────────
function computeEnrichedSKUs(): EnrichedSKU[] {
  const enriched = SKUS.map(s => {
    const ros = s.margin / 100;
    const unitProfitPool = s.rev * ros;
    const penetration = (s as any).householdPenetration ?? 0.4;
    const ippvRaw = ros * penetration * unitProfitPool;
    const productionDowntimeCost = parseFloat((s.cx * s.stockouts * 0.8).toFixed(2));
    const transportOverheadCost = parseFloat((s.cx * (s.lead / 10) * 0.5).toFixed(2));
    const wasteWriteOffCost = parseFloat((s.promo * s.cx * s.rev * 0.03).toFixed(2));
    const totalHiddenCost = parseFloat((productionDowntimeCost + transportOverheadCost + wasteWriteOffCost).toFixed(2));
    const stockoutRate = Math.min(s.stockouts / 8, 1);
    const shelfProductivity = parseFloat(((s.val * (1 - stockoutRate)) * 100).toFixed(1));
    return {
      name: s.name, cat: s.cat, rev: s.rev, val: s.val, cx: s.cx,
      margin: s.margin, growth: s.growth, householdPenetration: penetration, promo: s.promo, lead: s.lead,
      ros, unitProfitPool, ippvRaw, ippv: 0,
      complexityType: 'Neutral' as ComplexityType,
      productionDowntimeCost, transportOverheadCost, wasteWriteOffCost, totalHiddenCost, shelfProductivity,
    };
  });
  const maxIppv = Math.max(...enriched.map(s => s.ippvRaw));
  enriched.forEach(s => {
    s.ippv = parseFloat(((s.ippvRaw / maxIppv) * 100).toFixed(1));
    if (s.ippv >= 45 && s.growth >= 0) s.complexityType = 'Good Variety';
    else if (s.ippv < 30 && s.cx > 0.50) s.complexityType = 'Bad Complexity';
    else s.complexityType = 'Neutral';
  });
  return enriched;
}

function computePillars(skus: EnrichedSKU[]) {
  const avgIppv = skus.reduce((a, s) => a + s.ippv, 0) / skus.length;
  const goodVarietyPct = (skus.filter(s => s.complexityType === 'Good Variety').length / skus.length) * 100;
  const badComplexityPct = (skus.filter(s => s.complexityType === 'Bad Complexity').length / skus.length) * 100;
  const avgShelf = skus.reduce((a, s) => a + s.shelfProductivity, 0) / skus.length;
  const avgHiddenCostRatio = skus.reduce((a, s) => a + (s.totalHiddenCost / (s.rev || 1)), 0) / skus.length;
  const positiveGrowth = skus.filter(s => s.growth > 0).length / skus.length;

  return [
    {
      id: 'consumer', pillar: 'Consumer-Right', score: Math.round(avgIppv),
      description: 'Avg IPPV across portfolio. Higher = portfolio prioritises consumer-valued SKUs.',
      icon: Users, color: '#6366f1', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20',
      text: 'text-indigo-600 dark:text-indigo-400', routeTab: 4, routeLabel: 'SKU Rationalization',
      kpiLabel: 'Avg IPPV', kpiValue: avgIppv.toFixed(1),
      insight: 'IPPV combines Return on Sales, Household Penetration, and Unit Profit Pool. Low-IPPV SKUs are strong rationalization candidates.',
      topSkus: (skus: EnrichedSKU[]) => [...skus].sort((a, b) => b.ippv - a.ippv).slice(0, 3),
      worstSkus: (skus: EnrichedSKU[]) => [...skus].sort((a, b) => a.ippv - b.ippv).slice(0, 3),
    },
    {
      id: 'retailer', pillar: 'Retailer Win-Win', score: Math.round(avgShelf),
      description: 'Avg Shelf Productivity Index. Combines commercial value with on-shelf availability.',
      icon: Link2, color: '#0ea5e9', bg: 'bg-sky-500/10', border: 'border-sky-500/20',
      text: 'text-sky-600 dark:text-sky-400', routeTab: 1, routeLabel: 'Portfolio Health Map',
      kpiLabel: 'Avg Shelf Score', kpiValue: avgShelf.toFixed(1),
      insight: 'Shelf Productivity = Commercial Value × (1 − Stockout Rate). Low scores signal opportunity for joint business planning with retailers.',
      topSkus: (skus: EnrichedSKU[]) => [...skus].sort((a, b) => b.shelfProductivity - a.shelfProductivity).slice(0, 3),
      worstSkus: (skus: EnrichedSKU[]) => [...skus].sort((a, b) => a.shelfProductivity - b.shelfProductivity).slice(0, 3),
    },
    {
      id: 'valuechain', pillar: 'Value Chain Efficient', score: Math.max(0, Math.round(100 - avgHiddenCostRatio * 200)),
      description: 'Complexity P&L health. Measures how well hidden costs (downtime, transport, waste) are controlled.',
      icon: Layers, color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400', routeTab: 3, routeLabel: 'Profitability Tree',
      kpiLabel: 'Avg Hidden Cost Ratio', kpiValue: (avgHiddenCostRatio * 100).toFixed(1) + '%',
      insight: 'Hidden costs include production downtime for small runs, transport overhead, and promo-driven waste. De-averaging shared costs reveals the true P&L of each SKU.',
      topSkus: (skus: EnrichedSKU[]) => [...skus].sort((a, b) => a.totalHiddenCost - b.totalHiddenCost).slice(0, 3),
      worstSkus: (skus: EnrichedSKU[]) => [...skus].sort((a, b) => b.totalHiddenCost - a.totalHiddenCost).slice(0, 3),
    },
    {
      id: 'e2e', pillar: 'End-to-End Value', score: Math.round(positiveGrowth * 100 * 0.85 + goodVarietyPct * 0.15),
      description: 'Cross-functional value creation. % of portfolio with positive growth balanced with Good Variety classification.',
      icon: Target, color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400', routeTab: 4, routeLabel: 'SKU Rationalization',
      kpiLabel: 'Positive Growth SKUs', kpiValue: Math.round(positiveGrowth * 100) + '%',
      insight: 'End-to-End Value requires Finance, Marketing, Commercial, and Supply to jointly govern SKU decisions. Good Variety SKUs should be ring-fenced.',
      topSkus: (skus: EnrichedSKU[]) => [...skus].sort((a, b) => b.growth - a.growth).slice(0, 3),
      worstSkus: (skus: EnrichedSKU[]) => [...skus].sort((a, b) => a.growth - b.growth).slice(0, 3),
    },
    {
      id: 'momentum', pillar: 'Momentum & Muscle', score: Math.round(100 - badComplexityPct),
      description: 'Portfolio simplification health. % of SKUs that are NOT Bad Complexity.',
      icon: Zap, color: '#a855f7', bg: 'bg-purple-500/10', border: 'border-purple-500/20',
      text: 'text-purple-600 dark:text-purple-400', routeTab: 8, routeLabel: 'SKU Assortment',
      kpiLabel: 'Bad Complexity %', kpiValue: badComplexityPct.toFixed(0) + '%',
      insight: 'Sustained simplification requires embedding SKU productivity into S&OP, budgeting, and NPD gate reviews. Bad Complexity % should be tracked quarterly.',
      topSkus: (skus: EnrichedSKU[]) => skus.filter(s => s.complexityType === 'Good Variety').slice(0, 3),
      worstSkus: (skus: EnrichedSKU[]) => skus.filter(s => s.complexityType === 'Bad Complexity').slice(0, 3),
    },
  ];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const COMPLEXITY_CONFIG: Record<ComplexityType, { color: string; bg: string; label: string; desc: string }> = {
  'Good Variety':   { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  label: 'Good Variety',  desc: 'High IPPV with positive growth. Meets emerging consumer needs — retain & invest.' },
  'Bad Complexity': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: 'Bad Complexity', desc: 'Low IPPV with high operational complexity. Top rationalization priority.' },
  'Neutral':        { color: '#6b7280', bg: 'rgba(107,114,128,0.10)', label: 'Neutral',        desc: 'Moderate IPPV or mixed signals. Monitor quarterly — could shift either way.' },
};

const CAT_COLORS: Record<string, string> = {
  Beverages: '#6366f1', Snacks: '#f59e0b', 'Personal Care': '#0ea5e9',
  Dairy: '#10b981', Household: '#a855f7',
};

const TAB_ROUTE_ICONS: Record<number, React.ElementType> = {
  1: Activity, 3: BarChart3, 4: Scissors, 8: Award,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated fill bar */
const FillBar: React.FC<{ value: number; max: number; color: string; label: string }> = ({ value, max, color, label }) => (
  <div className="mb-1.5">
    <div className="flex justify-between text-[7.5px] font-bold mb-0.5">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span style={{ color }}>{value.toFixed(1)}</span>
    </div>
    <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }} />
    </div>
  </div>
);
const SkuFocusDrawer: React.FC<{
  sku: EnrichedSKU;
  onClose: () => void;
  onNavigate: (tab: number) => void;
  isDarkMode: boolean;
  maxIppv: number;
}> = ({ sku, onClose, onNavigate, isDarkMode, maxIppv }) => {
  const cfg = COMPLEXITY_CONFIG[sku.complexityType];
  const growth = sku.growth * 100;
  const ippvComponents = [
    { label: 'Return on Sales (ROS)', value: sku.ros * 100, max: 60, unit: '%', color: '#6366f1' },
    { label: 'Household Penetration', value: sku.householdPenetration * 100, max: 100, unit: '%', color: '#0ea5e9' },
    { label: 'Unit Profit Pool (₹Cr)', value: sku.unitProfitPool, max: 80, unit: 'Cr', color: '#10b981' },
  ];
  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn" 
      />

      {/* Drawer Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] z-50 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in-right border-l ${
          isDarkMode 
            ? 'bg-[#181824] border-zinc-800 text-white' 
            : 'bg-white border-zinc-200 text-zinc-850'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-black/10 dark:border-white/10"
            style={{ background: `linear-gradient(135deg, ${cfg.color}12, transparent)` }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
                <Package size={16} style={{ color: cfg.color }} />
              </div>
              <div>
                <div className="text-[12px] font-black">{sku.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  <span className="text-[7.5px] text-zinc-455 dark:text-zinc-400 font-bold">{sku.cat}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 text-zinc-400 transition-all">
              <X size={14} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto text-[9.5px]">
            {/* IPPV Section */}
            <div className="space-y-3">
              <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450 dark:text-zinc-500">IPPV Performance Summary</div>
              <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5">
                <div>
                  <div className="text-3xl font-black" style={{ color: cfg.color }}>{sku.ippv.toFixed(1)}</div>
                  <div className="text-[7px] font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 mt-0.5">IPPV Score /100</div>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mb-1">
                    <div className="h-full rounded-full" style={{ width: `${sku.ippv}%`, backgroundColor: cfg.color }} />
                  </div>
                  <div className="text-[7.5px] text-zinc-400 font-bold">vs portfolio maximum</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {ippvComponents.map(c => (
                  <FillBar key={c.label} value={c.value} max={c.max} color={c.color} label={`${c.label} (${c.value.toFixed(1)}${c.unit})`} />
                ))}
              </div>

              <div className="p-3 rounded-xl text-[8px] font-medium leading-relaxed"
                style={{ backgroundColor: `${cfg.color}10`, color: cfg.color, border: `1px solid ${cfg.color}20` }}>
                {cfg.desc}
              </div>
            </div>

            {/* Complexity P&L Cost Breakdown */}
            <div className="space-y-3">
              <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450 dark:text-zinc-500">Complexity P&amp;L Cost Drivers</div>
              <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5 space-y-3">
                {[
                  { label: 'Production Downtime (Small runs cost)', value: sku.productionDowntimeCost, color: '#ef4444' },
                  { label: 'Transport & Logistics Overhead', value: sku.transportOverheadCost, color: '#f59e0b' },
                  { label: 'Waste & Write-off (Promo driven)', value: sku.wasteWriteOffCost, color: '#8b5cf6' },
                ].map(d => (
                  <div key={d.label} className="flex items-center justify-between gap-2">
                    <span className="text-[8px] text-zinc-550 dark:text-zinc-400 font-bold flex-1">{d.label}</span>
                    <span className="text-[9px] font-black" style={{ color: d.color }}>₹{d.value}L</span>
                  </div>
                ))}
                <div className="border-t border-black/10 dark:border-white/10 pt-2.5 flex justify-between">
                  <span className="text-[8.5px] font-black text-zinc-700 dark:text-zinc-355">Total Hidden Supply Chain Cost</span>
                  <span className="text-[10px] font-black text-amber-500">₹{sku.totalHiddenCost}L</span>
                </div>
              </div>
            </div>

            {/* SKU Vitals Table */}
            <div className="space-y-3">
              <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450 dark:text-zinc-500">SKU Vitals &amp; Commercial Health</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Revenue', value: `₹${sku.rev}Cr`, color: '#6366f1' },
                  { label: 'Gross Margin', value: `${sku.margin}%`, color: '#10b981' },
                  { label: 'Growth Rate', value: `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`, color: growth >= 0 ? '#10b981' : '#ef4444' },
                  { label: 'Promo Dependency', value: `${(sku.promo * 100).toFixed(0)}%`, color: sku.promo > 0.5 ? '#ef4444' : '#f59e0b' },
                  { label: 'Shelf Productivity', value: `${sku.shelfProductivity.toFixed(0)}/100`, color: '#0ea5e9' },
                  { label: 'Complexity Index', value: `${sku.cx.toFixed(2)}`, color: sku.cx > 0.6 ? '#ef4444' : '#6b7280' },
                ].map(v => (
                  <div key={v.label} className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5 flex flex-col gap-0.5">
                    <span className="text-[7.5px] text-zinc-400 font-bold">{v.label}</span>
                    <span className="text-[11px] font-black" style={{ color: v.color }}>{v.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.01] flex flex-wrap gap-2">
            <button onClick={() => onNavigate(4)}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-white transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: '#6366f1' }}>
              <Scissors size={12} /> Open Rationalization
            </button>
            <button onClick={() => onNavigate(1)}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-white transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: '#0ea5e9' }}>
              <Activity size={12} /> Portfolio Health
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/** Pillar detail expansion panel */
const PillarDetail: React.FC<{
  pillar: ReturnType<typeof computePillars>[0];
  skus: EnrichedSKU[];
  onNavigate: (tab: number) => void;
  onClose: () => void;
}> = ({ pillar, skus, onNavigate, onClose }) => {
  const topSkus = pillar.topSkus(skus);
  const worstSkus = pillar.worstSkus(skus);
  const RouteIcon = TAB_ROUTE_ICONS[pillar.routeTab] ?? ChevronRight;
  return (
    <div className="col-span-full rounded-xl border-2 p-5 mt-1 animate-fadeIn"
      style={{ borderColor: `${pillar.color}25`, background: `linear-gradient(135deg, ${pillar.color}06, transparent)` }}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: pillar.color }}>
            {pillar.pillar} — Deep Dive
          </div>
          <div className="text-xs font-black text-acies-gray dark:text-white">{pillar.kpiLabel}: <span style={{ color: pillar.color }}>{pillar.kpiValue}</span></div>
          <p className="text-[8px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg">{pillar.insight}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => onNavigate(pillar.routeTab)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider text-white transition-all hover:opacity-90"
            style={{ backgroundColor: pillar.color }}>
            <RouteIcon size={10} /> {pillar.routeLabel} <ExternalLink size={9} />
          </button>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 text-zinc-400 transition-all">
            <X size={13} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-[7.5px] font-black uppercase tracking-widest text-emerald-500 mb-2 flex items-center gap-1">
            <TrendingUp size={9} /> Top 3 — Helping This Score
          </div>
          <div className="space-y-1.5">
            {topSkus.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                <span className="text-[7px] font-black w-4 text-center rounded text-emerald-600 dark:text-emerald-400">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[8.5px] font-black text-acies-gray dark:text-white truncate">{s.name}</div>
                  <div className="text-[7px] text-zinc-400 font-bold">{s.cat}</div>
                </div>
                <span className="text-[8px] font-black text-emerald-500">
                  {pillar.id === 'consumer' ? `IPPV ${s.ippv.toFixed(0)}` :
                   pillar.id === 'retailer' ? `Shelf ${s.shelfProductivity.toFixed(0)}` :
                   pillar.id === 'valuechain' ? `₹${s.totalHiddenCost}L` :
                   pillar.id === 'e2e' ? `+${(s.growth * 100).toFixed(1)}%` :
                   s.complexityType === 'Good Variety' ? '✓ Good' : `CX ${s.cx.toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[7.5px] font-black uppercase tracking-widest text-red-500 mb-2 flex items-center gap-1">
            <TrendingDown size={9} /> Bottom 3 — Dragging This Score
          </div>
          <div className="space-y-1.5">
            {worstSkus.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/15">
                <span className="text-[7px] font-black w-4 text-center rounded text-red-400">!{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[8.5px] font-black text-acies-gray dark:text-white truncate">{s.name}</div>
                  <div className="text-[7px] text-zinc-400 font-bold">{s.cat}</div>
                </div>
                <span className="text-[8px] font-black text-red-500">
                  {pillar.id === 'consumer' ? `IPPV ${s.ippv.toFixed(0)}` :
                   pillar.id === 'retailer' ? `Shelf ${s.shelfProductivity.toFixed(0)}` :
                   pillar.id === 'valuechain' ? `₹${s.totalHiddenCost}L` :
                   pillar.id === 'e2e' ? `${(s.growth * 100).toFixed(1)}%` :
                   `CX ${s.cx.toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const SimplifyToGrow: React.FC<Props> = ({ isDarkMode, setActiveTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [classFilter, setClassFilter] = useState<ClassFilter>('All');
  const [ippvSort, setIppvSort] = useState<'ippv' | 'cx' | 'complexity' | 'cost'>('ippv');
  const [selectedSku, setSelectedSku] = useState<EnrichedSKU | null>(null);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const focusRef = useRef<HTMLDivElement>(null);

  const skus = useMemo(() => computeEnrichedSKUs(), []);
  const pillars = useMemo(() => computePillars(skus), [skus]);
  const overallScore = Math.round(pillars.reduce((a, p) => a + p.score, 0) / pillars.length);
  const maxIppv = 100;

  // Classification counts
  const badCount = skus.filter(s => s.complexityType === 'Bad Complexity').length;
  const goodCount = skus.filter(s => s.complexityType === 'Good Variety').length;
  const neutralCount = skus.filter(s => s.complexityType === 'Neutral').length;
  const totalHiddenCost = parseFloat(skus.reduce((a, s) => a + s.totalHiddenCost, 0).toFixed(1));

  // Filtered + sorted list
  const filteredSkus = useMemo(() => {
    let base = skus;
    if (selectedCategory) base = base.filter(s => s.cat === selectedCategory);
    if (classFilter !== 'All') base = base.filter(s => s.complexityType === classFilter);
    return [...base].sort((a, b) => {
      if (ippvSort === 'ippv') return b.ippv - a.ippv;
      if (ippvSort === 'cx') return b.cx - a.cx;
      if (ippvSort === 'cost') return b.totalHiddenCost - a.totalHiddenCost;
      return a.complexityType.localeCompare(b.complexityType);
    });
  }, [skus, selectedCategory, classFilter, ippvSort]);

  // Categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(skus.map(s => s.cat)));
    return cats.map(cat => {
      const items = skus.filter(s => s.cat === cat);
      return {
        cat,
        avgIppv: parseFloat((items.reduce((a, s) => a + s.ippv, 0) / items.length).toFixed(1)),
        avgShelf: parseFloat((items.reduce((a, s) => a + s.shelfProductivity, 0) / items.length).toFixed(1)),
        totalHiddenCost: parseFloat(items.reduce((a, s) => a + s.totalHiddenCost, 0).toFixed(1)),
        productionDowntime: parseFloat(items.reduce((a, s) => a + s.productionDowntimeCost, 0).toFixed(1)),
        transportOverhead: parseFloat(items.reduce((a, s) => a + s.transportOverheadCost, 0).toFixed(1)),
        wasteWriteOff: parseFloat(items.reduce((a, s) => a + s.wasteWriteOffCost, 0).toFixed(1)),
        badCount: items.filter(s => s.complexityType === 'Bad Complexity').length,
        goodCount: items.filter(s => s.complexityType === 'Good Variety').length,
        totalCount: items.length,
        topSku: [...items].sort((a, b) => b.ippv - a.ippv)[0],
        worstSku: [...items].sort((a, b) => a.ippv - b.ippv)[0],
      };
    });
  }, [skus]);

  const radarData = pillars.map(p => ({ subject: p.pillar, score: p.score, fullMark: 100 }));

  const tick = isDarkMode ? '#a1a1aa' : '#52525b';
  const grid = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const ttBg = isDarkMode ? '#1a1a24' : '#fff';
  const ttBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const scoreColor = overallScore >= 70 ? 'text-emerald-500' : overallScore >= 50 ? 'text-amber-500' : 'text-red-500';
  const scoreRingColor = overallScore >= 70 ? '#10b981' : overallScore >= 50 ? '#f59e0b' : '#ef4444';

  const handleSkuClick = useCallback((sku: { name: string }) => {
    const fullSku = skus.find(s => s.name === sku.name);
    setSelectedSku(fullSku || null);
  }, [skus]);

  const handleNavigate = useCallback((tab: number) => {
    setActiveTab(tab);
  }, [setActiveTab]);
  return (
    <div className="space-y-6 pb-12 text-zinc-800 dark:text-white">

      {/* ── Hero Banner ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-emerald-600/10 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-emerald-900/20 p-6">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                BAIN &amp; COMPANY FRAMEWORK
              </span>
              <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Beyond the Tail · CPG Simplification</span>
            </div>
            <h2 className="text-xl font-black text-acies-gray dark:text-white leading-tight">
              Simplify to Grow — Strategic Flywheel
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg">
              Re-investing to grow vs. merely cutting SKUs. Up to 5% sales uplift through consumer-led portfolio simplification.
            </p>
            {/* Quick-nav pills */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                { label: `${badCount} Bad Complexity — Rationalise`, tab: 4, color: '#ef4444', icon: Scissors },
                { label: 'Portfolio Health Map', tab: 1, color: '#0ea5e9', icon: Activity },
                { label: 'Profitability Tree', tab: 3, color: '#f59e0b', icon: BarChart3 },
                { label: 'SKU Assortment', tab: 8, color: '#a855f7', icon: Award },
              ].map(nav => {
                const NavIcon = nav.icon;
                return (
                  <button key={nav.label} onClick={() => handleNavigate(nav.tab)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border transition-all hover:opacity-80"
                    style={{ borderColor: `${nav.color}30`, backgroundColor: `${nav.color}10`, color: nav.color }}>
                    <NavIcon size={9} /> {nav.label} <ArrowRight size={8} />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center">
              <div className={`text-4xl font-black ${scoreColor}`}>{overallScore}</div>
              <div className="text-[8px] uppercase tracking-widest text-zinc-450 font-bold mt-0.5">Flywheel Score</div>
              <div className="text-[7px] text-zinc-400 font-bold">/100 — {overallScore >= 70 ? 'Strong' : overallScore >= 50 ? 'Developing' : 'Needs Action'}</div>
            </div>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border-4 opacity-10" style={{ borderColor: scoreRingColor }} />
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full border-2 opacity-10" style={{ borderColor: scoreRingColor }} />
      </div>

      {/* ── ① Flywheel Pillar Scores (clickable) ────────────────────── */}
      <div>
        <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3 mb-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            ① Simplify to Grow Flywheel — 5 Pillar Health
          </h3>
          <span className="ml-auto text-[7.5px] text-zinc-400 font-bold uppercase tracking-wider">Click any pillar to drill down</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            const isExpanded = expandedPillar === p.id;
            const status = p.score >= 70 ? 'strong' : p.score >= 50 ? 'developing' : 'action';
            const statusLabel = status === 'strong' ? 'Strong' : status === 'developing' ? 'Developing' : 'Needs Action';
            const statusColor = status === 'strong' ? 'text-emerald-500' : status === 'developing' ? 'text-amber-500' : 'text-red-500';
            return (
              <button key={p.pillar}
                onClick={() => setExpandedPillar(prev => prev === p.id ? null : p.id)}
                className={`glass-card bg-white dark:bg-[#1a1a24] border rounded-xl p-4 shadow-sm relative overflow-hidden text-left w-full transition-all duration-200 group ${isExpanded ? 'ring-2' : 'hover:shadow-md'}`}
                style={{
                  borderColor: isExpanded ? `${p.color}40` : undefined,
                  boxShadow: isExpanded ? `0 0 0 2px ${p.color}25` : undefined,
                }}>
                <div className="absolute top-0 left-0 h-0.5 rounded-t-xl transition-all duration-300 group-hover:h-1"
                  style={{ width: `${p.score}%`, backgroundColor: p.color }} />
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${p.bg} transition-transform duration-200 group-hover:scale-110`}>
                    <Icon size={14} style={{ color: p.color }} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${statusColor}`}>{statusLabel}</span>
                    {isExpanded ? <ChevronUp size={10} className="text-zinc-400" /> : <ChevronDown size={10} className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                </div>
                <div className={`text-2xl font-black mb-0.5 ${p.text}`}>{p.score}</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-zinc-450 dark:text-zinc-500 mb-1">{p.pillar}</div>
                <p className="text-[7.5px] text-zinc-450 dark:text-zinc-500 leading-relaxed font-medium">{p.description}</p>
                <div className="mt-2 text-[7px] font-black text-zinc-350 dark:text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                  Pillar {i + 1} of 5 · {isExpanded ? 'collapse' : 'click to expand'}
                </div>
              </button>
            );
          })}
          {/* Pillar Detail Panel */}
          {expandedPillar && (() => {
            const p = pillars.find(x => x.id === expandedPillar);
            if (!p) return null;
            return <PillarDetail key={expandedPillar} pillar={p} skus={skus} onNavigate={handleNavigate} onClose={() => setExpandedPillar(null)} onSkuClick={handleSkuClick} />;
          })()}
        </div>
      </div>

      {/* ── ② IPPV League Table ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 border-l-4 border-sky-500 pl-3 mb-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
            ② IPPV Portfolio Ranking
          </h3>
          <div className="ml-auto flex items-center gap-1 text-[7px] text-zinc-400">
            <Info size={9} />
            <span className="font-bold uppercase tracking-wider">IPPV = ROS × Household Penetration × Unit Profit Pool</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Radar */}
          <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm flex flex-col">
            <div className="mb-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-acies-gray dark:text-white">Flywheel Radar</h4>
              <p className="text-[8px] text-zinc-450 font-bold uppercase tracking-wider mt-0.5">5-Pillar Balance · Click a pillar above to drill in</p>
            </div>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke={grid} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: tick, fontSize: 6.5, fontWeight: 'bold' }} />
                  <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: '#6366f1' }} />
                  <Tooltip contentStyle={{ backgroundColor: ttBg, borderColor: ttBorder, fontSize: '9px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {/* Classification summary */}
            <div className="border-t border-black/5 dark:border-white/5 pt-3 grid grid-cols-3 gap-2">
              {([
                { type: 'Good Variety' as ClassFilter, count: goodCount, color: '#10b981' },
                { type: 'Bad Complexity' as ClassFilter, count: badCount, color: '#ef4444' },
                { type: 'Neutral' as ClassFilter, count: neutralCount, color: '#6b7280' },
              ] as const).map(c => (
                <button key={c.type} onClick={() => setClassFilter(prev => prev === c.type ? 'All' : c.type)}
                  className={`text-center rounded-lg p-2 transition-all border ${classFilter === c.type ? 'ring-1' : 'border-transparent hover:border-black/10 dark:hover:border-white/10'}`}
                  style={{ borderColor: classFilter === c.type ? c.color : undefined, boxShadow: classFilter === c.type ? `0 0 0 1px ${c.color}40` : undefined, backgroundColor: classFilter === c.type ? `${c.color}10` : undefined }}>
                  <div className="text-lg font-black" style={{ color: c.color }}>{c.count}</div>
                  <div className="text-[6.5px] font-black uppercase tracking-wider" style={{ color: c.color }}>{c.type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* IPPV Table */}
          <div className="lg:col-span-2 glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-acies-gray dark:text-white">SKU IPPV League Table</h4>
                <p className="text-[8px] text-zinc-450 font-bold uppercase tracking-wider mt-0.5">
                  {filteredSkus.length} of {skus.length} SKUs · Click any row to open drill-down
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Quick filter chips */}
                {(['All', 'Good Variety', 'Bad Complexity', 'Neutral'] as ClassFilter[]).map(f => (
                  <button key={f} onClick={() => setClassFilter(f)}
                    className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider border transition-all ${classFilter === f ? 'text-white' : 'border-black/10 dark:border-white/10 text-zinc-500 hover:border-current'}`}
                    style={classFilter === f ? {
                      backgroundColor: f === 'Good Variety' ? '#10b981' : f === 'Bad Complexity' ? '#ef4444' : f === 'Neutral' ? '#6b7280' : '#6366f1',
                      borderColor: 'transparent',
                    } : {}}>
                    {f === 'All' ? `All (${skus.length})` : f === 'Good Variety' ? `✓ Good (${goodCount})` : f === 'Bad Complexity' ? `✗ Bad (${badCount})` : `Neutral (${neutralCount})`}
                  </button>
                ))}
                <select value={ippvSort} onChange={e => setIppvSort(e.target.value as any)}
                  className="bg-black/5 dark:bg-[#121214] border border-black/10 dark:border-white/10 rounded-lg py-1 px-2 text-[8px] font-bold text-zinc-700 dark:text-white outline-none">
                  <option value="ippv">↓ IPPV</option>
                  <option value="cx">↓ Complexity</option>
                  <option value="cost">↓ Hidden Cost</option>
                  <option value="complexity">Classification</option>
                </select>
              </div>
            </div>

            <div className="overflow-auto max-h-80" ref={focusRef}>
              <table className="w-full text-left border-collapse text-[9px]">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10 text-zinc-400 font-black uppercase tracking-wider text-[7px] sticky top-0 bg-white dark:bg-[#1a1a24] z-10">
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">SKU</th>
                    <th className="py-2 px-2">Category</th>
                    <th className="py-2 px-2 text-right">IPPV</th>
                    <th className="py-2 px-2 text-right">Penetration</th>
                    <th className="py-2 px-2 text-right">Hidden Cost</th>
                    <th className="py-2 px-2 text-center">Classification</th>
                    <th className="py-2 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSkus.map((sku, i) => {
                    const cfg = COMPLEXITY_CONFIG[sku.complexityType];
                    const isSelected = selectedSku?.name === sku.name;
                    return (
                      <React.Fragment key={sku.name}>
                        <tr
                          onClick={() => handleSkuClick(sku)}
                          className={`cursor-pointer transition-all border-b border-black/[0.04] dark:border-white/[0.04] ${isSelected ? 'bg-black/[0.03] dark:bg-white/[0.03]' : 'hover:bg-black/[0.015] dark:hover:bg-white/[0.015]'}`}
                          style={isSelected ? { boxShadow: `inset 2px 0 0 ${cfg.color}` } : {}}>
                          <td className="py-2 px-2 font-mono text-zinc-400 font-bold text-[8px]">{i + 1}</td>
                          <td className="py-2 px-2">
                            <div className="font-black text-[9px] text-acies-gray dark:text-zinc-100 flex items-center gap-1.5">
                              {sku.name}
                              {isSelected && <ChevronUp size={9} className="text-zinc-400" />}
                            </div>
                            <div className="h-1 w-20 bg-black/5 dark:bg-white/5 rounded-full mt-1 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${sku.ippv}%`, backgroundColor: cfg.color }} />
                            </div>
                          </td>
                          <td className="py-2 px-2">
                            <button onClick={e => { e.stopPropagation(); setSelectedCategory(prev => prev === sku.cat ? null : sku.cat); }}
                              className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest transition-all hover:opacity-70"
                              style={{ backgroundColor: `${CAT_COLORS[sku.cat]}20`, color: CAT_COLORS[sku.cat] }}>
                              {sku.cat}
                            </button>
                          </td>
                          <td className="py-2 px-2 text-right font-black text-[10px]" style={{ color: cfg.color }}>{sku.ippv.toFixed(1)}</td>
                          <td className="py-2 px-2 text-right font-bold text-zinc-500 dark:text-zinc-400">{(sku.householdPenetration * 100).toFixed(0)}%</td>
                          <td className="py-2 px-2 text-right font-bold text-amber-500">₹{sku.totalHiddenCost}L</td>
                          <td className="py-2 px-2 text-center">
                            <span className="text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-widest"
                              style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button onClick={e => { e.stopPropagation(); handleNavigate(4); }}
                              className="text-[7px] font-black text-indigo-500 hover:text-indigo-400 transition-colors flex items-center gap-0.5 mx-auto"
                              title="Open in SKU Rationalization">
                              <Scissors size={9} /> <ArrowRight size={8} />
                            </button>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                  {filteredSkus.length === 0 && (
                    <tr><td colSpan={8} className="py-8 text-center text-[9px] text-zinc-400 font-bold">No SKUs match the current filters</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center gap-4 text-[7.5px] font-black uppercase tracking-wider">
                <span className="flex items-center gap-1 text-emerald-500"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Good Variety</span>
                <span className="flex items-center gap-1 text-red-500"><span className="w-2 h-2 rounded-full bg-red-500" /> Bad Complexity</span>
                <span className="flex items-center gap-1 text-zinc-400"><span className="w-2 h-2 rounded-full bg-zinc-400" /> Neutral</span>
              </div>
              {selectedCategory && (
                <button onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-1 text-[7.5px] font-bold text-zinc-400 hover:text-zinc-600 transition-colors">
                  <X size={9} /> Clear filter: {selectedCategory}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── ③ Complexity P&L ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-3 mb-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            ③ Complexity P&amp;L — Three Hidden Cost Drivers
          </h3>
          <span className="ml-auto text-[7px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10">₹ Lakhs · Click a category to filter</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-acies-gray dark:text-white mb-1">Hidden Costs by Category</h4>
            <p className="text-[8px] text-zinc-450 font-bold uppercase tracking-wider mb-3">Hover bars for detail · Click category cards (right) to filter IPPV table</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} vertical />
                  <XAxis dataKey="cat" tick={{ fill: tick, fontSize: 8, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: tick, fontSize: 8 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: ttBg, borderColor: ttBorder, fontSize: '9px' }}
                    formatter={(v: any, name: string) => [`₹${v}L`, name]}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const cat = categories.find(c => c.cat === label);
                      return (
                        <div className="rounded-xl border p-3 text-[8px] shadow-xl" style={{ backgroundColor: ttBg, borderColor: ttBorder }}>
                          <div className="font-black mb-2" style={{ color: CAT_COLORS[label] }}>{label}</div>
                          {payload.map((p: any) => (
                            <div key={p.name} className="flex justify-between gap-4">
                              <span className="text-zinc-400">{p.name}</span>
                              <span className="font-black" style={{ color: p.fill }}>₹{p.value}L</span>
                            </div>
                          ))}
                          {cat && <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 text-zinc-400">
                            Top drain: {cat.worstSku?.name} (₹{cat.worstSku?.totalHiddenCost}L)
                          </div>}
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="productionDowntime" name="Production Downtime" stackId="a" fill="#ef4444" radius={[0,0,0,0]} barSize={28} />
                  <Bar dataKey="transportOverhead" name="Transport Overhead" stackId="a" fill="#f59e0b" barSize={28} />
                  <Bar dataKey="wasteWriteOff" name="Waste & Write-off" stackId="a" fill="#8b5cf6" radius={[4,4,0,0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-2 text-[7.5px] font-black uppercase tracking-wider">
              <span className="flex items-center gap-1"><span className="w-2 h-1.5 rounded-sm bg-red-500" /> Production Downtime</span>
              <span className="flex items-center gap-1"><span className="w-2 h-1.5 rounded-sm bg-amber-500" /> Transport Overhead</span>
              <span className="flex items-center gap-1"><span className="w-2 h-1.5 rounded-sm bg-purple-500" /> Waste &amp; Write-off</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {[...categories].sort((a, b) => b.totalHiddenCost - a.totalHiddenCost).map(cat => {
              const isActive = selectedCategory === cat.cat;
              return (
                <div key={cat.cat}
                  className={`glass-card bg-white dark:bg-[#1a1a24] border rounded-xl p-3.5 shadow-sm cursor-pointer transition-all group ${isActive ? 'ring-2' : 'hover:shadow-md'}`}
                  style={{ borderColor: isActive ? `${CAT_COLORS[cat.cat]}40` : undefined, boxShadow: isActive ? `0 0 0 2px ${CAT_COLORS[cat.cat]}25` : undefined }}
                  onClick={() => setSelectedCategory(prev => prev === cat.cat ? null : cat.cat)}
                  onMouseEnter={() => setHoveredCat(cat.cat)}
                  onMouseLeave={() => setHoveredCat(null)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: CAT_COLORS[cat.cat] }}>{cat.cat}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[7px] text-zinc-400 font-bold">{cat.totalCount} SKUs</span>
                      <span className="text-[8px] font-black text-amber-500">₹{cat.totalHiddenCost}L</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-center mb-2">
                    <div className="rounded-md p-1" style={{ backgroundColor: 'rgba(239,68,68,0.08)' }}>
                      <div className="text-[8px] font-black text-red-500">₹{cat.productionDowntime}L</div>
                      <div className="text-[6px] text-zinc-400 font-bold uppercase tracking-wider leading-tight">Downtime</div>
                    </div>
                    <div className="rounded-md p-1" style={{ backgroundColor: 'rgba(245,158,11,0.08)' }}>
                      <div className="text-[8px] font-black text-amber-500">₹{cat.transportOverhead}L</div>
                      <div className="text-[6px] text-zinc-400 font-bold uppercase tracking-wider leading-tight">Transport</div>
                    </div>
                    <div className="rounded-md p-1" style={{ backgroundColor: 'rgba(139,92,246,0.08)' }}>
                      <div className="text-[8px] font-black text-purple-500">₹{cat.wasteWriteOff}L</div>
                      <div className="text-[6px] text-zinc-400 font-bold uppercase tracking-wider leading-tight">Waste</div>
                    </div>
                  </div>
                  {/* Bad/Good breakdown */}
                  <div className="flex items-center gap-1.5 text-[7px] font-black">
                    <span className="text-red-500">{cat.badCount} Bad</span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-emerald-500">{cat.goodCount} Good</span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-zinc-400">{cat.totalCount - cat.badCount - cat.goodCount} Neutral</span>
                    {isActive && <span className="ml-auto text-[6.5px] uppercase tracking-widest font-black text-zinc-400">Filtering ↑ table</span>}
                  </div>
                  <div className="mt-2 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min((cat.totalHiddenCost / 25) * 100, 100)}%`, backgroundColor: CAT_COLORS[cat.cat] }} />
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[7px] font-bold text-zinc-450 dark:text-zinc-500">
                    <span className="flex items-center gap-0.5">
                      Top SKU: 
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleSkuClick(cat.topSku); }}
                        className="text-emerald-500 hover:underline truncate max-w-[65px] font-black">
                        {cat.topSku.name}
                      </button>
                    </span>
                    <span className="flex items-center gap-0.5">
                      Worst: 
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleSkuClick(cat.worstSku); }}
                        className="text-red-500 hover:underline truncate max-w-[65px] font-black">
                        {cat.worstSku.name}
                      </button>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ④ Shelf Productivity ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 border-l-4 border-sky-500 pl-3 mb-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
            ④ Retailer Win-Win — Shelf Productivity Index
          </h3>
          <span className="ml-auto text-[7px] font-bold uppercase tracking-wider text-zinc-400">Click a category ring to filter</span>
        </div>
        <div className="glass-card bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 p-5 rounded-xl shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
            {categories.map(cat => {
              const isActive = selectedCategory === cat.cat;
              return (
                <button key={cat.cat}
                  onClick={() => setSelectedCategory(prev => prev === cat.cat ? null : cat.cat)}
                  className={`text-center rounded-xl p-3 transition-all border group ${isActive ? 'ring-2' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}
                  style={{ borderColor: isActive ? `${CAT_COLORS[cat.cat]}40` : undefined }}>
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke={CAT_COLORS[cat.cat]} strokeWidth="3"
                        strokeDasharray={`${(cat.avgShelf / 100) * 100} 100`} strokeLinecap="round"
                        className="transition-all duration-500" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[11px] font-black" style={{ color: CAT_COLORS[cat.cat] }}>{cat.avgShelf.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-wider" style={{ color: CAT_COLORS[cat.cat] }}>{cat.cat}</div>
                  <div className="text-[7px] text-zinc-400 font-bold mt-0.5">
                    {cat.avgShelf < 55 ? <span className="text-amber-500">⚠ Below threshold</span> : <span className="text-emerald-500">✓ Healthy</span>}
                  </div>
                  <div className="text-[7px] font-bold text-zinc-500 mt-0.5">{cat.goodCount}G · {cat.badCount}B</div>
                  {cat.avgShelf < 55 && (
                    <button onClick={e => { e.stopPropagation(); handleNavigate(1); }}
                      className="mt-1.5 flex items-center gap-0.5 text-[6.5px] font-black uppercase tracking-wider text-sky-500 mx-auto hover:text-sky-400 transition-colors">
                      View health <ArrowRight size={7} />
                    </button>
                  )}
                </button>
              );
            })}
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} vertical />
                <XAxis dataKey="cat" tick={{ fill: tick, fontSize: 8, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: tick, fontSize: 8 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: ttBg, borderColor: ttBorder, fontSize: '9px' }}
                  formatter={(v: any) => [`${v}/100`, 'Shelf Productivity']} />
                <Bar dataKey="avgShelf" name="Avg Shelf Productivity" radius={[4,4,0,0]} barSize={32}
                  onClick={(data) => setSelectedCategory(prev => prev === data.cat ? null : data.cat)}>
                  {categories.map(c => (
                    <Cell key={c.cat} fill={CAT_COLORS[c.cat]}
                      opacity={selectedCategory && selectedCategory !== c.cat ? 0.3 : 1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 p-3 rounded-xl bg-sky-500/5 border border-sky-500/15 text-[8px] text-sky-700 dark:text-sky-400 font-bold leading-relaxed flex items-start gap-2">
            <Info size={11} className="shrink-0 mt-0.5" />
            <span><strong>Retailer Win-Win:</strong> Categories below 55 warrant joint business planning with key accounts. &nbsp;
              <button onClick={() => handleNavigate(1)} className="underline hover:no-underline transition-all">
                View Portfolio Health Map →
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* ── ⑤ Strategic Action Plan ───────────────────────────────────── */}
      <StrategicActionPlan
        skus={skus}
        isDarkMode={isDarkMode}
        onNavigate={handleNavigate}
        onSkuClick={handleSkuClick}
      />

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div className="text-center pt-4 border-t border-black/5 dark:border-white/5">
        <p className="text-[7.5px] text-zinc-400 dark:text-zinc-600 font-medium">
          Framework sourced from Bain &amp; Company — "Beyond the Tail: How a Strategic Approach to Simplification Fuels Growth" ·{' '}
          <a href="https://www.bain.com/how-we-help/beyond-the-tail-how-a-strategic-approach-to-simplification-fuels-growth/"
            target="_blank" rel="noreferrer" className="underline hover:text-indigo-500 transition-colors">
            bain.com
          </a>{' '}· Cruz, Javor, Kwon, Mologni
        </p>
      </div>

      {selectedSku && (
        <SkuFocusDrawer
          sku={selectedSku}
          onClose={() => setSelectedSku(null)}
          onNavigate={handleNavigate}
          isDarkMode={isDarkMode}
          maxIppv={maxIppv}
        />
      )}
    </div>
  );
};
