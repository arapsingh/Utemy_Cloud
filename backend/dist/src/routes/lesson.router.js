"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const multer_1 = require("../middlewares/multer");
const isAuthor_1 = require("../middlewares/isAuthor");
const lessonRouter = (0, express_1.Router)();
lessonRouter.post("/", isLogin_1.isLogin, multer_1.uploadVideo, index_1.default.lessonController.createLesson); //
lessonRouter.patch("/", isLogin_1.isLogin, multer_1.uploadVideo, isAuthor_1.isAuthor, index_1.default.lessonController.updateLesson);
lessonRouter.delete("/", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.lessonController.deleteLesson);
lessonRouter.get("/:lesson_id", isLogin_1.isLogin, index_1.default.lessonController.getLessonById);
exports.default = lessonRouter;
