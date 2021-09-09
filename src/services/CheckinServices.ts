// CheckinServices -----------------------------------------------------------

// Services implementation for Checkin models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op, ValidationError} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractChildServices from "./AbstractChildServices";
import Checkin from "../models/Checkin";
import Facility from "../models/Facility";
import Guest from "../models/Guest";
import {BadRequest, NotFound, ServerError} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrders";

// Public Objects ------------------------------------------------------------

class CheckinServices extends AbstractChildServices<Checkin> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(facilityId: number, query?: any): Promise<Checkin[]> {
        const facility = await Facility.findByPk(facilityId);
        if (!facility) {
            throw new NotFound(
                `facilityId: Missing Facility ${facilityId}`,
                "CheckinServices.all"
            );
        }
        const options = this.appendMatchOptions({
            order: SortOrder.CHECKINS
        }, query);
        return await facility.$get("checkins", options);
    }

    public async find(facilityId: number, checkinId: number, query?: any): Promise<Checkin> {
        const facility = await Facility.findByPk(facilityId);
        if (!facility) {
            throw new NotFound(
                `facilityId: Missing Facility ${facilityId}`,
                "CheckinServices.find"
            );
        }
        const options = this.appendIncludeOptions({
            where: { id: checkinId }
        }, query);
        const results = await facility.$get("checkins", options);
        if (results.length !== 1) {
            throw new NotFound(
                `checkinId: Missing Checkin ${checkinId}`,
                "CheckinServices.find"
            );
        }
        return results[0];
    }

    public async insert(facilityId: number, checkin: any): Promise<Checkin> {
        const facility = await Facility.findByPk(facilityId);
        if (!facility) {
            throw new NotFound(
                `facilityId: Missing Facility ${facilityId}`,
                "CheckinServices.find"
            );
        }
        checkin.facilityId = facilityId; // No cheating
        try {
            return await Checkin.create(checkin, {
                fields: FIELDS,
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "CheckinServices.insert"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "CheckinServices.insert"
                );
            }
        }
    }

    public async remove(facilityId: number, checkinId: number): Promise<Checkin> {
        const facility = await Facility.findByPk(facilityId);
        if (!facility) {
            throw new NotFound(
                `facilityId: Missing Facility ${facilityId}`,
                "CheckinServices.remove"
            );
        }
        const results = await facility.$get("checkins", {
            where: { id: checkinId }
        });
        if (results.length !== 1) {
            throw new NotFound(
                `checkinId: Missing Checkin ${checkinId}`,
                "CheckinServices.remove"
            );
        }
        await Checkin.destroy({
            where: { id: checkinId }
        });
        return results[0];
    }

    public async update(facilityId: number, checkinId: number, checkin: any): Promise<Checkin> {
        const facility = await Facility.findByPk(facilityId);
        if (!facility) {
            throw new NotFound(
                `facilityId: Missing Facility ${facilityId}`,
                "CheckinServices.update"
            );
        }
        const results = await facility.$get("checkins", {
            where: { id: checkinId }
        });
        if (results.length !== 1) {
            throw new NotFound(
                `checkinId: Missing Checkin ${checkinId}`,
                "CheckinServices.update"
            );
        }
        try {
            await Checkin.update(checkin, {
                fields: FIELDS_WITH_ID,
                where: { id: checkinId }
            });
            return this.find(facilityId, checkinId);
        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            } else if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "CheckinServices.update"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "CheckinServices.update"
                );
            }
        }
    }

    // Model-Specific Methods ------------------------------------------------

/* Not relevant on Checkins
    public async exact(facilityId: number, name: string, query?: any): Promise<Checkin> {
        const facility = await Facility.findByPk(facilityId);
        if (!facility) {
            throw new NotFound(
                `facilityId: Missing Facility ${facilityId}`,
                "CheckinServices.exact"
            );
        }
        const options = this.appendIncludeOptions({
            where: { name: name }
        }, query);
        const results = await facility.$get("checkins", options);
        if (results.length !== 1) {
            throw new NotFound(
                `checkinId: Missing Checkin '${name}'`,
                "CheckinServices.exact"
            );
        }
        return results[0];
    }
 */

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withFacility                   Include parent Facility
     * * withGuest                      Include related Guest (if any)
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withFacility) {
            include.push(Facility);
        }
        if ("" === query.withGuest) {
            include.push(Guest);
        }
        if (include.length > 0) {
            options.include = include;
        }
        return options;
    }

    /**
     * Supported match query parameters:
     * * available                      Select available (i.e. no Guest) Checkins
     * * date={checkinDate}             Select checkins for the specified date
     */
    public appendMatchOptions(options: FindOptions, query?: any): FindOptions {
        options = this.appendIncludeOptions(options, query);
        if (!query) {
            return options;
        }
        const where: any = options.where ? options.where : {};
        if ("" === query.available) {
            where.guestId = { [Op.eq]: null };
        }
        if ("" === query.date) {
            where.checkinDate = query.date;
        }
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }

}

export default new CheckinServices();

// Private Options -----------------------------------------------------------

const FIELDS = [
    "active",
    "allMats",
    "comments",
    "facilityId",
    "handicapMats",
    "name",
    "socketMats",
    "workMats",
];

const FIELDS_WITH_ID = [
    ...FIELDS,
    "id",
];
