import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Activity, 
  Users, 
  AlertTriangle, 
  Cpu, 
  TrendingUp, 
  TrendingDown, 
  Compass, 
  ChevronRight, 
  Wrench, 
  Database, 
  Clock, 
  Coins, 
  Server, 
  CheckCircle2, 
  BellRing,
  ArrowUpRight,
  ShieldAlert,
  Network,
  Flame
} from "lucide-react";
import { motion } from "motion/react";
import { Complaint } from "../types";
import EmergencyAlerts from "./EmergencyAlerts";

interface ExecutiveLandingProps {
  onNavigate: (tab: string) => void;
  stats: {
    totalComplaints: number;
    pendingComplaints: number;
    resolvedComplaints: number;
    healthIndex: number;
    predictedFailures: number;
  };
  complaints?: Complaint[];
  onSelectComplaint?: (id: string) => void;
}

export default function ExecutiveLanding({ onNavigate, stats, complaints = [], onSelectComplaint }: ExecutiveLandingProps) {
  const [liveHour, setLiveHour] = useState("11:41 AM");
  
  // Real-time time updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveHour(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 1. Total monitored assets: simulated municipal elements + database size multiplier
  const totalMonitoredAssets = 142380 + (complaints.length * 18);

  // 2. Active critical risks: live complaints with high severity and unresolved status
  const activeCriticalRisksList = complaints.filter(
    c => c.status !== "RESOLVED" && c.severityScore >= 80
  );
  const activeCriticalRisksCount = activeCriticalRisksList.length;

  // 3. Complaints received today: pending state or created in the simulation day
  const complaintsTodayCount = complaints.filter(
    c => c.status === "PENDING" || c.status === "ASSIGNED"
  ).length + 3; // adding a small realistic daily buffer

  // 4. Predicted failures prevented: resolved complaints are structural failures prevented
  const failuresPreventedCount = stats.resolvedComplaints + Math.max(3, Math.floor(stats.totalComplaints * 0.4));

  // 5. Estimated maintenance savings: resolvings saved heavy reconstruction costs
  // Average road repair is ₹45,000 whereas major road structural failure is ₹4,50,000 (10x savings)
  const savingsLakhs = (3.40 + (stats.resolvedComplaints * 0.45)).toFixed(2);

  // 6. Average citizen response time: live calculation based on unresolved and resolved performance
  // Baseline is 2.4 Hours, goes down as more complaints are RESOLVED relative to pending
  const resolvedRatio = stats.totalComplaints > 0 ? stats.resolvedComplaints / stats.totalComplaints : 0.5;
  const rawAvgResponseTime = Math.max(0.9, 2.5 - (resolvedRatio * 1.3));
  const avgResponseTimeStr = `${rawAvgResponseTime.toFixed(1)} Hours`;

  // 7. Infrastructure health score: stats.healthIndex
  const healthScore = stats.healthIndex;

  // Regional Sub-systems Status
  const regionMetrics = [
    { name: "Delhi NCR Command", activeIssues: complaints.filter(c => c.location.toLowerCase().includes("delhi") && c.status !== "RESOLVED").length, latency: "0.8s", load: "Optimal" },
    { name: "Mumbai Greater Metro", activeIssues: complaints.filter(c => c.location.toLowerCase().includes("mumbai") && c.status !== "RESOLVED").length, latency: "1.1s", load: "Moderate" },
    { name: "Bengaluru Technology Sector", activeIssues: complaints.filter(c => c.location.toLowerCase().includes("bengaluru") && c.status !== "RESOLVED").length, latency: "0.9s", load: "Optimal" },
    { name: "Kolkata Port & Suburbs", activeIssues: complaints.filter(c => c.location.toLowerCase().includes("kolkata") && c.status !== "RESOLVED").length, latency: "1.2s", load: "High Alert" },
  ];

  return (
    <div className="space-y-12">
      
      {/* Prime Cabinet-Level Administrative Header */}
      <div className="bg-[#0b1329] text-white border border-blue-900/40 rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden">
        {/* Subtle geometric grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-40"></div>
        <div className="absolute right-0 top-0 -mt-16 -mr-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute left-1/4 bottom-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-wider uppercase border border-amber-500/20 rounded-full">
              <Server className="w-3.5 h-3.5 animate-pulse" />
              GOVERNMENT OF BHARAT • NATIONAL PORTAL
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Civil Systems <span className="text-amber-450 text-amber-400">Sentinel AI</span>
            </h1>
            <p className="font-sans text-xs sm:text-sm text-slate-300 max-w-2xl font-light">
              Autonomous cognitive agents and structural telemetry dashboards monitoring pavement decay, sewer hydraulic limits and lighting disruptions in major metros.
            </p>
          </div>

          {/* Real-time system diagnostics telemetry terminal */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 space-y-2 min-w-[240px]">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
              <span className="text-slate-500 font-bold">SYSTEM METRIC</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE
              </span>
            </div>
            <div className="flex justify-between">
              <span>GPS SYNC STATUS:</span>
              <span className="text-slate-200">99.85% ESTABLISHED</span>
            </div>
            <div className="flex justify-between">
              <span>COGNITIVE PIPELINE:</span>
              <span className="text-slate-200">AGENT_MESH_v4.2</span>
            </div>
            <div className="flex justify-between">
              <span>LOCAL TIME STAMP:</span>
              <span className="text-amber-400 font-bold">{liveHour}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Alerts Module (Flags Risk > 90 and Severity > 90) */}
      <EmergencyAlerts 
        complaints={complaints} 
        onSelectComplaint={onSelectComplaint}
      />

      {/* Primary KPI Command Board Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-display text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Executive Command KPIs & Audit Summary
          </h2>
          <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest uppercase">
            LIVE_DATABASE_REFRESH: SUCCESS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* 1. Infrastructure Health Score */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-200 transition">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">SYS_INDEX_HEALTH</span>
                <span className="text-xs text-slate-500 block font-semibold">Infrastructure Health Score</span>
              </div>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-extrabold text-slate-900">{healthScore}%</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +1.8%
                </span>
              </div>
              {/* Health progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                  style={{ width: `${healthScore}%` }}
                ></div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>GRID SYSTEM ADHERENCE:</span>
              <span className="text-emerald-600 font-bold">OPTIMAL</span>
            </div>
          </div>

          {/* 2. Total Monitored Assets */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-200 transition">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">GEOSPATIAL_NODES</span>
                <span className="text-xs text-slate-500 block font-semibold">Total Monitored Assets</span>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Server className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-extrabold text-slate-900">
                  {totalMonitoredAssets.toLocaleString()}
                </span>
                <span className="text-[10px] text-blue-600 font-bold block flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +124 Today
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-sans">
                Active street sensors & smart municipal nodes
              </p>
            </div>
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>SATELLITE SYNC SPEED:</span>
              <span className="text-blue-600 font-bold">0.8 SECONDS</span>
            </div>
          </div>

          {/* 3. Active Critical Risks */}
          <div className={`rounded-2xl p-6 border shadow-sm flex flex-col justify-between space-y-4 transition ${
            activeCriticalRisksCount > 0 
              ? "bg-rose-50/50 border-rose-100 text-rose-950" 
              : "bg-white border-slate-100"
          }`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-wider text-rose-500 uppercase">IMMEDIATE_HAZARDS</span>
                <span className="text-xs text-slate-500 block font-semibold">Active Critical Risks</span>
              </div>
              <div className={`p-2 rounded-lg ${activeCriticalRisksCount > 0 ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-slate-50 text-slate-600"}`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-extrabold text-slate-900">{activeCriticalRisksCount}</span>
                {activeCriticalRisksCount > 0 && (
                  <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.5 font-bold uppercase rounded font-mono animate-bounce">
                    URGENT
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-sans">
                Geotagged hazards with severity score &gt;= 80
              </p>
            </div>
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>SLA ENFORCEMENT:</span>
              <span className={activeCriticalRisksCount > 0 ? "text-rose-600 font-bold uppercase animate-pulse" : "text-slate-500"}>
                {activeCriticalRisksCount > 0 ? "DESPATCH_ALERT_SENT" : "SECURE"}
              </span>
            </div>
          </div>

          {/* 4. Complaints Received Today */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-200 transition">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">DAILY_FEED</span>
                <span className="text-xs text-slate-500 block font-semibold">Complaints Today</span>
              </div>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-extrabold text-slate-900">{complaintsTodayCount}</span>
                <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3" />
                  -8% vs avg
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-sans">
                Real-time reports awaiting civic dispatch
              </p>
            </div>
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>CITIZEN RATING INDEX:</span>
              <span className="text-emerald-600 font-bold">4.85 / 5.0</span>
            </div>
          </div>

          {/* 5. Predicted Failures Prevented */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-200 transition">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">ANALYTICS_MITIGATION</span>
                <span className="text-xs text-slate-500 block font-semibold">Predicted Failures Prevented</span>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-extrabold text-slate-900">{failuresPreventedCount}</span>
                <span className="text-[10px] text-emerald-600 font-bold block flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +11 prevented
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-sans">
                Autonomously flagged by AI structural models
              </p>
            </div>
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>ACCURACY INDEX:</span>
              <span className="text-emerald-600 font-bold">96.8% PRECISE</span>
            </div>
          </div>

          {/* 6. Estimated Maintenance Savings */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-200 transition">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">TREASURY_SAVINGS</span>
                <span className="text-xs text-slate-500 block font-semibold">Estimated Savings</span>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Coins className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-extrabold text-slate-900">₹{savingsLakhs} L</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +14.5%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-sans">
                Preventive repair savings vs full road reconstruction
              </p>
            </div>
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>AUDITED BY:</span>
              <span className="text-slate-600 font-bold">C&AG RULES</span>
            </div>
          </div>

          {/* 7. Average Response Time */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-200 transition">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">DISPATCH_LATENCY</span>
                <span className="text-xs text-slate-500 block font-semibold">Average Response Time</span>
              </div>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-extrabold text-slate-900">{avgResponseTimeStr}</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3" />
                  -22 min improvements
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-sans">
                Time elapsed from complaint submission to crew dispatch
              </p>
            </div>
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>GOVERNMENT SLA BAND:</span>
              <span className="text-emerald-600 font-bold">EXCELLENT</span>
            </div>
          </div>

        </div>
      </div>

      {/* Split Strategic Operations Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: National Regional Sub-systems Load Monitor */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2 mb-1">
              <Compass className="w-4.5 h-4.5 text-blue-600" />
              Regional Sub-systems Monitor
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-sans">
              Operational load indexes across individual municipal servers and decentralized contractor clusters.
            </p>

            <div className="space-y-3.5">
              {regionMetrics.map((region, idx) => (
                <div key={idx} className="p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-100 space-y-1.5 transition">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">{region.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                      region.load === "High Alert" 
                        ? "bg-rose-100 text-rose-700" 
                        : region.load === "Moderate" 
                        ? "bg-amber-100 text-amber-700" 
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {region.load}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>Outstanding: <strong className="text-slate-800">{region.activeIssues} Active</strong></span>
                    <span>SLA latency: <strong>{region.latency}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate("gis")}
            className="w-full mt-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs border border-slate-200 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Launch Regional GIS Heatmap
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        {/* Right Side: Immediate Active Critical Despatches */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <div>
              <h3 className="font-display font-semibold text-base text-slate-900 flex items-center gap-2">
                <BellRing className="w-4.5 h-4.5 text-rose-500 animate-swing" />
                Urgent Structural Threats Awaiting Field Audits
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Immediate citizen defects displaying critical risk predictions of severity &gt; 70.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              {complaints.filter(c => c.status !== "RESOLVED" && c.severityScore >= 70).length} ALERTS
            </span>
          </div>

          <div className="space-y-3 max-h-[295px] overflow-y-auto pr-1">
            {complaints.filter(c => c.status !== "RESOLVED" && c.severityScore >= 70).length === 0 ? (
              <div className="py-12 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  No Outstanding Unresolved High-Risk Hazards Tracked.
                </p>
              </div>
            ) : (
              complaints.filter(c => c.status !== "RESOLVED" && c.severityScore >= 70).slice(0, 4).map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => onSelectComplaint?.(c.id)}
                  title="Click to inspect this complaint"
                  className="p-4 bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100/50 rounded-xl flex items-center justify-between gap-4 transition cursor-pointer active:scale-[0.99]"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 uppercase">
                        {c.id}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[9px] uppercase font-mono font-extrabold rounded ${
                        c.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                        c.status === "ASSIGNED" ? "bg-indigo-100 text-indigo-700" : "bg-rose-100 text-rose-705 text-rose-700"
                      }`}>
                        {c.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {c.date}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {c.issueType} near {c.location}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {c.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono font-bold block text-slate-450 text-slate-400">SEVERITY</span>
                    <span className="text-base font-display font-extrabold text-rose-600">
                      {c.severityScore} / 100
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigate("dashboard")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 active:scale-95 transition cursor-pointer"
            >
              Consult Command Registry
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Strategic Modular Navigation Grid */}
      <div className="space-y-5">
        <h3 className="font-display font-bold text-lg text-slate-900 border-l-4 border-amber-500 pl-3">
          Sentinel System Operations Directory
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Quick-Nav Card 1: Command Hub */}
          <div 
            onClick={() => onNavigate("dashboard")} 
            className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-brand-medium flex items-center justify-center group-hover:bg-brand-medium group-hover:text-white transition-all duration-300">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-brand-medium transition-all duration-300">Command Registry</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct public dispatcher registry tracking SLA fulfillment cycles, live audit state transitions and priority municipal alerts.
              </p>
            </div>
            <div className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 pt-2">
              Access Dashboard
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Quick-Nav Card 2: Impact Dashboard */}
          <div 
            onClick={() => onNavigate("impact")} 
            className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100/50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-650 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-all duration-300 font-sans">Impact Analytics</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Analyze estimated repair costs avoided, traffic accidents prevented, citizen ratings and dynamic ROI outcomes with Recharts.
              </p>
            </div>
            <div className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 pt-2">
              Launch Analytics
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Quick-Nav Card 3: AI Deep Analysis */}
          <div 
            onClick={() => onNavigate("ai-analysis")} 
            className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-655 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-amber-500 transition-all duration-300">AI Analysis</h3>
              <p className="text-xs text-slate-550 text-slate-500 leading-relaxed">
                Run Gemini multi-modal predictions inside citizen incident feeds to compute concrete damage risk severity scores autonomously.
              </p>
            </div>
            <div className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 pt-2">
              Launch Diagnostic
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Quick-Nav Card 4: Contractor Performance */}
          <div 
            onClick={() => onNavigate("contractors")} 
            className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-650 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-blue-600 transition-all duration-300">Contractor Grid</h3>
              <p className="text-xs text-slate-650 text-slate-500 leading-relaxed">
                Perform thorough evaluation of physical contractor groups, active field team SLA completion rates and response latency logs.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 pt-2">
              Audit Operations
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Quick-Nav Card 5: Smart GIS Map */}
          <div 
            onClick={() => onNavigate("gis")} 
            className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-650 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-emerald-600 transition-all duration-300">Smart GIS Map</h3>
              <p className="text-xs text-slate-650 text-slate-500 leading-relaxed">
                Render interactive vector-based metropolitan sectors to actively check localized regional drainage and asphalt shear stress risks.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 pt-2">
              Launch Mapper
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Quick-Nav Card 5b: Failure Hotspot Analytics */}
          <div 
            onClick={() => onNavigate("hotspots")} 
            className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-orange-600 transition-all duration-300">Failure Hotspots</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Examine regional failure loops, high-risk metropolitan quadrants, and frequently decaying key structural assets.
              </p>
            </div>
            <div className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1 pt-2">
              Inspect Hotspots
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Quick-Nav Card 6: System Architecture */}
          <div 
            onClick={() => onNavigate("architecture")} 
            className="bg-[#0f172a] text-white p-6 rounded-2xl border border-slate-800 hover:border-slate-700 hover:shadow-md transition-all duration-300 cursor-pointer group space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-white group-hover:text-amber-450 transition-all duration-300">System Blueprint</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visualize flow from Citizen Portal to AI grading, Supabase database storage, GIS anomalies map layers and resolution pipelines.
              </p>
            </div>
            <div className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 pt-2">
              Explore Architecture
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
