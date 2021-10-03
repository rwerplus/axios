import {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  Method, RejectedFn,
  ResolvedFn
} from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './InterceptorManager'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((conf: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn<T>
}

export default class Axios{
  interceptors: Interceptors
  constructor() {
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }
  request<T = any>(url:any,conf?: any): AxiosPromise<T> {
    if (typeof url === 'string') {
      if (!conf) conf = {}
      conf.url = url
    } else {
      conf = url
    }
    /*增加链式调用*/
    const chain:PromiseChain<any>[] = [{
      resolved: dispatchRequest,
      rejected: undefined
    }]
    /*请求中 先添加后执行*/
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
    /*响应中 先添加先执行*/
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })
    let promise = Promise.resolve(conf)
    while (chain.length) {
      const {resolved,rejected} = chain.shift()!
      promise = promise.then(resolved,rejected)
    }
    return promise
  }

  get<T = any>(url: string, conf?: AxiosRequestConfig): AxiosPromise<T> {
    return Axios._requestMethodWithoutData('get', url, conf)
  }

  delete<T = any>(url: string, conf?: AxiosRequestConfig): AxiosPromise<T> {
    return Axios._requestMethodWithoutData('delete', url, conf)
  }

  head<T = any>(url: string, conf?: AxiosRequestConfig): AxiosPromise<T> {
    return Axios._requestMethodWithoutData('head', url, conf)
  }

  options<T = any>(url: string, conf?: AxiosRequestConfig): AxiosPromise<T> {
    return Axios._requestMethodWithoutData('options', url, conf)
  }

  post<T = any>(url: string, data?: any, conf?: AxiosRequestConfig): AxiosPromise<T> {
    return Axios._requestMethodWithData('post', url, data, conf)
  }

  put<T = any>(url: string, data?: any, conf?: AxiosRequestConfig): AxiosPromise<T> {
    return Axios._requestMethodWithData('put', url, data, conf)
  }

  patch<T = any>(url: string, data?: any, conf?: AxiosRequestConfig): AxiosPromise<T> {
    return Axios._requestMethodWithData('patch', url, data, conf)
  }

  private static _requestMethodWithoutData(method: Method, url: string, conf?: AxiosRequestConfig) {
    return Axios._request(Object.assign(conf || {}, {
      method: method,
      url
    }))
  }

  private static _requestMethodWithData(method: Method, url: string, data?: any, conf?: AxiosRequestConfig) {
    return Axios._request(Object.assign(conf || {}, {
      method: method,
      url,
      data
    }))
  }

  private static _request<T = any>(conf: AxiosRequestConfig): AxiosPromise<T> {
    return dispatchRequest(conf)
  }
}
