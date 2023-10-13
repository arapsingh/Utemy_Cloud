import { IRequestWithId } from "../types/request";
import { Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError, NotBeforeError } from "jsonwebtoken";
import { db } from "../configs/db.config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import configs from "../configs";
import constants from "../utils/constants";

export const isAuthor = async (req: IRequestWithId, res: Response, next: NextFunction) => {
    try {
        const user_id = req.user_id;
        const course_id = req.body.course_id;
        const isFoundCourse = await db.course.findFirst({
            where: {
                id: course_id,
                author_id: user_id,
            },
        });
        if (!isFoundCourse) {
            return res.status(403).json({ message: constants.ERROR_UNAUTHORIZED });
        }
        next();
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return res.status(401).json({ message: error.toString() });
        }
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
