"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.signupSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = __importDefault(require("../utils/constants"));
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .regex(/^\S+@\S+\.\S+$/)
        .max(50)
        .trim()
        .required()
        .messages({
        "string.base": constants_1.default.ERROR_EMAIL_STRING,
        "any.required": constants_1.default.ERROR_EMAIL_REQUIRED,
        "string.regex": constants_1.default.ERROR_EMAIL_FORMAT,
        "string.max": constants_1.default.ERROR_EMAIL_MAX,
    }),
    password: joi_1.default.string().trim().required().min(8).max(20).messages({
        "string.base": constants_1.default.ERROR_PASSWORD_STRING,
        "any.required": constants_1.default.ERROR_PASSWORD_REQUIRED,
        "string.max": constants_1.default.ERROR_PASSWORD_MAX,
        "string.min": constants_1.default.ERROR_PASSWORD_MIN,
    }),
});
exports.signupSchema = joi_1.default.object({
    email: joi_1.default.string()
        .trim()
        .regex(/^\S+@\S+\.\S+$/)
        .required()
        .max(50)
        .messages({
        "string.base": constants_1.default.ERROR_EMAIL_STRING,
        "any.required": constants_1.default.ERROR_EMAIL_REQUIRED,
        "string.regex": constants_1.default.ERROR_EMAIL_FORMAT,
        "string.max": constants_1.default.ERROR_EMAIL_MAX,
    }),
    password: joi_1.default.string().trim().required().min(8).max(20).messages({
        "string.base": constants_1.default.ERROR_PASSWORD_STRING,
        "any.required": constants_1.default.ERROR_PASSWORD_REQUIRED,
        "string.max": constants_1.default.ERROR_PASSWORD_MAX,
        "string.min": constants_1.default.ERROR_PASSWORD_MIN,
    }),
    first_name: joi_1.default.string().trim().required().max(30).messages({
        "string.base": constants_1.default.ERROR_FIRST_NAME_STRING,
        "any.required": constants_1.default.ERROR_FIRST_NAME_REQUIRED,
        "string.max": constants_1.default.ERROR_FIRST_NAME_MAX,
    }),
    last_name: joi_1.default.string().trim().required().max(30).messages({
        "string.base": constants_1.default.ERROR_LAST_NAME_STRING,
        "any.required": constants_1.default.ERROR_LAST_NAME_REQUIRED,
        "string.max": constants_1.default.ERROR_LAST_NAME_MAX,
    }),
    confirm_password: joi_1.default.string().trim().valid(joi_1.default.ref("password")).required().messages({
        "any.only": constants_1.default.ERROR_CONFIRM_PASSWORD,
        "any.required": constants_1.default.ERROR_CONFIRM_PASSWORD_REQUIRED,
    }),
});
exports.changePasswordSchema = joi_1.default.object({
    current_password: joi_1.default.string().trim().required().min(8).max(20).messages({
        "string.base": constants_1.default.ERROR_CURRENT_PASSWORD_STRING,
        "any.required": constants_1.default.ERROR_CURRENT_PASSWORD_REQUIRED,
        "string.max": constants_1.default.ERROR_CURRENT_PASSWORD_MAX,
        "string.min": constants_1.default.ERROR_CURRENT_PASSWORD_MIN,
    }),
    new_password: joi_1.default.string().trim().required().min(8).max(20).messages({
        "string.base": constants_1.default.ERROR_NEW_PASSWORD_STRING,
        "any.required": constants_1.default.ERROR_NEW_PASSWORD_REQUIRED,
        "string.max": constants_1.default.ERROR_NEW_PASSWORD_MAX,
        "string.min": constants_1.default.ERROR_NEW_PASSWORD_MIN,
    }),
    confirm_password: joi_1.default.string().trim().valid(joi_1.default.ref("new_password")).required().messages({
        "any.only": constants_1.default.ERROR_CONFIRM_NEW_PASSWORD,
        "any.required": constants_1.default.ERROR_CONFIRM_PASSWORD_REQUIRED,
    }),
});
exports.resetPasswordSchema = joi_1.default.object({
    new_password: joi_1.default.string().trim().required().min(8).max(20).messages({
        "string.base": constants_1.default.ERROR_NEW_PASSWORD_STRING,
        "any.required": constants_1.default.ERROR_NEW_PASSWORD_REQUIRED,
        "string.max": constants_1.default.ERROR_NEW_PASSWORD_MAX,
        "string.min": constants_1.default.ERROR_NEW_PASSWORD_MIN,
    }),
    confirm_password: joi_1.default.string().trim().valid(joi_1.default.ref("new_password")).required().messages({
        "any.only": constants_1.default.ERROR_CONFIRM_NEW_PASSWORD,
        "any.required": constants_1.default.ERROR_CONFIRM_PASSWORD_REQUIRED,
    }),
    token: joi_1.default.string().trim().required().messages({
        "string.base": constants_1.default.ERROR_TOKEN_STRING,
        "any.required": constants_1.default.ERROR_TOKEN_REQUIRED,
    }),
});
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string()
        .trim()
        .regex(/^\S+@\S+\.\S+$/)
        .required()
        .max(50)
        .messages({
        "string.base": constants_1.default.ERROR_EMAIL_STRING,
        "any.required": constants_1.default.ERROR_EMAIL_REQUIRED,
        "string.regex": constants_1.default.ERROR_EMAIL_FORMAT,
        "string.max": constants_1.default.ERROR_EMAIL_MAX,
    }),
});
const authSchema = {
    signupSchema: exports.signupSchema,
    loginSchema: exports.loginSchema,
    changePasswordSchema: exports.changePasswordSchema,
    forgotPasswordSchema: exports.forgotPasswordSchema,
    resetPasswordSchema: exports.resetPasswordSchema,
};
exports.default = authSchema;
