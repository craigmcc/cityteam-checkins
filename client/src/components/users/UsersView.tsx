// UsersView -----------------------------------------------------------------

// Top-level view for managing User objects.

// External Modules ----------------------------------------------------------

import React, {/*useContext, */useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import UserForm from "./UserForm";
import UsersList from "./UsersList";
import {HandleUser, OnAction/*, Scopes*/} from "../../types";
import User from "../../models/User";
//import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

const UsersView = () => {

    const [canRemove/*, setCanRemove*/] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    // TODO - hook for mutating state

    useEffect(() => {

        logger.info({
            context: "UsersView.useEffect",
        });

// TODO       setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, []); // TODO - add dependencies as needed

    const handleAdd: OnAction = () => {
        setUser(new User({
            active: true,
            name: null,
            password: null,
            scope: null,
            username: null,
        }));
    }

    const handleInsert: HandleUser = async (theUser) => {
//        const inserted = await performInsert(theUser);
        setUser(null);
    }

    const handleRemove: HandleUser = async (theUser) => {
//        const removed = await performRemove(theUser);
        setUser(null);
    }

    const handleSelect: HandleUser = (theUser) => {
        setUser(theUser);
    }

    const handleUpdate: HandleUser = async (theUser) => {
//        const updated = await performUpdate(theUser);
        setUser(null);
    }

    return (
        <Container fluid id="UsersView">

            {/* List View */}
            {(!user) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            <span>Select or Create User</span>
                        </Col>
                    </Row>

                    <Row className="mb-3 ml-1 mr-1">
                        <UsersList
                            handleAdd={handleAdd}
                            handleSelect={handleSelect}
                        />
                    </Row>

                </>
            ) : null }

            {/* Detail View */}
            {(user) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            {(user.id > 0) ? (
                                <span>Edit Existing</span>
                            ) : (
                                <span>Add New</span>
                            )}
                            &nbsp;User
                        </Col>
                        <Col className="text-right">
                            <Button
                                onClick={() => setUser(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <Row className="mb-3 ml-1 mr-1">
                        <UserForm
                            autoFocus={true}
                            canRemove={canRemove}
                            handleInsert={handleInsert}
                            handleRemove={handleRemove}
                            handleUpdate={handleUpdate}
                            user={user}
                        />
                    </Row>

                </>
            ) : null }

        </Container>
    )


}

export default UsersView;

