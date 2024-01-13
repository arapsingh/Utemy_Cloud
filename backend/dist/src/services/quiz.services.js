"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const createQuizGroup = async (req) => {
    try {
        const { title, description } = req.body;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const createFeedback = await configs_1.default.db.quizGroup.create({
            data: {
                user_id,
                title,
                description,
            },
        });
        if (!createFeedback)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_FEEDBACK, true); //
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateQuizGroup = async (req) => {
    try {
        const { quiz_group_id } = req.params;
        const { title, description } = req.body;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isExistQuizGroup = await configs_1.default.db.quizGroup.findFirst({
            where: {
                user_id,
                id: Number(quiz_group_id),
            },
        });
        if (!isExistQuizGroup)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const updateQuizGroup = await configs_1.default.db.quizGroup.update({
            where: {
                id: Number(quiz_group_id),
            },
            data: {
                title,
                description,
            },
        });
        if (updateQuizGroup)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_FEEDBACK, true); //
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteQuizGroup = async (req) => {
    try {
        const { quiz_group_id } = req.params;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isExistQuizGroup = await configs_1.default.db.quizGroup.findFirst({
            where: {
                user_id,
                id: Number(quiz_group_id),
            },
        });
        if (!isExistQuizGroup)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const deleteQuizGroup = await configs_1.default.db.quizGroup.update({
            where: {
                id: Number(quiz_group_id),
            },
            data: {
                is_delete: true,
            },
        });
        if (deleteQuizGroup)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_DATA, true); //
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllQuizGroup = async (req) => {
    try {
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const getAllQuizGroup = await configs_1.default.db.quizGroup.findMany({
            where: {
                user_id,
                is_delete: false,
            },
        });
        if (!getAllQuizGroup)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const data = getAllQuizGroup.map((group) => {
            const temp = {
                quiz_group_id: group.id,
                title: group.title,
                description: group.description,
            };
            return temp;
        });
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, data);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllQuizGroupHasQuiz = async (req) => {
    try {
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const getAllQuizGroup = await configs_1.default.db.quizGroup.findMany({
            where: {
                user_id,
                is_delete: false,
                NOT: {
                    number_of_quiz: 0,
                },
            },
        });
        if (!getAllQuizGroup)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const data = getAllQuizGroup.map((group) => {
            const temp = {
                quiz_group_id: group.id,
                title: group.title,
                description: group.description,
            };
            return temp;
        });
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, data);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createQuiz = async (req) => {
    try {
        const { question, type, quiz_group_id, quiz_answer } = req.body;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isExistQuizGroup = await configs_1.default.db.quizGroup.findFirst({
            where: {
                user_id,
                id: Number(quiz_group_id),
            },
        });
        if (!isExistQuizGroup)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const createQuiz = await configs_1.default.db.quiz.create({
            data: {
                quiz_group_id: Number(quiz_group_id),
                type,
                question,
            },
        });
        const updateQuizGroup = await configs_1.default.db.quizGroup.update({
            data: {
                number_of_quiz: { increment: 1 },
            },
            where: { id: isExistQuizGroup.id },
        });
        const createAnswerData = quiz_answer.map((answer) => {
            const temp = {
                quiz_id: createQuiz.id,
                answer: answer.answer,
                is_correct: answer.is_correct,
            };
            return temp;
        });
        const createAnswer = await configs_1.default.db.quizAnswer.createMany({
            data: createAnswerData,
        });
        if (createAnswer)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DATA, true); //
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        console.log(error);
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateQuiz = async (req) => {
    try {
        const { quiz_id } = req.params;
        const { question, type, quiz_answer } = req.body;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isExistQuiz = await configs_1.default.db.quiz.findFirst({
            where: {
                id: Number(quiz_id),
                quiz_group: {
                    user_id,
                },
            },
            include: {
                quiz_group: true,
            },
        });
        if (!isExistQuiz)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const updateQuiz = await configs_1.default.db.quiz.update({
            data: {
                type,
                question,
            },
            where: {
                id: isExistQuiz.id,
            },
        });
        const clearAnswer = await configs_1.default.db.quizAnswer.deleteMany({
            where: {
                quiz_id: isExistQuiz.id,
            },
        });
        const createAnswerData = quiz_answer.map((answer) => {
            const temp = {
                quiz_id: isExistQuiz.id,
                answer: answer.answer,
                is_correct: answer.is_correct,
            };
            return temp;
        });
        const createAnswer = await configs_1.default.db.quizAnswer.createMany({
            data: createAnswerData,
        });
        if (createAnswer)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true); //
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteQuiz = async (req) => {
    try {
        const { quiz_id } = req.params;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isExistQuiz = await configs_1.default.db.quiz.findFirst({
            where: {
                id: Number(quiz_id),
                quiz_group: {
                    user_id,
                },
            },
            include: {
                quiz_group: true,
            },
        });
        if (!isExistQuiz)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const deleteQuiz = await configs_1.default.db.quiz.update({
            data: {
                is_delete: true,
            },
            where: {
                id: isExistQuiz.id,
            },
        });
        const updateQuizGroup = await configs_1.default.db.quizGroup.update({
            data: {
                number_of_quiz: { decrement: 1 },
            },
            where: { id: isExistQuiz.quiz_group_id },
        });
        // const clearAnswer = await configs.db.quizAnswer.deleteMany({
        //     where: {
        //         quiz_id: isExistQuiz.id,
        //     },
        // });
        if (deleteQuiz)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_DATA, true); //
        else
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllQuizByGroupId = async (req) => {
    try {
        const searchItem = req.query.search_item ? req.query.search_item : undefined;
        const { quiz_group_id } = req.params;
        const user_id = Number(req.user_id);
        if (!user_id)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isExistQuizGroup = await configs_1.default.db.quizGroup.findFirst({
            where: {
                user_id,
                id: Number(quiz_group_id),
                is_delete: false,
            },
        });
        if (!isExistQuizGroup)
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const getAllQuiz = await configs_1.default.db.quiz.findMany({
            where: {
                quiz_group_id: isExistQuizGroup.id,
                question: {
                    contains: searchItem?.toLowerCase(),
                },
                is_delete: false,
            },
            include: {
                quiz_answer: {
                    select: {
                        id: true,
                        answer: true,
                        is_correct: true,
                    },
                },
            },
        });
        const listQuiz = getAllQuiz.map((quiz) => {
            const temp = {
                quiz_id: quiz.id,
                question: quiz.question,
                type: quiz.type,
                created_at: quiz.created_at,
                updated_at: quiz.updated_at.toString(),
                quiz_group_id: quiz.quiz_group_id,
                quiz_answer: quiz.quiz_answer.map((answer) => {
                    const temp = { quiz_answer_id: answer.id, answer: answer.answer, is_correct: answer.is_correct };
                    return temp;
                }),
            };
            return temp;
        });
        const data = {
            quiz_group_id: isExistQuizGroup.id,
            quiz: listQuiz,
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, data);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const QuizServices = {
    createQuizGroup,
    updateQuiz,
    updateQuizGroup,
    createQuiz,
    deleteQuiz,
    deleteQuizGroup,
    getAllQuizByGroupId,
    getAllQuizGroup,
    getAllQuizGroupHasQuiz,
};
exports.default = QuizServices;
