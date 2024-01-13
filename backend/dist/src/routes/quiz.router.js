"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const quizRouter = (0, express_1.Router)();
quizRouter.post("/", isLogin_1.isLogin, index_1.default.quizController.createQuiz); //
quizRouter.post("/group", isLogin_1.isLogin, index_1.default.quizController.createQuizGroup);
quizRouter.patch("/:quiz_id", isLogin_1.isLogin, index_1.default.quizController.updateQuiz); //
quizRouter.patch("/group/:quiz_group_id", isLogin_1.isLogin, index_1.default.quizController.updateQuizGroup);
quizRouter.delete("/:quiz_id", isLogin_1.isLogin, index_1.default.quizController.deleteQuiz); //
quizRouter.delete("/group/:quiz_group_id", isLogin_1.isLogin, index_1.default.quizController.deleteQuizGroup);
quizRouter.get("/group", isLogin_1.isLogin, index_1.default.quizController.getAllQuizGroup);
quizRouter.get("/group-test", isLogin_1.isLogin, index_1.default.quizController.getAllQuizGroupHasQuiz);
quizRouter.get("/:quiz_group_id", isLogin_1.isLogin, index_1.default.quizController.getAllQuizByGroupId); //
exports.default = quizRouter;
