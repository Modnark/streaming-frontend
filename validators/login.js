const Joi = require('joi');
const loginSchema = Joi.object().keys({
    username: Joi.string().pattern(/^(?!.*[-_.].*[-_.])[a-zA-Z0-9\-_.]+$/).min(3).max(24).required(),
    password: Joi.string().min(8).max(256).required(),
}).unknown(true);

module.exports = {
    test: (body) => {
        return loginSchema.validate(body);
    }
}