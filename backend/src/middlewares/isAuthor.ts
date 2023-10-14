import { IRequestWithId } from "../types/request";
import { Response, NextFunction } from "express";
import { db } from "../configs/db.config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import constants from "../utils/constants";
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError, NotBeforeError } from "jsonwebtoken";
import configs from "../configs";

export const isAuthor = async (req: IRequestWithId, res: Response, next: NextFunction) => {
    try {
        const user_id = req.user_id;
        const { course_id, section_id, lesson_id } = req.body;
        if (course_id) {
            const isCourseExist = await configs.db.course.findUnique({
                where: {
                    id: course_id,
                },
            });
            if (!isCourseExist) {
                res.status(404).json({ message: "Course not found" });
                return;
            } else {
                if (isCourseExist.author_id !== user_id) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                } else {
                    next();
                }
            }
        } else if (section_id) {
            const isCourseExist = await configs.db.section.findFirst({
                where: {
                    id: section_id,
                },
                include: {
                    Course: true,
                },
            });
            if (!isCourseExist) {
                res.status(404).json({ message: "Course not found" });
                return;
            } else {
                if (isCourseExist.Course?.author_id !== user_id) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                } else {
                    next();
                }
            }
        } else if (lesson_id) {
            const isCourseExist = await configs.db.lesson.findFirst({
                where: {
                    id: lesson_id,
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
                res.status(404).json({ message: "Course not found" });
                return;
            } else {
                if (isCourseExist.section.Course?.author_id !== user_id) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                } else {
                    next();
                }
            }
        } else {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
    } catch (error: any) {
        // if (error instanceof PrismaClientKnownRequestError) {
        //     return res.status(401).json({ message: error.toString() });
        // }
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: error.message });
        } else if (error instanceof JsonWebTokenError) {
            return res.status(401).json({ message: error.message });
        } else if (error instanceof NotBeforeError) {
            return res.status(401).json({ message: error.message });
        }

        return res.status(500).json({ message: constants.ERROR_INTERNAL_SERVER });
    }
};
