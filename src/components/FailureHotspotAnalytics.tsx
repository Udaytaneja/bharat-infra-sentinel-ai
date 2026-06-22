import React, { useState, useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  Cell,
  Legend,
  CartesianGrid,
  PieChart,
  Pie
} from "recharts";
import { 
  TrendingUp, 
  AlertTriangle, 
  MapPin, 
  Flame, 
  Activity, 
  Map as MapIcon, 
  Compass, 
  Wrench, 
  ShieldAlert, 
  ListFilter, 
  ChevronRight, 
  Info,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Complaint } from "../types";

interface FailureHotspotAnalyticsProps {
  complaints: Complaint[];
  onSelectComplaint?: (id: string) => void;
}

export default function FailureHotspotAnalytics({ 
  complaints = [], 
  onSelectComplaint 
}: FailureHotspotAnalyticsProps) {
  // Analytical states
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("ALL");
  const [selectedAssetFilter, setSelectedAssetFilter] = useState<string>("ALL");
  const [hoveredHotspot, setHoveredHotspot] = useState<any | null>(null);
  const [selectedHotZone, setSelectedHotZone] = useState<any | null>(null);

  // Smart location parsing & clustering algorithm
  // Extracts city/region from standard Indian address format (e.g., "Koramangala, Bengaluru", "Connaught Place, New Delhi")
  const parsedComplaints = useMemo(() => {
    return complaints.map(c => {
      let city = "Unknown City";
      const locLower = c.location.toLowerCase();
      
      if (locLower.includes("delhi")) city = "Delhi NCR";
      else if (locLower.includes("bengaluru") || locLower.includes("bangalore")) city = "Bengaluru";
      else if (locLower.includes("mumbai") || locLower.includes("bombay")) city = "Mumbai";
      else if (locLower.includes("chennai") || locLower.includes("madras")) city = "Chennai";
      else if (locLower.includes("kolkata") || locLower.includes("calcutta")) city = "Kolkata";
      else if (locLower.includes("hyderabad")) city = "Hyderabad";
      else if (locLower.includes("pune")) city = "Pune";
      else {
        // Fallback to taking the last string part if comma partitioned
        const parts = c.location.split(",");
        if (parts.length > 1) {
          city = parts[parts.length - 1].trim();
        } else {
          city = "Other Metro Hubs";
        }
      }
      return {
        ...c,
        calculatedCity: city
      };
    });
  }, [complaints]);

  // Unique list of parsed cities and failing assets for drop-downs
  const citiesList = useMemo(() => {
    const list = new Set(parsedComplaints.map(p => p.calculatedCity));
    return ["ALL", ...Array.from(list)];
  }, [parsedComplaints]);

  const assetTypesList = useMemo(() => {
    const list = new Set(parsedComplaints.map(p => p.issueType));
    return ["ALL", ...Array.from(list)];
  }, [parsedComplaints]);

  // Apply drop-down filters
  const filteredComplaints = useMemo(() => {
    return parsedComplaints.filter(c => {
      const matchCity = selectedCityFilter === "ALL" || c.calculatedCity === selectedCityFilter;
      const matchAsset = selectedAssetFilter === "ALL" || c.issueType === selectedAssetFilter;
      return matchCity && matchAsset;
    });
  }, [parsedComplaints, selectedCityFilter, selectedAssetFilter]);

  // Category 1: Group and Rank areas with repeated complaints (Top Hotspot Areas)
  const hotspotAreasRanking = useMemo(() => {
    const countsMap: { [key: string]: { 
      location: string; 
      complaints: any[]; 
      avgSeverity: number; 
      avgRisk: number; 
      city: string; 
      latSum: number;
      lngSum: number;
    } } = {};

    filteredComplaints.forEach(c => {
      const normalizedKey = c.location.split(",")[0].trim(); // Neighborhood level
      if (!countsMap[normalizedKey]) {
        countsMap[normalizedKey] = {
          location: normalizedKey,
          complaints: [],
          avgSeverity: 0,
          avgRisk: 0,
          city: c.calculatedCity,
          latSum: 0,
          lngSum: 0
        };
      }
      countsMap[normalizedKey].complaints.push(c);
      countsMap[normalizedKey].avgSeverity += c.severityScore;
      countsMap[normalizedKey].avgRisk += c.riskScore;
      countsMap[normalizedKey].latSum += c.latitude;
      countsMap[normalizedKey].lngSum += c.longitude;
    });

    return Object.values(countsMap)
      .map(item => ({
        ...item,
        count: item.complaints.length,
        avgSeverity: Math.round(item.avgSeverity / item.complaints.length),
        avgRisk: Math.round(item.avgRisk / item.complaints.length),
        latitude: item.latSum / item.complaints.length,
        longitude: item.lngSum / item.complaints.length,
        hazardLevel: (item.complaints.length * 15) + (item.avgRisk / 2) // Composite threat metric
      }))
      .sort((a, b) => b.count !== a.count ? b.count - a.count : b.hazardLevel - a.hazardLevel);
  }, [filteredComplaints]);

  // Category 2: Frequently failing infrastructure assets
  const infrastructureFailureRanking = useMemo(() => {
    const countsMap: { [key: string]: { 
      assetType: string; 
      totalFailures: number; 
      avgRisk: number; 
      avgSeverity: number; 
      activeIncidents: number; 
      solvedIncidents: number; 
    } } = {};

    filteredComplaints.forEach(c => {
      const key = c.issueType || "Other Assets";
      if (!countsMap[key]) {
        countsMap[key] = {
          assetType: key,
          totalFailures: 0,
          avgRisk: 0,
          avgSeverity: 0,
          activeIncidents: 0,
          solvedIncidents: 0
        };
      }
      countsMap[key].totalFailures += 1;
      countsMap[key].avgRisk += c.riskScore;
      countsMap[key].avgSeverity += c.severityScore;
      if (c.status === "RESOLVED") countsMap[key].solvedIncidents += 1;
      else countsMap[key].activeIncidents += 1;
    });

    return Object.values(countsMap)
      .map(item => ({
        ...item,
        avgRisk: Math.round(item.avgRisk / item.totalFailures),
        avgSeverity: Math.round(item.avgSeverity / item.totalFailures),
        failureRateMetric: Math.round((item.activeIncidents / item.totalFailures) * 100)
      }))
      .sort((a, b) => b.totalFailures - a.totalFailures);
  }, [filteredComplaints]);

  // Category 3: High-Risk Zones identified
  // Filter complaints labeled with a risk score above 70
  const highRiskZonesList = useMemo(() => {
    return filteredComplaints
      .filter(c => c.riskScore >= 70)
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [filteredComplaints]);

  // Auto-select the top hotspot region
  React.useEffect(() => {
    if (hotspotAreasRanking.length > 0 && !selectedHotZone) {
      setSelectedHotZone(hotspotAreasRanking[0]);
    }
  }, [hotspotAreasRanking, selectedHotZone]);

  // Calculate composite city threats for the Recharts Bar Charts
  const chartDataCities = useMemo(() => {
    const citiesCount: { [key: string]: { city: string; count: number; avgRisk: number; avgSeverity: number } } = {};
    parsedComplaints.forEach(c => {
      if (!citiesCount[c.calculatedCity]) {
        citiesCount[c.calculatedCity] = { city: c.calculatedCity, count: 0, avgRisk: 0, avgSeverity: 0 };
      }
      citiesCount[c.calculatedCity].count += 1;
      citiesCount[c.calculatedCity].avgRisk += c.riskScore;
      citiesCount[c.calculatedCity].avgSeverity += c.severityScore;
    });

    return Object.values(citiesCount).map(c => ({
      ...c,
      avgRisk: Math.round(c.avgRisk / c.count),
      avgSeverity: Math.round(c.avgSeverity / c.count)
    })).sort((a, b) => b.count - a.count);
  }, [parsedComplaints]);

  // Recharts Scatter data representation for risk index scatter map
  const scatterRiskData = useMemo(() => {
    return filteredComplaints.map(c => ({
      name: c.location.split(",")[0],
      risk: c.riskScore,
      severity: c.severityScore,
      id: c.id,
      issue: c.issueType,
      city: c.calculatedCity
    }));
  }, [filteredComplaints]);

  // Set the first item info when selectedHotZone is changed
  const selectedZoneComplaints = useMemo(() => {
    if (!selectedHotZone) return [];
    return filteredComplaints.filter(c => c.location.includes(selectedHotZone.location));
  }, [selectedHotZone, filteredComplaints]);

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100">
      
      {/* 1. Header Information Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950/40 p-6 rounded-3xl border border-slate-800/80 shadow-md">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-br from-amber-500/15 to-orange-500/10 text-orange-400 rounded-2xl border border-orange-500/20">
              <Flame className="w-5 h-5 animate-pulse" />
            </span>
            <span className="font-mono text-xs font-bold tracking-widest text-indigo-400 uppercase">Interactive Threat Analytics</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-white uppercase mt-1">
            Failure Hotspot Analytics
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Automatic real-time machine intelligence dashboard identifying regional incident loops, critical infrastructure decay parameters, and geographical risk overlays directly parsed from active Supabase database records.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/60 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono uppercase bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <ListFilter className="w-3.5 h-3.5" />
            Core Filters:
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-sans hover:border-slate-700 focus:border-indigo-500 outline-none cursor-pointer flex-1 sm:flex-initial"
            >
              <option value="ALL">All Metro Cities ({citiesList.length - 1})</option>
              {citiesList.filter(c => c !== "ALL").map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              value={selectedAssetFilter}
              onChange={(e) => setSelectedAssetFilter(e.target.value)}
              className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-sans hover:border-slate-700 focus:border-indigo-500 outline-none cursor-pointer flex-1 sm:flex-initial"
            >
              <option value="ALL">All Infrastructure Assets</option>
              {assetTypesList.filter(a => a !== "ALL").map(asset => (
                <option key={asset} value={asset}>{asset}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Top-level cluster statistical aggregates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-[#111726] border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition">
          <div className="absolute right-[-15px] bottom-[-15px] opacity-[0.04] text-indigo-400 pointer-events-none group-hover:scale-110 transition duration-300">
            <MapPin className="w-24 h-24" />
          </div>
          <p className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">IDENTIFIED HOTSPOT CLUSTERS</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black font-display text-white">{hotspotAreasRanking.filter(h => h.count > 1).length}</h3>
            <span className="text-[10px] text-rose-500 font-mono font-bold uppercase">Repeated loops</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-3">
            <div className="bg-gradient-to-r from-red-500 to-indigo-500 h-full rounded-full" style={{ width: "70%" }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-sans">Areas registering recurrence failures</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#111726] border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-rose-500/30 transition">
          <div className="absolute right-[-15px] bottom-[-15px] opacity-[0.04] text-rose-400 pointer-events-none group-hover:scale-110 transition duration-300">
            <ShieldAlert className="w-24 h-24" />
          </div>
          <p className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">CRITICAL HIGH-RISK INCIDENTS</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black font-display text-rose-500">{highRiskZonesList.length}</h3>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Risk &gt; 70</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-3">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, (highRiskZonesList.length / (complaints.length || 1)) * 100)}%` }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-sans">Immediate intervention recommended</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#111726] border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/30 transition">
          <div className="absolute right-[-15px] bottom-[-15px] opacity-[0.04] text-amber-500 pointer-events-none group-hover:scale-110 transition duration-300">
            <Wrench className="w-24 h-24" />
          </div>
          <p className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">FAILING INFRASTRUCTURE CLASSES</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black font-display text-white">{infrastructureFailureRanking.length}</h3>
            <span className="text-[10px] text-amber-500 font-mono font-bold uppercase">Asset types</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-3">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: "60%" }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-sans">Distinct types experiencing decay fatigue</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#111726] border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition">
          <div className="absolute right-[-15px] bottom-[-15px] opacity-[0.04] text-emerald-400 pointer-events-none group-hover:scale-110 transition duration-300">
            <Activity className="w-24 h-24" />
          </div>
          <p className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">AVG DENSE FAILURE STRESS INDEX</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black font-display text-emerald-400">
              {complaints.length > 0 
                ? Math.round(complaints.reduce((acc, current) => acc + current.severityScore, 0) / complaints.length) 
                : 0}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Mean Score</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-3">
            <div 
              className="bg-emerald-500 h-full rounded-full" 
              style={{ 
                width: `${complaints.length > 0 ? (complaints.reduce((acc, curr) => acc + curr.severityScore, 0) / complaints.length) : 0}%` 
              }} 
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-sans">Aggregated municipal incident stress severity</p>
        </div>

      </div>

      {/* 3. GIS Hotspot Heatmap & Interactive City Radar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: India Interactive Metropolitan Hotspot Radar Heatmap */}
        <div className="lg:col-span-7 bg-[#0b0f19] border border-slate-805 p-6 rounded-3xl space-y-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-2 right-2 flex scale-75 border-slate-800 bg-slate-950 p-2.5 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-widest">Metropolitan Heat Sweep Live</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <MapIcon className="w-4.5 h-4.5 text-indigo-400" />
              <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-wider">Metropolitan GIS Heatmap Overlay</span>
            </div>
            <h3 className="text-base font-black font-display text-white uppercase">METROPOLITAN FAILURE LOOP MAP</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Virtual Metropolitan Heat Matrix. Interactive circular nodes represents parsed live incidents counts. Hover or click nodes to center analytics profiles.
            </p>
          </div>

          {/* Core Interactive SVG Heatmap */}
          <div className="relative h-80 bg-[#070b13] rounded-2xl border border-slate-850 overflow-hidden flex items-center justify-center p-4">
            
            {/* Ambient visual background radar circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <div className="w-96 h-96 rounded-full border border-indigo-400 animate-pulse" />
              <div className="w-64 h-64 rounded-full border border-indigo-500 absolute" />
              <div className="w-32 h-32 rounded-full border border-indigo-600 absolute" />
            </div>

            {/* Simulated Metros coordinate points vector map */}
            <svg viewBox="0 0 400 400" className="w-full h-full max-w-[340px] relative z-10">
              {/* Static background outlines of India subcontinent major hubs lines */}
              <path 
                d="M110,60 L200,30 L280,70 L300,120 L350,180 L320,280 L200,380 L160,350 L140,280 L90,200 L70,120 Z" 
                fill="none" 
                stroke="#1e293b" 
                strokeWidth="2.5" 
                strokeDasharray="6 4"
                className="opacity-60"
              />
              
              {/* India Metro cities localized node hotspots rendered dynamically */}
              {/* Delhi Node: Coordinates 190, 80 */}
              <g 
                className="cursor-pointer"
                onClick={() => {
                  setSelectedCityFilter("Delhi NCR");
                }}
                onMouseEnter={() => setHoveredHotspot({ name: "Delhi NCR", count: parsedComplaints.filter(p => p.calculatedCity === "Delhi NCR").length })}
                onMouseLeave={() => setHoveredHotspot(null)}
              >
                <circle cx="190" cy="80" r={6 + Math.min(18, parsedComplaints.filter(p => p.calculatedCity === "Delhi NCR").length * 2)} fill="#ef4444" fillOpacity="0.15" />
                <circle cx="190" cy="80" r="4" fill="#ef4444" className="animate-pulse" />
                <text x="200" y="84" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="monospace">DELHI NCR</text>
              </g>

              {/* Mumbai Node: Coordinates 110, 240 */}
              <g 
                className="cursor-pointer"
                onClick={() => {
                  setSelectedCityFilter("Mumbai");
                }}
                onMouseEnter={() => setHoveredHotspot({ name: "Mumbai", count: parsedComplaints.filter(p => p.calculatedCity === "Mumbai").length })}
                onMouseLeave={() => setHoveredHotspot(null)}
              >
                <circle cx="110" cy="240" r={6 + Math.min(18, parsedComplaints.filter(p => p.calculatedCity === "Mumbai").length * 2)} fill="#f59e0b" fillOpacity="0.15" />
                <circle cx="110" cy="240" r="4" fill="#f59e0b" />
                <text x="120" y="244" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="monospace">MUMBAI</text>
              </g>

              {/* Bengaluru Node: Coordinates 160, 310 */}
              <g 
                className="cursor-pointer"
                onClick={() => {
                  setSelectedCityFilter("Bengaluru");
                }}
                onMouseEnter={() => setHoveredHotspot({ name: "Bengaluru", count: parsedComplaints.filter(p => p.calculatedCity === "Bengaluru").length })}
                onMouseLeave={() => setHoveredHotspot(null)}
              >
                <circle cx="160" cy="310" r={6 + Math.min(18, parsedComplaints.filter(p => p.calculatedCity === "Bengaluru").length * 2)} fill="#6366f1" fillOpacity="0.15" />
                <circle cx="160" cy="310" r="4" fill="#6366f1" className="animate-pulse" />
                <text x="170" y="314" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="monospace">BENGALURU</text>
              </g>

              {/* Chennai Node: Coordinates 200, 320 */}
              <g 
                className="cursor-pointer"
                onClick={() => {
                  setSelectedCityFilter("Chennai");
                }}
                onMouseEnter={() => setHoveredHotspot({ name: "Chennai", count: parsedComplaints.filter(p => p.calculatedCity === "Chennai").length })}
                onMouseLeave={() => setHoveredHotspot(null)}
              >
                <circle cx="200" cy="320" r={6 + Math.min(18, parsedComplaints.filter(p => p.calculatedCity === "Chennai").length * 2)} fill="#3b82f6" fillOpacity="0.15" />
                <circle cx="200" cy="320" r="4" fill="#3b82f6" />
                <text x="210" y="324" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="monospace">CHENNAI</text>
              </g>

              {/* Kolkata Node: Coordinates 310, 180 */}
              <g 
                className="cursor-pointer"
                onClick={() => {
                  setSelectedCityFilter("Kolkata");
                }}
                onMouseEnter={() => setHoveredHotspot({ name: "Kolkata", count: parsedComplaints.filter(p => p.calculatedCity === "Kolkata").length })}
                onMouseLeave={() => setHoveredHotspot(null)}
              >
                <circle cx="310" cy="180" r={6 + Math.min(18, parsedComplaints.filter(p => p.calculatedCity === "Kolkata").length * 2)} fill="#10b981" fillOpacity="0.15" />
                <circle cx="310" cy="180" r="4" fill="#10b981" />
                <text x="320" y="184" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="monospace">KOLKATA</text>
              </g>
            </svg>

            {/* Dynamic tooltips inside Map Grid */}
            {hoveredHotspot && (
              <div className="absolute bottom-4 left-4 bg-slate-950/95 border border-slate-800 p-3 rounded-xl shadow-2xl space-y-1 z-20 animate-fadeIn min-w-[150px]">
                <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">Metro Intel Feed</span>
                <h4 className="text-xs font-bold text-white uppercase">{hoveredHotspot.name}</h4>
                <div className="text-xs font-semibold text-amber-400">
                  {hoveredHotspot.count} Active Incidents
                </div>
              </div>
            )}

            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="text-[9px] font-mono text-slate-500 uppercase leading-none">Map Navigation Standard Mercator Map</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 text-xs border-t border-slate-850 pt-4">
            <span className="text-slate-400 font-mono text-[10px]">Filter Status: <strong className="text-amber-400">{selectedCityFilter}</strong></span>
            {selectedCityFilter !== "ALL" && (
              <button 
                onClick={() => setSelectedCityFilter("ALL")}
                className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                [ RESET METRO FILTER ]
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Recharts Bar Chart Rank metric of Metros */}
        <div className="lg:col-span-5 bg-[#0b0f19] border border-slate-805 p-6 rounded-3xl space-y-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4.5 h-4.5 text-amber-400" />
                <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">Top failing metropolitan clusters</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase bg-slate-800 text-slate-300">Live DB digest</span>
            </div>
            <h3 className="text-base font-black font-display text-white uppercase">CITY COMPARATIVE MATRIX</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Comparative ranking of municipal regions based on consolidated incident frequencies & average severity scores.
            </p>
          </div>

          {/* Recharts Bar Chart wrapper */}
          <div className="h-60 w-full bg-slate-950/20 p-2.5 rounded-2xl border border-slate-850 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartDataCities}
                margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
              >
                <XAxis 
                  dataKey="city" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false}
                  fontFamily="monospace"
                />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0b0f19", border: "1px solid #1e293b", borderRadius: "12px" }}
                  itemStyle={{ color: "#f8fafc", fontSize: "11px", fontFamily: "sans-serif" }}
                  labelStyle={{ color: "#94a3b8", fontSize: "10px", fontFamily: "monospace" }}
                />
                <Bar dataKey="count" name="Complaint Count" fill="#818cf8" radius={[4, 4, 0, 0]}>
                  {chartDataCities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#f59e0b" : "#6366f1"} />
                  ))}
                </Bar>
                <Bar dataKey="avgSeverity" name="Avg Severity" fill="#f43f5e" radius={[4, 4, 0, 0]} opacity={0.65} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-200">Analytical Insight:</span> {chartDataCities[0] ? (
              <>
                <strong className="text-amber-400">{chartDataCities[0].city}</strong> possesses the densest volume of reported failures in your active stack list, averaging a structural decay rate of <strong className="text-rose-400">{chartDataCities[0].avgSeverity}/100</strong>.
              </>
            ) : "No incidents loaded."}
          </div>
        </div>

      </div>

      {/* 4. High-risk zones & failure rankings tables breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ranked Hotspot Areas (Leaderboard style) */}
        <div className="lg:col-span-4 bg-[#0b0f19] border border-slate-805 p-6 rounded-3xl space-y-4 shadow-2xl">
          <div className="space-y-1">
            <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400 uppercase block">1. METROPOLITAN FAILURE LOOPS</span>
            <h3 className="text-base font-black font-display text-white uppercase">Ranked Repeated Areas</h3>
            <p className="text-xs text-slate-400">
              Areas grouped by repeated citizen intake events. Click any zone to map its corresponding reports block.
            </p>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-850">
            {hotspotAreasRanking.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">No hotspot coordinates parsed.</div>
            ) : (
              hotspotAreasRanking.map((item, index) => {
                const isSelected = selectedHotZone?.location === item.location;
                return (
                  <div 
                    key={item.location}
                    onClick={() => setSelectedHotZone(item)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition active:scale-[0.99] flex items-center justify-between gap-3 ${
                      isSelected 
                        ? "bg-indigo-950/40 border-indigo-500/50 hover:border-indigo-500/60" 
                        : "bg-slate-900/40 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/70"
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[10px] leading-none px-1.5 py-0.5 rounded bg-slate-950 border border-slate-850 text-indigo-400 font-bold">
                          RANK #{index + 1}
                        </span>
                        <span className="text-[10.5px] font-bold text-slate-300 font-mono">{item.city}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{item.location}</h4>
                      <p className="text-[10px] text-slate-500 font-sans">
                        GPS Lat/Lng: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-black text-rose-500 font-display">
                        {item.count} Reports
                      </div>
                      <span className={`text-[9px] font-mono uppercase font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded ${
                        item.count >= 3 ? "text-rose-400 bg-rose-500/10" : "text-amber-500 bg-amber-500/10"
                      }`}>
                        SLA Alert
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Zone reports details display panel */}
        <div className="lg:col-span-8 bg-[#0b0f19] border border-slate-805 p-6 rounded-3xl space-y-6 shadow-2xl flex flex-col justify-between">
          {selectedHotZone ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-black uppercase">
                      ACTIVE HOVER profile
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Composite Threat: {selectedHotZone.hazardLevel.toFixed(1)}</span>
                  </div>
                  <h3 className="text-base font-black font-display text-white uppercase">{selectedHotZone.location} ({selectedHotZone.city})</h3>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-850 text-center min-w-[70px]">
                    <span className="text-[8px] text-slate-500 uppercase block leading-none">Severity</span>
                    <span className="text-xs font-bold text-rose-500">{selectedHotZone.avgSeverity}/100</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-850 text-center min-w-[70px]">
                    <span className="text-[8px] text-slate-500 uppercase block leading-none">Risk Score</span>
                    <span className="text-xs font-bold text-amber-500">{selectedHotZone.avgRisk}/100</span>
                  </div>
                </div>
              </div>

              {/* List of complaints assigned inside this hotspot */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-slate-850">
                <span className="text-[9px] font-bold font-mono tracking-widest text-slate-400 uppercase block">Active Incidents Stack In Zone ({selectedZoneComplaints.length})</span>
                {selectedZoneComplaints.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => onSelectComplaint?.(c.id)}
                    className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {c.imageUrl && (
                        <img 
                          src={c.imageUrl} 
                          alt="Failure visual" 
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-slate-800/80" 
                        />
                      )}
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-amber-400">{c.id}</span>
                          <span className="text-[10px] font-semibold text-slate-400">| {c.issueType}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate max-w-sm sm:max-w-md">{c.location}</h4>
                        <p className="text-[10.5px] text-slate-400 line-clamp-1">{c.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-auto">
                      <div className="text-right">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          c.status === "PENDING" ? "bg-rose-500/10 text-rose-500 border border-rose-500/15" :
                          c.status === "ASSIGNED" ? "bg-blue-500/10 text-blue-400 border border-blue-500/15" :
                          c.status === "IN_PROGRESS" ? "bg-amber-500/10 text-amber-500 border border-amber-500/15" :
                          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-500 p-8 text-center text-xs">
              <Compass className="w-10 h-10 text-slate-600 mb-2 animate-spin" />
              Select a failing hotspot location cluster on the left list to parse active reports registry.
            </div>
          )}
        </div>

      </div>

      {/* 5. Failing Infrastructure Asset Classes & Recharts Scatter Risk Map Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Frequently Failing Infrastructure components ranking breakdown query */}
        <div className="lg:col-span-5 bg-[#0b0f19] border border-slate-805 p-6 rounded-3xl space-y-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400 uppercase block">2. FREQUENTLY FAILING INFRASTRUCTURE CLASSES</span>
            <h3 className="text-base font-black font-display text-white uppercase">Critical Infrastructure Decay</h3>
            <p className="text-xs text-slate-400">
              Ranking municipal components by relative failure count, average severe risk factor and mitigation active rates.
            </p>
          </div>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-850">
            {infrastructureFailureRanking.map((item, index) => (
              <div key={item.assetType} className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-slate-500 leading-none">ASSET RANK #{index + 1}</span>
                    <h4 className="text-xs font-bold text-white uppercase font-display">{item.assetType}</h4>
                  </div>
                  <div className="bg-rose-500/10 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-rose-500 border border-rose-500/15 text-center">
                    {item.totalFailures} Failures
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                  <div className="bg-[#0e1422] p-2 rounded-lg border border-slate-850/60">
                    <span className="text-[8px] text-slate-500 block uppercase leading-none">Severity</span>
                    <span className="text-[11px] font-bold text-slate-200">{item.avgSeverity}/100</span>
                  </div>
                  <div className="bg-[#0e1422] p-2 rounded-lg border border-slate-850/60">
                    <span className="text-[8px] text-slate-500 block uppercase leading-none">Risk Factor</span>
                    <span className="text-[11px] font-bold text-slate-200">{item.avgRisk}/100</span>
                  </div>
                  <div className="bg-[#0e1422] p-2 rounded-lg border border-slate-850/60">
                    <span className="text-[8px] text-slate-500 block uppercase leading-none">Active Loop</span>
                    <span className="text-[11px] font-bold text-amber-500">{item.activeIncidents} Open</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Recharts Scatter Threat Plot */}
        <div className="lg:col-span-7 bg-[#0b0f19] border border-slate-805 p-6 rounded-3xl space-y-6 shadow-2xl">
          <div className="space-y-1">
            <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400 uppercase block border-b border-slate-850 pb-2">3. MULTI-VARIABLE THREAT SCATTER PLOT</span>
            <h3 className="text-base font-black font-display text-white uppercase">Incidents Threat Matrix Distribution</h3>
            <p className="text-xs text-slate-400">
              Correlating severity scores (Y-axis) with safety risk levels (X-axis). Quadrants highlight key areas requiring critical capital injection.
            </p>
          </div>

          {/* Recharts Scatter graph representation */}
          <div className="h-64 w-full bg-slate-950/40 p-2 rounded-2xl border border-slate-850 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="risk" 
                  name="Safety Risk Level" 
                  unit="/100" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontFamily="monospace"
                  domain={[0, 100]}
                />
                <YAxis 
                  type="number" 
                  dataKey="severity" 
                  name="Incident Severity" 
                  unit="/100" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontFamily="monospace"
                  domain={[0, 100]}
                />
                <ZAxis type="number" range={[60, 200]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0b0f19", border: "1px solid #1e293b", borderRadius: "12px" }}
                  itemStyle={{ color: "#f8fafc", fontSize: "11px", fontFamily: "sans-serif" }}
                  labelStyle={{ color: "#94a3b8", fontSize: "10px", fontFamily: "monospace" }}
                  cursor={{ strokeDasharray: "3 3" }} 
                />
                <Scatter name="Failing Nodes" data={scatterRiskData} fill="#8884d8">
                  {scatterRiskData.map((entry, index) => {
                    const color = entry.risk >= 80 ? "#f43f5e" : entry.risk >= 65 ? "#f59e0b" : "#6366f1";
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={color} 
                        className="cursor-pointer hover:scale-125 transition"
                        onClick={() => onSelectComplaint?.(entry.id)}
                      />
                    );
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-6 justify-center text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Critical Risk (&gt;=80)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Medium risk (65-79)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              Standard Incident (&lt;65)
            </span>
          </div>
        </div>

      </div>

      {/* 6. Active High Risk Zones (Detailed List block) */}
      <div className="bg-[#0b0f19] border border-slate-805 p-6 rounded-3xl space-y-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4.5 h-4.5 text-rose-500" />
            <span className="text-xs font-bold font-mono text-rose-500 uppercase tracking-wider">Identified high safety liability threats</span>
          </div>
          <h3 className="text-base font-black font-display text-white uppercase">Critical Safety High Risk Zones Registry (Risk Score &gt;= 70)</h3>
          <p className="text-xs text-slate-400">
            High priority citizen alarms requiring direct dispatch loop check. Directly managed by your municipal command center.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {highRiskZonesList.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-slate-500">No active high risk incidents registered.</div>
          ) : (
            highRiskZonesList.slice(0, 6).map((c) => (
              <div 
                key={c.id}
                onClick={() => onSelectComplaint?.(c.id)}
                className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-slate-750 transition cursor-pointer flex flex-col justify-between space-y-3 relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-amber-500 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                      ID: {c.id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {c.date}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase">{c.issueType}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{c.location}</span>
                    </p>
                  </div>

                  <p className="text-[11.5px] text-slate-350 line-clamp-2 leading-relaxed font-sans text-slate-300">
                    {c.description}
                  </p>
                </div>

                <div className="border-t border-slate-900 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-550 font-mono text-slate-400">
                    <span className="font-bold text-rose-500">{c.riskScore}</span>
                    <span>Risk Index</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase group-hover:text-amber-400 transition">
                    Inspect Panel
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
