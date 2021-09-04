// AsyncValidators -----------------------------------------------------------

// Custom (to this application) validation methods that can only be used by
// server side applications, because they interact directly with the database.
// In all cases, a "true" return indicates that the proposed value is valid,
// while "false" means it is not.  If a field is required, that must be
// validated separately.

// External Modules ----------------------------------------------------------

import {Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import User from "../models/User";


// Public Objects ------------------------------------------------------------

export const validateUserUsernameUnique
    = async (user: User): Promise<boolean> =>
{
    if (user) {
        let options: any = {
            where: {
                username: user.username,
            }
        }
        if (user.id && (user.id > 0)) {
            options.where.id = { [Op.ne]: user.id }
        }
        const results: User[] = await User.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

// Private Objects -----------------------------------------------------------

