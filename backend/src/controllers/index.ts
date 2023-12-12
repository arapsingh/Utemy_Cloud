import AuthController from "./auth.controller";
import SectionController from "./section.controller";
import CategoryController from "./category.controller";
import CourseController from "./course.controller";
import UserController from "./user.controller";
import FeedbackController from "./feedback.controller";
import RatingController from "./rating.controller";
import CartController from "./cart.controller";
import InvoiceController from "./invoice.controller,";
import VnpayController from "./vnpay.controller";
import StatisticController from "./statistic.controller";
import QuizController from "./quiz.controller";
import LectureController from "./lecture.controller";
import TestController from "./test.controller";
import CouponController from "./coupon.controller";

export default {
    authController: new AuthController(),
    sectionController: new SectionController(),
    userController: new UserController(),
    categoryController: new CategoryController(),
    courseController: new CourseController(),
    feedbackController: new FeedbackController(),
    ratingController: new RatingController(),
    cartController: new CartController(),
    invoiceController: new InvoiceController(),
    vnpayController: new VnpayController(),
    statisticController: new StatisticController(),
    quizController: new QuizController(),
    lectureController: new LectureController(),
    testController: new TestController(),
    couponController: new CouponController(),
};
