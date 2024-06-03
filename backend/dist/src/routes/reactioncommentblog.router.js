"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const reactionCommentBlogRouter = (0, express_1.Router)();
reactionCommentBlogRouter.post("/", isLogin_1.isLogin, index_1.default.reactionCommentBlogController.createReactionCommentBlog);
reactionCommentBlogRouter.delete("/:reaction_id", isLogin_1.isLogin, index_1.default.reactionCommentBlogController.deleteReactionCommentBlog);
reactionCommentBlogRouter.get("/all_quantity_reaction", index_1.default.reactionCommentBlogController.getTotalReactionsForAllComments);
reactionCommentBlogRouter.get("/:comment_id", index_1.default.reactionCommentBlogController.getTotalReactionsByCommentId);
exports.default = reactionCommentBlogRouter;
