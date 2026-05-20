/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PortfolioItem,
  Agent,
  KPI,
  ChannelData,
  RegionalData,
  StockoutItem,
  RationalizationScenario,
  PCIDriver,
  TopSKU,
} from '../types/dashboard';

// ─── Company Context ──────────────────────────────────────────────────────────
export const COMPANY_CONTEXT = {
  entity: 'FMCG Multi-Country Enterprise',
  brands: '102 SKUs across 6 Brands',
  revenue: '$473M Annual',
  categories: 5,
};

// ─── KPI Strip (8 cards) ─────────────────────────────────────────────────────
// Values sourced from extracted_text.txt (Colab Notebook analysis)
export const KPIS: KPI[] = [
  {
    label: 'Net Sales (Portfolio)',
    value: '$473M',
    trend: 'up',
    trendValue: '+8.3% YoY',
    info: 'Total portfolio net sales across all 7 markets and 4 channels. Direct from transaction data.',
    highlight: ['VP Product Management'],
  },
  {
    label: 'Avg Gross Margin',
    value: '38.53%',
    trend: 'down',
    trendValue: '−0.4% vs bench',
    info: 'Portfolio average gross margin. 12 high-volume SKUs are diluting this below the 40% target.',
    highlight: ['Pricing and Margin Partner'],
  },
  {
    label: 'Revenue Concentration',
    value: '27.81%',
    trend: 'neutral',
    trendValue: 'Top 10% SKUs',
    info: 'Top 10% of SKUs (10 items) drive 27.81% of total revenue. Top 30% drive 62.88%.',
    highlight: ['VP Product Management'],
  },
  {
    label: 'Portfolio PCI',
    value: '0.5509',
    trend: 'up',
    isRisk: true,
    trendValue: '+0.02 vs prior',
    info: 'Portfolio Complexity Index. Dominated by Supplier Fragmentation (1.20) and SKU Proliferation (1.02). Target ≤ 0.42.',
    highlight: ['VP Product Management'],
  },
  {
    label: 'Long-Tail SKU Burden',
    value: '66.7%',
    trend: 'up',
    isRisk: true,
    trendValue: '68 SKUs <1% rev',
    info: '66.7% of SKUs contribute <1% of revenue each but consume 100% of supplier administrative overhead.',
    highlight: ['Product Manager'],
  },
  {
    label: 'Rationalize Candidates',
    value: '35 SKUs',
    trend: 'up',
    isRisk: true,
    trendValue: '−27.08% tail risk',
    info: 'Low Value / High Complexity. Full removal cuts safety stock by 42.2% but introduces 27.08% revenue tail risk.',
    highlight: ['Product Manager'],
  },
  {
    label: 'Peak Stockout Freq.',
    value: '440 events',
    trend: 'up',
    isRisk: true,
    trendValue: 'BrandC Biscuits',
    info: 'Highest stockout frequency in portfolio: BrandC Biscuits (440) and BrandF Soap (440). Supply chain fragility signal.',
    highlight: ['Product Manager'],
  },
  {
    label: 'Revenue Tail Risk',
    value: '27.08%',
    trend: 'up',
    isRisk: true,
    trendValue: 'Full Rat. scenario',
    info: 'Maximum revenue at risk if all 35 "Rationalize" segment SKUs are removed simultaneously.',
    highlight: ['Pricing and Margin Partner'],
  },
];

// ─── Segment Colors ───────────────────────────────────────────────────────────
export const SEGMENT_COLORS: Record<string, string> = {
  Keep: '#4ade80',
  Grow: '#ffd966',
  Consolidate: '#60a5fa',
  Rationalize: '#f87171',
};

