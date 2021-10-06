import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../tools/headers'
import { createError } from '../types/error'
import { isURLSameOrigin } from '../tools/url'
import cookie from '../tools/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout, cancelToken,withCredentials,xsrfCookieName,xsrfHeaderName } = config
    const request = new XMLHttpRequest()

    if (timeout) {
      request.timeout = timeout
    }
    if (responseType) {
      request.responseType = responseType
    }
    if (withCredentials) {
      request.withCredentials = withCredentials
    }
    request.open(method.toUpperCase(), url!, true)
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return
      if (request.status === 0) return

      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        headers: responseHeaders,
        status: request.status,
        statusText: request.statusText,
        request,
        config
      }
      handleResponse(response)
    }
    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }
    if((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
      const xsrfValue = cookie.read(xsrfCookieName)
      if(xsrfValue && xsrfHeaderName) {
        headers[xsrfHeaderName] = xsrfValue
      }
    }

    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }
    Object.keys(headers).forEach((name: string) => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      }
      request.setRequestHeader(name, headers[name])
    })
    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      })
    }
    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(createError(`Request failed with status code ${response.status}`, config, null, request, response))
      }
    }
  }))
}
