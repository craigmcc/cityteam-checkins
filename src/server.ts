// server --------------------------------------------------------------------

// Overall Express server for the CityTeam Checkins application.

// External Modules ----------------------------------------------------------

const customEnv = require("custom-env");
customEnv.env(true);
export const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "production";
import {Orchestrator} from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import Database from "./models/Database";
import OAuthOrchestratorHandlers from "./oauth/OAuthOrchestratorHandlers";
export const OAuthOrchestrator: Orchestrator
    = new Orchestrator(OAuthOrchestratorHandlers);
import ExpressApplication from "./routers/ExpressApplication";
import logger from "./util/ServerLogger";

// Document Database Configuration -------------------------------------------

logger.info({
    context: "Startup",
    msg: "Sequelize models initialized",
    dialect: `${Database.getDialect()}`,
    name: `${Database.getDatabaseName()}`
});

// Configure and Start Server ------------------------------------------------

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
ExpressApplication.listen(port, () => {
    logger.info({
        context: "Startup",
        msg: "Server started",
        mode: NODE_ENV,
        port: `${port}`,
    });
});
