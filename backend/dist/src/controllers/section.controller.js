"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const section_services_1 = __importDefault(require("../services/section.services"));
const section_validation_1 = __importDefault(require("../validations/section.validation"));
class SectionController {
    async addSection(req, res) {
        const errorValidate = section_validation_1.default.SectionSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await section_services_1.default.addSection(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async editSection(req, res) {
        const errorValidate = section_validation_1.default.UpdateSectionSchema.validate(req.body).error;
        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: (0, common_1.convertJoiErrorToString)(errorValidate),
                success: false,
            });
        }
        const response = await section_services_1.default.editSection(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteSection(req, res) {
        const response = await section_services_1.default.deleteSection(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllSectionByCourseId(req, res) {
        const response = await section_services_1.default.getAllSectionByCourseId(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
exports.default = SectionController;
