const AuthenticationError = require("./AuthenticationError");
const AuthorizationError = require("./AuthorizationError");
const NotFoundError = require("./NotFoundError");
const SystemError = require("./SystemError");
const ValidationError = require("./validationError");

const handleError = (error)=>{
    if(!(error instanceof AuthenticationError || error instanceof AuthorizationError || error instanceof ValidationError || error instanceof NotFoundError))
    return new SystemError(null,error.message);
    return error; 
}

module.exports.handleError = handleError;