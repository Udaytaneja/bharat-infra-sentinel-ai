import React, { useState, useRef } from "react";
import { Upload, MapPin, CheckCircle, Navigation, Loader2 } from "lucide-react";
import { Complaint } from "../types";
import { supabase } from "../supabase";
import { getDepartmentForIssue } from "../utils";

// Pre-seeded sample images that citizens can select if they don't have their own pothole photos!
const SAMPLE_REPORTS = [
  {
    name: "Severe Asphalt Pothole",
    type: "Potholes",
    description: "Multi-layered pavement fatigue crater along the turning path. Severe suspension damage concern.",
    url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800",
    lat: 28.5934,
    lng: 77.2272,
    location: "Lodi Road Sector 4, New Delhi"
  },
  {
    name: "Pipeline Sidewalk Water Leak",
    type: "Leakage",
    description: "High volume drinking water line leakage breaking out through pave concrete joints, creating soil sinkhole.",
    url: "https://images.unsplash.com/photo-1542013936693-8848e5744431?q=80&w=800",
    lat: 19.0760,
    lng: 72.8777,
    location: "SV Road Bandra Metro Crossing, Mumbai"
  },
  {
    name: "High-Traffic Pedestrian Blackout Corridor",
    type: "Street Light",
    description: "A continuous row of high pressure sodium vapor streetlights are down, casting a dark shadow over the zebra crossing.",
    url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=800",
    lat: 12.9716,
    lng: 77.5946,
    location: "Commercial Street Pedestrian Walkway, Bengaluru"
  },
  {
    name: "Illegal Curb Waste Encroachment",
    type: "Garbage",
    description: "Massive pile of commercial and wet organic trash piled directly onto the main water intake drain.",
    url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=800",
    lat: 17.3850,
    lng: 78.4867,
    location: "General Bazaar, Secunderabad, Hyderabad"
  }
];

interface CitizenReportingProps {
  onComplaintSubmitted: () => void;
}

