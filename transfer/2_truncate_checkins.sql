-- 2_truncate_checkins.sql -- Truncate tables in "checkins" database.
-- Note:  CASCADE will deal with dependency tables.

TRUNCATE users CASCADE;
TRUNCATE facilities CASCADE;

