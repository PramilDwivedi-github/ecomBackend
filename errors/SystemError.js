const BaseError = require("./baseError");

class SystemError extends BaseError{
    constructor(errors,message){
        super(500,message || "Internal Server Error",errors);
    }
}
module.exports = SystemError;