const Joi = require("@hapi/joi");

const authSchema =
{
    register: Joi.object({
        email: Joi.string().email().lowercase().required(),
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        fullname: Joi.string().required(),
    }),
    login: Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    })
}

module.exports = {
    authSchema,
}