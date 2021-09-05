// FacilityRouter ------------------------------------------------------------

// Express endpoints for Facility models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

// import {requireAdmin, requireRegular, requireSuperuser} from "../oauth/OAuthMiddleware";
import FacilityServices from "../services/FacilityServices";

// Public Objects ------------------------------------------------------------

const FacilityRouter = Router({
    strict: true,
});

// Model-Specific Routes (no facilityId) -------------------------------------

FacilityRouter.get("/exact/:name",
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.exact(
            req.params.name,
            req.query,
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

FacilityRouter.get("/",
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.all(
            req.query
        ));
    });

FacilityRouter.post("/",
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.insert(
            req.body
        ));
    });

FacilityRouter.delete("/:facilityId",
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.remove(
            parseInt(req.params.facilityId, 10)
        ));
    });

FacilityRouter.get("/:facilityId",
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.find(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });

FacilityRouter.put("/:facilityId",
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.update(
            parseInt(req.params.facilityId, 10),
            req.body
        ));
    });

// Model-Specific Routes (with facilityId) -----------------------------------

/*
FacilityRouter.get("/:facilityId/checkins",
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.checkins(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });
*/

/*
FacilityRouter.get("/:facilityId/guests",
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.guests(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });
*/

/*
FacilityRouter.get("/:facilityId/templates",
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.templates(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });
*/

export default FacilityRouter;
