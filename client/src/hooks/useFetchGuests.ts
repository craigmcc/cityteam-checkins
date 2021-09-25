// useFetchGuests ------------------------------------------------------------

// Custom hook to fetch Guest objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import Facility from "../models/Facility";
import Guest, {GUESTS_BASE} from "../models/Guest";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Templates? [false]
    currentPage?: number;               // One-relative current page number [1]
    facility: Facility;                 // Parent Facility
    pageSize?: number;                  // Number of entries per page [25]
    name?: string;                      // Select Guests matching pattern [none]
    withFacility?: boolean;             // Include parent Facility? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    guests: Guest[];                    // Fetched Guests
    loading: boolean;                   // Are we currently loading?
}

// Hook Details --------------------------------------------------------------

const useFetchGuests = (props: Props): State => {

    const [error, setError] = useState<Error | null>(null);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchGuests = async () => {

            setError(null);
            setLoading(true);
            let theGuests: Guest[] = [];

            try {
                if (props.name) { // Too many Guests for a useful non-filtered fetch
                    const limit = props.pageSize ? props.pageSize : 25;
                    const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
                    const parameters = {
                        active: props.active ? "" : undefined,
                        limit: limit,
                        offset: offset,
                        name: props.name ? props.name : undefined,
                        withFacility: props.withFacility ? "" : undefined,
                    }
                    theGuests = (await Api.get(GUESTS_BASE
                        + `/${props.facility.id}${queryParameters(parameters)}`)).data;
                    logger.debug({
                        context: "useFetchGuests.fetchGuests",
                        facility: Abridgers.FACILITY(props.facility),
                        active: props.active ? props.active : undefined,
                        currentPage: props.currentPage ? props.currentPage : undefined,
                        name: props.name ? props.name : undefined,
                        guests: Abridgers.GUESTS(theGuests),
                    });
                }
            } catch (error) {
                logger.error({
                    context: "useFetchGuests.fetchGuests",
                    facility: Abridgers.FACILITY(props.facility),
                    active: props.active ? props.active : undefined,
                    currentPage: props.currentPage ? props.currentPage : undefined,
                    name: props.name ? props.name : undefined,
                    error: error,
                });
                setError(error as Error);
            }

            setLoading(false);
            setGuests(theGuests);

        }

        fetchGuests();

    }, [props.active, props.currentPage, props.facility,
        props.pageSize, props.name, props.withFacility]);

    return {
        error: error ? error : null,
        guests: guests,
        loading: loading,
    }

}

export default useFetchGuests;
