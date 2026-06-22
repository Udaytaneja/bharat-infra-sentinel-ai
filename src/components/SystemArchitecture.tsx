import React, { useState, useEffect } from "react";
import { 
  User, 
  Cpu, 
  Database, 
  Map, 
  LayoutDashboard, 
  Wrench, 
  Smartphone, 
  ArrowRight, 
  Play, 
  ChevronRight, 
  Info, 
  CheckCircle,
  Network,
  Activity,
  Cloud,
  Layers,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SystemArchitecture() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [simulationState, setSimulationState] = useState<"idle" | "running" | "completed">("idle");
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<number>(0);

  // System Architecture flow steps
  const steps = [
    {
      id: 1,
      title: "Citizen Portal",
      short: "Incident Capture",
      icon: Smartphone,
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50 border-blue-200 text-blue-700",
      bgDark: "bg-blue-950/20 border-blue-900/40 text-blue-400",
      latency: "Initial",
      payload: "Raw image bytes, GPS coordinates, defect category, description",
      description: "Submits real-time geotagged street hazards (potholes, waterlogging, dark spots). Captures browser geolocation metadata and accepts visual photo evidence.",
      metrics: [
        { label: "Client Engine", value: "React 18 + SPA" },
        { label: "Asset Size", value: "Optimized WebP/Base64" },
        { label: "Geo Accuracy", value: "Symmetric GPS Coordinates" }
      ]
    },
    {
      id: 2,
      title: "AI Analysis Engine",
      short: "Multi-modal grading",
      icon: Cpu,
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50 border-amber-200 text-amber-700",
      bgDark: "bg-amber-950/20 border-amber-900/40 text-amber-400",
      latency: "1.2s",
      payload: "AI Severity Index, risk assessment confidence range, analysis keywords",
      description: "Applies Gemini multi-modal processing over the user's submitted description and photo to extract structural damage severity (0 to 100), identify urgent hazards, and summarize diagnostic remarks.",
      metrics: [
        { label: "Model Layer", value: "Gemini 1.5 Pro via Server Proxy" },
        { label: "Inference SLA", value: "1200ms mean latency" },
        { label: "Outputs", value: "Severity Rating (0-100)" }
      ]
    },
    {
      id: 3,
      title: "Supabase Database",
      short: "Real-time records",
      icon: Database,
      color: "from-emerald-500 to-teal-500",
      bgLight: "bg-emerald-50 border-emerald-200 text-emerald-700",
      bgDark: "bg-emerald-950/20 border-emerald-900/40 text-emerald-400",
      latency: "35ms",
      payload: "Synchronized complain object, severity payload, chronological state",
      description: "Serves as the persistent cloud registry. Updates Postgres tables in real-time, instantly notifying subscribers (administrative boards, contractor dispatch) of new entries.",
      metrics: [
        { label: "Engine Type", value: "PostgreSQL Database" },
        { label: "Sync Protocol", value: "Websocket Real-Time Updates" },
        { label: "Query Cache", value: "Symmetric indexed constraints" }
      ]
    },
    {
      id: 4,
      title: "GIS Mapping Layer",
      short: "Spatial anomalies",
      icon: Map,
      color: "from-purple-500 to-indigo-500",
      bgLight: "bg-purple-50 border-purple-200 text-purple-700",
      bgDark: "bg-purple-950/20 border-purple-900/40 text-purple-400",
      latency: "60ms",
      payload: "Decay factors, flood index update vectors, grid telemetry boundaries",
      description: "Maps GPS coordinates to localized metropolitan GIS sectors. Dynamically aggregates active complaints per sector to recalibrate regional risk calculations for waterlogging, asphalt failure, and blackouts.",
      metrics: [
        { label: "Renderer", value: "Interactive Vector SVG Layer" },
        { label: "Geofences", value: "4 Multi-point Metros" },
        { label: "Telemetry", value: "Risk score calculations" }
      ]
    },
    {
      id: 5,
      title: "Government Hub",
      short: "Command Control",
      icon: LayoutDashboard,
      color: "from-indigo-500 to-violet-500",
      bgLight: "bg-indigo-50 border-indigo-200 text-indigo-700",
      bgDark: "bg-indigo-950/20 border-indigo-900/40 text-indigo-400",
      latency: "Instant",
      payload: "Live KPI aggregates, Monte-Carlo simulation vectors, PDF audit export",
      description: "The primary administrative oversight panel for government officials. Displays macro impact KPIs, estimated financial savings, and hosts predictive Monte-Carlo risk simulations.",
      metrics: [
        { label: "Interface", value: "Command & Control Bento Layout" },
        { label: "KPI Synthesis", value: "Unified financial and SLA metrics" },
        { label: "Sim Engine", value: "Monte-Carlo Asphalt Decay Model" }
      ]
    },
    {
      id: 6,
      title: "Resolution Workflow",
      short: "Contractor Dispatch",
      icon: Wrench,
      color: "from-rose-500 to-pink-500",
      bgLight: "bg-rose-50 border-rose-200 text-rose-700",
      bgDark: "bg-rose-950/20 border-rose-900/40 text-rose-400",
      latency: "Crew response",
      payload: "Assigned crew IDs, status: ASSIGNED/IN_PROGRESS/RESOLVED, remedial notes",
      description: "Decentralized task completion engine. Automatically routes high-severity tickets to optimized contractors based on operational load. Tracks crew latencies, completed field audits, and SLA compliance.",
      metrics: [
        { label: "Dispatch", value: "Load-balanced Assigning Algorithm" },
        { label: "SLA Targets", value: "Under 2.4 Hours response" },
        { label: "Verification", value: "Defect resolution audits" }
      ]
    }
  ];

  // Simulator flow execution
  const startSimulation = () => {
    if (simulationState === "running") return;
    
    setSimulationState("running");
    setActiveStep(1);
    setSelectedNode(1);
    setLogMessages(["[0.0s] [Citizen Portal] Citizen uploads street pothole photo on smartphone in Delhi NCR..."]);

    const timers = [
      {
        step: 2,
        delay: 1500,
        log: "[1.5s] [AI Analysis Engine] Server proxy triggers Gemini multi-modal API. Image analyzed. Computed defect: Pothole severity: 87/100."
      },
      {
        step: 3,
        delay: 3000,
        log: "[3.0s] [Supabase Database] Row committed to 'complaints' table. Postgres real-time webhook fires."
      },
      {
        step: 4,
        delay: 4500,
        log: "[4.5s] [GIS Mapping Layer] Real-time coordinates received. Delhi NCR sector adjusted. Asphalt Failure risk score updated from 42% to 68%."
      },
      {
        step: 5,
        delay: 6000,
        log: "[6.0s] [Government Hub] Cabinet Command Dashboard flashes red alert for new high-severity hazard. Maintenance avoidance indices updated."
      },
      {
        step: 6,
        delay: 7500,
        log: "[7.5s] [Resolution Workflow] Automated dispatch targets Metro Road Division-4. Field contractor assigned, SLA countdown initiated."
      }
    ];

    timers.forEach((t, i) => {
      setTimeout(() => {
        setActiveStep(t.step);
        setSelectedNode(t.step);
        setLogMessages(prev => [...prev, t.log]);
        
        if (t.step === 6) {
          setTimeout(() => {
            setSimulationState("completed");
            setActiveStep(null);
            setLogMessages(prev => [...prev, "[9.0s] [Sentinel System] Interactive cycle simulation successfully completed. Live operational sync fully verified!"]);
          }, 1500);
        }
      }, t.delay);
    });
  };

  const currentSelect = steps.find(s => s.id === (selectedNode || 1)) || steps[0];

  return (
    <div className="space-y-12">
      
      {/* Top Banner with Core Concept Description */}
      <div className="bg-[#0f172a] text-white border border-slate-800 rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-40"></div>
        <div className="absolute right-0 top-0 -mt-16 -mr-16 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-wider uppercase border border-amber-500/20 rounded-full">
              <Network className="w-3.5 h-3.5" />
              SYSTEM DIAGRAM & FLOW METRICS
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Civil Sentinel <span className="text-brand-light">Core Architecture</span>
            </h1>
            <p className="font-sans text-xs sm:text-sm text-slate-350 max-w-2xl text-slate-300 font-light leading-relaxed">
              Decentralized, event-driven infrastructure blueprint. Follow the transition of citizen submissions through deep cognitive models to dynamic spatial maps, cabinet dashboards, and physical SLA-tracked resolutions.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl min-w-[200px] flex flex-col justify-center">
            <span className="text-[10px] font-mono text-slate-500 font-extrabold uppercase mb-1">Architecture Sync</span>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-white text-xs font-semibold">Active Webhook Pipeline</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/60">
              Latency: <strong className="text-slate-100">~1.25s end-to-end</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Interactive Data Flow Simulator Schema */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
        
        {/* Schema Control Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Interactive Data Flow Simulator
            </h2>
            <p className="text-xs text-slate-500">
              Click the simulator button to trigger an end-to-end simulated incident. Follow the live packet as it propagates along the server steps.
            </p>
          </div>

          <button
            onClick={startSimulation}
            disabled={simulationState === "running"}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md active:scale-95 transition flex items-center gap-2 cursor-pointer ${
              simulationState === "running"
                ? "bg-slate-700/60 text-slate-300 cursor-not-allowed"
                : "bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10"
            }`}
          >
            {simulationState === "running" ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />
                Packet Propagating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" fill="currentColor" />
                Simulate Live Citizen Incident Report
              </>
            )}
          </button>
        </div>

        {/* The Graphic Node Pipeline */}
        <div className="relative py-8 overflow-x-auto min-w-full">
          {/* Connector Line behind cards */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-100 -translate-y-1/2 hidden lg:block rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ 
                width: simulationState === "idle" ? "0%" : 
                       activeStep === 1 ? "16%" :
                       activeStep === 2 ? "33%" :
                       activeStep === 3 ? "50%" :
                       activeStep === 4 ? "66%" :
                       activeStep === 5 ? "83%" : "100%"
              }}
            ></div>
          </div>

          <div className="relative flex flex-col lg:flex-row justify-between gap-8 lg:gap-4 z-10">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = activeStep === step.id;
              const isPassed = activeStep !== null && activeStep > step.id;
              const isCurrentSelected = selectedNode === step.id;
              
              return (
                <div 
                  key={step.id} 
                  className="flex-1 flex flex-col items-center group cursor-pointer"
                  onClick={() => setSelectedNode(step.id)}
                >
                  {/* Step Card Visual Node */}
                  <div className={`w-full max-w-[220px] p-4 rounded-2xl border transition-all duration-300 relative ${
                    isActive 
                      ? "bg-[#0f172a] border-[#0f172a] shadow-xl text-white transform -translate-y-2 scale-105" 
                      : isPassed
                      ? "bg-indigo-50/50 border-indigo-250 border-indigo-200 text-indigo-900" 
                      : isCurrentSelected
                      ? "bg-white border-indigo-600 shadow-md transform text-slate-900"
                      : "bg-white border-slate-150 hover:border-slate-200 text-slate-800 hover:-translate-y-1"
                  }`}>
                    
                    {/* Pulsating live target halo */}
                    {isActive && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </span>
                    )}

                    {/* Step ID Label */}
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded ${
                        isActive ? "bg-amber-500 text-slate-950" : "bg-slate-100 text-slate-500"
                      }`}>
                        STEP_0{step.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{step.latency}</span>
                    </div>

                    {/* Step Icon Hex Frame */}
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        isActive ? "bg-white text-slate-900" : `bg-gradient-to-br ${step.color} text-white`
                      }`}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display font-black text-xs truncate uppercase tracking-tight">
                          {step.title}
                        </h3>
                        <p className={`text-[10px] truncate ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                          {step.short}
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Status / Value Line */}
                    <div className="mt-4 pt-3 border-t border-slate-100/10 flex items-center justify-between text-[10px] font-mono">
                      <span>STATUS:</span>
                      <span className={`font-bold ${
                        isActive 
                          ? "text-amber-400 animate-pulse" 
                          : isPassed 
                          ? "text-indigo-600" 
                          : "text-slate-400"
                      }`}>
                        {isActive ? "COMMUNICATING" : isPassed ? "TRANSMITTED" : "LISTENING"}
                      </span>
                    </div>

                  </div>

                  {/* Flow Arrow (only displayed below card for mobile layout) */}
                  {step.id < 6 && (
                    <div className="my-2 lg:hidden">
                      <ArrowRight className="w-5 h-5 text-slate-300 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Details Inspector for Selected/Active Node */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl"></div>
          
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className={`p-2 rounded-xl bg-gradient-to-br ${currentSelect.color} text-white`}>
                {React.createElement(currentSelect.icon, { className: "w-5 h-5" })}
              </span>
              <div>
                <span className="text-[10px] font-mono font-black text-indigo-650 text-indigo-600 uppercase tracking-widest block">
                  STEP 0{currentSelect.id} SYSTEM COMPONENT INSPECTOR
                </span>
                <h3 className="font-display font-black text-xl text-slate-900 tracking-tight">
                  {currentSelect.title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-650 text-slate-600 leading-relaxed font-sans max-w-3xl">
              {currentSelect.description}
            </p>

            {/* Simulated Data payload line inspector */}
            <div className="p-3 bg-slate-900 rounded-xl font-mono text-[11px] text-slate-300 border border-slate-800 space-y-1.5 overflow-x-auto">
              <div className="text-slate-500 font-bold uppercase flex items-center justify-between">
                <span>DATAFRAME_TRANSMISSION_PAYLOAD</span>
                <span className="text-amber-405 text-amber-500 font-normal">JSON Schema</span>
              </div>
              <div className="text-indigo-305 text-indigo-300 truncate">
                {"{ "}payload: "{currentSelect.payload}"{" }"}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-white border border-slate-200/50 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
            <h4 className="font-display text-xs font-black text-slate-900 uppercase border-b border-slate-100 pb-2">
              Performance Specifications
            </h4>
            
            <div className="space-y-2.5">
              {currentSelect.metrics.map((m, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-sans">
                  <span className="text-slate-400 font-medium">{m.label}</span>
                  <span className="text-slate-800 font-bold font-mono">{m.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-2 text-center rounded-lg text-[10px] font-mono text-slate-500 font-medium">
              DISPATCH SLA LIMIT: <strong className="text-slate-800">{currentSelect.latency}</strong>
            </div>
          </div>
        </div>

        {/* Live Simulator Logs Terminal */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              Live Architecture Simulation Logs
            </div>
            {logMessages.length > 0 && (
              <button 
                onClick={() => setLogMessages([])}
                className="text-[10px] font-mono text-slate-400 hover:text-slate-600 transition"
              >
                CLEAR RECORDS
              </button>
            )}
          </div>

          <div className="bg-slate-950 text-slate-350 p-4 rounded-2xl font-mono text-xs max-h-[160px] overflow-y-auto space-y-2 border border-slate-900 shadow-inner">
            {logMessages.length === 0 ? (
              <span className="text-slate-600 italic block py-4 text-center">
                Initialize the simulator above to stream real-time JSON packets ...
              </span>
            ) : (
              logMessages.map((log, idx) => (
                <div key={idx} className="flex items-start gap-1 pb-1 border-b border-slate-900 last:border-0">
                  <span className="text-indigo-400 select-none">❯</span>
                  <span className={log.includes("Sentinel System") ? "text-emerald-400 font-semibold" : ""}>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Deep-Dive Architectural Specifications Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="font-display font-extrabold text-xl text-slate-900 pl-3 border-l-4 border-amber-500 tracking-tight">
          Comprehensive System Integration Mapping
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
          
          <div className="p-5 border border-slate-100 rounded-2xl hover:border-slate-200 transition space-y-3.5">
            <div className="inline-flex p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Cloud className="w-5 h-5" />
            </div>
            <h4 className="font-display font-extrabold text-sm uppercase text-slate-900">
              Cognitive Analytical Pipelines
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Decentralized cloud processes host our visual AI analysis pipeline. Using multimodality parsing, the framework accepts image stream inputs to compute immediate damage index metrics. This process acts as the ultimate filter, blocking human categorization errors and prioritizing high-risk potholes or flooded corridors.
            </p>
          </div>

          <div className="p-5 border border-slate-100 rounded-2xl hover:border-slate-200 transition space-y-3.5">
            <div className="inline-flex p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-display font-extrabold text-sm uppercase text-slate-900">
              Geospatial Vector Math Calibration
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Rather than traditional flat mapping coordinates, coordinates undergo real-time matrix comparisons against vector bounding geofences. This determines metropolitan sectors on-the-fly, giving dispatchers an instantaneous view of regional risk weights and decay indexes on our GIS heatmaps.
            </p>
          </div>

          <div className="p-5 border border-slate-100 rounded-2xl hover:border-slate-200 transition space-y-3.5">
            <div className="inline-flex p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h4 className="font-display font-extrabold text-sm uppercase text-slate-900">
              Sub-Symmetric Database Persistence
            </h4>
            <p className="text-xs text-slate-650 text-slate-650 text-slate-600 leading-relaxed">
              All transactions persist using indexed schemas, guaranteeing immediate dashboard rendering regardless of concurrent client submissions. Real-time updates automatically broadcast to dispatcher web sockets, securing seamless contractor updates and rapid SLA resolutions.
            </p>
          </div>

          <div className="p-5 border border-slate-100 rounded-2xl hover:border-slate-200 transition space-y-3.5">
            <div className="inline-flex p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Network className="w-5 h-5" />
            </div>
            <h4 className="font-display font-extrabold text-sm uppercase text-slate-900">
              SLA Resolution Performance Loop
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Contractor response times, hourly labor allocations, and resolved item weights compile dynamically to compute overall municipal grades. The system implements a robust feedback loop designed to reward contractors driving lower latencies.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
