/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Rocket, Layers, Scissors, MessageSquare, Zap, LayoutDashboard, Award, BarChart3, AlertOctagon, Home, Cpu, ChevronRight, Search, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
import { Role } from './types/dashboard';

// Constants
import { KPIS, TABS, SKUS, PORTFOLIO_DATA } from './constants/data';

// Components
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { KPICard } from './components/dashboard/KPICard';
import { PortfolioHealthMap } from './components/dashboard/portfolio-health/PortfolioHealthMap';
import { LaunchReadinessDashboard } from './components/dashboard/launch-readiness/LaunchReadinessDashboard';
import { ExecutiveOverview } from './components/dashboard/executive/ExecutiveOverview';
import { ProfitabilityTree } from './components/dashboard/profitability/ProfitabilityTree';
import { SignalsBoard, VP_SIGNALS_DATA } from './components/dashboard/signals-board/SignalsBoard';
import { AuditDrawer } from './components/dashboard/AuditDrawer';
import { SKURationalization } from './components/dashboard/sku-rationalization/SKURationalization';
import { WelcomeGate } from './components/common/WelcomeGate';
import { TopDownDrilldown } from './components/dashboard/drilldown/TopDownDrilldown';
import { AgentOrchestrator } from './components/dashboard/orchestrator/AgentOrchestrator';
import { SkuDetailsModal } from './components/dashboard/executive/SkuDetailsModal';
import { AssortmentOverview } from './components/dashboard/assortment/AssortmentOverview';
import { SimplifyToGrow } from './components/dashboard/simplify-to-grow/SimplifyToGrow';

// Helper functions for safe localStorage & hash operations
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn(`localStorage not accessible for key ${key}:`, e);
    return null;
  }
};

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`localStorage not accessible for saving key ${key}:`, e);
  }
};

const getHashParam = (key: string): string | null => {
  try {
    const hash = window.location.hash || '#';
    const params = new URLSearchParams(hash.substring(1).replace(/\+/g, '%20'));
    return params.get(key);
  } catch (e) {
    return null;
  }
};

const updateHash = (key: string, value: string) => {
  try {
    const hash = window.location.hash || '#';
    const params = new URLSearchParams(hash.substring(1));
    params.set(key, value);
    window.history.replaceState(null, '', '#' + params.toString());
  } catch (e) {
    console.warn("Could not update URL hash:", e);
  }
};

const getTabDisplayName = (id: number, name: string): string => {
  switch (id) {
    case 0: return 'Home';
    case 1: return 'Portfolio Health';
    case 2: return 'Launch Readiness';
    case 3: return 'Profitability';
    case 4: return 'SKU Rationalize';
    case 5: return 'Signals Board';
    case 6: return 'Top-Down Drill';
    case 7: return 'Agent Orchestrator';
    case 8: return 'SKU Assortment';
    case 9: return 'Simplify Grow';
    default: return name;
  }
};


