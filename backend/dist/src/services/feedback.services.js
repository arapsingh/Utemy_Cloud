"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const createFeedback = async (req) => {
    try {
        const { content, score } = req.body;
        const user_id = req.user_id;
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const createFeedback = await configs_1.default.db.feedback.create({
            data: {
                content,
                user_id,
                score,
            },
        });
        if (!createFeedback)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_FEEDBACK, true);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllFeedbacks = async (req) => {
    try {
        const user_id = req.user_id;
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
        const { page_index: pageIndex, evaluate } = req.query;
        const convertedEvaluate = evaluate ? parseFloat(evaluate) : undefined;
        const pageSize = configs_1.default.general.PAGE_SIZE;
        const baseFilter = {};
        if (convertedEvaluate) {
            baseFilter.score = convertedEvaluate;
        }
        const totalRecord = await configs_1.default.db.feedback.count({
            where: baseFilter,
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const getAllFeedbacks = await configs_1.default.db.feedback.findMany({
            skip: pageSize * (Number(pageIndex) - 1),
            take: pageSize,
            include: {
                user: {
                    select: {
                        id: true,
                        url_avatar: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
            where: baseFilter,
        });
        const averageRating = await configs_1.default.db.feedback.aggregate({
            _avg: {
                score: true,
            },
        });
        const getFeedbacksList = [];
        getAllFeedbacks.map((item) => {
            const feedback = {
                feedback_id: item.id,
                content: item.content,
                user_id: item.user.id,
                first_name: item.user.first_name,
                last_name: item.user.last_name,
                url_avatar: item.user.url_avatar,
                created_at: item.created_at.toString(),
                score: item.score,
            };
            return getFeedbacksList.push(feedback);
        });
        const getFeedbacksResponse = {
            total_record: totalRecord,
            total_page: totalPage,
            average_rating: averageRating._avg.score,
            data: getFeedbacksList,
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, getFeedbacksResponse);
    }
    catch (error) {
        console.log(error);
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const FeedbackServices = {
    createFeedback,
    getAllFeedbacks,
};
exports.default = FeedbackServices;
