const Joi = require('joi');

module.exports.categorySchema = Joi.object({
    category: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow('', null),
        section: Joi.string().allow('', null)
    }).required()
});
