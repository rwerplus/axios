import { AxiosPromise, AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './tools/url'
import { transformRequest } from './tools/data'
import { processHeaders } from './tools/headers'

function axios(config: AxiosRequestConfig): AxiosPromise {
  // TODO: do something
  processConfig(config)
  return xhr(config)
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformURL(config)
  config.headers = transformHeaders(config)
  config.data = transformReuqestData(config)
}

function transformURL(config: AxiosRequestConfig) {
  const { url, params } = config
  return buildURL(url, params)
}

function transformReuqestData(config: AxiosRequestConfig) {
  const { data } = config
  return transformRequest(data)
}

function transformHeaders(config: AxiosRequestConfig) {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

export default axios
