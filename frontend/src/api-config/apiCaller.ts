import axios from "axios";
import Cookies from "js-cookie";
import constants from "../constants";
import apis from "../api";

const axiosPublic = axios.create({
    baseURL: process.env.API_APP_BASE_URL || "https://utemyvietnam.cfapps.ap21.hana.ondemand.com",
});

const axiosSecondary = axios.create({
    baseURL: "https://utemy.cfapps.ap21.hana.ondemand.com",
});

axiosPublic.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config;

        // Xử lý khi lỗi là 401 và chưa thử lại
        if (error?.response?.status === 401 && !config._retry) {
            config._retry = true;
            try {
                const response = await apis.authApis.refreshAccessToken();
                const accessToken = response.data.data.accessToken;
                if (accessToken) {
                    Cookies.set("accessToken", accessToken);
                    config.headers = {
                        ...config.headers,
                        authorization: `Bearer ${accessToken}`,
                    };
                    // Thử lại từ axiosPublic
                    return axiosPublic(config);
                }
            } catch (refreshError) {
                // Nếu thử lại từ axiosPublic không thành công, thử lại từ axiosSecondary
                try {
                    const response = await axiosSecondary(config);
                    return response;
                } catch (secondaryError) {
                    return Promise.reject(secondaryError);
                }
            }
        }

        // Xử lý khi lỗi là 404
        if (error?.response?.status === 404) {
            // Thử lại từ axiosSecondary
            try {
                const response = await axiosSecondary(config);
                return response;
            } catch (secondaryError) {
                return Promise.reject(secondaryError);
            }
        }

        // Xử lý khi có lỗi khác
        if (error.response && error.response.data.message === constants.error.ERROR_LOGIN_AGAIN) {
            Cookies.remove("refreshToken");
            Cookies.remove("accessToken");
            window.location.href = "/";
        }

        // Trả về lỗi
        return Promise.reject(error.response);
    }
);

axiosPublic.interceptors.request.use(
    async (config: any) => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
            config.headers = {
                ...config.headers,
                authorization: `Bearer ${accessToken}`,
            };
        }

        return config;
    },
    async (error) => {
        // Xử lý lỗi trong interceptor request
        if (error.response && error.response.status === 404) {
            // Kiểm tra axiosPublic có tồn tại không
            if (!axiosPublic) {
                // Nếu không, thực hiện request từ axiosSecondary
                try {
                    const response = await axiosSecondary.request(error.config);
                    return response;
                } catch (secondaryError) {
                    // Xử lý lỗi từ axiosSecondary (nếu cần)
                    return Promise.reject(secondaryError);
                }
            }
        }

        // Trả về lỗi trong trường hợp khác
        return Promise.reject(error);
    }
);


export const apiCaller = async (method: string, path: string, data?: any) => {
    const refreshToken = Cookies.get("refreshToken");
    
    // Kiểm tra xem axiosPublic có tồn tại không
    const axiosInstance = axiosPublic || axiosSecondary;

    try {
        const response = await axiosInstance({
            method,
            headers: {
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Origin": "*",
                rftoken: `rfToken ${refreshToken}`,
            },
            url: `/api/${path}`,
            data,
        });

        return response;
    } catch (error) {
        // Xử lý lỗi (nếu cần)
        return Promise.reject(error);
    }
};

export const apiCallerVnpay = async (method: string, path: string, data?: any) => {
    const refreshToken = Cookies.get("refreshToken");
    
    // Kiểm tra xem axiosPublic có tồn tại không
    const axiosInstance = axiosPublic || axiosSecondary;

    try {
        const response = await axiosInstance({
            method,
            headers: {
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Origin": "*",
                rftoken: `rfToken ${refreshToken}`,
            },
            url: `/${path}`,
            data,
        });

        return response;
    } catch (error) {
        // Xử lý lỗi (nếu cần)
        return Promise.reject(error);
    }
};


export default apiCaller;
