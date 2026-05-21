/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Role } from '../../../types/dashboard';
import { TakeawayCarousel } from './TakeawayCarousel';
import { MarginSimulator } from './MarginSimulator';
import { ProfitabilityGridTree } from './ProfitabilityGridTree';
import { PromoErosionScatter } from './PromoErosionScatter';

interface ProfitabilityTreeProps {
  role: Role;
  onAuditClick?: (metric: string) => void;
}

export const ProfitabilityTree: React.FC<ProfitabilityTreeProps> = ({ role, onAuditClick }) => {
  return (
    <div className="space-y-4">
      {/* Row 1: Takeaway Hero Carousel + Netherlands Margin Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <TakeawayCarousel />
        </div>
        <div className="lg:col-span-4">
          <MarginSimulator onAuditClick={onAuditClick} />
        </div>
      </div>

      {/* Row 2: Grid-Tree Drilldown (Full Width for split-pane layout to breathe) */}
      <div className="grid grid-cols-1 gap-4">
        <div className="w-full">
          <ProfitabilityGridTree role={role} onAuditClick={onAuditClick} />
        </div>
      </div>

      {/* Row 3: Promo Erosion Scatter Plot */}
      <div className="grid grid-cols-1 gap-4">
        <div className="w-full">
          <PromoErosionScatter onAuditClick={onAuditClick} />
        </div>
      </div>
    </div>
  );
};
