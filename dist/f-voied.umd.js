(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.axios = factory());
}(this, (function () { 'use strict';

  function isDate(val) {
      return toString.call(val) === '[object Date]';
  }
  /**
   * Determine whether it is an ordinary object
   *
   * @param params object
   * @returns Boolean
   */
  function isPlainObject(params) {
      return toString.call(params).toLowerCase() === '[object object]';
  }
  function extend(to, from) {
      for (var key in from) {
          to[key] = from[key];
      }
      return to;
  }
  var deepMerge = function () {
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
                          result[key] = deepMerge(result[key], val);
                      }
                      else {
                          result[key] = deepMerge(val);
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
      if (isPlainObject(data)) {
          if (headers && !headers['Content-Type']) {
              headers['Content-Type'] = 'application/json;charset=utf-8';
          }
      }
      return headers;
  }
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
  function flattenHeaders(headers, method) {
      if (!headers)
          return headers;
      headers = deepMerge(headers.common, headers[method], headers);
      var methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
      methodsToDelete.forEach(function (method) {
          delete headers[method];
      });
      return headers;
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var AxiosError = /** @class */ (function (_super) {
      __extends(AxiosError, _super);
      function AxiosError(message, config, code, request, response) {
          var _this = _super.call(this, message) || this;
          _this.config = config;
          _this.code = code;
          _this.request = request;
          _this.response = response;
          _this.isAxiosError = true;
          Object.setPrototypeOf(_this, AxiosError.prototype);
          return _this;
      }
      return AxiosError;
  }(Error));
  function createError(message, config, code, request, response) {
      return new AxiosError(message, config, code, request, response);
  }

  function encode(val) {
      return encodeURIComponent(val)
          .replace(/%40/g, '@')
          .replace(/%3A/gi, ':')
          .replace(/%24/g, '$')
          .replace(/%2C/gi, ',')
          .replace(/%20/g, '+')
          .replace(/%5B/gi, '[')
          .replace(/%5D/gi, ']');
  }
  function buildURL(url, params) {
      if (!params)
          return url;
      var parts = [];
      Object.keys(params).forEach(function (key) {
          var val = params[key];
          if (val === null || typeof val === 'undefined') {
              return;
          }
          var values = [];
          if (Array.isArray(val)) {
              values = val;
              key += '[]';
          }
          else {
              values = [val];
          }
          values.forEach(function (val) {
              if (isDate(val)) {
                  val = val.toISOString();
              }
              else if (isPlainObject(val)) {
                  val = JSON.stringify(val);
              }
              parts.push(encode(key) + "=" + encode(val));
          });
      });
      var serializedParams = parts.join('&');
      if (serializedParams) {
          var markIndex = url.indexOf('#');
          if (markIndex !== -1) {
              url = url.slice(0, markIndex);
          }
          url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }
      return url;
  }
  var isURLSameOrigin = function (requestURL) {
      var parseOrigin = resolveURL(requestURL);
      return parseOrigin.protocol === currentOrigin.protocol && parseOrigin.host === currentOrigin.host;
  };
  var urlParsingNode = document.createElement('a');
  var currentOrigin = resolveURL(window.location.href);
  function resolveURL(url) {
      urlParsingNode.setAttribute('href', url);
      var protocol = urlParsingNode.protocol, host = urlParsingNode.host;
      return { protocol: protocol, host: host };
  }

  var cookie = {
      read: function (name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return match ? decodeURIComponent(match[3]) : null;
      }
  };

  function xhr(config) {
      return new Promise(function (resolve, reject) {
          var _a = config.data, data = _a === void 0 ? null : _a, url = config.url, _b = config.method, method = _b === void 0 ? 'get' : _b, headers = config.headers, responseType = config.responseType, timeout = config.timeout, cancelToken = config.cancelToken, withCredentials = config.withCredentials, xsrfCookieName = config.xsrfCookieName, xsrfHeaderName = config.xsrfHeaderName, onDownloadProgress = config.onDownloadProgress, onUploadProgress = config.onUploadProgress;
          var request = new XMLHttpRequest();
          request.open(method.toUpperCase(), url, true);
          configureRequest();
          eventsHandle();
          processHeaders$$1();
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
                  reject(createError("Timeout of " + timeout + " ms exceeded", config, 'ECONNABORTED', request));
              };
              request.onerror = function handleError() {
                  reject(createError('Network Error', config, null, request));
              };
              request.onreadystatechange = function handleLoad() {
                  if (request.readyState !== 4)
                      return;
                  if (request.status === 0)
                      return;
                  var responseHeaders = parseHeaders(request.getAllResponseHeaders());
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
          function processHeaders$$1() {
              if (isFormData(data)) {
                  delete headers['Content-Type'];
              }
              if ((withCredentials || isURLSameOrigin(url)) && xsrfCookieName) {
                  var xsrfValue = cookie.read(xsrfCookieName);
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
                  reject(createError("Request failed with status code " + response.status, config, null, request, response));
              }
          }
      });
  }

  /**
   * Method of handling request parameters
   *
   * @return {T}
   * @api private
   * @param params
   */
  function transformRequest(params) {
      if (isPlainObject(params)) {
          return JSON.stringify(params);
      }
      else {
          return params;
      }
  }
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

  function transform(data, headers, fns) {
      if (!fns)
          return data;
      if (!Array.isArray(fns))
          fns = [fns];
      fns.forEach(function (fn) {
          data = fn(data, headers);
      });
      return data;
  }

  function dispatchRequest(config) {
      throwIfCancellationRequested(config);
      processConfig(config);
      return xhr(config).then(function (res) {
          return transformResponseData(res);
      });
  }
  function processConfig(config) {
      config.url = transformURL(config);
      config.headers = transformHeaders(config);
      config.data = transform(config.data, config.headers, config.transformRequest);
      config.headers = flattenHeaders(config.headers, config.method);
  }
  function transformURL(config) {
      var url = config.url, params = config.params;
      return buildURL(url, params);
  }
  function transformHeaders(config) {
      var _a = config.headers, headers = _a === void 0 ? {} : _a, data = config.data;
      return processHeaders(headers, data);
  }
  function transformResponseData(res) {
      res.data = transform(res.data, res.headers, res.config.transformResponse);
      return res;
  }
  function throwIfCancellationRequested(conf) {
      if (conf.cancelToken) {
          conf.cancelToken.throwIfRequested();
      }
  }

  var InterceptorManager = /** @class */ (function () {
      function InterceptorManager() {
          this.interceptors = [];
      }
      InterceptorManager.prototype.use = function (resolved, rejected) {
          this.interceptors.push({ resolved: resolved, rejected: rejected });
          return this.interceptors.length - 1;
      };
      InterceptorManager.prototype.eject = function (id) {
          if (this.interceptors[id]) {
              this.interceptors[id] = null;
          }
      };
      InterceptorManager.prototype.forEach = function (fn) {
          this.interceptors.forEach(function (interceptor) {
              if (interceptor !== null) {
                  fn(interceptor);
              }
          });
      };
      return InterceptorManager;
  }());

  var strategy = Object.create(null);
  function defaultStrategy(valX, valY) {
      return typeof valY !== 'undefined' ? valY : valX;
  }
  /*只取val2*/
  function fromVal2Strategy(val1, val2) {
      if (typeof val2 !== 'undefined')
          return val2;
  }
  var strategyKeysFromVal2 = ['url', 'params', 'data'];
  strategyKeysFromVal2.forEach(function (key) {
      strategy[key] = fromVal2Strategy;
  });
  function deepMergeStrat(val1, val2) {
      if (isPlainObject(val2)) {
          return deepMerge(val1, val2);
      }
      else if (typeof val2 !== 'undefined') {
          return val2;
      }
      else if (isPlainObject(val1)) {
          return deepMerge(val1);
      }
      else if (typeof val1 !== 'undefined') {
          return val1;
      }
  }
  var stratKeysDeepMerge = ['headers'];
  stratKeysDeepMerge.forEach(function (key) {
      strategy[key] = deepMergeStrat;
  });
  /*
  * 深度合并请求头信息*/
  function mergeConfig(conf1, conf2) {
      if (!conf2)
          conf2 = {};
      var config = Object.create(null);
      for (var key in conf2) {
          mergeField(key);
      }
      for (var key in conf1) {
          if (!conf2[key])
              mergeField(key);
      }
      function mergeField(key) {
          var strat = strategy[key] || defaultStrategy;
          config[key] = strat(conf1[key], conf2[key]);
      }
      return config;
  }

  var Axios = /** @class */ (function () {
      function Axios(initConf) {
          this.defaults = initConf;
          this.interceptors = {
              request: new InterceptorManager(),
              response: new InterceptorManager()
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
          conf = mergeConfig(this.defaults, conf);
          /*增加链式调用*/
          var chain = [{
                  resolved: dispatchRequest,
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
          return dispatchRequest(conf);
      };
      return Axios;
  }());

  var defaults = {
      method: 'get',
      timeout: 0,
      headers: {
          common: {
              Accept: 'application/json, text/plain, */*'
          }
      },
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      transformRequest: [
          function (data, headers) {
              processHeaders(headers, data);
              return transformRequest(data);
          }
      ],
      transformResponse: [
          function (data) {
              return transformResponse(data);
          }
      ]
  };
  var methodsNoData = ['delete', 'get', 'head', 'options'];
  methodsNoData.forEach(function (method) {
      defaults.headers[method] = {};
  });
  var methodsData = ['post', 'put', 'patch'];
  methodsData.forEach(function (method) {
      defaults.headers[method] = {
          'Content-Type': 'application/x-www-form-urlencoded'
      };
  });

  var Cancel = /** @class */ (function () {
      function Cancel(message) {
          this.message = message;
      }
      return Cancel;
  }());
  function isCancel(value) {
      return value instanceof Cancel;
  }

  var CancelToken = /** @class */ (function () {
      function CancelToken(executor) {
          var _this = this;
          var resolvePromise;
          this.promise = new Promise(function (resolve) {
              resolvePromise = resolve;
          });
          executor(function (message) {
              if (_this.reason)
                  return;
              _this.reason = new Cancel(message);
              resolvePromise(_this.reason);
          });
      }
      CancelToken.prototype.throwIfRequested = function () {
          if (this.reason) {
              throw this.reason;
          }
      };
      CancelToken.source = function () {
          var cancel;
          var token = new CancelToken(function (c) {
              cancel = c;
          });
          return {
              cancel: cancel,
              token: token
          };
      };
      return CancelToken;
  }());

  function createInstance(conf) {
      var context = new Axios(conf);
      var instance = Axios.prototype.request.bind(context);
      extend(instance, context);
      return instance;
  }
  var axios = createInstance(defaults);
  axios.create = function (conf) {
      return createInstance(mergeConfig(defaults, conf));
  };
  axios.CancelToken = CancelToken;
  axios.Cancel = Cancel;
  axios.isCancel = isCancel;

  return axios;

})));
//# sourceMappingURL=f-voied.umd.js.map
