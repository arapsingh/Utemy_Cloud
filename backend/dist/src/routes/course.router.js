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
// Get all sales courses
courseRouter.get("/all-sales", index_1.default.courseController.getAllSalesCourses);
// Get top 10 sales courses
courseRouter.get("/top10-sales", index_1.default.courseController.getTop10SalesCourses);
//13. Get right of course
courseRouter.get("/right/:course_id", isLogin_1.isLogin, index_1.default.courseController.getRightOfCourse);
//14. Create course
courseRouter.post("/", isLogin_1.isLogin, multer_1.uploadMixFiles, index_1.default.courseController.createCourse);
courseRouter.patch("/approve/:course_id", isLogin_1.isLogin, index_1.default.courseController.approveCourse);
courseRouter.patch("/restrict/:course_id", isLogin_1.isLogin, index_1.default.courseController.restrictCourse);
//19. Get course detail by id
//15. Edit course
courseRouter.patch("/", isLogin_1.isLogin, multer_1.uploadMixFiles, isAuthor_1.isAuthor, index_1.default.courseController.editCourse);
courseRouter.patch("/target", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.courseController.updateTargetCourse);
//16. Delete course
courseRouter.delete("/:course_id", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.courseController.deleteCourse);
//17. Buy course
courseRouter.post("/promotion", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.courseController.addPromotion);
courseRouter.delete("/promotion/:course_id", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.courseController.stopPromotion);
//18. Rating course
//20. Get list of rating course
courseRouter.get("/:slug/rating", index_1.default.courseController.getListRatingOfCourse);
courseRouter.get("/:slug/progress", isLogin_1.isLogin, index_1.default.courseController.getProgressByCourseSlug);
courseRouter.get("/:course_id/certificate", isLogin_1.isLogin, index_1.default.courseController.getCertificate);
courseRouter.get("/percent/:slug", index_1.default.courseController.getRatingPercentOfCourse);
courseRouter.post("/final/", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.courseController.createFinalTest);
courseRouter.get("/final/:course_id", isLogin_1.isLogin, index_1.default.courseController.getFinalTestByCourseId);
courseRouter.patch("/final/:course_id", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.courseController.updateFinalTest);
courseRouter.delete("/final/:course_id", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.courseController.deleteFinalTest);
courseRouter.patch("/done/:course_id", isLogin_1.isLogin, index_1.default.courseController.setDoneCourse);
//21. Get user's rating of course
//22. Get top 10 hightest rate courses
courseRouter.get("/top10", index_1.default.courseController.getTop10RateCourse);
courseRouter.get("/top-enrolled", index_1.default.courseController.getTop10EnrolledCourse);
courseRouter.get("/enrolled-id", isLogin_1.isLogin, index_1.default.courseController.getAllEnrolled);
//23. Search my course
courseRouter.get("/my", isLogin_1.isLogin, index_1.default.courseController.searchMyCourse);
courseRouter.get("/enrolled", isLogin_1.isLogin, index_1.default.courseController.searchMyEnrolledCourse);
courseRouter.get("/detail/:course_id", isLogin_1.isLogin, isAuthor_1.isAuthor, index_1.default.courseController.getCourseDetailById);
courseRouter.get("/all", index_1.default.courseController.getAllCourse);
courseRouter.post("/thumbnail", isLogin_1.isLogin, multer_1.uploadAvatar, index_1.default.courseController.changeThumbnail);
courseRouter.get("/:slug", index_1.default.courseController.getCourseDetail);
courseRouter.get("/trial/:slug", index_1.default.courseController.getCourseDetailForTrialLesson);
exports.default = courseRouter;
