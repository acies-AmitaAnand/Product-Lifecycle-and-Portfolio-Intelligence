# Acies AgenticBus: Portfolio Intelligence — Onboarding & KT Guide

Welcome to the **Portfolio Intelligence** codebase. This guide serves as a comprehensive Knowledge Transfer (KT) document to help you hit the ground running. It outlines the directory structure, technology stack, design system, core tab modules, and state sharing mechanics.

> [!NOTE]
> **Objective & Audience Context**: This dashboard is built as a premium, high-fidelity client demo representative of a finished enterprise product. The primary objective is to wow potential clients, showcase advanced capabilities (such as AI simulations, real-time demand transference, and supply chain graphs), and build absolute confidence in our technical and visual design execution.

---

## 1. Tech Stack & Architecture

The application is a premium, high-fidelity corporate dashboard built using modern web technologies:
* **Core**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
* **Build System**: [Vite v6](https://vite.dev/) (fast hot-reloads, minified rollups)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with native utility tokens, custom dark-mode classes (`dark:`), and smooth hover micro-animations
* **Icons**: [Lucide React](https://lucide.dev/) (standardized corporate vector icons)
* **Visualization**: [Recharts](https://recharts.org/) (responsive SVG charts with custom tooltips, gradients, and animated lines)
* **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion) for page transitions, sidebar drawer sliding, and modal scale animations

### Directory Layout

```
agentic_bus/
├── dist/                  # Production builds (assets, index.html)
├── src/
│   ├── components/
│   │   ├── common/        # Shared shell (Header, Sidebar, WelcomeGate)
│   │   └── dashboard/     # Tab-specific workspace views
│   │       ├── drilldown/          # Tab 6: Top-Down Drilldown
│   │       ├── executive/          # Tab 0: Home / Executive Overview
│   │       ├── launch-readiness/   # Tab 2: Launch Readiness
│   │       ├── orchestrator/       # Tab 7: Agent Orchestrator
│   │       ├── portfolio-health/   # Tab 1: Portfolio Health Map
│   │       ├── profitability/      # Tab 3: Profitability Tree
│   │       ├── signals-board/      # Tab 5: Signals Board
│   │       └── sku-rationalization/ # Tab 4: SKU Rationalization
│   ├── constants/
│   │   └── data.ts        # Mock databases, portfolio SKUs, mappings
│   ├── types/
│   │   └── dashboard.ts   # Shared TypeScript interface declarations
│   ├── App.tsx            # Root component, global state, tab routing
│   ├── index.css          # Design system tokens, tailwind imports
│   └── main.tsx           # React bootstrap entry point
├── vite.config.ts         # Build, plugin, and server definitions
└── tsconfig.json          # Strict type configurations
```

---

## 2. Core Dashboard Tab Index

The application is structured into **8 workspace tabs** controlled by state in `App.tsx` and mirrored in the URL hash (e.g., `#tab=4`):

### 🏢 Tab 0: Home / Executive Overview
* **File**: [ExecutiveOverview.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/executive/ExecutiveOverview.tsx)
* **Role Focus**: Executive / CEO / C-Suite
* **Key Components**:
  * **Top KPI cards**: Global revenue, gross margin, OTIF, and active product counts. Includes "So What?" and "Action Plan" details that link to the methodology audit drawer.
  * **Smart Alerts Swarm**: Real-time notifications detailing product risks. Clicking "Investigate" launches [SmartAlertDetailsModal.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/executive/SmartAlertDetailsModal.tsx).
  * **Interactive Revenue Trend**: Monthly revenue charts. Clicking any monthly forecast bar opens [TrendMonthForecastModal.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/executive/TrendMonthForecastModal.tsx) to adjust prices and forecast parameters.

### 🗺️ Tab 1: Portfolio Health Map
* **File**: [PortfolioHealthMap.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/portfolio-health/PortfolioHealthMap.tsx)
* **Role Focus**: VP Portfolio / Category Manager
* **Key Components**:
  * Bubble matrices graphing commercial complexity vs. margin.
  * Raw metrics tables for filtering items by category.

### 🚀 Tab 2: Launch Readiness
* **File**: [LaunchReadinessDashboard.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/launch-readiness/LaunchReadinessDashboard.tsx)
* **Role Focus**: Supply Chain Planner / Brand Manager
* **Key Components**:
  * Sourcing timelines, Gantt gate status indicators, and stock-out alerts.

### 🌳 Tab 3: Profitability Tree
* **File**: [ProfitabilityTree.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/profitability/ProfitabilityTree.tsx)
* **Role Focus**: FP&A / Controller
* **Key Components**:
  * An interactive tree visualizer tracing Net Sales down through COGS, trade promo, and logistics.
  * Optimization sliders allowing simulated lever overrides.

### ✂️ Tab 4: SKU Rationalization
* **File**: [SKURationalization.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/sku-rationalization/SKURationalization.tsx)
* **Role Focus**: Merchandising / Brand Assortment Manager
* **Key Components**:
  * **View Switcher**: Swaps between the *Portfolio Simulator* and *Cannibalization Analyst*.
  * **Interactive Cards**: Segments SKUs into `Retain`, `Grow`, `Reposition`, `Bundle`, and `Sunset`.
  * **P&L Simulation Desk**: Live pricing elasticity and volume levers affecting margins.
  * **Pareto Chart**: Displays revenue concentration with a dashed red projection line representing discontinuation impact.
  * **Pair Scorer Calculator**: [CalculatorScorer.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%2520Agentic%2520Bus/agentic_bus/src/components/dashboard/sku-rationalization/CalculatorScorer.tsx) for calculating correlation and margin dilution.
  * **Product Directory**: [ProductDirectory.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%2520Agentic%2520Bus/agentic_bus/src/components/dashboard/sku-rationalization/ProductDirectory.tsx) to search and inspect variants via [SkuIntelligenceModal.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%2520Agentic%2520Bus/agentic_bus/src/components/dashboard/sku-rationalization/SkuIntelligenceModal.tsx).

### ⚡ Tab 5: Signals Board
* **File**: [SignalsBoard.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/signals-board/SignalsBoard.tsx)
* **Role Focus**: Controller / Operations Head
* **Key Components**:
  * Alerts feeds grouped by priority.
  * Click triggers to resolve actions (e.g., [ResolveSignalModal.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%2520Agentic%2520Bus/agentic_bus/src/components/dashboard/signals-board/ResolveSignalModal.tsx)).

### 🔍 Tab 6: Top-Down Drilldown
* **File**: [TopDownDrilldown.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/drilldown/TopDownDrilldown.tsx)
* **Role Focus**: Global Logistics & Regional Heads
* **Key Components**:
  * **SVG Supply Chain Network**: Curated flow network displaying headquarters and regional hubs. Node selection synchronizes cards.
  * **Compact Breadcrumbs**: Hierarchical trail that resets region selections.
  * **Performance Cards**: Sales growth, margin tracking, stock-out flags, and logistics lead times.
  * **Waterfall Simulator Modal**: [DrilldownSkuModal.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%2520Agentic%2520Bus/agentic_bus/src/components/dashboard/drilldown/DrilldownSkuModal.tsx) to simulate margin recoveries and display absolute savings comparisons.

### 🤖 Tab 7: Agent Orchestrator
* **File**: [AgentOrchestrator.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/orchestrator/AgentOrchestrator.tsx)
* **Role Focus**: Systems Auditor
* **Key Components**:
  * Subagent log feeds, task queues, and execution steps.

---

## 3. Design Aesthetics & Coding Conventions

To ensure visual excellence and consistency, you must follow these rules:

### A. Color Palette & Dark Mode Mappings
Avoid generic default colors. Use harmonized slate/zinc and neon accent glow borders:
* **Backgrounds**: `bg-slate-50 dark:bg-[#090d16]`
* **Card Wrappers**: `bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md`
* **Text**: `text-zinc-900 dark:text-zinc-100` and `text-zinc-500 dark:text-zinc-400`
* **Accents**: 
  * Purple: `text-[#8b5cf6] dark:text-[#a78bfa] border-[#8b5cf6]/20`
  * Amber: `text-[#f59e0b] dark:text-[#fbbf24] border-[#f59e0b]/20`

### B. Viewport Robustness (No Scrolling Rule)
* **Breakpoint Selection**: Always use `lg:` (1024px) or `md:` (768px) rather than `xl:` (1280px) when designing sidebars or multi-column grids. This prevents the dashboard from folding into a vertical layout with excessive scrolling on standard laptop displays or zoom levels (e.g. 125% browser scale).
* **Relative Sizing**: Utilize flexbox (`flex-1`, `shrink-0`) and responsive grid columns (`grid grid-cols-1 lg:grid-cols-4`) to adapt to screen space dynamically.

### C. State Synchronization & Cross-Tab Navigation
Tabs share state through callbacks passed down from `App.tsx` or using URL hashes.
* If a component needs to link to another tab (e.g., jumping from the Home tab alert to the SKU rationalization directory), invoke `setActiveTab(4)` and update the window URL hash parameters:
  ```typescript
  updateHash('tab', '4');
  setActiveTab(4);
  ```
* Ensure you always retrieve parameters like the current active role or tab dynamically from `App.tsx` to keep the views aligned.

---

## 4. KT Cheat-Sheet for Tab Development

When assigned to develop or refactor a specific tab:
1. **Locate the folder**: Go to `src/components/dashboard/[tab-folder]/`.
2. **Review dependencies**: Inspect if the tab uses shared constants from `src/constants/data.ts` or types from `src/types/dashboard.ts`.
3. **Verify locally**: Make changes, test layouts at various zoom levels, and run `npm run build` to ensure there are no TypeScript compiler errors or Rollup warnings.
4. **Deploy**: Push to `main` on GitHub to trigger the Vercel automatic deployment pipeline.
