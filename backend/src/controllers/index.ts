import AuthController from "./auth.controller";
import LessonController from "./lesson.controller";
import UserController from "./user.controller";
import CategoryController from "./category.controller";
import CourseController from "./course.controller";

export default {
    authController: new AuthController(),
    lessonController: new LessonController(),
    userController: new UserController(),
    categoryController: new CategoryController(),
    courseController: new CourseController(),
};
