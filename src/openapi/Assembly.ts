// Assembly ------------------------------------------------------------------

// Assemble the entire OpenAPI description into a JSON string

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import * as ErrorSchema from "./ErrorSchema";
import * as Facility from "./Facility";
import * as Guest from "./Guest";
import * as Template from "./Template";
import * as User from "./User";
import {
    BAD_REQUEST, CHECKIN_ID,
    ERROR,
    FACILITY, FACILITY_ID, FORBIDDEN, GUEST, GUEST_ID,
    LIMIT, MATCH_ACTIVE, MATCH_NAME, MATCH_SCOPE, MODELS, NOT_FOUND, NOT_UNIQUE,
    OFFSET,
    REQUIRE_ADMIN,
    REQUIRE_REGULAR,
    REQUIRE_SUPERUSER, SERVER_ERROR,
    TEMPLATE, TEMPLATE_ID,
    USER, USER_ID, WITH_CHECKINS,
    WITH_FACILITY, WITH_GUEST, WITH_GUESTS, WITH_TEMPLATES
} from "./Constants";
import {OpenApiObjectBuilder, TagObjectBuilder} from "@craigmcc/openapi-builders";
import {errorResponse, modelRequestBody, modelResponse, modelsResponse} from "./Common";

// Public Objects ------------------------------------------------------------

let ASSEMBLY = "";

export function assembly(): string {
    if (ASSEMBLY === "") {
        const builder = new ob.OpenApiObjectBuilder(info())
            .addComponents(components())
            .addPathItems(Facility.paths())
            .addPathItems(Guest.paths())
            .addPathItems(Template.paths())
            .addPathItems(User.paths())
        ;
        addTags(builder);
        ASSEMBLY = builder.asJson();
    }
    return ASSEMBLY;
}

// Private Objects ----------------------------------------------------------

function addTags(builder: OpenApiObjectBuilder): void {

    // Permission constraints on operations
    builder.addTag(new TagObjectBuilder(REQUIRE_ADMIN)
        .addDescription("Requires 'admin' permission on the associated Facility")
        .build())
    builder.addTag(new TagObjectBuilder(REQUIRE_REGULAR)
        .addDescription("Requires 'regular' permission on the associated Facility")
        .build())
    builder.addTag(new TagObjectBuilder(REQUIRE_SUPERUSER)
        .addDescription("Requires 'superuser' permission")
        .build());

}

function components(): ob.ComponentsObject {
    return new ob.ComponentsObjectBuilder()
        .addParameters(parameters())
        .addRequestBodies(requestBodies())
        .addResponses(responses())
        .addSchemas(schemas())
        .build();
}

function contact(): ob.ContactObject {
    return new ob.ContactObjectBuilder()
        .addEmail("craigmcc@gmail.com")
        .addName("Craig McClanahan")
        .build();
}

function info(): ob.InfoObject {
    return new ob.InfoObjectBuilder("CityTeam Guests Checkin Application", "2.0.0")
        .addContact(contact())
        .addDescription("Manage overnight Guest checkins at a CityTeam Facility")
        .addLicense(license())
        .build();
}

function license(): ob.LicenseObject {
    return new ob.LicenseObjectBuilder("Apache-2.0")
        .addUrl("https://apache.org/licenses/LICENSE-2.0")
        .build();
}

