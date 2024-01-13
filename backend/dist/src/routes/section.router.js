"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const isAuthor_1 = require("../middlewares/isAuthor");
const sectionRouter = (0, express_1.Router)();
// 33. Add Section
sectionRouter.post("/", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.sectionController.addSection);
// 34. Edit section
sectionRouter.patch("/", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.sectionController.editSection);
// 35. Delete Section
sectionRouter.delete("/:section_id", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.sectionController.deleteSection);
sectionRouter.get("/:course_id", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.sectionController.getAllSectionByCourseId);
exports.default = sectionRouter;
