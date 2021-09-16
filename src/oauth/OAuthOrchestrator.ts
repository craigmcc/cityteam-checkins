// OAuthOrchestrator ---------------------------------------------------------

// Initialize OAuth handling for this application.

// External Modules ----------------------------------------------------------

import {Orchestrator} from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import OAuthOrchestratorHandlers from "./OAuthOrchestratorHandlers";
export const OAuthOrchestrator: Orchestrator
    = new Orchestrator(OAuthOrchestratorHandlers);

export default OAuthOrchestrator;
