// TestUtils -----------------------------------------------------------------

// Generic utility methods for tests.

// External Modules ----------------------------------------------------------

import {Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import {NotFound} from "./HttpErrors";
import * as SeedData from "./SeedData";
import AccessToken from "../models/AccessToken";
import Database from "../models/Database";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const USER_SUPERUSER_USERNAME = "superuser";

export const lookupUser = async (username: string): Promise<User> => {
    const result = await User.findOne({
        where: { username: username }
    });
    if (result) {
        return result;
    } else {
        throw new NotFound(`username:  Should have found User for '${username}'`);
    }
}

export const loadTestData = async (): Promise<void> => {

    // Create tables (if necessary), and erase current contents
    await Database.sync({
        force: true,
    });

    // Load OAuth Related Tables (top-down order)
    await loadUsers(SeedData.USERS);
    const userSuperuser = await lookupUser(USER_SUPERUSER_USERNAME);
    await loadAccessTokens(userSuperuser, SeedData.ACCESS_TOKENS_SUPERUSER);
    await loadRefreshTokens(userSuperuser, SeedData.REFRESH_TOKENS_SUPERUSER);

}

// Private Objects -----------------------------------------------------------

const loadAccessTokens
    = async (user: User, accessTokens: Partial<AccessToken>[]): Promise<AccessToken[]> => {
    accessTokens.forEach(accessToken => {
        accessToken.userId = user.id;
    });
    let results: AccessToken[] = [];
    try {
        results = await AccessToken.bulkCreate(accessTokens);
        return results;
    } catch (error) {
        console.info(`  Reloading AccessTokens for User '${user.username}' ERROR`, error);
        throw error;
    }
}

const loadRefreshTokens
    = async (user: User, refreshTokens: Partial<RefreshToken>[]): Promise<RefreshToken[]> => {
    refreshTokens.forEach(refreshToken => {
        refreshToken.userId = user.id;
    });
    let results: RefreshToken[] = [];
    try {
        results = await RefreshToken.bulkCreate(refreshTokens);
        return results;
    } catch (error) {
        console.info(`  Reloading RefreshTokens for User '${user.username}' ERROR`, error);
        throw error;
    }
}

const loadUsers = async (users: Partial<User>[]): Promise<User[]> => {
    let results: User[] = [];
    try {
        results = await User.bulkCreate(users);
    } catch (error) {
        console.info("  Reloading Users ERROR", error);
        throw error;
    }
    return results;
}

