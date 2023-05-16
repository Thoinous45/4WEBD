
const Joi = require('joi').extend(require('@joi/date'));
const passwordComplexity = require("joi-password-complexity");
const complexityOptions = {
    min: 6,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 3,
  };


const shemaRegister = Joi.object().keys({
  email: Joi.string().email().required(),
  password: passwordComplexity(complexityOptions),
  password_confirmation: Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' })
})


const shemaLogin = Joi.object().keys({
  email: Joi.string().email().required(),
  password: passwordComplexity(complexityOptions)
})


const shemaModifyUser =Joi.object().keys({
  password: passwordComplexity(complexityOptions),
  password_confirmation: Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' })
})



exports.userRegister = (req, res, next) => {
  const { value, error } = shemaRegister.validate(req.body);
  if (error) {
    res.status(406).json({ err: error, msg: "veuillez vérifier votre email/password" });
  } else {
    next();
  }
};

exports.userLogin = (req, res, next) => {
  const { value, error } = shemaLogin.validate(req.body);
  if (error) {
    res.status(406).json({ err: error, msg: "veuillez vérifier votre email/password" });
  } else {
    next();
  }
};

exports.userModify = (req, res, next) => {
  const { value, error } = shemaModifyUser.validate(req.body);
  if (error) {
    res.status(406).json({ err: error, msg: "Modification invalide" });
  } else {
    next();
  }
};

