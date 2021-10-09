// UserRouter ----------------------------------------------------------------

// Express endpoints for User models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {requireSuperuser} from "../oauth/OAuthMiddleware";
import UserServices from "../services/UserServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

const UserRouter = Router({
    strict: true,
});

// Superuser access required for all routes
UserRouter.use(requireSuperuser);

// Model-Specific Routes (no userId) -----------------------------------------

UserRouter.get("/exact/:username",
    async (req: Request, res: Response) => {
        res.send(await UserServices.exact(
            req.params.username,
            req.query,
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

UserRouter.get("/",
    async (req: Request, res: Response) => {
        res.send(await UserServices.all(
            req.query
        ));
    });

UserRouter.post("/",
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await UserServices.insert(
            req.body
        ));
    });

UserRouter.delete("/:userId",
    async (req: Request, res: Response) => {
        res.send(await UserServices.remove(
            parseInt(req.params.userId, 10)
        ));
    });

UserRouter.get("/:userId",
    async (req: Request, res: Response) => {
        res.send(await UserServices.find(
            parseInt(req.params.userId, 10),
            req.query
    ));
});

UserRouter.put("/:userId",
    async (req: Request, res: Response) => {
        res.send(await UserServices.update(
            parseInt(req.params.userId, 10),
            req.body
        ));
    });

// Model-Specific Routes (with userId) ---------------------------------------

UserRouter.get("/:userId/accessTokens",
    async (req: Request, res: Response) => {
        res.send(await UserServices.accessTokens(
            parseInt(req.params.userId, 10),
            req.query
        ));
    });

UserRouter.get("/:userId/refreshTokens",
    async (req: Request, res: Response) => {
        res.send(await UserServices.refreshTokens(
            parseInt(req.params.userId, 10),
            req.query
        ));
    });

export default UserRouter;
