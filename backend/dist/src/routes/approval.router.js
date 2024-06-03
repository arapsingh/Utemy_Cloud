"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const approvalRouter = (0, express_1.Router)();
approvalRouter.post("/", isLogin_1.isLogin, index_1.default.approvalController.createApproval); //
approvalRouter.get("/", isLogin_1.isLogin, index_1.default.approvalController.getApprovalsWithPagination);
exports.default = approvalRouter;
