"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLogin = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const configs_1 = __importDefault(require("../configs"));
const isLogin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const jsonWebToken = authHeader?.split(" ")[1];
        if (!jsonWebToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        else {
            const decodeJsonWebToken = jsonwebtoken_1.default.verify(jsonWebToken, configs_1.default.general.JWT_SECRET_KEY);
            if (decodeJsonWebToken) {
                const isFoundUser = await configs_1.default.db.user.findUnique({
                    where: {
                        id: decodeJsonWebToken.user_id,
                    },
                });
                if (isFoundUser) {
                    req.user_id = isFoundUser.id;
                }
            }
        }
        next();
    }
    catch (error) {
        console.log(error);
        // if (error instanceof PrismaClientKnownRequestError) {
        //     return res.status(401).json({ message: error.toString() });
        // }
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(401).json({ message: error.message });
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(401).json({ message: error.message });
        }
        else if (error instanceof jsonwebtoken_1.NotBeforeError) {
            return res.status(401).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server" });
    }
};
exports.isLogin = isLogin;
