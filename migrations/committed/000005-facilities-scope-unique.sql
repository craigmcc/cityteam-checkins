--! Previous: sha1:3360fe0430ce8b4ab303ff7ca948f60e88f9c4ea
--! Hash: sha1:c67ab8f64d8af6eac7604159295a11c5a7cbb268
--! Message: facilities-scope-unique

-- Require facilities.scope to be unique

-- Undo if rerunning
DROP INDEX IF EXISTS facilities_scope_key;

-- Create unique index
CREATE UNIQUE INDEX facilities_scope_key ON facilities (scope);
