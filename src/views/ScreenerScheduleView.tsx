import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar, Clock, Globe, MapPin, Phone, ClipboardCheck, Users, AlertTriangle,
  CheckCircle, ChevronRight, MessageSquare, Languages, PlayCircle, Video
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { riskColors, domainLabels, domainColors } from "../data/mockData";
import { ScheduleItem } from "../types";

const todaySchedule: ScheduleItem[] = [
  { id: "SCH1", time: "8:30 AM", patientName: "Destiny Johnson", patientId: "P005", type: "screening", language: "English", location: "Greenville Clinic, SC", interpreterNeeded: false, notes: "First SDOH screening. Uninsured, handle sensitively." },
  { id: "SCH2", time: "9:15 AM", patientName: "Maria Garcia", patientId: "P001", type: "follow_up", language: "Spanish", location: "Division St Clinic, Chicago", interpreterNeeded: true, notes: "Follow up on housing referral. SNAP approved." },
  { id: "SCH3", time: "10:00 AM", patientName: "Robert Chen", patientId: "P004", type: "phone_call", language: "Mandarin", location: "Phone", interpreterNeeded: true, notes: "Welfare check. Confirm CASL intake appointment." },
  { id: "SCH4", time: "11:00 AM", patientName: "New Patient (Walk-in)", patientId: "", type: "screening", language: "Unknown", location: "Division St Clinic, Chicago", interpreterNeeded: false, notes: "Walk-in slot reserved for unscheduled screenings." },
  { id: "SCH5", time: "1:30 PM", patientName: "Luis Ramirez", patientId: "P008", type: "screening", language: "Spanish", location: "Telehealth", interpreterNeeded: false, notes: "CRITICAL: Family facing eviction. Full SDOH screen needed. Bilingual screener assigned." },
  { id: "SCH6", time: "2:30 PM", patientName: "Hmong Vang", patientId: "P006", type: "follow_up", language: "Hmong", location: "Villard Ave Clinic, Milwaukee", interpreterNeeded: true, notes: "Re-screening due. Connect with CHW Xiong for cultural support." },
  { id: "SCH7", time: "3:30 PM", patientName: "Angela Moretti", patientId: "P007", type: "phone_call", language: "English", location: "Phone", interpreterNeeded: false, notes: "Annual re-screening. Low risk last time." },
];

const typeColors: Record<string, string> = {
  screening: "#3b82f6",
  follow_up: "#f59e0b",
  home_visit: "#22c55e",
  phone_call: "#8b5cf6",
};
const typeLabels: Record<string, string> = {
  screening: "Screening",
  follow_up: "Follow-Up",
  home_visit: "Home Visit",
  phone_call: "Phone Call",
};
const typeIcons: Record<string, any> = {
  screening: ClipboardCheck,
  follow_up: MessageSquare,
  home_visit: MapPin,
  phone_call: Phone,
};

