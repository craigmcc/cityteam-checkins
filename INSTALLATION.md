# INSTALLATION

Installing and operating the CityTeam Checkins Application requires installing a number
of prerequisite software packages.  All of them are available at no cost, and
nearly all of the software is open source.  (This application could not have been
developed without the extremely rich technologies made available by open source
communities -- thanks to all of them!).

These instructions are primarily oriented towards a Windows 10 environment, but the
software was developed (and extensively tested) on Mac OSX, and should run fine on
any Linux/Unix platform as well.

NOTE:  During the installation process, you will be asked to choose and configure
a number of values (such as passwords) that will be needed later.
[This document](./CHEATSHEET.md), if printed out, provides a convenient way to
record and save these values.  THIS DOCUMENT CONTAINS SENSITIVE INFORMATION, SO
ACCESS TO IT SHOULD BE CLOSELY CONTROLLED.

## 1. PLANNING

### 1.1 Environments

The CityTeam Checkins application is composed of several components, which may be
installed in a number of different combinations on the same or different computers.
The environments themselves are:

1. End User - The end users of the application will use a standard web browser.
2. Application - The application itself is written in Typescript (an enhanced version of JavaScript), and runs in a Node.JS based environment.
3. Database - The application uses a Postgres database for storing the persistent data.

In **ALL** cases, Internet connectivity will be required for the actual installation
process, as well as for performing updates later.

### 1.2 Installation Scenarios

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

NOTE:  Installing this software requires a web browser and an Internet connection.

### 2.1 Install PostgreSQL

