"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/index"));
const isLogin_1 = require("../middlewares/isLogin");
const eventRouter = (0, express_1.Router)();
eventRouter.get("/allevent", isLogin_1.isLogin, index_1.default.eventController.getAllEvents);
eventRouter.get("/all", isLogin_1.isLogin, index_1.default.eventController.getEventsWithPagination);
eventRouter.post("/", isLogin_1.isLogin, index_1.default.eventController.createEvent);
eventRouter.patch("/:event_id", isLogin_1.isLogin, index_1.default.eventController.updateEvent);
eventRouter.delete("/:event_id", isLogin_1.isLogin, index_1.default.eventController.deleteEvent);
eventRouter.get("/:event_id", isLogin_1.isLogin, index_1.default.eventController.getEventById);
eventRouter.get("/is/active", index_1.default.eventController.getActiveEvent);
exports.default = eventRouter;
