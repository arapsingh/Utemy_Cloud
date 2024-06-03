"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = require("./db.config");
const general_config_1 = require("./general.config");
const multer_config_1 = __importDefault(require("./multer.config"));
const apiCaller_1 = require("./apiCaller");
const configs = {
    db: db_config_1.db,
    general: general_config_1.general,
    upload: multer_config_1.default,
    apiCaller: apiCaller_1.apiCaller,
};
exports.default = configs;
