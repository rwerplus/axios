import { isPlainObject } from './util'
/**
 * Method of handling request parameters
 *
 *  @param {params}
 * @param {T} type
 * @return {T}
 * @api private
 */
export function transformRequest(params: any): any {
  console.log('params.',isPlainObject(params));
  
  if (isPlainObject(params)) {
    return JSON.stringify(params)
  } else {
    return params
  }
}
