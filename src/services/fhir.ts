/**
 * SDOH Bridge - Epic FHIR Integration Service Layer
 * 
 * This module provides the FHIR R4 client, SMART on FHIR launch handler,
 * and resource mappers for bidirectional data exchange with Epic.
 * 
 * Standards: HL7 FHIR R4, SMART on FHIR, Gravity Project SDOH Clinical Care IG v2.3
 */

// ============================================================
// 1. FHIR TYPES (aligned with Gravity Project profiles)
// ============================================================

export interface FhirPatient {
  resourceType: "Patient";
  id: string;
  identifier: Array<{ system: string; value: string; type?: { text: string } }>;
  name: Array<{ family: string; given: string[]; use: string }>;
  birthDate: string;
  gender: string;
  address: Array<{ line: string[]; city: string; state: string; postalCode: string }>;
  telecom: Array<{ system: string; value: string; use: string }>;
  communication: Array<{ language: { coding: Array<{ system: string; code: string; display: string }>; text: string }; preferred: boolean }>;
  extension?: Array<{ url: string; valueCoding?: { system: string; code: string; display: string }; extension?: any[] }>;
}

export interface FhirQuestionnaireResponse {
  resourceType: "QuestionnaireResponse";
  id?: string;
  questionnaire: string;
  status: "in-progress" | "completed" | "amended";
  subject: { reference: string };
  encounter?: { reference: string };
  authored: string;
  author?: { reference: string };
  item: FhirQRItem[];
}

export interface FhirQRItem {
  linkId: string;
  text: string;
  answer?: Array<{ valueCoding?: { system: string; code: string; display: string }; valueString?: string; valueBoolean?: boolean }>;
  item?: FhirQRItem[];
}

export interface FhirObservation {
  resourceType: "Observation";
  id?: string;
  meta?: { profile: string[] };
  status: "final" | "preliminary";
  category: Array<{ coding: Array<{ system: string; code: string; display: string }> }>;
  code: { coding: Array<{ system: string; code: string; display: string }> };
  subject: { reference: string };
  effectiveDateTime: string;
  valueCodeableConcept?: { coding: Array<{ system: string; code: string; display: string }> };
  derivedFrom?: Array<{ reference: string }>;
  hasMember?: Array<{ reference: string }>;
}

export interface FhirCondition {
  resourceType: "Condition";
  id?: string;
  meta?: { profile: string[] };
  clinicalStatus: { coding: Array<{ system: string; code: string }> };
  verificationStatus: { coding: Array<{ system: string; code: string }> };
  category: Array<{ coding: Array<{ system: string; code: string; display: string }> }>;
  code: { coding: Array<{ system: string; code: string; display: string }> };
  subject: { reference: string };
  onsetDateTime?: string;
  evidence?: Array<{ detail: Array<{ reference: string }> }>;
}

export interface FhirServiceRequest {
  resourceType: "ServiceRequest";
  id?: string;
  meta?: { profile: string[] };
  status: "draft" | "active" | "on-hold" | "completed" | "revoked";
  intent: "order" | "plan" | "proposal";
  category: Array<{ coding: Array<{ system: string; code: string; display: string }> }>;
  code: { coding: Array<{ system: string; code: string; display: string }> };
  subject: { reference: string };
  requester: { reference: string };
  performer?: Array<{ reference: string }>;
  reasonReference?: Array<{ reference: string }>;
  authoredOn: string;
  note?: Array<{ text: string }>;
}

export interface FhirProcedure {
  resourceType: "Procedure";
  id?: string;
  meta?: { profile: string[] };
  status: "completed" | "in-progress" | "not-done";
  category: { coding: Array<{ system: string; code: string; display: string }> };
  code: { coding: Array<{ system: string; code: string; display: string }> };
  subject: { reference: string };
  performedDateTime?: string;
  basedOn?: Array<{ reference: string }>;
}


// ============================================================
// 2. LOINC CODE MAPPING (AHN-2 Screening Tool)
// ============================================================

