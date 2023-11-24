import { ResponseSuccess, ResponseError, ResponseBase } from "../common";
import configs from "../configs";
import { IRequestWithId } from "../types/request";
import { Request } from "express";
import helper from "../helper";
import constants from "../constants";
import { CategoryResponse } from "../types/category.type";

const updateCategory = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const file = req.file;
        const { category_id, title, description } = req.body;
        if (file) {
            const isCategoryExist = await configs.db.category.findFirst({
                where: {
                    id: parseInt(category_id),
                },
            });
            if (!isCategoryExist) {
                return new ResponseError(404, constants.error.ERROR_CATEGORY_NOT_FOUND, false);
            } else {
                const isCategoryUnique = await configs.db.category.findFirst({
                    where: {
                        title,
                    },
                });
                if (isCategoryUnique)
                    return new ResponseError(400, constants.error.ERROR_CATEGORY_ALREADY_EXISTS, false);
                const isAdmin = await configs.db.user.findFirst({
                    where: {
                        id: req.user_id,
                        is_admin: true,
                    },
                });
                if (!isAdmin) {
                    return new ResponseError(401, constants.error.ERROR_UNAUTHORIZED, false);
                } else {
                    const oldCategoryImagePath = helper.ConvertHelper.deConvertFilePath(isCategoryExist.url_image);
                    const fullpathConverted = helper.ConvertHelper.convertFilePath(file.path);
                    const changeThumbnailCategory = await configs.db.category.update({
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
                        await helper.FileHelper.destroyedFileIfFailed(oldCategoryImagePath as string);
                        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_CATEGORY, true);
                    } else {
                        await helper.FileHelper.destroyedFileIfFailed(file.path as string);
                        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
            }
        } else {
            return new ResponseError(500, constants.error.ERROR_BAD_REQUEST, false);
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createCategory = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const file = req.file;
        const { title, description } = req.body;
        if (file) {
            const isAdmin = await configs.db.user.findFirst({
                where: {
                    id: req.user_id,
                    is_admin: true,
                },
            });
            if (!isAdmin) {
                return new ResponseError(401, constants.error.ERROR_UNAUTHORIZED, false);
            } else {
                const fullpathConverted = helper.ConvertHelper.convertFilePath(file.path);
                const createCategory = await configs.db.category.create({
                    data: {
                        title,
                        description,
                        url_image: fullpathConverted,
                    },
                });

                if (createCategory) {
                    return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_CATEGORY, true);
                } else {
                    await helper.FileHelper.destroyedFileIfFailed(file.path as string);
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteCategory = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { category_id } = req.body;
        const cateIdConvert = parseInt(category_id);
        const isCategoryExist = await configs.db.category.findFirst({
            where: {
                id: cateIdConvert,
            },
        });
        if (!isCategoryExist) {
            return new ResponseError(404, constants.error.ERROR_CATEGORY_NOT_FOUND, false);
        } else {
            const isAdmin = await configs.db.user.findFirst({
                where: {
                    id: req.user_id,
                    is_admin: true,
                },
            });
            if (!isAdmin) {
                return new ResponseError(401, constants.error.ERROR_UNAUTHORIZED, false);
            } else {
                const oldCategoryImagePath = helper.ConvertHelper.deConvertFilePath(isCategoryExist.url_image);
                const deleteCategoty = await configs.db.category.delete({
                    where: {
                        id: cateIdConvert,
                    },
                });
                if (deleteCategoty) {
                    await helper.FileHelper.destroyedFileIfFailed(oldCategoryImagePath as string);
                    return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_CATEGORY, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCategoriesWithPagination = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { page_index: pageIndex } = req.query;

        const pageSize = configs.general.PAGE_SIZE;
        const getListCategories = await configs.db.category.findMany({
            skip: pageSize * (Number(pageIndex) - 1),
            take: pageSize,
            orderBy: {
                title: "asc",
            },
        });
        if (!getListCategories) return new ResponseError(404, constants.error.ERROR_CATEGORY_NOT_FOUND, false);
        const totalRecord = await configs.db.category.count({});
        const totalPage = Math.ceil(totalRecord / pageSize);
        const categories: CategoryResponse[] = [];
        getListCategories.map((item) => {
            const category: CategoryResponse = {
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

        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, categoriesResponseData);
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCategories = async (req: Request): Promise<ResponseBase> => {
    try {
        const getListCategories = await configs.db.category.findMany({
            orderBy: {
                title: "asc",
            },
        });
        if (!getListCategories) return new ResponseError(404, constants.error.ERROR_CATEGORY_NOT_FOUND, false);
        const categories: CategoryResponse[] = [];
        getListCategories.map((item) => {
            const category: CategoryResponse = {
                category_id: item.id,
                description: item.description,
                title: item.title,
                url_image: item.url_image,
            };
            return categories.push(category);
        });

        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, categories);
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const get5Categories = async (req: Request): Promise<ResponseBase> => {
    try {
        const getListCategories = await configs.db.category.findMany({
            orderBy: {
                title: "asc",
            },
        });
        if (!getListCategories) return new ResponseError(404, constants.error.ERROR_CATEGORY_NOT_FOUND, false);

        const categories: CategoryResponse[] = [];
        getListCategories.map((item) => {
            const category: CategoryResponse = {
                category_id: item.id,
                description: item.description,
                title: item.title,
                url_image: item.url_image,
            };
            return categories.push(category);
        });

        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, categories);
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCategory = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { category_id } = req.body;

        const getCategory = await configs.db.category.findFirst({
            where: {
                id: category_id,
            },
        });
        if (!getCategory) return new ResponseError(404, constants.error.ERROR_CATEGORY_NOT_FOUND, false);
        const category: CategoryResponse = {
            category_id: getCategory.id,
            description: getCategory.description,
            title: getCategory.title,
            url_image: getCategory.url_image,
        };

        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, category);
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
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
export default CategoryServices;
