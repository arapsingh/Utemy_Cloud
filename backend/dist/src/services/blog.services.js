"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const luxon_1 = require("luxon");
const helper_1 = __importDefault(require("../helper"));
const createBlog = async (req) => {
    try {
        const file = req.file;
        const userId = req.user_id;
        const { title, content, categories } = req.body;
        if (file) {
            const isAdmin = await configs_1.default.db.user.findFirst({
                where: {
                    id: userId,
                    is_admin: true,
                },
            });
            if (!isAdmin) {
                return new response_1.ResponseError(401, constants_1.default.error.ERROR_UNAUTHORIZED, false);
            }
            else {
                const fullpathConverted = helper_1.default.ConvertHelper.convertFilePath(file.path);
                const listCategoryId = categories.split(",").map((item) => ({
                    category_id: Number(item),
                }));
                const createBlog = await configs_1.default.db.blog.create({
                    data: {
                        author_id: userId,
                        title: title,
                        content: content,
                        url_image: fullpathConverted,
                        created_at: new Date(),
                        updated_at: new Date(),
                        blog_categories: {
                            create: listCategoryId,
                        },
                    },
                });
                if (createBlog) {
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DATA, true);
                }
                else {
                    await helper_1.default.FileHelper.destroyedFileIfFailed(file.path);
                    return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        }
        else {
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
    }
    catch (error) {
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateBlog = async (req) => {
    try {
        const file = req.file;
        const { blog_id, title, content, categories, is_published } = req.body;
        const isPublishedBoolean = is_published === "true";
        const userId = req.user_id;
        const isBlogExist = await configs_1.default.db.blog.findFirst({
            where: {
                id: parseInt(blog_id),
            },
        });
        if (!isBlogExist) {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_BLOG_NOT_FOUND, false);
        }
        else {
            const isBlogUnique = await configs_1.default.db.blog.findFirst({
                where: {
                    title,
                    NOT: {
                        id: parseInt(blog_id),
                    },
                },
            });
            if (isBlogUnique)
                return new response_1.ResponseError(400, constants_1.default.error.ERROR_BLOG_ALREADY_EXISTS, false);
            const isAdmin = await configs_1.default.db.user.findFirst({
                where: {
                    id: userId,
                    is_admin: true,
                },
            });
            if (!isAdmin) {
                return new response_1.ResponseError(401, constants_1.default.error.ERROR_UNAUTHORIZED, false);
            }
            else {
                if (file) {
                    const oldBlogImagePath = helper_1.default.ConvertHelper.deConvertFilePath(isBlogExist.url_image);
                    const fullpathConverted = helper_1.default.ConvertHelper.convertFilePath(file.path);
                    const changeThumbnailBlog = await configs_1.default.db.blog.update({
                        where: {
                            id: parseInt(blog_id),
                        },
                        data: {
                            author_id: userId,
                            url_image: fullpathConverted,
                            title: title,
                            content: content,
                            updated_at: new Date(),
                            is_published: isPublishedBoolean,
                        },
                    });
                    const deleteOldCategory = await configs_1.default.db.blogCategory.deleteMany({
                        where: { blog_id: Number(blog_id) },
                    });
                    const isUpdateCategory = await configs_1.default.db.blogCategory.createMany({
                        data: categories.split(",").map((category) => ({
                            blog_id: Number(blog_id),
                            category_id: Number(category),
                        })),
                    });
                    if (changeThumbnailBlog && deleteOldCategory && isUpdateCategory) {
                        await helper_1.default.FileHelper.destroyedFileIfFailed(oldBlogImagePath);
                        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true);
                    }
                    else {
                        await helper_1.default.FileHelper.destroyedFileIfFailed(file.path);
                        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
                else {
                    const updateBlog = await configs_1.default.db.blog.update({
                        where: {
                            id: parseInt(blog_id),
                        },
                        data: {
                            title: title,
                            content: content,
                            author_id: userId,
                            updated_at: new Date(),
                            is_published: isPublishedBoolean,
                        },
                    });
                    const deleteOldCategory = await configs_1.default.db.blogCategory.deleteMany({
                        where: { blog_id: Number(blog_id) },
                    });
                    const isUpdateCategory = await configs_1.default.db.blogCategory.createMany({
                        data: categories.split(",").map((category) => ({
                            blog_id: Number(blog_id),
                            category_id: Number(category),
                        })),
                    });
                    if (updateBlog && deleteOldCategory && isUpdateCategory) {
                        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true);
                    }
                    else {
                        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
            }
        }
    }
    catch (error) {
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteBlog = async (req) => {
    try {
        const { blog_id } = req.params;
        const blogIdConvert = parseInt(blog_id);
        const isBlogExist = await configs_1.default.db.blog.findFirst({
            where: {
                id: blogIdConvert,
            },
        });
        if (!isBlogExist) {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_BLOG_NOT_FOUND, false);
        }
        else {
            const isAdmin = await configs_1.default.db.user.findFirst({
                where: {
                    id: req.user_id,
                    is_admin: true,
                },
            });
            if (!isAdmin) {
                return new response_1.ResponseError(401, constants_1.default.error.ERROR_UNAUTHORIZED, false);
            }
            else {
                const oldBlogImagePath = helper_1.default.ConvertHelper.deConvertFilePath(isBlogExist.url_image);
                const deleteBlog = await configs_1.default.db.blog.delete({
                    where: {
                        id: blogIdConvert,
                    },
                });
                if (deleteBlog) {
                    await helper_1.default.FileHelper.destroyedFileIfFailed(oldBlogImagePath);
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_DATA, true);
                }
                else {
                    return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        }
    }
    catch (error) {
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getBlogsWithPagination = async (req) => {
    try {
        const { search_item: searchItem, page_index: pageIndex } = req.query;
        const category = req.query.category
            ? Array.isArray(req.query.category)
                ? req.query.category
                : [req.query.category]
            : undefined;
        const categoriesConvert = category?.map((item) => Number(item));
        const pageSize = configs_1.default.general.PAGE_SIZE;
        const categoriesFilter = categoriesConvert?.map((item) => {
            return {
                blog_categories: {
                    some: {
                        category: {
                            id: item,
                        },
                    },
                },
            };
        });
        const whereCondition = {
            title: {
                contains: searchItem?.toString(),
            },
        };
        // Nếu có categoriesFilter, thêm vào điều kiện `AND`
        if (categoriesFilter) {
            whereCondition.AND = categoriesFilter;
        }
        const getListBlogs = await configs_1.default.db.blog.findMany({
            skip: pageSize * (Number(pageIndex) - 1),
            take: pageSize,
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
            },
            where: whereCondition,
            orderBy: {
                updated_at: "desc",
            },
        });
        if (!getListBlogs)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_BLOG_NOT_FOUND, false);
        const totalRecord = await configs_1.default.db.blog.count({
            where: whereCondition,
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const blogs = [];
        getListBlogs.map((item) => {
            const blog = {
                blog_id: item.id,
                title: item.title,
                content: item.content,
                url_image: item.url_image,
                created_at: luxon_1.DateTime.fromISO(item.created_at.toISOString()),
                updated_at: luxon_1.DateTime.fromISO(item.updated_at.toISOString()),
                is_published: item.is_published,
                author: {
                    user_id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                },
                categories: item.blog_categories.map((cc) => {
                    return {
                        id: cc.category?.id,
                        title: cc.category?.title,
                        url_image: cc.category?.url_image,
                    };
                }),
            };
            return blogs.push(blog);
        });
        const blogsResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: blogs,
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, blogsResponseData);
    }
    catch (error) {
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getBlogs = async (req) => {
    try {
        const getListBlogs = await configs_1.default.db.blog.findMany({
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: {
                title: "asc",
            },
        });
        if (!getListBlogs)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_BLOG_NOT_FOUND, false);
        const blogs = [];
        getListBlogs.map((item) => {
            const blog = {
                blog_id: item.id,
                title: item.title,
                content: item.content,
                url_image: item.url_image,
                created_at: luxon_1.DateTime.fromISO(item.created_at.toISOString()),
                updated_at: luxon_1.DateTime.fromISO(item.updated_at.toISOString()),
                is_published: item.is_published,
                author: {
                    user_id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                },
                categories: item.blog_categories.map((cc) => {
                    return {
                        id: cc.category?.id,
                        title: cc.category?.title,
                        url_image: cc.category?.url_image,
                    };
                }),
            };
            return blogs.push(blog);
        });
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, blogs);
    }
    catch (error) {
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getBlog = async (req) => {
    try {
        const { blog_id } = req.params;
        const getBlog = await configs_1.default.db.blog.findFirst({
            where: {
                id: Number(blog_id),
            },
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        if (!getBlog)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_BLOG_NOT_FOUND, false);
        const blog = {
            blog_id: getBlog.id,
            title: getBlog.title,
            content: getBlog.content,
            url_image: getBlog.url_image,
            created_at: luxon_1.DateTime.fromISO(getBlog.created_at.toISOString()),
            updated_at: luxon_1.DateTime.fromISO(getBlog.updated_at.toISOString()),
            is_published: getBlog.is_published,
            author: {
                user_id: getBlog.user.id,
                first_name: getBlog.user.first_name,
                last_name: getBlog.user.last_name,
            },
            categories: getBlog.blog_categories.map((cc) => {
                return {
                    id: cc.category?.id,
                    title: cc.category?.title,
                    url_image: cc.category?.url_image,
                };
            }),
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, blog);
    }
    catch (error) {
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const blogService = {
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogsWithPagination,
    getBlogs,
    getBlog,
};
exports.default = blogService;
