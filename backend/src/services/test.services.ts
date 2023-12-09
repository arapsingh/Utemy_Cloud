import { IRequestWithId } from "~/types/request";
import { ResponseSuccess, ResponseError, ResponseBase } from "../common";
import configs from "../configs";
import constants from "../constants";
import { CreateTestType } from "../types/test";
const createTest = async (content: CreateTestType, lectureId: number): Promise<ResponseBase> => {
    try {
        const title = content.title;
        const duration = content.duration;
        const description = content.description;
        const pass_percent = Number((Number(content.pass_percent) / 100).toFixed(2));
        const quiz_group_id = Number(content.quiz_group_id);
        const is_time_limit = content.is_time_limit === "True" ? true : false;
        const quizList = await configs.db.quiz.findMany({
            where: {
                quiz_group_id,
                is_delete: false,
            },
        });
        const createTest = await configs.db.test.create({
            data: {
                title,
                lecture_id: lectureId,
                duration,
                description,
                pass_percent,
                quiz_group_id,
                number_of_question: quizList.length,
                is_time_limit,
            },
        });

        const createTestDetailData = quizList.map((quiz) => {
            const temp = {
                test_id: createTest.id,
                quiz_id: quiz.id,
            };
            return temp;
        });
        const createTestDetail = await configs.db.testDetail.createMany({
            data: createTestDetailData,
        });
        if (!createTestDetail) {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        } else {
            return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
        }
    } catch (error) {
        console.log("error chỗ này", error);
        return new ResponseError(500, JSON.stringify(error), false);
    }
};
const updateTest = async (content: CreateTestType, lectureId: number): Promise<ResponseBase> => {
    try {
        const title = content.title;
        const duration = content.duration;
        const description = content.description;
        const pass_percent = Number((Number(content.pass_percent) / 100).toFixed(2));
        const quiz_group_id = Number(content.quiz_group_id);
        const is_time_limit = content.is_time_limit === "True" ? true : false;
        const quizList = await configs.db.quiz.findMany({
            where: {
                quiz_group_id,
                is_delete: false,
            },
        });
        const isExistTest = await configs.db.test.findFirst({
            where: {
                lecture_id: lectureId,
                is_delete: false,
            },
        });
        if (!isExistTest) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const updateTest = await configs.db.test.update({
            data: {
                title,
                duration,
                description,
                pass_percent,
                quiz_group_id,
                number_of_question: quizList.length,
                is_time_limit,
            },
            where: {
                lecture_id: lectureId,
            },
        });
        if (quiz_group_id !== isExistTest?.quiz_group_id) {
            const createTestDetailData = quizList.map((quiz) => {
                const temp = {
                    test_id: updateTest.id,
                    quiz_id: quiz.id,
                };
                return temp;
            });
            const clearOldTestDetail = await configs.db.testDetail.deleteMany({
                where: {
                    test_id: isExistTest.id,
                },
            });
            const createTestDetail = await configs.db.testDetail.createMany({
                data: createTestDetailData,
            });
            if (!createTestDetail) {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            } else {
                return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
            }
        }
        return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, JSON.stringify(error), false);
    }
};
const deleteTest = async (lectureId: number): Promise<ResponseBase> => {
    try {
        const isExistTest = await configs.db.test.findFirst({
            where: {
                lecture_id: lectureId,
            },
        });
        if (!isExistTest) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const deleteTest = await configs.db.test.update({
            where: {
                lecture_id: lectureId,
            },
            data: {
                is_delete: true,
                lecture_id: null,
            },
        });

        if (deleteTest) {
            const deleteTestDetail = await configs.db.testDetail.deleteMany({
                where: {
                    test_id: deleteTest.id,
                },
            });
            return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DATA, true);
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, JSON.stringify(error), false);
    }
};
const getTestByTestId = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { test_id } = req.params;
        const user_id = Number(req.user_id);
        const isCourseExist = await configs.db.test.findFirst({
            where: {
                id: Number(test_id),
                is_delete: false,
            },
            include: {
                lecture: {
                    include: {
                        section: {
                            include: {
                                Course: {
                                    select: {
                                        id: true,
                                        author_id: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const isEnrolled = await configs.db.enrolled.findFirst({
            where: {
                user_id,
                course_id: isCourseExist?.lecture?.section.course_id,
            },
        });
        if (user_id !== isCourseExist?.lecture?.section.Course?.author_id && !isEnrolled)
            return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const isExistTest = await configs.db.test.findFirst({
            where: {
                id: Number(test_id),
            },
            include: {
                test_detail: {
                    include: {
                        quiz: {
                            include: {
                                quiz_answer: {
                                    select: {
                                        id: true,
                                        answer: true,
                                        is_correct: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!isExistTest) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const testDetail = isExistTest.test_detail.map((detail) => {
            const quiz_answer = detail.quiz.quiz_answer.map((answer) => {
                const temp = {
                    quiz_answer_id: answer.id,
                    answer: answer.answer,
                    is_correct: answer.is_correct,
                };
                return temp;
            });
            const temp = {
                quiz_id: detail.quiz_id,
                question: detail.quiz.question,
                type: detail.quiz.type,
                quiz_answer: quiz_answer,
            };
            return temp;
        });
        const testData = {
            test_id: isExistTest.id,
            title: isExistTest.title,
            is_time_limit: isExistTest.is_time_limit,
            duration: isExistTest.duration,
            description: isExistTest.description,
            pass_percent: isExistTest.pass_percent,
            number_of_question: isExistTest.number_of_question,
            lecture_id: isExistTest.lecture_id,
            test_detail: testDetail,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, testData);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, JSON.stringify(error), false);
    }
};

const TestServices = {
    createTest,
    getTestByTestId,
    deleteTest,
    updateTest,
};
export default TestServices;
