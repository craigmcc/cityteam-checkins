// Facility ------------------------------------------------------------------

// A CityTeam facility with overnight guests managed by this application.

// External Modules ----------------------------------------------------------

import {Column, DataType, HasMany, Table}
    from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import {
    validateFacilityNameUnique,
    validateFacilityScopeUnique
} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    modelName: "facility",
    tableName: "facilities",
    validate: {
        isNameUnique: async function(this: Facility): Promise<void> {
            if (!(await validateFacilityNameUnique(this))) {
                throw new BadRequest(`name: Name '${this.name}' is already in use`);
            }
        },
        isScopeUnique: async function(this: Facility): Promise<void> {
            if (!(await validateFacilityScopeUnique(this))) {
                throw new BadRequest(`scope: Scope '${this.scope}' is already in use`);
            }
        },
    }
})
class Facility extends AbstractModel<Facility> {

    @Column({
        allowNull: false,
        defaultValue: true,
        type: DataType.BOOLEAN,
        validate: {
            notNull: {
                msg: "active: Is required"
            }
        }
    })
    active!: boolean;

    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    address1?: string;

    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    address2?: string;

    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    city?: string;

    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    email?: string;

    @Column({
        allowNull: false,
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
        type: DataType.TEXT,
    })
    phone?: string;

    @Column({
        allowNull: false,
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "scope: Is required",
            }
        }
    })
    scope!: string;

    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    state?: string;

    @Column({
        allowNull: true,
        field: "zipcode",
        type: DataType.TEXT,
    })
    zipCode?: string;

}

export default Facility;
