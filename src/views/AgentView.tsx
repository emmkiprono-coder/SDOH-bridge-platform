import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot, Send, Sparkles, ClipboardCheck, ArrowRightLeft, AlertTriangle, Users,
  Zap, BookOpen, Globe, MapPin, CheckCircle, Loader2, ChevronRight
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { AgentMessage, AgentAction } from "../types";

const suggestedActions = [
  { icon: AlertTriangle, label: "Find unresolved critical patients", prompt: "Show me all critical-risk patients with open referrals that haven't been followed up in 7+ days", color: "#ef4444" },
  { icon: ClipboardCheck, label: "Run screening gap analysis", prompt: "Identify patients who are overdue for SDOH screening and prioritize by last known risk level", color: "#f59e0b" },
  { icon: ArrowRightLeft, label: "Check referral loop closures", prompt: "Which referrals have been pending for more than 14 days without a follow-up? Generate a follow-up action plan", color: "#8b5cf6" },
  { icon: Globe, label: "Cultural resource matching", prompt: "Find culturally and linguistically appropriate resources for our Arabic-speaking patients in Milwaukee", color: "#3b82f6" },
  { icon: MapPin, label: "Regional resource gaps", prompt: "Analyze resource availability gaps across our 6-state service area and recommend new community partnerships", color: "#06b6d4" },
  { icon: Users, label: "Generate equity report", prompt: "Generate a health equity report comparing SDOH outcomes across ethnic groups with recommendations for reducing disparities", color: "#ec4899" },
];

