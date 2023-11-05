import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { isAuthor } from "../middlewares/isAuthor";
import { uploadAvatar, uploadThumbnail } from "../middlewares/multer";

const courseRouter: Router = Router();

//13. Get right of course
courseRouter.get("/right/:course_id", isLogin, controllers.courseController.getRightOfCourse);

//14. Create course
courseRouter.post("/", isLogin, uploadThumbnail, controllers.courseController.createCourse);

//19. Get course detail by id

//15. Edit course
courseRouter.patch("/", isLogin, uploadThumbnail, isAuthor, controllers.courseController.editCourse);

//16. Delete course
courseRouter.delete("/:course_id", isLogin, isAuthor, controllers.courseController.deleteCourse);

//17. Buy course
courseRouter.post("/buy", isLogin, isAuthor, controllers.courseController.buyCourse);

//18. Rating course

//20. Get list of rating course
courseRouter.get("/:slug/rating", controllers.courseController.getListRatingOfCourse);

//21. Get user's rating of course

//22. Get top 10 hightest rate courses
courseRouter.get("/top10", controllers.courseController.getTop10RateCourse);

courseRouter.get("/top-enrolled", controllers.courseController.getTop10EnrolledCourse);

//23. Search my course
courseRouter.get("/my", isLogin, controllers.courseController.searchMyCourse);
courseRouter.get("/enrolled", isLogin, controllers.courseController.searchMyEnrolledCourse);
courseRouter.get("/:slug", isLogin, controllers.courseController.getCourseDetail);
courseRouter.get("/detail/:course_id", isLogin, isAuthor, controllers.courseController.getCourseDetailById);
//24. Search my enrolled course

//25. Get all course
courseRouter.get("/all", isLogin, controllers.courseController.getAllCourse);

//26. Get course detail

courseRouter.post("/thumbnail", isLogin, uploadAvatar, controllers.courseController.changeThumbnail); //

export default courseRouter;
