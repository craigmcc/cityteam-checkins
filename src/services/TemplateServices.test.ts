// TemplateServices.test -----------------------------------------------------

// Functional tests for TemplateServices.

// External Modules ----------------------------------------------------------

import Facility from "../models/Facility";

const chai = require("chai");
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import TemplateServices from "./TemplateServices";
import {BadRequest, NotFound} from "../util/HttpErrors";
import * as SeedData from "../util/SeedData";
import {loadTestData, lookupFacility} from "../../dist/util/TestUtils";
import Template from "../models/Template";

// Test Specifications -------------------------------------------------------

describe("TemplateServices Functional Tests", () => {

    // Test Hooks -----------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await loadTestData();
    })

    // Test Methods --------------------------------------------------------

    describe("TemplateServices.all()", () => {

        it("should pass on active Templates", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_FIRST);

            const OUTPUTS = await TemplateServices.all(
                facility.id,
                {active: ""}
            );
            expect(OUTPUTS.length).to.be.greaterThan(0);
            OUTPUTS.forEach(OUTPUT => {
                expect(OUTPUT.facilityId).to.equal(facility.id);
                expect(OUTPUT.active).to.equal(true);
            })

        })

        it("should pass on all Templates", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_SECOND);

            const OUTPUTS = await TemplateServices.all(facility.id);
            expect(OUTPUTS.length).to.be.greaterThan(0);
            OUTPUTS.forEach(OUTPUT => {
                expect(OUTPUT.facilityId).to.equal(facility.id);
            })

        })

        it("should pass on included parent", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_SECOND);

            const OUTPUTS = await TemplateServices.all(facility.id, {
                withFacility: "",
            });
            OUTPUTS.forEach(OUTPUT => {
                expect(OUTPUT.facility).to.exist;
                expect(OUTPUT.facility.id).to.equal(facility.id);
            })

        })

        it("should pass on named Templates", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const PATTERN = "Ir";  // Should match First and Third

            const OUTPUTS = await TemplateServices.all(facility.id, {
                name: PATTERN,
            });
            expect(OUTPUTS.length).to.be.greaterThan(0);
            OUTPUTS.forEach(OUTPUT => {
                expect(OUTPUT.facilityId).to.equal(facility.id);
                expect(OUTPUT.name.toLowerCase()).to.include(PATTERN.toLowerCase());
            })

        })

        it("should pass for paginated Templates", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const LIMIT = 1;
            const OFFSET = 1;

            const OUTPUTS = await TemplateServices.all(facility.id, {
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.equal(LIMIT);

        })

    })

    describe("TemplateServices.exact()", () => {

        it("should fail on invalid name", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const INVALID_NAME = "abra cadabra";

            try {
                await TemplateServices.exact(facility.id, INVALID_NAME);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`name: Missing Template '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on included parent", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const INPUTS = await TemplateServices.all(facility.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await TemplateServices.exact(facility.id, INPUT.name, {
                    withFacility: ""
                });
                expect(OUTPUT.facility).to.exist;
                expect(OUTPUT.facility.id).to.equal(facility.id);
            })

        })

        it("should pass on valid names", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const INPUTS = await TemplateServices.all(facility.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await TemplateServices.exact(facility.id, INPUT.name);
                compareTemplate(OUTPUT, INPUT);
                expect(OUTPUT.facilityId).to.equal(INPUT.facilityId);
            })

        })

    })

    describe("TemplateServices.find()", () => {

        it("should fail on invalid ID", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const INVALID_ID = -1;

            try {
                await TemplateServices.find(facility.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect((error as Error).message).to.include
                    (`templateId: Missing Template ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on included parent", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const INPUTS = await TemplateServices.all(facility.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await TemplateServices.find(facility.id, INPUT.id, {
                    withFacility: ""
                });
                expect(OUTPUT.facility).to.exist;
                expect(OUTPUT.facility.id).to.equal(facility.id);
            })

        })

        it("should pass on valid IDs", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const INPUTS = await TemplateServices.all(facility.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await TemplateServices.find(facility.id, INPUT.id);
                compareTemplate(OUTPUT, INPUT);
            })

        })

    })


    // TODO - TemplateServices.insert()

    // TODO - TemplateServices.remove()

    // TODO - TemplateServices.update()

})

// Helper Objects ------------------------------------------------------------

export function compareTemplate(OUTPUT: Template, INPUT: Template) {
    expect(OUTPUT.id).to.equal(INPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active);
    expect(OUTPUT.allMats).to.equal(INPUT.allMats);
    expect(OUTPUT.comments).to.equal(INPUT.comments);
    expect(OUTPUT.facilityId).to.equal(INPUT.facilityId);
    expect(OUTPUT.handicapMats).to.equal(INPUT.handicapMats);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.socketMats).to.equal(INPUT.socketMats);
    expect(OUTPUT.workMats).to.equal(INPUT.workMats);
}

