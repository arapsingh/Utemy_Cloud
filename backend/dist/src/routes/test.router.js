"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const testRouter = (0, express_1.Router)();
testRouter.get("/:test_id", isLogin_1.isLogin, index_1.default.testController.getTestByTestId); //
testRouter.post("/history", isLogin_1.isLogin, index_1.default.testController.createTestHistory); //
testRouter.get("/history/:test_id", isLogin_1.isLogin, index_1.default.testController.getTestHistory); //
exports.default = testRouter;
