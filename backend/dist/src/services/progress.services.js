"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const configs_1 = __importDefault(require("../configs"));
const constants_1 = __importDefault(require("../constants"));
const updateProgress = async (req) => {
    //chỉ dùng để update tiến độ cho bài học dạng video, dạng test đã xử lý riêng bên test
    const lectureId = Number(req.body.lecture_id);
    const progressValue = Number(req.body.progress_value);
    const userId = Number(req.user_id);
    const isLectureExist = await configs_1.default.db.lecture.findFirst({
        where: {
            id: lectureId,
            type: "Lesson",
        },
        include: {
            section: true,
            lesson: true,
        },
    });
    if (!isLectureExist)
        return new common_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
    const courseId = isLectureExist.section.course_id;
    const isProgressExist = await configs_1.default.db.progress.findFirst({
        where: {
            user_id: userId,
            course_id: courseId,
            lecture_id: lectureId,
        },
    });
    const progressPercent = progressValue / Number(isLectureExist.lesson?.duration);
    const isPass = progressPercent >= 0.85;
    if (isProgressExist) {
        // console.log("??", isProgressExist.id, isProgressExist.progress_value, progressValue);
        if (isProgressExist.progress_value > progressValue)
            return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_BUT_NO_UPDATE_PROGRESS, true);
        const data = {
            progress_value: progressValue,
            progress_percent: progressPercent,
        };
        if (!isProgressExist.pass) {
            const updateProgress = await configs_1.default.db.progress.update({
                where: {
                    id: isProgressExist.id,
                },
                data: {
                    ...data,
                    pass: isPass,
                },
            });
            if (updateProgress) {
                return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true, {
                    lecture_id: isProgressExist.lecture_id,
                    progress_percent: progressPercent,
                    progress_value: progressValue,
                    is_pass: isPass,
                });
            }
            else {
                return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            }
        }
        else {
            const updateProgress = await configs_1.default.db.progress.update({
                where: {
                    id: isProgressExist.id,
                },
                data: {
                    ...data,
                },
            });
            if (updateProgress) {
                return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true, {
                    lecture_id: isProgressExist.lecture_id,
                    progress_percent: progressPercent,
                    progress_value: progressValue,
                });
            }
            else {
                return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    }
    else {
        const createProgress = await configs_1.default.db.progress.create({
            data: {
                user_id: userId,
                course_id: courseId,
                lecture_id: lectureId,
                progress_value: progressValue,
                progress_percent: progressPercent,
                pass: isPass,
            },
        });
        if (createProgress) {
            const getProgress = await configs_1.default.db.progress.findFirst({
                where: {
                    id: createProgress.id,
                },
                include: {
                    lecture: {
                        select: {
                            section_id: true,
                            lesson: true,
                            test: true,
                            type: true,
                        },
                    },
                },
            });
            if (!getProgress)
                return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            const duration = getProgress.lecture.type === "Lesson"
                ? getProgress.lecture.lesson?.duration
                : getProgress.lecture.test?.duration;
            const temp = {
                progress_id: getProgress.id,
                lecture_id: getProgress.lecture_id,
                section_id: getProgress.lecture.section_id,
                is_pass: getProgress.pass,
                duration,
                progress_value: getProgress.progress_value,
                progress_percent: getProgress.progress_percent,
            };
            return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DATA, true, temp);
        }
        else {
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
    }
};
const ProgressServices = {
    updateProgress,
};
exports.default = ProgressServices;
