# CHECKINS APPLICATION CHEAT SHEET

This document (after printing it out) is a convenient place to keep track
of all the configuration choices and sensitive values like passwords that
you have chosen while installing the CityTeam Checkins Application.  It
will also assist you in issuing command line requests, where you will need
to replace all {PLACEHOLDER} type strings with their corresponding values.

## Database Environment Settings

| Placeholder | Description | Configured Value To Be Used |
| ----------- | ----------- | --------------------------- |
| {DBHOST} | Network name of Postgres host ("localhost" for standalone environment) | |
| {DBNAME} | Postgres database name (normally "checkins") | |
| {DBPASSWORD} | Postgres password for this application | |
| {DBPORT} | Postgres network port (5432 unless customized) | |
| {DBUSERNAME} | Postgres username for this application | |
| {PGPASSWORD} | Postgres "database superuser" password | |
| {PGUSERNAME} | Postgres OS username (normally "postgres") | |

# Application Environment Settings

| Placeholder | Description | Configured Value To Be Used |
| ----------- | ----------- | --------------------------- |
| {APPHOST} | Network name of Application host ("localhost" for standalone environment) |
| {APPPORT} | Network port of Application (normally 8080) | |
| {SUPASSWORD} | Application password for superuser user | |
| {SUUSERNAME} | Application username for superuser user | |

