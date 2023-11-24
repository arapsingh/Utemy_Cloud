import { UploadFile as UploadFileType } from "../types/fileStorage";
import { apiCaller } from "../../src/api-config"
import constants from "../constants";

const uploadFile = async (values: UploadFileType) => {
    const path = "fileStorage/";

    const response = await apiCaller(constants.util.HTTP_POST, path, values);
    return response;
};

const uploadAvatar = async (values: UploadFileType) => {
    const path = "fileStorage/avatar";

    const response = await apiCaller(constants.util.HTTP_POST, path, values);
    return response;
};

const FileStorageApis = {
    uploadFile,
    uploadAvatar,
};

export default FileStorageApis;
