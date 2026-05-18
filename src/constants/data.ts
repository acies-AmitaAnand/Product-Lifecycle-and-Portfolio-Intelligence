/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PortfolioItem, Agent } from '../types/dashboard';

export const COMPANY_CONTEXT = {
  entity: "FMCG Multi-Country Enterprise",
  brands: "102 SKUs across 6 Brands",
  revenue: "$473M Annual",
  categories: 5
};

export const PORTFOLIO_DATA: PortfolioItem[] = [
  { name: 'BrandF Water', category: 'Beverages', margin: 40.0, growth: 12.4, size: 850, value: 85, complexity: 15, segment: 'Keep', stage: 'Growth' },
  { name: 'BrandC Chips', category: 'Snacks', margin: 36.2, growth: 18.2, size: 800, value: 78, complexity: 35, segment: 'Grow', stage: 'Growth' },
  { name: 'BrandB Chips', category: 'Snacks', margin: 39.8, growth: 5.4, size: 650, value: 72, complexity: 25, segment: 'Keep', stage: 'Maturity' },
  { name: 'BrandA Soda', category: 'Beverages', margin: 36.0, growth: 22.1, size: 900, value: 65, complexity: 45, segment: 'Grow', stage: 'Maturity' },
  { name: 'BrandA Chocolate', category: 'Snacks', margin: 35.8, growth: -5.2, size: 250, value: 15, complexity: 85, segment: 'Rationalize', stage: 'Decline' },
  { name: 'BrandA Softener', category: 'Home Care', margin: 35.8, growth: 1.2, size: 300, value: 20, complexity: 90, segment: 'Rationalize', stage: 'Maturity' },
  { name: 'BrandE Cheese', category: 'Dairy', margin: 38.6, growth: 3.1, size: 420, value: 45, complexity: 95, segment: 'Consolidate', stage: 'Maturity' },
  { name: 'BrandD Nuts', category: 'Snacks', margin: 35.9, growth: 2.8, size: 380, value: 40, complexity: 65, segment: 'Consolidate', stage: 'Maturity' },
  { name: 'BrandB Soap', category: 'Personal Care', margin: 40.0, growth: 4.2, size: 620, value: 80, complexity: 12, segment: 'Keep', stage: 'Maturity' },
];

export const SEGMENT_COLORS: Record<string, string> = {
  'Keep': '#4ade80',
  'Grow': '#ffd966',
  'Consolidate': '#60a5fa',
  'Rationalize': '#f87171',
};

export const AGENT_ROSTER: Agent[] = [
  { name: 'Portfolio Agent', role: 'Monitors 102 SKUs; flagged Dairy as highest drag (27.78%).' },
  { name: 'Market Signal Agent', role: 'Tracks promo dependency; identified BrandD Water at 27.97%.' },
  { name: 'Supplier Agent', role: 'Identified 60 universal suppliers creating interconnectivity dependencies.' },
  { name: 'Profitability Agent', role: 'Identified 12 high-volume SKUs diluting margin to 38.53%.' },
  { name: 'Sunset Agent', role: 'Removing 35 "Rationalize" SKUs to free 42.2% safety stock capital.' }
];

export const KPIS: KPI[] = [
  { label: 'Avg Portfolio Margin', value: '38.53%', trend: 'up', trendValue: '+0.4%', info: 'Current portfolio health benchmark' },
  { label: 'Active SKU Count', value: '102', trend: 'up', trendValue: '+4.2%', info: 'Current assortment scale' },
  { label: 'Portfolio PCI', value: '0.5509', trend: 'up', trendValue: '+0.02%', info: 'Complexity driven by fragmentation' },
  { label: 'Long-Tail SKU %', value: '66.7%', trend: 'up', trendValue: '+1.5%', info: 'SKUs contributing <1% revenue' },
  { label: 'Rationalize Candidates', value: '35', trend: 'down', trendValue: '-5', info: 'Identified for high friction/low value' },
  { label: 'Revenue Tail Risk', value: '27.08%', trend: 'up', trendValue: '+1.5%', info: 'Potential risk of full segment removal' },
];

export const TABS = [
  { id: 0, name: 'Portfolio Health Map' },
  { id: 1, name: 'Launch Readiness' },
  { id: 2, name: 'Profitability Tree' },
  { id: 3, name: 'SKU Rationalization' },
  { id: 4, name: 'Signals Board' },
];
