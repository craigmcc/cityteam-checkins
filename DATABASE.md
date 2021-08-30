# DATABASE

As mentioned earlier, the database for this application uses PostgreSQL
as its DBMS.  This, and the tool used to manage changes to the schema,
were installed as described in [INSTALLATION](./INSTALLATION.md).  See
[graphile-migrate](https://github.com/graphile/migrate#readme) for
detailed information on the use of this tool.

## Schema Overview

TODO

## Making Schema Changes

If you need to modify the schema of the database, the general steps
are as follows:

First, edit the file ***migrations/current.sql*** to contain the commands
for your new migration.  In general, you will want to make sure that your
migration will succeed no matter what the current state of the database is.
For example, if you want to add a new table ***foo***, start your migration
with a command like:

```sql
DROP TABLE IF EXISTS foo;
```

to delete the table if it already exists (which will happen if you are
rerunning migrations for some reason).  Likewise, if you are adding
a new text column named ***bar*** to table ***foo***, do this:

```sql
ALTER TABLE foo
  ADD COLUMN IF NOT EXISTS bar TEXT NULL;
```

To try out the new migration, save ***current.sql*** and issue this
shell command (after you have established the environment variables
if not yet done):

```bash
graphile-migrate watch
```

This will run any previously committed migrations that have not yet been
executed, followed by the ***current.sql*** script you are creating.

Examine the database structure (using ***psql*** or other tools) to make
sure that the change you wanted was made correctly.  If it was not,
edit the file and save it, and it will be rerun for you.  (Aren't you
glad you made your script resilient to reruns now?).

When you are satisfied, execute this command to save your work permanently:

```bash
graphile-migrate commit -m {SHORT_COMMIT_MESSAGE}
```

where {SHORT_COMMIT_MESSAGE} is something like "create-users" to create the USERS
table.  This message will become part of the filename for the committed
migration.

This will move the current migration script into the ***migrations/committed***
directory, giving it a filename starting with a number, which increases as you
add new migrations.  These migrations will be used if you ever have to start
completely over again, or install the application against a new database
(perhaps on a different machine).

