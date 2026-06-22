/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared constants, pure helpers, and interfaces for the SKU Rationalization feature.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CannibalizationPair {
  a: string;
  b: string;
  risk: number;
  cat: string;
  revAtRisk: number;
}

// ─── AI Classification Config ─────────────────────────────────────────────────

export const SR_CLASSES: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: string; desc: string }
> = {
  retain: {
    label: 'Retain',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.2)',
    icon: '✅',
    desc: 'High value, low complexity. Core portfolio.',
  },
  grow: {
    label: 'Grow',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.06)',
    border: 'rgba(59,130,246,0.2)',
    icon: '📈',
    desc: 'Strong margin & growth trajectory. Scale supply.',
  },
  bundle: {
    label: 'Bundle',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.06)',
    border: 'rgba(139,92,246,0.2)',
    icon: '📦',
    desc: 'Pair with hero SKUs to lift avg basket value.',
  },
  reposition: {
    label: 'Reposition',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.2)',
    icon: '🔄',
    desc: 'Moderate value but high cost. Needs pricing or channel change.',
  },
  sunset: {
    label: 'Sunset',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.06)',
    border: 'rgba(239,68,68,0.2)',
    icon: '🌅',
    desc: 'Low value + high complexity. Remove from portfolio.',
  },
};

// ─── SKU Classification Logic ─────────────────────────────────────────────────

export function srClassify(s: any): string {
  if (s.val >= 0.7 && s.cx <= 0.4) return 'retain';
  if (s.val >= 0.6 && s.growth >= 0.15) return 'grow';
  if (s.val < 0.5 && s.cx < 0.5 && s.margin >= 30) return 'bundle';
  if (s.val < 0.4 && s.cx >= 0.6) return 'sunset';
  return 'reposition';
}

// ─── Location Helper ──────────────────────────────────────────────────────────

export const getSkuLocation = (name: string): 'APAC' | 'EMEA' | 'Americas' => {
  const charSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  if (charSum % 3 === 0) return 'APAC';
  if (charSum % 3 === 1) return 'EMEA';
  return 'Americas';
};

// ─── Cannibalization Pairs Dataset ────────────────────────────────────────────

export const PAIRS_DATA: CannibalizationPair[] = [
  { a: 'Mango Fizz 500ml',  b: 'Aloe Vera Drink', risk: 0.62, cat: 'Beverages',     revAtRisk: 42 },
  { a: 'Oat Cookies',       b: 'Choco Wafers',    risk: 0.38, cat: 'Snacks',         revAtRisk: 18 },
  { a: 'Herbal Shampoo',    b: 'Hand Cream SPF',  risk: 0.24, cat: 'Personal Care',  revAtRisk: 12 },
  { a: 'Dish Soap 1K',      b: 'Floor Cleaner',   risk: 0.51, cat: 'Household',      revAtRisk: 28 },
  { a: 'Green Tea RTD',     b: 'Mango Fizz 500ml', risk: 0.44, cat: 'Beverages',     revAtRisk: 22 },
];
