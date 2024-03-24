import BaseJoi from "joi";
import { AppError } from "./AppError.js";
import sanitizeHtml from 'sanitize-html';

const extension = (joi) =>({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not not include HTML'
  },
  rules:{
    escapeHTML: {
      validate(value, helpers){
        const clean = sanitizeHtml(value,{
          allowedTags: [],
          allwedAttributes: {},
        });
        if(clean !== value) return helpers.error('string.escapeHTML', {value})
        return clean;
      }
    }
  }
})

const Joi = BaseJoi.extend(extension);

export const validateCampground = (req, res, next) => {
  const campgroundSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required().escapeHTML(),
      description: Joi.string().required().escapeHTML(),
      location: Joi.string().required().escapeHTML(),
      price: Joi.number().required().min(0),
      // image: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
  });
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

export const validateReview = (req, res, next) => {
  const reviewSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().required().min(0).max(5),
      body: Joi.string().required().escapeHTML(),
    }).required(),
  });
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};