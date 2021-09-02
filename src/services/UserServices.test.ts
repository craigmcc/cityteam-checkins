// UserServices.test ---------------------------------------------------------

// Functional tests for UserServices.

// External Modules ----------------------------------------------------------

const chai = require("chai");
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import UserServices from "./UserServices";
import User from "../models/User";
import {NotFound} from "../util/HttpErrors";
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

        it("should pass on active AccessTokens", async () => {
            const NOW = new Date().getTime();
            try {
                const user = await lookupUser(SeedData.USERNAME_SUPERUSER);
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

        it("should pass on all AccessTokens", async () => {
            try {
                const user = await lookupUser(SeedData.USERNAME_SUPERUSER);
                const results = await UserServices.accessTokens(user.id);
                expect(results.length).to.equal(SeedData.ACCESS_TOKENS_SUPERUSER.length);
                results.forEach(result => {
                    expect(result.userId).to.equal(user.id);
                });
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

        it("should pass on paginated AccessTokens", async () => {
            const LIMIT = 1;
            const OFFSET = 1;
            try {
                const user = await lookupUser(SeedData.USERNAME_SUPERUSER);
                const accessTokens = await UserServices.accessTokens(user.id);
                const paginateds = await UserServices.accessTokens(user.id, {
                    limit: LIMIT,
                    offset: OFFSET,
                });
                expect(paginateds.length).to.equal(LIMIT);
                paginateds.forEach((paginated, index) => {
                    expect(paginated.id).to.equal(accessTokens[index + OFFSET].id);
                    expect(paginated.userId).to.equal(user.id);
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

        it("should pass on included children", async () => {
            try {
                const users = await UserServices.all({
                    withAccessTokens: "",
                    withRefreshTokens: "",
                });
                users.forEach(user => {
                    expect(user.accessTokens).to.exist;
                    if (user.username === SeedData.USERNAME_SUPERUSER) {
                        expect(user.accessTokens.length).to.equal(SeedData.ACCESS_TOKENS_SUPERUSER.length);
                    } else {
                        expect(user.accessTokens.length).to.equal(0);
                    }
                    expect(user.refreshTokens).to.exist;
                    if (user.username === SeedData.USERNAME_SUPERUSER) {
                        expect(user.refreshTokens.length).to.equal(SeedData.REFRESH_TOKENS_SUPERUSER.length);
                    } else {
                        expect(user.refreshTokens.length).to.equal(0);
                    }
                })
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

        it("should pass on paginated Users", async () => {
            const LIMIT = 3;
            const OFFSET = 1;
            try {
                const users = await UserServices.all();
                expect(users.length).to.equal(SeedData.USERS.length);
                const paginateds = await UserServices.all({
                    limit: LIMIT,
                    offset: OFFSET,
                });
                expect(paginateds.length).equals(LIMIT);
                paginateds.forEach((paginated, index) => {
                    expect(paginated.id).to.equal(users[index + OFFSET].id);
                });
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

    describe("exact()", () => {

        it("should fail on invalid username", async () => {
            const INVALID_USERNAME = "abra cadabra";
            try {
                await UserServices.exact(INVALID_USERNAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect((error as Error).message).to.include
                    (`username: Missing User '${INVALID_USERNAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        })

        it("should pass on included children", async () => {
            try {
                const originals = await UserServices.all({
                    withAccessTokens: "",
                    withRefreshTokens: "",
                });
                originals.forEach(async original => {
                    const user = await UserServices.exact(original.username);
                    expect(user.accessTokens).to.exist;
                    if (user.username === SeedData.USERNAME_SUPERUSER) {
                        expect(user.accessTokens.length).to.equal(SeedData.ACCESS_TOKENS_SUPERUSER.length);
                    } else {
                        expect(user.accessTokens.length).to.equal(0);
                    }
                    expect(user.refreshTokens).to.exist;
                    if (user.username === SeedData.USERNAME_SUPERUSER) {
                        expect(user.refreshTokens.length).to.equal(SeedData.REFRESH_TOKENS_SUPERUSER.length);
                    } else {
                        expect(user.refreshTokens.length).to.equal(0);
                    }
                })
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

        it("should pass on valid usernames", async () => {
            try {
                const users = await UserServices.all();
                users.forEach(async (user) => {
                    const found = await UserServices.exact(user.username);
                    expect(found.id).to.equal(user.id);
                })
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

    })

    describe("find()", () => {

        it("should fail on invalid ID", async () => {
            const INVALID_ID = -1;
            try {
                await UserServices.find(-1);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect((error as Error).message).to.include
                        (`userId: Missing User ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }
        })

        it("should pass on included children", async () => {
            try {
                const originals = await UserServices.all({
                    withAccessTokens: "",
                    withRefreshTokens: "",
                });
                originals.forEach(async original => {
                    const user = await UserServices.find(original.id);
                    expect(user.accessTokens).to.exist;
                    if (user.username === SeedData.USERNAME_SUPERUSER) {
                        expect(user.accessTokens.length).to.equal(SeedData.ACCESS_TOKENS_SUPERUSER.length);
                    } else {
                        expect(user.accessTokens.length).to.equal(0);
                    }
                    expect(user.refreshTokens).to.exist;
                    if (user.username === SeedData.USERNAME_SUPERUSER) {
                        expect(user.refreshTokens.length).to.equal(SeedData.REFRESH_TOKENS_SUPERUSER.length);
                    } else {
                        expect(user.refreshTokens.length).to.equal(0);
                    }
                })
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

        it("should pass on valid IDs", async () => {
            try {
                const users = await UserServices.all();
                users.forEach(async (user) => {
                    const found = await UserServices.find(user.id);
                    expect(found.id).to.equal(user.id);
                })
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

    })

    describe("insert()", () => {

        it("should pass on valid input data", async () => {
            const INPUT = new User({
                active: true,
                name: "Inserted User",
                password: "insertedpassword",
                scope: "superuser",
                username: "inserted",
            });
            try {

                const inserted = await UserServices.insert(INPUT);
                expect(inserted.id).to.exist;
                expect(inserted.active).to.equal(INPUT.active);
                expect(inserted.name).to.equal(INPUT.name);
                expect(inserted.password).to.equal(""); // It was redacted
                expect(inserted.scope).to.equal(INPUT.scope);
                expect(inserted.username).to.equal(INPUT.username);

                const found = await User.findByPk(inserted.id);
                expect(found).to.exist;
                // @ts-ignore
                expect(found.name).to.equal(INPUT.name);

            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

    })

    describe("refreshTokens()", () => {

        it("should pass on active RefreshTokens", async () => {
            const NOW = new Date().getTime();
            try {
                const user = await lookupUser(SeedData.USERNAME_SUPERUSER);
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

        it("should pass on all RefreshTokens", async () => {
            try {
                const user = await lookupUser(SeedData.USERNAME_SUPERUSER);
                const results = await UserServices.refreshTokens(user.id);
                expect(results.length).to.equal(SeedData.REFRESH_TOKENS_SUPERUSER.length);
                results.forEach(result => {
                    expect(result.userId).to.equal(user.id);
                });
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

        it("should pass on paginated RefreshTokens", async () => {
            const LIMIT = 1;
            const OFFSET = 1;
            try {
                const user = await lookupUser(SeedData.USERNAME_SUPERUSER);
                const refreshTokens = await UserServices.refreshTokens(user.id);
                const paginateds = await UserServices.refreshTokens(user.id, {
                    limit: LIMIT,
                    offset: OFFSET,
                });
                expect(paginateds.length).to.equal(LIMIT);
                paginateds.forEach((paginated, index) => {
                    expect(paginated.id).to.equal(refreshTokens[index + OFFSET].id);
                    expect(paginated.userId).to.equal(user.id);
                });
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }
        })

    })

})
