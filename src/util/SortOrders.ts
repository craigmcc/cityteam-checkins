// SortOrders ----------------------------------------------------------------

// Standard "order" values for each defined Model

// External Modules ----------------------------------------------------------

import {Order} from "sequelize";

// Public Objects ------------------------------------------------------------

export const ACCESS_TOKENS: Order = [
    [ "userId", "ASC" ],
    [ "token", "ASC" ],
];

export const FACILITIES: Order = [
    [ "name", "ASC" ],
]

export const REFRESH_TOKENS: Order = [
    [ "userId", "ASC" ],
    [ "token", "ASC" ],
];

export const USERS: Order = [
    [ "username", "ASC" ],
];

