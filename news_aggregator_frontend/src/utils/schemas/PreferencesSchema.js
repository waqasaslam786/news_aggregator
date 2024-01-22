import Joi from "joi";

export const FirstStepSchema = Joi.object({
  sources: Joi.array()
    .items(Joi.object().required())
    .messages({
      "array.includesRequiredUnknowns": `Please select at least one source`,
      "array.min": `Please select at least one source`,
    })
    .min(1)
    .required(),
});

export const SecondStepSchema = Joi.object({
  categories: Joi.array()
    .items(Joi.object().required())
    .messages({
      "array.includesRequiredUnknowns": `Please select at least one category`,
      "array.min": `Please select at least one category`,
    })
    .min(1)
    .required(),
});

export const ThirdStepSchema = Joi.object({
  authors: Joi.array()
    .items(Joi.object().required())
    .messages({
      "array.includesRequiredUnknowns": `Please select at least one author`,
      "array.min": `Please select at least one author`,
    })
    .min(1)
    .required(),
});
