const Joi = require('joi');

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        country:Joi.string().required(),
        location:Joi.string().required(),
        price:Joi.number().required().min(0).max(100000),
        
    }).required()
})
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required(),
        commment:Joi.string().required(),
    }).required(),

})