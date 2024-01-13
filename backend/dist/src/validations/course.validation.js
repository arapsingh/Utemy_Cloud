"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = __importDefault(require("../constants"));
const enrolledCourseSchema = joi_1.default.object({
    course_id: joi_1.default.number().required().integer().messages({
        "number.base": constants_1.default.error.ERROR_COURSE_ID_NUMBER,
        "number.integer": constants_1.default.error.ERROR_COURSE_ID_INTEGER,
        "any.required": constants_1.default.error.ERROR_COURSE_ID_REQUIRED,
    }),
});
exports.createCourseSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required().messages({
        "any.required": constants_1.default.error.ERROR_COURSE_TITLE_REQUIRED,
        "string.base": constants_1.default.error.ERROR_COURSE_TITLE_STRING,
    }),
    slug: joi_1.default.string()
        .trim()
        .required()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .messages({
        "any.required": constants_1.default.error.ERROR_COURSE_SLUG_REQUIRED,
        "string.base": constants_1.default.error.ERROR_COURSE_SLUG_STRING,
        "string.regex": constants_1.default.error.ERROR_COURSE_SLUG_MALFORMED,
    }),
    status: joi_1.default.required().messages({
        "any.required": constants_1.default.error.ERROR_COURSE_STATUS_REQUIRED,
        "bool.base": constants_1.default.error.ERROR_COURSE_STATUS_BOOLEAN,
    }),
    description: joi_1.default.string().trim().required().messages({
        "any.required": constants_1.default.error.ERROR_COURSE_DESCRIPTION_REQUIRED,
        "string.base": constants_1.default.error.ERROR_COURSE_DESCRIPTION_STRING,
    }),
    summary: joi_1.default.string().trim().required().messages({
        "any.required": constants_1.default.error.ERROR_COURSE_SUMMARY_REQUIRED,
        "string.base": constants_1.default.error.ERROR_COURSE_SUMMARY_STRING,
    }),
    categories: joi_1.default.string().required().messages({
        "any.required": constants_1.default.error.ERROR_COURSE_CATEGORIES_REQUIRED,
    }),
    requirement: joi_1.default.string(),
    study: joi_1.default.string(),
    // thumbnail: Joi.binary().required().messages({
    //     "any.required": constants.error.ERROR_COURSE_THUMBNAIL_REQUIRED,
    // }),
    price: joi_1.default.number().required().positive().messages({
        "any.required": constants_1.default.error.ERROR_COURSE_PRICE_REQUIRED,
        "number.base": constants_1.default.error.ERROR_COURSE_PRICE_NUMBER,
        "number.positive": constants_1.default.error.ERROR_COURSE_PRICE_POSITIVE,
    }),
});
const updateCourseSchema = joi_1.default.object({
    course_id: joi_1.default.number(),
    title: joi_1.default.string().trim().required().messages({
        "any.required": constants_1.default.error.ERROR_COURSE_TITLE_REQUIRED,
        "string.base": constants_1.default.error.ERROR_COURSE_TITLE_REQUIRED,
    }),
    slug: joi_1.default.string().trim().required().messages({
        "any.required": constants_1.default.error.ERROR_COURSE_SLUG_REQUIRED,
        "string.base": constants_1.default.error.ERROR_COURSE_SLUG_STRING,
        "string.regex": constants_1.default.error.ERROR_COURSE_SLUG_MALFORMED,
    }),
    status: joi_1.default.required().messages({
        "any.required": constants_1.default.error.ERROR_COURSE_STATUS_REQUIRED,
    }),
    description: joi_1.default.string().trim().required().messages({
        "any.required": constants_1.default.error.ERROR_COURSE_DESCRIPTION_REQUIRED,
        "string.base": constants_1.default.error.ERROR_COURSE_DESCRIPTION_STRING,
    }),
    summary: joi_1.default.string().trim().required().messages({
        "any.required": constants_1.default.error.ERROR_COURSE_SUMMARY_REQUIRED,
        "string.base": constants_1.default.error.ERROR_COURSE_SUMMARY_STRING,
    }),
    categories: joi_1.default.string().required().messages({
        "any.required": constants_1.default.error.ERROR_COURSE_CATEGORIES_REQUIRED,
    }),
    requirement: joi_1.default.string(),
    study: joi_1.default.string(),
    thumbnail: joi_1.default.string(),
    price: joi_1.default.number().required().positive().messages({
        "any.required": constants_1.default.error.ERROR_COURSE_PRICE_REQUIRED,
        "number.base": constants_1.default.error.ERROR_COURSE_PRICE_NUMBER,
        "number.positive": constants_1.default.error.ERROR_COURSE_PRICE_POSITIVE,
    }),
});
const createRatingSchema = joi_1.default.object({
    score: joi_1.default.number().required().integer().min(1).max(5).messages({
        "number.integer": constants_1.default.error.ERROR_RATING_SCORE_INT,
        "number.base": constants_1.default.error.ERROR_COURSE_ID_NUMBER,
        "any.required": constants_1.default.error.ERROR_COURSE_ID_REQUIRED,
        "number.max": constants_1.default.error.ERROR_RATING_SCORE_MAX,
        "number.min": constants_1.default.error.ERROR_RATING_SCORE_MIN,
    }),
    content: joi_1.default.string().trim().max(300).messages({
        "string.base": constants_1.default.error.ERROR_RATING_CONTENT_STRING,
        "string.max": constants_1.default.error.ERROR_RATING_CONTENT_STRING,
    }),
});
const editRatingSchema = joi_1.default.object({
    rating_id: joi_1.default.number().required().integer().messages({
        "number.integer": constants_1.default.error.ERROR_RATING_ID_INT,
        "number.base": constants_1.default.error.ERROR_RATING_ID_NUMBER,
        "any.required": constants_1.default.error.ERROR_COURSE_ID_REQUIRED,
    }),
    score: joi_1.default.number().required().integer().min(1).max(5).messages({
        "number.integer": constants_1.default.error.ERROR_RATING_SCORE_INT,
        "number.base": constants_1.default.error.ERROR_COURSE_ID_NUMBER,
        "any.required": constants_1.default.error.ERROR_COURSE_ID_REQUIRED,
        "number.max": constants_1.default.error.ERROR_RATING_SCORE_MAX,
        "number.min": constants_1.default.error.ERROR_RATING_SCORE_MIN,
    }),
    content: joi_1.default.string().trim().max(300).messages({
        "string.base": constants_1.default.error.ERROR_RATING_CONTENT_STRING,
        "string.max": constants_1.default.error.ERROR_RATING_CONTENT_MAX,
    }),
});
const deleteRatingSchema = joi_1.default.object({
    rating_id: joi_1.default.number().required().integer().messages({
        "number.integer": constants_1.default.error.ERROR_RATING_ID_INT,
        "number.base": constants_1.default.error.ERROR_RATING_ID_NUMBER,
        "any.required": constants_1.default.error.ERROR_COURSE_ID_REQUIRED,
    }),
});
const addPromotionSchema = joi_1.default.object({
    course_id: joi_1.default.number().required().integer().messages({
        "number.integer": constants_1.default.error.ERROR_COURSE_ID_INTEGER,
        "number.base": constants_1.default.error.ERROR_COURSE_ID_NUMBER,
        "any.required": constants_1.default.error.ERROR_COURSE_ID_REQUIRED,
    }),
    sale_price: joi_1.default.number().required().positive().messages({
        "number.base": constants_1.default.error.ERROR_SALE_PRICE_NUMBER,
        "any.required": constants_1.default.error.ERROR_SALE_PRICE_REQUIRED,
        "number.positive": constants_1.default.error.ERROR_COURSE_PRICE_POSITIVE,
    }),
    sale_until: joi_1.default.date().required().min("now").messages({
        "date.base": constants_1.default.error.ERROR_SALE_UNTIL_DATE,
        "any.required": constants_1.default.error.ERROR_SALE_UNTIL_REQUIRED,
        "date.min": constants_1.default.error.ERROR_SALE_UNTIL_MIN,
    }),
});
const courseSchema = {
    enrolledCourseSchema,
    createCourseSchema: exports.createCourseSchema,
    updateCourseSchema,
    createRatingSchema,
    editRatingSchema,
    deleteRatingSchema,
    addPromotionSchema,
};
exports.default = courseSchema;
