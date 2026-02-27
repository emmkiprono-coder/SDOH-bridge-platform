import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ClipboardCheck, ChevronRight, ChevronLeft, Globe, AlertTriangle, CheckCircle, Languages, Users, Info
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { domainLabels, domainColors, riskColors } from "../data/mockData";
import { SDOHDomain, RiskLevel, Patient } from "../types";

const screeningQuestions: { domain: SDOHDomain; questions: { id: string; text: string; translations: Record<string, string>; options: { value: string; label: string; score: number; flagged: boolean }[] }[] }[] = [
  {
    domain: "food",
    questions: [
      {
        id: "food_1", text: "Within the past 12 months, did you worry that your food would run out before you got money to buy more?",
        translations: { Spanish: "En los últimos 12 meses, ¿le preocupó que su comida se acabara antes de tener dinero para comprar más?", Arabic: "خلال الـ12 شهرًا الماضية، هل كنت قلقًا من نفاد طعامك قبل أن يتوفر لديك المال لشراء المزيد؟", Mandarin: "在过去12个月内，您是否担心过在有钱买食物之前食物就会用完？" },
        options: [{ value: "often", label: "Often true", score: 3, flagged: true }, { value: "sometimes", label: "Sometimes true", score: 2, flagged: true }, { value: "never", label: "Never true", score: 0, flagged: false }]
      },
      {
        id: "food_2", text: "Within the past 12 months, did the food you bought just not last, and you didn't have money to get more?",
        translations: { Spanish: "En los últimos 12 meses, ¿la comida que compró simplemente no alcanzó y no tenía dinero para comprar más?", Arabic: "خلال الـ12 شهرًا الماضية، هل نفد الطعام الذي اشتريته ولم يكن لديك مال لشراء المزيد؟", Mandarin: "在过去12个月内，您买的食物是否不够用，而且您没有钱买更多？" },
        options: [{ value: "often", label: "Often true", score: 3, flagged: true }, { value: "sometimes", label: "Sometimes true", score: 2, flagged: true }, { value: "never", label: "Never true", score: 0, flagged: false }]
      },
    ]
  },
  {
    domain: "housing",
    questions: [
      {
        id: "housing_1", text: "What is your housing situation today?",
        translations: { Spanish: "¿Cuál es su situación de vivienda hoy?", Arabic: "ما هو وضعك السكني اليوم؟", Mandarin: "您目前的住房情况如何？" },
        options: [{ value: "stable", label: "I have a steady place to live", score: 0, flagged: false }, { value: "concerned", label: "I have housing but am worried about losing it", score: 2, flagged: true }, { value: "unstable", label: "I do not have a steady place to live", score: 3, flagged: true }]
      },
      {
        id: "housing_2", text: "Think about the place you live. Do you have problems with any of these: pests, mold, lead paint, inadequate heat, oven/stove not working, no hot water?",
        translations: { Spanish: "Piense en el lugar donde vive. ¿Tiene problemas con: plagas, moho, pintura con plomo, calefacción inadecuada, estufa sin funcionar, sin agua caliente?", Arabic: "فكر في المكان الذي تعيش فيه. هل لديك مشاكل مع: الآفات، العفن، طلاء الرصاص، التدفئة غير الكافية؟", Mandarin: "想想您居住的地方。您是否有以下问题：害虫、霉菌、含铅油漆、供暖不足？" },
        options: [{ value: "yes", label: "Yes", score: 2, flagged: true }, { value: "no", label: "No", score: 0, flagged: false }]
      },
    ]
  },
  {
    domain: "transportation",
    questions: [
      {
        id: "transport_1", text: "In the past 12 months, has lack of reliable transportation kept you from medical appointments, meetings, work, or from getting things needed for daily living?",
        translations: { Spanish: "En los últimos 12 meses, ¿la falta de transporte confiable le ha impedido asistir a citas médicas, reuniones, trabajo o conseguir cosas necesarias?", Arabic: "خلال الـ12 شهرًا الماضية، هل منعك عدم توفر وسائل نقل موثوقة من حضور المواعيد الطبية أو العمل؟", Mandarin: "在过去12个月内，缺乏可靠的交通工具是否使您无法就医、工作或获取日常所需？" },
        options: [{ value: "yes_medical", label: "Yes, it has kept me from medical appointments", score: 3, flagged: true }, { value: "yes_other", label: "Yes, it has kept me from non-medical meetings, work, or things", score: 2, flagged: true }, { value: "no", label: "No", score: 0, flagged: false }]
      },
    ]
  },
  {
    domain: "utilities",
    questions: [
      {
        id: "util_1", text: "In the past 12 months, has the electric, gas, oil, or water company threatened to shut off services in your home?",
        translations: { Spanish: "En los últimos 12 meses, ¿la compañía de electricidad, gas, petróleo o agua ha amenazado con cortar los servicios en su hogar?", Arabic: "خلال الـ12 شهرًا الماضية، هل هددت شركة الكهرباء أو الغاز أو المياه بقطع الخدمات في منزلك؟", Mandarin: "在过去12个月内，电力、燃气或水务公司是否威胁要切断您家的服务？" },
        options: [{ value: "yes_already", label: "Yes, already shut off", score: 3, flagged: true }, { value: "yes_threatened", label: "Yes, threatened", score: 2, flagged: true }, { value: "no", label: "No", score: 0, flagged: false }]
      },
    ]
  },
  {
    domain: "safety",
    questions: [
      {
        id: "safety_1", text: "Do you feel physically and emotionally safe where you currently live?",
        translations: { Spanish: "¿Se siente física y emocionalmente seguro/a donde vive actualmente?", Arabic: "هل تشعر بالأمان الجسدي والعاطفي في المكان الذي تعيش فيه حاليًا؟", Mandarin: "您在目前居住的地方是否感到身体和情感上都安全？" },
        options: [{ value: "yes", label: "Yes", score: 0, flagged: false }, { value: "unsure", label: "Unsure", score: 1, flagged: true }, { value: "no", label: "No", score: 3, flagged: true }]
      },
    ]
  },
  {
    domain: "financial",
    questions: [
      {
        id: "fin_1", text: "How hard is it for you to pay for the very basics like food, housing, medical care, and heating?",
        translations: { Spanish: "¿Qué tan difícil es para usted pagar lo más básico como comida, vivienda, atención médica y calefacción?", Arabic: "ما مدى صعوبة دفع الأساسيات مثل الطعام والسكن والرعاية الطبية والتدفئة؟", Mandarin: "您支付食物、住房、医疗和取暖等基本费用有多困难？" },
        options: [{ value: "very_hard", label: "Very hard", score: 3, flagged: true }, { value: "somewhat", label: "Somewhat hard", score: 2, flagged: true }, { value: "not_hard", label: "Not hard at all", score: 0, flagged: false }]
      },
    ]
  },
];

