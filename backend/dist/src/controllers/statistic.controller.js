"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
// import authSchema from "../validations/auth.validator";
// import { ValidationError } from "joi";
// import { convertJoiErrorToString } from "../common";
class StatisticController {
    async categoryCourseCount(req, res) {
        const response = await services_1.default.StatisticServices.categoryCourseCount(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async courseCount(req, res) {
        const response = await services_1.default.StatisticServices.courseCount(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async invoiceCount(req, res) {
        const response = await services_1.default.StatisticServices.invoiceCount(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async categoryEnrolledCount(req, res) {
        const response = await services_1.default.StatisticServices.categoryEnrolledCount(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async categoryMoneyCount(req, res) {
        const response = await services_1.default.StatisticServices.categoryMoneyCount(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async moneyCalculation(req, res) {
        const response = await services_1.default.StatisticServices.moneyCalculation(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async userCount(req, res) {
        const response = await services_1.default.StatisticServices.userCount(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async ratingPercent(req, res) {
        const response = await services_1.default.StatisticServices.ratingPercent(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async moneyByMonth(req, res) {
        const response = await services_1.default.StatisticServices.moneyByMonth(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = StatisticController;
