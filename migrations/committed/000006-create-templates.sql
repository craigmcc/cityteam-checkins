--! Previous: sha1:c67ab8f64d8af6eac7604159295a11c5a7cbb268
--! Hash: sha1:3bd49c0bae3aa4e42d2337a74724f63d7bd5bbfa
--! Message: create-templates

-- Create templates table

-- Undo if rerunning
DROP TABLE IF EXISTS templates;

-- Create table
CREATE TABLE templates (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT true,
    all_mats        TEXT NOT NULL,
    comments        TEXT,
    facility_id     INTEGER NOT NULL,
    handicap_mats   TEXT,
    name            TEXT NOT NULL,
    socket_mats     TEXT,
    work_mats       TEXT
);

-- Create unique index
CREATE UNIQUE INDEX templates_facility_id_name_key ON templates (facility_id, name);

-- Create foreign key constraint
ALTER TABLE templates ADD CONSTRAINT templates_facility_id_fkey
    FOREIGN KEY (facility_id) REFERENCES facilities (id);
