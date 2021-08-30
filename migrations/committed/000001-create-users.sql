--! Previous: -
--! Hash: sha1:c90910e00ba697b0e44d8deaf0862334107b77c2
--! Message: create-users

-- Create users table

-- Undo if rerunning
DROP TABLE IF EXISTS users;

-- Create table
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    name            TEXT NOT NULL,
    password        TEXT NOT NULL,
    scope           TEXT NOT NULL,
    username        TEXT NOT NULL
);

-- Create unique index
CREATE UNIQUE INDEX uk_users_username
  ON users (username);
