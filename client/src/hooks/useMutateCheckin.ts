// useMutateCheckin ----------------------------------------------------------

// Custom hook to encapsulate assigning, deassigning, and reassigning Guests
// for already existing Checkins.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleAssign} from "../types";
import Api from "../clients/Api";
import Assign from "../models/Assign";
import Checkin, {CHECKINS_BASE} from "../models/Checkin";
import Template from "../models/Template";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";

// Incoming Properties and Outgoing State ------------------------------------

type HandleGenerate = (checkinDate: string, template: Template) => Promise<Checkin[]>;

export interface Props {
    checkin: Checkin;                   // The Checkin being managed
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    assign: HandleAssign;               // Handle Checkin assignment
    deassign: HandleAssign;             // Handle Checkin deassignment
    generate: HandleGenerate;           // Handle generating Checkins from a Template
    reassign: HandleAssign;             // Handle Checkin reassignment
}

// Component Details ---------------------------------------------------------

const useMutateCheckin = (props: Props): State => {

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.info({
            context: "useMutateCheckin.useEffect",
            checkin: props.checkin,
        });
    }, [props.checkin]);

    const assign: HandleAssign = async (theAssign: Assign): Promise<Checkin> => {

        let assigned = new Checkin();
        setError(null);
        setExecuting(true);

        try {
            assigned = (await Api.post(CHECKINS_BASE
                + `/${props.checkin.facilityId}/${props.checkin.id}/assignment`, theAssign)).data;
            logger.info({
                context: "useMutateCheckin.assign",
                checkin: assigned,
            });
        } catch (error) {
            logger.error({
                context: "useMutateCheckin.assign",
                assign: theAssign,
                error: error,
            });
            setError(error as Error);
        }

        setExecuting(false);
        return assigned;

    }

    const deassign: HandleAssign = async (theAssign: Assign): Promise<Checkin> => {

        let deassigned = new Checkin();
        setError(null);
        setExecuting(true);

        try {
            deassigned = (await Api.delete(CHECKINS_BASE
                + `/${props.checkin.facilityId}/${props.checkin.id}/assignment`)).data;
            logger.info({
                context: "useMutateCheckin.deassign",
                checkin: deassigned,
            });
        } catch (error) {
            logger.error({
                context: "useMutateCheckin.deassign",
                assign: theAssign,
                error: error,
            });
            setError(error as Error);
        }

        setExecuting(false);
        return deassigned;

    }

    const generate: HandleGenerate = async (checkinDate, template) => {

        let checkins: Checkin[] = [];
        setError(null);
        setExecuting(true);

        try {
            checkins = (await Api.post(CHECKINS_BASE
                + `/${template.facilityId}/generate/${checkinDate}/${template.id}`)).data;
            logger.info({
                context: "useMutateCheckin.generate",
                checkinDate: checkinDate,
                template: Abridgers.TEMPLATE(template),
                checkins: Abridgers.CHECKINS(checkins),
            });
        } catch (error) {
            logger.error({
                context: "useMutateCheckin.generate",
                checkinDate: checkinDate,
                template: Abridgers.TEMPLATE(template),
                error: error,
            });
            setError(error as Error);
        }

        setExecuting(false);
        return checkins;

    }

    const reassign: HandleAssign = async (theAssign: Assign): Promise<Checkin> => {

        let reassigned = new Checkin();
        setError(null);
        setExecuting(true);

        try {
            reassigned = (await Api.put(CHECKINS_BASE
                + `/${props.checkin.facilityId}/${props.checkin.id}/assignment`, theAssign)).data;
            logger.info({
                context: "useMutateCheckin.reassign",
                checkin: reassigned,
            });
        } catch (error) {
            logger.error({
                context: "useMutateCheckin.reassign",
                assign: theAssign,
                error: error,
            });
            setError(error as Error);
        }

        setExecuting(false);
        return reassigned;

    }

    return {
        error: error,
        executing: executing,
        assign: assign,
        deassign: deassign,
        generate: generate,
        reassign: reassign,
    }

}

export default useMutateCheckin;
