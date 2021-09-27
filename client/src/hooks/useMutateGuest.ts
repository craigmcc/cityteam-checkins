// useMutateGuest ------------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Guest.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleGuest} from "../types";
import Api from "../clients/Api";
import Guest, {GUESTS_BASE} from "../models/Guest";
import logger from "../util/ClientLogger";
import {toGuest} from "../util/ToModelTypes";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: HandleGuest;                // Function to insert a new Guest
    remove: HandleGuest;                // Function to remove an existing Guest
    update: HandleGuest;                // Function to update an existing Guest
}

// Component Details ---------------------------------------------------------

const useMutateGuest = (props: Props): State => {

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateGuest.useEffect",
        });
    });

    const insert: HandleGuest = async (theGuest): Promise<Guest> => {

        let inserted: Guest = new Guest();
        setError(null);
        setExecuting(true);

        try {
            inserted = toGuest((await Api.post(GUESTS_BASE
                + `/${theGuest.facilityId}`, theGuest)).data);
            logger.debug({
                context: "useMutateGuest.insert",
                guest: inserted,
            });
        } catch (error) {
            logger.error({
                context: "useMutateGuest.insert",
                guest: theGuest,
                error: error,
            })
            setError(error as Error);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: HandleGuest = async (theGuest): Promise<Guest> => {

        let removed = new Guest();
        setError(null);
        setExecuting(true);

        try {
            removed = (await Api.delete(GUESTS_BASE
                + `/${theGuest.facilityId}/${theGuest.id}`)).data;
            logger.debug({
                context: "useMutateGuest.remove",
                guest: removed,
            });
        } catch (error) {
            logger.error({
                context: "useMutateGuest.remove",
                guest: theGuest,
                error: error,
            });
            setError(error as Error);
        }

        setExecuting(false);
        return removed;

    }

    const update: HandleGuest = async (theGuest): Promise<Guest> => {

        let updated = new Guest();
        setError(null);
        setExecuting(true);

        try {
            updated = (await Api.put(GUESTS_BASE
                + `/${theGuest.facilityId}/${theGuest.id}`, theGuest)).data;
            logger.trace({
                context: "useMutateGuest.update",
                input: theGuest,
                guest: updated,
            });
        } catch (error) {
            logger.error({
                context: "useMutateGuest.update",
                guest: theGuest,
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

export default useMutateGuest;
