// Times ---------------------------------------------------------------------

// All methods except fromDateObject (Date -> String) and
// toDateObject (String -> Date) accept and return strings
// in HH:MM format, where HH is 00-23.

// Note:  No validations are done here, use validators.validateTime as needed.

// External Modules ----------------------------------------------------------

import parse from "date-fns/parse";

// Public Objects ------------------------------------------------------------

// Return the time string from the specified Date object
export const fromTimeObject = (time: Date): string => {
    return leftPad(time.getHours(), 2) + ":" + leftPad(time.getMinutes(), 2);
}

// Return the Date object from the specified time string
export const toTimeObject = (time: string): Date => {
    if (time.length === 5) {
        return parse(time, "HH:mm", new Date());
    } else {
        return parse(time, "HH:mm:ss", new Date());
    }
}

// Private Objects -----------------------------------------------------------

// Zero-pad the input string with zeros until it is of the requested size.
const leftPad = (input: string | number, size: number): string => {
    let output = String(input);
    while (output.length < size) {
        output = "0" + output;
    }
    return output;
}

