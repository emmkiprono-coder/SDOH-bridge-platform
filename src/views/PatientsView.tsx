import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Users, Search, Globe, ChevronRight, MapPin, Phone, CreditCard, AlertTriangle, CheckCircle, Clock
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { domainLabels, domainColors, riskColors } from "../data/mockData";
import { Patient } from "../types";

export default function PatientsView() {
  const { patients, selectedPatient, setSelectedPatient, referrals, setActiveView } = useAppContext();
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filtered = patients.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.mrn.toLowerCase().includes(search.toLowerCase())) return false;
    if (riskFilter !== "all" && p.riskLevel !== riskFilter) return false;
    return true;
  });

  const patientReferrals = selectedPatient ? referrals.filter(r => r.patientId === selectedPatient.id) : [];

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Patient Registry</h1>
          <p className="text-sm text-gray-500 mt-0.5">{patients.length} patients across 6-state service area</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or MRN..."
            className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-gray-200 text-sm placeholder:text-gray-600" />
        </div>
        <div className="flex gap-1.5">
          {["all", "critical", "high", "moderate", "low"].map(r => (
            <button key={r} onClick={() => setRiskFilter(r)}
              className={`px-3 py-1.5 rounded-md text-[11px] transition-all ${riskFilter === r ? 'bg-white/[0.08] text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]'}`}>
              {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-2">
        {filtered.map(p => (
          <Card key={p.id} className="bg-[#111827]/60 border-white/[0.06] hover:bg-[#111827]/80 transition-colors cursor-pointer"
            onClick={() => setSelectedPatient(p)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-semibold"
                  style={{ backgroundColor: riskColors[p.riskLevel] + '15', color: riskColors[p.riskLevel] }}>
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] text-gray-200 font-medium">{p.name}</p>
                    <span className="text-[11px] text-gray-600">{p.mrn}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                    <span>{p.age}y {p.gender}</span>
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{p.language}</span>
                    <span>{p.ethnicity}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.address.split(',').slice(-2).join(',').trim()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.identifiedNeeds.slice(0, 3).map(n => (
                    <div key={n} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: domainColors[n] }} title={domainLabels[n]} />
                  ))}
                  {p.identifiedNeeds.length > 3 && (
                    <span className="text-[10px] text-gray-500">+{p.identifiedNeeds.length - 3}</span>
                  )}
                  <Badge className="text-[10px] px-1.5 ml-2" style={{ backgroundColor: riskColors[p.riskLevel] + '15', color: riskColors[p.riskLevel], border: 'none' }}>
                    {p.riskLevel}
                  </Badge>
                  {p.screeningStatus === "not_started" ? (
                    <Badge variant="outline" className="text-[10px] border-amber-400/20 text-amber-400 ml-1">Needs Screening</Badge>
                  ) : (
                    <span className="text-[10px] text-gray-600 ml-1">{p.lastScreening}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Detail Dialog */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="bg-[#111827] border-white/[0.08] text-gray-100 max-w-[700px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base text-white">{selectedPatient.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Patient Info */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white/[0.02]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Demographics</p>
                  <p className="text-[12px] text-gray-200 mt-1">{selectedPatient.age}y {selectedPatient.gender} · {selectedPatient.ethnicity}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Language</p>
                  <p className="text-[12px] text-gray-200 mt-1 flex items-center gap-1"><Globe className="w-3 h-3" />{selectedPatient.language}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Insurance</p>
                  <p className="text-[12px] text-gray-200 mt-1 flex items-center gap-1"><CreditCard className="w-3 h-3" />{selectedPatient.insuranceType}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-lg bg-white/[0.02]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Address</p>
                  <p className="text-[12px] text-gray-200 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{selectedPatient.address}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Phone</p>
                  <p className="text-[12px] text-gray-200 mt-1 flex items-center gap-1"><Phone className="w-3 h-3" />{selectedPatient.phone}</p>
                </div>
              </div>

              {/* Risk & Needs */}
              <div className="p-3 rounded-lg" style={{ backgroundColor: riskColors[selectedPatient.riskLevel] + '08' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Risk Level & Identified Needs</p>
                  <Badge className="text-[10px]" style={{ backgroundColor: riskColors[selectedPatient.riskLevel] + '15', color: riskColors[selectedPatient.riskLevel], border: 'none' }}>
                    {selectedPatient.riskLevel}
                  </Badge>
                </div>
                {selectedPatient.identifiedNeeds.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedPatient.identifiedNeeds.map(n => (
                      <Badge key={n} className="text-[10px] px-2" style={{ backgroundColor: domainColors[n] + '15', color: domainColors[n], border: 'none' }}>
                        {domainLabels[n]}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-gray-500 italic">No needs identified</p>
                )}
              </div>

              {/* Screening History */}
              {selectedPatient.screeningHistory.length > 0 && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Screening History</p>
                  {selectedPatient.screeningHistory.map(sh => (
                    <div key={sh.id} className="p-3 rounded-lg bg-white/[0.02] space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[12px] text-gray-200">Screened {sh.date} by {sh.screener}</p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <span>{sh.method.replace('_', ' ')}</span>
                          <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{sh.language}</span>
                        </div>
                      </div>
                      {sh.culturalNotes && (
                        <p className="text-[11px] text-blue-300/60 italic border-l-2 border-blue-400/20 pl-2">{sh.culturalNotes}</p>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        {sh.domains.map(d => (
                          <div key={d.domain} className="flex items-center gap-2 p-2 rounded bg-white/[0.02]">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: domainColors[d.domain] }} />
                            <span className="text-[11px] text-gray-300 flex-1">{domainLabels[d.domain]}</span>
                            <Badge className="text-[9px]" style={{ backgroundColor: riskColors[d.risk] + '15', color: riskColors[d.risk], border: 'none' }}>
                              {d.risk}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Referrals */}
              {patientReferrals.length > 0 && (
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Active Referrals</p>
                  <div className="space-y-2">
                    {patientReferrals.map(r => (
                      <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02]">
                        {r.status === "resolved" || r.status === "closed" ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-gray-200">{domainLabels[r.domain]} - {r.organization}</p>
                          <p className="text-[10px] text-gray-500">{r.followUps.length} follow-ups</p>
                        </div>
                        <Badge className="text-[9px]" style={{ backgroundColor: `var(--status-${r.status})15`, color: r.status === "resolved" ? '#22c55e' : r.status === "in_progress" ? '#f59e0b' : '#6366f1', border: 'none' }}>
                          {r.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8" onClick={() => { setSelectedPatient(null); setActiveView("screening"); }}>
                  New Screening
                </Button>
                <Button size="sm" variant="outline" className="border-white/10 text-gray-300 hover:bg-white/[0.04] text-xs h-8" onClick={() => { setSelectedPatient(null); setActiveView("referrals"); }}>
                  View Referrals
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
