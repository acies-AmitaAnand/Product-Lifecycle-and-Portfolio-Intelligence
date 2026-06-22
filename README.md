# Acies AgenticBus: FMCG Portfolio & Product Lifecycle Intelligence

A high-fidelity, real-time executive control center and data analysis dashboard built for FMCG (Fast-Moving Consumer Goods) multi-country enterprises. 

This platform bridges advanced data science findings (extracted from transactional analyses of 102 SKUs across 6 brands and 7 regional markets) with a premium front-end experience. It provides category managers and executives with the simulation models and auditing tools needed to optimize product complexity, mitigate supply risks, and recover margins.

---

## Deployed Demo
*   **Production Deployment (Vercel)**: [Acies Portfolio Intelligence Dashboard](https://ilp-ppl-dash-board.vercel.app/)

---

## 🎯 The Core Deliverable & Idea
The dashboard functions as the interactive command center for the **Acies AgenticBus**—a system of cooperative AI agents that continuously monitor enterprise ledgers, compliance records, and sales data. 

Rather than relying on static, delayed reporting, the AgenticBus translates raw transaction logs into live simulation models, allowing stakeholders to model macro and micro actions (pricing adjustments, SKU phase-outs, regional supply shocks) and inspect explainable reasoning paths immediately.

---

## 🗂️ Module Directory: Tab-by-Tab Capabilities & Actions

### 0. Executive Overview (Home)
*   **The Idea**: A high-level control panel summarizing enterprise performance, operational alerts, and pending approvals.
*   **Actionable Capabilities**:
    *   Review key financial metrics (Total Revenue, Gross Margin, Active SKUs, Critical Alerts) at a glance.
    *   Triage **Critical Alerts** (e.g., Fabric Softener stockouts or Choco Wafers promo dependencies) and **Urgent Approvals** (approving launch budgets, signing off on rationalizations) directly from the desk.

### 1. Portfolio Health Map
*   **The Idea**: Macro-level visibility into catalog complexity and product concentration risk.
*   **Actionable Capabilities**:
    *   **Interactive KPI Cards**: Audit revenue concentration (Pareto rules) and long-tail SKU burdens. Clicking a card opens the audit trace drawer.
    *   **Regional Margin Simulator**: Adjust country-level target margins using sliders to dynamically calculate profit lifts and simulated enterprise margins.
    *   **Supplier & Proliferation PCI Charts**: Track the 6 sub-drivers of the Portfolio Complexity Index (PCI) against target benchmarks.
    *   **Stockout Heatmap**: Trace replenishment risks for the top 10 supply-fragile SKUs.

### 2. Launch Readiness Tracker
*   **The Idea**: Sourcing, regulatory, and marketing gate coordinator for product introductions.
*   **Actionable Capabilities**:
    *   **Launch Readiness Scoring**: Fill SKU brief parameters (lead times, supplier counts, projected revenue) to compute a pentagonal radar score across 5 readiness axes.
    *   **Pipeline Funnel & Milestones**: Monitor gates (Ideation, Regulatory, Testing, Production, Market Ready) and check list statuses.
    *   **Supply Shock Simulation**: Toggle the regional supply chain delay simulator (+14 days lead times in APAC) to instantly model revenue exposure, risk updates, and delayed gates.

### 3. Profitability Tree
*   **The Idea**: Interactive hierarchical visualization of margin health from category level down to individual product variants.
*   **Actionable Capabilities**:
    *   **Hierarchical Drilldown**: Double-click Category (e.g., Beverages) $\rightarrow$ Brand (e.g., Mango Fizz) $\rightarrow$ SKU Nodes to inspect revenue scales and margin dilution vectors.
    *   **Margin Auditing**: Click any node to open the data lineage trace detailing cost-of-goods-sold (COGS) assumptions, formulas, and performance tables.

### 4. SKU Rationalization Command Desk (Tab-Local Workspace)
*   **The Idea**: An optimized, self-contained workspace inside the `/sku-rationalization/` folder mapping AI pruning simulations, price-pack elasticity models, and cannibalization audits.
*   **Actionable Capabilities**:
    *   **Interactive KPI Action Modal**: Click any of the four top KPI cards to launch a dialog with direct actionable options:
        *   *Portfolio SKUs*: Scroll to/highlight the Product Directory or isolate "Retain" (hero) products.
        *   *Sunset Candidates*: Instantly load any of the 6 AI-flagged candidates (e.g., Fabric Softener, Floor Cleaner, Aloe Face Wash) into the simulator or inspect their profiles.
        *   *Revenue at Risk*: Trigger phased pruning scenarios (Bottom 10% vs. Full Sunset) or model price elasticity changes.
        *   *Avg Complexity*: Navigate to the complexity matrix or check promotional erosion bar charts.
    *   **Projected Pareto Spline**: Simulating a SKU deletion plots a dashed red projection curve, visualizing displacement path and volume shifts.
    *   **Category-Cross Filtered Directory**: Expand and search the entire 29 SKU directory, cross-routing straight to other dashboard modules.

### 5. Signals Board
*   **The Idea**: The risk ledger showing live compliance warnings and operational events.
*   **Actionable Capabilities**:
    *   Review active signals filtered by domain (Supply, Margin, Demand, Regulatory).
    *   Acknowledge alerts (surges in APAC demand, competitor pricing cuts, packaging constraints) to coordinate category response teams.

### 6. Top-Down Scenario Drilldown
*   **The Idea**: Macroeconomic shock simulator modeling targets across business divisions.
*   **Actionable Capabilities**:
    *   Configure global slider targets for Revenue, Margin, and On-Time-In-Full (OTIF) delivery.
    *   Model enterprise adjustments across regional hubs (Italy, Spain, Germany, France) under economic stress tests.

### 7. Agent Orchestrator
*   **The Idea**: The execution dashboard showing live operational trails of the AI Agent Bus.
*   **Actionable Capabilities**:
    *   Review live activity logs, prompt routing chains, and explainability records.
    *   Trigger background audit protocols across Category, Supply, and margin agents.

---

## 🛠️ Technology Stack
*   **Framework**: React (Vite)
*   **Language**: TypeScript (with strict schemas for transaction models)
*   **Styling**: Custom CSS and glassmorphism styling parameters.
*   **Visualizations**: Recharts (Composed, Radar, Scatter, Bar, and Line charts)
*   **Icons**: Lucide React
*   **Animations**: Framer Motion (Motion)

---

## 🚀 Running the Dashboard Locally

1.  **Clone & Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development server**:
    ```bash
    npm run dev
    ```
3.  **Build and Compile Verification**:
    ```bash
    npm run build
    ```
    *(Outputs production-ready static assets inside the `dist/` directory)*
