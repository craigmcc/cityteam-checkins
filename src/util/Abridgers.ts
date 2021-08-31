// Abridgers -----------------------------------------------------------------

// Return abridged versions of model objects for use in log events.

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const ACCESS_TOKEN  = (accessToken: AccessToken): object => {
    return {
        id: accessToken.id,
        userId: accessToken.userId,
        token: accessToken.token,
    }
}

export const ANY = (model: AccessToken | RefreshToken | User): object => {
    if (model instanceof AccessToken) {
        return ACCESS_TOKEN(model);
    } else if (model instanceof RefreshToken) {
        return REFRESH_TOKEN(model);
    } else if (model instanceof User) {
        return USER(model);
    } else {
        return {
            model: typeof model,
        }
    }
}

export const REFRESH_TOKEN  = (refreshToken: RefreshToken): object => {
    return {
        id: refreshToken.id,
        userId: refreshToken.userId,
        token: refreshToken.token,
    }
}

export const USER = (user: User): object => {
    return {
        id: user.id,
        username: user.username,
        scope: user.scope,
    }
}

