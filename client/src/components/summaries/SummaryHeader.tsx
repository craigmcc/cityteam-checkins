// SummaryHeader -------------------------------------------------------------

// Renders the <thead> section for a table containing Summary rows.

// External Modules ----------------------------------------------------------

import React from "react";

// Incoming Properties -------------------------------------------------------

export interface Props {
    withCheckinDate?: boolean;          // Include Checkin Date column? [false]
}

// Component Details ---------------------------------------------------------

const SummaryHeader = (props: Props) => {

    return (
        <thead>
        <tr className="table-secondary">
            {props.withCheckinDate ? (
                <th scope="col">Checkin Date</th>
            ) : null}
            <th scope="col">$$</th>
            <th scope="col">AG</th>
            <th scope="col">CT</th>
            <th scope="col">FM</th>
            <th scope="col">MM</th>
            <th scope="col">SW</th>
            <th scope="col">UK</th>
            <th scope="col">WB</th>
            <th scope="col">Used</th>
            <th scope="col">%Used</th>
            <th scope="col">Empty</th>
            <th scope="col">%Empty</th>
            <th scope="col">Total Mats</th>
            <th scope="col">Total $$</th>
        </tr>
        </thead>
    )

}

export default SummaryHeader;
