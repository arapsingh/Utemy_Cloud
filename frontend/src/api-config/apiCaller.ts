import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import Cookies from "js-cookie";
import constants from "../constants";
import apis from "../api";

const axiosPublic = axios.create({
    baseURL: process.env.API_APP_BASE_URL || "https://utemyvietnam.cfapps.ap21.hana.ondemand.com",
});
const axiosAlter = axios.create({
    baseURL: process.env.API_APP_ALTERNATE_URL || "https://utemy.cfapps.ap21.hana.ondemand.com",
});
// const axiosInstance = axios.create();
const checkUrlExists = async (url: any) => {
    try {
        // Thực hiện HEAD request để kiểm tra tồn tại của URL
        await axios.head(url);
        return true; // Nếu không có lỗi, URL tồn tại
    } catch (error) {
        return false; // Nếu có lỗi, URL không tồn tại
    }
};
// Hàm xử lý lỗi trong interceptor của axiosPublic
const handleResponseError = async (error: any) => {
    const config = error?.config;
    if (error?.response?.status === 401 && !config?._retry) {
        config._retry = true;
        const response = await apis.authApis.refreshAccessToken();
        const accessToken = response?.data?.data?.accessToken; // Add null checks
        if (accessToken) {
            Cookies.set("accessToken", accessToken);
            config.headers = {
                ...config.headers,
                authorization: `Bearer ${accessToken}`,
            };

            // Check the baseURL and return the appropriate axios instance
            const isAlterUrlExists = await checkUrlExists(axiosAlter.defaults.baseURL);
            if (isAlterUrlExists && config?.baseURL === axiosPublic.defaults.baseURL) {
                return axiosAlter(config);
            } else {
                return axiosPublic(config);
            }
        }
    }
    if (error) {
        if (error?.response?.data?.message === constants.error.ERROR_LOGIN_AGAIN) {
            Cookies.remove("refreshToken");
            Cookies.remove("accessToken");
            window.location.href = "/";
        }
        return Promise.reject(error?.response);
    }
};

// Interceptor xử lý response
axiosPublic.interceptors.response.use((response) => response, handleResponseError);
axiosAlter.interceptors.response.use((response) => response, handleResponseError);
interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
    headers: AxiosRequestHeaders;
}

// Hàm kiểm tra tồn tại của URL và thực hiện interceptor
const requestInterceptor = async (config: AxiosRequestConfig): Promise<AdaptAxiosRequestConfig> => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
        config.headers = {
            ...config.headers,
            authorization: `Bearer ${accessToken}`,
        };
    }

    // Kiểm tra xem URL có tồn tại không trước khi thực hiện request interceptor
    const isAlterUrlExists = await checkUrlExists(axiosAlter.defaults.baseURL);

    // Thực hiện interceptor theo điều kiện
    if (isAlterUrlExists && config.baseURL === axiosPublic.defaults.baseURL) {
        return axiosAlter(config);
    } else {
        return axiosPublic(config);
    }
};

// Thêm interceptor cho request
axios.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));

// Hàm gọi API với khả năng retry
export const apiCaller = async (method: string, path: string, data?: any) => {
    const refreshToken = Cookies.get("refreshToken");

    // Kiểm tra xem URL có tồn tại không
    const isAlterUrlExists = await checkUrlExists(axiosAlter.defaults.baseURL);

    return await axios({
        method,
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            rftoken: `rfToken ${refreshToken}`,
        },
        url: isAlterUrlExists
            ? `${axiosAlter.defaults.baseURL}/api/${path}`
            : `${axiosPublic.defaults.baseURL}/api/${path}`,
        data,
    });
};

// Hàm gọi API cho Vnpay
export const apiCallerVnpay = async (method: string, path: string, data?: any) => {
    const refreshToken = Cookies.get("refreshToken");
    const isAlterUrlExists = await checkUrlExists(axiosAlter.defaults.baseURL);

    return await axios({
        method,
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            rftoken: `rfToken ${refreshToken}`,
        },
        url: isAlterUrlExists ? `${axiosAlter.defaults.baseURL}/${path}` : `${axiosPublic.defaults.baseURL}/${path}`,
        data,
    });
};

export default apiCaller;
