"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiCaller = void 0;
const axios_1 = __importDefault(require("axios"));
const general_config_1 = require("./general.config");
const axiosCertificate = axios_1.default.create({
    baseURL: "https://api.certifier.io/v1",
});
const apiCaller = (method, path, data) => {
    return axiosCertificate({
        method,
        headers: {
            accept: "application/json",
            "Certifier-Version": "2022-10-26",
            "content-type": "application/json",
            authorization: "Bearer " + general_config_1.general.CERTIFIER_ID,
        },
        url: `/${path}`,
        data,
    });
};
exports.apiCaller = apiCaller;