Download the latest release from [here](https://www.postgresql.org/download/).

Install tutorials for Windows install are [here](https://www.postgresqltutorial.com/install-postgresql/).
(There are similar tutorials for other platforms, if needed.)

Installation Notes:
* When choosing components to be installed, omit the Stack Builder.  Everything else is required.
* When you enter the password for the *database superuser*, **BE SURE TO WRITE IT DOWN**.  This will be required later.
* Verify the installation as described in the tutorial.

### 2.2 Create Postgres User

In the following steps, {DBUSERNAME} and {DBPASSWORD} are placeholders for the
selected username and password you have chosen.

Open a shell command window for this (and the following) commands.

```bash
createuser --pwprompt {DBUSERNAME}
```

You will be prompted to enter the password you wish to use (this will become the
{DBPASSWORD} value in later commands).

### 2.3 Create Application Database (and Shadow)

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

You will want to make note of the following additional placeholder variables that
depend on which installation environment you are using, and whether you
changed the Postgres port number during installation:
* {DBHOST} - Network name for the computer on which the Postgres database was installed.  For a standalone environment, use **localhost** as this value.
* {DBPORT} - Network port on which the Postgres database was installed.  This will be **5432** unlesss you changed it during the installation process.
* {PGUSERNAME} - Operating system username for the Postgres database.  This will be **postgres** unless you changed it during the install.
* {PGPASSWORD} - This will be the "database superuser" password you set during the install.

## 3. APPLICATION ENVIRONMENT - REQUIRED DEPENDENCIES

NOTE:  Installing this software requires a web browser and an Internet connection.

### 3.1 Database Command Line Tools

THIS IS ONLY REQUIRED IF THE APPLICATION COMPONENT IS ON A DIFFERENT COMPUTER
THAN THE DATABASE COMPONENT.  IF THEY ARE THE SAME, THE COMMAND LINE TOOLS WILL
ALREADY BE AVAILABLE.

Repeat the Postgres installation process, but select only the *Command Line Tools*
component.  None of the rest is required on the Application Component computer.

### 3.2 Node.JS Application

NOTE:  The install process for Node.JS will install about 3gb of Microsoft support
software required to build it.  Be sure you have enough disk space.

Node.JS is the runtime environment for the CityTeam Checkins application,
which is written in TypeScript (a superset of JavaScript).

* At the [download site](https://nodejs.org), click on the most recent LTS (long term support) link.
* Click on the downloaded file to execute it.
* The instructions will recommend a Windows restart at the end, which is a good idea.

To verify the installation, open a command line window (if not already open) and type:
```shell
node --version
```

You should see the installed Node version number.

### 3.3 Node.JS Global Modules

The following Node.JS modules must be installed globally.  From
a command line window:

```shell
npm install -g graphile-migrate
npm install -g pm2
npm install -g pm2-windows-startup
```

To verify the installation, open a command line window (if not already open) and type:
```shell
graphile-migrate --version
```

### 3.4 Visual Studio Code

Visual Studio Code is a developer-oriented text editor.  It is not required to
execute the CityTeam Checkins Application, but is extremely handy in case
a developer or IT person needs to tweak anything.

* At the [download site](https://code.visualstudio.com) use the Download dropdown to pick the version for your operating system and download it.
* Click on the downloaded file to execute it.

After successful installation, you should see *Visual Studio Code* as an
available application in your system's Start menu (or equivalent).

### 3.5 Git

Git is a source code management tool, which will be used to retrieve the
initial download of the CityTeam Checkins Application, as well as any
subsequent updates.

* At the [download site](https://git-scm.com/downloads), pick the version for your operating system and download it.
* Click on the downloaded file to execute it.
* All of the default installation options should be fine, but changing one setting will make life easier for developers:
  * For "Choosing the default editor used by Git", select "Use Visual Studio Code as Git's default editor".

To verify the installation, open a command line window (if not already open) and type:
```shell
git --version
```

### 3.6 Postman

Postman is a developer oriented tool that supports manually executing HTTP requests
to the CityTeam Checkins Application (or any other accessible web application).  It
will be required during application installation, and is very handy for debugging
and other purposes later.

* At the [download site](https://postman.com/downloads/) click the download link (it should know your operating system already).
* Click the downloaded file to execute it.
* You will be required to set up a free Postman account, which will optionally get you some spam email that can be ignored.

After successful installation, you should see *Postman* as an
available application in your system's Start menu (or equivalent).

## 4.  APPLICATION ENVIRONMENT - THE CITYTEAM CHECKINS APPLICATION

NOTE:  Installing this software requires a web browser and an Internet connection.

### 4.1 Download and Build CityTeam Checkins Application

Open a command line window (if not already open) and type:
```shell
git clone https://github.com/craigmcc/cityteam-checkins
```

This will download all of the source code for the application.  To build the
executable version, type the following commands:
```shell
cd cityteam-checkins
npm install
npm run server:build
cd client
npm install
npm run build
cd ..
```

This will leave you in the *cityteam-checkins* directory, where the
subsequent steps will be performed.

### 4.2 Seed Database Structure and Initial Contents

Next, we will execute "migration" utilities that change our empty database
into one that contains the table structures required by this application.
In order to do this, we must first set some environment variables.

Open a command line window (if not already open), and make sure you are
in the *cityteam-checkins* directory.  Now, type the following commands, but
replace the placeholder names (such as {DBUSERNAME}) with the values from
the previous steps.

NOTE:  On a Unix, Linux, or Mac system, use the word "export" instead of "set".

```shell
set DATABASE_URL="postgres://{DBUSERNAME}:{DBPASSWORD}@{DBHOST}:{DBPORT}/{DBNAME}"
set SHADOW_DATABASE_URL="postgres://{DBUSERNAME}:{DBPASSWORD}@{DBHOST}:{DBPORT}/{DBNAME}_shadow"
set ROOT_DATABASE_URL="postgres://{PGUSERNAME}:{PGPASSWORD}@{DBHOST}:{DBPORT}/postgres"
```

Next, execute the following command to perform the required migrations:

```shell
graphile-migrate migrate
```

### 4.3 Set Up Configuration Files for Development and Production Use

Two "environment" files must be set up, which contain configuration information based on
your previous setup.  The first one, for developer use, turns off some security checks
and causes all logged messages to be sent to the command line window.

In the configuration files and examples below, {APPHOST} is the network name of the
computer hosting the Application Environment ("localhost" for a standalone install),
and {APPPORT} is the network port (on the {APPHOST} system) for the application to
listen on (use 8080 unless not allowed in your environment).

Use Visual Studio Code (or another text editor) to create a file **.env.development**
(do not forget the leading period) in the *cityteam-checkins* directory:
```dotenv
ACCESS_LOG=stdout
CLIENT_LOG=stdout
DATABASE_URL=postgres://{DBUSERNAME}:{DBPASSWORD}@{PGHOST}:{PGPORT}/{DBNAME}
OAUTH_ENABLED=false
PORT={APPPORT}
SERVER_LOG=stdout
SUPERUSER_SCOPE=superuser
```

With this setup, log files will be sent to the command line window (stdout), and
OAuth authorization of network API calls will be disabled.  This configuration
should ONLY be used as part of the initial setup, or by developers working on the system.

Set up a similar file named **.env.production** (again, remember the leading period)
in the same directory:
```dotenv
ACCESS_LOG=access.log
CLIENT_LOG=client.log
DATABASE_URL=postgres://{DBUSERNAME}:{DBPASSWORD}@{PGHOST}:{PGPORT}/{DBNAME}
OAUTH_ENABLED=true
PORT={APPPORT}
SERVER_LOG=server.log
SUPERUSER_SCOPE=superuser
```

With this setup, log files will be stored in a *log* subdirectory, with filenames
that rotate each day.  In addition, normal OAuth authentication will be required
on all network API calls (even those that do not come from this application).
This configuration will be the one normally used to operate the system.

### 4.4 Start the Application And Configure Initial Superuser

As installed, the database contains no users, so no one can log in.  We need
to set up an initial (temporary) user account, which we can then use to log in
and set up all the actual accounts.

Open a command line window (if not already open), and make sure you are
in the *cityteam-checkins* directory.

```shell
npm run start:dev
```

As initially installed, the database has no users in it, so no one can log in.
We need to create a user with superuser ("all powerful") permissions, in order
to create the actual users, and ensure that Facility and Template configurations
are set up to meet local requirements.

This can be performed by any tool that can issue HTTP requests (such as *curl* in
a Mac or Unix/Linux world).  We will use Postman, which was installed earlier, and
is tailor made for this kind of interactions.

* Start up Postman from your application menu, logging on if necessary (one time step).
* In the grey bar (left of the Send button), change the verb from GET to POST.
* Set the URL for sending (with placeholder replacements): **http://{APPHOST}:{APPPORT}/api/users**
* Just below, click the "Body" tab so we can define the details to be sent.
* Below that, select "raw", then open the "Text" dropdown, and select "JSON".

In the body area, fill in a properly formatted JSON structure like this:

```json
{
  "active": true,
  "name": "Superuser User",
  "password": "{SUPASSWORD}",
  "scope": "superuser",
  "username": "{SUUSERNAME}"
}
```

NOTE:  The contents of the *name* and *username* fields do not matter - the key
requirement is that the *scope* field be set to **"superuser"** to enable the
appropriate permissions.

Now, click the "Send" button.  If everything worked, you should get a response back
with a response status of 201 (Created), with a JSON mirroring what you sent with the
following changes:
* An "id" field will be returned - this is assigned by the database as the primary key.
* The "password" field will be blanked out, but it got recorded (in a hashed form that cannot be decoded) in the database.

At this point, the username and password you used can be used to log in.

### 4.5 Set Up Initial Users And Other Details

Open a browser and navigate to **http://{APPHOST}:{APPPORT}**.

TODO: login with assigned superuser credentials.

Navigate to Admin -> Users.  Use the *Add* button to create each user that you need.
For the **scope** field, you will enter {FACILITY_SCOPE}:regular for a regular user
(this is all that is needed to perform checkin operations), or {FACILITY_SCOPE}:admin
for users who should also be able to modify characteristics like setting up templates.

What are the FACILITY_SCOPE values?  You can see them by navigating to Admin -> Facilities.
You'll see that the initial set of values was based on the three-letter airport abbreviation
for the closest major airport, but any combination of letters and numbers is legal (as long
as they are unique for each facility).  So, for a Portland front desk person that performs
checkins, **pdx:regular** would be the required scope value.

If you want to grant permissions to a particular username for more than one Facility,
simply add another scope (separated by spaces) in the user's "Scope" field.

It is certainly possible to set up usernames for each individual person that might be
operating the application, but it is also likely that there will be multiple people
performing this operation, in the same facility, on the same evening.  It would be
a hassle to require them to log off and on each time they switch who is operating the
application, so a single username for the whole group that shares a single checkin
location is probably the simplest approach.  (In Portland, we call this user
"frontdesk" because that is where the checkins happen).

## 5.  END USER ENVIRONMENT

This will be necessary on the computer for each checkin station at a Facility, if that
checkstation is not the Application Environment server and therefore has a browser installed
already.

TODO: download links

TODO: note on setting up bookmark and/or shortcut.


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
