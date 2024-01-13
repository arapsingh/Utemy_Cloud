"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = __importDefault(require("./auth.controller"));
const section_controller_1 = __importDefault(require("./section.controller"));
const category_controller_1 = __importDefault(require("./category.controller"));
const course_controller_1 = __importDefault(require("./course.controller"));
const user_controller_1 = __importDefault(require("./user.controller"));
const feedback_controller_1 = __importDefault(require("./feedback.controller"));
const rating_controller_1 = __importDefault(require("./rating.controller"));
const cart_controller_1 = __importDefault(require("./cart.controller"));
const invoice_controller_1 = __importDefault(require("./invoice.controller,"));
const vnpay_controller_1 = __importDefault(require("./vnpay.controller"));
const statistic_controller_1 = __importDefault(require("./statistic.controller"));
const quiz_controller_1 = __importDefault(require("./quiz.controller"));
const lecture_controller_1 = __importDefault(require("./lecture.controller"));
const test_controller_1 = __importDefault(require("./test.controller"));
const coupon_controller_1 = __importDefault(require("./coupon.controller"));
exports.default = {
    authController: new auth_controller_1.default(),
    sectionController: new section_controller_1.default(),
    userController: new user_controller_1.default(),
    categoryController: new category_controller_1.default(),
    courseController: new course_controller_1.default(),
    feedbackController: new feedback_controller_1.default(),
    ratingController: new rating_controller_1.default(),
    cartController: new cart_controller_1.default(),
    invoiceController: new invoice_controller_1.default(),
    vnpayController: new vnpay_controller_1.default(),
    statisticController: new statistic_controller_1.default(),
    quizController: new quiz_controller_1.default(),
    lectureController: new lecture_controller_1.default(),
    testController: new test_controller_1.default(),
    couponController: new coupon_controller_1.default(),
};
