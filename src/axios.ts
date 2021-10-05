import { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './tools/util'
import defaults from './defaults'

function createInstance(conf:AxiosRequestConfig): AxiosInstance {
  const context = new Axios(conf)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance(defaults)
export default axios
