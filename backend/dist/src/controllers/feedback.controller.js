"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = __importDefault(require("../services"));
const common_1 = require("../common");
const feedback_validator_1 = __importDefault(require("../validations/feedback.validator"));
class FeedbackController {
    async createFeedback(req, res) {
        const errorValidate = feedback_validator_1.default.createFeedbackSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await services_1.default.FeedbackServices.createFeedback(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllFeedbacks(req, res) {
        const response = await services_1.default.FeedbackServices.getAllFeedbacks(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = FeedbackController;
