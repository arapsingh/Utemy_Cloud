"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
class ReactionController {
    async createLike(req, res) {
        const response = await services_1.default.ReactionServices.createLike(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteLike(req, res) {
        const response = await services_1.default.ReactionServices.deleteLike(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createDislike(req, res) {
        const response = await services_1.default.ReactionServices.createDislike(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteDislike(req, res) {
        const response = await services_1.default.ReactionServices.deleteDislike(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async checkLikeExist(req, res) {
        const response = await services_1.default.ReactionServices.checkLikeExist(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async checkDislikeExist(req, res) {
        const response = await services_1.default.ReactionServices.checkDislikeExist(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = ReactionController;
