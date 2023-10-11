import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadAvatar } from "../middlewares/multer";

const courseRouter: Router = Router();

courseRouter.post("/thumbnail", isLogin, uploadAvatar, controllers.courseController.changeThumbnail); //

export default courseRouter;
