// LogServices ---------------------------------------------------------------

// Service methods for logging requests from clients.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import logger from "../util/ClientLogger";

// Public Objects ------------------------------------------------------------

class LogServices {

    public async logClientRecord(record: any): Promise<void> {
        logger.info(record);
    }

}

export default new LogServices();
