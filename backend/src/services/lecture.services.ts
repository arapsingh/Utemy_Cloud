import { ResponseSuccess, ResponseError, ResponseBase, resolutions } from "../common";
import configs from "../configs";
import { IRequestWithId } from "../types/request";
import constants from "../constants";
import { LectureResponse } from "~/types/lecture";
import LessonServices from "./lesson.services";
import { CreateLessonType } from "~/types/lesson";
const createLecture = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const videoFile = req.file;
        const { type, section_id, duration, description, title } = req.body;
        const createLecture = await configs.db.lecture.create({
            data: {
                type,
                section_id,
            },
        });
        if (type === "Lesson") {
            if (!videoFile) return new ResponseError(500, constants.error.ERROR_BAD_REQUEST, false);
            const lessonContent: CreateLessonType = {
                duration,
                description,
                title,
                videoFile,
            };
            return LessonServices.createLesson(lessonContent, createLecture.id);
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateLecture = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const videoFile = req.file;
        const { lecture_id } = req.params;
        const { type, duration, description, title } = req.body;
        const isLectureExist = await configs.db.lecture.findFirst({
            where: {
                id: Number(lecture_id),
            },
        });
        if (!isLectureExist) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        if (type === "Lesson") {
            const lessonContent = {
                duration,
                description,
                title,
                videoFile,
            };
            return LessonServices.updateLesson(lessonContent, isLectureExist.id);
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteLecture = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { lecture_id } = req.params;
        const { type } = req.body;
        const isLectureExist = await configs.db.lecture.findFirst({
            where: {
                id: Number(lecture_id),
            },
        });
        if (!isLectureExist) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        if (type === "Lesson") {
            return LessonServices.deleteLesson(isLectureExist.id);
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getLectureById = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { lecture_id } = req.params;
        const isFoundLecture = await configs.db.lecture.findFirst({
            where: {
                id: parseInt(lecture_id),
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
                test: true,
            },
        });
        if (isFoundLecture) {
            let temp: LectureResponse = {
                lecture_id: isFoundLecture.id,
                type: isFoundLecture.type,
            };
            if (isFoundLecture.type === "Lesson") temp = { ...temp, content: isFoundLecture.lesson };

            return new ResponseSuccess(200, constants.success.SUCCESS_GET_LESSON, true, temp);
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        return new ResponseError(500, JSON.stringify(error), false);
    }
};

const LectureServices = {
    createLecture,
    updateLecture,
    deleteLecture,
    getLectureById,
};
export default LectureServices;
