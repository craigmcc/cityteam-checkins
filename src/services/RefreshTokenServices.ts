// RefreshTokenServices ------------------------------------------------------

// Services implementation for RefreshToken models.

// External Modules ----------------------------------------------------------

import {FindOptions, Includeable, Op, ValidationError} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractServices from "./AbstractServices";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";
import {BadRequest, NotFound, ServerError} from "../util/HttpErrors";
import {appendPagination} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrders";

// Public Objects ------------------------------------------------------------

class RefreshTokenServices extends AbstractServices<RefreshToken> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<RefreshToken[]> {
        const options: FindOptions = appendQuery({
            order: SortOrder.REFRESH_TOKENS,
        }, query);
        return await RefreshToken.findAll(options);
    }

    public async find(tokenId: number, query?: any): Promise<RefreshToken> {
        const options: FindOptions = appendQuery({
            where: { id: tokenId }
        }, query);
        const results = await RefreshToken.findAll(options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `tokenId: Missing RefreshToken ${tokenId}`,
                "RefreshTokenServices.find"
            );
        }
    }

    public async insert(refreshToken: RefreshToken): Promise<RefreshToken> {
        try {
            return await RefreshToken.create(refreshToken, {
                fields: FIELDS,
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "RefreshTokenServices.insert"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "RefreshTokenServices.insert"
                );
            }
        }
    }

    public async remove(tokenId: number): Promise<RefreshToken> {
        const removed = await RefreshToken.findByPk(tokenId);
        if (!removed) {
            throw new NotFound(
                `tokenId: Missing RefreshToken ${tokenId}`,
                "RefreshTokenServices.remove"
            );
        }
        await RefreshToken.destroy({
            where: { id: tokenId }
        })
        return removed;
    }

    public async update(tokenId: number, refreshToken: RefreshToken): Promise<RefreshToken> {
        try {
            refreshToken.id = tokenId; // No cheating
            const result = await RefreshToken.update(refreshToken, {
                fields: FIELDS_WITH_ID,
                where: { id: tokenId }
            });
            if (result[0] < 1) {
                throw new NotFound(
                    `tokenId: Missing RefreshToken ${tokenId}`,
                    "RefreshTokenServices.update"
                );
            }
            return this.find(tokenId);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "RefreshTokenServices.update"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "RefreshTokenServices.update"
                );
            }
        }
    }

    // Model-Specific Methods ------------------------------------------------

    public async exact(token: string, query?: any): Promise<RefreshToken> {
        const options = appendQuery({
            where: {
                token: token,
            }
        }, query);
        const results = await RefreshToken.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `token: Missing RefreshToken '${token}'`,
                "RefreshTokenServices.exact"
            );
        }
        return results[0];
    }

    public async purge(): Promise<object> {
        const purgeBefore = new Date((new Date().getTime()) - PURGE_BEFORE_MS);
        const purgeCount = await RefreshToken.destroy({
            where: { expires: { [Op.lte]: purgeBefore }}
        });
        return {
            purgeBefore: purgeBefore.toLocaleString(),
            purgeCount: purgeCount,
        }
    }

}

export default new RefreshTokenServices();

// Private Objects -----------------------------------------------------------

const appendQuery = (options: FindOptions, query?: any): FindOptions => {
    if (!query) {
        return options;
    }
    options = appendPagination(options, query);
    const include: Includeable[] = [];
    if ("" === query.withUser) {
        include.push(User);
    }
    if (include.length > 0) {
        options.include = include;
    }
    return options;
}

const FIELDS = [
    "accessToken",
    "expires",
    "token",
    "userId",
];

const FIELDS_WITH_ID = [
    ...FIELDS,
    "id",
];

const PURGE_BEFORE_MS = 24 * 60 * 60 * 1000; // 24 hours (in milliseconds)
