-- 3_copy_to_checkins.sql -- Copy data to "checkins" database from CSV files.
-- NOTE: MUST be done in top-down dependency order for foreign key relationships.

\copy users (id,active,name,password,scope,username) FROM 'users.csv' CSV;
\copy access_tokens (id, expires, scope, token, user_id) FROM 'access_tokens.csv' CSV;
\copy refresh_tokens (id,access_token,expires,token,user_id) TO 'refresh_tokens.csv' CSV;

\copy facilities (id,active,address1,address2,city,email,name,phone,scope,state,zipcode) FROM 'facilities.csv' CSV;
\copy templates (id,active,all_mats,comments,facility_id,handicap_mats,name,socket_mats,work_mats) FROM 'templates.csv' CSV;
\copy guests (id,active,comments,facility_id,favorite,first_name,last_name) FROM 'guests.csv' CSV;
\copy checkins (id,checkin_date,comments,facility_id,features,guest_id,mat_number,payment_amount,payment_type,shower_time,wakeup_time) FROM 'checkins.csv' CSV;

