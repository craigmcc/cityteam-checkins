// ApiRouter -----------------------------------------------------------------

// Consolication of Routers for REST APIs for application models.

// External Modules ----------------------------------------------------------

import {Router} from "express";

// Internal Modules ----------------------------------------------------------

import FacilityRouter from "../routers/FacilityRouter";
import TemplateRouter from "../routers/TemplateRouter";
import UserRouter from "../routers/UserRouter";

// Public Objects ------------------------------------------------------------

const ApiRouter = Router({
    strict: true,
});

ApiRouter.use("/facilities", FacilityRouter);
ApiRouter.use("/templates", TemplateRouter);
ApiRouter.use("/users", UserRouter);

export default ApiRouter;
