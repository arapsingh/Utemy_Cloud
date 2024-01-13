"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
//image
const storageAvatar = multer_1.default.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${configs_1.default.general.PATH_TO_IMAGES}//avatar`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const storageThumbnail = multer_1.default.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${configs_1.default.general.PATH_TO_IMAGES}//thumbnail`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const storageCategory = multer_1.default.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${configs_1.default.general.PATH_TO_IMAGES}//category`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const uploadAvatar = (0, multer_1.default)({
    storage: storageAvatar,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === "image/png") {
            cb(null, true);
        }
        else if (file.mimetype === "image/jpeg") {
            cb(null, true);
        }
        else if (file.mimetype === "image/jpg") {
            cb(null, true);
        }
        else {
            return cb(new Error("Invalid file type: Only .png, .jpeg or .jpg is allowed"));
        }
    },
}).single("avatar");
const uploadThumbnail = (0, multer_1.default)({
    storage: storageThumbnail,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === "image/png") {
            cb(null, true);
        }
        else if (file.mimetype === "image/jpeg") {
            cb(null, true);
        }
        else if (file.mimetype === "image/jpg") {
            cb(null, true);
        }
        else {
            return cb(new Error("Invalid file type: Only .png, .jpeg or .jpg is allowed"));
        }
    },
}).single("thumbnail");
const uploadCategory = (0, multer_1.default)({
    storage: storageCategory,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === "image/png") {
            cb(null, true);
        }
        else if (file.mimetype === "image/jpeg") {
            cb(null, true);
        }
        else if (file.mimetype === "image/jpg") {
            cb(null, true);
        }
        else {
            return cb(new Error("Invalid file type: Only .png, .jpeg or .jpg is allowed"));
        }
    },
}).single("category_image");
//video
const storageVideo = multer_1.default.diskStorage({
    destination: (req, res, cb) => {
        cb(null, configs_1.default.general.PATH_TO_PUBLIC_FOLDER_VIDEOS);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const uploadVideo = (0, multer_1.default)({
    storage: storageVideo,
    limits: {
        fileSize: 1024 * 1024 * 100,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "video/mp4") {
            cb(null, true);
        }
        else if (file.mimetype === "video/x-matroska") {
            cb(null, true);
        }
        else if (file.mimetype === "video/mov") {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type: Only .mp4, .mkv or .mov is allowed"));
        }
    },
}).single("video");
exports.default = { uploadAvatar, uploadCategory, uploadThumbnail, uploadVideo };
