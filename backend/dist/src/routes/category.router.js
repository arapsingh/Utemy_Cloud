"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const multer_1 = require("../middlewares/multer");
const categoryRouter = (0, express_1.Router)();
categoryRouter.post("/", isLogin_1.isLogin, multer_1.uploadCategory, index_1.default.categoryController.createCategory); //
categoryRouter.patch("/", isLogin_1.isLogin, multer_1.uploadCategory, index_1.default.categoryController.updateCategory); //
categoryRouter.delete("/:category_id", isLogin_1.isLogin, index_1.default.categoryController.deleteCategory); //
categoryRouter.get("/all", index_1.default.categoryController.getCategoriesWithPagination); //
categoryRouter.get("/full", index_1.default.categoryController.getCategories); //
categoryRouter.get("/top5", index_1.default.categoryController.get5Categories); //
categoryRouter.get("/:category_id", isLogin_1.isLogin, index_1.default.categoryController.getCategory); //
exports.default = categoryRouter;
