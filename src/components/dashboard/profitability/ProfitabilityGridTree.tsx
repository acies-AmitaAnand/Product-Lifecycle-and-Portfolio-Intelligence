/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, HelpCircle, Lock, Sliders, Info, X } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../../constants/data';
import { Role } from '../../../types/dashboard';

interface BrandNode {
  name: string;
  skusCount: number;
  netSales: number;
  totalGP: number;
  margin: number;
  leakageCount: number;
  skus: typeof PORTFOLIO_DATA;
}

interface CategoryNode {
  name: string;
  skusCount: number;
  netSales: number;
  totalGP: number;
  margin: number;
  leakageCount: number;
  brands: Record<string, BrandNode>;
}

interface ProfitabilityGridTreeProps {
  role?: Role;
  onAuditClick?: (metric: string) => void;
}

const getCategoryDetails = (name: string) => {
  switch (name) {
    case 'Beverages':
      return {
        soWhat: 'High promotional dependency (up to 27.97% on BrandD Water) causes margin erosion on key items.',
        action: 'Implement discount depth caps (max 15%) and review trade promo calendar to recover margin.'
      };
    case 'Dairy':
      return {
        soWhat: 'Dairy has the highest concentration of low-velocity SKUs (27.78%), causing inventory drag.',
        action: 'Consolidate supplier networks for long-tail Dairy SKUs and prune low-performing yogurt/cheese lines.'
      };
    case 'Snacks':
      return {
        soWhat: 'High revenue contributor but suffers from extreme stockouts (BrandC Biscuits at 440 events).',
        action: 'Establish a 5% dedicated safety stock buffer for top-selling Snack items to secure availability.'
      };
    case 'Personal Care':
      return {
        soWhat: 'High average gross margin (39.5%) but faces logistics complexity (BrandF Soap at 440 stockouts).',
        action: 'Optimize personal care supplier lead times and automate replenishment cycles for top items.'
      };
    case 'Home Care':
      return {
        soWhat: 'Low-velocity SKU burden (16.67% drag) with declining tail items such as BrandA Softener.',
        action: 'Transition low-velocity Home Care SKUs to specialized distributors to reduce direct supplier overhead.'
      };
    default:
      return {
        soWhat: 'Performance varies across regional networks, leading to supply chain inefficiencies.',
        action: 'Perform a full assortment audit to identify structural optimization points.'
      };
  }
};

const getBrandDetails = (name: string) => {
  switch (name) {
    case 'BrandA':
      return {
        soWhat: 'High-volume margin diluter. BrandA Soda has a margin of 36.1%, dragging average performance.',
        action: 'Execute price-pack restructuring (PPA), introducing bulk multi-packs for wholesale channels.'
      };
    case 'BrandB':
      return {
        soWhat: 'BrandB Yogurt is in decline (-1.5% growth) and BrandB Milk suffers from 417 stockouts.',
        action: 'Consolidate BrandB distribution in retail, focusing logistics priority on high-velocity items.'
      };
    case 'BrandC':
      return {
        soWhat: 'Severe promo erosion (max 15.49 on BrandC Toothpaste) and 440 stockouts on BrandC Biscuits.',
        action: 'Enforce promo depth margins and adjust safety stock ratio to support high demand volatility.'
      };
    case 'BrandD':
      return {
        soWhat: 'BrandD Water faces -3.8% sales decline and extreme promo dependency (27.97%).',
        action: 'Prune low-performing BrandD SKUs and shift marketing spends to high-margin BrandD Cheese.'
      };
    case 'BrandE':
      return {
        soWhat: 'High supplier fragmentation and low sales volume (e.g. BrandE Cheese has $0.85M net sales).',
        action: 'Transition BrandE to distributor-held inventory models to reduce internal administrative costs.'
      };
    case 'BrandF':
      return {
        soWhat: 'Strongest margins (40.0% on BrandF Water) but BrandF Soap has 440 stockouts, creating shelf gaps.',
        action: 'Increase safety stock allocation for BrandF and prioritize replenishment for e-commerce.'
      };
    default:
      return {
        soWhat: 'Active brand with localized market penetration and varying margin distributions.',
        action: 'Track promo dependency metrics and coordinate stock replenishment schedules.'
      };
  }
};

