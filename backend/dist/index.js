"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const configs_1 = __importDefault(require("./src/configs"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./src/routes"));
const app = (0, express_1.default)();
const port = configs_1.default.general.PORT;
// Chỉ định cấu hình CORS
const corsOptions = {
    origin: "*", // Chỉ cho phép yêu cầu từ trang web này
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Các phương thức được phép
    credentials: true, // Cho phép sử dụng cookie hoặc header xác thực
    optionsSuccessStatus: 200, // Mã trạng thái cho các yêu cầu OPTIONS thành công
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use("/api/auth", routes_1.default.authRouter);
app.use("/api/user", routes_1.default.userRouter);
app.use("/api/section", routes_1.default.sectionRouter);
app.use("/api/course", routes_1.default.courseRouter);
app.use("/api/category", routes_1.default.categoryRouter);
app.use("/api/feedback", routes_1.default.feedbackRouter);
app.use("/api/rating", routes_1.default.ratingRouter);
app.use("/api/cart", routes_1.default.cartRouter);
app.use("/api/invoice", routes_1.default.invoiceRouter);
app.use("/api/stat", routes_1.default.statRouter);
app.use("/api/quiz", routes_1.default.quizRouter);
app.use("/api/lecture", routes_1.default.lectureRouter);
app.use("/api/test", routes_1.default.testRouter);
app.use("/api/coupon", routes_1.default.couponRouter);
app.use("/IPN", routes_1.default.vnpayRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
