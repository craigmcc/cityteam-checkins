// ApiRouter -----------------------------------------------------------------

// Consolidation of Routers for REST APIs for application models.

// External Modules ----------------------------------------------------------

import {Router} from "express";

// Internal Modules ----------------------------------------------------------

import CheckinRouter from "../routers/CheckinRouter";
import FacilityRouter from "../routers/FacilityRouter";
import GuestRouter from "../routers/GuestRouter";
import LogRouter from "../routers/LogRouter";
import TemplateRouter from "../routers/TemplateRouter";
import UserRouter from "../routers/UserRouter";

// Public Objects ------------------------------------------------------------

const ApiRouter = Router({
    strict: true,
});

ApiRouter.use("/checkins", CheckinRouter);
ApiRouter.use("/facilities", FacilityRouter);
ApiRouter.use("/guests", GuestRouter);
ApiRouter.use("/logs", LogRouter);
ApiRouter.use("/templates", TemplateRouter);
ApiRouter.use("/users", UserRouter);

export default ApiRouter;