const getSkuDetails = (sku: typeof PORTFOLIO_DATA[0]) => {
  if (sku.segment === 'Keep') {
    return {
      soWhat: `Core portfolio anchor yielding high margin (${sku.margin.toFixed(1)}%) and sales ($${sku.netSales.toFixed(2)}M) with low complexity.`,
      action: 'Protect distribution footprint and include in cross-selling bundles to support long-tail items.'
    };
  } else if (sku.segment === 'Grow') {
    return {
      soWhat: `High-growth item (${sku.growth.toFixed(1)}% growth) but has severe complexity (e.g. ${sku.stockouts} stockout events).`,
      action: 'Address supply bottlenecks, increase safety stock, and optimize promo depth to protect margins.'
    };
  } else if (sku.segment === 'Consolidate') {
    return {
      soWhat: `Low commercial value ($${sku.netSales.toFixed(2)}M sales) but has low complexity. Direct supplier overhead is disproportionate.`,
      action: 'Consolidate supplier relationships or transition to a master distributor model.'
    };
  } else { // Rationalize
    return {
      soWhat: `Margin-dilutive (${sku.margin.toFixed(1)}%), high complexity (${sku.complexity}), and declining sales (${sku.growth.toFixed(1)}% growth).`,
      action: 'Candidate for immediate phase-out. Pruning will free up warehouse capital with minimal revenue risk.'
    };
  }
};

const getSegmentClass = (segment: string) => {
  switch (segment) {
    case 'Keep': return 'text-green-600 dark:text-green-400';
    case 'Grow': return 'text-amber-700 dark:text-acies-yellow';
    case 'Consolidate': return 'text-blue-600 dark:text-blue-400';
    default: return 'text-red-600 dark:text-red-400';
  }
};

