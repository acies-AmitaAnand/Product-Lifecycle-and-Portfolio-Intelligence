/**
 * Types for Simplify to Grow component suite
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

export type ComplexityType = 'Bad Complexity' | 'Good Variety' | 'Neutral';
export type ClassFilter = 'All' | ComplexityType;

export interface EnrichedSKU {
  name: string;
  cat: string;
  rev: number;
  val: number;
  cx: number;
  margin: number;
  growth: number;
  householdPenetration: number;
  promo: number;
  lead: number;
  ros: number;
  unitProfitPool: number;
  ippvRaw: number;
  ippv: number;
  complexityType: ComplexityType;
  productionDowntimeCost: number;
  transportOverheadCost: number;
  wasteWriteOffCost: number;
  totalHiddenCost: number;
  shelfProductivity: number;
}

export interface PillarDef {
  id: string;
  pillar: string;
  score: number;
  description: string;
  icon: React.ComponentType<any> | LucideIcon;
  color: string;
  bg: string;
  border: string;
  text: string;
  routeTab: number;
  routeLabel: string;
  extraParams?: string;
  kpiLabel: string;
  kpiValue: string;
  insight: string;
  topSkus: (skus: EnrichedSKU[]) => EnrichedSKU[];
  worstSkus: (skus: EnrichedSKU[]) => EnrichedSKU[];
}
