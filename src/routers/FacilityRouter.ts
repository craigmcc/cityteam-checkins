// FacilityRouter ------------------------------------------------------------

// Express endpoints for Facility models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireAny,
    requireNone,
    requireRegular,
    requireSuperuser
} from "../oauth/OAuthMiddleware";
import FacilityServices from "../services/FacilityServices";

// Public Objects ------------------------------------------------------------

const FacilityRouter = Router({
    strict: true,
});

// Model-Specific Routes (no facilityId) -------------------------------------

FacilityRouter.get("/exact/:name",
    requireAny, // No facilityId is present
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.exact(
            req.params.name,
            req.query,
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

FacilityRouter.get("/",
    requireNone, // Avoid catch-22 on initial FacilityContext population
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.all(
            req.query
        ));
    });

FacilityRouter.post("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.insert(
            req.body
        ));
    });

FacilityRouter.delete("/:facilityId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.remove(
            parseInt(req.params.facilityId, 10)
        ));
    });

FacilityRouter.get("/:facilityId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.find(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });

FacilityRouter.put("/:facilityId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.update(
            parseInt(req.params.facilityId, 10),
            req.body
        ));
    });

// Model-Specific Routes (with facilityId) -----------------------------------

/*
FacilityRouter.get("/:facilityId/checkins",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.checkins(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });
*/

/*
FacilityRouter.get("/:facilityId/guests",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.guests(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });
*/

FacilityRouter.get("/:facilityId/templates",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await FacilityServices.templates(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });

export default FacilityRouter;
