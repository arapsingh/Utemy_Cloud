import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadAvatar } from "../middlewares/multer";

const categoryRouter: Router = Router();

categoryRouter.post("/image", isLogin, uploadAvatar, controllers.categoryController.updateCategory); //

export default categoryRouter;
