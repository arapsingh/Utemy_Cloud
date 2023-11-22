import apiCaller from "../api-config/apiCaller";
import { GetAllUser, CreateNewUser, UpdateInformation as UpdateInformationType } from "../types/user";

const getAllUsersWithPagination = async (values: GetAllUser) => {
    const path = `user/all?search_item=${values.searchItem}&page_index=${values.pageIndex}&role=${values.role}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const deleteUser = async (values: number) => {
    const path = `user/${values}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const createNewUser = async (values: CreateNewUser) => {
    const path = `user/`;
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const getProfile = async () => {
    const path = "user/profile";

    const response = await apiCaller("GET", path);

    return response;
};

const updateProfile = async (values: UpdateInformationType) => {
    const path = "user/update-profile";

    const response = await apiCaller("PATCH", path, values);

    return response;
};

const getAuthorProfile = async (id: number) => {
    const path = `user/${id}`;

    const response = await apiCaller("GET", path);

    return response;
};

const changeAvatar = async (formData: FormData) => {
    const path = `user/avatar`;
    // Tạo một FormData và thêm file vào đó
    try {
        const response = await apiCaller("POST", path, formData);
        return response;
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error:", error);
    }
};

const userApis = {
    getAllUsersWithPagination,
    deleteUser,
    createNewUser,
    getProfile,
    updateProfile,
    getAuthorProfile,
    changeAvatar,
};

export default userApis;
