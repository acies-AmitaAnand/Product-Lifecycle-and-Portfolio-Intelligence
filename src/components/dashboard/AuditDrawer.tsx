/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Database, BookOpen, HelpCircle, Activity, CheckCircle, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

interface AuditDrawerProps {
  activeMetric: string | null;
  close: () => void;
}

interface AuditContent {
  title: string;
  value: string;
  soWhat: string;
  action: string;
  columns: { name: string; type: string; desc: string }[];
  formula: string;
  formulaDescription: string;
  assumptions: string[];
  trendTitle: string;
  trendHeaders: string[];
  trendRows: string[][];
}

const AUDIT_DATA: Record<string, AuditContent> = {
  'Net Sales (Portfolio)': {
    title: 'Net Sales (Portfolio)',
    value: '$473M',
    soWhat: 'Revenue growth is +10.12% YoY ($225.1M in 2022 to $247.9M in 2023) but is highly concentrated in the top 30% of items, creating a dependency on key SKUs.',
    action: 'Implement Portfolio Cross-Selling: Package high-demand SKUs with mid-velocity ones to spread portfolio revenue and reduce SKU reliance.',
    columns: [
      { name: 'net_sales', type: 'float [DIRECT]', desc: 'Revenue per transaction row (units sold × price).' },
      { name: 'date / year', type: 'date/int [DIRECT/DERIVED]', desc: 'Transaction timestamp. Year is derived using date.dt.year to calculate YoY comparison.' }
    ],
    formula: 'S_{total} = \\sum_{i=1}^{N} \\text{net\\_sales}_i',
    formulaDescription: 'Total portfolio net sales is the arithmetic sum of the net sales column across all transaction records in the dataset.',
    assumptions: [
      'Pre-aggregated transactions: The dataset represents already calculated net sales per line item.',
      'YoY alignment: New SKUs introduced in 2023 with no 2022 records are treated as having 0% growth, not flat.'
    ],
    trendTitle: 'Revenue by Category & Year',
    trendHeaders: ['Category', '2022 Sales', '2023 Sales', 'YoY % Change'],
    trendRows: [
      ['Beverages', '$54.8M', '$60.5M', '+10.4%'],
      ['Snacks', '$53.2M', '$58.6M', '+10.1%'],
      ['Dairy', '$45.3M', '$49.9M', '+10.2%'],
      ['Personal Care', '$40.4M', '$44.5M', '+10.1%'],
      ['Home Care', '$31.4M', '$34.4M', '+9.6%']
    ]
  },
  'Avg Gross Margin': {
    title: 'Avg Gross Margin',
    value: '38.53%',
    soWhat: 'While the portfolio average margin sits at 38.53%, 12 high-volume volumetric items (such as BrandA Soda at 36.08%) drag the margin below the 40% corporate benchmark.',
    action: 'Price-Pack Architecture (PPA): Adjust pricing terms or reduce pack sizing on margin-dilutive volumetric drivers to salvage margins.',
    columns: [
      { name: 'net_sales', type: 'float [DIRECT]', desc: 'Revenue per transaction.' },
      { name: 'units_sold', type: 'int [DIRECT]', desc: 'Unit volume per transaction.' },
      { name: 'purchase_cost', type: 'float [DIRECT]', desc: 'Per-unit cost of goods from supplier (COGS).' }
    ],
    formula: 'GM = \\frac{\\sum (\\text{net\\_sales} - \\text{units\\_sold} \\times \\text{purchase\\_cost})}{\\sum \\text{net\\_sales}}',
    formulaDescription: 'Gross Margin Percentage is computed by subtracting total Cost of Goods Sold (units_sold × purchase_cost) from net sales, divided by net sales.',
    assumptions: [
      'COGS stability: The analysis assumes that the mean purchase cost per SKU remains stable across the periods as a margin proxy.',
      'Excludes supply chain overhead: This reflects gross product margin; it does not capture freight or warehouse cost-to-serve variables.'
    ],
    trendTitle: 'Margin & Volatility by Sales Channel',
    trendHeaders: ['Channel', 'Gross Margin %', 'Volatility (CV)', 'Share of Sales'],
    trendRows: [
      ['E-commerce', '38.56%', '0.061 (Stable)', '24%'],
      ['Supermarket', '38.53%', '0.065 (Stable)', '35%'],
      ['Hypermarket', '38.52%', '0.063 (Stable)', '31%'],
      ['Convenience', '38.20%', '0.069 (Variable)', '10%']
    ]
  },
  'Revenue Concentration': {
    title: 'Revenue Concentration',
    value: '27.81%',
    soWhat: 'Just 10 SKUs (10% of portfolio) drive 27.81% of sales, while the top 30% drive 62.88%. Any supply chain disruption on these key items will severely impact the top line.',
    action: 'Targeted Safety Stock Buffer: Prioritize logistics bandwidth and apply a 5% safety stock buffer specifically to the top 10% high-velocity SKUs.',
    columns: [
      { name: 'net_sales', type: 'float [DIRECT]', desc: 'Primary commercial value column.' },
      { name: 'sku_id / sku_name', type: 'int/string [DIRECT]', desc: 'Join key used to group and rank portfolio items.' }
    ],
    formula: '\\text{Cumulative Share} = \\frac{\\sum_{i=1}^{k} S_i}{S_{\\text{total}}} \\quad \\text{where } S_1 \\ge S_2 \\ge \\dots \\ge S_N',
    formulaDescription: 'SKUs are sorted in descending order of net sales. The running cumulative sales of the top k SKUs is divided by total portfolio sales.',
    assumptions: [
      'Pareto benchmark: Focuses entirely on revenue concentration, not margin contribution. Some top revenue SKUs are margin-dilutive.'
    ],
    trendTitle: 'SKU Portfolio Concentration Tiers',
    trendHeaders: ['Portfolio Tier', 'SKU Count', 'Cumulative Net Sales', 'Share of Revenue'],
    trendRows: [
      ['Top 10% SKUs', '10', '$131.5M', '27.81%'],
      ['Top 20% SKUs', '20', '$229.4M', '48.51%'],
      ['Top 30% SKUs', '30', '$297.4M', '62.88%'],
      ['Long Tail (Remaining 70%)', '72', '$175.6M', '37.12%']
    ]
  },
  'Portfolio PCI': {
    title: 'Portfolio Complexity Index (PCI)',
    value: '0.5509',
    soWhat: 'The enterprise PCI is 0.5509 (target ≤ 0.42), heavily driven by supplier fragmentation (1.20) and SKU proliferation (1.02). This drives up inventory carrying costs by an estimated 20%.',
    action: 'Prune Supplier Overlap: Transition from 60 universal suppliers to specialized category clusters to break fragmentation.',
    columns: [
      { name: 'sku_id', type: 'int [DIRECT]', desc: 'Primary key used to count SKU proliferation.' },
      { name: 'supplier_id', type: 'string [DIRECT]', desc: 'Used to calculate supplier concentration & fragmentation.' },
      { name: 'lead_time_days', type: 'float [DIRECT]', desc: 'Input for lead time instability sub-index.' },
      { name: 'promo_flag', type: 'float [DIRECT]', desc: 'Input for promo dependency index.' }
    ],
    formula: '\\text{PCI} = \\frac{1}{6} \\left( I_{\\text{Frag}} + I_{\\text{Prolif}} + I_{\\text{LowVel}} + I_{\\text{LeadTime}} + I_{\\text{Promo}} + I_{\\text{Vol}} \\right)',
    formulaDescription: 'The Portfolio Complexity Index is the average of 6 normalized sub-indices reflecting operational complexity drivers.',
    assumptions: [
      'Equal Weighting: Assumes all six complexity sub-indices contribute equally to enterprise complexity.',
      'Baseline standards: Index baselines (e.g. 100 SKUs, 50 suppliers) are internal modeling benchmarks, not industry absolute maximums.'
    ],
    trendTitle: 'Enterprise Complexity Drivers vs. Benchmarks',
    trendHeaders: ['Complexity Driver', 'Actual Index Value', 'Benchmark Target', 'Status'],
    trendRows: [
      ['Supplier Fragmentation Index', '1.2000', '1.0000', 'Critical (Over-dispersed)'],
      ['SKU Proliferation Index', '1.0200', '0.8500', 'High (102 SKUs active)'],
      ['Low Velocity SKU Concentration', '0.6667', '0.4000', 'High (66.7% of catalog)'],
      ['Lead Time Instability (CV)', '0.2014', '0.1500', 'Elevated (Volatility in delivery)'],
      ['Promo Dependency Score', '0.1100', '0.0800', 'Elevated (Promo-driven sales)'],
      ['Avg Portfolio Volatility (CV)', '0.1071', '0.0800', 'Stable (Low organic variance)']
    ]
  },
  'Long-Tail SKU Burden': {
    title: 'Long-Tail SKU Burden',
    value: '66.7%',
    soWhat: '68 items (66.7% of catalog) generate <1% of revenue each, yet they interact with all 60 suppliers, creating massive administrative overhead without business value.',
    action: 'Consolidate Vendor Networks: Prune overlapping supplier relationships for low-velocity SKUs and transition to specialized distributors.',
    columns: [
      { name: 'net_sales', type: 'float [DIRECT]', desc: 'Determines SKU revenue velocity.' },
      { name: 'supplier_id', type: 'string [DIRECT]', desc: 'Maps supplier footprint.' }
    ],
    formula: '\\text{Burden Ratio} = \\frac{\\text{Count}(\\text{net\\_sales}_{SKU} < 0.01 \\times S_{\\text{total}})}{\\text{Total SKU Count}}',
    formulaDescription: 'Identifies the percentage of SKUs whose individual annual net sales contribute less than 1% of the total portfolio net sales.',
    assumptions: [
      'Overhead uniformity: Assumes supplier admin overhead (invoicing, QA) is uniform per SKU, meaning long-tail items consume a disproportionate share of resources.'
    ],
    trendTitle: 'Low-Velocity SKU Density by Category',
    trendHeaders: ['Category', 'Total SKUs', 'Low-Velocity SKUs (<1% rev)', 'Category Low-Velocity %'],
    trendRows: [
      ['Dairy', '18', '5', '27.78% (Highest Drag)'],
      ['Beverages', '24', '5', '20.83%'],
      ['Snacks', '24', '5', '20.83%'],
      ['Home Care', '18', '3', '16.67%'],
      ['Personal Care', '18', '3', '16.67%']
    ]
  },
  'Rationalize Candidates': {
    title: 'Rationalize Candidates',
    value: '35 SKUs',
    soWhat: 'These 35 items generate very little revenue and low margin, but drive peak stockouts and high promotion erosion, clogging the supply chain.',
    action: 'Prune Bottom 10% Immediately: Execute a phase 1 deletion of the 10 lowest-performing SKUs to free up 8.81% safety stock with only 3.58% revenue risk.',
    columns: [
      { name: 'commercial_value_score', type: 'float [DERIVED]', desc: 'Equal-weighted sum of revenue, margin, growth, and stability.' },
      { name: 'operational_complexity_score', type: 'float [DERIVED]', desc: 'Equal-weighted sum of lead time, suppliers, promo, stockouts, and volatility.' }
    ],
    formula: '\\text{Segment} = \\text{Rationalize if Value} < \\text{Median} \\text{ and Complexity} > \\text{Median}',
    formulaDescription: 'SKUs are segmented based on median splits of the normalized Commercial Value Score (X-axis) and Operational Complexity Score (Y-axis).',
    assumptions: [
      'Relative splits: Thresholds are set at the medians of the current portfolio. Thus, 35 SKUs will always appear in the "Rationalize" quadrant unless thresholds are set as absolute values.'
    ],
    trendTitle: 'Portfolio Segment Distribution & Key Metrics',
    trendHeaders: ['Segment', 'SKU Count', 'Avg Net Sales', 'Avg Gross Margin', 'Avg Stockouts'],
    trendRows: [
      ['Keep', '35', '$11.8M', '39.34%', '212'],
      ['Grow', '16', '$12.7M', '36.08%', '368'],
      ['Consolidate', '16', '$2.16M', '37.12%', '312'],
      ['Rationalize', '35', '$1.91M', '36.16%', '355']
    ]
  },
  'Peak Stockout Freq.': {
    title: 'Peak Stockout Freq.',
    value: '440 events',
    soWhat: 'Peak stockouts (440 events) are heavily concentrated in Hypermarkets (15.9k events), highlighting a channel-specific distribution bottleneck rather than an overall stock shortage.',
    action: 'Priority Logistics Routing: Re-negotiate delivery SLAs and establish dedicated priority freight lanes specifically for the Hypermarket channel.',
    columns: [
      { name: 'stock_out_flag', type: 'int [DIRECT]', desc: 'Binary flag (0/1) per transaction indicating a stockout occurred.' }
    ],
    formula: '\\text{Stockout Freq} = \\sum_{i=1}^{M} \\text{stock\\_out\\_flag}_i',
    formulaDescription: 'The sum of all stockout occurrences across all transaction rows for the specified SKU or channel.',
    assumptions: [
      'Unmet Demand: Assumes every stockout represents lost revenue (unmet demand), ignoring potential customer substitution behavior.'
    ],
    trendTitle: 'Stockouts & Volatility by Channel',
    trendHeaders: ['Channel Name', 'Total Stockout Events', 'Avg Volatility (CV)', 'Replenishment Risk'],
    trendRows: [
      ['Hypermarket', '15,907', '0.063', 'High (Peak Bottleneck)'],
      ['E-commerce', '7,907', '0.061', 'Medium'],
      ['Supermarket', '7,818', '0.065', 'Medium'],
      ['Convenience', '1,482', '0.069', 'Low (due to low SKU count)']
    ]
  },
  'Revenue Tail Risk': {
    title: 'Revenue Tail Risk',
    value: '27.08%',
    soWhat: 'Removing all 35 Rationalize SKUs simultaneously risks 27.08% of revenue. However, a structured phased pruning can mitigate this risk by redirecting sales to active SKUs.',
    action: 'Run Phased Rationalization Pilot: Implement a phased rollout (starting with bottom 10%) to test customer transfer rates before sun-setting all candidates.',
    columns: [
      { name: 'net_sales', type: 'float [DIRECT]', desc: 'Determines SKU revenue weight.' },
      { name: 'portfolio_segment', type: 'string [DERIVED]', desc: 'Identifies candidate SKUs.' }
    ],
    formula: 'R_{risk} = \\frac{\\sum_{i \\in \\text{Rationalize}} \\text{net\\_sales}_i}{S_{\\text{total}}} \\times 100',
    formulaDescription: 'The sum of net sales for all SKUs designated in the Rationalize segment, divided by the total portfolio net sales.',
    assumptions: [
      'Zero Revenue Transfer: The model assumes 100% of revenue from deleted SKUs is permanently lost. In reality, 30%-50% typically transfers to surviving brand lines.'
    ],
    trendTitle: 'SKU Pruning Simulation Scenarios',
    trendHeaders: ['Pruning Tier', 'SKUs Removed', 'Revenue Impact', 'Margin Impact', 'Safety Stock Freed'],
    trendRows: [
      ['Bottom 10% SKUs', '10', '-3.58%', '-3.46%', '+8.81% (Freed Capital)'],
      ['Bottom 20% SKUs', '20', '-9.00%', '-8.81%', '+22.31%'],
      ['Bottom 30% SKUs', '30', '-14.05%', '-13.82%', '+29.57%'],
      ['Full Rationalize', '35', '-27.08%', '0.00%', '+42.20%']
    ]
  },
  'Regional Margin Simulator': {
    title: 'Regional Margin Simulator',
    value: 'Simulated Gross Profit & Enterprise Impact',
    soWhat: 'Enables interactive gross margin simulation at the country level. Dragging any region\'s target margin adjusts that region\'s gross profit, showing the exact incremental savings and the aggregate enterprise portfolio margin impact.',
    action: 'Select a region showing low margin performance (such as Netherlands at 38.20% or Poland at 38.36%), and run pricing or assortment optimization scenarios to hit target corridors (e.g. Austria at 38.64%).',
    columns: [
      { name: 'marginPct', type: 'float [DIRECT]', desc: 'The baseline regional gross margin percentage.' },
      { name: 'netSalesM', type: 'float [DIRECT]', desc: 'Net sales in millions of dollars for the region.' },
      { name: 'simulatedMargin', type: 'float [USER]', desc: 'User-controlled target margin via the slider.' }
    ],
    formula: 'GP_{added} = S_{country} \\times (GM_{sim} - GM_{country\\_orig}) \\quad \\text{and} \\quad GM_{ent\\_sim} = \\frac{GP_{ent\\_orig} + GP_{added}}{S_{ent}}',
    formulaDescription: 'Calculates the incremental gross profit dollar amount from lifting the selected country\'s margin, and adds it to the baseline enterprise gross profit to compute the new simulated enterprise margin.',
    assumptions: [
      'Constant Revenue: Assumes that increasing the gross margin does not cause volume/revenue elasticity drops (i.e. no volume loss from pricing changes).',
      'COGS reductions: Assumes margin improvements are driven either by price increases or supplier purchase cost reductions.'
    ],
    trendTitle: 'Regional Margin Baselines & Volume',
    trendHeaders: ['Country', 'Net Sales ($M)', 'Gross Margin %', 'Complexity'],
    trendRows: [
      ['Italy', '$137.2M', '38.53%', 'High'],
      ['Spain', '$106.7M', '38.60%', 'High'],
      ['Germany', '$88.5M', '38.48%', 'High'],
      ['France', '$42.6M', '38.55%', 'Medium'],
      ['Austria', '$43.0M', '38.64%', 'Medium (Benchmark)'],
      ['Poland', '$42.4M', '38.36%', 'Medium'],
      ['Netherlands', '$12.5M', '38.20%', 'Opt (Lowest)']
    ]
  },
  'Profitability Tree Drilldown': {
    title: 'Profitability Tree Drilldown',
    value: 'Hierarchical Category → Brand → SKU',
    soWhat: 'Visualizes the portfolio\'s margin lineage. Enables category managers to trace exactly which brands and individual SKUs are driving or diluting category-level margins (e.g. Beverages sits at 38.45% margin but BrandD Water dilutes it down to 35.9%).',
    action: 'Audit individual SKU performance within categories. Target low-margin, high-complexity SKUs in the \'Rationalize\' quadrant for decommissioning to free up working capital.',
    columns: [
      { name: 'category', type: 'string [DIRECT]', desc: 'Product category grouping (Beverages, Dairy, Snacks, etc.).' },
      { name: 'brand', type: 'string [DERIVED]', desc: 'Product brand derived from SKU name.' },
      { name: 'sku_id', type: 'string [DIRECT]', desc: 'Unique identifier for each SKU.' },
      { name: 'net_sales', type: 'float [DIRECT]', desc: 'Revenue generated per transaction.' },
      { name: 'purchase_cost', type: 'float [DIRECT]', desc: 'COGS per unit.' }
    ],
    formula: 'GM_{node} = \\frac{\\sum_{i \\in \\text{node\\_skus}} (\\text{net\\_sales}_i - \\text{units\\_sold}_i \\times \\text{purchase\\_cost}_i)}{\\sum_{i \\in \\text{node\\_skus}} \\text{net\\_sales}_i}',
    formulaDescription: 'Node-level gross margin (Category, Brand, SKU) is computed by aggregating net sales and cost of goods sold for all child SKUs belonging to that node, and dividing gross profit by net sales.',
    assumptions: [
      'Product-level aggregation: Assumes cost of goods sold is directly proportional to units sold and unit purchase cost, omitting cross-category logistics discounts.'
    ],
    trendTitle: 'Category Performance Summary',
    trendHeaders: ['Category', 'Net Sales ($M)', 'Gross Margin %', 'Active SKUs'],
    trendRows: [
      ['Beverages', '$122.9M', '38.45%', '24 SKUs'],
      ['Snacks', '$118.6M', '38.53%', '24 SKUs'],
      ['Dairy', '$99.9M', '38.50%', '18 SKUs'],
      ['Personal Care', '$89.5M', '39.52%', '18 SKUs'],
      ['Home Care', '$42.1M', '37.15%', '18 SKUs']
    ]
  },
  'Promo Erosion vs. Dependency': {
    title: 'Promo Erosion vs. Dependency',
    value: 'Portfolio Scatter Analysis',
    soWhat: 'Highlights SKUs with high trade promotion dependency that suffer from severe margin erosion. High dependency (>20%) coupled with high erosion (>10.0 score) indicates that promotions are cannibalizing baseline margins rather than driving incremental sales.',
    action: 'Review the trade promotion calendar. Cap maximum discount depths at 15% for high-erosion items (e.g. BrandC Toothpaste and BrandD Water) to reclaim base margins.',
    columns: [
      { name: 'promo_flag', type: 'int [DIRECT]', desc: 'Direct flag indicating a transaction was part of a promotional campaign.' },
      { name: 'promo_depth', type: 'float [DIRECT]', desc: 'Percent discount applied during the promotion.' },
      { name: 'gross_margin', type: 'float [DIRECT]', desc: 'Resulting margin per promotional transaction compared to non-promo transactions.' }
    ],
    formula: '\\text{Promo Dependency} = \\frac{\\sum \\text{Sales}_{promo}}{\\sum \\text{Sales}_{total}} \\quad \\text{and} \\quad \\text{Margin Erosion} = \\text{Margin}_{non\\text{-}promo} - \\text{Margin}_{promo}',
    formulaDescription: 'Promo Dependency is the ratio of promotional sales to total sales. Margin Erosion measures the difference in gross margin percentage between non-promional and promotional periods.',
    assumptions: [
      'Incremental volume limits: Assumes promotion-driven volume lift does not offset the margin rate erosion unless a specific elasticity threshold is met.'
    ],
    trendTitle: 'Highest Promo-Eroded SKUs',
    trendHeaders: ['SKU Name', 'Promo Dep. %', 'Erosion Score', 'Net Sales ($M)'],
    trendRows: [
      ['BrandC Toothpaste', '27.59%', '15.49', '$12.97M'],
      ['BrandD Water', '27.97%', '14.10', '$3.10M'],
      ['BrandE Juice', '27.62%', '14.20', '$1.65M'],
      ['BrandA Chocolate', '24.70%', '13.80', '$1.80M'],
      ['BrandA Softener', '23.10%', '13.50', '$1.40M']
    ]
  },
  'Overall Readiness %': {
    title: 'Overall Readiness %',
    value: '82%',
    soWhat: 'Overall category launch readiness stands at 82% (or 79% under delays), dragged down by supplier bottlenecks in Household and Dairy labels.',
    action: 'Escalate lead-time reviews with regional supplier partners and clear the Q4 launch pipeline backlog.',
    columns: [
      { name: 'gate_progress', type: 'float [DERIVED]', desc: 'Completed milestones / total milestones for the product release.' },
      { name: 'readiness_score', type: 'float [DERIVED]', desc: 'Dimension-specific readiness score (Market, Supply Chain, Operations).' }
    ],
    formula: 'R_{\\text{avg}} = \\frac{1}{M} \\sum_{i=1}^{M} \\text{readiness\\_score}_i',
    formulaDescription: 'Calculates the arithmetic average of readiness scores across all active launches in the pipeline.',
    assumptions: [
      'Equal gate weights: Assumes conceptual, supply chain, and retail operations gates have identical impact on overall launch stability.'
    ],
    trendTitle: 'Readiness Score by Launch Dimension',
    trendHeaders: ['Launch Dimension', 'Avg Readiness %', 'Status', 'Risk Factor'],
    trendRows: [
      ['Market Demand', '87%', 'On Track', 'Low'],
      ['Supply Chain', '74%', 'At Risk', 'High (Lead times)'],
      ['Channel Allocation', '82%', 'On Track', 'Medium'],
      ['Pricing Architecture', '85%', 'On Track', 'Low'],
      ['Operations Validation', '82%', 'On Track', 'Medium']
    ]
  },
  'Net Profit': {
    title: 'Net Profit',
    value: '₹95.2 Cr',
    soWhat: 'Net profitability reaches ₹95.2 Cr, driven by strong growth in core beverages, but impacted by rising raw milk COGS in Dairy.',
    action: 'Re-negotiate milk procurement contracts and increase high-margin snack items distribution focus.',
    columns: [
      { name: 'gross_revenue', type: 'float [DIRECT]', desc: 'Gross sales revenue generated.' },
      { name: 'cogs', type: 'float [DIRECT]', desc: 'Cost of goods sold from raw materials and production.' },
      { name: 'opex', type: 'float [DIRECT]', desc: 'Operating expenses, including logistics, marketing, and administration.' }
    ],
    formula: 'NP = R_{\\text{gross}} - \\text{COGS} - \\text{OPEX} - \\text{Tax}',
    formulaDescription: 'Net Profit is derived by subtracting Cost of Goods Sold, Operating Expenses, and Taxes from gross revenue.',
    assumptions: [
      'Excludes dynamic capital adjustments: Standardized tax and interest expense factors are assumed for reporting periods.'
    ],
    trendTitle: 'Net Profit and Volatility by Category',
    trendHeaders: ['Category', 'Revenue Contribution', 'Net Margin %', 'Volatility'],
    trendRows: [
      ['Beverages', '₹280 Cr', '14.2%', 'Low'],
      ['Snacks', '₹260 Cr', '11.8%', 'Medium'],
      ['Dairy', '₹180 Cr', '8.5%', 'High'],
      ['Personal Care', '₹131 Cr', '12.1%', 'Medium']
    ]
  },
  'Gross Margin %': {
    title: 'Gross Margin %',
    value: '36.2%',
    soWhat: 'Average segment gross margin is 36.2%, compressed by deep promotional discounts on cookies and chips.',
    action: 'Cap promotional discount depths at 15% and enforce margin pricing corridors.',
    columns: [
      { name: 'revenue', type: 'float [DIRECT]', desc: 'Net sales revenue.' },
      { name: 'cogs', type: 'float [DIRECT]', desc: 'Cost of goods sold from supplier inventory.' }
    ],
    formula: 'GM\\% = \\frac{R - \\text{COGS}}{R} \\times 100',
    formulaDescription: 'Calculates the percentage of revenue remaining after covering the direct costs of goods sold.',
    assumptions: [
      'Inventory Valuation: Assumes FIFO inventory pricing methods are uniform across all regions.'
    ],
    trendTitle: 'Gross Margin Performance by Region',
    trendHeaders: ['Country', 'Gross Margin %', 'YoY Change', 'Target'],
    trendRows: [
      ['Italy', '38.53%', '+0.2pp', '40.0%'],
      ['Spain', '38.60%', '+0.4pp', '40.0%'],
      ['Germany', '38.48%', '-0.1pp', '40.0%'],
      ['France', '38.55%', '+0.1pp', '40.0%']
    ]
  },
  'Revenue Growth %': {
    title: 'Revenue Growth %',
    value: '+8.4%',
    soWhat: 'YoY growth is +8.4%, led by beverages (+18.4% demand change in APAC) while Household sales declined by 4%.',
    action: 'Reallocate marketing budget from declining Household cleaners to high-growth beverages.',
    columns: [
      { name: 'sales_current', type: 'float [DIRECT]', desc: 'Net sales in the current reporting period.' },
      { name: 'sales_prior', type: 'float [DIRECT]', desc: 'Net sales in the corresponding prior period.' }
    ],
    formula: 'RG\\% = \\frac{S_{\\text{current}} - S_{\\text{prior}}}{S_{\\text{prior}}} \\times 100',
    formulaDescription: 'Measures the percentage change in net sales revenue compared to the prior baseline period.',
    assumptions: [
      'Exchange Rate Stability: Constant currency rates are used to normalize growth metrics across international regions.'
    ],
    trendTitle: 'Revenue Growth by Regional Market',
    trendHeaders: ['Region', 'Current Sales', 'Prior Sales', 'Growth Rate'],
    trendRows: [
      ['APAC', '₹312 Cr', '₹290 Cr', '+7.6%'],
      ['EMEA', '₹311 Cr', '₹305 Cr', '+2.0%'],
      ['Americas', '₹228 Cr', '₹240 Cr', '-5.0%']
    ]
  },
  'Launch ROI': {
    title: 'Launch ROI',
    value: '1.85x',
    soWhat: 'Expected launch return stands at 1.85x ROI, buoyed by the upcoming premium Mango Fizz 750ml rollout.',
    action: 'Approve the ₹4.2 Cr launch budget and run early cross-promotions with snacks.',
    columns: [
      { name: 'projected_revenue', type: 'float [DIRECT]', desc: 'Projected first-year sales revenue.' },
      { name: 'launch_budget', type: 'float [DIRECT]', desc: 'Total initial marketing and logistics launch budget.' }
    ],
    formula: 'ROI = \\frac{R_{\\text{projected}}}{\\text{Cost}_{\\text{launch}}}',
    formulaDescription: 'Dividing the projected first-year sales revenue by the dedicated initial launch budget.',
    assumptions: [
      'Marketing efficiency: Assumes target retailer shelf placements are secured within 30 days of release.'
    ],
    trendTitle: 'Expected ROI for Active Launches',
    trendHeaders: ['Launch Concept', 'Projected Revenue', 'Budget Allocated', 'Expected ROI'],
    trendRows: [
      ['BrandA Premium Energy', '₹24.5 Cr', '₹12.0 Cr', '2.04x'],
      ['BrandD Organic Yogurt', '₹18.2 Cr', '₹10.5 Cr', '1.73x'],
      ['Mango Fizz 750ml Launch', '₹8.4 Cr', '₹4.2 Cr', '2.00x']
    ]
  },
  'Portfolio SKUs': {
    title: 'Portfolio SKUs',
    value: '127',
    soWhat: 'Portfolio contains 127 total active SKUs, recently optimized by sun-setting 3 low-value tail products.',
    action: 'Maintain category assortments and monitor baseline volume transfer to core hero SKUs.',
    columns: [
      { name: 'sku_id', type: 'string [DIRECT]', desc: 'Unique database identifier for each active stock-keeping unit.' },
      { name: 'status', type: 'string [DIRECT]', desc: 'Flag indicating if the SKU is active, pending, or discontinued.' }
    ],
    formula: 'N_{\\text{SKUs}} = \\text{Count}(\\text{sku\\_id}) \\quad \\text{where status} = \\text{\'active\'}',
    formulaDescription: 'Sum of all unique product configurations marked as active in the master data ledger.',
    assumptions: [
      'Excludes temporary items: Promotional bundles and seasonal packs are omitted from the active baseline count.'
    ],
    trendTitle: 'SKU Count and Active Categories',
    trendHeaders: ['Category', 'SKU Count', 'Active Brands', 'Share of Catalog'],
    trendRows: [
      ['Beverages', '32', '6 Brands', '25.2%'],
      ['Snacks', '30', '5 Brands', '23.6%'],
      ['Dairy', '22', '4 Brands', '17.3%'],
      ['Personal Care', '22', '4 Brands', '17.3%'],
      ['Household', '21', '4 Brands', '16.5%']
    ]
  },
  'Sunset Candidates': {
    title: 'Sunset Candidates',
    value: '6',
    soWhat: 'AI has identified 6 critical sunset candidates (like Fabric Softener, Floor Cleaner, and Aloe Face Wash) that drive margin leakage.',
    action: 'Execute phase-out for the bottom 3 performers immediately to reclaim supplier administrative capacity.',
    columns: [
      { name: 'val', type: 'float [DERIVED]', desc: 'Normalized commercial value score based on sales, growth, and margins.' },
      { name: 'cx', type: 'float [DERIVED]', desc: 'Normalized operational complexity index.' }
    ],
    formula: 'N_{\\text{sunset}} = \\text{Count}(\\text{SKUs}) \\quad \\text{where } val < 0.4 \\text{ and } cx \\ge 0.6',
    formulaDescription: 'Counts the volume of SKUs meeting the AI threshold for poor performance (low commercial value and high operational complexity).',
    assumptions: [
      'Substitution efficiency: Assumes consumer demand can be successfully redirected to primary hero SKUs.'
    ],
    trendTitle: 'Identified Sunset Candidate Variants',
    trendHeaders: ['Sunset SKU', 'Category', 'Commercial Value', 'Complexity Index', 'Net Sales'],
    trendRows: [
      ['Fabric Softener', 'Household', '0.22', '0.81', '₹28 Cr'],
      ['Floor Cleaner', 'Household', '0.29', '0.74', '₹38 Cr'],
      ['Aloe Face Wash', 'Personal Care', '0.28', '0.78', '₹32 Cr'],
      ['BrandB Yogurt 1kg', 'Dairy', '0.35', '0.68', '₹42 Cr'],
      ['BrandE Yogurt (Straw)', 'Dairy', '0.29', '0.72', '₹35 Cr'],
      ['Choco Wafers', 'Snacks', '0.34', '0.71', '₹44 Cr']
    ]
  },
  'Revenue at Risk': {
    title: 'Revenue at Risk',
    value: '₹148 Cr',
    soWhat: 'Total revenue exposure is ₹148 Cr if all 6 sunset candidates are pruned simultaneously without substitution transfer.',
    action: 'Enforce product replacement recommendations (e.g. redirecting demand to hero Mango Fizz or Soap variants).',
    columns: [
      { name: 'revenue', type: 'float [DIRECT]', desc: 'Direct annual revenue contribution of the sunset candidate SKU.' }
    ],
    formula: 'R_{\\text{risk}} = \\sum_{i \\in \\text{Sunset}} \\text{revenue}_i',
    formulaDescription: 'Sum of net sales revenue for all 6 active SKUs currently flagged in the sunset recommendations quadrant.',
    assumptions: [
      'Zero Substitution Worst Case: Assumes zero volume transfer to substitute items to establish the baseline maximum financial exposure.'
    ],
    trendTitle: 'Sunset Candidate Revenue Exposure',
    trendHeaders: ['Sunset SKU', 'Category', 'Annual Sales', 'Volume Share'],
    trendRows: [
      ['Choco Wafers', 'Snacks', '₹44 Cr', '29.7%'],
      ['BrandB Yogurt 1kg', 'Dairy', '₹42 Cr', '28.4%'],
      ['Floor Cleaner', 'Household', '₹38 Cr', '25.7%'],
      ['BrandE Yogurt (Straw)', 'Dairy', '₹35 Cr', '23.6%'],
      ['Aloe Face Wash', 'Personal Care', '₹32 Cr', '21.6%'],
      ['Fabric Softener', 'Household', '₹28 Cr', '18.9%']
    ]
  },
  'Avg Complexity': {
    title: 'Avg Complexity',
    value: '0.48',
    soWhat: 'Catalog complexity average is 0.48, exceeding the corporate ceiling of 0.40 due to vendor fragmentation.',
    action: 'Consolidate logistics by routing tail-end variants to distributor-held fulfillment models.',
    columns: [
      { name: 'complexity_score', type: 'float [DERIVED]', desc: 'SKU-level normalized operational complexity score.' }
    ],
    formula: 'C_{\\text{avg}} = \\frac{1}{N} \\sum_{i=1}^{N} \\text{complexity\\_score}_i',
    formulaDescription: 'The arithmetic average of the normalized complexity indices across all active items in the portfolio.',
    assumptions: [
      'Weights are equivalent: Sourcing fragmentation and stockout frequency carry equal weights in the underlying sub-indexes.'
    ],
    trendTitle: 'Catalog Complexity Volatility by Category',
    trendHeaders: ['Category', 'SKU Count', 'Avg Complexity', 'Status'],
    trendRows: [
      ['Household', '21', '0.51', 'Critical'],
      ['Dairy', '22', '0.49', 'Elevated'],
      ['Personal Care', '22', '0.48', 'Elevated'],
      ['Beverages', '32', '0.45', 'Stable'],
      ['Snacks', '30', '0.44', 'Stable']
    ]
  },
  'Total Active Signals': {
    title: 'Total Active Signals',
    value: '6',
    soWhat: 'A total of 6 critical operational signals are active, led by NPS drops in EMEA and cannibalization alerts in India.',
    action: 'Review signals queue and triage urgent tickets to respective category managers.',
    columns: [
      { name: 'signal_id', type: 'string [DIRECT]', desc: 'Primary key used to track individual operational alerts.' },
      { name: 'status', type: 'string [DIRECT]', desc: 'Flag marking the alert as active or archived.' }
    ],
    formula: 'S_{\\text{active}} = \\text{Count}(\\text{signal\\_id}) \\quad \\text{where status} = \\text{\'active\'}',
    formulaDescription: 'Counts the sum of all active, unresolved alerts and notifications logged in the signals board.',
    assumptions: [
      'Archived filter: Assumes signals marked as acknowledged or archived do not count towards the active executive list.'
    ],
    trendTitle: 'Active Signals by Category',
    trendHeaders: ['Alert Domain', 'Active Alerts', 'Max Severity', 'Action Required'],
    trendRows: [
      ['Supply Sourcing', '2 Alerts', 'Critical', 'Triage logistics lead times'],
      ['Margin Dilution', '2 Alerts', 'Critical', 'Review promo discount depth'],
      ['Demand Changes', '1 Alert', 'Warning', 'Adjust channel stock buffers'],
      ['Cannibalization', '1 Alert', 'Warning', 'Audit category overlaps']
    ]
  },
  'Competitor Alerts': {
    title: 'Competitor Alerts',
    value: '2',
    soWhat: 'Active competitor alerts indicate aggressive pricing cuts on snacks and soap lines in regional supermarkets.',
    action: 'Monitor daily discount tracking and stabilize baseline retail price corridors.',
    columns: [
      { name: 'alert_id', type: 'string [DIRECT]', desc: 'Unique key identifying competitive pricing campaign alerts.' },
      { name: 'type', type: 'string [DIRECT]', desc: 'Categorizes the competitive activity (Price cut, promo, new launch).' }
    ],
    formula: 'C_{\\text{alerts}} = \\text{Count}(\\text{alert\\_id}) \\quad \\text{where type} = \\text{\'Competitor\'}',
    formulaDescription: 'Sum of competitor-related alerts logged by regional market scraping algorithms.',
    assumptions: [
      'Accuracy: Assumes scraped competitor prices reflect actual shelf execution rather than digital-only discounts.'
    ],
    trendTitle: 'Competitor Campaign Incidents',
    trendHeaders: ['Category Segment', 'Alert Type', 'Market Impact', 'Competitor Brand'],
    trendRows: [
      ['Snacks (Biscuits)', 'Aggressive Promo', 'High margin risk', 'Supermarket private labels'],
      ['Personal Care (Soap)', 'Direct Price Cut', 'Medium volume risk', 'Traditional market leader']
    ]
  },
  'Market Demand Change': {
    title: 'Market Demand Change',
    value: '+18.4%',
    soWhat: 'Market demand is up +18.4% overall, heavily driven by carbonated and natural beverages in APAC.',
    action: 'Establish dedicated priority freight corridors to prevent stockouts in high-demand zones.',
    columns: [
      { name: 'demand_index', type: 'float [DIRECT]', desc: 'Normal consumer purchasing index generated from transactions.' }
    ],
    formula: 'D_{\\text{change}}\\% = \\frac{I_{\\text{current}} - I_{\\text{prior}}}{I_{\\text{prior}}} \\times 100',
    formulaDescription: 'Measures the YoY change in the aggregate consumer purchase velocity and demand index.',
    assumptions: [
      'Baseline: Ignores seasonal spikes (e.g. festival demand) by conducting year-over-year same-period comparisons.'
    ],
    trendTitle: 'Demand Shift by Category & Region',
    trendHeaders: ['Region', 'Category Segment', 'YoY Shift %', 'Inventory Priority'],
    trendRows: [
      ['APAC', 'Beverages', '+18.4%', 'Highest priority'],
      ['EMEA', 'Snacks', '+4.2%', 'Moderate priority'],
      ['Americas', 'Personal Care', '-2.1%', 'Reallocate volume']
    ]
  },
  'Customer Sentiment Score': {
    title: 'Customer Sentiment Score',
    value: '72',
    soWhat: 'Customer Net Promoter Score is stable at 72, though EMEA snacks saw a 3-point dip due to recent logistics delays.',
    action: 'Implement local customer feedback loops and optimize warehouse dispatch times in Europe.',
    columns: [
      { name: 'nps_response', type: 'int [DIRECT]', desc: 'NPS survey rating scale 0 to 10.' }
    ],
    formula: 'NPS = \\% \\text{Promoters} - \\% \\text{Detractors}',
    formulaDescription: 'Calculated by subtracting the percentage of Detractors (0-6 ratings) from the percentage of Promoters (9-10 ratings).',
    assumptions: [
      'Sample size: Assumes survey distributions are statistically representative of regional buyer volumes.'
    ],
    trendTitle: 'Customer Sentiment Net Promoter Index',
    trendHeaders: ['Product Segment', 'NPS Index', 'YoY Trend', 'Status'],
    trendRows: [
      ['Beverages', '76 NPS', '+2 YoY', 'Strong'],
      ['Snacks', '70 NPS', '-3 YoY', 'Stable (Logistics drag)'],
      ['Personal Care', '73 NPS', 'Flat YoY', 'Strong'],
      ['Dairy', '69 NPS', '+1 YoY', 'Stable']
    ]
  }
};

