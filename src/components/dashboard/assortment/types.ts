export interface StagedAction {
  id: string;
  type: 'reallocation' | 'delisting' | 'pricing' | 'launch';
  title: string;
  details: string;
  revenueImpact: number; // in ₹ Cr (positive is gain, negative is loss)
  marginImpact: number;  // absolute net margin impact (in ₹ Cr)
  complexityImpact: number; // complexity index points saved (positive is savings)
  spaceImpact: number;   // warehouse pallet spaces freed (positive) or consumed (negative)
}
