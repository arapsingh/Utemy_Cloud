import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const testRouter: Router = Router();

testRouter.get("/:test_id", isLogin, controllers.testController.getTestByTestId); //

export default testRouter;