// ─── Portfolio Data (25 SKUs across all 4 segments) ───────────────────────────
// Derived from Q1, Q4, Q5, Q10, Q21, Q27 of extracted_text.txt
// value = Commercial Value Score 0-100 (norm revenue+margin+growth+stability)
// complexity = Operational Complexity Score 0-100 (norm leadtime+supplier+promo+stockout+volatility)
export const PORTFOLIO_DATA: PortfolioItem[] = [
  // KEEP — High Value / Low Complexity (35 SKUs in dataset; showing 9 representatives)
  { name: 'BrandF Water',        category: 'Beverages',     margin: 40.0, growth: 12.4, netSales: 17.03, value: 88, complexity: 14, segment: 'Keep',        stage: 'Growth',   stockouts: 210, promoDep: 18.2, leadTime: 5.1 },
  { name: 'BrandB Chips',        category: 'Snacks',        margin: 39.8, growth:  5.4, netSales: 13.03, value: 74, complexity: 22, segment: 'Keep',        stage: 'Maturity', stockouts: 245, promoDep: 19.5, leadTime: 5.3 },
  { name: 'BrandB Soap',         category: 'Personal Care', margin: 40.0, growth:  4.2, netSales: 12.50, value: 80, complexity: 12, segment: 'Keep',        stage: 'Maturity', stockouts: 200, promoDep: 17.8, leadTime: 5.0 },
  { name: 'BrandD Cheese',       category: 'Dairy',         margin: 39.5, growth:  6.1, netSales: 11.20, value: 76, complexity: 18, segment: 'Keep',        stage: 'Maturity', stockouts: 220, promoDep: 16.4, leadTime: 5.2 },
  { name: 'BrandD Toothpaste',   category: 'Personal Care', margin: 39.2, growth:  7.3, netSales: 10.80, value: 73, complexity: 16, segment: 'Keep',        stage: 'Growth',   stockouts: 198, promoDep: 15.9, leadTime: 4.9 },
  { name: 'BrandA Cheese',       category: 'Dairy',         margin: 38.9, growth:  3.8, netSales:  9.60, value: 70, complexity: 20, segment: 'Keep',        stage: 'Maturity', stockouts: 215, promoDep: 16.1, leadTime: 5.1 },
  { name: 'BrandB Detergent',    category: 'Home Care',     margin: 39.1, growth:  4.5, netSales:  9.20, value: 68, complexity: 24, segment: 'Keep',        stage: 'Maturity', stockouts: 230, promoDep: 17.0, leadTime: 5.4 },
  { name: 'BrandF Detergent',    category: 'Home Care',     margin: 38.8, growth:  2.9, netSales:  8.50, value: 65, complexity: 19, segment: 'Keep',        stage: 'Maturity', stockouts: 208, promoDep: 15.5, leadTime: 5.0 },
  { name: 'BrandC Energy Drink', category: 'Beverages',     margin: 39.4, growth:  9.2, netSales:  8.10, value: 69, complexity: 17, segment: 'Keep',        stage: 'Growth',   stockouts: 190, promoDep: 14.8, leadTime: 4.8 },

  // GROW — High Value / High Complexity (16 SKUs; showing 4 representatives)
  { name: 'BrandC Chips',        category: 'Snacks',        margin: 36.2, growth: 18.2, netSales: 16.00, value: 78, complexity: 68, segment: 'Grow',        stage: 'Growth',   stockouts: 320, promoDep: 25.1, leadTime: 6.1 },
  { name: 'BrandC Toothpaste',   category: 'Personal Care', margin: 35.8, growth: 14.6, netSales: 12.97, value: 72, complexity: 74, segment: 'Grow',        stage: 'Growth',   stockouts: 340, promoDep: 27.6, leadTime: 6.2 },
  { name: 'BrandA Soda',         category: 'Beverages',     margin: 36.1, growth: 22.1, netSales: 11.80, value: 68, complexity: 72, segment: 'Grow',        stage: 'Maturity', stockouts: 397, promoDep: 24.3, leadTime: 6.5 },
  { name: 'BrandD Chocolate',    category: 'Snacks',        margin: 36.2, growth: 15.3, netSales:  9.90, value: 64, complexity: 78, segment: 'Grow',        stage: 'Growth',   stockouts: 416, promoDep: 22.8, leadTime: 6.3 },

  // CONSOLIDATE — Low Value / Low Complexity (16 SKUs; showing 4 representatives)
  { name: 'BrandE Cheese',       category: 'Dairy',         margin: 38.6, growth:  3.1, netSales:  0.85, value: 32, complexity: 38, segment: 'Consolidate', stage: 'Maturity', stockouts: 405, promoDep: 27.7, leadTime: 5.8 },
  { name: 'BrandD Nuts',         category: 'Snacks',        margin: 35.9, growth:  2.8, netSales:  2.10, value: 28, complexity: 42, segment: 'Consolidate', stage: 'Maturity', stockouts: 280, promoDep: 20.5, leadTime: 5.6 },
  { name: 'BrandF Energy Drink', category: 'Beverages',     margin: 37.2, growth:  1.5, netSales:  2.50, value: 30, complexity: 35, segment: 'Consolidate', stage: 'Maturity', stockouts: 255, promoDep: 19.2, leadTime: 5.5 },
  { name: 'BrandB Chocolate',    category: 'Snacks',        margin: 36.8, growth:  2.2, netSales:  3.20, value: 34, complexity: 40, segment: 'Consolidate', stage: 'Maturity', stockouts: 310, promoDep: 27.6, leadTime: 5.7 },

  // RATIONALIZE — Low Value / High Complexity (35 SKUs; showing 8 representatives)
  { name: 'BrandF Soda',         category: 'Beverages',     margin: 36.3, growth: -8.2, netSales:  2.02, value: 18, complexity: 90, segment: 'Rationalize', stage: 'Decline',  stockouts: 393, promoDep: 26.1, leadTime: 6.4 },
  { name: 'BrandA Chocolate',    category: 'Snacks',        margin: 35.8, growth: -5.2, netSales:  1.80, value: 15, complexity: 88, segment: 'Rationalize', stage: 'Decline',  stockouts: 392, promoDep: 24.7, leadTime: 6.5 },
  { name: 'BrandD Water',        category: 'Beverages',     margin: 35.9, growth: -3.8, netSales:  3.10, value: 22, complexity: 85, segment: 'Rationalize', stage: 'Decline',  stockouts: 378, promoDep: 28.0, leadTime: 6.4 },
  { name: 'BrandE Water',        category: 'Beverages',     margin: 35.9, growth: -2.1, netSales:  2.23, value: 20, complexity: 82, segment: 'Rationalize', stage: 'Decline',  stockouts: 360, promoDep: 25.4, leadTime: 6.3 },
  { name: 'BrandA Softener',     category: 'Home Care',     margin: 35.8, growth:  1.2, netSales:  1.40, value: 16, complexity: 92, segment: 'Rationalize', stage: 'Maturity', stockouts: 293, promoDep: 23.1, leadTime: 6.5 },
  { name: 'BrandE Juice',        category: 'Beverages',     margin: 36.4, growth: -4.5, netSales:  1.65, value: 19, complexity: 84, segment: 'Rationalize', stage: 'Decline',  stockouts: 345, promoDep: 27.6, leadTime: 6.2 },
  { name: 'BrandB Yogurt',       category: 'Dairy',         margin: 37.1, growth: -1.5, netSales:  1.20, value: 14, complexity: 80, segment: 'Rationalize', stage: 'Decline',  stockouts: 350, promoDep: 22.8, leadTime: 6.0 },
  { name: 'BrandC Water',        category: 'Beverages',     margin: 36.0, growth: -2.9, netSales:  1.75, value: 17, complexity: 86, segment: 'Rationalize', stage: 'Decline',  stockouts: 330, promoDep: 24.5, leadTime: 6.3 },
];

