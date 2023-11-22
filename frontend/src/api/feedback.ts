import apiCaller from "../api-config/apiCaller";

const getAllFeedbacks = async (values: number) => {
    const path = `feedback?page_index=${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};

const feedbackApis = {
    getAllFeedbacks,
};

export default feedbackApis;
