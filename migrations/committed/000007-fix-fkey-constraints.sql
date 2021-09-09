--! Previous: sha1:3bd49c0bae3aa4e42d2337a74724f63d7bd5bbfa
--! Hash: sha1:2679416b645cd4b78bf50d8b10aa9aef3b50e5d5
--! Message: fix-fkey-constraints

-- Fix foreign key constraints so far

-- Fix constraint on access_tokens
ALTER TABLE access_tokens DROP CONSTRAINT access_tokens_user_id_fkey;
ALTER TABLE access_tokens ADD CONSTRAINT access_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE;

-- Fix constraint on refresh_tokens
ALTER TABLE refresh_tokens DROP CONSTRAINT refresh_tokens_user_id_fkey;
ALTER TABLE refresh_tokens ADD CONSTRAINT refresh_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE;

-- Fix constraint on templates
ALTER TABLE templates DROP CONSTRAINT templates_facility_id_fkey;
ALTER TABLE templates ADD CONSTRAINT templates_facility_id_fkey
    FOREIGN KEY (facility_id) REFERENCES facilities (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