// ─── Channel Performance (Q17/Q18) ───────────────────────────────────────────
export const CHANNEL_DATA: ChannelData[] = [
  { channel: 'E-commerce',  marginPct: 38.56, volatilityCV: 0.061, stockoutCount: 7907  },
  { channel: 'Supermarket', marginPct: 38.53, volatilityCV: 0.065, stockoutCount: 7818  },
  { channel: 'Hypermarket', marginPct: 38.52, volatilityCV: 0.063, stockoutCount: 15907 },
  { channel: 'Convenience', marginPct: 38.20, volatilityCV: 0.069, stockoutCount: 1482  },
];

// ─── Regional Data (Q16) ─────────────────────────────────────────────────────
export const REGIONAL_DATA: RegionalData[] = [
  { country: 'Italy',       skuCount: 102, netSalesM: 137.2, marginPct: 38.53, complexityLabel: 'High' },
  { country: 'Spain',       skuCount: 100, netSalesM: 106.7, marginPct: 38.60, complexityLabel: 'High' },
  { country: 'Germany',     skuCount:  98, netSalesM:  88.5, marginPct: 38.48, complexityLabel: 'High' },
  { country: 'France',      skuCount:  80, netSalesM:  42.6, marginPct: 38.55, complexityLabel: 'Medium' },
  { country: 'Austria',     skuCount:  80, netSalesM:  43.0, marginPct: 38.64, complexityLabel: 'Medium' },
  { country: 'Poland',      skuCount:  80, netSalesM:  42.4, marginPct: 38.36, complexityLabel: 'Medium' },
  { country: 'Netherlands', skuCount:  45, netSalesM:  12.5, marginPct: 38.20, complexityLabel: 'Opt' },
];

