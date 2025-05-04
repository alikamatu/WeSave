const Joi = require('joi');

// Register validation
const registerValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().min(10).required()
    });
    return schema.validate(data);
};

// Login validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

// Savings plan validation
const savingsPlanValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        targetAmount: Joi.number().min(1).required(),
        frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').required(),
        contributionAmount: Joi.number().min(1).required(),
        withdrawalLimit: Joi.number().min(0),
        startDate: Joi.date().required(),
        endDate: Joi.date().greater(Joi.ref('startDate')).required()
    });
    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation,
    savingsPlanValidation
};