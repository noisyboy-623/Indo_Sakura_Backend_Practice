const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(4)
    .required(),
});

module.exports = registerSchema;