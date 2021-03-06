// CheckinsUnassignedSubview -------------------------------------------------

// Process a Checkin for a currently unassigned mat, in two steps:
// - Search for and select an existing Guest, or create and select a new one.
// - Assign the selected Guest (with approprite details) to the
//   previously unassigned Checkin.

// External Modules -----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import AssignForm from "../assigns/AssignForm";
import GuestForm from "../guests/GuestForm";
import GuestsList from "../guests/GuestsList";
import {HandleAssign, HandleCheckin, HandleGuest, OnAction} from "../../types";
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
    handleCompleted: HandleCheckin;     // Handle Checkin after completion
}

// Component Details ---------------------------------------------------------

const CheckinsUnassignedSubview = (props: Props) => {

    const [adding, setAdding] = useState<boolean>(false);
    const [assign, setAssign] = useState<Assign | null>(null);
    const [guest, setGuest] = useState<Guest | null>(null);

    const mutateCheckin = useMutateCheckin({
        checkin: props.checkin,
    });

    const mutateGuest = useMutateGuest({
    });

    useEffect(() => {
        logger.debug({
            context: "CheckinsUnassignedSubview.useEffect",
            checkin: Abridgers.CHECKIN(props.checkin),
            guest: (guest) ? Abridgers.GUEST(guest) : undefined,
        });
    }, [adding, guest, props.checkin]);

    const configureAssign = (theGuest: Guest): Assign => {
        return new Assign({
            guestId: theGuest.id,
            paymentAmount: 5.00,
            paymentType: "$$"
        });
    }

    const handleAssignedGuest: HandleAssign = async (theAssign) => {
        const assigned: Checkin = await mutateCheckin.assign(theAssign);
        logger.debug({
            context: "CheckinsUnassignedSubview.handleAssignedGuest",
            checkin: Abridgers.CHECKIN(assigned),
        });
        props.handleCompleted(assigned);
    }

    const handleInsertedGuest: HandleGuest = async (theGuest) => {
        const inserted: Guest = await mutateGuest.insert(theGuest);
        logger.debug({
            context: "CheckinsUnassignedSubview.handleInsertedGuest",
            guest: Abridgers.GUEST(inserted),
        });
        setAssign(configureAssign(inserted));
        setGuest(inserted);
    }

    const handleNewGuest: OnAction = () => {
        setAdding(true);
    }

    const handleRemovedGuest: HandleGuest = async (theGuest) => {
        logger.error({
            context: "CheckinsUnassignedSubview.handleRemovedGuest",
            msg: "This should never be called",
            guest: Abridgers.GUEST(theGuest),
        });
    }

    const handleSelectedGuest: HandleGuest = (theGuest) => {
        logger.debug({
            context: "CheckinsUnassignedSubview.handleSelectedGuest",
            guest: Abridgers.GUEST(theGuest),
        });
        setAssign(configureAssign(theGuest));
        setGuest(theGuest);
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
                <Col/>
                <Col className="text-right">
                    <Button
                        onClick={() => props.handleCompleted(props.checkin)}
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
                <Col className="col-9 bg-light mb-1">

                    <h6 className="text-center">
                        Step 1: Select or Add A Guest To Assign
                    </h6>
                    <hr/>
                    <h6 className={"text-center"}>
                        Mat Number:&nbsp;
                        <span className="text-info">
                            {props.checkin.matNumber}{props.checkin.features}
                        </span>
                    </h6>

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
                                handleAdd={handleNewGuest}
                                handleSelect={handleSelectedGuest}
                                withActive={false}
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
                <Col className="col-3 mb-1">
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
                    {(assign) ? (
                        <AssignForm
                            assign={assign}
                            handleAssign={handleAssignedGuest}
                        />
                    ) : null }
                </Col>




            </Row>

        </Container>
    )

}

export default CheckinsUnassignedSubview;
