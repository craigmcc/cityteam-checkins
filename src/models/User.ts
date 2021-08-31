// User ----------------------------------------------------------------------

// User authenticated via @craigmcc/oauth-orchestrator.

// External Modules ----------------------------------------------------------

import {Column, DataType, HasMany, Table}
    from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import AccessToken from "./AccessToken";
import {validateUserUsernameUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";
import RefreshToken from "./RefreshToken";

// Public Objects -----------------------------------------------------------

@Table({
    modelName: "user",
    tableName: "users",
    validate: {
        isUsernameUnique: async function(this: User): Promise<void> {
            if (!(await validateUserUsernameUnique(this))) {
                throw new BadRequest(`username: Username '${this.username}' is already in use`);
            }
        }
    },
})
class User extends AbstractModel<User> {

    @HasMany(() => AccessToken)
    accessTokens!: AccessToken[];

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
        field: "name",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "name: Is required",
            }
        }
    })
    name!: string;

    @Column({
        allowNull: false,
        field: "password",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "password: Is required",
            }
        }
    })
    password!: string; // NOTE: this value is hashed

    @HasMany(() => RefreshToken)
    refreshTokens!: RefreshToken[];

    @Column({
        allowNull: false,
        field: "scope",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "scope: Is required",
            }
        }
    })
    scope!: string;

    @Column({
        allowNull: false,
        field: "username",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "username: Is required",
            }
        }
    })
    username!: string;

}

export default User;
