// Assembly ------------------------------------------------------------------

// Assemble the entire OpenAPI description into a JSON string

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import * as Assign from "./Assign";
import * as Checkin from "./Checkin";
import * as ErrorSchema from "./ErrorSchema";
import * as Facility from "./Facility";
import * as Guest from "./Guest";
import * as Template from "./Template";
import * as User from "./User";
import {
    ASSIGN, BAD_REQUEST, CHECKIN, CHECKIN_ID,
    ERROR, FACILITY, FACILITY_ID, FORBIDDEN,
    GUEST, GUEST_ID, LIMIT,
    MATCH_ACTIVE, MATCH_NAME, MATCH_SCOPE,
    MODELS, NOT_FOUND, NOT_UNIQUE,
    OFFSET, REQUIRE_ADMIN, REQUIRE_ANY, REQUIRE_REGULAR,
    REQUIRE_SUPERUSER, SERVER_ERROR, STRING,
    TEMPLATE, TEMPLATE_ID, USER,
    USER_ID, WITH_CHECKINS, WITH_FACILITY,
    WITH_GUEST, WITH_GUESTS, WITH_TEMPLATES
} from "./Constants";
import {OpenApiObjectBuilder, TagObjectBuilder} from "@craigmcc/openapi-builders";
import {
    errorResponse, modelRequestBody, modelResponse,
    modelsResponse, queryParameter, pathParameter,
    schemaRef
} from "./Common";

// Public Objects ------------------------------------------------------------

let ASSEMBLY = "";

export function assembly(): string {
    if (ASSEMBLY === "") {
        const builder = new ob.OpenApiObjectBuilder(info())
            .components(components())
            .pathItems(Checkin.paths())
            .pathItems(Facility.paths())
            .pathItems(Guest.paths())
            .pathItems(Template.paths())
            .pathItems(User.paths())
        ;
        tags(builder);
        ASSEMBLY = builder.asJson();
    }
    return ASSEMBLY;
}

// Private Objects ----------------------------------------------------------

function tags(builder: OpenApiObjectBuilder): void {

    // Permission constraints on operations
    builder.tag(new TagObjectBuilder(REQUIRE_ADMIN)
        .description("Requires 'admin' permission on the associated Facility")
        .build())
    builder.tag(new TagObjectBuilder(REQUIRE_ANY)
        .description("Requres logged in user")
        .build())
    builder.tag(new TagObjectBuilder(REQUIRE_REGULAR)
        .description("Requires 'regular' permission on the associated Facility")
        .build())
    builder.tag(new TagObjectBuilder(REQUIRE_SUPERUSER)
        .description("Requires 'superuser' permission")
        .build());

}

function components(): ob.ComponentsObject {
    return new ob.ComponentsObjectBuilder()
        .parameters(parameters())
        .requestBodies(requestBodies())
        .responses(responses())
        .schemas(schemas())
        .build();
}

function contact(): ob.ContactObject {
    return new ob.ContactObjectBuilder()
        .email("craigmcc@gmail.com")
        .name("Craig McClanahan")
        .build();
}

function info(): ob.InfoObject {
    return new ob.InfoObjectBuilder("CityTeam Guests Checkin Application", "2.0.0")
        .contact(contact())
        .description("Manage overnight Guest checkins at a CityTeam Facility")
        .license(license())
        .build();
}

function license(): ob.LicenseObject {
    return new ob.LicenseObjectBuilder("Apache-2.0")
        .url("https://apache.org/licenses/LICENSE-2.0")
        .build();
}

function parameters(): ob.ParametersObject {
    const parameters: ob.ParametersObject = {};

    // Path Parameters
    parameters[CHECKIN_ID]
        = pathParameter(CHECKIN_ID, "ID of the specified Checkin");
    parameters[FACILITY_ID]
        = pathParameter(FACILITY_ID, "ID of the specified Facility");
    parameters[GUEST_ID]
        = pathParameter(GUEST_ID, "ID of the specified Guest");
    parameters[TEMPLATE_ID]
        = pathParameter(TEMPLATE_ID, "ID of the specified Template");
    parameters[USER_ID]
        = pathParameter(USER_ID, "ID of the specified User");

    // Query Parameters (Includes)
    parameters[WITH_CHECKINS]
        = queryParameter(WITH_CHECKINS, "Include the related Checkins", true);
    parameters[WITH_FACILITY]
        = queryParameter(WITH_FACILITY, "Include the related Facility", true);
    parameters[WITH_GUEST]
        = queryParameter(WITH_GUEST, "Include the related Guest", true);
    parameters[WITH_GUESTS]
        = queryParameter(WITH_GUESTS, "Include the related Guests", true);
    parameters[WITH_TEMPLATES]
        = queryParameter(WITH_TEMPLATES, "Include the related Templates", true);

    // Query Parameters (Matches)
    parameters[MATCH_ACTIVE]
        = queryParameter(MATCH_ACTIVE, "Return only active objects", true);
    parameters[MATCH_NAME]
        = queryParameter(MATCH_NAME, "Return objects matching name wildcard", false);
    parameters[MATCH_SCOPE]
        = queryParameter(MATCH_SCOPE, "Return objects matching specified scope", false);

    // Query Parameters (Pagination)
    parameters[LIMIT]
        = queryParameter(LIMIT, "Maximum number of rows returned (default is 25)", false);
    parameters[OFFSET]
        = queryParameter(OFFSET, "Zero-relative offset to the first returned row (default is 0)", false);

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
    schemas[ASSIGN] = Assign.schema();
    schemas[pluralize(ASSIGN)] = Assign.schemas();
    schemas[CHECKIN] = Checkin.schema();
    schemas[pluralize(CHECKIN)] = Checkin.schemas();
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
    schemas[STRING] = new ob.SchemaObjectBuilder("string")
        .build();

    return schemas;
}
