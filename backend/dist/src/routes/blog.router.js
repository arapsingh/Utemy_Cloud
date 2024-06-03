"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const multer_1 = require("../middlewares/multer");
const blogRouter = (0, express_1.Router)();
blogRouter.post("/", isLogin_1.isLogin, multer_1.uploadImageBlog, index_1.default.blogController.createBlog); //
blogRouter.patch("/", isLogin_1.isLogin, multer_1.uploadImageBlog, index_1.default.blogController.updateBlog); //
blogRouter.delete("/:blog_id", isLogin_1.isLogin, index_1.default.blogController.deleteBlog); //
blogRouter.get("/all", index_1.default.blogController.getBlogsWithPagination); //
blogRouter.get("/full", index_1.default.blogController.getBlogs); //
blogRouter.get("/:blog_id", isLogin_1.isLogin, index_1.default.blogController.getBlog); //
exports.default = blogRouter;
