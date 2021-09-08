// Constants -----------------------------------------------------------------

// Manifest Constants for OpenAPI Builder modules.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

// ***** Miscellaneous Constants *****

export const API_PREFIX = "/api";
export const APPLICATION_JSON = "application/json";

// ***** Model Names *****

export const ACCESS_TOKEN = "AccessToken";
export const CHECKIN = "Checkin";
export const ERROR = "Error";
export const FACILITY = "Facility";
export const GUEST = "Guest";
export const REFRESH_TOKEN = "RefreshToken";
export const TEMPLATE = "Template";
export const USER = "User";

export const MODELS = [
//    ACCESS_TOKEN,
//    CHECKIN,
    FACILITY,
    GUEST,
//    REFRESH_TOKEN,
    TEMPLATE,
    USER,
];

// ***** Model Properties *****

export const ACTIVE = "active";
export const CHECKIN_ID = "checkinId";
export const COMMENTS = "comments";
export const EXPIRES = "expires";
export const FACILITY_ID = "facilityId";
export const FAVORITE = "favorite";
export const FIRST_NAME = "firstName";
export const GUEST_ID = "guestId";
export const ID = "id";
export const LAST_NAME = "lastName";
export const NAME = "name";
export const SCOPE = "scope";
export const TEMPLATE_ID = "templateId";
export const TOKEN = "token";
export const USER_ID = "userId";

// ***** Parameter Names (Includes) *****

export const WITH_CHECKINS = "withCheckins";
export const WITH_FACILITY = "withFacility";
export const WITH_GUEST = "withGuest";
export const WITH_GUESTS = "withGuests";
export const WITH_TEMPLATES = "withTemplates";

// ***** Parameter Names (Matches) *****

export const MATCH_ACTIVE = "active";
export const MATCH_NAME = "name";
export const MATCH_SCOPE = "scope";

// ***** Parameter Names (Pagination) *****

export const LIMIT = "limit";
export const OFFSET = "offset";

// ***** Response Status Codes *****

export const OK = "200";
export const CREATED = "201";
export const BAD_REQUEST = "400";
export const UNAUTHORIZED = "401";
export const FORBIDDEN = "403";
export const NOT_FOUND = "404";
export const NOT_UNIQUE = "409";
export const SERVER_ERROR = "500";

// ***** Tag Names *****

export const REQUIRE_ADMIN = "requireAdmin";
export const REQUIRE_REGULAR = "requireRegular";
export const REQUIRE_SUPERUSER = "requireSuperuser";
