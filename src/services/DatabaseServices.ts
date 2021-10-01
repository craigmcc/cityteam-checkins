// DatabaseServices ----------------------------------------------------------

// Database administration services.

// External Modules ----------------------------------------------------------

const {execSync} = require("child_process");
const fs = require("fs");
const path = require("path");

// Internal Modules ----------------------------------------------------------

import {nowDateTime} from "../util/Timestamps";

// Public Objects ------------------------------------------------------------

const BACKUP_DIRECTORY = "backup";
const DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : "checkinsish";

class DatabaseServices {

    // Public Methods --------------------------------------------------------

    public async backup(): Promise<object> {

        if (!fs.existsSync(BACKUP_DIRECTORY)) {
            fs.mkdirSync(BACKUP_DIRECTORY);
        }
        const FILENAME = `${this.databaseName()}-${nowDateTime()}.sql`;
        const PATHNAME = path.resolve(BACKUP_DIRECTORY, FILENAME);
        const COMMAND = `pg_dump ${DATABASE_URL} > ${PATHNAME}`;

        let output = "";
        try {
            output = execSync(COMMAND).toString();
            return {
                context: "DatabaseServices.backup",
                msg: "Successful database backup",
                pathname: PATHNAME,
                output: output,
            }
        } catch (error) {
            return {
                context: "DatabaseServices.backup",
                msg: "Error performing database backup",
                pathname: PATHNAME,
                output: output,
                error: error
            }
        }

    }

    // Private Methods -------------------------------------------------------

    private databaseName = (): string => {
        const splits = DATABASE_URL.split("/");
        return splits[splits.length - 1];
    }

    private leftPad = (input: string | number, size: number): string => {
        let output = String(input);
        while (output.length < size) {
            output = "0" + output;
        }
        return output;
    }

    private timestamp = () => {
        const date = new Date();
        return date.getFullYear()
            + this.leftPad(date.getMonth() + 1, 2)
            + this.leftPad(date.getDate(), 2)
            + "-"
            + this.leftPad(date.getHours(), 2)
            + this.leftPad(date.getMinutes(), 2)
            + this.leftPad(date.getSeconds(), 2);

    }

}

export default new DatabaseServices();
