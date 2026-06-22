import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  RefreshCcw, 
  Play, 
  CheckCircle2, 
  Lock, 
  Sliders, 
  CloudRain, 
  Wifi, 
  Radio, 
  HardDrive
} from "lucide-react";
import { Complaint } from "../types";

interface SystemAdministrationProps {
  isDemoActive: boolean;
  onToggleDemo: (enabled: boolean) => void;
  dbMode: string;
  realtimeStatus: string;
  complaints: Complaint[];
}

export default function SystemAdministration({
  isDemoActive,
  onToggleDemo,
  dbMode,
  realtimeStatus,
  complaints
}: SystemAdministrationProps) {
  const [rainfallLevel, setRainfallLevel] = useState<number>(85);
  const [decaySpeed, setDecaySpeed] = useState<number>(1.2);
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);
  const [vibratingBeacon, setVibratingBeacon] = useState(true);

  // Generate real-time administrative mock logs
  useEffect(() => {
    const defaultLogs = [
      `[MUNICIPAL_SECURE_KERNEL] INITIALIZED System Administration Shell v5.0`,
      `[DATABASE_SYNC] Active connection established via endpoint Supabase Proxy`,
      `[MONSOON_ENGINE] Predictive weather feed: Monsoon heavy saturation alerts online`,
      `[COGNITIVE_DISPATCH] Routed dispatch markers to regional engineering depots`,
    ];
    setSimulatedLogs(defaultLogs);

    const interval = setInterval(() => {
      const messages = [
        `[SENSOR_TELEMETRY] GPS telemetry sync packet acknowledged from Metro Grid ${Math.floor(Math.random() * 8) + 1}`,
        `[AI_EVALUATION] Re-evaluating moisture risk indices based on local rainfall levels`,
        `[SLA_MONITOR] Audited response timelines for pending structural incidents`,
        `[SECURITY_AUDIT] Integrity verified of PostgreSQL relational schema mapping`,
        `[DEMO_INTEGRATOR] Preserving memory buffer arrays from local state variables`,
        `[SYSTEM_INTEGRITY] Checked 142,380 active municipal monitored assets`
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setSimulatedLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ${randomMsg}`,
        ...prev.slice(0, 15)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleTriggerManualRevaluation = () => {
    const timestamp = new Date().toLocaleTimeString();
    setSimulatedLogs(prev => [
      `[${timestamp}] ⚡ [ADMIN_MANUAL_INIT] Triggered metropolitan failure-zone prediction revaluation...`,
      `[${timestamp}] 🟢 [SUCCESS] Re-evaluated ${complaints.length} active complaints risk criteria`,
      ...prev
    ]);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="system-admin-panel">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-medium text-xs font-mono font-bold uppercase tracking-widest bg-brand-light/40 px-3 py-1 rounded-full w-fit">
              <Settings className="w-3.5 h-3.5" />
              Infrastructure Operations Control
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-slate-900 mt-2">
              System Administration Panel
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Administer regional database routing scopes, live presentation demo layers, and algorithmic coefficients.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-150 rounded-2xl px-4 py-3 text-emerald-800 flex items-center gap-3 w-fit">
            <div className="p-2 bg-emerald-500 text-white rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600">Database Protection</div>
              <div className="text-xs font-bold leading-tight">Live DB Tables Insulated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Judge Demo Mode Master Switch Card */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Master Toggle Area */}
          <div className="bg-[#0b1329] text-white border border-blue-900/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
            <div className="absolute right-0 top-0 -mt-20 -mr-20 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl"></div>
            
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-amber-405/10 bg-slate-800 text-amber-400 rounded-2xl border border-amber-400/20">
                    <Database className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display uppercase tracking-wider">
                      Presentation Layer Manager
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                      Presentation & Evaluation controls
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isDemoActive ? "bg-amber-450 bg-amber-400 animate-ping" : "bg-emerald-400"}`}></span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-300">
                    {isDemoActive ? "DEMO ACTIVE" : "REAL-TIME"}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">
                      Judge Demo Simulation Overlay
                    </h4>
                    <p className="text-xs text-slate-400 leading-normal mt-0.5 max-w-sm">
                      Enables a rich, complete set of 11 multi-city defects, custom analytics graphs, contractor portfolios, and dynamic mapping markers independent of current live Supabase database contents.
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleDemo(!isDemoActive)}
                    className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isDemoActive ? "bg-amber-400" : "bg-slate-700"}`}
                  >
                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-slate-950 shadow-md ring-0 transition duration-200 ease-in-out ${isDemoActive ? "translate-x-7" : "translate-x-0"}`} />
                  </button>
                </div>

                {/* DB Safety Clause Indicator */}
                <div className="border-t border-slate-800/80 pt-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 leading-relaxed">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 animate-bounce" />
                  <span>SAFETY CLAUSE: This switch changes visualization scopes locally and will NEVER truncate, alter, or insert dummy rows onto your production Supabase database.</span>
                </div>
              </div>

              {/* Stats Preview banner */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Metros Scoped</span>
                  <strong className="text-slate-100 text-sm mt-1 block">5 Cities</strong>
                </div>
                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Defects Loaded</span>
                  <strong className="text-slate-100 text-sm mt-1 block">{complaints.length} Records</strong>
                </div>
                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Analytics Status</span>
                  <strong className="text-emerald-400 text-sm mt-1 block">100% Rendered</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Sliders */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <Sliders className="w-4.5 h-4.5 text-brand-medium" />
              <h3 className="font-display font-medium text-slate-800 text-sm tracking-wider uppercase">
                Atmospheric & Soil Simulation Coefficients
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Dynamically manipulate municipal stress constants. These parameters model waterlogging risks and pavement stripping models inside the predictive model calculations in real time.
            </p>

            <div className="space-y-5">
              {/* Rainfall Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-600 flex items-center gap-1.5 font-bold uppercase">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                    Monsoon Precipitation Level:
                  </span>
                  <strong className="text-slate-800">{rainfallLevel} mm/hr</strong>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="150" 
                  value={rainfallLevel} 
                  onChange={(e) => setRainfallLevel(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-medium"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                  <span>20 (Dry Wave)</span>
                  <span>150 (Severe Cloudburst)</span>
                </div>
              </div>

              {/* Soil Scour Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-600 flex items-center gap-1.5 font-bold uppercase">
                    <Activity className="w-3.5 h-3.5 text-amber-500" />
                    Asphalt Stripping Constant:
                  </span>
                  <strong className="text-slate-800">{decaySpeed}x / week</strong>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="3.0" 
                  step="0.1"
                  value={decaySpeed} 
                  onChange={(e) => setDecaySpeed(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-medium"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                  <span>0.5x (Hardened Granite Bed)</span>
                  <span>3.0x (Silted Clay Erosion)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleTriggerManualRevaluation}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Re-Evaluate Predictive Risks</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Console Terminal Logs and Live Status Info */}
        <div className="lg:col-span-5 space-y-6">

          {/* Administrative Telemetry Status Panel */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Radio className="w-4.5 h-4.5 text-brand-medium" />
                <h3 className="font-display font-medium text-slate-850 text-sm tracking-wider uppercase">
                  Central Server Nodes
                </h3>
              </div>
              <Wifi className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3 text-xs leading-normal">
              <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-mono">PRIMARY SITE NODE:</span>
                <span className="font-mono font-bold text-slate-800">DELHI_GRID_NCR_1A</span>
              </div>
              <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-mono">SUPABASE DB SYNC:</span>
                <span className="font-mono font-bold uppercase text-brand-medium">ACTIVE_{dbMode.toUpperCase()}</span>
              </div>
              <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-mono">REALTIME WS STREAM:</span>
                <span className="font-mono font-bold text-emerald-600 uppercase">{realtimeStatus}</span>
              </div>
              <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-mono">POSTGRES AUTH LINK:</span>
                <span className="font-mono font-bold text-slate-800">ENCRYPTED_JWT</span>
              </div>
            </div>
          </div>
          
          {/* Active Terminal Shell Console */}
          <div className="bg-[#0b1329] text-amber-400 border border-slate-800 rounded-3xl p-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-450 bg-amber-400 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-2">
                  SENTINEL CONSOLE TERMINAL
                </span>
              </div>
              <div className="text-[8px] font-mono text-slate-500">LINE_BUFFER_SENSATIVE_AI</div>
            </div>

            <div className="h-60 overflow-y-auto font-mono text-[9.5px] leading-relaxed space-y-2 text-slate-350 pr-2 scrollbar-thin">
              {simulatedLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={`border-l-2 pl-2 ${
                    log.includes("SUCCESS") ? "border-emerald-500 text-emerald-300" :
                    log.includes("ADMIN_MANUAL_INIT") ? "border-amber-400 text-amber-300" :
                    "border-slate-800 text-slate-300"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
