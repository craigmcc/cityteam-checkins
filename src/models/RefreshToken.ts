// RefreshToken --------------------------------------------------------------

// OAuth refresh token created by @craigmcc/oauth-orchestrator.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import User from "./User";

// Public Objects ------------------------------------------------------------

@Table({
    modelName: "refreshToken",
    tableName: "refresh_tokens",
})
class RefreshToken extends AbstractModel<RefreshToken> {

    @Column({
        allowNull: false,
        field: "access_token",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "accessToken: Is required",
            }
        }
    })
    accessToken!: string;

    @Column({
        allowNull: false,
        field: "expires",
        type: DataType.DATE,
        validate: {
            notNull: {
                msg: "expires: Is required",
            }
        }
    })
    expires!: Date;

    @Column({
        allowNull: false,
        field: "token",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "token: Is required",
            }
        }
    })
    token!: string;

    @BelongsTo(() => User, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    user!: User;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        field: "user_id",
        type: DataType.INTEGER,
        validate: {
            notNull: {
                msg: "userId: Is required",
            }
        }
    })
    userId!: number;

}

export default RefreshToken;
