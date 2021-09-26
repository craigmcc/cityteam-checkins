// CheckinsListSubview -------------------------------------------------------

// Render a list of Checkins for the specified Facility and checkinDate,
// followed by summary totals for the listed Checkins.  If there are no
// Checkins yet for the specified checkinDate, offer to generate them
// from one of the available Templates.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

