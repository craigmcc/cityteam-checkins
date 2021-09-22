// useFetchFacility --------------------------------------------------------------

// Custom hook to fetch the specified Facility object that corresponds to
// input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import Facility, {FACILITIES_BASE} from "../models/Facility";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
//import * as Sorters from "../util/Sorters";

// Incoming Properties and Outgoing State ------------------------------------

// Either facilityId or name must be specified
export interface Props {
    facilityId?: number;                // ID of Facility to fetch
    name?: string;                      // Exact name of Facility to fetch
    withCheckins?: boolean;             // Include child Checkins? [false]
    withGuests?: boolean;               // Include child Guests? [false]
    withTemplates?: boolean;            // Include child Templates? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    facility: Facility;                 // Fetched facility (or id<0 for none)
}

// Component Details ---------------------------------------------------------

const useFetchFacility = (props: Props): State => {

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [facility, setFacility] = useState<Facility>(new Facility());

    useEffect(() => {

        const fetchFacility = async () => {

            setError(null);
            setLoading(true);
            let facility = new Facility();

            try {

                const parameters = {
                    withCheckins: props.withCheckins ? "" : undefined,
                    withGuests: props.withGuests ? "" : undefined,
                    withTemplates: props.withTemplates ? "" : undefined,
                };

                // TODO - what happens on a NotFound?
                if (props.facilityId) {
                    facility = (await Api.get(FACILITIES_BASE
                        + `/${props.facilityId}`
                        + `${queryParameters(parameters)}`)).data;
                } else if (props.name) {
                    facility = (await Api.get(FACILITIES_BASE
                        + `/exact/${props.name}`
                        + `${queryParameters(parameters)}`)).data;
                }
/*
                if (facility.checkins && (facility.checkins.length > 0)) {
                    facility.checkins = Sorters.CHECKINS(facility.checkins);
                }
*/
/*
                if (facility.guests && (facility.guests.length > 0)) {
                    facility.guests = Sorters.GUESTS(facility.guests);
                }
*/
/*
                if (facility.templates && (facility.templates.length > 0)) {
                    facility.templates = Sorters.TEMPLATES(facility.templates);
                }
*/
                logger.debug({
                    context: "useFetchFacility.fetchFacility",
                    facilityId: props.facilityId ? props.facilityId : undefined,
                    name: props.name ? props.name : undefined,
                    facility: Abridgers.FACILITY(facility),
                });

            } catch (error) {
                logger.error({
                    context: "useFetchFacility.fetchFacility",
                    facilityId: props.facilityId ? props.facilityId : undefined,
                    name: props.name ? props.name : undefined,
                    error: error,
                });
                setError(error as Error);
            }

            setLoading(false);
            setFacility(facility);

        }

        fetchFacility();

    }, [props]);

    return {
        error: error,
        loading: loading,
        facility: facility,
    }

}

export default useFetchFacility;
