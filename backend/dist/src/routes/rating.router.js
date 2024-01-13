"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const ratingRouter = (0, express_1.Router)();
ratingRouter.post("/", isLogin_1.isLogin, index_1.default.ratingController.ratingCourse);
//19. Edit rating course
ratingRouter.patch("/", isLogin_1.isLogin, index_1.default.ratingController.editRatingCourse);
// Delete rating course
ratingRouter.delete("/:rating_id", isLogin_1.isLogin, index_1.default.ratingController.deleteRatingCourse);
ratingRouter.get("/:course_id", isLogin_1.isLogin, index_1.default.ratingController.getUserRatingOfCourse);
exports.default = ratingRouter;
