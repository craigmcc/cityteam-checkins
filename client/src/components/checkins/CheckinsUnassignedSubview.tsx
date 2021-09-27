// CheckinsUnassignedSubview -------------------------------------------------

// Process a Checkin for a currently unassigned mat, in two steps:
// - Search for and select an existing Guest, or create and select a new one.
// - Assign the selected Guest (with approprite details) to the
//   previously unassigned Checkin.

// External Modules -----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import {HandleAssign, HandleCheckin, HandleGuest, OnAction} from "../../types";
import AssignForm from "../assigns/AssignForm";
import FacilityContext from "../contexts/FacilityContext";
import GuestForm from "../guests/GuestForm";
import GuestsList from "../guests/GuestsList";
import useMutateCheckin from "../../hooks/useMutateCheckin";
import useMutateGuest from "../../hooks/useMutateGuest";
import Assign from "../../models/Assign";
import Checkin from "../../models/Checkin";
import Guest from "../../models/Guest";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    checkin: Checkin;                   // The (unassigned) Checkin to process
    handleCheckin: HandleCheckin;       // Handle checkin after completion
    onBack: OnAction;                   // Handle back button click
}

// Component Details ---------------------------------------------------------

const CheckinsUnassignedSubview = (props: Props) => {

    const facilityContext = useContext(FacilityContext);

    const [adding, setAdding] = useState<boolean>(false);
    const [assigned, setAssigned] = useState<Assign | null>(null);
    const [guest, setGuest] = useState<Guest | null>(null);

    const mutateCheckin = useMutateCheckin({
        checkin: props.checkin,
    });

    const mutateGuest = useMutateGuest({
    });

    useEffect(() => {
        logger.info({
            context: "CheckinsUnassignedSubview.useEffect",
        });
    }, [adding, guest]);

    const configureAssign = (theGuest: Guest): Assign => {
        const assign = new Assign({
            guestId: theGuest.id,
            paymentAmount: 5.00,
            paymentType: "$$"
        });
        return assign;
    }

    const handleAssignedGuest: HandleAssign = async (theAssign) => {
        // @ts-ignore    TODO - ?????
        const assigned: Checkin = await mutateCheckin.assign(theAssign);
        logger.info({
            context: "CheckinsUnassignedSubview.handleAssignedGuest",
            checkin: Abridgers.CHECKIN(assigned),
        });
        props.handleCheckin(assigned);
    }

    const handleInsertedGuest: HandleGuest = async (theGuest) => {
        // @ts-ignore    TODO - ?????
        const inserted: Guest = await mutateGuest.insert(theGuest);
        logger.info({
            context: "CheckinsUnassignedSubview.handleInsertedGuest",
            guest: Abridgers.GUEST(inserted),
        });
        setAssigned(configureAssign(inserted));
        setGuest(inserted);
    }

    const handleNewGuest: OnAction = () => {
        setGuest(new Guest({
            facilityId: facilityContext.facility.id,
        }))
    }

    const handleRemovedGuest: HandleGuest = async (theGuest) => {
        logger.error({
            context: "CheckinsUnassignedSubview.handleRemovedGuest",
            msg: "This should never be called",
            guest: Abridgers.GUEST(theGuest),
        });
    }

    const handleSelectedGuest: HandleGuest = (theGuest) => {
        logger.info({
            context: "CheckinsUnassignedSubview.handleSelectedGuest",
            guest: Abridgers.GUEST(theGuest),
        });
        setGuest(theGuest);
        setAssigned(configureAssign(theGuest));
    }

    const handleUpdatedGuest: HandleGuest = async (theGuest) => {
        logger.error({
            context: "CheckinsUnassignedSubview.handleUpdatedGuest",
            msg: "This should never be called",
            guest: Abridgers.GUEST(theGuest),
        });
    }

    return (
        <Container fluid id="CheckinsUnassignedSubview">

            {/* Overall Header and Back Link */}
            <Row className="mb-3">
                <Col className="col-11">
                    <Row className="text-center">
                        <span>Mat Number:&nbsp;</span>
                        <span className="text-info">
                            {props.checkin.matNumber}{props.checkin.features}
                        </span>
                        {(props.checkin.guest) ? (
                            <>
                                <span>&nbsp;&nbsp;&nbsp;Guest:&nbsp;</span>
                                <span className="text-info">
                                    {props.checkin.guest.firstName}&nbsp;
                                    {props.checkin.guest.lastName}
                                </span>
                            </>
                        ) : null }
                    </Row>
                </Col>
                <Col className="text-right">
                    <Button
                        onClick={props.onBack}
                        size="sm"
                        type="button"
                        variant="secondary"
                    >
                        Back
                    </Button>
                </Col>
            </Row>

            <Row className="mb-3">

                {/* Step 1 ----------------------------------------------- */}
                <Col className="col-7 bg-light mb-1">

                    <h6 className="text-center">
                        Step 1: Select or Add A Guest To Assign
                    </h6>
                    <hr/>

                    {(adding) ? (
                        <>
                            <Row className="ml-1 mr-1 mb-3">
                                <Col className="text-left">
                                    <strong>
                                        Adding New Guest
                                    </strong>
                                </Col>
                            </Row>
                            <Row className="ml-1 mr-1">
                                <GuestForm
                                    autoFocus
                                    canRemove={false}
                                    canSave={true}
                                    guest={new Guest({facilityId: -1, id: -1})}
                                    handleInsert={handleInsertedGuest}
                                    handleRemove={handleRemovedGuest}
                                    handleUpdate={handleUpdatedGuest}
                                />
                            </Row>
                        </>
                    ) : (
                        <>
                            <GuestsList
                                canInsert={true}
                                canRemove={false}
                                canUpdate={true}
                                facility={facilityContext.facility}
                                handleAdd={handleNewGuest}
                                handleSelect={handleSelectedGuest}
                            />
                            <Row className="ml-4 mb-3">
                                <Button
                                    onClick={() => setAdding(true)}
                                    size="sm"
                                    variant="primary"
                                >
                                    Add
                                </Button>
                            </Row>
                        </>
                    )}

                </Col>

                {/* Step 2 ----------------------------------------------- */}
                <Col className="col-5 mb-1">
                    <h6 className={"text-center"}>
                        Step 2: Complete Assignment Details
                    </h6>
                    <hr/>
                    {(guest) ? (
                        <h6 className={"text-center"}>
                            Guest:&nbsp;&nbsp;
                            <span className="text-info">
                                {guest.firstName} {guest.lastName}
                            </span>
                        </h6>
                    ) : null }
                    {(assigned) ? (
                        <AssignForm
                            assign={assigned}
                            handleAssign={handleAssignedGuest}
                        />
                    ) : null }
                </Col>




            </Row>

        </Container>
    )

}

export default CheckinsUnassignedSubview;
