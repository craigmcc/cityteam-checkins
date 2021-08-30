# INSTALLATION

This document describes how to install all of the necessary software required
to run the CityTeam Checkins application on a standalone laptop or desktop PC.


## X. DATABASE MANAGEMENT SYSTEM

### X.1 INSTALL AND CONFIGURE POSTGRES SOFTWARE

NOTE - Save the Postgres master password for use in further commands
replacing the {POSTGRES_PASSWORD} placeholder.

### X.2 INSTALL AND CONFIGURE MIGRATION TOOL 

Changes to the database schema are managed with the
[graphile-migrate](https://github.com/graphile/migrate#readme) schema management
tool.  This is installed from a shell command line as follows:

```bash
npm install -g graphile-migrate
```

On a Linux or MacOS system, you may have to prefix the above command with ***sudo***
in order to install NPM packages in a global location.

You can verify a successful installation by the following shell command:

```bash
graphile-migrate --version
```

which will echo the version number of the installed package.

Next, we are going to create the actual database to be used, as well as the
shadow backup database used by the schema management tool.
Before you do this, choose a database username and password, and ***write them
down*** because they will be necessary in later setup steps.  In the following
shell commands, replace the *{USERNAME}* and *{PASSWORD}* placeholders with the
values you have chosen.

For the database itself, ***checkins*** is the typical name used, but you can
use any name you want.  Replace the *{DATABASE}* placeholer below with whatever
name you have chosen.

```bash
createuser --pwprompt {USERNAME}
createdb {DATABASE} --owner={USERNAME}
createdb {DATABASE}_shadow --owner={USERNAME}
```

In order to execute the migration commands, you will need to set up
***environment variables*** for the operating system to communicate
the appropriate settings, and then initialize the migration system.
How to do this depends on which OS you are using:

#### X.2.1 Windows

***TODO***

#### X.2.2 MacOSX or Linux

Create a file named ***.migraterc*** with the following contents:

```bash
export DATABASE_URL="postgres://{USERNAME}:{PASSWORD}@localhost/{DATABASE}"
export SHADOW_DATABASE_URL="postgres://{USERNAME}:{PASSWORD}@localhost/{DATABASE}_shadow"
export ROOT_DATABASE_URL="postgres://postgres:{POSTGRES_PASSWORD}@localhost/postgres"
```

(Note that this file contains sensitive information, so it should ***not*** be
checked in to a Git repository.  For this reason, the name *.migraterc* is
listed in *.gitignore* to instruct Git that this file should not be checked in.)

Now, whenever you want to execute migration commands, type the following
shell command first.  The values will last until you close this shell window.

```bash
. .migraterc
```

After you have run this, you can initialize the migration system:

```bash
graphile-migrate init
```
