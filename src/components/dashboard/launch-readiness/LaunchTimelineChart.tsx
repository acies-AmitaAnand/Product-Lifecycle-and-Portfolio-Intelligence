/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LAUNCH_TIMELINE, LAUNCH_PRODUCTS } from '../../../constants/data';

const stageColors: Record<string, string> = {
  'Concept': '#60a5fa',
  'Development': '#f59e0b',
  'Pre-Launch': '#ec4899',
  'Launch': '#10b981',
  'Post-Launch': '#8b5cf6',
};

const statusColors: Record<string, string> = {
  'Completed': '#10b981',
  'Planned': '#6b7280',
  'Delayed': '#ef4444',
};

export const LaunchTimelineChart: React.FC = () => {
  // Group timeline by product for cleaner visualization
  const timelineByProduct = LAUNCH_PRODUCTS.map(product => {
    const events = LAUNCH_TIMELINE.filter(t => t.product.includes(product.name.split('(')[0].trim()));
    return { product, events };
  }).filter(item => item.events.length > 0);

  // Find min and max dates for timeline scale
  const allDates = LAUNCH_TIMELINE.map(t => new Date(t.date).getTime()).sort((a, b) => a - b);
  const minDate = new Date(allDates[0]);
  const maxDate = new Date(allDates[allDates.length - 1]);
  const timelineSpan = maxDate.getTime() - minDate.getTime();

  const getPosition = (date: string) => {
    const dateMs = new Date(date).getTime();
    return ((dateMs - minDate.getTime()) / timelineSpan) * 100;
  };

  return (
    <div className="glass-card min-h-[420px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg mb-0.5">Launch Timeline</h3>
        <p className="text-[10px] opacity-50 font-medium uppercase tracking-wider">
          Planned launches & milestones through Q4 2026
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5 pb-3 border-b border-black/5 dark:border-white/5">
        <div className="text-[8px] font-bold uppercase opacity-40 flex gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px]">Stages:</span>
            {Object.entries(stageColors).map(([stage, color]) => (
              <div key={stage} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="opacity-60">{stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 relative">
        {/* Horizontal axis */}
        <div className="absolute top-0 left-0 right-0 h-px bg-black/10 dark:bg-white/10" />

        {/* Month markers */}
        <div className="absolute top-0 left-0 right-0 flex text-[8px] opacity-30 mb-2 border-b border-black/5 dark:border-white/5">
          {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
            <div key={month} style={{ left: `${(i / 8) * 100}%` }} className="text-center font-bold">
              {month}
            </div>
          ))}
        </div>

        {/* Product rows */}
        <div className="mt-8 space-y-6">
          {timelineByProduct.map(({ product, events }, pidx) => (
            <div key={product.id} className="flex flex-col">
              <div className="text-sm font-semibold mb-2 text-acies-gray dark:text-white flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: stageColors[product.currentStage] }}
                />
                <span className="text-[10px] font-medium">{product.name}</span>
                <span className="text-[8px] opacity-40 ml-auto">
                  {product.gateProgress}% progress
                </span>
              </div>

              {/* Progress bar background */}
              <div className="relative h-6 bg-black/5 dark:bg-white/5 rounded border border-black/10 dark:border-white/10 overflow-hidden">
                {/* Events */}
                {events.map((event, idx) => (
                  <div
                    key={idx}
                    className="absolute top-1/2 -translate-y-1/2 group"
                    style={{
                      left: `${getPosition(event.date)}%`,
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white dark:border-acies-gray cursor-pointer hover:scale-125 transition-transform"
                      style={{
                        backgroundColor: stageColors[event.stage],
                        borderColor: statusColors[event.status],
                      }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-acies-gray text-white text-[7px] px-2 py-1 rounded whitespace-nowrap z-10">
                      <div className="font-bold">{new Date(event.date).toLocaleDateString()}</div>
                      <div className="opacity-80">{event.stage}</div>
                      <div className="opacity-60">{event.status}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Status indicator */}
              <div className="text-[8px] opacity-50 mt-1">
                {events.length > 0 && (
                  <span>
                    Last milestone:{' '}
                    {new Date(events[events.length - 1].date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
