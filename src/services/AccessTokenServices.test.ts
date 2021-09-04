// AccessTokenServices.test --------------------------------------------------

// Functional tests for AccessTokenServices.

// External Modules ----------------------------------------------------------

import UserServices from "./UserServices";

const chai = require("chai");
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import AccessTokenServices from "./AccessTokenServices";
import AccessToken from "../models/AccessToken";
import User from "../models/User";
import {BadRequest, NotFound} from "../util/HttpErrors";
import * as SeedData from "../util/SeedData";
import {loadTestData, lookupUser} from "../util/TestUtils";

// Test Specifications -------------------------------------------------------

describe("AccessTokenServices Functional Tests", () => {

    // Test Hooks -----------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await loadTestData();
    })

    // Test Methods --------------------------------------------------------

    describe("AccessTokenServices.all()", () => {

        it("should pass on active AccessTokens", async () => {

            const NOW = new Date();

            const OUTPUTS = await AccessTokenServices.all({ active: "" });
            OUTPUTS.forEach(OUTPUT => {
                if (OUTPUT.expires < NOW) {
                    expect.fail(`AccessToken '${OUTPUT.token}' was not active, should have been skipped`);
                }
            })

        })

        it("should pass on all AccessTokens", async () => {

            const OUTPUTS = await AccessTokenServices.all();
            expect(OUTPUTS.length).to.equal(SeedData.ACCESS_TOKENS_SUPERUSER.length);

        })

        it("should pass on included children", async () => {

            const OUTPUTS = await AccessTokenServices.all({
                withUser: "",
            });
            OUTPUTS.forEach(OUTPUT => {
                expect(OUTPUT.user).to.exist;
                expect(OUTPUT.user.id).to.equal(OUTPUT.userId);
            })

        })

        it("should pass on paginated AccessTokens", async () => {

            const LIMIT = 1;
            const OFFSET = 1;

            const OUTPUTS = await AccessTokenServices.all({
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).equals(LIMIT);

        })


    })

    describe("AccessTokenServices.exact()", () => {

        it("should fail on invalid token", async () => {

            const INVALID_TOKEN = "abra cadabra";

            try {
                await AccessTokenServices.exact(INVALID_TOKEN);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect((error as Error).message).to.include
                        (`token: Missing AccessToken '${INVALID_TOKEN}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }

            }

        })

        it("should pass on included children", async () => {

            const INPUTS = await AccessTokenServices.all();

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await AccessTokenServices.exact(INPUT.token, {
                    withUser: "",
                });
                expect(OUTPUT.user).to.exist;
                expect(OUTPUT.user.id).to.equal(INPUT.userId);
            });

        })

        it("should pass on valid tokens", async () => {

            const INPUTS = await AccessTokenServices.all();

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await AccessTokenServices.exact(INPUT.token);
                expect(OUTPUT.id).to.equal(INPUT.id);
                expect(OUTPUT.expires).to.equal(INPUT.expires);
                expect(OUTPUT.scope).to.equal(INPUT.scope);
                expect(OUTPUT.token).to.equal(INPUT.token);
                expect(OUTPUT.user).to.not.exist;
            });

        })

    })

    describe("AccessTokenServices.find()", () => {

        it("should fail on invalid ID", async () => {

            const INVALID_ID = -1;

            try {
                await AccessTokenServices.find(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect((error as Error).message).to.include
                        (`tokenId: Missing AccessToken ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on included children", async () => {

            const INPUTS = await AccessTokenServices.all();

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await AccessTokenServices.find(INPUT.id, {
                    withUser: "",
                });
                expect(OUTPUT.user).to.exist;
                expect(OUTPUT.user.id).to.equal(INPUT.userId);
            });

        })

        it("should pass on valid IDs", async () => {

            const INPUTS = await AccessTokenServices.all();

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await AccessTokenServices.find(INPUT.id);
                expect(OUTPUT.id).to.equal(INPUT.id);
                expect(OUTPUT.expires).to.equal(INPUT.expires);
                expect(OUTPUT.scope).to.equal(INPUT.scope);
                expect(OUTPUT.token).to.equal(INPUT.token);
                expect(OUTPUT.userId).to.equal(INPUT.userId);
            });

        })

    })

    // TODO - insert()

    // TODO - purge()

    // TODO - remove()

    // TODO - update()

})
