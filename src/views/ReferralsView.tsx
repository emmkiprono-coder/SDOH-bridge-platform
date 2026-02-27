import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowRightLeft, ChevronRight, Clock, CheckCircle, AlertTriangle, Phone, MapPin,
  MessageSquare, Plus, Filter, RotateCcw, Eye, CircleDot
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { domainLabels, domainColors, riskColors, statusColors, communityResources } from "../data/mockData";
import { Referral, ReferralStatus } from "../types";

const statusSteps: ReferralStatus[] = ["pending", "sent", "accepted", "in_progress", "resolved", "closed"];
const statusLabels: Record<ReferralStatus, string> = {
  pending: "Pending", sent: "Sent", accepted: "Accepted", in_progress: "In Progress", resolved: "Resolved", closed: "Closed", declined: "Declined"
};

export default function ReferralsView() {
  const { referrals, setReferrals } = useAppContext();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDomain, setFilterDomain] = useState<string>("all");
  const [selectedRef, setSelectedRef] = useState<Referral | null>(null);
  const [newNote, setNewNote] = useState("");

  const filtered = referrals.filter(r => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterDomain !== "all" && r.domain !== filterDomain) return false;
    return true;
  });

  const statusCounts = referrals.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const advanceStatus = (ref: Referral) => {
    const idx = statusSteps.indexOf(ref.status);
    if (idx < statusSteps.length - 1) {
      const updated = referrals.map(r =>
        r.id === ref.id ? { ...r, status: statusSteps[idx + 1], updatedDate: new Date().toISOString().split('T')[0] } : r
      );
      setReferrals(updated);
      setSelectedRef({ ...ref, status: statusSteps[idx + 1] });
      toast.success(`Referral advanced to ${statusLabels[statusSteps[idx + 1]]}`);
    }
  };

  const addFollowUp = (ref: Referral) => {
    if (!newNote.trim()) return;
    const updated = referrals.map(r =>
      r.id === ref.id ? {
        ...r,
        followUps: [...r.followUps, { date: new Date().toISOString().split('T')[0], note: newNote, status: "on_track", contactMethod: "phone" }],
        updatedDate: new Date().toISOString().split('T')[0]
      } : r
    );
    setReferrals(updated);
    setSelectedRef({ ...ref, followUps: [...ref.followUps, { date: new Date().toISOString().split('T')[0], note: newNote, status: "on_track", contactMethod: "phone" }] });
    setNewNote("");
    toast.success("Follow-up recorded");
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Referral Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track referrals, follow up, and close the loop on identified needs</p>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="grid grid-cols-6 gap-2">
        {statusSteps.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
            className={`p-3 rounded-lg border transition-all text-center ${filterStatus === s ? 'border-white/20 bg-white/[0.06]' : 'border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04]'}`}
          >
            <p className="text-lg font-bold" style={{ color: statusColors[s] }}>{statusCounts[s] || 0}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{statusLabels[s]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select value={filterDomain} onValueChange={setFilterDomain}>
          <SelectTrigger className="w-48 h-8 text-xs bg-white/[0.04] border-white/[0.08]">
            <SelectValue placeholder="All Domains" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            {Object.entries(domainLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(filterStatus !== "all" || filterDomain !== "all") && (
          <Button variant="ghost" size="sm" className="text-xs text-gray-400 h-8" onClick={() => { setFilterStatus("all"); setFilterDomain("all"); }}>
            <RotateCcw className="w-3 h-3 mr-1" /> Clear
          </Button>
        )}
        <span className="text-[11px] text-gray-500 ml-auto">{filtered.length} referrals</span>
      </div>

      {/* Referral Cards */}
      <div className="space-y-2">
        {filtered.map(ref => (
          <Card key={ref.id} className="bg-[#111827]/60 border-white/[0.06] hover:bg-[#111827]/80 transition-colors cursor-pointer" onClick={() => setSelectedRef(ref)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Status indicator */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: statusColors[ref.status] + '15' }}>
                    {ref.status === "resolved" || ref.status === "closed" ? (
                      <CheckCircle className="w-5 h-5" style={{ color: statusColors[ref.status] }} />
                    ) : ref.status === "pending" ? (
                      <Clock className="w-5 h-5" style={{ color: statusColors[ref.status] }} />
                    ) : (
                      <CircleDot className="w-5 h-5" style={{ color: statusColors[ref.status] }} />
                    )}
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] text-gray-200 font-medium">{ref.patientName}</p>
                    <span className="text-gray-600">·</span>
                    <Badge className="text-[10px] px-1.5" style={{ backgroundColor: domainColors[ref.domain] + '15', color: domainColors[ref.domain], border: 'none' }}>
                      {domainLabels[ref.domain]}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-gray-400 mt-0.5">{ref.organization}</p>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Assigned to {ref.assignedTo} · Created {ref.createdDate} · Updated {ref.updatedDate}
                  </p>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                  <Badge className="text-[10px] px-1.5" style={{ backgroundColor: riskColors[ref.priority] + '15', color: riskColors[ref.priority], border: 'none' }}>
                    {ref.priority}
                  </Badge>
                  <Badge className="text-[10px] px-2 py-0.5" style={{ backgroundColor: statusColors[ref.status] + '15', color: statusColors[ref.status], border: 'none' }}>
                    {statusLabels[ref.status]}
                  </Badge>
                  {ref.followUps.length > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <MessageSquare className="w-3 h-3" /> {ref.followUps.length}
                    </div>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex gap-1 mt-3 ml-14">
                {statusSteps.map((s, i) => {
                  const refIdx = statusSteps.indexOf(ref.status);
                  return (
                    <div key={s} className={`flex-1 h-1 rounded-full ${i <= refIdx ? '' : 'bg-white/[0.04]'}`}
                      style={i <= refIdx ? { backgroundColor: statusColors[ref.status] } : {}} />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Panel */}
      {selectedRef && (
        <Dialog open={!!selectedRef} onOpenChange={() => setSelectedRef(null)}>
          <DialogContent className="bg-[#111827] border-white/[0.08] text-gray-100 max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base text-white flex items-center gap-2">
                Referral Detail: {selectedRef.patientName}
                <Badge className="text-[10px] ml-2" style={{ backgroundColor: statusColors[selectedRef.status] + '15', color: statusColors[selectedRef.status], border: 'none' }}>
                  {statusLabels[selectedRef.status]}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/[0.02]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Domain</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: domainColors[selectedRef.domain] }} />
                    <p className="text-[13px] text-gray-200">{domainLabels[selectedRef.domain]}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Organization</p>
                  <p className="text-[13px] text-gray-200 mt-1">{selectedRef.organization}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Priority</p>
                  <Badge className="text-[10px] mt-1" style={{ backgroundColor: riskColors[selectedRef.priority] + '15', color: riskColors[selectedRef.priority], border: 'none' }}>
                    {selectedRef.priority}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02]">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Assigned To</p>
                  <p className="text-[13px] text-gray-200 mt-1">{selectedRef.assignedTo}</p>
                </div>
              </div>

              {/* Status Pipeline */}
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Progress Pipeline</p>
                <div className="flex items-center gap-1">
                  {statusSteps.map((s, i) => {
                    const refIdx = statusSteps.indexOf(selectedRef.status);
                    const isCurrent = s === selectedRef.status;
                    return (
                      <div key={s} className="flex-1 flex flex-col items-center">
                        <div className={`w-full h-2 rounded-full ${i <= refIdx ? '' : 'bg-white/[0.06]'}`}
                          style={i <= refIdx ? { backgroundColor: statusColors[selectedRef.status] } : {}} />
                        <span className={`text-[9px] mt-1 ${isCurrent ? 'font-semibold' : ''}`}
                          style={{ color: i <= refIdx ? statusColors[selectedRef.status] : '#6b7280' }}>
                          {statusLabels[s]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Notes</p>
                <div className="space-y-1.5">
                  {selectedRef.notes.map((n, i) => (
                    <p key={i} className="text-[12px] text-gray-300 pl-3 border-l-2 border-white/[0.06]">{n}</p>
                  ))}
                </div>
              </div>

              {/* Follow-up Timeline */}
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Follow-Up Timeline</p>
                {selectedRef.followUps.length === 0 ? (
                  <p className="text-[12px] text-gray-600 italic">No follow-ups recorded yet</p>
                ) : (
                  <div className="space-y-2">
                    {selectedRef.followUps.map((fu, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5" />
                          {i < selectedRef.followUps.length - 1 && <div className="w-px flex-1 bg-white/[0.06]" />}
                        </div>
                        <div className="pb-3">
                          <p className="text-[11px] text-gray-500">{fu.date} · {fu.contactMethod}</p>
                          <p className="text-[12px] text-gray-300 mt-0.5">{fu.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Follow-up */}
              {selectedRef.status !== "resolved" && selectedRef.status !== "closed" && (
                <div className="space-y-2">
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add follow-up note..."
                    className="bg-white/[0.02] border-white/[0.06] text-gray-300 text-[12px] min-h-[60px] resize-none placeholder:text-gray-600"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8" onClick={() => addFollowUp(selectedRef)}>
                      <Plus className="w-3 h-3 mr-1" /> Add Follow-up
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/10 text-gray-300 hover:bg-white/[0.04] text-xs h-8" onClick={() => advanceStatus(selectedRef)}>
                      Advance Status <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Resolution */}
              {selectedRef.resolution && (
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Resolution</p>
                  <p className="text-[12px] text-gray-300">{selectedRef.resolution}</p>
                  <p className="text-[10px] text-gray-500 mt-1">Closed {selectedRef.closedDate}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
