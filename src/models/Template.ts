// Template ------------------------------------------------------------------

// A pattern for generating mats for Checkins at a particular Facility, on a
// particular date.

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
import {validateMatsList, validateMatsSubset} from "../util/ApplicationValidators";
import {validateFacilityId, validateTemplateNameUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    modelName: "template",
    tableName: "templates",
    validate: {
        isFacilityIdValid: async function(this: Template): Promise<void> {
            if (!(await validateFacilityId(this.facilityId))) {
                throw new BadRequest(`facilityId: Invalid facilityId ${this.facilityId}`);
            }
        },
        isHandicapMatsValidSubset: function(this: Template): void {
            if (this.allMats && this.handicapMats) {
                if (!validateMatsSubset(this.allMats, this.handicapMats)) {
                    throw new BadRequest(`handicapMats: Is not a subset of allMats`);
                }
            }
        },
        isTemplateNameUnique: async function(this: Template): Promise<void> {
            if (!(await validateTemplateNameUnique(this))) {
                throw new BadRequest(`name: Name '${this.name}' is already in use within this Facility`);
            }
        },
        isSocketMatsValidSubset: function(this: Template): void {
            if (this.allMats && this.socketMats) {
                if (!validateMatsSubset(this.allMats, this.socketMats)) {
                    throw new BadRequest(`socketMats: Is not a subset of allMats`);
                }
            }
        },
        isWorkMatsValidSubset: function(this: Template): void {
            if (this.allMats && this.workMats) {
                if (!validateMatsSubset(this.allMats, this.workMats)) {
                    throw new BadRequest(`workMats: Is not a subset of allMats`);
                }
            }
        },
    }
})
class Template extends AbstractModel<Template> {

    @Column({
        allowNull: false,
        defaultValue: true,
        field: "active",
        type: DataType.BOOLEAN,
        validate: {
            notNull: {
                msg: "active: Is required",
            }
        }
    })
    active!: boolean;

    @Column({
        allowNull: false,
        field: "all_mats",
        type: DataType.TEXT,
        validate: {
            isAllMatsValid: function(value: string): void {
                if (value) {
                    if (!validateMatsList(value)) {
                        throw new BadRequest(`allMats: Invalid mats list '${value}'`);
                    }
                }
            },
            notNull: {
                msg: "allMats: Is required",
            }
        }
    })
    allMats!: string;

    @Column({
        allowNull: true,
        field: "comments",
        type: DataType.TEXT,
    })
    comments?: string;

    @BelongsTo(() => Facility, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    facility!: Facility;

    @ForeignKey(() => Facility)
    @Column({
        allowNull: false,
        field: "facility_id",
        type: DataType.INTEGER,
        validate: {
            notNull: {
                msg: "facilityId: Is required",
            }
        }
    })
    facilityId!: number;

    @Column({
        allowNull: true,
        field: "handicap_mats",
        type: DataType.TEXT,
        validate: {
            isHandicapMatsValid: function(value: string): void {
                if (value) {
                    if (!validateMatsList(value)) {
                        throw new BadRequest(`handicapMats: Invalid mats list '${value}'`);
                    }
                }
            },
        }
    })
    handicapMats!: string;

    @Column({
        allowNull: false,
        field: "name",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "name: Is required",
            }
        }
    })
    name!: string;

    @Column({
        allowNull: true,
        field: "socket_mats",
        type: DataType.TEXT,
        validate: {
            isSocketMatsValid: function(value: string): void {
                if (value) {
                    if (!validateMatsList(value)) {
                        throw new BadRequest(`socketMats: Invalid mats list '${value}'`);
                    }
                }
            },
        }
    })
    socketMats!: string;

    @Column({
        allowNull: true,
        field: "work_mats",
        type: DataType.TEXT,
        validate: {
            isWorkMatsValid: function(value: string): void {
                if (value) {
                    if (!validateMatsList(value)) {
                        throw new BadRequest(`workMats: Invalid mats list '${value}'`);
                    }
                }
            },
        }
    })
    workMats!: string;

}

export default Template;
