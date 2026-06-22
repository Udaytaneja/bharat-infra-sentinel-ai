import React, { useState, useMemo } from "react";
import { 
  Globe, 
  MapPin, 
  Building2, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  Coins, 
  ChevronRight, 
  FileDown, 
  UserCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  CloudRain, 
  Search,
  SlidersHorizontal,
  CheckCircle,
  Clock,
  ExternalLink,
  Milestone
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer as RechartsResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { Complaint } from "../types";

interface StateHealthMetric {
  rank: number;
  state: string;
  capital: string;
  healthIndex: number; // 0-100
  monitoredAssets: number;
  activeIncidents: number;
  predictedFailures: number;
  avgSlaResolution: number; // in hours
  fundingSaved: number; // in Lakhs
  status: "OPTIMAL" | "EVALUATING" | "WARNING" | "CRITICAL";
}

interface NationalZoneNode {
  id: string;
  name: string;
  region: string;
  coordinates: { x: number; y: number }; // map svg relative offsets
  assets: number;
  healthIndex: number;
  criticalCount: number;
  slaIndex: string;
  monsoonRisk: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  leadEngineer: string;
}

export default function NationalCommandCenter({ complaints = [] }: { complaints?: Complaint[] }) {
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedVisualState, setSelectedVisualState] = useState<string | null>(null);

  // Elite datasets for State-Wise Infrastructure Health Leaderboard
  const stateRankings: StateHealthMetric[] = [
    { rank: 1, state: "Gujarat", capital: "Gandhinagar", healthIndex: 88, monitoredAssets: 18240, activeIncidents: 4, predictedFailures: 12, avgSlaResolution: 1.8, fundingSaved: 480, status: "OPTIMAL" },
    { rank: 2, state: "Maharashtra", capital: "Mumbai", healthIndex: 85, monitoredAssets: 38150, activeIncidents: 14, predictedFailures: 32, avgSlaResolution: 3.5, fundingSaved: 1250, status: "OPTIMAL" },
    { rank: 3, state: "Delhi NCR", capital: "New Delhi", healthIndex: 84, monitoredAssets: 45210, activeIncidents: 8, predictedFailures: 19, avgSlaResolution: 2.1, fundingSaved: 980, status: "OPTIMAL" },
    { rank: 4, state: "Karnataka", capital: "Bengaluru", healthIndex: 82, monitoredAssets: 29840, activeIncidents: 5, predictedFailures: 24, avgSlaResolution: 2.4, fundingSaved: 740, status: "OPTIMAL" },
    { rank: 5, state: "Tamil Nadu", capital: "Chennai", healthIndex: 80, monitoredAssets: 21380, activeIncidents: 6, predictedFailures: 18, avgSlaResolution: 3.0, fundingSaved: 510, status: "EVALUATING" },
    { rank: 6, state: "Telangana", capital: "Hyderabad", healthIndex: 79, monitoredAssets: 17450, activeIncidents: 7, predictedFailures: 15, avgSlaResolution: 2.8, fundingSaved: 420, status: "EVALUATING" },
    { rank: 7, state: "Kerala", capital: "Thiruvananthapuram", healthIndex: 78, monitoredAssets: 12500, activeIncidents: 9, predictedFailures: 28, avgSlaResolution: 3.1, fundingSaved: 310, status: "EVALUATING" },
    { rank: 8, state: "Uttar Pradesh", capital: "Lucknow", healthIndex: 74, monitoredAssets: 31200, activeIncidents: 19, predictedFailures: 45, avgSlaResolution: 4.8, fundingSaved: 880, status: "WARNING" },
    { rank: 9, state: "Rajasthan", capital: "Jaipur", healthIndex: 72, monitoredAssets: 14800, activeIncidents: 11, predictedFailures: 16, avgSlaResolution: 4.2, fundingSaved: 290, status: "WARNING" },
    { rank: 10, state: "West Bengal", capital: "Kolkata", healthIndex: 71, monitoredAssets: 18920, activeIncidents: 12, predictedFailures: 27, avgSlaResolution: 4.1, fundingSaved: 360, status: "WARNING" },
    { rank: 11, state: "Bihar", capital: "Patna", healthIndex: 64, monitoredAssets: 11400, activeIncidents: 23, predictedFailures: 38, avgSlaResolution: 5.9, fundingSaved: 180, status: "CRITICAL" }
  ];

  // Prime interactive National Zone Nodes mapped on the custom outline
  const nationalZones: NationalZoneNode[] = [
    { id: "delhi", name: "NCR Smart Grid", region: "North Zone", coordinates: { x: 38, y: 30 }, assets: 45210, healthIndex: 84, criticalCount: 2, slaIndex: "2.1 Hrs", monsoonRisk: "MODERATE", leadEngineer: "Dr. A. K. Shastri, Chief Administrator" },
    { id: "mumbai", name: "Mumbai MMDA Highway Link", region: "West Zone", coordinates: { x: 23, y: 55 }, assets: 38150, healthIndex: 78, criticalCount: 5, slaIndex: "3.5 Hrs", monsoonRisk: "CRITICAL", leadEngineer: "Smt. Meera Kapoor, Dy. Director" },
    { id: "bengaluru", name: "Bengaluru Smart Drainage", region: "South Zone", coordinates: { x: 36, y: 78 }, assets: 29840, healthIndex: 82, criticalCount: 1, slaIndex: "2.4 Hrs", monsoonRisk: "HIGH", leadEngineer: "Shri Rajesh Murthy, Superintending Engineer" },
    { id: "kolkata", name: "Eastern Port Authority", region: "East Zone", coordinates: { x: 67, y: 48 }, assets: 18920, healthIndex: 74, criticalCount: 3, slaIndex: "4.1 Hrs", monsoonRisk: "HIGH", leadEngineer: "Dr. Biplab Das, Technical Director" },
    { id: "chennai", name: "Coastal Loop Network", region: "Coastal Zone", coordinates: { x: 44, y: 84 }, assets: 21380, healthIndex: 80, criticalCount: 2, slaIndex: "3.0 Hrs", monsoonRisk: "MODERATE", leadEngineer: "Er. K. Swaminathan, Chief Overseer" }
  ];

  // Calculate National Combined Telemetry based on standard constants + live counts
  const liveCount = complaints.length;
  const totalMonitoredAssets = 259010; // Pan-India Smart Cities registered systems
  
  const activeCriticalIncidents = useMemo(() => {
    // Complaints with severityScore >= 80 or priority "Critical"
    const liveCritical = complaints.filter(c => Number(c.severityScore) >= 80 || c.priority === "Critical").length;
    return 14 + liveCritical; // Base seed + live count
  }, [complaints]);

  const predictedFailuresThisMonth = useMemo(() => {
    // Dynamic forecasting aligned with rainfall factors
    return 270; 
  }, []);

  const totalPublicMoneySaved = useMemo(() => {
    // Estimations: Proactive patch and drain clearance saves an average of ₹14.2 Lakhs per incident over major reconstruction
    const liveResolvedCount = complaints.filter(c => c.status === "RESOLVED").length;
    const baseSavings = 64.12; // ₹64.12 Crores base saved
    return Number((baseSavings + (liveResolvedCount * 0.142)).toFixed(2));
  }, [complaints]);

  // Filters state listings dynamically
  const filteredStates = useMemo(() => {
    return stateRankings.filter(s => {
      const matchSearch = s.state.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.capital.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === "all" || s.status.toLowerCase() === filterStatus.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [searchQuery, filterStatus]);

  // Selected details node
  const activeNodeDetails = useMemo(() => {
    if (selectedZone === "all") return null;
    return nationalZones.find(z => z.id === selectedZone) || null;
  }, [selectedZone]);

  // State-wide comparative health visualization config
  const stateChartData = useMemo(() => {
    return stateRankings.map(s => ({
      name: s.state,
      "Health Index": s.healthIndex,
      "National Benchmark": 85,
      "Incidents": s.activeIncidents
    }));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in" id="national-command-center">

      {/* Prime Ministerial Cabinet Header */}
      <div className="bg-[#0b1329] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-blue-900/40 shadow-xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold tracking-widest text-slate-300">
              <span className="bg-slate-800 text-amber-400 px-3 py-1 rounded-full uppercase border border-slate-700/85">
                MINISTRY OF HOUSING & URBAN AFFAIRS (MoHUA)
              </span>
              <span className="bg-slate-800 text-blue-400 px-3 py-1 rounded-full uppercase border border-slate-700/85">
                SMART CITIES MISSION
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white flex items-center gap-3">
              <Globe className="w-9 h-9 text-blue-400 animate-spin-slow" />
              National Infrastructure Command Center
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-450 font-sans leading-relaxed max-w-2xl">
              Centralized administrative telemetry of Bharat Smart Cities. Interfacing regional weather saturation variables, predictive road deterioration constants, and public works department SLA status triggers nationwide.
            </p>
          </div>

          {/* Glowing Status badge */}
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex items-center gap-4.5 self-stretch md:self-auto justify-between md:justify-start">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-slate-450 uppercase tracking-widest">METRANET FEED STATUS</span>
              <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                ● BROADCAST ONLINE
              </span>
            </div>
            <div className="text-right pl-4 border-l border-slate-800 font-mono text-[10px] text-slate-400">
              <div>Delhi NCR Master</div>
              <div>v5.1 (PROD-LINK)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Telemetry Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center justify-between relative overflow-hidden hover:shadow-md transition">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">Total Monitored Assets</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-slate-900">{totalMonitoredAssets.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-600 font-bold font-mono bg-emerald-50 px-1.5 py-0.5 rounded flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +1.4%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">Operational telemetry in 100 fully integrated smart hubs.</p>
          </div>
          <div className="p-3 bg-blue-50 text-brand-medium rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center justify-between relative overflow-hidden hover:shadow-md transition">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">Active Critical Incidents</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-red-650 text-red-600">{activeCriticalIncidents}</span>
              <span className="text-[10px] text-amber-600 font-bold font-mono bg-amber-50 px-1.5 py-0.5 rounded flex items-center">
                <CloudRain className="w-3 h-3 animate-bounce" /> IMD Warning
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">Severity ≥ 80 or designated Critical high hazard threat.</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center justify-between relative overflow-hidden hover:shadow-md transition">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">Predicted Failures (June)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-amber-600">{predictedFailuresThisMonth}</span>
              <span className="text-[10px] text-rose-600 font-bold font-mono bg-rose-50 px-1.5 py-0.5 rounded flex items-center">
                <ArrowUpRight className="w-3 h-3" /> Monsoon Spike
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">Proactive soil scour & moisture distress warning targets.</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center justify-between relative overflow-hidden hover:shadow-md transition">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">Est. Public Money Saved</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-extrabold text-emerald-600">₹{totalPublicMoneySaved} Cr</span>
              <span className="text-[11px] text-emerald-605 font-bold font-mono text-emerald-700">INR</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">Sourced from structural failure preventive repair protocols.</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
            <Coins className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Map Section & Interactive Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Highly Interactive India Map & Tactical Zones */}
        <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-display font-bold text-slate-900 uppercase">
                India Operations Map Overview
              </h2>
              <p className="text-xs text-slate-500">
                Pulse overlays reflect regional administrative telemetry nodes. Click a node to inspect target telemetry.
              </p>
            </div>

            <div className="flex select-none gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <button 
                onClick={() => setSelectedZone("all")}
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-lg transition-all ${
                  selectedZone === "all" ? "bg-[#0b1329] text-white shadow" : "text-slate-500 hover:text-slate-950"
                }`}
              >
                Reset Selection
              </button>
            </div>
          </div>

          {/* Custom SVG Map Panel */}
          <div className="relative bg-slate-950/95 rounded-2xl h-[440px] flex items-center justify-center p-4 overflow-hidden border border-slate-800">
            {/* Ambient India Outline Background Representation */}
            <svg 
              className="absolute inset-0 w-full h-full opacity-10 select-none pointer-events-none" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              {/* Abstract Geo Grids */}
              <circle cx="50" cy="50" r="30" stroke="#475569" strokeWidth="0.2" fill="none" />
              <circle cx="50" cy="50" r="45" stroke="#475569" strokeWidth="0.2" fill="none" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="#475569" strokeWidth="0.1" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="#475569" strokeWidth="0.1" />
            </svg>

            {/* Stylized vector sub-continent outlines drawn elegantly */}
            <svg 
              className="w-[280px] sm:w-[325px] h-[380px] text-slate-700/60 z-10 transition pointer-events-none"
              viewBox="0 0 100 100"
              fill="currentColor"
              stroke="#1e293b"
              strokeWidth="0.8"
            >
              {/* Elegant Simplified representation of India administrative outlines */}
              <path d="M 38 12 L 44 14 L 46 19 L 41 24 L 37 25 L 34 29 L 29 27 L 27 34 L 18 38 L 19 44 L 21 48 L 22 55 L 29 55 L 34 52 L 35 60 L 33 65 L 31 71 L 34 81 L 43 91 L 44 94 L 47 91 L 44 84 L 46 76 L 50 63 L 53 58 L 51 53 L 53 48 L 62 52 L 67 47 L 72 45 L 75 48 L 78 40 L 76 34 L 70 32 L 64 34 L 56 31 L 52 26 L 46 25 L 43 18 Z" />
              
              {/* Adjacent Neighbor Faded outlines for aesthetic context */}
              <path d="M 12 36 L 16 34 L 26 31 L 28 25 L 25 21 L 28 15" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
              <path d="M 75 49 L 78 52 L 85 53 L 88 56" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
            </svg>

            {/* Pulsing Active Command Center Hotspots mapped directly */}
            {nationalZones.map((zone) => {
              const isSelected = selectedZone === zone.id;
              const isCriticalMode = zone.monsoonRisk === "CRITICAL" || zone.monsoonRisk === "HIGH";

              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  style={{ left: `${zone.coordinates.x}%`, top: `${zone.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer focus:outline-none"
                >
                  {/* Multiple diagnostic outer ping waves */}
                  <span className={`absolute inline-flex h-11 w-11 -left-[16px] -top-[16px] rounded-full opacity-35 transition duration-500 ${
                    isSelected ? "bg-amber-400 animate-ping scale-150" : 
                    isCriticalMode ? "bg-red-500 animate-ping" : 
                    "bg-blue-400 animate-ping"
                  }`}></span>

                  <span className={`absolute inline-flex h-7 w-7 -left-[8px] -top-[8px] rounded-full opacity-60 transition duration-300 ${
                    isSelected ? "bg-amber-400 animate-ping" : "bg-brand-medium/30"
                  }`}></span>

                  {/* Core solid marker */}
                  <div className={`w-3.5 h-3.5 rounded-full border-2 shadow-lg transition-transform duration-300 ${
                    isSelected ? "bg-amber-400 border-white scale-125 ring-4 ring-amber-400/30" : 
                    isCriticalMode ? "bg-red-500 border-slate-900" : 
                    "bg-emerald-400 border-slate-900 group-hover:scale-110"
                  }`} />

                  {/* On-Map Tiny Tooltip Badge */}
                  <div className="absolute left-5 -top-3 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 bg-slate-900/95 text-white text-[9px] font-mono px-2 py-1.5 rounded-lg border border-slate-850 whitespace-nowrap shadow-2xl z-30 pointer-events-none">
                    <div className="font-bold text-slate-100 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-blue-400" />
                      {zone.name}
                    </div>
                    <div className="text-slate-400 mt-0.5">Assets: {zone.assets.toLocaleString()} | Health: {zone.healthIndex}%</div>
                  </div>
                </button>
              );
            })}

            {/* Quick Map Overlay legends */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1.5 z-20 shadow-xl font-mono text-[9px] text-slate-300">
              <div className="font-bold text-white uppercase border-b border-slate-800 pb-1 mb-1">NODE STATUS KEY:</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                <span>Optimal (Health &gt; 80%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                <span>Critical Risk Warning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse"></span>
                <span>Selected Focus Node</span>
              </div>
            </div>

            {/* Map Instruction Indicator */}
            <div className="absolute top-4 left-4 bg-slate-900/60 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 pointer-events-none text-[9.5px] font-mono flex items-center gap-1.5 backdrop-blur-sm shadow">
              <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>MoHUA Command Telemetry Stream</span>
            </div>
          </div>
        </div>

        {/* Selected Zone Deep Dive Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                <h3 className="font-display font-bold text-slate-900 text-sm tracking-wider uppercase flex items-center gap-1.5">
                  <Milestone className="w-4 h-4 text-brand-medium" />
                  Zone Diagnostic Intel
                </h3>

                {activeNodeDetails ? (
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    activeNodeDetails.monsoonRisk === "CRITICAL" ? "bg-red-50 text-red-600 animate-pulse" :
                    activeNodeDetails.monsoonRisk === "HIGH" ? "bg-amber-50 text-amber-600" :
                    "bg-blue-50 text-blue-600"
                  }`}>
                    {activeNodeDetails.monsoonRisk} MONSOON RISK
                  </span>
                ) : (
                  <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    ALL REGIONS FILTERED
                  </span>
                )}
              </div>

              {activeNodeDetails ? (
                <div className="space-y-5 py-4">
                  {/* Large Zone Identifier */}
                  <div>
                    <h4 className="text-xl font-display font-medium text-slate-900">
                      {activeNodeDetails.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                      {activeNodeDetails.region} • Regional Smart Cities Mission Unit
                    </span>
                  </div>

                  {/* Gauge stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Operational Assets</span>
                      <strong className="text-base font-display text-slate-800 mt-1 block">
                        {activeNodeDetails.assets.toLocaleString()}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Incidents SLA</span>
                      <strong className="text-base font-display text-slate-850 mt-1 block flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500 inline" />
                        {activeNodeDetails.slaIndex}
                      </strong>
                    </div>
                  </div>

                  {/* Index Meter */}
                  <div className="space-y-1.5 bg-slate-50/65 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-mono text-slate-500">Zone Health Index</span>
                      <strong className={`font-bold font-mono text-sm ${
                        activeNodeDetails.healthIndex >= 80 ? "text-emerald-600" : "text-amber-600"
                      }`}>
                        {activeNodeDetails.healthIndex}%
                      </strong>
                    </div>
                    {/* Linear bar index */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${activeNodeDetails.healthIndex}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          activeNodeDetails.healthIndex >= 80 ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Node Management hierarchy */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">Active Critical Failures:</span>
                      <span className="font-semibold text-slate-800 font-mono">{activeNodeDetails.criticalCount} Incidents</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">Associated Smart Cities Hubs:</span>
                      <span className="font-semibold text-slate-800">12 Primary Hubs</span>
                    </div>
                    <div className="flex flex-col gap-1 py-1.5">
                      <span className="text-slate-500">Nodal Command Officer:</span>
                      <span className="font-semibold text-slate-850 text-[11px] bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-150 block mt-1">
                        {activeNodeDetails.leadEngineer}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                    <Search className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">No Focus Zone Selected</h5>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Click any interactive glowing command node on the map to inspect granular regional infrastructure statistics.
                    </p>
                  </div>
                  {/* Fast Selector list */}
                  <div className="w-full max-w-xs space-y-2 pt-4">
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest block text-left">Quick Spotlight Selection:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      {nationalZones.map(nz => (
                        <button
                          key={nz.id}
                          onClick={() => setSelectedZone(nz.id)}
                          className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left truncate text-[10px] text-slate-700 font-bold hover:scale-[1.01] transition cursor-pointer"
                        >
                          {nz.name.split(" ")[0]} ({nz.healthIndex}%)
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Live IMD Disaster Feed banner inside column */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800 leading-relaxed text-xs">
              <CloudRain className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 animate-bounce" />
              <div>
                <strong className="block font-bold">IMD Heavy Monsoon Saturation Advisory:</strong>
                <span>Atmospheric pressure indicates extreme 120mm precipitation over Western Coastal highways within 24 hours. Local patch sealing deployment queues ordered.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* State Ledger Leaderboard & Search */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
        
        {/* Leaderboard Header with Filter elements */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="font-display font-medium text-slate-950 text-base flex items-center gap-2 uppercase">
              <MapPin className="w-5 h-5 text-brand-medium" />
              State-Wise Infrastructure Health Leaderboard
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative infrastructure ranking from registered MoHUA monsoonal audits. High Health indicates proactive SLA completion.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state or capital..."
                className="pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs rounded-xl border border-slate-205 focus:border-brand-medium focus:ring-1 focus:ring-brand-medium outline-none transition w-full sm:w-48"
              />
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 outline-none text-xs rounded-xl px-2 py-1.5 font-sans cursor-pointer focus:border-brand-medium"
              >
                <option value="all">All Health Categories</option>
                <option value="optimal">Optimal (&ge;80)</option>
                <option value="evaluating">Evaluating (75-79)</option>
                <option value="warning">Warning (70-74)</option>
                <option value="critical">Critical (&lt;70)</option>
              </select>
            </div>
          </div>
        </div>

        {/* The Leaderboard Desk */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-150">
                <th className="py-3 px-4 text-center font-bold">Rank</th>
                <th className="py-3 px-4 font-bold">State / Administration Territory</th>
                <th className="py-3 px-4 text-center font-bold">Health Index</th>
                <th className="py-3 px-4 text-center font-bold">Monitored Assets</th>
                <th className="py-3 px-4 text-center font-bold">Active Incidents</th>
                <th className="py-3 px-4 text-center font-bold">Average SLA Time</th>
                <th className="py-3 px-4 text-right font-bold">Est. Saved Funds</th>
                <th className="py-3 px-4 text-center font-bold">SLA Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStates.length > 0 ? (
                filteredStates.map((item) => {
                  return (
                    <tr 
                      key={item.state} 
                      className={`hover:bg-slate-50/70 transition ${
                        selectedVisualState === item.state ? "bg-slate-50" : ""
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                        {item.rank === 1 ? "🥇 1" : item.rank === 2 ? "🥈 2" : item.rank === 3 ? "🥉 3" : item.rank}
                      </td>

                      {/* State Identity */}
                      <td className="py-3.5 px-4 font-sans">
                        <div>
                          <strong className="text-slate-900 font-medium text-sm block">{item.state}</strong>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{item.capital} Urban Bureau</span>
                        </div>
                      </td>

                      {/* Health Meter Index */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-3">
                          <span className={`font-mono font-bold w-10 text-right ${
                            item.healthIndex >= 80 ? "text-emerald-600" :
                            item.healthIndex >= 70 ? "text-amber-600" :
                            "text-rose-600"
                          }`}>
                            {item.healthIndex}%
                          </span>
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              style={{ width: `${item.healthIndex}%` }}
                              className={`h-full rounded-full ${
                                item.healthIndex >= 80 ? "bg-emerald-500" :
                                item.healthIndex >= 70 ? "bg-amber-500" :
                                "bg-rose-500"
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Monitored Assets */}
                      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-650 font-medium">
                        {item.monitoredAssets.toLocaleString()}
                      </td>

                      {/* Active Incidents */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          item.activeIncidents > 15 ? "bg-red-50 text-red-650 text-red-650" :
                          item.activeIncidents > 8 ? "bg-amber-50 text-amber-650 text-amber-600" :
                          "bg-emerald-50 text-emerald-600"
                        }`}>
                          {item.activeIncidents} Active
                        </span>
                      </td>

                      {/* SLA Time */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                        {item.avgSlaResolution} Hours
                      </td>

                      {/* Saved Funds */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                        ₹{item.fundingSaved} Lakhs
                      </td>

                      {/* SLA Badge Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-xl text-[9px] font-mono font-bold uppercase tracking-widest ${
                          item.status === "OPTIMAL" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                          item.status === "EVALUATING" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                          item.status === "WARNING" ? "bg-amber-100 text-amber-850 border border-amber-200 text-amber-800" :
                          "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}>
                          {item.status}
                        </span>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No state listings match the specified filter or query parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Comparative chart analysis & MoHUA Target Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart index comparative */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
          <div>
            <h3 className="font-display font-medium text-slate-900 text-sm tracking-wider uppercase">
              State Health Indices vs National Benchmark (85%)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualizes which regional urban bodies surpass the MoHUA-mandated 85% target monsoonal index.
            </p>
          </div>

          <div className="h-64 font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateChartData.slice(0, 7)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9.5} tickLine={false} />
                <YAxis stroke="#94a3b8" domain={[50, 100]} fontSize={9.5} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "#fff" }}
                  labelStyle={{ fontWeight: "bold", color: "#fff" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "10.5px" }} />
                <Bar dataKey="Health Index" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="National Benchmark" stroke="#f59e0b" strokeWidth={1.5} fill="none" strokeDasharray="3 3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Public Funds Saved Growth chart */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
          <div>
            <h3 className="font-display font-medium text-slate-900 text-sm tracking-wider uppercase">
              Monsoon Disaster Mitigation Cost Avoidance Cumulative Forecast
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Accumulation of avoided flood damages and structural road collapse rebuild budgets (In ₹ Crores).
            </p>
          </div>

          <div className="h-64 font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={[
                  { month: "Jan", Saved: 12.4 },
                  { month: "Feb", Saved: 18.2 },
                  { month: "Mar", Saved: 29.5 },
                  { month: "Apr", Saved: 42.1 },
                  { month: "May", Saved: 56.4 },
                  { month: "Jun (Live)", Saved: totalPublicMoneySaved }
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={9.5} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9.5} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "#fff" }}
                />
                <Area type="monotone" dataKey="Saved" stroke="#10b981" fillOpacity={0.1} fill="#10b981" strokeWidth={2} name="Funds Saved (₹ Cr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
