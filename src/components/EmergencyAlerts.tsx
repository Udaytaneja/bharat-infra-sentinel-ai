import React, { useState } from "react";
import { Complaint } from "../types";
import { 
  AlertTriangle, 
  ShieldAlert, 
  Flame, 
  ChevronRight, 
  CheckCircle, 
  Cpu, 
  Send, 
  Navigation, 
  Clock, 
  User, 
  MapPin, 
  Check, 
  Volume2, 
  Sparkles,
  Zap,
  PhoneCall
} from "lucide-react";

interface EmergencyAlertsProps {
  complaints: Complaint[];
  onSelectComplaint?: (id: string) => void;
  onUpdateStatus?: (id: string, newStatus: any) => void;
}

export default function EmergencyAlerts({ 
  complaints, 
  onSelectComplaint,
  onUpdateStatus 
}: EmergencyAlertsProps) {
  // Automatically identify complaints where riskScore > 90 and severityScore > 90
  const emergencyComplaints = complaints.filter(
    (c) => c.riskScore > 90 && c.severityScore > 90
  );

  // Simulation states
  const [dispatchedIds, setDispatchedIds] = useState<string[]>([]);
  const [escalatedIds, setEscalatedIds] = useState<string[]>([]);
  const [audioMuted, setAudioMuted] = useState(true);
  const [recommendationModes, setRecommendationModes] = useState<Record<string, "STANDARD" | "SLA_INTENSE">>({});

  const handleDispatch = (id: string) => {
    setDispatchedIds((prev) => [...prev, id]);
    if (onUpdateStatus) {
      onUpdateStatus(id, "IN_PROGRESS");
    }
  };

  const handleEscalate = (id: string) => {
    setEscalatedIds((prev) => [...prev, id]);
  };

  const toggleRecommendationMode = (id: string) => {
    setRecommendationModes((prev) => ({
      ...prev,
      [id]: prev[id] === "SLA_INTENSE" ? "STANDARD" : "SLA_INTENSE"
    }));
  };

  // Helper to generate custom recommendations based on the issueType and standard parameters
  const getEscalationRecommendations = (c: Complaint, intenseMode: boolean) => {
    const isCritical = c.priority === "Critical" || c.severityScore > 90;
    
    if (c.issueType === "Potholes") {
      return {
        priorityLevel: isCritical ? "SLA-LEVEL-1 (IMMEDIATE)" : "LEVEL-2",
        timeframe: intenseMode ? "90 Minutes" : "4 Hours",
        redeployAction: "Deploy high-performance rapid bitumen concrete mix + subbase geogrid.",
        recommendations: [
          "Establish a immediate safety perimeter of 50 meters with retroreflective light boards.",
          "Redirect local heavy freight vehicle transit onto bypass arteries to arrest deep subgrade shear stress.",
          "Dispatch Emergency Unit Team-A with hydraulic paving mixers. Authorize spot compensation."
        ],
        personnel: "Chief Engineer (Asphalt Infrastructure Hub)"
      };
    } else if (c.issueType === "Leakage") {
      return {
        priorityLevel: isCritical ? "SLA-LEVEL-1 (CRITICAL)" : "LEVEL-2",
        timeframe: intenseMode ? "60 Minutes" : "3 Hours",
        redeployAction: "Perform hydrostatic valve isolation and clamp pressurized water conduits.",
        recommendations: [
          "Shut off section trunk-valves (Grid Area 11B & Metro Outer Bypass Corridor) to halt soil scouring.",
          "Mobilize excavation loaders for rapid ground penetration radar scanning to prevent secondary sinkholes.",
          "Issue water distribution rerouting notice to neighboring commercial shopping plazas."
        ],
        personnel: "Superintending Engineer (Hydrodynamic Division)"
      };
    } else if (c.issueType === "Garbage") {
      return {
        priorityLevel: isCritical ? "SLA-LEVEL-1 (BIOHAZARD)" : "LEVEL-3",
        timeframe: intenseMode ? "2 Hours" : "8 Hours",
        redeployAction: "Dispatch mechanical organic loader. Enforce toxic perimeter block.",
        recommendations: [
          "Deploy auxiliary monsoon sanitization units to neutralize stagnant surface-drain spillover gases.",
          "Erect security-monitored smart trash barriers and mount active CCTV camera surveillance systems.",
          "Direct regional waste management contractor to clear intersection blocks under solid penalty watch."
        ],
        personnel: "Deputy Director (Solid Waste & Environmental Safety)"
      };
    } else { // Street Light & Electrical Grid
      return {
        priorityLevel: isCritical ? "SLA-LEVEL-1 (GRID FAILURE)" : "LEVEL-2",
        timeframe: intenseMode ? "45 Minutes" : "2 Hours",
        redeployAction: "Isolate tripped feeder pillar circuit. Deploy high-tension wire rig.",
        recommendations: [
          "Coordinate immediate load shedding protocol with electricity board to isolate shorted transformers.",
          "Establish high-luminance battery streetlights to restore security surveillance corridor coverage.",
          "Mount heavy insulation seals at sub-grade terminal boxes to mitigate waterlogging risk expansion."
        ],
        personnel: "Director of Municipal Power Grid Systems"
      };
    }
  };

  if (emergencyComplaints.length === 0) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-emerald-500/15 text-emerald-400 rounded-2xl">
            <Check className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-display font-medium text-slate-900 text-sm">Emergency System Active</h3>
            <p className="text-xs text-slate-500 mt-1">
              Zero active complaints violate the extreme risk thresholds of severity &gt; 90 and risk &gt; 90.
            </p>
          </div>
        </div>
        <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-black">
          ● Standard Operational Level
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Global Red Alert Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-2 border-rose-600 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-pulse">
        {/* Abstract background graphics */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center select-none pointer-events-none">
          <Flame className="w-48 h-48 text-rose-500" />
        </div>

        <div className="flex items-start gap-4 z-10">
          <div className="p-3 bg-rose-500/20 text-red-400 rounded-2xl border border-red-500/40 animate-bounce">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-rose-500 text-white font-mono text-[9px] uppercase font-black rounded tracking-widest animate-pulse">
                CRITICAL EMERGENCY
              </span>
              <span className="text-[11px] font-mono text-rose-300 font-bold">MONSOON SLA TELEMETRY</span>
            </div>
            <h3 className="text-lg font-black font-display text-white uppercase mt-0.5">
              {emergencyComplaints.length} Ultra-High Risk Anomalies Active
            </h3>
            <p className="text-xs text-rose-200/80 max-w-2xl leading-relaxed">
              Automatic alert triggered. Multiple incidents exceed concurrent limits of <strong className="text-white">severity &gt; 90</strong> and <strong className="text-white">risk &gt; 90</strong>. Immediate administrative intervention and priority escalation recommended.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 z-10 flex-shrink-0 w-full md:w-auto">
          <button 
            onClick={() => setAudioMuted(!audioMuted)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest border transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer w-full md:w-auto ${
              audioMuted 
                ? "bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-900/30" 
                : "bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/25"
            }`}
          >
            <Volume2 className="w-4 h-4" />
            {audioMuted ? "Siren Alert Muted" : "Active Alarm Sounding"}
          </button>
        </div>
      </div>

      {/* 2. List of Flagged Emergency Complaints with generated recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {emergencyComplaints.map((c) => {
          const isDispatched = dispatchedIds.includes(c.id);
          const isEscalated = escalatedIds.includes(c.id);
          const isSlaIntense = recommendationModes[c.id] === "SLA_INTENSE";
          
          const reco = getEscalationRecommendations(c, isSlaIntense);

          return (
            <div 
              key={c.id} 
              className="bg-white rounded-3xl border-2 border-rose-100 hover:border-red-200 shadow-lg p-6 sm:p-8 space-y-6 transition duration-300 relative group"
            >
              
              {/* Header block with badges */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-rose-50 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-rose-600 uppercase pr-2 border-r border-rose-100">
                      INCIDENT {c.id}
                    </span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-750 text-red-700 text-[9.5px] font-mono font-black rounded-md uppercase tracking-wider">
                      Severity: {c.severityScore}/100
                    </span>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-750 text-rose-700 text-[9.5px] font-mono font-black rounded-md uppercase tracking-wider">
                      Risk: {c.riskScore}/100
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-900 font-bold text-sm tracking-tight">{c.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-sans text-slate-500 font-medium">Logged on: {c.date}</span>
                  <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg ${
                    c.status === "RESOLVED"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                      : c.status === "IN_PROGRESS"
                      ? "bg-amber-50 text-amber-800 border border-amber-100"
                      : "bg-red-50 text-red-800 border border-red-100 animate-pulse"
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>

              {/* Grid content layout: Briefing vs Escalation Recommendations */}
              <div id={`emergency-${c.id}`} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Column 1: Citizen Briefing */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black block">Reported Description</span>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      &ldquo;{c.description}&rdquo;
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black block">Citizen Filer</span>
                    <div className="flex items-center gap-2 text-xs text-slate-705 text-slate-700 bg-slate-50 px-4 py-2.5 rounded-2xl">
                      <User className="w-4 h-4 text-slate-400" />
                      <strong>{c.citizenName}</strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black block">Responsible Bureau</span>
                    <div className="flex items-center gap-2 text-xs text-slate-705 text-slate-700 bg-slate-50 px-4 py-2.5 rounded-2xl">
                      <Cpu className="w-4 h-4 text-slate-400" />
                      <strong>{c.department}</strong>
                    </div>
                  </div>

                  {c.dangers && c.dangers.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest font-black block">Assessed Public Safety Liabilities</span>
                      <div className="space-y-1.5">
                        {c.dangers.map((danger, index) => (
                          <div key={index} className="text-xs text-rose-700 flex items-start gap-1.5 bg-rose-50/50 p-2 rounded-xl">
                            <span className="font-mono text-[9px] font-bold text-rose-500 pt-0.5">[{index+1}]</span>
                            <span>{danger}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Column 2: Escalation Recommendations */}
                <div className="lg:col-span-7 bg-[#0b0f19] border border-slate-900 rounded-3xl p-6 text-slate-200 relative overflow-hidden flex flex-col justify-between self-stretch">
                  
                  <div className="space-y-4">
                    
                    {/* Recommendations Heading & Mode switcher */}
                    <div className="flex justify-between items-center pb-3 border-b border-slate-850/60">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono font-black text-rose-400 uppercase tracking-wider block">
                          AI PRIORITY RECOMMENDER
                        </span>
                        <h4 className="text-sm font-black font-display text-white uppercase">
                          Action Escalation Sheet
                        </h4>
                      </div>
                      
                      {/* Interactive switch */}
                      <button
                        onClick={() => toggleRecommendationMode(c.id)}
                        className={`px-2 py-1 rounded text-[9px] font-mono font-bold uppercase transition active:scale-95 border flex items-center gap-1 ${
                          isSlaIntense
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-md animate-pulse"
                            : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        {isSlaIntense ? "SLA Intense Mode" : "Standard SLA Mode"}
                      </button>
                    </div>

                    {/* Meta stats in recommendation block */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900">
                        <span className="text-[9px] text-slate-500 font-mono block">Recommended SLA Timeframe:</span>
                        <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          {reco.timeframe}
                        </span>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900">
                        <span className="text-[9px] text-slate-500 font-mono block">Authorization Level Required:</span>
                        <span className="text-xs font-mono font-bold text-amber-400 truncate block mt-0.5">
                          {reco.priorityLevel}
                        </span>
                      </div>
                    </div>

                    {/* Redeploy Action statement */}
                    <div className="bg-slate-950 p-4 border-l-2 border-rose-500 rounded-r-xl">
                      <span className="text-[9px] text-rose-400 font-mono uppercase block font-black">
                        Recommended Redeployment Action
                      </span>
                      <p className="text-xs mt-1 text-slate-300 leading-relaxed font-sans font-medium">
                        {reco.redeployAction}
                      </p>
                    </div>

                    {/* Step-by-step Action lists */}
                    <div className="space-y-2.5 pt-1">
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">Recommended Actions Deployment Protocol</span>
                      <div className="space-y-2">
                        {reco.recommendations.map((rec, index) => (
                          <div key={index} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-900/60 font-sans">
                            <span className="w-5 h-5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-mono flex items-center justify-center font-bold flex-shrink-0 border border-indigo-500/20">
                              {index + 1}
                            </span>
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-850/40">
                      Recommended Chief Personnel Focal Point: <strong className="text-white">{reco.personnel}</strong>
                    </div>

                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-850/40 mt-6 md:mt-2 bg-slate-950/20 p-2 rounded-2xl">
                    <button
                      onClick={() => handleDispatch(c.id)}
                      disabled={isDispatched}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border ${
                        isDispatched
                          ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-500 border-red-500 text-white hover:scale-[1.01] active:scale-95"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isDispatched ? "SLA Mobilized & Under Restoration" : "Mobilize SLA Dispatch Team"}
                    </button>

                    <button
                      onClick={() => handleEscalate(c.id)}
                      disabled={isEscalated}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold font-mono uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border ${
                        isEscalated
                          ? "bg-emerald-950/40 border-emerald-900/40 text-emerald-400 cursor-not-allowed"
                          : "bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-200 hover:scale-[1.01] active:scale-95"
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      {isEscalated ? "Escalated to Chief Commissioner" : "Escalate to Chief Commissioner Link"}
                    </button>

                    {onSelectComplaint && (
                      <button
                        onClick={() => onSelectComplaint(c.id)}
                        className="py-2.5 px-3.5 rounded-xl text-xs font-bold font-mono uppercase tracking-widest bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer"
                        title="Display Detail Telemetry Panel"
                      >
                        <Navigation className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>

              </div>
              
              {/* Pulse overlay indicating high liability */}
              <div className="absolute top-3 right-3 p-1 rounded-full bg-red-500 uppercase tracking-widest block text-[9px] text-white font-mono font-black animate-pulse px-2">
                ACTIVE ALARM
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
