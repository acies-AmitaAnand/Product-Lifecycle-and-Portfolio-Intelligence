import React from 'react';
import { Cpu, ChevronRight, Zap } from 'lucide-react';
import { AgentThoughts } from '../../constants/agentData';

interface AgentWidgetProps {
  thoughtsData: AgentThoughts;
  isAgentWidgetExpanded: boolean;
  setIsAgentWidgetExpanded: (expanded: boolean) => void;
  isAgentWidgetVisible: boolean;
  setIsAgentWidgetVisible: (visible: boolean) => void;
  agentMessageInput: string;
  setAgentMessageInput: (input: string) => void;
  isAgentTyping: boolean;
  currentChatHistory: Array<{ sender: 'user' | 'agent', text: string }>;
  handleSendMessage: (userMsg: string) => void;
  onNavigateToOrchestrator: () => void;
}

export const AgentWidget: React.FC<AgentWidgetProps> = ({
  thoughtsData,
  isAgentWidgetExpanded,
  setIsAgentWidgetExpanded,
  isAgentWidgetVisible,
  setIsAgentWidgetVisible,
  agentMessageInput,
  setAgentMessageInput,
  isAgentTyping,
  currentChatHistory,
  handleSendMessage,
  onNavigateToOrchestrator,
}) => {
  if (!isAgentWidgetVisible) {
    return (
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
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(agentMessageInput);
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
            {currentChatHistory.map((msg, index) => (
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
            <form onSubmit={handleFormSubmit} className="flex gap-2">
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
              onClick={onNavigateToOrchestrator}
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
};
