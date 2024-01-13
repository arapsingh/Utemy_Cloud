"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_services_1 = __importDefault(require("./auth.services"));
const user_services_1 = __importDefault(require("./user.services"));
const section_services_1 = __importDefault(require("./section.services"));
const course_services_1 = __importDefault(require("./course.services"));
const lesson_services_1 = __importDefault(require("./lesson.services"));
const category_services_1 = __importDefault(require("./category.services"));
const feedback_services_1 = __importDefault(require("./feedback.services"));
const rating_services_1 = __importDefault(require("./rating.services"));
const cart_services_1 = __importDefault(require("./cart.services"));
const vnpay_services_1 = __importDefault(require("./vnpay_services"));
const invoice_services_1 = __importDefault(require("./invoice.services"));
const statistic_services_1 = __importDefault(require("./statistic.services"));
const quiz_services_1 = __importDefault(require("./quiz.services"));
const lecture_services_1 = __importDefault(require("./lecture.services"));
const test_services_1 = __importDefault(require("./test.services"));
const coupon_services_1 = __importDefault(require("./coupon.services"));
exports.default = {
    AuthServices: auth_services_1.default,
    UserService: user_services_1.default,
    SectionService: section_services_1.default,
    CourseService: course_services_1.default,
    LessonServices: lesson_services_1.default,
    CategoryServices: category_services_1.default,
    FeedbackServices: feedback_services_1.default,
    RatingServices: rating_services_1.default,
    CartServices: cart_services_1.default,
    VnpayServices: vnpay_services_1.default,
    InvoiceServices: invoice_services_1.default,
    StatisticServices: statistic_services_1.default,
    QuizServices: quiz_services_1.default,
    LectureServices: lecture_services_1.default,
    TestServices: test_services_1.default,
    CouponServices: coupon_services_1.default,
};
