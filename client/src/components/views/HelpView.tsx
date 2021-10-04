// HelpView ------------------------------------------------------------------

// Render the specified help file (with Markdown syntax) as HTML.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
//import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {useParams} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Component Details ---------------------------------------------------------

const HelpView = () => {

    const params: any = useParams();
    const [data, setData] = useState<string>("");

    useEffect(() => {

        const theUrl = process.env.PUBLIC_URL + `/helptext/${params.resource}`;
        const fetchResource = async () => {
            try {

                const response = await fetch(theUrl);
                const data = await response.text();

                // TODO - apply markdown and setData() with that.
                setData(data);

                logger.info({
                    context: "HelpView.fetchResource",
                    url: theUrl,
                    data: data,
                });

            } catch (error) {
                ReportError("HelpView.fetchResource", error as Error, {
                    url: theUrl,
                    error: error,
                });
            }
        }

        fetchResource();

    }, [params]);

    return (
        <Container fluid id="HelpView">
{/*
            <Row className="mb-3 ml-1 mr-1">
                <Col className="text-left">
                    <span><strong>{params.resource}</strong></span>
                </Col>
            </Row>
            <Row className="ml-1 mr-1">
                <hr/>
            </Row>
*/}
            <Row className="ml-1 mr-1">
                {data}
            </Row>
        </Container>
    )

}

export default HelpView;
