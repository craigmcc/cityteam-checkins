// FacilityContext -----------------------------------------------------------

// React Context containing the currently available Facilities, plus the
// currently selected one.

// External Modules ----------------------------------------------------------

import React, {createContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleFacility} from "../types";
import useFetchFacilities from "../hooks/useFetchFacilities";
import Facility from "../models/Facility";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";

// Context Properties --------------------------------------------------------

export interface State {
    facilities: Facility[];             // Facilities currently available to this user
    facility: Facility;                 // Currently selected facility (dummy if id<0)
    handleRefresh: HandleAction;        // Trigger a refresh of available Facilities
    handleSelect: HandleFacility;       // Select the currently referenced Facility
}

export const FacilityContext = createContext<State>({
    facilities: [],
    facility: new Facility({name: "Never Selected"}),
    handleRefresh: () => {},
    handleSelect: () => {},
});

// Context Provider ----------------------------------------------------------

export const FacilityContextProvider = (props: any) => {

    const UNSELECTED_FACILITY = new Facility({name: "(Please Select)"});

    const [active, setActive] = useState<boolean>(true);
    const [availables, setAvailables] = useState<Facility[]>([]);
    const [facility, setFacility] = useState<Facility>(UNSELECTED_FACILITY);

    const fetchFacilities = useFetchFacilities({
        active: active,
        currentPage: 1,
        pageSize: 1000,
    })

    useEffect(() => {

        const theAvailables: Facility[] = [];
        fetchFacilities.facilities.forEach(theAvailable => {
            // TODO - keep only if available to the current user
            theAvailables.push(theAvailable);
        });

        logger.debug({
            context: "FacilityContext.useEffect",
            availables: Abridgers.FACILITIES(theAvailables),
        });
        setAvailables(theAvailables);

        if (facility.id > 0) {
            let found: Facility = new Facility({id: -1, name: "NOT SELECTED"});
            theAvailables.forEach(option => {
                if (facility.id === option.id) {
                    found = option;
                }
            });
            logger.debug({
                context: "FacilityContext.useEffect",
                msg: "Resetting currently selected Facility",
                facility: found,
            });
            setFacility(found);
        }

    }, [active, facility.id, fetchFacilities.facilities]);

    const handleRefresh: HandleAction = () => {
        logger.info({
            context: "FacilityContext.handleRefresh",
        });
        setActive(false); // Trigger useFetchFacilities to fetch again
        setActive(true);
    }

    const handleSelect: HandleFacility = (theFacility) => {
        logger.info({
            context: "FacilityContext.handleSelect",
            facility: Abridgers.FACILITY(theFacility),
        })
        if (theFacility.id < 0) {
            setFacility(UNSELECTED_FACILITY);
            return;
        }
        let found = false;
        availables.forEach(facility => {
            if (theFacility.id === facility.id) {
                setFacility(facility);
                found = true;
            }
        });
        if (found) {
            return;
        }
        logger.error({
            context: "FacilityContext.handleSelect",
            msg: "Attempt to select unavailable facility denied",
            facility: theFacility,
        });
        setFacility(UNSELECTED_FACILITY);
    }

    const facilityContext: State = {
        facilities: fetchFacilities.facilities, // TODO - filter by available to this user
        facility: facility,
        handleRefresh: handleRefresh,
        handleSelect: handleSelect,
    }

    return (
        <FacilityContext.Provider value={facilityContext}>
            {props.children}
        </FacilityContext.Provider>
    )

}

export default FacilityContext;
