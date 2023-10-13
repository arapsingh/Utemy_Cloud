import { ResponseSuccess, ResponseError, ResponseBase, resolutions } from "../common";
import configs from "../configs";
import { IRequestWithId } from "../types/request";
import constants from "../constants";
import helper from "../helper";

const changeAvatar = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const file = req.file;
        const isExistUser = await configs.db.user.findFirst({
            where: {
                id: req.user_id,
            },
        });
        if (!isExistUser) return new ResponseError(404, constants.error.ERROR_USER_NOT_FOUND, false);
        else {
            const oldAvatarPath = isExistUser.url_avatar;
            if (file) {
                const changeAvatarUser = await configs.db.user.update({
                    where: {
                        id: req.user_id,
                    },
                    data: {
                        url_avatar: file.path,
                    },
                });
                if (changeAvatarUser) {
                    await helper.FileHelper.destroyedFileIfFailed(oldAvatarPath as string);
                    return new ResponseSuccess(200, constants.success.SUCCESS_CHANGE_AVATAR, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            } else {
                return new ResponseError(500, constants.error.ERROR_BAD_REQUEST, false);
            }
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const UserServices = {
    changeAvatar,
};
export default UserServices;
