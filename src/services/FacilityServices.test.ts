// FacilityServices.test -----------------------------------------------------

// Functional tests for FacilityServices.

// External Modules ----------------------------------------------------------

const chai = require("chai");
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import FacilityServices from "./FacilityServices";
import {BadRequest, NotFound} from "../util/HttpErrors";
import * as SeedData from "../util/SeedData";
import {loadTestData, lookupFacility} from "../util/TestUtils";

describe("FacilityServices Functional Tests", () => {

    // Test Hooks -----------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await loadTestData();
    })

    // Test Methods --------------------------------------------------------

    describe("FacilityServices.all()", () => {

        it("should pass on active users", async () => {

            const OUTPUTS = await FacilityServices.all({ active: "" });
            OUTPUTS.forEach(OUTPUT => {
                if (!OUTPUT.active) {
                    expect.fail(`Facility '${OUTPUT.name}' was not active, should have been skipped`);
                }
            })

        })

        it("should pass on all users", async () => {

            const OUTPUTS = await FacilityServices.all();
            expect(OUTPUTS.length).equals(SeedData.FACILITIES.length);

        })

        it("should pass on included children", async () => {

            const OUTPUTS = await FacilityServices.all({
                withCheckins: "",
                withGuests: "",
                withTemplates: "",
            });
            OUTPUTS.forEach(OUTPUT => {
                // TODO - check contents of each child list
            })

        })

        it("should pass on paginated Facilities", async () => {

            const LIMIT = 2;
            const OFFSET = 1;
            const INPUTS = await FacilityServices.all();

            const OUTPUTS = await FacilityServices.all({
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.equal(LIMIT);
            OUTPUTS.forEach((OUTPUT, index) => {
                expect(OUTPUT.id).to.equal(INPUTS[index + OFFSET].id);
            });

        })

        it("should pass on name matched Facilities", async () => {

            const PATTERN = "ACIL";

            const OUTPUTS = await FacilityServices.all({ name: PATTERN });
            expect(OUTPUTS.length).to.be.greaterThan(0);
            OUTPUTS.forEach(OUTPUT => {
                expect(OUTPUT.name).to.include(PATTERN.toLowerCase());
            });

        })

    })

    // TODO - FacilityServices.checkins()

    describe("FacilityServices.exact()", () => {

        it("should fail on invalid name", async () => {

            const INVALID_NAME = "abra cadabra";

            try {
                await FacilityServices.exact(INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                        (`name: Missing Facility '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on included children", async () => {

            const OUTPUTS = await FacilityServices.all({
                withCheckins: "",
                withGuests: "",
                withTemplates: "",
            });
            OUTPUTS.forEach(async OUTPUT => {
                // TODO - check each OUTPUT for appropriate children
            });

        })

        it("should pass on valid names", async () => {

            const INPUTS = await FacilityServices.all();

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await FacilityServices.exact(INPUT.name);
                expect(OUTPUT.id).to.equal(INPUT.id);
            })

        })

    })

    describe("FacilityServices.find()", () => {

        it("should fail on invalid ID", async () => {

            const INVALID_ID = -1;

            try {
                await FacilityServices.find(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`facilityId: Missing Facility ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on included children", async () => {

            const INPUTS = await FacilityServices.all({
                withCheckins: "",
                withGuests: "",
                withTemplates: "",
            });

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await FacilityServices.find(INPUT.id);
                // TODO - check each OUTPUT for appropriate children
            })

        })

        it("should pass on valid IDs", async () => {

            const INPUTS = await FacilityServices.all();

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await FacilityServices.find(INPUT.id);
                expect(OUTPUT.id).to.equal(INPUT.id);
                expect(OUTPUT.active).to.equal(INPUT.active);
                expect(OUTPUT.address1).to.equal(INPUT.address1);
                expect(OUTPUT.address2).to.equal(INPUT.address2);
                expect(OUTPUT.city).to.equal(INPUT.city);
                expect(OUTPUT.email).to.equal(INPUT.email);
                expect(OUTPUT.name).to.equal(INPUT.name);
                expect(OUTPUT.phone).to.equal(INPUT.phone);
                expect(OUTPUT.scope).to.equal(INPUT.scope);
                expect(OUTPUT.state).to.equal(INPUT.state);
                expect(OUTPUT.zipCode).to.equal(INPUT.zipCode);
            })

        })

    })

    // TODO - FacilityServices.guests()

    describe("FacilityServices.insert()", () => {

        it("should fail on duplicate name", async () => {

            const INPUTS = await FacilityServices.all();
            const INPUT = {
                name: INPUTS[0].name,
                scope: "newscope",
            }

            try {
                await FacilityServices.insert(INPUT);
                expect.fail(`Should have thrown BadRequest`);
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("is already in use");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should fail on duplicate scope", async () => {

            const INPUTS = await FacilityServices.all();
            const INPUT = {
                name: "New Name",
                scope: INPUTS[0].scope,
            }

            try {
                await FacilityServices.insert(INPUT);
                expect.fail(`Should have thrown BadRequest`);
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("is already in use");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should fail on invalid input data", async () => {

            const INPUT = {};

            try {
                await FacilityServices.insert(INPUT);
                expect.fail(`Should have thrown BadRequest`);
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("Is required");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on valid input data", async () => {

            const INPUT = {
                active: false,
                city: "Shangri",
                name: "Shangri La",
                scope: "sla",
                state: "LA",
            }

            const OUTPUT = await FacilityServices.insert(INPUT);
            expect(OUTPUT.id).to.exist;
            expect(OUTPUT.active).to.equal(INPUT.active);
            expect(OUTPUT.address1).to.be.null;
            expect(OUTPUT.address2).to.be.null;
            expect(OUTPUT.city).to.equal(INPUT.city);
            expect(OUTPUT.name).to.equal(INPUT.name);
            expect(OUTPUT.scope).to.equal(INPUT.scope);
            expect(OUTPUT.state).to.equal(INPUT.state);
            expect(OUTPUT.zipCode).to.be.null;

        })

    })

    describe("FacilityServices.remove()", () => {

        it("should fail on invalid ID", async () => {

            const INVALID_ID = -1;

            try {
                await FacilityServices.remove(INVALID_ID);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`facilityId: Missing Facility ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on valid input", async () => {

            const INPUT = await lookupFacility(SeedData.NAME_FACILITY_SECOND);
            const OUTPUT = await FacilityServices.remove(INPUT.id);
            expect(OUTPUT.id).to.equal(INPUT.id);

            try {
                await FacilityServices.remove(INPUT.id);
                expect.fail(`Should have thrown NotFound after remove`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`facilityId: Missing Facility ${INPUT.id}`);
                }
            }

        })

    })

    // TODO - FacilityServices.templates()

    describe("FacilityServices.update()", async () => {

        it("should fail on duplicate name", async () => {

            const ORIGINAL = await lookupFacility(SeedData.NAME_FACILITY_FIRST);
            const INPUT = {
                name: SeedData.NAME_FACILITY_SECOND,
            }

            try {
                await FacilityServices.update(ORIGINAL.id, INPUT);
                expect.fail(`Should have thrown BadRequest`);
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include(`name: Name '${INPUT.name}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should fail on duplicate scope", async () => {

            const INPUTS = await FacilityServices.all();
            const INPUT = {
                id: INPUTS[1].id,
                name: INPUTS[1].name,
                scope: INPUTS[0].scope,
            }

            try {
                await FacilityServices.update(INPUT.id, INPUT);
                expect.fail(`Should have thrown BadRequest`);
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include(`scope: Scope '${INPUT.scope}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should fail on invalid ID", async () => {

            const INVALID_ID = -1;
            const ORIGINAL = await lookupFacility(SeedData.NAME_FACILITY_FIRST);
            const INPUT = {
                name: ORIGINAL.name + " UPDATED",
                scope: ORIGINAL.scope + " UPDATED",
            }

            try {
                await FacilityServices.update(INVALID_ID, INPUT);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`facilityId: Missing Facility ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on valid update data", async () => {

            const ORIGINAL = await lookupFacility(SeedData.NAME_FACILITY_SECOND);
            const INPUT = {
                active: !ORIGINAL.active,
                name: ORIGINAL.name,
                scope: ORIGINAL.scope + "updated",
            }

            const OUTPUT = await FacilityServices.update(ORIGINAL.id, INPUT);
            expect(OUTPUT.active).to.equal(INPUT.active);
            expect(OUTPUT.address1).to.equal(ORIGINAL.address1);
            expect(OUTPUT.address2).to.equal(ORIGINAL.address2);
            expect(OUTPUT.city).to.equal(ORIGINAL.city);
            expect(OUTPUT.email).to.equal(ORIGINAL.email);
            expect(OUTPUT.name).to.equal(INPUT.name);
            expect(OUTPUT.phone).to.equal(ORIGINAL.phone);
            expect(OUTPUT.scope).to.equal(INPUT.scope);
            expect(OUTPUT.state).to.equal(ORIGINAL.state);
            expect(OUTPUT.zipCode).to.equal(ORIGINAL.zipCode);

            const UPDATED = await FacilityServices.find(ORIGINAL.id);
            expect(UPDATED.active).to.equal(OUTPUT.active);
            expect(UPDATED.address1).to.equal(OUTPUT.address1);
            expect(UPDATED.address2).to.equal(OUTPUT.address2);
            expect(UPDATED.city).to.equal(OUTPUT.city);
            expect(UPDATED.email).to.equal(OUTPUT.email);
            expect(UPDATED.name).to.equal(OUTPUT.name);
            expect(UPDATED.phone).to.equal(OUTPUT.phone);
            expect(UPDATED.scope).to.equal(OUTPUT.scope);
            expect(UPDATED.state).to.equal(OUTPUT.state);
            expect(UPDATED.zipCode).to.equal(OUTPUT.zipCode);

        })

    })

})