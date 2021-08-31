// ExpressApplication --------------------------------------------------------

// Overall Express application.

// External Modules ----------------------------------------------------------

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
const rfs = require("rotating-file-stream");

// Internal Modules ----------------------------------------------------------

import ApiRouter from "./ApiRouter";
import {handleHttpError, handleServerError, handleValidationError} from "../util/Middleware";
import logger from "../util/ServerLogger";
import {toLocalISO} from "../util/Timestamps";

// Public Objects ------------------------------------------------------------

const app = express();

// Configure global middleware
app.use(cors({
    origin: "*",
}));

// Configure access log management
const CLIENT_LOG = process.env.CLIENT_LOG ? process.env.CLIENT_LOG : "stderr";
morgan.token("timestamp", (req, res): string => {
    return toLocalISO(new Date());
});
if ((CLIENT_LOG === "stderr") || (CLIENT_LOG === "stdout")) {
    app.use(morgan("combined", {
        skip: function (req, res) {
            return req.path === "/clientLog";
        },
        stream: (CLIENT_LOG === "stderr") ? process.stderr : process.stdout,
    }));
} else {
    app.use(morgan("combined", {
        skip: function (req, res) {
            return req.path === "/clientLog";
        },
        stream: rfs.createStream(CLIENT_LOG, { interval: "1d" }),
    }))
}

// Configure body handling middleware
app.use(bodyParser.json({
}));
app.use(bodyParser.text({
    limit: "2mb",
    type: "text/csv",
}));
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Configure static file routing
const CLIENT_BASE = path.resolve("./") + "/client/build";
logger.info({
    context: "Startup",
    msg: "Static File Path",
    path: CLIENT_BASE,
});
app.use(express.static(CLIENT_BASE));

// Configure application-specific routing
//app.use("/openapi.json", OpenApiRouter);
app.use("/api", ApiRouter);

// Configure error handling (must be last)
app.use(handleHttpError);
app.use(handleValidationError);
// app.use(handleOAuthError);
app.use(handleServerError); // The last of the last :-)

// Configure unknown mappings back to the client
app.get("*", (req, res) => {
    res.sendFile(CLIENT_BASE + "/index.html");
});

export default app;
