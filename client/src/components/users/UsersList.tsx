// UsersList -----------------------------------------------------------------

// List Users that match search criteria, offering callbacks for adding,
// editing, and removing Users.

// External Modules ----------------------------------------------------------

import React, {/* useContext, */useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import Pagination from "../Pagination";
import SearchBar from "../SearchBar";
import {HandleUser, HandleValue, OnAction} from "../../types";
import useUsers from "../../hooks/useUsers";
//import User from "../../models/User";
//import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd: OnAction;                // Handle request to add a User
    handleSelect: HandleUser;           // Handle request to select a User
}

// Component Details ---------------------------------------------------------

const UsersList = (props: Props) => {

    const [active/*, setActive*/] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");

    const usersState = useUsers({
        active: active,
        currentPage: currentPage,
        pageSize: pageSize,
        username: (searchText.length > 0) ? searchText : undefined,
    });

    useEffect(() => {
        logger.info({
            context: "UserList.useEffect"
        });
    }, []);

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
        <Container fluid id="UsersList">

            <Row className="mb-3">
                <Col className="col-10">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        label="Search For Users:"
                        placeholder="Search by all or part of name"
                    />
                </Col>
                <Col className="col-1">
                    <Pagination
                        currentPage={currentPage}
                        lastPage={(usersState.users.length === 0) ||
                            (usersState.users.length < pageSize)}
                        onNext={onNext}
                        onPrevious={onPrevious}
                        variant="secondary"
                    />
                </Col>
                <Col className="col-1">
                    <Button
                        onClick={props.handleAdd}
                        size="sm"
                        variant="primary"
                    >Add</Button>
                </Col>
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
                        <th scope="col">Username</th>
                        <th scope="col">Name</th>
                        <th scope="col">Active</th>
                        <th scope="col">Scope</th>
                    </tr>
                    </thead>

                    <tbody>
                    {usersState.users.map((user, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                            onClick={() => props.handleSelect(user)}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {user.username}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {user.name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(user.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {user.scope}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>


        </Container>
    )

}

export default UsersList;
