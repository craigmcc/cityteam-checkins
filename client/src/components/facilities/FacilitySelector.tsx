// FacilitySelector ----------------------------------------------------------

// Selector drop-down to choose which Facility the user wants to interact with.
// NOTE: any change in the selection will be propagated to FacilityContext,
// as well as to any specified handleFacility function.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Form from "react-bootstrap/Form";

// Internal Modules ----------------------------------------------------------

import {HandleFacility, OnChangeSelect} from "../../types";
import FacilityContext from "../../contexts/FacilityContext";
import Facility from "../../models/Facility";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties ------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // Should element receive autoFocus? [false]
    disabled?: boolean;                 // Should element be disabled? [false]
    handleFacility?: HandleFacility;    // Handle Facility selection [No handler]
    label?: string;                     // Element label [Facility:]
}

// Component Details ---------------------------------------------------------

export const FacilitySelector = (props: Props) => {

    const facilityContext = useContext(FacilityContext);

    const [index, setIndex] = useState<number>(0);
    const [options, setOptions] = useState<Facility[]>([]);

    useEffect(() => {
        const theOptions: Facility[] = [];
        theOptions.push(new Facility({id: -1, name: "(Please Select)"}));
        facilityContext.facilities.forEach(facility => {
            theOptions.push(facility);
        })
        setOptions(theOptions);
        logger.debug({
            context: "FacilitySelector.useEffect",
        });
    }, [facilityContext.facility, facilityContext.facilities]);

    const onChange: OnChangeSelect = (event) => {
        const theIndex = parseInt(event.target.value, 10);
        logger.debug({
            context: "FacilitySelector.onChange",
            index: theIndex,
            facility: Abridgers.FACILITY(options[theIndex]),
        });
        setIndex(theIndex);
        facilityContext.handleSelect(options[theIndex]);
        if (props.handleFacility) {
            props.handleFacility(options[theIndex]);
        }
    }

    return (
        <Form id="FacilitySelector" inline>
            <Form.Label className="mr-2" htmlFor="facilitySelector">
                {props.label ? props.label : "Facility:"}
            </Form.Label>
            <Form.Control
                as="select"
                autoFocus={props.autoFocus ? props.autoFocus : undefined}
                disabled={props.disabled ? props.disabled : undefined}
                id="facilitySelector"
                onChange={onChange}
                size="sm"
                value={index}
            >
                {options.map((option, index) => (
                    <option key={index} value={index}>
                        {option.name}
                    </option>
                ))}
            </Form.Control>
        </Form>
    )

}

export default FacilitySelector;
