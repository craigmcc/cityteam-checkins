// Guest ---------------------------------------------------------------------

// OpenAPI Builder declarations for Guest model objects.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders"
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    activeSchema, allOperation, commentsSchema,
    facilityIdSchema, findOperation, idSchema,
    insertOperation, parameterRef, pathItemChildCollection,
    pathItemChildDetail, pathParam,
    removeOperation, schemaRef, updateOperation
} from "./Common";
import {
    ACTIVE, API_PREFIX, COMMENTS,
    FACILITY, FACILITY_ID, FAVORITE,
    FIRST_NAME, GUEST, GUEST_ID,
    ID, LAST_NAME, MATCH_ACTIVE,
    MATCH_NAME, REQUIRE_REGULAR, REQUIRE_SUPERUSER, WITH_FACILITY
} from "./Constants";

// Public Objects ------------------------------------------------------------

// ***** Operations *****

export function all(): ob.OperationObject {
    return allOperation(GUEST, REQUIRE_REGULAR, includes, matches);
}

export function find(): ob.OperationObject {
    return findOperation(GUEST, REQUIRE_REGULAR, includes);
}

export function insert(): ob.OperationObject {
    return insertOperation(GUEST, REQUIRE_REGULAR);
}

export function remove(): ob.OperationObject {
    return removeOperation(GUEST, REQUIRE_SUPERUSER);
}

export function update(): ob.OperationObject {
    return updateOperation(GUEST, REQUIRE_REGULAR);
}

// ***** Parameters *****

export function includes(): ob.ParametersObject {
    const parameters: ob.ParametersObject = {};
    parameters[WITH_FACILITY] = parameterRef(WITH_FACILITY);
    return parameters;
}

export function matches(): ob.ParametersObject {
    const parameters: ob.ParametersObject = {};
    parameters[MATCH_ACTIVE] = parameterRef(MATCH_ACTIVE);
    parameters[MATCH_NAME] = parameterRef(MATCH_NAME);
    return parameters;
}

// ***** Paths *****

export function paths(): ob.PathsObject {
    const paths: ob.PathsObject = {};
    paths[API_PREFIX + "/" + pluralize(GUEST.toLowerCase())
    + "/" + pathParam(FACILITY_ID)]
        = pathItemChildCollection(GUEST, FACILITY_ID, all, insert);
    paths[API_PREFIX + "/" + pluralize(GUEST.toLowerCase())
    + "/" + pathParam(FACILITY_ID) + "/" + pathParam(GUEST_ID)]
        = pathItemChildDetail(GUEST, GUEST_ID, FACILITY_ID, find, remove, update);
    return paths;
}

// ***** Schemas *****

export function schema(): ob.SchemaObject {
    return new ob.SchemaObjectBuilder()
        .addProperty(ID, idSchema(GUEST))
        .addProperty(ACTIVE, activeSchema(GUEST))
        // TODO - checkins
        .addProperty(COMMENTS, commentsSchema(GUEST))
        .addProperty(FACILITY.toLowerCase(), schemaRef(FACILITY))
        .addProperty(FACILITY_ID, facilityIdSchema(GUEST))
        .addProperty(FAVORITE, new ob.SchemaObjectBuilder(
            "string",
            "Favorite mat or location",
            true).build())
        .addProperty(FIRST_NAME, new ob.SchemaObjectBuilder(
            "string",
            "First Name of this Guest",
            false).build())
        .addProperty(LAST_NAME, new ob.SchemaObjectBuilder(
            "string",
            "Last Name of this Guest",
            false).build())
        .build();
}

export function schemas(): ob.SchemaObject {
    return new ob.SchemaObjectBuilder()
        .addItems(schemaRef(GUEST))
        .addType("array")
        .build();
}

