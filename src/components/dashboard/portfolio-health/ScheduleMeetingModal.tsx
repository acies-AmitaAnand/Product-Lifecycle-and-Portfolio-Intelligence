import React from 'react';
import { Calendar, User, Mail, X, Users } from 'lucide-react';

interface MeetingTeamOption {
  action: string;
  impact: string;
  contactName: string;
  contactTitle: string;
  email: string;
  draftBody: string;
}

interface ApprovalItem {
  id: string;
  type: string;
  title: string;
  age: string;
  urgency: string;
  done: boolean;
}

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  approval: ApprovalItem | null;
  onClose: () => void;
  onRequestAction: (email: string, name: string, subject: string, body: string) => void;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  isOpen,
  approval,
  onClose,
  onRequestAction
}) => {
  if (!isOpen || !approval) return null;

  // Respective teams/options depending on approval type
  const getTeamOptions = (): MeetingTeamOption[] => {
    if (approval.type === 'CAPEX') {
      return [
        {
          action: 'Audit Capital Allocation & Finance Sync',
          impact: 'Secures Q3 CAPEX reserves for facility buildout',
          contactName: 'Ananya Sen',
          contactTitle: 'VP Finance',
          email: 'ananya.sen@aciesglobal.com',
          draftBody: `Hi Ananya,\n\nI want to schedule an urgent meeting to sync on the CAPEX allocation for the "${approval.title}". Let's align on the Q3 capital reserves.\n\nThanks,\nVP Product Management`
        },
        {
          action: 'Cold-Chain Supplier Procurement Alignment',
          impact: 'Vets compliant temperature-controlled logistics vendors',
          contactName: 'Vikram Solanki',
          contactTitle: 'QC Manager & Logistics Lead',
          email: 'vikram.solanki@aciesglobal.com',
          draftBody: `Hi Vikram,\n\nLet's schedule a meeting to review the qualified cold-chain suppliers for the "${approval.title}" buildout to ensure QA standards are met.\n\nThanks,\nVP Product Management`
        }
      ];
    } else if (approval.type === 'Promo') {
      return [
        {
          action: 'Pricing Floor & Gross Margin Integrity Check',
          impact: 'Ensures margin floor won\'t collapse below the 20% limit',
          contactName: 'Priya Sharma',
          contactTitle: 'Brand Director',
          email: 'priya.sharma@aciesglobal.com',
          draftBody: `Hi Priya,\n\nI\'d like to schedule a brief meeting to verify the gross margin protection and pricing floors for the "${approval.title}". Let\'s review Q4 ROI.\n\nThanks,\nVP Product Management`
        },
        {
          action: 'Inventory Stock Allocation & Fulfillment Sync',
          impact: 'Aligns supply levels to prevent promo-driven stockout events',
          contactName: 'Rajendra Patel',
          contactTitle: 'Vapi Hub Director',
          email: 'rajendra.patel@aciesglobal.com',
          draftBody: `Hi Rajendra,\n\nLet's schedule a meeting to sync on warehouse inventory levels and stock allocation for the upcoming "${approval.title}". We need to prevent stockouts.\n\nThanks,\nVP Product Management`
        }
      ];
    } else {
      // Launch / default
      return [
        {
          action: 'GTM Pricing & Product Packaging Review',
          impact: 'Ensures launch molds are certified and QA approved',
          contactName: 'Amit Verma',
          contactTitle: 'NPD Lead',
          email: 'amit.verma@aciesglobal.com',
          draftBody: `Hi Amit,\n\nI'd like to schedule a meeting to review packaging compliance, molds certification, and first-year pricing models for "${approval.title}".\n\nThanks,\nVP Product Management`
        },
        {
          action: 'Regional Retail Placement & Key Account Launch Sync',
          impact: 'Confirms front-row shelf allocations across 240 key stores',
          contactName: 'Karan Johar',
          contactTitle: 'Retail Relations Director',
          email: 'karan.johar@aciesglobal.com',
          draftBody: `Hi Karan,\n\nLet's schedule a meeting to review the regional shelf placement contracts and account launches for "${approval.title}". We want optimal positioning.\n\nThanks,\nVP Product Management`
        }
      ];
    }
  };

  const options = getTeamOptions();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 p-6 rounded shadow-2xl flex flex-col gap-4 text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-black/15 dark:border-white/15 pb-2">
          <div className="flex items-center gap-1.5 text-[#3b82f6]">
            <Calendar size={15} />
            <span className="text-[14px] font-display font-bold text-zinc-800 dark:text-zinc-100">
              Schedule Sync Meeting
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded text-zinc-400 hover:text-zinc-655 cursor-pointer border-none bg-transparent"
          >
            <X size={14} />
          </button>
        </div>
        
        {/* Item Details */}
        <div className="flex justify-between items-start gap-2 bg-zinc-50 dark:bg-white/5 p-3 rounded border border-black/5 dark:border-white/10">
          <div className="flex items-center gap-1.5 text-zinc-550 dark:text-zinc-300">
            <Users size={12} className="text-zinc-400" />
            <span className="font-bold text-[10px] uppercase tracking-wider">{approval.title}</span>
          </div>
          <span className={`text-[8.5px] uppercase font-extrabold px-2 py-0.5 rounded-sm ${
            approval.urgency === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
          }`}>
            {approval.urgency} Urgency
          </span>
        </div>

        {/* Root Cause Context */}
        <div>
          <p className="font-bold text-[9px] uppercase tracking-widest text-zinc-400 mb-1">Approval Request context</p>
          <p className="text-zinc-655 dark:text-zinc-350 leading-relaxed font-normal">
            To proceed with this item, a cross-functional alignment session is required with the departments owning the execution risks, operational logistics, and capital reserves.
          </p>
        </div>

        {/* Suggested Team Meetings List */}
        <div className="space-y-2.5">
          <p className="font-bold text-[9px] uppercase tracking-widest text-zinc-400">Responsible Departments & Leads</p>
          {options.map((s, idx) => (
            <div 
              key={idx} 
              className="p-3 bg-white dark:bg-zinc-850 border border-black/5 dark:border-white/10 rounded-sm hover:border-black/15 dark:hover:border-white/20 transition-all flex flex-col gap-1.5 shadow-sm"
            >
              <div className="flex items-start gap-1.5">
                <span className="text-[11px] font-bold text-blue-500 shrink-0 mt-0.5">0{idx + 1}</span>
                <div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200 leading-snug">{s.action}</p>
                  <p className="text-[9px] opacity-45 leading-none mt-1">
                    Lead: <span className="font-extrabold">{s.contactName}</span> ({s.contactTitle})
                  </p>
                </div>
              </div>
              
              <div className="pl-4 flex items-center justify-between gap-2 border-t border-black/[0.03] dark:border-white/[0.03] pt-1.5 mt-0.5">
                <div className="text-[9.5px] text-zinc-500 dark:text-zinc-400 font-medium">
                  <span className="opacity-60 uppercase font-bold text-[8px] tracking-wider block">Objective</span>
                  {s.impact}
                </div>
                <button
                  onClick={() => onRequestAction(s.email, s.contactName, `Urgent Sync: ${approval.title} Approval Alignment`, s.draftBody)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-wider text-white bg-blue-500 hover:bg-blue-600 rounded-sm transition-all cursor-pointer border-none"
                >
                  <Mail size={9} />
                  Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end border-t border-black/15 dark:border-white/15 pt-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-sm font-bold uppercase tracking-wider text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer bg-transparent"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
