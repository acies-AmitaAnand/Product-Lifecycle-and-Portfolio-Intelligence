/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Rocket, Layers, Scissors, AlertOctagon, Home, Cpu, Award, BarChart3, LayoutDashboard, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
import { Role } from './types/dashboard';

// Constants
import { KPIS, TABS, SKUS, PORTFOLIO_DATA } from './constants/data';
import { getAgentThoughtsForTab } from './constants/agentData';

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
import { GlobalSearchBar } from './components/common/GlobalSearchBar';
import { AgentWidget } from './components/common/AgentWidget';

// Utils / Hooks
import { TimelineRange, getFilteredKPIS, getFilteredSKUS, getFilteredPortfolioData } from './utils/timeframe';
import { safeGetItem, safeSetItem, getHashParam, updateHash } from './utils/hash';
import { useGlobalSearch } from './hooks/useGlobalSearch';
import { useAgentWidget } from './hooks/useAgentWidget';

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
    default: return name;
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

  const [timelineRange, setTimelineRange] = useState<TimelineRange>(() => {
    const timeParam = getHashParam('timeline') as TimelineRange | null;
    if (timeParam !== null && ['1m', '3m', '6m', '12m', '24m', '36m'].includes(timeParam)) return timeParam;
    
    const saved = safeGetItem('acies_timeline_range') as TimelineRange | null;
    if (saved !== null && ['1m', '3m', '6m', '12m', '24m', '36m'].includes(saved)) return saved;
    
    return '12m';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const themeParam = getHashParam('theme');
    if (themeParam !== null) return themeParam === 'dark';
    
    const saved = safeGetItem('acies_dark_mode');
    return saved === 'true';
  });

  const [activeAuditMetric, setActiveAuditMetric] = useState<string | null>(null);

  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  const timelineRangeRef = useRef(timelineRange);
  timelineRangeRef.current = timelineRange;

  // Timeframe filtered base datasets
  const filteredSKUS = getFilteredSKUS(SKUS, timelineRange);
  const filteredPortfolioData = getFilteredPortfolioData(PORTFOLIO_DATA, timelineRange);
  const filteredKPIS = getFilteredKPIS(KPIS, timelineRange);

  // Focus and Selection callbacks for Search
  const [selectedSkuForSearch, setSelectedSkuForSearch] = useState<any>(null);

  const {
    searchQuery,
    setSearchQuery,
    isSearchFocused,
    setIsSearchFocused,
    activeSearchIndex,
    setActiveSearchIndex,
    searchInputRef,
    searchContainerRef,
    filteredSearchItems,
    groupedSearchResults,
    handleSelectSearchItem,
    handleKeyDownInput,
  } = useGlobalSearch(
    filteredSKUS,
    filteredPortfolioData,
    (tabId) => setActiveTab(tabId),
    (metricLabel) => setActiveAuditMetric(metricLabel),
    (skuData) => setSelectedSkuForSearch(skuData)
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

  const viewParam = getHashParam('view');
  const thoughtsData = getAgentThoughtsForTab(activeTab, viewParam);

  const {
    isAgentWidgetExpanded,
    setIsAgentWidgetExpanded,
    isAgentWidgetVisible,
    setIsAgentWidgetVisible,
    agentMessageInput,
    setAgentMessageInput,
    isAgentTyping,
    currentChatHistory,
    handleSendMessage,
  } = useAgentWidget(
    activeTab,
    viewParam,
    thoughtsData,
    () => setActiveTab(7)
  );

  useEffect(() => {
    // Reset simulator if switching away from Tab 3 and it's not open in the URL
    if (activeTab !== 3) {
      const hash = window.location.hash || '#';
      const params = new URLSearchParams(hash.substring(1).replace(/\+/g, '%20'));
      if (params.get('simulator') !== 'true') {
        setIsProfitabilitySimulatorOpen(false);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#';
      const params = new URLSearchParams(hash.substring(1).replace(/\+/g, '%20'));
      
      const tabParam = params.get('tab');
      if (tabParam !== null) {
        const parsed = parseInt(tabParam, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < TABS.length && parsed !== activeTabRef.current) {
          setActiveTab(parsed);
        }
      }

      const timeParam = params.get('timeline') as TimelineRange | null;
      if (timeParam !== null && ['1m', '3m', '6m', '12m', '24m', '36m'].includes(timeParam) && timeParam !== timelineRangeRef.current) {
        setTimelineRange(timeParam);
      }

      const metricParam = params.get('metric');
      if (metricParam !== null) {
        setActiveAuditMetric(metricParam);
      }

      const simParam = params.get('simulator');
      if (simParam === 'true') {
        setIsProfitabilitySimulatorOpen(true);
      } else if (simParam === 'false') {
        setIsProfitabilitySimulatorOpen(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Consolidated source of truth to sync React states to localStorage & URL hash
  useEffect(() => {
    safeSetItem('acies_active_tab', activeTab.toString());
    safeSetItem('acies_role', role);
    safeSetItem('acies_timeline_range', timelineRange);
    safeSetItem('acies_dark_mode', isDarkMode.toString());

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      const params = new URLSearchParams();
      params.set('tab', activeTab.toString());
      params.set('role', role);
      params.set('timeline', timelineRange);
      params.set('theme', isDarkMode ? 'dark' : 'light');
      if (isProfitabilitySimulatorOpen) {
        params.set('simulator', 'true');
      }
      
      const newHash = '#' + params.toString();
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    } catch (e) {
      console.warn("Could not sync state to URL hash:", e);
    }
  }, [activeTab, role, timelineRange, isDarkMode, isProfitabilitySimulatorOpen]);

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

  const [isExploreOpen, setIsExploreOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen font-body bg-acies-offwhite dark:bg-acies-gray transition-colors pb-20">
      <Header 
        currentRole={role} 
        setRole={setRole} 
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        timelineRange={timelineRange}
        setTimelineRange={setTimelineRange}
        activeTab={activeTab}
        onStartTour={() => {
          if (activeTab === 2) {
            setLaunchTourActive(true);
          }
        }}
        onClickHome={() => setActiveTab(0)}
        searchBar={
          <GlobalSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
            activeSearchIndex={activeSearchIndex}
            setActiveSearchIndex={setActiveSearchIndex}
            searchInputRef={searchInputRef}
            searchContainerRef={searchContainerRef}
            filteredSearchItems={filteredSearchItems}
            groupedSearchResults={groupedSearchResults}
            handleSelectSearchItem={handleSelectSearchItem}
            handleKeyDownInput={handleKeyDownInput}
          />
        }
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
                  return filteredKPIS.filter(kpi => 
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
                return filteredKPIS;
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
                    timelineRange={timelineRange}
                  />
                )}
                {activeTab === 1 && <PortfolioHealthMap role={role} isDarkMode={isDarkMode} onAuditClick={setActiveAuditMetric} timelineRange={timelineRange} />}
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
                    timelineRange={timelineRange}
                  />
                )}
                {activeTab === 4 && <SKURationalization role={role} isDarkMode={isDarkMode} setActiveTab={setActiveTab} timelineRange={timelineRange} />}
                {activeTab === 5 && <SignalsBoard role={role} setActiveTab={setActiveTab} isDarkMode={isDarkMode} onExploreToggle={setIsExploreOpen} />}
                {activeTab === 6 && <TopDownDrilldown isDarkMode={isDarkMode} role={role} timelineRange={timelineRange} setTimelineRange={setTimelineRange} />}
                {activeTab === 7 && <AgentOrchestrator isDarkMode={isDarkMode} role={role} />}
                {activeTab === 8 && <AssortmentOverview role={role} isDarkMode={isDarkMode} onAuditClick={setActiveAuditMetric} timelineRange={timelineRange} />}
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

      {/* Floating Agent Assistant Widget */}
      {((activeTab >= 1 && activeTab <= 6) || activeTab === 8) && thoughtsData && (
        <AgentWidget
          thoughtsData={thoughtsData}
          isAgentWidgetExpanded={isAgentWidgetExpanded}
          setIsAgentWidgetExpanded={setIsAgentWidgetExpanded}
          isAgentWidgetVisible={isAgentWidgetVisible}
          setIsAgentWidgetVisible={setIsAgentWidgetVisible}
          agentMessageInput={agentMessageInput}
          setAgentMessageInput={setAgentMessageInput}
          isAgentTyping={isAgentTyping}
          currentChatHistory={currentChatHistory}
          handleSendMessage={handleSendMessage}
          onNavigateToOrchestrator={() => setActiveTab(7)}
        />
      )}
    </div>
  );
}
