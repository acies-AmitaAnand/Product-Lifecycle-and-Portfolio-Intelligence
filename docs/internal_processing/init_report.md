# `./init` — Project State Report
**Acies AgenticBus: Product Lifecycle & Portfolio Intelligence Dashboard**  
_Scanned: 2026-05-20_

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Name** | Acies AgenticBus: Product Lifecycle & Portfolio Intelligence |
| **Stack** | Vite + React 18 + TypeScript + TailwindCSS + Recharts + Framer Motion |
| **Target Persona** | FMCG Multi-Country Enterprise (demo: 102 SKUs, 7 markets, $473M revenue) |
| **Demo Industry** | FMCG (Fast-Moving Consumer Goods) |
| **AI Studio App** | [48b72cee-cf3e-46b5-a8db-3a945f26f354](https://ai.studio/apps/48b72cee-cf3e-46b5-a8db-3a945f26f354) |

---

## 2. Docs Folder — What Was Expected & What Exists

The `docs/` folder holds the **source-of-truth** for all dashboard data and design direction.

| File | Purpose |
|---|---|
| `Documentation of PPL Data Collection.docx / .pdf` | Primary data collection brief. Defines the 35 questions answered from the FMCG dataset that power all KPI values in the dashboard. The source Colab notebook (`PPL_demo_data.ipynb`) is referenced here but **lives outside this repo**. |
| `Initial Brief - Product Lifecycle and Portfolio Intelligence.md.pdf` | High-level project brief describing the product vision, feature scope, and the agentic system concept (AgenticBus). |
| `[Shared] Virtual Labs - Capstone Program Guidance.pdf` | Capstone program context — the broader program this project is being built for (Acies Virtual Labs). Defines submission standards, demo expectations, and industry customization strategy. |
| `extracted_text.txt` | **The most critical file** — a processed dump of the Colab notebook analysis answers. Contains all 35 Q&A pairs with exact numerical values that are fed into `constants/data.ts`. This is what bridges the data science work to the frontend. |

### Key Numbers the Docs Define (now in the dashboard)
- 102 SKUs · 6 Brands · 5 Categories · 7 Countries · 4 Channels
- Top 10% SKUs → 27.81% revenue; Top 30% → 62.88%
- 66.7% of SKUs contribute <1% revenue but consume 100% of supplier overhead
- 35 "Rationalize" candidates (Low Value / High Complexity)
- Full rationalization: −27.08% revenue tail risk, +42.2% safety stock freed ($246M → $142M)
- Portfolio Complexity Index (PCI): 0.5509
- Peak stockouts: 440 events (BrandC Biscuits, BrandF Soap)
- Supplier interconnectivity: 0% supplier reduction achievable from SKU cuts alone

---

## 3. Current Project Structure

```
agentic_bus_PPL/
├── docs/                          ← Source data & briefs
├── src/
│   ├── App.tsx                    ← Root shell, tab router, KPI strip
│   ├── index.css                  ← Tailwind directives + design tokens
│   ├── main.tsx                   ← Vite entry point
│   ├── types/
│   │   └── dashboard.ts           ← All TypeScript interfaces
│   ├── constants/
│   │   └── data.ts                ← All static data (sourced from extracted_text.txt)
│   └── components/
│       ├── common/
│       │   ├── Header.tsx         ← Sticky nav, role selector, dark mode toggle
│       │   └── Sidebar.tsx        ← "How This Evolves" agent roster overlay
│       └── dashboard/
│           ├── PortfolioHealthMap.tsx     ← Tab 0 layout orchestrator
│           ├── ValueMatrix.tsx            ✅ BUILT — Scatter: Commercial Value vs Complexity
│           ├── ComplexityIndex.tsx        ✅ BUILT — PCI sub-drivers bar chart
│           ├── ParetoConcentration.tsx    ✅ BUILT — Revenue concentration (Pareto)
│           ├── ChannelPerformance.tsx     ✅ BUILT — Channel margin/volatility/stockout
│           ├── StockoutHeatmap.tsx        ✅ BUILT — Top 10 stockout SKUs
│           ├── RationalizationSimulator.tsx ✅ BUILT — Tiered SKU deletion simulator
│           ├── KPICard.tsx               ✅ BUILT — Individual KPI card with role highlights
│           └── ActionPriorityQueue.tsx   ✅ BUILT — Strategic action items panel
├── kpi_overview_fmcg.html         ← Standalone KPI reference page (early prototype artifact)
├── validation/                    ← (directory present, contents not scanned)
├── metadata.json                  ← AI Studio app metadata
└── package.json                   ← Vite + React + Recharts + Framer Motion
```

---

## 4. What Is Fully Built (Tab 0: Portfolio Health Map)

Tab 0 is **complete and data-grounded**. Here's the component map:

```
App.tsx
 └── PortfolioHealthMap (Tab 0)
      ├── [Hero Banner]           Executive summary stats strip (hardcoded)
      ├── ValueMatrix             Scatter plot — 25 SKU data points, 4 segments
      ├── ComplexityIndex         Horizontal bar chart — 6 PCI sub-drivers vs benchmark
      ├── ParetoConcentration     Revenue concentration visualization
      ├── ChannelPerformance      4 channels: margin%, CV, stockout count
      ├── StockoutHeatmap         Top 10 stockout SKUs with safety stock ratio
      ├── RationalizationSimulator  4 scenarios (Bottom 10%/20%/30%/Full Rationalize)
      └── ActionPriorityQueue     Strategic action items with estimated impact
```

### Global Features
- **Role-based KPI highlighting**: VP Product Management, Product Manager, Pricing and Margin Partner
- **Dark mode toggle** (Tailwind `dark:` classes)
- **"How This Evolves" sidebar** — Agent roster with their mandates
- **Tab navigation** — 5 tabs defined, only Tab 0 is active

---

## 5. What Is NOT Yet Built (Tabs 1–4)

| Tab | Name | Status | What the docs suggest it should contain |
|---|---|---|---|
| **Tab 1** | Launch Readiness | ⬜ Placeholder | New SKU launch pipeline, stage-gate readiness, introduction-phase SKUs tracking |
| **Tab 2** | Profitability Tree | ⬜ Placeholder | Margin waterfall breakdown: Net Sales → Gross Margin → by category/channel/region |
| **Tab 3** | SKU Rationalization | ⬜ Placeholder | Deeper drill-down on the 35 Rationalize candidates, promo erosion analysis, deletion workflow |
| **Tab 4** | Signals Board | ⬜ Placeholder | Market signals, competitor intelligence, demand volatility alerts, agentic recommendations |

> All 4 tabs currently show a "Development Phase: Core Logic Integration" placeholder card.

---

## 6. Data Grounding Status

| Data Domain | Source in Docs | In `data.ts` | Used in UI |
|---|---|---|---|
| Revenue concentration (Pareto) | Q2 extracted_text | ✅ | ✅ ParetoConcentration |
| Value vs Complexity segmentation | Q21 | ✅ PORTFOLIO_DATA | ✅ ValueMatrix |
| Channel performance | Q17/Q18 | ✅ CHANNEL_DATA | ✅ ChannelPerformance |
| Regional SKU complexity | Q16 | ✅ REGIONAL_DATA | ✅ (in ComplexityIndex or available) |
| Stockout ranking | Q11/Q12 | ✅ STOCKOUT_TOP10 | ✅ StockoutHeatmap |
| Rationalization scenarios | Q28-Q30 | ✅ RATIONALIZATION_SCENARIOS | ✅ RationalizationSimulator |
| PCI sub-drivers | Q25 | ✅ PCI_DRIVERS | ✅ ComplexityIndex |
| Top SKUs by revenue | Q1 | ✅ TOP_SKUS_REVENUE | ⚠️ Data exists but unclear if surfaced in UI |
| KPI strip (8 cards) | Multiple Q's | ✅ KPIS | ✅ KPICard strip |
| Agent roster | Conceptual | ✅ AGENT_ROSTER | ✅ Sidebar |
| Promo erosion by SKU | Q9 | ❌ Not in data.ts | ❌ Not in UI |
| Seasonal volatility (Chocolate) | Q20 | ❌ Not in data.ts | ❌ Not in UI |
| Supplier mapping detail | Q13-Q15 | ❌ Not in data.ts | ❌ Not in UI |
| Cannibalization risk detail | Q26 | ❌ Not in data.ts | ❌ Not in UI (only headline in hero) |

---

## 7. Open Gaps & Observations

> [!IMPORTANT]
> **Tab 0 is complete and demo-ready.** The primary next step is deciding the order and depth of Tabs 1–4.

> [!NOTE]
> `kpi_overview_fmcg.html` at the root is a **standalone static prototype** — likely an early artifact from before the React app was built. It is not integrated into the app.

> [!NOTE]
> The `validation/` directory was found but not scanned. Likely contains data validation or notebook output files.

> [!TIP]
> Promotional erosion data (Q9) and seasonal volatility (Q20 — Chocolate dominance) are rich dataset findings that are **documented in extracted_text.txt but not yet wired into any component**. These would be strong additions to Tab 3 (SKU Rationalization) and Tab 4 (Signals Board).

> [!WARNING]
> `REGIONAL_DATA` is defined in `data.ts` but it's unclear if it's rendered anywhere in the current UI — the 7-country breakdown (Italy → Netherlands) may be dormant data.

---

## 8. Recommended Next Work Order

Based on the doc's stated strategy ("get one tab right, then proceed"):

1. **Tab 0 polish pass** — verify REGIONAL_DATA is surfaced, confirm role-based highlighting is impactful
2. **Tab 3: SKU Rationalization** — deepest data coverage available (promo erosion Q9, burden ratios Q27, deletion simulations Q28-Q30 already in data.ts)
3. **Tab 2: Profitability Tree** — margin waterfall by category/channel (data available from Q5, Q6, Q7, Q16, Q17)
4. **Tab 4: Signals Board** — seasonality, volatility, cannibalization risk, agentic narrative outputs
5. **Tab 1: Launch Readiness** — least data available; would require new data design or new dataset
