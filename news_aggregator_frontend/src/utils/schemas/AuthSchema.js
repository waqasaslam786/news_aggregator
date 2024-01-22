import Joi from "joi";

export const LoginSchema = Joi.object({
  email: Joi.string()
    .max(50)
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": `Please enter email address`,
      "string.email": `Please enter valid email address`,
      "string.max": `Email must be maximum 50 characters!`,
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": `Please enter password`,
    "string.min": `Password must be minimum 6 characters!`,
  }),
});

export const SignUpSchema = Joi.object({
  firstName: Joi.string().min(1).max(25).required().messages({
    "string.empty": `Please enter first name`,
    "string.min": `First name must be minimum 1 characters!`,
    "string.max": `First name must be minimum 25 characters!`,
  }),
  lastName: Joi.string().min(1).max(25).required().messages({
    "string.empty": `Please enter last name`,
    "string.min": `Last name must be minimum 1 characters!`,
    "string.max": `Last name must be minimum 25 characters!`,
  }),
  email: Joi.string()
    .max(50)
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": `Please enter email address`,
      "string.email": `Please enter valid email address`,
      "string.max": `Email must be maximum 50 characters!`,
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": `Please enter password`,
    "string.min": `Password must be minimum 6 characters!`,
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "string.empty": `Please enter confirm password `,
    "any.only": `Confirm password must match password`,
  }),
});
