"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = require("../configs/db.config");
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const helper_1 = __importDefault(require("../helper"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getProfile = async (req) => {
    try {
        const user = await db_config_1.db.user.findFirst({
            where: {
                id: req.user_id,
                is_verify: true,
                is_deleted: false,
            },
            select: {
                first_name: true,
                last_name: true,
                url_avatar: true,
                description: true,
                email: true,
                is_admin: true,
            },
        });
        if (!user)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_USER_NOT_FOUND, false);
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_REQUEST, true, user);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateProfile = async (req) => {
    try {
        const { first_name, last_name, description } = req.body;
        const user = await db_config_1.db.user.findFirst({
            where: {
                id: req.user_id,
                is_verify: true,
            },
        });
        if (!user)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_USER_NOT_FOUND, false);
        const isUpdate = await db_config_1.db.user.update({
            where: {
                id: req.user_id,
            },
            data: {
                first_name: first_name,
                last_name: last_name,
                description: description,
            },
        });
        if (!isUpdate)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, false); //Missing Request body
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAuthorProfile = async (req) => {
    try {
        const { id } = req.params;
        const user_id = parseInt(id);
        const user = await db_config_1.db.user.findFirst({
            where: {
                id: user_id,
                is_verify: true,
                is_deleted: false,
            },
            select: {
                first_name: true,
                last_name: true,
                url_avatar: true,
                description: true,
                id: true,
                is_admin: true,
                courses: {
                    where: {
                        is_delete: false,
                        status: true,
                    },
                    include: {
                        course_categories: {
                            select: {
                                Category: {
                                    select: {
                                        id: true,
                                        title: true,
                                        url_image: true,
                                        description: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_USER_NOT_FOUND, false);
        const courses = [];
        user?.courses.map((course) => {
            const data = {
                course_id: course.id,
                thumbnail: course.thumbnail,
                title: course.title,
                slug: course.slug,
                number_of_enrolled: course.number_of_enrolled,
                number_of_rating: course.number_of_rating,
                categories: course.course_categories.map((cate) => cate.Category),
                author: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    user_id: user.id,
                },
                created_at: course.created_at,
                updated_at: course.updated_at,
                average_rating: course.average_rating,
                status: course.status,
            };
            courses.push(data);
        });
        const data = {
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                url_avatar: user.url_avatar,
                description: user.description,
                is_admin: user.is_admin,
            },
            courses: courses,
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_REQUEST, true, data);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const changeAvatar = async (req) => {
    try {
        const file = req.file;
        const isExistUser = await configs_1.default.db.user.findFirst({
            where: {
                id: req.user_id,
            },
        });
        if (!isExistUser)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_USER_NOT_FOUND, false);
        else {
            let oldAvatarPath = "";
            if (isExistUser.url_avatar)
                oldAvatarPath = helper_1.default.ConvertHelper.deConvertFilePath(isExistUser.url_avatar);
            if (file) {
                const fullpathConverted = helper_1.default.ConvertHelper.convertFilePath(file.path);
                const changeAvatarUser = await configs_1.default.db.user.update({
                    where: {
                        id: req.user_id,
                    },
                    data: {
                        url_avatar: fullpathConverted,
                    },
                });
                if (changeAvatarUser) {
                    await helper_1.default.FileHelper.destroyedFileIfFailed(oldAvatarPath);
                    return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CHANGE_AVATAR, true);
                }
                else {
                    await helper_1.default.FileHelper.destroyedFileIfFailed(file.path);
                    return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                }
            }
            else {
                return new response_1.ResponseError(500, constants_1.default.error.ERROR_BAD_REQUEST, false);
            }
        }
    }
    catch (error) {
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllUsers = async (req) => {
    try {
        const { page_index: pageIndex, search_item: searchItem, role } = req.query;
        const { user_id: userId } = req;
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: Number(userId),
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const parsePageIndex = Number(pageIndex);
        const parsedPageIndex = isNaN(parsePageIndex) ? 1 : parsePageIndex;
        const parsedSearchItem = searchItem;
        const skip = (parsedPageIndex - 1) * 10;
        const take = 10;
        let searchUserData;
        if (role === "All") {
            searchUserData = {
                OR: [
                    {
                        first_name: {
                            contains: parsedSearchItem,
                        },
                    },
                    {
                        last_name: {
                            contains: parsedSearchItem,
                        },
                    },
                    {
                        email: {
                            contains: parsedSearchItem,
                        },
                    },
                ],
            };
        }
        else {
            searchUserData = {
                OR: [
                    {
                        first_name: {
                            contains: parsedSearchItem,
                        },
                    },
                    {
                        last_name: {
                            contains: parsedSearchItem,
                        },
                    },
                    {
                        email: {
                            contains: parsedSearchItem,
                        },
                    },
                ],
                is_admin: role === "Admin" ? true : false,
            };
        }
        const users = await configs_1.default.db.user.findMany({
            skip,
            take,
            orderBy: {
                created_at: "desc",
            },
            where: searchUserData,
        });
        const totalRecord = await db_config_1.db.user.count({
            where: searchUserData,
        });
        const totalPage = Math.ceil(totalRecord / take);
        const usersData = users.map((user) => {
            return {
                user_id: user.id,
                description: user.description,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                url_avatar: user.url_avatar,
                is_admin: user.is_admin,
                is_delete: user.is_deleted,
                created_at: user.created_at.toString(),
            };
        });
        const responseData = {
            total_page: totalPage,
            total_record: totalRecord,
            data: usersData,
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, responseData);
    }
    catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createNewUser = async (req) => {
    try {
        const { first_name, last_name, email, password, is_admin } = req.body;
        const user_id = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const hashedPassword = await bcryptjs_1.default.hash(password, configs_1.default.general.HASH_SALT);
        const createUser = await configs_1.default.db.user.create({
            data: {
                first_name,
                last_name,
                email,
                password: hashedPassword,
                is_admin,
                is_verify: true,
            },
        });
        if (createUser)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DATA, true);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const editUser = async (req) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, is_admin } = req.body;
        const admin_id = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: admin_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const createUser = await configs_1.default.db.user.update({
            data: {
                first_name,
                last_name,
                email,
                is_admin,
            },
            where: {
                id: Number(id),
            },
        });
        if (createUser)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteUser = async (req) => {
    try {
        const { id } = req.params;
        const admin_id = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: admin_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const createUser = await configs_1.default.db.user.update({
            data: {
                is_deleted: true,
            },
            where: {
                id: Number(id),
            },
        });
        if (createUser)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_DATA, true);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const activeUser = async (req) => {
    try {
        const { id } = req.params;
        const admin_id = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: admin_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const createUser = await configs_1.default.db.user.update({
            data: {
                is_deleted: false,
            },
            where: {
                id: Number(id),
            },
        });
        if (createUser)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true);
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const UserServices = {
    changeAvatar,
    getProfile,
    updateProfile,
    getAuthorProfile,
    getAllUsers,
    createNewUser,
    deleteUser,
    editUser,
    activeUser,
};
exports.default = UserServices;
