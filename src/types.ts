export interface HighlightRegion {
  x: number;
  y: number;
  label: string;
}

export interface Complaint {
  id: string;
  citizenName: string;
  issueType: "Potholes" | "Leakage" | "Garbage" | "Street Light";
  severityScore: number; // 0-100
  riskScore: number;     // 0-100
  description: string;
  location: string;
  date: string;
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";
  latitude: number;
  longitude: number;
  department: string;
  failureMode?: string;
  remedialAction?: string;
  dangers?: string[];
  highlightRegions?: HighlightRegion[];
  imageUrl?: string;
  priority?: string;
  resolutionNotes?: string;
}

export interface MonthRisk {
  month: string;
  probability: number;
}

export interface PredictiveZone {
  id: string;
  areaName: string;
  assetType: string;
  ageYears: number;
  failureProbability: number;
  priorityLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  waterloggingRiskIndex: number;
  undergroundUtilityDucts: number;
  lastInspected: string;
  forecastedFailureMonth: string;
  activeTriggers: string[];
  historicalFailures: number;
  reconstructionCostEst: string;
  monthlyRiskTrend: MonthRisk[];
}
