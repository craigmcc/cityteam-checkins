// LogClient -----------------------------------------------------------------

// Interact with server side logging operations.

// Internal Modules ----------------------------------------------------------

import Api from "./Api";

const LOG_BASE = "/logs";

// Public Objects ------------------------------------------------------------

class LogClient {

    // Post a log message to the server
    async log(object: any): Promise<void> {
        await Api.post(LOG_BASE + "/clientLog", object);
    }

}

export default new LogClient();
