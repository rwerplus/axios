export declare function isDate(val: any): val is Date;
export declare function isObject(val: any): val is Object;
/**
 * Determine whether it is an ordinary object
 *
 * @param params object
 * @returns Boolean
 */
export declare function isPlainObject(params: any): params is Object;
export declare function extend<T, K>(to: T, from: K): T & K;
export declare const deepMerge: (...objS: any[]) => any;
export declare function isFormData(val: any): val is FormData;
