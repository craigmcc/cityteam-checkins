// GuestServices.test --------------------------------------------------------

// Functional tests for GuestServices.

// External Modules ----------------------------------------------------------

const chai = require("chai");
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import GuestServices from "./GuestServices";
import Guest from "../models/Guest";
import {BadRequest, NotFound} from "../util/HttpErrors";
import * as SeedData from "../util/SeedData";
import {loadTestData, lookupFacility, lookupGuest} from "../util/TestUtils";

// Test Specifications -------------------------------------------------------

// Test Hooks -----------------------------------------------------------

beforeEach("#beforeEach", async () => {
    await loadTestData({
        withCheckins: true,
        withFacilities: true,
        withGuests: true,
    });
})

// Test Methods --------------------------------------------------------

describe("GuestServices Functional Tests", () => {

    describe("GuestServices.all()", () => {

        it("should pass on active Guests", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_FIRST);

            const guests = await GuestServices.all(
                facility.id,
                { active: "" }
            );
            expect(guests.length).to.be.greaterThan(0);
            guests.forEach(guest => {
                expect(guest.facilityId).to.equal(facility.id);
                expect(guest.active).to.equal(true);
            })

        })

        it("should pass on all Guests", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_SECOND);

            const guests = await GuestServices.all(facility.id);
            expect(guests.length).to.be.greaterThan(0);
            guests.forEach(guest => {
                expect(guest.facility).to.not.exist;
                expect(guest.facilityId).to.equal(facility.id);
            })

        })

        it("should pass on included parent", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_SECOND);

            const guests = await GuestServices.all(facility.id, {
                withFacility: "",
            });
            expect(guests.length).to.be.greaterThan(0);
            guests.forEach(guest => {
                expect(guest.facility).to.exist;
                expect(guest.facility.id).to.equal(facility.id);
                expect(guest.facilityId).to.equal(facility.id);
            })

        })

        it("should pass on named Guests", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const PATTERN = "iR"; // Should match First and Third

            const guests = await GuestServices.all(facility.id, {
                name: PATTERN,
            });
            expect(guests.length).to.be.greaterThan(0);
            guests.forEach(guest => {
                expect(guest.facilityId).to.equal(facility.id);
                const first = guest.firstName.toLowerCase().includes(PATTERN.toLowerCase());
                const last = guest.lastName.toLowerCase().includes(PATTERN.toLowerCase());
                expect(first || last, "Failed name match on both first and last");
            })

        })

        it("should pass on paginated Guests", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const LIMIT = 1;
            const OFFSET = 1;

            const guests = await GuestServices.all(facility.id, {
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(guests.length).to.equal(LIMIT);

        })

    })

    describe("GuestServices.exact()", () => {

        it("should fail on invalid name", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const INVALID_FIRST_NAME = "INVALID";
            const VALID_LAST_NAME = SeedData.GUEST_LAST_NAME_FIRST;

            try {
                await GuestServices.exact(facility.id, INVALID_FIRST_NAME, VALID_LAST_NAME);
                expect.fail("Should hvae thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`name:  Missing Guest '${INVALID_FIRST_NAME} ${VALID_LAST_NAME}'`);
                }
            }

        })

        it("should pass on included parent", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const guests = await GuestServices.all(facility.id);

            guests.forEach(async guest => {
                const result = await GuestServices.exact(facility.id, guest.firstName, guest.lastName, {
                    withFacility: ""
                });
                expect(result.facility).to.exist;
                expect(result.facility.id).to.equal(facility.id);
            })

        })

        it("should pass on valid names", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const guests = await GuestServices.all(facility.id);

            guests.forEach(async guest => {
                const result = await GuestServices.exact(facility.id, guest.firstName, guest.lastName);
                compareGuestOld(result, guest);
            });

        })

    })

    describe("GuestServices.find()", () => {

        it("should fail on invalid ID", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const INVALID_ID = -1;

            try {
                await GuestServices.find(facility.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`guestId: Missing Guest ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass on included parent", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_THIRD);
            const guests = await GuestServices.all(facility.id);

            guests.forEach(async guest => {
                const result = await GuestServices.find(facility.id, guest.id, {
                    withFacility: ""
                });
                expect(result.facility).to.exist;
                expect(result.facility.id).to.equal(facility.id);
            })

        })

        it("should pass on valid IDs", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_FIRST);
            const guests = await GuestServices.all(facility.id);

            guests.forEach(async guest => {
                const result = await GuestServices.find(facility.id, guest.id);
                compareGuestOld(result, guest);
            })

        })

    })

    // TODO - insert()

    // TODO - remove()

    // TODO - update()

})

// Helper Objects ------------------------------------------------------------

export function compareGuestNew(OUTPUT: Partial<Guest>, INPUT: Partial<Guest>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.comments).to.equal(INPUT.comments ? INPUT.comments : null);
    expect(OUTPUT.facilityId).to.exist;
    expect(OUTPUT.firstName).to.equal(INPUT.firstName);
    expect(OUTPUT.lastName).to.equal(INPUT.lastName);
}

export function compareGuestOld(OUTPUT: Partial<Guest>, INPUT: Partial<Guest>) {
    expect(OUTPUT.id).to.equal(INPUT.id !== undefined ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.comments).to.equal(INPUT.comments ? INPUT.comments : OUTPUT.comments);
    expect(OUTPUT.facilityId).to.exist;
    expect(OUTPUT.firstName).to.equal(INPUT.firstName ? INPUT.firstName : OUTPUT.firstName);
    expect(OUTPUT.lastName).to.equal(INPUT.lastName ? INPUT.lastName : OUTPUT.lastName);
}
