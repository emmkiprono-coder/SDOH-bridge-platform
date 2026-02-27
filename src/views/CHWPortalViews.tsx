import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Home, MapPin, Phone, Globe, Users, AlertTriangle, CheckCircle, Clock, ChevronRight,
  Heart, Megaphone, Plus, Navigation, Star, ExternalLink, MessageSquare, Compass,
  ClipboardCheck, Calendar, TrendingUp, Target, UserPlus, Building2
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { domainLabels, domainColors, riskColors, communityResources } from "../data/mockData";
import { SDOHDomain } from "../types";

const fieldVisits = [
  { id: "FV1", time: "9:00 AM", patientName: "Hmong Vang", address: "4501 W Villard Ave, Milwaukee", language: "Hmong", purpose: "Re-screening + cultural health navigation", priority: "moderate" as const, notes: "Discuss traditional healing alongside Western treatment. CHW from Hmong community preferred.", completed: false },
  { id: "FV2", time: "10:30 AM", patientName: "New Referral: Yer Moua", address: "3812 N 35th St, Milwaukee", language: "Hmong", purpose: "Initial home assessment, SDOH screening", priority: "high" as const, notes: "Referred from HAFA. Young mother, 2 children. Possible food insecurity and isolation.", completed: false },
  { id: "FV3", time: "1:00 PM", patientName: "Community Check: Elderly Group", address: "Hmong American Friendship Assoc., Milwaukee", language: "Hmong", purpose: "Group wellness check, resource distribution", priority: "moderate" as const, notes: "Monthly group visit. 12 seniors. Distribute health literacy materials in Hmong.", completed: false },
  { id: "FV4", time: "3:00 PM", patientName: "Fatima Al-Rashid", address: "3200 S 27th St, Milwaukee", language: "Arabic", purpose: "Employment program follow-up", priority: "high" as const, notes: "Check IRC intake progress. Explore transportation for ESL classes. Female CHW or interpreter needed.", completed: false },
];

const outreachEvents = [
  { id: "OE1", title: "Hmong New Year Health Fair", date: "Mar 15, 2026", location: "HAFA Community Center, Milwaukee", attendees: 150, status: "planning", domains: ["health_literacy", "food", "social"] as SDOHDomain[], description: "Annual health fair during Hmong New Year celebrations. SDOH screenings, resource sign-ups, and bilingual health education." },
  { id: "OE2", title: "Mosque Health Outreach", date: "Mar 8, 2026", location: "Islamic Society of Milwaukee", attendees: 60, status: "confirmed", domains: ["food", "employment", "health_literacy"] as SDOHDomain[], description: "Partnership with ISM for after-Friday-prayer health outreach. Arabic interpreter confirmed. Halal food bank info distributed." },
  { id: "OE3", title: "Senior Social Hour (Mandarin)", date: "Weekly, Wednesdays", location: "CASL, Chicago", attendees: 25, status: "ongoing", domains: ["social", "health_literacy"] as SDOHDomain[], description: "Weekly social engagement program for Mandarin-speaking seniors. Includes gentle exercise, health education, and social connection." },
  { id: "OE4", title: "Back-to-School Resource Drive", date: "Aug 2026", location: "Multiple sites, 6 states", attendees: 500, status: "planning", domains: ["education", "food", "financial"] as SDOHDomain[], description: "System-wide back-to-school event with SDOH screening, school supply distribution, and resource enrollment." },
];

const communityPartners = [
  { name: "Hmong American Friendship Assoc.", contact: "Lee Xiong", phone: "(414) 643-0798", status: "active", domains: ["health_literacy", "social", "employment"] as SDOHDomain[], languages: ["Hmong", "English"], notes: "Primary Hmong community partner. Hosts monthly senior groups." },
  { name: "Islamic Society of Milwaukee", contact: "Imam Hassan", phone: "(414) 282-1812", status: "new", domains: ["food", "social", "employment"] as SDOHDomain[], languages: ["Arabic", "English"], notes: "New partnership. Halal food bank, after-prayer outreach." },
  { name: "International Rescue Committee", contact: "Amara Johnson", phone: "(414) 431-0626", status: "active", domains: ["employment", "education", "housing"] as SDOHDomain[], languages: ["Arabic", "Hmong", "Burmese", "English"], notes: "Refugee resettlement. Employment readiness, ESL, case mgmt." },
  { name: "Centro Legal de Milwaukee", contact: "Ana Gutierrez", phone: "(414) 384-7900", status: "active", domains: ["housing", "financial"] as SDOHDomain[], languages: ["Spanish", "English"], notes: "Legal aid for housing, immigration, consumer rights." },
];

