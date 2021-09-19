// types ---------------------------------------------------------------------

// Typescript type definitions for client application components.

// External Modules ----------------------------------------------------------

import React from "react";

// Internal Modules ----------------------------------------------------------

import User from "./models/User";

// Enumerations --------------------------------------------------------------

export enum Levels {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal",
}

export enum Scopes {
    ADMIN = "admin",
    ANY = "any",
    REGULAR = "regular",
    SUPERUSER = "superuser",
}

// Model Object Handlers -----------------------------------------------------

export type HandleUser = (user: User) => void;
export type HandleUserOptional = (user: User | null) => void;

