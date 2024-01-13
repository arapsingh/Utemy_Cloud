"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
const user_validation_1 = __importDefault(require("../validations/user.validation"));
const common_1 = require("../common");
class UserController {
    async getProfile(req, res) {
        const response = await services_1.default.UserService.getProfile(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateProfile(req, res) {
        const errorValidate = user_validation_1.default.updateProfileSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.UserService.updateProfile(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async changeAvatar(req, res) {
        const response = await services_1.default.UserService.changeAvatar(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAuthorProfile(req, res) {
        const response = await services_1.default.UserService.getAuthorProfile(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createNewUser(req, res) {
        const response = await services_1.default.UserService.createNewUser(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async editUser(req, res) {
        const response = await services_1.default.UserService.editUser(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteUser(req, res) {
        const response = await services_1.default.UserService.deleteUser(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async activeUser(req, res) {
        const response = await services_1.default.UserService.activeUser(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllUsers(req, res) {
        const response = await services_1.default.UserService.getAllUsers(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = UserController;
