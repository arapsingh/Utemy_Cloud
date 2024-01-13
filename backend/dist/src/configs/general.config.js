"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.general = void 0;
/* eslint-disable prettier/prettier */
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
exports.general = {
    DOMAIN_NAME: process.env.DOMAIN_NAME,
    BACKEND_DOMAIN_NAME: process.env.BACKEND_DOMAIN_NAME,
    PORT: parseInt(process.env.PORT || "3001"),
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    TOKEN_ACCESS_EXPIRED_TIME: process.env.TOKEN_ACCESS_EXPIRED_TIME,
    TOKEN_REFRESH_EXPIRED_TIME: process.env.TOKEN_REFRESH_EXPIRED_TIME,
    HASH_SALT: parseInt(process.env.HASH_SALT),
    PAGE_SIZE: Number(process.env.PAGE_SIZE),
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    PASSWORD_SERVER: process.env.PASSWORD_SERVER,
    PATH_TO_PUBLIC_FOLDER_VIDEOS: path_1.default.join(process.cwd(), "/public/videos"),
    PATH_TO_IMAGES: path_1.default.join(process.cwd(), "/public/images"),
    TZ: process.env.TZ,
    vnp_TmnCode: process.env.VNP_TMN_CODE,
    vnp_HashSecret: process.env.VNP_HASH_SECRET,
    vnp_Url: process.env.VNP_URL,
    vnp_Api: process.env.VNP_API,
    vnp_ReturnUrl: process.env.VNP_RETURN_URL,
};
