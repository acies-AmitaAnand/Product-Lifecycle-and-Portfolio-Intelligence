/**
 * Custom hook managing the state and computations for Tab 9 (Simplify to Grow)
 */

import { useState, useMemo, useCallback } from 'react';
import { EnrichedSKU, ClassFilter } from './types';
import { computeEnrichedSKUs, computePillars } from './utils';
import { getSkuLocation } from '../skuConstants';

import { TimelineRange } from '../../../../utils/timeframe';

export function useSimplifyToGrowState(setActiveTab: (tab: number) => void, selectedLocation?: string, timelineRange: TimelineRange = '12m') {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [classFilter, setClassFilter] = useState<ClassFilter>('All');
  const [ippvSort, setIppvSort] = useState<'ippv' | 'cx' | 'complexity' | 'cost'>('ippv');
  const [selectedSku, setSelectedSku] = useState<EnrichedSKU | null>(null);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [costDriverFilter, setCostDriverFilter] = useState<'All' | 'downtime' | 'transport' | 'waste'>('All');

  const allEnrichedSkus = useMemo(() => computeEnrichedSKUs(timelineRange), [timelineRange]);
  const skus = useMemo(() => {
    if (!selectedLocation || selectedLocation === 'ALL') return allEnrichedSkus;
    return allEnrichedSkus.filter(s => getSkuLocation(s.name) === selectedLocation);
  }, [allEnrichedSkus, selectedLocation]);

  const pillars = useMemo(() => computePillars(skus), [skus]);
  const overallScore = Math.round(pillars.reduce((a, p) => a + p.score, 0) / pillars.length);

  // Classification counts
  const badCount = skus.filter(s => s.complexityType === 'Bad Complexity').length;
  const goodCount = skus.filter(s => s.complexityType === 'Good Variety').length;
  const neutralCount = skus.filter(s => s.complexityType === 'Neutral').length;
  const totalHiddenCost = parseFloat(skus.reduce((a, s) => a + s.totalHiddenCost, 0).toFixed(1));

  // Filtered + sorted SKU list
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

  // Categories rollup calculation
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
        worstDowntimeSku: [...items].sort((a, b) => b.productionDowntimeCost - a.productionDowntimeCost)[0],
        worstTransportSku: [...items].sort((a, b) => b.transportOverheadCost - a.transportOverheadCost)[0],
        worstWasteSku: [...items].sort((a, b) => b.wasteWriteOffCost - a.wasteWriteOffCost)[0],
      };
    });
  }, [skus]);

  // Radar chart formatting
  const radarData = useMemo(() => {
    return pillars.map(p => ({ subject: p.pillar, score: p.score, fullMark: 100 }));
  }, [pillars]);

  const handleSkuClick = useCallback((sku: { name: string } | null) => {
    if (!sku) {
      setSelectedSku(null);
      return;
    }
    const fullSku = skus.find(s => s.name === sku.name);
    setSelectedSku(fullSku || null);
  }, [skus]);

  const handleNavigate = useCallback((tab: number, extraParams?: string) => {
    if (extraParams) {
      window.location.hash = `#tab=${tab}&${extraParams}`;
    } else {
      window.location.hash = `#tab=${tab}`;
    }
    setActiveTab(tab);
  }, [setActiveTab]);

  return {
    skus,
    pillars,
    overallScore,
    badCount,
    goodCount,
    neutralCount,
    totalHiddenCost,
    filteredSkus,
    categories,
    radarData,
    
    // States & setters
    selectedCategory,
    setSelectedCategory,
    classFilter,
    setClassFilter,
    ippvSort,
    setIppvSort,
    selectedSku,
    setSelectedSku,
    expandedPillar,
    setExpandedPillar,
    hoveredCat,
    setHoveredCat,
    costDriverFilter,
    setCostDriverFilter,

    // Handlers
    handleSkuClick,
    handleNavigate,
  };
}
