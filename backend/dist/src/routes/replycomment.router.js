"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const replyCommentRouter = (0, express_1.Router)();
replyCommentRouter.post("/", isLogin_1.isLogin, index_1.default.replyCommentController.createReplyComment);
replyCommentRouter.patch("/:reply_id", isLogin_1.isLogin, index_1.default.replyCommentController.updateReplyComment);
replyCommentRouter.delete("/:reply_id", isLogin_1.isLogin, index_1.default.replyCommentController.deleteReplyComment);
replyCommentRouter.get("/all", index_1.default.replyCommentController.getReplyCommentsWithPagination);
exports.default = replyCommentRouter;
