-- 1_copy_from_guests.sql -- Copy data from "guests" database to CSV files.
-- NOTE: leave out facility_id and level on users.
-- NOTE: facilities.zipCode needs special treatment.

\copy access_tokens (id, expires, scope, token, user_id) TO 'access_tokens.csv' CSV;
\copy checkins (id,checkin_date,comments,facility_id,features,guest_id,mat_number,payment_amount,payment_type,shower_time,wakeup_time) TO 'checkins.csv' CSV;
\copy facilities (id,active,address1,address2,city,email,name,phone,scope,state,"zipCode") TO 'facilities.csv' CSV;
\copy guests (id,active,comments,facility_id,favorite,first_name,last_name) TO 'guests.csv' CSV;
\copy refresh_tokens (id,access_token,expires,token,user_id) TO 'refresh_tokens.csv' CSV;
\copy templates (id,active,all_mats,comments,facility_id,handicap_mats,name,socket_mats,work_mats) TO 'templates.csv' CSV;
\copy users (id,active,name,password,scope,username) TO 'users.csv' CSV;

