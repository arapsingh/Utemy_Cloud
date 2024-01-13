"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const configs_1 = __importDefault(require("../configs"));
const helper_1 = __importDefault(require("../helper"));
const constants_1 = __importDefault(require("../constants"));
const updateCategory = async (req) => {
    try {
        const file = req.file;
        const { category_id, title, description } = req.body;
        const isCategoryExist = await configs_1.default.db.category.findFirst({
            where: {
                id: parseInt(category_id),
            },
        });
        if (!isCategoryExist) {
            return new common_1.ResponseError(404, constants_1.default.error.ERROR_CATEGORY_NOT_FOUND, false);
        }
        else {
            const isCategoryUnique = await configs_1.default.db.category.findFirst({
                where: {
                    title,
                    NOT: {
                        id: parseInt(category_id),
                    },
                },
            });
            if (isCategoryUnique)
                return new common_1.ResponseError(400, constants_1.default.error.ERROR_CATEGORY_ALREADY_EXISTS, false);
            const isAdmin = await configs_1.default.db.user.findFirst({
                where: {
                    id: req.user_id,
                    is_admin: true,
                },
            });
            if (!isAdmin) {
                return new common_1.ResponseError(401, constants_1.default.error.ERROR_UNAUTHORIZED, false);
            }
            else {
                if (file) {
                    const oldCategoryImagePath = helper_1.default.ConvertHelper.deConvertFilePath(isCategoryExist.url_image);
                    const fullpathConverted = helper_1.default.ConvertHelper.convertFilePath(file.path);
                    const changeThumbnailCategory = await configs_1.default.db.category.update({
                        where: {
                            id: parseInt(category_id),
                        },
                        data: {
                            url_image: fullpathConverted,
                            title,
                            description,
                        },
                    });
                    if (changeThumbnailCategory) {
                        await helper_1.default.FileHelper.destroyedFileIfFailed(oldCategoryImagePath);
                        return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_CATEGORY, true);
                    }
                    else {
                        await helper_1.default.FileHelper.destroyedFileIfFailed(file.path);
                        return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
                else {
                    const updateCategory = await configs_1.default.db.category.update({
                        where: {
                            id: parseInt(category_id),
                        },
                        data: {
                            title,
                            description,
                        },
                    });
                    if (updateCategory) {
                        return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_CATEGORY, true);
                    }
                    else {
                        return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
            }
        }
    }
    catch (error) {
        return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createCategory = async (req) => {
    try {
        const file = req.file;
        const { title, description } = req.body;
        if (file) {
            const isAdmin = await configs_1.default.db.user.findFirst({
                where: {
                    id: req.user_id,
                    is_admin: true,
                },
            });
            if (!isAdmin) {
                return new common_1.ResponseError(401, constants_1.default.error.ERROR_UNAUTHORIZED, false);
            }
            else {
                const fullpathConverted = helper_1.default.ConvertHelper.convertFilePath(file.path);
                const createCategory = await configs_1.default.db.category.create({
                    data: {
                        title,
                        description,
                        url_image: fullpathConverted,
                    },
                });
                if (createCategory) {
                    return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_CATEGORY, true);
                }
                else {
                    await helper_1.default.FileHelper.destroyedFileIfFailed(file.path);
                    return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        }
        else {
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
    }
    catch (error) {
        return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteCategory = async (req) => {
    try {
        const { category_id } = req.params;
        const cateIdConvert = parseInt(category_id);
        const isCategoryExist = await configs_1.default.db.category.findFirst({
            where: {
                id: cateIdConvert,
            },
        });
        if (!isCategoryExist) {
            return new common_1.ResponseError(404, constants_1.default.error.ERROR_CATEGORY_NOT_FOUND, false);
        }
        else {
            const isAdmin = await configs_1.default.db.user.findFirst({
                where: {
                    id: req.user_id,
                    is_admin: true,
                },
            });
            if (!isAdmin) {
                return new common_1.ResponseError(401, constants_1.default.error.ERROR_UNAUTHORIZED, false);
            }
            else {
                const oldCategoryImagePath = helper_1.default.ConvertHelper.deConvertFilePath(isCategoryExist.url_image);
                const deleteCategoty = await configs_1.default.db.category.delete({
                    where: {
                        id: cateIdConvert,
                    },
                });
                if (deleteCategoty) {
                    await helper_1.default.FileHelper.destroyedFileIfFailed(oldCategoryImagePath);
                    return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_CATEGORY, true);
                }
                else {
                    return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        }
    }
    catch (error) {
        return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCategoriesWithPagination = async (req) => {
    try {
        const { search_item: searchItem, page_index: pageIndex } = req.query;
        const pageSize = configs_1.default.general.PAGE_SIZE;
        const getListCategories = await configs_1.default.db.category.findMany({
            skip: pageSize * (Number(pageIndex) - 1),
            take: pageSize,
            where: {
                title: {
                    contains: searchItem?.toString(),
                },
            },
            orderBy: {
                title: "asc",
            },
        });
        if (!getListCategories)
            return new common_1.ResponseError(404, constants_1.default.error.ERROR_CATEGORY_NOT_FOUND, false);
        const totalRecord = await configs_1.default.db.category.count({});
        const totalPage = Math.ceil(totalRecord / pageSize);
        const categories = [];
        getListCategories.map((item) => {
            const category = {
                category_id: item.id,
                description: item.description,
                title: item.title,
                url_image: item.url_image,
            };
            return categories.push(category);
        });
        const categoriesResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: categories,
        };
        return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, categoriesResponseData);
    }
    catch (error) {
        return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCategories = async (req) => {
    try {
        const getListCategories = await configs_1.default.db.category.findMany({
            orderBy: {
                title: "asc",
            },
        });
        if (!getListCategories)
            return new common_1.ResponseError(404, constants_1.default.error.ERROR_CATEGORY_NOT_FOUND, false);
        const categories = [];
        getListCategories.map((item) => {
            const category = {
                category_id: item.id,
                description: item.description,
                title: item.title,
                url_image: item.url_image,
            };
            return categories.push(category);
        });
        return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, categories);
    }
    catch (error) {
        return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const get5Categories = async (req) => {
    try {
        const getListCategories = await configs_1.default.db
            .$queryRaw `select category.id, title, description, url_image, count(course_id) as course_count from category left join
 courses_categories on category.id = courses_categories.category_id group by category.id order by course_count desc limit 8;`;
        if (!getListCategories)
            return new common_1.ResponseError(404, constants_1.default.error.ERROR_CATEGORY_NOT_FOUND, false);
        const categories = [];
        getListCategories.map((item) => {
            const category = {
                category_id: item.id,
                description: item.description,
                title: item.title,
                url_image: item.url_image,
            };
            return categories.push(category);
        });
        return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, categories);
    }
    catch (error) {
        return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCategory = async (req) => {
    try {
        const { category_id } = req.params;
        const getCategory = await configs_1.default.db.category.findFirst({
            where: {
                id: Number(category_id),
            },
        });
        if (!getCategory)
            return new common_1.ResponseError(404, constants_1.default.error.ERROR_CATEGORY_NOT_FOUND, false);
        const category = {
            category_id: getCategory.id,
            description: getCategory.description,
            title: getCategory.title,
            url_image: getCategory.url_image,
        };
        return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, category);
    }
    catch (error) {
        return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const CategoryServices = {
    updateCategory,
    deleteCategory,
    createCategory,
    getCategory,
    getCategoriesWithPagination,
    get5Categories,
    getCategories,
};
exports.default = CategoryServices;
