--! Previous: sha1:2679416b645cd4b78bf50d8b10aa9aef3b50e5d5
--! Hash: sha1:94090c87772028fca9c000e4fec1e94db1732f1b
--! Message: create-guests

-- Create guests table

-- Undo if rerunning
DROP TABLE IF EXISTS guests;

-- Create table
CREATE TABLE guests (
                        id              SERIAL PRIMARY KEY,
                        active          BOOLEAN NOT NULL DEFAULT true,
                        comments        TEXT,
                        facility_id     INTEGER NOT NULL,
                        favorite        TEXT,
                        first_name      TEXT NOT NULL,
                        last_name       TEXT NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX guests_facility_id_last_name_first_name_key
    ON GUESTS (facility_id, last_name, first_name);

-- Create foreign key constraint
ALTER TABLE guests ADD CONSTRAINT guests_facility_id_fkey
    FOREIGN KEY (facility_id) REFERENCES facilities (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