export default function ScreeningView() {
  const { patients, setActiveView, setSelectedPatient } = useAppContext();
  const [mode, setMode] = useState<"list" | "screening">("list");
  const [selectedPt, setSelectedPt] = useState<Patient | null>(null);
  const [currentDomain, setCurrentDomain] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [screeningLang, setScreeningLang] = useState("English");
  const [culturalNotes, setCulturalNotes] = useState("");
  const [screeningMethod, setScreeningMethod] = useState("in_person");
  const [completed, setCompleted] = useState(false);

  const totalQuestions = screeningQuestions.reduce((sum, d) => sum + d.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progressPct = (answeredCount / totalQuestions) * 100;

  const currentDomainData = screeningQuestions[currentDomain];
  const currentQuestion = currentDomainData?.questions[currentQ];

  const flatIndex = screeningQuestions.slice(0, currentDomain).reduce((sum, d) => sum + d.questions.length, 0) + currentQ;

  const goNext = () => {
    if (currentQ < currentDomainData.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else if (currentDomain < screeningQuestions.length - 1) {
      setCurrentDomain(currentDomain + 1);
      setCurrentQ(0);
    } else {
      setCompleted(true);
    }
  };

  const goPrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    } else if (currentDomain > 0) {
      setCurrentDomain(currentDomain - 1);
      setCurrentQ(screeningQuestions[currentDomain - 1].questions.length - 1);
    }
  };

  const computeResults = () => {
    const results: { domain: SDOHDomain; score: number; maxScore: number; risk: RiskLevel; flaggedCount: number }[] = [];
    screeningQuestions.forEach(d => {
      let score = 0, maxScore = 0, flaggedCount = 0;
      d.questions.forEach(q => {
        const ans = answers[q.id];
        const opt = q.options.find(o => o.value === ans);
        if (opt) { score += opt.score; if (opt.flagged) flaggedCount++; }
        maxScore += Math.max(...q.options.map(o => o.score));
      });
      const pct = maxScore > 0 ? score / maxScore : 0;
      const risk: RiskLevel = pct >= 0.75 ? "critical" : pct >= 0.5 ? "high" : pct >= 0.25 ? "moderate" : "low";
      results.push({ domain: d.domain, score, maxScore, risk, flaggedCount });
    });
    return results;
  };

  const startScreening = (p: Patient) => {
    setSelectedPt(p);
    setMode("screening");
    setCurrentDomain(0);
    setCurrentQ(0);
    setAnswers({});
    setCulturalNotes("");
    setCompleted(false);
    if (p.language !== "English") setScreeningLang(p.language);
  };

  if (mode === "list") {
    const needsScreening = patients.filter(p => p.screeningStatus === "not_started" || p.screeningStatus === "expired");
    const recentScreened = patients.filter(p => p.screeningStatus === "completed");
    return (
      <div className="p-6 max-w-[1440px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">SDOH Screening</h1>
            <p className="text-sm text-gray-500 mt-0.5">AHN-2 validated screening tool with multilingual support</p>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Badge variant="outline" className="border-amber-400/20 text-amber-400 bg-amber-400/5">
              <AlertTriangle className="w-3 h-3 mr-1" /> {needsScreening.length} Awaiting Screening
            </Badge>
          </div>
        </div>

        {/* Needs Screening */}
        <Card className="bg-[#111827]/60 border-white/[0.06]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Patients Awaiting Screening
            </CardTitle>
          </CardHeader>
          <CardContent>
            {needsScreening.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">All patients have been screened</p>
            ) : (
              <div className="space-y-2">
                {needsScreening.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] text-gray-200 font-medium">{p.name}</p>
                      <p className="text-[11px] text-gray-500">{p.mrn} · {p.language} · {p.insuranceType} · {p.address.split(',').slice(-2).join(',').trim()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.language !== "English" && (
                        <Badge variant="outline" className="text-[10px] border-blue-400/20 text-blue-400 bg-blue-400/5">
                          <Globe className="w-3 h-3 mr-1" /> {p.language}
                        </Badge>
                      )}
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8" onClick={() => startScreening(p)}>
                        <ClipboardCheck className="w-3 h-3 mr-1" /> Screen Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recently Screened */}
        <Card className="bg-[#111827]/60 border-white/[0.06]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-300 font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Recently Screened
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentScreened.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                  onClick={() => { setSelectedPatient(p); setActiveView("patients"); }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold"
                    style={{ backgroundColor: riskColors[p.riskLevel] + '15', color: riskColors[p.riskLevel] }}>
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-gray-200 font-medium">{p.name}</p>
                    <p className="text-[11px] text-gray-500">Screened {p.lastScreening} · {p.identifiedNeeds.length} needs identified · {p.language}</p>
                  </div>
                  <Badge className="text-[10px] px-1.5" style={{ backgroundColor: riskColors[p.riskLevel] + '15', color: riskColors[p.riskLevel], border: 'none' }}>
                    {p.riskLevel} risk
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Screening Mode
  if (completed) {
    const results = computeResults();
    const flaggedDomains = results.filter(r => r.risk !== "low");
    const overallRisk: RiskLevel = results.some(r => r.risk === "critical") ? "critical" : results.some(r => r.risk === "high") ? "high" : results.some(r => r.risk === "moderate") ? "moderate" : "low";

    return (
      <div className="p-6 max-w-[900px] mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-xl font-semibold text-white">Screening Complete</h1>
            <p className="text-sm text-gray-500">{selectedPt?.name} · {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <Card className="bg-[#111827]/60 border-white/[0.06]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Overall Risk Assessment</p>
                <p className="text-2xl font-bold mt-1" style={{ color: riskColors[overallRisk] }}>{overallRisk.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-500">Domains Flagged</p>
                <p className="text-2xl font-bold text-amber-400">{flaggedDomains.length}</p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {results.map(r => (
                <div key={r.domain} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: r.risk !== "low" ? riskColors[r.risk] + '08' : 'rgba(255,255,255,0.02)' }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: domainColors[r.domain] }} />
                  <span className="text-[13px] text-gray-200 w-36">{domainLabels[r.domain]}</span>
                  <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(r.score / r.maxScore) * 100}%`, backgroundColor: riskColors[r.risk] }} />
                  </div>
                  <Badge className="text-[10px] px-1.5" style={{ backgroundColor: riskColors[r.risk] + '15', color: riskColors[r.risk], border: 'none' }}>
                    {r.risk}
                  </Badge>
                  {r.flaggedCount > 0 && (
                    <span className="text-[10px] text-amber-400">{r.flaggedCount} flagged</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {culturalNotes && (
          <Card className="bg-[#111827]/60 border-white/[0.06]">
            <CardContent className="p-4">
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Cultural & Sensitivity Notes</p>
              <p className="text-[13px] text-gray-300">{culturalNotes}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { toast.success("Screening saved and referrals initiated"); setMode("list"); }}>
            Save & Generate Referrals
          </Button>
          <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/[0.04]" onClick={() => setMode("list")}>
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode("list")} className="text-gray-400 hover:text-gray-200">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-white">Screening: {selectedPt?.name}</h1>
            <p className="text-[12px] text-gray-500">{selectedPt?.mrn} · {selectedPt?.language} · {selectedPt?.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={screeningLang} onValueChange={setScreeningLang}>
            <SelectTrigger className="w-36 h-8 text-xs bg-white/[0.04] border-white/[0.08]">
              <Languages className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["English", "Spanish", "Arabic", "Mandarin"].map(l => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <span>Question {flatIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progressPct)}% complete</span>
        </div>
        <Progress value={progressPct} className="h-1.5 [&>div]:bg-emerald-500" />
        <div className="flex gap-1">
          {screeningQuestions.map((d, i) => (
            <button key={d.domain} onClick={() => { setCurrentDomain(i); setCurrentQ(0); }}
              className={`flex-1 h-1 rounded-full transition-all ${i === currentDomain ? 'opacity-100' : 'opacity-40'}`}
              style={{ backgroundColor: domainColors[d.domain] }}
            />
          ))}
        </div>
      </div>

      {/* Domain Badge */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: domainColors[currentDomainData.domain] }} />
        <Badge variant="outline" className="text-[11px]" style={{ borderColor: domainColors[currentDomainData.domain] + '40', color: domainColors[currentDomainData.domain] }}>
          {domainLabels[currentDomainData.domain]}
        </Badge>
      </div>

      {/* Question Card */}
      <Card className="bg-[#111827]/60 border-white/[0.06]">
        <CardContent className="p-6 space-y-5">
          <div>
            <p className="text-[15px] text-gray-100 font-medium leading-relaxed">{currentQuestion.text}</p>
            {screeningLang !== "English" && currentQuestion.translations[screeningLang] && (
              <p className="text-[13px] text-blue-300/70 mt-2 italic leading-relaxed">
                <Globe className="w-3 h-3 inline mr-1 opacity-60" />
                {currentQuestion.translations[screeningLang]}
              </p>
            )}
          </div>

          <RadioGroup
            value={answers[currentQuestion.id] || ""}
            onValueChange={(val) => setAnswers({ ...answers, [currentQuestion.id]: val })}
            className="space-y-2"
          >
            {currentQuestion.options.map(opt => (
              <Label
                key={opt.value}
                className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  answers[currentQuestion.id] === opt.value
                    ? opt.flagged ? 'border-amber-400/30 bg-amber-400/5' : 'border-emerald-400/30 bg-emerald-400/5'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <RadioGroupItem value={opt.value} className="border-gray-500" />
                <span className="text-[13px] text-gray-200">{opt.label}</span>
                {opt.flagged && answers[currentQuestion.id] === opt.value && (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 ml-auto" />
                )}
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Cultural Notes */}
      <Card className="bg-[#111827]/40 border-white/[0.04]">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <p className="text-[11px] text-gray-400 uppercase tracking-wider">Cultural Sensitivity Notes</p>
          </div>
          <Textarea
            value={culturalNotes}
            onChange={(e) => setCulturalNotes(e.target.value)}
            placeholder="Document cultural considerations, patient comfort level, interpreter needs, or accommodations..."
            className="bg-white/[0.02] border-white/[0.06] text-gray-300 text-[12px] min-h-[60px] resize-none placeholder:text-gray-600"
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/[0.04]" onClick={goPrev} disabled={currentDomain === 0 && currentQ === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={goNext} disabled={!answers[currentQuestion?.id]}>
          {currentDomain === screeningQuestions.length - 1 && currentQ === currentDomainData.questions.length - 1 ? "Complete Screening" : "Next"} <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
