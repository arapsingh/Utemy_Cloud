"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertJoiErrorToString = void 0;
const convertJoiErrorToString = (error) => {
    return error.details.map((item) => item.message).join(", ");
};
exports.convertJoiErrorToString = convertJoiErrorToString;
