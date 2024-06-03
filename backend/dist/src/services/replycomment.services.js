"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const createReplyComment = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { content, comment_id } = req.body;
        const isCommentExist = await configs_1.default.db.commentLecture.findFirst({
            where: {
                id: comment_id,
            },
        });
        if (isCommentExist) {
            const createdReply = await configs_1.default.db.replyCommentLecture.create({
                data: {
                    content,
                    user_id: user_id,
                    comment_id: comment_id,
                },
                // include: {
                //     user: true,
                //     replyCommentLectures: true,
                // },
            });
            if (createdReply)
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_REPLY_COMMENT_LECTURE, true, createdReply);
            else
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
        else
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_COMMENT_NOT_FOUND, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateReplyComment = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { reply_id } = req.params;
        const { content } = req.body;
        const isReplyExist = await configs_1.default.db.replyCommentLecture.findFirst({
            where: {
                id: Number(reply_id),
                user_id: user_id,
            },
        });
        if (isReplyExist) {
            const updatedReply = await configs_1.default.db.replyCommentLecture.update({
                where: {
                    id: Number(reply_id),
                },
                data: {
                    content: content,
                    updatedAt: new Date(),
                },
            });
            if (updatedReply)
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_REPLY_COMMENT_LECTURE, true, updatedReply);
            else
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
        else
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_REPLY_NOT_FOUND, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        console.log(error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteReplyComment = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { reply_id } = req.params;
        const isReplyExist = await configs_1.default.db.replyCommentLecture.findFirst({
            where: {
                id: Number(reply_id),
                user_id: user_id,
            },
        });
        if (isReplyExist) {
            const deletedReply = await configs_1.default.db.replyCommentLecture.delete({
                where: {
                    id: Number(reply_id),
                },
            });
            if (deletedReply)
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_REPLY_COMMENT_LECTURE, true);
            else
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
        else
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_REPLY_NOT_FOUND, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getReplyCommentsWithPagination = async (req) => {
    try {
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_COMMENT_LECTURE, true);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const replyCommentService = {
    createReplyComment,
    updateReplyComment,
    deleteReplyComment,
    getReplyCommentsWithPagination,
};
exports.default = replyCommentService;
