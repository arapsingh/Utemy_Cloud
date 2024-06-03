"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const reactionRouter = (0, express_1.Router)();
reactionRouter.post("/like/", isLogin_1.isLogin, index_1.default.reactionController.createLike);
reactionRouter.delete("/like/", isLogin_1.isLogin, index_1.default.reactionController.deleteLike);
reactionRouter.post("/dislike/", isLogin_1.isLogin, index_1.default.reactionController.createDislike);
reactionRouter.delete("/dislike/", index_1.default.reactionController.deleteDislike);
reactionRouter.get("/dislike", index_1.default.reactionController.checkDislikeExist);
reactionRouter.get("/like", index_1.default.reactionController.checkLikeExist);
exports.default = reactionRouter;
