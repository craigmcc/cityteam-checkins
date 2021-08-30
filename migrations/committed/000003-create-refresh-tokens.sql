--! Previous: sha1:e3256a21e9ff3eea58b19c451e3ec9ab706b37e9
--! Hash: sha1:09d3e8f6a981d1c99bea0b5891480dcc202495f7
--! Message: create-refresh-tokens

-- Create refresh_tokens table

-- Undo if rerunning
DROP TABLE IF EXISTS refresh_tokens;

-- Create table
CREATE TABLE refresh_tokens (
    id              SERIAL PRIMARY KEY,
    access_token    TEXT NOT NULL,
    expires         TIMESTAMP WITH TIME ZONE NOT NULL,
    token           TEXT NOT NULL,
    user_id         INTEGER NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX uk_refresh_tokens_token
    ON refresh_tokens (token);

-- Create foreign key constraint
ALTER TABLE refresh_tokens ADD CONSTRAINT fk_refresh_tokens_user_id
    FOREIGN KEY (user_id) REFERENCES users (id);