export const LOINC_SDOH = {
  // Panel codes
  panels: {
    food: { code: "88122-7", display: "Hunger Vital Sign [HVS]" },
    housing: { code: "71802-3", display: "Housing status" },
    transportation: { code: "93030-5", display: "Transportation needs" },
    utilities: { code: "93033-9", display: "Utilities" },
    safety: { code: "93038-8", display: "Personal safety" },
    financial: { code: "76513-1", display: "Financial strain" },
  },

  // Individual question codes
  questions: {
    food_worry: { code: "88122-7", display: "Within the past 12 months, you worried that your food would run out before you got money to buy more" },
    food_didnt_last: { code: "88123-5", display: "Within the past 12 months, the food you bought just didn't last and you didn't have money to get more" },
    housing_status: { code: "71802-3", display: "What is your housing situation today?" },
    housing_worry: { code: "93033-9", display: "Are you worried about losing your housing?" },
    transportation: { code: "93030-5", display: "Has lack of transportation kept you from medical appointments or getting medications?" },
    utilities: { code: "93033-9", display: "In the past 12 months has the electric, gas, oil, or water company threatened to shut off services?" },
    safety: { code: "93038-8", display: "How often does anyone physically hurt you?" },
    financial: { code: "76513-1", display: "How hard is it for you to pay for the very basics like food, housing, medical care, and heating?" },
  },

  // SDOH category for Observation.category
  sdohCategory: { system: "http://hl7.org/fhir/us/core/CodeSystem/us-core-category", code: "sdoh", display: "SDOH" },

  // Gravity Project SDOH domain codes
  domains: {
    food: { system: "http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes", code: "food-insecurity", display: "Food Insecurity" },
    housing: { system: "http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes", code: "housing-instability", display: "Housing Instability" },
    transportation: { system: "http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes", code: "transportation-insecurity", display: "Transportation Insecurity" },
    financial: { system: "http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes", code: "financial-insecurity", display: "Financial Insecurity" },
    safety: { system: "http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes", code: "personal-safety", display: "Personal Safety" },
  },

  // Condition codes (SNOMED CT / ICD-10)
  conditions: {
    food: { snomed: { system: "http://snomed.info/sct", code: "733423003", display: "Food insecurity" }, icd10: { system: "http://hl7.org/fhir/sid/icd-10-cm", code: "Z59.48", display: "Other problems related to inadequate food" } },
    housing: { snomed: { system: "http://snomed.info/sct", code: "32911000", display: "Homeless" }, icd10: { system: "http://hl7.org/fhir/sid/icd-10-cm", code: "Z59.01", display: "Sheltered homelessness" } },
    transportation: { snomed: { system: "http://snomed.info/sct", code: "551561000124104", display: "Transportation insecurity" }, icd10: { system: "http://hl7.org/fhir/sid/icd-10-cm", code: "Z59.82", display: "Transportation insecurity" } },
    financial: { snomed: { system: "http://snomed.info/sct", code: "454061000124102", display: "Financial insecurity" }, icd10: { system: "http://hl7.org/fhir/sid/icd-10-cm", code: "Z59.86", display: "Financial insecurity" } },
    safety: { snomed: { system: "http://snomed.info/sct", code: "706893006", display: "Victim of intimate partner abuse" }, icd10: { system: "http://hl7.org/fhir/sid/icd-10-cm", code: "Z63.0", display: "Problems in relationship with spouse or partner" } },
  },
} as const;


// ============================================================
// 3. SMART ON FHIR CLIENT
// ============================================================

export interface SmartLaunchContext {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
  patientId: string;
  encounterId?: string;
  fhirUser?: string;
  fhirBaseUrl: string;
  refreshToken?: string;
}

/**
 * SMART on FHIR launch handler.
 * In production, use fhirclient.js (https://docs.smarthealthit.org/client-js/)
 * This provides the type contracts and flow documentation.
 */
export class SmartFhirClient {
  private context: SmartLaunchContext | null = null;

  /**
   * Step 1: Parse launch parameters from Epic's redirect
   * Epic calls: {your_launch_url}?iss={FHIR_BASE}&launch={TOKEN}
   */
  parseLaunchParams(url: string): { iss: string; launch: string } | null {
    const params = new URL(url).searchParams;
    const iss = params.get("iss");
    const launch = params.get("launch");
    if (!iss || !launch) return null;
    return { iss, launch };
  }

  /**
   * Step 2: Discover authorization endpoints from .well-known/smart-configuration
   */
  async discoverEndpoints(issUrl: string): Promise<{
    authorizationEndpoint: string;
    tokenEndpoint: string;
  }> {
    const response = await fetch(`${issUrl}/.well-known/smart-configuration`);
    const config = await response.json();
    return {
      authorizationEndpoint: config.authorization_endpoint,
      tokenEndpoint: config.token_endpoint,
    };
  }

