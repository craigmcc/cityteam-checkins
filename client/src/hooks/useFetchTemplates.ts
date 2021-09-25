// useFetchTemplates ---------------------------------------------------------

// Custom hook to fetch Template objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import Facility from "../models/Facility";
import Template, {TEMPLATES_BASE} from "../models/Template";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Templates? [false]
    currentPage?: number;               // One-relative current page number [1]
    facility: Facility;                 // Parent Facility
    pageSize?: number;                  // Number of entries per page [25]
    name?: string;                      // Select Templates matching pattern [none]
    withFacility?: boolean;             // Include parent Facility? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    templates: Template[];              // Fetched Templates
}

// Hook Details --------------------------------------------------------------

const useFetchTemplates = (props: Props): State => {

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [templates, setTemplates] = useState<Template[]>([]);

    useEffect(() => {

        const fetchTemplates = async () => {

            setError(null);
            setLoading(true);
            let theTemplates: Template[] = [];

            try {
                if (props.facility.id > 0) {
                    const limit = props.pageSize ? props.pageSize : 25;
                    const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
                    const parameters = {
                        active: props.active ? "" : undefined,
                        limit: limit,
                        offset: offset,
                        name: props.name ? props.name : undefined,
                        withFacility: props.withFacility ? "" : undefined,
                    }
                    theTemplates = (await Api.get(TEMPLATES_BASE
                        + `/${props.facility.id}${queryParameters(parameters)}`)).data;
                    logger.debug({
                        context: "useFetchTemplates.fetchTemplates",
                        facility: Abridgers.FACILITY(props.facility),
                        active: props.active ? props.active : undefined,
                        currentPage: props.currentPage ? props.currentPage : undefined,
                        name: props.name ? props.name : undefined,
                        templates: Abridgers.TEMPLATES(theTemplates),
                    });
                }
            } catch (error) {
                logger.error({
                    context: "useFetchTemplates.fetchTemplates",
                    facility: Abridgers.FACILITY(props.facility),
                    active: props.active ? props.active : undefined,
                    currentPage: props.currentPage ? props.currentPage : undefined,
                    name: props.name ? props.name : undefined,
                    error: error,
                });
                setError(error as Error);
            }

            setLoading(false);
            setTemplates(theTemplates);

        }

        fetchTemplates();

    }, [props.active, props.currentPage, props.facility,
            props.pageSize, props.name, props.withFacility]);


    return {
        error: error ? error : null,
        loading: loading,
        templates: templates,
    }

}

export default useFetchTemplates;
