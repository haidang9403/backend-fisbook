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
    }),
    registerAdmin: Joi.object({
        fullname: Joi.string().required(),
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    }),
}

const bookSchema =
{
    update: Joi.object({
        title: Joi.string(),
        img: Joi.string(),
        price: Joi.number(),
        amount: Joi.number(),
        author: Joi.string(),
        category: Joi.string(),
        publisher: Joi.string(),
    }),
    add: Joi.object({
        title: Joi.string().required(),
        img: Joi.string().required(),
        price: Joi.number(),
        amount: Joi.number(),
        author: Joi.string(),
        category: Joi.string(),
        publisher: Joi.string(),
    })
}

module.exports = {
    authSchema,
    bookSchema,
}