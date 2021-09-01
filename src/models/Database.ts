// Database ------------------------------------------------------------------

// Database integration and configured Sequelize object.

// External Modules ----------------------------------------------------------

const customEnv = require("custom-env");
customEnv.env(true);
import {Sequelize} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AccessToken from "./AccessToken";
import RefreshToken from "./RefreshToken";
import User from "./User";

// Configure Database Instance ----------------------------------------------

const DATABASE_URL: string = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : "undefined";

export const Database = DATABASE_URL
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
;

Database.addModels([
    AccessToken,
    RefreshToken,
    User,
]);

export default Database;
