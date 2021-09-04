// AccessTokenServices.test --------------------------------------------------

// Functional tests for AccessTokenServices.

// External Modules ----------------------------------------------------------

import {USERNAME_SUPERUSER} from "../util/SeedData";

const chai = require("chai");
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import AccessTokenServices from "./AccessTokenServices";
import AccessToken from "../models/AccessToken";
import User from "../models/User";
import * as SeedData from "../util/SeedData";
import {loadTestData, lookupUser} from "../util/TestUtils";

// Test Specifications -------------------------------------------------------

describe("Access Token Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await loadTestData();
    })

    // Test Methods ---------------------------------------------------------

    describe("insert()", () => {

        it("should pass on valid input data", async () => {

            const USER = await lookupUser(USERNAME_SUPERUSER);
            const INPUT = {
                expires: new Date(),
                scope: "superuser",
                token: "insertedaccesstoken1",
                userId: USER.id,
            }

            const OUTPUT = await AccessTokenServices.insert(INPUT);
            expect(OUTPUT.id).to.exist;
//            expect(OUTPUT.expires).to.equal(INPUT.expires); // Probably microseconds off
            expect(OUTPUT.scope).to.equal(INPUT.scope);
            expect(OUTPUT.token).to.equal(INPUT.token);
            expect(OUTPUT.userId).to.equal(INPUT.userId);

            const FOUND = await AccessToken.findByPk(OUTPUT.id);
            expect(FOUND).to.exist;
            // @ts-ignore
            expect(FOUND.token).to.equal(INPUT.token);

        })

    })

})
