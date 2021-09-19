// Abridgers -----------------------------------------------------------------

// Return abridged versions of model objects for use in log events.

// Internal Modules ----------------------------------------------------------

import Model from "../models/Model";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const ANY = (model: Model): Model => {
    if (model instanceof User) {
        return USER(model);
    } else {
        return model;
    }
}

export const USER = (user: User): User => {
    return new User({
        id: user.id,
        username: user.username,
    });
}

export const USERS = (users: User[]): object[] => {
    const results: object[] = [];
    users.forEach(user => {
        results.push(USER(user));
    });
    return results;
}
