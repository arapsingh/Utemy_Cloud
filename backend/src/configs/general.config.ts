/* eslint-disable prettier/prettier */
import dotenv from "dotenv";
dotenv.config();

export const general = {
    DOMAIN_NAME: process.env.DOMAIN_NAME,
    PORT: parseInt(process.env.PORT || "3001"),
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
    TOKEN_ACCESS_EXPIRED_TIME: process.env.TOKEN_ACCESS_EXPIRED_TIME,
    TOKEN_REFRESH_EXPIRED_TIME: process.env.TOKEN_REFRESH_EXPIRED_TIME,
    HASH_SALT: parseInt(process.env.HASH_SALT as string),
    PAGE_SIZE: Number(process.env.PAGE_SIZE),
};
