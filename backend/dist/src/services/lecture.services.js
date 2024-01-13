"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const configs_1 = __importDefault(require("../configs"));
const constants_1 = __importDefault(require("../constants"));
const lesson_services_1 = __importDefault(require("./lesson.services"));
const test_services_1 = __importDefault(require("./test.services"));
const createLecture = async (req) => {
    try {
        const videoFile = req.file;
        const { type, section_id, duration, description, title, quiz_group_id, pass_percent, is_time_limit } = req.body;
        const createLecture = await configs_1.default.db.lecture.create({
            data: {
                type,
                section_id: Number(section_id),
            },
        });
        if (type === "Lesson") {
            if (!videoFile)
                return new common_1.ResponseError(500, constants_1.default.error.ERROR_BAD_REQUEST, false);
            const lessonContent = {
                duration,
                description,
                title,
                videoFile,
            };
            return lesson_services_1.default.createLesson(lessonContent, createLecture.id);
        }
        else {
            const testContent = {
                title,
                quiz_group_id,
                pass_percent,
                is_time_limit,
                description,
                duration,
            };
            return test_services_1.default.createTest(testContent, createLecture.id);
        }
    }
    catch (error) {
        console.log(error);
        return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateLecture = async (req) => {
    try {
        const videoFile = req.file;
        const { lecture_id, type, duration, description, title, quiz_group_id, pass_percent, is_time_limit } = req.body;
        const isLectureExist = await configs_1.default.db.lecture.findFirst({
            where: {
                id: Number(lecture_id),
            },
        });
        if (!isLectureExist)
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        if (type === "Lesson") {
            const lessonContent = {
                duration,
                description,
                title,
                videoFile,
            };
            if (isLectureExist.type === "Lesson") {
                return lesson_services_1.default.updateLesson(lessonContent, isLectureExist.id);
            }
            else {
                test_services_1.default.deleteTest(isLectureExist.id);
                const updateType = await configs_1.default.db.lecture.update({
                    where: {
                        id: isLectureExist.id,
                    },
                    data: {
                        type: "Lesson",
                    },
                });
                return lesson_services_1.default.createLesson(lessonContent, isLectureExist.id);
            }
        }
        else {
            const testContent = {
                title,
                quiz_group_id,
                pass_percent,
                is_time_limit,
                description,
                duration,
            };
            if (isLectureExist.type === "Lesson") {
                lesson_services_1.default.deleteLesson(isLectureExist.id);
                const updateType = await configs_1.default.db.lecture.update({
                    where: {
                        id: isLectureExist.id,
                    },
                    data: {
                        type: "Test",
                    },
                });
                return test_services_1.default.createTest(testContent, isLectureExist.id);
            }
            else {
                return test_services_1.default.updateTest(testContent, isLectureExist.id);
            }
        }
    }
    catch (error) {
        console.log(error);
        return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteLecture = async (req) => {
    try {
        const { lecture_id } = req.params;
        const isLectureExist = await configs_1.default.db.lecture.findFirst({
            where: {
                id: Number(lecture_id),
            },
        });
        if (!isLectureExist)
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const deleteLecture = await configs_1.default.db.lecture.update({
            where: {
                id: Number(lecture_id),
            },
            data: {
                is_delete: true,
            },
        });
        if (isLectureExist.type === "Lesson") {
            return lesson_services_1.default.deleteLesson(isLectureExist.id);
        }
        else {
            return test_services_1.default.deleteTest(isLectureExist.id);
        }
    }
    catch (error) {
        console.log(error);
        return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getLectureById = async (req) => {
    try {
        const { lecture_id } = req.params;
        const isFoundLecture = await configs_1.default.db.lecture.findFirst({
            where: {
                id: parseInt(lecture_id),
                is_delete: false,
            },
            include: {
                lesson: {
                    select: {
                        duration: true,
                        url_video: true,
                        description: true,
                        title: true,
                    },
                },
                test: {
                    select: {
                        title: true,
                        duration: true,
                        description: true,
                        is_time_limit: true,
                        pass_percent: true,
                        quiz_group_id: true,
                    },
                },
            },
        });
        if (isFoundLecture) {
            let temp = {
                lecture_id: isFoundLecture.id,
                type: isFoundLecture.type,
            };
            if (isFoundLecture.type === "Lesson")
                temp = { ...temp, content: isFoundLecture.lesson };
            else
                temp = { ...temp, content: isFoundLecture.test };
            return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_LESSON, true, temp);
        }
        else {
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
    }
    catch (error) {
        console.log(error);
        return new common_1.ResponseError(500, JSON.stringify(error), false);
    }
};
const LectureServices = {
    createLecture,
    updateLecture,
    deleteLecture,
    getLectureById,
};
exports.default = LectureServices;
