// FacilitiesView -----------------------------------------------------------------

// Top-level view for managing Facility objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import FacilityForm from "./FacilityForm";
import FacilitiesList from "./FacilitiesList";
import {HandleFacility, OnAction/*, Scopes*/} from "../../types";
import FacilityContext from "../../contexts/FacilityContext";
import useMutateFacility from "../../hooks/useMutateFacility";
import Facility from "../../models/Facility";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

const FacilitiesView = () => {

    const facilityContext = useContext(FacilityContext);

    const [canRemove/*, setCanRemove*/] = useState<boolean>(false);
    const [facility, setFacility] = useState<Facility | null>(null);

    const mutateFacility = useMutateFacility({
        facility: facility ? facility : new Facility(),
    });

    useEffect(() => {

        logger.debug({
            context: "FacilitiesView.useEffect",
        });

        // TODO setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, []);

    const handleAdd: OnAction = () => {
        setFacility(new Facility({
            active: true,
            name: null,
            password: null,
            scope: null,
            facilityname: null,
        }));
    }

    const handleInsert: HandleFacility = async (theFacility) => {
        /*const inserted = */await mutateFacility.insert(theFacility);
        facilityContext.handleRefresh();
        setFacility(null);
    }

    const handleRemove: HandleFacility = async (theFacility) => {
        /*const removed = */await mutateFacility.remove(theFacility);
        facilityContext.handleRefresh();
        setFacility(null);
    }

    const handleSelect: HandleFacility = (theFacility) => {
        setFacility(theFacility);
    }

    const handleUpdate: HandleFacility = async (theFacility) => {
        /*const updated = */await mutateFacility.update(theFacility);
        facilityContext.handleRefresh();
        setFacility(null);
    }

    return (
        <Container fluid id="FacilitiesView">

            {/* List View */}
            {(!facility) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-left">
                            <span><strong>Select or Create Facility</strong></span>
                        </Col>
                    </Row>

                    <Row className="mb-3 ml-1 mr-1">
                        <FacilitiesList
                            handleAdd={handleAdd}
                            handleSelect={handleSelect}
                        />
                    </Row>

                </>
            ) : null }

            {/* Detail View */}
            {(facility) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-left">
                            {(facility.id > 0) ? (
                                <span><strong>Edit Existing</strong></span>
                            ) : (
                                <span><strong>Add New</strong></span>
                            )}
                            <span><strong>&nbsp;Facility</strong></span>
                        </Col>
                        <Col className="text-right">
                            <Button
                                onClick={() => setFacility(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <Row className="mb-3 ml-1 mr-1">
                        <FacilityForm
                            autoFocus={true}
                            canRemove={canRemove}
                            handleInsert={handleInsert}
                            handleRemove={handleRemove}
                            handleUpdate={handleUpdate}
                            facility={facility}
                        />
                    </Row>

                </>
            ) : null }

        </Container>
    )

}

export default FacilitiesView;
