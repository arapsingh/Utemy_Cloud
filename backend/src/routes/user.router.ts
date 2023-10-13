import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadAvatar } from "../middlewares/multer";

const userRouter: Router = Router();

userRouter.post("/avatar", isLogin, uploadAvatar, controllers.userController.changeAvatar); //

export default userRouter;
