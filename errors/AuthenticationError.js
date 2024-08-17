const BaseError = require("./baseError");

class AuthenticationError extends BaseError{
    constructor(errors,message){
        super(401,message || "Failed to Authenticate!",errors);
    }
}

module.exports = AuthenticationError;