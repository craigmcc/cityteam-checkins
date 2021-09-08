// Common --------------------------------------------------------------------

// OpenAPI Builder common constructs

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    APPLICATION_JSON, BAD_REQUEST, CREATED, ERROR, FORBIDDEN, LIMIT, NOT_FOUND, OFFSET, OK
} from "./Constants";
import {PathItemObjectBuilder, ReferenceObjectBuilder} from "@craigmcc/openapi-builders";

// Public Objects ------------------------------------------------------------

// ***** Component References *****

export function parameterRef(parameter: string): ob.ReferenceObject {
    return new ReferenceObjectBuilder(`#/components/parameters/${parameter}`)
        .build();
}

export function requestBodyRef(requestBody: string): ob.ReferenceObject {
    return new ReferenceObjectBuilder(`#/components/requestBodies/${requestBody}`)
        .build();
}

export function responseRef(parameter: string): ob.ReferenceObject {
    return new ReferenceObjectBuilder(`#/components/responses/${parameter}`)
        .build();
}

export function schemaRef(schema: string): ob.ReferenceObject {
    return new ReferenceObjectBuilder(`#/components/schemas/${schema}`)
        .build();
}

// ***** Operations *****

// GET to return an array of objects
export function allOperation(
    model: string,
    tag: string | null,
    includes?: () => ob.ParametersObject,
    matches?: () => ob.ParametersObject
): ob.OperationObject
{
    const models = pluralize(model);
    const builder = new ob.OperationObjectBuilder()
        .addDescription(`Return all matching ${models}`)
        .addParameters(includes ? includes() : {})
        .addParameters(matches ? matches() : {})
        .addParameters(paginations())
        .addResponse(OK, responseRef(models))
        .addSummary(`The requested ${models}`)
    ;
    if (tag) {
        builder.addTag(tag);
    }
    return builder.build();
}

// GET to return children of an object
export function childrenOperation(
    parentModel: string,
    childModel: string,
    tag: string | null,
    includes?: () => ob.ParametersObject,
    matches?: () => ob.ParametersObject
): ob.OperationObject
{
    const children = pluralize(childModel);
    const builder = new ob.OperationObjectBuilder()
        .addDescription(`Return matching ${children} of this ${parentModel}`)
        .addParameters(includes ? includes() : {})
        .addParameters(matches ? matches() : {})
        .addParameters(paginations())
        .addResponse(OK, responseRef(children))
        .addResponse(FORBIDDEN, responseRef(FORBIDDEN))
        .addResponse(NOT_FOUND, responseRef(NOT_FOUND))
        .addSummary(`The requested ${children}`);
    if (tag) {
        builder.addTag(tag);
    }
    return builder.build();
}

// GET to return a specified object
export function findOperation(
    model: string,
    tag: string | null,
    includes?: () => ob.ParametersObject,
): ob.OperationObject
{
    const builder = new ob.OperationObjectBuilder()
        .addDescription(`Return the specified ${model}`)
        .addParameters(includes ? includes() : {})
        .addResponse(OK, responseRef(model))
        .addResponse(FORBIDDEN, responseRef(FORBIDDEN))
        .addResponse(NOT_FOUND, responseRef(NOT_FOUND))
        .addSummary(`The specified ${model}`)
    ;
    if (tag) {
        builder.addTag(tag);
    }
    return builder.build();
}

// POST to create and return an object
export function insertOperation(
    model: string,
    tag: string | null
): ob.OperationObject
{
    const builder = new ob.OperationObjectBuilder()
        .addDescription(`Create and return the specified ${model}`)
        .addRequestBody(requestBodyRef(model))
        .addResponse(CREATED, responseRef(model))
        .addResponse(BAD_REQUEST, responseRef(BAD_REQUEST))
        .addResponse(FORBIDDEN, responseRef(FORBIDDEN))
        .addSummary(`The created ${model}`)
    ;
    if (tag) {
        builder.addTag(tag);
    }
    return builder.build();
}

// DELETE to remove and return a specified object
export function removeOperation(
    model: string,
    tag: string | null
): ob.OperationObject
{
    const builder = new ob.OperationObjectBuilder()
        .addDescription(`Remove and return the specified ${model}`)
        .addResponse(OK, responseRef(model))
        .addResponse(BAD_REQUEST, responseRef(BAD_REQUEST))
        .addResponse(FORBIDDEN, responseRef(FORBIDDEN))
        .addResponse(NOT_FOUND, responseRef(NOT_FOUND))
        .addSummary(`The removed ${model}`)
    ;
    if (tag) {
        builder.addTag(tag);
    }
    return builder.build();
}

// PUT to update and return a specified object
export function updateOperation(
    model: string,
    tag: string | null
): ob.OperationObject
{
    const builder = new ob.OperationObjectBuilder()
        .addDescription(`Update and return the specified ${model}`)
        .addRequestBody(requestBodyRef(model))
        .addResponse(OK, responseRef(model))
        .addResponse(BAD_REQUEST, responseRef(BAD_REQUEST))
        .addResponse(FORBIDDEN, responseRef(FORBIDDEN))
        .addResponse(NOT_FOUND, responseRef(NOT_FOUND))
        .addSummary(`The updated ${model}`)
    ;
    if (tag) {
        builder.addTag(tag);
    }
    return builder.build();
}

