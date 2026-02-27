import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3, Globe, Users, TrendingUp, AlertTriangle, Heart, Languages,
  MapPin, ShieldCheck, Target, ArrowUpRight, ArrowDownRight, Minus, PieChart
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
  PieChart as RechartsPie, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend, CartesianGrid, ComposedChart, Line
} from "recharts";
import { useAppContext } from "../context/AppContext";
import {
  screeningTrends, domainDistribution, populationData, languageData, closureMetrics,
  domainLabels, domainColors, riskColors
} from "../data/mockData";

const stateData = [
  { state: "Illinois", screenings: 487, needsIdentified: 198, resolution: 72, lepPop: 1420000, interpreterRatio: "1:890" },
  { state: "Wisconsin", screenings: 312, needsIdentified: 134, resolution: 68, lepPop: 425000, interpreterRatio: "1:1200" },
  { state: "North Carolina", screenings: 398, needsIdentified: 167, resolution: 71, lepPop: 890000, interpreterRatio: "1:1050" },
  { state: "South Carolina", screenings: 189, needsIdentified: 78, resolution: 65, lepPop: 310000, interpreterRatio: "1:1400" },
  { state: "Georgia", screenings: 356, needsIdentified: 145, resolution: 69, lepPop: 1150000, interpreterRatio: "1:960" },
  { state: "Alabama", screenings: 125, needsIdentified: 52, resolution: 62, lepPop: 210000, interpreterRatio: "1:1600" },
];

const equityMetrics = [
  { metric: "Screening Access", Hispanic: 88, Black: 82, White: 94, Asian: 76, MENA: 71 },
  { metric: "Referral Follow-up", Hispanic: 74, Black: 78, White: 89, Asian: 68, MENA: 65 },
  { metric: "Loop Closure", Hispanic: 67, Black: 72, White: 84, Asian: 61, MENA: 58 },
  { metric: "Satisfaction", Hispanic: 82, Black: 79, White: 91, Asian: 72, MENA: 68 },
  { metric: "Resource Match", Hispanic: 78, Black: 75, White: 88, Asian: 64, MENA: 60 },
];

const culturalBarriers = [
  { barrier: "Language concordance not available", pct: 34, affected: "Asian, MENA", severity: "high" },
  { barrier: "Immigration/documentation concerns", pct: 28, affected: "Hispanic/Latino", severity: "critical" },
  { barrier: "Stigma around accepting assistance", pct: 22, affected: "Asian, White", severity: "moderate" },
  { barrier: "Distrust of institutional services", pct: 19, affected: "Black/African American", severity: "high" },
  { barrier: "Traditional/alternative health beliefs", pct: 15, affected: "Asian, MENA", severity: "moderate" },
  { barrier: "Religious/gender preferences unmet", pct: 12, affected: "MENA", severity: "high" },
  { barrier: "Limited health literacy materials", pct: 31, affected: "All LEP populations", severity: "high" },
];

const gapAnalysis = [
  { domain: "food", gap: "Limited halal/culturally specific food banks", region: "Milwaukee, WI", urgency: "high", recommendation: "Partner with mosque-affiliated food banks; expand culturally diverse food options at existing pantries" },
  { domain: "housing", gap: "No bilingual housing advocacy in SC", region: "Greenville, SC", urgency: "critical", recommendation: "Recruit bilingual housing counselors; establish partnership with SC Legal Services for LEP patients" },
  { domain: "transportation", gap: "Rural transit deserts in Alabama", region: "Birmingham, AL", urgency: "high", recommendation: "Implement medical ride-share program; explore telehealth alternatives for applicable appointments" },
  { domain: "employment", gap: "No refugee employment program in GA", region: "Atlanta, GA", urgency: "moderate", recommendation: "Partner with IRC or similar refugee resettlement organizations; develop employer network for LEP workers" },
  { domain: "health_literacy", gap: "Materials only in English/Spanish", region: "System-wide", urgency: "critical", recommendation: "Develop SDOH materials in top 8 languages; create visual/plain language versions; leverage AI translation with interpreter validation" },
  { domain: "social", gap: "Senior isolation programs lack cultural focus", region: "Chicago, IL", urgency: "high", recommendation: "Create culturally-specific senior programs; partner with CASL, Korean American Senior Center, and similar orgs" },
];

