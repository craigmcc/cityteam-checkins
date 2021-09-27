// AsyncValidators -----------------------------------------------------------

// Custom (to this application) validation methods that must interact with
// the server asynchronously to perform their validations.  In all cases,
// a "true" return value indicates that the proposed value is valid, while
// "false" means it is not.  If a field is required, that must be validated
// separately.

// The methods defined here should correspond (in name and parameters) to
// the similar ones in the server side AsynchValidators set, because they
// perform the same semantic functions.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import Checkin, {CHECKINS_BASE} from "../models/Checkin";
import Facility, {FACILITIES_BASE} from "../models/Facility";
import Guest, {GUESTS_BASE} from "../models/Guest";
import Template, {TEMPLATES_BASE} from "../models/Template";
import User, {USERS_BASE} from "../models/User";
import {queryParameters} from "./QueryParameters";

export const validateFacilityNameUnique = async (facility: Facility): Promise<boolean> => {
    if (facility && facility.name) {
        try {
            const result = (await Api.get(FACILITIES_BASE
                + `/exact/${facility.name}`)).data;
            return (result.id === facility.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateCheckinGuestUnique = async (checkin: Checkin): Promise<boolean> => {
    if (checkin.guestId) {
        const parameters = {
            date: checkin.checkinDate,
            guestId: checkin.guestId,
        }
        const results = (await Api.get(CHECKINS_BASE
            + `/${checkin.facilityId}${queryParameters(parameters)}`)).data;
        if (results.length === 0) {
            return true;
        } else {
            return (results[0].id === checkin.id);
        }
    } else {
        return true;
    }
}

export const validateFacilityScopeUnique = async (facility: Facility): Promise<boolean> => {
    if (facility && facility.scope) {
        try {
            const parameters = {
                scope: facility.scope,
            }
            const results = (await Api.get(FACILITIES_BASE
                + `${queryParameters(parameters)}`)).data;
            return (results.length === 0) || (results[0].id === facility.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateGuestNameUnique = async (guest: Guest): Promise<boolean> => {
    if (guest && guest.facilityId && guest.firstName && guest.lastName) {
        try {
            const result = (await Api.get(GUESTS_BASE
                + `/${guest.facilityId}/exact/${guest.firstName}/${guest.lastName}`)).data;
            return (result.id === guest.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateTemplateNameUnique = async (template: Template): Promise<boolean> => {
    if (template && template.facilityId && template.name) {
        try {
            const result = (await Api.get(TEMPLATES_BASE
                + `/${template.facilityId}/exact/${template.name}`)).data;
            return (result.id === template.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateUserUsernameUnique = async (user: User): Promise<boolean> => {
    if (user && user.username) {
        try {
            const result = (await Api.get(USERS_BASE
                + `/exact/${user.username}`)).data;
            return (result.id === user.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}
