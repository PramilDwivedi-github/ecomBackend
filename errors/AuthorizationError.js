const BaseError = require("./baseError");

class AuthorizationError extends BaseError{
    constructor(errors,message){
        super(403,message || "Authorization Error",errors);
    }
}
module.exports = AuthorizationError;
