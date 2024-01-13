"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthor = void 0;
const constants_1 = __importDefault(require("../utils/constants"));
const jsonwebtoken_1 = require("jsonwebtoken");
const configs_1 = __importDefault(require("../configs"));
const helper_1 = __importDefault(require("../helper"));
const isObjectEmpty = (object) => {
    for (const key in object) {
        if (key in object) {
            return false;
        }
    }
    return true;
};
const isAuthor = async (req, res, next) => {
    try {
        const file = req.file;
        const user_id = req.user_id;
        let groupId = { course_id: "", section_id: "", lecture_id: "" };
        if (isObjectEmpty(req.body))
            groupId = req.params;
        else if (isObjectEmpty(req.params))
            groupId = req.body;
        if (groupId.course_id) {
            const isCourseExist = await configs_1.default.db.course.findUnique({
                where: {
                    id: Number(groupId.course_id),
                },
            });
            if (!isCourseExist) {
                if (file)
                    await helper_1.default.FileHelper.destroyedFileIfFailed(file.path);
                res.status(404).json({ message: "Course not found" });
                return;
            }
            else {
                if (isCourseExist.author_id !== user_id) {
                    if (file)
                        await helper_1.default.FileHelper.destroyedFileIfFailed(file.path);
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                else {
                    next();
                }
            }
        }
        else if (groupId.section_id) {
            const isCourseExist = await configs_1.default.db.section.findFirst({
                where: {
                    id: Number(groupId.section_id),
                },
                include: {
                    Course: true,
                },
            });
            if (!isCourseExist) {
                if (file)
                    await helper_1.default.FileHelper.destroyedFileIfFailed(file.path);
                res.status(404).json({ message: "Course not found" });
                return;
            }
            else {
                if (isCourseExist.Course?.author_id !== user_id) {
                    if (file)
                        await helper_1.default.FileHelper.destroyedFileIfFailed(file.path);
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                else {
                    next();
                }
            }
        }
        else if (groupId.lecture_id) {
            const isCourseExist = await configs_1.default.db.lecture.findFirst({
                where: {
                    id: Number(groupId.lecture_id),
                },
                include: {
                    section: {
                        include: {
                            Course: true,
                        },
                    },
                },
            });
            if (!isCourseExist) {
                if (file)
                    await helper_1.default.FileHelper.destroyedFileIfFailed(file.path);
                res.status(404).json({ message: "Course not found" });
                return;
            }
            else {
                if (isCourseExist.section.Course?.author_id !== user_id) {
                    if (file)
                        await helper_1.default.FileHelper.destroyedFileIfFailed(file.path);
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                else {
                    next();
                }
            }
        }
        else {
            if (file)
                await helper_1.default.FileHelper.destroyedFileIfFailed(file.path);
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
    }
    catch (error) {
        // if (error instanceof PrismaClientKnownRequestError) {
        //     return res.status(401).json({ message: error.toString() });
        // }
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(401).json({ status_code: 401, message: error.message });
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(401).json({ status_code: 401, message: error.message });
        }
        else if (error instanceof jsonwebtoken_1.NotBeforeError) {
            return res.status(401).json({ status_code: 401, message: error.message });
        }
        return res.status(500).json({ status_code: 500, message: constants_1.default.ERROR_INTERNAL_SERVER });
    }
};
exports.isAuthor = isAuthor;
