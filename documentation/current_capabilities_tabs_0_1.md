# Current Capabilities Audit: Tab 0 & Tab 1

This document provides a technical audit of the actual components, states, data structures, and modal components implemented in the React codebase for **Tab 0 (Executive Overview)** and **Tab 1 (Portfolio Health Map)**. This serves to verify that all storyboard flows and presentation scripts are grounded in the active features of the application.

---

## 🏢 Tab 0: Home / Executive Overview
*   **File Path**: [ExecutiveOverview.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/executive/ExecutiveOverview.tsx)
*   **Target Role**: VP Product Management / C-Suite (filters views based on the `role` prop).

### 1. Component State & Data Mappings

The component manages dashboard logic using several React state hooks:
*   `alerts` & `approvals`: Loaded from static constants (`VP_ALERTS`, `VP_APPROVALS` in `constants/data.ts`). Alerts list can be acknowledged individually (`handleAckAlert`) or all at once (`handleAckAllAlerts`).
*   `kpis`: Renders headline metrics (Total Revenue, Active SKUs, Critical Alerts, Gross Margin). If the `role` is set to `'VP Product Management'`, the **Gross Margin card is automatically filtered out** to keep the screen uncluttered.
*   `feedEvents`: An active event feed. A background `setInterval` loop runs every 1.8 to 6 seconds to fetch new events from `EVENT_TEMPLATES` (representing Demand, Supply, Margin, Finance, and Launch categories) and prepends them with a live timestamp.
*   `viewFormat` & `calendarOpen`: Switches between card layouts and triggers the `EventsCalendarModal`.
*   `revenueViewMode` & `categoryViewMode`: Controls the active charts (`line` | `combi` | `bar` for revenue; `donut` | `bar` | `radar` for categories).

### 2. Actual Visual Widgets

1.  **KPI Cards Strip**:
    *   *Cards*: Total Revenue, Gross Margin (hidden for VP), Active SKUs, Critical Alerts.
    *   *Interaction*: Click card $\rightarrow$ triggers `onAuditClick(label)` $\rightarrow$ opens the sliding **Audit Drawer** (`AuditDrawer.tsx`).
    *   *Visuals*: Features MoM trend percentages and a Recharts micro-sparkline area chart showing trend history.
2.  **Smart Alerts Swarm**:
    *   *Features*: Lists critical notifications with severity indicators (red for critical, orange for warning, blue for info).
    *   *Interaction*: Click "Investigate" $\rightarrow$ sets `selectedAlert` state $\rightarrow$ opens `SmartAlertDetailsModal`. Click "Dismiss" $\rightarrow$ triggers local layout filtering.
3.  **Revenue Trend Chart**:
    *   *Features*: Recharts-powered chart displaying Actuals vs. Target.
    *   *Interaction*: Click any monthly bar $\rightarrow$ sets `selectedTrendMonth` $\rightarrow$ opens `TrendMonthForecastModal` (showing YoY unit price lifts, pricing forecasts, and AI recommendations).
4.  **Category Performance Chart**:
    *   *Features*: Recharts-powered chart showing sales share by category.
    *   *Interaction*: Click any category slice/bar $\rightarrow$ sets `selectedCategory` $\rightarrow$ opens `CategoryPerformanceDetailsModal` (details best performers, underperformers, and customer trends).
5.  **Top SKU Performance Card**:
    *   *Features*: Filters top 5 SKUs by category using segment pills. Toggles between List progress-bars and Pie Chart view.
    *   *Interaction*: Click SKU $\rightarrow$ sets `selectedSku` $\rightarrow$ opens `SkuDetailsModal`. Clicking "Request Action" opens `EmailComposerModal`.
6.  **Top Customer Insights Card**:
    *   *Features*: Renders customer-specific buying trends (e.g. Apex Hypermarkets, QuickCart Convenience) categorized by channel, listing revenue share and intent details.
7.  **Regional Forecast Card**:
    *   *Features*: Compares target vs actual revenues across regions (EMEA, APAC, etc.). Toggles between list progress-bars and grouped bar chart.
    *   *Interaction*: Click region $\rightarrow$ sets `selectedRegion` $\rightarrow$ opens `RegionalForecastModal` (linking to `EmailComposerModal` to email regional leads).

---

## 🗺️ Tab 1: Portfolio Health Map
*   **File Path**: [PortfolioHealthMap.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/portfolio-health/PortfolioHealthMap.tsx)
*   **Target Role**: VP Portfolio Strategy / Category Manager.

### 1. Component State & Data Mappings

