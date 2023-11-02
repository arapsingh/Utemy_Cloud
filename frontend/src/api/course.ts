import apiCaller from "../api-config/apiCaller";
import { SearchMyCourseEnrolledCourse } from "../types/course";

const createCourse = async (values: FormData) => {
    const path = "course";
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const getMyCourses = async (values: SearchMyCourseEnrolledCourse) => {
    const path = `course/my?page_index=${values.pageIndex}&search_item=${values.keyword}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getEnrolledCourses = async (values: SearchMyCourseEnrolledCourse) => {
    const path = `course/enrolled?page_index=${values.pageIndex}&search_item=${values.keyword}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const deleteCourse = async (values: number) => {
    const path = "course";
    const reponse = await apiCaller("DELETE", path, values);
    return reponse;
};
const getCourseDetail = async (values: string) => {
    const path = `course/${values}`;
    const reponse = await apiCaller("GET", path, values);
    return reponse;
};
const getRightOfCourse = async (values: number) => {
    const path = `course/right/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const courseApis = {
    createCourse,
    getMyCourses,
    getEnrolledCourses,
    deleteCourse,
    getCourseDetail,
    getRightOfCourse,
};

export default courseApis;
