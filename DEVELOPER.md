# CityTeam Checkins Application - Developer Notes

This document is designed for software developers who want to help maintain and enhance
the CityTeam Checkins Application, or investigate issues with its execution.  All of the
material here is in geek-speak, so not relevant for someone who just wants to use it.

The code for this application itself is available in open source
[online](https://github.com/craigmcc/cityteam-checkins).  There is no sensitive
information in the source code - all of that is done with local configuration.

## 1. OVERALL ARCHITECTURE

The CityTeam Checkins Application is designed to support CityTeam Facilities that offer
overnight accommodations for individual Guests, with minimal overhead to the checkin process,
but supporting accurate record keeping and reporting.  It relies on a variety of (mostly)
open source software components that are each very popular, so it should not be difficult
to locate technical folks that can support or enhance it, if necessary.

The overall system is comprised of three environments (database, application, and end user)
as described in the [Installation](./INSTALLATION.md) documentation.  These pieces can be
installed all on the same system, in a local area network, or on a public or private cloud
platform.  Each of them will operate on any common operating system (Linux/Unix, Mac, Windows).
The end user environment only requires a web browser, with network connectivity when
not installed as a standalone environment.

For the purposes of understanding the architecture, we will look at three different aspects:
database, back end (application logic), and front end (user interface logic).

## 2. DATABASE

### 2.1 Introduction

All of the persistent information for this application is stored in a relational database (Postgres).
When the application is running, you can navigate to the **OpenAPI Docs** link, and scroll down
to the *Schemas* section, to see the JSON layouts of model objects exchanged with between the
back end and the front end, which correspond closely to the underlying database structures.

### 2.2 Technologies

[Graphile Migrate](https://github.com/graphile/migrate).  Tool for managing "migrations",
including the initial setup of the necessary database tables, and subsequent modifications.

[PostgreSQL](postgresql.org): One of the most commonly used database technologies.  While many
databases were possible candidates, Postgres has two features that are relied upon by this
application's implementation:
* The ILIKE operator, which is used to support case-insensitive wildcard searches against nearly every table.
* The RETURNING clause, which causes the database to return the result of an UPDATE operation, saving the need for a subseuqent SELECT.

### 2.3 Design Conventions

The following conventions were used in the design of the table and column structures that
support this application.
* *Primary Key*:  Each table has a primary key column named **id**, which is
  based on a database-provided sequence number generator.
* *Data Type Constraints*:  Prevents any user from storing malformed data
  (string versus number versus boolean) in a column.
* *Not Null Constraints*:  Columns that are required by the application's
  logic are defined as NOT NULL in the database.
* *Unique Constraints*:  Where appropriate, the database defines uniqueness
  constraints (Facility name, or Guest first name/last name within a Facility).
* *Foreign Key Constraints*: Where there are parent/child relationships between
  tables, there will be a FOREIGN KEY constraint defined on the child table.
* *Column Names*:  Where column names will be more naturally utilized in camel
  case (example: facilityId), they will be stored in the database with an 
  embedded dash (facility_id). This avoids the inconvenience of having to
  quote column names when using tools like **psql**.  The camel case usage
  in code will be accommodated by the Sequelize mapping of a column name to
  a field name in model objects.
* *Additional Indexes*: When the normal ORDER BY sequence for rows retrieved
  from the database is regularly used, an index based on that ordering is often
  defined.  This will not make a lot of practical difference for the likely size
  of the database for this application, but is a good general design principle.

None of this will be a surprise to anyone who has designed an application based upon a relational
database.  As we will see, however, the Back End and Front End portions of the application are
designed to minimize the number of times a constraint violation will cause an error.

### 2.4 Implementation Details

## 3. BACK END (APPLICATION LOGIC)

### 3.1 Introduction

### 3.2 Technologies

[BCrypt](https://github.com/kelektiv/node.bcrypt.js).  User passwords are stored in the
database as the result of a one-way hash that is not reversible.  Login password validation
is performed by hashing the password specified by the user and making sure that it matches.
Hence, no one can steal user passwords even if they abscond with a copy of the low level
database contents.

[Express](https://github.com/expressjs/express).  One of the most common libraries for
building NodeJS based web servers.  We are leveraging its sophisticated routing
technology, as well as the robust mechanism for plugins on each API endpoint.

[Helmet](https://github.com/helmetjs/helmet).  Add-on plugins for Express based
applications to avoid many potential network based attacks.

[Morgan](https://github.com/expressjs/morgan).  Library for creating access logs that
are compatible with standard analysis tools.

[Node JS](https://nodejs.org/en/) The de facto standard platform for building
server side Javascript/Typescript based applications.

[OAuth Orchestrator](https://github.com/craigmcc/oauth-orchestrator).  Library (written by
the primary author of this application) that supports the OAuth Password Resource Grant
flow.  This is used both for authentication, and also for permission grants by virtue of
the returned *scope* assigned to the logged in user.

[OpenAPI Builders](https://github.com/craigmcc/openapi-builders).  Library (written by
the primary author of this applciation) that supports programmatically creating API
specifications that conform to the OpenAPI 3.0 Specification.  These are available in
the back end application at endpoint **/openapi.json**, and in a visual way by navigating
to the "OpenAPI Docs" link.

[Pino](https://github.com/pinojs/pino).  Technology for recording log files, used by both
the back end and front end components of this application.

[Sequelize](https://github.com/sequelize/sequelize).  An amazing object-relational model (ORM)
implementation that provides many useful features, including field-wide and row-wide
validation, optional inclusion of nested child rows (it automatically manufactures join
queries), and nice programmatic generation for the syntax for WHERE clauses.

[Sequelize Typescript](https://github.com/RobinBuschmann/sequelize-typescript).  Typescript
compatible bindings that use Javascript decorators (other languages call these annotations)
to convey information at build time.  In addition, it provides a nice type safe programming
interface to the underlying Sequelize capabilities (which was quite a technological feat).

[Typescript](https://github.com/Microsoft/TypeScript).  Provides a type-safe programming
environment that is transpiled into pure Javascript.  IMHO: anyone who codes in pure JavaScript
anymore is subject to lots of bugs that could have been avoided.

### 3.3 Design Conventions

### 3.4 Implementation Details

## 4. FRONT END (END USER LOGIC)

### 4.1 Introduction

### 4.2 Technologies

[Axios](https://github.com/axios/axios).  Library enabling HTTP based access
to a server (in this case, the Back End that performs all of the actual
business logic).  It has been configured to coordinate with OAuth based
authentication that the Back End requires.

[Bootstrap](https://github.com/twbs/bootstrap).  One of the most popular
libraries that provides CSS styles for web based applications.

[Formik](https://github.com/formium/formik).  Library supporting interactive
forms, including field-by-field validations and form formatting.

[React](https://github.com/facebook/react).  Comprehensive platform for
building component-based architectures for front end applications that
run inside a modern web browser.

[React Bootstrap](https://github.com/react-bootstrap/react-bootstrap).
Add-on library that encapsulates components (decorated with Bootstrap
styling) in a React environment.

[Typescript](https://github.com/Microsoft/TypeScript).  Provides a type-safe programming
environment that is transpiled into pure Javascript.  IMHO: anyone who codes in pure JavaScript
anymore is subject to lots of bugs that could have been avoided.

[Yup](https://github.com/jquense/yup).  Library for integrating per-field
validation into input forms, as well as support for overall form layout.

### 4.3 Design Conventions

### 4.4 Implementation Details

