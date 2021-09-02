// AbstractModel -------------------------------------------------------------

// Abstract base class for Sequelize model classes in this application.

// External Modules ----------------------------------------------------------

import {Column, DataType, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Columns that should be included in every Sequelize model.
 */
@Table({
    timestamps: false,
    version: false,
})
abstract class AbstractModel<Model> extends Model {

    @Column({
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataType.INTEGER,
    })
    id!: number;

}

export default AbstractModel;
