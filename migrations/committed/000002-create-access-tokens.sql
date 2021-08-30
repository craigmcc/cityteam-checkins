--! Previous: sha1:c90910e00ba697b0e44d8deaf0862334107b77c2
--! Hash: sha1:e3256a21e9ff3eea58b19c451e3ec9ab706b37e9
--! Message: create-access-tokens

-- Create access_tokens table

-- Undo if rerunning
DROP TABLE IF EXISTS access_tokens;

-- Create table
CREATE TABLE access_tokens (
    id              SERIAL PRIMARY KEY,
    expires         TIMESTAMP WITH TIME ZONE NOT NULL,
    scope           TEXT NOT NULL,
    token           TEXT NOT NULL,
    user_id         INTEGER NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX uk_access_tokens_token
    ON access_tokens (token);

-- Create foreign key constraint
ALTER TABLE access_tokens ADD CONSTRAINT fk_access_tokens_user_id
  FOREIGN KEY (user_id) REFERENCES users (id);
