import { ResponseSuccess, ResponseError, ResponseBase } from "../common";
import configs from "../configs";
import { IRequestWithId } from "../types/request";
import helper from "../helper";
import constants from "../constants";

const changeThumbnail = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const file = req.file;
        const { course_id } = req.body;
        if (file) {
            const isCourseExist = await configs.db.course.findFirst({
                where: {
                    id: course_id,
                },
            });
            if (!isCourseExist) {
                return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
            } else {
                if (isCourseExist.author_id !== req.user_id) {
                    return new ResponseError(401, constants.error.ERROR_UNAUTHORZIED, false);
                } else {
                    const oldThumbnailPath = isCourseExist.thumbnail;
                    const changeThumbnail = await configs.db.course.update({
                        where: {
                            id: course_id,
                        },
                        data: {
                            thumbnail: file.path,
                        },
                    });
                    if (changeThumbnail) {
                        await helper.FileHelper.destroyedFileIfFailed(oldThumbnailPath as string);
                        return new ResponseSuccess(200, constants.success.SUCCESS_CHANGE_THUMBNAIL, true);
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

const CourseServices = {
    changeThumbnail,
};
export default CourseServices;
