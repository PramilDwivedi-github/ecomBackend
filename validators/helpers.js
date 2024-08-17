const { validationResult } = require("express-validator")

const getValidationResult = (req)=>{
    const result = validationResult(req);
    const formatedResult = result.formatWith(err=>{
        let error = {};
        error[err.path] = err.msg;
        return error;
    })

    return formatedResult.array();
}


const   validate = (validations) =>{
    return async (req, res, next) => {
        for (const validation of validations) {
          await validation.run(req);
        }
        next();
    };
}

module.exports = {getValidationResult , validate}