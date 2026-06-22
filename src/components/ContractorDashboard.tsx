import React, { useState, useMemo } from "react";
import { Complaint } from "../types";
import {
  Wrench,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  ShieldCheck,
  TrendingUp,
  Mail,
  User,
  Filter,
  ArrowUpDown,
  Building2,
  ListTodo
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  Cell
} from "recharts";

interface ContractorDashboardProps {
  complaints: Complaint[];
  onSelectComplaint?: (id: string) => void;
}

interface Contractor {
  id: string;
  name: string;
  department: string;
  assignedCategory: "Potholes" | "Leakage" | "Garbage" | "Street Light";
  baseProjects: number;
  avgResolutionTime: number; // in days
  historicalSla: number; // %
  rating: number; // stars out of 5
  contactEmail: string;
  leader: string;
}

const CONTRACTORS: Contractor[] = [
  {
    id: "CONT-201",
    name: "Rajput Infrastructure Pvt. Ltd.",
    department: "Road Maintenance",
    assignedCategory: "Potholes",
    baseProjects: 38,
    avgResolutionTime: 2.4,
    historicalSla: 94.2,
    rating: 4.8,
    contactEmail: "ops@rajputinfra.in",
    leader: "Vikram Singh Rajput"
  },
  {
    id: "CONT-202",
    name: "Delhi Water Tech Solutions",
    department: "Water Department",
    assignedCategory: "Leakage",
    baseProjects: 24,
    avgResolutionTime: 3.1,
    historicalSla: 89.5,
    rating: 4.2,
    contactEmail: "service@delhiwatertech.com",
    leader: "Dr. Alok Verma"
  },
  {
    id: "CONT-203",
    name: "Green & Clean Waste Management",
    department: "Sanitation",
    assignedCategory: "Garbage",
    baseProjects: 52,
    avgResolutionTime: 1.8,
    historicalSla: 96.0,
    rating: 4.9,
    contactEmail: "intake@greencleanwm.org",
    leader: "Smt. Sunita Rao"
  },
  {
    id: "CONT-204",
    name: "BrightLite Electricals Corp",
    department: "Electrical",
    assignedCategory: "Street Light",
    baseProjects: 29,
    avgResolutionTime: 4.2,
    historicalSla: 78.3,
    rating: 3.5,
    contactEmail: "escalations@brightlitecorp.com",
    leader: "Rajesh K. Gupta"
  }
];

