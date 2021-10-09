# INSTALLATION

Installing and operating the CityTeam Checkins Application requires installing a number
of prerequisite software packages.  All of them are available at no cost, and
nearly all of the software is open source.  (This application could not have been
developed without the extremely rich technologies made available by open source
communities -- thanks to all of them!).

These instructions are primarily oriented towards a Windows 10 environment, but the
software was developed (and extensively tested) on Mac OSX, and should run fine on
any Linux/Unix platform as well.

## 1. PLANNING

### 1.1 ENVIRONMENTS

The CityTeam Checkins application is composed of several components, which may be
installed in a number of different combinations on the same or different computers.
The components themselves are:

1. End User - The end users of the application will use a standard web browser.
2. Application - The application itself is written in Typescript (an enhanced version of JavaScript), and runs in a Node.JS based environment.
3. Database - The application uses a Postgres database for storing the persistent data.

In **ALL** cases, Internet connectivity will be required for the actual installation
process, as well as for performing updates later.

### 1.2 INSTALLATION SCENARIOS

The various components can be installed in a variety of combinations, depending
on requirements for each individual CityTeam Facility (or the entire set of
Facilities).

**STANDALONE**

All three components are installed onto a single computer.  The combination will
all fit comfortably on pretty much any modern laptop with at least 8gb of main
memory and 100gb of storage space.

Advantages:
* Least complex to install, troubleshoot, and maintain.
* No Internet connectivity required after installation is complete.

Considerations:
* Not optimal for a Facility with more than one checkin location for overnight Guests, because the database would not be shared.
* Hardware or software problems on the installed laptop could render the application unavailable.
* Maintenance and troubleshooting require onsite access.

**LOCAL AREA NETWORK**

The *Application* and *Database* components are installed in a shared
environment (either on the same computer or separately, as desired), while
checkin locations require only a web browser.

Advantages:
* Supports multiple checkin locations sharing the same database information.
* Changes made at one intake location are immediately visible at others.
* Administrative staff can monitor the checkin process, and/or adjust background information.
* Database information (some of which is personally identifiable information) can be stored in a secure environment.
* No Internet connectivity required after installation is complete.

Considerations:
* Checkin locations must have local area network connection to the Node.JS Environment computer.
* Application component must have local area network (LAN) connection to the Database component (if it is separate).
* No Internet connectivity required after installation is complete.
* Maintenance and troubleshooting require onsite access.
* THIS OPTION WILL REQUIRE MODIFICATIONS TO THE APPLICATION TO SUPPORT ENCRYPTED COMMUNICATION.

**CLOUD NETWORK**

The *Application* and *Database* components are installed in a shared
environment that is accessible via the Internet.  This environment could be
a "private cloud" managed and operated solely for CityTeam, or a shared
environment on a "public cloud" network.  Checkin locations require only
a web browser.

Advantages:
* Can support all CityTeam Facilities with a single installation.
* Users can be granted either "regular" or "admin" access to more than one Facility, if desired.
* Easier to consolidate information from multiple Facilities for overall management.
* Nearly all maintenance and troubleshooting can be performed remotely.

Considerations:
* Costs of setting up (and utilizing) either private cloud or public cloud environments.
* Installation requires a higher level of technical knowledge.
* Internet connectivity at all checkin locations is required for operation.
* THIS OPTION WILL REQUIRE MODIFICATIONS TO THE APPLICATION TO SUPPORT ENCRYPTED COMMUNICATION.


## 2.  DATABASE ENVIRONMENT

### 2.1 INSTALL POSTGRESQL

Download the latest release from [here](https://www.postgresql.org/download/).

Install tutorials for Windows install are [here](https://www.postgresqltutorial.com/install-postgresql/)

(There are similar tutorials for other platforms, if needed.)

Installation Notes:
* When choosing components to be installed, omit the Stack Builder.  Everything else is required.
* When you enter the password for the *database superuser*, **BE SURE TO WRITE IT DOWN**.  This will be required later.
* Verify the installation as described in the tutorial.

### 2.2 CREATE THE POSTGRES USER TO OWN THE APPLICATION DATABASE

In the following steps, {DBUSERNAME} and {DBPASSWORD} are placeholders for the
selected username and password you have chosen.

Open a shell command window for this (and the following) commands.

```bash
createuser --pwprompt {DBUSERNAME}
```

You will be prompted to enter the password you wish to use (this will become the
{DBPASSWORD} value in later commands).

### 2.3 CREATE THE APPLICATION DATABASE (AND ITS SHADOW)

In the following steps, {DBNAME} is the placeholder for the database name you created.
If you do not have a specific database name in mind, use "**checkins**"".

```shell
createdb --owner={DBUSERNAME} {DBNAME}
```

The installation process will also require a "shadow" database that is used to confirm
that the SQL commands setting up the application's tables are correct.

```shell
createdb --owner={DBUSERNAME} {DBNAME}_shadow
```

To verify that the database was created successfully and is accessible,
issue the following command:

```shell
psql --username={DBUSERNAME} {DBNAME} 
```
You will be challenged to enter the corresponding password
(the value of {DBPASSWORD} from above).  Connecting with no errors will show
you a prompt (including the database name), at which you can enter **\q**
to exit.

## 3. APPLICATION ENVIRONMENT - REQUIRED DEPENDENCIES

### 3.1 DATABASE COMMAND LINE TOOLS

<span color="red">
THIS IS ONLY REQUIRED IF THE APPLICATION COMPONENT IS ON A DIFFERENT COMPUTER
THAN THE DATABASE COMPONENT.  IF THEY ARE THE SAME, THE COMMAND LINE TOOLS WILL
ALREADY BE AVAILABLE.
</span>

Repeat the Postgres installation process, but select only the *Command Line Tools*
component.  None of the rest is required on the Application Component computer.

### 3.2 NODE.JS AND RELATED SOFTWARE

TODO - download and install Node.JS

### 3.3 NODE.JS GLOBAL MODULES

The following Node.JS modules must be installed globally.  From
a command line window:

```shell
npm install -g graphile-migrate
```

Verify successful installation of these extra modules, use the following
commands (should show version information but no errors):

```shell
graphile-migrate --version
```

### 3.4 GIT VERSION CONTROL SYSTEM

TODO

### 3.5 VISUAL STUDIO CODE

TODO

### 3.6 POSTMAN

TODO

## 4.  APPLICATION ENVIRONMENT - THE CITYTEAM CHECKINS APPLICATION

TODO

## 5.  END USER ENVIRONMENT

This will be necessary on the computer for each checkin station at a Facility.

The application's user interface has been tested with Chrome, Firefox, Safari,
and Microsoft Edge.  If one of these is not available, you can use one of the
following download links to install whichever one you like.

TODO - download links.

TODO - hint on creating bookmark and/or shortcut to the application.  The link
URL will be **http://{APPHOST}:{APPPORT}** unless encrypted communication is in
use (Local Area Network or Cloud Network), when the first portion will be
"https:" instead of "http:".

====================================================

--- TODO - REFINE AND INTEGRATE REMAINING STUFF ---

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