export default function CitizenReporting({ onComplaintSubmitted }: CitizenReportingProps) {
  // Form State
  const [citizenName, setCitizenName] = useState("");
  const [issueType, setIssueType] = useState<"Potholes" | "Leakage" | "Garbage" | "Street Light">("Potholes");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("28.6139");
  const [longitude, setLongitude] = useState("77.2090");
  
  // File Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  
  // Submission Actions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<"analyzing" | "saving" | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect Coordinates with Geolocation API
  const handleAutoLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(6));
          setLongitude(pos.coords.longitude.toFixed(6));
          setLocationName(locationName || `Auto-located Coordinates (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        },
        (err) => {
          alert(`Could not retrieve geolocation data: ${err.message}. Defaulting to Delhi NCR.`);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser software.");
    }
  };

  // Convert files to base64
  const processFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Select Sample report shortcut
  const handleSelectSample = (sample: typeof SAMPLE_REPORTS[0]) => {
    setIssueType(sample.type as any);
    setDescription(sample.description);
    setLocationName(sample.location);
    setLatitude(sample.lat.toString());
    setLongitude(sample.lng.toString());
    setImagePreview(sample.url);
    setImageBase64(sample.url); // The backend handler will treat this fallback nicely or can use it!
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !locationName) {
      setSubmissionError("Please fill in the incident description and geographical location.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionStep("analyzing");
    setSubmissionError(null);

    console.log("[SUBMIT FLOW] Starting Citizen Portal submission...");
    console.log("[SUBMIT FLOW] 1. FORM DATA BEING SUBMITTED:", {
      citizenName,
      issueType,
      description,
      locationName,
      latitude,
      longitude,
      imagePreview,
      hasImageBase64: !!imageBase64
    });

    try {
      // Step A: Perform server-side AI evaluation on image to fetch scores, recommended department, etc.
      console.log("[SUBMIT FLOW] Step 1: Requesting AI analysis via /api/analyze-complaint...");
      const analysisResponse = await fetch("/api/analyze-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueType,
          description,
          imageBase64: imageBase64.startsWith("data:image") ? imageBase64 : undefined // Only send fully encoded local base64 files
        })
      });

      if (!analysisResponse.ok) {
        throw new Error(`AI Analysis server returned failure: ${analysisResponse.statusText} (${analysisResponse.status})`);
      }

      const aiAnalysisResult = await analysisResponse.json();
      console.log("[SUBMIT FLOW] Step 1 Complete: AI Analysis response received:", aiAnalysisResult);

      const complaintId = `COMP-${Math.floor(100 + Math.random() * 900)}`;

      // Construct payload matching exact snake_case columns
      const payload: any = {
        issue_type: issueType,
        severity: Number(aiAnalysisResult.severityScore) || 50,
        description: description,
        latitude: Number(latitude),
        longitude: Number(longitude),
        image_url: imagePreview || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800",
        status: "PENDING",
        risk_score: Number(aiAnalysisResult.riskScore) || 50,
        department: getDepartmentForIssue(issueType)
      };

      setSubmissionStep("saving");
      console.log("[SUBMIT FLOW] Step 2: Formulated insert payload for complaints table:", JSON.stringify(payload, null, 2));

      console.log("[SUBMIT FLOW] Step 3: Inserting record directly into Supabase complaints table...");
      const { data, error } = await supabase
        .from("complaints")
        .insert([payload])
        .select();

      console.log("[SUBMIT FLOW] 2. SUPABASE INSERT RESPONSE:", data);
      console.error("[SUBMIT FLOW] 3. SUPABASE ERROR OBJECT:", error);

      if (error) {
        console.error("[SUBMIT FLOW] Supabase direct insert returned an error code:", error);
        const detailedErrorMsg = `PostgREST ${error.code || "Error"}: ${error.message}${error.hint ? ` | Hint: ${error.hint}` : ""}${error.details ? ` | Details: ${error.details}` : ""}`;
        setSubmissionError(detailedErrorMsg);
        throw new Error(detailedErrorMsg);
      }

      console.log("[SUBMIT FLOW] Step 4: Database write success! Returned rows representation:", data);
      
      const savedRow = (data && data[0]) ? data[0] : payload;
      const finalId = savedRow.id || complaintId;

      setSubmittedId(String(finalId));
      
      // Keep UI state mapped in CamelCase for local completion cards rendering
      setAnalysisResult({
        id: String(finalId),
        citizenName: citizenName.trim() || "Anonymous Citizen",
        issueType: payload.issue_type,
        severityScore: payload.severity,
        riskScore: payload.risk_score,
        description: payload.description,
        location: locationName,
        imageUrl: payload.image_url,
        status: payload.status,
        latitude: payload.latitude,
        longitude: payload.longitude,
        department: getDepartmentForIssue(payload.issue_type),
        failureMode: aiAnalysisResult.failureMode || "General structural failure",
        remedialAction: aiAnalysisResult.remedialAction || "Standard patch repair",
        priority: aiAnalysisResult.priority || "Medium",
        dangers: Array.isArray(aiAnalysisResult.dangers) ? aiAnalysisResult.dangers : [],
        highlightRegions: Array.isArray(aiAnalysisResult.highlightRegions) ? aiAnalysisResult.highlightRegions : []
      });

      setIsSuccess(true);
      console.log("[SUBMIT FLOW] Step 5: Updating parent app state callbacks...");
      onComplaintSubmitted();
      console.log("[SUBMIT FLOW] Submission complete!");
    } catch (err: any) {
      console.error("[SUBMIT FLOW] Caught exception in submission pipeline:", err);
      console.error("[SUBMIT FLOW] 4. ANY EXCEPTION STACK TRACE:", err?.stack || "No call-stack available", err);
      if (!submissionError) {
        setSubmissionError(err?.message || String(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setCitizenName("");
    setIssueType("Potholes");
    setDescription("");
    setLocationName("");
    setLatitude("28.6139");
    setLongitude("77.2090");
    setImageFile(null);
    setImagePreview("");
    setImageBase64("");
    setIsSuccess(false);
    setAnalysisResult(null);
    setSubmissionError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Portal Form column */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-deep">Citizen Incident Reporting</h2>
          <p className="text-slate-500 font-sans text-sm mt-1">
            Submit local infrastructure defects directly to district engineers. Our Sentinel AI immediately analyzes, classifies, and alerts relevant departments.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">Complaint Registered Successfully</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your report has been received and indexed under ID <span className="font-mono font-semibold text-brand-medium">{submittedId}</span>. The Sentinel AI agent has routed dispatch coordinates to the engineering department.
            </p>

            {analysisResult && (
              <div className="mt-6 text-left border border-slate-200 rounded-2xl bg-slate-50 p-5 sm:p-6 space-y-4 shadow-sm max-w-xl mx-auto">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="font-display font-bold text-slate-800 text-sm">Sentinel AI Real-Time Analysis</span>
                  <span className="inline-flex px-2 py-0.5 text-[10px] uppercase font-mono font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ANALYSIS_COMPLETE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">1. Issue Type</span>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{analysisResult.issueType}</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">5. Priority Level</span>
                    <p className={`text-sm font-bold mt-1 ${
                      String(analysisResult.priority).toLowerCase() === "critical"
                        ? "text-red-650 font-extrabold"
                        : String(analysisResult.priority).toLowerCase() === "high"
                        ? "text-amber-600"
                        : "text-blue-600"
                    }`}>
                      {analysisResult.priority || "Medium"}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">2. Severity Score (0-100)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-mono font-bold text-slate-805">{analysisResult.severityScore}/100</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${analysisResult.severityScore}%` }}
                          className="h-full bg-rose-500 rounded-full"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">3. Risk Score (0-100)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-mono font-bold text-slate-805">{analysisResult.riskScore}/100</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${analysisResult.riskScore}%` }}
                          className="h-full bg-amber-500 rounded-full"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">4. Recommended Department</span>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{analysisResult.department || analysisResult.recommendedDepartment || "General Municipal Services"}</p>
                </div>

                {analysisResult.failureMode && (
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Technical Failure Mode Diagnosis</span>
                    <p className="text-xs font-mono text-slate-600 mt-1 italic">"{analysisResult.failureMode}"</p>
                  </div>
                )}

                {analysisResult.remedialAction && (
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Proposed Remedial Action Crew Blueprint</span>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{analysisResult.remedialAction}</p>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-medium transition-all cursor-pointer"
              >
                Submit Another Report
              </button>
            </div>
          </div>
        ) : isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-amber-500 rounded-full animate-spin"></div>
              <Loader2 className="w-6 h-6 animate-spin text-brand-medium absolute" />
            </div>
            
            <div className="space-y-4 text-center max-w-sm">
              <h3 className="font-display font-semibold text-lg text-slate-800">Processing Incident Report</h3>
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3 font-sans">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500 font-mono">OPERATIONAL_PIPELINE:</span>
                  <span className="text-[10px] font-mono font-bold text-brand-medium uppercase">SENTINEL_AI_v4</span>
                </div>
                
                <div className="border-t border-slate-200 pt-3 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                      submissionStep === "analyzing" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                    }`}>
                      {submissionStep === "analyzing" ? "●" : "✓"}
                    </span>
                    <span className={submissionStep === "analyzing" ? "text-amber-700 font-bold" : "text-slate-400 font-medium"}>
                      Analyzing image...
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                      submissionStep === "saving" ? "bg-amber-500 animate-pulse" : submissionStep === "analyzing" ? "bg-slate-200 text-slate-400" : "bg-emerald-500"
                    }`}>
                      {submissionStep === "saving" ? "●" : ""}
                    </span>
                    <span className={submissionStep === "saving" ? "text-amber-700 font-bold" : "text-slate-400 font-medium"}>
                      Saving complaint...
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-450 text-slate-400 font-sans leading-relaxed">
                Bharat Infra Server is performing deep visual analysis, safety risk predictions and routing databases.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {submissionError && (
              <div id="sup-error-container" className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 space-y-2.5 shadow-sm">
                <div className="flex items-center gap-1.5 font-bold text-rose-900 font-mono">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                  <span>SUPABASE TRANSACTION FAILURE</span>
                </div>
                <p className="font-sans leading-relaxed text-[11px] text-rose-700">
                  An error occurred while inserting the incident into the Supabase database. This usually indicates mismatching columns, constraints, or permission rules (e.g., Row Level Security).
                </p>
                <div className="bg-slate-900 text-rose-300 p-3 rounded-lg font-mono text-[10px] leading-normal break-all whitespace-pre-wrap overflow-y-auto max-h-40 border border-rose-950">
                  {submissionError}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-rose-600 leading-normal bg-rose-100/50 p-2 rounded-md">
                  <span>💡</span>
                  <span className="font-sans font-medium">Verify that the complaints table contains exactly our mapped columns and that Row Level Security (RLS) is disabled or permits anonymous inserts.</span>
                </div>
              </div>
            )}
            
            {/* Optional Citizen Name */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">Your Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Rahul Verma"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-medium text-sm transition"
              />
            </div>

            {/* Grid for Dropdown and coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">Defect Category</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-medium text-sm bg-white cursor-pointer transition"
                >
                  <option value="Potholes">Potholes & Asphalt Cracks</option>
                  <option value="Leakage">Water Pipe Leakage/Burst</option>
                  <option value="Garbage">Ad-hoc Garbage Heap</option>
                  <option value="Street Light">Streetlight Power Outage</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">Geographic Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ring Road, Phase 2, Near ATM"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-medium text-sm transition"
                />
              </div>
            </div>

            {/* Latitude and Longitude Column */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Coordinates (GPs Marker)</span>
                <button
                  type="button"
                  onClick={handleAutoLocate}
                  className="inline-flex items-center gap-1.5 text-xs text-brand-medium hover:text-brand-primary active:scale-95 font-semibold transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Auto-Detect GPS
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-mono block mb-0.5">LATITUDE</label>
                  <input
                    type="text"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-xs focus:ring-1 focus:ring-brand-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-mono block mb-0.5">LONGITUDE</label>
                  <input
                    type="text"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-xs focus:ring-1 focus:ring-brand-medium"
                  />
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">Incident Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe structural failure context, traffic hazards, size/scope of issue, or threat risks to pedestrians..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-medium text-sm transition"
              />
            </div>

            {/* Advanced File Upload (Drag and drop) */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase block mb-2">Upload Visual Evidence (Image)</label>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 select-none ${
                  dragging ? "border-brand-medium bg-blue-50/50" : "border-slate-200 hover:border-brand-medium bg-slate-50/30"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative w-full max-h-48 rounded-lg overflow-hidden border border-slate-100 flex justify-center bg-slate-900">
                    <img
                      src={imagePreview}
                      alt="Precise preview of uploaded issue"
                      className="object-contain max-h-48"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview("");
                        setImageBase64("");
                      }}
                      className="absolute top-2 right-2 px-2.5 py-1 text-xs bg-red-650 hover:bg-red-700 bg-red-600 text-white font-semibold rounded-lg shadow"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Drag & Drop Image Here, or click to browse</span>
                    <span className="text-xs text-slate-400 font-sans">Supports image logs (JPEG, PNG, WEBP)</span>
                  </>
                )}
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-brand-primary hover:bg-brand-medium transition shadow-lg shadow-blue-900/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Bharat Infra AI Evaluating Defect Structural Integrity...
                </>
              ) : (
                <>
                  Submit Complaint to Sentinel AI
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Shortcuts/Samples column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-gradient-to-br from-brand-deep to-brand-primary text-white p-6 rounded-2xl border border-blue-900/40 space-y-4">
          <h3 className="font-display font-bold text-lg text-amber-300">Fast Demo Presets</h3>
          <p className="text-xs text-blue-100 font-sans leading-relaxed">
            No local defect image handy? Click any of our Indian municipal sample presets below. This will auto-configure coordinates, image evidence, and issue descriptions instantly for high-fidelity evaluation.
          </p>
          
          <div className="space-y-3 pt-2">
            {SAMPLE_REPORTS.map((sample, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className="p-3 bg-white/5 hover:bg-white/10 active:scale-[0.98] rounded-xl border border-white/10 flex items-center gap-3 cursor-pointer transition"
              >
                <div className="w-12 h-12 rounded-lg bg-slate-900 overflow-hidden flex-shrink-0">
                  <img src={sample.url} alt={sample.name} className="object-cover w-full h-full" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{sample.name}</div>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5">{sample.type}</div>
                  <div className="text-[10px] text-blue-200 truncate flex items-center gap-0.5 mt-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    {sample.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl space-y-3">
          <h4 className="font-display font-bold text-amber-900 text-sm">Citizen Empowerment Charter</h4>
          <p className="text-xs text-amber-800 leading-relaxed font-sans">
            Bharat Infra Sentinel operates continuous SLA monitoring. Once a citizen files a complaint, the system establishes a digital tracking token. In-grade repair crews are dispatched with automated work orders, tracking metrics and logging target hours.
          </p>
        </div>
      </div>
    </div>
  );
}
