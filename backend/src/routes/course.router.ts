import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { isAuthor } from "../middlewares/isAuthor";
import { uploadAvatar } from "../middlewares/multer";

const courseRouter: Router = Router();

//13. Get right of course
courseRouter.get("/right/:course_id", isLogin, controllers.courseController.getRightOfCourse);

//14. Create course
courseRouter.post("/", isLogin, controllers.courseController.createCourse);

//15. Edit course
courseRouter.patch("/:course_id", isLogin, controllers.courseController.editCourse);

//16. Delete course
courseRouter.delete("/:course_id", isLogin, controllers.courseController.deleteCourse);

//17. Buy course
courseRouter.post("/buy", isLogin, isAuthor, controllers.courseController.buyCourse);

//18. Rating course
courseRouter.post("/rating", isLogin, isAuthor, controllers.courseController.ratingCourse);

//19. Edit rating course
courseRouter.patch("/rating", isLogin, isAuthor, controllers.courseController.editRatingCourse);

//20. Get list of rating course
courseRouter.get("/rating/:course_id", isLogin, isAuthor, controllers.courseController.getListRatingOfCourse);

//21. Get user's rating of course
courseRouter.get("/rating/:course_id/user", isLogin, isAuthor, controllers.courseController.getUserRatingOfCourse);

//22. Get top 10 courses
courseRouter.get("/top10", controllers.courseController.getTop10Course);

//23. Search my course
courseRouter.get("/my", isLogin, controllers.courseController.searchMyCourse);

//24. Search my enrolled course
courseRouter.get("/enrolled", isLogin, controllers.courseController.searchMyEnrolledCourse);

//25. Get all course
courseRouter.get("/", isLogin, controllers.courseController.getAllCourse);

//26. Get course detail
courseRouter.get("/:slug", isLogin, controllers.courseController.getCourseDetail);

courseRouter.post("/thumbnail", isLogin, uploadAvatar, controllers.courseController.changeThumbnail); //

export default courseRouter;
