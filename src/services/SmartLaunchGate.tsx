/**
 * SMART on FHIR Launch Handler
 * 
 * This component handles the OAuth2 redirect flow when SDOH Bridge
 * is launched from Epic Hyperspace (EHR launch) or MyChart (patient launch).
 * 
 * In production, integrate with fhirclient.js:
 *   npm install fhirclient
 *   import FHIR from 'fhirclient';
 *   FHIR.oauth2.authorize({...}).then(client => { ... });
 */

import { useEffect, useState } from "react";
import { SmartFhirClient } from "../services/fhir";

// Configuration: register these in Epic App Orchard
const SMART_CONFIG = {
  clientId: process.env.VITE_EPIC_CLIENT_ID || "sdoh-bridge-dev",
  redirectUri: process.env.VITE_EPIC_REDIRECT_URI || `${window.location.origin}/launch/callback`,
  scopes: [
    "launch", "openid", "fhirUser",
    "patient/Patient.read",
    "patient/Observation.read", "patient/Observation.write",
    "patient/QuestionnaireResponse.write",
    "patient/Condition.read", "patient/Condition.write",
    "patient/ServiceRequest.read", "patient/ServiceRequest.write",
    "patient/Goal.write",
    "patient/Procedure.write",
    "patient/Consent.write",
  ],
};

interface LaunchState {
  status: "initializing" | "authorizing" | "exchanging" | "ready" | "error" | "standalone";
  error?: string;
  patientId?: string;
  fhirBaseUrl?: string;
}

/**
 * Detects whether the app was launched via SMART on FHIR (iss + launch params present)
 * or standalone (no EHR context).
 */
export function detectLaunchMode(): "ehr" | "standalone" {
  const params = new URLSearchParams(window.location.search);
  return params.has("iss") && params.has("launch") ? "ehr" : "standalone";
}

/**
 * SmartLaunchProvider wraps the app and handles the OAuth2 flow.
 * When running standalone (no Epic context), it passes through to the demo mode.
 */
export function SmartLaunchGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LaunchState>({ status: "initializing" });
  const client = new SmartFhirClient();

  useEffect(() => {
    const mode = detectLaunchMode();

    if (mode === "standalone") {
      // No Epic context: run in demo/standalone mode with mock data
      setState({ status: "standalone" });
      return;
    }

    // EHR Launch: begin SMART on FHIR authorization flow
    handleEhrLaunch();
  }, []);

  async function handleEhrLaunch() {
    try {
      const params = client.parseLaunchParams(window.location.href);
      if (!params) {
        setState({ status: "error", error: "Missing iss or launch parameters" });
        return;
      }

      setState({ status: "authorizing" });

      // Discover Epic's authorization endpoints
      const endpoints = await client.discoverEndpoints(params.iss);

      // Generate state for CSRF protection
      const state = crypto.randomUUID();
      sessionStorage.setItem("smart_state", state);
      sessionStorage.setItem("smart_iss", params.iss);

      // Redirect to Epic's authorization endpoint
      const authUrl = client.buildAuthUrl({
        authorizationEndpoint: endpoints.authorizationEndpoint,
        clientId: SMART_CONFIG.clientId,
        redirectUri: SMART_CONFIG.redirectUri,
        launch: params.launch,
        aud: params.iss,
        state,
      });

      window.location.href = authUrl;
    } catch (err: any) {
      setState({ status: "error", error: err.message });
    }
  }

  // Handle callback (authorization code exchange)
  useEffect(() => {
    if (!window.location.pathname.includes("/callback")) return;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const returnedState = urlParams.get("state");
    const savedState = sessionStorage.getItem("smart_state");
    const iss = sessionStorage.getItem("smart_iss");

    if (!code || !returnedState || returnedState !== savedState) {
      setState({ status: "error", error: "Authorization failed: state mismatch or missing code" });
      return;
    }

    (async () => {
      try {
        setState({ status: "exchanging" });

        const endpoints = await client.discoverEndpoints(iss!);
        const context = await client.exchangeCodeForToken({
          tokenEndpoint: endpoints.tokenEndpoint,
          code,
          clientId: SMART_CONFIG.clientId,
          redirectUri: SMART_CONFIG.redirectUri,
        });

        setState({
          status: "ready",
          patientId: context.patientId,
          fhirBaseUrl: context.fhirBaseUrl,
        });

        // Clean up URL
        window.history.replaceState({}, "", "/");
      } catch (err: any) {
        setState({ status: "error", error: err.message });
      }
    })();
  }, []);

  // Render based on state
  if (state.status === "initializing" || state.status === "authorizing" || state.status === "exchanging") {
    return (
      <div className="flex h-screen bg-[#0a0f1a] items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-lg text-white font-medium mb-1">Connecting to Epic</h2>
          <p className="text-sm text-gray-500">
            {state.status === "initializing" && "Detecting launch context..."}
            {state.status === "authorizing" && "Redirecting to Epic authorization..."}
            {state.status === "exchanging" && "Exchanging credentials..."}
          </p>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex h-screen bg-[#0a0f1a] items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-xl">!</span>
          </div>
          <h2 className="text-lg text-white font-medium mb-2">Connection Error</h2>
          <p className="text-sm text-gray-400 mb-4">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Ready or standalone: render the app
  return <>{children}</>;
}

export default SmartLaunchGate;
