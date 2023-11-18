import { apiCaller } from "../../src/api-config";
import { ChangePassword as ChangePasswordType, UpdateInformation as UpdateInformationType } from "../types/user";

import constants from "../constants";

const changePassword = async (values: ChangePasswordType) => {
    const path = "user/change-password";

    const response = await apiCaller(constants.util.HTTP_PATCH, path, values);

    return response;
};

const getProfile = async () => {
    const path = "user/profile";

    const response = await apiCaller(constants.util.HTTP_GET, path);

    return response;
};

const updateProfile = async (values: UpdateInformationType) => {
    const path = "user/update-profile";

    const response = await apiCaller(constants.util.HTTP_PATCH, path, values);

    return response;
};

const getAuthorProfile = async (id: number) => {
    const path = `user/${id}`;

    const response = await apiCaller(constants.util.HTTP_GET, path);

    return response;
};

const UserApis = {
    changePassword,
    getProfile,
    updateProfile,
    getAuthorProfile,
};

export default UserApis;
