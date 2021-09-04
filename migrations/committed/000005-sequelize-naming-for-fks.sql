--! Previous: sha1:238cf8fa5160bb05921020f676302087c894d9bd
--! Hash: sha1:b8459a17f5f6c3e8000745a8849cb1bf3c0031ec
--! Message: sequelize-naming-for-fks

-- Use constraint names that match Sequelize conventions

-- Undo if rerunning
ALTER TABLE access_tokens DROP CONSTRAINT IF EXISTS access_tokens_user_id_fkey;
ALTER TABLE access_tokens DROP CONSTRAINT IF EXISTS fk_access_tokens_user_id;
ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey;
ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS fk_refresh_tokens_user_id;

-- Recreate with ON DELETE and ON UPDATE semantics and Sequelize naming conventions
ALTER TABLE access_tokens ADD CONSTRAINT access_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE refresh_tokens ADD CONSTRAINT refresh_tokens_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE;
