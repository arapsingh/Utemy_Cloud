import axios from "axios";
import Cookies from "js-cookie";
import constants from "../constants";
import apis from "../api";

const createAxiosInstance = (baseURL: string | undefined) => {
    const instance = axios.create({
        baseURL: baseURL,
    });

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
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
                    return instance(config);
                }
            }
            if (error) {
                if (error.response.data.message === constants.error.ERROR_LOGIN_AGAIN) {
                    Cookies.remove("refreshToken");
                    Cookies.remove("accessToken");
                    window.location.href = "/";
                }
                // If the URL is not found, try the alternate URL
                if (error.response.status === 404) {
                    const alternateURL = baseURL === process.env.API_APP_BASE_URL
                        ? process.env.API_APP_ALTERNATE_URL
                        : process.env.API_APP_BASE_URL;
                    return createAxiosInstance(alternateURL)(config);
                }
                return Promise.reject(error.response);
            }
        }
    );

    instance.interceptors.request.use(
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
        (error) => Promise.reject(error)
    );

    return instance;
};

// Use createAxiosInstance to create the axiosPublic instance
export const axiosPublic = createAxiosInstance(process.env.API_APP_BASE_URL || "https://utemyvietnam.cfapps.ap21.hana.ondemand.com");

export const apiCaller = (method: string, path: string, data?: any) => {
    const refreshToken = Cookies.get("refreshToken");
    return axiosPublic({
        method,
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            rftoken: `rfToken ${refreshToken}`,
        },
        url: `/api/${path}`,
        data,
    });
};

export const apiCallerVnpay = (method: string, path: string, data?: any) => {
    const refreshToken = Cookies.get("refreshToken");
    return axiosPublic({
        method,
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            rftoken: `rfToken ${refreshToken}`,
        },
        url: `/${path}`,
        data,
    });
};

export default apiCaller;
