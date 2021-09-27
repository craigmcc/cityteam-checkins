// useFetchCheckins ------------------------------------------------------------

// Custom hook to fetch Checkin objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import Facility from "../models/Facility";
import Checkin, {CHECKINS_BASE} from "../models/Checkin";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    available?: boolean;                // Select only non-assigned Checkins? [false]
    currentPage?: number;               // One-relative current page number [1]
    date?: string;                      // Select for this Checkin date [no filter]
    facility: Facility;                 // Parent Facility
    guestId?: number;                   // Select for this guestId [no filter]
    pageSize?: number;                  // Number of entries per page [100]
    withFacility?: boolean;             // Include parent Facility? [false]
    withGuest?: boolean;                // Include parent Guest (if any)? [false]
}

export interface State {
    checkins: Checkin[];                    // Fetched Checkins
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
}

// Hook Details --------------------------------------------------------------

const useFetchCheckins = (props: Props): State => {

    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchCheckins = async () => {

            setError(null);
            setLoading(true);
            let theCheckins: Checkin[] = [];

            try {
                if ((props.facility.id > 0) && (props.date || props.guestId)) { // Too many Checkins for a useful non-filtered fetch
                    const limit = props.pageSize ? props.pageSize : 100;
                    const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
                    const parameters = {
                        available: props.available ? "" : undefined,
                        date: props.date ? props.date : undefined,
                        guestId: props.guestId ? props.guestId : undefined,
                        limit: limit,
                        offset: offset,
                        withFacility: props.withFacility ? "" : undefined,
                        withGuest: props.withGuest ? "" : undefined,
                    }
                    theCheckins = (await Api.get(CHECKINS_BASE
                        + `/${props.facility.id}${queryParameters(parameters)}`)).data;
                    logger.debug({
                        context: "useFetchCheckins.fetchCheckins",
                        facility: Abridgers.FACILITY(props.facility),
                        available: props.available ? props.available : undefined,
                        currentPage: props.currentPage ? props.currentPage : undefined,
                        date: props.date ? props.date : undefined,
                        guestId: props.guestId ? props.guestId : undefined,
                        checkins: Abridgers.CHECKINS(theCheckins),
                    });
                }
            } catch (error) {
                logger.error({
                    context: "useFetchCheckins.fetchCheckins",
                    facility: Abridgers.FACILITY(props.facility),
                    available: props.available ? props.available : undefined,
                    currentPage: props.currentPage ? props.currentPage : undefined,
                    date: props.date ? props.date : undefined,
                    guestId: props.guestId ? props.guestId : undefined,
                    error: error,
                });
                setError(error as Error);
            }

            setLoading(false);
            setCheckins(theCheckins);

        }

        fetchCheckins();

    }, [props.available, props.currentPage, props.date, props.facility,
        props.guestId, props.pageSize, props.withFacility, props.withGuest]);

    return {
        checkins: checkins,
        error: error ? error : null,
        loading: loading,
    }

}

export default useFetchCheckins;