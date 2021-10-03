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
