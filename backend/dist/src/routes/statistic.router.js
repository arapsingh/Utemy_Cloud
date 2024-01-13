"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const statRouter = (0, express_1.Router)();
statRouter.get("/category-course", isLogin_1.isLogin, index_1.default.statisticController.categoryCourseCount);
statRouter.get("/category-enrolled", isLogin_1.isLogin, index_1.default.statisticController.categoryEnrolledCount);
statRouter.get("/category-money", isLogin_1.isLogin, index_1.default.statisticController.categoryMoneyCount);
statRouter.get("/course", isLogin_1.isLogin, index_1.default.statisticController.courseCount);
statRouter.get("/total-invoice", isLogin_1.isLogin, index_1.default.statisticController.invoiceCount);
statRouter.get("/money", isLogin_1.isLogin, index_1.default.statisticController.moneyCalculation);
statRouter.get("/total-user", isLogin_1.isLogin, index_1.default.statisticController.userCount);
statRouter.get("/money-by-month/:year", isLogin_1.isLogin, index_1.default.statisticController.moneyByMonth);
statRouter.get("/rating-percent", isLogin_1.isLogin, index_1.default.statisticController.ratingPercent);
exports.default = statRouter;
