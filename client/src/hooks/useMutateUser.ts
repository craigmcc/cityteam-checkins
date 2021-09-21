// useMutateUser -------------------------------------------------------------

// Custom hook to encapsulate mutation operations on a User.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleUser} from "../types";
import Api from "../clients/Api";
import User, {USERS_BASE} from "../models/User";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    user: User;                         // User on which to perform operations
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: HandleUser;                 // Function to insert a new User
    remove: HandleUser;                 // Function to remove an existing User
    update: HandleUser;                 // Function to update an existing User
}

// Component Details ---------------------------------------------------------

const useMutateUser = (props: Props): State => {

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateUser.useEffect",
            user: Abridgers.USER(props.user),
        });
    }, [props.user]);

    const insert: HandleUser = async (theUser): Promise<User> => {

        let inserted = new User();
        setError(null);
        setExecuting(true);

        try {
            inserted = (await Api.post(USERS_BASE, theUser)).data;
            logger.debug({
                context: "useMutateUser.insert",
                user: inserted,
            });
        } catch (error) {
            logger.error({
                context: "useMutateUser.insert",
                user: props.user,
                error: error,
            })
            setError(error as Error);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: HandleUser = async (theUser): Promise<User> => {

        let removed = new User();
        setError(null);
        setExecuting(true);

        try {
            removed = (await Api.delete(USERS_BASE
                + `/${props.user.id}`)).data;
            logger.debug({
                context: "useMutateUser.remove",
                user: removed,
            });
        } catch (error) {
            logger.error({
                context: "useMutateUser.update",
                user: props.user,
                error: error,
            });
            setError(error as Error);
        }

        setExecuting(false);
        return removed;

    }

    const update: HandleUser = async (theUser): Promise<User> => {

        let updated = new User();
        setError(null);
        setExecuting(true);

        try {
            updated = (await Api.put(USERS_BASE
                + `/${props.user.id}`, theUser)).data;
            logger.debug({
                context: "useMutateUser.update",
                user: updated,
            });
        } catch (error) {
            logger.error({
                context: "useMutateUser.update",
                user: props.user,
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

export default useMutateUser;
