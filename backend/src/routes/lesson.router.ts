import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadVideo } from "../middlewares/multer";

const lessonRouter: Router = Router();

lessonRouter.post("/", isLogin, uploadVideo, controllers.lessonController.createLesson); //
lessonRouter.patch("/", isLogin, uploadVideo, controllers.lessonController.updateLesson);
lessonRouter.delete("/", isLogin, controllers.lessonController.deleteLesson);
lessonRouter.get("/", isLogin, controllers.lessonController.getLessonById);

export default lessonRouter;
