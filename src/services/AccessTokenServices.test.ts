// AccessTokenServices.test --------------------------------------------------

// Functional tests for AccessTokenServices.

// External Modules ----------------------------------------------------------

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

    describe("exact()", () => {

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

})
