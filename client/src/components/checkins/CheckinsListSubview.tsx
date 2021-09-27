// CheckinsListSubview -------------------------------------------------------

// Render a list of Checkins for the specified Facility and checkinDate,
// followed by summary totals for the listed Checkins.  If there are no
// Checkins yet for the specified checkinDate, offer to generate them
// from one of the available Templates.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import SummaryHeader from "../summaries/SummaryHeader";
import SummaryRow from "../summaries/SummaryRow";
import FacilityContext from "../contexts/FacilityContext";
import TemplateSelector from "../templates/TemplateSelector";
import {HandleCheckin, HandleTemplate} from "../../types";
import useFetchCheckins from "../../hooks/useFetchCheckins";
import useMutateCheckin from "../../hooks/useMutateCheckin";
import Checkin from "../../models/Checkin";
import Summary from "../../models/Summary";
import Template from "../../models/Template";
import * as Abridgers from"../../util/Abridgers";
import logger from "../../util/ClientLogger";
import Table from "react-bootstrap/Table";

// Incoming Properties ------------------------------------------------------

export interface Props {
    checkinDate: string;                // Checkin date we are processing
    handleCheckin: HandleCheckin;       // Handle selected Checkin
}

// Component Details ---------------------------------------------------------

const CheckinsListSubview = (props: Props) => {

    const facilityContext = useContext(FacilityContext);

    const [summary, setSummary] = useState<Summary>(new Summary());
    const [template, setTemplate] = useState<Template>(new Template());

    const fetchCheckins = useFetchCheckins({
        currentPage: 1,
        date: props.checkinDate,
        facility: facilityContext.facility,
        pageSize: 100,
        withGuest: true,
    });

    const mutateCheckin = useMutateCheckin({
        checkin: new Checkin(),
    });

    useEffect(() => {

        logger.info({
            context: "CheckinsListSubview.useEffect",
            checkins: fetchCheckins.checkins,
        });

        // Calculate and store the summary totals to be displayed
        const theSummary = new Summary(facilityContext.facility.id, props.checkinDate);
        fetchCheckins.checkins.forEach(checkin => {
            theSummary.includeCheckin(checkin);
        });
        setSummary(summary);

    }, [props.checkinDate, summary,
        facilityContext.facility.id, fetchCheckins.checkins]);

    const handleGenerate = async () => {
        logger.debug({
            context: "CheckinsListSubview.handleGenerate",
            checkinDate: props.checkinDate,
            template: Abridgers.TEMPLATE(template),
        });
        /* const checkins = */await mutateCheckin.generate(props.checkinDate, template);
        // TODO - trigger refresh somehow?
    }

    const handleTemplate: HandleTemplate = (theTemplate) => {
        logger.trace({
            context: "CheckinsListSubview.handleTemplate",
            template: Abridgers.TEMPLATE(theTemplate),
        });
        setTemplate(theTemplate);
    }

    return (
        <Container fluid id="CheckinsListSubview">

            {/* Generate from Template if needed */}
            {(facilityContext.facility.id > 0) && (fetchCheckins.checkins.length === 0) ? (
                <Row className="mb-3 text-center">
                    <TemplateSelector
                        active={true}
                        handleTemplate={handleTemplate}
                        label="Select Template:"
                    />
                    <span className="ml-2 mr-2">
                        <Button
                            disabled={template.id < 0}
                            onClick={handleGenerate}
                            size="sm"
                            variant="primary"
                        >Generate</Button>
                    </span>
                    {(template.id < 0) ? (
                        <span>
                            (Select an active Template to generate mats for Checkins)
                        </span>
                    ) : null}
                </Row>
            ) : null}

            <Row className="mb-3">
                <Table
                    bordered={true}
                    hover={true}
                    size="sm"
                    striped={true}
                >

                <thead>
                <tr className="table-secondary">
                    <th scope="col">Mat</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">$$</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Shower</th>
                    <th scope="col">Wakeup</th>
                    <th scope="col">Comments</th>
                </tr>
                </thead>

                <tbody>
                {fetchCheckins.checkins.map((checkin, rowIndex) => (
                    <tr
                        className="table-default"
                        key={1000 + (rowIndex * 100)}
                        onClick={() => props.handleCheckin(checkin)}
                    >
                        <td key={1000 + (rowIndex * 100) + 1}>
                            {checkin.matNumber} {/* TODO matNumberAndFeatures screws up the rendering */}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 2}>
                            {checkin.guest ? checkin.guest.firstName : ""}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 3}>
                            {checkin.guest ? checkin.guest.lastName : ""}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 4}>
                            {checkin.paymentType}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 5}>
                            {checkin.paymentAmount}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 6}>
                            {checkin.showerTime}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 7}>
                            {checkin.wakeupTime}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 8}>
                            {checkin.comments}
                        </td>
                    </tr>
                ))}
                </tbody>

                </Table>
            </Row>

            {/* TODO - table layout is messed up */}
            <Row>
                <Table
                    bordered={true}
                    size="sm"
                    striped={true}
                >
                    <thead>
                        <SummaryHeader withCheckinDate={false}/>
                    </thead>
                    <tbody>
                        <SummaryRow keyBase={2000} rowIndex={0} summary={summary}/>
                    </tbody>
                </Table>
            </Row>

        </Container>
    )

}

export default CheckinsListSubview;
