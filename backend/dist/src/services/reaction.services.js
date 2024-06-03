"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const createLike = async (req) => {
    try {
        const user_id = req.user_id;
        const { comment_id, reply_id } = req.body;
        const isExistLike = await configs_1.default.db.like.findFirst({
            where: {
                user_id: user_id,
                comment_id: comment_id,
                reply_id: reply_id,
            },
        });
        if (!isExistLike) {
            const newLike = await configs_1.default.db.like.create({
                data: {
                    user_id: Number(user_id),
                    comment_id,
                    reply_id,
                },
                include: {
                    commentLecture: true,
                    replyCommentLecture: true,
                },
            });
            if (newLike.reply_id == null) {
                const updateCommentLikeCounts = await configs_1.default.db.commentLecture.update({
                    where: {
                        id: newLike.comment_id,
                    },
                    data: {
                        likes_count: {
                            increment: 1,
                        },
                    },
                    include: {
                        liked_by: true,
                    },
                });
                if (updateCommentLikeCounts) {
                    const findDislike = await configs_1.default.db.dislike.findFirst({
                        where: {
                            user_id: newLike.user_id,
                            comment_id: newLike.comment_id,
                            reply_id: null,
                        },
                    });
                    if (findDislike) {
                        const deleteDislike = await configs_1.default.db.dislike.delete({
                            where: {
                                id: findDislike.id,
                                // user_id: newDislike.user_id,
                                // comment_id: newDislike.comment_id,
                                // reply_id: null,
                            },
                            include: {
                                commentLecture: true,
                                replyCommentLecture: true,
                            },
                        });
                        if (deleteDislike) {
                            const reduceAmountDislike = await configs_1.default.db.commentLecture.update({
                                where: {
                                    id: deleteDislike.comment_id,
                                },
                                data: {
                                    dislikes_count: {
                                        decrement: 1,
                                    },
                                },
                                include: {
                                    disliked_by: true,
                                },
                            });
                            if (reduceAmountDislike)
                                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_LIKE, true, updateCommentLikeCounts);
                            else
                                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_LIKE, true, updateCommentLikeCounts);
                        }
                        else
                            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_LIKE, true, updateCommentLikeCounts);
                    }
                    else
                        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_LIKE, true, updateCommentLikeCounts);
                }
                return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
            }
            else if (newLike.reply_id != null) {
                const updateReplyLikeCounts = await configs_1.default.db.replyCommentLecture.update({
                    where: {
                        id: newLike.reply_id,
                    },
                    data: {
                        likes_count: {
                            increment: 1,
                        },
                    },
                    include: {
                        liked_by: true,
                    },
                });
                if (updateReplyLikeCounts) {
                    const findDislike = await configs_1.default.db.dislike.findFirst({
                        where: {
                            user_id: newLike.user_id,
                            comment_id: newLike.comment_id,
                            reply_id: newLike.reply_id,
                        },
                    });
                    if (findDislike) {
                        const deleteDislike = await configs_1.default.db.dislike.delete({
                            where: {
                                id: findDislike.id,
                                // user_id: newDislike.user_id,
                                // comment_id: newDislike.comment_id,
                                // reply_id: findLike.reply_id,
                            },
                            include: {
                                commentLecture: true,
                                replyCommentLecture: true,
                            },
                        });
                        if (deleteDislike) {
                            const reduceAmountDislike = await configs_1.default.db.replyCommentLecture.update({
                                where: {
                                    id: deleteDislike.reply_id || undefined,
                                },
                                data: {
                                    dislikes_count: {
                                        decrement: 1,
                                    },
                                },
                                include: {
                                    disliked_by: true,
                                },
                            });
                            if (reduceAmountDislike)
                                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_LIKE, true, updateReplyLikeCounts);
                            else
                                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_LIKE, true, updateReplyLikeCounts);
                        }
                        else
                            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_LIKE, true, updateReplyLikeCounts);
                    }
                    else
                        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_LIKE, true, updateReplyLikeCounts);
                }
                return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
            }
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_LIKE, true);
        }
        return new response_1.ResponseError(400, constants_1.default.error.ERROR_LIKE_ONCE_TIME, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteLike = async (req) => {
    try {
        const user_id = req.user_id;
        const { comment_id, reply_id } = req.body;
        const isExistLike = await configs_1.default.db.like.findFirst({
            where: {
                user_id: user_id,
                comment_id: comment_id,
                reply_id: reply_id,
            },
        });
        if (isExistLike) {
            const deletedLike = await configs_1.default.db.like.delete({
                where: {
                    id: isExistLike.id,
                },
                include: {
                    commentLecture: true,
                    replyCommentLecture: true,
                },
            });
            if (deletedLike && deletedLike.reply_id == null) {
                const reduceAmountLike = await configs_1.default.db.commentLecture.update({
                    where: {
                        id: deletedLike.comment_id,
                    },
                    data: {
                        likes_count: {
                            decrement: 1,
                        },
                    },
                    include: {
                        liked_by: true,
                    },
                });
                if (reduceAmountLike)
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_LIKE, true);
                else
                    return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
            }
            else if (deletedLike && deletedLike.reply_id != null) {
                const reduceAmountLike = await configs_1.default.db.replyCommentLecture.update({
                    where: {
                        id: deletedLike.reply_id,
                    },
                    data: {
                        likes_count: {
                            decrement: 1,
                        },
                    },
                    include: {
                        liked_by: true,
                    },
                });
                if (reduceAmountLike)
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_LIKE, true);
                else
                    return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
            }
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseSuccess(404, constants_1.default.error.ERROR_LIKE_NOT_FOUND, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createDislike = async (req) => {
    try {
        const user_id = req.user_id;
        const { comment_id, reply_id } = req.body;
        const isExistDislike = await configs_1.default.db.dislike.findFirst({
            where: {
                user_id: user_id,
                comment_id: comment_id,
                reply_id: reply_id,
            },
        });
        if (!isExistDislike) {
            const newDislike = await configs_1.default.db.dislike.create({
                data: {
                    user_id: Number(user_id),
                    comment_id,
                    reply_id,
                },
                include: {
                    commentLecture: true,
                    replyCommentLecture: true,
                },
            });
            if (newDislike.reply_id == null) {
                const updateCommentDislikeCounts = await configs_1.default.db.commentLecture.update({
                    where: {
                        id: newDislike.comment_id,
                    },
                    data: {
                        dislikes_count: {
                            increment: 1,
                        },
                    },
                    include: {
                        disliked_by: true,
                    },
                });
                if (updateCommentDislikeCounts) {
                    const findLike = await configs_1.default.db.like.findFirst({
                        where: {
                            user_id: newDislike.user_id,
                            comment_id: newDislike.comment_id,
                            reply_id: null,
                        },
                    });
                    if (findLike) {
                        const deleteLike = await configs_1.default.db.like.delete({
                            where: {
                                id: findLike.id,
                                // user_id: newDislike.user_id,
                                // comment_id: newDislike.comment_id,
                                // reply_id: null,
                            },
                            include: {
                                commentLecture: true,
                                replyCommentLecture: true,
                            },
                        });
                        if (deleteLike) {
                            const reduceAmountLike = await configs_1.default.db.commentLecture.update({
                                where: {
                                    id: deleteLike.comment_id,
                                },
                                data: {
                                    likes_count: {
                                        decrement: 1,
                                    },
                                },
                                include: {
                                    liked_by: true,
                                },
                            });
                            if (reduceAmountLike)
                                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DISLIKE, true, updateCommentDislikeCounts);
                            else
                                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DISLIKE, true, updateCommentDislikeCounts);
                        }
                        else
                            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DISLIKE, true, updateCommentDislikeCounts);
                    }
                    else
                        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DISLIKE, true, updateCommentDislikeCounts);
                }
                return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
            }
            else if (newDislike.reply_id != null) {
                const updateReplyDislikeCounts = await configs_1.default.db.replyCommentLecture.update({
                    where: {
                        id: newDislike.reply_id,
                    },
                    data: {
                        dislikes_count: {
                            increment: 1,
                        },
                    },
                    include: {
                        disliked_by: true,
                    },
                });
                if (updateReplyDislikeCounts) {
                    const findLike = await configs_1.default.db.like.findFirst({
                        where: {
                            user_id: newDislike.user_id,
                            comment_id: newDislike.comment_id,
                            reply_id: newDislike.reply_id,
                        },
                    });
                    if (findLike) {
                        const deleteLike = await configs_1.default.db.like.delete({
                            where: {
                                id: findLike.id,
                                // user_id: newDislike.user_id,
                                // comment_id: newDislike.comment_id,
                                // reply_id: findLike.reply_id,
                            },
                            include: {
                                commentLecture: true,
                                replyCommentLecture: true,
                            },
                        });
                        if (deleteLike) {
                            const reduceAmountLike = await configs_1.default.db.replyCommentLecture.update({
                                where: {
                                    id: deleteLike.reply_id || undefined,
                                },
                                data: {
                                    likes_count: {
                                        decrement: 1,
                                    },
                                },
                                include: {
                                    liked_by: true,
                                },
                            });
                            if (reduceAmountLike)
                                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DISLIKE, true, updateReplyDislikeCounts);
                            else
                                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DISLIKE, true, updateReplyDislikeCounts);
                        }
                        else
                            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DISLIKE, true, updateReplyDislikeCounts);
                    }
                    else
                        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DISLIKE, true, updateReplyDislikeCounts);
                }
                return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
            }
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DISLIKE, true);
        }
        return new response_1.ResponseError(400, constants_1.default.error.ERROR_DISLIKE_ONCE_TIME, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteDislike = async (req) => {
    try {
        const user_id = req.user_id;
        const { comment_id, reply_id } = req.body;
        const isExistDislike = await configs_1.default.db.dislike.findFirst({
            where: {
                user_id: user_id,
                comment_id: comment_id,
                reply_id: reply_id,
            },
        });
        if (isExistDislike) {
            const deletedDislike = await configs_1.default.db.dislike.delete({
                where: {
                    id: isExistDislike.id,
                },
                include: {
                    commentLecture: true,
                    replyCommentLecture: true,
                },
            });
            if (deletedDislike && deletedDislike.reply_id == null) {
                const reduceAmountDislike = await configs_1.default.db.commentLecture.update({
                    where: {
                        id: deletedDislike.comment_id,
                    },
                    data: {
                        dislikes_count: {
                            decrement: 1,
                        },
                    },
                    include: {
                        disliked_by: true,
                    },
                });
                if (reduceAmountDislike)
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_DISLIKE, true);
                else
                    return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
            }
            else if (deletedDislike && deletedDislike.reply_id != null) {
                const reduceAmountDislike = await configs_1.default.db.replyCommentLecture.update({
                    where: {
                        id: deletedDislike.reply_id,
                    },
                    data: {
                        dislikes_count: {
                            decrement: 1,
                        },
                    },
                    include: {
                        disliked_by: true,
                    },
                });
                if (reduceAmountDislike)
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_DISLIKE, true);
                else
                    return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
            }
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseSuccess(404, constants_1.default.error.ERROR_DISLIKE_NOT_FOUND, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const checkLikeExist = async (req) => {
    try {
        const user_id = req.user_id;
        const { comment_id, reply_id } = req.body;
        const isLikeExist = await configs_1.default.db.like.findFirst({
            where: {
                user_id: Number(user_id),
                comment_id: comment_id,
                reply_id: reply_id,
            },
        });
        if (isLikeExist)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, isLikeExist);
        return new response_1.ResponseSuccess(404, constants_1.default.error.ERROR_LIKE_NOT_FOUND, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const checkDislikeExist = async (req) => {
    try {
        const user_id = req.user_id;
        const { comment_id, reply_id } = req.body;
        const isDislikeExist = await configs_1.default.db.dislike.findFirst({
            where: {
                user_id: Number(user_id),
                comment_id: comment_id,
                reply_id: reply_id,
            },
        });
        if (isDislikeExist)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, isDislikeExist);
        return new response_1.ResponseSuccess(404, constants_1.default.error.ERROR_DISLIKE_NOT_FOUND, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const reactionService = {
    createLike,
    deleteLike,
    createDislike,
    deleteDislike,
    checkLikeExist,
    checkDislikeExist,
};
exports.default = reactionService;
