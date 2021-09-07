// Database ------------------------------------------------------------------

// Database integration and configured Sequelize object.

// External Modules ----------------------------------------------------------

const customEnv = require("custom-env");
customEnv.env(true);
import {Sequelize} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AccessToken from "./AccessToken";
import Facility from "./Facility";
import RefreshToken from "./RefreshToken";
import Template from "./Template";
import User from "./User";

// Configure Database Instance ----------------------------------------------

const DATABASE_URL = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : undefined;

//console.log(`DATABASE URL ${DATABASE_URL} NODE_ENV ${process.env.NODE_ENV}`);

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
    Facility,
    RefreshToken,
    Template,
    User,
]);

export default Database;
