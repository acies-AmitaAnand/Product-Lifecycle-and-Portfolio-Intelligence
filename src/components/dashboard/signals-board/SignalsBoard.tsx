import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, AlertCircle, AlertTriangle, Info, Plus, Check, Play, Inbox, Mail, Send,
  Filter, RefreshCw, Download, Zap, TrendingUp, HelpCircle, Activity, Globe, MapPin, ArrowUpRight, BarChart2, ShieldAlert, Smile, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  LineChart, Line, BarChart, Bar, Cell
} from 'recharts';
import { Role } from '../../../types/dashboard';
import { EmailComposerModal } from '../portfolio-health/EmailComposerModal';
import { SuccessFeedbackModal } from '../portfolio-health/SuccessFeedbackModal';
import { ResolveSignalModal } from './ResolveSignalModal';

const RECIPIENT_TITLES: Record<string, string> = {
  'ananya.sen@aciesglobal.com': 'VP Finance',
  'vikram.solanki@aciesglobal.com': 'QC Manager & Logistics Lead',
  'priya.sharma@aciesglobal.com': 'Product Manager',
  'rajendra.patel@aciesglobal.com': 'Vapi Hub Director',
  'amit.verma@aciesglobal.com': 'NPD Lead',
  'karan.johar@aciesglobal.com': 'Retail Relations Director'
};


interface SignalsBoardProps {
  role: Role;
  setActiveTab: (tab: number) => void;
  isDarkMode: boolean;
}

interface Signal {
  id: number;
  title: string;
  sev: 'critical' | 'warning' | 'info';
  type: string;
  detail: string;
  ack: boolean;
}

interface InboxMessage {
  id: number;
  from: string;
  fromInitials: string;
  fromColor: string;
  type: 'email' | 'message';
  subject: string;  body: string;
  time: string;
  read: boolean;
}

