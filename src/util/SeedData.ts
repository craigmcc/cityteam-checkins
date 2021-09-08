// SeedData ------------------------------------------------------------------

// Seed data for tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";
import Facility from "../models/Facility";
import Template from "../models/Template";

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

// *** Templates ***

export const NAME_TEMPLATE_FIRST = "First Template";
export const NAME_TEMPLATE_SECOND = "Second Template";
export const NAME_TEMPLATE_THIRD = "Third Template";

// Will be repeated for each Facility
export const TEMPLATES: Partial<Template>[] = [
    {
        active: true,
        allMats:  "1-24",
        // facilityId must be seeded
        name: NAME_TEMPLATE_FIRST,
    },
    {
        active: false,
        allMats: "2,4,6,8",
        // facilityId must be seeded
        name: NAME_TEMPLATE_SECOND,
    },
    {
        active: true,
        allMats: "1-12",
        // facilityId must be seeded
        handicapMats: "5,7,9",
        name: NAME_TEMPLATE_SECOND,
        socketMats: "2,4,6",
        workMats: "8,10,12",
    },
];

// *** Users ***

export const USERNAME_SUPERUSER = "superuser";
export const USERNAME_FIRST_ADMIN = "firstadmin";

export const USERS: Partial<User>[] = [
    {
        active: true,
        name: "First Facility Admin",
        password: "firstadminpass",
        scope: "first:admin",
        username: USERNAME_FIRST_ADMIN,
    },
    {
        active: true,
        name: "First Facility Regular",
        password: "firstregularpass",
        scope: "first:regular",
        username: "firstregular",
    },
    {
        active: false,
        name: "Second Facility Admin",
        password: "secondadminpass",
        scope: "second:admin",
        username: "secondadmin",
    },
    {
        active: false,
        name: "Second Facility Regular",
        password: "secondregularpass",
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

