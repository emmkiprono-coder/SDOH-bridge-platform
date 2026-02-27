export type UserRole = "admin" | "screener" | "patient" | "chw";

export type ViewType =
  | "dashboard" | "screening" | "referrals" | "patients" | "analytics" | "agent"
  | "my_screenings" | "my_schedule" | "resources"
  | "my_health" | "my_referrals" | "my_resources" | "my_messages"
  | "field_dashboard" | "field_visits" | "community_resources" | "outreach";

export type ScreeningStatus = "not_started" | "in_progress" | "completed" | "expired";
export type RiskLevel = "low" | "moderate" | "high" | "critical";
export type ReferralStatus = "pending" | "sent" | "accepted" | "in_progress" | "resolved" | "closed" | "declined";
export type SDOHDomain = "food" | "housing" | "transportation" | "utilities" | "safety" | "financial" | "employment" | "education" | "social" | "health_literacy";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  initials: string;
  title: string;
  avatarGradient: string;
  language?: string;
  location?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  language: string;
  ethnicity: string;
  mrn: string;
  phone: string;
  address: string;
  insuranceType: string;
  lastScreening: string | null;
  screeningStatus: ScreeningStatus;
  riskLevel: RiskLevel;
  identifiedNeeds: SDOHDomain[];
  referrals: Referral[];
  screeningHistory: ScreeningRecord[];
}

export interface ScreeningRecord {
  id: string;
  date: string;
  domains: ScreeningDomainResult[];
  overallRisk: RiskLevel;
  screener: string;
  method: "in_person" | "phone" | "tablet" | "interpreter_assisted";
  language: string;
  culturalNotes?: string;
}

export interface ScreeningDomainResult {
  domain: SDOHDomain;
  score: number;
  maxScore: number;
  risk: RiskLevel;
  responses: { question: string; answer: string; flagged: boolean }[];
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  domain: SDOHDomain;
  status: ReferralStatus;
  organization: string;
  createdDate: string;
  updatedDate: string;
  assignedTo: string;
  priority: RiskLevel;
  notes: string[];
  followUps: FollowUp[];
  closedDate?: string;
  resolution?: string;
}

export interface FollowUp {
  date: string;
  note: string;
  status: string;
  contactMethod: string;
}

export interface CommunityResource {
  id: string;
  name: string;
  domain: SDOHDomain;
  address: string;
  phone: string;
  languages: string[];
  capacity: "available" | "limited" | "waitlist" | "full";
  culturalCompetencies: string[];
  acceptsInsurance: string[];
  hours: string;
  rating: number;
}

export interface AgentMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  actions?: AgentAction[];
}

export interface AgentAction {
  type: "screening_initiated" | "referral_created" | "follow_up_scheduled" | "resource_found" | "gap_identified" | "report_generated";
  description: string;
  data?: any;
}

export interface ScheduleItem {
  id: string;
  time: string;
  patientName: string;
  patientId: string;
  type: "screening" | "follow_up" | "home_visit" | "phone_call";
  language: string;
  location: string;
  interpreterNeeded: boolean;
  notes?: string;
}

export interface PatientMessage {
  id: string;
  from: string;
  role: string;
  content: string;
  timestamp: string;
  read: boolean;
}
