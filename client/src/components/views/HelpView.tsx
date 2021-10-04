// HelpView ------------------------------------------------------------------

// Render the specified help file (with Markdown syntax) as HTML.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
//import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ReactMarkdown from "react-markdown";
import {useParams} from "react-router-dom";
import remarkGfm from "remark-gfm";

// Internal Modules ----------------------------------------------------------

import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Component Details ---------------------------------------------------------

const HelpView = () => {

    const params: any = useParams();
    const [markdown, setMarkdown] = useState<string>("");

    useEffect(() => {

        const theUrl = process.env.PUBLIC_URL + `/helptext/${params.resource}`;
        const fetchResource = async () => {
            try {

                const response = await fetch(theUrl);
                const data = await response.text();
                setMarkdown(data);

                logger.info({
                    context: "HelpView.fetchResource",
                    url: theUrl,
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
            <Row className="ml-1 mr-1">
                <ReactMarkdown
                    children={markdown}
                    remarkPlugins={[remarkGfm]}
                />
            </Row>
        </Container>
    )

}

export default HelpView;
