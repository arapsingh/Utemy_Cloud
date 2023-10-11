import { ResponseSuccess, ResponseError, ResponseBase } from "../common";
import configs from "../configs";
import { IRequestWithId } from "../types/request";
import helper from "../helper";
import constants from "../constants";

const updateCategory = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const file = req.file;
        const { category_id } = req.body;
        if (file) {
            const isCategoryExist = await configs.db.category.findFirst({
                where: {
                    id: category_id,
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
                    return new ResponseError(401, constants.error.ERROR_UNAUTHORZIED, false);
                } else {
                    const oldCategoryImagePath = isCategoryExist.url_image;
                    const changeThumbnailCategory = await configs.db.category.update({
                        where: {
                            id: category_id,
                        },
                        data: {
                            url_image: file.path,
                        },
                    });
                    if (changeThumbnailCategory) {
                        await helper.FileHelper.destroyedFileIfFailed(oldCategoryImagePath as string);
                        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_CATEGORY, true);
                    } else {
                        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
            }
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const CategoryServices = {
    updateCategory,
};
export default CategoryServices;
