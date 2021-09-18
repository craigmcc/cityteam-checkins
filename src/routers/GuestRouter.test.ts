// GuestRouter.test ----------------------------------------------------------

// Functional Tests for GuestRouter.

// External Modules ----------------------------------------------------------

const chai = require("chai");
const expect = chai.expect;
import chaiHttp = require("chai-http");
chai.use(chaiHttp);

// Internal Modules ----------------------------------------------------------

import app from "./ExpressApplication";
import {
    BAD_REQUEST, FORBIDDEN, NOT_FOUND,
    NOT_UNIQUE, OK, SERVER_ERROR
} from "../util/HttpErrors";
import * as SeedData from "../util/SeedData";
import {authorization, AUTHORIZATION, loadTestData, lookupFacility, lookupUser} from "../util/TestUtils";

// Test Specifications -------------------------------------------------------

describe("GuestRouter Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await loadTestData({
            withFacilities: true,
            withGuests: true,
            withUsers: true,
        });
    })

    // Test Methods ----------------------------------------------------------

    describe("GuestRouter GET /api/guests/:facilityId", () => {

        const PATH = "/api/guests/:facilityId";

        it("should fail for other facility regular", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":facilityId", "" + facility.id))
                .set(AUTHORIZATION, await authorization(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it.skip("should pass for current Facility admin", async () => {
            // TODO - should pass for current Facility admin (admin should inherit regular)
        })

        it("should pass for current Facility regular", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_FIRST);

            const response = await chai.request(app)
                .get(PATH.replace(":facilityId", "" + facility.id))
                .set(AUTHORIZATION, await authorization(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.length).to.be.greaterThan(0);

        })

        it.skip("should pass for superuser", async () => {
            // TODO - should pass for current Facility admin (admin should inherit regular)
        })

    })



})
