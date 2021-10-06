"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isURLSameOrigin = exports.buildURL = void 0;
var util_1 = require("./util");
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
            if (util_1.isDate(val)) {
                val = val.toISOString();
            }
            else if (util_1.isPlainObject(val)) {
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
exports.buildURL = buildURL;
exports.isURLSameOrigin = function (requestURL) {
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
//# sourceMappingURL=url.js.map