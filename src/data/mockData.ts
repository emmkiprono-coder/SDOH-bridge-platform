import { Patient, Referral, CommunityResource, SDOHDomain, RiskLevel, ReferralStatus } from "../types";

const domainLabels: Record<SDOHDomain, string> = {
  food: "Food Insecurity",
  housing: "Housing Instability",
  transportation: "Transportation",
  utilities: "Utility Needs",
  safety: "Personal Safety",
  financial: "Financial Strain",
  employment: "Employment",
  education: "Education",
  social: "Social Isolation",
  health_literacy: "Health Literacy",
};

const domainColors: Record<SDOHDomain, string> = {
  food: "#f59e0b",
  housing: "#3b82f6",
  transportation: "#8b5cf6",
  utilities: "#ef4444",
  safety: "#ec4899",
  financial: "#10b981",
  employment: "#06b6d4",
  education: "#f97316",
  social: "#6366f1",
  health_literacy: "#14b8a6",
};

const riskColors: Record<RiskLevel, string> = {
  low: "#22c55e",
  moderate: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

const statusColors: Record<ReferralStatus, string> = {
  pending: "#6366f1",
  sent: "#3b82f6",
  accepted: "#06b6d4",
  in_progress: "#f59e0b",
  resolved: "#22c55e",
  closed: "#64748b",
  declined: "#ef4444",
};

const patients: Patient[] = [
  {
    id: "P001", name: "Maria Garcia", age: 34, gender: "Female", language: "Spanish", ethnicity: "Hispanic/Latino", mrn: "MRN-20481", phone: "(312) 555-0142", address: "2847 W Division St, Chicago, IL", insuranceType: "Medicaid",
    lastScreening: "2026-02-10", screeningStatus: "completed", riskLevel: "high",
    identifiedNeeds: ["food", "housing", "transportation"],
    referrals: [],
    screeningHistory: [{
      id: "S001", date: "2026-02-10", overallRisk: "high", screener: "Dr. Rodriguez", method: "interpreter_assisted", language: "Spanish",
      culturalNotes: "Patient expressed concerns about immigration status affecting willingness to seek help. Reassured about confidentiality.",
      domains: [
        { domain: "food", score: 8, maxScore: 10, risk: "high", responses: [{ question: "Within the past 12 months, did you worry that your food would run out?", answer: "Often true", flagged: true }, { question: "Within the past 12 months, did the food you bought not last?", answer: "Often true", flagged: true }] },
        { domain: "housing", score: 7, maxScore: 10, risk: "high", responses: [{ question: "Are you worried about losing your housing?", answer: "Yes", flagged: true }] },
        { domain: "transportation", score: 6, maxScore: 10, risk: "moderate", responses: [{ question: "Has lack of transportation kept you from medical appointments?", answer: "Yes", flagged: true }] },
      ]
    }]
  },
  {
    id: "P002", name: "James Washington", age: 67, gender: "Male", language: "English", ethnicity: "Black/African American", mrn: "MRN-30192", phone: "(704) 555-0298", address: "1521 Beatties Ford Rd, Charlotte, NC", insuranceType: "Medicare",
    lastScreening: "2026-01-28", screeningStatus: "completed", riskLevel: "critical",
    identifiedNeeds: ["utilities", "food", "social", "health_literacy"],
    referrals: [],
    screeningHistory: [{
      id: "S002", date: "2026-01-28", overallRisk: "critical", screener: "Nurse Thompson", method: "in_person", language: "English",
      culturalNotes: "Veteran. Expressed distrust in social services based on past experiences. Built rapport through veteran-specific program discussion.",
      domains: [
        { domain: "utilities", score: 9, maxScore: 10, risk: "critical", responses: [{ question: "In the past 12 months, has your utility company threatened to shut off services?", answer: "Yes, already disconnected once", flagged: true }] },
        { domain: "food", score: 7, maxScore: 10, risk: "high", responses: [{ question: "Within the past 12 months, did you worry about food?", answer: "Sometimes true", flagged: true }] },
        { domain: "social", score: 8, maxScore: 10, risk: "high", responses: [{ question: "How often do you feel isolated from others?", answer: "Nearly every day", flagged: true }] },
        { domain: "health_literacy", score: 6, maxScore: 10, risk: "moderate", responses: [{ question: "How confident are you filling out medical forms by yourself?", answer: "Not at all", flagged: true }] },
      ]
    }]
  },
  {
    id: "P003", name: "Fatima Al-Rashid", age: 28, gender: "Female", language: "Arabic", ethnicity: "Middle Eastern/North African", mrn: "MRN-41083", phone: "(414) 555-0176", address: "3200 S 27th St, Milwaukee, WI", insuranceType: "Medicaid",
    lastScreening: "2026-02-18", screeningStatus: "completed", riskLevel: "moderate",
    identifiedNeeds: ["employment", "education", "transportation"],
    referrals: [],
    screeningHistory: [{
      id: "S003", date: "2026-02-18", overallRisk: "moderate", screener: "SW Ahmed", method: "interpreter_assisted", language: "Arabic",
      culturalNotes: "Recently resettled refugee. Husband present but patient indicated preference to answer independently. Screening conducted with female Arabic interpreter per cultural preference.",
      domains: [
        { domain: "employment", score: 7, maxScore: 10, risk: "high", responses: [{ question: "Do you have a job?", answer: "No, looking", flagged: true }] },
        { domain: "education", score: 5, maxScore: 10, risk: "moderate", responses: [{ question: "Do you want help with school or training?", answer: "Yes", flagged: true }] },
        { domain: "transportation", score: 4, maxScore: 10, risk: "moderate", responses: [{ question: "Has lack of transportation kept you from appointments?", answer: "Sometimes", flagged: true }] },
      ]
    }]
  },
  {
    id: "P004", name: "Robert Chen", age: 72, gender: "Male", language: "Mandarin", ethnicity: "Asian", mrn: "MRN-52947", phone: "(312) 555-0384", address: "212 W Cermak Rd, Chicago, IL", insuranceType: "Medicare",
    lastScreening: "2026-02-22", screeningStatus: "completed", riskLevel: "high",
    identifiedNeeds: ["social", "food", "health_literacy", "safety"],
    referrals: [],
    screeningHistory: [{
      id: "S004", date: "2026-02-22", overallRisk: "high", screener: "Dr. Liu", method: "interpreter_assisted", language: "Mandarin",
      culturalNotes: "Lives alone since wife passed. Adult children live out of state. Cultural reluctance to accept 'charity' - framed services as community support programs.",
      domains: [
        { domain: "social", score: 9, maxScore: 10, risk: "critical", responses: [{ question: "How often do you feel isolated?", answer: "Always", flagged: true }] },
        { domain: "food", score: 5, maxScore: 10, risk: "moderate", responses: [{ question: "Did you worry about food running out?", answer: "Sometimes", flagged: true }] },
        { domain: "health_literacy", score: 7, maxScore: 10, risk: "high", responses: [{ question: "How confident filling out forms?", answer: "Not confident", flagged: true }] },
        { domain: "safety", score: 4, maxScore: 10, risk: "moderate", responses: [{ question: "Do you feel physically safe?", answer: "Sometimes worried", flagged: true }] },
      ]
    }]
  },
  {
    id: "P005", name: "Destiny Johnson", age: 22, gender: "Female", language: "English", ethnicity: "Black/African American", mrn: "MRN-63851", phone: "(864) 555-0219", address: "405 Pelham Rd, Greenville, SC", insuranceType: "Uninsured",
    lastScreening: null, screeningStatus: "not_started", riskLevel: "moderate",
    identifiedNeeds: [],
    referrals: [],
    screeningHistory: []
  },
  {
    id: "P006", name: "Hmong Vang", age: 45, gender: "Male", language: "Hmong", ethnicity: "Asian", mrn: "MRN-74920", phone: "(414) 555-0493", address: "4501 W Villard Ave, Milwaukee, WI", insuranceType: "Medicaid",
    lastScreening: "2026-01-15", screeningStatus: "completed", riskLevel: "moderate",
    identifiedNeeds: ["health_literacy", "employment"],
    referrals: [],
    screeningHistory: [{
      id: "S006", date: "2026-01-15", overallRisk: "moderate", screener: "CHW Xiong", method: "interpreter_assisted", language: "Hmong",
      culturalNotes: "Community health worker from Hmong community conducted screening. Patient more comfortable with community member. Traditional healing practices discussed alongside Western medicine.",
      domains: [
        { domain: "health_literacy", score: 6, maxScore: 10, risk: "moderate", responses: [{ question: "How confident filling out forms?", answer: "Somewhat", flagged: true }] },
        { domain: "employment", score: 5, maxScore: 10, risk: "moderate", responses: [{ question: "Do you have stable employment?", answer: "Part-time only", flagged: true }] },
      ]
    }]
  },
  {
    id: "P007", name: "Angela Moretti", age: 56, gender: "Female", language: "English", ethnicity: "White", mrn: "MRN-85013", phone: "(205) 555-0367", address: "789 University Blvd, Birmingham, AL", insuranceType: "Private",
    lastScreening: "2026-02-05", screeningStatus: "completed", riskLevel: "low",
    identifiedNeeds: [],
    referrals: [],
    screeningHistory: [{
      id: "S007", date: "2026-02-05", overallRisk: "low", screener: "NP Williams", method: "tablet", language: "English",
      domains: [
        { domain: "food", score: 1, maxScore: 10, risk: "low", responses: [{ question: "Did you worry about food?", answer: "Never true", flagged: false }] },
        { domain: "housing", score: 0, maxScore: 10, risk: "low", responses: [{ question: "Housing concerns?", answer: "No", flagged: false }] },
      ]
    }]
  },
  {
    id: "P008", name: "Luis Ramirez", age: 41, gender: "Male", language: "Spanish", ethnicity: "Hispanic/Latino", mrn: "MRN-96284", phone: "(770) 555-0521", address: "3300 Buford Hwy, Atlanta, GA", insuranceType: "Uninsured",
    lastScreening: "2026-02-20", screeningStatus: "completed", riskLevel: "critical",
    identifiedNeeds: ["housing", "financial", "employment", "food", "utilities"],
    referrals: [],
    screeningHistory: [{
      id: "S008", date: "2026-02-20", overallRisk: "critical", screener: "SW Martinez", method: "interpreter_assisted", language: "Spanish",
      culturalNotes: "Recently lost job. Family of 5 facing eviction. Very stressed. Connected with bilingual case manager. Immigration concerns discussed.",
      domains: [
        { domain: "housing", score: 10, maxScore: 10, risk: "critical", responses: [{ question: "Are you worried about losing your housing?", answer: "Yes, eviction notice received", flagged: true }] },
        { domain: "financial", score: 9, maxScore: 10, risk: "critical", responses: [{ question: "How hard is it to pay for basics?", answer: "Very hard", flagged: true }] },
        { domain: "employment", score: 8, maxScore: 10, risk: "high", responses: [{ question: "Employment status?", answer: "Lost job last month", flagged: true }] },
        { domain: "food", score: 8, maxScore: 10, risk: "high", responses: [{ question: "Food worry?", answer: "Often true", flagged: true }] },
        { domain: "utilities", score: 7, maxScore: 10, risk: "high", responses: [{ question: "Utility disconnection threat?", answer: "Yes", flagged: true }] },
      ]
    }]
  },
];

const referrals: Referral[] = [
  {
    id: "R001", patientId: "P001", patientName: "Maria Garcia", domain: "food", status: "in_progress", organization: "Greater Chicago Food Depository", createdDate: "2026-02-11", updatedDate: "2026-02-20", assignedTo: "SW Martinez", priority: "high",
    notes: ["Patient connected to SNAP benefits application", "Referral to local food pantry with bilingual staff"],
    followUps: [{ date: "2026-02-15", note: "Called patient, SNAP application submitted", status: "on_track", contactMethod: "phone" }, { date: "2026-02-20", note: "SNAP approved. Food pantry visit scheduled for 2/25", status: "on_track", contactMethod: "phone" }]
  },
  {
    id: "R002", patientId: "P001", patientName: "Maria Garcia", domain: "housing", status: "pending", organization: "Spanish Coalition for Housing", createdDate: "2026-02-11", updatedDate: "2026-02-11", assignedTo: "SW Martinez", priority: "high",
    notes: ["Patient needs assistance with rent payment and lease negotiation"],
    followUps: []
  },
  {
    id: "R003", patientId: "P002", patientName: "James Washington", domain: "utilities", status: "resolved", organization: "Crisis Assistance Ministry", createdDate: "2026-01-29", updatedDate: "2026-02-18", assignedTo: "CHW Brown", priority: "critical",
    notes: ["Emergency utility assistance approved", "LIHEAP application submitted"],
    followUps: [{ date: "2026-02-05", note: "Emergency payment made to Duke Energy", status: "completed", contactMethod: "in_person" }, { date: "2026-02-18", note: "LIHEAP approved for ongoing assistance", status: "completed", contactMethod: "phone" }],
    closedDate: "2026-02-18", resolution: "Utility service restored. LIHEAP benefits secured for 12 months."
  },
  {
    id: "R004", patientId: "P002", patientName: "James Washington", domain: "social", status: "in_progress", organization: "VA Community Center", createdDate: "2026-01-29", updatedDate: "2026-02-22", assignedTo: "CHW Brown", priority: "high",
    notes: ["Connected to veteran peer support group", "Weekly check-in calls scheduled"],
    followUps: [{ date: "2026-02-10", note: "Attended first peer support meeting", status: "on_track", contactMethod: "phone" }, { date: "2026-02-22", note: "Attending regularly, reports improved mood", status: "on_track", contactMethod: "phone" }]
  },
  {
    id: "R005", patientId: "P003", patientName: "Fatima Al-Rashid", domain: "employment", status: "accepted", organization: "International Rescue Committee", createdDate: "2026-02-19", updatedDate: "2026-02-24", assignedTo: "SW Ahmed", priority: "high",
    notes: ["Connected to refugee employment program", "ESL classes also available"],
    followUps: [{ date: "2026-02-24", note: "Intake appointment completed. Starting employment readiness program 3/1", status: "on_track", contactMethod: "in_person" }]
  },
  {
    id: "R006", patientId: "P004", patientName: "Robert Chen", domain: "social", status: "sent", organization: "Chinese American Service League", createdDate: "2026-02-23", updatedDate: "2026-02-23", assignedTo: "Dr. Liu", priority: "critical",
    notes: ["Referred to senior social program with Mandarin-speaking staff"],
    followUps: []
  },
  {
    id: "R007", patientId: "P008", patientName: "Luis Ramirez", domain: "housing", status: "pending", organization: "Atlanta Legal Aid", createdDate: "2026-02-21", updatedDate: "2026-02-21", assignedTo: "SW Martinez", priority: "critical",
    notes: ["Emergency eviction defense needed", "Family of 5 with children under 10"],
    followUps: []
  },
  {
    id: "R008", patientId: "P008", patientName: "Luis Ramirez", domain: "food", status: "in_progress", organization: "Atlanta Community Food Bank", createdDate: "2026-02-21", updatedDate: "2026-02-25", assignedTo: "SW Martinez", priority: "high",
    notes: ["Emergency food box delivered", "SNAP application in progress"],
    followUps: [{ date: "2026-02-25", note: "Emergency food delivered. SNAP appointment scheduled 3/2", status: "on_track", contactMethod: "phone" }]
  },
];

const communityResources: CommunityResource[] = [
  { id: "CR001", name: "Greater Chicago Food Depository", domain: "food", address: "4100 W Ann Lurie Pl, Chicago, IL", phone: "(773) 247-3663", languages: ["English", "Spanish", "Polish", "Mandarin"], capacity: "available", culturalCompetencies: ["Hispanic/Latino", "Asian", "Eastern European"], acceptsInsurance: ["All"], hours: "Mon-Fri 8am-5pm", rating: 4.8 },
  { id: "CR002", name: "Spanish Coalition for Housing", domain: "housing", address: "1922 N Milwaukee Ave, Chicago, IL", phone: "(773) 342-7575", languages: ["English", "Spanish"], capacity: "limited", culturalCompetencies: ["Hispanic/Latino"], acceptsInsurance: ["N/A"], hours: "Mon-Fri 9am-6pm", rating: 4.5 },
  { id: "CR003", name: "Crisis Assistance Ministry", domain: "utilities", address: "500 Spratt St, Charlotte, NC", phone: "(704) 371-3001", languages: ["English", "Spanish"], capacity: "available", culturalCompetencies: ["Black/African American", "Hispanic/Latino"], acceptsInsurance: ["N/A"], hours: "Mon-Fri 8am-4pm", rating: 4.7 },
  { id: "CR004", name: "International Rescue Committee - Milwaukee", domain: "employment", address: "1313 N Martin Luther King Dr, Milwaukee, WI", phone: "(414) 431-0626", languages: ["English", "Arabic", "Hmong", "Burmese", "Swahili"], capacity: "available", culturalCompetencies: ["Middle Eastern/North African", "Asian", "African"], acceptsInsurance: ["Medicaid"], hours: "Mon-Fri 8:30am-5pm", rating: 4.9 },
  { id: "CR005", name: "Chinese American Service League", domain: "social", address: "2141 S Tan Ct, Chicago, IL", phone: "(312) 791-0418", languages: ["English", "Mandarin", "Cantonese"], capacity: "available", culturalCompetencies: ["Asian"], acceptsInsurance: ["Medicare", "Medicaid"], hours: "Mon-Sat 9am-5pm", rating: 4.6 },
  { id: "CR006", name: "Atlanta Legal Aid", domain: "housing", address: "54 Ellis St NE, Atlanta, GA", phone: "(404) 524-5811", languages: ["English", "Spanish"], capacity: "limited", culturalCompetencies: ["Hispanic/Latino", "Black/African American"], acceptsInsurance: ["N/A"], hours: "Mon-Fri 9am-5pm", rating: 4.4 },
  { id: "CR007", name: "Hmong American Friendship Association", domain: "health_literacy", address: "3524 W National Ave, Milwaukee, WI", phone: "(414) 643-0798", languages: ["English", "Hmong"], capacity: "available", culturalCompetencies: ["Asian", "Hmong"], acceptsInsurance: ["Medicaid", "Medicare"], hours: "Mon-Fri 9am-4:30pm", rating: 4.7 },
];

// Analytics data
const screeningTrends = [
  { month: "Sep", screenings: 245, identified: 89, referred: 72, resolved: 45 },
  { month: "Oct", screenings: 312, identified: 102, referred: 88, resolved: 56 },
  { month: "Nov", screenings: 289, identified: 95, referred: 82, resolved: 63 },
  { month: "Dec", screenings: 267, identified: 88, referred: 75, resolved: 58 },
  { month: "Jan", screenings: 356, identified: 128, referred: 110, resolved: 72 },
  { month: "Feb", screenings: 398, identified: 145, referred: 121, resolved: 84 },
];

const domainDistribution = [
  { domain: "Food Insecurity", count: 187, pct: 24 },
  { domain: "Housing", count: 156, pct: 20 },
  { domain: "Transportation", count: 112, pct: 14 },
  { domain: "Financial Strain", count: 98, pct: 13 },
  { domain: "Social Isolation", count: 89, pct: 11 },
  { domain: "Employment", count: 67, pct: 9 },
  { domain: "Utilities", count: 45, pct: 6 },
  { domain: "Health Literacy", count: 23, pct: 3 },
];

const populationData = [
  { ethnicity: "Hispanic/Latino", screened: 312, needsIdentified: 198, avgRisk: 3.2, topNeeds: ["food", "housing", "employment"] },
  { ethnicity: "Black/African American", screened: 287, needsIdentified: 167, avgRisk: 2.9, topNeeds: ["utilities", "food", "social"] },
  { ethnicity: "White", screened: 256, needsIdentified: 89, avgRisk: 1.8, topNeeds: ["financial", "transportation"] },
  { ethnicity: "Asian", screened: 198, needsIdentified: 112, avgRisk: 2.4, topNeeds: ["health_literacy", "social", "employment"] },
  { ethnicity: "Middle Eastern/North African", screened: 67, needsIdentified: 42, avgRisk: 2.7, topNeeds: ["employment", "education", "transportation"] },
  { ethnicity: "Other/Multiracial", screened: 45, needsIdentified: 21, avgRisk: 2.1, topNeeds: ["financial", "housing"] },
];

const languageData = [
  { language: "English", count: 489, pct: 42 },
  { language: "Spanish", count: 298, pct: 25 },
  { language: "Mandarin", count: 98, pct: 8 },
  { language: "Arabic", count: 67, pct: 6 },
  { language: "Hmong", count: 54, pct: 5 },
  { language: "Vietnamese", count: 45, pct: 4 },
  { language: "Korean", count: 38, pct: 3 },
  { language: "Other", count: 76, pct: 7 },
];

const closureMetrics = {
  avgDaysToResolution: 18.4,
  resolutionRate: 68,
  followUpComplianceRate: 82,
  patientSatisfaction: 4.2,
  referralAcceptanceRate: 91,
  loopClosureRate: 74,
};

export {
  patients, referrals, communityResources, screeningTrends, domainDistribution,
  populationData, languageData, closureMetrics, domainLabels, domainColors,
  riskColors, statusColors
};
