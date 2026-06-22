import { useState, useMemo } from 'react';
import { AgentThoughts } from '../constants/agentData';

export const useAgentWidget = (
  activeTab: number,
  viewParam: string | null,
  thoughtsData: AgentThoughts | null,
  onNavigateToOrchestrator: () => void
) => {
  const [isAgentWidgetExpanded, setIsAgentWidgetExpanded] = useState<boolean>(false);
  const [isAgentWidgetVisible, setIsAgentWidgetVisible] = useState<boolean>(true);
  const [agentMessageInput, setAgentMessageInput] = useState<string>('');
  const [isAgentTyping, setIsAgentTyping] = useState<boolean>(false);

  const [agentChatHistory, setAgentChatHistory] = useState<Record<string, Array<{ sender: 'user' | 'agent', text: string }>>>({
    '1': [{ sender: 'agent', text: 'Hello! I am the Portfolio Agent. I am monitoring the health of all 100 SKUs on this tab. Let me know if you would like me to compile complexity metrics or highlight low-performing segments!' }],
    '2': [{ sender: 'agent', text: 'Hi, I am the Supply Chain Agent. Sourcing and lead time modeling is active. Sourcing delay on BrandD Yogurt detected. How can I assist you with launch timelines?' }],
    '3': [{ sender: 'agent', text: 'Greetings, I am the FP&A Agent. Margin and cash flows are synced. I am monitoring structural profitability drivers. Let me know if you would like to run statement simulations!' }],
    '4': [{ sender: 'agent', text: 'Hello, I am the Merchandiser Agent. Assortment planning and category sync is online. 35 "Rationalize" segment SKUs identified. How can I help optimize catalog complexity?' }],
    '4-simplify': [{ sender: 'agent', text: 'Hello! I am the Simplification Agent. I have loaded the Bain Simplify to Grow flywheel for your portfolio. 8 Bad Complexity SKUs detected. Ready to walk you through IPPV rankings and the Complexity P&L breakdown.' }],
    '5': [{ sender: 'agent', text: 'Hi! I am the Controller Agent. Continuous Close auditing is active. Fabric Softener flagged with 7 stockout events. Let me know what compliance parameters to check.' }],
    '6': [{ sender: 'agent', text: 'Greetings! I am the Scenario Agent. Macro simulation and target planning is ready. I can help configure target values across multiple time horizons.' }],
    '8': [{ sender: 'agent', text: 'Hello, I am the Assortment Agent. I can help optimize SKU density across regions, reduce long-tail burden, and model demand transference. What assortment scenario would you like to run?' }],
  });

  const chatKey = useMemo(() => {
    return (activeTab === 4 && viewParam === 'simplify') ? '4-simplify' : String(activeTab);
  }, [activeTab, viewParam]);

  const currentChatHistory = useMemo(() => {
    return agentChatHistory[chatKey] || [];
  }, [agentChatHistory, chatKey]);

  const handleSendMessage = (userMsg: string) => {
    if (!userMsg.trim() || !thoughtsData) return;

    // Add user message
    setAgentChatHistory(prev => ({
      ...prev,
      [chatKey]: [...(prev[chatKey] || []), { sender: 'user', text: userMsg }]
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
      } else if (activeTab === 8) {
        if (lowerMsg.includes('area') || lowerMsg.includes('region') || lowerMsg.includes('country') || lowerMsg.includes('category')) {
          replyText = `Here is the top performing SKU per area:
• Beverages: BrandF Water ($17.03M)
• Snacks: BrandC Chips ($16.00M)
• Personal Care: BrandC Toothpaste ($12.97M)
• Dairy: BrandD Cheese ($11.20M)
• Home Care: BrandB Detergent ($9.20M)

Geographically, Italy's top seller is BrandF Water, while Spain is led by BrandC Chips and Germany by BrandB Chips.`;
        } else if (lowerMsg.includes('best') || lowerMsg.includes('top') || lowerMsg.includes('highest')) {
          replyText = `Based on our multi-country sales data, our best performing SKU by Net Sales is BrandF Water ($17.03M) and by Gross Margin is also BrandF Water ($6.83M), followed closely by BrandC Chips ($16.00M).`;
        } else if (lowerMsg.includes('worst') || lowerMsg.includes('lowest') || lowerMsg.includes('leakage') || lowerMsg.includes('drag') || lowerMsg.includes('burden')) {
          replyText = `The worst performing SKU in terms of growth is Fabric Softener (-22.2% growth, 15% margin). Also, Dairy has the highest concentration of low-performing items at 27.78%, and 68% of our catalog (68 SKUs) represents a long-tail burden contributing <1% revenue.`;
        } else if (lowerMsg.includes('netherlands') || lowerMsg.includes('gap') || lowerMsg.includes('realignment') || lowerMsg.includes('austria')) {
          replyText = `The Netherlands holds our smallest footprint (45 SKUs) but yields the lowest gross margin (38.20%). Realigning its mix to match the Austria benchmark of 38.64% is our top assortment opportunity.`;
        } else if (lowerMsg.includes('cannibalization') || lowerMsg.includes('overlap') || lowerMsg.includes('correlation')) {
          replyText = `Beverages is the category with the highest cannibalization risk. The pair correlation coefficient reaches -0.62 for Mango Fizz variants, meaning promotions on one variant heavily steal sales from the other.`;
        } else {
          replyText = `As the Assortment Agent, I am monitoring SKU counts, regional margin gaps, and substitution risks. Ask me about the 'best performing SKU', 'Netherlands margin gap', 'long-tail burden', or 'cannibalization correlation'.`;
        }
      } else if (activeTab === 1) {
        if (lowerMsg.includes('worst') || lowerMsg.includes('dairy') || lowerMsg.includes('drag')) {
          replyText = `Dairy is currently our biggest drag with 27.78% margin dilution. The supplier fragmentation index stands at 1.20, which is well above our 1.0 benchmark.`;
        } else if (lowerMsg.includes('count') || lowerMsg.includes('skus') || lowerMsg.includes('size')) {
          replyText = `The portfolio currently tracks 100 active SKUs across 6 major brands, generating $473M annual net sales.`;
        } else {
          replyText = `I am tracking portfolio complexity and mix. Ask me about 'Dairy margin dilution', 'supplier fragmentation index', or 'active SKU counts'.`;
        }
      } else if (activeTab === 2) {
        if (lowerMsg.includes('delay') || lowerMsg.includes('yogurt') || lowerMsg.includes('sourcing')) {
          replyText = `We have a sourcing delay on BrandD Organic Yogurt (+14 days lead time). We have simulated a raw milk supplier shock and recommend holding 2.5 weeks of safety stock.`;
        } else {
          replyText = `I am monitoring launch readiness gates. Ask me about 'sourcing delays', 'Yogurt lead times', or 'safety stock recommendations'.`;
        }
      } else if (activeTab === 3) {
        if (lowerMsg.includes('dilution') || lowerMsg.includes('margin') || lowerMsg.includes('cogs')) {
          replyText = `12 high-volume SKUs are diluting our gross margin from the 40.0% target to 38.53%. Cash runway is forecasted at 14.2 months, suggesting a structural pricing correction is needed.`;
        } else {
          replyText = `I am analyzing cash flows and margin dilution. Ask me about 'margin dilution drivers', 'cogs inflation', or 'cash runway projections'.`;
        }
      } else if (chatKey === '4-simplify') {
        if (lowerMsg.includes('ippv') || lowerMsg.includes('ranking') || lowerMsg.includes('league')) {
          replyText = `The IPPV table ranks SKUs by their commercial and household value. BrandB Chips leads with an IPPV of 100, while Green Tea RTD and Floor Cleaner are at the bottom of the league.`;
        } else if (lowerMsg.includes('cost') || lowerMsg.includes('hidden') || lowerMsg.includes('p&l') || lowerMsg.includes('downtime')) {
          replyText = `The Complexity P&L shows hidden costs like downtime, transport overhead, and waste. Household has the highest total hidden cost at $2.4M, driven by short production runs and downtime.`;
        } else if (lowerMsg.includes('bad') || lowerMsg.includes('complexity') || lowerMsg.includes('flywheel')) {
          replyText = `We have detected 8 Bad Complexity SKUs dragging down the flywheel score to 64. Bain recommends simplifying the tail to fund growth in high-IPPV core variants.`;
        } else {
          replyText = `As the Simplification Agent, I monitor the Bain Simplify to Grow Flywheel. Ask me about the 'IPPV ranking', 'Complexity P&L hidden costs', or 'Bad Complexity SKUs'.`;
        }
      } else if (activeTab === 4) {
        if (lowerMsg.includes('rationalize') || lowerMsg.includes('sunset') || lowerMsg.includes('prune')) {
          replyText = `Removing all 35 'Rationalize' candidate SKUs will free up safety stock capital from $246M to $142M (saving 42.2%), but introduces a 27.08% revenue tail risk.`;
        } else {
          replyText = `I optimize catalog complexity and inventory buffers. Ask me about 'rationalization candidates', 'safety stock capital savings', or 'revenue tail risk'.`;
        }
      } else if (activeTab === 5) {
        if (lowerMsg.includes('stockout') || lowerMsg.includes('leakage') || lowerMsg.includes('softener')) {
          replyText = `Fabric Softener has 7 critical stockout events, causing $42k in revenue leakage. We recommend reviewing multi-currency transfer pricing compliance as well.`;
        } else {
          replyText = `I audit compliance, stockouts, and ledger health. Ask me about 'Fabric Softener stockouts' or 'revenue leakage'.`;
        }
      } else if (lowerMsg.includes('simulate') || lowerMsg.includes('change') || lowerMsg.includes('run') || lowerMsg.includes('scenario') || lowerMsg.includes('driver')) {
        replyText = `Understood. Multi-variable simulation and scenario adjustment is managed centrally. Please navigate to the Agent Orchestrator (Tab 7) to trigger macro scenarios like Inflation Shock or Freight Delays.`;
      } else {
        replyText = `Interesting query about this workspace! As the ${thoughtsData.agent}, I am tracking compliance ledgers and portfolio variables. Switch to Tab 7 (Agent Orchestrator) to run detailed simulation scenarios.`;
      }

      setAgentChatHistory(prev => ({
        ...prev,
        [chatKey]: [...(prev[chatKey] || []), { sender: 'agent', text: replyText }]
      }));
    }, 1200);
  };

  return {
    isAgentWidgetExpanded,
    setIsAgentWidgetExpanded,
    isAgentWidgetVisible,
    setIsAgentWidgetVisible,
    agentMessageInput,
    setAgentMessageInput,
    isAgentTyping,
    currentChatHistory,
    handleSendMessage,
  };
};