The tab manages the portfolio listing and modeling parameters:
*   `skus`: Active SKU array computed by timeframe (`timelineRange`).
*   `activeTab` sub-tab navigator: Renders four distinct sections:
    1.  `ph-matrix` (Value × Complexity Matrix Map).
    2.  `ph-pareto` (Pareto Concentration Curves).
    3.  `ph-channels` (Channel Mix).
    4.  `ph-simulator` (Pruning & Substitution Simulator).
*   `complexityThreshold`, `revenueFloor`, `demandTransference` (Simulator Sliders): Triggers waterfall recalculations on drag.

### 2. Actual Visual Widgets

1.  **Header KPI cards**:
    *   Renders 8 live metrics, including *Safety Capital Released*, *Portfolio Complexity Index (PCI)*, *Revenue at Risk*, *Total Revenue*, and *Avg Gross Margin*.
2.  **Lifecycle Health Panel**:
    *   *Visuals*: Circular progress ring tracking overall portfolio health score (0-100%).
    *   *Proportions*: Dual progress bars tracking SKU Count Share vs. Revenue Share across stages (*Introduction*, *Growth*, *Margin*, *Decline*).
    *   *Interaction*: Hovering over stage segments opens absolute SKU names with direct click-throughs to inspect individual SKU details.
3.  **Value × Complexity Matrix Map (Sub-Tab 1)**:
    *   *Visuals*: Recharts ScatterChart plotting Normalized Operational Complexity (X-axis, 0-1) vs. Normalized Commercial Value (Y-axis, 0-1).
    *   *Interaction*: Divides products into Keep, Grow, Consolidate, and Rationalize quadrants. Clicking a bubble launches the `SkuDetailsModal` to view structural metrics.
4.  **Investment vs. Return Margin Map (Sub-Tab 1 Alternative)**:
    *   *Visuals*: Recharts ScatterChart plotting Required Investment in ₹ Cr (X-axis) vs. Return Margin % (Y-axis).
    *   *Interaction*: Segments items into Quick Wins, Strategic Bets, Niche, and Avoid. Includes approvals to authorize regional budgets (`handleApproveInvestment` toast notification).
5.  **Pareto Concentration (Sub-Tab 2)**:
    *   *Visuals*: Recharts ComposedChart overlaying bar charts of single SKU revenues against a cumulative percentage curve. Includes a threshold line representing target concentrations.
6.  **Multi-Channel Mix (Sub-Tab 3)**:
    *   *Visuals*: Renders channel revenue splits across E-commerce, Modern Trade, General Trade, D2C, and Pharmacy.
7.  **Sunset Simulator (Sub-Tab 4)**:
    *   *Visuals*: Interactive waterfall chart showing: `Original Sales` $\rightarrow$ `Gross Cuts` $\rightarrow$ `Substituted Volume` $\rightarrow$ `Ops Savings` $\rightarrow$ `Net Revenue`.
    *   *Controls*:
        *   *Complexity Slider*: Flags SKUs exceeding operational lead time or setup friction.
        *   *Revenue Floor Slider*: Flags SKUs below target revenue margins.
        *   *Transference Slider*: Sets client substitution rate (0-100%) to calculate volume recovery.
8.  **VP Command Center Log**:
    *   *Features*: Interactive table listing underperforming products (e.g. Floor Cleaner: "Complexity 0.81, Value 0.22, 7 stockouts").
    *   *Actions*: Provides click buttons to schedule alignment meetings (`ScheduleMeetingModal`) or compose emails (`EmailComposerModal`).

---

## 3. Grounded Modals & Interaction Points

The walkthrough scripts leverage these actual modal dialog boxes import-mapped in the code:

1.  **[SkuDetailsModal.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/executive/SkuDetailsModal.tsx)**: Displays variant margin details, monthly sales, promo dependency, and lead-time factors. Contains a button to trigger email mitigations.
2.  **[SmartAlertDetailsModal.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/executive/SmartAlertDetailsModal.tsx)**: Displays the alert description and includes a **"Authorize Directive"** approval loop. Approving the alert fires `onApprove` which dismisses the alert and triggers a premium dashboard toast message.
3.  **[EmailComposerModal.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/portfolio-health/EmailComposerModal.tsx)**: A pre-filled email client form permitting VPs to coordinate operations directly from the dashboard.
4.  **[AuditDrawer.tsx](file:///c:/Users/Jaiadithya/Personal_Work_Related/SPS%20Agentic%20Bus/agentic_bus/src/components/dashboard/AuditDrawer.tsx)**: Toggled by clicking cards or KPI tooltips; details formulas, target benchmarks, and data assets.
