// SeedData ------------------------------------------------------------------

// Seed data for tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";
import Facility from "../models/Facility";

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

// *** Facilities ***

export const NAME_FACILITY_FIRST = "First Facility"
export const NAME_FACILITY_SECOND = "Second Facility";
export const NAME_FACILITY_THIRD = "Third Facility";
export const SCOPE_FACILITY_FIRST = "first";
export const SCOPE_FACILITY_SECOND = "second";
export const SCOPE_FACILITY_THIRD = "third";

export const FACILITIES: Partial<Facility>[] = [
    {
        name: NAME_FACILITY_FIRST,
        scope: SCOPE_FACILITY_FIRST,
    },
    {
        active: false,
        name: NAME_FACILITY_SECOND,
        scope: SCOPE_FACILITY_SECOND,
    },
    {
        name: NAME_FACILITY_THIRD,
        scope: SCOPE_FACILITY_THIRD,
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
export const USERNAME_FIRST_ADMIN = "firstadmin";

export const USERS: Partial<User>[] = [
    {
        active: true,
        name: "First Facility Admin",
        password: "firstadmin",
        scope: "first:admin",
        username: USERNAME_FIRST_ADMIN,
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
        username: USERNAME_SUPERUSER,
    }
];

