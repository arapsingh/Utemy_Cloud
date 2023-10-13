import AuthController from "./auth.controller";
import UserController from "./user.controller";
import SectionController from "./section.controller";
import CourseController from "./course.controller";

export default {
    authController: new AuthController(),
    userController: new UserController(),
    sectionController: new SectionController(),
    courseController: new CourseController(),
};
