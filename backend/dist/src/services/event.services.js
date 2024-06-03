"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const runtime_1 = require("@prisma/client/runtime");
const response_1 = require("../common/response");
const constants_1 = __importDefault(require("../constants"));
const luxon_1 = require("luxon");
const createEvent = async (req, formData) => {
    try {
        // const { code, discount, valid_start, valid_until, remain_quantity, is_event } = req.body;
        const name = req.body.name;
        const description = req.body.description;
        const startDate = req.body.start_date;
        const endDate = req.body.end_date;
        const startDateISO = luxon_1.DateTime.fromISO(req.body.start_date); // Chuyển đổi start_date thành đối tượng DateTime
        const endDateISO = luxon_1.DateTime.fromISO(req.body.end_date); // Chuyển đổi end_date thành đối tượng DateTime
        // const isActive = req.body.is_active === "true";
        const user_id = Number(req.user_id);
        const now = luxon_1.DateTime.local(); // Ngày giờ hiện tại
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        let isActive = false;
        // So sánh start_date và end_date với ngày giờ hiện tại
        if (startDateISO <= now && endDateISO > now) {
            isActive = true;
        }
        const isExistActiveEvent = await configs_1.default.db.event.findFirst({
            where: {
                is_active: true,
                is_delete: false,
            },
        });
        const maxEndDateEvent = await configs_1.default.db.event.findFirst({
            where: {
                is_delete: false, // Đảm bảo chỉ lấy sự kiện chưa bị xóa
            },
            orderBy: {
                end_date: "desc", // Sắp xếp giảm dần theo end_date
            },
        });
        console.log("Max end date event:", maxEndDateEvent);
        if (isExistActiveEvent) {
            console.log("startDateISO:", startDateISO);
            console.log("end_date of active event:", isExistActiveEvent?.end_date);
            if (maxEndDateEvent && maxEndDateEvent.end_date) {
                const maxEndDateISO = luxon_1.DateTime.fromISO(maxEndDateEvent?.end_date.toISOString());
                console.log("Max end date ISO:", maxEndDateISO);
                if (startDateISO <= maxEndDateISO) {
                    console.log("Start date of new event is earlier than or equal to end date of active event");
                    return new response_1.ResponseError(501, constants_1.default.error.ERROR_EXIST_ACTIVE_EVENT +
                        ", please choose the start date of this event later than " +
                        maxEndDateEvent.end_date, false);
                }
                else {
                    console.log("Start date of new event is later than end date of active event");
                }
            }
            else {
                console.log("No active event found or end date is undefined");
                // Xử lý khi không có maxEndDateEvent hoặc end_date là undefined
            }
        }
        const createEvent = await configs_1.default.db.event.create({
            data: {
                name: name,
                description: description,
                start_date: startDate,
                end_date: endDate,
                is_active: isActive,
            },
        });
        if (createEvent)
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_CREATE_DATA, true);
        else {
            console.error("Error occurred while creating coupon:", createEvent); // Log lỗi cụ thể
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
    }
    catch (error) {
        console.error("An error occurred while creating coupon:", error); // Log lỗi cụ thể
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateEvent = async (req, formData) => {
    try {
        const { event_id } = req.params;
        const name = req.body.name;
        const description = req.body.description;
        const startDate = req.body.start_date;
        const endDate = req.body.end_date;
        const startDateISO = luxon_1.DateTime.fromISO(req.body.start_date).toJSDate(); // Chuyển đổi thành dạng Date
        const endDateISO = luxon_1.DateTime.fromISO(req.body.end_date).toJSDate(); // Chuyển đổi thành dạng Date
        const user_id = Number(req.user_id);
        const now = luxon_1.DateTime.local().toJSDate(); // Chuyển đổi thành dạng Date
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        }
        let isActive = false;
        if (startDateISO <= now && endDateISO > now) {
            isActive = true;
        }
        const isEventExist = await configs_1.default.db.event.findUnique({
            where: {
                id: Number(event_id),
            },
        });
        if (!isEventExist) {
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        }
        const newStartDate = luxon_1.DateTime.fromISO(startDate).toJSDate(); // Chuyển đổi thành dạng Date
        const newEndDate = luxon_1.DateTime.fromISO(endDate).toJSDate(); // Chuyển đổi thành dạng Date
        // Kiểm tra xem có sự kiện nào khác nằm giữa thời gian mới của sự kiện không
        const eventsInBetween = await configs_1.default.db.event.findMany({
            where: {
                id: {
                    not: Number(event_id), // Loại trừ sự kiện đang chỉnh sửa
                },
                OR: [
                    {
                        AND: [
                            {
                                start_date: {
                                    lte: newStartDate,
                                },
                            },
                            {
                                end_date: {
                                    gte: newStartDate,
                                },
                            },
                        ],
                    },
                    {
                        AND: [
                            {
                                start_date: {
                                    lte: newEndDate,
                                },
                            },
                            {
                                end_date: {
                                    gte: newEndDate,
                                },
                            },
                        ],
                    },
                    {
                        AND: [
                            {
                                start_date: {
                                    gte: newStartDate,
                                },
                            },
                            {
                                end_date: {
                                    lte: newEndDate,
                                },
                            },
                        ],
                    },
                ],
            },
        });
        if (eventsInBetween.length > 0) {
            const conflictingEvents = eventsInBetween.map((event) => event.name);
            const errorMessage = `There is another event in this period of time: ${conflictingEvents.join(", ")}, please adjust the suitable time`;
            // Nếu có sự kiện nằm giữa thời gian mới của sự kiện
            return new response_1.ResponseError(501, errorMessage, false);
        }
        const updateEvent = await configs_1.default.db.event.update({
            data: {
                name: name,
                description: description,
                start_date: startDate,
                end_date: endDate,
                is_active: isActive,
            },
            where: {
                id: isEventExist.id,
            },
        });
        if (updateEvent) {
            return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true);
        }
        else {
            console.error("Error updating event:", updateEvent);
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
    }
    catch (error) {
        console.error("An error occurred while updating event:", error);
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteEvent = async (req) => {
    try {
        const { event_id } = req.params;
        const user_id = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const isEventExist = await configs_1.default.db.event.findUnique({
            where: {
                id: Number(event_id),
            },
        });
        if (!isEventExist)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const deleteEvent = await configs_1.default.db.event.update({
            data: {
                is_delete: true,
            },
            where: {
                id: isEventExist.id,
            },
        });
        if (deleteEvent) {
            const deleteCoupon = await configs_1.default.db.coupon.updateMany({
                data: {
                    is_delete: true,
                },
                where: {
                    event_id: isEventExist.id,
                },
            });
            if (deleteCoupon)
                return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_DELETE_DATA, true);
            return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getEventsWithPagination = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        await updateEventsIsActiveAutomatic(req);
        const { search_item: searchItem, page_index: pageIndex } = req.query;
        const parsedSearchItem = searchItem;
        const pageSize = configs_1.default.general.PAGE_SIZE;
        const skip = ((Number(pageIndex) ?? 1) - 1) * pageSize;
        const getAllEvent = await configs_1.default.db.event.findMany({
            skip,
            take: pageSize,
            where: {
                name: {
                    contains: parsedSearchItem,
                },
                is_delete: false,
            },
            orderBy: {
                start_date: "asc",
            },
            include: {
                coupons: {
                    where: {
                        is_delete: false,
                        remain_quantity: {
                            gt: 0,
                        },
                        valid_until: {
                            gt: new Date(), // Only include coupons valid until now
                        },
                    },
                    include: {
                        ratio: true,
                    },
                },
            },
        });
        if (!getAllEvent)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const totalRecord = await configs_1.default.db.event.count({
            where: {
                is_delete: false,
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const events = [];
        getAllEvent.map((item) => {
            const event = {
                event_id: item.id,
                name: item.name,
                description: item.description,
                is_delete: item.is_delete,
                is_active: item.is_active,
                start_date: luxon_1.DateTime.fromISO(item.start_date.toISOString()),
                end_date: luxon_1.DateTime.fromISO(item.end_date.toISOString()),
                coupons: item.coupons.map((cp) => {
                    return {
                        coupon_id: cp.id,
                        code: cp.code,
                        discount: cp.discount,
                        valid_start: cp.valid_start,
                        valid_until: cp.valid_until,
                        remain_quantity: cp.remain_quantity,
                        is_event: cp.is_event,
                        max_discount_money: cp.max_discount_money,
                        ratio: cp.ratio,
                    };
                }),
            };
            return events.push(event);
        });
        const eventsResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: events,
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, eventsResponseData);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateEventsIsActiveAutomatic = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const now = luxon_1.DateTime.local();
        const allEvents = await configs_1.default.db.event.findMany();
        for (const event of allEvents) {
            const startDate = luxon_1.DateTime.fromISO(event.start_date.toISOString());
            const endDate = luxon_1.DateTime.fromISO(event.end_date.toISOString());
            const isActive = startDate <= now && now < endDate;
            const updateEventAutomatic = await configs_1.default.db.event.update({
                where: { id: event.id },
                data: { is_active: isActive },
            });
        }
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_UPDATE_DATA, true);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllEvents = async (req) => {
    try {
        const user_id = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const getAllEvent = await configs_1.default.db.event.findMany({
            where: {
                is_delete: false,
                // is_active: true,
            },
            orderBy: {
                start_date: "desc",
            },
            include: {
                coupons: true,
            },
        });
        if (!getAllEvent)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const totalRecord = await configs_1.default.db.event.count({
            where: {
                is_delete: false,
            },
        });
        const events = [];
        getAllEvent.map((item) => {
            const event = {
                event_id: item.id,
                name: item.name,
                description: item.description,
                is_delete: item.is_delete,
                is_active: item.is_active,
                start_date: luxon_1.DateTime.fromISO(item.end_date.toISOString()),
                end_date: luxon_1.DateTime.fromISO(item.start_date.toISOString()),
                coupons: item.coupons.map((cp) => {
                    return {
                        coupon_id: cp.id,
                        code: cp.code,
                        discount: cp.discount,
                        valid_start: cp.valid_start,
                        valid_until: cp.valid_until,
                        remain_quantity: cp.remain_quantity,
                        is_event: cp.is_event,
                        max_discount_money: cp.max_discount_money,
                    };
                }),
            };
            return events.push(event);
        });
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, events);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getEventById = async (req) => {
    try {
        const { event_id } = req.params;
        const user_id = Number(req.user_id);
        const isAdmin = await configs_1.default.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin)
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_UNAUTHORIZED, false);
        const getEvent = await configs_1.default.db.event.findFirst({
            where: {
                id: Number(event_id),
                is_delete: false,
            },
            include: {
                coupons: true,
            },
        });
        if (!getEvent)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_DATA_NOT_FOUND, false);
        const item = getEvent; // Đây là đối tượng trả về từ getEvent
        const event = {
            event_id: item.id,
            name: item.name,
            description: item.description,
            is_delete: item.is_delete,
            is_active: item.is_active,
            start_date: luxon_1.DateTime.fromISO(item.start_date.toISOString()),
            end_date: luxon_1.DateTime.fromISO(item.end_date.toISOString()),
            coupons: item.coupons.map((cp) => {
                return {
                    coupon_id: cp.id,
                    code: cp.code,
                    discount: cp.discount,
                    valid_start: cp.valid_start,
                    valid_until: cp.valid_until,
                    remain_quantity: cp.remain_quantity,
                    is_event: cp.is_event,
                    max_discount_money: cp.max_discount_money,
                };
            }),
        };
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, event);
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getActiveEvent = async (req) => {
    try {
        const user_id = Number(req.user_id);
        // const isAdmin = await configs.db.user.findFirst({
        //     where: {
        //         id: user_id,
        //         is_admin: true,
        //     },
        // });
        // if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const isActiveEvent = await configs_1.default.db.event.findFirst({
            where: {
                is_active: true,
                is_delete: false,
            },
        });
        if (!isActiveEvent)
            return new response_1.ResponseError(404, constants_1.default.error.ERROR_EVENT_NOT_FOUND, false);
        console.log(isActiveEvent);
        return new response_1.ResponseSuccess(200, constants_1.default.success.SUCCESS_GET_DATA, true, isActiveEvent);
    }
    catch (error) {
        console.error("Error occurred:", error);
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            return new response_1.ResponseError(400, constants_1.default.error.ERROR_BAD_REQUEST, false);
        }
        return new response_1.ResponseError(500, constants_1.default.error.ERROR_INTERNAL_SERVER, false);
    }
};
const eventService = {
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsWithPagination,
    getAllEvents,
    getEventById,
    getActiveEvent,
    updateEventsIsActiveAutomatic,
};
exports.default = eventService;
