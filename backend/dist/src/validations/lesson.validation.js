"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLessonSchema = exports.LessonSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = __importDefault(require("../utils/constants"));
exports.LessonSchema = joi_1.default.object({
    course_id: joi_1.default.number().required(),
    order: joi_1.default.number().required(),
    title: joi_1.default.string().trim().required().max(100).messages({
        "any.required": constants_1.default.ERROR_COURSE_TITLE_REQUIRED,
        "string.base": constants_1.default.ERROR_COURSE_TITLE_STRING,
        "string.max": constants_1.default.ERROR_COURSE_TITLE_TOO_LONG,
    }),
    section_id: joi_1.default.number().integer().required().messages({
        "any.required": constants_1.default.ERROR_SECTION_ID_REQUIRED,
        "number.base": constants_1.default.ERROR_SECTION_ID_NUMBER,
        "number.integer": constants_1.default.ERROR_SECTION_ID_INTEGER,
    }),
});
exports.UpdateLessonSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required().max(100).messages({
        "any.required": constants_1.default.ERROR_COURSE_TITLE_REQUIRED,
        "string.base": constants_1.default.ERROR_COURSE_TITLE_STRING,
        "string.max": constants_1.default.ERROR_COURSE_TITLE_TOO_LONG,
    }),
    video: joi_1.default.string().strip(),
});
