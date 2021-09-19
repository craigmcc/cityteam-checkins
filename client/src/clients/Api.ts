// Api -----------------------------------------------------------------------

// Basic infrastructure for Axios interactions with the API routes of the
// application server, rooted at "/api".

// External Modules ----------------------------------------------------------

import axios, {AxiosInstance} from "axios";

// Internal Modules ----------------------------------------------------------

const CURRENT_ACCESS_TOKEN: string | null = null; // TODO - Import from somewhere

// Public Objects ------------------------------------------------------------

const Api: AxiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

Api.interceptors.request.use(function (config) {
    if (CURRENT_ACCESS_TOKEN) {
        config.headers["Authorization"] = `Bearer ${CURRENT_ACCESS_TOKEN}`;
    }
    return config;
})

export default Api;
