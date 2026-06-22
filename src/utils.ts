export function getDepartmentForIssue(issueType: string): string {
  const norm = (issueType || "").trim().toLowerCase();
  if (norm.includes("pothole")) {
    return "Road Maintenance";
  }
  if (norm.includes("leakage") || norm.includes("leak") || norm.includes("water") || norm.includes("pipe")) {
    return "Water Department";
  }
  if (norm.includes("garbage") || norm.includes("sanitation") || norm.includes("trash") || norm.includes("waste")) {
    return "Sanitation";
  }
  if (norm.includes("street light") || norm.includes("light") || norm.includes("electrical") || norm.includes("power")) {
    return "Electrical";
  }
  return "Road Maintenance"; // Default fallback
}
