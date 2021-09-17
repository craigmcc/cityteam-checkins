// OpenApiRouter.test --------------------------------------------------------

// Functional Tests for OpenApiRouter

// External Modules ----------------------------------------------------------

const chai = require("chai");
const expect = chai.expect;
import chaiHttp = require("chai-http");
chai.use(chaiHttp);

// Internal Modules ----------------------------------------------------------

import app from "./ExpressApplication";
import {OK} from "../util/HttpErrors";

// Test Specifications -------------------------------------------------------

describe("OpenApiRouter Functional Tests", () => {

    // Test Methods ----------------------------------------------------------

    describe("OpenApiRouter GET /openapi.json", () => {

        it("should pass", async () => {

            const response = await chai.request(app)
                .get("/openapi.json");
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.openapi).to.include("3.0");

        })

    })


})
