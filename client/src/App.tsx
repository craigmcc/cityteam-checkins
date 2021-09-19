// App -----------------------------------------------------------------------

// Overall implementation of the entire client application.

// External Modules ----------------------------------------------------------

import React from 'react';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
//import NavDropdown from "react-bootstrap/cjs/NavDropdown";
import NavItem from "react-bootstrap/NavItem";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Internal Modules ----------------------------------------------------------

import HomeView from "./components/views/HomeView";
import OpenApiView from "./components/views/OpenApiView";

// Component Details ---------------------------------------------------------

// TODO - will need to surround <Router/> with context providers
function App() {
  return (
      <Router>

        <Navbar
            bg="info"
            className="mb-3"
            expand="lg"
            sticky="top"
            variant="dark"
        >

          <Navbar.Brand>
            <img
                alt="CityTeam Logo"
                height={66}
                src="./CityTeamDarkBlue.png"
                width={160}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-brand"/>

          <Navbar.Collapse id="basic-navbar-brand">
            <Nav className="mr-auto">
              <LinkContainer to="/">
                <NavItem className="nav-link">Home</NavItem>
              </LinkContainer>
              <LinkContainer to="/open-api">
                <NavItem className="nav-link">OpenAPI Docs</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>

        </Navbar>

        <Switch>
          <Route exact path="/open-api">
            <OpenApiView/>
          </Route>
          <Route path="/">
            <HomeView/>
          </Route>
        </Switch>

      </Router>
  );
}

export default App;
