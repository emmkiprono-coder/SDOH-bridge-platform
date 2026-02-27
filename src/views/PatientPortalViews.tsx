import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart, CheckCircle, Clock, Globe, MapPin, Phone, ArrowRight, AlertTriangle,
  Utensils, Home, Car, Zap, Shield, DollarSign, Briefcase, GraduationCap, Users,
  BookOpen, Compass, MessageSquare, Send, Star, ExternalLink, HelpCircle
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { domainLabels, domainColors, riskColors, statusColors, communityResources } from "../data/mockData";
import { PatientMessage, SDOHDomain } from "../types";

const domainIcons: Record<SDOHDomain, any> = {
  food: Utensils, housing: Home, transportation: Car, utilities: Zap,
  safety: Shield, financial: DollarSign, employment: Briefcase, education: GraduationCap,
  social: Users, health_literacy: BookOpen,
};

const friendlyDomainNames: Record<SDOHDomain, string> = {
  food: "Food & Nutrition", housing: "Housing & Shelter", transportation: "Transportation",
  utilities: "Utility Bills", safety: "Personal Safety", financial: "Money & Bills",
  employment: "Work & Jobs", education: "Education & Training", social: "Social Connections",
  health_literacy: "Understanding Health Info",
};

const statusExplanations: Record<string, string> = {
  pending: "We're connecting you to this service",
  sent: "We've sent your information to the provider",
  accepted: "The provider has accepted your referral",
  in_progress: "You're actively receiving help",
  resolved: "This need has been addressed!",
  closed: "This case is complete",
};

const patientMessages: PatientMessage[] = [
  { id: "M1", from: "Sofia Rodriguez", role: "Social Worker", content: "Great news, Maria! Your SNAP benefits have been approved. You should receive your EBT card within 5-7 business days. Call me if you have any questions.", timestamp: "2026-02-20T14:30:00", read: true },
  { id: "M2", from: "Sofia Rodriguez", role: "Social Worker", content: "I've scheduled you for a housing consultation with Spanish Coalition for Housing on March 3rd at 10:00 AM. They have bilingual staff. Would you like me to arrange transportation?", timestamp: "2026-02-24T09:15:00", read: true },
  { id: "M3", from: "Greater Chicago Food Depository", role: "Community Partner", content: "Your food pantry visit is confirmed for Tuesday, February 25. Please bring your referral letter and a photo ID. We have Spanish-speaking staff available. Address: 4100 W Ann Lurie Pl, Chicago.", timestamp: "2026-02-23T11:00:00", read: false },
  { id: "M4", from: "Dr. Rodriguez", role: "Primary Care", content: "Maria, I wanted to check in on how you're doing since our last visit. Remember, if you need anything before your next appointment, don't hesitate to reach out. Tu salud importa.", timestamp: "2026-02-25T16:00:00", read: false },
];

