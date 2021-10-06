"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xhr_1 = require("./xhr");
var url_1 = require("../tools/url");
var data_1 = require("../tools/data");
var headers_1 = require("../tools/headers");
var transform_1 = require("./transform");
function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    processConfig(config);
    return xhr_1.default(config).then(function (res) {
        return transformResponseData(res);
    });
}
exports.default = dispatchRequest;
function processConfig(config) {
    config.url = transformURL(config);
    config.headers = transformHeaders(config);
    config.data = transform_1.default(config.data, config.headers, config.transformRequest);
    config.headers = headers_1.flattenHeaders(config.headers, config.method);
}
function transformURL(config) {
    var url = config.url, params = config.params;
    return url_1.buildURL(url, params);
}
function transformRequestData(config) {
    var data = config.data;
    return data_1.transformRequest(data);
}
function transformHeaders(config) {
    var _a = config.headers, headers = _a === void 0 ? {} : _a, data = config.data;
    return headers_1.processHeaders(headers, data);
}
function transformResponseData(res) {
    res.data = transform_1.default(res.data, res.headers, res.config.transformResponse);
    return res;
}
function throwIfCancellationRequested(conf) {
    if (conf.cancelToken) {
        conf.cancelToken.throwIfRequested();
    }
}
//# sourceMappingURL=dispatchRequest.js.map