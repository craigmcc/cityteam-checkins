// LogRouter -----------------------------------------------------------------

// Router for logging requests from clients.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import LogServices from "../services/LogServices";

// Public Objects ------------------------------------------------------------

export const LogRouter = Router({
    strict: true,
});

LogRouter.post("/clientLog",
    async (req: Request, res: Response) => {
        await LogServices.logClientRecord(req.body);
        res.sendStatus(204);
    })

export default LogRouter;
