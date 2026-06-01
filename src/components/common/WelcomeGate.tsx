import React from 'react';
import { motion } from 'motion/react';
import { Award, Activity, TrendingUp, ChevronRight } from 'lucide-react';
import { Role } from '../../types/dashboard';

interface WelcomeGateProps {
  onSelectRole: (role: Role) => void;
}

export const WelcomeGate: React.FC<WelcomeGateProps> = ({ onSelectRole }) => {
  const personas = [
    {
      role: 'VP Product Management' as Role,
      title: 'VP Product Management',
      subtitle: 'Strategic & Executive Command',
      icon: Award,
      description: 'Focuses on high-level strategic KPIs, exception escalations, revenue tail risks, and automated strategic decisions.',
      highlight: 'Strategic Overview',
      bgGradient: 'from-amber-500/25 via-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/60 hover:border-amber-400 group-hover:shadow-amber-500/20',
      badgeColor: 'bg-amber-400/20 text-amber-300 font-extrabold border border-amber-500/50',
      iconColor: 'text-amber-400',
      hoverIconBg: 'group-hover:bg-amber-400 group-hover:text-black',
      hoverTitleColor: 'group-hover:text-amber-400',
    },
    {
      role: 'Product Manager' as Role,
      title: 'Product Manager',
      subtitle: 'Operational & Execution Lens',
      icon: Activity,
      description: 'Monitors product lifecycle stages, operational supply chain barriers, and stage-gate launching checklists.',
      highlight: 'Operational Workflows',
      bgGradient: 'from-emerald-500/25 via-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/60 hover:border-emerald-400 group-hover:shadow-emerald-500/20',
      badgeColor: 'bg-emerald-400/20 text-emerald-300 font-extrabold border border-emerald-500/50',
      iconColor: 'text-emerald-400',
      hoverIconBg: 'group-hover:bg-emerald-400 group-hover:text-black',
      hoverTitleColor: 'group-hover:text-emerald-400',
    },
    {
      role: 'Pricing and Margin Partner' as Role,
      title: 'Pricing & Margin Partner',
      subtitle: 'Financial & Leakage Diagnostics',
      icon: TrendingUp,
      description: 'Examines gross margin waterfalls, cost-to-serve leakages, and promotional erosion scenarios.',
      highlight: 'Financial Diagnostics',
      bgGradient: 'from-blue-500/25 via-blue-500/10 to-transparent',
      borderColor: 'border-blue-500/60 hover:border-blue-400 group-hover:shadow-blue-500/20',
      badgeColor: 'bg-blue-400/20 text-blue-300 font-extrabold border border-blue-500/50',
      iconColor: 'text-blue-400',
      hoverIconBg: 'group-hover:bg-blue-400 group-hover:text-black',
      hoverTitleColor: 'group-hover:text-blue-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0c0e] via-[#141418] to-[#08080a] text-white flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-body select-none">
      
      {/* Premium Multi-Color Radial Glow Background Effects - High Contrast */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-amber-500/15 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/15 blur-[120px] pointer-events-none animate-pulse-slow" />

      <div className="w-full max-w-5xl z-10 space-y-12">
        
        {/* Top Logo & Header */}
        <div className="text-center space-y-5">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="bg-amber-400 p-2.5 flex items-center justify-center shadow-lg shadow-amber-500/20 rounded-sm">
              <Activity size={24} className="text-black font-bold stroke-[3]" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-display font-extrabold leading-none text-white tracking-wide">Acies AgenticBus</h1>
              <p className="text-[9.5px] uppercase tracking-[0.25em] font-black text-amber-400 mt-1">Product Lifecycle and Portfolio Intelligence</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-2xl mx-auto space-y-3"
          >
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-wide leading-tight mt-4">
              Select You Profile
            </h2>
            <p className="text-sm md:text-base text-zinc-100 font-semibold max-w-xl mx-auto leading-relaxed opacity-90">
              Configure the active portfolio intelligence, KPI metrics, and guided workflows tailored specifically to your organizational role.
            </p>
          </motion.div>
        </div>

        {/* 3 Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.role}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.025, y: -6 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => onSelectRole(p.role)}
                className={`bg-[#16161c] hover:bg-[#1e1e26] border ${p.borderColor} p-6 flex flex-col justify-between h-[395px] cursor-pointer transition-all duration-300 relative group shadow-2xl rounded-sm`}
              >
                {/* Visual Glow Indicator on Hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 bg-white/5 border border-white/10 text-amber-400 rounded-sm transition-all duration-300 ${p.hoverIconBg}`}>
                      <Icon size={22} className="stroke-[2.5]" />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-sm ${p.badgeColor}`}>
                      {p.highlight}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <h3 className={`text-xl font-display font-extrabold text-white transition-colors duration-300 ${p.hoverTitleColor}`}>
                      {p.title}
                    </h3>
                    <p className="text-[9.5px] uppercase font-black tracking-widest text-zinc-300">{p.subtitle}</p>
                  </div>

                  <p className="text-xs text-zinc-100 font-semibold leading-relaxed transition-colors duration-300 opacity-90">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[9.5px] font-black uppercase tracking-wider text-amber-400 border-t border-white/5 pt-4 mt-auto group-hover:text-amber-300 group-hover:translate-x-1 transition-all duration-300">
                  Configure Dashboard
                  <ChevronRight size={12} className="stroke-[3]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-[9px] text-zinc-400 font-black tracking-[0.25em] pt-4 opacity-80"
        >
          Acies Global Virtual Labs • Secure Role Authentication
        </motion.div>

      </div>
    </div>
  );
};
