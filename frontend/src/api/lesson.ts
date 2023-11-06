import apiCaller from "../api-config/apiCaller";
// import { AddLesson, UpdateLesson } from "../types/lesson";
const getLessonById = async (values: number) => {
    const path = `lesson/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const updateLesson = async (values: FormData) => {
    const path = `lesson`;

    const reponse = await apiCaller("PATCH", path, values);
    return reponse;
};

const createLesson = async (values: FormData) => {
    const path = `lesson`;
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const deleteLesson = async (values: number) => {
    const path = `lesson`;
    const data = {
        lesson_id: values,
    };
    const reponse = await apiCaller("DELETE", path, data);
    return reponse;
};

const lessonApis = {
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
};

export default lessonApis;
