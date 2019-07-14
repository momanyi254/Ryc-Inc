const Joi = require('joi');


exports.signupValidator = (newUser) => {
	const schema = Joi.object().keys({
		username: Joi.string().required(),
		email: Joi.string().required().email({ minDomainAtoms: 2 }),
		address: Joi.string().required(),
		password: Joi.string().required(),
		isAdmin:  Joi.string()
	});
	return Joi.validate(newUser, schema);
};
exports.loginValidator = (user) => {
	const schema = Joi.object().keys({
		email: Joi.string().required(),
		password: Joi.string().required(),
	});
	return Joi.validate(user, schema);
};

exports.carValidator = (car) => {
	const schema =Joi.object().keys({
		manufacturer: Joi.string().required(),
		model: Joi.string().required(),
		price: Joi.number().positive().precision(2).required(),
		state: Joi.string().required(),
	});
	return Joi.validate(car, schema);
};
