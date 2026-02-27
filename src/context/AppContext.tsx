import { createContext, useContext, useState, ReactNode } from "react";
import { ViewType, UserRole, UserProfile, Patient, Referral } from "../types";
import { patients as mockPatients, referrals as mockReferrals } from "../data/mockData";

const userProfiles: Record<UserRole, UserProfile> = {
  admin: {
    id: "U001", name: "Emmanuel Chepkwony", role: "admin", initials: "EC",
    title: "AVP, Enterprise Language Services", avatarGradient: "from-amber-500 to-orange-600", location: "Multi-State"
  },
  screener: {
    id: "U002", name: "Sofia Rodriguez", role: "screener", initials: "SR",
    title: "Bilingual Screener, Social Work", avatarGradient: "from-blue-500 to-cyan-600", language: "Spanish", location: "Chicago, IL"
  },
  patient: {
    id: "P001", name: "Maria Garcia", role: "patient", initials: "MG",
    title: "Patient", avatarGradient: "from-rose-500 to-pink-600", language: "Spanish", location: "Chicago, IL"
  },
  chw: {
    id: "U003", name: "Pang Xiong", role: "chw", initials: "PX",
    title: "Community Health Worker", avatarGradient: "from-emerald-500 to-teal-600", language: "Hmong", location: "Milwaukee, WI"
  },
};

const defaultViews: Record<UserRole, ViewType> = {
  admin: "dashboard",
  screener: "my_schedule",
  patient: "my_health",
  chw: "field_dashboard",
};

interface AppContextType {
  activeView: ViewType;
  setActiveView: (v: ViewType) => void;
  currentRole: UserRole;
  setCurrentRole: (r: UserRole) => void;
  currentUser: UserProfile;
  patients: Patient[];
  setPatients: (p: Patient[]) => void;
  referrals: Referral[];
  setReferrals: (r: Referral[]) => void;
  selectedPatient: Patient | null;
  setSelectedPatient: (p: Patient | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRoleState] = useState<UserRole>("admin");
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const setCurrentRole = (r: UserRole) => {
    setCurrentRoleState(r);
    setActiveView(defaultViews[r]);
    setSelectedPatient(null);
  };

  return (
    <AppContext.Provider value={{
      activeView, setActiveView, currentRole, setCurrentRole,
      currentUser: userProfiles[currentRole],
      patients, setPatients, referrals, setReferrals,
      selectedPatient, setSelectedPatient
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
