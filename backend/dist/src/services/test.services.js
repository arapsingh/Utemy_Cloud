"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const configs_1 = __importDefault(require("../configs"));
const constants_1 = __importDefault(require("../constants"));
const createTest = async (content, lectureId) => {
    try {
        const title = content.title;
        const duration = content.duration;
        const description = content.description;
        const pass_percent = Number((Number(content.pass_percent) / 100).toFixed(2));
        const quiz_group_id = Number(content.quiz_group_id);
        const is_time_limit = content.is_time_limit === "true" ? true : false;
        const quizList = await configs_1.default.db.quiz.findMany({
            where: {
                quiz_group_id,
                is_delete: false,
            },
        });
        const createTest = await configs_1.default.db.test.create({
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
        const createTestDetail = await configs_1.default.db.testDetail.createMany({
            data: createTestDetailData,
        });
        if (!createTestDetail) {
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
        else {
            return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DATA, true);
        }
    }
    catch (error) {
        return new common_1.ResponseError(500, JSON.stringify(error), false);
    }
};
const updateTest = async (content, lectureId) => {
    try {
        const title = content.title;
        const duration = content.duration;
        const description = content.description;
        const pass_percent = Number((Number(content.pass_percent) / 100).toFixed(2));
        const quiz_group_id = Number(content.quiz_group_id);
        const is_time_limit = content.is_time_limit === "true" ? true : false;
        const quizList = await configs_1.default.db.quiz.findMany({
            where: {
                quiz_group_id,
                is_delete: false,
            },
        });
        const isExistTest = await configs_1.default.db.test.findFirst({
            where: {
                lecture_id: lectureId,
                is_delete: false,
            },
        });
        if (!isExistTest)
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const updateTest = await configs_1.default.db.test.update({
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
            const clearOldTestDetail = await configs_1.default.db.testDetail.deleteMany({
                where: {
                    test_id: isExistTest.id,
                },
            });
            const createTestDetail = await configs_1.default.db.testDetail.createMany({
                data: createTestDetailData,
            });
            if (!createTestDetail) {
                return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
            }
            else {
                return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DATA, true);
            }
        }
        return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DATA, true);
    }
    catch (error) {
        return new common_1.ResponseError(500, JSON.stringify(error), false);
    }
};
const deleteTest = async (lectureId) => {
    try {
        const isExistTest = await configs_1.default.db.test.findFirst({
            where: {
                lecture_id: lectureId,
            },
        });
        if (!isExistTest)
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const deleteTest = await configs_1.default.db.test.update({
            where: {
                lecture_id: lectureId,
            },
            data: {
                is_delete: true,
                lecture_id: null,
            },
        });
        if (deleteTest) {
            const deleteTestDetail = await configs_1.default.db.testDetail.deleteMany({
                where: {
                    test_id: deleteTest.id,
                },
            });
            return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_DATA, true);
        }
        else {
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
    }
    catch (error) {
        return new common_1.ResponseError(500, JSON.stringify(error), false);
    }
};
const getTestByTestId = async (req) => {
    try {
        const { test_id } = req.params;
        const user_id = Number(req.user_id);
        const isCourseExist = await configs_1.default.db.test.findFirst({
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
        const isEnrolled = await configs_1.default.db.enrolled.findFirst({
            where: {
                user_id,
                course_id: isCourseExist?.lecture?.section.course_id,
            },
        });
        if (user_id !== isCourseExist?.lecture?.section.Course?.author_id && !isEnrolled)
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const isExistTest = await configs_1.default.db.test.findFirst({
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
        if (!isExistTest)
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
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
        return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, testData);
    }
    catch (error) {
        console.log(error);
        return new common_1.ResponseError(500, JSON.stringify(error), false);
    }
};
const createTestHistory = async (req) => {
    try {
        const test_id = Number(req.body.test_id);
        const test_progress = req.body.test_progress;
        const user_id = Number(req.user_id);
        const isExistTest = await configs_1.default.db.test.findFirst({
            where: {
                id: test_id,
            },
            select: {
                number_of_question: true,
                pass_percent: true,
            },
        });
        if (!isExistTest)
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const total_percent = Number(Number(countRightAnswer(test_progress) / Number(isExistTest.number_of_question)).toFixed(2));
        const createTestHistory = await configs_1.default.db.testHistory.create({
            data: {
                test_id,
                user_id,
                total_score: countRightAnswer(test_progress),
                total_percent: total_percent * 100,
                is_pass: total_percent >= isExistTest.pass_percent,
            },
        });
        const createTestHistoryDetailData = test_progress.map((progress) => {
            const temp = {
                ...progress,
                test_history_id: createTestHistory.id,
            };
            return temp;
        });
        const createTestHistoryDetail = await configs_1.default.db.testHistoryDetail.createMany({
            data: createTestHistoryDetailData,
        });
        if (createTestHistoryDetail)
            return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DATA, true);
        else
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        console.log(error);
        return new common_1.ResponseError(500, JSON.stringify(error), false);
    }
};
const getTestHistory = async (req) => {
    try {
        const { test_id } = req.params;
        const user_id = Number(req.user_id);
        const isExistTest = await configs_1.default.db.test.findFirst({
            where: {
                id: Number(test_id),
            },
        });
        if (!isExistTest)
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const getTestHistory = await configs_1.default.db.testHistory.findMany({
            take: 5,
            where: {
                test_id: Number(test_id),
                user_id,
            },
            orderBy: {
                created_at: "desc",
            },
        });
        const data = getTestHistory.map((history) => {
            const temp = {
                test_history_id: history.id,
                test_id: history.test_id,
                total_score: history.total_score,
                total_percent: history.total_percent,
                is_pass: history.is_pass,
                created_at: history.created_at.toString(),
                total_question: isExistTest.number_of_question,
            };
            return temp;
        });
        if (getTestHistory)
            return new common_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, data);
        else
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        console.log(error);
        return new common_1.ResponseError(500, JSON.stringify(error), false);
    }
};
const TestServices = {
    createTest,
    getTestByTestId,
    deleteTest,
    updateTest,
    createTestHistory,
    getTestHistory,
};
exports.default = TestServices;
const countRightAnswer = (testProgress) => {
    let count = 0;
    testProgress.forEach((progress) => {
        if (progress.is_correct)
            count += 1;
    });
    return count;
};
