import React, { useState } from "react";
import { Complaint, HighlightRegion } from "../types";
import { BrainCircuit, AlertTriangle, ShieldAlert, Cpu, HeartPulse, Hammer, MapPin, Eye } from "lucide-react";

interface AiAnalysisProps {
  complaints: Complaint[];
  onSelectComplaint?: (id: string) => void;
}

export default function AiAnalysis({ complaints, onSelectComplaint }: AiAnalysisProps) {
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>("");
  const [hoveredRegion, setHoveredRegion] = useState<HighlightRegion | null>(null);

  // Automatically select the first live database complaint if nothing specifically is selected
  const activeComplaintId = selectedComplaintId || (complaints.length > 0 ? complaints[0].id : "");
  const selectedComplaint = complaints.find(c => c.id === activeComplaintId);

  return (
    <div className="space-y-8">
      {/* Structural Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-deep flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-brand-medium" />
            AI Dynamic Analysis Center
          </h2>
          <p className="text-slate-500 text-sm font-sans mt-0.5">
            Real-time multi-modal civil structural diagnostic scanner powered by Gemini. Select complaints to execute active engineering inspections.
          </p>
        </div>

        {/* Dropdown to select complaint with Inspection Trigger */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Active Complaints:</span>
          <select
            value={activeComplaintId}
            onChange={(e) => setSelectedComplaintId(e.target.value)}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 font-sans text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-medium cursor-pointer w-full md:w-56 transition"
          >
            {complaints.length === 0 ? (
              <option value="">No Active Complaints</option>
            ) : (
              complaints.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.issueType} ({c.location.split(",").slice(-1)[0].trim()})
                </option>
              ))
            )}
          </select>
          {selectedComplaint && (
            <button
              onClick={() => onSelectComplaint?.(selectedComplaint.id)}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 font-bold font-sans text-xs text-white rounded-xl flex items-center gap-1.5 active:scale-95 transition cursor-pointer shadow-md shadow-indigo-500/10"
              title="Open full telemetry inspection center"
            >
              <Eye className="w-4 h-4" />
              INSPECT LIVE PANEL
            </button>
          )}
        </div>
      </div>

      {!selectedComplaint ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8">
          <p className="text-slate-500">No reported complaints recorded on the telemetry feed. Register a complaint on the Citizen Portal first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Diagnostic Scanning Visor Panel (Left column - 5 columns) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 tracking-wider uppercase font-mono">Dynamic Image Visor Mode</span>
              <div className="flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-semibold font-mono">
                <Eye className="w-3.5 h-3.5 animate-pulse" />
                INFRA_SCAN_ACTIVE
              </div>
            </div>

            {/* Interactive Image Overlay */}
            <div className="relative rounded-xl overflow-hidden shadow-inner bg-slate-950 aspect-[4/3] group border border-slate-200">
              {selectedComplaint.imageUrl ? (
                <img
                  src={selectedComplaint.imageUrl}
                  alt={selectedComplaint.issueType}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-xs">
                  NO_IMAGE_EVIDENCE_SPECIFIED
                </div>
              )}

              {/* Grid scanning grid visualizer lines */}
              <div className="absolute inset-0 border border-emerald-500/15 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>

              {/* Draw Highlight coordinate hotspots */}
              {selectedComplaint.highlightRegions && selectedComplaint.highlightRegions.map((region, idx) => (
                <div
                  key={idx}
                  style={{ left: `${region.x}%`, top: `${region.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group/marker z-10 cursor-pointer"
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  {/* Glowing halo indicator */}
                  <span className="absolute inline-flex h-6 w-6 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                  <div className="relative bg-red-600 text-white p-1.5 rounded-full border border-white shadow-lg active:scale-90 font-mono text-[9px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>

                  {/* Absolute positioning marker tooltip context */}
                  <div className="absolute left-8 -top-3 w-40 bg-slate-900/95 backdrop-blur-sm text-white text-[10px] p-2 rounded-lg border border-slate-700 pointer-events-none opacity-0 group-hover/marker:opacity-100 transition-opacity duration-300 shadow-xl font-mono text-left">
                    <div className="font-bold text-amber-400">POINT_0{idx + 1}</div>
                    <div>{region.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hovered marker description */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[75px] flex flex-col justify-center">
              {hoveredRegion ? (
                <>
                  <span className="text-[10px] font-bold text-amber-600 font-mono uppercase tracking-wider block">Inspecting Asset Node Hotspot:</span>
                  <p className="text-xs font-mono text-slate-700 mt-1">{hoveredRegion.label}</p>
                </>
              ) : (
                <p className="text-xs text-slate-400 font-sans text-center">
                  Hover over the numbered camera points overlaying the visual feed above to inspect precise structural defect annotations.
                </p>
              )}
            </div>

            {/* Geographical details banner */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Logged Authority Node:</span>
                <span className="font-mono text-slate-800 font-semibold">{selectedComplaint.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Reporting Citizen:</span>
                <span className="text-slate-800 font-semibold">{selectedComplaint.citizenName}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium whitespace-nowrap mr-2">Telemetry Coordinates:</span>
                <span className="font-mono text-slate-800 font-semibold text-right break-words max-w-[200px]">
                  {selectedComplaint.latitude}, {selectedComplaint.longitude}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Filing Timestamp:</span>
                <span className="text-slate-800 font-semibold">{selectedComplaint.date}</span>
              </div>
            </div>
          </div>

          {/* Core AI Metadata Assessment (Right Column - 7 columns) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-8">
            
            {/* Top diagnostic breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Category */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Issue Category</span>
                <div className="text-lg font-display font-bold text-brand-deep mt-2">{selectedComplaint.issueType}</div>
                <span className="text-[11px] text-brand-medium font-medium mt-1 font-mono">SENTINEL_OK</span>
              </div>

              {/* Priority Status badge wrapper */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Priority Classification</span>
                <div>
                  {selectedComplaint.severityScore >= 80 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold leading-none mt-2 uppercase tracking-wide border border-red-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                      CRITICAL RISK
                    </span>
                  ) : selectedComplaint.severityScore >= 60 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold leading-none mt-2 uppercase tracking-wide border border-amber-200">
                      HIGH RISK
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold leading-none mt-2 uppercase tracking-wide border border-blue-200">
                      MEDIUM PRIORITY
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 mt-2">SLA target: &lt; 24h</span>
              </div>

              {/* Engineering Status */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Workflow Dispatch</span>
                <div className="mt-2">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-lg border ${
                    selectedComplaint.status === "RESOLVED"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : selectedComplaint.status === "IN_PROGRESS"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    {selectedComplaint.status === "RESOLVED" ? "RESOLVED & AUDITED" : selectedComplaint.status === "IN_PROGRESS" ? "CREW IN FIED" : "UNRESOLVED DISPATCH"}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 truncate max-w-full font-sans">{selectedComplaint.id}</span>
              </div>
            </div>

            {/* Dual Score Dial Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
              
              {/* Severity Gauge */}
              <div className="p-4 rounded-xl border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 tracking-wider uppercase flex items-center gap-1">
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                    Severity Assessment
                  </span>
                  <span className="text-sm font-bold font-mono text-rose-600">{selectedComplaint.severityScore}/100</span>
                </div>
                
                {/* Visual bar meter */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${selectedComplaint.severityScore}%` }}
                    className={`h-full rounded-full transition-all duration-1000 ${
                      selectedComplaint.severityScore >= 80 ? "bg-rose-500" : selectedComplaint.severityScore >= 50 ? "bg-amber-500" : "bg-blue-500"
                    }`}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                  Reflects immediate structural degradation status. High scores require expedited material testing and subgrade structural revalidation.
                </p>
              </div>

              {/* Safety Risk index gauge */}
              <div className="p-4 rounded-xl border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 tracking-wider uppercase flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 text-brand-accent" />
                    Cascading Risk Index
                  </span>
                  <span className="text-sm font-bold font-mono text-amber-600">{selectedComplaint.riskScore}/100</span>
                </div>
                
                {/* Visual bar meter */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${selectedComplaint.riskScore}%` }}
                    className={`h-full rounded-full transition-all duration-1000 ${
                      selectedComplaint.riskScore >= 80 ? "bg-red-500" : selectedComplaint.riskScore >= 50 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                  Predicts public exposure, traffic hazard spikes, and potential physical damage risks occurring within 72 hours of report.
                </p>
              </div>
            </div>

            {/* Deep Diagnostic Text Panels */}
            <div className="space-y-6">
              
              {/* Failure mode civil analysis */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-brand-medium" />
                  Technical Failure Diagnosis
                </h4>
                <div className="bg-brand-light border-l-4 border-brand-medium p-4 rounded-r-xl">
                  <div className="text-sm font-semibold text-brand-primary font-mono">{selectedComplaint.failureMode || "Dynamic structural analysis in progress"}</div>
                  <p className="text-xs text-slate-600 mt-1 font-sans leading-relaxed">{selectedComplaint.description}</p>
                </div>
              </div>

              {/* Dangers identified */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  Imminent Hazards Spotted
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-1 gap-2">
                  {selectedComplaint.dangers && selectedComplaint.dangers.map((danger, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center font-mono text-[10px] bg-red-100 text-red-700 font-bold rounded-md">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{danger}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Department and Immediate Work order */}
              <div className="space-y-4 pt-2">
                <div className="bg-amber-50/50 border border-amber-200/60 p-5 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/40 pb-2">
                    <div>
                      <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wide block">Recommended Dispatch Authority</span>
                      <div className="text-sm font-bold text-brand-deep font-sans">{selectedComplaint.department}</div>
                    </div>
                    <div className="px-3 py-1 font-mono text-[10px] font-bold text-amber-800 bg-amber-150 border border-amber-300 rounded-lg flex items-center gap-1 bg-amber-200/50">
                      <Hammer className="w-3 h-3" />
                      DISPATCH_PRIO_FAST
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wide block">Remedial Action Directive Work Order</span>
                    <p className="text-xs text-brand-primary leading-relaxed font-semibold mt-1 font-sans block bg-white/70 p-3 rounded-lg border border-amber-100/40">
                      {selectedComplaint.remedialAction || "Inspection and field action recommendations pending"}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
