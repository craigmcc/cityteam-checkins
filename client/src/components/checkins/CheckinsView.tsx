// CheckinsView --------------------------------------------------------------

// Regular user view for managing Guest Checkins.

// External Modules ----------------------------------------------------------

import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Internal Modules ---------------------------------------------------------

import DateSelector from "../DateSelector";
import FacilityContext from "../contexts/FacilityContext";
import LoginContext from "../contexts/LoginContext";
import {HandleCheckin, HandleDate, Scope} from "../../types";
import Checkin from "../../models/Checkin";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {todayDate} from "../../util/Dates"

// Component Details ---------------------------------------------------------

enum Stage {
    None = "None",
    List = "List",
    Assigned = "Assigned",
    Unassigned = "Unassigned",
}

const CheckinsView = () => {

    const facilityContext = useContext(FacilityContext);
    const loginContext = useContext(LoginContext);

    const [canProcess, setCanProcess] = useState<boolean>(false);
    const [checkin, setCheckin] = useState<Checkin | null>(null); // TODO: checkin
    const [checkinDate, setCheckinDate] = useState<string>(todayDate());
    const [stage, setStage] = useState<Stage>(Stage.None);

    useEffect(() => {

        logger.info({
            context: "CheckinsView.useEffect",
            facility: Abridgers.FACILITY(facilityContext.facility),
        });

        setCanProcess(loginContext.validateFacility(facilityContext.facility, Scope.REGULAR));

    }, [facilityContext.facility, loginContext]);

    const handleAssigned: HandleCheckin = (theAssigned) => {
        logger.info({
            context: "CheckinsView.handleAssigned",
            checkin: Abridgers.CHECKIN(theAssigned),
        });
        handleStage(Stage.List);
    }

    const handleCheckinDate: HandleDate = (theCheckinDate) => {
        setCheckinDate(theCheckinDate);
        handleStage(Stage.List);
    }

    const handleSelected: HandleCheckin = (theCheckin) => {
        logger.info({
            context: "CheckinsView.handleSelected",
            checkin: Abridgers.CHECKIN(theCheckin),
        });
        if (canProcess) {
            setCheckin(theCheckin);
            handleStage(theCheckin.guestId ? Stage.Assigned : Stage.Unassigned);
        }
    }

    const handleStage = (theStage: Stage): void => {
        logger.trace({
            context: "CheckinsView.handleStage",
            stage: theStage,
        });
        setStage(theStage);
    }

    const onBack = () => {
        setStage(Stage.List);
    }

    return (
        <Container fluid id="CheckinsView">

            {/* Title and Checkin Date Selector always visible */}
            <Row className="mb-3 ml-1 mr-1">
                <Col className="text-left">
                    <span><strong>Manage Checkins for Facility&nbsp;</strong></span>
                    <span className="text-info"><strong>{facilityContext.facility.name}</strong></span>
                </Col>
                <Col className="text-right">
                    <DateSelector
                        autoFocus
                        handleDate={handleCheckinDate}
                        label="Checkin Date:"
                        required
                        value={checkinDate}
                    />
                </Col>
            </Row>

            {/* Selected Subview by stage */}
            {(stage === Stage.Assigned) ? (
                <span>Stage.Assigned</span>
            ) : null}
            {(stage === Stage.List) ? (
                <span>Stage.List</span>
            ) : null}
            {(stage === Stage.Unassigned) ? (
                <span>Stage.Unassigned</span>
            ) : null}

        </Container>
    )

}

export default CheckinsView;
