"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const configs_1 = __importDefault(require("../configs"));
const constants_1 = __importDefault(require("../constants"));
const uuid_1 = require("uuid");
const helper_1 = __importDefault(require("../helper"));
const createLesson = async (content, lectureId) => {
    try {
        const videoFile = content.videoFile;
        const title = content.title;
        const duration = content.duration;
        const description = content.description;
        const uuid = (0, uuid_1.v4)();
        const createFile = await helper_1.default.FileHelper.createFileM3U8AndTS(videoFile, common_1.resolutions, configs_1.default.general.PATH_TO_PUBLIC_FOLDER_VIDEOS, `${lectureId}_${uuid}`);
        const fullpathConverted = helper_1.default.ConvertHelper.convertFilePath(createFile);
        const createLesson = await configs_1.default.db.lesson.create({
            data: {
                title,
                lecture_id: lectureId,
                url_video: fullpathConverted,
                duration,
                description,
            },
        });
        if (!createLesson) {
            await helper_1.default.FileHelper.destroyedVideoIfFailed(createFile); //không tới đc đây
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
        else {
            return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_LESSON, true);
        }
    }
    catch (error) {
        return new common_1.ResponseError(500, JSON.stringify(error), false);
    }
};
const updateLesson = async (content, lectureId) => {
    try {
        const title = content.title;
        const videoFile = content.videoFile;
        const duration = content.duration;
        const description = content.description;
        const isFoundLesson = await configs_1.default.db.lesson.findFirst({
            where: {
                lecture_id: lectureId,
            },
        });
        if (!isFoundLesson)
            return new common_1.ResponseError(404, constants_1.default.error.ERROR_LESSON_NOT_FOUND, false);
        if (videoFile) {
            const uuid = (0, uuid_1.v4)();
            const createFile = await helper_1.default.FileHelper.createFileM3U8AndTS(videoFile, common_1.resolutions, configs_1.default.general.PATH_TO_PUBLIC_FOLDER_VIDEOS, `${lectureId}_${uuid}`);
            const fullPathConverted = helper_1.default.ConvertHelper.convertFilePath(createFile);
            const oldFullPathConverted = helper_1.default.ConvertHelper.deConvertFilePath(isFoundLesson.url_video);
            const updateLesson = await configs_1.default.db.lesson.update({
                where: {
                    lecture_id: lectureId,
                },
                data: {
                    title,
                    url_video: fullPathConverted,
                    duration,
                    description,
                },
            });
            if (updateLesson) {
                await helper_1.default.FileHelper.destroyedVideoIfFailed(oldFullPathConverted);
                return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_LESSON, true);
            }
            else {
                await helper_1.default.FileHelper.destroyedVideoIfFailed(createFile);
                return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            }
        }
        else {
            const updateLesson = await configs_1.default.db.lesson.update({
                where: {
                    lecture_id: lectureId,
                },
                data: {
                    title,
                    duration,
                    description,
                },
            });
            if (updateLesson) {
                return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_LESSON, true);
            }
            else {
                return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    }
    catch (error) {
        return new common_1.ResponseError(500, JSON.stringify(error), false);
    }
};
const deleteLesson = async (lectureId) => {
    try {
        const isFoundLesson = await configs_1.default.db.lesson.findFirst({
            where: {
                lecture_id: lectureId,
            },
        });
        if (!isFoundLesson)
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        else {
            if (isFoundLesson.is_delete)
                return new common_1.ResponseError(400, constants_1.default.error.ERROR_LESSON_NOT_FOUND, false);
            else {
                const deleteLesson = await configs_1.default.db.lesson.update({
                    where: { lecture_id: lectureId },
                    data: {
                        is_delete: true,
                        lecture_id: null,
                    },
                });
                if (deleteLesson) {
                    helper_1.default.FileHelper.destroyedVideoIfFailed(helper_1.default.ConvertHelper.deConvertFilePath(deleteLesson.url_video));
                    return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_LESSON, true);
                }
                else {
                    console.log("del");
                    return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        }
    }
    catch (error) {
        console.log(error);
        return new common_1.ResponseError(500, JSON.stringify(error), false);
    }
};
const LessonServices = {
    createLesson,
    updateLesson,
    deleteLesson,
};
exports.default = LessonServices;
