// useFetchUser --------------------------------------------------------------

// Custom hook to fetch the specified User object that corresponds to
// input properties.

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

// Either userId or username must be specified
export interface Props {
    userId?: number;                    // ID of User to fetch
    username?: string;                  // Exact username of User to fetch
    withAccessTokens?: boolean;         // Include child AccessTokens? [false]
    withRefreshTokens?: boolean;        // Include nested RefreshTokens? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    user: User;                         // Fetched User (or id<0 for none)
}

// Component Details ---------------------------------------------------------

const useFetchUser = (props: Props): State => {

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User>(new User());

    useEffect(() => {

        const fetchUser = async () => {

            setError(null);
            setLoading(true);
            let user = new User();

            try {

                const parameters = {
                    withAccessTokens: props.withAccessTokens ? "" : undefined,
                    withRefreshTokens: props.withRefreshTokens ? "" : undefined,
                };

                // TODO - what happens on a NotFound?
                if (props.userId) {
                    user = (await Api.get(USERS_BASE
                        + `/${props.userId}`
                        + `${queryParameters(parameters)}`)).data;
                } else if (props.username) {
                    user = (await Api.get(USERS_BASE
                        + `/exact/${props.username}`
                        + `${queryParameters(parameters)}`)).data;
                }
                if (user.accessTokens && (user.accessTokens.length > 0)) {
                    user.accessTokens = Sorters.ACCESS_TOKENS(user.accessTokens);
                }
                if (user.refreshTokens && (user.refreshTokens.length > 0)) {
                    user.refreshTokens = Sorters.REFRESH_TOKENS(user.refreshTokens);
                }
                logger.debug({
                    context: "useFetchUser.fetchUser",
                    userId: props.userId ? props.userId : undefined,
                    username: props.username ? props.username : undefined,
                    user: Abridgers.USER(user),
                });

            } catch (error) {
                logger.error({
                    context: "useFetchUser.fetchUser",
                    userId: props.userId ? props.userId : undefined,
                    username: props.username ? props.username : undefined,
                    error: error,
                });
                setError(error as Error);
            }

            setLoading(false);
            setUser(user);

        }

        fetchUser();

    }, [props]);

    return {
        error: error,
        loading: loading,
        user: user,
    }

}

export default useFetchUser;
