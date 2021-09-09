--! Previous: sha1:94090c87772028fca9c000e4fec1e94db1732f1b
--! Hash: sha1:f541bd802acc7b59894afc258d0d5cb87a2a8967
--! Message: create-checkins

-- Create checkins table

-- Undo if rerunning
DROP TABLE IF EXISTS checkins;

-- Create table
CREATE TABLE checkins (
    id              SERIAL PRIMARY KEY,
    checkin_date    DATE NOT NULL,
    comments        TEXT,
    facility_id     INTEGER NOT NULL,
    features        TEXT,
    guest_id        INTEGER,
    mat_number      INTEGER NOT NULL,
    payment_amount  NUMERIC(5, 2),
    payment_type    TEXT,
    shower_time     TIME WITHOUT TIME ZONE,
    wakeup_time     TIME WITHOUT TIME ZONE
);

-- Create unique index
CREATE UNIQUE INDEX checkins_facility_id_checkin_date_mat_number_key
    ON checkins (facility_id, checkin_date, mat_number);

-- Create foreign key constraints
ALTER TABLE checkins ADD CONSTRAINT checkins_facility_id_fkey
    FOREIGN KEY (facility_id) REFERENCES facilities (id)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE checkins ADD CONSTRAINT checkins_guest_id_fkey
    FOREIGN KEY (guest_id) REFERENCES guests (id)
    ON UPDATE CASCADE ON DELETE SET NULL;
