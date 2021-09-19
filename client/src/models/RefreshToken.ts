// RefreshToken ---------------------------------------------------------------

// A refresh token that has been granted to a particular User.

// Internal Modules ----------------------------------------------------------

import Model from "./Model";

// Public Objects ------------------------------------------------------------

class RefreshToken extends Model {

    constructor(data: any = {}) {
        super(data);
        this.accessToken = data.accessToken ? data.accessToken : null;
        this.expires = data.expires ? data.expires : null;
        this.token = data.token ? data.token : null;
        this.userId = data.userId ? data.userId : null;
    }

    accessToken!: string;
    expires!: string;
    token!: string;
    userId!: number;

}

export default RefreshToken;
