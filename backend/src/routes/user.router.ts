import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const userRouter: Router = Router();

// 8. Get me
userRouter.get("/profile", isLogin, controllers.userController.getProfile);

// 9. update profile
userRouter.patch("/update-profile", isLogin, controllers.userController.updateProfile);

// 10. Change Avatar
userRouter.put("/avatar");

// 11. Get author profile
userRouter.get("/:id", controllers.userController.getAuthorProfile);

export default userRouter;
