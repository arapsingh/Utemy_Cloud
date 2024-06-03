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
const approval_services_1 = __importDefault(require("./approval.services"));
const decision_services_1 = __importDefault(require("./decision.services"));
const report_services_1 = __importDefault(require("./report.services"));
const event_services_1 = __importDefault(require("./event.services"));
const progress_services_1 = __importDefault(require("./progress.services"));
const comment_services_1 = __importDefault(require("./comment.services"));
const replycomment_services_1 = __importDefault(require("./replycomment.services"));
const reaction_services_1 = __importDefault(require("./reaction.services"));
const certifier_services_1 = __importDefault(require("./certifier.services"));
const blog_services_1 = __importDefault(require("./blog.services"));
const commentblog_services_1 = __importDefault(require("./commentblog.services"));
const reactioncommentblog_services_1 = __importDefault(require("./reactioncommentblog.services"));
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
    ApprovalServices: approval_services_1.default,
    DecisionServices: decision_services_1.default,
    ReportServices: report_services_1.default,
    EventServices: event_services_1.default,
    ProgressServices: progress_services_1.default,
    CommentServices: comment_services_1.default,
    ReplyCommentServices: replycomment_services_1.default,
    ReactionServices: reaction_services_1.default,
    CertifierServices: certifier_services_1.default,
    BlogService: blog_services_1.default,
    CommentBlogService: commentblog_services_1.default,
    ReactionCommentBlogServices: reactioncommentblog_services_1.default,
};
