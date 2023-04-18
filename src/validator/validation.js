const Joi = require('joi');

const registerValidation = (data) => {
  const schema = Joi.object({
    fname: Joi.string().required(),
    lname: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        pincode: Joi.number().required(),
    }).required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data);
};

// Validation schema for the product data
const productValidation = (data)=>{
const productSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  userId:Joi.string()
    .alphanum()
    .min(6)
    .max(24)
    .required(),
  currencyId: Joi.string().required(),
  currencyFormat: Joi.string().required(),
  deletedAt: Joi.date().allow(null),
  isDeleted: Joi.boolean(),
});
console.log(data)
return productSchema.validate(data)
}

// Validation schema for the payment data
const paymentValidation = (data)=>{
const paymentSchema = Joi.object({
  productId: Joi.string().required(),
  price:Joi.number().required()
  
});
return paymentSchema.validate(data)
}
const transactionValidation = (data)=>{
const transactionSchema = Joi.object({
  transactionId: Joi.string().required(),
});
return transactionSchema.validate(data)
}

// Validation schema for the verification code
const verificationvalidation = (data)=>{
const verificationSchema = Joi.object({
  transactionId: Joi.string().required(),
  verificationCode: Joi.string().length(6).required(),
});
return verificationSchema.validate(data)
}
module.exports =
 {
  registerValidation,
  loginValidation,
  productValidation,
  paymentValidation ,
  transactionValidation,
  verificationvalidation
}