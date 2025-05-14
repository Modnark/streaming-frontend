const Joi = require('joi');
const userCreateSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(24).required(),
    password: Joi.string().min(8).max(256).required(),
    passwordConfirmation: Joi.any().valid(Joi.ref('password')).required().messages({'any.only': 'Passwords must match.'})
    // registration token later
}).unknown(true);

module.exports = {
    test: (body) => {
        return userCreateSchema.validate(body);
    }
}