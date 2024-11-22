const Joi = require('joi');

exports.signupSchema = Joi.object({
    email: Joi.string()
        .email()
        .trim()
        .min(6)
        .max(60)
        .required()
        .messages({
            'string.email': 'Please provide a valid email address.',
            'string.min': 'Email must be at least 6 characters long.',
            'string.max': 'Email must be at most 60 characters long.',
            'any.required': 'Email is required.',
        }),

    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'))
        .messages({
            'string.pattern.base': 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.',
            'any.required': 'Password is required.',
        }),

});

exports.signinSchema = Joi.object({
    email: Joi.string()
        .email()
        .trim()
        .min(6)
        .max(60)
        .required()
        .messages({
            'string.email': 'Please provide a valid email address.',
            'string.min': 'Email must be at least 6 characters long.',
            'string.max': 'Email must be at most 60 characters long.',
            'any.required': 'Email is required.',
        }),

    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'))
        .messages({
            'string.pattern.base': 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number.',
            'any.required': 'Password is required.',
        }),
        
});

exports.acceptCodeSchema = Joi.object({
    email: Joi.string()
        .min(6)
        .max(60)
        .required()
        .email({
            tids: { allow: ['com', 'net'] },
        }),
        providedCode: Joi.number()
})