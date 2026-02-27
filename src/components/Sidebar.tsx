import { ViewType, UserRole } from "../types";
import { useAppContext } from "../context/AppContext";
import {
  LayoutDashboard, ClipboardCheck, ArrowRightLeft, Users, BarChart3, Bot, Shield,
  ChevronLeft, ChevronRight, Calendar, FolderSearch, Heart, MessageSquare, MapPin,
  Home, Compass, Megaphone, UserCircle, Settings, SwitchCamera
} from "lucide-react";
import { useState } from "react";

interface NavItem { id: ViewType; label: string; icon: any; description: string }

const adminNav: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Overview & KPIs" },
  { id: "screening", label: "Screening", icon: ClipboardCheck, description: "SDOH Assessments" },
  { id: "referrals", label: "Referrals", icon: ArrowRightLeft, description: "Track & Close Loops" },
  { id: "patients", label: "Patients", icon: Users, description: "Population Registry" },
  { id: "analytics", label: "Analytics", icon: BarChart3, description: "Insights & Equity" },
  { id: "agent", label: "AI Agent", icon: Bot, description: "Intelligent Assistant" },
];

const screenerNav: NavItem[] = [
  { id: "my_schedule", label: "My Schedule", icon: Calendar, description: "Today's appointments" },
  { id: "my_screenings", label: "Screenings", icon: ClipboardCheck, description: "Conduct assessments" },
  { id: "referrals", label: "Referrals", icon: ArrowRightLeft, description: "Track my referrals" },
  { id: "resources", label: "Resources", icon: FolderSearch, description: "Community directory" },
  { id: "patients", label: "My Patients", icon: Users, description: "Assigned caseload" },
];

const patientNav: NavItem[] = [
  { id: "my_health", label: "My Health", icon: Heart, description: "Health & needs overview" },
  { id: "my_referrals", label: "My Services", icon: Compass, description: "Connected resources" },
  { id: "my_resources", label: "Find Help", icon: MapPin, description: "Community resources" },
  { id: "my_messages", label: "Messages", icon: MessageSquare, description: "Care team updates" },
];

const chwNav: NavItem[] = [
  { id: "field_dashboard", label: "Field Dashboard", icon: LayoutDashboard, description: "Today's overview" },
  { id: "field_visits", label: "Home Visits", icon: Home, description: "Scheduled visits" },
  { id: "outreach", label: "Outreach", icon: Megaphone, description: "Community engagement" },
  { id: "community_resources", label: "Resources", icon: MapPin, description: "Local directory" },
  { id: "my_screenings", label: "Screenings", icon: ClipboardCheck, description: "Field screenings" },
];

const navByRole: Record<UserRole, NavItem[]> = {
  admin: adminNav, screener: screenerNav, patient: patientNav, chw: chwNav,
};

const roleInfo: Record<UserRole, { label: string; color: string; icon: any }> = {
  admin: { label: "Administration", color: "#f59e0b", icon: Settings },
  screener: { label: "Screener", color: "#3b82f6", icon: ClipboardCheck },
  patient: { label: "Patient Portal", color: "#ec4899", icon: UserCircle },
  chw: { label: "Community Worker", color: "#22c55e", icon: Compass },
};

export default function Sidebar() {
  const { activeView, setActiveView, currentRole, setCurrentRole, currentUser } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const navItems = navByRole[currentRole];
  const ri = roleInfo[currentRole];

  return (
    <aside className={`relative flex flex-col bg-[#0d1220] border-r border-white/[0.06] transition-all duration-300 ${collapsed ? "w-[68px]" : "w-[250px]"}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-semibold text-white tracking-tight leading-tight">SDOH Bridge</h1>
            <p className="text-[10px] tracking-wider uppercase" style={{ color: ri.color }}>{ri.label}</p>
          </div>
        )}
      </div>

      {/* Role Switcher */}
      <div className="px-2 pt-3 pb-1">
        <button
          onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left ${
            showRoleSwitcher ? 'bg-white/[0.06] border border-white/[0.08]' : 'bg-white/[0.02] border border-transparent hover:bg-white/[0.04]'
          }`}
        >
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${currentUser.avatarGradient} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
            {currentUser.initials}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-gray-200 font-medium truncate">{currentUser.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{currentUser.title}</p>
              </div>
              <SwitchCamera className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            </>
          )}
        </button>

        {showRoleSwitcher && !collapsed && (
          <div className="mt-1 p-1.5 rounded-lg bg-[#111827] border border-white/[0.08] space-y-0.5">
            <p className="text-[9px] text-gray-600 uppercase tracking-wider px-2 py-1">Switch Portal View</p>
            {(["admin", "screener", "patient", "chw"] as UserRole[]).map(role => {
              const info = roleInfo[role];
              const isActive = currentRole === role;
              return (
                <button
                  key={role}
                  onClick={() => { setCurrentRole(role); setShowRoleSwitcher(false); }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-all ${
                    isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <info.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: info.color }} />
                  <span className={`text-[12px] ${isActive ? 'text-white font-medium' : 'text-gray-400'}`}>{info.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: info.color }} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.04] mx-4 my-1" />

      {/* Nav */}
      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group
                ${isActive
                  ? "text-white"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"}`}
              style={isActive ? { backgroundColor: ri.color + '15', color: ri.color } : {}}
            >
              <item.icon
                className="w-[18px] h-[18px] flex-shrink-0"
                style={isActive ? { color: ri.color } : {}}
              />
              {!collapsed && (
                <div className="min-w-0">
                  <span className="text-[13px] font-medium block">{item.label}</span>
                  <span className="text-[10px] text-gray-600 block">{item.description}</span>
                </div>
              )}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ri.color }} />}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1a2035] border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-[#1e2640] transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Footer - context */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/[0.06]">
          {currentUser.language && (
            <p className="text-[10px] text-gray-600 mb-0.5">Language: {currentUser.language}</p>
          )}
          {currentUser.location && (
            <p className="text-[10px] text-gray-600">Location: {currentUser.location}</p>
          )}
        </div>
      )}
    </aside>
  );
}
