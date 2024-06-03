"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const createReactionCommentBlog = async (req) => {
    try {
        const user_id = req.user_id;
        const { commentblog_id, type } = req.body;
        // Kiểm tra sự tồn tại của comment
        const isCommentExist = await configs_1.default.db.commentBlog.findFirst({
            where: {
                id: commentblog_id,
            },
        });
        if (!isCommentExist) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_COMMENT_BLOG_NOT_FOUND, false);
        }
        // Kiểm tra sự tồn tại của phản ứng
        const existingReaction = await configs_1.default.db.reactionCommentBlog.findFirst({
            where: {
                user_id: user_id,
                comment_id: commentblog_id,
            },
        });
        if (existingReaction) {
            if (existingReaction.type == type) {
                const deletedReaction = await configs_1.default.db.reactionCommentBlog.delete({
                    where: {
                        id: existingReaction.id,
                    },
                });
                if (deletedReaction) {
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_DATA, true);
                }
                else {
                    return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                }
            }
            else {
                // Nếu phản ứng đã tồn tại, cập nhật loại phản ứng thành dislike
                const updatedReaction = await configs_1.default.db.reactionCommentBlog.update({
                    where: {
                        id: existingReaction.id,
                    },
                    data: {
                        type: type,
                    },
                });
                if (updatedReaction) {
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true);
                }
                else {
                    return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        }
        else {
            // Nếu phản ứng chưa tồn tại, tạo mới phản ứng với loại dislike
            const newReaction = await configs_1.default.db.reactionCommentBlog.create({
                data: {
                    user_id: Number(user_id),
                    comment_id: commentblog_id,
                    type: type,
                },
                include: {
                    comment_blog: true,
                },
            });
            if (newReaction) {
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_REACTION, true);
            }
            else {
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        console.log(error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteReactionCommentBlog = async (req) => {
    try {
        const { reaction_id } = req.params;
        const user_id = Number(req.user_id);
        const existingReaction = await configs_1.default.db.reactionCommentBlog.findFirst({
            where: {
                id: Number(reaction_id),
                user_id: user_id,
            },
        });
        if (!existingReaction) {
            return new response_1.ResponseError(400, "Reaction does not exist", false);
        }
        await configs_1.default.db.reactionCommentBlog.delete({
            where: {
                id: existingReaction.id,
            },
        });
        return new response_1.ResponseSuccess(200, "Reaction deleted successfully", true);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        console.log("Error:", error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getTotalReactionsByCommentId = async (req) => {
    try {
        const { comment_id } = req.params;
        const isCommentExist = await configs_1.default.db.commentBlog.findFirst({
            where: {
                id: Number(comment_id),
            },
        });
        if (!isCommentExist) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_COMMENT_BLOG_NOT_FOUND, false);
        }
        // Tính tổng số like
        const totalLikes = await configs_1.default.db.reactionCommentBlog.count({
            where: {
                comment_id: Number(comment_id),
                type: "LIKE", // Đếm số lượng phản ứng có loại là LIKE
            },
        });
        // Tính tổng số dislike
        const totalDislikes = await configs_1.default.db.reactionCommentBlog.count({
            where: {
                comment_id: Number(comment_id),
                type: "DISLIKE", // Đếm số lượng phản ứng có loại là DISLIKE
            },
        });
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, { totalLikes, totalDislikes });
    }
    catch (error) {
        console.error("Error:", error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getTotalReactionsForAllComments = async (req) => {
    try {
        const allComments = await configs_1.default.db.commentBlog.findMany();
        const reactionsForAllComments = [];
        for (const comment of allComments) {
            const totalLikes = await configs_1.default.db.reactionCommentBlog.count({
                where: {
                    comment_id: comment.id,
                    type: "LIKE",
                },
            });
            const totalDislikes = await configs_1.default.db.reactionCommentBlog.count({
                where: {
                    comment_id: comment.id,
                    type: "DISLIKE",
                },
            });
            reactionsForAllComments.push({
                comment_id: comment.id,
                totalLikes,
                totalDislikes,
            });
        }
        // Trả về kết quả
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, reactionsForAllComments);
    }
    catch (error) {
        console.error("Error:", error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const reactionCommentBlogService = {
    createReactionCommentBlog,
    deleteReactionCommentBlog,
    getTotalReactionsByCommentId,
    getTotalReactionsForAllComments
};
exports.default = reactionCommentBlogService;
