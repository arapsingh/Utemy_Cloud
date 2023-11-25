import AuthController from "./auth.controller";
import SectionController from "./section.controller";
import LessonController from "./lesson.controller";
import CategoryController from "./category.controller";
import CourseController from "./course.controller";
import UserController from "./user.controller";
import FeedbackController from "./feedback.controller";
import RatingController from "./rating.controller";
import CartController from "./cart.controller";
import InvoiceController from "./invoice.controller,";
import VnpayController from "./vnpay.controller";
import StatisticController from "./statistic.controller";

export default {
    authController: new AuthController(),
    sectionController: new SectionController(),
    lessonController: new LessonController(),
    userController: new UserController(),
    categoryController: new CategoryController(),
    courseController: new CourseController(),
    feedbackController: new FeedbackController(),
    ratingController: new RatingController(),
    cartController: new CartController(),
    invoiceController: new InvoiceController(),
    vnpayController: new VnpayController(),
    statisticController: new StatisticController(),
};
