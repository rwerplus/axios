import { AxiosPromise, AxiosRequestConfig, Method } from '../types'
import dispatchRequest from './dispatchRequest'

export default class Axios {
  request(conf: AxiosRequestConfig): AxiosPromise {
    return dispatchRequest(conf)
  }

  get(url: string, conf?: AxiosRequestConfig): AxiosPromise {
    return Axios._requestMethodWithoutData('get', url, conf)

  }

  delete(url: string, conf?: AxiosRequestConfig): AxiosPromise {
    return Axios._requestMethodWithoutData('delete', url, conf)
  }

  head(url: string, conf?: AxiosRequestConfig): AxiosPromise {
    return Axios._requestMethodWithoutData('head', url, conf)
  }

  options(url: string, conf?: AxiosRequestConfig): AxiosPromise {
    return Axios._requestMethodWithoutData('options', url, conf)
  }

  post(url: string, data?: any, conf?: AxiosRequestConfig): AxiosPromise {
    return Axios._requestMethodWithData('post', url, data, conf)
  }
  put(url: string, data?: any, conf?: AxiosRequestConfig): AxiosPromise {
    return Axios._requestMethodWithData('put', url, data, conf)
  }
  patch(url: string, data?: any, conf?: AxiosRequestConfig): AxiosPromise {
    return Axios._requestMethodWithData('patch', url, data, conf)
  }

  static _requestMethodWithoutData(method: Method, url: string, conf?: AxiosRequestConfig) {
    return Axios._request(Object.assign(conf || {}, {
      method: method,
      url
    }))
  }

  static _requestMethodWithData(method: Method, url: string, data?: any, conf?: AxiosRequestConfig) {
    return Axios._request(Object.assign(conf || {}, {
      method: method,
      url,
      data
    }))
  }

  private static _request(conf: AxiosRequestConfig): AxiosPromise {
    return dispatchRequest(conf)
  }
}
