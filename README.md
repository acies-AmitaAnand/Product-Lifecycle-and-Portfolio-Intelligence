# Acies AgenticBus: Product Lifecycle & Portfolio Intelligence

This repository contains the front-end dashboard for **Acies AgenticBus**, a unified portfolio intelligence tool designed for FMCG (Fast-Moving Consumer Goods) multi-country enterprises. 

The dashboard visualizes complex supply chain and sales data to assist in product health monitoring, launch readiness, and SKU rationalization. It acts as an interface for a hypothetical "Agentic Bus" — a system of AI agents monitoring different aspects of the business.

View your app in AI Studio: [https://ai.studio/apps/48b72cee-cf3e-46b5-a8db-3a945f26f354](https://ai.studio/apps/48b72cee-cf3e-46b5-a8db-3a945f26f354)

## Overview

The application is built using **React (Vite)**, **TypeScript**, **Tailwind CSS**, and **Recharts**. It is designed to be highly interactive, responsive, and data-driven, providing distinct views depending on the user's role (VP Product Management, Product Manager, Pricing and Margin Partner).

### Key Features
*   **Role-Based Views**: KPI highlights dynamically adjust based on the selected user persona.
*   **Dark Mode**: Full support for light and dark themes.
*   **Agentic Sidebar ("How This Evolves")**: Explains the transition from current manual processes to the future AI-driven Agentic Bus.
*   **Data-Grounded Components**: All visualizations in Tab 0 are powered by real findings extracted from a source data analysis (see `docs/extracted_text.txt`).

## Project Structure & Data Flow

The `docs/` folder contains the source of truth for the dashboard's data:
*   `extracted_text.txt`: The definitive Q&A dataset derived from an FMCG data analysis notebook. This file bridges the data science work with the front end.

The data from `extracted_text.txt` is manually wired into `src/constants/data.ts`, which acts as the static data provider for all components.

### Current Status

**Tab 0: Portfolio Health Map** is currently the only fully developed tab. It includes:
*   **KPI Strip**: 8 critical metrics with semantic trend indicators (red/green based on risk).
*   **Value vs. Complexity Matrix**: A scatter plot segmenting SKUs into Keep, Grow, Consolidate, and Rationalize.
*   **Complexity Index**: A breakdown of the Portfolio Complexity Index (PCI) drivers against benchmarks, plus a regional complexity matrix.
*   **Revenue Concentration (Pareto)**: Highlights the reliance on top SKUs vs. the operational drag of the long tail.
*   **Channel Performance**: Compares margin efficiency, volatility, and stockout risk across retail channels.
*   **Stockout Heatmap**: Tracks the top 10 most fragile SKUs in the supply chain.
*   **Rationalization Simulator**: Models the financial and operational impact of removing low-performing SKUs.
*   **Action Priority Queue**: Ranks SKUs for immediate action based on their operational burden ratio.

**Tabs 1–4** (Launch Readiness, Profitability Tree, SKU Rationalization, Signals Board) are currently placeholders awaiting development.

## Recent Polish (Phase 1)

A recent polish pass on Tab 0 included:
*   **Semantic KPI Trends**: Added an `isRisk` flag to correctly color upward trends red for negative metrics (like complexity or stockouts).
*   **Dark Mode Compatibility**: Fixed hardcoded light-mode colors across various components (ComplexityIndex, StockoutHeatmap, ChannelPerformance) to use opacity-based Tailwind utilities that work seamlessly in both modes.
*   **Enhanced Tooltips**: Replaced native browser tooltips with custom, styled popovers on KPI cards for better readability.
*   **UI/UX Refinements**: Added animated pulse bars for highlighted KPIs, fixed z-index issues, and improved overall contrast and scrollbar aesthetics.

## Running Locally

**Prerequisites:** Node.js

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Run the development server:
    ```bash
    npm run dev
    ```
3.  Open your browser to the local URL provided by Vite (usually `http://localhost:3000/` or `http://localhost:5173/`).

## Next Steps

Refer to `docs/task.md` or `docs/init_report.md` (if available in your local setup) for the detailed development roadmap. The immediate next phase involves wiring up data for **Tab 3: SKU Rationalization** based on existing insights regarding promotional erosion and cannibalization risk.