function CHWFieldDashboard() {
  const { patients } = useAppContext();
  const todayVisits = fieldVisits.length;
  const completedVisits = fieldVisits.filter(v => v.completed).length;
  const highPriority = fieldVisits.filter(v => v.priority === "high" || v.priority === "critical").length;

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Field Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Wednesday, February 26, 2026 - Milwaukee, WI</p>
        </div>
        <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/5 text-[11px]">
          <Compass className="w-3 h-3 mr-1" /> Community Health Worker
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-600/5 border-white/[0.06]">
          <CardContent className="p-3.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Today's Visits</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{todayVisits}</p>
            <p className="text-[10px] text-gray-500">{highPriority} high priority</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-600/5 border-white/[0.06]">
          <CardContent className="p-3.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Active Patients</p>
            <p className="text-xl font-bold text-blue-400 mt-0.5">18</p>
            <p className="text-[10px] text-gray-500">in your community</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-600/5 border-white/[0.06]">
          <CardContent className="p-3.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Open Referrals</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">7</p>
            <p className="text-[10px] text-gray-500">needing follow-up</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-500/10 to-purple-600/5 border-white/[0.06]">
          <CardContent className="p-3.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Upcoming Events</p>
            <p className="text-xl font-bold text-violet-400 mt-0.5">{outreachEvents.filter(e => e.status !== "ongoing").length}</p>
            <p className="text-[10px] text-gray-500">outreach planned</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Route */}
      <Card className="bg-[#111827]/60 border-white/[0.06]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-gray-300 font-medium flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" /> Today's Route
            </CardTitle>
            <Badge variant="outline" className="text-[10px] border-white/10 text-gray-400">{completedVisits}/{todayVisits} completed</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {fieldVisits.map((visit, idx) => (
            <div key={visit.id} className={`flex gap-4 p-3.5 rounded-xl transition-all ${
              visit.priority === "high" ? 'bg-amber-500/[0.04] border border-amber-500/10' : 'bg-white/[0.02] border border-white/[0.04]'
            }`}>
              <div className="w-14 text-right flex-shrink-0">
                <p className="text-[13px] text-gray-200 font-medium">{visit.time}</p>
                <p className="text-[9px] text-gray-600">Stop {idx + 1}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: riskColors[visit.priority] }} />
                {idx < fieldVisits.length - 1 && <div className="w-px flex-1 bg-white/[0.06] mt-1" />}
              </div>
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[14px] text-gray-100 font-medium">{visit.patientName}</p>
                  <Badge className="text-[9px] px-1.5 py-0" style={{ backgroundColor: riskColors[visit.priority] + '15', color: riskColors[visit.priority], border: 'none' }}>
                    {visit.priority}
                  </Badge>
                </div>
                <p className="text-[12px] text-gray-400">{visit.purpose}</p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{visit.address}</span>
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{visit.language}</span>
                </div>
                {visit.notes && (
                  <p className="text-[11px] text-emerald-300/60 italic mt-1">{visit.notes}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Community Impact */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-[#111827]/60 border-white/[0.06]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <p className="text-[12px] text-gray-300 font-medium">Monthly Impact</p>
            </div>
            <div className="space-y-2">
              {[
                { label: "Home visits completed", value: 34, target: 40 },
                { label: "Screenings conducted", value: 22, target: 25 },
                { label: "Referrals connected", value: 18, target: 20 },
                { label: "Follow-ups completed", value: 28, target: 35 },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-[10px] mb-0.5">
                    <span className="text-gray-400">{m.label}</span>
                    <span className="text-gray-500">{m.value}/{m.target}</span>
                  </div>
                  <Progress value={(m.value / m.target) * 100} className="h-1 [&>div]:bg-emerald-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111827]/60 border-white/[0.06]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-blue-400" />
              <p className="text-[12px] text-gray-300 font-medium">Languages Served</p>
            </div>
            <div className="space-y-2">
              {[
                { lang: "Hmong", patients: 12, color: "#22c55e" },
                { lang: "Arabic", patients: 4, color: "#3b82f6" },
                { lang: "Spanish", patients: 2, color: "#f59e0b" },
              ].map(l => (
                <div key={l.lang} className="flex items-center gap-3 p-2 rounded bg-white/[0.02]">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="text-[12px] text-gray-200 flex-1">{l.lang}</span>
                  <span className="text-[11px] text-gray-500">{l.patients} patients</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111827]/60 border-white/[0.06]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-amber-400" />
              <p className="text-[12px] text-gray-300 font-medium">Top Needs in Area</p>
            </div>
            <div className="space-y-2">
              {[
                { domain: "health_literacy" as SDOHDomain, count: 14 },
                { domain: "employment" as SDOHDomain, count: 11 },
                { domain: "social" as SDOHDomain, count: 9 },
                { domain: "food" as SDOHDomain, count: 7 },
              ].map(d => (
                <div key={d.domain} className="flex items-center gap-2 p-2 rounded bg-white/[0.02]">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: domainColors[d.domain] }} />
                  <span className="text-[11px] text-gray-300 flex-1">{domainLabels[d.domain]}</span>
                  <span className="text-[11px] text-gray-500">{d.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CHWFieldVisits() {
  const [visitNotes, setVisitNotes] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Home Visits</h1>
          <p className="text-sm text-gray-500 mt-0.5">Scheduled field visits and assessments</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8">
          <Plus className="w-3 h-3 mr-1" /> Add Visit
        </Button>
      </div>

      {fieldVisits.map(visit => (
        <Card key={visit.id} className={`border-white/[0.06] ${completed.has(visit.id) ? 'bg-emerald-500/[0.02] opacity-60' : 'bg-[#111827]/60'}`}>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{ backgroundColor: riskColors[visit.priority] + '10' }}>
                <Home className="w-5 h-5" style={{ color: riskColors[visit.priority] }} />
                <p className="text-[9px] mt-0.5" style={{ color: riskColors[visit.priority] }}>{visit.time}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[15px] text-gray-100 font-medium">{visit.patientName}</h3>
                  <Badge className="text-[9px] px-1.5" style={{ backgroundColor: riskColors[visit.priority] + '15', color: riskColors[visit.priority], border: 'none' }}>
                    {visit.priority}
                  </Badge>
                  {completed.has(visit.id) && (
                    <Badge className="text-[9px] px-1.5 bg-emerald-500/15 text-emerald-400 border-none">
                      <CheckCircle className="w-2.5 h-2.5 mr-0.5" /> Completed
                    </Badge>
                  )}
                </div>
                <p className="text-[12px] text-gray-400">{visit.purpose}</p>
                <div className="flex items-center gap-4 mt-1.5 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{visit.address}</span>
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{visit.language}</span>
                </div>
                {visit.notes && (
                  <div className="mt-2 p-2.5 rounded-lg bg-white/[0.02] border-l-2 border-emerald-500/30">
                    <p className="text-[11px] text-gray-400 italic">{visit.notes}</p>
                  </div>
                )}

                {/* Visit notes input */}
                {!completed.has(visit.id) && (
                  <div className="mt-3 space-y-2">
                    <Textarea
                      value={visitNotes[visit.id] || ""}
                      onChange={e => setVisitNotes({ ...visitNotes, [visit.id]: e.target.value })}
                      placeholder="Document visit observations, patient needs, cultural notes, follow-up actions..."
                      className="bg-white/[0.02] border-white/[0.06] text-gray-300 text-[12px] min-h-[70px] resize-none placeholder:text-gray-600"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7"
                        onClick={() => setCompleted(prev => new Set([...prev, visit.id]))}>
                        <CheckCircle className="w-3 h-3 mr-1" /> Complete Visit
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/10 text-gray-300 text-[11px] h-7">
                        <ClipboardCheck className="w-3 h-3 mr-1" /> Start Screening
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/10 text-gray-300 text-[11px] h-7">
                        <Phone className="w-3 h-3 mr-1" /> Request Interpreter
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CHWOutreach() {
  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Community Outreach</h1>
          <p className="text-sm text-gray-500 mt-0.5">Events, partnerships, and engagement activities</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8">
          <Plus className="w-3 h-3 mr-1" /> Plan Event
        </Button>
      </div>

      {/* Events */}
      <div>
        <h2 className="text-[13px] text-gray-400 font-medium mb-3">Upcoming & Ongoing Events</h2>
        <div className="space-y-3">
          {outreachEvents.map(event => (
            <Card key={event.id} className="bg-[#111827]/60 border-white/[0.06]">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-violet-500/10 flex flex-col items-center justify-center flex-shrink-0">
                    <Megaphone className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[15px] text-gray-100 font-medium">{event.title}</h3>
                      <Badge className="text-[9px] px-1.5" style={{
                        backgroundColor: event.status === "confirmed" ? '#22c55e15' : event.status === "ongoing" ? '#3b82f615' : '#f59e0b15',
                        color: event.status === "confirmed" ? '#22c55e' : event.status === "ongoing" ? '#3b82f6' : '#f59e0b',
                        border: 'none'
                      }}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.attendees} expected</span>
                    </div>
                    <p className="text-[12px] text-gray-400">{event.description}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {event.domains.map(d => (
                        <Badge key={d} className="text-[9px] px-1.5 py-0" style={{ backgroundColor: domainColors[d] + '15', color: domainColors[d], border: 'none' }}>
                          {domainLabels[d]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Partners */}
      <div>
        <h2 className="text-[13px] text-gray-400 font-medium mb-3">Community Partners</h2>
        <div className="grid grid-cols-2 gap-3">
          {communityPartners.map(partner => (
            <Card key={partner.name} className="bg-[#111827]/60 border-white/[0.06]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-[13px] text-gray-100 font-medium flex-1">{partner.name}</h3>
                  <Badge className="text-[9px] px-1.5" style={{
                    backgroundColor: partner.status === "active" ? '#22c55e15' : '#3b82f615',
                    color: partner.status === "active" ? '#22c55e' : '#3b82f6', border: 'none'
                  }}>
                    {partner.status}
                  </Badge>
                </div>
                <div className="text-[11px] text-gray-500 space-y-1 mb-2">
                  <p>Contact: {partner.contact} - {partner.phone}</p>
                  <p>Languages: {partner.languages.join(", ")}</p>
                </div>
                <p className="text-[11px] text-gray-400 italic mb-2">{partner.notes}</p>
                <div className="flex items-center gap-1">
                  {partner.domains.map(d => (
                    <div key={d} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: domainColors[d] }} title={domainLabels[d]} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function CHWCommunityResources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [langFilter, setLangFilter] = useState("all");

  const filtered = communityResources.filter(r => {
    if (searchTerm && !r.name.toLowerCase().includes(searchTerm.toLowerCase()) && !domainLabels[r.domain].toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (langFilter !== "all" && !r.languages.includes(langFilter)) return false;
    return true;
  });

  const capacityColors: Record<string, string> = { available: "#22c55e", limited: "#f59e0b", waitlist: "#f97316", full: "#ef4444" };

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Community Resources</h1>
        <p className="text-sm text-gray-500 mt-0.5">Local directory for referrals and patient connections</p>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <Input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search resources by name or domain..."
          className="flex-1 max-w-sm h-9 bg-white/[0.04] border-white/[0.08] text-gray-200 text-sm placeholder:text-gray-600"
        />
        <div className="flex gap-1.5">
          {["all", "English", "Hmong", "Arabic", "Spanish"].map(l => (
            <button key={l} onClick={() => setLangFilter(l)}
              className={`px-3 py-1.5 rounded-md text-[11px] transition-all ${langFilter === l ? 'bg-emerald-500/15 text-emerald-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]'}`}>
              {l === "all" ? "All Languages" : l}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="space-y-2">
        {filtered.map(resource => (
          <Card key={resource.id} className="bg-[#111827]/60 border-white/[0.06]">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: domainColors[resource.domain] + '15' }}>
                  <MapPin className="w-5 h-5" style={{ color: domainColors[resource.domain] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[14px] text-gray-100 font-medium">{resource.name}</h3>
                    <Badge className="text-[9px] px-1.5" style={{ backgroundColor: domainColors[resource.domain] + '15', color: domainColors[resource.domain], border: 'none' }}>
                      {domainLabels[resource.domain]}
                    </Badge>
                    <Badge className="text-[9px] px-1.5" style={{ backgroundColor: capacityColors[resource.capacity] + '15', color: capacityColors[resource.capacity], border: 'none' }}>
                      {resource.capacity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{resource.address}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{resource.phone}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{resource.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-gray-500">Languages:</span>
                    {resource.languages.map(l => (
                      <Badge key={l} variant="outline" className="text-[9px] py-0 border-white/10 text-gray-400">{l}</Badge>
                    ))}
                    <div className="ml-auto flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= Math.round(resource.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}`} />
                      ))}
                      <span className="text-[10px] text-gray-500 ml-1">{resource.rating}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-white/10 text-gray-300 text-[11px] h-7 flex-shrink-0">
                  <UserPlus className="w-3 h-3 mr-1" /> Refer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { CHWFieldDashboard, CHWFieldVisits, CHWOutreach, CHWCommunityResources };