export default function ContractorDashboard({ complaints, onSelectComplaint }: ContractorDashboardProps) {
  const [selectedContractorId, setSelectedContractorId] = useState<string>("CONT-201");
  const [sortField, setSortField] = useState<keyof Contractor>("historicalSla");
  const [sortAscending, setSortAscending] = useState<boolean>(false);

  // Derive dynamic metrics per contractor based on the real complaints array
  const contractorsData = useMemo(() => {
    return CONTRACTORS.map(contractor => {
      // Find complaints assigned to this contractor's category
      const assignedComplaints = complaints.filter(
        c => c.issueType === contractor.assignedCategory
      );

      const pending = assignedComplaints.filter(c => c.status !== "RESOLVED").length;
      const completed = assignedComplaints.filter(c => c.status === "RESOLVED").length;
      const total = assignedComplaints.length;

      // Adjust SLA compliance slightly based on pending high-severity/unresolved counts
      const activeOverdue = assignedComplaints.filter(
        c => c.status !== "RESOLVED" && c.severityScore >= 80
      ).length;
      
      let currentSla = contractor.historicalSla;
      if (activeOverdue > 0) {
        currentSla = Math.max(60, Number((contractor.historicalSla - activeOverdue * 1.5).toFixed(1)));
      }

      return {
        ...contractor,
        activePending: pending,
        activeCompleted: completed,
        totalActiveProjects: total,
        currentSla,
        complaintsList: assignedComplaints
      };
    });
  }, [complaints]);

  // Sort logic for detailed table list
  const sortedContractors = useMemo(() => {
    return [...contractorsData].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAscending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortAscending ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [contractorsData, sortField, sortAscending]);

  // Currently active contractor for inspection
  const selectedContractor = useMemo(() => {
    return contractorsData.find(c => c.id === selectedContractorId) || contractorsData[0];
  }, [contractorsData, selectedContractorId]);

  // Main KPI values
  const totalCompletedBase = useMemo(() => {
    return contractorsData.reduce((acc, c) => acc + c.baseProjects + c.activeCompleted, 0);
  }, [contractorsData]);

  const activeBacklog = useMemo(() => {
    return contractorsData.reduce((acc, c) => acc + c.activePending, 0);
  }, [contractorsData]);

  const avgSla = useMemo(() => {
    const sum = contractorsData.reduce((acc, c) => acc + c.currentSla, 0);
    return Number((sum / contractorsData.length).toFixed(1));
  }, [contractorsData]);

  const toggleSort = (field: keyof Contractor) => {
    if (sortField === field) {
      setSortAscending(!sortAscending);
    } else {
      setSortField(field);
      setSortAscending(false);
    }
  };

  return (
    <div className="space-y-6" id="contractor-dashboard-stage">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold font-mono tracking-wider text-brand-medium uppercase block">
            MUNICIPAL PUBLIC WORKS ASSURANCE
          </span>
          <h2 className="font-display font-black text-slate-800 text-2xl mt-1">
            Contractor Performance Monitor
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Audit compliance indices, SLA response times, and live project resolution matrices.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-105">
          <ShieldCheck className="w-4 h-4 text-brand-medium" />
          <span>SLA TARGET CONTRACT LIMIT: 85% Conformance</span>
        </div>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 padding-5 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-mono uppercase">Assigned Contractors</span>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-display font-extrabold text-slate-800">{contractorsData.length}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Primary regional work units active</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 padding-5 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-mono uppercase">Cumulative Workorders</span>
            <div className="p-2 bg-brand-light text-brand-medium rounded-lg border border-brand-light/30">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-display font-extrabold text-slate-800">{totalCompletedBase}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Historic and newly resolved tasks</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 padding-5 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-mono uppercase">Active Desk Backlog</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-display font-extrabold text-amber-600">{activeBacklog}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Current unresolved in-flight issues</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-203 padding-5 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-mono uppercase">System Average SLA</span>
            <div className="p-2 bg-emerald-50 text-emerald-605 rounded-lg border border-emerald-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className={`text-2xl font-display font-extrabold ${avgSla >= 85 ? "text-emerald-700" : "text-amber-600"}`}>
              {avgSla}%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Aggregate regional performance index</p>
          </div>
        </div>
      </div>

      {/* Charts Center (Recharts Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm">SLA Conformance vs Policy Target</h3>
            <p className="text-xs text-slate-500 mt-0.5">Red line represents the municipal 85% strict threshold</p>
          </div>
          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contractorsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickFormatter={(name) => name.split(" ")[0]} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "11px" }} 
                  formatter={(value) => [`${value}% SLA Conformance`, "SLA Compliant"]} 
                />
                <Bar dataKey="currentSla" radius={[4, 4, 0, 0]}>
                  {contractorsData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.currentSla >= 85 ? "#10b981" : entry.currentSla >= 80 ? "#f59e0b" : "#ef4444"} 
                    />
                  ))}
                </Bar>
                <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "85% SLA Target", fill: "#ef4444", fontSize: 9, position: "top" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Resolution Time Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm">Average Resolution Latency (Days)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Fewer transit hours represents higher responsive efficiency</p>
          </div>
          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contractorsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickFormatter={(name) => name.split(" ")[0]} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "11px" }} 
                  formatter={(value) => [`${value} Days Avg`, "Resolution Speed"]} 
                />
                <Bar dataKey="avgResolutionTime" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={45}>
                  {contractorsData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.avgResolutionTime <= 2.2 ? "#6366f1" : entry.avgResolutionTime <= 3.5 ? "#3b82f6" : "#f59e0b"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Contractor Matrix List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
          <div>
            <h3 className="font-display font-bold text-slate-805 text-sm">Assigned Engineering Contractor Matrix</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Click any contractor row to inspect details and live pipeline.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Sort fields:
            </span>
            <div className="flex gap-1.5">
              <button 
                onClick={() => toggleSort("historicalSla")}
                className={`px-2 py-1 rounded text-[10px] font-mono border ${sortField === "historicalSla" ? "bg-brand-medium text-white border-brand-medium" : "bg-white text-slate-600 hover:bg-slate-100 border-slate-200"}`}
              >
                SLA %
              </button>
              <button 
                onClick={() => toggleSort("avgResolutionTime")}
                className={`px-2 py-1 rounded text-[10px] font-mono border ${sortField === "avgResolutionTime" ? "bg-brand-medium text-white border-brand-medium" : "bg-white text-slate-600 hover:bg-slate-100 border-slate-200"}`}
              >
                Speed
              </button>
              <button 
                onClick={() => toggleSort("rating")}
                className={`px-2 py-1 rounded text-[10px] font-mono border ${sortField === "rating" ? "bg-brand-medium text-white border-brand-medium" : "bg-white text-slate-600 hover:bg-slate-100 border-slate-200"}`}
              >
                Rating
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-100/30 text-slate-500 text-[10px] font-mono font-bold tracking-wider uppercase">
                <th className="p-4">Contractor Details & Division</th>
                <th className="p-4 text-center">Historical Jobs</th>
                <th className="p-4 text-center">Active Backlog</th>
                <th className="p-4 text-center">Avg Resolution Time</th>
                <th className="p-4 text-center">Compliance (SLA)</th>
                <th className="p-4 text-center">Audited Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedContractors.map((contractor) => {
                const isSelected = selectedContractorId === contractor.id;
                return (
                  <tr 
                    key={contractor.id}
                    onClick={() => setSelectedContractorId(contractor.id)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${isSelected ? "bg-blue-50/50" : ""}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${
                          contractor.assignedCategory === "Potholes" ? "bg-rose-50 text-rose-600" :
                          contractor.assignedCategory === "Leakage" ? "bg-blue-50 text-blue-600" :
                          contractor.assignedCategory === "Garbage" ? "bg-amber-50 text-amber-600" :
                          "bg-violet-50 text-violet-600"
                        }`}>
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-display font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                            {contractor.name}
                            {isSelected && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-105 text-brand-medium inline-block font-mono tracking-tighter">INSPECTED</span>}
                          </div>
                          <span className="text-[10px] text-slate-450 font-mono block mt-0.5 uppercase tracking-wide">
                            {contractor.department} ({contractor.assignedCategory})
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center font-mono text-sm text-slate-705 font-medium">
                      {contractor.baseProjects}
                    </td>

                    <td className="p-4 text-center font-mono">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        contractor.activePending > 0
                          ? "bg-amber-50 text-amber-700 border border-amber-120/40"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {contractor.activePending} Pending
                      </span>
                    </td>

                    <td className="p-4 text-center font-mono">
                      <div className="flex items-center justify-center gap-1 text-xs text-slate-700">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{contractor.avgResolutionTime} Days</span>
                      </div>
                    </td>

                    <td className="p-4 text-center font-mono">
                      <div className="inline-flex flex-col items-center">
                        <span className={`text-xs font-bold ${
                          contractor.currentSla >= 90 ? "text-emerald-600" :
                          contractor.currentSla >= 85 ? "text-indigo-600" :
                          contractor.currentSla >= 80 ? "text-amber-500" : "text-rose-500"
                        }`}>
                          {contractor.currentSla}%
                        </span>
                        <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div 
                            style={{ width: `${contractor.currentSla}%` }}
                            className={`h-full rounded-full ${
                              contractor.currentSla >= 85 ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-bold font-mono">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{contractor.rating.toFixed(1)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Focus Inspection Section for Selected Contractor */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-light/10 text-amber-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] font-bold font-mono text-amber-400 tracking-wider block uppercase">
                Active Audit Terminal
              </span>
              <h3 className="font-display font-title font-bold text-base text-white">
                {selectedContractor.name}
              </h3>
            </div>
          </div>
          <div className="flex gap-4 text-[11px] text-slate-400 border-l border-slate-800 pl-4">
            <div>
              <span className="block text-slate-500 uppercase font-mono text-[9px]">Supervisor Leader</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">{selectedContractor.leader}</span>
            </div>
            <div>
              <span className="block text-slate-500 uppercase font-mono text-[9px]">Contact Email</span>
              <span className="font-semibold text-slate-200 mt-0.5 block">{selectedContractor.contactEmail}</span>
            </div>
          </div>
        </div>

        {/* Live matching complaints */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ListTodo className="w-4 h-4 text-blue-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">
              Assigned Regional Active Incident Loop (Live REST Sink)
            </h4>
          </div>

          {selectedContractor.complaintsList.length === 0 ? (
            <div className="text-center py-8 rounded-xl bg-slate-950 border border-slate-800/60 text-xs text-slate-500">
              No active pending or resolved task tickets reported on the Sentinel loop for {selectedContractor.assignedCategory} yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedContractor.complaintsList.map((complaint) => (
                <div 
                  key={complaint.id} 
                  onClick={() => onSelectComplaint?.(complaint.id)}
                  title="Click to inspect this complaint"
                  className="bg-slate-950 border border-slate-800 hover:border-slate-600 hover:bg-slate-900/45 p-4 rounded-xl flex gap-3 transition cursor-pointer active:scale-[0.99]"
                >
                  {complaint.imageUrl && (
                    <img 
                      src={complaint.imageUrl}
                      alt={complaint.issueType}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-800"
                    />
                  )}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 block truncate">
                        ID: {complaint.id}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[9px] uppercase font-mono font-extrabold rounded ${
                        complaint.status === "RESOLVED" ? "bg-emerald-950 text-emerald-400" :
                        complaint.status === "IN_PROGRESS" ? "bg-blue-950 text-blue-400" :
                        complaint.status === "ASSIGNED" ? "bg-indigo-950 text-indigo-400" : "bg-amber-950 text-amber-400"
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-semibold truncate leading-none">
                      {complaint.description}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      📍 {complaint.location}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-400">
                      <span>Severity Match: {complaint.severityScore}/100</span>
                      {complaint.priority && (
                        <span className={`font-bold ${
                          complaint.priority === "Critical" ? "text-red-400" :
                          complaint.priority === "High" ? "text-amber-400" : "text-blue-400"
                        }`}>{complaint.priority} Priority</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
