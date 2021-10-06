"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var headers_1 = require("../tools/headers");
var error_1 = require("../types/error");
var url_1 = require("../tools/url");
var cookie_1 = require("../tools/cookie");
var util_1 = require("../tools/util");
function xhr(config) {
    return new Promise(function (resolve, reject) {
        var _a = config.data, data = _a === void 0 ? null : _a, url = config.url, _b = config.method, method = _b === void 0 ? 'get' : _b, headers = config.headers, responseType = config.responseType, timeout = config.timeout, cancelToken = config.cancelToken, withCredentials = config.withCredentials, xsrfCookieName = config.xsrfCookieName, xsrfHeaderName = config.xsrfHeaderName, onDownloadProgress = config.onDownloadProgress, onUploadProgress = config.onUploadProgress;
        var request = new XMLHttpRequest();
        request.open(method.toUpperCase(), url, true);
        configureRequest();
        eventsHandle();
        processHeaders();
        processCancel();
        request.send(data);
        function configureRequest() {
            if (timeout) {
                request.timeout = timeout;
            }
            if (responseType) {
                request.responseType = responseType;
            }
            if (withCredentials) {
                request.withCredentials = withCredentials;
            }
        }
        function eventsHandle() {
            request.ontimeout = function handleTimeout() {
                reject(error_1.createError("Timeout of " + timeout + " ms exceeded", config, 'ECONNABORTED', request));
            };
            request.onerror = function handleError() {
                reject(error_1.createError('Network Error', config, null, request));
            };
            request.onreadystatechange = function handleLoad() {
                if (request.readyState !== 4)
                    return;
                if (request.status === 0)
                    return;
                var responseHeaders = headers_1.parseHeaders(request.getAllResponseHeaders());
                var responseData = responseType !== 'text' ? request.response : request.responseText;
                var response = {
                    data: responseData,
                    headers: responseHeaders,
                    status: request.status,
                    statusText: request.statusText,
                    request: request,
                    config: config
                };
                handleResponse(response);
            };
            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress;
            }
            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress;
            }
        }
        function processHeaders() {
            if (util_1.isFormData(data)) {
                delete headers['Content-Type'];
            }
            if ((withCredentials || url_1.isURLSameOrigin(url)) && xsrfCookieName) {
                var xsrfValue = cookie_1.default.read(xsrfCookieName);
                if (xsrfValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfValue;
                }
            }
            Object.keys(headers).forEach(function (name) {
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name];
                }
                request.setRequestHeader(name, headers[name]);
            });
        }
        function processCancel() {
            if (cancelToken) {
                cancelToken.promise.then(function (reason) {
                    request.abort();
                    reject(reason);
                });
            }
        }
        function handleResponse(response) {
            if (response.status >= 200 && response.status < 300) {
                resolve(response);
            }
            else {
                reject(error_1.createError("Request failed with status code " + response.status, config, null, request, response));
            }
        }
    });
}
exports.default = xhr;
//# sourceMappingURL=xhr.js.map