import React, { useState } from "react";
import { Complaint } from "../types";
import {
  Activity,
  AlertOctagon,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  Loader2
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import EmergencyAlerts from "./EmergencyAlerts";

interface CommandDashboardProps {
  complaints: Complaint[];
  onUpdateStatus: (id: string, nextStatus: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED") => void;
  stats: {
    totalComplaints: number;
    pendingComplaints: number;
    resolvedComplaints: number;
    healthIndex: number;
    predictedFailures: number;
  };
  onSelectComplaint?: (id: string) => void;
}

export default function CommandDashboard({
  complaints,
  onUpdateStatus,
  stats,
  onSelectComplaint
}: CommandDashboardProps) {
  // Search and Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [auditStatus, setAuditStatus] = useState<"idle" | "generating" | "success">("idle");

  const handleExportAudit = () => {
    setAuditStatus("generating");
    setTimeout(() => {
      setAuditStatus("success");
      setTimeout(() => {
        setAuditStatus("idle");
      }, 3000);
    }, 1500);
  };
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesType = typeFilter === "ALL" || c.issueType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate issue distribution metrics for the Recharts visualization
  const categories = ["Potholes", "Leakage", "Garbage", "Street Light"];
  const chartData = categories.map((cat) => {
    const count = complaints.filter((c) => c.issueType === cat).length;
    return { name: cat, count };
  });

  const COLORS = ["#002970", "#3b82f6", "#22c55e", "#f59e0b"];

  return (
    <div className="space-y-8">
      {/* Dynamic Summary Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-deep">Government Command Center Console</h2>
          <p className="text-slate-500 text-sm font-sans mt-0.5">
            Synchronized with Metropolitan Telemetry. Real-time logging of citizen complaints, spatial hazards, and emergency municipal dispatch queues.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-brand-medium font-mono font-bold text-xs flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            LIVE FEED SPEED: 0.8s
          </div>
          <button
            onClick={handleExportAudit}
            disabled={auditStatus !== "idle"}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
              auditStatus === "success" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-850 text-emerald-800" 
                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
            }`}
          >
            {auditStatus === "generating" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-medium" />
                Generating...
              </>
            ) : auditStatus === "success" ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                Audit Exported!
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                Export Audit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Emergency Alert Module Box (Risk > 90 and Severity > 90) */}
      <EmergencyAlerts 
        complaints={complaints} 
        onSelectComplaint={onSelectComplaint} 
        onUpdateStatus={onUpdateStatus} 
      />

      {/* Stats Cards Bento Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total complaints log */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Total Filed Log</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-black text-slate-900">{stats.totalComplaints}</span>
            <span className="text-xs text-brand-medium font-bold font-mono">COMP</span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans leading-none">Registered citizen alerts</p>
        </div>

        {/* Pending complaints log */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Awaiting Dispatch</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-black text-red-650 text-red-600">{stats.pendingComplaints}</span>
            <span className="text-xs text-red-500 font-mono flex items-center gap-0.5 font-bold">
              <Clock className="w-3 h-3" />
              SLA
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans leading-none">Unresolved potholes & leaks</p>
        </div>

        {/* Resolved complaints log */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Mitigated Solved</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-black text-emerald-600">{stats.resolvedComplaints}</span>
            <span className="text-xs text-emerald-500 font-mono font-bold flex items-center gap-0.5">
              <CheckCircle className="w-3 h-3" />
              100%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans leading-none font-medium">Verified by civil audit</p>
        </div>

        {/* Critical Areas */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Critical Hazard Zones</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-black text-slate-900">{stats.predictedFailures}</span>
            <span className="text-xs text-red-500 font-mono font-bold">WARNING</span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans leading-none">Pavements & bridges scanned</p>
        </div>

        {/* Infrastructure Health index widget */}
        <div className="bg-gradient-to-br from-brand-deep to-brand-primary text-white rounded-2xl p-5 border border-blue-900/40 space-y-2 lg:col-span-1">
          <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest block font-mono">Infra Health Index</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-black text-amber-300">{stats.healthIndex}%</span>
            <span className="text-xs text-emerald-400 font-semibold font-mono flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +2.4%
            </span>
          </div>
          <div className="h-1.5 w-full bg-blue-950/60 rounded-full overflow-hidden">
            <div style={{ width: `${stats.healthIndex}%` }} className="h-full bg-amber-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Table & Small Visual Chart) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Table list box - span 8 columns */}
        <div className="xl:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">Incident Intake Registry</h3>
              <p className="text-xs text-slate-500 mt-0.5">Filter, search, or alter dispatch statuses of filed reports globally.</p>
            </div>

            {/* Quick Count Badge */}
            <span className="text-[10px] font-bold text-brand-medium bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
              Displaying {filteredComplaints.length} Records
            </span>
          </div>

          {/* Filtering & Search Row bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search location, IDs, citizen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:ring-1 focus:ring-brand-medium"
              />
            </div>

            {/* Status Selective Filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Filter className="w-3.5 h-3.5" />
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:ring-1 focus:ring-brand-medium bg-white cursor-pointer"
              >
                <option value="ALL">All Workflow Statuses</option>
                <option value="PENDING">PENDING (Awaiting dispatch)</option>
                <option value="ASSIGNED">ASSIGNED (Crew assigned)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Work started)</option>
                <option value="RESOLVED">RESOLVED (Audited & Closed)</option>
              </select>
            </div>

            {/* Category Selective Filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Filter className="w-3.5 h-3.5" />
              </span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 outline-none focus:ring-1 focus:ring-brand-medium bg-white cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="Potholes">Potholes & Asphalt</option>
                <option value="Leakage">Water Pipe Leakage</option>
                <option value="Garbage">Garbage Accumulations</option>
                <option value="Street Light">Streetlight Power Lines</option>
              </select>
            </div>
          </div>

          {/* Table Visor */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-600 font-semibold">
                  <th className="p-4 uppercase tracking-wider text-[10px] font-mono">Token ID</th>
                  <th className="p-4 uppercase tracking-wider text-[10px]">Description & Location</th>
                  <th className="p-4 uppercase tracking-wider text-[10px]">Category</th>
                  <th className="p-4 uppercase tracking-wider text-[10px] text-center">Severity</th>
                  <th className="p-4 uppercase tracking-wider text-[10px]/none">Workflow status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No matching integrated complaints logged matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-indigo-50/15 transition duration-150">
                      
                      {/* ID with citizen tag */}
                      <td 
                        onClick={() => onSelectComplaint?.(c.id)}
                        className="p-4 align-top cursor-pointer group-hover:text-indigo-600 transition-colors"
                        title="Click to inspect full details"
                      >
                        <span className="font-mono font-bold text-brand-medium block hover:underline">{c.id}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[80px]">By {c.citizenName}</span>
                      </td>

                      {/* Location and description snippet */}
                      <td 
                        onClick={() => onSelectComplaint?.(c.id)}
                        className="p-4 max-w-xs xl:max-w-md cursor-pointer transition-colors"
                        title="Click to inspect full details"
                      >
                        <div className="flex items-center gap-1 font-semibold text-slate-900 leading-snug">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{c.location}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {c.description}
                        </p>
                        {c.resolutionNotes && (
                          <div className="mt-1.5 flex items-start gap-1 bg-emerald-50 border border-emerald-100 p-1.5 rounded-lg text-[10px] text-emerald-800 font-sans">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1 italic">Resolution Notes: {c.resolutionNotes}</span>
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 inline-flex items-center gap-1 mt-1.5 font-mono">
                          <Calendar className="w-3 h-3" />
                          {c.date}
                        </span>
                      </td>

                      {/* Issue category badge */}
                      <td 
                        onClick={() => onSelectComplaint?.(c.id)}
                        className="p-4 align-middle cursor-pointer transition-colors"
                        title="Click to inspect full details"
                      >
                        <span className="font-medium text-slate-900 block">{c.issueType}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight truncate max-w-[120px]">{c.department.split(" ").slice(0,3).join(" ")}...</span>
                      </td>

                      {/* Severity Score layout */}
                      <td 
                        onClick={() => onSelectComplaint?.(c.id)}
                        className="p-4 align-middle text-center font-mono cursor-pointer transition-colors"
                        title="Click to inspect full details"
                      >
                        <div className="inline-flex flex-col items-center">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            c.severityScore >= 80
                              ? "bg-rose-50 text-rose-700 border border-rose-100"
                              : c.severityScore >= 60
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                            {c.severityScore}/100
                          </span>
                        </div>
                      </td>

                      {/* Status modifier buttons queue */}
                      <td className="p-4 align-middle">
                        <div className="space-y-2">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg border ${
                            c.status === "RESOLVED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : c.status === "IN_PROGRESS"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : c.status === "ASSIGNED"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}>
                            {c.status}
                          </span>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {c.status === "PENDING" && (
                              <button
                                onClick={() => onUpdateStatus(c.id, "ASSIGNED")}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white font-mono active:scale-95 transition cursor-pointer"
                              >
                                ASSIGN_CREW
                              </button>
                            )}
                            {c.status === "ASSIGNED" && (
                              <button
                                onClick={() => onUpdateStatus(c.id, "IN_PROGRESS")}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono active:scale-95 transition cursor-pointer"
                              >
                                START_CREW
                              </button>
                            )}
                            {c.status === "IN_PROGRESS" && (
                              <button
                                onClick={() => onUpdateStatus(c.id, "RESOLVED")}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white font-mono active:scale-95 transition cursor-pointer"
                              >
                                RESOLVE_AUDIT
                              </button>
                            )}
                            {c.status === "RESOLVED" && (
                              <button
                                onClick={() => onUpdateStatus(c.id, "PENDING")}
                                className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 font-mono active:scale-95 transition cursor-pointer"
                              >
                                REOPEN_LOG
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Category Distribution visual and helpful widgets (Right column - 4 columns) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wider">Defect Share Index</h3>
              <p className="text-xs text-slate-500 mt-0.5">Live distribution of reported failures by asset type.</p>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", borderRadius: "8px", border: "none", color: "#fff", fontSize: "11px" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={30}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Fast Stats Details */}
            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs font-sans">
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Potholes (High Share):</span>
                <span className="font-bold text-brand-deep">
                  {complaints.filter((c) => c.issueType === "Potholes").length} cases
                </span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Pipeline Leakage:</span>
                <span className="font-bold text-blue-600">
                  {complaints.filter((c) => c.issueType === "Leakage").length} cases
                </span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Waste/Garbage Blockage:</span>
                <span className="font-bold text-emerald-600">
                  {complaints.filter((c) => c.issueType === "Garbage").length} cases
                </span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Streetlight Outage:</span>
                <span className="font-bold text-amber-600">
                  {complaints.filter((c) => c.issueType === "Street Light").length} cases
                </span>
              </div>
            </div>
          </div>

          {/* Quick Alert notification widget */}
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/50 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-display font-black text-xs">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
              SLA VIOLATION EXPOSURE MONITOR
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed font-sans">
              The Sentinel dispatch agent has caught <span className="font-bold">{complaints.filter((c) => c.status === "PENDING" && c.severityScore >= 80).length} pending critical-severity cases</span> overflowing engineering targets. Immediate action is recommended to mitigate regional liability.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
