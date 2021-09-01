// SeedData ------------------------------------------------------------------

// Seed data for tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";

// Seed Data -----------------------------------------------------------------

const ONE_DAY = 24 * 60 * 60 * 1000;    // One day (milliseconds)

// *** Access Tokens ***

export const ACCESS_TOKENS_SUPERUSER: Partial<AccessToken>[] = [
    {
        expires: new Date(new Date().getTime() + ONE_DAY),
        scope: "superuser",
        token: "superuser_access_1",
        // userId must be seeded
    },
    {
        expires: new Date(new Date().getTime() - ONE_DAY),
        scope: "superuser",
        token: "superuser_access_2",
        // userId must be seeded
    },
];

// *** Refresh Tokens ***

export const REFRESH_TOKENS_SUPERUSER: Partial<RefreshToken>[] = [
    {
        accessToken: "superuser_access_1",
        expires: new Date(new Date().getTime() + ONE_DAY),
        token: "superuser_refresh_1",
        // userId must be seeded
    },
    {
        accessToken: "superuser_access_2",
        expires: new Date(new Date().getTime() - ONE_DAY),
        token: "superuser_refresh_2",
        // userId must be seeded
    },
];

// *** Users ***

export const USERNAME_SUPERUSER = "superuser";

export const USERS: Partial<User>[] = [
    {
        active: true,
        name: "First Facility Admin",
        password: "firstadmin",
        scope: "first:admin",
        username: "firstadmin",
    },
    {
        active: true,
        name: "First Facility Regular",
        password: "firstregular",
        scope: "first:regular",
        username: "firstregular",
    },
    {
        active: false,
        name: "Second Facility Admin",
        password: "secondadmin",
        scope: "second:admin",
        username: "secondadmin",
    },
    {
        active: false,
        name: "Second Facility Regular",
        password: "secondregular",
        scope: "second:regular",
        username: "secondregular",
    },
    {
        active: true,
        name: "Superuser User",
        password: "superuser",
        scope: "superuser",
        username: "superuser",
    }
];

