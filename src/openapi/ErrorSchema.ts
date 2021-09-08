// Error ---------------------------------------------------------------------

// OpenAPI Builder declarations for Error objects.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";

// Internal Modules ----------------------------------------------------------

import * as Common from "./Common";
import {
} from "./Constants";

// Public Objects ------------------------------------------------------------

export function schema(): ob.SchemaObject {
    return new ob.SchemaObjectBuilder()
        .addProperty("context", new ob.SchemaObjectBuilder("string",
            "Error source location").build())
        .addProperty("inner", new ob.SchemaObjectBuilder("object",
            "Nested error we are wrapping (if any)").build())
        .addProperty("message", new ob.SchemaObjectBuilder("string",
            "Error message summary").build())
        .addProperty("status", new ob.SchemaObjectBuilder("integer",
            "HTTP status code").build())
        .addType("object")
        .build();
}
