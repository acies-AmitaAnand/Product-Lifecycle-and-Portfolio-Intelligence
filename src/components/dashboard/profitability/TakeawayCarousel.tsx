/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Layers, ArrowRight } from 'lucide-react';

export const TakeawayCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const takeaways = [
    {
      id: 'promo-erosion',
      title: 'Promotional Erosion Leakage',
      soWhat: 'BrandC Toothpaste and BrandA Softener experience severe margin erosion (15.49 and 13.50 scores respectively) during promotions, despite high dependency.',
      action: 'Introduce promotional discount depth caps (max 15%) and review trade promotion calendars with sales teams.',
      stat: '15.49 Max Erosion',
      sub: 'BrandC Toothpaste (27.59% promo dependency)',
      color: 'border-red-500/20 bg-red-500/5',
      badgeColor: 'text-red-400 bg-red-500/10',
      cta: 'Review Promo Ceilings',
    },
    {
      id: 'volumetric-dilution',
      title: 'High-Volume Volumetric Dilution',
      soWhat: 'Portfolio gross margin averages 38.53% (below 40.0% target) because high-volume items like BrandA Soda (36.10% margin) and BrandC Chips (36.20%) pull averages down.',
      action: 'Re-engineer pack architecture (e.g. multi-packs for wholesale) to protect baseline margin rates on high-velocity items.',
      stat: '12 Key SKUs',
      sub: 'Diluting margins by >150bps below target',
      color: 'border-amber-500/20 bg-amber-500/5',
      badgeColor: 'text-amber-400 bg-amber-500/10',
      cta: 'Price-Pack Restructuring',
    },
    {
      id: 'netherlands-assortment',
      title: 'Netherlands Assortment Harmonization',
      soWhat: 'The Netherlands runs with only 45 SKUs, yielding the lowest regional gross margin of 38.20% (vs Austria\'s 38.64% on 80 SKUs).',
      action: 'Introduce 15 high-margin Austrian SKUs into Dutch retail channels to lift average margins by +44bps.',
      stat: '+$55k Initial Value',
      sub: 'At 38.64% Austrian margin benchmark',
      color: 'border-acies-yellow/20 bg-acies-yellow/5',
      badgeColor: 'text-acies-yellow bg-acies-yellow/10',
      cta: 'Harmonize Dutch Pricing',
    },
    {
      id: 'convenience-drag',
      title: 'Convenience Channel Cost-to-Serve',
      soWhat: 'Convenience stores yield the lowest margins (38.20%) and face high volatility (CV = 0.069), leading to high inventory carrying costs.',
      action: 'Prune low-velocity long-tail SKUs from convenience lists and consolidate distributions.',
      stat: '38.20% Margin',
      sub: 'Convenience channel (vs 38.56% for E-commerce)',
      color: 'border-blue-500/20 bg-blue-500/5',
      badgeColor: 'text-blue-400 bg-blue-500/10',
      cta: 'Trim Convenience Long-Tail',
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % takeaways.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [takeaways.length]);

  return (
    <div className="flex flex-col justify-between glass-card bg-acies-gray text-white relative overflow-hidden min-h-[220px]">
      {/* Subtle Background Pattern */}
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
        <Layers size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[9px] uppercase font-bold tracking-widest opacity-40 flex items-center gap-1.5">
            <Sparkles size={10} className="text-acies-yellow" />
            Profitability Engine Insights
          </span>
          <div className="flex gap-1">
            {takeaways.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-1.5 h-1.5 transition-all cursor-pointer ${
                  currentSlide === index 
                    ? 'bg-acies-yellow scale-125' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="pr-4"
          >
            <h3 className="text-base font-display mb-2 text-acies-yellow">
              {takeaways[currentSlide].title}
            </h3>
            <div className="space-y-2 mb-2">
              <div>
                <span className="text-[7px] font-bold uppercase tracking-wider text-red-400 block">So What?</span>
                <p className="text-[11px] opacity-80 leading-relaxed max-w-2xl">
                  {takeaways[currentSlide].soWhat}
                </p>
              </div>
              <div>
                <span className="text-[7px] font-bold uppercase tracking-wider text-green-400 block">Action Plan</span>
                <p className="text-[11px] text-acies-yellow opacity-90 leading-relaxed max-w-2xl">
                  {takeaways[currentSlide].action}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-3 mt-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded-sm ${takeaways[currentSlide].badgeColor}`}>
            {takeaways[currentSlide].stat}
          </div>
          <span className="text-[9px] opacity-40">{takeaways[currentSlide].sub}</span>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-acies-yellow hover:text-acies-gray text-[9px] font-bold uppercase tracking-widest transition-all">
          {takeaways[currentSlide].cta}
          <ArrowRight size={10} />
        </button>
      </div>
    </div>
  );
};
