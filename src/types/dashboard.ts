/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'VP Product Management' | 'Product Manager' | 'Pricing and Margin Partner';

export interface KPI {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  info: string;
  /** When true, an upward trend is a risk signal (shown red, not green) */
  isRisk?: boolean;
  /** Which roles should this card be highlighted for */
  highlight?: Role[];
}

export interface PortfolioItem {
  name: string;
  category: string;
  margin: number;       // gross margin %
  growth: number;       // YoY revenue growth %
  netSales: number;     // net sales in $M
  value: number;        // commercial value score 0-100
  complexity: number;   // operational complexity score 0-100
  segment: 'Keep' | 'Grow' | 'Consolidate' | 'Rationalize';
  stage: 'Introduction' | 'Growth' | 'Maturity' | 'Decline';
  stockouts?: number;
  promoDep?: number;    // promo dependency %
  leadTime?: number;    // lead time in days
  promoErosion?: number; // promo margin erosion score
}

export interface Agent {
  name: string;
  role: string;
}

export interface ChannelData {
  channel: string;
  marginPct: number;
  volatilityCV: number;
  stockoutCount: number;
}

export interface RegionalData {
  country: string;
  skuCount: number;
  netSalesM: number;
  marginPct: number;
  complexityLabel: 'High' | 'Medium' | 'Opt';
}

export interface StockoutItem {
  name: string;
  category: string;
  stockoutCount: number;
  safetyStockRatio: number;
  netSalesM: number;
  segment: 'Keep' | 'Grow' | 'Consolidate' | 'Rationalize';
}

export interface RationalizationScenario {
  label: string;
  skusRemoved: number;
  revenueImpact: number;   // negative %
  marginImpact: number;    // negative %
  safetyStockFreed: number; // positive %
  supplierReduction: number; // %
}

export interface PCIDriver {
  label: string;
  value: number;
  benchmark: number;
}

export interface TopSKU {
  name: string;
  category: string;
  netSalesM: number;
  grossMarginM: number;
}
