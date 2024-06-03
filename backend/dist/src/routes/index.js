"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_router_1 = __importDefault(require("./auth.router"));
const user_router_1 = __importDefault(require("./user.router"));
const section_router_1 = __importDefault(require("./section.router"));
const category_router_1 = __importDefault(require("./category.router"));
const course_router_1 = __importDefault(require("./course.router"));
const feedback_router_1 = __importDefault(require("./feedback.router"));
const rating_router_1 = __importDefault(require("./rating.router"));
const cart_router_1 = __importDefault(require("./cart.router"));
const invoice_router_1 = __importDefault(require("./invoice.router"));
const vnpay_router_1 = __importDefault(require("./vnpay.router"));
const statistic_router_1 = __importDefault(require("./statistic.router"));
const quiz_router_1 = __importDefault(require("./quiz.router"));
const lecture_router_1 = __importDefault(require("./lecture.router"));
const test_router_1 = __importDefault(require("./test.router"));
const coupon_router_1 = __importDefault(require("./coupon.router"));
const approval_router_1 = __importDefault(require("./approval.router"));
const decision_router_1 = __importDefault(require("./decision.router"));
const report_router_1 = __importDefault(require("./report.router"));
const event_router_1 = __importDefault(require("./event.router"));
const progress_router_1 = __importDefault(require("./progress.router"));
const comment_router_1 = __importDefault(require("./comment.router"));
const replycomment_router_1 = __importDefault(require("./replycomment.router"));
const reaction_router_1 = __importDefault(require("./reaction.router"));
const certifier_router_1 = __importDefault(require("./certifier.router"));
const blog_router_1 = __importDefault(require("./blog.router"));
const commentblog_router_1 = __importDefault(require("./commentblog.router"));
const reactioncommentblog_router_1 = __importDefault(require("./reactioncommentblog.router"));
exports.default = {
    authRouter: auth_router_1.default,
    userRouter: user_router_1.default,
    sectionRouter: section_router_1.default,
    categoryRouter: category_router_1.default,
    courseRouter: course_router_1.default,
    feedbackRouter: feedback_router_1.default,
    ratingRouter: rating_router_1.default,
    cartRouter: cart_router_1.default,
    invoiceRouter: invoice_router_1.default,
    vnpayRouter: vnpay_router_1.default,
    statRouter: statistic_router_1.default,
    quizRouter: quiz_router_1.default,
    lectureRouter: lecture_router_1.default,
    testRouter: test_router_1.default,
    couponRouter: coupon_router_1.default,
    decisionRouter: decision_router_1.default,
    approvalRouter: approval_router_1.default,
    reportRouter: report_router_1.default,
    eventRouter: event_router_1.default,
    progressRouter: progress_router_1.default,
    commentRouter: comment_router_1.default,
    replyCommentRouter: replycomment_router_1.default,
    reactionRouter: reaction_router_1.default,
    certifierRouter: certifier_router_1.default,
    blogRouter: blog_router_1.default,
    commentBlogRouter: commentblog_router_1.default,
    reactionCommentBlogRouter: reactioncommentblog_router_1.default,
};