// ***** PathItems *****

// PathItem for child object collection endpoint
export function pathItemChildCollection(
    childModel: string,
    parentId: string,
    all?: () => ob.OperationObject,
    insert?: () => ob.OperationObject
): ob.PathItemObject
{
    const builder = new PathItemObjectBuilder()
        .addParameter(parameterRef(parentId));
    if (all) {
        builder.addGet(all());
    }
    if (insert) {
        builder.addPost(insert());
    }
    return builder.build();
}

// PathItem for parent object detail endpoint
export function pathItemChildDetail(
    childModel: string,
    childId: string,
    parentId: string,
    find?: () => ob.OperationObject,
    remove?: () => ob.OperationObject,
    update?: () => ob.OperationObject,
): ob.PathItemObject{
    const builder = new PathItemObjectBuilder()
        .addParameter(parameterRef(parentId))
        .addParameter(parameterRef(childId));
    if (find) {
        builder.addGet(find());
    }
    if (remove) {
        builder.addDelete(remove());
    }
    if (update) {
        builder.addPut(update());
    }
    return builder.build();
}

// PathItem for parent object children endpoint

export function pathItemParentChildren(
    parentId: string,
    children: () => ob.OperationObject
): ob.PathItemObject
{
    const builder = new PathItemObjectBuilder()
        .addParameter(parameterRef(parentId))
        .addGet(children());
    return builder.build();
}

// PathItem for parent object collection endpoint
export function pathItemParentCollection(
    model: string,
    all?: () => ob.OperationObject,
    insert?: () => ob.OperationObject
): ob.PathItemObject
{
    const builder = new PathItemObjectBuilder();
    if (all) {
        builder.addGet(all());
    }
    if (insert) {
        builder.addPost(insert());
    }
    return builder.build();
}

// PathItem for parent object detail endpoint
export function pathItemParentDetail(
    model: string,
    modelId: string,
    find?: () => ob.OperationObject,
    remove?: () => ob.OperationObject,
    update?: () => ob.OperationObject,
): ob.PathItemObject{
    const builder = new PathItemObjectBuilder()
        .addParameter(parameterRef(modelId));
    if (find) {
        builder.addGet(find());
    }
    if (remove) {
        builder.addDelete(remove());
    }
    if (update) {
        builder.addPut(update());
    }
    return builder.build();
}

// ***** Path Parameters *****

export function pathParam(modelId: string): string {
    return "{" + modelId + "}";
}

// ***** Query Parameters *****

export function paginations(): ob.ParametersObject {
    const parameters: ob.ParametersObject = {};
    parameters[LIMIT] = parameterRef(LIMIT);
    parameters[OFFSET] = parameterRef(OFFSET);
    return parameters;
}

// ***** Request Bodies *****

export function modelRequestBody(model: string): ob.RequestBodyObject {
    return new ob.RequestBodyObjectBuilder()
        .addContent(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .addSchema(schemaRef(model))
            .build())
        .addRequired(true)
        .build();
}

// ***** Responses *****

export function errorResponse(description: string): ob.ResponseObject {
    return new ob.ResponseObjectBuilder(description)
        .addContent(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .addSchema(schemaRef(ERROR))
            .build())
        .build();
}


export function modelResponse(model: string): ob.ResponseObject {
    return new ob.ResponseObjectBuilder(`The specified ${model}`)
        .addContent(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .addSchema(schemaRef(model))
            .build())
        .build();
}

export function modelsResponse(model: string): ob.ResponseObject {
    return new ob.ResponseObjectBuilder(`The requested ${pluralize(model)}`)
        .addContent(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .addSchema(new ob.SchemaObjectBuilder()
                .addItems(schemaRef(pluralize(model)))
                .addType("array")
                .build())
            .build())
        .build();
}

// ***** Property Schemas *****

export function activeSchema(model: string): ob.SchemaObject {
    return new ob.SchemaObjectBuilder(
        "boolean",
        `Is this ${model} active?`,
        true).build();
}

export function commentsSchema(model: string): ob.SchemaObject {
    return new ob.SchemaObjectBuilder(
        "string",
        `General comments about this ${model}`,
        true).build();
}

export function facilityIdSchema(model: string): ob.SchemaObject {
    return new ob.SchemaObjectBuilder(
        "integer",
        `Primary key of the Facility that owns this ${model}`,
        false).build();
}

export function guestIdSchema(model: string): ob.SchemaObject {
    return new ob.SchemaObjectBuilder(
        "integer",
        "Primary key of the Guest that owns this ${model}",
        false).build();
}

// ID is ignored on insert transactions, so it is technically nullable
export function idSchema(model: string): ob.SchemaObject {
    return new ob.SchemaObjectBuilder(
        "integer",
        `Primary key for this ${model}`,
        true).build();
}

export function nameSchema(model: string): ob.SchemaObject {
    return new ob.SchemaObjectBuilder(
        "string",
        "Canonical name of this ${model}",
        false).build();
}

