"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const isAuthor_1 = require("../middlewares/isAuthor");
const multer_1 = require("../middlewares/multer");
const courseRouter = (0, express_1.Router)();
//13. Get right of course
courseRouter.get("/right/:course_id", isLogin_1.isLogin, index_1.default.courseController.getRightOfCourse);
//14. Create course
courseRouter.post("/", isLogin_1.isLogin, multer_1.uploadThumbnail, index_1.default.courseController.createCourse);
//19. Get course detail by id
//15. Edit course
courseRouter.patch("/", isLogin_1.isLogin, multer_1.uploadThumbnail, isAuthor_1.isAuthor, index_1.default.courseController.editCourse);
//16. Delete course
courseRouter.delete("/:course_id", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.courseController.deleteCourse);
//17. Buy course
courseRouter.post("/promotion", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.courseController.addPromotion);
courseRouter.delete("/promotion/:course_id", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.courseController.stopPromotion);
//18. Rating course
//20. Get list of rating course
courseRouter.get("/:slug/rating", index_1.default.courseController.getListRatingOfCourse);
courseRouter.get("/percent/:slug", index_1.default.courseController.getRatingPercentOfCourse);
//21. Get user's rating of course
//22. Get top 10 hightest rate courses
courseRouter.get("/top10", index_1.default.courseController.getTop10RateCourse);
courseRouter.get("/top-enrolled", index_1.default.courseController.getTop10EnrolledCourse);
//23. Search my course
courseRouter.get("/my", isLogin_1.isLogin, index_1.default.courseController.searchMyCourse);
courseRouter.get("/enrolled", isLogin_1.isLogin, index_1.default.courseController.searchMyEnrolledCourse);
courseRouter.get("/detail/:course_id", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.courseController.getCourseDetailById);
courseRouter.get("/all", index_1.default.courseController.getAllCourse);
courseRouter.post("/thumbnail", isLogin_1.isLogin, multer_1.uploadAvatar, index_1.default.courseController.changeThumbnail);
courseRouter.get("/:slug", index_1.default.courseController.getCourseDetail);
exports.default = courseRouter;
