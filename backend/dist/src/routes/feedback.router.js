"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const feedbackRouter = (0, express_1.Router)();
feedbackRouter.post("/", isLogin_1.isLogin, index_1.default.feedbackController.createFeedback); //
feedbackRouter.get("/", isLogin_1.isLogin, index_1.default.feedbackController.getAllFeedbacks);
exports.default = feedbackRouter;
