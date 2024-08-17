const BaseError = require("./baseError");

class ValidationError extends BaseError{
    constructor(errors,message){
        super(400,message || "Validation Error",errors);
    }
}

module.exports = ValidationError