export const AuditDrawer: React.FC<AuditDrawerProps> = ({ activeMetric, close }) => {
  const content = activeMetric ? AUDIT_DATA[activeMetric] : null;
  const [activeSection, setActiveSection] = useState<'action' | 'sowhat' | 'lineage' | 'formula' | 'trends' | 'decisions'>('action');

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  // Reset active tab to 'action' on metric change
  useEffect(() => {
    if (activeMetric) {
      setActiveSection('action');
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          {/* Drawer container */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white dark:bg-acies-gray border-l border-black/10 dark:border-white/10 z-[110] overflow-y-auto flex flex-col shadow-2xl"
          >
            {/* Header (with sticky wrapper) */}
            <div className="border-b border-black/5 dark:border-white/5 bg-acies-offwhite dark:bg-white/5 sticky top-0 z-10">
              <div className="flex justify-between items-center px-8 py-5">
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-acies-yellow mb-0.5">Methodology & Lineage Audit</p>
                  <h3 className="text-lg font-display text-acies-gray dark:text-white leading-tight">{content.title}</h3>
                </div>
                <button 
                  onClick={close} 
                  className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-acies-gray dark:text-white/60 cursor-pointer"
                  aria-label="Close Audit Drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="px-8 pb-3 flex gap-2 overflow-x-auto border-t border-black/5 dark:border-white/5 pt-3 scrollbar-none">
                {[
                  { id: 'action', label: 'Action Plan', icon: CheckCircle },
                  { id: 'sowhat', label: 'So What?', icon: AlertTriangle },
                  { id: 'lineage', label: 'Lineage', icon: Database },
                  { id: 'formula', label: 'Formula', icon: BookOpen },
                  { id: 'trends', label: 'Trends', icon: TrendingUp },
                  { id: 'decisions', label: 'Decisions', icon: HelpCircle }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeSection === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id as any)}
                      className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all border rounded-none shrink-0 cursor-pointer ${
                        isActive
                           ? 'bg-acies-yellow text-acies-gray border-acies-yellow font-bold'
                           : 'bg-transparent text-acies-gray dark:text-white opacity-60 hover:opacity-100 border-black/10 dark:border-white/10'
                      }`}
                    >
                      <Icon size={10} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-8 space-y-6">
              
              {activeSection === 'action' && (
                <div className="bg-acies-offwhite dark:bg-white/5 p-6 border-l-4 border-green-500 space-y-4">
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 text-acies-gray dark:text-white">Reported Metric Value</span>
                    <span className="text-2xl font-display text-acies-yellow">{content.value}</span>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-bold text-green-500 uppercase flex items-center gap-1">
                      <CheckCircle size={10} />
                      Recommended Action
                    </h4>
                    <p className="text-xs text-acies-gray dark:text-white/80 leading-relaxed mt-1.5 font-medium">{content.action}</p>
                  </div>
                </div>
              )}

              {activeSection === 'sowhat' && (
                <div className="bg-acies-offwhite dark:bg-white/5 p-6 border-l-4 border-red-500 space-y-4">
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 text-acies-gray dark:text-white">Reported Metric Value</span>
                    <span className="text-2xl font-display text-acies-yellow">{content.value}</span>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-bold text-red-500 uppercase flex items-center gap-1">
                      <AlertTriangle size={10} />
                      So What? (Business Implication)
                    </h4>
                    <p className="text-xs text-acies-gray dark:text-white/80 leading-relaxed mt-1.5">{content.soWhat}</p>
                  </div>
                </div>
              )}

              {activeSection === 'lineage' && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-acies-gray dark:text-white">
                    <Database size={14} className="text-acies-yellow" />
                    <h4 className="text-[10px] font-bold uppercase tracking-wider">Source Data Lineage</h4>
                  </div>
                  <p className="text-xs opacity-60 leading-relaxed text-acies-gray dark:text-white">
                    Raw fields utilized from <code className="font-mono text-[10px] bg-black/5 dark:bg-white/5 px-1 py-0.5">FMCG Multi-Country Sales Dataset</code>.
                  </p>
                  <div className="border border-black/5 dark:border-white/5 rounded-sm divide-y divide-black/5 dark:divide-white/5 overflow-hidden">
                    {content.columns.map((col, idx) => (
                      <div key={idx} className="p-4 bg-acies-offwhite/30 dark:bg-white/2">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-mono text-xs text-acies-yellow font-bold">{col.name}</span>
                          <span className="text-[8px] opacity-40 uppercase font-bold tracking-wider text-acies-gray dark:text-white">{col.type}</span>
                        </div>
                        <p className="text-[10px] opacity-60 leading-normal text-acies-gray dark:text-white">{col.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === 'formula' && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-acies-gray dark:text-white">
                    <BookOpen size={14} className="text-acies-yellow" />
                    <h4 className="text-[10px] font-bold uppercase tracking-wider">Mathematical Formula</h4>
                  </div>
                  <div className="bg-black/5 dark:bg-white/5 p-5 rounded-sm flex items-center justify-center border border-black/5 dark:border-white/5">
                    <code className="font-mono text-xs md:text-sm font-bold text-acies-gray dark:text-white text-center select-all">
                      {content.formula}
                    </code>
                  </div>
                  <p className="text-[10px] opacity-60 leading-relaxed italic text-acies-gray dark:text-white">
                    {content.formulaDescription}
                  </p>
                </section>
              )}

              {activeSection === 'trends' && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-acies-gray dark:text-white">
                    <TrendingUp size={14} className="text-acies-yellow" />
                    <h4 className="text-[10px] font-bold uppercase tracking-wider">{content.trendTitle}</h4>
                  </div>
                  <div className="overflow-x-auto border border-black/5 dark:border-white/5 rounded-sm">
                    <table className="w-full text-left text-[10px] border-collapse">
                      <thead>
                        <tr className="bg-acies-offwhite dark:bg-white/5 border-b border-black/5 dark:border-white/5 font-bold uppercase tracking-wider text-acies-gray dark:text-white">
                          {content.trendHeaders.map((header, idx) => (
                            <th key={idx} className="p-3">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono text-acies-gray dark:text-white">
                        {content.trendRows.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                            {row.map((cell, cellIdx) => (
                              <td key={cellIdx} className={`p-3 ${cellIdx === 0 ? 'font-body font-medium' : ''}`}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeSection === 'decisions' && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-acies-gray dark:text-white">
                    <HelpCircle size={14} className="text-acies-yellow" />
                    <h4 className="text-[10px] font-bold uppercase tracking-wider">Key Executive Decisions & Assumptions</h4>
                  </div>
                  <ul className="space-y-2 pl-4 list-disc text-xs opacity-70 leading-relaxed text-acies-gray dark:text-white">
                    {content.assumptions.map((item, idx) => (
                      <li key={idx} className="marker:text-acies-yellow">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-black/5 dark:border-white/5 bg-acies-offwhite dark:bg-white/5 text-center text-[8px] opacity-40 uppercase font-bold tracking-widest text-acies-gray dark:text-white">
              Acies Virtual Labs • Verifiable Data Trace
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
