export const parseTrendData = (headers: string[], rows: string[][]) => {
  try {
    if (!headers || !rows || rows.length === 0) return null;
    
    // Check which format it is
    const hasTarget = headers.some(h => h.toLowerCase().includes('target'));
    const isYoY = headers.some(h => h.toLowerCase().includes('2022')) && headers.some(h => h.toLowerCase().includes('2023'));
    
    return rows.map(row => {
      const label = row[0];
      
      // Parse main value
      let value = 0;
      if (row[1]) {
        // Strip out non-numeric characters except dots and minus
        const cleanedVal = row[1].replace(/[^\d.-]/g, '');
        value = parseFloat(cleanedVal) || 0;
      }
      
      let targetValue = 0;
      if (hasTarget && row[3]) {
        const cleanedTarget = row[3].replace(/[^\d.-]/g, '');
        targetValue = parseFloat(cleanedTarget) || 0;
      }
      
      let prevValue = 0;
      if (isYoY && row[2]) {
        const cleanedPrev = row[2].replace(/[^\d.-]/g, '');
        // For YoY, row[1] is 2022 (prev) and row[2] is 2023 (current)
        prevValue = value; // row[1]
        value = parseFloat(cleanedPrev) || 0; // row[2]
      }
      
      return {
        name: label,
        value,
        target: targetValue,
        prev: prevValue
      };
    });
  } catch (e) {
    console.error("Failed to parse trend data", e);
    return null;
  }
};

export const getConfidenceScore = (metric: string): number => {
  let hash = 0;
  for (let i = 0; i < metric.length; i++) {
    hash = metric.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 92 + (Math.abs(hash) % 7); // Returns 92 - 98
};

export const getMetricStatus = (metric: string) => {
  const riskMetrics = ['Critical Alerts', 'Long-Tail SKU Burden', 'Rationalize Candidates', 'Revenue Tail Risk', 'Peak Stockout Freq', 'Total Active Signals', 'Long-Tail Burden Ratio', 'Cannibalization Risk Index', 'Total Stockouts'];
  const isRisk = riskMetrics.includes(metric);
  return {
    label: isRisk ? 'ELEVATED RISK' : 'OPTIMAL / ON-TRACK',
    isRisk
  };
};

export const getMetricTrend = (metricName: string) => {
  switch (metricName) {
    case 'Total Revenue':
    case 'Revenue MTD':
    case 'Portfolio Revenue':
      return { value: '+8.4% vs last month', isUp: true };
    case 'Gross Margin':
    case 'Gross margin %':
    case 'Avg Gross Margin':
      return { value: '+1.1% MTD', isUp: true };
    case 'Active SKUs':
    case 'Portfolio SKUs':
      return { value: '-3 SKUs MoM', isUp: false };
    case 'Portfolio SKU Count':
      return { value: '-3 SKUs rationalized', isUp: true };
    case 'Revenue Growth':
    case 'Growth Rate':
      return { value: '-1.6pp vs target', isUp: false };
    case 'Orders — Today':
      return { value: '+12.3% vs yesterday', isUp: true };
    case 'Forecast Attainment':
      return { value: '-2.1pp vs target', isUp: false };
    case 'Avg Lead Time':
      return { value: '+2 days vs target', isUp: false };
    case 'High-Value SKUs':
      return { value: '+4 SKUs YoY', isUp: true };
    case 'Critical Alerts':
    case 'Total Active Signals':
      return { value: '+2 Active Alerts', isUp: true };
    case 'Assortment Density':
      return { value: 'Max in Italy (102)', isUp: true };
    case 'Long-Tail Burden Ratio':
      return { value: '68 SKUs <1% rev', isUp: true };
    case 'Assortment Gross Yield':
      return { value: '-1.1% vs target', isUp: false };
    case 'Cannibalization Risk Index':
      return { value: 'High in Beverages', isUp: true };
    case 'Shelf Productivity':
      return { value: '-2.4% vs last month', isUp: false };
    case 'Total Stockouts':
    case 'Peak Stockout Freq.':
      return { value: '440 events MTD', isUp: true };
    default:
      return { value: '+0.5% MoM', isUp: true };
  }
};
