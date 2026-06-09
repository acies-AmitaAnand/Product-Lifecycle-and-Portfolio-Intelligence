import express from 'express';
import { COMPANY_CONTEXT, KPIS, PORTFOLIO_DATA, CHANNEL_DATA, REGIONAL_DATA, STOCKOUT_TOP10, RATIONALIZATION_SCENARIOS, PCI_DRIVERS, TOP_SKUS_REVENUE, AGENT_ROSTER } from './src/constants/data.ts';

const app = express();
const port = Number(process.env.PORT || 4000);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const LAUNCH_PIPELINES = [
  {
    id: 'launch-1',
    name: 'BrandF Soda Zero',
    category: 'Beverages',
    targetMarket: 'Italy, Spain',
    targetMargin: 41.5,
    launchDate: 'June 2026',
    milestones: {
      packagingSignOff: true,
      pricingApproval: true,
      supplierContract: true,
      safetyStockAllocated: false,
    },
    details: 'Zero-sugar variant targeting wellness channels in southern Europe.',
    riskFactor: 'Low',
  },
  {
    id: 'launch-2',
    name: 'BrandB Eco-Cleaner',
    category: 'Home Care',
    targetMarket: 'Germany, Austria',
    targetMargin: 43.0,
    launchDate: 'July 2026',
    milestones: {
      packagingSignOff: true,
      pricingApproval: false,
      supplierContract: true,
      safetyStockAllocated: false,
    },
    details: 'Premium eco household cleaner with improved supplier traceability.',
    riskFactor: 'Medium',
  },
  {
    id: 'launch-3',
    name: 'BrandC Yogurt Lite',
    category: 'Dairy',
    targetMarket: 'France, Netherlands',
    targetMargin: 39.0,
    launchDate: 'August 2026',
    milestones: {
      packagingSignOff: false,
      pricingApproval: false,
      supplierContract: false,
      safetyStockAllocated: false,
    },
    details: 'Low-fat dairy SKU delayed by packaging and safety stock confirmation.',
    riskFactor: 'High',
  },
  {
    id: 'launch-4',
    name: 'BrandE Protein Bar',
    category: 'Snacks',
    targetMarket: 'Spain, Poland',
    targetMargin: 45.0,
    launchDate: 'September 2026',
    milestones: {
      packagingSignOff: true,
      pricingApproval: true,
      supplierContract: true,
      safetyStockAllocated: true,
    },
    details: 'Protein snack positioned for value-conscious health shoppers.',
    riskFactor: 'Low',
  },
];

const SIGNALS = [
  {
    id: 'sig-1',
    title: 'Dairy SKU complexity spike flagged',
    severity: 'critical',
    type: 'Supply',
    detail: 'Dairy category contains a high share of low-value SKUs and growing supplier overhead.',
    timestamp: '10 min ago',
    acknowledged: false,
    actionText: 'Review Dairy Portfolio',
  },
  {
    id: 'sig-2',
    title: 'BrandD Water promo dependency at 27.97%',
    severity: 'critical',
    type: 'Margin',
    detail: 'Promo dependency is increasing and pressuring gross margin across key beverage SKUs.',
    timestamp: '25 min ago',
    acknowledged: false,
    actionText: 'Optimize Promo Depth',
  },
  {
    id: 'sig-3',
    title: 'Supplier network risk remains unreduced',
    severity: 'warning',
    type: 'Supplier',
    detail: 'Universal supplier overlap prevents immediate supplier count reduction in current rationalization scenarios.',
    timestamp: '1 hour ago',
    acknowledged: false,
    actionText: 'Audit Supplier SLAs',
  },
  {
    id: 'sig-4',
    title: 'Portfolio margin dilution flagged',
    severity: 'warning',
    type: 'Profitability',
    detail: '12 high-volume SKUs are diluting blended margin below the 40% benchmark.',
    timestamp: '2 hours ago',
    acknowledged: false,
    actionText: 'Review Price Deck',
  },
  {
    id: 'sig-5',
    title: 'Sunset model indicates safety stock release',
    severity: 'info',
    type: 'Strategy',
    detail: 'Removing 35 rationalization candidates frees up 42.2% of safety stock capital.',
    timestamp: '4 hours ago',
    acknowledged: false,
    actionText: 'View Simulator',
  },
];

const COMPETITOR_ALERTS = [
  {
    id: 'comp-1',
    brand: 'CompeteCo',
    product: 'Premium Detergent',
    event: '8.5% price cut in Convenience channels',
    impact: 'Pressure on BrandB Detergent volumes',
    urgency: 'High',
  },
  {
    id: 'comp-2',
    brand: 'BioBrand',
    product: 'Organic Chips',
    event: 'Biodegradable packaging launch',
    impact: 'Direct competitor to BrandB Chips',
    urgency: 'Medium',
  },
  {
    id: 'comp-3',
    brand: 'SugarFree Ltd',
    product: 'Diet Cola',
    event: 'Heavy 2-for-1 promos in Supermarkets',
    impact: 'Erodes BrandA Soda share',
    urgency: 'High',
  },
];

app.get('/api/portfolio', (req, res) => {
  res.json({
    companyContext: COMPANY_CONTEXT,
    kpis: KPIS,
    portfolioItems: PORTFOLIO_DATA,
    channelData: CHANNEL_DATA,
    regionalData: REGIONAL_DATA,
    stockoutItems: STOCKOUT_TOP10,
    topSkus: TOP_SKUS_REVENUE,
  });
});

app.get('/api/launch', (req, res) => {
  res.json({ launchPipelines: LAUNCH_PIPELINES });
});

app.get('/api/profitability', (req, res) => {
  res.json({
    pciDrivers: PCI_DRIVERS,
    topSkus: TOP_SKUS_REVENUE,
    summary: {
      totalRevenue: '$473M',
      avgGrossMargin: '38.53%',
      promoErosion: '12.4% of revenue',
      cogsPressure: '7.9% of SKU mix',
      improvementOpportunity: '₹42M potential margin recovery through price and promo optimization',
    },
  });
});

app.get('/api/sku', (req, res) => {
  const candidates = PORTFOLIO_DATA.filter((item) => item.segment === 'Rationalize').slice(0, 8);
  res.json({
    rationalizationScenarios: RATIONALIZATION_SCENARIOS,
    candidates,
  });
});

app.get('/api/signals', (req, res) => {
  res.json({ agentSignals: SIGNALS, competitorAlerts: COMPETITOR_ALERTS });
});

app.listen(port, () => {
  console.log(`Backend API server listening on http://localhost:${port}`);
});
