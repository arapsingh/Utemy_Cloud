"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
// import authSchema from "../validations/auth.validator";
// import { ValidationError } from "joi";
// import { convertJoiErrorToString } from "../common";
class CartController {
    async addCourseToCart(req, res) {
        const response = await services_1.default.CartServices.addCourseToCart(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async removeCourseFromCart(req, res) {
        const response = await services_1.default.CartServices.removeCourseFromCart(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async changeSaveForLater(req, res) {
        const response = await services_1.default.CartServices.changeSaveForLater(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllCart(req, res) {
        const response = await services_1.default.CartServices.getAllCart(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = CartController;
