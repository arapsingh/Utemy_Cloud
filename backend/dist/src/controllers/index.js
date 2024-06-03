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
const approval_controller_1 = __importDefault(require("./approval.controller"));
const decision_controller_1 = __importDefault(require("./decision.controller"));
const report_controller_1 = __importDefault(require("./report.controller"));
const event_controller_1 = __importDefault(require("./event.controller"));
const progress_controller_1 = __importDefault(require("./progress.controller"));
const comment_controller_1 = __importDefault(require("./comment.controller"));
const replycomment_controller_1 = __importDefault(require("./replycomment.controller"));
const reaction_controller_1 = __importDefault(require("./reaction.controller"));
const certifier_controller_1 = __importDefault(require("./certifier.controller"));
const blog_controller_1 = __importDefault(require("./blog.controller"));
const commentblog_controller_1 = __importDefault(require("./commentblog.controller"));
const reactioncommentblog_controller_1 = __importDefault(require("./reactioncommentblog.controller"));
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
    approvalController: new approval_controller_1.default(),
    decisionController: new decision_controller_1.default(),
    reportController: new report_controller_1.default(),
    eventController: new event_controller_1.default(),
    progressController: new progress_controller_1.default(),
    commentController: new comment_controller_1.default(),
    replyCommentController: new replycomment_controller_1.default(),
    reactionController: new reaction_controller_1.default(),
    certifierController: new certifier_controller_1.default(),
    blogController: new blog_controller_1.default(),
    commentBlogController: new commentblog_controller_1.default(),
    reactionCommentBlogController: new reactioncommentblog_controller_1.default(),
};
