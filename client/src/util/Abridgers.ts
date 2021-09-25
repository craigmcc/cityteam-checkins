// Abridgers -----------------------------------------------------------------

// Return abridged versions of model objects for use in log events.

// Internal Modules ----------------------------------------------------------

import Checkin from "../models/Checkin";
import Facility from "../models/Facility";
import Guest from "../models/Guest";
import Model from "../models/Model";
import Template from "../models/Template";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const ANY = (model: Model): object => {
    if (model instanceof Checkin) {
        return CHECKIN(model);
    } else if (model instanceof Facility) {
        return FACILITY(model);
    } else if (model instanceof Guest) {
        return GUEST(model);
    } else if (model instanceof Template) {
        return TEMPLATE(model);
    } else if (model instanceof User) {
        return USER(model);
    } else {
        return model;
    }
}

export const CHECKIN = (checkin: Checkin): object => {
    return {
        id: checkin.id,
        checkinDate: checkin.checkinDate,
        facilityId: checkin.facilityId,
        guestId: checkin.guestId,
        matNumber: checkin.matNumber,
    };
}

export const CHECKINS = (checkins: Checkin[]): object[] => {
    const results: object[] = [];
    checkins.forEach(checkin => {
        results.push(CHECKIN(checkin));
    });
    return results;
}

export const FACILITIES = (facilities: Facility[]): object[] => {
    const results: object[] = [];
    facilities.forEach(facility => {
        results.push(FACILITY(facility));
    });
    return results;
}

export const FACILITY = (facility: Facility): object => {
    return {
        id: facility.id,
        name: facility.name,
    };
}

export const GUEST = (guest: Guest): object => {
    return {
        id: guest.id,
        facilityId: guest.facilityId,
        firstName: guest.firstName,
        lastName: guest.lastName,
    };
}

export const GUESTS = (guests: Guest[]): object[] => {
    const results: object[] = [];
    guests.forEach(guest => {
        results.push(GUEST(guest));
    });
    return results;
}

export const TEMPLATE = (template: Template): object => {
    return {
        id: template.id,
        facilityId: template.facilityId,
        name: template.name,
    };
}

export const TEMPLATES = (templates: Template[]): object[] => {
    const results: object[] = [];
    templates.forEach(template => {
        results.push(TEMPLATE(template));
    });
    return results;
}

export const USER = (user: User): object => {
    return {
        id: user.id,
        username: user.username,
    };
}

export const USERS = (users: User[]): object[] => {
    const results: object[] = [];
    users.forEach(user => {
        results.push(USER(user));
    });
    return results;
}
