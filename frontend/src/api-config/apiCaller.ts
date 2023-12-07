import axios from "axios";
import Cookies from "js-cookie";
import constants from "../constants";
import apis from "../api";

const axiosPublic = axios.create({
    baseURL: process.env.API_APP_BASE_URL || "https://utemyvietnam.cfapps.ap21.hana.ondemand.com",
});
const axiosAlter = axios.create({
    baseURL: process.env.API_APP_ALTERNATE_URL || "https://utemy.cfapps.ap21.hana.ondemand.com",
});
// Hàm xử lý lỗi trong interceptor của axiosPublic
const handleResponseError = async (error: any) => {
    const config = error?.config;
    if (error?.response?.status === 401 && !config._retry) {
        config._retry = true;
        const response = await apis.authApis.refreshAccessToken();
        const accessToken = response.data.data.accessToken;
        if (accessToken) {
            Cookies.set("accessToken", accessToken);
            config.headers = {
                ...config.headers,
                authorization: `Bearer ${accessToken}`,
            };
            if (config.baseURL === axiosPublic.defaults.baseURL) {
                return axiosAlter(config);
            } else {
                return axiosPublic(config);
            }
        }
    }
    if (error) {
        if (error.response.data.message === constants.error.ERROR_LOGIN_AGAIN) {
            Cookies.remove("refreshToken");
            Cookies.remove("accessToken");
            window.location.href = "/";
        }
        return Promise.reject(error.response);
    }
};

// Interceptor xử lý response
axiosPublic.interceptors.response.use((response) => response, handleResponseError);
axiosAlter.interceptors.response.use((response) => response, handleResponseError);

// Interceptor xử lý request
const requestInterceptor = (config: any) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
        config.headers = {
            ...config.headers,
            authorization: `Bearer ${accessToken}`,
        };
    }
    return config;
};

axiosPublic.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
axiosAlter.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));

// Hàm gọi API với khả năng retry
export const apiCaller = async (method: string, path: string, data?: any) => {
    try {
        const refreshToken = Cookies.get("refreshToken");
        return await axiosPublic({
            method,
            headers: {
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Origin": "*",
                rftoken: `rfToken ${refreshToken}`,
            },
            url: `/api/${path}`,
            data,
        });
    } catch (error: any) {
        // Nếu URL không được tìm thấy, thử lại với URL khác
        if (error?.response && error?.response.status === 404) {
            const refreshToken = Cookies.get("refreshToken");
            return await axiosAlter({
                method,
                headers: {
                    "Access-Control-Allow-Credentials": true,
                    "Access-Control-Allow-Origin": "*",
                    rftoken: `rfToken ${refreshToken}`,
                },
                url: `/api/${path}`,
                data,
            });
        }
        throw error;
    }
};

// Hàm gọi API cho Vnpay
export const apiCallerVnpay = async (method: string, path: string, data?: any) => {
    try {
        const refreshToken = Cookies.get("refreshToken");
        return await axiosPublic({
            method,
            headers: {
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Origin": "*",
                rftoken: `rfToken ${refreshToken}`,
            },
            url: `/${path}`,
            data,
        });
    } catch (error: any) {
        // Nếu URL không được tìm thấy, thử lại với URL khác
        if (error?.response && error?.response.status === 404) {
            const refreshToken = Cookies.get("refreshToken");
            return await axiosAlter({
                method,
                headers: {
                    "Access-Control-Allow-Credentials": true,
                    "Access-Control-Allow-Origin": "*",
                    rftoken: `rfToken ${refreshToken}`,
                },
                url: `/${path}`,
                data,
            });
        }
        throw error;
    }
};

export default apiCaller;