// ─── Top 10 Stockout SKUs (Q11 + Q12) ────────────────────────────────────────
export const STOCKOUT_TOP10: StockoutItem[] = [
  { name: 'BrandC Biscuits',     category: 'Snacks',        stockoutCount: 440, safetyStockRatio: 0.000165, netSalesM: 3.20, segment: 'Rationalize' },
  { name: 'BrandF Soap',         category: 'Personal Care', stockoutCount: 440, safetyStockRatio: 0.000148, netSalesM: 4.10, segment: 'Consolidate' },
  { name: 'BrandB Energy Drink', category: 'Beverages',     stockoutCount: 427, safetyStockRatio: 0.000172, netSalesM: 2.85, segment: 'Rationalize' },
  { name: 'BrandB Milk',         category: 'Dairy',         stockoutCount: 417, safetyStockRatio: 0.000180, netSalesM: 2.40, segment: 'Rationalize' },
  { name: 'BrandD Chips',        category: 'Snacks',        stockoutCount: 416, safetyStockRatio: 0.000160, netSalesM: 5.80, segment: 'Grow'        },
  { name: 'BrandE Cheese',       category: 'Dairy',         stockoutCount: 405, safetyStockRatio: 0.000248, netSalesM: 0.85, segment: 'Consolidate' },
  { name: 'BrandA Soda',         category: 'Beverages',     stockoutCount: 397, safetyStockRatio: 0.000162, netSalesM: 11.8, segment: 'Grow'        },
  { name: 'BrandA Toothpaste',   category: 'Personal Care', stockoutCount: 394, safetyStockRatio: 0.000155, netSalesM: 3.90, segment: 'Keep'        },
  { name: 'BrandF Soda',         category: 'Beverages',     stockoutCount: 393, safetyStockRatio: 0.000222, netSalesM: 2.02, segment: 'Rationalize' },
  { name: 'BrandA Chips',        category: 'Snacks',        stockoutCount: 392, safetyStockRatio: 0.000158, netSalesM: 4.50, segment: 'Keep'        },
];

// ─── Rationalization Scenarios (Q28-Q30) ─────────────────────────────────────
export const RATIONALIZATION_SCENARIOS: RationalizationScenario[] = [
  { label: 'Bottom 10%',     skusRemoved: 10, revenueImpact: -3.58,  marginImpact: -3.46,  safetyStockFreed: 8.81,  supplierReduction: 0 },
  { label: 'Bottom 20%',     skusRemoved: 20, revenueImpact: -9.00,  marginImpact: -8.81,  safetyStockFreed: 22.31, supplierReduction: 0 },
  { label: 'Bottom 30%',     skusRemoved: 30, revenueImpact: -14.05, marginImpact: -13.82, safetyStockFreed: 29.57, supplierReduction: 0 },
  { label: 'Full Rationalize', skusRemoved: 43, revenueImpact: -27.08, marginImpact: 0,      safetyStockFreed: 42.20, supplierReduction: 0 },
];

// ─── PCI Sub-Drivers (Q25) ───────────────────────────────────────────────────
export const PCI_DRIVERS: PCIDriver[] = [
  { label: 'Supplier Fragmentation Index', value: 1.2000, benchmark: 1.0000 },
  { label: 'SKU Proliferation Index',      value: 1.0200, benchmark: 0.8500 },
  { label: 'Low Velocity SKU %',           value: 0.6667, benchmark: 0.4000 },
  { label: 'Lead Time Instability (CV)',    value: 0.2014, benchmark: 0.1500 },
  { label: 'Promo Dependency Score',        value: 0.1100, benchmark: 0.0800 },
  { label: 'Avg Portfolio Volatility CV',   value: 0.1071, benchmark: 0.0800 },
];

// ─── Top SKUs by Revenue (Q1) ─────────────────────────────────────────────────
export const TOP_SKUS_REVENUE: TopSKU[] = [
  { name: 'BrandF Water',     category: 'Beverages',     netSalesM: 17.03, grossMarginM: 6.83 },
  { name: 'BrandC Chips',     category: 'Snacks',        netSalesM: 16.00, grossMarginM: 5.80 },
  { name: 'BrandB Chips',     category: 'Snacks',        netSalesM: 13.03, grossMarginM: 5.19 },
  { name: 'BrandC Toothpaste',category: 'Personal Care', netSalesM: 12.97, grossMarginM: 4.62 },
  { name: 'BrandB Soap',      category: 'Personal Care', netSalesM: 12.50, grossMarginM: 5.00 },
];

// ─── Agent Roster ─────────────────────────────────────────────────────────────
export const AGENT_ROSTER: Agent[] = [
  { name: 'Portfolio Agent',     role: 'Monitors 102 SKUs; flagged Dairy as highest drag (27.78%).' },
  { name: 'Market Signal Agent', role: 'Tracks promo dependency; BrandD Water at 27.97% — highest in portfolio.' },
  { name: 'Supplier Agent',      role: 'Identified 60 universal suppliers creating interconnectivity risk (0% reducible).' },
  { name: 'Profitability Agent', role: '12 high-volume SKUs diluting portfolio margin to 38.53% vs 40% target.' },
  { name: 'Sunset Agent',        role: 'Removing 35 "Rationalize" SKUs frees 42.2% safety stock capital ($246M → $142M).' },
];

// ─── Tab Configuration ────────────────────────────────────────────────────────
export const TABS = [
  { id: 0, name: 'Portfolio Health Map' },
  { id: 1, name: 'Launch Readiness' },
  { id: 2, name: 'Profitability Tree' },
  { id: 3, name: 'SKU Rationalization' },
  { id: 4, name: 'Signals Board' },
];
