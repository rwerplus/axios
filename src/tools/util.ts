export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

/**
 * Determine whether it is an ordinary object
 *
 * @param params object
 * @returns Boolean
 */

export function isPlainObject(params: any): params is Object {
  return toString.call(params).toLowerCase() === '[object object]'
}
