"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const constants_1 = __importDefault(require("../constants"));
const createFeedbackSchema = joi_1.default.object({
    content: joi_1.default.string().trim().max(300).messages({
        "string.base": constants_1.default.error.ERROR_RATING_CONTENT_STRING,
        "string.max": constants_1.default.error.ERROR_RATING_CONTENT_MAX,
    }),
    score: joi_1.default.number().integer().required().messages({
        "any.required": constants_1.default.error.ERROR_RATING_SCORE_REQUIRED,
        "number.integer": constants_1.default.error.ERROR_RATING_SCORE_INT,
        "number.max": constants_1.default.error.ERROR_RATING_SCORE_MAX,
        "number.min": constants_1.default.error.ERROR_RATING_SCORE_MIN,
    })
});
const feedbackSchema = {
    createFeedbackSchema,
};
exports.default = feedbackSchema;
