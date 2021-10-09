// TemplateRouter ------------------------------------------------------------

// Express endpoints for Template models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireRegular,
} from "../oauth/OAuthMiddleware";
import TemplateServices from "../services/TemplateServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

const TemplateRouter = Router({
    strict: true,
});

// Model-Specific Routes (no templateId) -------------------------------------

TemplateRouter.get("/:facilityId/exact/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await TemplateServices.exact(
            parseInt(req.params.facilityId, 10),
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

TemplateRouter.get("/:facilityId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await TemplateServices.all(
            parseInt(req.params.facilityId, 10),
            req.query
        ));
    });

TemplateRouter.post("/:facilityId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await TemplateServices.insert(
            parseInt(req.params.facilityId, 10),
            req.body
        ));
    });

TemplateRouter.delete("/:facilityId/:templateId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await TemplateServices.remove(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.templateId, 10)
        ));
    });

TemplateRouter.get("/:facilityId/:templateId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await TemplateServices.find(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.templateId, 10),
            req.query
        ));
    });

TemplateRouter.put("/:facilityId/:templateId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await TemplateServices.update(
            parseInt(req.params.facilityId, 10),
            parseInt(req.params.templateId, 10),
            req.body
        ));
    });

export default TemplateRouter;
