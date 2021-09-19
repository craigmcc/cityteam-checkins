// AccessToken ---------------------------------------------------------------

// An access token that has been granted to a particular User.

// Internal Modules ----------------------------------------------------------

import Model from "./Model";

// Public Objects ------------------------------------------------------------

class AccessToken extends Model {

    constructor(data: any = {}) {
        super(data);
        this.expires = data.expires ? data.expires : null;
        this.scope = data.scope ? data.scope : null;
        this.token = data.token ? data.token : null;
        this.userId = data.userId ? data.userId : null;
    }

    expires!: string;
    scope!: string;
    token!: string;
    userId!: number;

}

export default AccessToken;