const monthlyOutcomes = [
  { month: "Sep", screened: 245, referred: 72, connected: 58, resolved: 45, lostToFollowUp: 8 },
  { month: "Oct", screened: 312, referred: 88, connected: 72, resolved: 56, lostToFollowUp: 6 },
  { month: "Nov", screened: 289, referred: 82, connected: 68, resolved: 63, lostToFollowUp: 5 },
  { month: "Dec", screened: 267, referred: 75, connected: 61, resolved: 58, lostToFollowUp: 4 },
  { month: "Jan", screened: 356, referred: 110, connected: 92, resolved: 72, lostToFollowUp: 7 },
  { month: "Feb", screened: 398, referred: 121, connected: 98, resolved: 84, lostToFollowUp: 5 },
];

const pieColors = ["#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#22c55e", "#06b6d4", "#ec4899", "#f97316"];

function TrendIndicator({ value, suffix = "%", good = "up" }: { value: number; suffix?: string; good?: "up" | "down" }) {
  const isPositive = (good === "up" && value > 0) || (good === "down" && value < 0);
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] ${isPositive ? 'text-emerald-400' : value === 0 ? 'text-gray-500' : 'text-red-400'}`}>
      <Icon className="w-3 h-3" />{Math.abs(value)}{suffix}
    </span>
  );
}

export default function AnalyticsView() {
  const { patients } = useAppContext();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Analytics & Insights</h1>
          <p className="text-sm text-gray-500 mt-0.5">Population health, equity metrics, and gap analysis across Advocate Health</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/5 text-[11px]">
            6-State Coverage
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400/20 bg-blue-400/5 text-[11px]">
            160+ Interpreters
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/[0.04] border border-white/[0.06] h-9">
          <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
            <BarChart3 className="w-3 h-3 mr-1.5" />Overview
          </TabsTrigger>
          <TabsTrigger value="population" className="text-xs data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
            <Users className="w-3 h-3 mr-1.5" />Population
          </TabsTrigger>
          <TabsTrigger value="equity" className="text-xs data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
            <Heart className="w-3 h-3 mr-1.5" />Equity & Culture
          </TabsTrigger>
          <TabsTrigger value="gaps" className="text-xs data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
            <Target className="w-3 h-3 mr-1.5" />Gap Analysis
          </TabsTrigger>
          <TabsTrigger value="outcomes" className="text-xs data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
            <ShieldCheck className="w-3 h-3 mr-1.5" />Outcomes
          </TabsTrigger>
        </TabsList>

        {/* ===== OVERVIEW TAB ===== */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* State-level comparison */}
          <Card className="bg-[#111827]/60 border-white/[0.06]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" /> Multi-State Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={stateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="state" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#e5e7eb' }} />
                  <Bar dataKey="screenings" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Screenings" opacity={0.8} />
                  <Bar dataKey="needsIdentified" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Needs Identified" opacity={0.8} />
                  <Line type="monotone" dataKey="resolution" stroke="#22c55e" strokeWidth={2} name="Resolution %" dot={{ fill: '#22c55e', r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            {/* Screening Funnel */}
            <Card className="bg-[#111827]/60 border-white/[0.06]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-300 font-medium">Screening-to-Resolution Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthlyOutcomes}>
                    <defs>
                      <linearGradient id="gScr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, color: '#e5e7eb' }} />
                    <Area type="monotone" dataKey="screened" stroke="#3b82f6" fill="url(#gScr)" strokeWidth={1.5} name="Screened" />
                    <Area type="monotone" dataKey="referred" stroke="#f59e0b" fill="transparent" strokeWidth={1.5} name="Referred" />
                    <Area type="monotone" dataKey="resolved" stroke="#22c55e" fill="transparent" strokeWidth={1.5} name="Resolved" />
                    <Area type="monotone" dataKey="lostToFollowUp" stroke="#ef4444" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" name="Lost to F/U" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Domain Distribution */}
            <Card className="bg-[#111827]/60 border-white/[0.06]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-300 font-medium">SDOH Domain Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <RechartsPie>
                    <Pie
                      data={domainDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      dataKey="count"
                      nameKey="domain"
                      strokeWidth={0}
                    >
                      {domainDistribution.map((_, i) => (
                        <Cell key={i} fill={pieColors[i % pieColors.length]} opacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, color: '#e5e7eb' }} />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Language Distribution */}
            <Card className="bg-[#111827]/60 border-white/[0.06]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-300 font-medium flex items-center gap-2">
                  <Languages className="w-4 h-4 text-violet-400" /> Language Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {languageData.map((l, i) => (
                    <div key={l.language} className="flex items-center gap-3">
                      <span className="text-[11px] text-gray-400 w-20 truncate">{l.language}</span>
                      <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${l.pct}%`, backgroundColor: pieColors[i % pieColors.length] }} />
                      </div>
                      <span className="text-[11px] text-gray-500 w-12 text-right">{l.count}</span>
                      <span className="text-[10px] text-gray-600 w-8 text-right">{l.pct}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== POPULATION TAB ===== */}
        <TabsContent value="population" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {populationData.map(pop => (
              <Card key={pop.ethnicity} className="bg-[#111827]/60 border-white/[0.06]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[13px] text-gray-200 font-medium">{pop.ethnicity}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] border-blue-400/20 text-blue-400">
                        {pop.screened} screened
                      </Badge>
                      <Badge variant="outline" className="text-[10px] border-amber-400/20 text-amber-400">
                        {pop.needsIdentified} needs
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="p-2 rounded bg-white/[0.02]">
                      <p className="text-[9px] text-gray-600 uppercase">Avg Risk</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: pop.avgRisk >= 3 ? '#ef4444' : pop.avgRisk >= 2.5 ? '#f59e0b' : '#22c55e' }}>
                        {pop.avgRisk.toFixed(1)}/5
                      </p>
                    </div>
                    <div className="p-2 rounded bg-white/[0.02]">
                      <p className="text-[9px] text-gray-600 uppercase">Need Rate</p>
                      <p className="text-sm font-bold text-blue-400 mt-0.5">{Math.round((pop.needsIdentified / pop.screened) * 100)}%</p>
                    </div>
                    <div className="p-2 rounded bg-white/[0.02]">
                      <p className="text-[9px] text-gray-600 uppercase">Top Need</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: domainColors[pop.topNeeds[0] as keyof typeof domainColors] }}>
                        {domainLabels[pop.topNeeds[0] as keyof typeof domainLabels]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-500">Top needs:</span>
                    {pop.topNeeds.map(n => (
                      <Badge key={n} className="text-[9px] px-1.5 py-0" style={{ backgroundColor: domainColors[n as keyof typeof domainColors] + '15', color: domainColors[n as keyof typeof domainColors], border: 'none' }}>
                        {domainLabels[n as keyof typeof domainLabels]}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* LEP Population by State */}
          <Card className="bg-[#111827]/60 border-white/[0.06]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300 font-medium">LEP Population & Interpreter Coverage by State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stateData.map(s => (
                  <div key={s.state} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02]">
                    <div className="w-28">
                      <p className="text-[13px] text-gray-200 font-medium">{s.state}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-500">LEP Population: {s.lepPop.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-500">Interpreter Ratio: {s.interpreterRatio}</span>
                      </div>
                      <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${(s.screenings / 500) * 100}%` }} />
                      </div>
                    </div>
                    <div className="text-right w-20">
                      <p className="text-sm font-bold text-emerald-400">{s.resolution}%</p>
                      <p className="text-[9px] text-gray-500">Resolution</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== EQUITY & CULTURE TAB ===== */}
        <TabsContent value="equity" className="space-y-4 mt-4">
          {/* Equity Radar */}
          <div className="grid grid-cols-5 gap-4">
            <Card className="col-span-3 bg-[#111827]/60 border-white/[0.06]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-300 font-medium">Equity Performance by Ethnicity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={equityMetrics}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                    <PolarRadiusAxis tick={{ fill: '#6b7280', fontSize: 9 }} domain={[0, 100]} />
                    <Radar name="Hispanic/Latino" dataKey="Hispanic" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={1.5} />
                    <Radar name="Black/African Am." dataKey="Black" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={1.5} />
                    <Radar name="White" dataKey="White" stroke="#22c55e" fill="#22c55e" fillOpacity={0.05} strokeWidth={1.5} />
                    <Radar name="Asian" dataKey="Asian" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={1.5} />
                    <Radar name="MENA" dataKey="MENA" stroke="#ec4899" fill="#ec4899" fillOpacity={0.1} strokeWidth={1.5} />
                    <Legend wrapperStyle={{ fontSize: 10, color: '#9ca3af' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, color: '#e5e7eb' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Equity Gaps */}
            <Card className="col-span-2 bg-[#111827]/60 border-white/[0.06]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-300 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Equity Gaps Identified
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {equityMetrics.map(m => {
                  const values = [m.Hispanic, m.Black, m.White, m.Asian, m.MENA];
                  const gap = Math.max(...values) - Math.min(...values);
                  const minGroup = ["Hispanic/Latino", "Black/African Am.", "White", "Asian", "MENA"][values.indexOf(Math.min(...values))];
                  return (
                    <div key={m.metric} className="p-2.5 rounded-lg bg-white/[0.02]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-gray-200">{m.metric}</span>
                        <Badge className="text-[9px]" style={{
                          backgroundColor: gap > 25 ? '#ef444415' : gap > 15 ? '#f59e0b15' : '#22c55e15',
                          color: gap > 25 ? '#ef4444' : gap > 15 ? '#f59e0b' : '#22c55e',
                          border: 'none'
                        }}>
                          {gap}pt gap
                        </Badge>
                      </div>
                      <p className="text-[10px] text-gray-500">Lowest: {minGroup} ({Math.min(...values)}%)</p>
                      <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden mt-1.5">
                        <div className="h-full rounded-full" style={{
                          width: `${100 - gap}%`,
                          backgroundColor: gap > 25 ? '#ef4444' : gap > 15 ? '#f59e0b' : '#22c55e'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Cultural Barriers */}
          <Card className="bg-[#111827]/60 border-white/[0.06]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300 font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" /> Cultural Barriers to SDOH Screening & Resolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {culturalBarriers.map(b => (
                  <div key={b.barrier} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02]">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-gray-200">{b.barrier}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Primarily affecting: {b.affected}</p>
                    </div>
                    <div className="w-32">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-500">Prevalence</span>
                        <span className="text-[11px] font-medium" style={{ color: b.pct > 25 ? '#ef4444' : b.pct > 15 ? '#f59e0b' : '#3b82f6' }}>{b.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${b.pct}%`,
                          backgroundColor: b.pct > 25 ? '#ef4444' : b.pct > 15 ? '#f59e0b' : '#3b82f6'
                        }} />
                      </div>
                    </div>
                    <Badge className="text-[10px] px-1.5" style={{
                      backgroundColor: riskColors[b.severity as keyof typeof riskColors] + '15',
                      color: riskColors[b.severity as keyof typeof riskColors],
                      border: 'none'
                    }}>
                      {b.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== GAP ANALYSIS TAB ===== */}
        <TabsContent value="gaps" className="space-y-4 mt-4">
          <div className="grid grid-cols-4 gap-3">
            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-white/[0.06]">
              <CardContent className="p-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Critical Gaps</p>
                <p className="text-2xl font-bold text-red-400 mt-1">{gapAnalysis.filter(g => g.urgency === "critical").length}</p>
                <p className="text-[10px] text-gray-500 mt-1">Requiring immediate action</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-white/[0.06]">
              <CardContent className="p-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">High Priority</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">{gapAnalysis.filter(g => g.urgency === "high").length}</p>
                <p className="text-[10px] text-gray-500 mt-1">Action needed within 30 days</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-white/[0.06]">
              <CardContent className="p-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Regions Affected</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">{new Set(gapAnalysis.map(g => g.region)).size}</p>
                <p className="text-[10px] text-gray-500 mt-1">Unique service areas</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-white/[0.06]">
              <CardContent className="p-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Domains Impacted</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{new Set(gapAnalysis.map(g => g.domain)).size}</p>
                <p className="text-[10px] text-gray-500 mt-1">SDOH categories</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {gapAnalysis.map((gap, i) => (
              <Card key={i} className="bg-[#111827]/60 border-white/[0.06]">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: domainColors[gap.domain as keyof typeof domainColors] + '15' }}>
                      <Target className="w-5 h-5" style={{ color: domainColors[gap.domain as keyof typeof domainColors] }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[14px] text-gray-100 font-medium">{gap.gap}</p>
                        <Badge className="text-[10px] px-1.5" style={{
                          backgroundColor: riskColors[gap.urgency as keyof typeof riskColors] + '15',
                          color: riskColors[gap.urgency as keyof typeof riskColors],
                          border: 'none'
                        }}>
                          {gap.urgency}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="text-[9px] px-1.5" style={{ backgroundColor: domainColors[gap.domain as keyof typeof domainColors] + '15', color: domainColors[gap.domain as keyof typeof domainColors], border: 'none' }}>
                          {domainLabels[gap.domain as keyof typeof domainLabels]}
                        </Badge>
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{gap.region}
                        </span>
                      </div>
                      <div className="p-2.5 rounded bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Recommendation</p>
                        <p className="text-[12px] text-gray-300">{gap.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ===== OUTCOMES TAB ===== */}
        <TabsContent value="outcomes" className="space-y-4 mt-4">
          <div className="grid grid-cols-6 gap-3">
            {[
              { label: "Resolution Rate", value: `${closureMetrics.resolutionRate}%`, trend: 4.2, color: "#22c55e" },
              { label: "Avg Days to Close", value: closureMetrics.avgDaysToResolution.toString(), trend: -2.1, color: "#3b82f6", good: "down" as const },
              { label: "Follow-up Rate", value: `${closureMetrics.followUpComplianceRate}%`, trend: 3.8, color: "#8b5cf6" },
              { label: "Referral Accept", value: `${closureMetrics.referralAcceptanceRate}%`, trend: 1.2, color: "#06b6d4" },
              { label: "Loop Closure", value: `${closureMetrics.loopClosureRate}%`, trend: 5.1, color: "#f59e0b" },
              { label: "Satisfaction", value: `${closureMetrics.patientSatisfaction}/5`, trend: 0.3, color: "#ec4899" },
            ].map(kpi => (
              <Card key={kpi.label} className="bg-[#111827]/60 border-white/[0.06]">
                <CardContent className="p-3">
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-lg font-bold mt-1" style={{ color: kpi.color }}>{kpi.value}</p>
                  <TrendIndicator value={kpi.trend} good={kpi.good || "up"} />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-[#111827]/60 border-white/[0.06]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300 font-medium">Screening-to-Resolution Pipeline (6-Month Trend)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={monthlyOutcomes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#e5e7eb' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="screened" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Screened" opacity={0.7} />
                  <Bar dataKey="referred" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Referred" opacity={0.7} />
                  <Bar dataKey="connected" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Connected" opacity={0.7} />
                  <Bar dataKey="resolved" fill="#22c55e" radius={[3, 3, 0, 0]} name="Resolved" opacity={0.7} />
                  <Line type="monotone" dataKey="lostToFollowUp" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Lost to Follow-Up" dot={{ fill: '#ef4444', r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Outcomes by Domain */}
          <Card className="bg-[#111827]/60 border-white/[0.06]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300 font-medium">Resolution Performance by SDOH Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { domain: "food", resolution: 78, avgDays: 12, satisfaction: 4.4 },
                  { domain: "housing", resolution: 52, avgDays: 28, satisfaction: 3.8 },
                  { domain: "transportation", resolution: 85, avgDays: 8, satisfaction: 4.5 },
                  { domain: "utilities", resolution: 71, avgDays: 15, satisfaction: 4.1 },
                  { domain: "employment", resolution: 45, avgDays: 35, satisfaction: 3.6 },
                  { domain: "social", resolution: 63, avgDays: 22, satisfaction: 4.0 },
                  { domain: "health_literacy", resolution: 74, avgDays: 14, satisfaction: 4.2 },
                  { domain: "safety", resolution: 68, avgDays: 10, satisfaction: 3.9 },
                ].map(d => (
                  <div key={d.domain} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02]">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: domainColors[d.domain as keyof typeof domainColors] }} />
                    <span className="text-[12px] text-gray-200 w-32">{domainLabels[d.domain as keyof typeof domainLabels]}</span>
                    <div className="flex-1">
                      <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${d.resolution}%`, backgroundColor: d.resolution >= 70 ? '#22c55e' : d.resolution >= 50 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                    </div>
                    <span className="text-[12px] font-medium w-12 text-right" style={{ color: d.resolution >= 70 ? '#22c55e' : d.resolution >= 50 ? '#f59e0b' : '#ef4444' }}>{d.resolution}%</span>
                    <div className="text-right w-20">
                      <p className="text-[10px] text-gray-500">{d.avgDays} days avg</p>
                    </div>
                    <div className="text-right w-16">
                      <p className="text-[10px] text-gray-500">{d.satisfaction}/5 sat</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
