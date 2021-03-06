// QueryParameters -----------------------------------------------------------

// Utility methods for appending Sequelize options based on query parameters

// External Modules ----------------------------------------------------------

import {FindOptions} from "sequelize";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Append standard pagination query parameters (if present), and return the
 * updated options.
 */
export const appendPaginationOptions = (options: FindOptions, query: any): FindOptions => {
    if (query.limit) {
        let value = parseInt(query.limit, 10);
        if (isNaN(value)) {
            throw new Error(`limit: '${query.limit}' is not a number`);
        } else {
            options.limit = value;
        }
    }
    if (query.offset) {
        let value = parseInt(query.offset, 10);
        if (isNaN(value)) {
            throw new Error(`offset: '${query.offset}' is not a number`);
        } else {
            options.offset = value;
        }
    }
    return options;
}