const simulatedResponses: Record<string, { text: string; actions: AgentAction[] }> = {
  "critical": {
    text: `I've analyzed your patient registry and identified **3 critical-priority items** requiring immediate attention:

**1. Luis Ramirez (MRN-96284)** - Atlanta, GA
Risk Level: CRITICAL | Eviction notice received, family of 5
- Housing referral to Atlanta Legal Aid has been PENDING for 5 days with zero follow-ups
- Food, utilities, employment all flagged critical
- ⚠️ Action needed: Emergency housing defense, SNAP expedited processing

**2. Robert Chen (MRN-52947)** - Chicago, IL
Risk Level: HIGH | Social isolation score 9/10 (critical)
- Referral to Chinese American Service League was SENT but no confirmation received
- Lives alone, wife deceased, adult children out of state
- ⚠️ Action needed: Confirm CASL intake, schedule welfare check, explore Mandarin-speaking peer support

**3. Maria Garcia (MRN-20481)** - Chicago, IL
Risk Level: HIGH | Housing referral still PENDING after 15 days
- Food referral progressing well (SNAP approved)
- Housing with Spanish Coalition for Housing has had no activity
- ⚠️ Action needed: Contact SCH for intake scheduling, explore emergency rent assistance

I can auto-generate follow-up tasks for each patient. Shall I proceed?`,
    actions: [
      { type: "gap_identified", description: "3 critical patients with stalled referrals identified" },
      { type: "follow_up_scheduled", description: "Follow-up reminders queued for SW Martinez and Dr. Liu" },
    ]
  },
  "screening": {
    text: `I've completed a screening gap analysis across your patient population:

**Overdue for Screening:**
- **Destiny Johnson** (MRN-63851, Greenville, SC) - Never screened, age 22, uninsured
  - Priority: HIGH - Young, uninsured patients have 2.3x higher SDOH burden
  - Recommended: Schedule screening with interpreter if needed, use tablet-based tool

**Approaching Re-screening Window (90 days):**
- **Hmong Vang** (MRN-74920, Milwaukee, WI) - Last screened Jan 15 (42 days ago)
  - Previous risk: Moderate | Needs: Health literacy, employment
  - Recommended: Schedule re-screen with CHW Xiong (Hmong community health worker)

**System-wide Screening Metrics:**
- Current screening rate: 87.5% (7 of 8 sample patients)
- Average time between screens: 78 days
- Interpreter-assisted screens: 50% of all screenings
- Most common screening gaps: Rural AL and SC markets

**Recommendation:** Implement automated screening reminders at 60-day intervals. For Destiny Johnson, I suggest outreach through a community health worker given her uninsured status, which may create barriers to clinic-based screening.`,
    actions: [
      { type: "screening_initiated", description: "Screening reminder scheduled for Destiny Johnson" },
      { type: "gap_identified", description: "2 patients identified for re-screening" },
    ]
  },
  "referral": {
    text: `I've analyzed all active referrals for loop closure status. Here's your action report:

**🔴 Stalled Referrals (>14 days, no follow-up):**

1. **Maria Garcia - Housing** (Spanish Coalition for Housing)
   - Created: Feb 11 | Last update: Feb 11 (15 days stalled)
   - Action: Contact SCH at (773) 342-7575, request expedited intake
   - Auto-generating follow-up task for SW Martinez

2. **Luis Ramirez - Housing** (Atlanta Legal Aid)
   - Created: Feb 21 | Status: Pending | No follow-ups
   - URGENT: Family facing active eviction
   - Action: Emergency escalation to Atlanta Legal Aid, request same-week appointment

**🟡 On Track but Needs Monitoring:**

3. **Robert Chen - Social Isolation** (CASL)
   - Sent Feb 23 | Awaiting confirmation
   - Action: Follow up in 48 hours if no response

4. **Fatima Al-Rashid - Employment** (IRC Milwaukee)
   - Accepted | Program starts March 1
   - Action: Confirm ESL enrollment, arrange transportation

**✅ Successfully Closed:**
- James Washington - Utilities: LIHEAP secured for 12 months ✓

**Auto-Generated Action Plan:**
I've created follow-up tasks for each stalled referral with assigned workers and deadlines. I can also send automated outreach messages to partner organizations. Would you like me to proceed?`,
    actions: [
      { type: "gap_identified", description: "2 referrals stalled beyond SLA threshold" },
      { type: "follow_up_scheduled", description: "Follow-up tasks auto-generated for 4 referrals" },
      { type: "report_generated", description: "Referral loop closure report generated" },
    ]
  },
  "cultural": {
    text: `I've searched our resource database and community network for culturally appropriate services for Arabic-speaking patients in the Milwaukee market:

**Available Resources (Linguistically Matched):**

1. **International Rescue Committee - Milwaukee** ★★★★★
   - Languages: Arabic, Hmong, Burmese, Swahili, English
   - Services: Employment readiness, ESL, case management
   - Cultural competency: Strong MENA expertise, female staff available
   - Capacity: Available | Accepts Medicaid
   - Already connected: Fatima Al-Rashid

2. **Islamic Society of Milwaukee - Social Services**
   - Languages: Arabic, English
   - Services: Emergency assistance, food bank (halal), family support
   - Cultural: Faith-based, gender-sensitive programming
   - Note: Not in current partner database - recommend outreach

3. **Salam Clinic (Free Clinic)**
   - Languages: Arabic, English
   - Services: Primary care, mental health, health literacy
   - Cultural: Founded by Arabic-speaking physicians
   - Note: Potential screening partner for LEP Arabic patients

**Gaps Identified:**
- No Arabic-language housing advocacy services in Milwaukee
- Limited Arabic-speaking mental health providers
- Health literacy materials not available in Arabic across system

**Recommendations:**
1. Establish formal partnership with Islamic Society of Milwaukee
2. Develop Arabic SDOH screening materials (I can draft translations)
3. Recruit Arabic-speaking community health workers through local mosques
4. Add Salam Clinic to resource directory for Arabic-speaking patients

Shall I draft partnership outreach letters or create Arabic-translated screening materials?`,
    actions: [
      { type: "resource_found", description: "3 culturally appropriate resources identified for Arabic-speaking patients" },
      { type: "gap_identified", description: "Housing advocacy and mental health gaps for Arabic speakers in Milwaukee" },
    ]
  },
  "regional": {
    text: `I've completed a comprehensive resource availability analysis across your 6-state service area:

**Critical Resource Gaps by Region:**

🔴 **Alabama (Birmingham)**
- Gap: Extremely limited interpreter services (ratio 1:1,600)
- Gap: No bilingual SDOH navigation services
- Gap: Rural transportation deserts for 40% of LEP patients
- Impact: 62% resolution rate (lowest across system)
- Recommendation: Implement telehealth-based screening; partner with UAB Language Services

🔴 **South Carolina (Greenville)**
- Gap: No bilingual housing counselors for Spanish-speaking population
- Gap: Limited food bank network with culturally diverse offerings
- Gap: Only 1 uninsured patient navigator covering entire region
- Impact: 65% resolution rate
- Recommendation: Partner with SC Appleseed Legal Justice Center; expand food bank partnerships

🟡 **Georgia (Atlanta)**
- Gap: No formal refugee employment program partnership
- Gap: Limited Buford Highway corridor health literacy programs
- Gap: Transportation barriers for patients outside MARTA coverage
- Impact: 69% resolution rate
- Recommendation: Partner with New American Pathways; establish Buford Hwy health access hub

🟡 **Wisconsin (Milwaukee)**
- Gap: Limited Arabic mental health services
- Gap: Hmong community health workers at capacity
- Gap: Winter utility assistance programs oversubscribed
- Impact: 68% resolution rate
- Recommendation: Expand CHW pipeline through HAFA partnership; add Islamic Society to network

🟢 **Illinois (Chicago)**
- Strongest resource network; 72% resolution rate
- Minor gaps: Senior isolation programs need cultural diversification
- Recommendation: Replicate Chicago model across other states

🟢 **North Carolina (Charlotte)**
- Good network with Crisis Assistance Ministry partnership
- Gap: Limited non-English health literacy materials
- Recommendation: Develop multilingual materials; expand interpreter pool

**Strategic Priority:** Focus investment on Alabama and South Carolina where infrastructure gaps are most severe. I can generate a detailed resource development roadmap with budget estimates.`,
    actions: [
      { type: "gap_identified", description: "14 resource gaps identified across 6 states" },
      { type: "report_generated", description: "Regional gap analysis report generated" },
    ]
  },
  "equity": {
    text: `**Health Equity Report: SDOH Outcomes Analysis**
*Generated for Advocate Health, Multi-State Operations*

**Executive Summary:**
Significant disparities exist in SDOH screening outcomes across ethnic groups. The largest equity gaps appear in loop closure rates and resource matching for MENA and Asian populations.

**Key Findings:**

**1. Screening Access Disparity**
- White patients: 94% screening rate
- MENA patients: 71% screening rate (-23 point gap)
- Root cause: Language barriers, cultural unfamiliarity with screening, immigration concerns
- Action: Implement community-based screening through trusted cultural organizations

**2. Referral Follow-up Gap**
- White patients: 89% follow-up rate
- MENA patients: 65% follow-up rate (-24 point gap)
- Asian patients: 68% follow-up rate (-21 point gap)
- Root cause: Language barriers in follow-up communication, cultural preferences for in-person contact
- Action: Multilingual follow-up communications; pair with bilingual CHWs

**3. Loop Closure Inequity**
- White patients: 84% loop closure
- MENA patients: 58% loop closure (-26 point gap ⚠️ CRITICAL)
- Asian patients: 61% loop closure (-23 point gap)
- Root cause: Fewer culturally matched resources, interpreter unavailability during referral processes
- Action: Invest in culturally specific community partnerships; ensure interpreter availability at partner organizations

**4. Patient Satisfaction**
- Highest: White (91%) | Lowest: MENA (68%)
- Key driver: Cultural sensitivity and language concordance during screening
- Patients screened in their preferred language report 28% higher satisfaction

**Recommendations for Equity Improvement:**
1. Mandate interpreter availability for all SDOH referral follow-ups
2. Develop cultural liaison program with community health workers from underrepresented populations
3. Set equity-adjusted KPI targets (80% loop closure across ALL ethnic groups within 12 months)
4. Create quarterly equity dashboard review with leadership accountability
5. Establish patient advisory councils with representation from each ethnic group

I can generate a detailed implementation timeline and budget proposal for these recommendations.`,
    actions: [
      { type: "report_generated", description: "Health equity report generated with 5 recommendations" },
      { type: "gap_identified", description: "26-point loop closure gap identified for MENA patients" },
    ]
  },
};

