"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const createDecision = async (req) => {
    try {
        const { course_id, type, content } = req.body;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isCourseExist = await configs_1.default.db.course.findFirst({
            where: {
                id: Number(course_id),
            },
        });
        if (!isCourseExist)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const createDecision = await configs_1.default.db.decision.create({
            data: {
                course_id: Number(course_id),
                type,
                content,
                user_id,
            },
        });
        if (!createDecision)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DECISION, true);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getDecisionsByCourseId = async (req) => {
    try {
        const { course_id } = req.params;
        const pageSize = configs_1.default.general.PAGE_SIZE;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        const isAuthor = await configs_1.default.db.course.findFirst({
            where: {
                author_id: user_id,
                id: Number(course_id),
            },
        });
        if (!isAdmin && !isAuthor)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const getDecisions = await configs_1.default.db.decision.findMany({
            where: {
                course_id: Number(course_id),
            },
            orderBy: {
                created_at: "desc",
            },
            take: pageSize,
        });
        if (!getDecisions)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        const data = getDecisions.map((decision) => {
            const temp = { ...decision, decision_id: decision.id };
            return temp;
        });
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, data);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const handleDecision = async (req) => {
    try {
        const { decision_id } = req.params;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isDecisionExist = await configs_1.default.db.decision.findFirst({
            where: {
                id: Number(decision_id),
                is_handle: false,
            },
        });
        if (!isDecisionExist)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const isAuthor = await configs_1.default.db.course.findFirst({
            where: {
                author_id: user_id,
                id: isDecisionExist.course_id,
            },
        });
        if (!isAuthor)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const handleDecision = await configs_1.default.db.decision.update({
            where: {
                id: Number(decision_id),
            },
            data: {
                is_handle: true,
            },
        });
        if (!handleDecision)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCES_HANDLE_DECISION, true);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const DecisionServices = {
    createDecision,
    getDecisionsByCourseId,
    handleDecision,
};
exports.default = DecisionServices;
