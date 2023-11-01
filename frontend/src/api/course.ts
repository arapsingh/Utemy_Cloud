import apiCaller from "../api-config/apiCaller";
// import { NewCourse } from "../types/course";

const createCourse = async (values: FormData) => {
    const path = "course";
    // console.log(values);
    // const data: NewCourse = {
    //     title: values.title,
    //     slug: values.slug,
    //     description: values.description,
    //     summary: values.summary,
    //     categories: values.categories,
    //     status: values.status,
    //     thumbnail: values.thumbnail,
    //     price: values.price,
    // };

    const reponse = await apiCaller("POST", path, values);
    return reponse;
};

const courseApis = {
    createCourse,
};

export default courseApis;
