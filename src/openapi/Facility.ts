// Facility ------------------------------------------------------------------

// OpenAPI Builder declarations for Facility model objects.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders"
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    activeSchema, allOperation, childrenOperation, findOperation,
    idSchema, insertOperation,
    nameSchema, parameterRef, pathItemParentChildren,
    pathItemParentCollection,
    pathItemParentDetail, pathParam, removeOperation,
    schemaRef, updateOperation,
} from "./Common";
import {
    ACTIVE, API_PREFIX, CHECKIN,
    FACILITY, FACILITY_ID, GUEST,
    ID, MATCH_ACTIVE, MATCH_NAME, MATCH_SCOPE,
    NAME, REQUIRE_ADMIN, REQUIRE_REGULAR, REQUIRE_SUPERUSER, TEMPLATE, WITH_CHECKINS, WITH_GUESTS, WITH_TEMPLATES,
} from "./Constants";
import * as Guest from "./Guest";
import * as Template from "./Template";

// Public Objects ------------------------------------------------------------

// ***** Operations *****

export function all(): ob.OperationObject {
    return allOperation(FACILITY, null, includes, matches)
}

export function find(): ob.OperationObject {
    return findOperation(FACILITY, REQUIRE_REGULAR, includes);
}

export function guests(): ob.OperationObject {
    return childrenOperation(FACILITY, GUEST, REQUIRE_REGULAR, Guest.includes, Guest.matches);
}

export function insert(): ob.OperationObject {
    return insertOperation(FACILITY, REQUIRE_SUPERUSER);
}

export function remove(): ob.OperationObject {
    return removeOperation(FACILITY, REQUIRE_SUPERUSER);
}

export function templates(): ob.OperationObject {
    return childrenOperation(FACILITY, TEMPLATE, REQUIRE_REGULAR, Template.includes, Template.matches);
}

export function update(): ob.OperationObject {
    return updateOperation(FACILITY, REQUIRE_ADMIN);
}

// ***** Parameters *****

export function includes(): ob.ParametersObject {
    const parameters: ob.ParametersObject = {};
//    parameters[WITH_CHECKINS] = parameterRef(WITH_CHECKINS);
//    parameters[WITH_GUESTS] = parameterRef(WITH_GUESTS);
    parameters[WITH_TEMPLATES] = parameterRef(WITH_TEMPLATES);
    return parameters;
}

export function matches(): ob.ParametersObject {
    const parameters: ob.ParametersObject = {};
    parameters[MATCH_ACTIVE] = parameterRef(MATCH_ACTIVE);
    parameters[MATCH_NAME] = parameterRef(MATCH_NAME);
    parameters[MATCH_SCOPE] = parameterRef(MATCH_SCOPE);
    return parameters;
}

// ***** Paths *****

export function paths(): ob.PathsObject {
    const paths: ob.PathsObject = {};
    paths[API_PREFIX + "/" + pluralize(FACILITY.toLowerCase())]
        = pathItemParentCollection(FACILITY, all, insert);
    paths[API_PREFIX + "/" + pluralize(FACILITY.toLowerCase())
            + "/" + pathParam(FACILITY_ID)]
        = pathItemParentDetail(FACILITY,  FACILITY_ID, find, remove, update);
    // TODO - /api/facilities/{facilityId}/checkins
    paths[API_PREFIX + "/" + pluralize(FACILITY.toLowerCase())
    + "/" + pathParam(FACILITY_ID) + "/" + pluralize(GUEST.toLowerCase())]
        = pathItemParentChildren(FACILITY_ID, guests);
    paths[API_PREFIX + "/" + pluralize(FACILITY.toLowerCase())
            + "/" + pathParam(FACILITY_ID) + "/" + pluralize(TEMPLATE.toLowerCase())]
        = pathItemParentChildren(FACILITY_ID, templates);
    return paths;
}

// ***** Schema and Schemas *****

export function schema(): ob.SchemaObject {
    return new ob.SchemaObjectBuilder()
        .addProperty(ID, idSchema(FACILITY))
        .addProperty(ACTIVE, activeSchema(FACILITY))
        .addProperty("address1", new ob.SchemaObjectBuilder(
            "string",
            "First line of the Facility address",
            true).build())
        .addProperty("address2", new ob.SchemaObjectBuilder(
            "string",
            "Second line of Facility address",
            true).build())
//        .addProperty(pluralize(CHECKIN.toLowerCase()), schemaRef(pluralize(CHECKIN)))
        .addProperty("city", new ob.SchemaObjectBuilder(
            "string",
            "City of Facility address",
            true).build())
        .addProperty("email", new ob.SchemaObjectBuilder(
            "string",
            "Email address of this Facility",
            true).build())
        .addProperty(pluralize(GUEST.toLowerCase()), schemaRef(pluralize(GUEST)))
        .addProperty(NAME, nameSchema(FACILITY))
        .addProperty("phone", new ob.SchemaObjectBuilder(
            "string",
            "Phone number of this Facility",
            true).build())
        .addProperty("scope", new ob.SchemaObjectBuilder(
            "string",
            "OAuth Scope prefix for access to this Facility",
            false).build())
        .addProperty("state", new ob.SchemaObjectBuilder(
            "string",
            "State abbreviation of this Facility",
            true).build())
        .addProperty(pluralize(TEMPLATE.toLowerCase()), schemaRef(pluralize(TEMPLATE)))
        .addProperty("zipCode", new ob.SchemaObjectBuilder(
            "string",
            "Zip code of this Facility",
            true).build())
        .build();
}

export function schemas(): ob.SchemaObject {
    return new ob.SchemaObjectBuilder()
        .addItems(schemaRef(FACILITY))
        .addType("array")
        .build();
}

