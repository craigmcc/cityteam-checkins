// UserServices.test ---------------------------------------------------------

// Functional tests for UserServices.

// External Modules ----------------------------------------------------------

const chai = require("chai");
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import UserServices from "./UserServices";
import User from "../models/User";
import * as SeedData from "../util/SeedData";
import {loadTestData, lookupUser} from "../util/TestUtils";

// Test Specifications ------------------------------------------------------

describe("UserServices Functional Tests", () => {

    // Test Hooks -----------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await loadTestData();
    })

    // Test Methods --------------------------------------------------------

    describe("accessTokens()", () => {

        it("should pass on active AccessTokens for specified user", async () => {
            const NOW = new Date().getTime();
            try {
                const user = await lookupUser(SeedData.USERNAME_SUPERUSER);
                // @ts-ignore
                const results = await UserServices.accessTokens(user.id, {
                    active: "",
                });
                results.forEach(result => {
                    expect(result.expires.getTime()).to.be.greaterThanOrEqual(NOW);
                    expect(result.userId).to.equal(user.id);
                });
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

        it("should pass on all AccessTokens for specified user", async () => {
            try {
                const user = await lookupUser(SeedData.USERNAME_SUPERUSER);
                // @ts-ignore
                const results = await UserServices.accessTokens(user.id);
                results.forEach(result => {
                    expect(result.userId).to.equal(user.id);
                });
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

    })

    describe("all()", () => {

        it("should pass on active Users", async () => {
            try {
                const results: User[] = await UserServices.all({ active: "" });
                results.forEach(result => {
                    if (!result.active) {
                        expect.fail(`User '${result.username}' was not active, should have been skipped`);
                    }
                })
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

        it("should pass on all Users", async () => {
            try {
                const results = await UserServices.all();
                expect(results.length).equals(SeedData.USERS.length);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

        it("should pass on username matched Users", async () => {
            const PATTERN = "irst";
            try {
                const results = await UserServices.all({
                    username: PATTERN,
                });
                results.forEach(result => {
                    expect(result.username).to.include(PATTERN);
                })
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

    })

    describe("refreshTokens()", () => {

        it("should pass on active RefreshTokens for specified user", async () => {
            const NOW = new Date().getTime();
            try {
                const user = await lookupUser(SeedData.USERNAME_SUPERUSER);
                // @ts-ignore
                const results = await UserServices.refreshTokens(user.id, {
                    active: "",
                });
                results.forEach(result => {
                    expect(result.expires.getTime()).to.be.greaterThanOrEqual(NOW);
                    expect(result.userId).to.equal(user.id);
                });
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

        it("should pass on all RefreshTokens for specified user", async () => {
            try {
                const user = await lookupUser(SeedData.USERNAME_SUPERUSER);
                // @ts-ignore
                const results = await UserServices.refreshTokens(user.id);
                results.forEach(result => {
                    expect(result.userId).to.equal(user.id);
                });
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

    })

})
