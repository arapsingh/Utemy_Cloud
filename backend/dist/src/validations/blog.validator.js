"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogSchema = exports.createBlogSchema = exports.updateBlogSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = __importDefault(require("../constants"));
exports.updateBlogSchema = joi_1.default.object({
    blog_id: joi_1.default.number().required().messages({
        "number.base": constants_1.default.error.ERROR_BLOG_ID_NUMBER,
        "any.required": constants_1.default.error.ERROR_BLOG_ID_REQUIRED,
    }),
    title: joi_1.default.string().trim().required().max(50).messages({
        "string.base": constants_1.default.error.ERROR_TITLE_BLOG_STRING,
        "any.required": constants_1.default.error.ERROR_TITLE_BLOG_REQUIRED,
        "string.max": constants_1.default.error.ERROR_TITLE_BLOG_MAX,
    }),
    content: joi_1.default.string().trim().required().max(1000).min(100).messages({
        "string.base": constants_1.default.error.ERROR_CONTENT_BLOG_STRING,
        "any.required": constants_1.default.error.ERROR_CONTENT_BLOG_REQUIRED,
        "string.max": constants_1.default.error.ERROR_CONTENT_BLOG_MAX,
        "string.min": constants_1.default.error.ERROR_CONTENT_BLOG_SHORT,
    }),
    is_published: joi_1.default.string().valid("true", "false").required().messages({
        "any.only": constants_1.default.error.ERROR_IS_PUBLISHED_BOOLEAN,
        "any.required": constants_1.default.error.ERROR_IS_PUBLISHED_BOOLEAN,
    }),
    url_image: joi_1.default.string(),
    categories: joi_1.default.string().required().messages({
        "any.required": constants_1.default.error.ERROR_BLOG_CATEGORIES_REQUIRED,
    }),
});
exports.createBlogSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required().max(50).messages({
        "string.base": constants_1.default.error.ERROR_TITLE_BLOG_STRING,
        "any.required": constants_1.default.error.ERROR_TITLE_BLOG_REQUIRED,
        "string.max": constants_1.default.error.ERROR_TITLE_BLOG_MAX,
    }),
    content: joi_1.default.string().trim().required().max(1000).min(100).messages({
        "string.base": constants_1.default.error.ERROR_CONTENT_BLOG_STRING,
        "any.required": constants_1.default.error.ERROR_CONTENT_BLOG_REQUIRED,
        "string.max": constants_1.default.error.ERROR_CONTENT_BLOG_MAX,
        "string.min": constants_1.default.error.ERROR_CONTENT_BLOG_SHORT,
    }),
    url_image: joi_1.default.string(),
    categories: joi_1.default.string().required().messages({
        "any.required": constants_1.default.error.ERROR_BLOG_CATEGORIES_REQUIRED,
    }),
});
exports.deleteBlogSchema = joi_1.default.object({
    blog_id: joi_1.default.number().required().messages({
        "number.base": constants_1.default.error.ERROR_BLOG_ID_NUMBER,
        "any.required": constants_1.default.error.ERROR_BLOG_ID_REQUIRED,
    }),
});
//type changeAvatar = {};
const blogSchema = {
    updateBlogSchema: exports.updateBlogSchema,
    createBlogSchema: exports.createBlogSchema,
    deleteBlogSchema: exports.deleteBlogSchema,
};
exports.default = blogSchema;
