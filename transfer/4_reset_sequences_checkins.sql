-- 4_reset_sequences_checkins.sql -- Reset id sequences in "checkins" database after load.

SELECT setval(pg_get_serial_sequence('access_tokens', 'id'),
              COALESCE(max(id) + 1, 1), false)
FROM access_tokens;

SELECT setval(pg_get_serial_sequence('checkins', 'id'),
              COALESCE(max(id) + 1, 1), false)
FROM checkins;

SELECT setval(pg_get_serial_sequence('facilities', 'id'),
              COALESCE(max(id) + 1, 1), false)
FROM facilities;

SELECT setval(pg_get_serial_sequence('guests', 'id'),
              COALESCE(max(id) + 1, 1), false)
FROM guests;

SELECT setval(pg_get_serial_sequence('refresh_tokens', 'id'),
              COALESCE(max(id) + 1, 1), false)
FROM refresh_tokens;

SELECT setval(pg_get_serial_sequence('templates', 'id'),
              COALESCE(max(id) + 1, 1), false)
FROM templates;

SELECT setval(pg_get_serial_sequence('users', 'id'),
    COALESCE(max(id) + 1, 1), false)
    FROM users;

