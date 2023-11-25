import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const statRouter: Router = Router();

statRouter.get("/category-course", controllers.statisticController.categoryCourseCount);
statRouter.get("/category-enrolled", controllers.statisticController.categoryEnrolledCount);
statRouter.get("/category-money", controllers.statisticController.categoryMoneyCount);
statRouter.get("/course", controllers.statisticController.courseCount);
statRouter.get("/money", controllers.statisticController.moneyCalculation);
statRouter.get("/total-user", controllers.statisticController.userCount);

export default statRouter;