const getAgentThoughtsForTab = (tabId: number) => {
  switch (tabId) {
    case 1:
      return {
        agent: 'Portfolio Agent',
        role: 'Portfolio Complexity & Mix Monitor',
        colorClass: 'text-purple-550 dark:text-purple-400 border-purple-500/30 bg-purple-500/5',
        dotColor: 'bg-purple-500',
        borderColor: 'border-purple-500/25',
        bgColor: 'bg-purple-500/5',
        thoughts: [
          'Scanning portfolio: 102 SKUs loaded.',
          'Identified Dairy category as the highest friction point (27.78% margin dilution).',
          'Supplier fragmentation index at 1.20 (above 1.0 benchmark). Recommended SKU consolidation.'
        ]
      };
    case 2:
      return {
        agent: 'Supply Chain Agent',
        role: 'Logistics, Lead Times & Sourcing Planner',
        colorClass: 'text-orange-550 dark:text-orange-400 border-orange-500/30 bg-orange-500/5',
        dotColor: 'bg-orange-500',
        borderColor: 'border-orange-500/25',
        bgColor: 'bg-orange-500/5',
        thoughts: [
          'Monitoring launch readiness gates for 5 upcoming SKU releases.',
          'Detected sourcing delay on BrandD Organic Yogurt (sourcing lead time +14 days).',
          'Simulated raw milk supplier shock: recommended pre-positioning 2.5 weeks safety stock.'
        ]
      };
    case 3:
      return {
        agent: 'FP&A Agent',
        role: 'Financial Analyst & Cash Flow Forecaster',
        colorClass: 'text-purple-550 dark:text-purple-400 border-purple-500/30 bg-purple-500/5',
        dotColor: 'bg-purple-500',
        borderColor: 'border-purple-500/25',
        bgColor: 'bg-purple-500/5',
        thoughts: [
          'Simulated 3-statement models under inflation shock scenario.',
          'Alert: Margin dilution detected across 12 high-volume SKUs (diluting target gross margin from 40.0% to 38.53%).',
          'Cash runway forecasted at 14.2 months. Suggesting structural pricing correction.'
        ]
      };
    case 4:
      return {
        agent: 'Merchandiser Agent',
        role: 'Category Assortment & Inventory Optimizer',
        colorClass: 'text-emerald-550 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
        dotColor: 'bg-emerald-500',
        borderColor: 'border-emerald-500/25',
        bgColor: 'bg-emerald-500/5',
        thoughts: [
          'Analyzing promo dependencies: BrandD Water at 27.97% promo dependency.',
          'Flagged 35 "Rationalize" segment SKUs. Full removal cuts safety stock capital from $246M to $142M (saving 42.2%).',
          'Drafted transition path to phase out Dairy yogurt variants with >30% margin leakage.'
        ]
      };
    case 5:
      return {
        agent: 'Controller Agent',
        role: 'Real-time Ledger & Governance Auditor',
        colorClass: 'text-blue-550 dark:text-blue-400 border-blue-500/30 bg-blue-500/5',
        dotColor: 'bg-blue-500',
        borderColor: 'border-blue-500/25',
        bgColor: 'bg-blue-500/5',
        thoughts: [
          'Auditing real-time ledger records for MTD close.',
          'Flagged stockout exposure: Fabric Softener has 7 critical stockouts, causing $42k revenue leakage.',
          'Verified compliance of multi-currency transfer pricing across Italy and Spain.'
        ]
      };
    case 6:
      return {
        agent: 'Scenario Agent',
        role: 'Macro Simulation & Multi-Variable Optimizer',
        colorClass: 'text-amber-550 dark:text-amber-400 border-amber-500/30 bg-amber-500/5',
        dotColor: 'bg-amber-500',
        borderColor: 'border-amber-500/25',
        bgColor: 'bg-amber-500/5',
        thoughts: [
          'Drilldown engine running. Multi-variable target grids compiled.',
          'Regional analysis synced for Italy, Spain, France, and Germany.',
          'Ready to simulate target adjustments for Revenue, Margin, and OTIF across horizons.'
        ]
      };
    case 8:
      return {
        agent: 'Assortment Agent',
        role: 'Category Assortment & Regional Mix Optimizer',
        colorClass: 'text-rose-550 dark:text-rose-400 border-rose-500/30 bg-rose-500/5',
        dotColor: 'bg-rose-500',
        borderColor: 'border-rose-500/25',
        bgColor: 'bg-rose-500/5',
        thoughts: [
          'Assortment Optimization Model loaded: 102 SKUs registered.',
          'Netherlands identified as immediate opportunity: lowest gross margin at 38.20% with smallest footprint (45 SKUs).',
          'Beverages category flagged for high cannibalization risk (internal promo correlation index at -0.62).'
        ]
      };
    case 9:
      return {
        agent: 'Simplification Agent',
        role: 'Bain Simplify to Grow Flywheel Analyst',
        colorClass: 'text-indigo-550 dark:text-indigo-400 border-indigo-500/30 bg-indigo-500/5',
        dotColor: 'bg-indigo-500',
        borderColor: 'border-indigo-500/25',
        bgColor: 'bg-indigo-500/5',
        thoughts: [
          'IPPV model loaded for 29 SKUs. Top performer: BrandB Chips (78% household penetration, IPPV 100).',
          'Detected 8 Bad Complexity SKUs dragging portfolio flywheel score below 65.',
          'Complexity P&L analysis complete: Household category carries highest hidden cost burden. Recommend value chain review.'
        ]
      };
    default:
      return null;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<number>(() => {
    const tabParam = getHashParam('tab');
    if (tabParam !== null) {
      const parsed = parseInt(tabParam, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < TABS.length) return parsed;
    }
    const saved = safeGetItem('acies_active_tab');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < TABS.length) return parsed;
    }
    return 0;
  });

  const [role, setRole] = useState<Role>(() => {
    const roleParam = getHashParam('role');
    if (roleParam !== null) return roleParam as Role;
    
    const saved = safeGetItem('acies_role');
    return (saved as Role) || 'VP Product Management';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const themeParam = getHashParam('theme');
    if (themeParam !== null) return themeParam === 'dark';
    
    const saved = safeGetItem('acies_dark_mode');
    return saved === 'true';
  });

  const [activeAuditMetric, setActiveAuditMetric] = useState<string | null>(null);

  // Global Search bar states & hooks
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSkuForSearch, setSelectedSkuForSearch] = useState<any>(null);
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Focus search on Ctrl+K / Meta+K globally, or / when not typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputActive = document.activeElement && (
        document.activeElement.tagName === 'INPUT' || 
        document.activeElement.tagName === 'TEXTAREA' || 
        document.activeElement.getAttribute('contenteditable') === 'true'
      );

      const isCtrlK = (e.ctrlKey || e.metaKey) && (e.key?.toLowerCase() === 'k' || e.code === 'KeyK');
      const isSlash = e.key === '/' && !isInputActive;

      if (isCtrlK || isSlash) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select(); // Highlight existing text for quick typing
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  // Scroll highlighted search item into view
  useEffect(() => {
    if (activeSearchIndex >= 0) {
      const element = document.getElementById(`search-item-${activeSearchIndex}`);
      if (element) {
        element.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeSearchIndex]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // List of search items (navigation tabs + metrics + SKUs)
  const searchItems = (() => {
    const items: Array<{
      name: string;
      categoryName: string;
      type: 'metric' | 'sku' | 'tab';
      subtitle?: string;
      valueText?: string;
      rawKpiLabel?: string;
      skuData?: any;
      tabId?: number;
    }> = [];

    // Add all tabs/navigation views
    TABS.forEach(tab => {
      let description = '';
      if (tab.id === 0) description = 'Dashboard home, overview metrics, executive command center';
      else if (tab.id === 1) description = 'Portfolio health map, 2x2 matrix, revenue vs performance, quadrants';
      else if (tab.id === 2) description = 'New product launch, readiness gates, risk tracker';
      else if (tab.id === 3) description = 'Net profit calculation, margin simulator, value driver tree';
      else if (tab.id === 4) description = 'Sunset candidates, cannibalization, complexity reduction';
      else if (tab.id === 5) description = 'AI agent signals, stockout alerts, market demand';
      else if (tab.id === 6) description = 'Root cause analysis, SKU-level drilldown details';
      else if (tab.id === 7) description = 'AI agent team, simulation settings, macro scenarios';
      else if (tab.id === 8) description = 'Regional density, long-tail burden, cross-location transfer, assortment overview';

      items.push({
        name: tab.name,
        categoryName: 'Navigation Tabs',
        type: 'tab',
        subtitle: description || `Jump to ${tab.name} view`,
        valueText: `Tab ${tab.id + 1}`,
        tabId: tab.id
      });
    });

    // Add all unique KPI metrics across the application
    const uniqueMetrics = [
      { label: 'Total Revenue', value: '₹851.2 Cr' },
      { label: 'Gross Margin', value: '36.2%' },
      { label: 'Active SKUs', value: '127' },
      { label: 'Critical Alerts', value: '2' },
      { label: 'Net Sales (Portfolio)', value: '$473M' },
      { label: 'Avg Gross Margin', value: '38.53%' },
      { label: 'Revenue Concentration', value: '27.81%' },
      { label: 'Portfolio PCI', value: '0.5509' },
      { label: 'Long-Tail SKU Burden', value: '66.7%' },
      { label: 'Rationalize Candidates', value: '35 SKUs' },
      { label: 'Peak Stockout Freq.', value: '440 events' },
      { label: 'Revenue Tail Risk', value: '27.08%' },
      { label: 'Overall Readiness %', value: '82%' },
      { label: 'Net Profit', value: '₹95.2 Cr' },
      { label: 'Gross Profit', value: '₹308.1 Cr' },
      { label: 'Sunset Candidates', value: '6' },
      { label: 'Revenue at Risk', value: '₹148 Cr' },
      { label: 'Avg Complexity', value: '0.48' },
      { label: 'Total Active Signals', value: '6' },
      { label: 'Competitor Alerts', value: '2' },
      { label: 'Market Demand Change', value: '+18.4%' },
      { label: 'Customer Sentiment Score', value: '72' },
      { label: 'Portfolio Revenue', value: '₹851.4 Cr' },
      { label: 'Portfolio SKU Count', value: '102' },
      { label: 'Growth Rate', value: '8.4%' },
      { label: 'Orders — Today', value: '4232' },
      { label: 'Forecast Attainment', value: '94.6%' }
    ];

    uniqueMetrics.forEach(m => {
      items.push({
        name: m.label,
        categoryName: 'KPI Metrics',
        type: 'metric',
        subtitle: 'Open Audit Drawer & calculations',
        valueText: m.value,
        rawKpiLabel: m.label
      });
    });

    // Add SKUs
    SKUS.forEach(s => {
      const pData = PORTFOLIO_DATA.find(p => p.name === s.name);
      const segmentStr = pData ? ` • Segment: ${pData.segment}` : '';
      const stageStr = pData ? ` • Stage: ${pData.stage}` : '';

      items.push({
        name: s.name,
        categoryName: 'SKU Products',
        type: 'sku',
        subtitle: `Category: ${s.cat}${segmentStr}${stageStr} • Margin: ${s.margin}%`,
        valueText: `₹${s.rev}Cr`,
        skuData: s
      });
    });

    return items;
  })();

  // Filter items based on user search query using keyword matching (flexible search)
  const filteredSearchItems = searchQuery.trim() === ''
    ? []
    : (() => {
        const keywords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
        return searchItems.filter(item => {
          const searchText = `${item.name} ${item.categoryName} ${item.subtitle || ''}`.toLowerCase();
          return keywords.every(kw => searchText.includes(kw));
        });
      })();

  // Group search items for presentation
  const groupedSearchResults = filteredSearchItems.reduce<Record<string, typeof filteredSearchItems>>((acc, item) => {
    if (!acc[item.categoryName]) acc[item.categoryName] = [];
    acc[item.categoryName].push(item);
    return acc;
  }, {});

  const handleSelectSearchItem = (item: typeof searchItems[0]) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    setActiveSearchIndex(-1);
    searchInputRef.current?.blur();
    if (item.type === 'tab' && item.tabId !== undefined) {
      setActiveTab(item.tabId);
    } else if (item.type === 'metric' && item.rawKpiLabel) {
      setActiveAuditMetric(item.rawKpiLabel);
    } else if (item.type === 'sku' && item.skuData) {
      setSelectedSkuForSearch(item.skuData);
    }
  };

  const renderGlobalSearchBar = () => (
    <div ref={searchContainerRef} className="relative w-64 md:w-72">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
          <Search size={13} />
        </span>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setActiveSearchIndex(-1);
          }}
          onFocus={() => setIsSearchFocused(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveSearchIndex(prev => 
                filteredSearchItems.length ? (prev + 1) % filteredSearchItems.length : -1
              );
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveSearchIndex(prev => 
                filteredSearchItems.length ? (prev - 1 + filteredSearchItems.length) % filteredSearchItems.length : -1
              );
            } else if (e.key === 'Enter') {
              e.preventDefault();
              if (activeSearchIndex >= 0 && activeSearchIndex < filteredSearchItems.length) {
                handleSelectSearchItem(filteredSearchItems[activeSearchIndex]);
              } else if (filteredSearchItems.length > 0) {
                handleSelectSearchItem(filteredSearchItems[0]);
              }
            } else if (e.key === 'Escape') {
              e.preventDefault();
              setIsSearchFocused(false);
              searchInputRef.current?.blur();
            }
          }}
          placeholder="Search metrics or SKUs... (Ctrl+K or /)"
          className="w-full bg-black/5 dark:bg-white/5 border border-purple-500/60 dark:border-purple-400/50 rounded-full px-3 py-1 pl-8.5 pr-12 text-[10px] font-semibold text-zinc-800 dark:text-zinc-150 placeholder-zinc-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all animate-fadeIn"
        />
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
          <kbd className="text-[8px] font-bold bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 px-1 py-0.5 rounded-full text-zinc-400 dark:text-zinc-500 font-mono select-none">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isSearchFocused && searchQuery.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-full sm:w-[300px] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-black/15 dark:border-zinc-800/80 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-black/5 dark:divide-zinc-900"
          >
            {Object.keys(groupedSearchResults).length === 0 ? (
              <div className="p-4 text-center text-zinc-550 dark:text-zinc-400 text-[10px] font-bold">
                No results found for <span className="font-extrabold text-acies-yellow">"{searchQuery}"</span>
              </div>
            ) : (
              <div className="max-h-[260px] overflow-y-auto no-scrollbar py-2">
                {Object.entries(groupedSearchResults).map(([category, items]) => (
                  <div key={category} className="space-y-0.5">
                    <div className="px-3.5 py-1 text-[7.5px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 bg-black/[0.02] dark:bg-white/[0.01] border-b border-black/5 dark:border-white/5">
                      {category}
                    </div>
                    {items.map((item) => {
                      const itemIndex = filteredSearchItems.indexOf(item);
                      const isHighlighted = itemIndex === activeSearchIndex;
                      return (
                        <button
                          key={item.name}
                          id={`search-item-${itemIndex}`}
                          type="button"
                          onClick={() => handleSelectSearchItem(item)}
                          className={`w-full text-left px-3.5 py-1.5 transition-all flex items-center justify-between cursor-pointer border-none bg-transparent outline-none group ${
                            isHighlighted 
                              ? 'bg-acies-yellow/20 dark:bg-white/10 text-acies-yellow font-extrabold shadow-inner' 
                              : 'hover:bg-acies-yellow/10 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <p className={`text-[11px] font-bold transition-colors truncate ${
                              isHighlighted 
                                ? 'text-acies-yellow' 
                                : 'text-zinc-700 dark:text-zinc-200 group-hover:text-acies-yellow'
                            }`}>
                              {item.name}
                            </p>
                            {item.subtitle && (
                              <p className={`text-[9px] mt-0.5 truncate font-medium ${
                                isHighlighted ? 'text-zinc-300' : 'text-zinc-450 dark:text-zinc-400'
                              }`}>
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                          <span className="text-[9px] font-mono font-bold text-acies-yellow shrink-0 group-hover:underline">
                            {item.valueText}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const [launchTourActive, setLaunchTourActive] = useState(false);
  const [simulateDelay, setSimulateDelay] = useState(false);
  const [isProfitabilitySimulatorOpen, setIsProfitabilitySimulatorOpen] = useState<boolean>(false);
  const [showWelcomeGate, setShowWelcomeGate] = useState<boolean>(() => {
    const roleParam = getHashParam('role');
    if (roleParam !== null) return false;
    
    try {
      const sessionActive = sessionStorage.getItem('acies_session_active');
      return sessionActive === null;
    } catch (e) {
      return true;
    }
  });

  // Agent Floating Panel States
  const [isAgentWidgetExpanded, setIsAgentWidgetExpanded] = useState<boolean>(false);
  const [isAgentWidgetVisible, setIsAgentWidgetVisible] = useState<boolean>(true);
  const [agentMessageInput, setAgentMessageInput] = useState<string>('');
  const [isAgentTyping, setIsAgentTyping] = useState<boolean>(false);
  const [isExploreOpen, setIsExploreOpen] = useState<boolean>(false);
  const [agentChatHistory, setAgentChatHistory] = useState<Record<number, Array<{ sender: 'user' | 'agent', text: string }>>>({
    1: [{ sender: 'agent', text: 'Hello! I am the Portfolio Agent. I am monitoring the health of all 102 SKUs on this tab. Let me know if you would like me to compile complexity metrics or highlight low-performing segments!' }],
    2: [{ sender: 'agent', text: 'Hi, I am the Supply Chain Agent. Sourcing and lead time modeling is active. Sourcing delay on BrandD Yogurt detected. How can I assist you with launch timelines?' }],
    3: [{ sender: 'agent', text: 'Greetings, I am the FP&A Agent. Margin and cash flows are synced. I am monitoring structural profitability drivers. Let me know if you would like to run statement simulations!' }],
    4: [{ sender: 'agent', text: 'Hello, I am the Merchandiser Agent. Assortment planning and category sync is online. 35 "Rationalize" segment SKUs identified. How can I help optimize catalog complexity?' }],
    5: [{ sender: 'agent', text: 'Hi! I am the Controller Agent. Continuous Close auditing is active. Fabric Softener flagged with 7 stockout events. Let me know what compliance parameters to check.' }],
    6: [{ sender: 'agent', text: 'Greetings! I am the Scenario Agent. Macro simulation and target planning is ready. I can help configure target values across multiple time horizons.' }],
    8: [{ sender: 'agent', text: 'Hello, I am the Assortment Agent. I can help optimize SKU density across regions, reduce long-tail burden, and model demand transference. What assortment scenario would you like to run?' }],
    9: [{ sender: 'agent', text: 'Hello! I am the Simplification Agent. I have loaded the Bain Simplify to Grow flywheel for your portfolio. 8 Bad Complexity SKUs detected. Ready to walk you through IPPV rankings and the Complexity P&L breakdown.' }]
  });


  useEffect(() => {
    safeSetItem('acies_active_tab', activeTab.toString());
    updateHash('tab', activeTab.toString());
    setIsProfitabilitySimulatorOpen(false);
  }, [activeTab]);

  useEffect(() => {
    safeSetItem('acies_role', role);
    updateHash('role', role);
  }, [role]);

  useEffect(() => {
    safeSetItem('acies_dark_mode', isDarkMode.toString());
    updateHash('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const tabs = TABS.map(tab => {
     let icon = Activity;
     if (tab.id === 0) icon = Home;
     if (tab.id === 1) icon = Layers;
     if (tab.id === 2) icon = Rocket;
     if (tab.id === 3) icon = BarChart3;
     if (tab.id === 4) icon = Scissors;
     if (tab.id === 5) icon = AlertOctagon;
     if (tab.id === 6) icon = LayoutDashboard;
     if (tab.id === 7) icon = Cpu;
     if (tab.id === 8) icon = Award;
     if (tab.id === 9) icon = TrendingUp;
     return { ...tab, icon };
  });

  if (showWelcomeGate) {
    return (
      <WelcomeGate 
        onSelectRole={(selectedRole) => {
          setRole(selectedRole);
          try {
            sessionStorage.setItem('acies_session_active', 'true');
          } catch (e) {}
          setShowWelcomeGate(false);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen font-body bg-acies-offwhite dark:bg-acies-gray transition-colors pb-20">
      <Header 
        currentRole={role} 
        setRole={setRole} 
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onStartTour={() => {
          if (activeTab === 2) {
            setLaunchTourActive(true);
          }
        }}
        onClickHome={() => setActiveTab(0)}
        searchBar={renderGlobalSearchBar()}
      />

      <div className="max-w-[1600px] mx-auto px-6 py-6 font-body">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar Tabs Navigation */}
          <aside className="w-full lg:w-28 shrink-0 lg:sticky lg:top-16 self-start">
            <div className="flex flex-row lg:flex-col gap-3 lg:gap-3 p-3 lg:py-4 lg:px-1.5 bg-white dark:bg-white/5 border border-acies-yellow/15 dark:border-white/10 rounded-2xl items-center justify-start overflow-x-auto lg:overflow-y-auto lg:max-h-[calc(100vh-120px)] scroll-smooth no-scrollbar shadow-sm shadow-acies-yellow/5 transition-colors duration-200">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const displayName = getTabDisplayName(tab.id, tab.name);
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex flex-col items-center group cursor-pointer border-none bg-transparent outline-none transition-all duration-200 shrink-0 w-20"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-acies-yellow text-white dark:text-acies-gray shadow-md shadow-acies-yellow/20'
                          : 'bg-acies-yellow/5 dark:bg-white/5 text-acies-gray/60 dark:text-white/50 group-hover:bg-acies-yellow/10 group-hover:dark:bg-white/10 group-hover:text-acies-gray dark:group-hover:text-white'
                      }`}
                    >
                      <tab.icon
                        size={20}
                        strokeWidth={isActive ? 2 : 1.5}
                        className="transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                    <span
                      className={`mt-1.5 text-[9px] font-semibold text-center leading-tight tracking-wide break-words w-full px-1 transition-colors duration-200 ${
                        isActive 
                          ? 'text-acies-yellow font-bold' 
                          : 'text-acies-gray/50 dark:text-white/40 group-hover:text-acies-gray/80 dark:group-hover:text-white/70'
                      }`}
                    >
                      {displayName}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {activeTab !== 0 && !(activeTab === 3 && isProfitabilitySimulatorOpen) && !(activeTab === 4 && role === 'VP Product Management') && !(activeTab === 5 && isExploreOpen) && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-display leading-tight text-acies-gray dark:text-white">{tabs[activeTab]?.name || 'Unknown Module'}</h2>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-auto">
                   <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-acies-gray text-white text-[9px] font-bold uppercase tracking-widest hover:bg-acies-yellow hover:text-acies-gray transition-all cursor-pointer"
                  >
                    <Zap size={12} className="text-acies-yellow fill-acies-yellow" />
                    How This Evolves
                  </button>
                </div>
              </div>
            )}

            {activeTab !== 0 && (() => {
              const tabKpis = (() => {
                if (activeTab === 1) {
                  if (role === 'VP Product Management') return [];
                  return KPIS.filter(kpi => 
                    ['Net Sales (Portfolio)', 'Avg Gross Margin', 'Revenue Concentration', 'Long-Tail SKU Burden'].includes(kpi.label)
                  );
                }
                if (activeTab === 2 && role === 'VP Product Management') {
                  return [
                    {
                      label: 'Overall Readiness %',
                      value: simulateDelay ? '79%' : '82%',
                      trend: 'up',
                      trendValue: 'Across 25 Launches',
                      info: 'Average launch readiness index across all active product concepts and packaging timelines.',
                      highlight: ['VP Product Management']
                    },
                    {
                      label: 'Revenue Tail Risk',
                      value: simulateDelay ? '32.40%' : '27.08%',
                      trend: 'up',
                      trendValue: simulateDelay ? '+5.32% risk' : 'Full Rat. scenario',
                      info: 'Maximum revenue at risk if all 35 "Rationalize" segment SKUs are removed simultaneously.',
                      isRisk: true,
                      highlight: ['Pricing and Margin Partner']
                    },
                    {
                      label: 'Peak Stockout Freq.',
                      value: simulateDelay ? '582 events' : '440 events',
                      trend: 'up',
                      trendValue: simulateDelay ? '+142 events' : 'BrandC Biscuits',
                      info: 'Highest stockout frequency in portfolio: BrandC Biscuits (440) and BrandF Soap (440). Supply chain fragility signal.',
                      isRisk: true,
                      highlight: ['Product Manager']
                    },
                    {
                      label: 'Rationalize Candidates',
                      value: simulateDelay ? '38 SKUs' : '35 SKUs',
                      trend: 'up',
                      trendValue: simulateDelay ? '+3 flags' : '−27.08% tail risk',
                      info: 'Low Value / High Complexity. Full removal cuts safety stock by 42.2% but introduces 27.08% revenue tail risk.',
                      isRisk: true,
                      highlight: ['Product Manager']
                    }
                  ];
                }
                if (activeTab === 3 && role === 'VP Product Management') {
                  return [
                    {
                      label: 'Net Profit',
                      value: '₹95.2 Cr',
                      trend: 'up',
                      trendValue: '+4.2% YoY',
                      info: 'Total net profit after subtracting all operational expenses, leakage, cost-to-serve, and tax liabilities.',
                      highlight: ['VP Product Management']
                    },
                    {
                      label: 'Gross margin %',
                      value: '36.2%',
                      trend: 'up',
                      trendValue: '+1.1pp MTD',
                      info: 'Average gross margin percentage across all product lines and SKU categories.',
                      highlight: ['VP Product Management']
                    },
                    {
                      label: 'Gross Profit',
                      value: '₹308.1 Cr',
                      trend: 'up',
                      trendValue: '+2.4% YoY',
                      info: 'Total gross profit generated after subtracting all supplier COGS from net sales.',
                      highlight: ['VP Product Management']
                    },
                    {
                      label: 'Revenue MTD',
                      value: '₹851.2 Cr',
                      trend: 'up',
                      trendValue: '+8.4% vs last month',
                      info: 'Total portfolio revenue generated month-to-date (MTD) across all markets and channels.',
                      highlight: ['VP Product Management']
                    },
                    {
                      label: 'Launch ROI',
                      value: '1.85x',
                      trend: 'up',
                      trendValue: 'Above Q3 target',
                      info: 'Return on investment for newly launched product variants and category expansions (Q3 target of 1.50x).',
                      highlight: ['VP Product Management']
                    }
                  ];
                }
                if (activeTab === 5 && role === 'VP Product Management') {
                  return [
                    {
                      label: 'Total Active Signals',
                      value: String(VP_SIGNALS_DATA.length),
                      trend: 'neutral',
                      trendValue: 'Active alerts',
                      info: 'Total volume of active, unresolved alerts and notifications requiring executive attention.',
                      highlight: ['VP Product Management']
                    },
                    {
                      label: 'Competitor Alerts',
                      value: String(VP_SIGNALS_DATA.filter(s => s.type === 'Competitor').length),
                      trend: 'up',
                      trendValue: 'Active campaigns',
                      info: 'Total volume of active competitor campaign alerts, launches, and discount warnings.',
                      highlight: ['VP Product Management']
                    },
                    {
                      label: 'Active Stockouts',
                      value: '7',
                      trend: 'up',
                      trendValue: '3 Threshold',
                      info: 'Number of active stockouts across regional distribution centers.',
                      isRisk: true,
                      highlight: ['VP Product Management']
                    },
                    {
                      label: 'Market Demand Change',
                      value: '+18.4%',
                      trend: 'up',
                      trendValue: 'APAC Beverages',
                      info: 'Aggregate demand growth and consumer velocity index across high-priority APAC markets.',
                      highlight: ['VP Product Management']
                    },
                    {
                      label: 'Customer Sentiment Score',
                      value: '72',
                      trend: 'up',
                      trendValue: '72 NPS Index',
                      info: 'Aggregate Net Promoter Score (NPS) across high-volume beverage and snacks categories.',
                      highlight: ['VP Product Management']
                    }
                  ];
                }
                if (activeTab === 4) {
                  return [];
                }
                if (activeTab === 6) {
                  return [];
                }
                if (activeTab === 8) {
                  return [];
                }
                if (activeTab === 9) {
                  return [];
                }
                return KPIS;
              })();

              const gridClass = (() => {
                if (activeTab === 1) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
                if (activeTab === 2 && role === 'VP Product Management') return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
                if (activeTab === 3 && role === 'VP Product Management') return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5';
                if (activeTab === 4 && role === 'VP Product Management') return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
                if (activeTab === 5 && role === 'VP Product Management') return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5';
                return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8';
              })();

              if (tabKpis.length === 0 || (activeTab === 3 && isProfitabilitySimulatorOpen) || (activeTab === 5 && isExploreOpen)) return null;

              return (
                <div className={`grid gap-3 mb-6 ${gridClass}`}>
                  {tabKpis.map((kpi, i) => (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <KPICard 
                        kpi={kpi} 
                        role={role} 
                        onAuditClick={() => setActiveAuditMetric(kpi.label)}
                      />
                    </motion.div>
                  ))}
                </div>
              );
            })()}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 0 && (
                  <ExecutiveOverview 
                    role={role} 
                    setActiveTab={setActiveTab} 
                    isDarkMode={isDarkMode} 
                    onAuditClick={setActiveAuditMetric} 
                  />
                )}
                {activeTab === 1 && <PortfolioHealthMap role={role} isDarkMode={isDarkMode} onAuditClick={setActiveAuditMetric} />}
                {activeTab === 2 && (
                  <LaunchReadinessDashboard 
                    role={role} 
                    onAuditClick={setActiveAuditMetric} 
                    tourActive={launchTourActive}
                    onTourClose={() => setLaunchTourActive(false)}
                    isDarkMode={isDarkMode}
                    simulateDelay={simulateDelay}
                    setSimulateDelay={setSimulateDelay}
                  />
                )}
                {activeTab === 3 && (
                  <ProfitabilityTree 
                    role={role} 
                    onAuditClick={setActiveAuditMetric} 
                    isDarkMode={isDarkMode} 
                    isSimulatorOpen={isProfitabilitySimulatorOpen}
                    setIsSimulatorOpen={setIsProfitabilitySimulatorOpen}
                  />
                )}
                {activeTab === 4 && <SKURationalization role={role} isDarkMode={isDarkMode} setActiveTab={setActiveTab} />}
                {activeTab === 5 && <SignalsBoard role={role} setActiveTab={setActiveTab} isDarkMode={isDarkMode} onExploreToggle={setIsExploreOpen} />}
                {activeTab === 6 && <TopDownDrilldown isDarkMode={isDarkMode} role={role} />}
                {activeTab === 7 && <AgentOrchestrator isDarkMode={isDarkMode} role={role} />}
                {activeTab === 8 && <AssortmentOverview role={role} isDarkMode={isDarkMode} onAuditClick={setActiveAuditMetric} />}
                {activeTab < 0 || activeTab > 8 ? (
                  <div className="flex flex-col items-center justify-center min-h-[550px] glass-card">
                    <div className="w-16 h-16 rounded-full bg-acies-yellow/10 flex items-center justify-center mb-6">
                      <Zap size={32} className="text-acies-yellow" />
                    </div>
                    <h3 className="font-display text-2xl mb-1">{tabs[activeTab]?.name || 'Unknown Module'}</h3>
                    <p className="text-xs uppercase tracking-[0.2em] opacity-40 mb-8 underline underline-offset-8 decoration-acies-yellow decoration-2">Development Phase: Core Logic Integration</p>
                    <div className="max-w-md text-center opacity-60 text-sm leading-relaxed">
                      This module is being architected to integrate real-time competitor signals, SKU-level elasticity models, and automated rationalization simulations.
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} close={() => setIsSidebarOpen(false)} />
      <AuditDrawer activeMetric={activeAuditMetric} close={() => setActiveAuditMetric(null)} isDarkMode={isDarkMode} />
      <SkuDetailsModal 
        isOpen={!!selectedSkuForSearch} 
        sku={selectedSkuForSearch} 
        onClose={() => setSelectedSkuForSearch(null)}
        onRequestAction={(recipientEmail, recipientName, subject, body) => {
          alert(`Mitigation request email successfully sent to ${recipientName} (${recipientEmail})!`);
          setSelectedSkuForSearch(null);
        }}
      />

      <footer className="mt-10 border-t border-black/5 dark:border-white/5 py-6 px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8">
            <button className="text-[9px] font-bold uppercase tracking-[0.1em] opacity-40 hover:opacity-100 hover:text-acies-yellow transition-all flex items-center gap-2 group">
              Diagnostic Workshop
            </button>
            <button className="text-[9px] font-bold uppercase tracking-[0.1em] opacity-40 hover:opacity-100 hover:text-acies-yellow transition-all flex items-center gap-2 group">
              Use Cases
            </button>
            <button className="text-[9px] font-bold uppercase tracking-[0.1em] opacity-40 hover:opacity-100 hover:text-acies-yellow transition-all flex items-center gap-2 group">
              Lab Explorer
            </button>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-[9px] opacity-30 font-medium uppercase tracking-widest mb-0.5">Acies Virtual Labs • April 2026</p>
            <p className="text-[8px] opacity-20 uppercase font-bold">Confidential Commercial Asset</p>
          </div>
        </div>
      </footer>

      {((activeTab >= 1 && activeTab <= 6) || activeTab === 8) && isAgentWidgetVisible && (() => {
        const currentAgentId = activeTab === 4 && safeGetItem('sku_rationalization_active_view') === 'simplify' ? 9 : activeTab;
        const thoughtsData = getAgentThoughtsForTab(currentAgentId);
        if (!thoughtsData) return null;
        const chatHistory = agentChatHistory[currentAgentId] || [];

        const handleSendMessage = (e: React.FormEvent) => {
          e.preventDefault();
          if (!agentMessageInput.trim()) return;

          const userMsg = agentMessageInput;
          // Add user message
          setAgentChatHistory(prev => ({
            ...prev,
            [currentAgentId]: [...(prev[currentAgentId] || []), { sender: 'user', text: userMsg }]
          }));
          setAgentMessageInput('');
          setIsAgentTyping(true);

          // Simulate agent typing dynamic reply
          setTimeout(() => {
            setIsAgentTyping(false);
            let replyText = '';
            
            const lowerMsg = userMsg.toLowerCase();
            if (lowerMsg.includes('help') || lowerMsg.includes('what can you do') || lowerMsg.includes('capabilities')) {
              replyText = `I specialize in ${thoughtsData.role}. On this tab, my key observations are: ${thoughtsData.thoughts.join(' ')}`;
            } else if (currentAgentId === 8) {
              if (lowerMsg.includes('area') || lowerMsg.includes('region') || lowerMsg.includes('country') || lowerMsg.includes('category')) {
                replyText = `Here is the top performing SKU per area:
• Beverages: BrandF Water (₹17.03 Cr)
• Snacks: BrandC Chips (₹16.00 Cr)
• Personal Care: BrandC Toothpaste (₹12.97 Cr)
• Dairy: BrandD Cheese (₹11.20 Cr)
• Home Care: BrandB Detergent (₹9.20 Cr)

Geographically, Italy's top seller is BrandF Water, while Spain is led by BrandC Chips and Germany by BrandB Chips.`;
              } else if (lowerMsg.includes('best') || lowerMsg.includes('top') || lowerMsg.includes('highest')) {
                replyText = `Based on our multi-country sales data, our best performing SKU by Net Sales is BrandF Water (₹17.03 Cr) and by Gross Margin is also BrandF Water (₹6.83 Cr), followed closely by BrandC Chips (₹16.00 Cr).`;
              } else if (lowerMsg.includes('worst') || lowerMsg.includes('lowest') || lowerMsg.includes('leakage') || lowerMsg.includes('drag') || lowerMsg.includes('burden')) {
                replyText = `The worst performing SKU in terms of growth is Fabric Softener (-22.2% growth, 15% margin). Also, Dairy has the highest concentration of low-performing items at 27.78%, and 66.7% of our catalog (68 SKUs) represents a long-tail burden contributing <1% revenue.`;
              } else if (lowerMsg.includes('netherlands') || lowerMsg.includes('gap') || lowerMsg.includes('realignment') || lowerMsg.includes('austria')) {
                replyText = `The Netherlands holds our smallest footprint (45 SKUs) but yields the lowest gross margin (38.20%). Realigning its mix to match the Austria benchmark of 38.64% is our top assortment opportunity.`;
              } else if (lowerMsg.includes('cannibalization') || lowerMsg.includes('overlap') || lowerMsg.includes('correlation')) {
                replyText = `Beverages is the category with the highest cannibalization risk. The pair correlation coefficient reaches -0.62 for Mango Fizz variants, meaning promotions on one variant heavily steal sales from the other.`;
              } else {
                replyText = `As the Assortment Agent, I am monitoring SKU counts, regional margin gaps, and substitution risks. Ask me about the 'best performing SKU', 'Netherlands margin gap', 'long-tail burden', or 'cannibalization correlation'.`;
              }
            } else if (currentAgentId === 1) {
              if (lowerMsg.includes('worst') || lowerMsg.includes('dairy') || lowerMsg.includes('drag')) {
                replyText = `Dairy is currently our biggest drag with 27.78% margin dilution. The supplier fragmentation index stands at 1.20, which is well above our 1.0 benchmark.`;
              } else if (lowerMsg.includes('count') || lowerMsg.includes('skus') || lowerMsg.includes('size')) {
                replyText = `The portfolio currently tracks 102 active SKUs across 6 major brands, generating $473M annual net sales.`;
              } else {
                replyText = `I am tracking portfolio complexity and mix. Ask me about 'Dairy margin dilution', 'supplier fragmentation index', or 'active SKU counts'.`;
              }
            } else if (currentAgentId === 2) {
              if (lowerMsg.includes('delay') || lowerMsg.includes('yogurt') || lowerMsg.includes('sourcing')) {
                replyText = `We have a sourcing delay on BrandD Organic Yogurt (+14 days lead time). We have simulated a raw milk supplier shock and recommend holding 2.5 weeks of safety stock.`;
              } else {
                replyText = `I am monitoring launch readiness gates. Ask me about 'sourcing delays', 'Yogurt lead times', or 'safety stock recommendations'.`;
              }
            } else if (currentAgentId === 3) {
              if (lowerMsg.includes('dilution') || lowerMsg.includes('margin') || lowerMsg.includes('cogs')) {
                replyText = `12 high-volume SKUs are diluting our gross margin from the 40.0% target to 38.53%. Cash runway is forecasted at 14.2 months, suggesting a structural pricing correction is needed.`;
              } else {
                replyText = `I am analyzing cash flows and margin dilution. Ask me about 'margin dilution drivers', 'cogs inflation', or 'cash runway projections'.`;
              }
            } else if (currentAgentId === 4) {
              if (lowerMsg.includes('rationalize') || lowerMsg.includes('sunset') || lowerMsg.includes('prune')) {
                replyText = `Removing all 35 'Rationalize' candidate SKUs will free up safety stock capital from $246M to $142M (saving 42.2%), but introduces a 27.08% revenue tail risk.`;
              } else {
                replyText = `I optimize catalog complexity and inventory buffers. Ask me about 'rationalization candidates', 'safety stock capital savings', or 'revenue tail risk'.`;
              }
            } else if (currentAgentId === 5) {
              if (lowerMsg.includes('stockout') || lowerMsg.includes('leakage') || lowerMsg.includes('softener')) {
                replyText = `Fabric Softener has 7 critical stockout events, causing $42k in revenue leakage. We recommend reviewing multi-currency transfer pricing compliance as well.`;
              } else {
                replyText = `I audit compliance, stockouts, and ledger health. Ask me about 'Fabric Softener stockouts' or 'revenue leakage'.`;
              }
            } else if (currentAgentId === 9) {
              if (lowerMsg.includes('hidden') || lowerMsg.includes('cost') || lowerMsg.includes('burden') || lowerMsg.includes('p&l') || lowerMsg.includes('downtime')) {
                replyText = `Based on the Bain Simplify to Grow flywheel:
• Total Hidden Supply Chain Cost is ₹84.8L.
• Household category carries the highest hidden cost burden of ₹24.2L (production downtime ₹12L, transport ₹7.2L, waste ₹5L).
• Fabric Softener is our worst performer, costing ₹1.45L in production downtime alone.`;
              } else if (lowerMsg.includes('ippv') || lowerMsg.includes('penetration') || lowerMsg.includes('variety') || lowerMsg.includes('best') || lowerMsg.includes('top')) {
                replyText = `Under the 'Consumer-Right' pillar, BrandB Chips is our top performer with 78% household penetration and an IPPV score of 100.0. We have 4 Good Variety SKUs that we should protect and invest in.`;
              } else if (lowerMsg.includes('bad complexity') || lowerMsg.includes('prune') || lowerMsg.includes('eliminate') || lowerMsg.includes('candidates')) {
                replyText = `We have identified 8 Bad Complexity SKUs in the portfolio (IPPV < 30 and Complexity > 0.50). Pruning these will improve our flywheel score and eliminate up to ₹32.4L in hidden operational costs.`;
              } else {
                replyText = `I am the Simplification Agent. Ask me about 'hidden cost burden', 'worst performers by downtime', 'IPPV rankings', or 'Bad Complexity SKUs'.`;
              }
            } else if (lowerMsg.includes('simulate') || lowerMsg.includes('change') || lowerMsg.includes('run') || lowerMsg.includes('scenario') || lowerMsg.includes('driver')) {
              replyText = `Understood. Multi-variable simulation and scenario adjustment is managed centrally. Please navigate to the Agent Orchestrator (Tab 7) to trigger macro scenarios like Inflation Shock or Freight Delays.`;
            } else {
              replyText = `Interesting query about this workspace! As the ${thoughtsData.agent}, I am tracking compliance ledgers and portfolio variables. Switch to Tab 7 (Agent Orchestrator) to run detailed simulation scenarios.`;
            }

            setAgentChatHistory(prev => ({
              ...prev,
              [currentAgentId]: [...(prev[currentAgentId] || []), { sender: 'agent', text: replyText }]
            }));
          }, 1200);
        };

        return (
          <div className="fixed bottom-6 right-6 z-50 animate-fadeIn font-body text-zinc-800 dark:text-white">
            {isAgentWidgetExpanded ? (
              <div className="w-[340px] md:w-[380px] bg-white dark:bg-[#1a1a24] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[500px]">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${thoughtsData.dotColor} animate-pulse`} />
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                        {thoughtsData.agent}
                      </h4>
                      <p className="text-[7.5px] opacity-40 uppercase tracking-widest font-semibold">{thoughtsData.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => setIsAgentWidgetExpanded(false)}
                      className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors text-zinc-500 cursor-pointer border-none bg-transparent"
                      title="Collapse"
                    >
                      <ChevronRight size={14} className="rotate-90" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsAgentWidgetVisible(false)}
                      className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors text-zinc-500 cursor-pointer border-none bg-transparent"
                      title="Hide Completely"
                    >
                      <span className="text-[10px] font-bold px-1">&times;</span>
                    </button>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[220px] bg-zinc-50/50 dark:bg-zinc-950/20">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-lg p-2.5 text-[9.5px] leading-relaxed shadow-sm ${
                        msg.sender === 'user' 
                          ? 'bg-acies-yellow text-white dark:text-acies-gray font-medium' 
                          : 'bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/5 text-zinc-700 dark:text-zinc-200'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAgentTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/5 rounded-lg p-2.5 text-[8.5px] text-zinc-400 italic flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-100" />
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-200" />
                        <span>Agent is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Observations / Thoughts Feed */}
                <div className="px-4 py-2.5 bg-acies-yellow/[0.02] dark:bg-white/[0.01] border-t border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Zap size={10} className="text-acies-yellow" />
                    <span className="text-[7.5px] uppercase font-bold text-zinc-400 tracking-wider">Active Workspace Observations:</span>
                  </div>
                  <ul className="space-y-1 text-[8.5px] leading-relaxed text-zinc-500 dark:text-zinc-400 list-disc list-inside">
                    {thoughtsData.thoughts.map((thought, idx) => (
                      <li key={idx} className="truncate" title={thought}>{thought}</li>
                    ))}
                  </ul>
                </div>

                {/* Chat Input & Orchestrator Action Link */}
                <div className="p-3 bg-white dark:bg-zinc-900 space-y-2 border-t border-black/5 dark:border-white/5">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      value={agentMessageInput}
                      onChange={(e) => setAgentMessageInput(e.target.value)}
                      placeholder={`Ask ${thoughtsData.agent}...`}
                      className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded px-2.5 py-1.5 text-[9.5px] outline-none focus:border-acies-yellow dark:text-white"
                    />
                    <button 
                      type="submit" 
                      className="bg-acies-yellow text-white dark:text-acies-gray font-bold text-[8.5px] uppercase tracking-wider px-3 py-1.5 rounded transition-all hover:brightness-105 active:scale-95 cursor-pointer border-none outline-none"
                    >
                      Send
                    </button>
                  </form>
                  <button 
                    type="button"
                    onClick={() => setActiveTab(7)}
                    className="w-full text-center text-[8.5px] font-bold text-acies-yellow uppercase tracking-widest py-1 hover:underline flex items-center justify-center gap-1 cursor-pointer bg-transparent border-none outline-none"
                  >
                    <span>Manage Agent in Orchestrator</span>
                    <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => setIsAgentWidgetExpanded(true)}
                className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center relative transition-transform hover:scale-105 cursor-pointer border-none outline-none ${
                  thoughtsData.agent === 'Portfolio Agent' || thoughtsData.agent === 'FP&A Agent' ? 'bg-purple-600' :
                  thoughtsData.agent === 'Supply Chain Agent' ? 'bg-orange-600' :
                  thoughtsData.agent === 'Merchandiser Agent' ? 'bg-emerald-600' :
                  thoughtsData.agent === 'Controller Agent' ? 'bg-blue-600' : 'bg-amber-600'
                }`}
                title={`Open ${thoughtsData.agent} Assistant`}
              >
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white animate-pulse" />
                <Cpu size={20} className="text-white" />
              </button>
            )}
          </div>
        );
      })()}

      {/* Floating Restore Button if hidden */}
      {!isAgentWidgetVisible && ((activeTab >= 1 && activeTab <= 6) || activeTab === 8 || activeTab === 9) && (
        <button
          type="button"
          onClick={() => {
            setIsAgentWidgetVisible(true);
            setIsAgentWidgetExpanded(true);
          }}
          className="fixed bottom-6 right-6 z-50 px-3 py-1.5 bg-acies-gray text-white dark:bg-white dark:text-acies-gray border border-black/10 dark:border-white/10 rounded-full shadow-lg text-[8.5px] font-bold uppercase tracking-wider cursor-pointer"
        >
          Restore Agent Presence
        </button>
      )}
    </div>
  );
}
