import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types';
import InterceptorManager from './InterceptorManager';
interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>;
    response: InterceptorManager<AxiosResponse>;
}
export default class Axios {
    defaults: AxiosRequestConfig;
    interceptors: Interceptors;
    constructor(initConf: AxiosRequestConfig);
    request<T = any>(url: any, conf?: any): AxiosPromise<T>;
    get<T = any>(url: string, conf?: AxiosRequestConfig): AxiosPromise<T>;
    delete<T = any>(url: string, conf?: AxiosRequestConfig): AxiosPromise<T>;
    head<T = any>(url: string, conf?: AxiosRequestConfig): AxiosPromise<T>;
    options<T = any>(url: string, conf?: AxiosRequestConfig): AxiosPromise<T>;
    post<T = any>(url: string, data?: any, conf?: AxiosRequestConfig): AxiosPromise<T>;
    put<T = any>(url: string, data?: any, conf?: AxiosRequestConfig): AxiosPromise<T>;
    patch<T = any>(url: string, data?: any, conf?: AxiosRequestConfig): AxiosPromise<T>;
    private static _requestMethodWithoutData;
    private static _requestMethodWithData;
    private static _request;
}
export {};
