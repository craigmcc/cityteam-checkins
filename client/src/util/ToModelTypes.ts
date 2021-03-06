// ToModelTypes --------------------------------------------------------------

// Convert arbitrary objects or arrays to the specified Model objects.

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Assign from "../models/Assign";
import Checkin from "../models/Checkin";
import Facility from "../models/Facility";
import Guest from "../models/Guest";
import RefreshToken from "../models/RefreshToken";
import Summary from "../models/Summary";
import Template from "../models/Template";
import User from "../models/User";

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

export const toAssign = (value: object): Assign => {
    return new Assign(value);
}

export const toAssigns = (values: object[]): Assign[] => {
    const results: Assign[] = [];
    values.forEach(value => {
        results.push(new Assign(value));
    });
    return results;
}

export const toCheckin = (value: object): Checkin => {
    return new Checkin(value);
}

export const toCheckins = (values: object[]): Checkin[] => {
    const results: Checkin[] = [];
    values.forEach(value => {
        results.push(new Checkin(value));
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

export const toGuest = (value: object): Guest => {
    return new Guest(value);
}

export const toGuests = (values: object[]): Guest[] => {
    const results: Guest[] = [];
    values.forEach(value => {
        results.push(new Guest(value));
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

export const toSummary = (value: object): Summary => {
    return Summary.clone(value);
}

export const toSummaries = (values: object[]): Summary[] => {
    const results: Summary[] = [];
    values.forEach(value => {
        results.push(Summary.clone(value));
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

