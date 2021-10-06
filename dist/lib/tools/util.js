"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFormData = exports.deepMerge = exports.extend = exports.isPlainObject = exports.isObject = exports.isDate = void 0;
function isDate(val) {
    return toString.call(val) === '[object Date]';
}
exports.isDate = isDate;
function isObject(val) {
    return val !== null && typeof val === 'object';
}
exports.isObject = isObject;
/**
 * Determine whether it is an ordinary object
 *
 * @param params object
 * @returns Boolean
 */
function isPlainObject(params) {
    return toString.call(params).toLowerCase() === '[object object]';
}
exports.isPlainObject = isPlainObject;
function extend(to, from) {
    for (var key in from) {
        ;
        to[key] = from[key];
    }
    return to;
}
exports.extend = extend;
exports.deepMerge = function () {
    var objS = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objS[_i] = arguments[_i];
    }
    var result = Object.create(null);
    objS.forEach(function (obj) {
        if (obj) {
            Object.keys(obj).forEach(function (key) {
                var val = obj[key];
                if (isPlainObject(val)) {
                    if (isPlainObject(result[key])) {
                        result[key] = exports.deepMerge(result[key], val);
                    }
                    else {
                        result[key] = exports.deepMerge(val);
                    }
                }
                else {
                    result[key] = val;
                }
            });
        }
    });
    return result;
};
function isFormData(val) {
    return typeof val !== 'undefined' && val instanceof FormData;
}
exports.isFormData = isFormData;
//# sourceMappingURL=util.js.map