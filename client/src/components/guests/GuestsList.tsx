// GuestsList -------------------------------------------------------------

// List Guests that match search criteria, offering callbacks for adding,
// editing, and removing Guests.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import CheckBox from "../CheckBox";
import Pagination from "../Pagination";
import SearchBar from "../SearchBar";
import {HandleBoolean, HandleGuest, HandleValue, OnAction} from "../../types";
import useFetchGuests from "../../hooks/useFetchGuests";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    canInsert: boolean;                 // Can this user add Guests?
    canRemove: boolean;                 // Can this user remove Guests?
    canUpdate: boolean;                 // Can this user update Guests?
    handleAdd?: OnAction;               // Handle request to add a Guest [no handler]
    handleSelect: HandleGuest;          // Handle request to select a Guest
    withActive?: boolean;               // Offer "Active Guests Only?" filter [true]
}

// Component Details ---------------------------------------------------------

const GuestsList = (props: Props) => {

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");
    const [withActive] =
        useState<boolean>(props.withActive !== undefined ? props.withActive : true);

    const fetchGuests = useFetchGuests({
        active: active,
        currentPage: currentPage,
        name: (searchText.length > 0) ? searchText : undefined,
        pageSize: pageSize,
    });

    useEffect(() => {

        logger.debug({
            context: "GuestsList.useEffect"
        });

    }, [fetchGuests.guests]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleChange: HandleValue = (theSearchText) => {
        setSearchText(theSearchText);
    }

    const onNext: OnAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const onPrevious: OnAction = () => {
        setCurrentPage(currentPage - 1);
    }

    return (
        <Container fluid id="GuestsList">

            <Row className="mb-3 ml-1 mr-1">
                <Col className="col-6">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        label="Search For Guests:"
                        placeholder="Search by all or part of either name"
                    />
                </Col>
                {withActive ? (
                    <Col>
                        <CheckBox
                            handleChange={handleActive}
                            id="activeOnly"
                            initialValue={active}
                            label="Active Guests Only?"
                        />
                    </Col>
                ) : null}
                <Col className="text-right">
                    <Pagination
                        currentPage={currentPage}
                        lastPage={(fetchGuests.guests.length === 0) ||
                            (fetchGuests.guests.length < pageSize)}
                        onNext={onNext}
                        onPrevious={onPrevious}
                        variant="secondary"
                    />
                </Col>
                {props.handleAdd ? (
                    <Col className="text-right">
                        {props.handleAdd ? (
                            <Button
                                disabled={!props.canInsert}
                                onClick={props.handleAdd}
                                size="sm"
                                variant="primary"
                            >Add</Button>
                        ) : null}
                    </Col>
                ) : null}
            </Row>

            <Row className="ml-1 mr-1">
                <Table
                    bordered={true}
                    hover={true}
                    size="sm"
                    striped={true}
                >

                    <thead>
                    <tr className="table-secondary">
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Active</th>
                        <th scope="col">Comments</th>
                        <th scope="col">Favorite</th>
                    </tr>
                    </thead>

                    <tbody>
                    {fetchGuests.guests.map((guest, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                            onClick={() => props.handleSelect(guest)}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {guest.firstName}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {guest.lastName}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(guest.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {guest.comments}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {guest.favorite}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

        </Container>
    )

}

export default GuestsList;
