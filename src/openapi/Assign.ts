// Assign --------------------------------------------------------------------

// OpenAPI Builder declaration for Assign model objects.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";
const pluralize = require("pluralize");

// Internal Modules ----------------------------------------------------------

import {
    commentsSchema, schemaRef
} from "./Common";
import {
    ASSIGN, CHECKIN, CHECKIN_ID, COMMENTS,
    GUEST_ID, PAYMENT_AMOUNT, PAYMENT_TYPE,
    SHOWER_TIME, WAKEUP_TIME
} from "./Constants";

// Public Objects ------------------------------------------------------------

export function schema(): ob.SchemaObject {
    return new ob.SchemaObjectBuilder()
        .addProperty(CHECKIN_ID, new ob.SchemaObjectBuilder(
            "number",
            "ID of the Checkin to which this assignment is being moved (reassign only)",
            true).build())
        .addProperty(COMMENTS, commentsSchema(CHECKIN))
        .addProperty(GUEST_ID, new ob.SchemaObjectBuilder(
            "number",
            "ID of the Guest to be assigned to a Checkin (assign only)",
            true).build())
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
        .addDescription("List of assignments")
        .addItems(schemaRef(ASSIGN))
        .addType("array")
        .build();
}