  /**
   * Step 3: Build authorization URL
   * Scopes aligned with SDOH Bridge requirements (see Section 4.2 of architecture doc)
   */
  buildAuthUrl(params: {
    authorizationEndpoint: string;
    clientId: string;
    redirectUri: string;
    launch: string;
    aud: string;
    state: string;
  }): string {
    const scopes = [
      "launch",
      "openid", "fhirUser",
      "patient/Patient.read",
      "patient/Observation.read", "patient/Observation.write",
      "patient/QuestionnaireResponse.write",
      "patient/Condition.read", "patient/Condition.write",
      "patient/ServiceRequest.read", "patient/ServiceRequest.write",
      "patient/Goal.write",
      "patient/Procedure.write",
      "patient/Consent.write",
    ].join(" ");

    const url = new URL(params.authorizationEndpoint);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", params.clientId);
    url.searchParams.set("redirect_uri", params.redirectUri);
    url.searchParams.set("scope", scopes);
    url.searchParams.set("launch", params.launch);
    url.searchParams.set("aud", params.aud);
    url.searchParams.set("state", params.state);
    return url.toString();
  }

  /**
   * Step 4: Exchange authorization code for access token
   */
  async exchangeCodeForToken(params: {
    tokenEndpoint: string;
    code: string;
    clientId: string;
    redirectUri: string;
  }): Promise<SmartLaunchContext> {
    const response = await fetch(params.tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: params.code,
        client_id: params.clientId,
        redirect_uri: params.redirectUri,
      }),
    });

    const data = await response.json();
    this.context = {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      scope: data.scope,
      patientId: data.patient,
      encounterId: data.encounter,
      fhirUser: data.fhirUser,
      fhirBaseUrl: data.serviceUrl || data.iss,
      refreshToken: data.refresh_token,
    };
    return this.context;
  }

  /**
   * Make an authenticated FHIR API request
   */
  async fhirRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    if (!this.context) throw new Error("Not authenticated. Complete SMART launch first.");

    const url = `${this.context.fhirBaseUrl}/${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.context.accessToken}`,
        "Accept": "application/fhir+json",
        "Content-Type": "application/fhir+json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`FHIR ${response.status}: ${JSON.stringify(error)}`);
    }
    return response.json();
  }

  getContext(): SmartLaunchContext | null {
    return this.context;
  }
}


// ============================================================
// 4. FHIR RESOURCE MAPPERS
// ============================================================

import type {
  Patient as AppPatient,
  ScreeningRecord,
  ScreeningDomainResult,
  Referral,
  SDOHDomain,
  RiskLevel,
} from "../types";

/**
 * Maps Epic FHIR Patient to SDOH Bridge internal Patient model
 */
export function fhirPatientToApp(fhir: FhirPatient): Partial<AppPatient> {
  const name = fhir.name.find(n => n.use === "official") || fhir.name[0];
  const address = fhir.address?.[0];
  const phone = fhir.telecom?.find(t => t.system === "phone");
  const preferredLang = fhir.communication?.find(c => c.preferred)?.language?.text;

  // Extract ethnicity from US Core extensions
  const ethnicityExt = fhir.extension?.find(e =>
    e.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"
  );
  const ethnicity = ethnicityExt?.extension?.find((e: any) => e.url === "text")?.valueString || "";

  return {
    id: fhir.id,
    name: `${name.given.join(" ")} ${name.family}`,
    mrn: fhir.identifier.find(id => id.type?.text === "MRN")?.value || fhir.identifier[0]?.value || "",
    gender: fhir.gender,
    language: preferredLang || "English",
    ethnicity,
    phone: phone?.value || "",
    address: address ? `${address.line.join(", ")}, ${address.city}, ${address.state} ${address.postalCode}` : "",
    age: fhir.birthDate ? Math.floor((Date.now() - new Date(fhir.birthDate).getTime()) / 31557600000) : 0,
  };
}

/**
 * Maps SDOH Bridge screening session to FHIR QuestionnaireResponse
 * Follows SDC QuestionnaireResponse profile
 */
