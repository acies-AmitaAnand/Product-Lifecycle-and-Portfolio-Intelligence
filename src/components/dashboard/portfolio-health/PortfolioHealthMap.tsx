import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, Filter, RefreshCw, BarChart2, PieChart, Info, HelpCircle, Save, Plus, Trash2, ArrowRight, Zap,
  Clock, Shield, Bell, Check, X, AlertTriangle, AlertCircle, TrendingUp, Globe, Activity as ActivityIcon,
  Mail, MapPin
} from 'lucide-react';
import { 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, LabelList,
  ComposedChart, BarChart, Bar, Line, Cell, Legend, PieChart as RePieChart, Pie, AreaChart, Area,
  LineChart
} from 'recharts';
import { Role } from '../../../types/dashboard';
import { SKUS } from '../../../constants/data';
import { BottleneckDetailsModal } from './BottleneckDetailsModal';
import { EmailComposerModal } from './EmailComposerModal';

interface PortfolioHealthMapProps {
  role: Role;
  isDarkMode: boolean;
}

interface CustomSKUType {
  name: string;
  cat: string;
  rev: number;
  val: number;
  cx: number;
  stockouts: number;
  promo: number;
  margin: number;
  growth: number;
  lead: number;
}

// ══════════════════════════════════════════════════════════════════════════════
// VP COMMAND CENTER SUB-COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const VPCommandCenter: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const accentColor = isDarkMode ? '#a78bfa' : '#6d28d9';
  const gridStroke = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tickColor = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const tooltipBg = isDarkMode ? '#1f1f1f' : '#fff';
  const tooltipBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipText = isDarkMode ? '#fff' : '#000';

  // Clock state
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setTimeStr(n.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(n.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // WebSocket status
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected'>('connecting');
  useEffect(() => {
    const timer = setTimeout(() => {
      setWsStatus('connected');
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Toasts
  interface Toast {
    id: string;
    title: string;
    body: string;
    color: string;
  }
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (title: string, body: string, color: string) => {
    const id = Math.random().toString();
    setToasts(prev => [{ id, title, body, color }, ...prev]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // Interactive deck states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHealthTier, setSelectedHealthTier] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [activeBottleneck, setActiveBottleneck] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerEmail, setComposerEmail] = useState({ to: '', subject: '', body: '', name: '', action: '' });

  // KPIs
  const [kpis, setKpis] = useState({
    rev: { val: 851.2, hist: [790, 800, 811, 820, 829, 838, 845, 851.2], target: 900, label: 'Revenue — MTD', suffix: ' Cr', prefix: '₹', color: '#3b82f6' },
    margin: { val: 36.2, hist: [34.2, 34.6, 34.9, 35.2, 35.6, 35.9, 36.0, 36.2], target: 37.0, label: 'Gross Margin', suffix: '%', prefix: '', color: '#10b981' },
    orders: { val: 4218, hist: [3800, 3900, 3980, 4050, 4100, 4150, 4190, 4218], target: 5000, label: 'Orders — Today', suffix: '', prefix: '', color: '#8b5cf6' },
    stock: { val: 7, hist: [3, 3, 4, 4, 5, 6, 6, 7], target: 3, label: 'Active Stockouts', suffix: '', prefix: '', color: '#ef4444' },
    fcast: { val: 94.6, hist: [96.1, 95.8, 95.4, 95.2, 95.0, 94.9, 94.7, 94.6], target: 97.0, label: 'Forecast Attainment', suffix: '%', prefix: '', color: '#f59e0b' },
  });
  const [kpiFlash, setKpiFlash] = useState<Record<string, 'up' | 'dn' | null>>({});

  // Jitter KPIs
  const stockToasted = useRef(false);
  useEffect(() => {
    const interval = setInterval(() => {
      const keys = ['rev', 'margin', 'orders', 'stock', 'fcast'] as const;
      const key = keys[Math.floor(Math.random() * keys.length)];
      const delta = (Math.random() - 0.3) * { rev: 0.4, margin: 0.02, orders: 8, stock: 0.3, fcast: 0.05 }[key];

      setKpis(prev => {
        const k = prev[key];
        const rawVal = k.val + delta;
        const newVal = key === 'orders' ? Math.max(0, Math.round(rawVal)) : parseFloat(Math.max(0, rawVal).toFixed(1));

        const wasUp = newVal > k.val;
        setKpiFlash(f => ({ ...f, [key]: wasUp ? 'up' : 'dn' }));
        setTimeout(() => {
          setKpiFlash(f => ({ ...f, [key]: null }));
        }, 800);

        if (key === 'stock' && newVal > 8 && !stockToasted.current) {
          stockToasted.current = true;
          addToast('Stockout threshold breach', `${newVal} active stockouts — threshold is 3`, '#ef4444');
          setAlerts(prevAlerts => {
            const newAlert = {
              id: 'stk-' + Date.now(),
              sev: 'critical',
              sevC: '#ef4444',
              title: `Active stockouts now at ${newVal} — threshold breached`,
              desc: 'Supply · Auto-escalation triggered',
              dismissed: false
            };
            return [newAlert, ...prevAlerts];
          });
        }

        const newHist = [...k.hist.slice(1), newVal];
        return {
          ...prev,
          [key]: { ...k, val: newVal, hist: newHist }
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Events Feed
  const EVENT_TEMPLATES = [
    { sev: 'info', sevC: '#3b82f6', type: 'Demand', msgs: ['Mango Fizz 500ml — reorder triggered: 12,000 units', 'E-Commerce channel orders up 18% in last 2hrs', 'Oat Cookies demand spike detected — APAC region', 'Customer return rate dropped to 1.2% — all categories'] },
    { sev: 'warning', sevC: '#f59e0b', type: 'Supply', msgs: ['Fabric Softener stock level below safety threshold', 'Lead time breach — supplier notification sent', 'Cold chain temperature alert — Mumbai DC resolved', 'Freight cost increase 4% — Mumbai to Bangalore lane'] },
    { sev: 'critical', sevC: '#ef4444', type: 'Margin', msgs: ['Margin erosion detected: Green Tea RTD promo overlap', 'Price floor breach on Choco Wafers — auto-flagged', 'Promotional budget 83% consumed — 14 days remaining', 'Cost variance alert: packaging +7% vs budget'] },
    { sev: 'info', sevC: '#10b981', type: 'Finance', msgs: ['Invoice cleared: Supplier ID #4821 — ₹2.3 Cr', 'Revenue milestone: ₹850 Cr MTD achieved', 'GST reconciliation complete — no discrepancies', 'Quarterly audit trail generated and archived'] },
    { sev: 'info', sevC: '#8b5cf6', type: 'Launch', msgs: ['Mango Fizz 750ml — shelf placement confirmed: 240 stores', 'Launch readiness score updated: 82/100', 'Market test: Herbal Shampoo new variant — positive signal', 'NPD gate review scheduled: Thursday 10:00 AM'] },
  ];

  const generateInitialEvents = () => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const tmpl = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
      const msg = tmpl.msgs[Math.floor(Math.random() * tmpl.msgs.length)];
      const timeObj = new Date(now.getTime() - i * 60000);
      const timeStr = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      list.push({
        id: 'init-' + i + '-' + Date.now(),
        sev: tmpl.sev,
        sevC: tmpl.sevC,
        type: tmpl.type,
        msg,
        time: timeStr
      });
    }
    return list;
  };

  const [feedEvents, setFeedEvents] = useState(() => generateInitialEvents());
  const [eventCount, setEventCount] = useState(12);
  const [eventFilter, setEventFilter] = useState('all');

  // Timer for adding events
  useEffect(() => {
    const scheduleNextEvent = () => {
      const delay = 1800 + Math.random() * 4200;
      return setTimeout(() => {
        const tmpl = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
        const msg = tmpl.msgs[Math.floor(Math.random() * tmpl.msgs.length)];
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newEv = {
          id: 'dyn-' + Date.now(),
          sev: tmpl.sev,
          sevC: tmpl.sevC,
          type: tmpl.type,
          msg,
          time: timeStr
        };

        setFeedEvents(prev => [newEv, ...prev.slice(0, 79)]);
        setEventCount(c => c + 1);

        if (tmpl.sev === 'critical' && Math.random() > 0.6) {
          addToast('Critical alert', msg, '#ef4444');
          setAlerts(prevAlerts => {
            if (prevAlerts.some(a => a.title === msg)) return prevAlerts;
            const newAlert = {
              id: 'dyn-al-' + Date.now(),
              sev: 'critical',
              sevC: '#ef4444',
              title: msg,
              desc: tmpl.type + ' · Auto-detected',
              dismissed: false
            };
            return [newAlert, ...prevAlerts.slice(0, 11)];
          });
        }
        timerId = scheduleNextEvent();
      }, delay);
    };

    let timerId = scheduleNextEvent();
    return () => clearTimeout(timerId);
  }, []);

  // Alerts
  const [alerts, setAlerts] = useState([
    { id: 'a1', sev: 'critical', sevC: '#ef4444', title: 'Fabric Softener — 7 stockout events this quarter', desc: 'Supply · Lead time 35d vs 14d benchmark · APAC affected', dismissed: false },
    { id: 'a2', sev: 'critical', sevC: '#ef4444', title: 'Choco Wafers promo dependency 72% — margin at risk', desc: 'Margin · Only 28% organic revenue. Budget review required.', dismissed: false },
    { id: 'a3', sev: 'warning', sevC: '#f59e0b', title: 'Americas forecast attainment dropped to 78%', desc: 'Finance · Q4 shortfall of ₹12Cr projected if trend continues', dismissed: false },
    { id: 'a4', sev: 'warning', sevC: '#f59e0b', title: 'Beverages cannibalization — Mango Fizz variants', desc: 'Demand · Promo correlation −0.62 between 250ml and 500ml', dismissed: false },
    { id: 'a5', sev: 'info', sevC: '#3b82f6', title: 'Herbal Shampoo growing 28% YoY — supply scale opportunity', desc: 'Supply · Lead time 11d allows rapid ramp-up', dismissed: false },
  ]);

  const handleDismissAlert = (id: string, title: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    addToast('Alert action logged', `Alert dismissed: "${title.substring(0, 25)}..."`, '#3b82f6');
  };

  // Decisions
  const [decisions, setDecisions] = useState([
    { id: 'd1', icon: '⚡', iconBg: 'rgba(239,68,68,0.1)', iconColor: '#ef4444', title: 'Rationalize Floor Cleaner', sub: 'Complexity 0.81 · Value 0.22', stats: [['Revenue at risk', '₹38 Cr'], ['Margin', '15%'], ['Complexity rank', '#1'], ['Stockouts', '7 events']], done: false },
    { id: 'd2', icon: '📦', iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3b82f6', title: 'Scale Herbal Shampoo supply', sub: 'Growth 28% · Lead time 11d', stats: [['Current rev', '₹108 Cr'], ['Growth', '28% YoY'], ['Margin', '47%'], ['Supply gap', '₹22 Cr']], done: false },
  ]);

  const handleApproveDecision = (id: string, title: string) => {
    setDecisions(prev => prev.filter(d => d.id !== id));
    addToast('Decision Recorded', `Approved: "${title}"`, '#10b981');
  };

  const handleDeferDecision = (id: string, title: string) => {
    setDecisions(prev => prev.filter(d => d.id !== id));
    addToast('Decision Deferred', `Deferred: "${title}"`, '#f59e0b');
  };

  // Approvals
  const [approvals, setApprovals] = useState([
    { id: 'p1', type: 'Launch', title: 'Mango Fizz 750ml — budget ₹4.2 Cr', age: '2d', urgency: 'high', done: false },
    { id: 'p2', type: 'Promo', title: 'Choco Wafers Q4 promo extension', age: '4d', urgency: 'medium', done: false },
    { id: 'p3', type: 'CAPEX', title: 'New cold-chain facility — ₹18 Cr', age: '6d', urgency: 'high', done: false },
  ]);

  const handleScheduleMeeting = (id: string, title: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
    addToast('Meeting Scheduled', `Calendar request logged for: "${title}"`, '#3b82f6');
  };

  const handleRemindLater = (id: string, title: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
    addToast('Reminder Set', `Snoozed. Will remind you in 2 hours for: "${title}"`, '#f59e0b');
  };

  const openEmailComposer = (to: string, name: string, subject: string, body: string) => {
    setComposerEmail({ to, name, subject, body, action: '' });
    setComposerOpen(true);
  };

  // Region and Bottleneck data
  const regions = [
    { name: 'APAC', rev: '₹312 Cr', pct: 94, delta: '+7.6%', up: true },
    { name: 'Americas', rev: '₹228 Cr', pct: 78, delta: '−5.0%', up: false },
    { name: 'EMEA', rev: '₹311 Cr', pct: 88, delta: '+2.0%', up: true },
  ];

  const bottlenecks = [
    {
      label: 'Fabric Softener',
      val: 95,
      color: '#ef4444',
      status: 'critical',
      location: 'Penang, Malaysia (SEA Hub)',
      cause: 'Surfactant chemical raw material delay due to port congestion in Singapore. Current lead times have reached 35 days vs. a 14-day baseline, causing line stoppage risk.',
      suggestions: [
        {
          action: 'Transition production to local vendor ChemCorp Malaysia on a premium contract.',
          impact: 'Resolves 80% supply gap in 5 days; +4% unit cost.',
          contactName: 'Marcus Ng',
          contactTitle: 'Global Procurement Director',
          email: 'marcus.ng@aciesglobal.com',
          draftBody: 'Hi Marcus,\n\nRegarding the surfactant supply bottleneck for Fabric Softener at the Penang plant, please initiate the local vendor transition to ChemCorp Malaysia under the emergency premium contract to avoid factory downtime.\n\nThanks,\nVP Product Management'
        },
        {
          action: 'Utilize lower-concentration surfactant formulation (Recipe version 2.4) for standard batches.',
          impact: 'Extends existing stock by 14 days; negligible product feel change.',
          contactName: 'Dr. Elena Rostova',
          contactTitle: 'R&D Product Lead',
          email: 'elena.rostova@aciesglobal.com',
          draftBody: 'Hi Elena,\n\nTo manage the current port congestion bottleneck, can we approve the temporary use of Recipe 2.4 (lower surfactant concentration) for the standard Fabric Softener runs? This will extend our raw material stock by 14 days.\n\nThanks,\nVP Product Management'
        },
        {
          action: 'Initiate emergency stock transfer of 15k finished units from Chennai Hub.',
          impact: 'Fills immediate retail shelf gap for 10 days; +2.5% transit cost.',
          contactName: 'Vijay Kumar',
          contactTitle: 'APAC Logistics Head',
          email: 'vijay.kumar@aciesglobal.com',
          draftBody: 'Hi Vijay,\n\nWe have a critical stockout risk for Fabric Softener in SEA. Please coordinate an immediate transshipment of 15,000 finished units from Chennai Hub to Singapore DC. I approve the expedited air transit cost.\n\nThanks,\nVP Product Management'
        }
      ]
    },
    {
      label: 'Floor Cleaner',
      val: 89,
      color: '#ef4444',
      status: 'critical',
      location: 'Baddi, HP (North India Plant)',
      cause: 'Shortage of customized 1-litre PET bottles due to a mechanical mold breakdown at primary external blowing vendor.',
      suggestions: [
        {
          action: 'Switch bottling temporarily to standard 1.2-litre generic containers with custom overlay stickers.',
          impact: 'Bypasses custom bottle shortage; minor aesthetic package trade-off.',
          contactName: 'Rohan Sharma',
          contactTitle: 'Plant Manager - Baddi',
          email: 'rohan.sharma@aciesglobal.com',
          draftBody: 'Hi Rohan,\n\nDue to the mold breakdown, please execute the contingency plan to bottle Floor Cleaner in the generic 1.2-litre containers. We will apply custom sticker overlays to maintain branding.\n\nThanks,\nVP Product Management'
        },
        {
          action: 'Deploy specialized CNC repair engineers to vendor site with expedited service bonus.',
          impact: 'Restores custom mold within 36 hours; saves ₹18 Lakhs in retailer SLA penalties.',
          contactName: 'Amit Mehta',
          contactTitle: 'Supplier Quality Assurance Lead',
          email: 'amit.mehta@aciesglobal.com',
          draftBody: 'Hi Amit,\n\nPlease dispatch the specialized tooling repair team to our blowing vendor site immediately. I authorize the 2x service acceleration fee to get the mold repaired within 36 hours.\n\nThanks,\nVP Product Management'
        },
        {
          action: 'Prioritize citrus SKU production using remaining custom bottle inventories, pausing lower-margin floral SKU.',
          impact: 'Protects 92% of core category gross margin during outage.',
          contactName: 'Pooja Iyer',
          contactTitle: 'Citrus Category Manager',
          email: 'pooja.iyer@aciesglobal.com',
          draftBody: 'Hi Pooja,\n\nDue to bottle supply constraints, we are prioritizing the high-margin Citrus SKU. Please pause packaging of the Floral SKU and divert all remaining 1L bottles to the Citrus line.\n\nThanks,\nVP Product Management'
        }
      ]
    },
    {
      label: 'Green Tea RTD',
      val: 81,
      color: '#f59e0b',
      status: 'warning',
      location: 'Pune, India (Blending & Bottling)',
      cause: 'Temporary glass bottle manufacturing constraint due to mandatory furnace maintenance at primary glass supplier.',
      suggestions: [
        {
          action: 'Accelerate scheduled aluminum can alternative launch from Q3 to current cycle.',
          impact: 'Bypasses glass bottleneck; attracts eco-conscious consumers.',
          contactName: 'Siddharth Roy',
          contactTitle: 'NPD Project Lead',
          email: 'siddharth.roy@aciesglobal.com',
          draftBody: 'Hi Siddharth,\n\nWith glass bottle supply constrained, we need to bring forward the aluminum can format launch for Green Tea. Can we accelerate the trial production runs to this week?\n\nThanks,\nVP Product Management'
        },
        {
          action: 'Transfer 8,000 cases of safety stock from Western Region to high-velocity Modern Trade accounts.',
          impact: 'Maintains service level at major supermarket chains; slight risk in general trade.',
          contactName: 'Nisha Patel',
          contactTitle: 'Demand Planning Lead',
          email: 'nisha.patel@aciesglobal.com',
          draftBody: 'Hi Nisha,\n\nPlease reallocate 8,000 cases of Green Tea safety stock from Western Regional depot directly to Modern Trade national accounts to avoid stockouts at major retailers.\n\nThanks,\nVP Product Management'
        },
        {
          action: 'Enforce priority shipping rules based on Customer Lifetime Value (CLV) index.',
          impact: 'Maintains 100% service level for top 5 key accounts.',
          contactName: 'Rajesh Verma',
          contactTitle: 'VP Sales',
          email: 'rajesh.verma@aciesglobal.com',
          draftBody: 'Hi Rajesh,\n\nWe are facing supply limitations on Green Tea RTD. Please instruct the team to apply CLV-based priority routing, ensuring our top 5 national retail accounts receive full allocations.\n\nThanks,\nVP Product Management'
        }
      ]
    },
    {
      label: 'Choco Wafers',
      val: 74,
      color: '#f59e0b',
      status: 'warning',
      location: 'Ghent, Belgium (EMEA Confectionery Unit)',
      cause: 'Cocoa solids sourcing delays and cost spike due to West African harvest shortfalls.',
      suggestions: [
        {
          action: 'Secure 3-month supply contract with South American cocoa brokers.',
          impact: 'Stabilizes raw material cost; locks in +6% price premium.',
          contactName: 'Jean-Pierre Dubois',
          contactTitle: 'Commodities Hedging Director',
          email: 'jp.dubois@aciesglobal.com',
          draftBody: 'Hi Jean-Pierre,\n\nGiven the West African cocoa crisis, please execute a 3-month forward contract with our South American partners to secure wafers production volumes.\n\nThanks,\nVP Product Management'
        },
        {
          action: 'Adjust coating recipe to increase whey powder fraction, reducing pure cocoa content by 3%.',
          impact: 'Saves 2.2% cost-to-serve; maintains consumer taste profile.',
          contactName: 'Sarah Jenkins',
          contactTitle: 'Product Scientist',
          email: 'sarah.jenkins@aciesglobal.com',
          draftBody: 'Hi Sarah,\n\nWe need to buffer cocoa cost volatility. Please prepare the lab test and documentation to increase the whey powder ratio in the Choco Wafers coating by 3%.\n\nThanks,\nVP Product Management'
        },
        {
          action: 'Optimize production runs to bi-weekly cycles to maximize energy and setup efficiency.',
          impact: 'Cuts energy overheads by 8%; requires extra 400sqm temp cold storage.',
          contactName: 'Dieter Maes',
          contactTitle: 'Production Scheduler',
          email: 'dieter.maes@aciesglobal.com',
          draftBody: 'Hi Dieter,\n\nTo offset raw material cost increases, let\'s optimize wafer lines into longer, bi-weekly campaigns. Please adjust the scheduling model and secure cold storage backup.\n\nThanks,\nVP Product Management'
        }
      ]
    },
    {
      label: 'Foam Face Wash',
      val: 62,
      color: '#f59e0b',
      status: 'warning',
      location: 'Chennai, Tamil Nadu (Cosmetics Hub)',
      cause: 'Mechanical seal leakage failure on primary automatic foaming-pump packing line.',
      suggestions: [
        {
          action: 'Air-freight replacement seal components from German OEM.',
          impact: 'Reduces line downtime from 14 days to 4 days; ₹45k transit cost.',
          contactName: 'K. Srinivasan',
          contactTitle: 'Maintenance Director',
          email: 'k.srinivasan@aciesglobal.com',
          draftBody: 'Hi Srinivasan,\n\nPlease expedite the order for the replacement pump seals via air freight from Germany. I approve the express delivery fee to minimize line stoppage.\n\nThanks,\nVP Product Management'
        },
        {
          action: 'Initialize secondary manual foaming-pump assembly line with double shifts.',
          impact: 'Restores 60% of output capacity; increases regional labor cost by 12%.',
          contactName: 'Priyanka Rao',
          contactTitle: 'Chennai Plant Supervisor',
          email: 'priyanka.rao@aciesglobal.com',
          draftBody: 'Hi Priyanka,\n\nWhile we wait for pump parts, please stand up the manual assembly lines with double shifts starting tonight to buffer our stock levels.\n\nThanks,\nVP Product Management'
        },
        {
          action: 'Enforce 70% distributor allocation limit on secondary pharmacy chains.',
          impact: 'Protects key retail service agreements; prevents late delivery penalties.',
          contactName: 'Gautam Sen',
          contactTitle: 'National Distribution Manager',
          email: 'gautam.sen@aciesglobal.com',
          draftBody: 'Hi Gautam,\n\nDue to foaming-pump assembly constraints, please cap distribution of Foam Face Wash at 70% for Tier-2 pharmacy accounts, protecting Tier-1 contracts.\n\nThanks,\nVP Product Management'
        }
      ]
    },
    {
      label: 'Herbal Shampoo',
      val: 18,
      color: '#10b981',
      status: 'ok',
      location: 'Vapi, Gujarat (Western Hub)',
      cause: 'Minor cosmetic labeling alignment defect on batch #89 - resolved and cleared.',
      suggestions: [
        {
          action: 'Install inline optical inspection sensors on primary labeling line.',
          impact: 'Avoids manual audit delays; ₹4 Lakhs CAPEX.',
          contactName: 'Vikram Solanki',
          contactTitle: 'QC Manager',
          email: 'vikram.solanki@aciesglobal.com',
          draftBody: 'Hi Vikram,\n\nFollowing the batch #89 labeling issue, let\'s install the optical inspection cameras on the primary line. Please submit the CAPEX proposal for my sign-off.\n\nThanks,\nVP Product Management'
        },
        {
          action: 'Scale plant output by 20% to capitalize on current regional demand growth.',
          impact: 'Captures ₹22 Cr in unsatisfied market orders.',
          contactName: 'Rajendra Patel',
          contactTitle: 'Vapi Hub Director',
          email: 'rajendra.patel@aciesglobal.com',
          draftBody: 'Hi Rajendra,\n\nHerbal Shampoo is tracking very strongly. Please prepare the Vapi plant expansion model to scale throughput by 20% starting next month.\n\nThanks,\nVP Product Management'
        }
      ]
    }
  ];

  // Chart data
  const monthlyRevenueData = [
    { name: 'Jan', Actual: 780, Target: 800 },
    { name: 'Feb', Actual: 795, Target: 812 },
    { name: 'Mar', Actual: 808, Target: 824 },
    { name: 'Apr', Actual: 821, Target: 836 },
    { name: 'May', Actual: 833, Target: 848 },
    { name: 'Jun', Actual: 843, Target: 860 },
    { name: 'Jul', Actual: 854, Target: 872 },
    { name: 'Aug', Actual: 866, Target: 884 },
    { name: 'Sep', Actual: 877, Target: 896 },
    { name: 'Oct', Actual: null, Target: 900 },
  ];

  const categoryMixData = [
    { name: 'Beverages', value: 316 },
    { name: 'Snacks', value: 253 },
    { name: 'Personal Care', value: 225 },
    { name: 'Household', value: 145 },
  ];

  const pieColors = [accentColor, '#10b981', '#8b5cf6', '#f59e0b'];

  const skuHealthData = [
    { name: 'Healthy', count: 58, color: '#10b981' },
    { name: 'At Risk', count: 31, color: '#3b82f6' },
    { name: 'Promo Dep.', count: 22, color: '#f59e0b' },
    { name: 'Declining', count: 10, color: '#ef4444' },
    { name: 'Rationalize', count: 6, color: '#6b7280' },
  ];

  const getFilteredRevenueData = () => {
    if (selectedCategory === 'all') return monthlyRevenueData;
    const factorMap: Record<string, number> = { Beverages: 0.336, Snacks: 0.269, 'Personal Care': 0.239, Household: 0.156 };
    const f = factorMap[selectedCategory] || 1;
    return monthlyRevenueData.map(d => ({
      name: d.name,
      Actual: d.Actual !== null ? Math.round(d.Actual * f * 10) / 10 : null,
      Target: Math.round(d.Target * f * 10) / 10,
    }));
  };
  const activeRevenueData = getFilteredRevenueData();

  const getFilteredSkuHealthData = () => {
    if (selectedCategory === 'all') return skuHealthData;
    const dataMap: Record<string, number[]> = {
      Beverages: [22, 10, 8, 3, 1],
      Snacks: [16, 9, 7, 3, 1],
      'Personal Care': [12, 7, 4, 2, 2],
      Household: [8, 5, 3, 2, 2],
    };
    const counts = dataMap[selectedCategory] || [0, 0, 0, 0, 0];
    return skuHealthData.map((d, idx) => ({
      ...d,
      count: counts[idx] || 0
    }));
  };
  const activeSkuHealthData = getFilteredSkuHealthData();

  const activeAlerts = alerts.filter(a => !a.dismissed);
  const filteredEvents = eventFilter === 'all' ? feedEvents : feedEvents.filter(e => e.type === eventFilter);

  return (
    <div className="space-y-6">
      {/* VP Command Center Sub-Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-5 py-3.5 rounded-sm shadow-sm">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            WebSocket {wsStatus === 'connected' ? 'Connected' : 'Connecting'}
          </span>
          <span className="h-4 w-px bg-black/10 dark:bg-white/15"></span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {eventCount} events streamed today
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-[#6d28d9] dark:text-[#a78bfa]" />
          <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 font-mono">{timeStr}</span>
          <span className="text-zinc-300 dark:text-zinc-650 text-[10px]">|</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{dateStr}</span>
        </div>
      </div>

      {/* Live KPIs - Horizontal Format */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(kpis).map(([key, kpiItem]) => {
          const kpi = kpiItem as any;
          const flash = kpiFlash[key];
          const flashClass = flash === 'up' ? 'text-emerald-500 font-bold' : flash === 'dn' ? 'text-red-500 font-bold' : '';
          
          let deltaText = '';
          let deltaColor = 'text-zinc-500 dark:text-zinc-400';
          if (key === 'rev') {
            deltaText = '▲ +8.4% vs last month';
            deltaColor = 'text-emerald-500';
          } else if (key === 'margin') {
            deltaText = '▲ +1.1pp vs last month';
            deltaColor = 'text-emerald-500';
          } else if (key === 'orders') {
            deltaText = '▲ +12.3% vs yesterday';
            deltaColor = 'text-emerald-500';
          } else if (key === 'stock') {
            deltaText = kpi.val > 3 ? '▲ Threshold breached' : '▼ Within limit';
            deltaColor = kpi.val > 3 ? 'text-red-500 font-bold' : 'text-emerald-500';
          } else if (key === 'fcast') {
            deltaText = '▼ −2.1pp vs target';
            deltaColor = 'text-amber-500';
          }

          return (
            <div key={key} className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex flex-col justify-between h-36 group cursor-pointer hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all">
              <div className="flex justify-between items-start mb-1">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 truncate">{kpi.label}</p>
                  <h3 className={`text-xl font-display font-extrabold text-zinc-850 dark:text-zinc-150 transition-colors duration-300 ${flashClass}`}>
                    {kpi.prefix}{kpi.val}{kpi.suffix}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[8px] uppercase font-bold text-zinc-400">Target</span>
                  <p className="text-[10px] font-bold font-mono text-zinc-550 dark:text-zinc-350 leading-none mt-0.5">{kpi.prefix}{kpi.target}{kpi.suffix}</p>
                </div>
              </div>

              {/* Sparkline chart */}
              <div className="h-[28px] my-1.5 opacity-85 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={kpi.hist.map((val, idx) => ({ idx, val }))} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                    <Area 
                      type="monotone" 
                      dataKey="val" 
                      stroke={kpi.color} 
                      fill={`${kpi.color}15`} 
                      strokeWidth={1.5} 
                      dot={false} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[9px] font-bold uppercase tracking-wider mt-1">
                <span className={deltaColor}>{deltaText}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Command Center Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: BOTTLENECKS & APPROVALS */}
        <div className="xl:col-span-4 space-y-6">
          {/* Bottlenecks */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Supply Bottlenecks</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">2 Critical</span>
            </div>
            <div className="space-y-3">
              {bottlenecks.map(b => (
                <div key={b.label} className="border-b border-black/[0.03] dark:border-white/[0.03] pb-2 last:border-b-0 animate-fadeIn">
                  <button 
                    onClick={() => setActiveBottleneck(b.label)}
                    className="w-full flex items-center justify-between gap-2.5 text-[11px] hover:bg-black/[0.02] dark:hover:bg-white/5 p-2 rounded-sm transition-all focus:outline-none text-left cursor-pointer border-none bg-transparent"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300 truncate" title={b.label}>{b.label}</span>
                    </div>
                    <div className="flex items-center gap-2.5 flex-1 max-w-[120px]">
                      <div className="flex-1 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${b.val}%`, backgroundColor: b.color }} />
                      </div>
                      <span className="text-[10px] font-bold font-mono text-right min-w-[28px]" style={{ color: b.color }}>{b.val}%</span>
                    </div>
                    <span className="text-zinc-400 text-[10px] shrink-0 font-sans hover:translate-x-0.5 transition-transform">
                      ➔
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Pending Approvals</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#8b5cf6] bg-[#8b5cf6]/10 px-2 py-0.5 rounded-full">{approvals.length} Pending</span>
            </div>
            
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {approvals.length > 0 ? (
                approvals.map(a => (
                  <div key={a.id} className="p-3 border border-black/5 dark:border-white/10 rounded-sm bg-zinc-50/50 dark:bg-white/5 flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: a.urgency === 'high' ? '#ef4444' : '#f59e0b' }} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-bold leading-tight text-zinc-800 dark:text-zinc-200 break-words">{a.title}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[9.5px] text-zinc-550 dark:text-zinc-400 leading-none">{a.type} · Waiting {a.age}</p>
                          <span 
                            className={`text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${
                              a.urgency === 'high' 
                                ? 'bg-red-500/10 text-red-500 border-red-500/15' 
                                : 'bg-amber-500/10 text-amber-500 border-amber-500/15'
                            }`}
                          >
                            {a.urgency} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 justify-end pt-1">
                      <button 
                        onClick={() => handleScheduleMeeting(a.id, a.title)} 
                        className="px-2.5 py-1 border border-blue-500/35 text-blue-500 bg-blue-500/5 hover:bg-blue-500 hover:text-white rounded-sm text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Schedule a meeting
                      </button>
                      <button 
                        onClick={() => handleRemindLater(a.id, a.title)} 
                        className="px-2.5 py-1 border border-amber-500/35 text-amber-500 bg-amber-500/5 hover:bg-amber-500 hover:text-white rounded-sm text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Remind me later
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-[10px] text-zinc-500 font-bold py-4">All caught up</p>
              )}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: LIVE EVENT STREAM */}
        <div className="xl:col-span-4 space-y-6 flex flex-col">
          {/* Live Event Stream */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Live Event Stream</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <select 
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1 text-[9px] font-bold text-zinc-600 dark:text-zinc-400 outline-none"
              >
                <option value="all">All Events</option>
                <option value="Supply">Supply</option>
                <option value="Demand">Demand</option>
                <option value="Margin">Margin</option>
                <option value="Launch">Launch</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            {/* Scrollable event lists */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[640px] min-h-[550px]">
              {filteredEvents.map((ev, i) => (
                <div 
                  key={ev.id} 
                  className={`flex items-start justify-between gap-3 p-2 rounded-sm border border-black/5 dark:border-white/5 transition-all text-xs ${
                    i === 0 ? 'bg-black/[0.02] dark:bg-white/5 animate-pulse' : 'bg-transparent'
                  }`}
                >
                  <div className="flex gap-2 min-w-0">
                    <span 
                      className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" 
                      style={{ backgroundColor: ev.sevC }} 
                    />
                    <div className="min-w-0">
                      <p className="text-zinc-800 dark:text-zinc-200 leading-snug font-medium break-words">{ev.msg}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span 
                          className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm"
                          style={{ backgroundColor: `${ev.sevC}15`, color: ev.sevC }}
                        >
                          {ev.type}
                        </span>
                        <span className="text-[8px] opacity-40 font-bold uppercase">{ev.sev}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-550 font-mono whitespace-nowrap">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SMART ALERTS, DECISIONS */}
        <div className="xl:col-span-4 space-y-6">
          {/* Smart Alerts */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Smart Alerts</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">{activeAlerts.length} Active</span>
            </div>
            
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {activeAlerts.length > 0 ? (
                activeAlerts.map(a => (
                  <div key={a.id} className="p-3 border border-black/5 dark:border-white/10 rounded-sm space-y-2 bg-zinc-50/50 dark:bg-white/5">
                    <div className="flex items-start gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: a.sevC, boxShadow: `0 0 6px ${a.sevC}66` }} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-bold leading-tight text-zinc-800 dark:text-zinc-200 break-words">{a.title}</h4>
                        <p className="text-[9.5px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">{a.desc}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 justify-end pt-1">
                      <button 
                        onClick={() => handleDismissAlert(a.id, a.title)} 
                        className="px-2.5 py-1 border border-red-500/35 text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white rounded-sm text-[8.5px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Escalate
                      </button>
                      <button 
                        onClick={() => handleDismissAlert(a.id, a.title)} 
                        className="px-2.5 py-1 border border-emerald-500/35 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white rounded-sm text-[8.5px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Resolve
                      </button>
                      <button 
                        onClick={() => handleDismissAlert(a.id, a.title)} 
                        className="px-2.5 py-1 border border-black/10 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-sm text-[8.5px] font-bold uppercase tracking-wider transition-all cursor-pointer bg-transparent"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-[10px] text-zinc-500 font-bold py-4">✓ All alerts resolved</p>
              )}
            </div>
          </div>

          {/* Decisions Pending */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-sm shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Decisions Pending</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">{decisions.length} Pending</span>
            </div>
            
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {decisions.length > 0 ? (
                decisions.map(d => (
                  <div key={d.id} className="border border-black/10 dark:border-white/10 rounded-sm bg-zinc-50/50 dark:bg-white/5 overflow-hidden">
                    <div className="p-3 flex items-start gap-2.5 border-b border-black/5 dark:border-white/5">
                      <div className="w-7 h-7 rounded-sm flex items-center justify-center text-sm shrink-0 font-bold" style={{ backgroundColor: d.iconBg, color: d.iconColor }}>
                        {d.icon}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">{d.title}</h4>
                        <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5">{d.sub}</p>
                      </div>
                    </div>
                    <div className="p-3 space-y-1.5">
                      {d.stats.map(([label, val]) => (
                        <div key={label} className="flex justify-between items-center text-[10px] border-b border-black/[0.03] dark:border-white/[0.03] pb-1">
                          <span className="text-zinc-500">{label}</span>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono">{val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex border-t border-black/5 dark:border-white/5">
                      <button 
                        onClick={() => handleApproveDecision(d.id, d.title)} 
                        className="flex-1 py-2 text-center text-[9px] font-bold uppercase tracking-wider text-white bg-[#6d28d9] dark:bg-[#a78bfa] hover:opacity-95 transition-opacity cursor-pointer border-none"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleDeferDecision(d.id, d.title)} 
                        className="flex-1 py-2 text-center text-[9px] font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border-none bg-transparent border-l border-black/5 dark:border-white/5"
                      >
                        Defer
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-[10px] text-zinc-500 font-bold py-4">No pending decisions</p>
              )}
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
              <h5 className="text-[11px] font-bold text-zinc-805 dark:text-zinc-105 leading-none">{t.title}</h5>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">{t.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Email Composer Modal */}
      <EmailComposerModal 
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        initialEmail={composerEmail}
        onSend={(name, email, subject, body) => {
          setComposerOpen(false);
          addToast(
            'Mitigation Request Sent', 
            `Request email has been sent successfully to ${name} (${email}) regarding this bottleneck.`, 
            '#10b981'
          );
        }}
      />

      {/* Bottleneck Details Modal */}
      <BottleneckDetailsModal 
        isOpen={!!activeBottleneck}
        bottleneck={bottlenecks.find(x => x.label === activeBottleneck) || null}
        onClose={() => setActiveBottleneck(null)}
        onRequestAction={(email, name, subject, body) => {
          openEmailComposer(email, name, subject, body);
        }}
      />
    </div>
  );
};

export const PortfolioHealthMap: React.FC<PortfolioHealthMapProps> = ({ role, isDarkMode }) => {
  if (role === 'VP Product Management') {
    return <VPCommandCenter isDarkMode={isDarkMode} />;
  }

  const [activeSubTab, setActiveSubTab] = useState<string>('ph-kpi');
  
  const accentColor = isDarkMode ? '#a78bfa' : '#6d28d9';
  const gridStroke = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tickColor = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const tooltipBg = isDarkMode ? '#1f1f1f' : '#fff';
  const tooltipBorder = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const tooltipText = isDarkMode ? '#fff' : '#000';
  const nonAccentColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
  
  // ─── Sub-Tab 0: KPI Filters & Recalculations ────────────────────────────────
  const [filterCat, setFilterCat] = useState<string>('all');
  const [filterMinRev, setFilterMinRev] = useState<number>(0);
  const [filteredSKUs, setFilteredSKUs] = useState(() => [...SKUS]);

  // Guide accordion toggles
  const [openGuides, setOpenGuides] = useState<Record<string, boolean>>({});
  const toggleGuide = (id: string) => {
    setOpenGuides(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApplyFilters = () => {
    const res = SKUS.filter(s => {
      const matchCat = filterCat === 'all' || s.cat === filterCat;
      const matchRev = s.rev >= filterMinRev;
      return matchCat && matchRev;
    });
    setFilteredSKUs(res.length ? res : [...SKUS]);
  };

  const handleResetFilters = () => {
    setFilterCat('all');
    setFilterMinRev(0);
    setFilteredSKUs([...SKUS]);
  };

  // Compute KPIs dynamically based on filtered SKUs
  const totalRev = filteredSKUs.reduce((sum, s) => sum + s.rev, 0);
  const avgMargin = filteredSKUs.reduce((sum, s) => sum + s.margin, 0) / filteredSKUs.length;
  const avgGrowth = filteredSKUs.reduce((sum, s) => sum + s.growth, 0) / filteredSKUs.length;
  const avgCx = filteredSKUs.reduce((sum, s) => sum + s.cx, 0) / filteredSKUs.length;
  const avgPromo = filteredSKUs.reduce((sum, s) => sum + s.promo, 0) / filteredSKUs.length;
  const avgLead = filteredSKUs.reduce((sum, s) => sum + s.lead, 0) / filteredSKUs.length;
  const totalStockouts = filteredSKUs.reduce((sum, s) => sum + s.stockouts, 0);
  const highValCount = filteredSKUs.filter(s => s.val >= 0.6).length;
  const pci = (avgCx * 0.8 + avgPromo * 0.5 + (avgLead / 35) * 0.4) / 1.7;

  const kpisData = [
    { label: 'Total Revenue', value: `₹${Math.round(totalRev)}Cr`, delta: '+12%', dir: 'up', risk: false, info: 'Total portfolio net sales' },
    { label: 'Avg Gross Margin', value: `${avgMargin.toFixed(1)}%`, delta: '+1.4pp', dir: 'up', risk: false, info: 'Unweighted gross margin average' },
    { label: 'Revenue Growth', value: `${(avgGrowth * 100).toFixed(1)}%`, delta: 'YoY', dir: avgGrowth > 0 ? 'up' : 'down', risk: false, info: 'Year-over-year revenue change' },
    { label: 'Portfolio Complexity', value: pci.toFixed(3), delta: '+0.04', dir: 'up', risk: true, info: 'Portfolio Complexity Index score' },
    { label: 'Promo Dependency', value: `${(avgPromo * 100).toFixed(0)}%`, delta: '+3pp', dir: 'up', risk: true, info: 'Revenue earned during promotions' },
    { label: 'Avg Lead Time', value: `${Math.round(avgLead)}d`, delta: '+2d', dir: 'up', risk: true, info: 'Average supplier fulfillment time' },
    { label: 'Total Stockouts', value: totalStockouts, delta: 'events', dir: totalStockouts > 15 ? 'down' : 'up', risk: true, info: 'Sum of stockout incidents' },
    { label: 'High-Value SKUs', value: `${highValCount}/${filteredSKUs.length}`, delta: '', dir: 'up', risk: false, info: 'SKUs with Value Score >= 0.6' },
  ];

  // Report download trigger
  const handleGenerateReport = () => {
    const reportText = `Portfolio Report — Category: ${filterCat}\n\n` + 
      kpisData.map(k => `${k.label}: ${k.value}`).join('\n') + 
      `\n\nGenerated: ${new Date().toLocaleString()}`;
    alert(reportText);
  };

  // ─── Sub-Tab 1: Value × Complexity Matrix ──────────────────────────────────
  const [customSKU, setCustomSKU] = useState<CustomSKUType | null>(null);
  
  // Custom SKU form state
  const [custName, setCustName] = useState('Mango Fizz 750ml');
  const [custCat, setCustCat] = useState('Beverages');
  const [custRev, setCustRev] = useState(120);
  const [custMargin, setCustMargin] = useState(38);
  const [custLead, setCustLead] = useState(18);
  const [custPromo, setCustPromo] = useState(12);

  const handleAddCustomSKU = () => {
    // Normalise pricing and operations to 0-1 scores
    const normVal = (custRev / 150 * 0.4) + (custMargin / 50 * 0.4) + 0.2;
    const normCx = (custLead / 35 * 0.5) + (custPromo / 80 * 0.5);

    const newItem: CustomSKUType = {
      name: custName,
      cat: custCat,
      rev: custRev,
      margin: custMargin,
      lead: custLead,
      promo: custPromo / 100,
      val: +Math.min(1, Math.max(0, normVal)).toFixed(2),
      cx: +Math.min(1, Math.max(0, normCx)).toFixed(2),
      stockouts: 2,
      growth: 0.12
    };

    setCustomSKU(newItem);
  };

  const handleClearCustomSKU = () => {
    setCustomSKU(null);
  };

  const matrixSKUs = [...SKUS, ...(customSKU ? [customSKU] : [])];

  // Color mapping
  const categoryColors: Record<string, string> = {
    Beverages: accentColor,
    Snacks: '#0F6E56',
    'Personal Care': '#185FA5',
    Household: '#854F0B',
    Custom: '#ED93B1'
  };

  // Map data for Scatter Top SKUs in Sub-Tab 0
  const scatterData = filteredSKUs.map(s => ({
    name: s.name,
    cx: s.cx,
    val: s.val,
    rev: s.rev,
    cat: s.cat,
    fill: categoryColors[s.cat] || '#888'
  }));

  // Map data for Quadrant Scatter in Sub-Tab 1
  const matrixScatterData = matrixSKUs.map(s => {
    const isCustom = customSKU && s.name === customSKU.name;
    return {
      name: s.name,
      cx: s.cx,
      val: s.val,
      rev: s.rev,
      cat: isCustom ? 'Custom' : s.cat,
      fill: isCustom ? categoryColors.Custom : (categoryColors[s.cat] || '#888')
    };
  });

  // ─── Sub-Tab 2: Revenue Pareto Analysis ─────────────────────────────────────
  const [paretoThreshold, setParetoThreshold] = useState<number>(80);
  
  // Sort SKUs by revenue descending
  const sortedSKUs = [...SKUS].sort((a, b) => b.rev - a.rev);
  const paretoTotal = sortedSKUs.reduce((sum, s) => sum + s.rev, 0);
  
  let runningSum = 0;
  const paretoData = sortedSKUs.map((s, idx) => {
    runningSum += s.rev;
    const cumPct = Math.round((runningSum / paretoTotal) * 100);
    return {
      name: s.name.split(' ')[0], // short name
      fullName: s.name,
      Revenue: s.rev,
      Cumulative: cumPct,
      index: idx + 1
    };
  });

  // Find how many SKUs are needed to cross the threshold
  let crossIdx = 0;
  let runningPct = 0;
  for (let i = 0; i < sortedSKUs.length; i++) {
    runningPct += sortedSKUs[i].rev;
    if ((runningPct / paretoTotal) * 100 >= paretoThreshold) {
      crossIdx = i + 1;
      break;
    }
  }

  // ─── Sub-Tab 3: Channel Performance ─────────────────────────────────────────
  const [channelFilterCat, setChannelFilterCat] = useState<string>('all');
  
  const channelDataMap = [
    { name: 'Modern Trade', Beverages: 120, Snacks: 85, 'Personal Care': 90, Household: 45 },
    { name: 'E-Commerce', Beverages: 95, Snacks: 110, 'Personal Care': 95, Household: 50 },
    { name: 'General Trade', Beverages: 60, Snacks: 45, 'Personal Care': 30, Household: 35 },
    { name: 'Pharmacy', Beverages: 10, Snacks: 5, 'Personal Care': 62, Household: 25 },
    { name: 'D2C', Beverages: 31, Snacks: 8, 'Personal Care': 28, Household: 28 },
  ];

  // Calculate values for channels based on category filter
  const channelComputedData = channelDataMap.map(ch => {
    let value = 0;
    if (channelFilterCat === 'all') {
      value = ch.Beverages + ch.Snacks + ch['Personal Care'] + ch.Household;
    } else {
      value = ch[channelFilterCat as keyof typeof ch] as number || 0;
    }
    return { name: ch.name, Revenue: value };
  });

  const totalChannelRev = channelComputedData.reduce((sum, c) => sum + c.Revenue, 0);
  const pieData = channelComputedData.map(c => ({
    name: c.name,
    value: c.Revenue,
    pct: Math.round((c.Revenue / totalChannelRev) * 100)
  }));

  const pieColors = [accentColor, '#0F6E56', '#185FA5', '#854F0B', '#ED93B1'];

  // ─── Sub-Tab 4: Rationalization Simulator ───────────────────────────────
  const [cxT, setCxT] = useState<number>(0.60);
  const [revF, setRevF] = useState<number>(20);
  const [transfer, setTransfer] = useState<number>(40);
  const [opsRate, setOpsRate] = useState<number>(28);

  const candidates = SKUS.filter(s => s.cx >= cxT && s.rev <= revF);
  const simTotalRev = SKUS.reduce((sum, s) => sum + s.rev, 0);
  const simCandRev = candidates.reduce((sum, s) => sum + s.rev, 0);
  const simRevAtRisk = Math.round(simCandRev * (1 - transfer / 100));
  const simOpsSaving = Math.round(simCandRev * (opsRate / 100));
  
  const sumCx = SKUS.reduce((sum, s) => sum + s.cx, 0);
  const candCx = candidates.reduce((sum, s) => sum + s.cx, 0);
  const simNewPCI = ((sumCx - candCx) / (SKUS.length - candidates.length || 1)).toFixed(3);
  const simBasePCI = (sumCx / SKUS.length).toFixed(3);

  const simNetRevAfter = simTotalRev - simRevAtRisk;
  const simNetPortfolio = simNetRevAfter + simOpsSaving;

  const simWaterfallData = [
    { name: 'Portfolio Revenue', bottom: 0, value: simTotalRev, displayVal: simTotalRev, color: accentColor },
    { name: 'Revenue at Risk', bottom: Math.min(simTotalRev, simNetRevAfter), value: simRevAtRisk, displayVal: -simRevAtRisk, color: '#A32D2D' },
    { name: 'Ops Savings', bottom: Math.min(simNetRevAfter, simNetPortfolio), value: simOpsSaving, displayVal: simOpsSaving, color: '#0F6E56' },
    { name: 'Net Portfolio', bottom: 0, value: simNetPortfolio, displayVal: simNetPortfolio, color: accentColor }
  ];

  const handleExportCSV = () => {
    const csvContent = "SKU,Category,Revenue,Complexity,Stockouts\n" + 
      candidates.map(s => `${s.name},${s.cat},${s.rev},${s.cx},${s.stockouts}`).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rationalization_candidates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Header Banner */}
      <div className="glass-card bg-acies-gray text-white py-5 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
          <Layers size={100} />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex-1 pr-4">
            <p className="text-[9px] uppercase font-bold tracking-widest opacity-40 mb-2">Interactive Explorer · Tab 1 of 6</p>
            <h2 className="text-xl font-display font-medium text-white mb-2">Portfolio Health Map</h2>
            <p className="text-xs text-zinc-300 font-medium max-w-xl leading-relaxed">
              Analyze SKU value, complexity, and operational fragility. Click the sub-tabs below to explore quadrant matrices, pareto analysis, channel mixes, and Sunset simulations.
            </p>
          </div>
          
          <div className="flex flex-wrap lg:flex-nowrap gap-px shrink-0 bg-white/5 p-1 rounded-sm">
            {[
              { label: 'Safety Capital Released', value: '₹42.2 Cr', sub: 'Optimized tail reduction target' },
              { label: 'Tail Burden Ratio', value: '66.7%', sub: 'SKUs driving <1% sales aggregate' },
              { label: 'Max Revenue Risk', value: '27.08%', sub: 'EBITDA impact if all candidates rationalized' },
            ].map((stat, i) => (
              <div key={i} className="pl-4 pr-5 py-2 min-w-[140px] border-r border-white/5 last:border-none">
                <p className="text-[8px] opacity-40 uppercase font-bold mb-0.5">{stat.label}</p>
                <p className="text-sm font-display text-acies-yellow leading-none mb-1">{stat.value}</p>
                <p className="text-[7.5px] opacity-35 leading-snug">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-Tab Rows Navigation */}
      <div className="flex flex-wrap border-b border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-2">
        {[
          { id: 'ph-kpi', label: 'KPI Overview' },
          { id: 'ph-matrix', label: 'Value × Complexity' },
          { id: 'ph-pareto', label: 'Revenue Analysis' },
          { id: 'ph-channel', label: 'Channel Performance' },
          { id: 'ph-sim', label: 'Rationalization Sim' },
        ].map(st => (
          <button
            key={st.id}
            onClick={() => setActiveSubTab(st.id)}
            className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest cursor-pointer border-b-2 transition-all hover:text-acies-yellow ${
              activeSubTab === st.id 
                ? 'border-acies-yellow text-acies-yellow font-bold' 
                : 'border-transparent text-zinc-400 dark:text-zinc-400 hover:border-zinc-400'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          SUB-TAB 0: KPI OVERVIEW 
          ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'ph-kpi' && (
        <div className="space-y-6">
          
          {/* How to read accordion */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4">
            <button 
              onClick={() => toggleGuide('kpi')}
              className="w-full text-left font-bold text-xs uppercase tracking-widest text-acies-yellow flex justify-between items-center cursor-pointer border-none bg-transparent"
            >
              <span>📖 How to read this tab</span>
              <span className="text-[10px]">{openGuides.kpi ? '✕ Collapse' : '▲ Expand'}</span>
            </button>
            
            {openGuides.kpi && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-black/5 dark:border-white/5 mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                <div>
                  <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">1. Understand the KPI strip</h4>
                  <p>8 headline metrics at the top. Green ▲ = healthy improvement. Red ▲ = rising risk (complexity, stockouts). Each card updates live.</p>
                </div>
                <div>
                  <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">2. Filter dynamically</h4>
                  <p>Use the form to narrow by category, or minimum revenue. The entire dashboard recalculates instantly. Try category selection to verify.</p>
                </div>
                <div>
                  <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">3. Identify risk signals</h4>
                  <p>Portfolio Complexity Index &gt; 0.55 and Promo Dependency &gt; 40% are red flags. High stockout counts indicate supply fragility.</p>
                </div>
                <div>
                  <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">4. Export insights</h4>
                  <p>Click "Generate Report" to create a summary of current filters. Use this for weekly decks or stakeholder updates.</p>
                </div>
              </div>
            )}
          </div>

          {/* Filters Form */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Filter size={12} />
              Filter Portfolio View
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Category</label>
                <select 
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                  className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
                >
                  <option value="all">All Categories</option>
                  <option>Beverages</option>
                  <option>Snacks</option>
                  <option>Personal Care</option>
                  <option>Household</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Min Revenue (₹ Cr)</label>
                <input 
                  type="number" 
                  value={filterMinRev}
                  onChange={(e) => setFilterMinRev(parseFloat(e.target.value) || 0)}
                  min="0"
                  className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-2 text-xs font-semibold text-acies-gray dark:text-white outline-none"
                />
              </div>
              <div className="flex items-end gap-2">
                <button 
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2 bg-acies-gray text-white text-[9px] font-bold uppercase tracking-widest hover:bg-acies-yellow hover:text-acies-gray transition-all cursor-pointer border-none"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={handleResetFilters}
                  className="px-4 py-2 border border-black/10 dark:border-white/10 text-zinc-500 text-[9px] font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  Reset
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="px-4 py-2 border border-black/10 dark:border-white/10 text-acies-yellow text-[9px] font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  Report
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic KPI Strip (8 cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpisData.map((k, i) => {
              const roleHighlight = role === 'VP Product Management' && (i === 0 || i === 3);
              const highlightBorder = roleHighlight ? 'border-2 border-acies-yellow shadow-lg shadow-acies-yellow/5' : 'border-black/5 dark:border-white/10';
              return (
                <div key={k.label} className={`glass-card bg-white dark:bg-white/5 border ${highlightBorder} p-4 flex flex-col justify-between h-28`}>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest opacity-40 flex items-center justify-between">
                      {k.label}
                      <span className="text-zinc-500 cursor-pointer" title={k.info}><Info size={10} /></span>
                    </p>
                    <h3 className="text-xl font-display font-bold text-acies-gray dark:text-white mt-1.5">{k.value}</h3>
                  </div>
                  <div className="mt-2 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                    <span className={k.risk ? 'text-red-500' : 'text-green-500'}>
                      {k.dir === 'up' ? '▲' : '▼'} {k.delta}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Revenue vs Complexity Scatter chart */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest">Top SKU Performance — Revenue vs Complexity</h3>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">Bubble size = revenue. Hover any bubble for details.</p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis type="number" dataKey="cx" name="Complexity" domain={[0, 1]} tick={{ fill: tickColor, fontSize: 9 }} label={{ value: 'Complexity →', position: 'bottom', fill: tickColor, fontSize: 10, offset: 5 }} />
                  <YAxis type="number" dataKey="val" name="Value" domain={[0, 1]} tick={{ fill: tickColor, fontSize: 9 }} label={{ value: '← Value', angle: -90, position: 'left', fill: tickColor, fontSize: 10, offset: 5 }} />
                  <ZAxis type="number" dataKey="rev" range={[50, 450]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                    itemStyle={{ fontSize: 11 }}
                    labelStyle={{ fontSize: 11, fontWeight: 'bold' }}
                    formatter={(value: any, name: any, props: any) => {
                      if (name === 'Revenue') return [`₹${value}Cr`, 'Revenue'];
                      return [value, name];
                    }}
                  />
                  <Scatter data={scatterData} fill="#8884d8">
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList dataKey="name" position="top" style={{ fill: 'rgba(255,255,255,0.5)', fontSize: 8, pointerEvents: 'none' }} />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          SUB-TAB 1: VALUE × COMPLEXITY MATRIX
          ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'ph-matrix' && (
        <div className="space-y-6">
          
          <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4">
            <button 
              onClick={() => toggleGuide('matrix')}
              className="w-full text-left font-bold text-xs uppercase tracking-widest text-acies-yellow flex justify-between items-center cursor-pointer border-none bg-transparent"
            >
              <span>📖 How to read this matrix</span>
              <span className="text-[10px]">{openGuides.matrix ? '✕ Collapse' : '▲ Expand'}</span>
            </button>
            
            {openGuides.matrix && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-black/5 dark:border-white/5 mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                <div>
                  <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">1. Understand the axes</h4>
                  <p>X-axis = Operational Complexity (supply chain friction). Y-axis = Commercial Value (revenue + margin + growth). Both 0–1 normalized.</p>
                </div>
                <div>
                  <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">2. Read the quadrants</h4>
                  <p><strong>Keep</strong> (top-left) = high value, low complexity. <strong>Grow</strong> (top-right) = high value, high complexity. <strong>Consolidate</strong> (bottom-left) = low value, low complexity. <strong>Rationalize</strong> (bottom-right) = low value, high complexity.</p>
                </div>
                <div>
                  <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">3. Plot custom scenarios</h4>
                  <p>Type in a new SKU brief parameters (revenue, margin, lead times) and click plot. Verify its positioning as a pink bubble inside a quadrant.</p>
                </div>
                <div>
                  <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">4. Segment candidates</h4>
                  <p>SKUs inside the bottom-right quadrant are severe resource sinks. These are Sunset/rationalization priority candidates.</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Custom SKUbrief Plotting Form */}
            <div className="lg:col-span-4 flex flex-col justify-between glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Plus size={12} />
                  Add Custom SKU brief
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">SKU Name</label>
                    <input 
                      type="text" 
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-xs text-acies-gray dark:text-white outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Category</label>
                    <select 
                      value={custCat}
                      onChange={(e) => setCustCat(e.target.value)}
                      className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-xs text-acies-gray dark:text-white outline-none"
                    >
                      <option>Beverages</option>
                      <option>Snacks</option>
                      <option>Personal Care</option>
                      <option>Household</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Projected Revenue (₹ Cr)</label>
                    <input 
                      type="number" 
                      value={custRev}
                      onChange={(e) => setCustRev(parseInt(e.target.value) || 0)}
                      className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-xs text-acies-gray dark:text-white outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Gross Margin %</label>
                    <input 
                      type="number" 
                      value={custMargin}
                      onChange={(e) => setCustMargin(parseInt(e.target.value) || 0)}
                      className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-xs text-acies-gray dark:text-white outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Lead Time (days)</label>
                    <input 
                      type="number" 
                      value={custLead}
                      onChange={(e) => setCustLead(parseInt(e.target.value) || 0)}
                      className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-xs text-acies-gray dark:text-white outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest opacity-40">Promo Budget %</label>
                    <input 
                      type="number" 
                      value={custPromo}
                      onChange={(e) => setCustPromo(parseInt(e.target.value) || 0)}
                      className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-xs text-acies-gray dark:text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                <button 
                  onClick={handleAddCustomSKU}
                  className="flex-1 px-4 py-2 bg-acies-gray text-white text-[9px] font-bold uppercase tracking-widest hover:bg-acies-yellow hover:text-acies-gray transition-all cursor-pointer border-none"
                >
                  Plot SKU
                </button>
                {customSKU && (
                  <button 
                    onClick={handleClearCustomSKU}
                    className="p-2 border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all cursor-pointer rounded-sm"
                    title="Remove custom SKU"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Quadrant Map */}
            <div className="lg:col-span-8 glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5 relative">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Value × Complexity Matrix Map</h3>
              
              {/* Labels for Quadrants overlaid inside the chart block visually */}
              <div className="absolute top-16 left-12 opacity-25 text-[10px] font-bold uppercase tracking-widest text-green-500 pointer-events-none">Keep (High Val / Easy Ops)</div>
              <div className="absolute top-16 right-8 opacity-25 text-[10px] font-bold uppercase tracking-widest text-blue-500 pointer-events-none">Grow (High Val / Complex Ops)</div>
              <div className="absolute bottom-12 left-12 opacity-25 text-[10px] font-bold uppercase tracking-widest text-amber-500 pointer-events-none">Consolidate (Low Val / Easy Ops)</div>
              <div className="absolute bottom-12 right-8 opacity-25 text-[10px] font-bold uppercase tracking-widest text-red-500 pointer-events-none">Rationalize (Low Val / Complex Ops)</div>

              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis type="number" dataKey="cx" name="Complexity" domain={[0, 1]} tick={{ fill: tickColor, fontSize: 9 }} label={{ value: 'Complexity →', position: 'bottom', fill: tickColor, fontSize: 10 }} />
                    <YAxis type="number" dataKey="val" name="Value" domain={[0, 1]} tick={{ fill: tickColor, fontSize: 9 }} label={{ value: '← Value', angle: -90, position: 'left', fill: tickColor, fontSize: 10 }} />
                    <ZAxis type="number" dataKey="rev" range={[60, 450]} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                      itemStyle={{ fontSize: 11 }}
                      labelStyle={{ fontSize: 11, fontWeight: 'bold' }}
                      formatter={(value: any, name: any) => {
                        if (name === 'Revenue') return [`₹${value}Cr`, 'Revenue'];
                        return [value, name];
                      }}
                    />
                    <Scatter data={matrixScatterData}>
                      {matrixScatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <LabelList dataKey="name" position="top" style={{ fill: 'rgba(255,255,255,0.5)', fontSize: 8, pointerEvents: 'none' }} />
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          SUB-TAB 2: REVENUE PARETO ANALYSIS
          ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'ph-pareto' && (
        <div className="space-y-6">
          
          <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1">Pareto Concentration Analysis</h3>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Understand revenue concentration across your SKUs</p>
            
            {/* Pareto Slider */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-6 p-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm">
              <div className="md:col-span-3 flex flex-col gap-2 justify-center">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span>Pareto Revenue Cut-Off Threshold</span>
                  <span className="text-acies-yellow font-extrabold">{paretoThreshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={paretoThreshold}
                  onChange={(e) => setParetoThreshold(parseInt(e.target.value) || 80)}
                  className="w-full accent-acies-yellow cursor-pointer h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"
                />
              </div>
              <div className="flex flex-col justify-center items-center p-3 bg-acies-gray text-white text-center rounded-sm">
                <p className="text-[8px] font-bold opacity-45 uppercase tracking-widest mb-1">Current Diagnosis</p>
                <h4 className="text-xl font-display font-bold text-acies-yellow">{crossIdx} SKUs</h4>
                <p className="text-[8.5px] opacity-40 uppercase font-extrabold mt-0.5">drive {paretoThreshold}% of revenue</p>
              </div>
            </div>

            {/* Recharts Pareto Chart */}
            <div className="h-96 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={paretoData} margin={{ top: 20, right: -5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fill: tickColor, fontSize: 9 }} label={{ value: 'Revenue (₹ Cr)', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: tickColor, fontSize: 9 }} label={{ value: 'Cumulative %', angle: 90, position: 'insideRight', fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                    itemStyle={{ fontSize: 11 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                  
                  {/* Bars for individual revenues */}
                  <Bar yAxisId="left" dataKey="Revenue" fill={accentColor} barSize={16}>
                    {paretoData.map((entry, index) => {
                      const isHighValue = index < crossIdx;
                      return <Cell key={`cell-${index}`} fill={isHighValue ? accentColor : nonAccentColor} />;
                    })}
                  </Bar>
                  
                  {/* Line overlay for cumulative percentage */}
                  <Line yAxisId="right" type="monotone" dataKey="Cumulative" stroke="#0F6E56" strokeWidth={2} dot={{ r: 3, fill: '#0F6E56' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          SUB-TAB 3: CHANNEL PERFORMANCE
          ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'ph-channel' && (
        <div className="space-y-6">
          
          <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-black/5 dark:border-white/5 mb-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest">Multi-Channel Revenue Performance</h3>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">Slicing retail revenues across Modern Trade, E-Commerce, General Trade, Pharmacy, and D2C</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold opacity-45 uppercase">Select Category:</span>
                <select 
                  value={channelFilterCat}
                  onChange={(e) => setChannelFilterCat(e.target.value)}
                  className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-1.5 text-xs text-acies-gray dark:text-white outline-none"
                >
                  <option value="all">All Categories</option>
                  <option>Beverages</option>
                  <option>Snacks</option>
                  <option>Personal Care</option>
                  <option>Household</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Channel Revenues Bar chart */}
              <div className="lg:col-span-8">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Revenue Breakdown by Channel</h4>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={channelComputedData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                      <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                        itemStyle={{ fontSize: 11 }}
                      />
                      <Bar dataKey="Revenue" fill="#185FA5" barSize={28}>
                        {channelComputedData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Channel Mix Pie chart */}
              <div className="lg:col-span-4 flex flex-col justify-center items-center border-l border-black/5 dark:border-white/5 pl-6">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Channel Revenue Share</h4>
                <div className="w-full h-48 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie 
                        data={pieData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={50} 
                        outerRadius={80} 
                        paddingAngle={3}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value}Cr`} />
                    </RePieChart>
                  </ResponsiveContainer>
                  
                  {/* Center revenue label */}
                  <div className="absolute text-center">
                    <p className="text-[8px] font-bold uppercase tracking-widest opacity-40 leading-none mb-1">Total</p>
                    <p className="text-base font-display font-extrabold text-acies-gray dark:text-white leading-none">₹{totalChannelRev}Cr</p>
                  </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-2 mt-4 text-[9px] font-extrabold uppercase tracking-wider">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pieColors[i % pieColors.length] }} />
                      <span className="truncate opacity-75">{d.name}:</span>
                      <span className="text-acies-yellow">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          SUB-TAB 4: RATIONALIZATION SIMULATOR
          ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'ph-sim' && (
        <div className="space-y-6">
          
          {/* How to read guide */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-4">
            <button 
              onClick={() => toggleGuide('sim')}
              className="w-full text-left font-bold text-xs uppercase tracking-widest text-acies-yellow flex justify-between items-center cursor-pointer border-none bg-transparent"
            >
              <span>📖 Using the simulator</span>
              <span className="text-[10px]">{openGuides.sim ? '✕ Collapse' : '▲ Expand'}</span>
            </button>
            
            {openGuides.sim && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-black/5 dark:border-white/5 mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                <div>
                  <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">1. Set criteria</h4>
                  <p>Define complexity threshold and revenue floor. SKUs above complexity AND below revenue floor are rationalization candidates.</p>
                </div>
                <div>
                  <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">2. Model the impact</h4>
                  <p>The sim calculates: candidates count, revenue at risk (after transfer), ops savings, and new portfolio Complexity Index.</p>
                </div>
                <div>
                  <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">3. Demand transfer rate</h4>
                  <p>Adjust the slider to model how much revenue transfers to remaining SKUs. 40% transfer means 60% of revenue truly lost.</p>
                </div>
                <div>
                  <h4 className="font-bold text-acies-gray dark:text-white mb-1.5">4. Export candidates</h4>
                  <p>Click "Export List" to download a CSV of rationalization candidates for further offline audit.</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Control Sliders Panel */}
            <div className="lg:col-span-5 glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <RefreshCw size={12} className="animate-spin-slow text-acies-yellow" />
                Configure Simulator Parameters
              </h3>
              
              {/* Slider 1: Complexity Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span>Complexity Threshold</span>
                  <span className="text-acies-yellow font-extrabold">{cxT.toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.3" 
                  max="0.9" 
                  step="0.05"
                  value={cxT}
                  onChange={(e) => setCxT(parseFloat(e.target.value) || 0)}
                  className="w-full accent-acies-yellow cursor-pointer h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"
                />
                <p className="text-[8px] text-zinc-500 font-semibold uppercase tracking-wider">SKUs above this operational complexity level are candidates</p>
              </div>

              {/* Slider 2: Revenue Floor */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span>Revenue Floor (₹ Cr)</span>
                  <span className="text-acies-yellow font-extrabold">₹{revF}Cr</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="80" 
                  step="5"
                  value={revF}
                  onChange={(e) => setRevF(parseInt(e.target.value) || 0)}
                  className="w-full accent-acies-yellow cursor-pointer h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"
                />
                <p className="text-[8px] text-zinc-500 font-semibold uppercase tracking-wider">SKUs with revenue below this level are candidates</p>
              </div>

              {/* Slider 3: Demand Transfer Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span>Demand Transfer Rate</span>
                  <span className="text-acies-yellow font-extrabold">{transfer}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="80" 
                  step="5"
                  value={transfer}
                  onChange={(e) => setTransfer(parseInt(e.target.value) || 0)}
                  className="w-full accent-acies-yellow cursor-pointer h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"
                />
                <p className="text-[8px] text-zinc-500 font-semibold uppercase tracking-wider">% of candidate revenue salvaged by transfers to remaining SKUs</p>
              </div>

              {/* Slider 4: Ops Savings Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span>Ops Savings Rate</span>
                  <span className="text-acies-yellow font-extrabold">{opsRate}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="50" 
                  step="2"
                  value={opsRate}
                  onChange={(e) => setOpsRate(parseInt(e.target.value) || 0)}
                  className="w-full accent-acies-yellow cursor-pointer h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"
                />
                <p className="text-[8px] text-zinc-500 font-semibold uppercase tracking-wider">Supplier overhead reduction realized per rationalized SKU</p>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5 flex gap-2">
                <button 
                  onClick={handleExportCSV}
                  className="w-full py-2 bg-acies-gray text-white text-[9px] font-bold uppercase tracking-widest hover:bg-acies-yellow hover:text-acies-gray transition-all cursor-pointer rounded-sm border-none flex items-center justify-center gap-1"
                >
                  📤 Export Candidate List
                </button>
                <button 
                  onClick={() => {
                    setCxT(0.60);
                    setRevF(20);
                    setTransfer(40);
                    setOpsRate(28);
                  }}
                  className="w-32 py-2 border border-black/10 dark:border-white/10 text-zinc-500 text-[9px] font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer rounded-sm"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Simulated Results Dashboard */}
            <div className="lg:col-span-7 glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Simulation Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Card 1: Candidates count */}
                  <div className="p-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm relative">
                    <span className="absolute top-3 right-3 text-[9px] text-zinc-500 font-bold">Sunset</span>
                    <p className="text-[8px] font-bold uppercase opacity-45 tracking-widest mb-1.5">Candidates</p>
                    <h4 className="text-xl font-display font-bold text-red-500">{candidates.length} SKUs</h4>
                    <p className="text-[8px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase mt-1">To rationalize from 12 portfolio items</p>
                  </div>

                  {/* Card 2: Revenue at Risk */}
                  <div className="p-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm relative">
                    <span className="absolute top-3 right-3 text-[9px] text-zinc-500 font-bold">Risk</span>
                    <p className="text-[8px] font-bold uppercase opacity-45 tracking-widest mb-1.5">Revenue at Risk</p>
                    <h4 className="text-xl font-display font-bold text-amber-500">₹{simRevAtRisk}Cr</h4>
                    <p className="text-[8px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase mt-1">Unsalvaged net revenue after transfer</p>
                  </div>

                  {/* Card 3: Ops Savings */}
                  <div className="p-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm relative">
                    <span className="absolute top-3 right-3 text-[9px] text-zinc-500 font-bold">Savings</span>
                    <p className="text-[8px] font-bold uppercase opacity-45 tracking-widest mb-1.5">Ops Savings</p>
                    <h4 className="text-xl font-display font-bold text-green-500">₹{simOpsSaving}Cr</h4>
                    <p className="text-[8px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase mt-1">Released supplier admin burden</p>
                  </div>

                  {/* Card 4: New Complexity Index (PCI) */}
                  <div className="p-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm relative">
                    <span className="absolute top-3 right-3 text-[9px] text-zinc-500 font-bold">Complexity</span>
                    <p className="text-[8px] font-bold uppercase opacity-45 tracking-widest mb-1.5">New Portfolio PCI</p>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-xl font-display font-bold text-blue-500">{simNewPCI}</h4>
                      <span className="text-[9px] opacity-40 font-bold line-through">{simBasePCI}</span>
                    </div>
                    <p className="text-[8px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase mt-1">Complexity target is ≤ 0.420</p>
                  </div>

                </div>
              </div>

              {/* Action alert suggestion */}
              <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-2">
                <Zap size={14} className="stroke-[2.5] text-acies-yellow fill-acies-yellow" />
                Candidates represent {Math.round(simCandRev / (simTotalRev || 1) * 100)}% of total portfolio sales. Sunset review recommended.
              </div>

            </div>

          </div>

          {/* Waterfall Chart */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1">Impact Waterfall</h3>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-4">Revenue before/after rationalization + ops savings recovery</p>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={simWaterfallData} margin={{ top: 25, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: tickColor, fontSize: 9 }} label={{ value: '₹ Crore', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
                    itemStyle={{ fontSize: 11 }}
                    formatter={(value: any, name: any, props: any) => {
                      return [`₹${props.payload.displayVal}Cr`, 'Value'];
                    }}
                  />
                  <Bar dataKey="bottom" stackId="sim-wfall" fill="transparent" />
                  <Bar dataKey="value" stackId="sim-wfall" radius={2}>
                    {simWaterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Candidates List Table */}
          <div className="glass-card bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Rationalization Candidates List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10 text-[9px] uppercase tracking-widest font-extrabold opacity-40 h-8">
                    <th className="pb-2">SKU Name</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2 text-right">Revenue</th>
                    <th className="pb-2 text-right">Complexity</th>
                    <th className="pb-2 text-right">Stockouts</th>
                    <th className="pb-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5 font-semibold">
                  {candidates.length > 0 ? (
                    candidates.map((s, idx) => (
                      <tr key={idx} className="h-10 hover:bg-black/[0.01] dark:hover:bg-white/[0.02]">
                        <td className="text-acies-gray dark:text-white font-bold">{s.name}</td>
                        <td>{s.cat}</td>
                        <td className="text-right">₹{s.rev}Cr</td>
                        <td className="text-right text-red-500 font-extrabold">{s.cx.toFixed(2)}</td>
                        <td className="text-right">{s.stockouts}</td>
                        <td className="text-center">
                          <span className="text-[8px] font-extrabold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-sm">
                            Rationalize
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-6 font-bold text-zinc-500 uppercase">
                        No candidates at current thresholds
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
