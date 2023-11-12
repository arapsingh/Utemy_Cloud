import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const checkoutRouter: Router = Router();

checkoutRouter.post("/", isLogin, controllers.checkoutController.createInvoice); //
checkoutRouter.get("/", isLogin, controllers.checkoutController.getAllInvoices); //

export default checkoutRouter;