export default function ScreenerScheduleView() {
  const { setActiveView, patients } = useAppContext();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const completed = completedIds.size;
  const total = todaySchedule.length;
  const progressPct = (completed / total) * 100;

  const toggleComplete = (id: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const screeningsToday = todaySchedule.filter(s => s.type === "screening").length;
  const followUpsToday = todaySchedule.filter(s => s.type === "follow_up" || s.type === "phone_call").length;
  const interpreterNeeded = todaySchedule.filter(s => s.interpreterNeeded).length;

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">My Schedule</h1>
          <p className="text-sm text-gray-500 mt-0.5">Wednesday, February 26, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-400 border-blue-400/20 bg-blue-400/5 text-[11px]">
            <Calendar className="w-3 h-3 mr-1" /> {total} appointments today
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-white/[0.06]">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Screenings</p>
                <p className="text-xl font-bold text-blue-400 mt-0.5">{screeningsToday}</p>
              </div>
              <ClipboardCheck className="w-5 h-5 text-blue-400/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-white/[0.06]">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Follow-Ups</p>
                <p className="text-xl font-bold text-amber-400 mt-0.5">{followUpsToday}</p>
              </div>
              <MessageSquare className="w-5 h-5 text-amber-400/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-500/10 to-violet-600/5 border-white/[0.06]">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Interpreter Req.</p>
                <p className="text-xl font-bold text-violet-400 mt-0.5">{interpreterNeeded}</p>
              </div>
              <Languages className="w-5 h-5 text-violet-400/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-white/[0.06]">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Completed</p>
                <p className="text-xl font-bold text-emerald-400 mt-0.5">{completed}/{total}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-emerald-400/40" />
            </div>
            <Progress value={progressPct} className="mt-2 h-1 [&>div]:bg-emerald-500" />
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="bg-[#111827]/60 border-white/[0.06]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-300 font-medium">Today's Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {todaySchedule.map((item, idx) => {
            const isDone = completedIds.has(item.id);
            const Icon = typeIcons[item.type];
            const color = typeColors[item.type];
            const isCritical = item.notes?.includes("CRITICAL");
            return (
              <div key={item.id} className={`flex gap-4 p-3.5 rounded-lg transition-all ${
                isDone ? 'bg-white/[0.01] opacity-50' : isCritical ? 'bg-red-500/[0.04] border border-red-500/10' : 'bg-white/[0.02] hover:bg-white/[0.04]'
              }`}>
                {/* Time column */}
                <div className="w-16 flex-shrink-0 text-right">
                  <p className={`text-[13px] font-medium ${isDone ? 'text-gray-600 line-through' : 'text-gray-200'}`}>{item.time}</p>
                </div>

                {/* Timeline dot */}
                <div className="flex flex-col items-center pt-1">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isDone ? 'bg-emerald-500' : ''}`}
                    style={!isDone ? { backgroundColor: color } : {}} />
                  {idx < todaySchedule.length - 1 && (
                    <div className="w-px flex-1 bg-white/[0.06] mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-[14px] font-medium ${isDone ? 'text-gray-500 line-through' : 'text-gray-100'}`}>
                      {item.patientName}
                    </p>
                    <Badge className="text-[9px] px-1.5 py-0" style={{ backgroundColor: color + '15', color, border: 'none' }}>
                      <Icon className="w-2.5 h-2.5 mr-0.5" />{typeLabels[item.type]}
                    </Badge>
                    {isCritical && (
                      <Badge className="text-[9px] px-1.5 py-0 bg-red-500/15 text-red-400 border-none">
                        <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />CRITICAL
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-1.5">
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{item.language}</span>
                    <span className="flex items-center gap-1">
                      {item.location === "Telehealth" ? <Video className="w-3 h-3" /> : item.location === "Phone" ? <Phone className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      {item.location}
                    </span>
                    {item.interpreterNeeded && (
                      <Badge variant="outline" className="text-[9px] py-0 border-violet-400/20 text-violet-400">
                        <Languages className="w-2.5 h-2.5 mr-0.5" />Interpreter
                      </Badge>
                    )}
                  </div>

                  {item.notes && (
                    <p className={`text-[11px] ${isCritical ? 'text-red-300/70' : 'text-gray-500'} italic`}>{item.notes}</p>
                  )}

                  {/* Actions */}
                  {!isDone && (
                    <div className="flex items-center gap-2 mt-2">
                      {item.type === "screening" && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] h-7 px-3" onClick={() => setActiveView("my_screenings")}>
                          <PlayCircle className="w-3 h-3 mr-1" /> Start Screening
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="border-white/10 text-gray-300 hover:bg-white/[0.04] text-[11px] h-7 px-3"
                        onClick={() => toggleComplete(item.id)}>
                        <CheckCircle className="w-3 h-3 mr-1" /> Mark Done
                      </Button>
                    </div>
                  )}
                  {isDone && (
                    <button className="text-[10px] text-gray-600 hover:text-gray-400 mt-1" onClick={() => toggleComplete(item.id)}>
                      Undo completion
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