function PatientMyHealth() {
  const { patients, referrals } = useAppContext();
  const patient = patients.find(p => p.id === "P001")!;
  const myReferrals = referrals.filter(r => r.patientId === "P001");
  const activeReferrals = myReferrals.filter(r => !["resolved", "closed"].includes(r.status));
  const resolvedReferrals = myReferrals.filter(r => ["resolved", "closed"].includes(r.status));
  const latestScreening = patient.screeningHistory[0];

  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-6">
      {/* Welcome */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent border border-rose-500/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">MG</div>
          <div>
            <h1 className="text-lg font-semibold text-white">Hola, Maria 👋</h1>
            <p className="text-[13px] text-gray-400">Here's an overview of your health and support services</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.04]">
            <p className="text-[10px] text-gray-500 uppercase">Active Services</p>
            <p className="text-xl font-bold text-rose-400 mt-0.5">{activeReferrals.length}</p>
            <p className="text-[10px] text-gray-500">providers helping you</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04]">
            <p className="text-[10px] text-gray-500 uppercase">Needs Addressed</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{resolvedReferrals.length}</p>
            <p className="text-[10px] text-gray-500">services completed</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04]">
            <p className="text-[10px] text-gray-500 uppercase">Last Check-In</p>
            <p className="text-xl font-bold text-blue-400 mt-0.5">{latestScreening?.date}</p>
            <p className="text-[10px] text-gray-500">health screening</p>
          </div>
        </div>
      </div>

      {/* My Needs - Visual Summary */}
      <Card className="bg-[#111827]/60 border-white/[0.06]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-300 font-medium flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" /> Areas Where We're Helping You
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {patient.identifiedNeeds.map(need => {
            const Icon = domainIcons[need];
            const color = domainColors[need];
            const referral = myReferrals.find(r => r.domain === need);
            const isResolved = referral && ["resolved", "closed"].includes(referral.status);
            return (
              <div key={need} className={`flex items-center gap-4 p-3.5 rounded-xl ${isResolved ? 'bg-emerald-500/[0.04] border border-emerald-500/10' : 'bg-white/[0.02] border border-white/[0.04]'}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '15' }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-gray-100 font-medium">{friendlyDomainNames[need]}</p>
                  {referral ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[11px] text-gray-500">{referral.organization}</p>
                      <Badge className="text-[9px] px-1.5 py-0" style={{
                        backgroundColor: isResolved ? '#22c55e15' : statusColors[referral.status] + '15',
                        color: isResolved ? '#22c55e' : statusColors[referral.status],
                        border: 'none'
                      }}>
                        {isResolved ? '✓ Resolved' : statusExplanations[referral.status]}
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-[11px] text-amber-400">We're looking for the right support for you</p>
                  )}
                </div>
                {isResolved ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-400/50 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Upcoming Actions */}
      <Card className="bg-[#111827]/60 border-white/[0.06]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-300 font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" /> What's Coming Up
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { date: "Feb 25", title: "Food Pantry Visit", org: "Greater Chicago Food Depository", detail: "Bring referral letter and photo ID", color: "#f59e0b" },
            { date: "Mar 3", title: "Housing Consultation", org: "Spanish Coalition for Housing", detail: "Bilingual staff available, 10:00 AM", color: "#3b82f6" },
            { date: "Mar 10", title: "Follow-up Screening", org: "Division St Clinic", detail: "Check on progress and any new needs", color: "#22c55e" },
          ].map((event, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
              <div className="w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0" style={{ backgroundColor: event.color + '10' }}>
                <p className="text-[9px] uppercase tracking-wider" style={{ color: event.color }}>{event.date.split(' ')[0]}</p>
                <p className="text-sm font-bold" style={{ color: event.color }}>{event.date.split(' ')[1]}</p>
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-gray-100 font-medium">{event.title}</p>
                <p className="text-[11px] text-gray-500">{event.org}</p>
                <p className="text-[10px] text-gray-600">{event.detail}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Help */}
      <div className="grid grid-cols-2 gap-3">
        <button className="p-4 rounded-xl bg-rose-500/[0.06] border border-rose-500/10 hover:bg-rose-500/[0.1] transition-all text-left">
          <Phone className="w-5 h-5 text-rose-400 mb-2" />
          <p className="text-[13px] text-gray-100 font-medium">Call My Care Team</p>
          <p className="text-[11px] text-gray-500">Talk to Sofia Rodriguez, SW</p>
        </button>
        <button className="p-4 rounded-xl bg-blue-500/[0.06] border border-blue-500/10 hover:bg-blue-500/[0.1] transition-all text-left">
          <HelpCircle className="w-5 h-5 text-blue-400 mb-2" />
          <p className="text-[13px] text-gray-100 font-medium">I Need Help Now</p>
          <p className="text-[11px] text-gray-500">Emergency resources & crisis line</p>
        </button>
      </div>
    </div>
  );
}

function PatientMyReferrals() {
  const { referrals } = useAppContext();
  const myReferrals = referrals.filter(r => r.patientId === "P001");

  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">My Services</h1>
        <p className="text-sm text-gray-500 mt-0.5">Organizations and programs helping you</p>
      </div>

      {myReferrals.map(ref => {
        const Icon = domainIcons[ref.domain];
        const isResolved = ["resolved", "closed"].includes(ref.status);
        return (
          <Card key={ref.id} className={`border-white/[0.06] ${isResolved ? 'bg-emerald-500/[0.03]' : 'bg-[#111827]/60'}`}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: domainColors[ref.domain] + '15' }}>
                  <Icon className="w-6 h-6" style={{ color: domainColors[ref.domain] }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] text-gray-100 font-medium">{ref.organization}</h3>
                    <Badge className="text-[10px] px-2" style={{
                      backgroundColor: isResolved ? '#22c55e15' : statusColors[ref.status] + '15',
                      color: isResolved ? '#22c55e' : statusColors[ref.status], border: 'none'
                    }}>
                      {isResolved ? '✓ Complete' : statusExplanations[ref.status]}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-gray-400">{friendlyDomainNames[ref.domain]}</p>

                  {/* Progress steps - simplified for patient */}
                  <div className="flex gap-1 mt-3 mb-3">
                    {["Referred", "Connected", "Getting Help", "Done!"].map((step, i) => {
                      const statusIdx = ["pending", "sent", "accepted", "in_progress"].indexOf(ref.status);
                      const resolvedIdx = isResolved ? 3 : statusIdx;
                      return (
                        <div key={step} className="flex-1">
                          <div className={`h-2 rounded-full ${i <= resolvedIdx ? '' : 'bg-white/[0.04]'}`}
                            style={i <= resolvedIdx ? { backgroundColor: isResolved ? '#22c55e' : domainColors[ref.domain] } : {}} />
                          <p className="text-[9px] text-gray-600 mt-0.5 text-center">{step}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Timeline for patient */}
                  {ref.followUps.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Updates</p>
                      {ref.followUps.map((fu, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[11px] text-gray-300">{fu.note}</p>
                            <p className="text-[10px] text-gray-600">{fu.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {ref.resolution && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/10 mt-3">
                      <p className="text-[11px] text-emerald-300">{ref.resolution}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function PatientResources() {
  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Find Help</h1>
        <p className="text-sm text-gray-500 mt-0.5">Community resources available to you</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(friendlyDomainNames).map(([domain, name]) => {
          const Icon = domainIcons[domain as SDOHDomain];
          const color = domainColors[domain as SDOHDomain];
          const resources = communityResources.filter(r => r.domain === domain);
          return (
            <Card key={domain} className="bg-[#111827]/60 border-white/[0.06] hover:bg-[#111827]/80 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
                    <Icon className="w-4.5 h-4.5" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-100 font-medium">{name}</p>
                    <p className="text-[10px] text-gray-500">{resources.length} resources nearby</p>
                  </div>
                </div>
                {resources.slice(0, 2).map(r => (
                  <div key={r.id} className="flex items-center gap-2 p-2 rounded bg-white/[0.02] mb-1.5 last:mb-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-gray-200 truncate">{r.name}</p>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{r.phone}</p>
                    </div>
                    {r.languages.includes("Spanish") && (
                      <Badge className="text-[8px] px-1 py-0 bg-blue-500/10 text-blue-400 border-none">Español</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function PatientMessages() {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const unread = patientMessages.filter(m => !m.read).length;

  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Messages</h1>
          <p className="text-sm text-gray-500 mt-0.5">Updates from your care team</p>
        </div>
        {unread > 0 && (
          <Badge className="bg-rose-500/15 text-rose-400 border-none text-[11px]">
            {unread} new messages
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {patientMessages.map(msg => (
          <Card key={msg.id} className={`border-white/[0.06] ${!msg.read ? 'bg-blue-500/[0.03] border-blue-500/10' : 'bg-[#111827]/60'}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                  {msg.from.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[13px] text-gray-100 font-medium">{msg.from}</p>
                    <Badge variant="outline" className="text-[9px] py-0 border-white/10 text-gray-500">{msg.role}</Badge>
                    {!msg.read && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                  </div>
                  <p className="text-[12px] text-gray-300 leading-relaxed">{msg.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-[10px] text-gray-600">{new Date(msg.timestamp).toLocaleDateString()} at {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <button className="text-[10px] text-blue-400 hover:text-blue-300" onClick={() => setReplyTo(replyTo === msg.id ? null : msg.id)}>
                      Reply
                    </button>
                  </div>

                  {replyTo === msg.id && (
                    <div className="mt-3 flex gap-2">
                      <Textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        className="bg-white/[0.02] border-white/[0.06] text-gray-300 text-[12px] min-h-[60px] resize-none placeholder:text-gray-600"
                      />
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-auto px-3 self-end">
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { PatientMyHealth, PatientMyReferrals, PatientResources, PatientMessages };
