import { AxiosRequestConfig } from './types/index'
import xhr from './xhr'
import { buildURL } from './tools/url'
function axios(config: AxiosRequestConfig) {
  // TODO: do something
  processConfig(config)
  xhr(config)
}
function processConfig(config: AxiosRequestConfig) {
  config.url = transformURL(config)
}
function transformURL(config: AxiosRequestConfig) {
  const { url, params } = config
  return buildURL(url, params)
}

export default axios