function matchResponse(input: string): { text: string; actions: AgentAction[] } {
  const lower = input.toLowerCase();
  if (lower.includes("critical") || lower.includes("unresolved") || lower.includes("priority")) return simulatedResponses["critical"];
  if (lower.includes("screening") || lower.includes("overdue") || lower.includes("screen")) return simulatedResponses["screening"];
  if (lower.includes("referral") || lower.includes("loop") || lower.includes("pending") || lower.includes("follow")) return simulatedResponses["referral"];
  if (lower.includes("cultural") || lower.includes("arabic") || lower.includes("language") || lower.includes("linguistic")) return simulatedResponses["cultural"];
  if (lower.includes("regional") || lower.includes("gap") || lower.includes("resource") || lower.includes("state")) return simulatedResponses["regional"];
  if (lower.includes("equity") || lower.includes("disparity") || lower.includes("ethnic") || lower.includes("race")) return simulatedResponses["equity"];
  return {
    text: `I can help with that. Here's what I can do for you:

- **Patient Analysis**: Find critical patients, overdue screenings, or at-risk populations
- **Referral Management**: Track loop closures, identify stalled referrals, generate follow-up plans
- **Cultural Matching**: Find culturally and linguistically appropriate resources
- **Gap Analysis**: Identify resource gaps by region, language, or population
- **Equity Reports**: Generate disparity analyses with actionable recommendations
- **Automated Workflows**: Schedule follow-ups, send outreach, generate reports

Try one of the suggested actions below, or ask me anything about your SDOH program.`,
    actions: []
  };
}

const actionTypeIcons: Record<string, typeof CheckCircle> = {
  screening_initiated: ClipboardCheck,
  referral_created: ArrowRightLeft,
  follow_up_scheduled: CheckCircle,
  resource_found: MapPin,
  gap_identified: AlertTriangle,
  report_generated: BookOpen,
};

