"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = __importDefault(require("./error"));
const success_1 = __importDefault(require("./success"));
exports.default = {
    error: error_1.default,
    success: success_1.default,
};