// SummariesTable ------------------------------------------------------------

// An HTML table containing Summary objects, with tweaks to control
// the details of what information gets included.

// External Objects ----------------------------------------------------------

import React from "react";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import {HandleSummary} from "../../types";
import Summary from "../../models/Summary";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleSummary?: HandleSummary;      // Handle selection events [no handler]
    summaries: Summary[];               // Summary objects to be included
    title?: string;                     // Report title [no title]
    withCheckinDate?: boolean;          // Include a checkinDate column? [false]
}

// Component Details ---------------------------------------------------------

const SummariesTable = (props: Props) => {

    const handleSummary: HandleSummary = (theSummary) => {
        if (props.handleSummary) {
            props.handleSummary(theSummary);
        }
    }

    return (
        <Table
            bordered={true}
            hover={true}
            id="SummariesTable"
            size="sm"
            striped={true}
        >

            <thead>
            {(props.title) ? (
                <tr className="table-dark">
                    <th className="text-center" colSpan={99}>
                        {props.title}
                    </th>
                </tr>
            ) : null }
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

            <tbody>
            {props.summaries.map((summary, rowIndex) => (
                <tr
                    className="table-default"
                    key={1000 + (rowIndex * 100)}
                    onClick={() => handleSummary(summary)}
                >
                    {props.withCheckinDate ? (
                        <td key={1000 + (rowIndex * 100) + 0}>
                            {summary.checkinDate}
                        </td>
                    ) : null}
                    <td className="text-right" key={1000 + (rowIndex * 100) + 1}>
                        {summary.total$$}
                    </td>
                    <td className="text-right" key={1000 + (rowIndex * 100) + 2}>
                        {summary.totalAG}
                    </td>
                    <td className="text-right" key={1000 + (rowIndex * 100) + 3}>
                        {summary.totalCT}
                    </td>
                    <td className="text-right" key={1000 + (rowIndex * 100) + 4}>
                        {summary.totalFM}
                    </td>
                    <td className="text-right" key={1000 + (rowIndex * 100) + 5}>
                        {summary.totalMM}
                    </td>
                    <td className="text-right" key={1000 + (rowIndex * 100) + 6}>
                        {summary.totalSW}
                    </td>
                    <td className="text-right" key={1000 + (rowIndex * 100) + 7}>
                        {summary.totalUK}
                    </td>
                    <td className="text-right" key={1000 + (rowIndex * 100) + 8}>
                        {summary.totalWB}
                    </td>
                    <td className="text-right" key={1000 + (rowIndex * 100) + 9}>
                        {summary.totalAssigned}
                    </td>
                    <td className="text-right" key={1000 + (rowIndex * 100) + 10}>
                        {summary.percentAssigned}
                    </td>
                    <td className="text-right" key={1000 + (rowIndex * 100) + 11}>
                        {summary.totalUnassigned}
                    </td>
                    <td className="text-right" key={1000 + (rowIndex * 100) + 12}>
                        {summary.percentUnassigned}
                    </td>
                    <td className="text-right" key={1000 + (rowIndex * 100) + 13}>
                        {summary.totalMats}
                    </td>
                    <td className="text-right" key={1000 + (rowIndex * 100) + 14}>
                        {summary.totalAmountDisplay}
                    </td>
                </tr>
            ))}
            </tbody>

        </Table>
    )

}

export default SummariesTable;
