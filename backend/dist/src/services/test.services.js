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
        const duration = Number(content.duration) * 60;
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
                duration: duration.toString(),
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
        const duration = Number(content.duration) * 60;
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
                duration: duration.toString(),
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
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
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
        if (!isCourseExist || isCourseExist.lecture_id === null) {
            const isCourseExistFinalTest = await configs_1.default.db.course.findUnique({
                where: {
                    final_test_id: Number(test_id),
                },
            });
            if (!isCourseExistFinalTest)
                return new common_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
            const isEnrolled = await configs_1.default.db.enrolled.findFirst({
                where: {
                    user_id,
                    course_id: isCourseExistFinalTest.id,
                },
            });
            if (user_id !== isCourseExistFinalTest.author_id && !isEnrolled && !isAdmin)
                return new common_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        }
        else {
            const isEnrolled = await configs_1.default.db.enrolled.findFirst({
                where: {
                    user_id,
                    course_id: isCourseExist?.lecture?.section.course_id,
                },
            });
            if (user_id !== isCourseExist?.lecture?.section.Course?.author_id && !isEnrolled && !isAdmin)
                return new common_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        }
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
const processType3Data = (data) => {
    if (data.length === 0)
        return [];
    const type3Data = data.filter((item) => item.type === 3);
    if (type3Data.length === 0)
        return [];
    const id = type3Data[0].quiz_answer_id;
    const groupedData = type3Data.reduce((acc, cur) => {
        //@ts-expect-error đéo lỗi đc mà cứ báo lỗi
        const newValue = acc.get(cur.quiz_id) !== undefined
            ? acc.get(cur.quiz_id)?.concat(cur)
            : new Array().concat(cur);
        acc.set(cur.quiz_id, newValue);
        return acc;
    }, new Map());
    const processedData = Array.from(groupedData).map(async ([quizId, group]) => {
        const numAns = await configs_1.default.db.quizAnswer.count({
            where: {
                quiz_id: quizId,
            },
        });
        const totalCorrect = group.reduce((acc, cur) => acc + (cur.is_correct ? 1 : 0), 0);
        const averageCorrect = totalCorrect / numAns;
        const isCorrect = averageCorrect >= 0.5 ? true : false;
        const quizAnswerString = group
            .map((item) => `${item.quiz_answer_string}:${item.is_correct ? "t" : "f"}`)
            .join(",");
        return {
            quiz_id: quizId,
            quiz_answer_string: quizAnswerString,
            quiz_answer_id: id,
            is_correct: isCorrect,
            type: 3,
        };
    });
    return processedData;
};
const createTestHistory = async (req) => {
    try {
        const test_id = Number(req.body.test_id);
        const test_progress = req.body.test_progress;
        const type3Data = await Promise.all(processType3Data(test_progress));
        const format_test_progress = test_progress
            .filter((e) => e.type !== 3)
            .concat(type3Data.length > 0 ? type3Data : []);
        const user_id = Number(req.user_id);
        const isExistTest = await configs_1.default.db.test.findFirst({
            where: {
                id: test_id,
            },
            include: {
                lecture: {
                    include: {
                        section: true,
                    },
                },
            },
        });
        if (!isExistTest)
            return new common_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const total_percent = Number(Number(countRightAnswer(format_test_progress) / Number(isExistTest.number_of_question)).toFixed(2));
        const isEnrolled = await configs_1.default.db.enrolled.findFirst({
            where: {
                user_id,
                course_id: isExistTest.lecture?.section.course_id,
            },
        });
        const is_pass = total_percent >= isExistTest.pass_percent;
        const isFinal = await configs_1.default.db.course.findUnique({
            where: {
                final_test_id: isExistTest.id,
            },
        });
        if (is_pass && isEnrolled) {
            if (isFinal) {
                const setPassCourse = await configs_1.default.db.enrolled.update({
                    where: {
                        id: isEnrolled.id,
                    },
                    data: {
                        is_pass: true,
                    },
                });
            }
            else {
                const isExistProgress = await configs_1.default.db.progress.findFirst({
                    where: {
                        user_id,
                        lecture_id: Number(isExistTest.lecture_id),
                        course_id: Number(isExistTest.lecture?.section.course_id),
                    },
                });
                if (!isExistProgress) {
                    const createProgress = await configs_1.default.db.progress.create({
                        data: {
                            user_id,
                            lecture_id: Number(isExistTest.lecture_id),
                            course_id: Number(isExistTest.lecture?.section.course_id),
                            progress_value: countRightAnswer(format_test_progress),
                            progress_percent: total_percent,
                            pass: is_pass,
                        },
                    });
                }
            }
        }
        const createTestHistory = await configs_1.default.db.testHistory.create({
            data: {
                test_id,
                user_id,
                total_score: countRightAnswer(format_test_progress),
                total_percent: total_percent * 100,
                is_pass,
            },
        });
        const createTestHistoryDetailData = format_test_progress.map((progress) => {
            const temp = {
                quiz_id: progress.quiz_id,
                quiz_answer_string: progress.quiz_answer_string,
                is_correct: progress.is_correct,
                quiz_answer_id: progress.quiz_answer_id,
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
