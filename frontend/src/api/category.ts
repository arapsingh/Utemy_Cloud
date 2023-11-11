import apiCaller from "../api-config/apiCaller";

const get5Categories = async () => {
    const path = "category/top5";

    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getCategories = async () => {
    const path = "category/full";

    const reponse = await apiCaller("GET", path);
    return reponse;
};

const categoryApis = {
    get5Categories,
    getCategories,
};

export default categoryApis;
