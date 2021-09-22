// useMutateFacility ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Facility.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleFacility} from "../types";
import Api from "../clients/Api";
import Facility, {FACILITIES_BASE} from "../models/Facility";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    facility: Facility;                 // Facility on which to perform operations
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: HandleFacility;             // Function to insert a new Facility
    remove: HandleFacility;             // Function to remove an existing Facility
    update: HandleFacility;             // Function to update an existing Facility
}

// Component Details ---------------------------------------------------------

const useMutateFacility = (props: Props): State => {

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateFacility.useEffect",
            facility: Abridgers.FACILITY(props.facility),
        });
    }, [props.facility]);

    const insert: HandleFacility = async (theFacility): Promise<Facility> => {

        let inserted = new Facility();
        setError(null);
        setExecuting(true);

        try {
            inserted = (await Api.post(FACILITIES_BASE, theFacility)).data;
            logger.debug({
                context: "useMutateFacility.insert",
                facility: inserted,
            });
        } catch (error) {
            logger.error({
                context: "useMutateFacility.insert",
                facility: props.facility,
                error: error,
            })
            setError(error as Error);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: HandleFacility = async (theFacility): Promise<Facility> => {

        let removed = new Facility();
        setError(null);
        setExecuting(true);

        try {
            removed = (await Api.delete(FACILITIES_BASE
                + `/${props.facility.id}`)).data;
            logger.debug({
                context: "useMutateFacility.remove",
                facility: removed,
            });
        } catch (error) {
            logger.error({
                context: "useMutateFacility.update",
                facility: props.facility,
                error: error,
            });
            setError(error as Error);
        }

        setExecuting(false);
        return removed;

    }

    const update: HandleFacility = async (theFacility): Promise<Facility> => {

        let updated = new Facility();
        setError(null);
        setExecuting(true);

        try {
            updated = (await Api.put(FACILITIES_BASE
                + `/${props.facility.id}`, theFacility)).data;
            logger.debug({
                context: "useMutateFacility.update",
                facility: updated,
            });
        } catch (error) {
            logger.error({
                context: "useMutateFacility.update",
                facility: props.facility,
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

export default useMutateFacility;
