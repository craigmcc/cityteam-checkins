// Sorters -------------------------------------------------------------------

// Utility functions to sort arrays of objects into the preferred order.

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Facility from "../models/Facility";
import RefreshToken from "../models/RefreshToken";
import Template from "../models/Template";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const ACCESS_TOKENS = (accessTokens: AccessToken[]): AccessToken[] => {
    return accessTokens.sort(function (a, b) {
        if (a.expires > b.expires) {
            return 1;
        } else if (a.expires < b.expires) {
            return -1;
        } else {
            return 0;
        }
    })
}

export const FACILITIES = (facilities: Facility[]): Facility[] => {
    return facilities.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const REFRESH_TOKENS = (refreshTokens: RefreshToken[]): RefreshToken[] => {
    return refreshTokens.sort(function (a, b) {
        if (a.expires > b.expires) {
            return 1;
        } else if (a.expires < b.expires) {
            return -1;
        } else {
            return 0;
        }
    })
}

export const TEMPLATES = (templates: Template[]): Template[] => {
    return templates.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const USERS = (users: User[]): User[] => {
    return users.sort(function (a, b) {
        if (a.username > b.username) {
            return 1;
        } else if (a.username < b.username) {
            return -1;
        } else {
            return 0;
        }
    });
}

