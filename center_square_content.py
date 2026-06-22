with open('src/components/dashboard/launch-readiness/VPLaunchReadinessView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_cards_content = """          <div 
            onClick={() => setSelectedStageSKUs({
              title: 'On Track Launches',
              meaning: 'SKUs with a Launch Readiness Score of 75% or higher, indicating that all major activities (regulatory compliance, marketing plans, inventory routing) are progressing optimally with low risk of launch delay.',
              skus: filteredProducts.filter(p => p.readiness >= 75)
            })}
            className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm flex flex-col justify-between aspect-square hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">On Track</p>
            <div className="flex-1 flex items-center">
              <h4 className="text-3xl font-display font-extrabold text-emerald-500 leading-none">{onTrackCount}</h4>
            </div>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Status: Optimal</p>
          </div>

          <div 
            onClick={() => setSelectedStageSKUs({
              title: 'Delayed Launches',
              meaning: 'SKUs with a Launch Readiness Score below 50%. These have encountered critical bottlenecks (such as severe supply chain delays or lack of regulatory approvals) and require immediate executive attention and mitigation.',
              skus: filteredProducts.filter(p => p.readiness < 50)
            })}
            className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm flex flex-col justify-between aspect-square hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Delayed</p>
            <div className="flex-1 flex items-center">
              <h4 className="text-3xl font-display font-extrabold text-red-500 leading-none">{delayedCount}</h4>
            </div>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Needs Focus</p>
          </div>

          <div 
            onClick={() => setSelectedStageSKUs({
              title: 'At Risk Launches',
              meaning: 'SKUs with a Launch Readiness Score between 50% and 74%. These are demonstrating early warning signs or minor deviations from target timelines, requiring active supervision and preventative measures.',
              skus: filteredProducts.filter(p => p.readiness >= 50 && p.readiness < 75)
            })}
            className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm flex flex-col justify-between aspect-square hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">At Risk</p>
            <div className="flex-1 flex items-center">
              <h4 className="text-3xl font-display font-extrabold text-amber-500 leading-none">{atRiskCount}</h4>
            </div>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Watching</p>
          </div>

          <div 
            onClick={() => setSelectedStageSKUs({
              title: 'Next 60 Days Pipeline',
              meaning: 'SKUs currently in the active pipeline (Development, Testing, or Pre-market phases) scheduled to transition to market launch within the upcoming 60-day window.',
              skus: filteredProducts.filter(p => p.stage !== 'Launch' && p.stage !== 'Ideation')
            })}
            className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm flex flex-col justify-between aspect-square hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Next 60 Days</p>
            <div className="flex-1 flex items-center">
              <h4 className="text-3xl font-display font-extrabold text-blue-500 leading-none">
                {filteredProducts.filter(p => p.stage !== 'Launch' && p.stage !== 'Ideation').length}
              </h4>
            </div>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Readying</p>
          </div>

          <div 
            onClick={() => setSelectedStageSKUs({
              title: 'Revenue Exposure',
              meaning: 'The total potential revenue at stake from launches that are currently Delayed or At Risk (Launch Readiness Score below 75%). This helps prioritize resource allocation based on financial impact.',
              skus: filteredProducts.filter(p => p.readiness < 75)
            })}
            className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm flex flex-col justify-between aspect-square hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Rev Exposure</p>
            <div className="flex-1 flex items-center">
              <h4 className="text-3xl font-display font-extrabold text-orange-500 leading-none">
                ${revenueExposure.toFixed(1)}M
              </h4>
            </div>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">At-Risk/Delayed</p>
          </div>

          <div 
            onClick={() => setSelectedStageSKUs({
              title: 'Market Coverage Scope',
              meaning: 'Geographic deployment and readiness metric representing the percentage of target regions or distribution nodes that have successfully completed all pre-market requirements.',
              skus: filteredProducts
            })}
            className="glass-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-sm shadow-sm flex flex-col justify-between aspect-square hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Market Coverage</p>
            <div className="flex-1 flex items-center">
              <h4 className="text-3xl font-display font-extrabold text-[#6d28d9] dark:text-[#a78bfa] leading-none">
                {marketCoverage}%
              </h4>
            </div>
            <p className="text-[9px] text-zinc-450 dark:text-zinc-550 font-semibold uppercase">Geo Readiness</p>
          </div>
"""

# Replace lines 753 to 836 (index 753 to 835 inclusive)
# Note: we need to convert string to lines and replace
new_lines = lines[:753] + [new_cards_content + '\n'] + lines[836:]

with open('src/components/dashboard/launch-readiness/VPLaunchReadinessView.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Center square content updated successfully!")
