"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const commentRouter = (0, express_1.Router)();
commentRouter.post("/", isLogin_1.isLogin, index_1.default.commentController.createComment);
commentRouter.patch("/:comment_id", isLogin_1.isLogin, index_1.default.commentController.updateComment);
commentRouter.delete("/:comment_id", isLogin_1.isLogin, index_1.default.commentController.deleteComment);
commentRouter.get("/all", index_1.default.commentController.getCommentsWithPagination);
commentRouter.get("/:lecture_id", index_1.default.commentController.getCommentsWithPaginationByLectureId);
commentRouter.get("/course/:course_id", index_1.default.commentController.getCommentsWithPaginationByCourseId);
exports.default = commentRouter;
