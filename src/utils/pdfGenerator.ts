import { jsPDF } from "jspdf";
import { Complaint } from "../types";

export function generateComplaintPDF(complaint: Complaint) {
  // Create a new PDF document (A4 size: 210mm x 297mm)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2); // 170mm

  let currentY = 18;

  // Render a header styling block (Corporate Slate Bar at top)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, currentY, contentWidth, 8, "F");
  currentY += 8;

  // Header Titles
  currentY += 10;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("SENTINEL MONSOON COMMAND CENTER", margin, currentY);

  currentY += 5;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("INTELLIGENT URBAN INFRASTRUCTURE MONSOON RISK MONITORING & AUDIT TRANSCRIPT", margin, currentY);

  // Line Divider
  currentY += 5;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  // Official Seal / Badge text on right side
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(239, 68, 68); // red-500
  doc.text("OFFICIAL EXECUTIVE PORTAL TRANSCRIPT", margin + contentWidth - 62, currentY - 11);

  // Section 1: GENERAL SPECIFICATIONS
  currentY += 10;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text("1. DEFECT SPECIFICATIONS AND FILING PROFILE", margin, currentY);

  // Accent Line under section heading
  currentY += 2;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, margin + 40, currentY);

  currentY += 6;
  doc.setFontSize(9);
  
  // Create a 2-column info grid
  const col1X = margin;
  const col2X = margin + 85;

  // Column 1 Data
  doc.setFont("Helvetica", "bold"); doc.text("INCIDENT ID:", col1X, currentY);
  doc.setFont("Helvetica", "normal"); doc.text(String(complaint.id), col1X + 32, currentY);

  // Column 2 Data
  doc.setFont("Helvetica", "bold"); doc.text("FILING DATE:", col2X, currentY);
  doc.setFont("Helvetica", "normal"); doc.text(String(complaint.date), col2X + 32, currentY);

  currentY += 6;
  doc.setFont("Helvetica", "bold"); doc.text("ISSUE CLASSIFICATION:", col1X, currentY);
  doc.setFont("Helvetica", "normal"); doc.text(String(complaint.issueType).toUpperCase(), col1X + 44, currentY);

  doc.setFont("Helvetica", "bold"); doc.text("CURRENT SLA STATUS:", col2X, currentY);
  doc.setFont("Helvetica", "normal"); 
  doc.setTextColor(
    complaint.status === "RESOLVED" ? 16 : 220,
    complaint.status === "RESOLVED" ? 124 : 38,
    complaint.status === "RESOLVED" ? 16 : 38
  );
  doc.text(String(complaint.status), col2X + 44, currentY);
  doc.setTextColor(30, 41, 59); // Restore default

  currentY += 6;
  doc.setFont("Helvetica", "bold"); doc.text("JURISDICTION BUR.:", col1X, currentY);
  doc.setFont("Helvetica", "normal"); doc.text(String(complaint.department), col1X + 36, currentY);

  doc.setFont("Helvetica", "bold"); doc.text("LOCATION COORD.:", col2X, currentY);
  doc.setFont("Helvetica", "normal"); doc.text(`${complaint.latitude.toFixed(5)}° N, ${complaint.longitude.toFixed(5)}° E`, col2X + 36, currentY);

  currentY += 6;
  doc.setFont("Helvetica", "bold"); doc.text("MUNICIPAL ZONE:", col1X, currentY);
  doc.setFont("Helvetica", "normal"); doc.text(String(complaint.location), col1X + 32, currentY);

  doc.setFont("Helvetica", "bold"); doc.text("CITIZEN REPORTER:", col2X, currentY);
  doc.setFont("Helvetica", "normal"); doc.text(String(complaint.citizenName), col2X + 36, currentY);

  // Defect Description (Wrapped text)
  currentY += 9;
  doc.setFont("Helvetica", "bold");
  doc.text("CITIZEN INCIDENT DESCRIPTION BRIEF:", col1X, currentY);
  currentY += 4;
  doc.setFont("Helvetica", "oblique");
  const descLines = doc.splitTextToSize(`"${complaint.description || "No supplemental details provided."}"`, contentWidth);
  doc.text(descLines, col1X, currentY);
  currentY += (descLines.length * 4.5);

  // Section 2: AI ANALYTICS & ROOT CAUSE DIAGNOSIS
  currentY += 4;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text("2. SENTINEL AI DIAGNOSTIC REPORT", margin, currentY);

  currentY += 2;
  doc.setDrawColor(220, 38, 38); // Red indicator
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, margin + 40, currentY);

  currentY += 6;
  doc.setFontSize(9);
  doc.setFont("Helvetica", "bold");
  doc.text("IDENTIFIED FAILURE ANATOMY:", col1X, currentY);
  currentY += 4;
  doc.setFont("Helvetica", "normal");
  const modeVal = complaint.failureMode || "High mechanical fatigue and monsoon rainfall scour at primary soil interface.";
  const modeLines = doc.splitTextToSize(modeVal, contentWidth);
  doc.text(modeLines, col1X, currentY);
  currentY += (modeLines.length * 4.5);

  currentY += 3;
  doc.setFont("Helvetica", "bold");
  doc.text("AI CORE REMEDIAL RECOMMENDATION PROTOCOL:", col1X, currentY);
  currentY += 4;
  doc.setFont("Helvetica", "normal");
  const recVal = complaint.remedialAction || "Immediate core reinforcement. Establish high intensity liquid resin patch repair.";
  const recLines = doc.splitTextToSize(recVal, contentWidth);
  doc.text(recLines, col1X, currentY);
  currentY += (recLines.length * 4.5);

  // Section 3: HAZARD INDEX & CONTINGENT PUBLIC DANGERS (Aestic card container)
  currentY += 5;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("3. COMBINED RISK & THREAT MATRIX", margin, currentY);

  currentY += 2;
  doc.setDrawColor(245, 158, 11); // Amber indicator
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, margin + 40, currentY);

  currentY += 6;
  doc.setFontSize(9);

  // Set background for Risk metrics
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(241, 245, 249); // slate-100
  doc.rect(margin, currentY, contentWidth, 18, "FD");

  // Inside the slate box
  const innerY = currentY + 6;
  doc.setFont("Helvetica", "bold");
  doc.text("SEVERITY INDEX:", margin + 6, innerY);
  
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(220, 38, 38);
  doc.text(`${complaint.severityScore}/100`, margin + 36, innerY);

  doc.setFont("Helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("PROBABILITY RISK INDEX:", margin + 60, innerY);
  
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(220, 38, 38);
  doc.text(`${complaint.riskScore}/100`, margin + 104, innerY);

  doc.setFont("Helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("PRIORITY CLASS:", margin + 124, innerY);

  doc.setFont("Helvetica", "bold");
  doc.setTextColor(complaint.priority === "Critical" ? 220 : 217, complaint.priority === "Critical" ? 38 : 119, complaint.priority === "Critical" ? 38 : 6);
  doc.text(String(complaint.priority || "MEDIUM").toUpperCase(), margin + 152, innerY);

  // Restore defaults
  doc.setTextColor(30, 41, 59);
  currentY += 24;

  // Let's print the public safety hazards list
  if (complaint.dangers && complaint.dangers.length > 0) {
    doc.setFont("Helvetica", "bold");
    doc.text("IDENTIFIED CIVIL SAFETY HAZARDS FOR REGIONAL TRANSIT:", col1X, currentY);
    currentY += 4.5;
    
    complaint.dangers.forEach((danger, idx) => {
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(220, 38, 38);
      doc.text(`[${idx + 1}]`, margin + 2, currentY);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(71, 85, 105); // slate-600
      
      const dangerLines = doc.splitTextToSize(danger, contentWidth - 10);
      doc.text(dangerLines, margin + 8, currentY);
      currentY += (dangerLines.length * 4.5);
    });
    doc.setTextColor(30, 41, 59); // Restore
  }

  // Section 4: RESPONSE TIMELINE & TASK DISPATCH ACTION PROTOCOLS
  currentY += 5;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("4. SLA RESPONSE AND RESOLUTION TIMELINE PROCEDURES", margin, currentY);

  currentY += 2;
  doc.setDrawColor(79, 70, 229); // Indigo indicator
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, margin + 40, currentY);

  currentY += 6;
  doc.setFontSize(9);

  // Create an SLA resolution checklist timeline
  const isEmergency = complaint.severityScore > 90 && complaint.riskScore > 90;
  
  const steps = isEmergency 
    ? [
        { label: "Phase 1: Emergency Alarm Broadcast & Valve / Traffic isolation", time: "T+15 Mins" },
        { label: "Phase 2: Localized heavy paving rig / sealing deployment", time: "T+45 Mins" },
        { label: "Phase 3: Environmental gas decontamination and asphalt verification test", time: "T+90 Mins" }
      ]
    : [
        { label: "Phase 1: Mobilize Inspector & Engineer team to coordinate structural boundaries", time: "T+4 Hours" },
        { label: "Phase 2: Execute tactical repair and materials replacement", time: "T+12 Hours" },
        { label: "Phase 3: Perform hydraulic seal integrity tests and file official sign-off report", time: "T+24 Hours" }
      ];

  doc.setFont("Helvetica", "bold");
  doc.text("MUNICIPAL SERVICE LEVEL AGREEMENT (SLA) SEQUENCE SCHEDULE:", col1X, currentY);
  currentY += 5;

  steps.forEach((step) => {
    // Bullet box
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, currentY - 3, 4, 4, "F");
    
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.text(step.time, margin + 6, currentY);

    doc.setFont("Helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(step.label, margin + 26, currentY);

    currentY += 5.5;
  });

  // Stamp details / Validation
  currentY += 8;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  currentY += 8;
  doc.setFontSize(7.5);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("DOCUMENT VERIFICATION SEAL: TRANSCRIPT-MUNIC-AID-SENTINEL-SYSTEMS-2026", margin, currentY);
  
  currentY += 4;
  doc.setFont("Helvetica", "normal");
  doc.text("GEN. TIME: " + new Date().toISOString() + " | SENTINEL INFRA MONITORING PLATFORM", margin, currentY);

  // Download trigger
  const safeFilename = `Sentinel_Audit_Report_${complaint.id || "DEFECT"}.pdf`;
  doc.save(safeFilename);
}
