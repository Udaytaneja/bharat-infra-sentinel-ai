import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Middleware for parsing JSON with generous payload limits for base64 images
app.use(express.json({ limit: "15mb" }));

// In-Memory Database for Infrastructure Complaints
let complaints = [
  {
    id: "COMP-101",
    citizenName: "Ananya Sharma",
    issueType: "Potholes",
    severityScore: 80,
    riskScore: 82,
    description: "Massive crater forming in the center lane of the main bypass. Vehicles are making sudden lane changes to avoid it, causing extreme near-miss traffic hazards.",
    location: "Outer Ring Road, IIT Flyover Main Bypass, Delhi",
    date: "2026-06-15",
    status: "PENDING",
    latitude: 28.5450,
    longitude: 77.2030,
    department: "Delhi Public Works Department (PWD)",
    failureMode: "Asphalt fatigue cracking due to intense multi-axle vehicle transit loads",
    remedialAction: "Immediate deep-cut cold bituminous repair with concrete sub-base consolidation",
    dangers: [
      "High-speed sudden vehicle lane-changing collision hazards",
      "Pneumatic tire blowout risk for passenger cars",
      "Sub-grade scouring leading to massive adjoining road subsidence"
    ],
    highlightRegions: [
      { x: 48, y: 52, label: "Active Asphalt Spalling" },
      { x: 55, y: 48, label: "Sub-base Moisture Infiltration" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800&auto=format&fit=crop",
    priority: "Critical"
  },
  {
    id: "COMP-102",
    citizenName: "Rohan Mehta",
    issueType: "Leakage",
    severityScore: 90,
    riskScore: 89,
    description: "Water constantly bubbling up from beneath the sidewalk paving slabs outside the transit gates. Significant soft soil wash-out is visible underneath.",
    location: "S.V. Road, Opposite Bandra Metro Station, Mumbai",
    date: "2026-06-12",
    status: "IN_PROGRESS",
    latitude: 19.0596,
    longitude: 72.8402,
    department: "Brihanmumbai Municipal Corporation (BMC) Water Supply",
    failureMode: "High-pressure municipal subterranean water main line fracture",
    remedialAction: "Ground Penetrating Radar scanning followed by rapid pipe sleeve clamping and structural sand backfilling",
    dangers: [
      "Sudden sidewalk structural collapse into underground cavities (sinkhole)",
      "Vaporization of transit road load capacity due to saturated clay soils",
      "Water pressure loss in neighbouring residential distribution nodes"
    ],
    highlightRegions: [
      { x: 38, y: 64, label: "Hydrostatic Water Upwelling" },
      { x: 42, y: 70, label: "Sidewalk Subgrade Soil Loss" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1542013936693-8848e5744431?q=80&w=800&auto=format&fit=crop",
    priority: "Critical"
  },
  {
    id: "COMP-103",
    citizenName: "Karthik Gowda",
    issueType: "Street Light",
    severityScore: 60,
    riskScore: 64,
    description: "Entire stretch of eight consecutive streetlight poles is completely dark for consecutive nights. Creates a dangerous pitch-black corridor on a curve.",
    location: "Outer Ring Road (ORR), Bellandur Tech Park Corridor, Bengaluru",
    date: "2026-06-18",
    status: "PENDING",
    latitude: 12.9304,
    longitude: 77.6784,
    department: "BBMP Central Streetlighting & Electrical Authority",
    failureMode: "Waterlogging induced feeder-box circuit breakdown & line short-circuit",
    remedialAction: "Moisture insulation sealing, replacement of tripped miniature circuit breakers (MCBs), and high-tension cabling repair",
    dangers: [
      "Accidents involving pedestrians crossing dark high-speed road",
      "Socio-security risks and muggings in completely unmonitored dark zones",
      "Motorcycle crash risks against black unlit concrete divider medians"
    ],
    highlightRegions: [
      { x: 50, y: 30, label: "Unenergized LED Luminaire" },
      { x: 72, y: 85, label: "Flooded Feeder Connection pillar" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=800&auto=format&fit=crop",
    priority: "High"
  },
  {
    id: "COMP-104",
    citizenName: "Siddharth Rao",
    issueType: "Garbage",
    severityScore: 50,
    riskScore: 45,
    description: "A gigantic illegal dumping ground has developed overnight, fully blocking the secondary storm-water drain. In case of sudden showers, this will choke the block.",
    location: "Khairatabad Junction storm-drain channel, Hyderabad",
    date: "2026-06-14",
    status: "RESOLVED",
    latitude: 17.4116,
    longitude: 78.4616,
    department: "GHMC Solid Waste & Monsoon Action Team",
    failureMode: "Unregulated municipal solid waste accumulation in drainage conduits",
    remedialAction: "Emergency deployment of mechanical trash collectors and installation of steel barricades with active CCTV warning systems",
    dangers: [
      "Choked storm drain resulting in instant 2-foot street-level flooding during rain",
      "Vector-borne disease propagation (dengue/malaria) due to stagnant water pool",
      "Stray animal congregation on the lane, hindering flow"
    ],
    highlightRegions: [
      { x: 45, y: 72, label: "Drainage Inlet Obstruction" },
      { x: 60, y: 65, label: "Organic Mass Waste Pile" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=800&auto=format&fit=crop",
    priority: "Medium"
  }
];

// Predictive Failure Zones
const predictiveZones = [
  {
    id: "ZONE-1",
    areaName: "Dwarka Sector 21 Bypass Corridor, Delhi",
    assetType: "Road Concrete Pavement",
    ageYears: 12,
    failureProbability: 84,
    priorityLevel: "CRITICAL",
    waterloggingRiskIndex: 92,
    undergroundUtilityDucts: 14,
    lastInspected: "4 months ago",
    forecastedFailureMonth: "July 2026 (Monsoon Peak)",
    activeTriggers: ["Intense water stagnation", "High truck volume", "Subbase saturation"],
    historicalFailures: 3,
    reconstructionCostEst: "₹45,00,000",
    monthlyRiskTrend: [
      { month: "Jan", probability: 25 },
      { month: "Feb", probability: 27 },
      { month: "Mar", probability: 31 },
      { month: "Apr", probability: 35 },
      { month: "May", probability: 48 },
      { month: "Jun", probability: 72 },
      { month: "Jul", probability: 84 },
      { month: "Aug", probability: 80 },
      { month: "Sep", probability: 55 }
    ]
  },
  {
    id: "ZONE-2",
    areaName: "Marine Drive Promenade Subgrade, Mumbai",
    assetType: "Seawall & Pedestrian Pavement",
    ageYears: 24,
    failureProbability: 71,
    priorityLevel: "HIGH",
    waterloggingRiskIndex: 95,
    undergroundUtilityDucts: 6,
    lastInspected: "2 months ago",
    forecastedFailureMonth: "August 2026 (High Tide Surge)",
    activeTriggers: ["Sea-wave erosion (hydrodynamic scour)", "Slab misalignment", "Void formation"],
    historicalFailures: 1,
    reconstructionCostEst: "₹1,20,00,000",
    monthlyRiskTrend: [
      { month: "Jan", probability: 40 },
      { month: "Feb", probability: 40 },
      { month: "Mar", probability: 42 },
      { month: "Apr", probability: 45 },
      { month: "May", probability: 50 },
      { month: "Jun", probability: 65 },
      { month: "Jul", probability: 70 },
      { month: "Aug", probability: 71 },
      { month: "Sep", probability: 60 }
    ]
  },
  {
    id: "ZONE-3",
    areaName: "Silk Board Elevated Junction Pillar 42-48, Bengaluru",
    assetType: "Stormwater Main Catchment & Road Base",
    ageYears: 9,
    failureProbability: 62,
    priorityLevel: "HIGH",
    waterloggingRiskIndex: 88,
    undergroundUtilityDucts: 22,
    lastInspected: "1 month ago",
    forecastedFailureMonth: "October 2026 (Northeast Monsoon)",
    activeTriggers: ["Extreme silt accumulation", "Drainage conduit diameter compression", "Heavy run-off"],
    historicalFailures: 5,
    reconstructionCostEst: "₹28,00,000",
    monthlyRiskTrend: [
      { month: "Jan", probability: 10 },
      { month: "Feb", probability: 12 },
      { month: "Mar", probability: 18 },
      { month: "Apr", probability: 28 },
      { month: "May", probability: 50 },
      { month: "Jun", probability: 45 },
      { month: "Jul", probability: 40 },
      { month: "Aug", probability: 48 },
      { month: "Sep", probability: 55 },
      { month: "Oct", probability: 62 },
      { month: "Nov", probability: 58 },
      { month: "Dec", probability: 30 }
    ]
  },
  {
    id: "ZONE-4",
    areaName: "Gachibowli Stadium Radial Road Link, Hyderabad",
    assetType: "Road & High Voltage Underground Feeders",
    ageYears: 6,
    failureProbability: 41,
    priorityLevel: "MEDIUM",
    waterloggingRiskIndex: 52,
    undergroundUtilityDucts: 18,
    lastInspected: "6 months ago",
    forecastedFailureMonth: "July 2026 (Monsoon)",
    activeTriggers: ["Rapid trenching cuts from private operators", "Subgrade thermal fatigue"],
    historicalFailures: 2,
    reconstructionCostEst: "₹18,00,000",
    monthlyRiskTrend: [
      { month: "Jan", probability: 15 },
      { month: "Feb", probability: 16 },
      { month: "Mar", probability: 20 },
      { month: "Apr", probability: 25 },
      { month: "May", probability: 28 },
      { month: "Jun", probability: 38 },
      { month: "Jul", probability: 41 },
      { month: "Aug", probability: 39 },
      { month: "Sep", probability: 30 }
    ]
  },
  {
    id: "ZONE-5",
    areaName: "Anna Salai Metro Cross Corridor, Chennai",
    assetType: "Sewer Line & Road Intersection Deck",
    ageYears: 32,
    failureProbability: 80,
    priorityLevel: "CRITICAL",
    waterloggingRiskIndex: 90,
    undergroundUtilityDucts: 30,
    lastInspected: "3 months ago",
    forecastedFailureMonth: "November 2026 (Cyclone Peak Risk)",
    activeTriggers: ["Soil shifting due to nearby deep excavations", "Corrosive gas erosion in old concrete sewers"],
    historicalFailures: 4,
    reconstructionCostEst: "₹95,00,000",
    monthlyRiskTrend: [
      { month: "Jan", probability: 30 },
      { month: "Feb", probability: 25 },
      { month: "Mar", probability: 20 },
      { month: "Apr", probability: 20 },
      { month: "May", probability: 22 },
      { month: "Jun", probability: 35 },
      { month: "Jul", probability: 45 },
      { month: "Aug", probability: 50 },
      { month: "Sep", probability: 55 },
      { month: "Oct", probability: 70 },
      { month: "Nov", probability: 80 },
      { month: "Dec", probability: 65 }
    ]
  }
];

// Lazy Gemini API wrapper
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (key && key !== "MY_GEMINI_API_KEY") {
    if (!aiInstance) {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
    }
    return aiInstance;
  }
  return null;
}

// REST APIs
// 1. Get all complaints
app.get("/api/complaints", (req, res) => {
  res.json(complaints);
});

// 2. Add an anonymous/custom citizen complaint
app.post("/api/complaints", (req, res) => {
  const { citizenName, issueType, description, location, latitude, longitude, severityScore, riskScore, department, failureMode, remedialAction, dangers, highlightRegions, imageUrl, priority } = req.body;
  
  const resolvedSeverity = Number(severityScore) || 50;
  let calculatedPriority = priority;
  if (!calculatedPriority) {
    if (resolvedSeverity >= 80) calculatedPriority = "Critical";
    else if (resolvedSeverity >= 60) calculatedPriority = "High";
    else if (resolvedSeverity >= 40) calculatedPriority = "Medium";
    else calculatedPriority = "Low";
  }

  const newComplaint = {
    id: `COMP-${Math.floor(100 + Math.random() * 900)}`,
    citizenName: citizenName || "Citizen Volunteer",
    issueType: issueType || "Potholes",
    description: description || "No description provided.",
    location: location || "Unknown Location, India",
    date: new Date().toISOString().split("T")[0],
    status: "PENDING",
    latitude: Number(latitude) || 28.6139,
    longitude: Number(longitude) || 77.2090,
    severityScore: resolvedSeverity,
    riskScore: Number(riskScore) || 50,
    department: department || "General Infrastructure Public Works Dept",
    failureMode: failureMode || "Road surface fatigue degradation",
    remedialAction: remedialAction || "Inspection scheduled within 48 hours.",
    dangers: dangers || [
      "Localized traffic slowness",
      "Safety risks for low-clearance vehicles",
      "Exacerbation of material stress over time"
    ],
    highlightRegions: highlightRegions || [
      { x: 50, y: 50, label: "Indicated Defect Zone" }
    ],
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800",
    priority: calculatedPriority
  };

  complaints.unshift(newComplaint);
  res.status(201).json(newComplaint);
});

// 3. Update complaint status
app.patch("/api/complaints/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = complaints.findIndex(c => c.id === id);
  if (index !== -index) {
    complaints[index].status = status;
    res.json(complaints[index]);
  } else {
    res.status(404).json({ error: "Complaint not found" });
  }
});

// 4. Get predictive zones failure forecast details
app.get("/api/predictive-zones", (req, res) => {
  res.json(predictiveZones);
});

// Helper for experts fallback logic when API Key is missing or invalid
function runFallBackExpertAnalysis(issueType: string, description: string) {
  const text = (description || "").toLowerCase();
  
  let resolvedType = issueType || "Potholes";
  if (text.includes("leak") || text.includes("water") || text.includes("pipe") || text.includes("burst")) {
    resolvedType = "Leakage";
  } else if (text.includes("garbage") || text.includes("trash") || text.includes("waste") || text.includes("dump")) {
    resolvedType = "Garbage";
  } else if (text.includes("light") || text.includes("dark") || text.includes("electrical") || text.includes("bulb") || text.includes("pole")) {
    resolvedType = "Street Light";
  } else if (text.includes("pothole") || text.includes("crater") || text.includes("asphalt") || text.includes("road")) {
    resolvedType = "Potholes";
  }

  let severity = 50;
  let risk = 48;
  let dept = "Road Maintenance";
  let failureMode = "Pavement layer separation due to moisture stress";
  let correction = "Schedule cold-lay premix patch work with localized grading.";
  let dangerList = [
    "Compromised high-speed lane safety",
    "Rapid degradation of surrounding concrete matrix",
    "Water collection causing aquaplaning risks"
  ];
  let highlights = [{ x: 52, y: 46, label: "Structural Defect Concentrator" }];

  if (resolvedType === "Leakage") {
    severity = 80;
    risk = 84;
    dept = "Water Department";
    failureMode = "High-pressure utility joint crack or pipeline fatigue fracture";
    correction = "Immediate localized valve isolation, excavation, and conduit sleeve replacement.";
    dangerList = [
      "Erosion of support soil causing localized sinkholes under pathways",
      "Potable water supply drop & cross-contamination from adjacent channels",
      "Moisture infiltration into residential basement masonry structures"
    ];
    highlights = [
      { x: 45, y: 55, label: "Fluid Pressure Conduit Leak Point" },
      { x: 50, y: 68, label: "Adjoining Cement Board Erosion" }
    ];
  } else if (resolvedType === "Garbage") {
    severity = 45;
    risk = 40;
    dept = "Sanitation";
    failureMode = "Illegal curbside solid waste pileup blocking road drainage paths";
    correction = "Deployment of motorized cleaning truck and chemical vector-control spray.";
    dangerList = [
      "Blockage of street stormwater gullies triggering major street floods",
      "Proliferation of toxic fumes, pathogen vectors and stray animal congestion",
      "Obstruction of civilian walkways forcing school children into active traffic lanes"
    ];
    highlights = [
      { x: 48, y: 72, label: "Drainage Inlet Blockage Pile" }
    ];
  } else if (resolvedType === "Street Light") {
    severity = 60;
    risk = 68;
    dept = "Electrical";
    failureMode = "Terminal cable carbonization or water-locked distribution panel failure";
    correction = "Underground conductor testing, panel de-humidification, and relay switch module upgrade.";
    dangerList = [
      "Heightened safety threat for solo women and senior citizens walking at night",
      "Increased vehicular accident rate on blind bends due to headlight contrast gaps",
      "Security cameras losing line-of-sight capability in full black blocks"
    ];
    highlights = [
      { x: 55, y: 35, label: "Non-responsive LED Bulb Cluster" }
    ];
  } else {
    // Potholes custom
    if (text.includes("huge") || text.includes("severe") || text.includes("axis") || text.includes("crash")) {
      severity = 87;
      risk = 92;
    } else {
      severity = 75;
      risk = 78;
    }
    dept = "Road Maintenance";
    failureMode = "Localized asphalt shear failure due to high thermal fluctuation and transit loading";
    correction = "Pavement excavation, coarse subgrade compaction, and dense asphalt overlaying.";
    dangerList = [
      "Sudden multi-lane vehicle swerving leading to rear-end pile-ups",
      "Catastrophic alloy wheel structural fracture or motorcycle skid risk",
      "Dynamic wheel loads spreading micro-cracks radially outwards across the span"
    ];
    highlights = [
      { x: 48, y: 52, label: "Subgrade Failure Hub" },
      { x: 52, y: 54, label: "Radial Crack Propagation Core" }
    ];
  }

  let priorityLevel = "Medium";
  if (severity >= 80) {
    priorityLevel = "Critical";
  } else if (severity >= 60) {
    priorityLevel = "High";
  } else if (severity >= 40) {
    priorityLevel = "Medium";
  } else {
    priorityLevel = "Low";
  }

  return {
    issueType: resolvedType,
    severityScore: severity,
    riskScore: risk,
    recommendedDepartment: dept,
    priority: priorityLevel,
    failureMode,
    remedialAction: correction,
    dangers: dangerList,
    highlightRegions: highlights
  };
}

// 5. Dynamic AI Analysis Port with real Gemini Proxy
app.post("/api/analyze-complaint", async (req, res) => {
  const { issueType, description, imageBase64 } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Fallback expert logic
    console.log("No GEMINI_API_KEY detected or using test key. Invoking localized expert civil engine.");
    const fallbackResult = runFallBackExpertAnalysis(issueType, description);
    return res.json(fallbackResult);
  }

  try {
    let prompt = `Analyze this state infrastructure issue reported in India. 
Issue Category Selection Hint: ${issueType || "Unknown/Auto"}
Description of issue reported by citizen: "${description || "None"}"

Assess this issue across structural engineering and smart city governance axes. 
Produce a highly technical, precise output of civil assessment.
You MUST provide the response in a VALID, STABLE JSON format matching the schema properties below. Do not wrap code in extra strings. Return strictly the raw JSON object.

Schema mapping specifications:
{
  "issueType": "Potholes" | "Leakage" | "Garbage" | "Street Light",
  "severityScore": Integer between 0 and 100, representing physical integrity deterioration (0 is lowest/no defect, 100 is severe degradation). Example: Pothole might be 87, Garbage might be 45.
  "riskScore": Integer between 0 and 100, representing safety/accidents danger risk score. Example: Pothole might be 92, Garbage might be 40.
  "recommendedDepartment": Technical authority name of relevant municipal agency (e.g. 'Road Maintenance Division', 'Water Supply Department', 'Sanitation Department', 'Electrical Department').
  "priority": "Low" | "Medium" | "High" | "Critical",
  "failureMode": Concise technical diagnosis of structural/material failure cause (maximum 15 words).
  "remedialAction": Specific corrective plan action for civic crews.
  "dangers": Array containing 3 highly specific public safety hazards caused by this hazard.
  "highlightRegions": Array of 2-3 hotspots representing where inspection attention is key, containing objects of structure { "x": 0 to 100 percentage integer, "y": 0 to 100 percentage integer, "label": "Brief technical label of defect spotted" }.
}`;

    const analysisSchema = {
      type: Type.OBJECT,
      properties: {
        issueType: { type: Type.STRING },
        severityScore: { type: Type.INTEGER },
        riskScore: { type: Type.INTEGER },
        recommendedDepartment: { type: Type.STRING },
        priority: { type: Type.STRING },
        failureMode: { type: Type.STRING },
        remedialAction: { type: Type.STRING },
        dangers: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        highlightRegions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              x: { type: Type.INTEGER },
              y: { type: Type.INTEGER },
              label: { type: Type.STRING }
            }
          }
        }
      }
    };

    let response;
    
    if (imageBase64) {
      // Multimodal payload
      const base64DataOnly = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64DataOnly
              }
            },
            {
              text: prompt
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: analysisSchema
        }
      });
    } else {
      // Text-only payload
      response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: {
          parts: [
            {
              text: prompt
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: analysisSchema
        }
      });
    }

    const restext = response.text;
    console.log("Raw Gemini Response received.");
    if (!restext) {
      throw new Error("No text returned from Gemini API");
    }

    let parsedJson;
    const cleanSource = restext.trim();
    try {
      parsedJson = JSON.parse(cleanSource);
    } catch (parseErr) {
      // Robust recovery checking for markdown formatting or extra leading/trailing characters
      const jsonStart = cleanSource.indexOf("{");
      const jsonEnd = cleanSource.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const substring = cleanSource.substring(jsonStart, jsonEnd + 1);
        parsedJson = JSON.parse(substring);
      } else {
        throw parseErr;
      }
    }
    res.json(parsedJson);

  } catch (err: any) {
    console.warn("[GEMINI API RESILIENT HANDLER] Notice: falling back to civil design engine helper because of API/parse anomaly:", err?.message || err);
    // Graceful fallback on API exception so user never gets broken screen
    const backupResult = runFallBackExpertAnalysis(issueType, description);
    res.json(backupResult);
  }
});

// Setup Vite & static assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite middleware inside Express.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production folder dist/");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bharat Infra Sentinel AI express server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
