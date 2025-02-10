import axios, { AxiosInstance } from 'axios';
import { getCookie } from '../utils/auth';
import { apiBaseUrl } from './config';

export const attachInterceptors = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    // Create a separate Axios instance for the refresh token request
                    const refreshInstance = axios.create({
                        baseURL: apiBaseUrl,
                        withCredentials: true,
                    });

                    const csrfToken = getCookie('XSRF-TOKEN');
                    const { data } = await refreshInstance.post('/auth/refresh-token', {}, {
                        headers: { 'CSRF-Token': csrfToken || '' },
                    });

                    // Update the cookies with the new CSRF token if needed
                    document.cookie = `XSRF-TOKEN=${data.csrfToken}; path=/`;

                    // Update the headers of the original request
                    originalRequest.headers['CSRF-Token'] = data.csrfToken || '';

                    return axiosInstance(originalRequest);
                } catch (err) {
                    console.error('Token refresh failed:', err);
                    return Promise.reject(err);
                }
            }

            return Promise.reject(error);
        }
    );
};

// export const fetchCSRF = async (): Promise<string> => {
//     // Fetch the CSRF token from the cookie
//     const csrfToken = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('XSRF-TOKEN='))
//         ?.split('=')[1];
//     return csrfToken || '';
// };

const createAxiosInstance = async (contentType: string): Promise<AxiosInstance> => {
    const csrfToken = getCookie('XSRF-TOKEN')

    const instance = axios.create({
        baseURL: apiBaseUrl,
        headers: {
            'Content-Type': contentType,
            'CSRF-Token': csrfToken || '',
        },
        withCredentials: true,
    });

    attachInterceptors(instance);
    return instance;
};

export const getApiCallJsonInstance = () =>
	createAxiosInstance('application/json');
export const getApiCallMultipartInstance = () =>
	createAxiosInstance('multipart/form-data');

const apiCall = async (
	method: 'get' | 'post' | 'put' | 'delete',
	path: string,
	data: any = null,
	formData: boolean = false
) => {
	const instance = formData
		? await getApiCallMultipartInstance()
		: await getApiCallJsonInstance();

	try {
		const response = await instance[method](path, data);
		return response.data;
	} catch (error) {
		console.error(`Error in ${method.toUpperCase()} request:`, error);
		throw error;
	}
};

export const apiPostReq = (
	path: string,
	body: object,
	formData: boolean = false
) => apiCall('post', path, body, formData);

export const apiGetReq = (path: string, params: object, formData: boolean = false) =>
	apiCall('get', path, params, formData);

export const apiPutReq = (path: string, body: object, formData: boolean = false) =>
	apiCall('put', path, body, formData);

export const apiDeleteReq = (path: string, params: object) =>
	apiCall('delete', path, params);

// export async function apiPostReq(
// 	path: string,
// 	body: object,
// 	formData?: boolean,
// 	csrf?: string
// ): Promise<any> {
// 	const renderCsrf = csrf ? csrf : '';
// 	try {
// 		const response = await (
// 			formData
// 				? getApiCallMultipart(renderCsrf)
// 				: getApiCallJson(renderCsrf)
// 		).post(path, body);
// 		return response.data;
// 	} catch (error) {
// 		console.error('Error in POST request:', error);
// 		throw error;
// 	}
// }

// export async function apiGetReq(path: string, params: object, csrf?: string): Promise<any> {
// 	const renderCsrf = csrf ? csrf : '';
// 	try {
// 		const response = await getApiCallJson(renderCsrf).get(path, {params});
// 		return response.data;
// 	} catch (error) {
// 		// Handle error here, you can log it or throw it further
// 		console.error('Error in GET request:', error);
// 		throw error;
// 	}
// }

// export async function apiPutReq(path: string, body: object): Promise<any> {
// 	try {
// 		const response = await getApiCallJson().put(path, body);
// 		return response.data;
// 	} catch (error) {
// 		console.error('Error in Put request:', error);
// 		throw error;
// 	}
// }

// export async function apiDeleteReq(path: string, params: object): Promise<any> {
// 	try {
// 		const response = await getApiCallJson().delete(path, {params});
// 		return response.data;
// 	} catch (error) {
// 		console.error('Error in Delete request:', error);
// 		throw error;
// 	}
// }
