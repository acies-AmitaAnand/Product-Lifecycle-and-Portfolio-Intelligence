export interface AuditContent {
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

export const AUDIT_DATA: Record<string, AuditContent> = {
  'Shelf Productivity': {
    title: 'Shelf Productivity',
    value: '53.6',
    soWhat: 'Average Shelf Productivity is 53.6/100, which is below the desired retailer win-win health threshold of 55. This is driven by high stockout rates on core volumetric items (e.g. BrandC Biscuits with 440 stockout events).',
    action: 'Launch Joint Business Planning: Collaborate with retailers to establish shared stockout thresholds and optimize shelf placements for high-IPPV SKUs.',
    columns: [
      { name: 'val', type: 'float [DIRECT]', desc: 'Normalized commercial value score based on sales share.' },
      { name: 'stockouts', type: 'int [DIRECT]', desc: 'Number of stockout events recorded for the SKU.' }
    ],
    formula: '\\text{Shelf Productivity} = \\text{Commercial Value} \\times (1 - \\text{Stockout Rate}) \\times 100',
    formulaDescription: 'Shelf Productivity combines a SKU\'s commercial value score with its shelf availability. A high stockout frequency directly penalizes the score.',
    assumptions: [
      'Stockout Rate scaling: Stockout rate is modeled as Stockouts divided by 8, capped at 1.0.'
    ],
    trendTitle: 'Shelf Productivity by Category',
    trendHeaders: ['Category', 'Average Shelf Score', 'Stockout Events', 'Status'],
    trendRows: [
      ['Beverages', '65.2', '12 events', 'Healthy'],
      ['Snacks', '52.4', '15 events', 'Below Threshold'],
      ['Dairy', '49.8', '19 events', 'Below Threshold'],
      ['Personal Care', '58.0', '11 events', 'Healthy'],
      ['Household', '43.2', '25 events', 'Critical']
    ]
  },
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
    formulaDescription: 'Total Net Sales is the total revenue generated from all product sales across our entire portfolio.',
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
    formulaDescription: 'Revenue Concentration measures what percentage of our total sales comes from our top-selling products.',
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
      ['SKU Proliferation Index', '1.0000', '0.8500', 'High (100 SKUs active)'],
      ['Low Velocity SKU Concentration', '0.6800', '0.4000', 'High (68% of catalog)'],
      ['Lead Time Instability (CV)', '0.2014', '0.1500', 'Elevated (Volatility in delivery)'],
      ['Promo Dependency Score', '0.1100', '0.0800', 'Elevated (Promo-driven sales)'],
      ['Avg Portfolio Volatility (CV)', '0.1071', '0.0800', 'Stable (Low organic variance)']
    ]
  },
  'Long-Tail SKU Burden': {
    title: 'Long-Tail SKU Burden',
    value: '68%',
    soWhat: '68 items (68% of catalog) generate <1% of revenue each, yet they interact with all 60 suppliers, creating massive administrative overhead without business value.',
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
    formulaDescription: 'Rationalize Candidates are products that generate low sales and margin, but cause high complexity and stockouts, making them ideal to remove or replace.',
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
  'Gross margin %': {
    title: 'Gross margin %',
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
  'Gross Profit': {
    title: 'Gross Profit',
    value: '₹308.1 Cr',
    soWhat: 'Gross profit contribution stands at ₹308.1 Cr (36.2% of sales), driven by Beverages and Snacks categories, but restricted by packaging material inflation in Personal Care.',
    action: 'Optimize raw material procurement contracts and consolidate vendor logistics to reduce COGS.',
    columns: [
      { name: 'net_sales', type: 'float [DIRECT]', desc: 'Primary sales revenue generated.' },
      { name: 'purchase_cost / COGS', type: 'float [DIRECT]', desc: 'Cost of goods sold including supplier production and packaging costs.' }
    ],
    formula: '\\text{Gross Profit} = \\sum (\\text{net\\_sales} - \\text{cogs})',
    formulaDescription: 'Gross profit is calculated by subtracting the total cost of goods sold (COGS) from total net sales revenue.',
    assumptions: [
      'Inventory cost matching: Supplier base pricing is evaluated using current period inventory receipts.',
      'Logistics exclusions: Operational costs like transport and storage are categorized under OPEX and excluded from Gross Profit.'
    ],
    trendTitle: 'Gross Profit by Category',
    trendHeaders: ['Category', 'Revenue Contribution', 'Gross Margin %', 'Gross Profit'],
    trendRows: [
      ['Beverages', '₹280 Cr', '38.45%', '₹107.7 Cr'],
      ['Snacks', '₹260 Cr', '38.53%', '₹100.2 Cr'],
      ['Dairy', '₹180 Cr', '38.50%', '₹69.3 Cr'],
      ['Personal Care', '₹131 Cr', '39.52%', '₹51.8 Cr']
    ]
  },
  'Revenue MTD': {
    title: 'Total Revenue',
    value: '₹851.2 Cr',
    soWhat: 'MTD revenue reaches ₹851.2 Cr, showing +8.4% growth compared to last month. Beverages continue to dominate, contributing 37.1% of total sales.',
    action: 'Reallocate logistics priority to high-demand beverage SKUs in APAC and EMEA to sustain volume.',
    columns: [
      { name: 'net_sales', type: 'float [DIRECT]', desc: 'Revenue per transaction row (units sold × price).' },
      { name: 'date', type: 'date [DIRECT]', desc: 'Transaction timestamp to filter for the current month-to-date.' }
    ],
    formula: 'R_{\\text{MTD}} = \\sum_{i=1}^{M} \\text{net\\_sales}_i',
    formulaDescription: 'Total Revenue is the total money earned from all product sales during the current month up to the current date.',
    assumptions: [
      'Current month alignment: Data is filtered dynamically to compare the current elapsed days of the month against the prior month same period.'
    ],
    trendTitle: 'MTD Revenue by Region',
    trendHeaders: ['Region', 'MTD Revenue', 'Growth MoM', 'Target'],
    trendRows: [
      ['APAC', '₹312 Cr', '+7.6%', '₹330 Cr'],
      ['EMEA', '₹311 Cr', '+2.0%', '₹320 Cr'],
      ['Americas', '₹228.2 Cr', '-5.0%', '₹250 Cr']
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
    title: 'Active SKUs',
    value: '127',
    soWhat: 'Portfolio contains 127 total active SKUs, recently optimized by sun-setting 3 low-value tail products.',
    action: 'Maintain category assortments and monitor baseline volume transfer to core hero SKUs.',
    columns: [
      { name: 'sku_id', type: 'string [DIRECT]', desc: 'Unique database identifier for each active stock-keeping unit.' },
      { name: 'status', type: 'string [DIRECT]', desc: 'Flag indicating if the SKU is active, pending, or discontinued.' }
    ],
    formula: 'N_{\\text{SKUs}} = \\text{Count}(\\text{sku\\_id}) \\quad \\text{where status} = \\text{\'active\'}',
    formulaDescription: 'Active SKUs is the total count of unique product items that are currently active and available for sale in our catalog.',
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
      'Weights are equivalent: Sourcing fragmentation and stockout frequency carry equal weights in the underlying sub-indices.'
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
    title: 'Critical Alerts',
    value: '6',
    soWhat: 'A total of 6 critical operational signals are active, led by NPS drops in EMEA and cannibalization alerts in India.',
    action: 'Review signals queue and triage urgent tickets to respective category managers.',
    columns: [
      { name: 'signal_id', type: 'string [DIRECT]', desc: 'Primary key used to track individual operational alerts.' },
      { name: 'status', type: 'string [DIRECT]', desc: 'Flag marking the alert as active or archived.' }
    ],
    formula: 'S_{\\text{active}} = \\text{Count}(\\text{signal\\_id}) \\quad \\text{where status} = \\text{\'active\'}',
    formulaDescription: 'Critical Alerts is the total number of urgent unresolved issues (like supply stockouts or margin drops) that need immediate action.',
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
  },
  'Portfolio Revenue': {
    title: 'Portfolio Revenue',
    value: '₹851.4 Cr',
    soWhat: 'Month-to-date total portfolio revenue is ₹851.4 Cr, tracking slightly behind the target of ₹900 Cr. Top-line velocity remains heavily supported by the Beverages segment (37.1%), while minor supply chain bottlenecks in Personal Care introduce slight margin exposure.',
    action: 'Accelerate high-growth SKU allocations in APAC/EMEA hubs and run price-elasticity models for key volumetric drivers.',
    columns: [
      { name: 'net_sales', type: 'float [DIRECT]', desc: 'Revenue per transaction row (units sold × price after discounts).' },
      { name: 'promo_discounts', type: 'float [DIRECT]', desc: 'Promotional markdown deductions per product line.' }
    ],
    formula: 'R_{portfolio} = \\sum_{i=1}^{M} S_i',
    formulaDescription: 'Portfolio Revenue is the total sales revenue generated across all products in our catalog during the current month.',
    assumptions: [
      'Target baseline: The target of ₹900 Cr is set based on historical seasonal runs and Q2 category forecasts.',
      'Active items: Includes all revenue-generating SKUs across all regions (APAC, EMEA, Americas).'
    ],
    trendTitle: 'Portfolio Revenue Performance vs. Target',
    trendHeaders: ['Month', 'Actual Revenue', 'Growth MoM', 'Target'],
    trendRows: [
      ['Jan', '₹780 Cr', '+5.2%', '₹800 Cr'],
      ['Feb', '₹795 Cr', '+1.9%', '₹812 Cr'],
      ['Mar', '₹808 Cr', '+1.6%', '₹824 Cr'],
      ['Apr', '₹821 Cr', '+1.6%', '₹836 Cr'],
      ['May', '₹833 Cr', '+1.5%', '₹848 Cr'],
      ['Jun', '₹843 Cr', '+1.2%', '₹860 Cr'],
      ['Jul MTD', '₹851.4 Cr', '+1.0%', '₹900 Cr']
    ]
  },
  'Portfolio SKU Count': {
    title: 'Portfolio SKU Count',
    value: '100',
    soWhat: 'The active SKU count stands at 100 items, which matches the target catalog size of 100. Over-proliferation of low-volume variants drives up supply chain friction, raising average inventory carrying costs and straining manufacturing shift schedules.',
    action: 'Phase out the 35 identified "Rationalize" candidates in low-margin, high-complexity segments (such as Floor Cleaner) to optimize catalog efficiency.',
    columns: [
      { name: 'sku_id', type: 'string [DIRECT]', desc: 'Unique SKU identifier in the product master database.' },
      { name: 'is_active', type: 'boolean [DIRECT]', desc: 'State flag indicating if the product is actively listed for trade.' }
    ],
    formula: 'N_{SKU} = \\sum_{j=1}^{K} [SKU_j \\text{ is Active}]',
    formulaDescription: 'Total SKU Count is the count of all active unique products in our catalog.',
    assumptions: [
      'Active status: Assumes SKUs with zero sales MTD but marked active in ERP are counted.',
      'Excludes sunsetted listings: SKUs flagged as rationalized and officially phased out are excluded.'
    ],
    trendTitle: 'SKU Catalog Volume by Category',
    trendHeaders: ['Category', 'Active SKUs', 'Rationalized MTD', 'Target'],
    trendRows: [
      ['Beverages', '32', '-1 SKU', '30'],
      ['Snacks', '28', '-1 SKU', '25'],
      ['Personal Care', '25', '-1 SKU', '25'],
      ['Household', '17', '0 SKUs', '20']
    ]
  },
  'Growth Rate': {
    title: 'Revenue Growth',
    value: '8.4%',
    soWhat: 'The aggregate growth rate sits at 8.4%, slightly below the target threshold of 10.0%. Regional demand shifts in the Americas (-5.0%) drag overall progress, despite strong growth support from APAC (+7.6%) and EMEA (+2.0%).',
    action: 'Deploy targeted promotional support in the Americas and accelerate high-velocity launches to raise the velocity index.',
    columns: [
      { name: 'net_sales', type: 'float [DIRECT]', desc: 'Daily transaction revenue.' },
      { name: 'fiscal_period', type: 'string [DERIVED]', desc: 'Derived period mapping for growth comparisons.' }
    ],
    formula: 'Growth = \\frac{R_{current} - R_{prior}}{R_{prior}} \\times 100',
    formulaDescription: 'Revenue Growth measures the percentage change in our sales revenue compared to the same period in the previous year or month.',
    assumptions: [
      'Prior period alignment: Current month-to-date is compared with the exact matching days of the prior fiscal month.',
      'Symmetric parameters: New regional launches with no historical baselines are handled as starting from zero.'
    ],
    trendTitle: 'Portfolio Growth Volatility vs. Target',
    trendHeaders: ['Quarter', 'Actual Growth', 'Variance', 'Target'],
    trendRows: [
      ['Q1 25', '7.2%', '-1.8pp', '9.0%'],
      ['Q2 25', '7.8%', '-1.2pp', '9.0%'],
      ['Q3 25', '8.1%', '-0.9pp', '9.0%'],
      ['Q4 25 MTD', '8.4%', '-1.6pp', '10.0%']
    ]
  },
  'Orders — Today': {
    title: 'Orders — Today',
    value: '4,232',
    soWhat: 'Real-time order volume reached 4,232 today, showing a positive +12.3% increase compared to yesterday. A target of 5,000 orders is set to ensure peak distribution center processing optimization and courier lane efficiency.',
    action: 'Scale distribution center pick-and-pack server capacity during peak hours and coordinate with regional freight carriers.',
    columns: [
      { name: 'order_id', type: 'string [DIRECT]', desc: 'Unique transaction token from the order management system.' },
      { name: 'order_timestamp', type: 'datetime [DIRECT]', desc: 'Fulfillment creation time index.' }
    ],
    formula: 'Orders_{today} = \\sum_{k=1}^{L} [Order_k \\text{ created on Today}]',
    formulaDescription: 'The sum of all sales orders captured by the order management system within the active 24-hour cycle.',
    assumptions: [
      'Time zone alignment: Standardized to regional distribution center operating hours.',
      'Cancelled transactions: Orders cancelled within the same day are filtered out from the final sum.'
    ],
    trendTitle: 'Hourly Order Velocity vs. Target',
    trendHeaders: ['Time Window', 'Actual Orders', 'Growth vs. Yesterday', 'Target'],
    trendRows: [
      ['00:00 - 06:00', '650', '+10.2%', '800'],
      ['06:00 - 12:00', '1,850', '+12.4%', '2,000'],
      ['12:00 - 18:00', '1,250', '+15.1%', '1,500'],
      ['18:00 - 00:00', '482', '+8.0%', '700']
    ]
  },
  'Forecast Attainment': {
    title: 'Forecast Attainment',
    value: '94.6%',
    soWhat: 'Forecast attainment is 94.6% (target: 97.0%), representing a -2.1pp deviation. The shortfall is primarily driven by cannibalization in Mango Fizz beverage variants and supply bottlenecks for Fabric Softener in Penang.',
    action: 'Retrain ML demand forecasting models with real-time promotion calendars, competitor activities, and regional supplier constraint logs.',
    columns: [
      { name: 'forecast_units', type: 'int [DIRECT]', desc: 'Expected demand units configured by the supply planning engine.' },
      { name: 'actual_units', type: 'int [DIRECT]', desc: 'Actual units shipped and invoiced.' }
    ],
    formula: 'Attainment = \\left(1 - \\frac{|Actual - Forecast|}{Forecast}\\right) \\times 100',
    formulaDescription: 'Computed as 1 minus the absolute difference between actual and forecast volumes, divided by forecast volumes, represented as a percentage.',
    assumptions: [
      'Unsatisfied orders: Excludes backorders that have not been filled or shipped yet.',
      'Promotion calendar alignment: Assumes forecast models adjusted for standard promotional runs.'
    ],
    trendTitle: 'Forecast Attainment by Category',
    trendHeaders: ['Category', 'Actual Attainment', 'Variance', 'Target'],
    trendRows: [
      ['Beverages', '96.2%', '-0.8pp', '97.0%'],
      ['Snacks', '95.4%', '-1.6pp', '97.0%'],
      ['Personal Care', '94.6%', '-2.4pp', '97.0%'],
      ['Household', '91.8%', '-5.2pp', '97.0%']
    ]
  },
  'Avg Lead Time': {
    title: 'Avg Lead Time',
    value: '21 days',
    soWhat: 'Average lead time across active suppliers sits at 21 days compared to a corporate benchmark target of 15 days. Prolonged supplier cycles require higher safety stock holdings, tying up valuable operational capital.',
    action: 'Negotiate lead-time reduction SLAs with APAC suppliers and scale regional warehouse pre-positioning agreements.',
    columns: [
      { name: 'lead_time', type: 'int [DIRECT]', desc: 'Supplier order-to-delivery fulfillment duration in days.' }
    ],
    formula: 'L_{avg} = \\frac{1}{K} \\sum_{j=1}^{K} LeadTime_j',
    formulaDescription: 'Calculated as the arithmetic mean of fulfillment durations across all active product contracts in the system.',
    assumptions: [
      'Standard transport conditions: Assumes freight routes are operating under standard seasonal capacities.',
      'Active listings: Includes all SKUs currently listed as active in the catalog directory.'
    ],
    trendTitle: 'Sourcing Lead Times by Category',
    trendHeaders: ['Category', 'Actual Lead Time', 'Variance', 'Target'],
    trendRows: [
      ['Beverages', '14 days', '-1 day', '15 days'],
      ['Snacks', '18 days', '+3 days', '15 days'],
      ['Personal Care', '28 days', '+13 days', '15 days'],
      ['Household', '22 days', '+7 days', '15 days']
    ]
  },
  'High-Value SKUs': {
    title: 'High-Value SKUs',
    value: '42/100',
    soWhat: 'High-value SKUs (items with Value Score >= 0.6) make up 42.0% of the active catalog (42 of 100 items). These items generate over 75% of net profit, meaning service levels for these SKUs must be heavily protected.',
    action: 'Establish priority warehouse picking lanes and logistics lanes to protect core high-value SKU service levels.',
    columns: [
      { name: 'value_score', type: 'float [DERIVED]', desc: 'Composite SKU value rating based on margin and revenue contribution.' }
    ],
    formula: 'Ratio = \\frac{\\sum [ValueScore_j \\geq 0.6]}{N_{total}} \\times 100',
    formulaDescription: 'The percentage of the active product catalog that satisfies the high-value parameter threshold.',
    assumptions: [
      'Value score metrics: Value score comprises 60% gross margin contribution and 40% sales share contribution.',
      'Catalog directory: Assumes zero sunsetted product items are active in the divisor.'
    ],
    trendTitle: 'High-Value Product Density by Category',
    trendHeaders: ['Category', 'High-Value SKUs', 'Total SKUs', 'Target Ratio'],
    trendRows: [
      ['Beverages', '15', '32', '45%'],
      ['Snacks', '12', '28', '40%'],
      ['Personal Care', '10', '25', '40%'],
      ['Household', '5', '17', '30%']
    ]
  },
  'Assortment Density': {
    title: 'Assortment Density',
    value: '100 SKUs',
    soWhat: 'Catalog breadth is at 100 active items (target: 80 SKUs), causing elevated storage density pressure and long picking times in regional depots.',
    action: 'Execute SKU rationalization plan, deleting the bottom 20% low-velocity items to streamline logistics capacity.',
    columns: [
      { name: 'sku_id', type: 'string [DIRECT]', desc: 'Unique identifier for each SKU listed in regional catalogs.' },
      { name: 'status', type: 'string [DIRECT]', desc: 'Flag indicating if the SKU is currently listed and active.' }
    ],
    formula: 'D_{assort} = \\sum \\text{sku\\_id}_{active}',
    formulaDescription: 'Total count of unique, active stock-keeping units across all catalog classifications.',
    assumptions: [
      'Active listings: Includes all SKUs listed in active catalog sheets, regardless of short-term out-of-stock statuses.'
    ],
    trendTitle: 'Assortment Density by Category',
    trendHeaders: ['Category', 'Active Count', 'Target Count', 'Status'],
    trendRows: [
      ['Beverages', '24', '18', 'High Density'],
      ['Snacks', '24', '18', 'High Density'],
      ['Dairy', '18', '14', 'Elevated'],
      ['Personal Care', '18', '14', 'Elevated'],
      ['Home Care', '18', '14', 'Elevated']
    ]
  },
  'Long-Tail Burden Ratio': {
    title: 'Long-Tail Burden Ratio',
    value: '68.0%',
    soWhat: '68 SKUs (68% of the catalog) generate less than 1% of revenue each, yet occupy 100% of vendor management overhead and shelf-space cycles.',
    action: 'Consolidate low-value vendor networks and transition tail variants to category distributor models.',
    columns: [
      { name: 'net_sales', type: 'float [DIRECT]', desc: 'Determines SKU revenue velocity.' },
      { name: 'sku_id', type: 'string [DIRECT]', desc: 'Primary key used to identify portfolio items.' }
    ],
    formula: 'B_{ratio} = \\frac{\\text{Count}(S_{sku} < 0.01 \\times S_{total})}{\\text{Total SKU Count}}',
    formulaDescription: 'Percentage of active SKUs whose individual sales contribution falls below 1% of total sales.',
    assumptions: [
      'Overhead parity: Assumes standard warehouse carrying overhead is identical per SKU regardless of sales velocity.'
    ],
    trendTitle: 'Long-Tail Density by Region',
    trendHeaders: ['Region', 'Total SKUs', 'Long-Tail SKUs', 'Burden %'],
    trendRows: [
      ['Netherlands', '100', '68', '68%'],
      ['Germany', '98', '62', '63.3%'],
      ['Poland', '95', '60', '63.2%'],
      ['Austria', '85', '42', '49.4%'],
      ['Italy', '100', '68', '68%']
    ]
  },
  'Assortment Gross Yield': {
    title: 'Assortment Gross Yield',
    value: '₹3.02 Cr',
    soWhat: 'Average gross profit contribution per active listing is ₹3.02 Cr, lagging behind the ₹3.50 Cr corporate benchmark by -1.1% due to promo dependency.',
    action: 'Apply pricing floors to low-yield categories and eliminate redundant duplicate sizes.',
    columns: [
      { name: 'net_sales', type: 'float [DIRECT]', desc: 'Total sales revenue per item.' },
      { name: 'purchase_cost', type: 'float [DIRECT]', desc: 'Per-unit manufacturer COGS.' }
    ],
    formula: 'Y_{gross} = \\frac{\\sum (\\text{net\\_sales} - \\text{cogs})}{N_{active}}',
    formulaDescription: 'Average gross profit contribution generated across all active listings in the category catalog.',
    assumptions: [
      'Gross calculation: Measures gross product yield before regional shipping and logistics chargebacks.'
    ],
    trendTitle: 'Gross Yield by Retail Channel',
    trendHeaders: ['Retail Channel', 'Average Gross Yield', 'YoY Growth', 'Performance'],
    trendRows: [
      ['Supermarkets', '₹3.12 Cr', '+1.2%', 'On Target'],
      ['Hypermarkets', '₹3.05 Cr', '-0.5%', 'Borderline'],
      ['E-commerce', '₹2.98 Cr', '-2.4%', 'Underperforming'],
      ['Convenience', '₹2.88 Cr', '-3.1%', 'Critical']
    ]
  },
  'Cannibalization Risk Index': {
    title: 'Cannibalization Risk Index',
    value: '0.62',
    soWhat: 'Beverage categories exhibit a high Cannibalization Index of 0.62, showing that brand flavor expansions (like Mango Fizz 500ml vs 750ml) substitute each other.',
    action: 'Synchronize promo calendars and bundle competing lines to capture incremental sales rather than substitution.',
    columns: [
      { name: 'units_sold', type: 'int [DIRECT]', desc: 'Daily unit sales volume for each variant.' },
      { name: 'promo_flag', type: 'int [DIRECT]', desc: 'Indicates active promotional discount.' }
    ],
    formula: 'C_{index} = \\text{Mean}(\\text{Corr}(V_A, V_B)) \\quad \\forall A, B \\in \\text{Category}',
    formulaDescription: 'Average negative Pearson correlation coefficient of daily volumes calculated between variants within a category.',
    assumptions: [
      'Substitution proxy: High negative correlation coefficients during promotion periods represent brand substitution rather than organic market volume expansion.'
    ],
    trendTitle: 'Cannibalization Risk by Category',
    trendHeaders: ['Category', 'Risk Index', 'Key Driver SKU', 'Action Urgency'],
    trendRows: [
      ['Beverages', '0.74', 'Mango Fizz line', 'Critical'],
      ['Snacks', '0.65', 'BrandC Chips line', 'High'],
      ['Dairy', '0.55', 'Organic Yogurt line', 'Medium'],
      ['Personal Care', '0.40', 'Body Wash sizes', 'Low']
    ]
  }
};
