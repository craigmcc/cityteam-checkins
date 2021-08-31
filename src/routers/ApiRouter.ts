// ApiRouter -----------------------------------------------------------------

// Consolication of Routers for REST APIs for application models.

// External Modules ----------------------------------------------------------

import {Router} from "express";

// Internal Modules ----------------------------------------------------------

import UserRouter from "../routers/UserRouter";

// Public Objects ------------------------------------------------------------

const ApiRouter = Router({
    strict: true,
});

ApiRouter.use("/users", UserRouter);

export default ApiRouter;