function parameters(): ob.ParametersObject {
    const parameters: ob.ParametersObject = {};

    // Path Parameters
    parameters[CHECKIN_ID] = new ob.ParameterObjectBuilder("path", CHECKIN_ID)
        .addDescription("ID of the specified Checkin")
        .addRequired(true)
        .build();
    parameters[FACILITY_ID] = new ob.ParameterObjectBuilder("path", FACILITY_ID)
        .addDescription("ID of the specified Facility")
        .addRequired(true)
        .build();
    parameters[GUEST_ID] = new ob.ParameterObjectBuilder("path", GUEST_ID)
        .addDescription("ID of the specified Guest")
        .addRequired(true)
        .build();
    parameters[TEMPLATE_ID] = new ob.ParameterObjectBuilder("path", TEMPLATE_ID)
        .addDescription("ID of the specified Template")
        .addRequired(true)
        .build();
    parameters[USER_ID] = new ob.ParameterObjectBuilder("path", USER_ID)
        .addDescription("ID of the specified User")
        .addRequired(true)
        .build();

    // Query Parameters (Includes)
    parameters[WITH_CHECKINS] = new ob.ParameterObjectBuilder("query", WITH_CHECKINS)
        .addAllowEmptyValue(true)
        .addDescription("Include the related Checkins")
        .addRequired(false)
        .build();
    parameters[WITH_FACILITY] = new ob.ParameterObjectBuilder("query", WITH_FACILITY)
        .addAllowEmptyValue(true)
        .addDescription("Include the parent Facility")
        .addRequired(false)
        .build();
    parameters[WITH_GUEST] = new ob.ParameterObjectBuilder("query", WITH_GUEST)
        .addAllowEmptyValue(true)
        .addDescription("Include the associated Guest")
        .addRequired(false)
        .build();
    parameters[WITH_GUESTS] = new ob.ParameterObjectBuilder("query", WITH_GUESTS)
        .addAllowEmptyValue(true)
        .addDescription("Include the related Guests")
        .addRequired(false)
        .build();
    parameters[WITH_TEMPLATES] = new ob.ParameterObjectBuilder("query", WITH_TEMPLATES)
        .addAllowEmptyValue(true)
        .addDescription("Include the related Templates")
        .addRequired(false)
        .build();

    // Query Parameters (Matches)
    parameters[MATCH_ACTIVE] = new ob.ParameterObjectBuilder("query", MATCH_ACTIVE)
        .addAllowEmptyValue(true)
        .addDescription("Return only active objects")
        .addRequired(false)
        .build();
    parameters[MATCH_NAME] = new ob.ParameterObjectBuilder("query", MATCH_NAME)
        .addDescription("Return objects matching name wildcard")
        .addRequired(false)
        .build();
    parameters[MATCH_SCOPE] = new ob.ParameterObjectBuilder("query", MATCH_SCOPE)
        .addDescription("Return objects matching the specified scope")
        .addRequired(false)
        .build();

    // Query Parameters (Pagination)
    parameters[LIMIT] = new ob.ParameterObjectBuilder("query", LIMIT)
        .addDescription("Maximum number of rows returned (default is 25)")
        .addRequired(false)
        .build();
    parameters[OFFSET] = new ob.ParameterObjectBuilder("query", OFFSET)
        .addDescription("Zero-relative offset to the first returned row (default is 0)")
        .addRequired(false)
        .build();

    return parameters;
}

function requestBodies(): ob.RequestBodiesObject {
    const requestBodies: ob.RequestBodiesObject = {};

    // Request bodies for model objects
    for (const model of MODELS) {
        requestBodies[model] = modelRequestBody(model);
    }

    return requestBodies;
}

function responses(): ob.ResponsesObject {
    const responses: ob.ResponsesObject = {};

    // Responses for model objects
    for (const model of MODELS) {
        responses[model] = modelResponse(model);
        responses[pluralize(model)] = modelsResponse(model);
    }

    // Responses for HTTP errors
    responses[BAD_REQUEST] = errorResponse("Error in request properties");
    responses[FORBIDDEN] = errorResponse("Requested operation is not allowed");
    responses[NOT_FOUND] = errorResponse("Requested item is not found");
    responses[NOT_UNIQUE] = errorResponse("Request object would violate uniqueness rules");
    responses[SERVER_ERROR] = errorResponse("General server error occurred");

    return responses;
}

function schemas(): ob.SchemasObject {
    const schemas: ob.SchemasObject = {};

    // Application Models
    schemas[FACILITY] = Facility.schema();
    schemas[pluralize(FACILITY)] = Facility.schemas();
    schemas[GUEST] = Guest.schema();
    schemas[pluralize(GUEST)] = Guest.schemas();
    schemas[TEMPLATE] = Template.schema();
    schemas[pluralize(TEMPLATE)] = Template.schemas();
    schemas[USER] = User.schema();
    schemas[pluralize(USER)] = User.schemas();

    // Other Schemas
    schemas[ERROR] = ErrorSchema.schema();

    return schemas;
}
