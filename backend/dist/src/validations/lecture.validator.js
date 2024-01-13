"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLeectureSchema = exports.AddLectureSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = __importDefault(require("../constants"));
exports.AddLectureSchema = joi_1.default.object({
    type: joi_1.default.string().trim().required().max(20).messages({
        "any.required": constants_1.default.error.ERROR_LECTURE_TYPE_REQUIRED,
        "string.base": constants_1.default.error.ERROR_LECTURE_TYPE_STRING,
        "string.max": constants_1.default.error.ERROR_LECTURE_TYPE_TOO_LONG,
    }),
    title: joi_1.default.string().trim().required().max(100).messages({
        "any.required": constants_1.default.error.ERROR_TITLE_REQUIRED,
        "string.base": constants_1.default.error.ERROR_TITLE_STRING,
        "string.max": constants_1.default.error.ERROR_TITLE_MAX,
    }),
    description: joi_1.default.string().trim().required().max(100).messages({
        "any.required": constants_1.default.error.ERROR_DESCRIPTION_REQUIRED,
        "string.base": constants_1.default.error.ERROR_DESCRIPTION_STRING,
        "string.max": constants_1.default.error.ERROR_DESCRIPTION_TOO_MAX,
    }),
    duration: joi_1.default.number().required().positive().messages({
        "any.required": constants_1.default.error.ERROR_LECTURE_DURATION_REQUIRED,
        "number.base": constants_1.default.error.ERROR_LECTURE_DURATION_NUMBER,
        "number.positive": constants_1.default.error.ERROR_LECTURE_DURATION_POSITIVE,
    }),
    section_id: joi_1.default.number().integer().required().messages({
        "any.required": constants_1.default.error.ERROR_SECTION_ID_REQUIRED,
        "number.base": constants_1.default.error.ERROR_SECTION_ID_NUMBER,
        "number.integer": constants_1.default.error.ERROR_SECTION_ID_INTEGER,
    }),
    quiz_group_id: joi_1.default.number().messages({
        "number.base": constants_1.default.error.ERROR_QUIZ_GROUP_ID_INT,
    }),
    pass_percent: joi_1.default.number().positive().messages({
        "number.base": constants_1.default.error.ERROR_SECTION_ID_NUMBER,
        "number.positive": constants_1.default.error.ERROR_LECTURE_PASS_PERCENT_POSITIVE,
    }),
    is_time_limit: joi_1.default.boolean().messages({
        "boolean.base": constants_1.default.error.ERROR_LECTURE_TIME_LIMIT_BOOLEAN,
    }),
    video: joi_1.default.any(),
});
exports.UpdateLeectureSchema = joi_1.default.object({
    type: joi_1.default.string().trim().required().max(20).messages({
        "any.required": constants_1.default.error.ERROR_LECTURE_TYPE_REQUIRED,
        "string.base": constants_1.default.error.ERROR_LECTURE_TYPE_STRING,
        "string.max": constants_1.default.error.ERROR_LECTURE_TYPE_TOO_LONG,
    }),
    title: joi_1.default.string().trim().required().max(100).messages({
        "any.required": constants_1.default.error.ERROR_TITLE_REQUIRED,
        "string.base": constants_1.default.error.ERROR_TITLE_STRING,
        "string.max": constants_1.default.error.ERROR_TITLE_MAX,
    }),
    description: joi_1.default.string().trim().required().max(100).messages({
        "any.required": constants_1.default.error.ERROR_DESCRIPTION_REQUIRED,
        "string.base": constants_1.default.error.ERROR_DESCRIPTION_STRING,
        "string.max": constants_1.default.error.ERROR_DESCRIPTION_TOO_MAX,
    }),
    duration: joi_1.default.number().required().positive().messages({
        "any.required": constants_1.default.error.ERROR_LECTURE_DURATION_REQUIRED,
        "number.base": constants_1.default.error.ERROR_LECTURE_DURATION_NUMBER,
        "number.positive": constants_1.default.error.ERROR_LECTURE_DURATION_POSITIVE,
    }),
    lecture_id: joi_1.default.number().integer().required().messages({
        "any.required": constants_1.default.error.ERROR_LECTURE_ID_REQUIRED,
        "number.base": constants_1.default.error.ERROR_LECTURE_ID_NUMBER,
        "number.integer": constants_1.default.error.ERROR_LECTURE_ID_INTEGER,
    }),
    quiz_group_id: joi_1.default.number().messages({
        "number.base": constants_1.default.error.ERROR_QUIZ_GROUP_ID_INT,
    }),
    pass_percent: joi_1.default.number().positive().messages({
        "number.base": constants_1.default.error.ERROR_SECTION_ID_NUMBER,
        "number.positive": constants_1.default.error.ERROR_LECTURE_PASS_PERCENT_POSITIVE,
    }),
    is_time_limit: joi_1.default.boolean().messages({
        "boolean.base": constants_1.default.error.ERROR_LECTURE_TIME_LIMIT_BOOLEAN,
    }),
    video: joi_1.default.any(),
});
