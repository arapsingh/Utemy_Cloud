"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const configs_1 = __importDefault(require("../configs"));
const convertFilePath = (filePath) => {
    const publicPath = filePath.split("public")[1];
    const fullPath = path_1.default
        .join(configs_1.default.general.BACKEND_DOMAIN_NAME, publicPath)
        .replace(/\\/g, "//");
    return fullPath;
};
const deConvertFilePath = (filePath) => {
    const publicPath = filePath.split("3001")[1];
    const fullPath = path_1.default.join(process.cwd(), `//public//${publicPath}`);
    return fullPath;
};
const convert = { convertFilePath, deConvertFilePath };
exports.default = convert;
