const Joi = require("joi");

module.exports = {
    sendSuccess: (res, data,msg ='done',code=200) => {
        return res.status(code).send({
            success: true,
            msg: msg,
            data: data
        });
    },
    sendValidatorError: (res, errors = {}, msg = 'error', code = 422) => {
        console.log(errors);
        
        return res.status(code).send({
            success: false,
            msg: msg === 'error' && Object.keys(errors).length > 0 ? Object.values(errors)[0].message : msg,
            errors: errors
        });
    },
    sendError: (res, errors = {}, msg = 'error', code = 400) => {
        return res.status(code).send({
            success: false,
            msg: msg,
            errors: errors
        });
    },
    sendServerError: (res, errors = {}, msg = 'Server error', code = 500) => {
        console.log(errors);
        

        if(errors instanceof Joi.ValidationError && errors.isJoi){
            return res.status(400).send({
                success: false,
                msg: errors.details[0].message,
                errors: errors.details
            })
        }
        return res.status(code).send({
            success: false,
            msg: msg,
            errors: errors
        });
    },

}