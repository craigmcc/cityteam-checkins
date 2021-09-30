-- 5_cleanup_checkins.sql -- Clean up transferred data in "checkins".

UPDATE users SET scope = 'test:admin' WHERE scope = 'test admin regular';
UPDATE users SET scope = 'test:regular' WHERE scope = 'test regular';
UPDATE users SET scope = 'pdx:regular' WHERE scope = 'pdx regular';
UPDATE users SET scope = 'pdx:admin' WHERE scope = 'pdx admin regular';

