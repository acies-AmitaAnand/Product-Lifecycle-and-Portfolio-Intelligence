/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'VP Product Management' | 'Product Manager' | 'Pricing and Margin Partner';

export interface KPI {
  label: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  info: string;
}

export interface PortfolioItem {
  name: string;
  category: string;
  margin: number;
  growth: number;
  size: number;
  value: number;
  complexity: number;
  segment: 'Keep' | 'Grow' | 'Consolidate' | 'Rationalize';
  stage: 'Introduction' | 'Growth' | 'Maturity' | 'Decline';
}

export interface Agent {
  name: string;
  role: string;
}
