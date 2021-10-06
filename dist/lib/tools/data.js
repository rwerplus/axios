"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformResponse = exports.transformRequest = void 0;
var util_1 = require("./util");
/**
 * Method of handling request parameters
 *
 * @return {T}
 * @api private
 * @param params
 */
function transformRequest(params) {
    if (util_1.isPlainObject(params)) {
        return JSON.stringify(params);
    }
    else {
        return params;
    }
}
exports.transformRequest = transformRequest;
function transformResponse(data) {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            // doto
        }
    }
    return data;
}
exports.transformResponse = transformResponse;
//# sourceMappingURL=data.js.map