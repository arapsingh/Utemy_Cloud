import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const ratingRouter: Router = Router();

ratingRouter.post("/", isLogin, controllers.courseController.ratingCourse);
//19. Edit rating course
ratingRouter.patch("/", isLogin, controllers.courseController.editRatingCourse);
// Delete rating course
ratingRouter.delete("/", isLogin, controllers.courseController.deleteRatingCourse);

ratingRouter.get("/", isLogin, controllers.courseController.getUserRatingOfCourse);
export default ratingRouter;
