"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicIdFromUrl = exports.generateUniqueSlug = void 0;
const generateUniqueSlug = (slug) => {
    const uniqueString = `${Date.now()}${Math.random().toFixed(3).split(".")[1]}`;
    return `${slug}-${uniqueString}`;
};
exports.generateUniqueSlug = generateUniqueSlug;
const regexGetPublicId = /\/v\d+\/([^/]+)\.\w{3,4}$/;
const getPublicIdFromUrl = (url) => {
    const match = url.match(regexGetPublicId);
    return match ? match[1] : null;
};
exports.getPublicIdFromUrl = getPublicIdFromUrl;
