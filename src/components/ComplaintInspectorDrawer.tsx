import React, { useState, useEffect } from "react";
import { 
  X, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  User, 
  Building, 
  CheckCircle, 
  Clock, 
  Copy, 
  ExternalLink, 
  ShieldAlert, 
  Activity, 
  Check, 
  Save, 
  Loader2,
  Lock,
  FileDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Complaint } from "../types";
import { supabase } from "../supabase";
import { generateComplaintPDF } from "../utils/pdfGenerator";

interface ComplaintInspectorDrawerProps {
  complaintId: string | null;
  onClose: () => void;
  onStatusUpdated?: (id: string, newStatus: Complaint["status"], resolutionNotes?: string) => void;
  isDemoMode: boolean;
}

export default function ComplaintInspectorDrawer({
  complaintId,
  onClose,
  onStatusUpdated,
  isDemoMode
}: ComplaintInspectorDrawerProps) {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [statusVal, setStatusVal] = useState<Complaint["status"]>("PENDING");
  const [notesVal, setNotesVal] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Load live complaint data (Supabase or Demo fallback)
  useEffect(() => {
    if (!complaintId) {
      setComplaint(null);
      return;
    }

    const fetchLiveDetails = async () => {
      setLoading(true);
      try {
        if (isDemoMode) {
          // Import/access DEMO_COMPLAINTS
          const { DEMO_COMPLAINTS } = await import("../mockData");
          const found = DEMO_COMPLAINTS.find(c => c.id === complaintId);
          if (found) {
            setComplaint(found);
            setStatusVal(found.status);
            setNotesVal(found.resolutionNotes || "");
          }
          setLoading(false);
          return;
        }

        // Live Supabase API Fetch Query
        const { data, error } = await supabase
          .from("complaints")
          .select("*")
          .eq("id", complaintId)
          .single();

        if (error) throw error;

        if (data) {
          const mapped: Complaint = {
            id: String(data.id),
            citizenName: data.citizen_name || data.citizenName || "Anonymous Citizen",
            issueType: data.issue_type || data.issueType || "Potholes",
            severityScore: Number(data.severity_score || data.severity || 50),
            riskScore: Number(data.risk_score || data.risk || 50),
            description: data.description || "",
            location: data.location || "Unknown Location, India",
            date: data.date || (data.created_at ? data.created_at.split("T")[0] : new Date().toISOString().split("T")[0]),
            status: data.status || "PENDING",
            latitude: Number(data.latitude) || 28.6139,
            longitude: Number(data.longitude) || 77.2090,
            department: data.department || "General Public Works Department",
            failureMode: data.failure_mode || data.failureMode || "Structural load fatigue",
            remedialAction: data.remedial_action || data.remedialAction || "Inspection scheduled.",
            dangers: Array.isArray(data.dangers) 
              ? data.dangers 
              : typeof data.dangers === "string" 
              ? JSON.parse(data.dangers) 
              : ["Local pedestrian transit hindrance"],
            highlightRegions: Array.isArray(data.highlight_regions)
              ? data.highlight_regions
              : typeof data.highlight_regions === "string"
              ? JSON.parse(data.highlight_regions)
              : [],
            imageUrl: data.image_url || data.imageUrl || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800",
            priority: data.priority || (Number(data.severity_score || data.severity) >= 80 ? "Critical" : "Medium"),
            resolutionNotes: data.resolution_notes || data.resolutionNotes || ""
          };
          setComplaint(mapped);
          setStatusVal(mapped.status);
          setNotesVal(mapped.resolutionNotes || "");
        }
      } catch (err: any) {
        console.warn("[DRAWER LIVE FETCH ERROR] Error fetching live record from Supabase:", err.message);
        // Fallback to active memory
        const { INITIAL_COMPLAINTS } = await import("../mockData");
        const fallback = INITIAL_COMPLAINTS.find(c => c.id === complaintId);
        if (fallback) {
          setComplaint(fallback);
          setStatusVal(fallback.status);
          setNotesVal(fallback.resolutionNotes || "");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLiveDetails();
  }, [complaintId, isDemoMode]);

  const handleCopyGps = () => {
    if (!complaint) return;
    navigator.clipboard.writeText(`${complaint.latitude}, ${complaint.longitude}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveStatus = async () => {
    if (!complaint) return;
    setSaving(true);
    try {
      if (!isDemoMode) {
        // Direct live Supabase sync
        const { error } = await supabase
          .from("complaints")
          .update({ 
            status: statusVal,
            resolution_notes: notesVal
          })
          .eq("id", complaint.id);

        if (error) throw error;
      }

      // Notify parent to synchronize global view feed in real-time
      if (onStatusUpdated) {
        onStatusUpdated(complaint.id, statusVal, notesVal);
      }

      // Local state update immediately
      setComplaint(prev => prev ? { ...prev, status: statusVal, resolutionNotes: notesVal } : null);
    } catch (err: any) {
      console.error("[DRAWER SYNC SAVE ERROR]", err.message);
      alert("Failed to save changes of the operation to live Supabase DB: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {complaintId && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 cursor-pointer"
          />

          {/* Drawer Sliding Sheet Container */}
          <motion.div
            initial={{ x: "100%", opacity: 0.95 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl md:max-w-2xl bg-[#0b0f19] text-slate-100 shadow-2xl border-l border-slate-800/80 z-50 overflow-hidden flex flex-col"
          >
            {/* Header Telemetry Bar */}
            <div className="p-5 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 tracking-wider uppercase bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    {loading ? "Syncing..." : complaint?.id || `TOKEN-${complaintId}`}
                  </span>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-bold ${
                    isDemoMode ? "bg-amber-400/5 border-amber-400/20 text-amber-300" : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                  }`}>
                    {isDemoMode ? "SIMULATED DATA" : "LIVE SUPABASE TABLE"}
                  </span>
                </div>
                <h3 className="text-base font-bold font-display text-white mt-1.5 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  Incident Inspection Center
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {complaint && !loading && (
                  <button
                    onClick={() => generateComplaintPDF(complaint)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase bg-indigo-650 hover:bg-indigo-600 text-white hover:scale-[1.01] active:scale-95 transition flex items-center gap-1.5 shadow-lg shadow-indigo-605/10 border border-indigo-505/20 cursor-pointer"
                    title="Export Formal Municipal PDF"
                  >
                    <FileDown className="w-3.5 h-3.5 animate-pulse" />
                    <span>Export PDF</span>
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl hover:bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center border border-transparent hover:border-slate-800 transition active:scale-95 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex-grow flex flex-col items-center justify-center space-y-4 p-8 text-center bg-slate-950/20">
                <Loader2 className="w-9 h-9 animate-spin text-amber-400" />
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Connecting to Core Database</h4>
                  <p className="text-slate-400 text-xs mt-1 max-w-xs">Retrieving full-scale telemetry rows and image overlays for #{complaintId}...</p>
                </div>
              </div>
            ) : complaint ? (
              <div className="flex-grow overflow-y-auto p-6 space-y-7 scrollbar-thin scrollbar-thumb-slate-800">
                
                {/* 1. Visual Defect Analysis (Top banner image with highlights) */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400 uppercase block">1. VISUAL ANALYTICAL ARTIFACT</span>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-56 group shadow-inner">
                    <img 
                      src={complaint.imageUrl || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800"} 
                      alt="Defect" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-all duration-300"
                    />
                    
                    {/* Visual Overlay Highlight Indicators */}
                    {complaint.highlightRegions && complaint.highlightRegions.map((region, idx) => (
                      <div 
                        key={idx}
                        className="absolute group/pin cursor-pointer"
                        style={{ left: `${region.x}%`, top: `${region.y}%` }}
                      >
                        <div className="relative flex items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-rose-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600 border border-white"></span>
                          
                          {/* Anchor Label Tag */}
                          <div className="absolute left-4 bg-slate-950/95 text-[10px] font-bold font-mono text-white border border-rose-500/40 px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-90 group-hover/pin:opacity-100 transition whitespace-nowrap">
                            {region.label}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300">
                      Telemetry Resolution Camera #Sentinel_{complaint.id}
                    </div>
                  </div>
                </div>

                {/* 2. Core Telemetry Split Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#121826]/70 p-4 rounded-xl border border-slate-800/70 space-y-1 text-center">
                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-widest">COGNITIVE SEVERITY</span>
                    <div className="text-2xl font-black text-rose-500 font-display flex items-center justify-center gap-1.5">
                      <ShieldAlert className="w-5 h-5 text-rose-600" />
                      {complaint.severityScore}/100
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-2">
                      <div 
                        className="bg-rose-500 h-full rounded-full" 
                        style={{ width: `${complaint.severityScore}%` }} 
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono block mt-1">Based on structural decay rate</span>
                  </div>

                  <div className="bg-[#121826]/70 p-4 rounded-xl border border-slate-800/70 space-y-1 text-center">
                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-widest">REGIONAL HAZARD RISK</span>
                    <div className="text-2xl font-black text-amber-500 font-display flex items-center justify-center gap-1.5">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      {complaint.riskScore}/100
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-2">
                      <div 
                        className="bg-amber-500 h-full rounded-full" 
                        style={{ width: `${complaint.riskScore}%` }} 
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono block mt-1">Public safety liability factor</span>
                  </div>
                </div>

                {/* 3. Narrative & Meta Context */}
                <div className="space-y-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800/50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest leading-none">Reporter Identity</div>
                      <h4 className="text-sm font-bold text-slate-200">{complaint.citizenName}</h4>
                    </div>
                    <div className="text-slate-400 text-xs font-mono flex items-center gap-1.5 bg-slate-950/60 border border-slate-800/50 px-2.5 py-1 rounded-lg">
                      <Calendar className="w-3.5 h-3.5" />
                      {complaint.date}
                    </div>
                  </div>

                  <div className="border-t border-slate-800/60 pt-3 space-y-1.5">
                    <div className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest font-bold">Defect Case Notes</div>
                    <p className="text-xs text-slate-350 leading-relaxed font-sans text-slate-300">
                      {complaint.description || "No supplemental descriptions was provided with this intake."}
                    </p>
                  </div>
                </div>

                {/* 4. Municipal Department Recommendation */}
                <div className="space-y-3.5 p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02]">
                  <div className="flex items-center gap-2">
                    <Building className="w-4.5 h-4.5 text-emerald-400" />
                    <span className="text-xs font-bold uppercase font-display tracking-wide text-emerald-400">Department Routing recommendation</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono uppercase">Assigned Authority</span>
                      <p className="font-bold text-slate-200">{complaint.department}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono uppercase">Priority Classification</span>
                      <p className={`font-bold uppercase ${
                        complaint.priority === "Critical" ? "text-rose-450 text-rose-500" :
                        complaint.priority === "High" ? "text-amber-500" : "text-blue-400"
                      }`}>{complaint.priority || "Medium"}</p>
                    </div>
                  </div>

                  {complaint.failureMode && (
                    <div className="border-t border-slate-800/50 pt-2.5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-500 font-mono uppercase">Failure Mechanics</span>
                        <p className="text-slate-300 font-sans italic">"{complaint.failureMode}"</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-500 font-mono uppercase">Engineering Remedial</span>
                        <p className="text-slate-300 font-sans italic">"{complaint.remedialAction}"</p>
                      </div>
                    </div>
                  )}

                  {complaint.dangers && complaint.dangers.length > 0 && (
                    <div className="border-t border-slate-800/50 pt-2.5 space-y-1.5">
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">SLA Safety Risks Stack</span>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {complaint.dangers.map((danger, idx) => (
                          <li key={idx} className="text-[11px] leading-relaxed font-sans">{danger}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 5. GIS Coordinates Position Tracker */}
                <div className="bg-[#121826]/70 p-4 rounded-xl border border-slate-800/80 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono uppercase tracking-wider font-bold">
                      <MapPin className="w-4 h-4" />
                      5. GPS GIS coordinates Layer
                    </div>
                    
                    <button 
                      onClick={handleCopyGps}
                      className="px-2.5 py-1 text-[10px] font-semibold rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/80 active:scale-95 transition flex items-center gap-1.5 border border-slate-700"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          Copied Coordinates
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy Clipboard
                        </>
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800/65">
                    <div>
                      <span className="text-slate-500 uppercase text-[9px] block">LATITUDE DECIMAL</span>
                      <span className="text-slate-200 font-bold text-xs">{complaint.latitude.toFixed(6)} N</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase text-[9px] block">LONGITUDE DECIMAL</span>
                      <span className="text-slate-200 font-bold text-xs">{complaint.longitude.toFixed(6)} E</span>
                    </div>
                  </div>
                </div>

                {/* 6. Live Status Progression timeline */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400 uppercase block">6. OPERATIONAL STATUS TIMELINE</span>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                    
                    {/* Step 1: PENDING */}
                    <div className="relative">
                      <span className={`absolute -left-[20px] top-1.5 w-3 h-3 rounded-full border-2 ${
                        complaint.status === "PENDING"
                          ? "bg-rose-500 border-white ring-4 ring-rose-500/20"
                          : "bg-slate-900 border-slate-700"
                      }`} />
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          Civic Intake Logged
                          {complaint.status !== "PENDING" && <CheckCircle className="w-3.5 h-3.5 text-slate-400" />}
                        </div>
                        <p className="text-[11px] text-slate-500">Citizen submitted defect online through the national portal.</p>
                      </div>
                    </div>

                    {/* Step 2: ASSIGNED */}
                    <div className="relative">
                      <span className={`absolute -left-[20px] top-1.5 w-3 h-3 rounded-full border-2 ${
                        complaint.status === "ASSIGNED"
                          ? "bg-blue-500 border-white ring-4 ring-blue-500/20"
                          : ["IN_PROGRESS", "RESOLVED"].includes(complaint.status)
                          ? "bg-slate-950 border-slate-450 bg-slate-650"
                          : "bg-slate-900 border-slate-850"
                      }`} />
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          Department Crew Dispatch Assigned
                          {["IN_PROGRESS", "RESOLVED"].includes(complaint.status) && <CheckCircle className="w-3.5 h-3.5 text-slate-400" />}
                        </div>
                        <p className="text-[11px] text-slate-500">Scheduled for field review. Contractor has been dispatched.</p>
                      </div>
                    </div>

                    {/* Step 3: IN_PROGRESS */}
                    <div className="relative">
                      <span className={`absolute -left-[20px] top-1.5 w-3 h-3 rounded-full border-2 ${
                        complaint.status === "IN_PROGRESS"
                          ? "bg-amber-500 border-white ring-4 ring-amber-500/20"
                          : complaint.status === "RESOLVED"
                          ? "bg-slate-950"
                          : "bg-slate-900 border-slate-805"
                      }`} />
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          Mitigation & Active Repair Active
                          {complaint.status === "RESOLVED" && <CheckCircle className="w-3.5 h-3.5 text-slate-400" />}
                        </div>
                        <p className="text-[11px] text-slate-500">Excavation, structural strengthening, or line fixes underway.</p>
                      </div>
                    </div>

                    {/* Step 4: RESOLVED */}
                    <div className="relative">
                      <span className={`absolute -left-[20px] top-1.5 w-3 h-3 rounded-full border-2 ${
                        complaint.status === "RESOLVED"
                          ? "bg-emerald-500 border-white ring-4 ring-emerald-500/20"
                          : "bg-slate-900 border-slate-700"
                      }`} />
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-200">
                          Audited & Certified Closed
                        </div>
                        <p className="text-[11px] text-slate-500">Civil engineer has inspected the quality. SLA terms closed.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. Operator Action Center (Interactive status updater & resolution notes) */}
                <div className="space-y-4 pt-5 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400 uppercase">7. OPERATOR ACTION TERMINAL</span>
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/90 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Modify Dispatch Status Stage</label>
                      <select
                        value={statusVal}
                        onChange={(e) => setStatusVal(e.target.value as Complaint["status"])}
                        className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 outline-none text-xs font-sans cursor-pointer"
                      >
                        <option value="PENDING">PENDING - Awaiting Action</option>
                        <option value="ASSIGNED">ASSIGNED - Crew Scheduled</option>
                        <option value="IN_PROGRESS">IN_PROGRESS - Excavation Active</option>
                        <option value="RESOLVED">RESOLVED - Quality Cleared</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Official Audit & Resolution Notes</label>
                      <textarea
                        value={notesVal}
                        onChange={(e) => setNotesVal(e.target.value)}
                        placeholder="Write dynamic civil closure notes, quality measurements, invoice reference code, or field surveyor comments..."
                        className="w-full bg-slate-950 text-slate-150 p-4 rounded-xl border border-slate-800 focus:border-amber-500 outline-none text-xs font-mono min-h-[90px] text-slate-200"
                      />
                    </div>

                    <button
                      onClick={handleSaveStatus}
                      disabled={saving}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-slate-800 disabled:to-slate-850 text-slate-950 disabled:text-slate-500 rounded-xl text-xs font-extrabold uppercase tracking-widest transition active:scale-98 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          SYNCING TO DATA CORE...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          SUBMIT WORKFLOW CHANGE
                        </>
                      )}
                    </button>
                    
                    {!isDemoMode && (
                      <p className="text-[10px] text-slate-400 font-mono italic text-center flex items-center justify-center gap-1.5 pt-1">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        This transaction propagates live to your PostgreSQL backend schemas.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center text-slate-400 p-8 text-center text-xs">
                No active details available.
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
