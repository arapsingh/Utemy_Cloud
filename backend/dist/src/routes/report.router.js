"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const reportRouter = (0, express_1.Router)();
reportRouter.post("/", isLogin_1.isLogin, index_1.default.reportController.createReport); //
reportRouter.get("/course/:course_id", isLogin_1.isLogin, index_1.default.reportController.getReportByCourseId);
reportRouter.get("/", isLogin_1.isLogin, index_1.default.reportController.getAllReportWithPagination);
reportRouter.patch("/handle/:report_id", isLogin_1.isLogin, index_1.default.reportController.handleReport);
exports.default = reportRouter;
