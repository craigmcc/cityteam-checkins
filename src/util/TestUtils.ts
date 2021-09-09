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
import Facility from "../models/Facility";
import Template from "../models/Template";
import {hashPassword} from "../oauth/OAuthUtils";

// Public Objects ------------------------------------------------------------

export const lookupFacility = async (name: string): Promise<Facility> => {
    const result = await Facility.findOne({
        where: { name: name }
    });
    if (result) {
        return result;
    } else {
        throw new NotFound(`name: Should have found Facility for '${name}'`);
    }
}

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
    const userSuperuser = await lookupUser(SeedData.USER_USERNAME_SUPERUSER);
    await loadAccessTokens(userSuperuser, SeedData.ACCESS_TOKENS_SUPERUSER);
    await loadRefreshTokens(userSuperuser, SeedData.REFRESH_TOKENS_SUPERUSER);

    // Load Facility Related Tables (top-down order)
    await loadFacilities(SeedData.FACILITIES);
    const facilityFirst = await lookupFacility(SeedData.FACILITY_NAME_FIRST);
    const facilitySecond = await lookupFacility(SeedData.FACILITY_NAME_SECOND);
    const facilityThird = await lookupFacility(SeedData.FACILITY_NAME_THIRD);
    await loadTemplates(facilityFirst, SeedData.TEMPLATES);
    await loadTemplates(facilitySecond, SeedData.TEMPLATES);
    await loadTemplates(facilityThird, SeedData.TEMPLATES);
    // TODO - child data

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

const loadFacilities = async (facilities: Partial<Facility>[]) => {
    let results: Facility[] = [];
    try {
        results = await Facility.bulkCreate(facilities);
    } catch (error) {
        console.info("  Reloading Facilities ERROR", error);
        throw error;
    }
    return results;
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

const loadTemplates
    = async (facility: Facility, templates: Partial<Template>[]): Promise<Template[]> =>
{
    templates.forEach(template => {
        template.facilityId = facility.id;
    })
    try {
        const results = await Template.bulkCreate(templates);
        return results;
    } catch (error) {
        console.info(`  Reloading Templates for Facility '${facility.name}' ERROR`, error);
        throw error;
    }
}

const loadUsers = async (users: Partial<User>[]): Promise<User[]> => {
    users.forEach(async user => {
        await hashPassword(user.password ? user.password : "password");
    })
    let results: User[] = [];
    try {
        results = await User.bulkCreate(users);
    } catch (error) {
        console.info("  Reloading Users ERROR", error);
        throw error;
    }
    return results;
}

