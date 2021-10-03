import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './tools/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve => {
    const { data = null, url, method = 'get', headers, responseType } = config
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url, true)
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return

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
      resolve(response)
    }
    Object.keys(headers).forEach((name: string) => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      }
      request.setRequestHeader(name, headers[name])
    })
    request.send(data)
  }))
}
