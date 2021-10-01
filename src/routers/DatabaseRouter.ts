// Database Router -----------------------------------------------------------

// Router for database administration tasks.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import DatabaseServices from "../services/DatabaseServices";

// Public Objects ------------------------------------------------------------

const DatabaseRouter = Router({
    strict: true,
});

DatabaseRouter.post("/backup",
    async (req: Request, res: Response) => {
        res.send(await DatabaseServices.backup());
    });

export default DatabaseRouter;
