import React, { useState } from 'react';
import { REGIONAL_DATA, SKUS } from '../../../constants/data';
import { ArrowRight, Truck, Clock, ShieldCheck, AlertTriangle, Play, HelpCircle, Layers, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

// Geographic coordinate proxies for dynamic distance/leadtime/freight calculations
const COUNTRY_COORDS: Record<string, { x: number; y: number }> = {
  'Netherlands': { x: 5.0, y: 5.0 },
  'Germany':     { x: 6.0, y: 5.0 },
  'Poland':      { x: 8.0, y: 5.0 },
  'Austria':     { x: 6.5, y: 4.0 },
  'Italy':       { x: 6.5, y: 2.0 },
  'France':      { x: 4.0, y: 4.5 },
  'Spain':       { x: 1.0, y: 2.5 }
};

const mapX = (x: number) => 12 + (x - 1) * 11.5;
const mapY = (y: number) => 68 - (y - 2) * 16;

export const CrossLocationTransfer: React.FC = () => {
  const [selectedSku, setSelectedSku] = useState<string>('Mango Fizz 500ml');
  const [sourceCountry, setSourceCountry] = useState<string>('Netherlands');
  const [targetCountry, setTargetCountry] = useState<string>('Austria');
  const [isTransferred, setIsTransferred] = useState<boolean>(false);

  // Retrieve SKU and Region details
  const skuDetails = SKUS.find(s => s.name === selectedSku) || SKUS[0];
  const sourceRegion = REGIONAL_DATA.find(r => r.country === sourceCountry) || REGIONAL_DATA[6];
  const targetRegion = REGIONAL_DATA.find(r => r.country === targetCountry) || REGIONAL_DATA[4];

  // Coordinates
  const sourceCoord = COUNTRY_COORDS[sourceCountry] || { x: 5, y: 5 };
  const targetCoord = COUNTRY_COORDS[targetCountry] || { x: 6, y: 4 };

  // Dynamic Distance Calculation
  const dx = targetCoord.x - sourceCoord.x;
  const dy = targetCoord.y - sourceCoord.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Dynamic Freight Margin Penalty (farther = higher freight drag)
  const freightDrag = distance === 0 ? 0 : parseFloat((distance * 0.38 + 0.2).toFixed(2));
  
  // Dynamic Transit Lead Time addition (farther = longer delay)
  const transitLeadTime = distance === 0 ? 0 : parseFloat((distance * 0.85 + 0.5).toFixed(1));

  // Dynamic Route Feasibility Score (0 - 100)
  const feasibilityScore = distance === 0 ? 100 : Math.max(10, Math.min(98, Math.round(98 - (distance * 12))));

  // Margin Yield Difference
  const marginDelta = parseFloat((targetRegion.marginPct - sourceRegion.marginPct).toFixed(2));
  
  // Net Assortment Margin Lift
  const netMarginLift = parseFloat((marginDelta - freightDrag).toFixed(2));

  // Route Risk Classification
  const getRiskLevel = () => {
    if (distance === 0) return { label: 'Invalid Route', class: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20' };
    if (feasibilityScore >= 75) return { label: 'Low Risk / High Feasibility', class: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    if (feasibilityScore >= 45) return { label: 'Medium Risk / Feasible', class: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    return { label: 'High Risk / Severe Friction', class: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
  };

  const risk = getRiskLevel();

  const handleApplyTransfer = () => {
    if (sourceCountry === targetCountry) {
      alert("Source and Target countries must be different to execute a cross-location transfer.");
      return;
    }
    setIsTransferred(true);
    alert(`Assortment Listing Transfer Committed! Shifting ${selectedSku} listing from ${sourceCountry} shelf to ${targetCountry} catalog. Logistics teams notified to establish inter-depot route (+${transitLeadTime} days transit lead time).`);
    
    // Reset transfer state after 3 seconds
    setTimeout(() => {
      setIsTransferred(false);
    }, 4000);
  };

  return (
    <div className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-5 flex flex-col mb-6">
      
      {/* Header Info */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h4 className="text-xs uppercase font-bold tracking-widest text-zinc-400">Cross-Location Assortment Reallocation</h4>
          <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">Reallocate listing allocations between geographies, balancing margin lifts against transportation friction and transit delays.</p>
        </div>
        <span className="text-[7.5px] uppercase font-extrabold tracking-widest text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded">
          Supply Chain Integrated
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Step 1: Select SKU & Route */}
        <div className="space-y-4">
          <h5 className="text-[9px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1.5 border-b border-black/5 dark:border-white/5 pb-1">
            <Layers size={10} className="text-blue-500" />
            1. Select Variant & Route
          </h5>

          {/* SKU Dropdown */}
          <div className="space-y-1">
            <label className="text-[8px] uppercase font-bold text-zinc-400">Product Variant</label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="w-full bg-black/5 dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded px-2.5 py-1.5 text-[10px] outline-none text-zinc-800 dark:text-zinc-200"
            >
              {SKUS.map(s => (
                <option key={s.name} value={s.name}>{s.name} ({s.cat})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Source Region Selector */}
            <div className="space-y-1">
              <label className="text-[8px] uppercase font-bold text-zinc-400">Source Country</label>
              <select
                value={sourceCountry}
                onChange={(e) => setSourceCountry(e.target.value)}
                className="w-full bg-black/5 dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded px-2.5 py-1.5 text-[10px] outline-none text-zinc-800 dark:text-zinc-200"
              >
                {REGIONAL_DATA.map(r => (
                  <option key={r.country} value={r.country}>{r.country}</option>
                ))}
              </select>
            </div>

            {/* Target Region Selector */}
            <div className="space-y-1">
              <label className="text-[8px] uppercase font-bold text-zinc-400">Target Country</label>
              <select
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full bg-black/5 dark:bg-zinc-800 border border-black/10 dark:border-white/10 rounded px-2.5 py-1.5 text-[10px] outline-none text-zinc-800 dark:text-zinc-200"
              >
                {REGIONAL_DATA.map(r => (
                  <option key={r.country} value={r.country}>{r.country}</option>
                ))}
              </select>
            </div>
          </div>

          {sourceCountry === targetCountry && (
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[8.5px] font-bold rounded">
              Select different source and target countries to calculate logistics friction.
            </div>
          )}
        </div>

        {/* Step 2: Route Dynamics & Risk Visualizer */}
        <div className="space-y-4">
          <h5 className="text-[9px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1.5 border-b border-black/5 dark:border-white/5 pb-1">
            <Truck size={10} className="text-acies-yellow" />
            2. Logistics Route Friction
          </h5>

          {sourceCountry !== targetCountry ? (
            <div className="space-y-3">
              {/* Dynamic SVG Map */}
              <div className="relative w-full h-[125px] bg-slate-950/40 dark:bg-black/45 rounded-sm border border-black/10 dark:border-white/10 overflow-hidden select-none">
                {/* Distance & CO2 labels */}
                <div className="absolute top-2 right-2 bg-black/60 text-[6.5px] font-mono px-1.5 py-0.5 rounded text-zinc-450 flex gap-2">
                  <span>Dist: {Math.round(distance * 320)} km</span>
                  <span>CO₂: {(distance * 0.14).toFixed(2)} kg/u</span>
                </div>
                
                {/* SVG canvas */}
                <svg viewBox="0 0 100 80" className="w-full h-full">
                  <style>{`
                    @keyframes dash {
                      to {
                        stroke-dashoffset: -20;
                      }
                    }
                    .animate-path {
                      animation: dash 5s linear infinite;
                    }
                  `}</style>
                  
                  {/* Network background mesh links */}
                  <line x1={mapX(1.0)} y1={mapY(2.5)} x2={mapX(4.0)} y2={mapY(4.5)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" /> {/* ES -> FR */}
                  <line x1={mapX(4.0)} y1={mapY(4.5)} x2={mapX(5.0)} y2={mapY(5.0)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" /> {/* FR -> NL */}
                  <line x1={mapX(4.0)} y1={mapY(4.5)} x2={mapX(6.0)} y2={mapY(5.0)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" /> {/* FR -> DE */}
                  <line x1={mapX(4.0)} y1={mapY(4.5)} x2={mapX(6.5)} y2={mapY(2.0)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" /> {/* FR -> IT */}
                  <line x1={mapX(5.0)} y1={mapY(5.0)} x2={mapX(6.0)} y2={mapY(5.0)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" /> {/* NL -> DE */}
                  <line x1={mapX(6.0)} y1={mapY(5.0)} x2={mapX(8.0)} y2={mapY(5.0)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" /> {/* DE -> PL */}
                  <line x1={mapX(6.0)} y1={mapY(5.0)} x2={mapX(6.5)} y2={mapY(4.0)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" /> {/* DE -> AT */}
                  <line x1={mapX(6.5)} y1={mapY(4.0)} x2={mapX(6.5)} y2={mapY(2.0)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" /> {/* AT -> IT */}

                  {/* Active Route Path */}
                  {(() => {
                    const sx = mapX(sourceCoord.x);
                    const sy = mapY(sourceCoord.y);
                    const tx = mapX(targetCoord.x);
                    const ty = mapY(targetCoord.y);
                    const isUp = netMarginLift >= 0;
                    
                    return (
                      <>
                        {/* Glow background line */}
                        <line 
                          x1={sx} y1={sy} x2={tx} y2={ty} 
                          stroke={isUp ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'} 
                          strokeWidth="2.5" 
                        />
                        {/* Animated dashed link */}
                        <line 
                          x1={sx} y1={sy} x2={tx} y2={ty} 
                          stroke={isUp ? '#10b981' : '#f43f5e'} 
                          strokeWidth="1" 
                          strokeDasharray="4, 3"
                          className="animate-path"
                        />
                        {/* Framer motion moving cargo indicator */}
                        <motion.circle
                          cx={sx}
                          cy={sy}
                          r="1.8"
                          fill="#facc15"
                          animate={{ cx: [sx, tx], cy: [sy, ty] }}
                          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        />
                      </>
                    );
                  })()}

                  {/* Country Node circles */}
                  {Object.entries(COUNTRY_COORDS).map(([country, coords]) => {
                    const cx = mapX(coords.x);
                    const cy = mapY(coords.y);
                    const isSource = country === sourceCountry;
                    const isTarget = country === targetCountry;
                    
                    let nodeFill = 'rgba(255,255,255,0.1)';
                    let nodeStroke = 'rgba(255,255,255,0.2)';
                    let nodeRadius = 2.0;

                    if (isSource) {
                      nodeFill = '#ef4444';
                      nodeStroke = 'rgba(239,68,68,0.3)';
                      nodeRadius = 3.2;
                    } else if (isTarget) {
                      nodeFill = '#10b981';
                      nodeStroke = 'rgba(16,185,129,0.3)';
                      nodeRadius = 3.2;
                    }

                    return (
                      <g key={country}>
                        {/* Pulse glow circle for source/target */}
                        {(isSource || isTarget) && (
                          <circle cx={cx} cy={cy} r={nodeRadius + 2.5} fill="none" stroke={nodeStroke} strokeWidth="1" className="animate-pulse" />
                        )}
                        <circle cx={cx} cy={cy} r={nodeRadius} fill={nodeFill} />
                        {/* Small country codes */}
                        <text 
                          x={cx} 
                          y={cy + 5.5} 
                          textAnchor="middle" 
                          fill={isSource ? '#ef4444' : isTarget ? '#10b981' : '#71717a'} 
                          fontSize="3.8" 
                          fontWeight="bold"
                          className="font-sans"
                        >
                          {country.substring(0, 2).toUpperCase()}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Source/Target Margin detail row */}
              <div className="flex justify-between items-center text-[8.5px] px-3 py-1.5 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-sm font-mono font-bold">
                <div>
                  <span className="text-zinc-455 block text-[6.5px] font-sans">Source ({sourceCountry.substring(0,3).toUpperCase()})</span>
                  <span className="text-rose-500">{sourceRegion.marginPct.toFixed(2)}% margin</span>
                </div>
                <ArrowRight size={10} className="text-zinc-400" />
                <div className="text-right">
                  <span className="text-zinc-455 block text-[6.5px] font-sans">Target ({targetCountry.substring(0,3).toUpperCase()})</span>
                  <span className="text-emerald-500">{targetRegion.marginPct.toFixed(2)}% margin</span>
                </div>
              </div>

              {/* Feasibility/Risk Indicator */}
              <div className={`p-2 border rounded-sm text-center text-[9px] font-bold ${risk.class}`}>
                {risk.label} (Feasibility Index: {feasibilityScore}/100)
              </div>

              {/* Dynamic parameters details */}
              <div className="grid grid-cols-2 gap-2 text-[9px] font-semibold text-zinc-500">
                <div className="p-2 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-sm flex items-center gap-2">
                  <Clock size={10} className="text-blue-500" />
                  <div>
                    <span className="text-[7px] text-zinc-400 uppercase font-bold block">Transit Lead Time</span>
                    +{transitLeadTime} Days Delay
                  </div>
                </div>
                
                <div className="p-2 bg-black/[0.01] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-sm flex items-center gap-2">
                  <Percent size={10} className="text-rose-500" />
                  <div>
                    <span className="text-[7px] text-zinc-400 uppercase font-bold block">Freight Drag</span>
                    -{freightDrag}% margin
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center opacity-40">
              <AlertTriangle size={20} className="mb-2" />
              <p className="text-[9px] uppercase font-extrabold tracking-widest">Awaiting Route Input</p>
            </div>
          )}
        </div>

        {/* Step 3: Financial Net Impact */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <h5 className="text-[9px] uppercase font-bold tracking-wider text-zinc-400 border-b border-black/5 dark:border-white/5 pb-1 flex items-center gap-1.5">
              <ShieldCheck size={11} className="text-emerald-500" />
              3. Projected Reallocation Gain
            </h5>

            {sourceCountry !== targetCountry ? (
              <div className="space-y-3">
                {/* Gross Yield Diff */}
                <div className="flex justify-between items-center text-[10px] py-1 px-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-sm">
                  <span className="text-zinc-500">Gross Margin Differential</span>
                  <span className={`font-bold font-mono ${marginDelta >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {marginDelta >= 0 ? `+${marginDelta}%` : `${marginDelta}%`}
                  </span>
                </div>

                {/* Freight Penalty */}
                <div className="flex justify-between items-center text-[10px] py-1 px-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-sm">
                  <span className="text-zinc-500">Freight & Sourcing Drag</span>
                  <span className="font-bold font-mono text-rose-500">
                    -{freightDrag}%
                  </span>
                </div>

                {/* Net Profit Gain */}
                <div className="flex justify-between items-center text-[10px] py-1.5 px-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-sm border-l-2 border-l-blue-500">
                  <span className="font-bold text-zinc-700 dark:text-zinc-350">Net Margin Differential Lift</span>
                  <span className={`font-bold font-mono text-xs ${netMarginLift >= 0 ? 'text-emerald-500 animate-pulse' : 'text-rose-500'}`}>
                    {netMarginLift >= 0 ? `+${netMarginLift}%` : `${netMarginLift}%`}
                  </span>
                </div>

                {/* Explanatory summary text */}
                <p className="text-[7.5px] leading-relaxed text-zinc-500 italic bg-black/[0.01] dark:bg-white/[0.01] p-2 border border-black/5 dark:border-white/5 rounded-sm">
                  {netMarginLift >= 0 ? (
                    <span>
                      <ShieldCheck size={8} className="inline mr-1 text-emerald-500" />
                      Assortment transfer yields a net profit of **{netMarginLift}%** after subtracting **{freightDrag}%** freight drag. This represents an optimized location re-alignment.
                    </span>
                  ) : (
                    <span>
                      <AlertTriangle size={8} className="inline mr-1 text-rose-500" />
                      Warning: Freight drag (**{freightDrag}%**) exceeds gross margin gains (**{marginDelta}%**). This transfer route is margin-dilutive and not recommended.
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center opacity-40">
                <AlertTriangle size={20} className="mb-2" />
                <p className="text-[9px] uppercase font-extrabold tracking-widest">Awaiting Route Input</p>
              </div>
            )}
          </div>

          {sourceCountry !== targetCountry && (
            <button 
              onClick={handleApplyTransfer}
              disabled={isTransferred}
              className={`w-full py-1.5 rounded text-[8px] font-extrabold uppercase tracking-widest text-center transition-all border-none outline-none mt-4 ${
                isTransferred
                  ? 'bg-emerald-600 text-white cursor-wait'
                  : netMarginLift >= 0
                    ? 'bg-blue-500 text-white hover:brightness-105 active:scale-95 cursor-pointer'
                    : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 hover:bg-rose-500 hover:text-white hover:brightness-105 active:scale-95 cursor-pointer'
              }`}
            >
              {isTransferred ? 'Transfer Request Sent!' : netMarginLift >= 0 ? 'Apply Listing Reallocation' : 'Force Listing Transfer (Dilutive)'}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
export default CrossLocationTransfer;