export const ProfitabilityGridTree: React.FC<ProfitabilityGridTreeProps> = ({ role, onAuditClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Beverages': true,
    'Dairy': false,
    'Snacks': false,
    'Personal Care': false,
    'Home Care': false,
  });
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});

  // Interactive Inspector States
  const [hoveredNode, setHoveredNode] = useState<{
    type: 'Category' | 'Brand' | 'SKU';
    name: string;
    sales: number;
    margin: number;
    extraLabel?: string;
    extraValue?: string;
    soWhat: string;
    action: string;
    skuDetails?: typeof PORTFOLIO_DATA[0];
  } | null>(null);

  const [selectedNode, setSelectedNode] = useState<{
    type: 'Category' | 'Brand' | 'SKU';
    name: string;
    sales: number;
    margin: number;
    extraLabel?: string;
    extraValue?: string;
    soWhat: string;
    action: string;
    skuDetails?: typeof PORTFOLIO_DATA[0];
  } | null>(null);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleBrand = (brandKey: string) => {
    setExpandedBrands(prev => ({ ...prev, [brandKey]: !prev[brandKey] }));
  };

  // Group PORTFOLIO_DATA into Category -> Brand -> SKU
  const groupedData = useMemo<Record<string, CategoryNode>>(() => {
    const tree: Record<string, CategoryNode> = {};

    PORTFOLIO_DATA.forEach(sku => {
      const cat = sku.category;
      const brand = sku.name.split(' ')[0]; // Extract brand e.g. "BrandF"
      
      const isLeaking = sku.margin < 37.0 || (sku.promoErosion !== undefined && sku.promoErosion > 10.0);

      // Init Category
      if (!tree[cat]) {
        tree[cat] = {
          name: cat,
          skusCount: 0,
          netSales: 0,
          totalGP: 0,
          margin: 0,
          leakageCount: 0,
          brands: {}
        };
      }

      // Init Brand
      if (!tree[cat].brands[brand]) {
        tree[cat].brands[brand] = {
          name: brand,
          skusCount: 0,
          netSales: 0,
          totalGP: 0,
          margin: 0,
          leakageCount: 0,
          skus: []
        };
      }

      // Add to Brand
      const bNode = tree[cat].brands[brand];
      bNode.skusCount += 1;
      bNode.netSales += sku.netSales;
      bNode.totalGP += (sku.netSales * sku.margin) / 100;
      if (isLeaking) bNode.leakageCount += 1;
      bNode.skus.push(sku);

      // Add to Category
      const cNode = tree[cat];
      cNode.skusCount += 1;
      cNode.netSales += sku.netSales;
      cNode.totalGP += (sku.netSales * sku.margin) / 100;
      if (isLeaking) cNode.leakageCount += 1;
    });

    // Compute margins
    Object.keys(tree).forEach(cName => {
      const c = tree[cName];
      c.margin = (c.totalGP / c.netSales) * 100;
      Object.keys(c.brands).forEach(bName => {
        const b = c.brands[bName];
        b.margin = (b.totalGP / b.netSales) * 100;
      });
    });

    return tree;
  }, []);

  // Helper to resolve detailed node properties
  const getNodeDetails = (type: 'Category' | 'Brand' | 'SKU', name: string, sales: number, margin: number, extraSku?: typeof PORTFOLIO_DATA[0]) => {
    if (type === 'Category') {
      const details = getCategoryDetails(name);
      const catNode = groupedData[name];
      return {
        type,
        name,
        sales,
        margin,
        extraLabel: 'Leaking SKUs',
        extraValue: catNode ? `${catNode.leakageCount} of ${catNode.skusCount}` : undefined,
        soWhat: details.soWhat,
        action: details.action
      };
    } else if (type === 'Brand') {
      const details = getBrandDetails(name);
      let skusCount = 0;
      let leakageCount = 0;
      Object.keys(groupedData).forEach(catKey => {
        const cat = groupedData[catKey];
        if (cat.brands[name]) {
          skusCount = cat.brands[name].skusCount;
          leakageCount = cat.brands[name].leakageCount;
        }
      });
      return {
        type,
        name,
        sales,
        margin,
        extraLabel: 'Leaking SKUs',
        extraValue: `${leakageCount} of ${skusCount}`,
        soWhat: details.soWhat,
        action: details.action
      };
    } else {
      const sku = extraSku || PORTFOLIO_DATA.find(s => s.name === name);
      const details = sku ? getSkuDetails(sku) : { soWhat: '', action: '' };
      return {
        type,
        name,
        sales,
        margin,
        extraLabel: 'Segment / Stage',
        extraValue: sku ? `${sku.segment} / ${sku.stage}` : undefined,
        soWhat: details.soWhat,
        action: details.action,
        skuDetails: sku
      };
    }
  };

  // Filter grouped data based on search query
  const filteredTree = useMemo<Record<string, CategoryNode>>(() => {
    if (!searchQuery) return groupedData;

    const query = searchQuery.toLowerCase();
    const result: Record<string, CategoryNode> = {};

    Object.keys(groupedData).forEach(catName => {
      const catData = groupedData[catName];
      const matchingBrands: Record<string, BrandNode> = {};

      Object.keys(catData.brands).forEach(brandName => {
        const brandData = catData.brands[brandName];
        const matchingSKUs = brandData.skus.filter(sku => 
          sku.name.toLowerCase().includes(query) || 
          sku.category.toLowerCase().includes(query)
        );

        if (matchingSKUs.length > 0 || brandName.toLowerCase().includes(query)) {
          matchingBrands[brandName] = {
            ...brandData,
            skus: matchingSKUs.length > 0 ? matchingSKUs : brandData.skus,
            skusCount: matchingSKUs.length > 0 ? matchingSKUs.length : brandData.skusCount
          };
        }
      });

      if (Object.keys(matchingBrands).length > 0 || catName.toLowerCase().includes(query)) {
        result[catName] = {
          ...catData,
          brands: Object.keys(matchingBrands).length > 0 ? matchingBrands : catData.brands
        };
      }
    });

    return result;
  }, [groupedData, searchQuery]);

  const activeNode = hoveredNode || selectedNode;

  return (
    <div className="glass-card flex flex-col min-h-[550px] relative">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-black/10 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-display">Profitability Tree Drilldown</h3>
            {onAuditClick && (
              <button
                onClick={() => onAuditClick('Profitability Tree Drilldown')}
                className="text-[8px] font-bold uppercase text-amber-800 dark:text-acies-yellow hover:underline flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity bg-black/10 dark:bg-white/5 px-2 py-0.5 cursor-pointer"
                title="Audit Sales Data & Formulas"
              >
                <HelpCircle size={8} />
                Audit Lineage
              </button>
            )}
          </div>
          <p className="text-[10px] opacity-50 font-medium uppercase tracking-wider">
            Category → Brand → SKU Margin Breakdown
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-48 shrink-0">
          <input
            type="text"
            placeholder="Quick Filter SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1 text-[10px] placeholder:opacity-40 focus:outline-none focus:border-acies-yellow"
          />
        </div>
      </div>

      {/* Split-Screen Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* LEFT COLUMN: The Hierarchy Tree Grid */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            {/* Table Header */}
            <div className="grid grid-cols-12 text-[8px] font-bold uppercase tracking-wider opacity-40 pb-2 border-b border-black/10 dark:border-white/10">
              <span className="col-span-5 sm:col-span-6">Structure Nodes (Category / Brand / SKU)</span>
              <span className="col-span-2 text-right">SKUs</span>
              <span className="col-span-2 text-right">Sales ($M)</span>
              <span className="col-span-2 text-right">Margin (%)</span>
              <span className="col-span-1 text-center">Leak</span>
            </div>

            {/* Tree Rows */}
            <div className="flex-1 overflow-y-auto max-h-[440px] pr-1 mt-2 space-y-1 scrollbar-thin">
              {Object.keys(filteredTree).length === 0 ? (
                <div className="text-center py-12 text-xs opacity-40">No items match your filter query.</div>
              ) : (
                Object.keys(filteredTree).map((catName) => {
                  const cat = filteredTree[catName];
                  const isCatExpanded = expandedCategories[catName];
                  const catLeakage = cat.leakageCount > 0;
                  const isCatSelected = selectedNode?.type === 'Category' && selectedNode?.name === catName;
                  
                  return (
                    <div key={catName} className="space-y-0.5">
                      {/* Category Row */}
                      <div 
                        onClick={() => {
                          if (isCatSelected) {
                            setSelectedNode(null);
                          } else {
                            setSelectedNode(getNodeDetails('Category', catName, cat.netSales, cat.margin));
                          }
                        }}
                        onMouseEnter={() => {
                          setHoveredNode(getNodeDetails('Category', catName, cat.netSales, cat.margin));
                        }}
                        onMouseLeave={() => setHoveredNode(null)}
                        className={`grid grid-cols-12 items-center text-[11px] py-2 px-1.5 cursor-pointer transition-all border-b border-black/5 dark:border-white/5 ${
                          isCatSelected 
                            ? 'bg-acies-yellow/15 dark:bg-white/10 border-l-4 border-l-acies-yellow text-acies-gray dark:text-white font-medium shadow-sm shadow-acies-yellow/5' 
                            : 'hover:bg-black/5 dark:hover:bg-white/5 ' + (catLeakage ? 'border-l-2 border-l-amber-500' : 'border-l-2 border-l-green-500')
                        }`}
                      >
                        <div className="col-span-5 sm:col-span-6 flex items-center gap-1.5 font-bold uppercase tracking-tight">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategory(catName);
                            }}
                            className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
                          >
                            {isCatExpanded ? <ChevronDown size={12} className="opacity-60" /> : <ChevronRight size={12} className="opacity-60" />}
                          </button>
                          {cat.name}
                        </div>
                        <span className="col-span-2 text-right font-mono opacity-60">{cat.skusCount}</span>
                        <span className="col-span-2 text-right font-mono font-bold">${cat.netSales.toFixed(2)}M</span>
                        <span className={`col-span-2 text-right font-mono font-bold ${cat.margin < 37 ? 'text-red-400' : cat.margin < 39 ? 'text-amber-400' : 'text-green-400'}`}>
                          {cat.margin.toFixed(2)}%
                        </span>
                        <div className="col-span-1 flex justify-center">
                          {catLeakage ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" title={`${cat.leakageCount} leaking SKUs`} />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          )}
                        </div>
                      </div>

                      {/* Brand Rows */}
                      {isCatExpanded && Object.keys(cat.brands).map((brandName) => {
                        const brand = cat.brands[brandName];
                        const brandKey = `${catName}-${brandName}`;
                        const isBrandExpanded = expandedBrands[brandKey];
                        const brandLeakage = brand.leakageCount > 0;
                        const isBrandSelected = selectedNode?.type === 'Brand' && selectedNode?.name === brandName;

                        return (
                          <div key={brandKey} className="space-y-0.5">
                            <div 
                              onClick={() => {
                                if (isBrandSelected) {
                                  setSelectedNode(null);
                                } else {
                                  setSelectedNode(getNodeDetails('Brand', brandName, brand.netSales, brand.margin));
                                }
                              }}
                              onMouseEnter={() => {
                                setHoveredNode(getNodeDetails('Brand', brandName, brand.netSales, brand.margin));
                              }}
                              onMouseLeave={() => setHoveredNode(null)}
                              className={`grid grid-cols-12 items-center text-[10px] py-1.5 pl-6 pr-1.5 cursor-pointer transition-all border-b border-black/5 dark:border-white/5 ${
                                isBrandSelected 
                                  ? 'bg-acies-yellow/15 dark:bg-white/10 border-l-4 border-l-acies-yellow text-acies-gray dark:text-white font-semibold' 
                                  : 'hover:bg-black/5 dark:hover:bg-white/5 bg-black/2 dark:bg-white/2 ' + (brandLeakage ? 'text-amber-500/90 font-medium' : 'opacity-80')
                              }`}
                            >
                              <div className="col-span-5 sm:col-span-6 flex items-center gap-1 font-bold uppercase">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBrand(brandKey);
                                  }}
                                  className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
                                >
                                  {isBrandExpanded ? <ChevronDown size={10} className="opacity-50" /> : <ChevronRight size={10} className="opacity-50" />}
                                </button>
                                {brand.name}
                              </div>
                              <span className="col-span-2 text-right font-mono opacity-50">{brand.skusCount}</span>
                              <span className="col-span-2 text-right font-mono opacity-70">${brand.netSales.toFixed(2)}M</span>
                              <span className="col-span-2 text-right font-mono font-bold">
                                {brand.margin.toFixed(2)}%
                              </span>
                              <div className="col-span-1 flex justify-center">
                                {brandLeakage ? (
                                  <span className="px-1 text-[7px] font-bold rounded-sm bg-amber-500/10 text-amber-500 uppercase">
                                    {brand.leakageCount} Leak
                                  </span>
                                ) : (
                                  <span className="text-[7px] font-bold opacity-30 uppercase text-green-400">OK</span>
                                )}
                              </div>
                            </div>

                            {/* SKU Rows */}
                            {isBrandExpanded && brand.skus.map((sku, index) => {
                              const isSkuLeaking = sku.margin < 37.0 || (sku.promoErosion && sku.promoErosion > 10.0);
                              const hasHighErosion = sku.promoErosion && sku.promoErosion > 10.0;
                              const isSkuSelected = selectedNode?.type === 'SKU' && selectedNode?.name === sku.name;

                              return (
                                <div 
                                  key={index}
                                  onClick={() => {
                                    if (isSkuSelected) {
                                      setSelectedNode(null);
                                    } else {
                                      setSelectedNode(getNodeDetails('SKU', sku.name, sku.netSales, sku.margin, sku));
                                    }
                                  }}
                                  onMouseEnter={() => {
                                    setHoveredNode(getNodeDetails('SKU', sku.name, sku.netSales, sku.margin, sku));
                                  }}
                                  onMouseLeave={() => setHoveredNode(null)}
                                  className={`grid grid-cols-12 items-center text-[9px] py-1 pl-12 pr-1.5 border-l border-white/5 cursor-pointer transition-colors ${
                                    isSkuSelected
                                      ? 'bg-acies-yellow/15 dark:bg-white/10 border-l-4 border-l-acies-yellow text-acies-gray dark:text-white font-medium'
                                      : isSkuLeaking 
                                        ? 'bg-red-50/50 dark:bg-red-500/5 text-red-700 dark:text-red-300 hover:bg-red-100/50 dark:hover:bg-red-500/10' 
                                        : 'opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                                  }`}
                                >
                                  <div className="col-span-5 sm:col-span-6 truncate font-mono">
                                    {sku.name}
                                  </div>
                                  <span className="col-span-2 text-right font-mono opacity-40">-</span>
                                  <span className="col-span-2 text-right font-mono">${sku.netSales.toFixed(2)}M</span>
                                  <span className={`col-span-2 text-right font-mono font-bold ${sku.margin < 37 ? 'text-red-400 font-bold' : ''}`}>
                                    {sku.margin.toFixed(1)}%
                                  </span>
                                  <div className="col-span-1 flex justify-center">
                                    {isSkuLeaking ? (
                                      <span 
                                        className={`w-1.5 h-1.5 rounded-full ${hasHighErosion ? 'bg-red-500' : 'bg-amber-400'}`}
                                        title={hasHighErosion ? `High Promo Erosion: ${sku.promoErosion}` : 'Low Gross Margin'}
                                      />
                                    ) : (
                                      <span className="w-1 h-1 rounded-full bg-green-500/40" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Grid Legend */}
          <div className="flex flex-wrap gap-4 border-t border-black/5 dark:border-white/5 pt-3 mt-4 text-[8px] opacity-50">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>High Margin Erosion (&gt;10.0 Score)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Dilutive Gross Margin (&lt;37.0%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Optimal Portfolio Health</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Assortment Inspector Card */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-black/10 dark:border-white/10 pt-6 lg:pt-0 lg:pl-6 flex flex-col">
          <div className="flex-1 flex flex-col justify-between h-full bg-black/5 dark:bg-white/2 p-5 border border-black/10 dark:border-white/10 rounded-sm">
            {activeNode ? (
              <div className="space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Header with Type, Name and Pin Status */}
                  <div className="flex justify-between items-start border-b border-black/10 dark:border-white/10 pb-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase rounded bg-acies-yellow/20 text-amber-800 dark:text-acies-yellow">
                          {activeNode.type}
                        </span>
                        {selectedNode?.name === activeNode.name && (
                          <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase rounded bg-green-500/20 text-green-400 flex items-center gap-0.5">
                            <Lock size={8} /> Selected
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-display font-bold text-acies-gray dark:text-white leading-tight mt-1.5">
                        {activeNode.name}
                      </h4>
                    </div>
                    {selectedNode?.name === activeNode.name && (
                      <button 
                        onClick={() => setSelectedNode(null)} 
                        className="text-[8px] font-bold uppercase text-red-400 hover:text-red-300 flex items-center gap-0.5 cursor-pointer bg-red-500/10 px-1 py-0.5 rounded-sm"
                        title="Release selection focus"
                      >
                        <X size={8} /> Clear
                      </button>
                    )}
                  </div>

                  {/* Sales & Basic Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-mono bg-white dark:bg-white/5 p-3 border border-black/5 dark:border-white/5 rounded-sm">
                    <div>
                      <span className="opacity-60 dark:opacity-45 uppercase text-[8px] block text-acies-gray dark:text-white">Net Sales</span>
                      <span className="font-bold text-acies-gray dark:text-white text-xs">${activeNode.sales.toFixed(2)}M</span>
                    </div>
                    <div>
                      <span className="opacity-60 dark:opacity-45 uppercase text-[8px] block text-acies-gray dark:text-white">Margin</span>
                      <span className="font-bold text-amber-800 dark:text-acies-yellow text-xs">{activeNode.margin.toFixed(2)}%</span>
                    </div>
                  </div>

                  {/* Margin Target Progress Bar (30% to 45% Range, Target at 40%) */}
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold uppercase tracking-wider opacity-50 block">Gross Margin vs. 40.0% Target</span>
                    {(() => {
                      const margin = activeNode.margin;
                      const minMargin = 30.0;
                      const maxMargin = 45.0;
                      const range = maxMargin - minMargin;
                      const rawPct = ((margin - minMargin) / range) * 100;
                      const pct = Math.max(0, Math.min(100, rawPct));
                      const targetPct = ((40.0 - minMargin) / range) * 100; // 66.67%
                      
                      return (
                        <div className="pt-2 pb-1">
                          <div className="relative w-full h-3.5 bg-black/10 dark:bg-white/10 rounded overflow-visible">
                            {/* Progress Fill */}
                            <div 
                              style={{ width: `${pct}%` }} 
                              className={`h-full rounded transition-all duration-300 ${
                                margin >= 40.0 
                                  ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' 
                                  : margin >= 37.0 
                                    ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]' 
                                    : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                              }`}
                            />
                            {/* Target Line at 40% */}
                            <div 
                              style={{ left: `${targetPct}%` }} 
                              className="absolute top-0 bottom-0 w-0.5 border-l border-dashed border-black dark:border-white h-7 -translate-y-1.5 z-10"
                              title="Corporate Margin Target: 40.0%"
                            />
                          </div>
                          <div className="flex justify-between items-center text-[8px] opacity-45 uppercase font-mono mt-1.5">
                            <span>30.0%</span>
                            <span className="text-amber-800 dark:text-acies-yellow font-bold">40.0% Target</span>
                            <span>45.0%</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Sub-Metrics details (for SKU) */}
                  {activeNode.type === 'SKU' && activeNode.skuDetails && (
                    <div className="grid grid-cols-2 gap-2 text-[9px] font-mono bg-white dark:bg-white/5 p-2.5 border border-black/5 dark:border-white/5 rounded-sm">
                      <div>
                        <span className="opacity-60 dark:opacity-45 block uppercase text-[7px] text-acies-gray dark:text-white">Lifecycle Stage</span>
                        <span className="font-bold text-acies-gray dark:text-white">{activeNode.skuDetails.stage}</span>
                      </div>
                      <div>
                        <span className="opacity-60 dark:opacity-45 block uppercase text-[7px] text-acies-gray dark:text-white">Segment Type</span>
                        <span className={`font-bold ${getSegmentClass(activeNode.skuDetails.segment)}`}>
                          {activeNode.skuDetails.segment}
                        </span>
                      </div>
                      <div>
                        <span className="opacity-60 dark:opacity-45 block uppercase text-[7px] text-acies-gray dark:text-white">Promo Dep.</span>
                        <span className="font-bold text-acies-gray dark:text-white">{activeNode.skuDetails.promoDep?.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="opacity-60 dark:opacity-45 block uppercase text-[7px] text-acies-gray dark:text-white">Promo Erosion</span>
                        <span className="font-bold text-acies-gray dark:text-white">{activeNode.skuDetails.promoErosion?.toFixed(1)}</span>
                      </div>
                      <div>
                        <span className="opacity-60 dark:opacity-45 block uppercase text-[7px] text-acies-gray dark:text-white">Lead Time</span>
                        <span className="font-bold text-acies-gray dark:text-white">{activeNode.skuDetails.leadTime} Days</span>
                      </div>
                      <div>
                        <span className="opacity-60 dark:opacity-45 block uppercase text-[7px] text-acies-gray dark:text-white">Stockouts</span>
                        <span className="font-bold text-acies-gray dark:text-white">{activeNode.skuDetails.stockouts} Events</span>
                      </div>
                    </div>
                  )}

                  {/* Business Rationale: So What & Action */}
                  <div className="space-y-3 pt-2 border-t border-black/10 dark:border-white/10">
                    <div>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block">So What? (Implication)</span>
                      <p className="text-[10px] opacity-80 leading-relaxed font-body mt-1">{activeNode.soWhat}</p>
                    </div>
                    <div>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 block">Action Plan (Playbook)</span>
                      <p className="text-[10px] text-amber-800 dark:text-acies-yellow opacity-90 leading-relaxed font-body font-medium mt-1">{activeNode.action}</p>
                    </div>
                  </div>
                </div>

                {/* Node-specific Audit Button at Bottom */}
                {onAuditClick && (
                  <div className="pt-4 border-t border-black/10 dark:border-white/10 flex justify-end">
                    <button
                      onClick={() => {
                        if (activeNode.type === 'SKU') {
                          onAuditClick('Avg Gross Margin');
                        } else if (activeNode.type === 'Category') {
                          onAuditClick('Net Sales (Portfolio)');
                        } else {
                          onAuditClick('Avg Gross Margin');
                        }
                      }}
                      className="text-[8px] font-bold uppercase text-acies-gray dark:text-white bg-acies-yellow/20 hover:bg-acies-yellow/30 border border-acies-yellow/30 px-3 py-1 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      title="Inspect audit trace for this selection"
                    >
                      <Sliders size={10} className="text-acies-yellow" />
                      Audit {activeNode.type} Methodology
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
                <div className="p-3 bg-black/10 dark:bg-white/5 rounded-full text-amber-600 dark:text-acies-yellow">
                  <Info size={24} />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-widest text-acies-gray dark:text-white">Assortment Inspector</h4>
                  <p className="text-[10px] opacity-40 uppercase tracking-wider mt-0.5 text-acies-gray dark:text-white">Interactive Deep Drill</p>
                </div>
                <p className="text-[10px] opacity-65 leading-relaxed max-w-[220px]">
                  Click any Category, Brand, or SKU row in the tree grid to lock details, view margin target comparisons, and reveal custom strategic recommendations.
                </p>
                <div className="bg-black/5 dark:bg-white/2 border border-black/10 dark:border-white/10 p-3 text-[9px] leading-relaxed text-left text-amber-800 dark:text-acies-yellow rounded-sm">
                  <span className="font-bold text-acies-gray dark:text-white uppercase tracking-wider block mb-1">Corporate Target</span>
                  Baseline enterprise gross margin target is <strong>40.0%</strong>. Items with margins below <strong>37.0%</strong> dilute average performance and flag margin-leaking risk.
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
