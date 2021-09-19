// useUsers ------------------------------------------------------------------

// Custom hook to fetch User objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import User, {USERS_BASE} from "../models/User";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import * as Sorters from "../util/Sorters";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Users [false]
    currentPage?: number;               // One-relative current page number [1]
    pageSize?: number;                  // Number of entries per page [25]
    username?: string;                  // Select Users matching pattern [none]
    withAccessTokens?: boolean;         // Include child AccessTokens [false]
    withRefreshTokens?: boolean;        // Include nested RefreshTokens [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    users: User[];                      // Fetched Users
}

// Hook Details --------------------------------------------------------------

const useUsers = (props: Props): State => {

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {

        logger.debug({
            context: "useUsers.useEffect",
            props: props,
        });

        const fetchUsers = async () => {

            setError(null);
            setLoading(true);
            let users: User[] = [];

            try {

                const limit = props.pageSize ? props.pageSize : 25;
                const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
                const parameters = {
                    active: props.active ? "" : undefined,
                    limit: limit,
                    offset: offset,
                    username: props.username ? props.username : undefined,
                    withAccessTokens: props.withAccessTokens ? "" : undefined,
                    withRefreshTokens: props.withRefreshTokens ? "" : undefined,
                };

                users = (await Api.get(USERS_BASE
                    + `${queryParameters(parameters)}`)).data;
                users.forEach(user => {
                    if (user.accessTokens && (user.accessTokens.length > 0)) {
                        user.accessTokens = Sorters.ACCESS_TOKENS(user.accessTokens);
                    }
                    if (user.refreshTokens && (user.refreshTokens.length > 0)) {
                        user.refreshTokens = Sorters.REFRESH_TOKENS(user.refreshTokens);
                    }
                });
                logger.debug({
                    context: "useUsers.fetchUsers",
                    active: props.active ? props.active : undefined,
                    currentPage: props.currentPage ? props.currentPage : undefined,
                    username: props.username ? props.username : undefined,
                    users: Abridgers.USERS(users),
                });

            } catch (error) {
                logger.error({
                    context: "useUsers.fetchUsers",
                    active: props.active ? props.active : undefined,
                    currentPage: props.currentPage ? props.currentPage : undefined,
                    username: props.username ? props.username : undefined,
                    error: error,
                });
                setError(error as Error);
            }

            setLoading(false);
            setUsers(users);

        }

        fetchUsers();

    }, [props])

    const state: State = {
        error: error ? error : null,
        loading: loading,
        users: users,
    }
    return state;

}

export default useUsers;
