"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const commentBlogRouter = (0, express_1.Router)();
commentBlogRouter.post("/", isLogin_1.isLogin, index_1.default.commentBlogController.createCommentBlog);
commentBlogRouter.patch("/:commentblog_id", isLogin_1.isLogin, index_1.default.commentBlogController.updateCommentBlog);
commentBlogRouter.delete("/:commentblog_id", isLogin_1.isLogin, index_1.default.commentBlogController.deleteCommentBlog);
commentBlogRouter.get("/all", index_1.default.commentBlogController.getCommentBlogsWithPagination);
commentBlogRouter.get("/:blog_id", index_1.default.commentBlogController.getCommentBlogsWithPaginationByBlogId);
exports.default = commentBlogRouter;
