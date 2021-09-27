// SummaryRow --------------------------------------------------------------

// Renders a <tr> section for a row of a table containing Summary information.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";

// Internal Modules ----------------------------------------------------------

import Summary from "../../models/Summary";

// Incoming Properties -------------------------------------------------------

export interface Props {
    keyBase: number;                    // Base value for key calculations [1000]
    rowIndex: number;                   // Zero-relative row index for this row
    summary: Summary;                   // Summary object being rendered
    withCheckinDate?: boolean;          // Include CheckinDate column? [false]
}

// Component Details ---------------------------------------------------------

const SummaryRow = (props: Props) => {

    const [keyBase] = useState<number>(props.keyBase ? props.keyBase : 1000);

    return (
        <tr
            className="table-default"
            key={keyBase + (props.rowIndex * 100)}
        >
            <td key={keyBase + (props.rowIndex * 100) + 1}>
                {props.summary.total$$}
            </td>
            <td key={keyBase + (props.rowIndex * 100) + 2}>
                {props.summary.totalAG}
            </td>
            <td key={keyBase + (props.rowIndex * 100) + 3}>
                {props.summary.totalCT}
            </td>
            <td key={keyBase + (props.rowIndex * 100) + 4}>
                {props.summary.totalFM}
            </td>
            <td key={keyBase + (props.rowIndex * 100) + 5}>
                {props.summary.totalMM}
            </td>
            <td key={keyBase + (props.rowIndex * 100) + 6}>
                {props.summary.totalSW}
            </td>
            <td key={keyBase + (props.rowIndex * 100) + 7}>
                {props.summary.totalUK}
            </td>
            <td key={keyBase + (props.rowIndex * 100) + 8}>
                {props.summary.totalWB}
            </td>
            <td key={keyBase + (props.rowIndex * 100) + 9}>
                {props.summary.totalAssigned}
            </td>
            <td key={keyBase + (props.rowIndex * 100) + 10}>
                {props.summary.percentAssigned}
            </td>
            <td key={keyBase + (props.rowIndex * 100) + 11}>
                {props.summary.totalUnassigned}
            </td>
            <td key={keyBase + (props.rowIndex * 100) + 12}>
                {props.summary.percentUnassigned}
            </td>
            <td key={keyBase + (props.rowIndex * 100) + 13}>
                {props.summary.totalMats}
            </td>
            <td key={keyBase + (props.rowIndex * 100) + 14}>
                {props.summary.totalAmountDisplay}
            </td>
        </tr>
    )

}

export default SummaryRow;
