import apiCaller from "../api-config/apiCaller";
const getTestByTestId = async (values: number) => {
    const path = `test/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};

const testApis = {
    getTestByTestId,
};

export default testApis;
