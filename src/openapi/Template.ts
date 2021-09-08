// Template ------------------------------------------------------------------

// OpenAPI Builder declarations for Template model objects.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders"
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    activeSchema, allOperation, commentsSchema,
    facilityIdSchema, findOperation, idSchema,
    insertOperation, nameSchema, parameterRef,
    pathItemChildCollection, pathItemChildDetail, pathParam,
    removeOperation, schemaRef, updateOperation,
} from "./Common";
import {
    ACTIVE, API_PREFIX, COMMENTS,
    FACILITY, FACILITY_ID, ID,
    MATCH_ACTIVE, MATCH_NAME, NAME, REQUIRE_ADMIN, REQUIRE_REGULAR, REQUIRE_SUPERUSER,
    TEMPLATE, TEMPLATE_ID, WITH_FACILITY,
} from "./Constants";

// Public Objects -----------------------------------------------------------

// ***** Operations *****

export function all(): ob.OperationObject {
    return allOperation(TEMPLATE, REQUIRE_REGULAR, includes, matches);
}

export function find(): ob.OperationObject {
    return findOperation(TEMPLATE, REQUIRE_REGULAR, includes);
}

export function insert(): ob.OperationObject {
    return insertOperation(TEMPLATE, REQUIRE_ADMIN);
}

export function remove(): ob.OperationObject {
    return removeOperation(TEMPLATE, REQUIRE_SUPERUSER);
}

export function update(): ob.OperationObject {
    return updateOperation(TEMPLATE, REQUIRE_ADMIN);
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
    paths[API_PREFIX + "/" + pluralize(TEMPLATE.toLowerCase())
            + "/" + pathParam(FACILITY_ID)]
        = pathItemChildCollection(TEMPLATE, FACILITY_ID, all, insert);
    paths[API_PREFIX + "/" + pluralize(TEMPLATE.toLowerCase())
            + "/" + pathParam(FACILITY_ID) + "/" + pathParam(TEMPLATE_ID)]
        = pathItemChildDetail(TEMPLATE, TEMPLATE_ID, FACILITY_ID, find, remove, update);
    return paths;
}

// ***** Schema and Schemas *****

export function schema(): ob.SchemaObject {
    return new ob.SchemaObjectBuilder()
        .addProperty(ID, idSchema(TEMPLATE))
        .addProperty(ACTIVE, activeSchema(TEMPLATE))
        .addProperty("allMats", new ob.SchemaObjectBuilder(
            "string",
            "List of all mat numbers to be generated for this Template",
            false).build())
        .addProperty(COMMENTS, commentsSchema(TEMPLATE))
        .addProperty(FACILITY.toLowerCase(), schemaRef(FACILITY))
        .addProperty(FACILITY_ID, facilityIdSchema(TEMPLATE))
        .addProperty("handicapMats", new ob.SchemaObjectBuilder(
            "string",
            "List of mat numbers equipped for handicapped Guests",
            true).build())
        .addProperty(NAME, nameSchema(TEMPLATE))
        .addProperty("socketMats", new ob.SchemaObjectBuilder(
            "string",
            "List of mat numbers near electrical sockets",
            true).build())
        .addProperty("workMats", new ob.SchemaObjectBuilder(
            "string",
            "List of mat numbers reserved for work prospects",
            true).build())
        .build();
}

export function schemas(): ob.SchemaObject {
    return new ob.SchemaObjectBuilder()
        .addItems(schemaRef(TEMPLATE))
        .addType("array")
        .build();
}

