"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatchRequest_1 = require("./dispatchRequest");
var InterceptorManager_1 = require("./InterceptorManager");
var mergeConfig_1 = require("./mergeConfig");
var Axios = /** @class */ (function () {
    function Axios(initConf) {
        this.defaults = initConf;
        this.interceptors = {
            request: new InterceptorManager_1.default(),
            response: new InterceptorManager_1.default()
        };
    }
    Axios.prototype.request = function (url, conf) {
        if (typeof url === 'string') {
            if (!conf)
                conf = {};
            conf.url = url;
        }
        else {
            conf = url;
        }
        /*发送请求前使用合并策略合并请求头*/
        conf = mergeConfig_1.mergeConfig(this.defaults, conf);
        /*增加链式调用*/
        var chain = [{
                resolved: dispatchRequest_1.default,
                rejected: undefined
            }];
        /*请求中 先添加后执行*/
        this.interceptors.request.forEach(function (interceptor) {
            chain.unshift(interceptor);
        });
        /*响应中 先添加先执行*/
        this.interceptors.response.forEach(function (interceptor) {
            chain.push(interceptor);
        });
        var promise = Promise.resolve(conf);
        while (chain.length) {
            var _a = chain.shift(), resolved = _a.resolved, rejected = _a.rejected;
            promise = promise.then(resolved, rejected);
        }
        return promise;
    };
    Axios.prototype.get = function (url, conf) {
        return Axios._requestMethodWithoutData('get', url, conf);
    };
    Axios.prototype.delete = function (url, conf) {
        return Axios._requestMethodWithoutData('delete', url, conf);
    };
    Axios.prototype.head = function (url, conf) {
        return Axios._requestMethodWithoutData('head', url, conf);
    };
    Axios.prototype.options = function (url, conf) {
        return Axios._requestMethodWithoutData('options', url, conf);
    };
    Axios.prototype.post = function (url, data, conf) {
        return Axios._requestMethodWithData('post', url, data, conf);
    };
    Axios.prototype.put = function (url, data, conf) {
        return Axios._requestMethodWithData('put', url, data, conf);
    };
    Axios.prototype.patch = function (url, data, conf) {
        return Axios._requestMethodWithData('patch', url, data, conf);
    };
    Axios._requestMethodWithoutData = function (method, url, conf) {
        return Axios._request(Object.assign(conf || {}, {
            method: method,
            url: url
        }));
    };
    Axios._requestMethodWithData = function (method, url, data, conf) {
        return Axios._request(Object.assign(conf || {}, {
            method: method,
            url: url,
            data: data
        }));
    };
    Axios._request = function (conf) {
        return dispatchRequest_1.default(conf);
    };
    return Axios;
}());
exports.default = Axios;
//# sourceMappingURL=Axios.js.map