import React, { useState, useEffect } from "react";
import { Complaint } from "./types";
import {
  ShieldAlert,
  LayoutDashboard,
  Cpu,
  Smartphone,
  TrendingUp,
  Map,
  ShieldCheck,
  Menu,
  X,
  Activity,
  HeartPulse,
  Wrench,
  Database,
  Wifi,
  WifiOff,
  Loader2,
  Coins,
  Network,
  Flame,
  Settings,
  Globe
} from "lucide-react";
import ExecutiveLanding from "./components/ExecutiveLanding";
import CitizenReporting from "./components/CitizenReporting";
import AiAnalysis from "./components/AiAnalysis";
import CommandDashboard from "./components/CommandDashboard";
import PredictiveAnalytics from "./components/PredictiveAnalytics";
import GisMap from "./components/GisMap";
import ContractorDashboard from "./components/ContractorDashboard";
import ImpactDashboard from "./components/ImpactDashboard";
import SystemArchitecture from "./components/SystemArchitecture";
import FailureHotspotAnalytics from "./components/FailureHotspotAnalytics";
import SystemAdministration from "./components/SystemAdministration";
import NationalCommandCenter from "./components/NationalCommandCenter";
import { supabase } from "./supabase";
import { INITIAL_COMPLAINTS, DEMO_COMPLAINTS } from "./mockData";
import { getDepartmentForIssue } from "./utils";
import ComplaintInspectorDrawer from "./components/ComplaintInspectorDrawer";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [isDemoActive, setIsDemoActive] = useState<boolean>(true);
  const [supabaseComplaints, setSupabaseComplaints] = useState<Complaint[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>(DEMO_COMPLAINTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [dbMode, setDbMode] = useState<"live" | "demo">("demo");
  const [dbError, setDbError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<"LIVE" | "RECONNECTING" | "OFFLINE">("OFFLINE");
  const [updatingDashboard, setUpdatingDashboard] = useState<boolean>(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  const handleStatusUpdatedInDrawer = (id: string, newStatus: Complaint["status"], resolutionNotes?: string) => {
    // Sync active state arrays
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus, resolutionNotes: resolutionNotes || "" } : c));
    setSupabaseComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus, resolutionNotes: resolutionNotes || "" } : c));
  };

  // Load complaints from Supabase on startup
  const fetchComplaints = async () => {
    try {
      console.log("[DATABASE FETCH] Fetching complaints from Supabase complaints table...");
      const { data, error } = await supabase
        .from("complaints")
        .select("*");

      if (error) {
        console.error("[DATABASE FETCH] Supabase select error:", error);
        throw error;
      }

      console.log("[DATABASE FETCH] Supabase rows fetched count:", data ? data.length : 0);

      let formatted: Complaint[] = [];
      if (data && data.length > 0) {
        // Sort in JS to prevent query crashes if "date" or "created_at" column is missing
        const sortedData = [...data].sort((a: any, b: any) => {
          const dateA = a.created_at || a.date || "";
          const dateB = b.created_at || b.date || "";
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        formatted = sortedData.map((item: any) => {
          const matchedType = item.issue_type || item.issueType || "Potholes";
          return {
            id: String(item.id || `COMP-${Math.floor(100 + Math.random() * 900)}`),
            citizenName: item.citizen_name || item.citizenName || "Anonymous Citizen",
            issueType: matchedType,
            severityScore: Number(item.severity) || Number(item.severityScore) || 50,
            riskScore: Number(item.risk_score) || Number(item.riskScore) || 50,
            description: item.description || "",
            location: item.location || "Unknown Location, India",
            date: item.date || (item.created_at ? item.created_at.split("T")[0] : new Date().toISOString().split("T")[0]),
            status: item.status || "PENDING",
            latitude: Number(item.latitude) || 28.6139,
            longitude: Number(item.longitude) || 77.2090,
            department: getDepartmentForIssue(matchedType),
            failureMode: item.failure_mode || item.failureMode || "Pavement fatigue degradation",
            remedialAction: item.remedial_action || item.remedialAction || "Inspection scheduled.",
            dangers: Array.isArray(item.dangers) 
              ? item.dangers 
              : typeof item.dangers === "string" 
              ? JSON.parse(item.dangers) 
              : [
                  "Localized traffic congestion",
                  "Safety risks for transit vehicles"
                ],
            highlightRegions: Array.isArray(item.highlight_regions)
              ? item.highlight_regions
              : Array.isArray(item.highlightRegions)
              ? item.highlightRegions
              : typeof (item.highlight_regions || item.highlightRegions) === "string"
              ? JSON.parse(item.highlight_regions || item.highlightRegions)
              : [
                  { x: 50, y: 50, label: "Indicated Defect Zone" }
                ],
            imageUrl: item.image_url || item.imageUrl || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800",
            priority: item.priority || (Number(item.severity) >= 80 ? "Critical" : "Medium"),
            resolutionNotes: item.resolution_notes || item.resolutionNotes || ""
          };
        });

        setSupabaseComplaints(formatted);
        setDbMode("live");
        setDbError(null);
      } else {
        // If table is empty, attempt to seed with default mock complaints so it has high-fidelity data
        console.log("[DATABASE FETCH] Supabase complaints table returned empty results. Seeding default complaints...");
        const seedRows = INITIAL_COMPLAINTS.map(c => ({
          issue_type: c.issueType,
          severity: c.severityScore,
          description: c.description,
          latitude: c.latitude,
          longitude: c.longitude,
          image_url: c.imageUrl,
          status: c.status,
          risk_score: c.riskScore,
          department: getDepartmentForIssue(c.issueType)
        }));

        const { error: seedErr } = await supabase.from("complaints").insert(seedRows);
        if (seedErr) {
          console.warn("[DATABASE FETCH] Could not write automatic seeds to Supabase:", seedErr.message);
        }
        
        const mappedInitial = INITIAL_COMPLAINTS.map(c => ({
          ...c,
          department: getDepartmentForIssue(c.issueType)
        }));
        formatted = mappedInitial;
        setSupabaseComplaints(mappedInitial);
        setDbMode("live");
      }

      // If Demo Mode is NOT active, update our active complaints state
      if (!isDemoActive) {
        setComplaints(formatted.length > 0 ? formatted.map(c => ({ ...c, department: getDepartmentForIssue(c.issueType) })) : INITIAL_COMPLAINTS.map(c => ({ ...c, department: getDepartmentForIssue(c.issueType) })));
      }
    } catch (err: any) {
      console.warn("[DATABASE FETCH] Supabase database fetch error, entering Simulation mode:", err?.message || err);
      setDbError(err?.message || String(err));
      
      const mappedInitial = INITIAL_COMPLAINTS.map(c => ({
        ...c,
        department: getDepartmentForIssue(c.issueType)
      }));
      setSupabaseComplaints(mappedInitial);
      setDbMode("demo");
      if (!isDemoActive) {
        setComplaints(mappedInitial);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDemo = (enabled: boolean) => {
    setIsDemoActive(enabled);
    if (enabled) {
      setComplaints(DEMO_COMPLAINTS.map(c => ({ ...c, department: getDepartmentForIssue(c.issueType) })));
    } else {
      const activeData = supabaseComplaints.length > 0 ? supabaseComplaints : INITIAL_COMPLAINTS;
      setComplaints(activeData.map(c => ({ ...c, department: getDepartmentForIssue(c.issueType) })));
    }
  };

  // Manage Supabase Realtime subscription (INSERT, UPDATE, DELETE)
  useEffect(() => {
    // Initial fetch
    fetchComplaints();

    console.log("[REALTIME] Initializing Supabase Realtime subscription on complaints table...");
    setRealtimeStatus("RECONNECTING");

    const channel = supabase
      .channel("complaints-realtime-channel")
      .on(
        "postgres_changes",
        {
          event: "*", // Subscribes to insert, update, and delete events
          schema: "public",
          table: "complaints"
        },
        (payload) => {
          console.log("[REALTIME] Change event detected (INSERT/UPDATE/DELETE). Payload:", payload);
          // Refresh dashboard metrics, incident registry, and charts immediately
          fetchComplaints();
        }
      )
      .subscribe((status, err) => {
        console.log(`[REALTIME] Subscription status transition: ${status}`, err || "");
        if (status === "SUBSCRIBED") {
          setRealtimeStatus("LIVE");
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setRealtimeStatus("OFFLINE");
        } else {
          setRealtimeStatus("RECONNECTING");
        }
      });

    return () => {
      console.log("[REALTIME] Tearing down realtime channel connection...");
      supabase.removeChannel(channel).catch((err) => {
        console.warn("[REALTIME] Failed to remove channel gracefully:", err);
      });
    };
  }, []);

  // Maintain fallback polling every 30 seconds if realtime connection drops or is not live
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (realtimeStatus !== "LIVE") {
      console.log("[REALTIME FALLBACK] Realtime is offline/reconnecting, scheduling 30s fallback poll interval.");
      interval = setInterval(() => {
        console.log("[REALTIME FALLBACK] Running 30s background fetch sync...");
        fetchComplaints();
      }, 30000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [realtimeStatus]);

  // Update status callback from Command center registry
  const handleUpdateStatus = async (id: string, nextStatus: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED") => {
    setUpdatingDashboard(true);
    try {
      if (dbMode === "live" && !isDemoActive) {
        const { error } = await supabase
          .from("complaints")
          .update({ status: nextStatus })
          .eq("id", id);
        if (error) throw error;
      }
      
      // Optimistic state refresh
      setComplaints(prev => {
        return prev.map(c => c.id === id ? { ...c, status: nextStatus } : c);
      });
    } catch (err) {
      console.error("Failed to alter remote state in Supabase:", err);
      // Optimistic state refresh regardless
      setComplaints(prev => {
        return prev.map(c => c.id === id ? { ...c, status: nextStatus } : c);
      });
    } finally {
      // Short delay to give professional visual rhythm
      setTimeout(() => {
        setUpdatingDashboard(false);
      }, 700);
    }
  };

  // Compile dynamic stats
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === "PENDING").length;
  const resolvedComplaints = complaints.filter(c => c.status === "RESOLVED").length;
  const predictedFailures = complaints.filter(c => c.riskScore > 75).length;
  
  // Dynamic health index: high severity open complaints degrade overall score index
  const openCriticalCount = complaints.filter(c => c.status !== "RESOLVED" && c.severityScore >= 80).length;
  const healthIndex = Math.max(55, Math.min(100, 88 - (openCriticalCount * 4)));

  const stats = {
    totalComplaints,
    pendingComplaints,
    resolvedComplaints,
    healthIndex,
    predictedFailures
  };

  // Sidebar item helper configuration
  const menuItems = [
    { id: "landing", label: "Executive Summary", icon: ShieldCheck },
    { id: "national-command", label: "National Command Center", icon: Globe },
    { id: "dashboard", label: "Command Dashboard", icon: LayoutDashboard },
    { id: "impact", label: "Impact Dashboard", icon: Coins },
    { id: "ai-analysis", label: "AI Analysis Center", icon: Cpu },
    { id: "contractors", label: "Contractor Performance", icon: Wrench },
    { id: "citizen", label: "Citizen Incident Portal", icon: Smartphone },
    { id: "predictive", label: "Predictive Analytics", icon: TrendingUp },
    { id: "hotspots", label: "Failure Hotspots", icon: Flame },
    { id: "gis", label: "Smart GIS Map Page", icon: Map },
    { id: "architecture", label: "System Architecture", icon: Network },
    { id: "admin", label: "System Administration", icon: Settings }
  ];

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="main-scaffold" className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row text-slate-800 antialiased font-sans">
      
      {/* Mobile Top Header Navigation */}
      <header className="lg:hidden bg-brand-deep text-white px-6 py-4 flex items-center justify-between border-b border-blue-900/40 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span className="font-display font-bold text-sm tracking-tight uppercase">Bharat Infra Sentinel AI</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded-md text-blue-100 hover:text-white hover:bg-blue-950 focus:outline-none transition cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Slide-out Mobile Menu overlay panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-35 transition" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-72 bg-gradient-to-b from-brand-deep to-brand-primary h-full p-6 space-y-6 flex flex-col justify-between border-r border-blue-800 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-blue-800/40 pb-4">
                <ShieldAlert className="w-6 h-6 text-amber-400" />
                <span className="font-display font-medium text-xs tracking-wider uppercase text-amber-400">Governance Portal</span>
              </div>

              {/* Judges Sandbox Mobile Widget */}
              <div className="bg-blue-955 bg-indigo-950/40 p-4 rounded-xl border border-blue-900/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-blue-300 font-bold uppercase tracking-wide">Judges' Sandbox</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isDemoActive ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`}></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200">Demo Mode</span>
                  <button
                    onClick={() => handleToggleDemo(!isDemoActive)}
                    className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${isDemoActive ? "bg-amber-400" : "bg-slate-700"}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 transition duration-200 ${isDemoActive ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer ${
                        activeTab === item.id
                          ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/10"
                          : "text-blue-100 hover:bg-blue-900/50 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-blue-800/40 pt-4 space-y-2 font-mono text-[9px] text-blue-300">
              <div>SYS_NODE: REGIONAL_DELHI_02</div>
              <div className="flex items-center justify-between">
                <span>REALTIME:</span>
                <span>
                  {realtimeStatus === "LIVE" && <span className="text-emerald-400">🟢 LIVE</span>}
                  {realtimeStatus === "RECONNECTING" && <span className="text-amber-400">🟡 RECONNECTING</span>}
                  {realtimeStatus === "OFFLINE" && <span className="text-rose-500">🔴 OFFLINE</span>}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>DATABASE:</span>
                <span className="uppercase">SUPABASE_{dbMode}</span>
              </div>
              <div>METRO_INTAKE: ONLINE</div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar (Left Drawer Layout) */}
      <aside className="hidden lg:flex w-72 bg-gradient-to-b from-brand-deep to-brand-primary text-white flex-col justify-between p-6 border-r border-blue-900/40 sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        <div className="space-y-8">
          
          {/* Brand/Launcher identity */}
          <div className="flex items-start gap-3 border-b border-blue-800/40 pb-6">
            <div className="p-2.5 bg-amber-400 text-brand-deep rounded-xl shadow-lg shadow-amber-400/10">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-sm leading-tight text-white uppercase tracking-wider">Bharat Infra</h1>
              <span className="text-[10px] font-bold font-mono text-amber-450 text-amber-400 tracking-widest block uppercase mt-0.5">Sentinel AI System</span>
            </div>
          </div>

          {/* Judges Sandbox Control Widget */}
          <div className="bg-slate-950/45 p-4 rounded-2xl border border-blue-800/40 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono text-blue-300 tracking-wider uppercase">Judges' Sandbox</span>
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDemoActive ? "bg-amber-400" : "bg-emerald-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isDemoActive ? "bg-amber-500" : "bg-emerald-500"}`}></span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold leading-tight text-slate-200">
                {isDemoActive ? "Demo Mode" : "Live DB Mode"}
              </div>
              <button
                onClick={() => handleToggleDemo(!isDemoActive)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isDemoActive ? "bg-amber-400" : "bg-slate-700"}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${isDemoActive ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
            <p className="text-[9px] text-blue-300 leading-normal">
              {isDemoActive 
                ? "Showing 11 high-fidelity municipal defects, active GIS live map layers, financial analytics & AI parameters." 
                : "Directly fetching real-time citizen feed from Supabase DB tables."}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition cursor-pointer ${
                    activeTab === item.id
                      ? "bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/15"
                      : "text-blue-200 hover:bg-blue-950/70 hover:text-white"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Telemetry Status Footer Panel */}
        <div className="border-t border-blue-800/40 pt-6 space-y-3 font-mono text-[9px] text-blue-300 leading-normal">
          <div className="flex items-center justify-between bg-blue-950/50 px-3 py-2 rounded-lg border border-blue-800/30">
            <span className="uppercase">DB: SUPABASE_{dbMode}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${dbMode === "live" ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`}></span>
          </div>
          <div className="flex items-center justify-between bg-blue-950/50 px-3 py-2 rounded-lg border border-blue-800/30">
            <span>REALTIME LINK:</span>
            <span className="font-bold">
              {realtimeStatus === "LIVE" && <span className="text-emerald-400 animate-pulse">🟢 LIVE</span>}
              {realtimeStatus === "RECONNECTING" && <span className="text-amber-400 animate-bounce">🟡 RECONNECTING</span>}
              {realtimeStatus === "OFFLINE" && <span className="text-rose-500 animate-pulse">🔴 OFFLINE</span>}
            </span>
          </div>
          {dbError && (
            <div className="text-[8px] text-amber-500/80 max-w-full truncate px-1" title={dbError}>
              ERR: {dbError}
            </div>
          )}
          <div className="space-y-0.5 px-1 opacity-70">
            <div>SECURE CORE SENSOR FUSION</div>
            <div>MONSOON PREDICTIONS ENG_V2</div>
          </div>
        </div>
      </aside>

      {/* Main Content Stage View Area */}
      <main className="flex-grow p-6 sm:p-8 overflow-x-hidden max-w-7xl mx-auto w-full relative">
        
        {/* Persistent Judges Sandbox Banner/Alert */}
        <div className={`mb-8 p-5 rounded-3xl border transition-all duration-300 ${isDemoActive ? "bg-amber-500/10 border-amber-500/25 text-amber-300 shadow-lg shadow-amber-500/5 hover:border-amber-500/40" : "bg-[#0f172a] border-slate-800 text-slate-300 shadow-md"}`}>
          <div className="flex flex-col xl:flex-row items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className={`p-2.5 rounded-2xl ${isDemoActive ? "bg-amber-400/15 text-amber-400" : "bg-slate-800 text-slate-400"} flex-shrink-0 mt-0.5`}>
                <Database className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                    {isDemoActive ? "Governance Sandbox: Simulator Live" : "Direct Core Backend Operations Mode"}
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase font-mono ${isDemoActive ? "bg-amber-400 text-slate-950 animate-pulse" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"}`}>
                    {isDemoActive ? "Rich Simulator active" : "Supabase Live Tables Feed"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
                  {isDemoActive 
                    ? "Currently visualizing 11 high-fidelity municipal failures across major Indian metros, including complete GIS coordinates, smart severity metrics, preventative AI-graded risks, and simulated capital ROI. Toggle 'Live DB' to connect to pure Supabase database rows."
                    : "Direct active pipeline stream from your PostgreSQL database. Switch back to Demo Mode any time to restore comprehensive multi-city mock overlays for presentations."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 flex-shrink-0 w-full xl:w-auto justify-end border-t border-slate-800/45 xl:border-transparent pt-4 xl:pt-0">
              <span className="text-xs font-semibold font-mono text-slate-400 uppercase hidden sm:inline">Presentation Mode:</span>
              <div className="bg-slate-950/90 p-1 rounded-2xl border border-slate-800/50 flex items-center shadow-2xl">
                <button
                  onClick={() => handleToggleDemo(true)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isDemoActive ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/25" : "text-slate-400 hover:text-white"}`}
                >
                  Enabled (Rich Demo)
                </button>
                <button
                  onClick={() => handleToggleDemo(false)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${!isDemoActive ? "bg-slate-800 text-white border border-slate-700/60" : "text-slate-400 hover:text-white"}`}
                >
                  Live DB Feed
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating progress toasts for state syncs */}
        {updatingDashboard && (
          <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-750 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Updating dashboard...
            </span>
          </div>
        )}

        {loading ? (
          <div className="space-y-8 animate-pulse text-slate-800">
            {/* Top row description block skeleton */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2.5 w-full md:w-2/3">
                <div className="h-6 bg-slate-200 rounded-md w-1/3"></div>
                <div className="h-4 bg-slate-100 rounded-md w-full"></div>
              </div>
              <div className="h-10 bg-slate-100 rounded-xl w-32 hidden md:block animate-pulse"></div>
            </div>

            {/* Dashboard metrics grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="h-3.5 bg-slate-200 rounded-md w-1/2"></div>
                    <div className="h-6 bg-slate-200 rounded-md w-1/3"></div>
                    <div className="h-2 bg-slate-100 rounded-full w-4/5"></div>
                  </div>
                  <div className="w-11 h-11 bg-slate-100 rounded-xl"></div>
                </div>
              ))}
            </div>

            {/* Split layout list & graph skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="h-5 bg-slate-200 rounded-md w-1/2"></div>
                <div className="space-y-3 pt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                      <div className="flex justify-between">
                        <div className="h-3.5 bg-slate-200 rounded-md w-1/3"></div>
                        <div className="h-3 bg-slate-100 rounded-md w-12"></div>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-md w-4/5"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-slate-200 rounded-md w-1/3"></div>
                  <div className="h-4 bg-slate-150 rounded-md w-16"></div>
                </div>
                <div className="h-64 bg-gradient-to-b from-slate-50 to-slate-100/30 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-3">
                    Synchronizing real-time analytics stream...
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Direct dynamic routing views switcher */}
            {activeTab === "landing" && (
              <ExecutiveLanding 
                onNavigate={handleNavigate} 
                stats={stats} 
                complaints={complaints} 
                onSelectComplaint={(id) => setSelectedComplaintId(id)}
              />
            )}
            {activeTab === "national-command" && (
              <NationalCommandCenter complaints={complaints} />
            )}
            {activeTab === "citizen" && (
              <CitizenReporting onComplaintSubmitted={fetchComplaints} />
            )}
            {activeTab === "ai-analysis" && (
              <AiAnalysis 
                complaints={complaints}
                onSelectComplaint={(id) => setSelectedComplaintId(id)}
              />
            )}
            {activeTab === "contractors" && (
              <ContractorDashboard 
                complaints={complaints}
                onSelectComplaint={(id) => setSelectedComplaintId(id)}
              />
            )}
            {activeTab === "dashboard" && (
              <CommandDashboard
                complaints={complaints}
                onUpdateStatus={handleUpdateStatus}
                stats={stats}
                onSelectComplaint={(id) => setSelectedComplaintId(id)}
              />
            )}
            {activeTab === "predictive" && (
              <PredictiveAnalytics complaints={complaints} isDemoMode={isDemoActive} />
            )}
            {activeTab === "hotspots" && (
              <FailureHotspotAnalytics 
                complaints={complaints}
                onSelectComplaint={(id) => setSelectedComplaintId(id)}
              />
            )}
            {activeTab === "gis" && (
              <GisMap 
                complaints={complaints}
                onSelectComplaint={(id) => setSelectedComplaintId(id)}
              />
            )}
            {activeTab === "impact" && (
              <ImpactDashboard complaints={complaints} />
            )}
            {activeTab === "architecture" && (
              <SystemArchitecture />
            )}
            {activeTab === "admin" && (
              <SystemAdministration 
                isDemoActive={isDemoActive}
                onToggleDemo={handleToggleDemo}
                dbMode={dbMode}
                realtimeStatus={realtimeStatus}
                complaints={complaints}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Detailed Inspection panel side drawer */}
      <ComplaintInspectorDrawer
        complaintId={selectedComplaintId}
        onClose={() => setSelectedComplaintId(null)}
        onStatusUpdated={handleStatusUpdatedInDrawer}
        isDemoMode={dbMode === "demo"}
      />

    </div>
  );
}
