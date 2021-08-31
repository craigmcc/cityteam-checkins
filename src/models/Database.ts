// Database ------------------------------------------------------------------

// Database integration and configured Sequelize object.

// External Modules ----------------------------------------------------------

import {Sequelize} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AccessToken from "./AccessToken";
import RefreshToken from "./RefreshToken";
import User from "./User";

// Configure Database Instance ----------------------------------------------

const DATABASE_URL: string = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : "undefined";
const NODE_ENV = process.env.NODE_ENV;

export const Database = ((NODE_ENV !== "test")
        ? new Sequelize(DATABASE_URL, {
            logging: false,
            pool: {
                acquire: 30000,
                idle: 10000,
                max: 5,
                min: 0
            }
        })
        : new Sequelize("database", "username", "password", {
            dialect: "sqlite",
            logging: false,
            storage: "./test/database.sqlite"
        })
);

Database.addModels([
    AccessToken,
    RefreshToken,
    User,
]);

export default Database;