export function screeningToFhirQR(
  screening: ScreeningRecord,
  patientId: string,
  encounterId?: string
): FhirQuestionnaireResponse {
  const items: FhirQRItem[] = [];

  for (const domain of screening.domains) {
    const panelInfo = LOINC_SDOH.panels[domain.domain as keyof typeof LOINC_SDOH.panels];
    if (!panelInfo) continue;

    const domainItem: FhirQRItem = {
      linkId: domain.domain,
      text: panelInfo.display,
      item: domain.responses.map((r, idx) => ({
        linkId: `${domain.domain}-q${idx + 1}`,
        text: r.question,
        answer: [r.flagged
          ? { valueCoding: { system: "http://loinc.org", code: "LA33-6", display: "Yes" } }
          : { valueCoding: { system: "http://loinc.org", code: "LA32-8", display: "No" } }
        ],
      })),
    };
    items.push(domainItem);
  }

  const qr: FhirQuestionnaireResponse = {
    resourceType: "QuestionnaireResponse",
    questionnaire: "http://advocatehealth.org/fhir/Questionnaire/sdoh-ahn2",
    status: "completed",
    subject: { reference: `Patient/${patientId}` },
    authored: screening.date,
    item: items,
  };

  if (encounterId) {
    qr.encounter = { reference: `Encounter/${encounterId}` };
  }

  return qr;
}

/**
 * Extracts SDOHCC Observation Screening Response instances from screening results.
 * Each flagged Q&A becomes an Observation (equivalent to StructureMap extraction).
 */
export function screeningToFhirObservations(
  screening: ScreeningRecord,
  patientId: string,
  questionnaireResponseId: string
): FhirObservation[] {
  const observations: FhirObservation[] = [];

  for (const domain of screening.domains) {
    for (const response of domain.responses) {
      if (!response.flagged) continue;

      const questionCode = Object.values(LOINC_SDOH.questions).find(q =>
        q.display.toLowerCase().includes(response.question.toLowerCase().substring(0, 30))
      );

      observations.push({
        resourceType: "Observation",
        meta: { profile: ["http://hl7.org/fhir/us/sdoh-clinicalcare/StructureDefinition/SDOHCC-ObservationScreeningResponse"] },
        status: "final",
        category: [
          { coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "survey", display: "Survey" }] },
          { coding: [LOINC_SDOH.sdohCategory] },
        ],
        code: { coding: [questionCode || { system: "http://loinc.org", code: "unknown", display: response.question }] },
        subject: { reference: `Patient/${patientId}` },
        effectiveDateTime: screening.date,
        valueCodeableConcept: {
          coding: [{ system: "http://loinc.org", code: "LA33-6", display: "Yes" }],
        },
        derivedFrom: [{ reference: `QuestionnaireResponse/${questionnaireResponseId}` }],
      });
    }
  }

  return observations;
}

/**
 * Creates SDOHCC Condition resources for identified health concerns
 */
export function identifiedNeedToFhirCondition(
  domain: SDOHDomain,
  patientId: string,
  observationIds: string[]
): FhirCondition {
  const domainInfo = LOINC_SDOH.domains[domain as keyof typeof LOINC_SDOH.domains];
  const conditionCodes = LOINC_SDOH.conditions[domain as keyof typeof LOINC_SDOH.conditions];

  const coding = conditionCodes
    ? [conditionCodes.snomed, conditionCodes.icd10]
    : [{ system: "http://snomed.info/sct", code: "unknown", display: domain }];

  return {
    resourceType: "Condition",
    meta: { profile: ["http://hl7.org/fhir/us/sdoh-clinicalcare/StructureDefinition/SDOHCC-Condition"] },
    clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }] },
    verificationStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-ver-status", code: "unconfirmed" }] },
    category: [
      { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-category", code: "health-concern", display: "Health Concern" }] },
      domainInfo ? { coding: [domainInfo] } : { coding: [LOINC_SDOH.sdohCategory] },
    ],
    code: { coding },
    subject: { reference: `Patient/${patientId}` },
    onsetDateTime: new Date().toISOString(),
    evidence: observationIds.map(id => ({ detail: [{ reference: `Observation/${id}` }] })),
  };
}

/**
 * Maps SDOH Bridge referral to FHIR ServiceRequest (SDOHCC profile)
 */
