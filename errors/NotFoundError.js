const BaseError = require("./baseError");

class NotFoundError extends BaseError{
    constructor(errors,message){
        super(404,message || "404 Resource Not Found!",errors);
    }
}

module.exports = NotFoundError;
