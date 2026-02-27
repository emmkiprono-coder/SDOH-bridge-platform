import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardCheck, AlertTriangle, ArrowRightLeft, CheckCircle, TrendingUp, Clock,
  Users, Activity, ChevronRight
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { closureMetrics, referrals, screeningTrends, domainDistribution, riskColors, statusColors } from "../data/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const kpis = [
  { label: "Total Screenings (Feb)", value: "398", change: "+11.8%", icon: ClipboardCheck, color: "#3b82f6", bg: "from-blue-500/10 to-blue-600/5" },
  { label: "Needs Identified", value: "145", change: "+13.3%", icon: AlertTriangle, color: "#f59e0b", bg: "from-amber-500/10 to-amber-600/5" },
  { label: "Active Referrals", value: "121", change: "+10%", icon: ArrowRightLeft, color: "#8b5cf6", bg: "from-violet-500/10 to-violet-600/5" },
  { label: "Loops Closed", value: "74%", change: "+4.2%", icon: CheckCircle, color: "#22c55e", bg: "from-emerald-500/10 to-emerald-600/5" },
];

export default function DashboardView() {
  const { patients, setActiveView, setSelectedPatient } = useAppContext();
  const criticalPatients = patients.filter(p => p.riskLevel === "critical" || p.riskLevel === "high");
  const pendingReferrals = referrals.filter(r => r.status === "pending" || r.status === "sent");

  return (
    <div className="p-6 space-y-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">SDOH Screening Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Advocate Health, Multi-State Operations</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Last updated:</span>
          <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/5 text-[11px]">
            <Activity className="w-3 h-3 mr-1" /> Live
          </Badge>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label} className={`bg-gradient-to-br ${kpi.bg} border-white/[0.06] backdrop-blur-sm`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: kpi.color }}>{kpi.value}</p>
                </div>
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color, opacity: 0.6 }} />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-[11px] text-emerald-400">{kpi.change}</span>
                <span className="text-[10px] text-gray-600">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Screening Trends */}
        <Card className="col-span-3 bg-[#111827]/60 border-white/[0.06]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 font-medium">Screening Pipeline (6-Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={screeningTrends}>
                <defs>
                  <linearGradient id="gScreenings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#e5e7eb' }} />
                <Area type="monotone" dataKey="screenings" stroke="#3b82f6" fill="url(#gScreenings)" strokeWidth={2} name="Screenings" />
                <Area type="monotone" dataKey="identified" stroke="#f59e0b" fill="transparent" strokeWidth={2} strokeDasharray="4 4" name="Needs Identified" />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" fill="url(#gResolved)" strokeWidth={2} name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Domain Breakdown */}
        <Card className="col-span-2 bg-[#111827]/60 border-white/[0.06]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 font-medium">SDOH Domains Identified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {domainDistribution.slice(0, 6).map(d => (
                <div key={d.domain} className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-400 w-28 truncate">{d.domain}</span>
                  <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${d.pct}%`, backgroundColor: d.pct > 15 ? '#f59e0b' : d.pct > 10 ? '#3b82f6' : '#6366f1' }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 w-8 text-right">{d.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Critical Patients */}
        <Card className="col-span-3 bg-[#111827]/60 border-white/[0.06]">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-gray-300 font-medium">Priority Patients</CardTitle>
            <button onClick={() => setActiveView("patients")} className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalPatients.slice(0, 5).map(p => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-colors"
                  onClick={() => { setSelectedPatient(p); setActiveView("patients"); }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold"
                    style={{ backgroundColor: riskColors[p.riskLevel] + '20', color: riskColors[p.riskLevel] }}>
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-gray-200 font-medium">{p.name}</p>
                    <p className="text-[10px] text-gray-500">{p.language} · {p.identifiedNeeds.length} needs · {p.address.split(',').slice(-2).join(',').trim()}</p>
                  </div>
                  <Badge className="text-[10px] px-1.5 py-0" style={{ backgroundColor: riskColors[p.riskLevel] + '15', color: riskColors[p.riskLevel], border: 'none' }}>
                    {p.riskLevel}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loop Closure Metrics */}
        <Card className="col-span-2 bg-[#111827]/60 border-white/[0.06]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 font-medium">Loop Closure Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.02]">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Resolution Rate</p>
                <p className="text-lg font-bold text-emerald-400 mt-1">{closureMetrics.resolutionRate}%</p>
                <Progress value={closureMetrics.resolutionRate} className="mt-2 h-1 [&>div]:bg-emerald-500" />
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02]">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Days to Close</p>
                <p className="text-lg font-bold text-blue-400 mt-1">{closureMetrics.avgDaysToResolution}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-[10px] text-gray-500">Target: 14 days</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02]">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Follow-up Rate</p>
                <p className="text-lg font-bold text-violet-400 mt-1">{closureMetrics.followUpComplianceRate}%</p>
                <Progress value={closureMetrics.followUpComplianceRate} className="mt-2 h-1 [&>div]:bg-violet-500" />
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02]">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Patient Satisfaction</p>
                <p className="text-lg font-bold text-amber-400 mt-1">{closureMetrics.patientSatisfaction}/5</p>
                <div className="flex gap-0.5 mt-2">
                  {[1,2,3,4,5].map(s => (
                    <div key={s} className={`w-3 h-3 rounded-sm ${s <= Math.round(closureMetrics.patientSatisfaction) ? 'bg-amber-400' : 'bg-white/[0.06]'}`} />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
