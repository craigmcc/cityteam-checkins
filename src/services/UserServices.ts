// UserServices --------------------------------------------------------------

// Services implementation for User models.

// External Modules ----------------------------------------------------------

import {FindOptions, Includeable, Op, ValidationError, WhereOptions} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractServices from "./AbstractServices";
import AccessTokenServices from "./AccessTokenServices";
import RefreshTokenServices from "./RefreshTokenServices";
import AccessToken from "../models/AccessToken";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";
import {hashPassword} from "../oauth/OAuthUtils";
import {BadRequest, NotFound, ServerError} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrders";

// Public Objects ------------------------------------------------------------

class UserServices extends AbstractServices<User> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<User[]> {
        const options: FindOptions = this.appendMatchOptions({
            order: SortOrder.USERS,
        }, query);
        const results = await User.findAll(options);
        results.forEach(result => {
            result.password = "";
        });
        return results;
    }

    public async find(userId: number, query?: any): Promise<User> {
        const options: FindOptions = appendIncludeOptions({
            where: { id: userId }
        }, query);
        const results = await User.findAll(options);
        if (results.length === 1) {
            results[0].password = "";
            return results[0];
        } else {
            throw new NotFound(
                `userId: Missing User ${userId}`,
                "UserServices.find"
            );
        }
    }

    public async insert(user: User): Promise<User> {
        const newUser: Partial<User> = {
            ...user,
            password: await hashPassword(user.password),
        }
        try {
            const inserted = await User.create(newUser, {
                fields: FIELDS,
            });
            inserted.password = "";
            return inserted;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "UserServices.insert"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "UserServices.insert"
                );
            }
        }
    }

    public async remove(userId: number): Promise<User> {
        const removed = await User.findByPk(userId);
        if (!removed) {
            throw new NotFound(
                `userId: Missing User ${userId}`,
                "UserServices.remove"
            );
        }
        removed.password = "";
        await User.destroy({
            where: { id: userId }
        })
        return removed;
    }

    public async update(userId: number, user: User): Promise<User> {
        const oldUser: Partial<User> = {
            ...user,
        }
        if (oldUser.password && (oldUser.password.length > 0)) {
            oldUser.password = await hashPassword(oldUser.password);
        } else {
            delete oldUser.password;
        }
        try {
            oldUser.id = userId; // No cheating
            const result = await User.update(oldUser, {
                fields: FIELDS_WITH_ID,
                where: { id: userId }
            });
            if (result[0] < 1) {
                throw new NotFound(
                    `userId: Missing User ${userId}`,
                    "UserServices.update"
                );
            }
            return this.find(userId);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "UserServices.update"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "UserServices.update"
                );
            }
        }
    }

    // Model-Specific Methods ------------------------------------------------

    public async accessTokens(userId: number, query?: any): Promise<AccessToken[]> {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new NotFound(
                `userId: Missing User ${userId}`,
                "UserServices.accessTokens"
            );
        }
        const options: FindOptions = AccessTokenServices.appendMatchOptions({
            order: SortOrder.ACCESS_TOKENS,
            where: { userId: userId },
        }, query);
        return await user.$get("accessTokens", options);
    }

    public async exact(username: string, query?: any): Promise<User> {
        const options = appendIncludeOptions({
            where: {
                username: username,
            }
        }, query);
        const results = await User.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `token: Missing User '${username}'`,
                "UserServices.exact"
            );
        }
        return results[0];
    }

    public async refreshTokens(userId: number, query?: any): Promise<RefreshToken[]> {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new NotFound(
                `userId: Missing User ${userId}`,
                "UserServices.accessTokens"
            );
        }
        const options: FindOptions = RefreshTokenServices.appendMatchOptions({
            order: SortOrder.REFRESH_TOKENS,
            where: { userId: userId },
        }, query);
        return await user.$get("refreshTokens", options);
    }

    // Public Helpers --------------------------------------------------------

    /*
     * Supported match query parameters:
     * * active                         Select active Users
     * * username=pattern               Select usernames matching pattern
     */
    public appendMatchOptions(options: FindOptions, query?: any): FindOptions {
        options = appendIncludeOptions(options, query);
        if (!query) {
            return options;
        }
        const where: any = options.where ? options.where : {};
        if ("" === query.active) {
            where.active = true;
        }
        if (query.username) {
            where.username = {[Op.iLike]: `%${query.username}%`}
        }
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }

}

export default new UserServices();

// Private Objects -----------------------------------------------------------

const appendIncludeOptions = (options: FindOptions, query?: any): FindOptions => {
    if (!query) {
        return options;
    }
    options = appendPaginationOptions(options, query);
    const include: Includeable[] = [];
    if ("" === query.withAccessTokens) {
        include.push(AccessToken);
    }
    if ("" === query.withRefreshTokens) {
        include.push(RefreshToken);
    }
    if (include.length > 0) {
        options.include = include;
    }
    return options;
}

const FIELDS = [
    "active",
    "name",
    "password",
    "scope",
    "username",
];

const FIELDS_WITH_ID = [
    ...FIELDS,
    "id",
];

