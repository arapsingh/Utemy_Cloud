"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const multer_1 = require("../middlewares/multer");
const decisionRouter = (0, express_1.Router)();
decisionRouter.post("/", isLogin_1.isLogin, index_1.default.decisionController.createDecision); //
decisionRouter.get("/course/:course_id", isLogin_1.isLogin, index_1.default.decisionController.getDecisionsByCourseId);
decisionRouter.patch("/handle/:decision_id", isLogin_1.isLogin, index_1.default.decisionController.handleDecision);
decisionRouter.post("/evidence", multer_1.uploadEvidence);
exports.default = decisionRouter;
