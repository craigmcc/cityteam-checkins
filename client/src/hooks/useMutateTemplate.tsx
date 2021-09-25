// useMutateTemplate ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Template.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleTemplate} from "../types";
import Api from "../clients/Api";
import Template, {TEMPLATES_BASE} from "../models/Template";
import logger from "../util/ClientLogger";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: HandleTemplate;             // Function to insert a new Template
    remove: HandleTemplate;             // Function to remove an existing Template
    update: HandleTemplate;             // Function to update an existing Template
}

// Component Details ---------------------------------------------------------

const useMutateTemplate = (props: Props): State => {

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateTemplate.useEffect",
        });
    });

    const insert: HandleTemplate = async (theTemplate): Promise<Template> => {

        let inserted = new Template();
        setError(null);
        setExecuting(true);

        try {
            inserted = (await Api.post(TEMPLATES_BASE
                + `/${theTemplate.facilityId}`, theTemplate)).data;
            logger.debug({
                context: "useMutateTemplate.insert",
                template: inserted,
            });
        } catch (error) {
            logger.error({
                context: "useMutateTemplate.insert",
                template: theTemplate,
                error: error,
            })
            setError(error as Error);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: HandleTemplate = async (theTemplate): Promise<Template> => {

        let removed = new Template();
        setError(null);
        setExecuting(true);

        try {
            removed = (await Api.delete(TEMPLATES_BASE
                + `/${theTemplate.facilityId}/${theTemplate.id}`)).data;
            logger.debug({
                context: "useMutateTemplate.remove",
                template: removed,
            });
        } catch (error) {
            logger.error({
                context: "useMutateTemplate.remove",
                template: theTemplate,
                error: error,
            });
            setError(error as Error);
        }

        setExecuting(false);
        return removed;

    }

    const update: HandleTemplate = async (theTemplate): Promise<Template> => {

        let updated = new Template();
        setError(null);
        setExecuting(true);

        try {
            updated = (await Api.put(TEMPLATES_BASE
                + `/${theTemplate.facilityId}/${theTemplate.id}`, theTemplate)).data;
            logger.trace({
                context: "useMutateTemplate.update",
                input: theTemplate,
                template: updated,
            });
        } catch (error) {
            logger.error({
                context: "useMutateTemplate.update",
                template: theTemplate,
                error: error,
            });
            setError(error as Error);
        }

        setExecuting(false);
        return updated;

    }

    return {
        error: error,
        executing: executing,
        insert: insert,
        remove: remove,
        update: update,
    };

}

export default useMutateTemplate;
