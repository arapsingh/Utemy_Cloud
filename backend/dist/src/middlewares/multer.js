"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = exports.uploadThumbnail = exports.uploadCategory = exports.uploadAvatar = void 0;
const configs_1 = __importDefault(require("../configs"));
const multer_1 = require("multer");
const uploadAvatar = async (req, res, next) => {
    configs_1.default.upload.uploadAvatar(req, res, (error) => {
        if (error instanceof multer_1.MulterError) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        else if (error) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};
exports.uploadAvatar = uploadAvatar;
const uploadCategory = async (req, res, next) => {
    configs_1.default.upload.uploadCategory(req, res, (error) => {
        if (error instanceof multer_1.MulterError) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        else if (error) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};
exports.uploadCategory = uploadCategory;
const uploadThumbnail = async (req, res, next) => {
    configs_1.default.upload.uploadThumbnail(req, res, (error) => {
        if (error instanceof multer_1.MulterError) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        else if (error) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};
exports.uploadThumbnail = uploadThumbnail;
const uploadVideo = async (req, res, next) => {
    configs_1.default.upload.uploadVideo(req, res, (error) => {
        if (error instanceof multer_1.MulterError) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        else if (error) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};
exports.uploadVideo = uploadVideo;
