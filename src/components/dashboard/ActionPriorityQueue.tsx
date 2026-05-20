/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SEGMENT_COLORS } from '../../constants/data';

// Top operational burden SKUs from Q27 (op_burden_ratio = complexity/value)
const BURDEN_SKUS = [
  { name: 'BrandF Soda',      category: 'Beverages', ratio: 3.58, segment: 'Rationalize', impact: '−3.58% rev if removed',  action: 'Sunset'      },
  { name: 'BrandA Chocolate', category: 'Snacks',    ratio: 3.08, segment: 'Rationalize', impact: '+4.2% safety stock',    action: 'Rationalize' },
  { name: 'BrandD Chocolate', category: 'Snacks',    ratio: 2.98, segment: 'Rationalize', impact: '+3.9% safety stock',    action: 'Rationalize' },
  { name: 'BrandD Water',     category: 'Beverages', ratio: 2.61, segment: 'Rationalize', impact: 'Promo erosion: 28.0%',  action: 'Re-engineer' },
  { name: 'BrandE Water',     category: 'Beverages', ratio: 2.36, segment: 'Rationalize', impact: 'Lead time: 6.3d',       action: 'Re-engineer' },
];

const ACTION_COLORS: Record<string, string> = {
  Sunset:       'bg-red-600 text-white',
  Rationalize:  'bg-acies-yellow text-acies-gray',
  'Re-engineer': 'bg-amber-100 text-amber-800',
};

export const ActionPriorityQueue: React.FC = () => {
  return (
    <div className="glass-card">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-xs font-bold uppercase">Rationalization Priority Queue</h3>
          <p className="text-[9px] opacity-40 uppercase tracking-wider mt-0.5">Ranked by Op. Burden Ratio (complexity ÷ value)</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] opacity-40 uppercase">All Segment</p>
          <p className="text-sm font-display text-red-500">Rationalize</p>
        </div>
      </div>

      <div className="space-y-2">
        {BURDEN_SKUS.map((task, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2.5 border border-black/5 hover:border-acies-yellow/50 transition-colors group"
            title={`${task.name} — Op. Burden Ratio: ${task.ratio}. ${task.impact}. Action: ${task.action}.`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-sm flex items-center justify-center font-bold text-[10px] font-display shrink-0"
                style={{
                  backgroundColor: SEGMENT_COLORS[task.segment] + '20',
                  color: SEGMENT_COLORS[task.segment],
                  border: `1px solid ${SEGMENT_COLORS[task.segment]}40`,
                }}
              >
                {i + 1}
              </div>
              <div>
                <h4 className="text-[11px] font-bold leading-none mb-0.5">{task.name}</h4>
                <p className="text-[8px] opacity-40 uppercase tracking-tighter">{task.category} · {task.impact}</p>
              </div>
            </div>
            <div className="text-right shrink-0 ml-2">
              <p className="text-sm font-display text-acies-yellow mb-0.5">{task.ratio}×</p>
              <span className={`text-[7px] font-bold uppercase px-1.5 py-0.5 ${ACTION_COLORS[task.action]}`}>
                {task.action}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-2.5 bg-acies-gray text-white">
        <p className="text-[8px] leading-relaxed opacity-80">
          <span className="text-acies-yellow font-bold">Critical finding:</span> Removing all 35 Rationalize SKUs frees $104M safety stock capital (+42.2%) — but introduces 27.08% top-line revenue risk and <span className="text-acies-yellow font-bold">zero supplier reduction</span> due to full portfolio interconnectivity.
        </p>
      </div>
    </div>
  );
};
