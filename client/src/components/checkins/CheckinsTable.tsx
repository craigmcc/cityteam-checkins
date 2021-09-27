// CheckinsTable -------------------------------------------------------------

// An HTML table containing Checkin objects, with tweaks to control
// the details of what information gets included.

// External Objects ----------------------------------------------------------

import React from "react";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import {HandleCheckin} from "../../types";
import Checkin from "../../models/Checkin";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleCheckin?: HandleCheckin;      // Handle selection events [no handler]
    checkins: Checkin[];                // Checkin objects to be included
    title?: string;                     // Report title [no title]
    withCheckinDate?: boolean;          // Include a checkinDate column? [false]
}

// Component Details ---------------------------------------------------------

const CheckinsTable = (props: Props) => {

    const handleCheckin: HandleCheckin = (theCheckin) => {
        if (props.handleCheckin) {
            props.handleCheckin(theCheckin);
        }
    }

    return (
        <Table
            bordered={true}
            hover={true}
            id="CheckinsTable"
            size="sm"
            striped={true}
        >

            <thead>
            {(props.title) ? (
                <tr className="table-dark">
                    <th
                        className="text-center" colSpan={99}
                        // colSpan={(props.withCheckinDate) ? 15 : 14}
                    >
                        {props.title}
                    </th>
                </tr>
            ) : null }
            <tr className="table-secondary">
                {props.withCheckinDate ? (
                    <th scope="col">Checkin Date</th>
                ) : null}
                <th scope="col">Mat</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">$$</th>
                <th scope="col">Amount</th>
                <th scope="col">Shower</th>
                <th scope="col">Wakeup</th>
                <th scope="col">Comments</th>
            </tr>
            </thead>

            <tbody>
            {props.checkins.map((checkin, rowIndex) => (
                <tr
                    className="table-default"
                    key={1000 + (rowIndex * 100)}
                    onClick={() => handleCheckin(checkin)}
                >
                    {props.withCheckinDate ? (
                        <td key={1000 + (rowIndex * 100) + 0}>
                            {checkin.checkinDate}
                        </td>
                    ) : null}
                    <td className="text-center" key={1000 + (rowIndex * 100) + 1}>
                        {checkin.matNumber}{checkin.features}
                    </td>
                    <td key={1000 + (rowIndex * 100) + 2}>
                        {checkin.guest ? checkin.guest.firstName : ""}
                    </td>
                    <td key={1000 + (rowIndex * 100) + 3}>
                        {checkin.guest ? checkin.guest.lastName : ""}
                    </td>
                    <td key={1000 + (rowIndex * 100) + 4}>
                        {checkin.paymentType}
                    </td>
                    <td key={1000 + (rowIndex * 100) + 5}>
                        {checkin.paymentAmount}
                    </td>
                    <td key={1000 + (rowIndex * 100) + 6}>
                        {checkin.showerTime}
                    </td>
                    <td key={1000 + (rowIndex * 100) + 7}>
                        {checkin.wakeupTime}
                    </td>
                    <td key={1000 + (rowIndex * 100) + 8}>
                        {checkin.comments}
                    </td>
                </tr>
            ))}
            </tbody>

        </Table>
    )

}

export default CheckinsTable;