export const SignalsBoard: React.FC<SignalsBoardProps> = ({ role, setActiveTab, isDarkMode }) => {
  if (role === 'VP Product Management') {
    return <VPSignalsBoardView isDarkMode={isDarkMode} setActiveTab={setActiveTab} />;
  }
  const accentColor = isDarkMode ? '#a78bfa' : '#6d28d9';
  // Accordion guide
  const [guideOpen, setGuideOpen] = useState(false);

  // Initial signals based on prototype
  const [signals, setSignals] = useState<Signal[]>([
    { id: 1, title: 'Fabric Softener stockout — 7 events Q4', sev: 'critical', type: 'Supply', detail: 'Highest stockout frequency in portfolio. Lead time 35 days is 2.5× benchmark.', ack: false },
    { id: 2, title: 'Choco Wafers promo dependency at 72%', sev: 'critical', type: 'Margin', detail: 'Only 28% of revenue is organic. Margin collapses if promo budget cut.', ack: false },
    { id: 3, title: 'Green Tea RTD revenue declining YoY −4%', sev: 'warning', type: 'Demand', detail: 'Also 62% promo dependent. Double-risk SKU — flag for rationalization review.', ack: false },
    { id: 4, title: 'Herbal Shampoo growth at 28% — scale supply', sev: 'info', type: 'Supply', detail: 'Fastest-growing SKU. Lead time 11 days allows rapid ramp-up.', ack: false },
    { id: 5, title: 'Beverages cannibalization risk elevated', sev: 'warning', type: 'Cannibalization', detail: 'Mango Fizz variants showing −0.62 promo correlation. Review variant architecture.', ack: false },
    { id: 6, title: 'Floor Cleaner complexity score 0.74', sev: 'warning', type: 'Supply', detail: 'Highest complexity + lowest value. Priority rationalization candidate.', ack: false },
  ]);

  // Form states
  const [sigTitle, setSigTitle] = useState('');
  const [sigSev, setSigSev] = useState<'critical' | 'warning' | 'info'>('warning');
  const [sigType, setSigType] = useState('Supply');
  const [sigDetail, setSigDetail] = useState('');

  // Active severity filter
  const [sevFilter, setSevFilter] = useState<string>('all');

  // Role-based mock inbox messages
  const [inboxMessages, setInboxMessages] = useState<Record<string, InboxMessage[]>>({
    'Product Manager': [
      { id: 1, from: 'Vikram Anand', fromInitials: 'VA', fromColor: '#534AB7', type: 'email', subject: 'Sunset Approval Escalation — Q4', body: 'Priya, please check Choco Wafers dependency in Tab 4. We need to validate a sunset schedule before the executive review on Friday.', time: '10m ago', read: false },
      { id: 2, from: 'Rohan Mehta', fromInitials: 'RM', fromColor: '#854F0B', type: 'message', subject: 'Margin Leakage — Green Tea RTD', body: 'Priya, Green Tea RTD YoY growth dropped below -4%. I have flagged a Warning alert on your Signals Board.', time: '1h ago', read: false }
    ],
    'Pricing and Margin Partner': [
      { id: 3, from: 'Vikram Anand', fromInitials: 'VA', fromColor: '#534AB7', type: 'email', subject: 'Pricing Elasticity Simulation sign-off', body: 'Rohan, please review margin waterfalls and adjust pricing sliders for beverages. We need to protect the 40% margin target.', time: '30m ago', read: false }
    ],
    'VP Product Management': [
      { id: 4, from: 'Priya Sharma', fromInitials: 'PS', fromColor: '#0F6E56', type: 'message', subject: 'Mango Fizz 750ml Launch Brief', body: 'Vikram, I have uploaded the Mango Fizz new launch brief in Tab 2. Scores are at 88/100, ready for your sign-off.', time: '15m ago', read: false }
    ]
  });

  const handleAddSignal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sigTitle.trim()) {
      alert('Please enter a signal title.');
      return;
    }

    const newSignal: Signal = {
      id: Date.now(),
      title: sigTitle,
      sev: sigSev,
      type: sigType,
      detail: sigDetail.trim() || 'No detail provided.',
      ack: false
    };

    setSignals(prev => [newSignal, ...prev]);
    setSigTitle('');
    setSigDetail('');
  };

  const handleToggleAck = (id: number) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, ack: !s.ack } : s));
  };

  const handleMarkRead = (id: number) => {
    const roleKey = role === 'Pricing and Margin Partner' ? 'Pricing and Margin Partner' : role === 'Product Manager' ? 'Product Manager' : 'VP Product Management';
    setInboxMessages(prev => {
      const list = prev[roleKey] || [];
      return {
        ...prev,
        [roleKey]: list.map(m => m.id === id ? { ...m, read: true } : m)
      };
    });
  };

  // Determine filtered signals
  const filteredSignals = sevFilter === 'all' 
    ? signals 
    : signals.filter(s => s.sev === sevFilter);

  // Generate 30 days historical timeline data (stable with slight random fluctuation)
  const generateTimelineData = () => {
    const dates = [];
    const baseDate = new Date();
    
    // stable seeds
    const critSeed = [1, 2, 0, 1, 2, 3, 1, 0, 2, 1, 1, 2, 0, 1, 2, 1, 2, 3, 1, 0, 1, 2, 0, 2, 1, 1, 0, 2, 1, 2];
    const warnSeed = [3, 4, 2, 3, 4, 3, 2, 3, 4, 4, 3, 2, 3, 4, 2, 3, 4, 3, 4, 2, 3, 4, 3, 2, 4, 3, 2, 3, 4, 3];
    const infoSeed = [2, 1, 3, 2, 1, 2, 3, 2, 1, 2, 3, 1, 2, 3, 2, 1, 2, 2, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 3];

    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(baseDate.getDate() - 30 + i);
      const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      dates.push({
        date: dateStr,
        Critical: critSeed[i],
        Warning: warnSeed[i],
        Info: infoSeed[i]
      });
    }
    return dates;
  };

  const timelineData = generateTimelineData();

  // Active messages based on role
  const roleKey = role === 'Pricing and Margin Partner' ? 'Pricing and Margin Partner' : role === 'Product Manager' ? 'Product Manager' : 'VP Product Management';
  const roleMessages = inboxMessages[roleKey] || [];
  const unreadCount = roleMessages.filter(m => !m.read).length;

  return (
    <div className="space-y-6">
      
      {/* Strategic Header */}
      <div className="glass-card bg-acies-gray text-white py-5 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
          <MessageSquare size={100} />
        </div>
        <div>
          <p className="text-[9px] uppercase font-bold tracking-widest opacity-40 mb-2">Automated Risk Alerts · Tab 5 of 6</p>
          <h2 className="text-xl font-display font-medium text-white mb-2">Signals Board</h2>
          <p className="text-xs text-zinc-300 font-medium max-w-xl leading-relaxed">
            AI-surfaced operational and financial alerts ranked by severity. Acknowledge completed investigations, add manual field alerts, or jump straight to optimization modules.
          </p>
        </div>
      </div>

      {/* Guide Accordion */}
      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4">
        <button 
          onClick={() => setGuideOpen(!guideOpen)}
          className="w-full text-left font-bold text-xs uppercase tracking-widest text-acies-yellow flex justify-between items-center cursor-pointer border-none bg-transparent"
        >
          <span>📖 Using the signals board</span>
          <span className="text-[10px]">{guideOpen ? '✕ Collapse' : '▲ Expand'}</span>
        </button>

        {guideOpen && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-black/5 dark:border-white/5 mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">1. Severity ranking</h4>
              <p>🔴 Critical → 🟡 Warning → 🔵 Info. Clear Critical alerts first to resolve immediate stockout and pricing risks.</p>
            </div>
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">2. Filter by type</h4>
              <p>Use filters to narrow signals to your functional area — Supply, Margin, Demand, Launch, Cannibalization.</p>
            </div>
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">3. Acknowledge & Action</h4>
              <p>Click "Acknowledge" to mark alerts reviewed. Click "Action" to jump active tabs directly to the relevant dashboard for audit.</p>
            </div>
            <div>
              <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">4. Surfaced Field Reports</h4>
              <p>Use the Manual Signal Form to flag supply chain disruptions or pricing feedback noticed on the ground.</p>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic InboxAccess Panel based on role */}
      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest pb-3 border-b border-black/5 dark:border-white/5 flex items-center gap-2">
          <Inbox size={13} className="text-acies-yellow" />
          Inbox Access — Active Profile Requests
          {unreadCount > 0 && (
            <span className="text-[8px] font-extrabold bg-red-500 text-white rounded-full px-2 py-0.5 animate-pulse">
              {unreadCount} Unread
            </span>
          )}
        </h3>

        {roleMessages.length === 0 ? (
          <p className="text-xs text-zinc-500 font-semibold py-2">No active messages in folder.</p>
        ) : (
          <div className="space-y-3">
            {roleMessages.map(msg => (
              <div 
                key={msg.id} 
                onClick={() => handleMarkRead(msg.id)}
                className={`p-3 border rounded-sm flex gap-3 cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5 ${
                  msg.read 
                    ? 'border-black/5 dark:border-white/5 opacity-60' 
                    : 'border-acies-yellow bg-acies-yellow/5'
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-inner"
                  style={{ background: `linear-gradient(135deg, ${msg.fromColor}, ${msg.fromColor}CC)` }}
                >
                  {msg.fromInitials}
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-acies-gray dark:text-white">{msg.from}</span>
                    <span className={`text-[8.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm flex items-center gap-1 ${
                      msg.type === 'email' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {msg.type === 'email' ? <Mail size={9} /> : <Send size={9} />}
                      {msg.type}
                    </span>
                  </div>
                  <h4 className="text-[11px] font-semibold text-acies-gray dark:text-white truncate">{msg.subject}</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2 pt-1">{msg.body}</p>
                </div>
                <span className="text-[9px] text-zinc-500 font-bold shrink-0">{msg.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Manual Signal Form */}
      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4">🔔 Add Manual Signal</h3>
        <form onSubmit={handleAddSignal} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Title</label>
            <input 
              type="text" 
              placeholder="e.g. Stockout in Kerala region"
              value={sigTitle}
              onChange={(e) => setSigTitle(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Severity</label>
            <select 
              value={sigSev}
              onChange={(e) => setSigSev(e.target.value as any)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            >
              <option value="critical">🔴 Critical</option>
              <option value="warning">🟡 Warning</option>
              <option value="info">🔵 Info</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Type</label>
            <select 
              value={sigType}
              onChange={(e) => setSigType(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            >
              <option>Supply</option>
              <option>Margin</option>
              <option>Demand</option>
              <option>Launch</option>
              <option>Cannibalization</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Detail</label>
            <input 
              type="text" 
              placeholder="Brief description..."
              value={sigDetail}
              onChange={(e) => setSigDetail(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end mt-2">
            <button 
              type="submit"
              className="px-5 py-2 bg-acies-gray text-white text-[9px] font-bold uppercase tracking-widest hover:bg-acies-yellow hover:text-acies-gray transition-all cursor-pointer border-none"
            >
              Add Signal
            </button>
          </div>
        </form>
      </div>

      {/* Dynamic Filters tabs */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'critical', label: '🔴 Critical' },
          { id: 'warning', label: '🟡 Warning' },
          { id: 'info', label: '🔵 Info' },
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => setSevFilter(btn.id)}
            className={`px-4 py-2 border rounded-full text-[9px] font-extrabold uppercase tracking-wider cursor-pointer transition-all ${
              sevFilter === btn.id 
                ? 'bg-acies-yellow/15 border-acies-yellow text-acies-yellow' 
                : 'border-black/10 dark:border-white/10 text-zinc-500 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Signals Inbox list */}
      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5 space-y-4">
        {filteredSignals.length === 0 ? (
          <p className="text-xs text-center py-6 font-bold uppercase text-zinc-500">No signals in folder.</p>
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/5 space-y-3.5">
            {filteredSignals.map(sig => {
              const borderCol = sig.sev === 'critical' ? 'border-red-500/30' : sig.sev === 'warning' ? 'border-amber-500/30' : 'border-blue-500/30';
              const indicatorBg = sig.sev === 'critical' ? 'bg-red-500/10 text-red-500' : sig.sev === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500';
              
              // Action triggers
              const handleAction = () => {
                if (sig.type === 'Margin' || sig.type === 'Cannibalization') {
                  setActiveTab(4); // jumps to SKU Rationalization
                } else if (sig.type === 'Supply') {
                  setActiveTab(1); // jumps to Portfolio map
                }
              };

              return (
                <div key={sig.id} className={`pt-3.5 flex justify-between items-center gap-4 transition-all border-l-2 ${borderCol} pl-3 ${sig.ack ? 'opacity-40' : ''}`}>
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs ${indicatorBg}`}>
                      {sig.sev === 'critical' ? '🔴' : sig.sev === 'warning' ? '🟡' : '🔵'}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-[11px] font-bold text-acies-gray dark:text-white flex items-center gap-2 truncate">
                        {sig.title}
                        <span className="text-[8px] font-extrabold px-1.5 py-0.5 bg-black/5 dark:bg-white/10 rounded-sm opacity-55">
                          {sig.type}
                        </span>
                      </h4>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{sig.detail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[8.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shrink-0 ${indicatorBg}`}>
                      {sig.sev.toUpperCase()}
                    </span>
                    <button 
                      onClick={() => handleToggleAck(sig.id)}
                      className="text-[9px] font-bold uppercase tracking-widest border border-black/10 dark:border-white/10 px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer rounded-sm"
                    >
                      {sig.ack ? 'Re-open' : 'Acknowledge'}
                    </button>
                    {!sig.ack && (
                      <button 
                        onClick={handleAction}
                        className="text-[9px] font-bold uppercase tracking-widest bg-acies-gray text-white px-2 py-1.5 hover:bg-acies-yellow hover:text-acies-gray transition-all cursor-pointer rounded-sm border-none flex items-center gap-1"
                      >
                        <Play size={8} fill="currentColor" />
                        Action
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Signal Timeline Area chart */}
      <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-1">Signal Timeline — Last 30 Days</h3>
        <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">Historical signal frequency by severity type</p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
              <defs>
                <linearGradient id="grad-crit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A32D2D" stopOpacity={0.2}/>
                  <stop offset="100%" stopColor="#A32D2D" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="grad-warn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#854F0B" stopOpacity={0.2}/>
                  <stop offset="100%" stopColor="#854F0B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="grad-info" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#185FA5" stopOpacity={0.2}/>
                  <stop offset="100%" stopColor="#185FA5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                itemStyle={{ fontSize: 11 }}
              />
              <Legend wrapperStyle={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
              
              <Area type="monotone" dataKey="Critical" stroke="#A32D2D" strokeWidth={1.5} fill="url(#grad-crit)" />
              <Area type="monotone" dataKey="Warning" stroke="#854F0B" strokeWidth={1.5} fill="url(#grad-warn)" />
              <Area type="monotone" dataKey="Info" stroke="#185FA5" strokeWidth={1.5} fill="url(#grad-info)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

  );
};

// ==========================================
// VP Signals Board View Component & Mock Data
// ==========================================

export interface VPSignal {
  id: string;
  title: string;
  category: string;
  region: string;
  type: 'Risk' | 'Opportunity' | 'Competitor' | 'Sentiment' | 'Supply' | 'Portfolio';
  severity: 'critical' | 'warning' | 'info';
  impact: string;
  detail: string;
  ack: boolean;
  refCode: string;
}

export const VP_SIGNALS_DATA: VPSignal[] = [
  { id: 'S01', title: 'Demand spike in APAC Beverages', category: 'Beverages', region: 'APAC', type: 'Opportunity', severity: 'critical', impact: '$1.2M Revenue Opportunity', detail: 'Beverages volume trending +18% YoY in APAC. Sourcing buffers are currently insufficient to cover this demand shift.', ack: false, refCode: 'BEV-APAC-01' },
  { id: 'S02', title: 'Packaging Material Shortage', category: 'Snacks', region: 'EMEA', type: 'Risk', severity: 'critical', impact: '15d Launch Delay', detail: 'Organic packaging supplier in Germany locked down. BrandC Biscuits Eco launch target at risk.', ack: false, refCode: 'SNC-EMEA-02' },
  { id: 'S03', title: 'Competitor price reduction', category: 'Snacks', region: 'EMEA', type: 'Competitor', severity: 'warning', impact: 'Market Share Risk', detail: 'Competitor B cut price of Wafers by 10% in Europe. Category gross margin target under pressure.', ack: false, refCode: 'COMP-EMEA-03' },
  { id: 'S04', title: 'Social sentiment decline', category: 'Personal Care', region: 'Americas', type: 'Sentiment', severity: 'warning', impact: 'Brand Equity Risk', detail: 'Social mentions for Personal Care lines dropped by 14% post-artwork revision. Packaging aesthetics cited as key factor.', ack: false, refCode: 'SENT-AMER-04' },
  { id: 'S05', title: 'Raw material shortage', category: 'Household', region: 'India', type: 'Supply', severity: 'critical', impact: '$800K Revenue Risk', detail: 'Active surfactant supplier constraint in domestic market. Alternate local validation recommended.', ack: false, refCode: 'SUPP-IND-05' },
  { id: 'S06', title: 'Product Cannibalization Alert', category: 'Beverages', region: 'India', type: 'Portfolio', severity: 'warning', impact: 'Margin Leakage', detail: 'Mango Fizz 250ml and 500ml variants show -0.62 promotional correlation. Variant shelf rationalization required.', ack: false, refCode: 'PORT-IND-06' },
  { id: 'S07', title: 'NPS Score Decline', category: 'Snacks', region: 'EMEA', type: 'Sentiment', severity: 'info', impact: 'Customer Satisfaction Drop', detail: 'Snacks segment NPS fell from 74 to 71 in Europe due to recent logistics delays. Core product quality scores stable.', ack: false, refCode: 'SENT-EMEA-07' },
  { id: 'S08', title: 'Competitor launch in India', category: 'Beverages', region: 'India', type: 'Competitor', severity: 'info', impact: 'Market Competitiveness', detail: 'Rival brand launched Organic Green Tea SKU in West region. Pricing aligns with our mid-tier line.', ack: false, refCode: 'COMP-IND-08' },
  { id: 'S09', title: 'Logistics bottleneck at port', category: 'Personal Care', region: 'APAC', type: 'Supply', severity: 'warning', impact: '10d Lead Time Extension', detail: 'APAC port gridlock causing shipment lag on personal care materials. Pre-positioned buffer stock recommended.', ack: false, refCode: 'SUPP-APAC-09' },
  { id: 'S10', title: 'Growing market demand shift', category: 'Household', region: 'Americas', type: 'Opportunity', severity: 'warning', impact: '$600K Revenue Opportunity', detail: 'Americas household category demand increased 24% in South region. Eco-friendly line under-distributed.', ack: false, refCode: 'OPP-AMER-10' }
];

const VPSignalsBoardView: React.FC<{ isDarkMode: boolean; setActiveTab: (tab: number) => void }> = ({ isDarkMode, setActiveTab }) => {
  const [signals, setSignals] = useState<VPSignal[]>(VP_SIGNALS_DATA);
  const [filterRegion, setFilterRegion] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [toasts, setToasts] = useState<{ id: string; title: string; body: string; color: string }[]>([]);

  const [activeResolveSignal, setActiveResolveSignal] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerEmail, setComposerEmail] = useState({ to: '', name: '', subject: '', body: '', action: '' });
  const [successFeedback, setSuccessFeedback] = useState<{
    isOpen: boolean;
    recipientName: string;
    recipientTitle: string;
    recipientEmail: string;
    contextType: 'signal';
    contextTitle: string;
    channel: 'email' | 'message';
  } | null>(null);
  const [trendsTimeframe, setTrendsTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastRefreshed(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const addToast = (title: string, body: string, color: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, body, color }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleResolveSignal = (id: string, title: string, resolutionMsg: string) => {
    setSignals(prev => prev.filter(s => s.id !== id));
    addToast('Signal Resolved', `${title}: ${resolutionMsg}`, '#10b981');
  };

  const handleToggleAck = (id: string) => {
    setSignals(prev => prev.map(s => {
      if (s.id === id) {
        const nextAck = !s.ack;
        addToast(
          nextAck ? 'Signal Acknowledged' : 'Signal Re-opened', 
          `Signal ref: ${s.refCode}`, 
          nextAck ? '#3b82f6' : '#f59e0b'
        );
        return { ...s, ack: nextAck };
      }
      return s;
    }));
  };

  // Filtered lists
  const filteredSignals = signals.filter(s => {
    const matchRegion = filterRegion === 'All' || s.region === filterRegion;
    const matchCategory = filterCategory === 'All' || s.category === filterCategory;
    const matchType = filterType === 'All' || s.type === filterType;
    const matchSeverity = filterSeverity === 'All' || s.severity === filterSeverity;
    return matchRegion && matchCategory && matchType && matchSeverity;
  });

  // KPI Calculations
  const activeCriticalCount = filteredSignals.filter(s => s.severity === 'critical' && !s.ack).length;
  const competitorAlertsCount = filteredSignals.filter(s => s.type === 'Competitor' && !s.ack).length;
  const activeOpportunityCount = filteredSignals.filter(s => s.type === 'Opportunity' && !s.ack).length;
  
  // Simulated overall risk exposure ($ Millions)
  const riskExposureVal = filteredSignals.reduce((sum, s) => {
    if (s.type === 'Risk' || s.type === 'Supply') {
      return sum + (s.severity === 'critical' ? 2.1 : 1.0);
    }
    return sum;
  }, 0);
  const finalRiskExposure = riskExposureVal > 0 ? riskExposureVal : 6.4;

  // Regions under alert
  const alertRegions = Array.from(new Set(filteredSignals.filter(s => s.severity === 'critical' || s.severity === 'warning').map(s => s.region)));

  // Resolution Rate
  const resolvedCount = VP_SIGNALS_DATA.length - signals.length;
  const resolutionRate = VP_SIGNALS_DATA.length > 0 
    ? Math.round((resolvedCount / VP_SIGNALS_DATA.length) * 15 + 85) // simulated baseline 85% + resolved factor
    : 91;

  // Recharts Trends Line Data
  const categoryTrendsWeeklyData = [
    { name: 'W1', Beverages: 62, Snacks: 55, PersonalCare: 45, Household: 35 },
    { name: 'W2', Beverages: 68, Snacks: 53, PersonalCare: 48, Household: 34 },
    { name: 'W3', Beverages: 72, Snacks: 58, PersonalCare: 46, Household: 38 },
    { name: 'W4', Beverages: 78, Snacks: 54, PersonalCare: 44, Household: 42 },
  ];

  const categoryTrendsMonthlyData = [
    { name: 'Jan', Beverages: 58, Snacks: 50, PersonalCare: 40, Household: 30 },
    { name: 'Feb', Beverages: 64, Snacks: 52, PersonalCare: 42, Household: 32 },
    { name: 'Mar', Beverages: 70, Snacks: 56, PersonalCare: 45, Household: 36 },
    { name: 'Apr', Beverages: 76, Snacks: 54, PersonalCare: 43, Household: 40 },
  ];

  const categoryTrendsData = trendsTimeframe === 'weekly' ? categoryTrendsWeeklyData : categoryTrendsMonthlyData;

  // NPS Trends Data
  const npsTrendsData = [
    { name: 'Jan', Beverages: 72, Snacks: 68, PersonalCare: 70, Household: 65 },
    { name: 'Feb', Beverages: 73, Snacks: 70, PersonalCare: 71, Household: 66 },
    { name: 'Mar', Beverages: 75, Snacks: 72, PersonalCare: 70, Household: 68 },
    { name: 'Apr', Beverages: 76, Snacks: 71, PersonalCare: 68, Household: 72 },
  ];

  // Heatmap metrics
  const regionList = ['APAC', 'EMEA', 'Americas', 'India'];
  const getAlertLoad = (reg: string) => {
    return filteredSignals.filter(s => s.region === reg && !s.ack).length;
  };

  const handleExport = () => {
    addToast('Summary Exported', 'Strategic signal audit log has been compiled and downloaded.', '#3b82f6');
  };

  return (
    <div className="space-y-6">
      
      {/* AI Summary Banner */}
      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-l-4 border-purple-500 dark:border-purple-400 rounded-r shadow-sm flex items-start gap-3">
        <Zap size={16} className="text-[#6d28d9] dark:text-[#a78bfa] fill-purple-500/20 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6d28d9] dark:text-[#a78bfa]">🤖 AI Intelligence Summary</p>
          <p className="text-[11px] font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
            3 high-risk launches detected this week. APAC demand growth is trending positively (+18% YoY in Beverages). Sell-through decline detected in Americas Snacks. Immediate vendor validation recommended for German packing lines.
          </p>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-5 py-3.5 rounded-sm shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-2 py-1.5 rounded-sm">
            <Filter size={11} className="text-[#6d28d9] dark:text-[#a78bfa] shrink-0" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Filters</span>
          </div>

          <select 
            value={filterRegion} 
            onChange={(e) => setFilterRegion(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-[9px] font-bold text-zinc-650 dark:text-zinc-350 outline-none cursor-pointer"
          >
            <option value="All">All Regions</option>
            <option value="APAC">APAC</option>
            <option value="EMEA">EMEA</option>
            <option value="Americas">Americas</option>
            <option value="India">India</option>
          </select>

          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-[9px] font-bold text-zinc-650 dark:text-zinc-350 outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Beverages">Beverages</option>
            <option value="Snacks">Snacks</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Household">Household</option>
          </select>

          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-[9px] font-bold text-zinc-650 dark:text-zinc-350 outline-none cursor-pointer"
          >
            <option value="All">All Signal Types</option>
            <option value="Risk">Risk</option>
            <option value="Opportunity">Opportunity</option>
            <option value="Competitor">Competitor</option>
            <option value="Sentiment">Sentiment</option>
            <option value="Supply">Supply</option>
            <option value="Portfolio">Portfolio</option>
          </select>

          <select 
            value={filterSeverity} 
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-[9px] font-bold text-zinc-650 dark:text-zinc-350 outline-none cursor-pointer"
          >
            <option value="All">All Severities</option>
            <option value="critical">🔴 Critical</option>
            <option value="warning">🟡 Warning</option>
            <option value="info">🔵 Info</option>
          </select>

          {(filterRegion !== 'All' || filterCategory !== 'All' || filterType !== 'All' || filterSeverity !== 'All') && (
            <button 
              onClick={() => { setFilterRegion('All'); setFilterCategory('All'); setFilterType('All'); setFilterSeverity('All'); }}
              className="text-[9px] text-[#6d28d9] dark:text-[#a78bfa] font-bold uppercase tracking-wider hover:underline px-1 cursor-pointer bg-transparent border-none"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold font-mono">
            <RefreshCw size={11} className="text-zinc-400" />
            <span>UPDATED: {lastRefreshed}</span>
          </div>
          <span className="h-4 w-px bg-black/10 dark:bg-white/15"></span>
          <button 
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-[9px] font-bold uppercase tracking-wider rounded-sm text-zinc-600 dark:text-zinc-400 cursor-pointer"
          >
            <Download size={11} />
            Export Summary
          </button>
        </div>
      </div>

      {/* Row 1: Critical Signals KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* KPI 1: Competitor Alerts */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex flex-col justify-between h-28 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
          <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Competitor Alerts</p>
          <h4 className="text-2xl font-display font-extrabold text-[#6d28d9] dark:text-[#a78bfa] leading-none">{competitorAlertsCount}</h4>
          <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase font-bold text-[#6d28d9] dark:text-[#a78bfa]">Active Campaigns</p>
        </div>

        {/* KPI 2: Opportunity Signals */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex flex-col justify-between h-28 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
          <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Opportunities</p>
          <h4 className="text-2xl font-display font-extrabold text-emerald-500 leading-none">{activeOpportunityCount}</h4>
          <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Growth drivers</p>
        </div>

        {/* KPI 3: Risk Exposure */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex flex-col justify-between h-28 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
          <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Risk Exposure</p>
          <h4 className="text-2xl font-display font-extrabold text-orange-500 leading-none">${finalRiskExposure.toFixed(1)}M</h4>
          <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Revenue at risk</p>
        </div>

        {/* KPI 4: AI Risk Predictions */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex flex-col justify-between h-28 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
          <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">AI Predictions</p>
          <h4 className="text-2xl font-display font-extrabold text-[#6d28d9] dark:text-[#a78bfa] leading-none">12</h4>
          <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Emergent concerns</p>
        </div>

        {/* KPI 5: Regions Under Alert */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex flex-col justify-between h-28 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
          <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Regions Alerted</p>
          <h4 className="text-2xl font-display font-extrabold text-blue-500 leading-none">{alertRegions.length}</h4>
          <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">
            {alertRegions.length > 0 ? alertRegions.join(', ') : 'None'}
          </p>
        </div>

        {/* KPI 6: Signal Resolution Rate */}
        <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex flex-col justify-between h-28 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
          <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Resolution Rate</p>
          <h4 className="text-2xl font-display font-extrabold text-zinc-800 dark:text-zinc-200 leading-none">{resolutionRate}%</h4>
          <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Action efficiency</p>
        </div>

      </div>

      {/* Row 2: Executive Signal Feed | Category Trend Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Main Executive Signal Feed */}
        <div className="xl:col-span-7 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Executive Signal Feed</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
              {filteredSignals.length} active notifications
            </span>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {filteredSignals.length > 0 ? (
              filteredSignals.map(sig => {
                const borderCol = sig.severity === 'critical' ? 'border-red-500/30' : sig.severity === 'warning' ? 'border-amber-500/30' : 'border-blue-500/30';
                const indicatorBg = sig.severity === 'critical' ? 'bg-red-500/10 text-red-500' : sig.severity === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500';
                
                return (
                  <div key={sig.id} className={`p-3.5 border-l-2 ${borderCol} rounded-r-sm bg-zinc-50/50 dark:bg-white/5 space-y-3 ${sig.ack ? 'opacity-40' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-[11.5px] font-bold text-zinc-805 dark:text-zinc-155 flex items-center gap-2 flex-wrap">
                          {sig.title}
                          <span className="text-[8px] font-extrabold px-1.5 py-0.5 bg-black/5 dark:bg-white/10 rounded-sm opacity-55">
                            {sig.type}
                          </span>
                        </h4>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">{sig.detail}</p>
                      </div>

                      <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm whitespace-nowrap ${indicatorBg}`}>
                        {sig.impact}
                      </span>
                    </div>

                    <div className="flex gap-2 justify-end pt-1 border-t border-black/[0.03] dark:border-white/[0.03]">
                      <button 
                        onClick={() => handleToggleAck(sig.id)}
                        className="px-2.5 py-1 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 rounded-sm text-[8.5px] font-bold uppercase tracking-wider transition-all cursor-pointer bg-transparent text-zinc-500 dark:text-zinc-400"
                      >
                        {sig.ack ? 'Re-open' : 'Acknowledge'}
                      </button>
                      <button 
                        onClick={() => {
                          setActiveResolveSignal(sig.id);
                        }}
                        className="px-2.5 py-1 bg-acies-gray hover:bg-acies-yellow hover:text-acies-gray text-white rounded-sm text-[8.5px] font-bold uppercase tracking-wider transition-all cursor-pointer border-none flex items-center gap-1"
                      >
                        Resolve ✓
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-[10px] text-zinc-500 font-bold py-12">✓ Strategic feed cleared</p>
            )}
          </div>
        </div>

        {/* Category & Brand Momentum Trend Chart */}
        <div className="xl:col-span-5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Category & Brand Momentum</span>
              <p className="text-[8px] font-bold uppercase tracking-wider text-zinc-400 mt-0.5">
                {trendsTimeframe === 'weekly' ? 'Weekly sales index' : 'Monthly sales index'}
              </p>
            </div>
            
            <div className="flex bg-black/5 dark:bg-white/5 p-0.5 rounded border border-black/5 dark:border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setTrendsTimeframe('weekly')}
                className={`px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider rounded-sm transition-all border-none cursor-pointer outline-none ${
                  trendsTimeframe === 'weekly'
                    ? 'bg-[#5850ec] text-white shadow-sm'
                    : `bg-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white`
                }`}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setTrendsTimeframe('monthly')}
                className={`px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider rounded-sm transition-all border-none cursor-pointer outline-none ${
                  trendsTimeframe === 'monthly'
                    ? 'bg-[#5850ec] text-white shadow-sm'
                    : `bg-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white`
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={categoryTrendsData} margin={{ left: -25, right: 5, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', color: isDarkMode ? '#fff' : '#000' }}
                  itemStyle={{ fontSize: 9 }}
                  labelStyle={{ fontSize: 9, fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Line type="monotone" dataKey="Beverages" stroke="#6d28d9" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Snacks" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="PersonalCare" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Household" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 3: Market Signals Map | AI Predictive Signals */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Market Signals Map (Regional Alert Load Heatgrid) */}
        <div className="xl:col-span-5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Market Signals Alert Map</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">Alert loading by region</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            {regionList.map(reg => {
              const count = getAlertLoad(reg);
              const color = count >= 3 ? 'border-red-500/35 text-red-500 bg-red-500/5' : count >= 1 ? 'border-amber-500/35 text-amber-500 bg-amber-500/5' : 'border-emerald-500/35 text-emerald-500 bg-emerald-500/5';
              return (
                <div key={reg} className={`p-4 border rounded-sm flex flex-col justify-between h-24 relative overflow-hidden ${color}`}>
                  <Globe size={40} className="absolute -right-2 -bottom-2 opacity-5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">{reg} Region</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <h5 className="text-xl font-display font-bold leading-none">{count}</h5>
                    <span className="text-[8px] font-extrabold uppercase">unresolved</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Predictions & Risk Scores */}
        <div className="xl:col-span-7 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6d28d9] dark:text-[#a78bfa] flex items-center gap-1">
              <Zap size={11} className="fill-[#6d28d9] dark:fill-[#a78bfa]" />
              AI Risk Predictions
            </span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">Forecasted disruptions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Prediction 1 */}
            <div className="p-3 border border-black/5 dark:border-white/10 rounded-sm bg-zinc-50/50 dark:bg-white/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[9px] font-bold uppercase text-zinc-450 dark:text-zinc-550">
                  <span>Stockout Warning</span>
                  <span className="text-red-500">92% Prob.</span>
                </div>
                <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1">BrandA Premium Energy</h5>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                  Stock exhaustion likely in <span className="font-bold text-red-500">12 days</span> due to surge in Q2 APAC demand.
                </p>
              </div>
              <button 
                onClick={() => addToast('Stock Routed', 'Safety stock allocation diverted to APAC hubs.', '#10b981')}
                className="mt-3.5 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-650 dark:text-zinc-350 rounded-sm border-none cursor-pointer"
              >
                Route Safety Stock
              </button>
            </div>

            {/* Prediction 2 */}
            <div className="p-3 border border-black/5 dark:border-white/10 rounded-sm bg-zinc-50/50 dark:bg-white/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[9px] font-bold uppercase text-zinc-450 dark:text-zinc-550">
                  <span>Price Elasticity</span>
                  <span className="text-amber-500">74% Impact</span>
                </div>
                <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1">BrandD Yogurt Drink</h5>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                  Competitor wafers price cuts will trigger a <span className="font-bold text-amber-500">14% volume drop</span> in EU.
                </p>
              </div>
              <button 
                onClick={() => addToast('Pricing Shifted', 'Promotional price points queued for activation.', '#10b981')}
                className="mt-3.5 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-650 dark:text-zinc-350 rounded-sm border-none cursor-pointer"
              >
                Trigger Dynamic Promo
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Row 4: Portfolio Health Signals | Competitive Intelligence */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Portfolio Health & Saturation Dials */}
        <div className="xl:col-span-6 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Portfolio Saturation & Cannibalization</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">System metrics</span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Saturation progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-zinc-500">Beverages Overlap Ratio</span>
                <span className="text-red-500 font-mono">0.68 (High Cannibalization)</span>
              </div>
              <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            {/* Growth Score */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-zinc-500">Innovation Volume Share</span>
                <span className="text-emerald-500 font-mono">34% (Target &gt; 30%)</span>
              </div>
              <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '34%' }} />
              </div>
            </div>

            {/* Sku Saturation */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-zinc-500">Portfolio Health Risk Index</span>
                <span className="text-amber-500 font-mono">0.44 (Moderate risk)</span>
              </div>
              <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '44%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Competitive Intelligence Signals */}
        <div className="xl:col-span-6 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Competitive Intelligence</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">Market activity ticker</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {[
              { label: 'Rival Pricing Cut', body: 'Competitor wafers priced drop -10% in EU supermarts.', time: '1h ago', cat: 'Snacks' },
              { label: 'Competitor Launch', body: 'Alternative premium soy drink introduced in APAC region.', time: '3h ago', cat: 'Beverages' },
              { label: 'Distribution Surge', body: 'Rival personal care brand secured 80% shelf targets in West India.', time: '5h ago', cat: 'Personal Care' }
            ].map((c, i) => (
              <div key={i} className="flex justify-between items-start gap-4 p-2 bg-black/[0.01] dark:bg-white/5 rounded border border-black/5 dark:border-white/5 text-[11px]">
                <div className="min-w-0">
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{c.label} · <span className="text-[8px] font-bold uppercase px-1 bg-black/10 dark:bg-white/10 rounded">{c.cat}</span></p>
                  <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">{c.body}</p>
                </div>
                <span className="text-[8.5px] font-mono text-zinc-400 whitespace-nowrap">{c.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 5: Customer Sentiment NPS | Supply Chain Signals */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Customer Sentiment NPS Meter */}
        <div className="xl:col-span-5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Customer NPS Sentiment</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">Target Score: &gt; 70</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={npsTrendsData} margin={{ left: -25, right: 5, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', color: isDarkMode ? '#fff' : '#000' }}
                  itemStyle={{ fontSize: 9 }}
                />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Line type="monotone" dataKey="Beverages" stroke="#6d28d9" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="Snacks" stroke="#10b981" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="PersonalCare" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="Household" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supply Chain & Operational Signals */}
        <div className="xl:col-span-7 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Supply Chain & Operations Alerts</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-red-500">Critical delays</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box 1 */}
            <div className="p-3 border border-[#ef4444]/20 rounded bg-red-500/5 flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">Sourcing Blocked</span>
                <h5 className="text-xs font-bold text-zinc-805 dark:text-zinc-155 mt-2">Organic Milk Supplier Lag</h5>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                  Lead times for German dairy vendor extended by <span className="font-bold text-red-500">14 days</span>. Sourcing bottleneck flagged.
                </p>
              </div>
              <button 
                onClick={() => addToast('Vendor Onboarded', 'Secured contract with backup dairy supplier.', '#10b981')}
                className="mt-3 py-1 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/35 text-red-500 rounded-sm text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer font-sans"
              >
                Onboard Domestic Supplier
              </button>
            </div>

            {/* Box 2 */}
            <div className="p-3 border border-[#f59e0b]/20 rounded bg-amber-500/5 flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Logistic Delay</span>
                <h5 className="text-xs font-bold text-zinc-805 dark:text-zinc-155 mt-2">APAC Shipping Freight Grid</h5>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                  Marine shipping cargo gridlocks delaying ingredient import. Lead time extended +10 days.
                </p>
              </div>
              <button 
                onClick={() => addToast('Freight Air-routed', 'Expedited air cargo approved for urgent batches.', '#10b981')}
                className="mt-3 py-1 bg-amber-500/10 hover:bg-amber-500 hover:text-white border border-amber-500/35 text-amber-500 rounded-sm text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer font-sans"
              >
                Approve Air Cargo Freight
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Floating Corner Toasts Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map(t => (
          <div 
            key={t.id} 
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            className="pointer-events-auto bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 p-3.5 rounded shadow-lg flex items-start gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: t.color }} />
            <div>
              <h5 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-100 leading-none">{t.title}</h5>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">{t.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Resolve Sync Meeting Modal */}
      <ResolveSignalModal
        isOpen={!!activeResolveSignal}
        signal={signals.find(x => x.id === activeResolveSignal) || null}
        onClose={() => setActiveResolveSignal(null)}
        onRequestAction={(email, name, subject, body) => {
          setComposerEmail({
            to: email,
            name,
            subject,
            body,
            action: activeResolveSignal || ''
          });
          setComposerOpen(true);
        }}
      />

      {/* Email Composer Modal */}
      <EmailComposerModal 
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        initialEmail={composerEmail}
        onSend={(name, email, subject, body, channel) => {
          setComposerOpen(false);
          const resolvedTitle = RECIPIENT_TITLES[email.toLowerCase()] || 'Product Manager';
          const signal = signals.find(x => x.id === composerEmail.action);
          const title = signal ? signal.title : '';
          
          setSuccessFeedback({
            isOpen: true,
            recipientName: name,
            recipientTitle: resolvedTitle,
            recipientEmail: email,
            contextType: 'signal',
            contextTitle: title,
            channel
          });
          
          addToast(
            'Sync Meeting Invitation Sent', 
            `Meeting invite ${channel === 'email' ? 'email' : 'message'} sent successfully to ${name} (${email}).`, 
            '#10b981'
          );
          
          // Resolve signal
          setSignals(prev => prev.filter(s => s.id !== composerEmail.action));
          setActiveResolveSignal(null);
        }}
      />

      {/* Success Feedback Modal */}
      {successFeedback && (
        <SuccessFeedbackModal
          isOpen={successFeedback.isOpen}
          onClose={() => setSuccessFeedback(null)}
          recipientName={successFeedback.recipientName}
          recipientTitle={successFeedback.recipientTitle}
          recipientEmail={successFeedback.recipientEmail}
          contextType={successFeedback.contextType}
          contextTitle={successFeedback.contextTitle}
          isDarkMode={isDarkMode}
          channel={successFeedback.channel}
        />
      )}

    </div>
  );
};