export function referralToFhirServiceRequest(
  referral: Referral,
  conditionId: string,
  practitionerId: string
): FhirServiceRequest {
  const statusMap: Record<string, FhirServiceRequest["status"]> = {
    pending: "draft", sent: "active", accepted: "active",
    in_progress: "active", resolved: "completed", closed: "completed", declined: "revoked",
  };

  const domainInfo = LOINC_SDOH.domains[referral.domain as keyof typeof LOINC_SDOH.domains];

  return {
    resourceType: "ServiceRequest",
    meta: { profile: ["http://hl7.org/fhir/us/sdoh-clinicalcare/StructureDefinition/SDOHCC-ServiceRequest"] },
    status: statusMap[referral.status] || "active",
    intent: "order",
    category: [
      { coding: [LOINC_SDOH.sdohCategory] },
      domainInfo ? { coding: [domainInfo] } : { coding: [LOINC_SDOH.sdohCategory] },
    ],
    code: { coding: [{ system: "http://snomed.info/sct", code: "410606002", display: "Social service procedure" }] },
    subject: { reference: `Patient/${referral.patientId}` },
    requester: { reference: `Practitioner/${practitionerId}` },
    performer: [{ reference: `Organization/${referral.organization}` }],
    reasonReference: [{ reference: `Condition/${conditionId}` }],
    authoredOn: referral.createdDate,
    note: referral.notes.map(n => ({ text: n })),
  };
}

/**
 * Maps resolved referral to FHIR Procedure (loop closure)
 */
export function closedReferralToFhirProcedure(
  referral: Referral,
  serviceRequestId: string,
  patientId: string
): FhirProcedure {
  return {
    resourceType: "Procedure",
    meta: { profile: ["http://hl7.org/fhir/us/sdoh-clinicalcare/StructureDefinition/SDOHCC-Procedure"] },
    status: "completed",
    category: { coding: [LOINC_SDOH.sdohCategory] },
    code: { coding: [{ system: "http://snomed.info/sct", code: "410606002", display: "Social service procedure" }] },
    subject: { reference: `Patient/${patientId}` },
    performedDateTime: referral.closedDate || new Date().toISOString(),
    basedOn: [{ reference: `ServiceRequest/${serviceRequestId}` }],
  };
}


// ============================================================
// 5. FHIR SERVICE (orchestrates read/write operations)
// ============================================================

export class FhirService {
  constructor(private client: SmartFhirClient) {}

  /**
   * Load patient context on SMART launch
   */
  async loadPatientContext(patientId: string): Promise<{
    patient: Partial<AppPatient>;
    priorScreenings: FhirObservation[];
    activeConditions: FhirCondition[];
    activeReferrals: FhirServiceRequest[];
  }> {
    const [fhirPatient, obsBundle, condBundle, srBundle] = await Promise.all([
      this.client.fhirRequest<FhirPatient>(`Patient/${patientId}`),
      this.client.fhirRequest<any>(`Observation?patient=${patientId}&category=sdoh&_sort=-date&_count=50`),
      this.client.fhirRequest<any>(`Condition?patient=${patientId}&category=health-concern&category=sdoh`),
      this.client.fhirRequest<any>(`ServiceRequest?patient=${patientId}&category=sdoh&status=active,draft`),
    ]);

    return {
      patient: fhirPatientToApp(fhirPatient),
      priorScreenings: obsBundle.entry?.map((e: any) => e.resource) || [],
      activeConditions: condBundle.entry?.map((e: any) => e.resource) || [],
      activeReferrals: srBundle.entry?.map((e: any) => e.resource) || [],
    };
  }

  /**
   * Submit completed screening to Epic
   * Full pipeline: QuestionnaireResponse -> Observations -> Conditions
   */
  async submitScreening(
    screening: ScreeningRecord,
    patientId: string,
    encounterId?: string
  ): Promise<{
    questionnaireResponseId: string;
    observationIds: string[];
    conditionIds: string[];
  }> {
    // 1. Write QuestionnaireResponse
    const qr = screeningToFhirQR(screening, patientId, encounterId);
    const savedQR = await this.client.fhirRequest<FhirQuestionnaireResponse>(
      "QuestionnaireResponse",
      { method: "POST", body: JSON.stringify(qr) }
    );
    const qrId = savedQR.id!;

    // 2. Extract and write Observations for flagged items
    const observations = screeningToFhirObservations(screening, patientId, qrId);
    const observationIds: string[] = [];
    for (const obs of observations) {
      const saved = await this.client.fhirRequest<FhirObservation>(
        "Observation",
        { method: "POST", body: JSON.stringify(obs) }
      );
      observationIds.push(saved.id!);
    }

    // 3. Create Conditions for each identified SDOH domain
    const conditionIds: string[] = [];
    const flaggedDomains = screening.domains.filter(d =>
      d.responses.some(r => r.flagged)
    );
    for (const domain of flaggedDomains) {
      const domainObsIds = observationIds; // In production, filter by domain
      const condition = identifiedNeedToFhirCondition(domain.domain, patientId, domainObsIds);
      const saved = await this.client.fhirRequest<FhirCondition>(
        "Condition",
        { method: "POST", body: JSON.stringify(condition) }
      );
      conditionIds.push(saved.id!);
    }

    return { questionnaireResponseId: qrId, observationIds, conditionIds };
  }

