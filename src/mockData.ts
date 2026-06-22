import { Complaint, PredictiveZone } from "./types";

export const INITIAL_COMPLAINTS: Complaint[] = [
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

export const INITIAL_PRE_ZONES: PredictiveZone[] = [
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
      { month: "Jan", probability: 40 },
      { month: "Feb", probability: 45 },
      { month: "Mar", probability: 45 },
      { month: "Apr", probability: 48 },
      { month: "May", probability: 52 },
      { month: "Jun", probability: 60 },
      { month: "Jul", probability: 65 },
      { month: "Aug", probability: 68 },
      { month: "Sep", probability: 70 },
      { month: "Oct", probability: 75 },
      { month: "Nov", probability: 80 },
      { month: "Dec", probability: 60 }
    ]
  }
];

export const DEMO_COMPLAINTS: Complaint[] = [
  ...INITIAL_COMPLAINTS,
  {
    id: "COMP-105",
    citizenName: "Pranjal Sen",
    issueType: "Potholes",
    severityScore: 78,
    riskScore: 75,
    description: "Series of structural deep potholes emerging on the approach asphalt leading to Salt Lake electronic flyover. Causes major vehicular deceleration and alignment shocks.",
    location: "Sector V, Near Wipro Crossing Flyover, Kolkata",
    date: "2026-06-19",
    status: "PENDING",
    latitude: 22.5726,
    longitude: 88.4331,
    department: "Kolkata Metropolitan Development Authority (KMDA)",
    failureMode: "Asphalt stripping due to heavy waterlogged traffic and sub-base moisture stress",
    remedialAction: "Deep mill and lay hot bituminous mix with high-performance geogrid layout reinforcement",
    dangers: [
      "Two-wheeler skidding risks during sudden lane cuts",
      "Structural fatigue on flyover expansion steel joints",
      "Severe bumper-to-bumper traffic buildup over the approach span"
    ],
    highlightRegions: [
      { x: 40, y: 35, label: "Flyover Approach Shear Crack" },
      { x: 50, y: 45, label: "Stripped Asphalt Surface Base" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800&auto=format&fit=crop",
    priority: "High"
  },
  {
    id: "COMP-106",
    citizenName: "Meera Krishnan",
    issueType: "Street Light",
    severityScore: 72,
    riskScore: 68,
    description: "The entire inner street of Sector-3 Anna Nagar is in complete blackout. The feeder panel is locked and emits a minor hum, but no overhead LED lights are glowing.",
    location: "Anna Nagar East Ext Road, Sector-3, Chennai",
    date: "2026-06-20",
    status: "ASSIGNED",
    latitude: 13.0850,
    longitude: 80.2101,
    department: "Greater Chennai Corporation (GCC) Electrical Dept",
    failureMode: "Feeder core distribution transformer fuse blowout due to high thermal load",
    remedialAction: "Replacement of standard distribution unit fuses and cleaning rusted high-tension link plates",
    dangers: [
      "Increased blind spot traffic accidents on blind intersections",
      "Safety risks for evening walkers and neighborhood residents",
      "Inability of civic surveillance cameras to record night vehicles clearly"
    ],
    highlightRegions: [
      { x: 60, y: 25, label: "Defective Distribution Feeder" },
      { x: 45, y: 70, label: "Unilluminated Pedestrian Crosswalk" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1542013936693-8848e5744431?q=80&w=800&auto=format&fit=crop",
    priority: "Medium"
  },
  {
    id: "COMP-107",
    citizenName: "Amit Mishra",
    issueType: "Leakage",
    severityScore: 84,
    riskScore: 82,
    description: "High-volume main clear water pipeline burst. Water is gushing up to 3 feet high, flooding the Hazratganj market pavement and leaking heavily into the basements of nearby shopping plazas.",
    location: "Hazratganj Main Chauraha, Opp Plaza Mall, Lucknow",
    date: "2026-06-17",
    status: "RESOLVED",
    latitude: 26.8467,
    longitude: 80.9462,
    department: "Lucknow Jal Sansthan (Water Authority)",
    failureMode: "Cast iron supply pipe body wall thinning and eventual high pressure blowout",
    remedialAction: "Trench excavation, section cut and replacement with mild steel high-tensile pipeline sleeve",
    dangers: [
      "Basement structural flooding leading to electrical short-circuit hazards",
      "Subgrade washout below sidewalk granite blocks",
      "Wastage of filtered potable municipal reservoir water supply"
    ],
    highlightRegions: [
      { x: 35, y: 50, label: "Main Structural High-Pressure Burst" },
      { x: 65, y: 30, label: "Flooded Subway Stairs Approach" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=800&auto=format&fit=crop",
    priority: "Critical"
  },
  {
    id: "COMP-108",
    citizenName: "Rahul Deshmukh",
    issueType: "Garbage",
    severityScore: 60,
    riskScore: 55,
    description: "Huge piles of heavy organic commercial waste and construction debris dumped illegally by night trucks on the pavement. Restricts pedestrian transit fully.",
    location: "FC Road, Opposite Ferguson College Main Arch, Pune",
    date: "2026-06-16",
    status: "PENDING",
    latitude: 18.5204,
    longitude: 73.8567,
    department: "Pune Municipal Corporation (PMC) Solid Waste Hub",
    failureMode: "Illegal nocturnal commercial dump transit and lack of physical road blockades",
    remedialAction: "Deploy heavy loaders for sweep removal, introduce smart digital surveillance signs, and coordinate police patrolling",
    dangers: [
      "Pedestrians forced onto high-speed asphalt lane to pass the zone",
      "Organic putrefaction causing biological smell and attracting strays",
      "Rain runoff blocked, forming stagnant muddy pools along the curb"
    ],
    highlightRegions: [
      { x: 50, y: 60, label: "Illegal Solid Construction Debris" },
      { x: 25, y: 40, label: "Pedestrian Encroachment Barrier" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=800&auto=format&fit=crop",
    priority: "Medium"
  },
  {
    id: "COMP-109",
    citizenName: "Sneha Patil",
    issueType: "Potholes",
    severityScore: 92,
    riskScore: 95,
    description: "Deep, severe pothole cluster forming immediately at the exit curve of the high-speed transit expressway. Vehicles heading out at 70km/h suffer heavy brake/swerve maneuvers.",
    location: "S.G. Highway, Near Thaltej Crossing Exit Slip-road, Ahmedabad",
    date: "2026-06-18",
    status: "IN_PROGRESS",
    latitude: 23.0225,
    longitude: 72.5714,
    department: "Ahmedabad Urban Development Authority (AUDA)",
    failureMode: "Sub-base shear failure caused by heavy monsoon moisture trapping and high velocity dynamic loading",
    remedialAction: "Execute complete sub-base reinforcement using geocomposite mesh followed by high-modulus asphalt layer capping",
    dangers: [
      "Severe rollover risks for high-speed utility hatchbacks",
      "Rear-end collisions from emergency braking maneuvers at exit curves",
      "Severe damage to vehicle suspension struts and wheels"
    ],
    highlightRegions: [
      { x: 55, y: 45, label: "Severe Core Subbase Deformation" },
      { x: 70, y: 60, label: "Dynamic Asphalt Raveling Zone" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800&auto=format&fit=crop",
    priority: "Critical"
  },
  {
    id: "COMP-110",
    citizenName: "Vikash Yadav",
    issueType: "Street Light",
    severityScore: 50,
    riskScore: 48,
    description: "Single high-mast street lantern is blinking in rapid flickering pulses continuously. Distracts incoming drivers and creates strobe lights on the road floor.",
    location: "Bailey Road, Opp High Court Main Pillar, Patna",
    date: "2026-06-15",
    status: "PENDING",
    latitude: 25.5941,
    longitude: 85.1376,
    department: "Patna Municipal Corporation (PMC) Urban Grid",
    failureMode: "LED luminaire driver capacitor drying and internal voltage oscillator failure",
    remedialAction: "Replacement of the high-voltage constant-current driver unit and circuit insulation checks",
    dangers: [
      "Strobe-effect induced cognitive distraction for night drivers",
      "Potential of transformer junction box short-circuit over circuit spikes",
      "Reduced localized neighborhood commercial safety"
    ],
    highlightRegions: [
      { x: 30, y: 40, label: "Flickering High-mast Unit Driver" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1542013936693-8848e5744431?q=80&w=800&auto=format&fit=crop",
    priority: "Low"
  },
  {
    id: "COMP-111",
    citizenName: "Diya Roy",
    issueType: "Leakage",
    severityScore: 94,
    riskScore: 92,
    description: "Sewer gas leaks accompanied by thick black sludge overflowing from the manhole shafts onto the sidewalk and road crossing. Extremely unhygienic and slippery.",
    location: "Park Street Crossing, Opp Metro Exit gate, Kolkata",
    date: "2026-06-20",
    status: "RESOLVED",
    latitude: 22.5484,
    longitude: 88.3560,
    department: "Kolkata Municipal Corporation (KMC) Sewerage",
    failureMode: "Combined brick sewer structure structural cave-in blocking local trunk flow",
    remedialAction: "Mechanical trenchless structural relining using glass-reinforced plastic curing jackets",
    dangers: [
      "Highly toxic sewer gas discharges (H2S/Methane) into street levels",
      "Immediate biological contamination zone for hundreds of transit citizens",
      "Extreme skidding risk for high traffic volumes crossing the intersection"
    ],
    highlightRegions: [
      { x: 45, y: 55, label: "Overflowing Slippery Manhole Shaft" },
      { x: 60, y: 35, label: "Toxic Gas Concentration Zone" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=800&auto=format&fit=crop",
    priority: "Critical"
  }
];
