"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenHeaders = exports.parseHeaders = exports.processHeaders = void 0;
var util_1 = require("./util");
function normalizeHeaderName(headers, normalizedName) {
    if (!headers)
        return;
    Object.keys(headers).forEach(function (name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name];
            delete headers[name];
        }
    });
}
function processHeaders(headers, data) {
    /*头部信息规范化*/
    normalizeHeaderName(headers, 'Content-Type');
    if (util_1.isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8';
        }
    }
    return headers;
}
exports.processHeaders = processHeaders;
function parseHeaders(headers) {
    /*解析头部字符串类型数据*/
    var parsed = Object.create(null);
    if (!headers)
        return parsed;
    headers.split('\r\n').forEach(function (line) {
        var _a = line.split(':'), key = _a[0], val = _a[1];
        key = key.trim().toLowerCase();
        if (!key)
            return;
        if (val) {
            val = val.trim();
        }
        parsed[key] = val;
    });
    return parsed;
}
exports.parseHeaders = parseHeaders;
function flattenHeaders(headers, method) {
    if (!headers)
        return headers;
    headers = util_1.deepMerge(headers.common, headers[method], headers);
    var methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
    methodsToDelete.forEach(function (method) {
        delete headers[method];
    });
    return headers;
}
exports.flattenHeaders = flattenHeaders;
//# sourceMappingURL=headers.js.map