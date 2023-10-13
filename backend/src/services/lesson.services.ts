import { ResponseSuccess, ResponseError, ResponseBase, resolutions } from "../common";
import configs from "../configs";
import { IRequestWithId } from "../types/request";
import constants from "../constants";
import { v4 as uuidv4 } from "uuid";
import helper from "../helper";
const createLesson = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const videoFile = req.file;
        const user_id = req.user_id;
        const section_id = parseInt(req.body.section_id);
        const title = req.body.title;
        const uuid = uuidv4();
        const createFile = await helper.FileHelper.createFileM3U8AndTS(
            videoFile as Express.Multer.File,
            resolutions,
            configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS,
            `${user_id}_${uuid}`,
        );
        const createLesson = await configs.db.lesson.create({
            data: {
                title,
                section_id,
                url_video: createFile,
            },
        });
        if (!createLesson) {
            await helper.FileHelper.destroyedVideoIfFailed(createFile); //không tới đc đây
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        } else {
            return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_LESSON, true);
        }
    } catch (error) {
        return new ResponseError(500, JSON.stringify(error), false);
    }
};
const updateLesson = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const lesson_id = parseInt(req.body.lesson_id);
        const title = req.body.title;
        const videoFile = req.file;
        const user_id = req.user_id;
        const isFoundLesson = await configs.db.lesson.findFirst({
            where: {
                id: lesson_id,
            },
        });
        if (!isFoundLesson) return new ResponseError(404, constants.error.ERROR_LESSON_NOT_FOUND, false);
        if (videoFile) {
            const uuid = uuidv4();
            const createFile = await helper.FileHelper.createFileM3U8AndTS(
                videoFile as Express.Multer.File,
                resolutions,
                configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS,
                `${user_id}_${uuid}`,
            );
            const deleteOldVideo = await helper.FileHelper.destroyedVideoIfFailed(isFoundLesson.url_video);
            const updateLesson = await configs.db.lesson.update({
                where: {
                    id: lesson_id,
                },
                data: {
                    title,
                    url_video: createFile,
                },
            });
            if (updateLesson) {
                return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_LESSON, true);
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        } else {
            console.log("tới đây");
            const updateLesson = await configs.db.lesson.update({
                where: {
                    id: lesson_id,
                },
                data: {
                    title,
                },
            });
            if (updateLesson) {
                return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_LESSON, true);
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, JSON.stringify(error), false);
    }
};
const getLessonById = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { lesson_id } = req.body;
        const isFoundLesson = await configs.db.lesson.findFirst({
            where: {
                id: lesson_id,
            },
        });
        if (isFoundLesson) {
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_LESSON, true, {
                title: isFoundLesson.title,
                url_video: isFoundLesson.url_video,
            });
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        return new ResponseError(500, JSON.stringify(error), false);
    }
};

const deleteLesson = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { lesson_id } = req.body;
        const isFoundLesson = await configs.db.lesson.findFirst({
            where: {
                id: lesson_id,
            },
        });
        if (!isFoundLesson) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        else {
            if (isFoundLesson.is_delete) return new ResponseError(400, constants.error.ERROR_LESSON_NOT_FOUND, false);
            else {
                const deleteLesson = await configs.db.lesson.update({
                    where: { id: lesson_id },
                    data: {
                        is_delete: true,
                    },
                });
                if (deleteLesson) {
                    helper.FileHelper.destroyedVideoIfFailed(deleteLesson.url_video);
                    return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_LESSON, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        }
    } catch (error) {
        return new ResponseError(500, JSON.stringify(error), false);
    }
};

const LessonServices = {
    createLesson,
    updateLesson,
    deleteLesson,
    getLessonById,
};
export default LessonServices;
