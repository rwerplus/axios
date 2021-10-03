import { isPlainObject } from './util'

/**
 * Method of handling request parameters
 *
 * @return {T}
 * @api private
 * @param params
 */
export function transformRequest(params: any): any {
  if (isPlainObject(params)) {
    return JSON.stringify(params)
  } else {
    return params
  }
}

export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // doto
    }
  }
  return data
}
