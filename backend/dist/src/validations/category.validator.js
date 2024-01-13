"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategorySchema = exports.createCategorySchema = exports.updateCategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = __importDefault(require("../constants"));
exports.updateCategorySchema = joi_1.default.object({
    category_id: joi_1.default.number().required().messages({
        "number.base": constants_1.default.error.ERROR_CATEGORY_ID_NUMBER,
        "any.required": constants_1.default.error.ERROR_CATEGORY_ID_REQUIRED,
    }),
    title: joi_1.default.string().trim().required().max(50).messages({
        "string.base": constants_1.default.error.ERROR_TITLE_STRING,
        "any.required": constants_1.default.error.ERROR_TITLE_REQUIRED,
        "string.max": constants_1.default.error.ERROR_TITLE_MAX,
    }),
    description: joi_1.default.string().trim().required().max(200).min(8).messages({
        "string.base": constants_1.default.error.ERROR_DESCRIPTION_STRING,
        "any.required": constants_1.default.error.ERROR_DESCRIPTION_REQUIRED,
        "string.max": constants_1.default.error.ERROR_DESCRIPTION_TOO_MAX,
        "string.min": constants_1.default.error.ERROR_DESCRIPTION_TOO_SHORT,
    }),
    category_image: joi_1.default.any(),
});
exports.createCategorySchema = joi_1.default.object({
    title: joi_1.default.string().trim().required().max(50).messages({
        "string.base": constants_1.default.error.ERROR_TITLE_STRING,
        "any.required": constants_1.default.error.ERROR_TITLE_REQUIRED,
        "string.max": constants_1.default.error.ERROR_TITLE_MAX,
    }),
    description: joi_1.default.string().trim().required().max(200).min(8).messages({
        "string.base": constants_1.default.error.ERROR_DESCRIPTION_STRING,
        "any.required": constants_1.default.error.ERROR_DESCRIPTION_REQUIRED,
        "string.max": constants_1.default.error.ERROR_DESCRIPTION_TOO_MAX,
        "string.min": constants_1.default.error.ERROR_DESCRIPTION_TOO_SHORT,
    }),
});
exports.deleteCategorySchema = joi_1.default.object({
    category_id: joi_1.default.number().required().messages({
        "number.base": constants_1.default.error.ERROR_CATEGORY_ID_NUMBER,
        "any.required": constants_1.default.error.ERROR_CATEGORY_ID_REQUIRED,
    }),
});
//type changeAvatar = {};
const categorySchema = {
    updateCategorySchema: exports.updateCategorySchema,
    createCategorySchema: exports.createCategorySchema,
    deleteCategorySchema: exports.deleteCategorySchema,
};
exports.default = categorySchema;
