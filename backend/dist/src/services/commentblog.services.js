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
const createCommentBlog = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { content, blog_id, parent_id } = req.body;
        const isBlogExist = await configs_1.default.db.blog.findFirst({ where: { id: blog_id } });
        if (!isBlogExist)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_BLOG_NOT_FOUND, false);
        if (parent_id) {
            const isCommentExist = await configs_1.default.db.commentBlog.findFirst({
                where: { id: parent_id, blog_id: blog_id },
            });
            if (!isCommentExist)
                return new response_1.ResponseError(400, constants_1.default.error.ERROR_COMMENT_BLOG_NOT_FOUND, false);
        }
        const createdCommentBlog = await configs_1.default.db.commentBlog.create({
            data: {
                content,
                user_id,
                blog_id,
                parent_id,
            },
            // include: {
            //     user: true,
            //     replyCommentLectures: true,
            // },
        });
        if (createdCommentBlog) {
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_COMMENT_BLOG, true, createdCommentBlog);
        }
        else {
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateCommentBlog = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { commentblog_id } = req.params;
        const { content } = req.body;
        const isCommentBlogExist = await configs_1.default.db.commentBlog.findFirst({
            where: {
                id: Number(commentblog_id),
                user_id: user_id,
            },
        });
        if (isCommentBlogExist) {
            const updatedCommentBlog = await configs_1.default.db.commentBlog.update({
                where: {
                    id: Number(commentblog_id),
                },
                data: {
                    content: content,
                    updated_at: new Date(),
                },
            });
            if (updatedCommentBlog)
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_COMMENT_BLOG, true, updatedCommentBlog);
            else
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
        else
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_COMMENT_BLOG_NOT_FOUND, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteCommentBlog = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { commentblog_id } = req.params;
        const isCommentBlogExist = await configs_1.default.db.commentBlog.findFirst({
            where: {
                id: Number(commentblog_id),
                user_id: user_id,
            },
        });
        if (isCommentBlogExist) {
            const deletedCommentBlog = await configs_1.default.db.commentBlog.delete({
                where: {
                    id: Number(commentblog_id),
                },
            });
            if (deletedCommentBlog)
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_COMMENT_BLOG, true);
            else
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, deletedCommentBlog);
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
const getCommentBlogsWithPagination = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { search_item: searchItem, page_index: pageIndex } = req.query;
        const parsedSearchItem = searchItem;
        const pageSize = configs_1.default.general.PAGE_SIZE;
        const skip = ((Number(pageIndex) ?? 1) - 1) * pageSize;
        const getAllCommentBlog = await configs_1.default.db.commentBlog.findMany({
            skip,
            take: pageSize,
            where: {
                content: {
                    contains: parsedSearchItem,
                },
                parent_id: null,
            },
            orderBy: {
                updated_at: "desc",
            },
            include: {
                user: true,
                replies: {
                    include: {
                        user: true,
                        reactions: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
                reactions: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!getAllCommentBlog)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const totalRecord = await configs_1.default.db.commentBlog.count({
            where: {
                parent_id: null,
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const comments = [];
        getAllCommentBlog.map((item) => {
            const comment = {
                commentblog_id: item.id,
                content: item.content,
                updated_at: luxon_1.DateTime.fromISO(item.updated_at.toISOString()),
                user: {
                    id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                    url_avatar: item.user.url_avatar || undefined,
                },
                blog_id: item.blog_id,
                replies: item.replies.map((r) => {
                    return {
                        replyblog_id: r.id,
                        content: r.content,
                        updated_at: r.updated_at,
                        user: {
                            user_id: r.user.id,
                            first_name: r.user.first_name,
                            last_name: r.user.last_name,
                            url_avatar: r.user.url_avatar,
                        },
                        blog_id: r.blog_id,
                        reactions: r.reactions.map((reaction) => {
                            return {
                                reaction_id: reaction.id,
                                user: {
                                    user_id: reaction.user.id,
                                    first_name: reaction.user.first_name,
                                    last_name: reaction.user.last_name,
                                    url_avatar: reaction.user.url_avatar,
                                },
                                commentblog_id: reaction.commentblog_id,
                                type: reaction.type,
                                updated_at: reaction.updated_at,
                            };
                        }),
                    };
                }),
                reactions: item.reactions.map((reaction) => {
                    return {
                        reaction_id: reaction.id,
                        user: {
                            user_id: reaction.user.id,
                            first_name: reaction.user.first_name,
                            last_name: reaction.user.last_name,
                            url_avatar: reaction.user.url_avatar,
                        },
                        commentblog_id: reaction.commentblog_id,
                        type: reaction.type,
                        updated_at: reaction.updated_at,
                    };
                }),
            };
            return comments.push(comment);
        });
        const commentBlogsResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: comments,
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, commentBlogsResponseData);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        console.log("Error:", error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCommentBlogsWithPaginationByBlogId = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const { blog_id } = req.params;
        const { page_index: pageIndex } = req.query;
        // const parsedSearchItem = searchItem as string;
        const pageSize = configs_1.default.general.PAGE_SIZE;
        const skip = ((Number(pageIndex) ?? 1) - 1) * pageSize;
        const getAllCommentByBlogId = await configs_1.default.db.commentBlog.findMany({
            skip,
            take: pageSize,
            where: {
                blog_id: Number(blog_id),
                parent_id: null,
            },
            orderBy: {
                updated_at: "desc",
            },
            include: {
                user: true,
                replies: {
                    include: {
                        user: true,
                        reactions: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
                reactions: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!getAllCommentByBlogId)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const totalRecord = await configs_1.default.db.commentBlog.count({
            where: {
                parent_id: null,
                blog_id: Number(blog_id),
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const comments = [];
        getAllCommentByBlogId.map((item) => {
            const comment = {
                commentblog_id: item.id,
                content: item.content,
                updated_at: luxon_1.DateTime.fromISO(item.updated_at.toISOString()),
                user: {
                    id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                    url_avatar: item.user.url_avatar || undefined,
                },
                blog_id: item.blog_id,
                replies: item.replies.map((r) => {
                    return {
                        replyblog_id: r.id,
                        content: r.content,
                        updated_at: r.updated_at,
                        user: {
                            user_id: r.user.id,
                            first_name: r.user.first_name,
                            last_name: r.user.last_name,
                            url_avatar: r.user.url_avatar,
                        },
                        blog_id: r.blog_id,
                        reactions: r.reactions.map((reaction) => {
                            return {
                                reaction_id: reaction.id,
                                user: {
                                    user_id: reaction.user.id,
                                    first_name: reaction.user.first_name,
                                    last_name: reaction.user.last_name,
                                    url_avatar: reaction.user.url_avatar,
                                },
                                commentblog_id: reaction.commentblog_id,
                                type: reaction.type,
                                updated_at: reaction.updated_at,
                            };
                        }),
                    };
                }),
                reactions: item.reactions.map((reaction) => {
                    return {
                        reaction_id: reaction.id,
                        user: {
                            user_id: reaction.user.id,
                            first_name: reaction.user.first_name,
                            last_name: reaction.user.last_name,
                            url_avatar: reaction.user.url_avatar,
                        },
                        commentblog_id: reaction.commentblog_id,
                        type: reaction.type,
                        updated_at: reaction.updated_at,
                    };
                }),
            };
            return comments.push(comment);
        });
        const commentBlogsResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: comments,
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, commentBlogsResponseData);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        console.log("Error:", error);
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const commentBlogService = {
    createCommentBlog,
    updateCommentBlog,
    deleteCommentBlog,
    getCommentBlogsWithPagination,
    getCommentBlogsWithPaginationByBlogId,
};
exports.default = commentBlogService;
