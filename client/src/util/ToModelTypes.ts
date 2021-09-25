// ToModelTypes --------------------------------------------------------------

// Convert arbitrary objects or arrays to the specified Model objects.

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Facility from "../models/Facility";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";
import Template from "../models/Template";

// Public Objects ------------------------------------------------------------

export const toAccessToken = (value: object): AccessToken => {
    return new AccessToken(value);
}

export const toAccessTokens = (values: object[]): AccessToken[] => {
    const results: AccessToken[] = [];
    values.forEach(value => {
        results.push(new AccessToken(value));
    });
    return results;
}

export const toFacility = (value: object): Facility => {
    return new Facility(value);
}

export const toFacilities = (values: object[]): Facility[] => {
    const results: Facility[] = [];
    values.forEach(value => {
        results.push(new Facility(value));
    });
    return results;
}

export const toRefreshToken = (value: object): RefreshToken => {
    return new RefreshToken(value);
}

export const toRefreshTokens = (values: object[]): RefreshToken[] => {
    const results: RefreshToken[] = [];
    values.forEach(value => {
        results.push(new RefreshToken(value));
    });
    return results;
}

export const toTemplate = (value: object): Template => {
    return new Template(value);
}

export const toTemplates = (values: object[]): Template[] => {
    const results: Template[] = [];
    values.forEach(value => {
        results.push(new Template(value));
    });
    return results;
}

export const toUser = (value: object): User => {
    return new User(value);
}

export const toUsers = (values: object[]): User[] => {
    const results: User[] = [];
    values.forEach(value => {
        results.push(new User(value));
    });
    return results;
}

