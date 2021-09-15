// CheckinServices.test ------------------------------------------------------

// Functional tests for CheckinServices.

// External Modules ----------------------------------------------------------

import {loadTestData, lookupFacility, lookupGuest} from "../util/TestUtils";

const chai = require("chai");
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import CheckinServices from "./CheckinServices";
import Checkin from "../models/Checkin";
import {BadRequest, NotFound} from "../util/HttpErrors";
import * as SeedData from "../util/SeedData";

// Test Specifications -------------------------------------------------------

describe("CheckinServices Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await loadTestData({
            withCheckins: true,
            withFacilities: true,
            withGuests: true,
        });
    })

    // Test Methods ----------------------------------------------------------

    describe("CheckinServices.all()", () => {

        it("should pass on all checkins for a checkinDate", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_FIRST);

            const results = await CheckinServices.all(facility.id, {
                date: SeedData.CHECKIN_DATE_ONE,
            });
            expect(results.length).to.equal(4);
            results.forEach(result => {
                expect(result.id).to.exist;
                expect(result.checkinDate).to.equal(SeedData.CHECKIN_DATE_ONE);
                expect(result.facilityId).to.equal(facility.id);
                expect(result.matNumber).to.exist;
                if (result.guestId) {
                    expect(result.paymentType).to.exist;
                    if (result.paymentType === "$$") {
                        expect(result.paymentAmount).to.exist;
                    } else {
                        expect(result.paymentAmount).to.not.exist;
                    }
                } else {
                    expect(result.paymentType).to.not.exist;
                }
            })

        })

        it("should pass on all checkins for a guestId", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_SECOND);
            const guest = await lookupGuest(facility.id, SeedData.GUEST_FIRST_NAME_FOURTH, SeedData.GUEST_LAST_NAME_FOURTH);

            const results = await CheckinServices.all(facility.id, {
                guestId: guest.id,
            });
            expect(results.length).to.equal(2);
            expect(results[0].facilityId).to.equal(facility.id);
            expect(results[0].guestId).to.equal(guest.id);

        })

        it("should pass on available checkins for a checkinDate", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_SECOND);

            const results = await CheckinServices.all(facility.id, {
                available: "",
                date: SeedData.CHECKIN_DATE_TWO,
            });
            expect(results.length).to.equal(2);
            results.forEach(result => {
                expect(result.id).to.exist;
                expect(result.checkinDate).to.equal(SeedData.CHECKIN_DATE_TWO);
                expect(result.facilityId).to.equal(facility.id);
                expect(result.guestId).to.not.exist;
                expect(result.matNumber).to.exist;
                expect(result.paymentAmount).to.not.exist;
                expect(result.paymentType).to.not.exist;
            })

        })

        it("should pass on no checkins for a checkinDate", async () => {

            const facility = await lookupFacility(SeedData.FACILITY_NAME_THIRD);

            const results = await CheckinServices.all(facility.id, {
                date: SeedData.CHECKIN_DATE_ZERO,
            });
            expect(results.length).to.equal(0);

        })

    })

    // TODO - CheckinServices.find();

    // TODO - CheckinServices.insert();

    // TODO - CheckinServices.remove();

    // TODO - CheckinServices.update();

})

// Helper Objects ------------------------------------------------------------

export function compareCheckinNew(OUTPUT: Partial<Checkin>, INPUT: Partial<Checkin>) {

    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.checkinDate).to.equal(INPUT.checkinDate);
    expect(OUTPUT.facilityId).to.exist;
    expect(OUTPUT.guestId).to.equal(INPUT.guestId ? INPUT.guestId : null);
    expect(OUTPUT.matNumber).to.equal(INPUT.matNumber);
    expect(OUTPUT.paymentAmount).to.equal(INPUT.paymentAmount ? INPUT.paymentAmount : null);
    expect(OUTPUT.paymentType).to.equal(INPUT.paymentType ? INPUT.paymentType : null);
    expect(OUTPUT.showerTime).to.equal(INPUT.showerTime ? INPUT.showerTime : null);
    expect(OUTPUT.wakeupTime).to.equal(INPUT.wakeupTime ? INPUT.wakeupTime : null);
}

export function compareCheckinOld(OUTPUT: Partial<Checkin>, INPUT: Partial<Checkin>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.checkinDate).to.equal(INPUT.checkinDate ? INPUT.checkinDate : OUTPUT.checkinDate);
    expect(OUTPUT.facilityId).to.exist;
    expect(OUTPUT.guestId).to.equal(INPUT.guestId ? INPUT.guestId : OUTPUT.guestId);
    expect(OUTPUT.matNumber).to.equal(INPUT.matNumber ? INPUT.matNumber : OUTPUT.matNumber);
    expect(OUTPUT.paymentAmount).to.equal(INPUT.paymentAmount ? INPUT.paymentAmount : OUTPUT.paymentAmount);
    expect(OUTPUT.paymentType).to.equal(INPUT.paymentType ? INPUT.paymentType : OUTPUT.paymentType);
    expect(OUTPUT.showerTime).to.equal(INPUT.showerTime ? INPUT.showerTime : OUTPUT.showerTime);
    expect(OUTPUT.wakeupTime).to.equal(INPUT.wakeupTime ? INPUT.wakeupTime : OUTPUT.wakeupTime);

}
