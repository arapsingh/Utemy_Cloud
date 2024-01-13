"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
const auth_validator_1 = __importDefault(require("../validations/auth.validator"));
const common_1 = require("../common");
class AuthController {
    async login(req, res) {
        const errorValidate = auth_validator_1.default.loginSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.AuthServices.login(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async signup(req, res) {
        const errorValidate = auth_validator_1.default.signupSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.AuthServices.signup(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async refreshAccesToken(req, res) {
        const response = await services_1.default.AuthServices.refreshAccessToken(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async verifyEmail(req, res) {
        const response = await services_1.default.AuthServices.verifyEmail(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async forgotPassword(req, res) {
        const errorValidate = auth_validator_1.default.forgotPasswordSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.AuthServices.forgotPassword(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async resetPassword(req, res) {
        const errorValidate = auth_validator_1.default.resetPasswordSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.AuthServices.resetPassword(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async changePassword(req, res) {
        const errorValidate = auth_validator_1.default.changePasswordSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.AuthServices.changePassword(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getMe(req, res) {
        const response = await services_1.default.AuthServices.getMe(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async resendVerifyEmail(req, res) {
        const response = await services_1.default.AuthServices.resendVerifyEmail(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async resendForgotPasswordEmail(req, res) {
        const response = await services_1.default.AuthServices.resendForgotPasswordEmail(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = AuthController;
