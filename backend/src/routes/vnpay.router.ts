import { Router } from "express";
import controllers from "../controllers/index";

const vnpayRouter: Router = Router();

vnpayRouter.get("/", controllers.vnpayController.checkout); //

export default vnpayRouter;