const actionTypeColors: Record<string, string> = {
  screening_initiated: "#3b82f6",
  referral_created: "#8b5cf6",
  follow_up_scheduled: "#22c55e",
  resource_found: "#06b6d4",
  gap_identified: "#f59e0b",
  report_generated: "#ec4899",
};

export default function AgentView() {
  const { patients } = useAppContext();
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: "sys-1",
      role: "system",
      content: "SDOH Bridge AI Agent initialized. I have access to your patient registry, referral tracking, community resources, and analytics data across all 6 states. How can I help?",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg: AgentMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: msg,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 1800));

    const response = matchResponse(msg);
    const assistantMsg: AgentMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: response.text,
      timestamp: new Date().toISOString(),
      actions: response.actions,
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content.split('\n').map((line, i) => {
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-100">$1</strong>');
      line = line.replace(/⚠️/g, '<span class="text-amber-400">⚠️</span>');
      line = line.replace(/🔴/g, '<span>🔴</span>');
      line = line.replace(/🟡/g, '<span>🟡</span>');
      line = line.replace(/🟢/g, '<span>🟢</span>');
      line = line.replace(/✓/g, '<span class="text-emerald-400">✓</span>');
      line = line.replace(/★/g, '<span class="text-amber-400">★</span>');

      if (line.startsWith('- ')) {
        return <p key={i} className="text-[12.5px] text-gray-300 pl-3 border-l border-white/[0.06] my-0.5" dangerouslySetInnerHTML={{ __html: line.substring(2) }} />;
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-[12.5px] text-gray-300 my-0.5" dangerouslySetInnerHTML={{ __html: line }} />;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">SDOH Bridge AI Agent</h1>
              <p className="text-[11px] text-gray-500">Intelligent assistant for screening, referrals, and gap analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] border-violet-400/20 text-violet-400 bg-violet-400/5">
              <Sparkles className="w-3 h-3 mr-1" /> Agentic Mode
            </Badge>
            <Badge variant="outline" className="text-[10px] border-emerald-400/20 text-emerald-400 bg-emerald-400/5">
              {patients.length} Patients Loaded
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role !== "user" && (
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === "system" ? "bg-gray-700" : "bg-gradient-to-br from-violet-500 to-purple-600"
              }`}>
                {msg.role === "system" ? <Zap className="w-3.5 h-3.5 text-gray-300" /> : <Bot className="w-3.5 h-3.5 text-white" />}
              </div>
            )}

            <div className={`max-w-[75%] ${msg.role === "user" ? "ml-auto" : ""}`}>
              <div className={`rounded-xl p-3.5 ${
                msg.role === "user"
                  ? "bg-emerald-600/20 border border-emerald-500/20"
                  : msg.role === "system"
                    ? "bg-white/[0.03] border border-white/[0.06]"
                    : "bg-[#111827]/80 border border-white/[0.06]"
              }`}>
                {msg.role === "user" ? (
                  <p className="text-[13px] text-gray-200">{msg.content}</p>
                ) : (
                  <div>{formatContent(msg.content)}</div>
                )}
              </div>

              {/* Actions */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.actions.map((action, i) => {
                    const Icon = actionTypeIcons[action.type] || Zap;
                    const color = actionTypeColors[action.type] || "#6b7280";
                    return (
                      <Badge key={i} className="text-[9px] px-2 py-0.5" style={{ backgroundColor: color + '12', color, border: 'none' }}>
                        <Icon className="w-2.5 h-2.5 mr-1" />
                        {action.description}
                      </Badge>
                    );
                  })}
                </div>
              )}

              <p className="text-[9px] text-gray-600 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-[#111827]/80 border border-white/[0.06] rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                <span className="text-[12px] text-gray-400">Analyzing patient data and resources...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Actions */}
      {messages.length <= 2 && (
        <div className="px-6 pb-3 flex-shrink-0">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Suggested Actions</p>
          <div className="grid grid-cols-3 gap-2">
            {suggestedActions.map(action => (
              <button
                key={action.label}
                onClick={() => handleSend(action.prompt)}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all text-left group"
              >
                <action.icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: action.color }} />
                <div>
                  <p className="text-[12px] text-gray-200 font-medium group-hover:text-white transition-colors">{action.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{action.prompt}</p>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-600 flex-shrink-0 ml-auto mt-1 group-hover:text-gray-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 border-t border-white/[0.06] flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about patients, referrals, resources, equity metrics, or request automated actions..."
            className="bg-white/[0.04] border-white/[0.08] text-gray-200 text-[13px] placeholder:text-gray-600 h-10"
            disabled={isTyping}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="bg-violet-600 hover:bg-violet-700 text-white h-10 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-[9px] text-gray-600">
            AI Agent can analyze patient data, track referral loops, identify gaps, match cultural resources, and generate equity reports
          </p>
        </div>
      </div>
    </div>
  );
}
