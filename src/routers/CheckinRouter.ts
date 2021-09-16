// CheckinRouter -------------------------------------------------------------

// Express endpoints for Checkin models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireRegular, requireSuperuser,
} from "../oauth/OAuthMiddleware";
import CheckinServices from "../services/CheckinServices";

// Public Objects ------------------------------------------------------------

const CheckinRouter = Router({
    strict: true,
});

// Model-Specific Routes (no checkinId) -------------------------------------

CheckinRouter.post("/:facilityId/generate/:checkinDate/:templateId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CheckinServices.generate(
            parseInt(req.params.facilityId, 10),
            req.params.checkinDate,
            parseInt(req.params.templateId, 10)
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

CheckinRouter.get("/:facilityId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CheckinServices.all(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });

CheckinRouter.post("/:facilityId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await CheckinServices.insert(
            parseInt(req.params.facilityId, 10),
            req.body
        ));
    });

CheckinRouter.delete("/:facilityId/:checkinId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await CheckinServices.remove(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.checkinId, 10)
        ));
    });

CheckinRouter.get("/:facilityId/:checkinId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CheckinServices.find(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.checkinId, 10),
            req.query
        ));
    });

CheckinRouter.put("/:facilityId/:checkinId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CheckinServices.find(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.checkinId, 10),
            req.body
        ));
    });

export default CheckinRouter;
