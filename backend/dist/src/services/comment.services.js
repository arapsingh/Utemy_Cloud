"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const luxon_1 = require("luxon");
const createComment = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { content, lecture_id } = req.body;
        const isLectureExist = await configs_1.default.db.lecture.findFirst({
            where: {
                id: lecture_id,
            },
        });
        if (isLectureExist) {
            const createdComment = await configs_1.default.db.commentLecture.create({
                data: {
                    content,
                    user_id: user_id,
                    lecture_id: lecture_id,
                },
                // include: {
                //     user: true,
                //     replyCommentLectures: true,
                // },
            });
            if (createdComment)
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_COMMENT_LECTURE, true, createdComment);
            else
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
        else
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_LECTURE_NOT_FOUND, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateComment = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { comment_id } = req.params;
        const { content } = req.body;
        const isCommentExist = await configs_1.default.db.commentLecture.findFirst({
            where: {
                id: Number(comment_id),
                user_id: user_id,
            },
        });
        if (isCommentExist) {
            const updatedComment = await configs_1.default.db.commentLecture.update({
                where: {
                    id: Number(comment_id),
                },
                data: {
                    content: content,
                    updatedAt: new Date(),
                },
            });
            if (updatedComment)
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_COMMENT_LECTURE, true, updatedComment);
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
const deleteComment = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { comment_id } = req.params;
        const isCommentExist = await configs_1.default.db.commentLecture.findFirst({
            where: {
                id: Number(comment_id),
                user_id: user_id,
            },
        });
        if (isCommentExist) {
            const deletedComment = await configs_1.default.db.commentLecture.delete({
                where: {
                    id: Number(comment_id),
                },
            });
            if (deletedComment)
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_COMMENT_LECTURE, true);
            else
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, deletedComment);
        }
        else
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_COMMENT_NOT_FOUND, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        console.log(error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCommentsWithPagination = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { search_item: searchItem, page_index: pageIndex } = req.query;
        const parsedSearchItem = searchItem;
        const pageSize = configs_1.default.general.PAGE_SIZE;
        const skip = ((Number(pageIndex) ?? 1) - 1) * pageSize;
        const getAllComment = await configs_1.default.db.commentLecture.findMany({
            skip,
            take: pageSize,
            where: {
                content: {
                    contains: parsedSearchItem,
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                user: true,
                replyCommentLectures: {
                    include: {
                        user: true,
                    },
                },
                liked_by: {
                    include: {
                        user: true,
                    },
                },
                disliked_by: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!getAllComment)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const totalRecord = await configs_1.default.db.commentLecture.count();
        const totalPage = Math.ceil(totalRecord / pageSize);
        const comments = [];
        getAllComment.map((item) => {
            const comment = {
                comment_id: item.id,
                content: item.content,
                updatedAt: luxon_1.DateTime.fromISO(item.updatedAt.toISOString()),
                user: {
                    id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                    url_avatar: item.user.url_avatar || undefined,
                },
                lecture_id: item.lecture_id,
                likes_count: item.likes_count,
                dislikes_count: item.dislikes_count,
                replyCommentLectures: item.replyCommentLectures.map((r) => {
                    return {
                        reply_id: r.id,
                        content: r.content,
                        updatedAt: r.updatedAt,
                        user: {
                            user_id: r.user.id,
                            first_name: r.user.first_name,
                            last_name: r.user.last_name,
                            url_avatar: r.user.url_avatar,
                        },
                        likes_count: r.likes_count,
                        dislikes_count: r.dislikes_count,
                    };
                }),
                likes: item.liked_by.map((like) => {
                    return {
                        like_id: like.id,
                        user: {
                            user_id: like.user.id,
                            first_name: like.user.first_name,
                            last_name: like.user.last_name,
                            url_avatar: like.user.url_avatar,
                        },
                        comment_id: like.comment_id,
                        reply_id: like.reply_id,
                        updatedAt: like.updatedAt,
                    };
                }),
                dislikes: item.disliked_by.map((dislike) => {
                    return {
                        dislike_id: dislike.id,
                        user: {
                            user_id: dislike.user.id,
                            first_name: dislike.user.first_name,
                            last_name: dislike.user.last_name,
                            url_avatar: dislike.user.url_avatar,
                        },
                        comment_id: dislike.comment_id,
                        reply_id: dislike.reply_id,
                        updatedAt: dislike.updatedAt,
                    };
                }),
            };
            return comments.push(comment);
        });
        const commentsResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: comments,
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, commentsResponseData);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        console.log("Error:", error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCommentsWithPaginationByLectureId = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { lecture_id } = req.params;
        const { page_index: pageIndex } = req.query;
        // const parsedSearchItem = searchItem as string;
        const pageSize = configs_1.default.general.PAGE_SIZE;
        const skip = ((Number(pageIndex) ?? 1) - 1) * pageSize;
        const getAllCommentByLectureId = await configs_1.default.db.commentLecture.findMany({
            skip,
            take: pageSize,
            where: {
                lecture_id: Number(lecture_id),
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                user: true,
                replyCommentLectures: {
                    include: {
                        user: true,
                    },
                },
                liked_by: {
                    include: {
                        user: true,
                    },
                },
                disliked_by: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!getAllCommentByLectureId)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const totalRecord = await configs_1.default.db.commentLecture.count();
        const totalPage = Math.ceil(totalRecord / pageSize);
        const comments = [];
        getAllCommentByLectureId.map((item) => {
            const comment = {
                comment_id: item.id,
                content: item.content,
                updatedAt: luxon_1.DateTime.fromISO(item.updatedAt.toISOString()),
                user: {
                    id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                    url_avatar: item.user.url_avatar || undefined,
                },
                lecture_id: item.lecture_id,
                likes_count: item.likes_count,
                dislikes_count: item.dislikes_count,
                replyCommentLectures: item.replyCommentLectures.map((r) => {
                    return {
                        reply_id: r.id,
                        content: r.content,
                        updatedAt: r.updatedAt,
                        user: {
                            user_id: r.user.id,
                            first_name: r.user.first_name,
                            last_name: r.user.last_name,
                            url_avatar: r.user.url_avatar,
                        },
                        likes_count: r.likes_count,
                        dislikes_count: r.dislikes_count,
                    };
                }),
                likes: item.liked_by.map((like) => {
                    return {
                        like_id: like.id,
                        user: {
                            user_id: like.user.id,
                            first_name: like.user.first_name,
                            last_name: like.user.last_name,
                            url_avatar: like.user.url_avatar,
                        },
                        comment_id: like.comment_id,
                        reply_id: like.reply_id,
                        updatedAt: like.updatedAt,
                    };
                }),
                dislikes: item.disliked_by.map((dislike) => {
                    return {
                        dislike_id: dislike.id,
                        user: {
                            user_id: dislike.user.id,
                            first_name: dislike.user.first_name,
                            last_name: dislike.user.last_name,
                            url_avatar: dislike.user.url_avatar,
                        },
                        comment_id: dislike.comment_id,
                        reply_id: dislike.reply_id,
                        updatedAt: dislike.updatedAt,
                    };
                }),
            };
            return comments.push(comment);
        });
        const commentsResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: comments,
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, commentsResponseData);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        console.log("Error:", error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCommentsWithPaginationByCourseId = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { course_id } = req.params;
        const { page_index: pageIndex } = req.query;
        // const parsedSearchItem = searchItem as string;
        const pageSize = configs_1.default.general.PAGE_SIZE;
        const skip = ((Number(pageIndex) ?? 1) - 1) * pageSize;
        // Bước 1: Lấy tất cả các section theo course_id
        const sections = await configs_1.default.db.section.findMany({
            where: {
                course_id: Number(course_id),
            },
        });
        // Bước 2: Lấy tất cả các lecture theo từng section_id
        const lectures = await Promise.all(sections.map(async (section) => {
            return await configs_1.default.db.lecture.findMany({
                where: {
                    section_id: section.id,
                },
            });
        }));
        // Bước 3: Tính tổng số commentLecture theo từng lecture_id
        const lectureIds = lectures.flat().map((lecture) => lecture.id);
        const totalRecord = await configs_1.default.db.commentLecture.count({
            where: {
                lecture_id: {
                    in: lectureIds,
                },
            },
        });
        const findSectionByCourseId = await configs_1.default.db.section.findMany({
            where: {
                course_id: Number(course_id),
            },
        });
        const commentsByLecture = await Promise.all(findSectionByCourseId.map(async (section) => {
            const lectures = await configs_1.default.db.lecture.findMany({
                where: {
                    section_id: section.id,
                },
            });
            return Promise.all(lectures.map(async (lecture) => {
                const offset = ((Number(pageIndex) ?? 1) - 1) * pageSize; // Tính offset
                const limit = pageSize; // Số lượng bản ghi cần lấy cho mỗi trang
                const comments = await configs_1.default.db.commentLecture.findMany({
                    where: {
                        lecture_id: lecture.id,
                    },
                    orderBy: {
                        updatedAt: "desc",
                    },
                    include: {
                        user: true,
                        replyCommentLectures: {
                            include: {
                                user: true,
                            },
                        },
                        liked_by: {
                            include: {
                                user: true,
                            },
                        },
                        disliked_by: {
                            include: {
                                user: true,
                            },
                        },
                    },
                });
                return comments.map((item) => {
                    const comment = {
                        comment_id: item.id,
                        content: item.content,
                        updatedAt: luxon_1.DateTime.fromISO(item.updatedAt.toISOString()),
                        user: {
                            id: item.user.id,
                            first_name: item.user.first_name,
                            last_name: item.user.last_name,
                            url_avatar: item.user.url_avatar || undefined,
                        },
                        likes_count: item.likes_count,
                        dislikes_count: item.dislikes_count,
                        replyCommentLectures: item.replyCommentLectures.map((r) => {
                            return {
                                reply_id: r.id,
                                content: r.content,
                                updatedAt: r.updatedAt,
                                user: {
                                    user_id: r.user.id,
                                    first_name: r.user.first_name,
                                    last_name: r.user.last_name,
                                    url_avatar: r.user.url_avatar,
                                },
                                likes_count: r.likes_count,
                                dislikes_count: r.dislikes_count,
                            };
                        }),
                        likes: item.liked_by.map((like) => {
                            return {
                                like_id: like.id,
                                user: {
                                    user_id: like.user.id,
                                    first_name: like.user.first_name,
                                    last_name: like.user.last_name,
                                    url_avatar: like.user.url_avatar,
                                },
                                comment_id: like.comment_id,
                                reply_id: like.reply_id,
                                updatedAt: like.updatedAt,
                            };
                        }),
                        dislikes: item.disliked_by.map((dislike) => {
                            return {
                                dislike_id: dislike.id,
                                user: {
                                    user_id: dislike.user.id,
                                    first_name: dislike.user.first_name,
                                    last_name: dislike.user.last_name,
                                    url_avatar: dislike.user.url_avatar,
                                },
                                comment_id: dislike.comment_id,
                                reply_id: dislike.reply_id,
                                updatedAt: dislike.updatedAt,
                            };
                        }),
                    };
                    return comment;
                });
            }));
        }));
        const flatCommentsByLecture = commentsByLecture.flat(2); // Flatten the nested arrays
        const pagedComments = flatCommentsByLecture.slice(skip, skip + pageSize);
        const totalPage = Math.ceil(totalRecord / pageSize);
        const commentsResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: pagedComments,
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, commentsResponseData);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        console.log("Error:", error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const commentService = {
    createComment,
    updateComment,
    deleteComment,
    getCommentsWithPagination,
    getCommentsWithPaginationByLectureId,
    getCommentsWithPaginationByCourseId,
};
exports.default = commentService;
