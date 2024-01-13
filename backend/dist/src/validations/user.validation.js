"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = __importDefault(require("../utils/constants"));
exports.updateProfileSchema = joi_1.default.object({
    first_name: joi_1.default.string().trim().required().max(32).messages({
        "string.base": constants_1.default.ERROR_FIRST_NAME_STRING,
        "any.required": constants_1.default.ERROR_FIRST_NAME_REQUIRED,
        "string.max": constants_1.default.ERROR_FIRST_NAME_MAX,
    }),
    last_name: joi_1.default.string().trim().required().max(32).messages({
        "string.base": constants_1.default.ERROR_LAST_NAME_STRING,
        "any.required": constants_1.default.ERROR_LAST_NAME_REQUIRED,
        "string.max": constants_1.default.ERROR_LAST_NAME_MAX,
    }),
    description: joi_1.default.string().trim().required().max(2000).min(8).messages({
        "string.base": constants_1.default.ERROR_DESCRIPTION_STRING,
        "any.required": constants_1.default.ERROR_DESCRIPTION_REQUIRED,
        "string.max": constants_1.default.ERROR_DESCRIPTION_TOO_MAX,
        "string.min": constants_1.default.ERROR_DESCRIPTION_TOO_SHORT,
    }),
    email: joi_1.default.string(),
});
//type changeAvatar = {};
const userSchema = {
    updateProfileSchema: exports.updateProfileSchema,
};
exports.default = userSchema;
