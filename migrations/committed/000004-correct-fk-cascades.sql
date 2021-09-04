--! Previous: sha1:09d3e8f6a981d1c99bea0b5891480dcc202495f7
--! Hash: sha1:238cf8fa5160bb05921020f676302087c894d9bd
--! Message: correct fk cascades

-- Correct foreign key constraints

-- Undo if rerunning
ALTER TABLE access_tokens DROP CONSTRAINT IF EXISTS fk_access_tokens_user_id;
ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS fk_refresh_tokens_user_id;

-- Recreate with ON DELETE and ON UPDATE semantics
ALTER TABLE access_tokens ADD CONSTRAINT fk_access_tokens_user_id
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE refresh_tokens ADD CONSTRAINT fk_refresh_tokens_user_id
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