  /**
   * Create a referral in Epic as a ServiceRequest
   */
  async createReferral(
    referral: Referral,
    conditionId: string,
    practitionerId: string
  ): Promise<string> {
    const sr = referralToFhirServiceRequest(referral, conditionId, practitionerId);
    const saved = await this.client.fhirRequest<FhirServiceRequest>(
      "ServiceRequest",
      { method: "POST", body: JSON.stringify(sr) }
    );
    return saved.id!;
  }

  /**
   * Close the loop: mark referral as completed and record the Procedure
   */
  async closeReferralLoop(
    referral: Referral,
    serviceRequestId: string,
    conditionId: string,
    patientId: string
  ): Promise<{ procedureId: string }> {
    // 1. Update ServiceRequest status to completed
    await this.client.fhirRequest(
      `ServiceRequest/${serviceRequestId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json-patch+json" },
        body: JSON.stringify([{ op: "replace", path: "/status", value: "completed" }]),
      }
    );

    // 2. Create Procedure recording the completed intervention
    const procedure = closedReferralToFhirProcedure(referral, serviceRequestId, patientId);
    const savedProc = await this.client.fhirRequest<FhirProcedure>(
      "Procedure",
      { method: "POST", body: JSON.stringify(procedure) }
    );

    // 3. Update Condition to resolved
    await this.client.fhirRequest(
      `Condition/${conditionId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json-patch+json" },
        body: JSON.stringify([
          { op: "replace", path: "/clinicalStatus/coding/0/code", value: "resolved" },
        ]),
      }
    );

    return { procedureId: savedProc.id! };
  }
}


// ============================================================
// 6. CDS HOOKS SERVICE (screening reminders)
// ============================================================

export interface CdsHookRequest {
  hook: string;
  hookInstance: string;
  context: {
    userId: string;
    patientId: string;
    encounterId?: string;
  };
  fhirServer: string;
  fhirAuthorization: { access_token: string; token_type: string; scope: string };
}

export interface CdsHookCard {
  uuid?: string;
  summary: string;
  detail?: string;
  indicator: "info" | "warning" | "critical";
  source: { label: string; url?: string };
  suggestions?: Array<{ label: string; actions: any[] }>;
  links?: Array<{ label: string; url: string; type: "smart" | "absolute" }>;
}

/**
 * CDS Hooks handler for SDOH screening reminders.
 * Deploy as a microservice endpoint that Epic calls during clinical workflows.
 */
export function handlePatientViewHook(
  request: CdsHookRequest,
  lastScreeningDate: string | null,
  activeReferrals: number
): { cards: CdsHookCard[] } {
  const cards: CdsHookCard[] = [];

  // Check if SDOH screening is overdue (>12 months)
  if (!lastScreeningDate || monthsSince(lastScreeningDate) > 12) {
    cards.push({
      summary: "SDOH Screening Overdue",
      detail: lastScreeningDate
        ? `Last SDOH screening was ${monthsSince(lastScreeningDate)} months ago. Annual screening recommended per Joint Commission standards.`
        : "No SDOH screening on record. Initial screening recommended.",
      indicator: "warning",
      source: { label: "SDOH Bridge", url: "https://sdoh-bridge.advocatehealth.org" },
      links: [{
        label: "Launch SDOH Bridge Screening",
        url: "https://sdoh-bridge.advocatehealth.org/launch",
        type: "smart",
      }],
    });
  }

  // Alert about stalled referrals
  if (activeReferrals > 0) {
    cards.push({
      summary: `${activeReferrals} Active SDOH Referral${activeReferrals > 1 ? "s" : ""}`,
      detail: "This patient has open SDOH referrals. Review status and follow up during this visit.",
      indicator: "info",
      source: { label: "SDOH Bridge" },
      links: [{
        label: "View Referral Status",
        url: "https://sdoh-bridge.advocatehealth.org/launch?view=referrals",
        type: "smart",
      }],
    });
  }

  return { cards };
}

function monthsSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
}
