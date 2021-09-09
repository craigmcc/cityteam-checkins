// Checkin -------------------------------------------------------------------

// OpenAPI Builder declaration for Checkin model objects.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    allOperation, commentsSchema, facilityIdSchema,
    findOperation, guestIdSchema, idSchema,
    insertOperation, parameterRef, pathItemChildCollection,
    pathItemChildDetail, pathParam, queryParameter,
    removeOperation, schemaRef, updateOperation
} from "./Common";
import {
    API_PREFIX, CHECKIN, CHECKIN_DATE, CHECKIN_ID,
    COMMENTS, FACILITY, FACILITY_ID,
    FEATURES, GUEST, GUEST_ID, ID,
    MAT_NUMBER, MATCH_AVAILABLE, MATCH_DATE,
    PAYMENT_AMOUNT, PAYMENT_TYPE, REQUIRE_REGULAR,
    REQUIRE_SUPERUSER, SHOWER_TIME, WAKEUP_TIME,
    WITH_FACILITY, WITH_GUEST
} from "./Constants";

// Public Objects -----------------------------------------------------------

// ***** Operations *****

export function all(): ob.OperationObject {
    return allOperation(CHECKIN, REQUIRE_REGULAR, includes, matches);
}

export function find(): ob.OperationObject {
    return findOperation(CHECKIN, REQUIRE_REGULAR, includes);
}

export function insert(): ob.OperationObject {
    return insertOperation(CHECKIN, REQUIRE_REGULAR);
}

export function remove(): ob.OperationObject {
    return removeOperation(CHECKIN, REQUIRE_SUPERUSER);
}

export function update(): ob.OperationObject {
    return updateOperation(CHECKIN, REQUIRE_REGULAR);
}

// ***** Parameters *****

export function includes(): ob.ParametersObject {
    const parameters: ob.ParametersObject = {};
    parameters[WITH_FACILITY] = parameterRef(WITH_FACILITY);
    parameters[WITH_GUEST] = parameterRef(WITH_GUEST);
    return parameters;
}

export function matches(): ob.ParametersObject {
    const parameters: ob.ParametersObject = {};
    parameters[MATCH_AVAILABLE]
        = queryParameter(MATCH_AVAILABLE, "Match only mats that are available", true);
    parameters[MATCH_DATE]
        = queryParameter(MATCH_DATE, "Checkin date to match (YYYY-MM-DD)", false);
    return parameters;
}

// ***** Paths *****

export function paths(): ob.PathsObject {
    const paths: ob.PathsObject = {};
    paths[API_PREFIX + "/" + pluralize(CHECKIN.toLowerCase())
    + "/" + pathParam(FACILITY_ID)]
        = pathItemChildCollection(CHECKIN, FACILITY_ID, all, insert);
    paths[API_PREFIX + "/" + pluralize(CHECKIN.toLowerCase())
    + "/" + pathParam(FACILITY_ID) + "/" + pathParam(CHECKIN_ID)]
        = pathItemChildDetail(CHECKIN, CHECKIN_ID, FACILITY_ID, find, remove, update);
    return paths;
}

// ***** Schemas *****

export function schema(): ob.SchemaObject {
    return new ob.SchemaObjectBuilder()
        .addProperty(ID, idSchema(CHECKIN))
        .addProperty(CHECKIN_DATE, new ob.SchemaObjectBuilder(
            "string",
            "Checkin date for which this mat is avalable or assigned (YYYY-MM-DD)",
            true).build())
        .addProperty(COMMENTS, commentsSchema(GUEST))
        .addProperty(FACILITY.toLowerCase(), schemaRef(FACILITY))
        .addProperty(FACILITY_ID, facilityIdSchema(FACILITY))
        .addProperty(FEATURES, new ob.SchemaObjectBuilder(
            "string",
            "Feature codes associated with this mat (if any)",
            true).build())
        .addProperty(GUEST.toLowerCase(), schemaRef(GUEST))
        .addProperty(GUEST_ID, guestIdSchema(GUEST))
        .addProperty(MAT_NUMBER, new ob.SchemaObjectBuilder(
            "number",
            "Mat number to be checked in to on this checkin date",
            false).build())
        .addProperty(PAYMENT_AMOUNT, new ob.SchemaObjectBuilder(
            "number",
            "Amount paid (if any) for this mat, on this checkin date",
            true).build())
        .addProperty(PAYMENT_TYPE, new ob.SchemaObjectBuilder(
            "string",
            "Payment type, if this mat was occupied on this checkin date",
            true).build())
        .addProperty(SHOWER_TIME, new ob.SchemaObjectBuilder(
            "string",
            "Requested time this Guest wishes to shower (HH:MM)",
            true).build())
        .addProperty(WAKEUP_TIME, new ob.SchemaObjectBuilder(
            "string",
            "Requested time this Guest wishes to waken (HH:MM)",
            true).build())
        .build();
}

export function schemas(): ob.SchemaObject {
    return new ob.SchemaObjectBuilder()
        .addDescription("Checkins associated with this Facility")
        .addItems(schemaRef(CHECKIN))
        .addType("array")
        .build();
}
