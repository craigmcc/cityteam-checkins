// Checkin -------------------------------------------------------------------

// An overnight mat available on a specific date, within a specific Facility,
// optionally assigned to a specific Guest (with related details).

// External Modules ----------------------------------------------------------

const {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Table
} = require("sequelize-typescript");

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import Facility from "./Facility";
import Guest from "./Guest";
import {
    validateFeatures,
    validateMatNumber,
    validatePaymentAmount,
    validatePaymentType
} from "../util/ApplicationValidators";
import {
    validateCheckinKeyUnique,
    validateFacilityId,
    validateGuestId
} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    modelName: "checkin",
    tableName: "checkins",
    validate: {
        isCheckinKeyUnique: async function(this: Checkin): Promise<void> {
            if (!(await validateCheckinKeyUnique(this))) {
                throw new BadRequest
                    (`matNumber: Mat number ${this.matNumber} `
                        + `is already in use on checkin date ${this.checkinDate} `
                        + `within this Facility`);
            }
        },
        isFacilityIdValid: async function(this: Checkin): Promise<void> {
            if (!(await validateFacilityId(this.facilityId))) {
                throw new BadRequest
                    (`facilityId: Missing Facility ${this.facilityId}`);
            }
        },
        isGuestIdValid: async function(this: Checkin): Promise<void> {
            if (!(await validateGuestId(this.facilityId, this.guestId))) {
                throw new BadRequest
                    (`guestId: Missing Guest ${this.guestId}`);
            }
        },
    }
})
class Checkin extends AbstractModel<Checkin> {

    // Field order to get uniqueness key correct

    @BelongsTo(() => Facility, {
        foreignKey: { allowNull: true },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    facility!: Facility;

    @ForeignKey(() => Facility)
    @Column({
        allowNull: false,
        field: "facility_id",
        type: DataType.INTEGER,
        unique: "uniqueCheckinKeyWithinFacility",
        validate: {
            notNull: { msg: "facilityId: Is required" }
        },
    })
    facilityId!: number;

    @Column({
        allowNull: false,
        field: "checkin_date",
        type: DataType.DATEONLY,
        unique: "uniqueCheckinKeyWithinFacility",
        validate: {
            notNull: { msg: "checkinDate: Is required" }
        },
    })
    checkinDate!: Date;

    @Column({
        allowNull: false,
        field: "mat_number",
        type: DataType.INTEGER,
        unique: "uniqueCheckinKeyWithinFacility",
        validate: {
            isValidMatNumber: function(value: number): void {
                if (value) {
                    if (!validateMatNumber(value)) {
                        throw new BadRequest(`matNumber:  Invalid mat number ${value}`);
                    }
                }
            },
        }
    })
    matNumber!: number;

    // Remaining fields in alphabetical order

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    comments?: string;

    @Column({
        allowNull: true,
        type: DataType.STRING,
        validate: {
            isFeaturesValid: function(value: string): void {
                if (!validateFeatures(value)) {
                    throw new BadRequest
                        (`features: Invalid features list '${value}'`);
                }
            }
        }
    })
    features?: string;

    @BelongsTo(() => Guest,{
        foreignKey: { allowNull: true },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    })
    guest?: Guest;

    @ForeignKey(() => Guest)
    @Column({
        allowNull: true,
        field: "guest_id",
        type: DataType.INTEGER,
    })
    guestId?: number;

    @Column({
        allowNull: true,
        field: "payment_amount",
        type: DataType.DECIMAL(5, 2),
        validate: {
            isValidPaymentAmount: function(value: number): void {
                if (!validatePaymentAmount(value)) {
                    throw new BadRequest
                        (`paymentAmount: Invalid payment amount ${value}`);
                }
            },
        },
    })
    paymentAmount?: number;

    @Column({
        allowNull: true,
        field: "payment_type",
        type: DataType.TEXT,
        validate: {
            isValidPaymentType: function(value: string): void {
                if (value) {
                    if (!validatePaymentType(value)) {
                        throw new BadRequest
                            (`paymentType: Invalid payment type ${value}`);
                    }
                }
            },
        },
    })
    paymentType?: string;

}

export default Checkin;
