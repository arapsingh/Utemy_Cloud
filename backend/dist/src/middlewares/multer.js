"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMixFiles = exports.uploadTrailer = exports.uploadVideo = exports.uploadEvidence = exports.uploadImageBlog = exports.uploadThumbnail = exports.uploadCategory = exports.uploadAvatar = void 0;
const configs_1 = __importDefault(require("../configs"));
const multer_1 = require("multer");
const helper_1 = __importDefault(require("../helper"));
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
const uploadImageBlog = async (req, res, next) => {
    configs_1.default.upload.uploadImageBlog(req, res, (error) => {
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
exports.uploadImageBlog = uploadImageBlog;
const uploadEvidence = async (req, res) => {
    configs_1.default.upload.uploadEvidence(req, res, (error) => {
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
        const file = req.file;
        if (file) {
            const convertFilePath = helper_1.default.ConvertHelper.convertFilePath(file.path);
            res.status(200).json({ message: "Upload success", success: true, status_code: 200, data: convertFilePath });
            return;
        }
        res.status(400).json({ message: error.message, success: false, status_code: 400 });
        return;
    });
};
exports.uploadEvidence = uploadEvidence;
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
const uploadTrailer = async (req, res, next) => {
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
exports.uploadTrailer = uploadTrailer;
const uploadMixFiles = async (req, res, next) => {
    configs_1.default.upload.uploadMixFile(req, res, (error) => {
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
exports.uploadMixFiles = uploadMixFiles;
