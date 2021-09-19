// Model ---------------------------------------------------------------------

// Abstract base for classes representing data models.

// Public Objects ------------------------------------------------------------

abstract class Model {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : -1;
    }

    id!: number;

}

export default Model;
